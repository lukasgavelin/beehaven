import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { inspections, hives } from '../schema';
import { Inspection, BroodStatus, HoneyStore } from '../../types';

function now() {
  return new Date().toISOString();
}

function rowToInspection(
  row: typeof inspections.$inferSelect & { hiveName?: string | null },
): Inspection {
  return {
    id: row.id,
    hiveId: row.hiveId,
    hiveName: row.hiveName ?? undefined,
    inspectedAt: row.inspectedAt,
    notes: row.notes,
    queenSeen: row.queenSeen === 1,
    broodStatus: row.broodStatus as BroodStatus,
    honeyStores: row.honeyStores as HoneyStore,
    temper: row.temper,
    varroaCount: row.varroaCount,
    weatherTemp: row.weatherTemp ?? null,
    weatherCondition: row.weatherCondition ?? null,
    weatherHumidity: row.weatherHumidity ?? null,
    createdAt: row.createdAt,
  };
}

export async function getInspectionsByHive(hiveId: number): Promise<Inspection[]> {
  const rows = await db
    .select()
    .from(inspections)
    .where(eq(inspections.hiveId, hiveId))
    .orderBy(desc(inspections.inspectedAt));
  return rows.map(rowToInspection);
}

export async function getAllInspections(): Promise<Inspection[]> {
  const rows = await db
    .select({
      id: inspections.id,
      hiveId: inspections.hiveId,
      hiveName: hives.name,
      inspectedAt: inspections.inspectedAt,
      notes: inspections.notes,
      queenSeen: inspections.queenSeen,
      broodStatus: inspections.broodStatus,
      honeyStores: inspections.honeyStores,
      temper: inspections.temper,
      varroaCount: inspections.varroaCount,
      weatherTemp: inspections.weatherTemp,
      weatherCondition: inspections.weatherCondition,
      weatherHumidity: inspections.weatherHumidity,
      createdAt: inspections.createdAt,
    })
    .from(inspections)
    .leftJoin(hives, eq(inspections.hiveId, hives.id))
    .orderBy(desc(inspections.inspectedAt));
  return rows.map((r) => rowToInspection({ ...r, hiveName: r.hiveName ?? undefined }));
}

export async function insertInspection(data: {
  hiveId: number;
  inspectedAt: string;
  notes: string;
  queenSeen: boolean;
  broodStatus: BroodStatus;
  honeyStores: HoneyStore;
  temper: number;
  varroaCount: number;
  weatherTemp: number | null;
  weatherCondition: string | null;
  weatherHumidity: number | null;
}): Promise<Inspection> {
  const result = await db
    .insert(inspections)
    .values({
      ...data,
      queenSeen: data.queenSeen ? 1 : 0,
      weatherTemp: data.weatherTemp ?? undefined,
      weatherCondition: data.weatherCondition ?? undefined,
      weatherHumidity: data.weatherHumidity ?? undefined,
      createdAt: now(),
    })
    .returning();
  return rowToInspection(result[0]);
}

export async function deleteInspection(id: number): Promise<void> {
  await db.delete(inspections).where(eq(inspections.id, id));
}
