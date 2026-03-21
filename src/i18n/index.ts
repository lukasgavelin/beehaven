import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { BroodStatus, HiveType, HoneyStore, QueenStatus } from '../types';

export type SupportedLocale =
  | 'en'
  | 'de'
  | 'fr'
  | 'es'
  | 'sv';

export type LocalePreference = SupportedLocale | 'system';

export interface LanguageOption {
  code: SupportedLocale;
  label: string;
  nativeLabel: string;
  flag: string;
}

type TranslationParams = Record<string, string | number>;

const LOCALE_PREFERENCE_KEY = 'beehaven.localePreference';

const enTranslations = {
  'app.dbError': 'Database error: {error}',
  'common.add': 'Add',
  'common.cancel': 'Cancel',
  'common.createHive': 'Create Hive',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.error': 'Error',
  'common.no': 'No',
  'common.none': 'None',
  'common.refresh': 'Refresh',
  'common.saveChanges': 'Save Changes',
  'common.saveInspection': 'Save Inspection',
  'common.saveQueen': 'Save Queen',
  'common.saveReminder': 'Save Reminder',
  'common.system': 'System',
  'common.yes': 'Yes',
  'empty.noHivesSubtitle': 'Tap + to register your first hive',
  'empty.noHivesTitle': 'No hives yet',
  'empty.noInspectionsSubtitle': 'Open a hive and add your first inspection',
  'empty.noInspectionsTitle': 'No inspections yet',
  'empty.noRemindersSubtitle': 'Tap + to schedule a hive reminder',
  'empty.noRemindersTitle': 'No reminders',
  'hiveDetail.deleteButton': 'Delete Hive',
  'hiveDetail.deleteMessage': 'This will permanently delete "{name}" and all its inspections. This cannot be undone.',
  'hiveDetail.deleteTitle': 'Delete Hive',
  'hiveDetail.inspectionsSection': 'Inspections',
  'hiveDetail.noInspections': 'No inspections recorded',
  'hiveDetail.noQueen': 'No queen recorded',
  'hiveDetail.queenSection': 'Queen',
  'hiveDetail.unknownBreed': 'Unknown breed',
  'hiveForm.nameLabel': 'Name',
  'hiveForm.namePlaceholder': 'e.g. Garden Hive A',
  'hiveForm.nameRequiredMessage': 'Please enter a name for the hive.',
  'hiveForm.nameRequiredTitle': 'Name required',
  'hiveForm.notesLabel': 'Notes',
  'hiveForm.notesPlaceholder': 'Optional notes about this hive',
  'hiveForm.queenMarkColourLabel': 'Queen mark colour',
  'hiveForm.typeLabel': 'Type',
  'hiveType.Dadant': 'Dadant',
  'hiveType.Langstroth': 'Langstroth',
  'hiveType.Nucleus': 'Nucleus',
  'hiveType.Warré': 'Warré',
  'inspection.detail.broodBadge': 'Brood: {status}',
  'inspection.detail.deleteMessage': 'This inspection will be permanently deleted.',
  'inspection.detail.deleteTitle': 'Delete Inspection',
  'inspection.detail.honeyBadge': 'Honey: {level}',
  'inspection.detail.notesLabel': 'Notes',
  'inspection.detail.queenNotSeen': 'Queen not seen',
  'inspection.detail.queenSeen': 'Queen seen',
  'inspection.detail.temperLabel': 'Temper',
  'inspection.detail.varroaCountLabel': 'Varroa count',
  'inspection.detail.weatherLabel': 'Weather at inspection',
  'inspection.form.broodStatusLabel': 'Brood status',
  'inspection.form.dateLabel': 'Date',
  'inspection.form.fetchCurrentWeather': 'Fetch current weather',
  'inspection.form.fetchWeatherErrorMessage': 'Could not fetch weather. Check your internet connection.',
  'inspection.form.fetchWeatherErrorTitle': 'Error',
  'inspection.form.honeyStoresLabel': 'Honey stores',
  'inspection.form.locationUnavailableMessage': 'Please enable location access in device settings.',
  'inspection.form.locationUnavailableTitle': 'Location unavailable',
  'inspection.form.notesLabel': 'Notes',
  'inspection.form.notesPlaceholder': 'Observations, concerns, actions taken...',
  'inspection.form.queenSeenLabel': 'Queen seen',
  'inspection.form.temperLabel': 'Temper',
  'inspection.form.varroaCountLabel': 'Varroa count',
  'inspection.form.weatherLabel': 'Weather',
  'inspection.row.broodSuffix': 'brood',
  'inspection.row.honeySuffix': 'honey',
  'language.buttonLabel': 'Change language',
  'language.menuTitle': 'Language',
  'language.systemDescription': 'Follow your device language',
  'options.aboutSection': 'About',
  'options.appDescription': 'An offline-first beekeeping app for hives, inspections, reminders, and queen tracking.',
  'options.appName': 'Beehaven',
  'options.appIdLabel': 'App ID',
  'options.frameworkLabel': 'Stack',
  'options.frameworkValue': 'Expo SDK 52, React Native 0.76',
  'options.languagesLabel': 'Languages',
  'options.languagesSection': 'Languages',
  'options.notificationsLabel': 'Notifications',
  'options.notificationsValue': 'Local reminders',
  'options.privacyLabel': 'Privacy',
  'options.privacyValue': 'Offline-first, no account required',
  'options.storageLabel': 'Storage',
  'options.storageValue': 'On-device SQLite',
  'options.versionLabel': 'Version',
  'options.weatherSourceLabel': 'Weather',
  'options.weatherSourceValue': 'Open-Meteo + device location',
  'markColor.blue': 'Blue',
  'markColor.green': 'Green',
  'markColor.red': 'Red',
  'markColor.white': 'White',
  'markColor.yellow': 'Yellow',
  'nav.hive': 'Hive',
  'nav.hives': 'Hives',
  'nav.inspection': 'Inspection',
  'nav.inspections': 'Inspections',
  'nav.options': 'Options',
  'nav.queen': 'Queen',
  'nav.reminder': 'Reminder',
  'nav.reminders': 'Reminders',
  'notification.channelName': 'Reminders',
  'notification.defaultBody': 'Time to check your hive!',
  'queenForm.breedLabel': 'Breed',
  'queenForm.breedPlaceholder': 'e.g. Carniolan',
  'queenForm.invalidYearMessage': 'Please enter a valid year for the queen.',
  'queenForm.invalidYearTitle': 'Invalid year',
  'queenForm.markColourLabel': 'IBRA Mark Colour',
  'queenForm.notesLabel': 'Notes',
  'queenForm.notesPlaceholder': 'Optional notes',
  'queenForm.statusLabel': 'Status',
  'queenForm.yearLabel': 'Year',
  'queenStatus.active': 'Active',
  'queenStatus.dead': 'Dead',
  'queenStatus.missing': 'Missing',
  'queenStatus.replaced': 'Replaced',
  'reminder.form.dueDateLabel': 'Due date',
  'reminder.form.dueTimeLabel': 'Due time',
  'reminder.form.linkToHiveLabel': 'Link to hive (optional)',
  'reminder.form.notesLabel': 'Notes',
  'reminder.form.notesPlaceholder': 'Optional details',
  'reminder.form.saveErrorMessage': 'Could not save reminder.',
  'reminder.form.saveErrorTitle': 'Error',
  'reminder.form.titleLabel': 'Title',
  'reminder.form.titlePlaceholder': 'e.g. Check varroa levels',
  'reminder.form.titleRequiredMessage': 'Please enter a title for the reminder.',
  'reminder.form.titleRequiredTitle': 'Title required',
  'reminder.list.deleteMessage': 'Delete "{title}"?',
  'reminder.list.deleteTitle': 'Delete Reminder',
  'temper.1': 'Very calm',
  'temper.2': 'Calm',
  'temper.3': 'Neutral',
  'temper.4': 'Defensive',
  'temper.5': 'Aggressive',
  'weather.humidity': 'humidity',
  'weatherCondition.clearSky': 'Clear sky',
  'weatherCondition.fog': 'Fog',
  'weatherCondition.partlyCloudy': 'Partly cloudy',
  'weatherCondition.rain': 'Rain',
  'weatherCondition.showers': 'Showers',
  'weatherCondition.snow': 'Snow',
  'weatherCondition.snowShowers': 'Snow showers',
  'weatherCondition.thunderstorm': 'Thunderstorm',
  'weatherCondition.unknown': 'Unknown',
  'broodStatus.capped': 'Capped',
  'broodStatus.eggs': 'Eggs',
  'broodStatus.good': 'Good',
  'broodStatus.larvae': 'Larvae',
  'broodStatus.missing': 'Missing',
  'honeyStore.adequate': 'Adequate',
  'honeyStore.empty': 'Empty',
  'honeyStore.full': 'Full',
  'honeyStore.low': 'Low',
} as const;

