import { Carrier } from '@/lib/notion';
import TractorCraneIcon from '@/components/icons/TractorCraneIcon';
import TruckIcon from '@/components/icons/TruckIcon';
import BusIcon from '@/components/icons/BusIcon';

interface CarrierCardProps {
  carrier: Carrier;
  onCopy: (phone: string, id: string) => void;
  isCopied: boolean;
}

export default function CarrierCard({ carrier, onCopy, isCopied }: CarrierCardProps) {
  const cleanPhone = (phone: string) => phone.replace(/[\s\-\(\)]/g, '');

  // Определяем тип транспорта для иконки
  const getVehicleType = (): 'manipulator' | 'truck' | 'bus' | 'unknown' => {
    const text = (carrier.description + ' ' + carrier.vehicleType).toLowerCase();
    if (text.includes('манипулятор') || text.includes('манип')) return 'manipulator';
    if (text.includes('тент') || text.includes('будка') || text.includes('фургон')) return 'truck';
    if (text.includes('бус') || text.includes('citroen') || text.includes('jumper') || text.includes('мерс') || text.includes('мерседес')) return 'bus';
    return 'unknown';
  };

  const vehicleType = getVehicleType();

  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'manipulator': return <TractorCraneIcon className="w-16 h-16" />;
      case 'truck': return <TruckIcon className="w-16 h-16" />;
      case 'bus': return <BusIcon className="w-16 h-16" />;
      default: return null;
    }
  };

  const hasVehicleIcon = vehicleType !== 'unknown';

  // Чистим текст vehicleType
  const cleanVehicleType = (text: string): string => {
    return text.replace(/,\s*$/, '').trim();
  };

  // Компонент рейтинга
  const RatingStars = () => {
    if (!carrier.rating) return null;
    const stars = Math.round(carrier.rating);
    return (
      <div className="flex items-center gap-0.5 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= stars ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.293z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
      {/* Шапка карточки */}
      <div className="p-5 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {carrier.name}
            </h3>
            <RatingStars />
          </div>
          
          {/* Теги */}
          <div className="flex gap-1.5 ml-3 flex-wrap justify-end">
            {carrier.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                  tag === 'БЕЗНАЛ'
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Блок с иконкой и характеристиками */}
      {hasVehicleIcon ? (
        <div className="px-5 pb-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
            <div className="flex gap-4 items-center">
              {/* Иконка транспорта */}
              <div className="flex-shrink-0 text-slate-700">
                {getVehicleIcon()}
              </div>
              
              {/* Характеристики */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  {carrier.capacity && (
                    <span className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <span className="text-base">⚖️</span>
                      {carrier.capacity}
                    </span>
                  )}
                  {carrier.volume && (
                    <span className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <span className="text-base"></span>
                      {carrier.volume}
                    </span>
                  )}
                  {/* Тип авто - бейдж после объёма, без иконки */}
                  {carrier.vehicleType && (
                    <span className="inline-flex items-center bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      {cleanVehicleType(carrier.vehicleType)}
                    </span>
                  )}
                </div>
                {carrier.description && (
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {carrier.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Карточки без большой иконки */
        <div className="px-5 pb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {carrier.capacity && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <span className="text-base">⚖️</span>
                {carrier.capacity}
              </span>
            )}
            {carrier.volume && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <span className="text-base">📦</span>
                {carrier.volume}
              </span>
            )}
            {/* Тип авто для карточек без иконки */}
            {carrier.vehicleType && (
              <span className="inline-flex items-center bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                {cleanVehicleType(carrier.vehicleType)}
              </span>
            )}
          </div>
          {carrier.description && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {carrier.description}
            </p>
          )}
        </div>
      )}

      {/* Примечание с ценой */}
      {carrier.notes && (
        <div className="px-5 pb-4">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-r-lg p-3">
            <p className="text-sm text-amber-900 font-medium leading-relaxed">
              <span className="mr-1.5">💰</span>
              {carrier.notes}
            </p>
          </div>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="px-5 pb-5">
        <div className="flex gap-2">
          <a
            href={`tel:${cleanPhone(carrier.phone)}`}
            className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm">{carrier.phone}</span>
          </a>
          
          <button
            onClick={() => onCopy(carrier.phone, carrier.id)}
            className={`flex items-center justify-center px-4 rounded-xl transition-all duration-200 active:scale-95 border-2 ${
              isCopied
                ? 'bg-green-500 border-green-500 text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
            title="Скопировать номер"
          >
            {isCopied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}