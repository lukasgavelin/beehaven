import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { getWeatherConditionLabel, useI18n } from '../../i18n';

interface WeatherChipProps {
  temp: number;
  condition: string;
  humidity: number;
}

function WeatherIcon({ condition, size = 14 }: { condition: string; size?: number }) {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sun')) return <Sun color={Colors.warning} size={size} strokeWidth={1.5} />;
  if (c.includes('rain') || c.includes('shower')) return <CloudRain color={Colors.accent} size={size} strokeWidth={1.5} />;
  if (c.includes('snow')) return <Snowflake color='#7EB4D5' size={size} strokeWidth={1.5} />;
  if (c.includes('thunder')) return <CloudLightning color={Colors.error} size={size} strokeWidth={1.5} />;
  return <Cloud color={Colors.textSecondary} size={size} strokeWidth={1.5} />;
}

export default function WeatherChip({ temp, condition, humidity }: WeatherChipProps) {
  const { t, locale } = useI18n();

  return (
    <View style={styles.chip}>
      <WeatherIcon condition={condition} />
      <Text style={styles.text}>
        {temp}°C · {getWeatherConditionLabel(condition, locale)} · {humidity}% {t('weather.humidity')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
