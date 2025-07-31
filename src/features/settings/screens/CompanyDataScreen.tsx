// src/features/settings/screens/CompanyDataScreen.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { colors } from '../../../theme/colors';
import { EditableField } from '../components/EditableField';

const companyData = [
  { label: 'Razão Social', value: 'Soutech LTDA' },
  { label: 'Nome Fantasia', value: '' }, // Exemplo de valor vazio
  { label: 'CNPJ', value: '12.345.678/0001-01' },
  { label: 'Website', value: '' },
  { label: 'Endereço', value: 'Rua dos Palmares' },
  { label: 'Número', value: '81' },
  { label: 'Bairro', value: 'Laranjeiras' },
  { label: 'Cidade', value: 'São Paulo' },
];

export default function CompanyDataScreen() {
  return (
    <ScreenContainer scrollable style={{ paddingHorizontal: 20, backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: 'Configurações', headerShadowVisible: false, headerStyle: { backgroundColor: colors.background } }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Dados da empresa</Text>
        <Text style={styles.subtitle}>Atualize as informações da sua empresa.</Text>
      </View>
      
      <View style={styles.fieldsContainer}>
        {companyData.map((item, index) => (
          <EditableField key={index} label={item.label} value={item.value} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  fieldsContainer: {
    gap: 12,
  },
});
