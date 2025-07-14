import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
  isLoading?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  isLoading = false,
}) => {
  const theme = useTheme();
  const cardColor = color || theme.colors.primary;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBackground, { backgroundColor: `${cardColor}20` }]}>
            <MaterialCommunityIcons name={icon as any} size={24} color={cardColor} />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {isLoading ? (
            <View style={styles.loadingPlaceholder} />
          ) : (
            <Text style={[styles.value, { color: cardColor }]}>{value}</Text>
          )}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    elevation: 2,
  },
  content: {
    padding: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 4,
  },
  title: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.5,
  },
  loadingPlaceholder: {
    height: 24,
    width: '70%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 4,
  },
}); 