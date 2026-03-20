import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './migrations/migrations';

const expo = openDatabaseSync('beehaven.db', { enableChangeListener: true });

export const db = drizzle(expo);

export { migrations };
export { useMigrations };