type TranslationKey = keyof typeof enTranslations;
type TranslationDictionary = typeof enTranslations;

const deTranslations: Partial<TranslationDictionary> = {
  'app.dbError': 'Datenbankfehler: {error}',
  'common.add': 'Hinzufügen',
  'common.cancel': 'Abbrechen',
  'common.createHive': 'Volk anlegen',
  'common.delete': 'Löschen',
  'common.edit': 'Bearbeiten',
  'common.error': 'Fehler',
  'common.no': 'Nein',
  'common.none': 'Keine',
  'common.refresh': 'Aktualisieren',
  'common.saveChanges': 'Änderungen speichern',
  'common.saveInspection': 'Kontrolle speichern',
  'common.saveQueen': 'Königin speichern',
  'common.saveReminder': 'Erinnerung speichern',
  'common.system': 'System',
  'common.yes': 'Ja',
  'empty.noHivesSubtitle': 'Tippe auf +, um dein erstes Volk zu erfassen',
  'empty.noHivesTitle': 'Noch keine Völker',
  'empty.noInspectionsSubtitle': 'Öffne ein Volk und füge deine erste Kontrolle hinzu',
  'empty.noInspectionsTitle': 'Noch keine Kontrollen',
  'empty.noRemindersSubtitle': 'Tippe auf +, um eine Erinnerung für ein Volk zu planen',
  'empty.noRemindersTitle': 'Keine Erinnerungen',
  'hiveDetail.deleteButton': 'Volk löschen',
  'hiveDetail.deleteMessage': '"{name}" und alle zugehörigen Kontrollen werden dauerhaft gelöscht. Das kann nicht rückgängig gemacht werden.',
  'hiveDetail.deleteTitle': 'Volk löschen',
  'hiveDetail.inspectionsSection': 'Kontrollen',
  'hiveDetail.noInspections': 'Keine Kontrollen erfasst',
  'hiveDetail.noQueen': 'Keine Königin erfasst',
  'hiveDetail.queenSection': 'Königin',
  'hiveDetail.unknownBreed': 'Unbekannte Herkunft',
  'hiveForm.nameLabel': 'Name',
  'hiveForm.namePlaceholder': 'z. B. Gartenvolk A',
  'hiveForm.nameRequiredMessage': 'Bitte gib einen Namen für das Volk ein.',
  'hiveForm.nameRequiredTitle': 'Name erforderlich',
  'hiveForm.notesLabel': 'Notizen',
  'hiveForm.notesPlaceholder': 'Optionale Notizen zu diesem Volk',
  'hiveForm.queenMarkColourLabel': 'Markierungsfarbe der Königin',
  'hiveForm.typeLabel': 'Beutentyp',
  'hiveType.Dadant': 'Dadant',
  'hiveType.Langstroth': 'Langstroth',
  'hiveType.Nucleus': 'Ableger',
  'hiveType.Warré': 'Warré',
  'inspection.detail.broodBadge': 'Brut: {status}',
  'inspection.detail.deleteMessage': 'Diese Kontrolle wird dauerhaft gelöscht.',
  'inspection.detail.deleteTitle': 'Kontrolle löschen',
  'inspection.detail.honeyBadge': 'Honig: {level}',
  'inspection.detail.notesLabel': 'Notizen',
  'inspection.detail.queenNotSeen': 'Königin nicht gesehen',
  'inspection.detail.queenSeen': 'Königin gesehen',
  'inspection.detail.temperLabel': 'Temperament',
  'inspection.detail.varroaCountLabel': 'Varroa-Anzahl',
  'inspection.detail.weatherLabel': 'Wetter bei der Kontrolle',
  'inspection.form.broodStatusLabel': 'Brutstatus',
  'inspection.form.dateLabel': 'Datum',
  'inspection.form.fetchCurrentWeather': 'Aktuelles Wetter abrufen',
  'inspection.form.fetchWeatherErrorMessage': 'Das Wetter konnte nicht geladen werden. Prüfe deine Internetverbindung.',
  'inspection.form.fetchWeatherErrorTitle': 'Fehler',
  'inspection.form.honeyStoresLabel': 'Honigvorrat',
  'inspection.form.locationUnavailableMessage': 'Bitte aktiviere den Standortzugriff in den Geräteeinstellungen.',
  'inspection.form.locationUnavailableTitle': 'Standort nicht verfügbar',
  'inspection.form.notesLabel': 'Notizen',
  'inspection.form.notesPlaceholder': 'Beobachtungen, Probleme, Maßnahmen ...',
  'inspection.form.queenSeenLabel': 'Königin gesehen',
  'inspection.form.temperLabel': 'Temperament',
  'inspection.form.varroaCountLabel': 'Varroa-Anzahl',
  'inspection.form.weatherLabel': 'Wetter',
  'inspection.row.broodSuffix': 'Brut',
  'inspection.row.honeySuffix': 'Honig',
  'language.buttonLabel': 'Sprache ändern',
  'language.menuTitle': 'Sprache',
  'language.systemDescription': 'Gerätesprache verwenden',
  'options.aboutSection': 'Über',
  'options.appDescription': 'Eine Offline-First-Imkerei-App für Völker, Inspektionen, Erinnerungen und die Nachverfolgung von Königinnen.',
  'options.appName': 'Beehaven',
  'options.appIdLabel': 'App-ID',
  'options.frameworkLabel': 'Technologie',
  'options.frameworkValue': 'Expo SDK 52, React Native 0.76',
  'options.languagesLabel': 'Sprachen',
  'options.languagesSection': 'Sprachen',
  'options.notificationsLabel': 'Benachrichtigungen',
  'options.notificationsValue': 'Lokale Erinnerungen',
  'options.privacyLabel': 'Datenschutz',
  'options.privacyValue': 'Offline-First, kein Konto erforderlich',
  'options.storageLabel': 'Speicher',
  'options.storageValue': 'SQLite auf dem Gerät',
  'options.versionLabel': 'Version',
  'options.weatherSourceLabel': 'Wetter',
  'options.weatherSourceValue': 'Open-Meteo + Gerätestandort',
  'markColor.blue': 'Blau',
  'markColor.green': 'Grün',
  'markColor.red': 'Rot',
  'markColor.white': 'Weiß',
  'markColor.yellow': 'Gelb',
  'nav.hive': 'Volk',
  'nav.hives': 'Völker',
  'nav.inspection': 'Kontrolle',
  'nav.inspections': 'Kontrollen',
  'nav.options': 'Optionen',
  'nav.queen': 'Königin',
  'nav.reminder': 'Erinnerung',
  'nav.reminders': 'Erinnerungen',
  'notification.channelName': 'Erinnerungen',
  'notification.defaultBody': 'Zeit, nach deinem Volk zu sehen!',
  'queenForm.breedLabel': 'Herkunft',
  'queenForm.breedPlaceholder': 'z. B. Carnica',
  'queenForm.invalidYearMessage': 'Bitte gib ein gültiges Jahr für die Königin ein.',
  'queenForm.invalidYearTitle': 'Ungültiges Jahr',
  'queenForm.markColourLabel': 'IBRA-Markierungsfarbe',
  'queenForm.notesLabel': 'Notizen',
  'queenForm.notesPlaceholder': 'Optionale Notizen',
  'queenForm.statusLabel': 'Status',
  'queenForm.yearLabel': 'Jahr',
  'queenStatus.active': 'Aktiv',
  'queenStatus.dead': 'Tot',
  'queenStatus.missing': 'Fehlt',
  'queenStatus.replaced': 'Ersetzt',
  'reminder.form.dueDateLabel': 'Fällig am',
  'reminder.form.dueTimeLabel': 'Fällige Uhrzeit',
  'reminder.form.linkToHiveLabel': 'Mit Volk verknüpfen (optional)',
  'reminder.form.notesLabel': 'Notizen',
  'reminder.form.notesPlaceholder': 'Optionale Details',
  'reminder.form.saveErrorMessage': 'Die Erinnerung konnte nicht gespeichert werden.',
  'reminder.form.saveErrorTitle': 'Fehler',
  'reminder.form.titleLabel': 'Titel',
  'reminder.form.titlePlaceholder': 'z. B. Varroa-Befall prüfen',
  'reminder.form.titleRequiredMessage': 'Bitte gib einen Titel für die Erinnerung ein.',
  'reminder.form.titleRequiredTitle': 'Titel erforderlich',
  'reminder.list.deleteMessage': '"{title}" löschen?',
  'reminder.list.deleteTitle': 'Erinnerung löschen',
  'temper.1': 'Sehr ruhig',
  'temper.2': 'Ruhig',
  'temper.3': 'Neutral',
  'temper.4': 'Abwehrbereit',
  'temper.5': 'Aggressiv',
  'weather.humidity': 'Luftfeuchtigkeit',
  'weatherCondition.clearSky': 'Klarer Himmel',
  'weatherCondition.fog': 'Nebel',
  'weatherCondition.partlyCloudy': 'Teilweise bewölkt',
  'weatherCondition.rain': 'Regen',
  'weatherCondition.showers': 'Schauer',
  'weatherCondition.snow': 'Schnee',
  'weatherCondition.snowShowers': 'Schneeschauer',
  'weatherCondition.thunderstorm': 'Gewitter',
  'weatherCondition.unknown': 'Unbekannt',
  'broodStatus.capped': 'Verdeckelt',
  'broodStatus.eggs': 'Eier',
  'broodStatus.good': 'Gut',
  'broodStatus.larvae': 'Larven',
  'broodStatus.missing': 'Fehlt',
  'honeyStore.adequate': 'Ausreichend',
  'honeyStore.empty': 'Leer',
  'honeyStore.full': 'Voll',
  'honeyStore.low': 'Wenig',
};

