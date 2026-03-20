import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/spacing';

type BadgeColor = 'default' | 'success' | 'warning' | 'error' | 'muted';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
}

export default function Badge({ label, color = 'default' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[color]]}>
      <Text style={[styles.text, styles[`${color}Text`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  default: { backgroundColor: '#F0F0F0' },
  defaultText: { color: Colors.textSecondary },
  success: { backgroundColor: '#EBF7F1' },
  successText: { color: Colors.success },
  warning: { backgroundColor: '#FEF6E4' },
  warningText: { color: '#B07800' },
  error: { backgroundColor: '#FDECEC' },
  errorText: { color: Colors.error },
  muted: { backgroundColor: '#F0F0F0' },
  mutedText: { color: Colors.textSecondary },
});
