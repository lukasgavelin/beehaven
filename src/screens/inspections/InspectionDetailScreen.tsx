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
import { getBroodStatusLabel, getHoneyStoreLabel, getTemperLabel, useI18n } from '../../i18n';

type Props =
  | NativeStackScreenProps<HiveStackParamList, 'InspectionDetail'>
  | NativeStackScreenProps<InspectionsStackParamList, 'InspectionDetail'>;

function broodBadgeColor(status: BroodStatus): 'success' | 'warning' | 'error' {
  if (status === 'good') return 'success';
  if (status === 'missing') return 'error';
  return 'warning';
}

export default function InspectionDetailScreen({ route, navigation }: Props) {
  const { t, formatDate, locale } = useI18n();
  const { inspectionId, hiveId } = route.params as { inspectionId: number; hiveId: number };
  const { inspections, hiveInspections, removeInspection } = useInspectionStore();

  const allInspections = [...inspections, ...(hiveInspections[hiveId] ?? [])];
  const inspection = allInspections.find((i) => i.id === inspectionId);

  const handleDelete = useCallback(() => {
    Alert.alert(t('inspection.detail.deleteTitle'), t('inspection.detail.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await removeInspection(inspectionId, hiveId);
          navigation.goBack();
        },
      },
    ]);
  }, [hiveId, inspectionId, navigation, removeInspection, t]);

  if (!inspection) return null;

  const date = formatDate(inspection.inspectedAt, {
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
            label={t('inspection.detail.broodBadge', { status: getBroodStatusLabel(inspection.broodStatus, locale) })}
            color={broodBadgeColor(inspection.broodStatus)}
          />
          <Badge
            label={t('inspection.detail.honeyBadge', { level: getHoneyStoreLabel(inspection.honeyStores, locale) })}
            color={inspection.honeyStores === 'empty' ? 'error' : inspection.honeyStores === 'low' ? 'warning' : 'success'}
          />
          <Badge
            label={inspection.queenSeen ? t('inspection.detail.queenSeen') : t('inspection.detail.queenNotSeen')}
            color={inspection.queenSeen ? 'success' : 'warning'}
          />
        </View>

        {/* Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('inspection.detail.temperLabel')}</Text>
            <Text style={styles.detailValue}>{inspection.temper} - {getTemperLabel(inspection.temper, locale)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('inspection.detail.varroaCountLabel')}</Text>
            <Text style={styles.detailValue}>{inspection.varroaCount}</Text>
          </View>
        </View>

        {/* Weather */}
        {inspection.weatherTemp !== null && inspection.weatherCondition && inspection.weatherHumidity !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('inspection.detail.weatherLabel')}</Text>
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
            <Text style={styles.sectionLabel}>{t('inspection.detail.notesLabel')}</Text>
            <Text style={styles.notesText}>{inspection.notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
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