const svTranslations: Partial<TranslationDictionary> = {
  'app.dbError': 'Databasfel: {error}',
  'common.add': 'Lägg till',
  'common.cancel': 'Avbryt',
  'common.createHive': 'Skapa kupa',
  'common.delete': 'Radera',
  'common.edit': 'Redigera',
  'common.error': 'Fel',
  'common.no': 'Nej',
  'common.none': 'Ingen',
  'common.refresh': 'Uppdatera',
  'common.saveChanges': 'Spara ändringar',
  'common.saveInspection': 'Spara inspektion',
  'common.saveQueen': 'Spara drottning',
  'common.saveReminder': 'Spara påminnelse',
  'common.system': 'System',
  'common.yes': 'Ja',
  'empty.noHivesSubtitle': 'Tryck på + för att registrera din första kupa',
  'empty.noHivesTitle': 'Inga kupor ännu',
  'empty.noInspectionsSubtitle': 'Öppna en kupa och lägg till din första inspektion',
  'empty.noInspectionsTitle': 'Inga inspektioner ännu',
  'empty.noRemindersSubtitle': 'Tryck på + för att schemalägga en påminnelse för en kupa',
  'empty.noRemindersTitle': 'Inga påminnelser',
  'hiveDetail.deleteButton': 'Radera kupa',
  'hiveDetail.deleteMessage': 'Detta kommer att radera "{name}" och alla dess inspektioner permanent. Detta kan inte ångras.',
  'hiveDetail.deleteTitle': 'Radera kupa',
  'hiveDetail.inspectionsSection': 'Inspektioner',
  'hiveDetail.noInspections': 'Inga inspektioner registrerade',
  'hiveDetail.noQueen': 'Ingen drottning registrerad',
  'hiveDetail.queenSection': 'Drottning',
  'hiveDetail.unknownBreed': 'Okänd ras',
  'hiveForm.nameLabel': 'Namn',
  'hiveForm.namePlaceholder': 't.ex. Trädgårdskupa A',
  'hiveForm.nameRequiredMessage': 'Ange ett namn för kupan.',
  'hiveForm.nameRequiredTitle': 'Namn krävs',
  'hiveForm.notesLabel': 'Anteckningar',
  'hiveForm.notesPlaceholder': 'Valfria anteckningar om denna kupa',
  'hiveForm.queenMarkColourLabel': 'Drottningens markfärg',
  'hiveForm.typeLabel': 'Typ',
  'hiveType.Dadant': 'Dadant',
  'hiveType.Langstroth': 'Langstroth',
  'hiveType.Nucleus': 'Avläggare',
  'hiveType.Warré': 'Warré',
  'inspection.detail.broodBadge': 'Yngel: {status}',
  'inspection.detail.deleteMessage': 'Denna inspektion kommer att raderas permanent.',
  'inspection.detail.deleteTitle': 'Radera inspektion',
  'inspection.detail.honeyBadge': 'Honung: {level}',
  'inspection.detail.notesLabel': 'Anteckningar',
  'inspection.detail.queenNotSeen': 'Drottning inte sedd',
  'inspection.detail.queenSeen': 'Drottning sedd',
  'inspection.detail.temperLabel': 'Temperament',
  'inspection.detail.varroaCountLabel': 'Varroaantal',
  'inspection.detail.weatherLabel': 'Väder vid inspektionen',
  'inspection.form.broodStatusLabel': 'Yngelstatus',
  'inspection.form.dateLabel': 'Datum',
  'inspection.form.fetchCurrentWeather': 'Hämta aktuellt väder',
  'inspection.form.fetchWeatherErrorMessage': 'Kunde inte hämta väder. Kontrollera din internetanslutning.',
  'inspection.form.fetchWeatherErrorTitle': 'Fel',
  'inspection.form.honeyStoresLabel': 'Honungsförråd',
  'inspection.form.locationUnavailableMessage': 'Aktivera platsåtkomst i enhetens inställningar.',
  'inspection.form.locationUnavailableTitle': 'Plats ej tillgänglig',
  'inspection.form.notesLabel': 'Anteckningar',
  'inspection.form.notesPlaceholder': 'Observationer, problem, åtgärder...',
  'inspection.form.queenSeenLabel': 'Drottning sedd',
  'inspection.form.temperLabel': 'Temperament',
  'inspection.form.varroaCountLabel': 'Varroaantal',
  'inspection.form.weatherLabel': 'Väder',
  'inspection.row.broodSuffix': 'yngel',
  'inspection.row.honeySuffix': 'honung',
  'language.buttonLabel': 'Byt språk',
  'language.menuTitle': 'Språk',
  'language.systemDescription': 'Följ enhetens språk',
  'options.aboutSection': 'Om appen',
  'options.appDescription': 'En offline-first biodlingsapp för kupor, inspektioner, påminnelser och spårning av drottningar.',
  'options.appName': 'Beehaven',
  'options.appIdLabel': 'App-ID',
  'options.frameworkLabel': 'Teknik',
  'options.frameworkValue': 'Expo SDK 52, React Native 0.76',
  'options.languagesLabel': 'Språk',
  'options.languagesSection': 'Språk',
  'options.notificationsLabel': 'Notiser',
  'options.notificationsValue': 'Lokala påminnelser',
  'options.privacyLabel': 'Integritet',
  'options.privacyValue': 'Offline-first, inget konto krävs',
  'options.storageLabel': 'Lagring',
  'options.storageValue': 'SQLite på enheten',
  'options.versionLabel': 'Version',
  'options.weatherSourceLabel': 'Väder',
  'options.weatherSourceValue': 'Open-Meteo + enhetens plats',
  'markColor.blue': 'Blå',
  'markColor.green': 'Grön',
  'markColor.red': 'Röd',
  'markColor.white': 'Vit',
  'markColor.yellow': 'Gul',
  'nav.hive': 'Kupa',
  'nav.hives': 'Kupor',
  'nav.inspection': 'Inspektion',
  'nav.inspections': 'Inspektioner',
  'nav.options': 'Alternativ',
  'nav.queen': 'Drottning',
  'nav.reminder': 'Påminnelse',
  'nav.reminders': 'Påminnelser',
  'notification.channelName': 'Påminnelser',
  'notification.defaultBody': 'Dags att titta till din kupa!',
  'queenForm.breedLabel': 'Ras',
  'queenForm.breedPlaceholder': 't.ex. Carnica',
  'queenForm.invalidYearMessage': 'Ange ett giltigt år för drottningen.',
  'queenForm.invalidYearTitle': 'Ogiltigt år',
  'queenForm.markColourLabel': 'IBRA-markfärg',
  'queenForm.notesLabel': 'Anteckningar',
  'queenForm.notesPlaceholder': 'Valfria anteckningar',
  'queenForm.statusLabel': 'Status',
  'queenForm.yearLabel': 'År',
  'queenStatus.active': 'Aktiv',
  'queenStatus.dead': 'Död',
  'queenStatus.missing': 'Saknas',
  'queenStatus.replaced': 'Ersatt',
  'reminder.form.dueDateLabel': 'Förfallodatum',
  'reminder.form.dueTimeLabel': 'Förfallotid',
  'reminder.form.linkToHiveLabel': 'Koppla till kupa (valfritt)',
  'reminder.form.notesLabel': 'Anteckningar',
  'reminder.form.notesPlaceholder': 'Valfria detaljer',
  'reminder.form.saveErrorMessage': 'Kunde inte spara påminnelsen.',
  'reminder.form.saveErrorTitle': 'Fel',
  'reminder.form.titleLabel': 'Titel',
  'reminder.form.titlePlaceholder': 't.ex. Kontrollera varroanivåer',
  'reminder.form.titleRequiredMessage': 'Ange en titel för påminnelsen.',
  'reminder.form.titleRequiredTitle': 'Titel krävs',
  'reminder.list.deleteMessage': 'Radera "{title}"?',
  'reminder.list.deleteTitle': 'Radera påminnelse',
  'temper.1': 'Mycket lugn',
  'temper.2': 'Lugn',
  'temper.3': 'Neutral',
  'temper.4': 'Defensiv',
  'temper.5': 'Aggressiv',
  'weather.humidity': 'luftfuktighet',
  'weatherCondition.clearSky': 'Klar himmel',
  'weatherCondition.fog': 'Dimma',
  'weatherCondition.partlyCloudy': 'Delvis molnigt',
  'weatherCondition.rain': 'Regn',
  'weatherCondition.showers': 'Skurar',
  'weatherCondition.snow': 'Snö',
  'weatherCondition.snowShowers': 'Snöskurar',
  'weatherCondition.thunderstorm': 'Åska',
  'weatherCondition.unknown': 'Okänd',
  'broodStatus.capped': 'Täckt',
  'broodStatus.eggs': 'Ägg',
  'broodStatus.good': 'Bra',
  'broodStatus.larvae': 'Larver',
  'broodStatus.missing': 'Saknas',
  'honeyStore.adequate': 'Tillräckligt',
  'honeyStore.empty': 'Tomt',
  'honeyStore.full': 'Fullt',
  'honeyStore.low': 'Lågt',
};

