import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import * as LucideIcons from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';

type EmptyStateProps = {
  icon: keyof typeof LucideIcons;
  message: string;
  description?: string;
  style?: object;
};

export const EmptyState = ({ icon, message, description, style }: EmptyStateProps) => {
  const IconComponent = LucideIcons[icon] as React.ElementType;

  return (
    <View style={[styles.container, style]}>
      {IconComponent && <IconComponent size={40} color={colors.gray} />}
      <AppText size="lg" weight="bold" style={styles.message}>
        {message}
      </AppText>
      {description && (
        <AppText color="gray" align="center">
          {description}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 8,
    minHeight: 150,
  },
  message: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
}); 