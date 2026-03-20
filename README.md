# 🐝 Beehaven

A beekeeping management app built with Expo and React Native. Beehaven helps beekeepers track hives, log inspections, monitor queen health, schedule reminders, and capture real-time weather conditions — all stored locally on-device with no account required.

---

## Features

- **Hive Management** — Create and manage hives with type, color mark identification, and notes
- **Queen Tracking** — Record queen breed, year, mark color, and status (active, missing, dead, replaced)
- **Inspection Logging** — Log detailed inspections including:
  - Queen sighting
  - Brood status (good, larvae, capped, eggs, missing)
  - Honey store levels (full, adequate, low, empty)
  - Colony temperament (1–5 scale)
  - Varroa mite count
  - Auto-fetched weather (temperature, condition, humidity)
- **Reminders** — Schedule hive tasks with local push notifications
- **Weather Integration** — Automatically fetches weather via GPS at inspection time using the Open-Meteo API
- **Offline-first** — All data stored locally via SQLite with no backend or login required

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | Expo SDK 52, React Native 0.76, React 18 |
| Language | TypeScript |
| Navigation | React Navigation v7 (Bottom Tabs + Native Stack) |
| Database | expo-sqlite + Drizzle ORM |
| State | Zustand |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Icons | Lucide React Native |
| Fonts | Inter (via @expo-google-fonts) |
| Weather | Open-Meteo (free, no API key) |
| Notifications | expo-notifications |
| Location | expo-location |

---

## Screens

### Hives
- **Hive List** — All hives with color indicator, type, queen status, and last inspection date
- **Hive Detail** — Full hive view with queen info, inspection history, and quick actions
- **Hive Form** — Create or edit a hive (name, type, color mark, notes)
- **Queen Form** — Add or update queen details for a hive

### Inspections
- **Inspections List** — All inspections grouped by month
- **Inspection Detail** — Full inspection record including weather chip and all metrics
- **Inspection Form** — Log a new inspection with weather auto-fill

### Reminders
- **Reminders List** — Pending and completed reminders, sortable and deletable
- **Reminder Form** — Create a reminder with date/time picker and optional hive association

---

## Project Structure

```
beehaven/
├── App.tsx                  # Root component, font loading, DB migration
├── index.ts                 # Expo entry point
├── global.css               # Tailwind/NativeWind base styles
├── metro.config.js          # Metro bundler config with NativeWind
├── tailwind.config.js       # Tailwind theme (custom colors, fonts)
└── src/
    ├── components/
    │   ├── common/          # Badge, Button, Card, TextInput, EmptyState
    │   └── feature/         # HiveCard, InspectionRow, WeatherChip, ReminderItem
    ├── db/
    │   ├── index.ts         # Drizzle DB instance
    │   ├── schema.ts        # Table definitions (hives, queens, inspections, reminders)
    │   ├── migrations/      # SQL migrations + Drizzle journal
    │   └── queries/         # Per-table query helpers
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   └── types.ts
    ├── screens/
    │   ├── hives/
    │   ├── inspections/
    │   └── reminders/
    ├── services/
    │   ├── locationService.ts
    │   ├── weatherService.ts
    │   └── notificationService.ts
    ├── store/               # Zustand stores (hiveStore, inspectionStore, reminderStore)
    ├── theme/               # Colors, spacing, typography constants
    └── types/               # Shared TypeScript interfaces and union types
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) installed on your Android or iOS device

### Install & Run

```bash
# Clone the repo
git clone https://github.com/lukasgavelin/beehaven.git
cd beehaven

# Install dependencies
npm install

# Start the development server
npm start
```

Scan the QR code with **Expo Go** on Android, or the **Camera app** on iOS.

### Platform-specific

```bash
npm run android   # Open directly on Android emulator/device
npm run ios       # Open on iOS simulator (macOS only)
npm run web       # Open in browser
```

---

## Database

Beehaven uses **SQLite** via `expo-sqlite` and manages the schema with **Drizzle ORM**. Migrations run automatically on app launch.

Tables: `hives`, `queens`, `inspections`, `reminders`

To update the schema, edit `src/db/schema.ts` and run:

```bash
npx drizzle-kit generate
```

Then update `src/db/migrations/migrations.js` accordingly.

---

## Permissions

The app requests the following permissions at runtime:

| Permission | Purpose |
|---|---|
| `ACCESS_FINE_LOCATION` | Fetch GPS coordinates for weather lookup |
| `POST_NOTIFICATIONS` | Schedule local reminder notifications |
| `SCHEDULE_EXACT_ALARM` | Fire reminders at exact times (Android 12+) |

---

## License

MIT
