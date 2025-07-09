import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { Stack } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { AppListItem } from '@/components/common/AppListItem';

export default function CompanyAnalysisScreen() {
  return (
    <ScreenLayout>
      <Stack.Screen options={{ title: 'Análise de Cadastro' }} />

      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>
          Análise de Cadastro
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Empresa Exemplo 1
        </Text>

        <AppCard>
          <AppCard.Title title="Documentos Enviados" />
          <AppCard.Content>
            <AppListItem
              title="Contrato Social"
              left={() => <AppListItem.Icon icon="file-document" />}
              right={() => <AppListItem.Icon icon="download" />}
            />
            <AppListItem
              title="Documento do Sócio"
              left={() => <AppListItem.Icon icon="file-account" />}
              right={() => <AppListItem.Icon icon="download" />}
            />
          </AppCard.Content>
        </AppCard>

        <AppCard>
          <AppCard.Title title="Consulta CNPJ" />
          <AppCard.Content>
            <Text>Status: ATIVA</Text>
            <Text>Capital Social: R$ 100.000,00</Text>
          </AppCard.Content>
        </AppCard>

        <View style={styles.actionsContainer}>
          <AppButton mode="contained" icon="check">
            Aprovar Cadastro
          </AppButton>
          <AppButton mode="outlined" icon="close">
            Reprovar Cadastro
          </AppButton>
        </View>
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
  actionsContainer: {
    marginTop: 16,
    gap: 8,
  },
}); 