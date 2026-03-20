import { eq, asc } from 'drizzle-orm';
import { db } from '../index';
import { reminders, hives } from '../schema';
import { Reminder } from '../../types';

function now() {
  return new Date().toISOString();
}

function rowToReminder(
  row: typeof reminders.$inferSelect & { hiveName?: string | null },
): Reminder {
  return {
    id: row.id,
    hiveId: row.hiveId ?? null,
    hiveName: row.hiveName ?? null,
    title: row.title,
    notes: row.notes,
    dueAt: row.dueAt,
    completed: row.completed === 1,
    notificationId: row.notificationId ?? null,
    createdAt: row.createdAt,
  };
}

export async function getAllReminders(): Promise<Reminder[]> {
  const rows = await db
    .select({
      id: reminders.id,
      hiveId: reminders.hiveId,
      hiveName: hives.name,
      title: reminders.title,
      notes: reminders.notes,
      dueAt: reminders.dueAt,
      completed: reminders.completed,
      notificationId: reminders.notificationId,
      createdAt: reminders.createdAt,
    })
    .from(reminders)
    .leftJoin(hives, eq(reminders.hiveId, hives.id))
    .orderBy(asc(reminders.dueAt));
  return rows.map((r) => rowToReminder({ ...r, hiveName: r.hiveName ?? null }));
}

export async function insertReminder(data: {
  hiveId: number | null;
  title: string;
  notes: string;
  dueAt: string;
  notificationId: string | null;
}): Promise<Reminder> {
  const result = await db
    .insert(reminders)
    .values({
      ...data,
      hiveId: data.hiveId ?? undefined,
      notificationId: data.notificationId ?? undefined,
      completed: 0,
      createdAt: now(),
    })
    .returning();
  return rowToReminder(result[0]);
}

export async function toggleReminderComplete(
  id: number,
  completed: boolean,
): Promise<void> {
  await db
    .update(reminders)
    .set({ completed: completed ? 1 : 0 })
    .where(eq(reminders.id, id));
}

export async function deleteReminder(id: number): Promise<void> {
  await db.delete(reminders).where(eq(reminders.id, id));
}