const frTranslations: Partial<TranslationDictionary> = {
  'app.dbError': 'Erreur de base de données : {error}',
  'common.add': 'Ajouter',
  'common.cancel': 'Annuler',
  'common.createHive': 'Créer une ruche',
  'common.delete': 'Supprimer',
  'common.edit': 'Modifier',
  'common.error': 'Erreur',
  'common.no': 'Non',
  'common.none': 'Aucune',
  'common.refresh': 'Actualiser',
  'common.saveChanges': 'Enregistrer les modifications',
  'common.saveInspection': 'Enregistrer l’inspection',
  'common.saveQueen': 'Enregistrer la reine',
  'common.saveReminder': 'Enregistrer le rappel',
  'common.system': 'Système',
  'common.yes': 'Oui',
  'empty.noHivesSubtitle': 'Touchez + pour enregistrer votre première ruche',
  'empty.noHivesTitle': 'Aucune ruche pour le moment',
  'empty.noInspectionsSubtitle': 'Ouvrez une ruche et ajoutez votre première inspection',
  'empty.noInspectionsTitle': 'Aucune inspection pour le moment',
  'empty.noRemindersSubtitle': 'Touchez + pour programmer un rappel de ruche',
  'empty.noRemindersTitle': 'Aucun rappel',
  'hiveDetail.deleteButton': 'Supprimer la ruche',
  'hiveDetail.deleteMessage': 'Cela supprimera définitivement "{name}" et toutes ses inspections. Cette action est irréversible.',
  'hiveDetail.deleteTitle': 'Supprimer la ruche',
  'hiveDetail.inspectionsSection': 'Inspections',
  'hiveDetail.noInspections': 'Aucune inspection enregistrée',
  'hiveDetail.noQueen': 'Aucune reine enregistrée',
  'hiveDetail.queenSection': 'Reine',
  'hiveDetail.unknownBreed': 'Race inconnue',
  'hiveForm.nameLabel': 'Nom',
  'hiveForm.namePlaceholder': 'ex. Ruche du jardin A',
  'hiveForm.nameRequiredMessage': 'Veuillez saisir un nom pour la ruche.',
  'hiveForm.nameRequiredTitle': 'Nom requis',
  'hiveForm.notesLabel': 'Notes',
  'hiveForm.notesPlaceholder': 'Notes facultatives sur cette ruche',
  'hiveForm.queenMarkColourLabel': 'Couleur de marquage de la reine',
  'hiveForm.typeLabel': 'Type',
  'hiveType.Dadant': 'Dadant',
  'hiveType.Langstroth': 'Langstroth',
  'hiveType.Nucleus': 'Nucleus',
  'hiveType.Warré': 'Warré',
  'inspection.detail.broodBadge': 'Couvain : {status}',
  'inspection.detail.deleteMessage': 'Cette inspection sera supprimée définitivement.',
  'inspection.detail.deleteTitle': 'Supprimer l’inspection',
  'inspection.detail.honeyBadge': 'Miel : {level}',
  'inspection.detail.notesLabel': 'Notes',
  'inspection.detail.queenNotSeen': 'Reine non vue',
  'inspection.detail.queenSeen': 'Reine vue',
  'inspection.detail.temperLabel': 'Tempérament',
  'inspection.detail.varroaCountLabel': 'Nombre de varroas',
  'inspection.detail.weatherLabel': 'Météo pendant l’inspection',
  'inspection.form.broodStatusLabel': 'État du couvain',
  'inspection.form.dateLabel': 'Date',
  'inspection.form.fetchCurrentWeather': 'Récupérer la météo actuelle',
  'inspection.form.fetchWeatherErrorMessage': 'Impossible de récupérer la météo. Vérifiez votre connexion Internet.',
  'inspection.form.fetchWeatherErrorTitle': 'Erreur',
  'inspection.form.honeyStoresLabel': 'Réserves de miel',
  'inspection.form.locationUnavailableMessage': 'Veuillez activer l’accès à la localisation dans les réglages de l’appareil.',
  'inspection.form.locationUnavailableTitle': 'Localisation indisponible',
  'inspection.form.notesLabel': 'Notes',
  'inspection.form.notesPlaceholder': 'Observations, inquiétudes, actions menées...',
  'inspection.form.queenSeenLabel': 'Reine vue',
  'inspection.form.temperLabel': 'Tempérament',
  'inspection.form.varroaCountLabel': 'Nombre de varroas',
  'inspection.form.weatherLabel': 'Météo',
  'inspection.row.broodSuffix': 'couvain',
  'inspection.row.honeySuffix': 'miel',
  'language.buttonLabel': 'Changer de langue',
  'language.menuTitle': 'Langue',
  'language.systemDescription': 'Suivre la langue de votre appareil',
  'options.aboutSection': 'À propos',
  'options.appDescription': 'Une application d’apiculture hors ligne pour les ruches, les inspections, les rappels et le suivi des reines.',
  'options.appName': 'Beehaven',
  'options.appIdLabel': 'Identifiant de l’app',
  'options.frameworkLabel': 'Technologies',
  'options.frameworkValue': 'Expo SDK 52, React Native 0.76',
  'options.languagesLabel': 'Langues',
  'options.languagesSection': 'Langues',
  'options.notificationsLabel': 'Notifications',
  'options.notificationsValue': 'Rappels locaux',
  'options.privacyLabel': 'Confidentialité',
  'options.privacyValue': 'Hors ligne, sans compte requis',
  'options.storageLabel': 'Stockage',
  'options.storageValue': 'SQLite sur l’appareil',
  'options.versionLabel': 'Version',
  'options.weatherSourceLabel': 'Météo',
  'options.weatherSourceValue': 'Open-Meteo + localisation de l’appareil',
  'markColor.blue': 'Bleu',
  'markColor.green': 'Vert',
  'markColor.red': 'Rouge',
  'markColor.white': 'Blanc',
  'markColor.yellow': 'Jaune',
  'nav.hive': 'Ruche',
  'nav.hives': 'Ruches',
  'nav.inspection': 'Inspection',
  'nav.inspections': 'Inspections',
  'nav.options': 'Options',
  'nav.queen': 'Reine',
  'nav.reminder': 'Rappel',
  'nav.reminders': 'Rappels',
  'notification.channelName': 'Rappels',
  'notification.defaultBody': 'Il est temps de vérifier votre ruche !',
  'queenForm.breedLabel': 'Race',
  'queenForm.breedPlaceholder': 'ex. Carniolienne',
  'queenForm.invalidYearMessage': 'Veuillez saisir une année valide pour la reine.',
  'queenForm.invalidYearTitle': 'Année invalide',
  'queenForm.markColourLabel': 'Couleur de marquage IBRA',
  'queenForm.notesLabel': 'Notes',
  'queenForm.notesPlaceholder': 'Notes facultatives',
  'queenForm.statusLabel': 'Statut',
  'queenForm.yearLabel': 'Année',
  'queenStatus.active': 'Active',
  'queenStatus.dead': 'Morte',
  'queenStatus.missing': 'Manquante',
  'queenStatus.replaced': 'Remplacée',
  'reminder.form.dueDateLabel': 'Date d’échéance',
  'reminder.form.dueTimeLabel': 'Heure d’échéance',
  'reminder.form.linkToHiveLabel': 'Associer à une ruche (facultatif)',
  'reminder.form.notesLabel': 'Notes',
  'reminder.form.notesPlaceholder': 'Détails facultatifs',
  'reminder.form.saveErrorMessage': 'Impossible d’enregistrer le rappel.',
  'reminder.form.saveErrorTitle': 'Erreur',
  'reminder.form.titleLabel': 'Titre',
  'reminder.form.titlePlaceholder': 'ex. Vérifier les niveaux de varroa',
  'reminder.form.titleRequiredMessage': 'Veuillez saisir un titre pour le rappel.',
  'reminder.form.titleRequiredTitle': 'Titre requis',
  'reminder.list.deleteMessage': 'Supprimer "{title}" ?',
  'reminder.list.deleteTitle': 'Supprimer le rappel',
  'temper.1': 'Très calme',
  'temper.2': 'Calme',
  'temper.3': 'Neutre',
  'temper.4': 'Défensive',
  'temper.5': 'Agressive',
  'weather.humidity': 'humidité',
  'weatherCondition.clearSky': 'Ciel dégagé',
  'weatherCondition.fog': 'Brouillard',
  'weatherCondition.partlyCloudy': 'Partiellement nuageux',
  'weatherCondition.rain': 'Pluie',
  'weatherCondition.showers': 'Averses',
  'weatherCondition.snow': 'Neige',
  'weatherCondition.snowShowers': 'Averses de neige',
  'weatherCondition.thunderstorm': 'Orage',
  'weatherCondition.unknown': 'Inconnu',
  'broodStatus.capped': 'Operculé',
  'broodStatus.eggs': 'Œufs',
  'broodStatus.good': 'Bon',
  'broodStatus.larvae': 'Larves',
  'broodStatus.missing': 'Absent',
  'honeyStore.adequate': 'Adéquat',
  'honeyStore.empty': 'Vide',
  'honeyStore.full': 'Plein',
  'honeyStore.low': 'Faible',
};

