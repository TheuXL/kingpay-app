import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, Text } from 'react-native-paper';
import { Company } from '../../types/company';

interface CompanyListItemProps {
  company: Company;
}

export const CompanyListItem: React.FC<CompanyListItemProps> = ({ company }) => {
  const navigateToDetails = () => {
    router.push({
      pathname: "/(drawer)/companies/[id]" as any,
      params: { id: company.id }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: '#E7F5E8', text: '#1B5E20' };
      case 'pending':
        return { bg: '#FFF9C4', text: '#F57F17' };
      case 'rejected':
        return { bg: '#FFEBEE', text: '#B71C1C' };
      case 'blocked':
        return { bg: '#ECEFF1', text: '#263238' };
      default:
        return { bg: '#E0E0E0', text: '#424242' };
    }
  };

  const statusColors = getStatusColor(company.status);

  return (
    <Card style={styles.card} onPress={navigateToDetails}>
      <Card.Content style={styles.content}>
        <View style={styles.leftContent}>
          {company.logo_url ? (
            <Avatar.Image size={48} source={{ uri: company.logo_url }} style={styles.avatar} />
          ) : (
            <Avatar.Text size={48} label={company.name.substring(0, 2)} style={styles.avatar} />
          )}
          <View style={styles.textContainer}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
              {company.name}
            </Text>
            <Text variant="bodySmall" numberOfLines={1} style={styles.subtitle}>
              {company.tax_id}
            </Text>
            {company.email && (
              <Text variant="bodySmall" numberOfLines={1} style={styles.email}>
                {company.email}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.rightContent}>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: statusColors.bg }]}
            textStyle={{ color: statusColors.text }}
          >
            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
          </Chip>
          <Text variant="bodySmall" style={styles.date}>
            {new Date(company.created_at).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  rightContent: {
    alignItems: 'flex-end',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
  },
  subtitle: {
    color: '#666',
    marginTop: 2,
  },
  email: {
    color: '#666',
    marginTop: 2,
  },
  statusChip: {
    height: 24,
    alignSelf: 'flex-end',
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
}); 