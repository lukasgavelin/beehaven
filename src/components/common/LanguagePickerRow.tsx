import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { getLanguageOption, getLocaleFlag, getSupportedLanguages, useI18n } from '../../i18n';

export default function LanguagePickerRow() {
  const { locale, localePreference, setLocalePreference, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const languageOptions = useMemo(() => getSupportedLanguages(), []);
  const selectedLabel =
    localePreference === 'system' ? t('common.system') : getLanguageOption(localePreference).nativeLabel;

  return (
    <>
      <TouchableOpacity
        accessibilityLabel={t('options.languagesLabel')}
        activeOpacity={0.8}
        onPress={() => setIsOpen(true)}
        style={styles.trigger}
      >
        <View style={styles.triggerTextWrap}>
          <Text style={styles.triggerLabel}>{t('options.languagesLabel')}</Text>
          <Text style={styles.triggerDescription}>{selectedLabel}</Text>
        </View>
        <View style={styles.triggerMeta}>
          <Text style={styles.triggerFlag}>{getLocaleFlag(locale)}</Text>
          <ChevronRight color={Colors.border} size={16} strokeWidth={1.5} />
        </View>
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.title}>{t('language.menuTitle')}</Text>
            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  void setLocalePreference('system');
                  setIsOpen(false);
                }}
                style={[styles.row, localePreference === 'system' && styles.rowActive]}
              >
                <Text style={styles.rowFlag}>{getLocaleFlag(locale)}</Text>
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowTitle}>{t('common.system')}</Text>
                  <Text style={styles.rowSubtitle}>{t('language.systemDescription')}</Text>
                </View>
                {localePreference === 'system' ? <Text style={styles.check}>✓</Text> : null}
              </TouchableOpacity>

              {languageOptions.map((option) => {
                const isActive = localePreference === option.code;

                return (
                  <TouchableOpacity
                    key={option.code}
                    activeOpacity={0.8}
                    onPress={() => {
                      void setLocalePreference(option.code);
                      setIsOpen(false);
                    }}
                    style={[styles.row, isActive && styles.rowActive]}
                  >
                    <Text style={styles.rowFlag}>{option.flag}</Text>
                    <View style={styles.rowTextWrap}>
                      <Text style={styles.rowTitle}>{option.nativeLabel}</Text>
                      <Text style={styles.rowSubtitle}>{option.label}</Text>
                    </View>
                    {isActive ? <Text style={styles.check}>✓</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  triggerTextWrap: {
    flex: 1,
    marginRight: Spacing.md,
  },
  triggerLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  triggerDescription: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  triggerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  triggerFlag: {
    fontSize: 18,
    lineHeight: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 17, 0.32)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xl,
  },
  sheet: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    maxHeight: '80%',
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xs,
  },
  rowActive: {
    backgroundColor: '#FEF6E4',
  },
  rowFlag: {
    fontSize: 20,
    lineHeight: 24,
    marginRight: Spacing.md,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  rowSubtitle: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  check: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.accent,
  },
});