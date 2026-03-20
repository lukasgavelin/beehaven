import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MapPin } from 'lucide-react-native';
import { HiveStackParamList } from '../../navigation/types';
import { useInspectionStore } from '../../store/inspectionStore';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import WeatherChip from '../../components/feature/WeatherChip';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { BroodStatus, HoneyStore, WeatherData } from '../../types';
import { getCurrentCoords } from '../../services/locationService';
import { fetchWeather } from '../../services/weatherService';

type Props = NativeStackScreenProps<HiveStackParamList, 'InspectionForm'>;

const BROOD_OPTIONS: BroodStatus[] = ['good', 'capped', 'larvae', 'eggs', 'missing'];
const HONEY_OPTIONS: HoneyStore[] = ['full', 'adequate', 'low', 'empty'];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function InspectionFormScreen({ route, navigation }: Props) {
  const { hiveId } = route.params;
  const { addInspection } = useInspectionStore();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [queenSeen, setQueenSeen] = useState(false);
  const [broodStatus, setBroodStatus] = useState<BroodStatus>('good');
  const [honeyStores, setHoneyStores] = useState<HoneyStore>('adequate');
  const [temper, setTemper] = useState(3);
  const [varroaCount, setVarroaCount] = useState('0');
  const [notes, setNotes] = useState('');

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFetchWeather = async () => {
    setFetchingWeather(true);
    try {
      const coords = await getCurrentCoords();
      if (!coords) {
        Alert.alert('Location unavailable', 'Please enable location access in device settings.');
        return;
      }
      const data = await fetchWeather(coords.lat, coords.lon);
      setWeather(data);
    } catch {
      Alert.alert('Error', 'Could not fetch weather. Check your internet connection.');
    } finally {
      setFetchingWeather(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await addInspection({
        hiveId,
        inspectedAt: date.toISOString(),
        notes,
        queenSeen,
        broodStatus,
        honeyStores,
        temper,
        varroaCount: parseInt(varroaCount, 10) || 0,
        weatherTemp: weather?.temp ?? null,
        weatherCondition: weather?.condition ?? null,
        weatherHumidity: weather?.humidity ?? null,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Date */}
        <Text style={styles.fieldLabel}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dateText}>
            {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* Queen seen */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Queen seen</Text>
        <View style={styles.toggleRow}>
          {[true, false].map((v) => (
            <TouchableOpacity
              key={String(v)}
              style={[styles.chip, queenSeen === v && styles.chipActive]}
              onPress={() => setQueenSeen(v)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, queenSeen === v && styles.chipTextActive]}>
                {v ? 'Yes' : 'No'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Brood status */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Brood status</Text>
        <View style={styles.chipRow}>
          {BROOD_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, broodStatus === opt && styles.chipActive]}
              onPress={() => setBroodStatus(opt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, broodStatus === opt && styles.chipTextActive]}>
                {capitalize(opt)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Honey stores */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Honey stores</Text>
        <View style={styles.chipRow}>
          {HONEY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, honeyStores === opt && styles.chipActive]}
              onPress={() => setHoneyStores(opt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, honeyStores === opt && styles.chipTextActive]}>
                {capitalize(opt)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Temper */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Temper</Text>
        <View style={styles.temperRow}>
          {[1, 2, 3, 4, 5].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.temperDot, temper === v && styles.temperDotActive]}
              onPress={() => setTemper(v)}
              activeOpacity={0.8}
            >
              <Text style={[styles.temperText, temper === v && styles.temperTextActive]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.temperHint}>
          {temper === 1 ? 'Very calm' : temper === 2 ? 'Calm' : temper === 3 ? 'Neutral' : temper === 4 ? 'Defensive' : 'Aggressive'}
        </Text>

        {/* Varroa */}
        <TextInput
          label="Varroa count"
          value={varroaCount}
          onChangeText={setVarroaCount}
          keyboardType="numeric"
          style={{ marginTop: Spacing.sm }}
        />

        {/* Notes */}
        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Observations, concerns, actions taken..."
          multiline
          numberOfLines={4}
          style={{ minHeight: 80, paddingTop: 8 }}
        />

        {/* Weather */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Weather</Text>
        {weather ? (
          <View style={styles.weatherRow}>
            <WeatherChip temp={weather.temp} condition={weather.condition} humidity={weather.humidity} />
            <TouchableOpacity onPress={handleFetchWeather} style={{ marginTop: 8 }}>
              <Text style={styles.refetchText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.weatherBtn}
            onPress={handleFetchWeather}
            activeOpacity={0.8}
          >
            {fetchingWeather ? (
              <ActivityIndicator size="small" color={Colors.textSecondary} />
            ) : (
              <>
                <MapPin color={Colors.textSecondary} size={14} strokeWidth={1.5} />
                <Text style={styles.weatherBtnText}>Fetch current weather</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <Button
          title="Save Inspection"
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
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chipRow: {
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
  temperRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  temperDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.75,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperDotActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  temperText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
  },
  temperTextActive: {
    color: Colors.white,
  },
  temperHint: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  weatherRow: {
    gap: Spacing.xs,
  },
  weatherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 0.75,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
  },
  weatherBtnText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  refetchText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.accent,
  },
});
