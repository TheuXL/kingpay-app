import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ApprovalBarProps {
  label: string;
  percentage: number;
  color: string;
  icon?: React.ReactNode;
}

const ApprovalBar: React.FC<ApprovalBarProps> = ({
  label,
  percentage,
  color,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
      </View>
      
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color,
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  barBackground: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radius.sm,
  },
});

export default ApprovalBar;
