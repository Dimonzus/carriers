'use client';

import { useState } from 'react';
import { Carrier } from '@/lib/notion';
import CarrierCard from '@/components/CarrierCard';

export default function CarrierList({ initialCarriers }: { initialCarriers: Carrier[] }) {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState<string>('Все');
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

    return matchesSearch && matchesTag;
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
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                filterTag === tag
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCarriers.map((carrier) => (
          <CarrierCard
            key={carrier.id}
            carrier={carrier}
            onCopy={copyToClipboard}
            isCopied={copiedId === carrier.id}
          />
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredCarriers.length === 0 && (
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