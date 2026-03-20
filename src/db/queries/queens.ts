import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { queens, hives } from '../schema';
import { Queen, QueenStatus } from '../../types';

function now() {
  return new Date().toISOString();
}

function rowToQueen(row: typeof queens.$inferSelect): Queen {
  return {
    id: row.id,
    hiveId: row.hiveId,
    breed: row.breed,
    year: row.year,
    markColor: row.markColor,
    status: row.status as QueenStatus,
    notes: row.notes,
    createdAt: row.createdAt,
  };
}

export async function getQueenByHive(hiveId: number): Promise<Queen | null> {
  const rows = await db.select().from(queens).where(eq(queens.hiveId, hiveId)).limit(1);
  return rows.length > 0 ? rowToQueen(rows[0]) : null;
}

export async function upsertQueen(data: {
  hiveId: number;
  breed: string;
  year: number;
  markColor: string;
  status: QueenStatus;
  notes: string;
}): Promise<Queen> {
  const existing = await getQueenByHive(data.hiveId);
  if (existing) {
    await db
      .update(queens)
      .set({ breed: data.breed, year: data.year, markColor: data.markColor, status: data.status, notes: data.notes })
      .where(eq(queens.id, existing.id));
    return { ...existing, ...data };
  }
  const result = await db
    .insert(queens)
    .values({ ...data, createdAt: now() })
    .returning();
  return rowToQueen(result[0]);
}

export async function deleteQueenByHive(hiveId: number): Promise<void> {
  await db.delete(queens).where(eq(queens.hiveId, hiveId));
}
