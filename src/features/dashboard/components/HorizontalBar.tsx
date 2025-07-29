import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BarSegment {
  label: string;
  value: number;
  color: string;
  backgroundColor?: string;
}

interface HorizontalBarProps {
  segments: BarSegment[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  formatValue?: (value: number) => string;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({
  segments,
  height = 8,
  showLabels = true,
  showValues = true,
  formatValue = (value) => value.toString(),
}) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <View style={styles.container}>
      {/* Barra principal */}
      <View style={[styles.bar, { height }]}>
        {segments.map((segment, index) => {
          const percentage = total > 0 ? (segment.value / total) * 100 : 0;
          
          return (
            <View
              key={index}
              style={[
                styles.segment,
                {
                  width: `${percentage}%`,
                  backgroundColor: segment.color,
                  borderTopLeftRadius: index === 0 ? radius.sm : 0,
                  borderBottomLeftRadius: index === 0 ? radius.sm : 0,
                  borderTopRightRadius: index === segments.length - 1 ? radius.sm : 0,
                  borderBottomRightRadius: index === segments.length - 1 ? radius.sm : 0,
                }
              ]}
            />
          );
        })}
      </View>

      {/* Legendas */}
      {showLabels && (
        <View style={styles.legendContainer}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
              <Text style={styles.legendLabel}>{segment.label}</Text>
              {showValues && (
                <Text style={styles.legendValue}>{formatValue(segment.value)}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  segment: {
    minWidth: 1, // Garante que segmentos pequenos sejam visíveis
  },
  legendContainer: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default HorizontalBar;
