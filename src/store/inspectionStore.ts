import { create } from 'zustand';
import { Inspection, BroodStatus, HoneyStore } from '../types';
import {
  getAllInspections,
  getInspectionsByHive,
  insertInspection,
  deleteInspection,
} from '../db/queries/inspections';

interface InspectionStore {
  inspections: Inspection[];
  hiveInspections: Record<number, Inspection[]>;
  loading: boolean;

  loadAllInspections: () => Promise<void>;
  loadInspectionsForHive: (hiveId: number) => Promise<void>;
  addInspection: (data: {
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
  }) => Promise<Inspection>;
  removeInspection: (id: number, hiveId: number) => Promise<void>;
}

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  inspections: [],
  hiveInspections: {},
  loading: false,

  loadAllInspections: async () => {
    set({ loading: true });
    const inspections = await getAllInspections();
    set({ inspections, loading: false });
  },

  loadInspectionsForHive: async (hiveId) => {
    const items = await getInspectionsByHive(hiveId);
    set((s) => ({ hiveInspections: { ...s.hiveInspections, [hiveId]: items } }));
  },

  addInspection: async (data) => {
    const inspection = await insertInspection(data);
    set((s) => ({
      inspections: [inspection, ...s.inspections],
      hiveInspections: {
        ...s.hiveInspections,
        [data.hiveId]: [inspection, ...(s.hiveInspections[data.hiveId] ?? [])],
      },
    }));
    return inspection;
  },

  removeInspection: async (id, hiveId) => {
    await deleteInspection(id);
    set((s) => ({
      inspections: s.inspections.filter((i) => i.id !== id),
      hiveInspections: {
        ...s.hiveInspections,
        [hiveId]: (s.hiveInspections[hiveId] ?? []).filter((i) => i.id !== id),
      },
    }));
  },
}));
