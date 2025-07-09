import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useUserStore } from '@/store/userStore';
import { UserData } from '@/services/userService';

export default function UsersListScreen() {
  const router = useRouter();
  const { users, loading, fetchUsers } = useUserStore();

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ScreenLayout>
      <Stack.Screen options={{ title: 'Gerenciar Usuários' }} />
      <Text variant="headlineMedium" style={styles.title}>
        Usuários
      </Text>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <AppCard>
          {users.map((user: UserData) => (
            <AppListItem
              key={user.id}
              title={user.full_name || 'Usuário sem nome'}
              description={user.email}
              right={(props: any) => <AppListItem.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push(`/user-permissions?id=${user.id}`)}
            />
          ))}
        </AppCard>
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Adicionar usuário')}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loader: {
    marginTop: 20,
  },
}); 