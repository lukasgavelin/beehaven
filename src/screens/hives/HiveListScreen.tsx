import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { HiveStackParamList } from '../../navigation/types';
import { useHiveStore } from '../../store/hiveStore';
import { useInspectionStore } from '../../store/inspectionStore';
import HiveCard from '../../components/feature/HiveCard';
import EmptyState from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HiveStackParamList, 'HiveList'>;

export default function HiveListScreen({ navigation }: Props) {
  const { hives, queens, loading, loadHives, loadQueenForHive } = useHiveStore();
  const { hiveInspections, loadInspectionsForHive } = useInspectionStore();

  useEffect(() => {
    loadHives();
  }, []);

  useEffect(() => {
    hives.forEach((h) => {
      loadQueenForHive(h.id);
      loadInspectionsForHive(h.id);
    });
  }, [hives.length]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof hives)[0] }) => {
      const inspections = hiveInspections[item.id];
      const last = inspections?.[0]?.inspectedAt ?? null;
      return (
        <HiveCard
          hive={item}
          queen={queens[item.id]}
          lastInspectionDate={last}
          onPress={() => navigation.navigate('HiveDetail', { hiveId: item.id })}
        />
      );
    },
    [queens, hiveInspections],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={hives}
        keyExtractor={(h) => String(h.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              message="No hives yet"
              subMessage="Tap + to register your first hive"
            />
          )
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('HiveForm', {})}
        activeOpacity={0.85}
      >
        <Plus color={Colors.white} size={24} strokeWidth={1.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.base,
    flexGrow: 1,
  },
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