const esTranslations: Partial<TranslationDictionary> = {
  'app.dbError': 'Error de base de datos: {error}',
  'common.add': 'Agregar',
  'common.cancel': 'Cancelar',
  'common.createHive': 'Crear colmena',
  'common.delete': 'Eliminar',
  'common.edit': 'Editar',
  'common.error': 'Error',
  'common.no': 'No',
  'common.none': 'Ninguna',
  'common.refresh': 'Actualizar',
  'common.saveChanges': 'Guardar cambios',
  'common.saveInspection': 'Guardar inspección',
  'common.saveQueen': 'Guardar reina',
  'common.saveReminder': 'Guardar recordatorio',
  'common.system': 'Sistema',
  'common.yes': 'Sí',
  'empty.noHivesSubtitle': 'Toca + para registrar tu primera colmena',
  'empty.noHivesTitle': 'Aún no hay colmenas',
  'empty.noInspectionsSubtitle': 'Abre una colmena y agrega tu primera inspección',
  'empty.noInspectionsTitle': 'Aún no hay inspecciones',
  'empty.noRemindersSubtitle': 'Toca + para programar un recordatorio de colmena',
  'empty.noRemindersTitle': 'No hay recordatorios',
  'hiveDetail.deleteButton': 'Eliminar colmena',
  'hiveDetail.deleteMessage': 'Esto eliminará permanentemente "{name}" y todas sus inspecciones. No se puede deshacer.',
  'hiveDetail.deleteTitle': 'Eliminar colmena',
  'hiveDetail.inspectionsSection': 'Inspecciones',
  'hiveDetail.noInspections': 'No hay inspecciones registradas',
  'hiveDetail.noQueen': 'No hay reina registrada',
  'hiveDetail.queenSection': 'Reina',
  'hiveDetail.unknownBreed': 'Raza desconocida',
  'hiveForm.nameLabel': 'Nombre',
  'hiveForm.namePlaceholder': 'p. ej. Colmena del jardín A',
  'hiveForm.nameRequiredMessage': 'Introduce un nombre para la colmena.',
  'hiveForm.nameRequiredTitle': 'Nombre obligatorio',
  'hiveForm.notesLabel': 'Notas',
  'hiveForm.notesPlaceholder': 'Notas opcionales sobre esta colmena',
  'hiveForm.queenMarkColourLabel': 'Color de marca de la reina',
  'hiveForm.typeLabel': 'Tipo',
  'hiveType.Dadant': 'Dadant',
  'hiveType.Langstroth': 'Langstroth',
  'hiveType.Nucleus': 'Núcleo',
  'hiveType.Warré': 'Warré',
  'inspection.detail.broodBadge': 'Cría: {status}',
  'inspection.detail.deleteMessage': 'Esta inspección se eliminará permanentemente.',
  'inspection.detail.deleteTitle': 'Eliminar inspección',
  'inspection.detail.honeyBadge': 'Miel: {level}',
  'inspection.detail.notesLabel': 'Notas',
  'inspection.detail.queenNotSeen': 'Reina no vista',
  'inspection.detail.queenSeen': 'Reina vista',
  'inspection.detail.temperLabel': 'Temperamento',
  'inspection.detail.varroaCountLabel': 'Conteo de varroa',
  'inspection.detail.weatherLabel': 'Clima durante la inspección',
  'inspection.form.broodStatusLabel': 'Estado de la cría',
  'inspection.form.dateLabel': 'Fecha',
  'inspection.form.fetchCurrentWeather': 'Obtener el clima actual',
  'inspection.form.fetchWeatherErrorMessage': 'No se pudo obtener el clima. Comprueba tu conexión a Internet.',
  'inspection.form.fetchWeatherErrorTitle': 'Error',
  'inspection.form.honeyStoresLabel': 'Reservas de miel',
  'inspection.form.locationUnavailableMessage': 'Activa el acceso a la ubicación en los ajustes del dispositivo.',
  'inspection.form.locationUnavailableTitle': 'Ubicación no disponible',
  'inspection.form.notesLabel': 'Notas',
  'inspection.form.notesPlaceholder': 'Observaciones, problemas, acciones realizadas...',
  'inspection.form.queenSeenLabel': 'Reina vista',
  'inspection.form.temperLabel': 'Temperamento',
  'inspection.form.varroaCountLabel': 'Conteo de varroa',
  'inspection.form.weatherLabel': 'Clima',
  'inspection.row.broodSuffix': 'cría',
  'inspection.row.honeySuffix': 'miel',
  'language.buttonLabel': 'Cambiar idioma',
  'language.menuTitle': 'Idioma',
  'language.systemDescription': 'Seguir el idioma del dispositivo',
  'options.aboutSection': 'Acerca de',
  'options.appDescription': 'Una aplicación de apicultura offline-first para colmenas, inspecciones, recordatorios y seguimiento de reinas.',
  'options.appName': 'Beehaven',
  'options.appIdLabel': 'ID de la app',
  'options.frameworkLabel': 'Tecnología',
  'options.frameworkValue': 'Expo SDK 52, React Native 0.76',
  'options.languagesLabel': 'Idiomas',
  'options.languagesSection': 'Idiomas',
  'options.notificationsLabel': 'Notificaciones',
  'options.notificationsValue': 'Recordatorios locales',
  'options.privacyLabel': 'Privacidad',
  'options.privacyValue': 'Offline-first, sin cuenta obligatoria',
  'options.storageLabel': 'Almacenamiento',
  'options.storageValue': 'SQLite en el dispositivo',
  'options.versionLabel': 'Versión',
  'options.weatherSourceLabel': 'Clima',
  'options.weatherSourceValue': 'Open-Meteo + ubicación del dispositivo',
  'markColor.blue': 'Azul',
  'markColor.green': 'Verde',
  'markColor.red': 'Rojo',
  'markColor.white': 'Blanco',
  'markColor.yellow': 'Amarillo',
  'nav.hive': 'Colmena',
  'nav.hives': 'Colmenas',
  'nav.inspection': 'Inspección',
  'nav.inspections': 'Inspecciones',
  'nav.options': 'Opciones',
  'nav.queen': 'Reina',
  'nav.reminder': 'Recordatorio',
  'nav.reminders': 'Recordatorios',
  'notification.channelName': 'Recordatorios',
  'notification.defaultBody': '¡Es hora de revisar tu colmena!',
  'queenForm.breedLabel': 'Raza',
  'queenForm.breedPlaceholder': 'p. ej. Carnica',
  'queenForm.invalidYearMessage': 'Introduce un año válido para la reina.',
  'queenForm.invalidYearTitle': 'Año no válido',
  'queenForm.markColourLabel': 'Color de marca IBRA',
  'queenForm.notesLabel': 'Notas',
  'queenForm.notesPlaceholder': 'Notas opcionales',
  'queenForm.statusLabel': 'Estado',
  'queenForm.yearLabel': 'Año',
  'queenStatus.active': 'Activa',
  'queenStatus.dead': 'Muerta',
  'queenStatus.missing': 'Desaparecida',
  'queenStatus.replaced': 'Reemplazada',
  'reminder.form.dueDateLabel': 'Fecha límite',
  'reminder.form.dueTimeLabel': 'Hora límite',
  'reminder.form.linkToHiveLabel': 'Vincular a una colmena (opcional)',
  'reminder.form.notesLabel': 'Notas',
  'reminder.form.notesPlaceholder': 'Detalles opcionales',
  'reminder.form.saveErrorMessage': 'No se pudo guardar el recordatorio.',
  'reminder.form.saveErrorTitle': 'Error',
  'reminder.form.titleLabel': 'Título',
  'reminder.form.titlePlaceholder': 'p. ej. Revisar niveles de varroa',
  'reminder.form.titleRequiredMessage': 'Introduce un título para el recordatorio.',
  'reminder.form.titleRequiredTitle': 'Título obligatorio',
  'reminder.list.deleteMessage': 'Eliminar "{title}"?',
  'reminder.list.deleteTitle': 'Eliminar recordatorio',
  'temper.1': 'Muy tranquila',
  'temper.2': 'Tranquila',
  'temper.3': 'Neutral',
  'temper.4': 'Defensiva',
  'temper.5': 'Agresiva',
  'weather.humidity': 'humedad',
  'weatherCondition.clearSky': 'Cielo despejado',
  'weatherCondition.fog': 'Niebla',
  'weatherCondition.partlyCloudy': 'Parcialmente nublado',
  'weatherCondition.rain': 'Lluvia',
  'weatherCondition.showers': 'Chubascos',
  'weatherCondition.snow': 'Nieve',
  'weatherCondition.snowShowers': 'Chubascos de nieve',
  'weatherCondition.thunderstorm': 'Tormenta',
  'weatherCondition.unknown': 'Desconocido',
  'broodStatus.capped': 'Operculada',
  'broodStatus.eggs': 'Huevos',
  'broodStatus.good': 'Buena',
  'broodStatus.larvae': 'Larvas',
  'broodStatus.missing': 'Ausente',
  'honeyStore.adequate': 'Adecuada',
  'honeyStore.empty': 'Vacía',
  'honeyStore.full': 'Llena',
  'honeyStore.low': 'Baja',
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'sv', label: 'Swedish', nativeLabel: 'Svenska', flag: '🇸🇪' },
];

