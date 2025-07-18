import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

import { AppButton } from '@/components/common/AppButton';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useCompanyStore } from '@/store/companyStore';
import { Company } from '@/types/company';

export default function CompanyDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { companies } = useCompanyStore();
  const company = companies.find((c: Company) => c.id === id);

  const [isBlockModalVisible, setBlockModalVisible] = React.useState(false);

  const handleBlockConfirm = () => {
    console.log('Empresa bloqueada!');
    setBlockModalVisible(false);
  };

  if (!company) {
    return (
      <ScreenLayout>
        <Text>Empresa não encontrada.</Text>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Stack.Screen options={{ title: 'Detalhes da Empresa' }} />
      <Text variant="headlineMedium" style={styles.title}>
        {company.name}
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {company.cnpj}
      </Text>

      <Divider style={styles.divider} />

      <Text>Status: {company.status}</Text>
      <Text variant="titleMedium">Dados Cadastrais</Text>
      <Text>Email: contato@exemplo.com</Text>
      <Text>Telefone: (11) 99999-9999</Text>
      <Text>Endereço: Rua Exemplo, 123</Text>

      <Divider style={styles.divider} />

      <Text variant="titleMedium">Representante</Text>
      <Text>Nome: João da Silva</Text>
      <Text>CPF: 123.456.789-00</Text>

      <View style={styles.actionsContainer}>
        {company.status === 'pending' && (
          <AppButton
            mode="contained"
            onPress={() => router.push('/company-analysis' as any)}>
            Analisar Cadastro
          </AppButton>
        )}
        <AppButton onPress={() => setBlockModalVisible(true)}>
          Bloquear Empresa
        </AppButton>
        <AppButton onPress={() => console.log('Configurar taxas')}>
          Configurar Taxas
        </AppButton>
      </View>

      <ConfirmationModal
        visible={isBlockModalVisible}
        onDismiss={() => setBlockModalVisible(false)}
        onConfirm={handleBlockConfirm}
        title="Bloquear Empresa"
        content="Tem certeza que deseja bloquear esta empresa? Esta ação pode ser revertida."
      />
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
  divider: {
    marginVertical: 16,
  },
  actionsContainer: {
    marginTop: 'auto',
    gap: 8,
  },
}); 