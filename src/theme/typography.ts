import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: {
    fontFamily: 'Inter_300Light',
    fontSize: 28,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Inter_300Light',
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: 'Inter_300Light',
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
