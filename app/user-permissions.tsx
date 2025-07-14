import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

import { AppButton } from '@/components/common/AppButton';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useUserStore } from '@/store/userStore';
import { User as UserData } from '@/types/users';

const allPermissions = [
  'Aprovar/Reprovar Saques',
  'Visualizar Todas as Empresas',
  'Editar Taxas da Empresa',
  'Bloquear/Desbloquear Empresas',
  'Gerenciar Usuários',
];

export default function UserPermissionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { users } = useUserStore();
  const user = users.find((u: UserData) => u.id === id);

  const [permissions, setPermissions] = React.useState<string[]>([]);

  // Aqui viria a lógica para carregar as permissões atuais do usuário
  React.useEffect(() => {
    if (user) {
      // Ex: setPermissions(user.role === 'admin' ? allPermissions : [])
    }
  }, [user]);

  const handleTogglePermission = (permission: string) => {
    setPermissions((current) =>
      current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission]
    );
  };

  if (!user) {
    return (
      <ScreenLayout>
        <Text>Usuário não encontrado.</Text>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Stack.Screen options={{ title: 'Permissões do Usuário' }} />
      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>
          Permissões
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {user.full_name || user.email}
        </Text>

        {allPermissions.map((permission) => (
          <Checkbox.Item
            key={permission}
            label={permission}
            status={permissions.includes(permission) ? 'checked' : 'unchecked'}
            onPress={() => handleTogglePermission(permission)}
          />
        ))}

        <AppButton 
          mode="contained" 
          style={styles.saveButton} 
          onPress={() => console.log('Saving permissions:', permissions)}
        >
          Salvar Alterações
        </AppButton>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 24,
  },
}); 