const translations: Record<SupportedLocale, Partial<TranslationDictionary>> = {
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
  es: esTranslations,
  sv: svTranslations,
};

const localeTags: Record<SupportedLocale, string> = {
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  sv: 'sv-SE',
};

const dateTimeFormatterCache = new Map<string, Intl.DateTimeFormat>();

const weatherConditionKeys: Record<string, TranslationKey> = {
  'Clear sky': 'weatherCondition.clearSky',
  'Partly cloudy': 'weatherCondition.partlyCloudy',
  Fog: 'weatherCondition.fog',
  Rain: 'weatherCondition.rain',
  Showers: 'weatherCondition.showers',
  Snow: 'weatherCondition.snow',
  'Snow showers': 'weatherCondition.snowShowers',
  Thunderstorm: 'weatherCondition.thunderstorm',
  Unknown: 'weatherCondition.unknown',
};

function resolveLocale(locale?: string | null): SupportedLocale {
  const normalized = locale?.toLowerCase();

  if (!normalized) return 'en';
  if (normalized.startsWith('de')) return 'de';
  if (normalized.startsWith('fr')) return 'fr';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('sv')) return 'sv';
  return 'en';
}

function isLocalePreference(value: string | null): value is LocalePreference {
  return value === 'system' || LANGUAGE_OPTIONS.some((option) => option.code === value);
}

