import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../shared/AppText';
import { useUserData } from '@/contexts/UserDataContext';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { company } = useUserData();

  return (
    <View style={styles.container}>
      <View>
        <AppText size="xl" weight="bold">
          {title}
        </AppText>
        <AppText color="textSecondary">{company?.fantasy_name || 'Bem-vindo'}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}); 