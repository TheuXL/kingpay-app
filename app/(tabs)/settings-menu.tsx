import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

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
          title="Usuários"
          description="Gerenciar usuários do sistema"
          left={(props) => <AppListItem.Icon {...props} name="account-group" />}
          right={(props) => <AppListItem.Icon {...props} name="chevron-right" />}
          onPress={() => router.push('/users' as any)}
        />

        <AppListItem
          title="Preferências"
          description="Personalização e ajustes do app"
          left={(props) => <AppListItem.Icon {...props} name="cog" />}
          right={(props) => <AppListItem.Icon {...props} name="chevron-right" />}
          onPress={() => router.push('/settings' as any)}
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