function resolveSystemLocale(): SupportedLocale {
  return resolveLocale(Intl.DateTimeFormat().resolvedOptions().locale);
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template,
  );
}

let currentPreference: LocalePreference = 'system';
let currentLocale: SupportedLocale = resolveSystemLocale();

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function getLocalePreference(): LocalePreference {
  return currentPreference;
}

export function getSupportedLanguages(): LanguageOption[] {
  return LANGUAGE_OPTIONS;
}

export function getLanguageOption(locale: SupportedLocale): LanguageOption {
  return LANGUAGE_OPTIONS.find((option) => option.code === locale) ?? LANGUAGE_OPTIONS[0];
}

export function getLocaleFlag(locale: SupportedLocale): string {
  return getLanguageOption(locale).flag;
}

function applyLocalePreference(preference: LocalePreference) {
  currentPreference = preference;
  currentLocale = preference === 'system' ? resolveSystemLocale() : preference;
}

export function setLocale(locale: SupportedLocale) {
  if (currentLocale === locale && currentPreference === locale) return;
  applyLocalePreference(locale);
  emitChange();
}

export function resetLocaleToSystem() {
  if (currentPreference === 'system' && currentLocale === resolveSystemLocale()) return;
  applyLocalePreference('system');
  emitChange();
}

export async function initializeI18n() {
  try {
    const storedPreference = await AsyncStorage.getItem(LOCALE_PREFERENCE_KEY);
    if (isLocalePreference(storedPreference)) {
      applyLocalePreference(storedPreference);
    } else {
      applyLocalePreference('system');
    }
  } catch {
    applyLocalePreference('system');
  }

  emitChange();
}

