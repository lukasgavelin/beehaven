import { int, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const hives = sqliteTable('hives', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull().default('Langstroth'),
  colorMark: text('color_mark').notNull().default(''),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const queens = sqliteTable('queens', {
  id: int('id').primaryKey({ autoIncrement: true }),
  hiveId: int('hive_id').notNull().references(() => hives.id, { onDelete: 'cascade' }),
  breed: text('breed').notNull().default(''),
  year: int('year').notNull().default(0),
  markColor: text('mark_color').notNull().default(''),
  status: text('status').notNull().default('active'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
});

export const inspections = sqliteTable('inspections', {
  id: int('id').primaryKey({ autoIncrement: true }),
  hiveId: int('hive_id').notNull().references(() => hives.id, { onDelete: 'cascade' }),
  inspectedAt: text('inspected_at').notNull(),
  notes: text('notes').notNull().default(''),
  queenSeen: int('queen_seen').notNull().default(0),
  broodStatus: text('brood_status').notNull().default('good'),
  honeyStores: text('honey_stores').notNull().default('adequate'),
  temper: int('temper').notNull().default(3),
  varroaCount: int('varroa_count').notNull().default(0),
  weatherTemp: real('weather_temp'),
  weatherCondition: text('weather_condition'),
  weatherHumidity: real('weather_humidity'),
  createdAt: text('created_at').notNull(),
});

export const reminders = sqliteTable('reminders', {
  id: int('id').primaryKey({ autoIncrement: true }),
  hiveId: int('hive_id').references(() => hives.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  notes: text('notes').notNull().default(''),
  dueAt: text('due_at').notNull(),
  completed: int('completed').notNull().default(0),
  notificationId: text('notification_id'),
  createdAt: text('created_at').notNull(),
});
