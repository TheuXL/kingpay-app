import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { customTheme } from '../theme/theme';

interface ThemedViewProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'card';
}

export const ThemedView: React.FC<ThemedViewProps> = ({ 
  style, 
  children, 
  variant,
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Define background colors based on variant and theme
  const getBackgroundColor = () => {
    if (isDark) {
      switch (variant) {
        case 'primary':
          return customTheme.colors.background.dark;
        case 'secondary':
          return '#2a2a2a'; // Slightly lighter than main background
        case 'card':
          return customTheme.colors.card.dark;
        default:
          return customTheme.colors.background.dark;
      }
    } else {
      switch (variant) {
        case 'primary':
          return customTheme.colors.background.light;
        case 'secondary':
          return customTheme.colors.secondary;
        case 'card':
          return customTheme.colors.card.light;
        default:
          return customTheme.colors.background.light;
      }
    }
  };

  return (
    <View
      style={[
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}; 