export async function setLocalePreference(preference: LocalePreference) {
  if (currentPreference === preference && currentLocale === (preference === 'system' ? resolveSystemLocale() : preference)) {
    return;
  }

  applyLocalePreference(preference);
  emitChange();

  try {
    await AsyncStorage.setItem(LOCALE_PREFERENCE_KEY, preference);
  } catch {
    // Keep the in-memory locale even if persistence fails.
  }
}

export function getLocaleTag(locale: SupportedLocale = getLocale()): string {
  return localeTags[locale];
}

function getDateTimeFormatter(
  locale: SupportedLocale,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const cacheKey = `${locale}:${JSON.stringify(
    Object.entries(options).sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey)),
  )}`;
  const cachedFormatter = dateTimeFormatterCache.get(cacheKey);

  if (cachedFormatter) {
    return cachedFormatter;
  }

  const formatter = new Intl.DateTimeFormat(getLocaleTag(locale), options);
  dateTimeFormatterCache.set(cacheKey, formatter);
  return formatter;
}

export function translate(
  key: TranslationKey,
  params?: TranslationParams,
  locale: SupportedLocale = getLocale(),
): string {
  const template = translations[locale][key] ?? enTranslations[key];
  return interpolate(template, params);
}

export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions,
  locale: SupportedLocale = getLocale(),
): string {
  return getDateTimeFormatter(locale, options).format(new Date(value));
}

export function getHiveTypeLabel(type: HiveType, locale: SupportedLocale = getLocale()): string {
  return translate(`hiveType.${type}` as TranslationKey, undefined, locale);
}

export function getQueenStatusLabel(status: QueenStatus, locale: SupportedLocale = getLocale()): string {
  return translate(`queenStatus.${status}` as TranslationKey, undefined, locale);
}

export function getBroodStatusLabel(status: BroodStatus, locale: SupportedLocale = getLocale()): string {
  return translate(`broodStatus.${status}` as TranslationKey, undefined, locale);
}

export function getHoneyStoreLabel(store: HoneyStore, locale: SupportedLocale = getLocale()): string {
  return translate(`honeyStore.${store}` as TranslationKey, undefined, locale);
}

export function getMarkColorLabel(markColor: string, locale: SupportedLocale = getLocale()): string {
  switch (markColor) {
    case 'W':
      return translate('markColor.white', undefined, locale);
    case 'Y':
      return translate('markColor.yellow', undefined, locale);
    case 'R':
      return translate('markColor.red', undefined, locale);
    case 'G':
      return translate('markColor.green', undefined, locale);
    case 'B':
      return translate('markColor.blue', undefined, locale);
    default:
      return markColor;
  }
}

export function getTemperLabel(temper: number, locale: SupportedLocale = getLocale()): string {
  switch (temper) {
    case 1:
      return translate('temper.1', undefined, locale);
    case 2:
      return translate('temper.2', undefined, locale);
    case 3:
      return translate('temper.3', undefined, locale);
    case 4:
      return translate('temper.4', undefined, locale);
    case 5:
      return translate('temper.5', undefined, locale);
    default:
      return String(temper);
  }
}

export function getWeatherConditionLabel(condition: string, locale: SupportedLocale = getLocale()): string {
  const key = weatherConditionKeys[condition] ?? 'weatherCondition.unknown';
  return translate(key, undefined, locale);
}

export function useI18n() {
  const locale = useSyncExternalStore(subscribe, getLocale, getLocale);
  const localePreference = useSyncExternalStore(subscribe, getLocalePreference, getLocalePreference);

  return {
    locale,
    localePreference,
    localeTag: getLocaleTag(locale),
    setLocale,
    setLocalePreference,
    resetLocaleToSystem,
    t: (key: TranslationKey, params?: TranslationParams) => translate(key, params, locale),
    formatDate: (value: Date | string | number, options: Intl.DateTimeFormatOptions) =>
      formatDate(value, options, locale),
  };
}
