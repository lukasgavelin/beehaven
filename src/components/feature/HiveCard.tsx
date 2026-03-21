import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Hive, Queen } from '../../types';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { formatDate, getHiveTypeLabel, translate, useI18n } from '../../i18n';

interface HiveCardProps {
  hive: Hive;
  queen?: Queen | null;
  lastInspectionDate?: string | null;
  onPress: () => void;
}

function queenStatusColor(status?: string): string {
  switch (status) {
    case 'active': return Colors.success;
    case 'missing': return Colors.warning;
    case 'dead': return Colors.error;
    default: return Colors.textSecondary;
  }
}

export default function HiveCard({ hive, queen, lastInspectionDate, onPress }: HiveCardProps) {
  const { locale } = useI18n();
  const formattedDate = lastInspectionDate
    ? formatDate(lastInspectionDate, { day: 'numeric', month: 'short', year: 'numeric' }, locale)
    : translate('empty.noInspectionsTitle', undefined, locale);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        {hive.colorMark ? (
          <View style={[styles.colorDot, { backgroundColor: hive.colorMark }]} />
        ) : (
          <View style={[styles.colorDot, { backgroundColor: Colors.border }]} />
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{hive.name}</Text>
          <Text style={styles.meta}>{getHiveTypeLabel(hive.type, locale)}</Text>
          <View style={styles.footer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
            {queen && (
              <View style={[styles.queenDot, { backgroundColor: queenStatusColor(queen.status) }]} />
            )}
          </View>
        </View>
        <ChevronRight color={Colors.border} size={18} strokeWidth={1.5} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter_300Light',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  meta: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  dateText: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  queenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
