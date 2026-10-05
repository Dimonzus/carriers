const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Загружаем переменные окружения
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const getPropertyText = (prop) => {
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
      return prop.multi_select?.map((item) => item.name) || [];
    case 'url':
      return prop.url || '';
    default:
      return '';
  }
};

async function exportCarriers() {
  console.log('📥 Получаем данные из Notion...');
  
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  const carriers = response.results.map((page) => {
    const props = page.properties;

    return {
      id: page.id,
      name: getPropertyText(props['🟩 ФИО']) || 'Не указано',
      phone: getPropertyText(props['🟩 Телефон']) || 'Не указано',
      capacity: getPropertyText(props['🟩 Грузоподъемность']) || '',
      volume: getPropertyText(props['🟩 Объём']) || '',
      description: getPropertyText(props['🟩 Характеристика машины']) || '',
      tags: Array.isArray(getPropertyText(props['🟩 Tags'])) ? getPropertyText(props['🟩 Tags']) : [],
      notes: getPropertyText(props['🟩 Примечания']) || '',
      vehicleType: getPropertyText(props['Тип авто']) || '',
      rating: props['Rating']?.number ?? null,
    };
  });

  // Сохраняем в public/data/carriers.json
  const outputPath = path.resolve(__dirname, '../public/data/carriers.json');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(carriers, null, 2), 'utf-8');
  
  console.log(`✅ Экспортировано ${carriers.length} перевозчиков в ${outputPath}`);
}

exportCarriers().catch(console.error);