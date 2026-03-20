import React, { useEffect, useCallback } from 'react';
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
import { Pencil, Plus, Crown } from 'lucide-react-native';
import { HiveStackParamList } from '../../navigation/types';
import { useHiveStore } from '../../store/hiveStore';
import { useInspectionStore } from '../../store/inspectionStore';
import InspectionRow from '../../components/feature/InspectionRow';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { QueenStatus } from '../../types';

type Props = NativeStackScreenProps<HiveStackParamList, 'HiveDetail'>;

function queenBadgeColor(status: QueenStatus): 'success' | 'warning' | 'error' | 'muted' {
  switch (status) {
    case 'active': return 'success';
    case 'missing': return 'warning';
    case 'dead': return 'error';
    default: return 'muted';
  }
}

export default function HiveDetailScreen({ route, navigation }: Props) {
  const { hiveId } = route.params;
  const { hives, queens, removeHive, loadQueenForHive } = useHiveStore();
  const { hiveInspections, loadInspectionsForHive } = useInspectionStore();

  const hive = hives.find((h) => h.id === hiveId);
  const queen = queens[hiveId];
  const inspections = hiveInspections[hiveId] ?? [];

  useEffect(() => {
    loadQueenForHive(hiveId);
    loadInspectionsForHive(hiveId);
  }, [hiveId]);

  useEffect(() => {
    if (hive) {
      navigation.setOptions({
        title: hive.name,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('HiveForm', { hiveId })}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Pencil color={Colors.textSecondary} size={18} strokeWidth={1.5} />
          </TouchableOpacity>
        ),
      });
    }
  }, [hive]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Hive',
      `This will permanently delete "${hive?.name}" and all its inspections. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeHive(hiveId);
            navigation.goBack();
          },
        },
      ],
    );
  }, [hive, hiveId]);

  if (!hive) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hive meta */}
        <View style={styles.section}>
          <Text style={styles.hiveName}>{hive.name}</Text>
          <Text style={styles.hiveMeta}>{hive.type}</Text>
          {hive.notes ? <Text style={styles.notes}>{hive.notes}</Text> : null}
        </View>

        {/* Queen section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Queen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('QueenForm', { hiveId })}>
              <Text style={styles.linkText}>{queen ? 'Edit' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          {queen ? (
            <View style={styles.queenRow}>
              <Crown color={Colors.accent} size={16} strokeWidth={1.5} />
              <Text style={styles.queenText}>
                {queen.breed || 'Unknown breed'} · {queen.year || '?'}
              </Text>
              <Badge
                label={queen.status.charAt(0).toUpperCase() + queen.status.slice(1)}
                color={queenBadgeColor(queen.status)}
              />
            </View>
          ) : (
            <Text style={styles.emptyText}>No queen recorded</Text>
          )}
        </View>

        {/* Inspections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Inspections</Text>
            <TouchableOpacity onPress={() => navigation.navigate('InspectionForm', { hiveId })}>
              <Plus color={Colors.accent} size={18} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
          {inspections.length === 0 ? (
            <Text style={styles.emptyText}>No inspections recorded</Text>
          ) : (
            <View style={styles.inspectionList}>
              {inspections.map((insp) => (
                <InspectionRow
                  key={insp.id}
                  inspection={insp}
                  onPress={() =>
                    navigation.navigate('InspectionDetail', {
                      inspectionId: insp.id,
                      hiveId,
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* Delete */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Hive</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  hiveName: {
    fontFamily: 'Inter_300Light',
    fontSize: 26,
    color: Colors.textPrimary,
  },
  hiveMeta: {
    fontFamily: 'Inter_300Light',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notes: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontFamily: 'Inter_300Light',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
  linkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.accent,
  },
  queenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  queenText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  emptyText: {
    fontFamily: 'Inter_300Light',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  inspectionList: {
    borderTopWidth: 0.5,
    borderColor: Colors.border,
  },
  deleteButton: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  deleteText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.error,
  },
});
