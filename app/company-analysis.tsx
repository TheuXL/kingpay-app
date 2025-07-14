import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

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
          <AppCard.Title>Documentos Enviados</AppCard.Title>
          <AppCard.Content>
            <AppListItem
              title="Contrato Social"
              left={() => <AppListItem.Icon name="file-document" />}
              right={() => <AppListItem.Icon name="download" />}
            />
            <AppListItem
              title="Documento do Sócio"
              left={() => <AppListItem.Icon name="file-account" />}
              right={() => <AppListItem.Icon name="download" />}
            />
          </AppCard.Content>
        </AppCard>

        <AppCard>
          <AppCard.Title>Consulta CNPJ</AppCard.Title>
          <AppCard.Content>
            <Text>Status: ATIVA</Text>
            <Text>Capital Social: R$ 100.000,00</Text>
          </AppCard.Content>
        </AppCard>

        <View style={styles.actionsContainer}>
          <AppButton 
            mode="contained" 
            icon="check"
            onPress={() => console.log('Aprovar')}
          >
            Aprovar Cadastro
          </AppButton>
          <AppButton 
            mode="outlined" 
            icon="close"
            onPress={() => console.log('Reprovar')}
          >
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