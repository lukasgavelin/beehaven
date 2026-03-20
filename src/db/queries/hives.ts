import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { hives } from '../schema';
import { Hive, HiveType } from '../../types';

function now() {
  return new Date().toISOString();
}

function rowToHive(row: typeof hives.$inferSelect): Hive {
  return {
    id: row.id,
    name: row.name,
    type: row.type as HiveType,
    colorMark: row.colorMark,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getAllHives(): Promise<Hive[]> {
  const rows = await db.select().from(hives).orderBy(desc(hives.createdAt));
  return rows.map(rowToHive);
}

export async function insertHive(data: {
  name: string;
  type: HiveType;
  colorMark: string;
  notes: string;
}): Promise<Hive> {
  const ts = now();
  const result = await db
    .insert(hives)
    .values({ ...data, createdAt: ts, updatedAt: ts })
    .returning();
  return rowToHive(result[0]);
}

export async function updateHive(
  id: number,
  data: { name: string; type: HiveType; colorMark: string; notes: string },
): Promise<void> {
  await db
    .update(hives)
    .set({ ...data, updatedAt: now() })
    .where(eq(hives.id, id));
}

export async function deleteHive(id: number): Promise<void> {
  await db.delete(hives).where(eq(hives.id, id));
}
