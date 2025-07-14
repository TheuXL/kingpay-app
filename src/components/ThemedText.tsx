import React from 'react';
import { Text, TextProps, TextStyle, useColorScheme } from 'react-native';
import { customTheme } from '../theme/theme';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'body' | 'caption';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  style, 
  children, 
  type,
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Define text styles based on type
  const getTypeStyles = (): TextStyle => {
    switch (type) {
      case 'title':
        return {
          fontSize: customTheme.fontSizes.xxl,
          fontWeight: '700', // Using string literal instead of theme.fontWeights.bold
          marginBottom: customTheme.spacing.sm,
        };
      case 'subtitle':
        return {
          fontSize: customTheme.fontSizes.lg,
          fontWeight: '600', // Using string literal instead of theme.fontWeights.semibold
          marginBottom: customTheme.spacing.xs,
        };
      case 'caption':
        return {
          fontSize: customTheme.fontSizes.xs,
          color: isDark 
            ? customTheme.colors.text.secondary.dark 
            : customTheme.colors.text.secondary.light,
        };
      default:
        return {
          fontSize: customTheme.fontSizes.md,
        };
    }
  };

  return (
    <Text
      style={[
        { 
          color: isDark 
            ? customTheme.colors.text.primary.dark 
            : customTheme.colors.text.primary.light 
        },
        getTypeStyles(),
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}; 