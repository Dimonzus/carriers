import { Client } from '@notionhq/client';

// 1. Проверка наличия переменных окружения
if (!process.env.NOTION_API_KEY) {
  throw new Error('Отсутствует NOTION_API_KEY в файле .env.local');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('Отсутствует NOTION_DATABASE_ID в файле .env.local');
}

// 2. Инициализация клиента
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// 3. Описание типа данных (добавлены новые поля vehicleType и rating)
export interface Carrier {
  id: string;
  name: string;
  phone: string;
  capacity: string;
  volume: string;
  description: string;
  tags: string[];
  notes: string;
  vehicleType: string; // Новая колонка "Тип авто"
  rating: number | null; // Новая колонка "Rating"
}

// 4. Универсальная функция для безопасного извлечения текста из любого типа колонки Notion
const getPropertyText = (prop: any): string | string[] => {
  if (!prop || !prop.type) return '';
  
  switch (prop.type) {
    case 'title':
    case 'rich_text':
      return prop[prop.type]?.[0]?.plain_text || '';
    case 'phone_number':
      return prop.phone_number || '';
    case 'number':
      return prop.number?.toString() || '';
    case 'select':
      return prop.select?.name || '';
    case 'multi_select':
      return prop.multi_select?.map((item: any) => item.name) || [];
    case 'url':
      return prop.url || '';
    default:
      return '';
  }
};

// 5. Основная функция получения данных с ТОЧНЫМИ названиями колонок из вашего лога
export async function getCarriers(): Promise<Carrier[]> {
  const response = await notion.databases.query({
    database_id: databaseId!,
  });

  return response.results.map((page: any) => {
    const props = page.properties;

    // Извлекаем данные, используя точные ключи из вашего лога
    const nameRaw = getPropertyText(props['🟩 ФИО']);
    const phoneRaw = getPropertyText(props['🟩 Телефон']);
    const capacityRaw = getPropertyText(props['🟩 Грузоподъемность']);
    const volumeRaw = getPropertyText(props['🟩 Объём']);
    const descRaw = getPropertyText(props['🟩 Характеристика машины']);
    const tagsRaw = getPropertyText(props['🟩 Tags']);
    const notesRaw = getPropertyText(props['🟩 Примечания']);
    const vehicleTypeRaw = getPropertyText(props['Тип авто']);
    
    // Rating имеет тип number, берем его напрямую
    const ratingRaw = props['Rating']?.number ?? null;

    return {
      id: page.id,
      name: typeof nameRaw === 'string' && nameRaw ? nameRaw : 'Не указано',
      phone: typeof phoneRaw === 'string' && phoneRaw ? phoneRaw : 'Не указано',
      capacity: typeof capacityRaw === 'string' ? capacityRaw : '',
      volume: typeof volumeRaw === 'string' ? volumeRaw : '',
      description: typeof descRaw === 'string' ? descRaw : '',
      tags: Array.isArray(tagsRaw) ? tagsRaw : [],
      notes: typeof notesRaw === 'string' ? notesRaw : '',
      vehicleType: typeof vehicleTypeRaw === 'string' ? vehicleTypeRaw : '',
      rating: ratingRaw,
    };
  });
}