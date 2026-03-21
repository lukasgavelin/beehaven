import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Bell } from 'lucide-react-native';
import { Reminder } from '../../types';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { useI18n } from '../../i18n';

interface ReminderItemProps {
  reminder: Reminder;
  onToggleComplete: () => void;
  onPress: () => void;
}

export default function ReminderItem({ reminder, onToggleComplete, onPress }: ReminderItemProps) {
  const { formatDate } = useI18n();
  const isOverdue = !reminder.completed && new Date(reminder.dueAt) < new Date();
  const formattedDate = formatDate(reminder.dueAt, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={[styles.row, reminder.completed && styles.completedRow]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <TouchableOpacity
        style={[styles.checkbox, reminder.completed && styles.checkboxChecked]}
        onPress={onToggleComplete}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        {reminder.completed && <Check color={Colors.white} size={12} strokeWidth={2.5} />}
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={[styles.title, reminder.completed && styles.completedText]}>
          {reminder.title}
        </Text>
        <View style={styles.meta}>
          <Bell color={isOverdue ? Colors.error : Colors.textSecondary} size={11} strokeWidth={1.5} />
          <Text style={[styles.date, isOverdue && styles.overdueText]}>{formattedDate}</Text>
          {reminder.hiveName && (
            <>
              <Text style={styles.separator}>·</Text>
              <Text style={styles.hiveName}>{reminder.hiveName}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  completedRow: {
    opacity: 0.5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 0.75,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  date: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  overdueText: {
    color: Colors.error,
  },
  separator: {
    color: Colors.border,
    fontSize: 12,
  },
  hiveName: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
