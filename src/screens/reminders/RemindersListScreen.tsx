import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { RemindersStackParamList } from '../../navigation/types';
import { useReminderStore } from '../../store/reminderStore';
import { cancelReminder } from '../../services/notificationService';
import ReminderItem from '../../components/feature/ReminderItem';
import EmptyState from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Reminder } from '../../types';
import { useI18n } from '../../i18n';

type Props = NativeStackScreenProps<RemindersStackParamList, 'RemindersList'>;

export default function RemindersListScreen({ navigation }: Props) {
  const { t } = useI18n();
  const { reminders, loading, loadReminders, toggleComplete, removeReminder } = useReminderStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadReminders);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = useCallback(
    (reminder: Reminder) => {
      Alert.alert(t('reminder.list.deleteTitle'), t('reminder.list.deleteMessage', { title: reminder.title }), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            if (reminder.notificationId) {
              await cancelReminder(reminder.notificationId);
            }
            await removeReminder(reminder.id);
          },
        },
      ]);
    },
    [removeReminder, t],
  );

  const pending = reminders.filter((r) => !r.completed);
  const done = reminders.filter((r) => r.completed);
  const sorted = [...pending, ...done];

  const renderItem = useCallback(
    ({ item }: { item: Reminder }) => (
      <ReminderItem
        reminder={item}
        onToggleComplete={() => toggleComplete(item.id, !item.completed)}
        onPress={() => handleDelete(item)}
      />
    ),
    [reminders],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={(r) => String(r.id)}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              message={t('empty.noRemindersTitle')}
              subMessage={t('empty.noRemindersSubtitle')}
            />
          )
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ReminderForm', {})}
        activeOpacity={0.85}
      >
        <Plus color={Colors.white} size={24} strokeWidth={1.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
});
