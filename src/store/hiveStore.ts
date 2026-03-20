import { create } from 'zustand';
import { Hive, Queen, HiveType, QueenStatus } from '../types';
import { getAllHives, insertHive, updateHive, deleteHive } from '../db/queries/hives';
import { getQueenByHive, upsertQueen } from '../db/queries/queens';

interface HiveStore {
  hives: Hive[];
  queens: Record<number, Queen | null>;
  loading: boolean;

  loadHives: () => Promise<void>;
  addHive: (data: { name: string; type: HiveType; colorMark: string; notes: string }) => Promise<Hive>;
  editHive: (id: number, data: { name: string; type: HiveType; colorMark: string; notes: string }) => Promise<void>;
  removeHive: (id: number) => Promise<void>;

  loadQueenForHive: (hiveId: number) => Promise<void>;
  saveQueen: (data: {
    hiveId: number;
    breed: string;
    year: number;
    markColor: string;
    status: QueenStatus;
    notes: string;
  }) => Promise<void>;
}

export const useHiveStore = create<HiveStore>((set, get) => ({
  hives: [],
  queens: {},
  loading: false,

  loadHives: async () => {
    set({ loading: true });
    const hives = await getAllHives();
    set({ hives, loading: false });
  },

  addHive: async (data) => {
    const hive = await insertHive(data);
    set((s) => ({ hives: [hive, ...s.hives] }));
    return hive;
  },

  editHive: async (id, data) => {
    await updateHive(id, data);
    set((s) => ({
      hives: s.hives.map((h) =>
        h.id === id ? { ...h, ...data, updatedAt: new Date().toISOString() } : h,
      ),
    }));
  },

  removeHive: async (id) => {
    await deleteHive(id);
    set((s) => ({
      hives: s.hives.filter((h) => h.id !== id),
      queens: Object.fromEntries(
        Object.entries(s.queens).filter(([k]) => Number(k) !== id),
      ),
    }));
  },

  loadQueenForHive: async (hiveId) => {
    const queen = await getQueenByHive(hiveId);
    set((s) => ({ queens: { ...s.queens, [hiveId]: queen } }));
  },

  saveQueen: async (data) => {
    const queen = await upsertQueen(data);
    set((s) => ({ queens: { ...s.queens, [data.hiveId]: queen } }));
  },
}));
