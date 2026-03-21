import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Inspection } from '../../types';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { formatDate, getBroodStatusLabel, getHoneyStoreLabel, translate, useI18n } from '../../i18n';

interface InspectionRowProps {
  inspection: Inspection;
  showHiveName?: boolean;
  onPress: () => void;
}

function broodColor(status: string): string {
  switch (status) {
    case 'good': return Colors.success;
    case 'larvae':
    case 'capped':
    case 'eggs': return Colors.warning;
    case 'missing': return Colors.error;
    default: return Colors.textSecondary;
  }
}

export default function InspectionRow({ inspection, showHiveName, onPress }: InspectionRowProps) {
  const { locale } = useI18n();
  const day = formatDate(inspection.inspectedAt, { day: 'numeric', month: 'short' }, locale);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.dateBlock}>
        <Text style={styles.dateText}>{day}</Text>
      </View>
      <View style={styles.content}>
        {showHiveName && inspection.hiveName && (
          <Text style={styles.hiveName}>{inspection.hiveName}</Text>
        )}
        <View style={styles.chips}>
          <View style={[styles.dot, { backgroundColor: broodColor(inspection.broodStatus) }]} />
          <Text style={styles.chipText}>
            {getBroodStatusLabel(inspection.broodStatus, locale)} {translate('inspection.row.broodSuffix', undefined, locale)}
          </Text>
          <Text style={styles.separator}>·</Text>
          <Text style={styles.chipText}>{getHoneyStoreLabel(inspection.honeyStores, locale)} {translate('inspection.row.honeySuffix', undefined, locale)}</Text>
        </View>
        {inspection.notes ? <Text style={styles.notes} numberOfLines={1}>{inspection.notes}</Text> : null}
      </View>
      <ChevronRight color={Colors.border} size={16} strokeWidth={1.5} />
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
  },
  dateBlock: {
    width: 48,
    marginRight: Spacing.md,
  },
  dateText: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  hiveName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  separator: {
    color: Colors.border,
    fontSize: 12,
  },
  notes: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
