import './global.css';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from './src/db';
import migrations from './src/db/migrations/migrations';
import RootNavigator from './src/navigation/RootNavigator';
import { setupNotificationChannel, requestNotificationPermission } from './src/services/notificationService';
import { Colors } from './src/theme/colors';
import { initializeI18n, useI18n } from './src/i18n';

export default function App() {
  const { t } = useI18n();
  const [i18nReady, setI18nReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
  });

  const { success: migrationsRun, error: migrationsError } = useMigrations(db, migrations);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      try {
        await initializeI18n();
      } finally {
        if (isMounted) {
          setI18nReady(true);
        }
      }

      void setupNotificationChannel().catch(() => undefined);
      void requestNotificationPermission().catch(() => false);
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!fontsLoaded || !migrationsRun || !i18nReady) {
    return (
      <View style={styles.loading}>
        {migrationsError ? (
          <Text style={styles.error}>{t('app.dbError', { error: String(migrationsError) })}</Text>
        ) : (
          <ActivityIndicator color={Colors.accent} size="large" />
        )}
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontFamily: 'System',
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    padding: 24,
  },
});
