import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from './src/db';
import migrations from './src/db/migrations/migrations';
import RootNavigator from './src/navigation/RootNavigator';
import { setupNotificationChannel, requestNotificationPermission } from './src/services/notificationService';
import { Colors } from './src/theme/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
  });

  const { success: migrationsRun, error: migrationsError } = useMigrations(db, migrations);

  useEffect(() => {
    async function setup() {
      await setupNotificationChannel();
      await requestNotificationPermission();
    }
    setup();
  }, []);

  if (!fontsLoaded || !migrationsRun) {
    return (
      <View style={styles.loading}>
        {migrationsError ? (
          <Text style={styles.error}>DB Error: {String(migrationsError)}</Text>
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
