import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function SystemSettingsScreen() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  
  const canViewStandards = hasPermission('view_standards');
  const canManageEmailTemplates = hasPermission('manage_email_templates');

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Configurações do Sistema
      </Text>
      
      <AppCard>
        {canViewStandards && (
          <AppListItem
            title="Padrões do Sistema"
            description="Configurações de taxas, métodos de pagamento e valores padrão"
            left={(props: any) => <AppListItem.Icon {...props} icon="tune" />}
            right={(props: any) => <AppListItem.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push({ pathname: "/padroes" } as any)}
          />
        )}
        
        {canManageEmailTemplates && (
          <AppListItem
            title="Templates de Email"
            description="Gerenciar templates de email do sistema"
            left={(props: any) => <AppListItem.Icon {...props} icon="email-outline" />}
            right={(props: any) => <AppListItem.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push({ pathname: "/email-templates" } as any)}
          />
        )}
        
        <AppListItem
          title="Termos de Uso"
          description="Configurar termos de uso da plataforma"
          left={(props: any) => <AppListItem.Icon {...props} icon="file-document-outline" />}
          right={(props: any) => <AppListItem.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push({ pathname: "/termos" } as any)}
        />
        
        <AppListItem
          title="Personalização"
          description="Configurar cores, logotipos e aparência"
          left={(props: any) => <AppListItem.Icon {...props} icon="palette-outline" />}
          right={(props: any) => <AppListItem.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push({ pathname: "/personalizacao" } as any)}
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