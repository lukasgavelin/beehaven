import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

import Card from '../../components/common/Card';
import LanguagePickerRow from '../../components/common/LanguagePickerRow';
import { useI18n } from '../../i18n';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function OptionsScreen() {
  const { t } = useI18n();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const appId =
    Constants.expoConfig?.ios?.bundleIdentifier ??
    Constants.expoConfig?.android?.package ??
    'com.beehaven.app';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('options.languagesSection')}</Text>
          <Card>
            <LanguagePickerRow />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('options.aboutSection')}</Text>
          <Card>
            <Text style={styles.appName}>{t('options.appName')}</Text>
            <Text style={styles.appDescription}>{t('options.appDescription')}</Text>

            <View style={styles.divider} />

            <DetailRow label={t('options.versionLabel')} value={version} />
            <DetailRow label={t('options.appIdLabel')} value={appId} />
            <DetailRow label={t('options.storageLabel')} value={t('options.storageValue')} />
            <DetailRow label={t('options.notificationsLabel')} value={t('options.notificationsValue')} />
            <DetailRow label={t('options.weatherSourceLabel')} value={t('options.weatherSourceValue')} />
            <DetailRow label={t('options.privacyLabel')} value={t('options.privacyValue')} />
            <DetailRow label={t('options.frameworkLabel')} value={t('options.frameworkValue')} />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: 'Inter_300Light',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  appName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  appDescription: {
    fontFamily: 'Inter_300Light',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    fontFamily: 'Inter_300Light',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: Spacing.md,
  },
});