import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: Variant;
  loading?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  style,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.base, styles[variant], style]} activeOpacity={0.75} {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.accent} size="small" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 0.75,
    borderColor: Colors.border,
  },
  destructive: {
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  destructiveText: {
    color: Colors.error,
  },
  ghostText: {
    color: Colors.textSecondary,
  },
});
