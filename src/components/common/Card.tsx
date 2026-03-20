import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function Card({ children, noPadding, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, noPadding && styles.noPadding, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  noPadding: {
    padding: 0,
  },
});
