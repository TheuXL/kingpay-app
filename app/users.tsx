import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';

import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useUserStore } from '@/store/userStore';
import { User as UserData } from '@/types/users';

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
              onPress={() => router.push({
                pathname: '/user-permissions',
                params: { id: user.id }
              } as any)}
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