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
import { HiveType } from '../../types';
import { getHiveTypeLabel, useI18n } from '../../i18n';

type Props = NativeStackScreenProps<HiveStackParamList, 'HiveForm'>;

const HIVE_TYPES: HiveType[] = ['Langstroth', 'Dadant', 'Warré', 'Nucleus'];
const COLOR_OPTIONS = ['', '#F5C842', '#DDDDDD', '#E05252', '#5279E0', '#52A86E'];

export default function HiveFormScreen({ route, navigation }: Props) {
  const { t, locale } = useI18n();
  const { hiveId } = route.params ?? {};
  const { hives, addHive, editHive, removeHive } = useHiveStore();
  const existing = hiveId ? hives.find((h) => h.id === hiveId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<HiveType>(existing?.type ?? 'Langstroth');
  const [colorMark, setColorMark] = useState(existing?.colorMark ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('hiveForm.nameRequiredTitle'), t('hiveForm.nameRequiredMessage'));
      return;
    }
    setSaving(true);
    try {
      if (existing) {
        await editHive(existing.id, { name: name.trim(), type, colorMark, notes });
        navigation.goBack();
      } else {
        const hive = await addHive({ name: name.trim(), type, colorMark, notes });
        navigation.replace('HiveDetail', { hiveId: hive.id });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TextInput
          label={t('hiveForm.nameLabel')}
          value={name}
          onChangeText={setName}
          placeholder={t('hiveForm.namePlaceholder')}
          autoFocus={!existing}
        />

        {/* Hive Type */}
        <Text style={styles.fieldLabel}>{t('hiveForm.typeLabel')}</Text>
        <View style={styles.typeRow}>
          {HIVE_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, type === t && styles.typeChipActive]}
              onPress={() => setType(t)}
              activeOpacity={0.8}
            >
              <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{getHiveTypeLabel(t, locale)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Queen mark color */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>{t('hiveForm.queenMarkColourLabel')}</Text>
        <View style={styles.colorRow}>
          {COLOR_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt || 'none'}
              style={[
                styles.colorSwatch,
                opt ? { backgroundColor: opt } : styles.emptyColor,
                colorMark === opt && styles.colorSwatchActive,
              ]}
              onPress={() => setColorMark(opt)}
              activeOpacity={0.8}
            />
          ))}
        </View>

        <TextInput
          label={t('hiveForm.notesLabel')}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('hiveForm.notesPlaceholder')}
          multiline
          numberOfLines={4}
          style={{ minHeight: 80, paddingTop: 8 }}
        />

        <Button
          title={existing ? t('common.saveChanges') : t('common.createHive')}
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
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 0.75,
    borderColor: Colors.border,
  },
  typeChipActive: {
    borderColor: Colors.accent,
    backgroundColor: '#FEF6E4',
  },
  typeChipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  typeChipTextActive: {
    color: Colors.accent,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  emptyColor: {
    backgroundColor: Colors.background,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  colorSwatchActive: {
    borderWidth: 2.5,
    borderColor: Colors.accent,
  },
});
