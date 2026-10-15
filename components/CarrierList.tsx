'use client';

import { useState } from 'react';
import type { Carrier } from '@/lib/types';
import CarrierCard from '@/components/CarrierCard';

/** Приблизительная цена за город из notes: берём минимальное «городское» число 10–500 */
function extractCityPrice(notes: string): number | null {
  if (!notes) return null;
  const text = notes.toLowerCase();
  const prices = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:р\b|руб)/g)]
    .map((m) => parseFloat(m[1].replace(',', '.')))
    .filter((n) => n >= 10 && n <= 500);
  if (prices.length > 0) return Math.min(...prices);
  const bare = [...text.matchAll(/\b(\d{2,3})\b/g)]
    .map((m) => parseInt(m[1], 10))
    .filter((n) => n >= 10 && n <= 500);
  return bare.length > 0 ? Math.min(...bare) : null;
}

type SortMode = 'rating' | 'price_asc' | 'price_desc';
type CapacityFilter = 'all' | 'light' | 'mid' | 'heavy';

/** Все тоннажи из capacity: «4т», «1,5-2 тонны», «2 т; 4 т; 8 т» */
function extractCapacities(capacity: string): number[] {
  if (!capacity) return [];
  let text = capacity.toLowerCase().replace(/(\d),(\d)/g, '$1.$2');
  text = text.replace(/\([^)]*\)/g, ' ');
  const nums = [...text.matchAll(/\d+(?:\.\d+)?/g)].map((m) => parseFloat(m[0]));
  return nums.filter((n) => n >= 0.5 && n <= 30);
}

const capacityFilters: { key: CapacityFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'light', label: 'до 2 т' },
  { key: 'mid', label: '2–4 т' },
  { key: 'heavy', label: 'от 4 т' },
];

function matchesCapacity(nums: number[], filter: CapacityFilter): boolean {
  if (filter === 'all') return true;
  if (nums.length === 0) return false;
  return nums.some((n) => {
    if (filter === 'light') return n <= 2;
    if (filter === 'mid') return n > 2 && n <= 4;
    return n > 4;
  });
}

export default function CarrierList({ initialCarriers }: { initialCarriers: Carrier[] }) {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState<string>('Все');
  const [sortMode, setSortMode] = useState<SortMode>('rating');
  const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tags = ['Все', 'ТОЛЬКО НАЛ', 'БЕЗНАЛ', 'Манипулятор'];

  const filteredCarriers = initialCarriers.filter((carrier) => {
    const matchesSearch = 
      carrier.name.toLowerCase().includes(search.toLowerCase()) ||
      carrier.phone.includes(search) ||
      carrier.description.toLowerCase().includes(search.toLowerCase());
    
    let matchesTag = true;
    
    if (filterTag !== 'Все') {
      if (filterTag === 'ТОЛЬКО НАЛ') {
        const hasNal = carrier.tags.some(tag => tag.trim() === 'НАЛ');
        const hasBeznal = carrier.tags.some(tag => tag.trim() === 'БЕЗНАЛ');
        matchesTag = hasNal && !hasBeznal;
      } else if (filterTag === 'БЕЗНАЛ') {
        matchesTag = carrier.tags.some(tag => tag.trim() === 'БЕЗНАЛ');
      } else if (filterTag === 'Манипулятор') {
        const hasManipulatorInTags = carrier.tags.some(tag => 
          tag.toLowerCase().includes('манипулятор') || tag.toLowerCase().includes('манип')
        );
        const hasManipulatorInDesc = carrier.description.toLowerCase().includes('манипулятор') || 
                                     carrier.description.toLowerCase().includes('манип');
        matchesTag = hasManipulatorInTags || hasManipulatorInDesc;
      }
    }

    return matchesSearch && matchesTag && matchesCapacity(extractCapacities(carrier.capacity), capacityFilter);
  });

  const sortedCarriers = [...filteredCarriers].sort((a, b) => {
    if (sortMode === 'rating') {
      const ra = a.rating ?? -1;
      const rb = b.rating ?? -1;
      return rb - ra;
    }
    const pa = extractCityPrice(a.notes);
    const pb = extractCityPrice(b.notes);
    if (pa === null && pb === null) return 0;
    if (pa === null) return 1;
    if (pb === null) return -1;
    return sortMode === 'price_asc' ? pa - pb : pb - pa;
  });

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Не удалось скопировать:', err);
    }
  };

  return (
    <div>
      {/* Поиск и фильтры */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Поиск по имени, телефону или машине..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center overflow-x-auto pb-1 -mx-1 px-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm rounded-full font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                filterTag === tag
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md sm:scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 bg-white border-2 border-gray-200 rounded-full p-1 overflow-x-auto max-w-full">
            <span className="px-1.5 sm:px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0"></span>
            {capacityFilters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCapacityFilter(key)}
                className={`shrink-0 whitespace-nowrap px-2.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  capacityFilter === key
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white border-2 border-gray-200 rounded-full p-1 overflow-x-auto max-w-full">
            <span className="px-1.5 sm:px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">Сорт.</span>
            {([
              { key: 'rating', label: 'Рейтинг' },
              { key: 'price_asc', label: 'Дешевле ↑' },
              { key: 'price_desc', label: 'Дороже ↓' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortMode(key)}
                className={`shrink-0 whitespace-nowrap px-2.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  sortMode === key
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCarriers.map((carrier) => (
          <CarrierCard
            key={carrier.id}
            carrier={carrier}
            onCopy={copyToClipboard}
            isCopied={copiedId === carrier.id}
          />
        ))}
      </div>

      {/* Пустое состояние */}
      {sortedCarriers.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Ничего не найдено</h3>
          <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      )}
    </div>
  );
}