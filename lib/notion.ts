import fs from 'fs/promises';
import path from 'path';
import type { Carrier } from '@/lib/types';

export type { Carrier };

export async function getCarriers(): Promise<Carrier[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'carriers.json');

  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const carriers: Carrier[] = JSON.parse(fileContents);

    carriers.sort((a, b) => {
      if (a.rating === null && b.rating === null) {
        return a.name.localeCompare(b.name, 'ru');
      }
      if (a.rating === null) return 1;
      if (b.rating === null) return -1;
      return b.rating - a.rating;
    });

    return carriers;
  } catch (error) {
    console.error('Ошибка чтения carriers.json:', error);
    return [];
  }
}
