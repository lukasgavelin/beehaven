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
import DateTimePicker from '@react-native-community/datetimepicker';
import { RemindersStackParamList } from '../../navigation/types';
import { useReminderStore } from '../../store/reminderStore';
import { useHiveStore } from '../../store/hiveStore';
import { scheduleReminder } from '../../services/notificationService';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { useI18n } from '../../i18n';

type Props = NativeStackScreenProps<RemindersStackParamList, 'ReminderForm'>;

export default function ReminderFormScreen({ navigation }: Props) {
  const { t, formatDate, localeTag } = useI18n();
  const { addReminder } = useReminderStore();
  const { hives } = useHiveStore();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHiveId, setSelectedHiveId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('reminder.form.titleRequiredTitle'), t('reminder.form.titleRequiredMessage'));
      return;
    }
    setSaving(true);
    try {
      const notifId = await scheduleReminder(title.trim(), notes, dueDate);
      await addReminder({
        hiveId: selectedHiveId,
        title: title.trim(),
        notes,
        dueAt: dueDate.toISOString(),
        notificationId: notifId,
      });
      navigation.goBack();
    } catch {
      Alert.alert(t('reminder.form.saveErrorTitle'), t('reminder.form.saveErrorMessage'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TextInput
          label={t('reminder.form.titleLabel')}
          value={title}
          onChangeText={setTitle}
          placeholder={t('reminder.form.titlePlaceholder')}
          autoFocus
        />
        <TextInput
          label={t('reminder.form.notesLabel')}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('reminder.form.notesPlaceholder')}
          multiline
          numberOfLines={3}
          style={{ minHeight: 60, paddingTop: 8 }}
        />

        {/* Date */}
        <Text style={styles.fieldLabel}>{t('reminder.form.dueDateLabel')}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dateText}>
            {formatDate(dueDate, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) {
                const next = new Date(selected);
                next.setHours(dueDate.getHours(), dueDate.getMinutes());
                setDueDate(next);
                setShowTimePicker(true);
              }
            }}
          />
        )}

        {/* Time */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>{t('reminder.form.dueTimeLabel')}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dateText}>
            {new Intl.DateTimeFormat(localeTag, { hour: '2-digit', minute: '2-digit' }).format(dueDate)}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            display="default"
            onChange={(_, selected) => {
              setShowTimePicker(false);
              if (selected) setDueDate(selected);
            }}
          />
        )}

        {/* Hive selector */}
        {hives.length > 0 && (
          <>
            <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>{t('reminder.form.linkToHiveLabel')}</Text>
            <View style={styles.hiveChips}>
              <TouchableOpacity
                style={[styles.chip, selectedHiveId === null && styles.chipActive]}
                onPress={() => setSelectedHiveId(null)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, selectedHiveId === null && styles.chipTextActive]}>
                  {t('common.none')}
                </Text>
              </TouchableOpacity>
              {hives.map((h) => (
                <TouchableOpacity
                  key={h.id}
                  style={[styles.chip, selectedHiveId === h.id && styles.chipActive]}
                  onPress={() => setSelectedHiveId(h.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, selectedHiveId === h.id && styles.chipTextActive]}>
                    {h.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Button
          title={t('common.saveReminder')}
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: Spacing.xl }}
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
  dateButton: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.75,
    borderBottomColor: Colors.border,
  },
  dateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  hiveChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
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
