import { MD3LightTheme, configureFonts } from 'react-native-paper';

// Our custom theme with all properties
export const customTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FFCC00',
    info: '#5AC8FA',
    light: '#F8F8F8',
    dark: '#1C1C1E',
    background: {
      light: '#F8F8F8',
      dark: '#121212',
    },
    card: {
      light: '#FFFFFF',
      dark: '#2C2C2E',
    },
    text: {
      primary: {
        light: '#000000',
        dark: '#FFFFFF',
      },
      secondary: {
        light: '#6C6C6C',
        dark: '#A0A0A0',
      },
    },
    border: {
      light: '#E0E0E0',
      dark: '#38383A',
    },
    error: '#FF3B30',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    round: 999,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
};

// Paper theme that follows the required structure
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: customTheme.colors.primary,
    secondary: customTheme.colors.secondary,
    error: customTheme.colors.error,
    background: customTheme.colors.background.light,
    surface: customTheme.colors.card.light,
    onSurface: customTheme.colors.text.primary.light,
    surfaceVariant: customTheme.colors.border.light,
  },
  fonts: configureFonts({
    config: {
      fontFamily: 'System',
    },
  }),
}; 