import { create } from 'zustand';
import { Reminder } from '../types';
import {
  getAllReminders,
  insertReminder,
  toggleReminderComplete,
  deleteReminder,
} from '../db/queries/reminders';

interface ReminderStore {
  reminders: Reminder[];
  loading: boolean;

  loadReminders: () => Promise<void>;
  addReminder: (data: {
    hiveId: number | null;
    title: string;
    notes: string;
    dueAt: string;
    notificationId: string | null;
  }) => Promise<Reminder>;
  toggleComplete: (id: number, completed: boolean) => Promise<void>;
  removeReminder: (id: number) => Promise<void>;
}

export const useReminderStore = create<ReminderStore>((set) => ({
  reminders: [],
  loading: false,

  loadReminders: async () => {
    set({ loading: true });
    const reminders = await getAllReminders();
    set({ reminders, loading: false });
  },

  addReminder: async (data) => {
    const reminder = await insertReminder(data);
    set((s) => ({ reminders: [...s.reminders, reminder].sort((a, b) => a.dueAt.localeCompare(b.dueAt)) }));
    return reminder;
  },

  toggleComplete: async (id, completed) => {
    await toggleReminderComplete(id, completed);
    set((s) => ({
      reminders: s.reminders.map((r) => (r.id === id ? { ...r, completed } : r)),
    }));
  },

  removeReminder: async (id) => {
    await deleteReminder(id);
    set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) }));
  },
}));
