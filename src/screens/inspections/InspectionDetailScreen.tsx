import React, { useCallback } from 'react';
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
import { Trash2 } from 'lucide-react-native';
import { HiveStackParamList } from '../../navigation/types';
import { InspectionsStackParamList } from '../../navigation/types';
import { useInspectionStore } from '../../store/inspectionStore';
import WeatherChip from '../../components/feature/WeatherChip';
import Badge from '../../components/common/Badge';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { BroodStatus } from '../../types';

type Props =
  | NativeStackScreenProps<HiveStackParamList, 'InspectionDetail'>
  | NativeStackScreenProps<InspectionsStackParamList, 'InspectionDetail'>;

function broodBadgeColor(status: BroodStatus): 'success' | 'warning' | 'error' {
  if (status === 'good') return 'success';
  if (status === 'missing') return 'error';
  return 'warning';
}

export default function InspectionDetailScreen({ route, navigation }: Props) {
  const { inspectionId, hiveId } = route.params as { inspectionId: number; hiveId: number };
  const { inspections, hiveInspections, removeInspection } = useInspectionStore();

  const allInspections = [...inspections, ...(hiveInspections[hiveId] ?? [])];
  const inspection = allInspections.find((i) => i.id === inspectionId);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Inspection', 'This inspection will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeInspection(inspectionId, hiveId);
          navigation.goBack();
        },
      },
    ]);
  }, [inspectionId, hiveId]);

  if (!inspection) return null;

  const date = new Date(inspection.inspectedAt).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.date}>{date}</Text>
          <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Trash2 color={Colors.error} size={18} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {/* Status row */}
        <View style={styles.badgeRow}>
          <Badge
            label={`Brood: ${inspection.broodStatus}`}
            color={broodBadgeColor(inspection.broodStatus)}
          />
          <Badge
            label={`Honey: ${inspection.honeyStores}`}
            color={inspection.honeyStores === 'empty' ? 'error' : inspection.honeyStores === 'low' ? 'warning' : 'success'}
          />
          <Badge
            label={inspection.queenSeen ? 'Queen seen' : 'Queen not seen'}
            color={inspection.queenSeen ? 'success' : 'warning'}
          />
        </View>

        {/* Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Temper</Text>
            <Text style={styles.detailValue}>{describeTemper(inspection.temper)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Varroa count</Text>
            <Text style={styles.detailValue}>{inspection.varroaCount}</Text>
          </View>
        </View>

        {/* Weather */}
        {inspection.weatherTemp !== null && inspection.weatherCondition && inspection.weatherHumidity !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Weather at inspection</Text>
            <WeatherChip
              temp={inspection.weatherTemp}
              condition={inspection.weatherCondition}
              humidity={inspection.weatherHumidity}
            />
          </View>
        )}

        {/* Notes */}
        {inspection.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.notesText}>{inspection.notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function describeTemper(temper: number): string {
  switch (temper) {
    case 1: return '1 — Very calm';
    case 2: return '2 — Calm';
    case 3: return '3 — Neutral';
    case 4: return '4 — Defensive';
    case 5: return '5 — Aggressive';
    default: return String(temper);
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  date: {
    fontFamily: 'Inter_300Light',
    fontSize: 20,
    color: Colors.textPrimary,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter_300Light',
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: 'Inter_300Light',
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  notesText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});
