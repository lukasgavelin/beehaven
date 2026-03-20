export type HiveType = 'Langstroth' | 'Dadant' | 'Warré' | 'Nucleus';
export type QueenStatus = 'active' | 'missing' | 'dead' | 'replaced';
export type BroodStatus = 'good' | 'larvae' | 'capped' | 'eggs' | 'missing';
export type HoneyStore = 'full' | 'adequate' | 'low' | 'empty';

export interface Hive {
  id: number;
  name: string;
  type: HiveType;
  colorMark: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Queen {
  id: number;
  hiveId: number;
  breed: string;
  year: number;
  markColor: string;
  status: QueenStatus;
  notes: string;
  createdAt: string;
}

export interface Inspection {
  id: number;
  hiveId: number;
  hiveName?: string;
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
  createdAt: string;
}

export interface Reminder {
  id: number;
  hiveId: number | null;
  hiveName?: string | null;
  title: string;
  notes: string;
  dueAt: string;
  completed: boolean;
  notificationId: string | null;
  createdAt: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  weatherCode: number;
}
