import { getCarriers } from '@/lib/notion';
import CarrierList from '@/components/CarrierList';

export default async function Home() {
  const carriers = await getCarriers();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚚 Перевозчики Гродно</h1>
          <p className="text-gray-600">Быстрый поиск надежных перевозчиков. Нажмите на номер, чтобы позвонить или скопировать его.</p>
        </header>
        
        {/* Передаем данные в клиентский компонент для фильтрации без перезагрузки */}
        <CarrierList initialCarriers={carriers} />
      </div>
    </main>
  );
}