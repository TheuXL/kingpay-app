import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { colors, theme } from '@/theme/colors';

type TextSize = 'sm' | 'md' | 'lg' | 'xl';
type TextWeight = 'normal' | 'semibold' | 'bold';
type TextColor = keyof typeof colors;
type TextAlign = 'left' | 'center' | 'right';

interface AppTextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  style?: StyleProp<TextStyle>;
}

export function AppText({
  children,
  size = 'md',
  weight = 'normal',
  color = 'textPrimary',
  align = 'left',
  style,
}: AppTextProps) {
  const styles = StyleSheet.create({
    text: {
      fontSize: theme.fontSize[size],
      fontWeight: theme.fontWeight[weight],
      color: colors[color],
      textAlign: align,
    },
  });

  return <Text style={[styles.text, style]}>{children}</Text>;
} 