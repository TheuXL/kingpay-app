import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

export default function SettingsMenuScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Ajustes
      </Text>

      <AppCard>
        <AppListItem
          title="Gerenciar Usuários"
          left={(props: any) => <AppListItem.Icon {...props} icon="account-group" />}
          right={(props: any) => <AppListItem.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/users')}
        />
        <AppListItem
          title="Meu Perfil"
          left={(props: any) => <AppListItem.Icon {...props} icon="account-circle" />}
          right={(props: any) => <AppListItem.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/settings')}
        />
        <AppListItem
          title="Sair"
          left={(props: any) => <AppListItem.Icon {...props} icon="logout" />}
          onPress={signOut}
        />
      </AppCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
}); 