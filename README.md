# Перевозчики Гродно

Каталог перевозчиков на Next.js (App Router). Данные хранятся в Notion и экспортируются в JSON; сайт отдаёт статическую страницу с клиентским поиском и фильтрами.

## Возможности

- Список карточек перевозчиков: рейтинг, телефон, грузоподъёмность, объём, тип авто, теги (нал/безнал, манипулятор)
- Живой поиск по имени, телефону и описанию
- Быстрые фильтры: «Все», «ТОЛЬКО НАЛ», «БЕЗНАЛ», «Манипулятор»
- Звонок (`tel:`) и копирование номера в один клик

## Стек

- Next.js 16 (App Router) + React 19
- TypeScript, Tailwind CSS 4
- Notion API (только для выгрузки данных, не на рантайме)

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Обновление данных из Notion

1. Создайте файл `.env` в корне проекта:

   ```env
   NOTION_API_KEY=secret_...
   NOTION_DATABASE_ID=...
   ```

   Нужен интеграционный ключ Notion и ID базы с перевозчиками (share → copy link, ID — часть URL).

2. Выгрузите данные:

   ```bash
   npm run export:data
   ```

   Скрипт обходит все страницы базы (с пагинацией), сортирует по рейтингу и пишет `public/data/carriers.json`. После этого перезапустите/пересоберите сайт, чтобы изменения попали в страницу.

## Структура

```
app/                 # страница и layout
components/          # CarrierList, CarrierCard, иконки
lib/types.ts         # общий тип Carrier
lib/notion.ts        # чтение carriers.json для SSR
public/data/         # carriers.json (снимок из Notion)
scripts/export-notion.js
```

## Полезные команды

| Команда | Описание |
|---|---|
| `npm run dev` | дев-сервер |
| `npm run build` | продакшен-сборка |
| `npm run start` | запуск собранного приложения |
| `npm run lint` | ESLint |
| `npm run export:data` | экспорт из Notion → JSON |
