import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HiveStackParamList } from '../../navigation/types';
import { useHiveStore } from '../../store/hiveStore';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { QueenStatus } from '../../types';
import { getMarkColorLabel, getQueenStatusLabel, useI18n } from '../../i18n';

type Props = NativeStackScreenProps<HiveStackParamList, 'QueenForm'>;

const STATUSES: QueenStatus[] = ['active', 'missing', 'dead', 'replaced'];
const MARK_COLORS = ['W', 'Y', 'R', 'G', 'B'];

export default function QueenFormScreen({ route, navigation }: Props) {
  const { t, locale } = useI18n();
  const { hiveId } = route.params;
  const { queens, saveQueen } = useHiveStore();
  const existing = queens[hiveId];

  const [breed, setBreed] = useState(existing?.breed ?? '');
  const [year, setYear] = useState(existing?.year ? String(existing.year) : String(new Date().getFullYear()));
  const [markColor, setMarkColor] = useState(existing?.markColor ?? '');
  const [status, setStatus] = useState<QueenStatus>(existing?.status ?? 'active');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert(t('queenForm.invalidYearTitle'), t('queenForm.invalidYearMessage'));
      return;
    }
    setSaving(true);
    try {
      await saveQueen({ hiveId, breed, year: yearNum, markColor, status, notes });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TextInput label={t('queenForm.breedLabel')} value={breed} onChangeText={setBreed} placeholder={t('queenForm.breedPlaceholder')} />
        <TextInput
          label={t('queenForm.yearLabel')}
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          maxLength={4}
        />

        <Text style={styles.fieldLabel}>{t('queenForm.markColourLabel')}</Text>
        <View style={styles.chipRow}>
          {MARK_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, markColor === c && styles.chipActive]}
              onPress={() => setMarkColor(c)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, markColor === c && styles.chipTextActive]}>
                {c} - {getMarkColorLabel(c, locale)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>{t('queenForm.statusLabel')}</Text>
        <View style={styles.chipRow}>
          {STATUSES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, status === s && styles.chipActive]}
              onPress={() => setStatus(s)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, status === s && styles.chipTextActive]}>
                {getQueenStatusLabel(s, locale)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          label={t('queenForm.notesLabel')}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('queenForm.notesPlaceholder')}
          multiline
          numberOfLines={3}
          style={{ marginTop: Spacing.md, minHeight: 60, paddingTop: 8 }}
        />

        <Button
          title={t('common.saveQueen')}
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: Spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  fieldLabel: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 0.75,
    borderColor: Colors.border,
  },
  chipActive: {
    borderColor: Colors.accent,
    backgroundColor: '#FEF6E4',
  },
  chipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.accent,
  },
});
