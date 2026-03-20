import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectionsStackParamList } from '../../navigation/types';
import { useInspectionStore } from '../../store/inspectionStore';
import InspectionRow from '../../components/feature/InspectionRow';
import EmptyState from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Inspection } from '../../types';

type Props = NativeStackScreenProps<InspectionsStackParamList, 'InspectionsList'>;

function groupByMonth(inspections: Inspection[]): { title: string; data: Inspection[] }[] {
  const map = new Map<string, Inspection[]>();
  for (const insp of inspections) {
    const date = new Date(insp.inspectedAt);
    const key = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(insp);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

export default function InspectionsListScreen({ navigation }: Props) {
  const { inspections, loading, loadAllInspections } = useInspectionStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAllInspections);
    return unsubscribe;
  }, [navigation]);

  const sections = groupByMonth(inspections);

  const renderItem = useCallback(
    ({ item }: { item: Inspection }) => (
      <InspectionRow
        inspection={item}
        showHiveName
        onPress={() =>
          navigation.navigate('InspectionDetail', {
            inspectionId: item.id,
            hiveId: item.hiveId,
          })
        }
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              message="No inspections yet"
              subMessage="Open a hive and add your first inspection"
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  sectionHeader: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: 'Inter_300Light',
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
