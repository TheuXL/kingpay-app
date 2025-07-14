import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useColorScheme
} from 'react-native';
import { customTheme } from '../../theme/theme';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text
        style={[
          styles.title,
          {
            color: isDark 
              ? customTheme.colors.text.primary.dark 
              : customTheme.colors.text.primary.light,
          },
        ]}
      >
        {title}
      </Text>
      
      {description && (
        <Text
          style={[
            styles.description,
            {
              color: isDark
                ? customTheme.colors.text.secondary.dark
                : customTheme.colors.text.secondary.light,
            },
          ]}
        >
          {description}
        </Text>
      )}
      
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: customTheme.spacing.xl,
  },
  iconContainer: {
    marginBottom: customTheme.spacing.md,
  },
  title: {
    fontSize: customTheme.fontSizes.lg,
    fontWeight: '600', // Changed from string to numeric value
    textAlign: 'center',
    marginBottom: customTheme.spacing.sm,
  },
  description: {
    fontSize: customTheme.fontSizes.md,
    textAlign: 'center',
    marginBottom: customTheme.spacing.lg,
  },
  actionContainer: {
    marginTop: customTheme.spacing.md,
  },
}); 