import { CompanyForm } from '@/components/companies/CompanyForm';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useCompanyStore } from '@/store/companyStore';
import { CreateCompanyPayload } from '@/types/company';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function NewCompanyScreen() {
  const { isLoading, error, createNewCompany, clearError } = useCompanyStore();

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmit = async (data: CreateCompanyPayload) => {
    await createNewCompany(data);
    
    // If no error, navigate back to companies list
    if (!error) {
      router.replace('/companies');
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <Text variant="headlineMedium">Nova Empresa</Text>
        <Button mode="outlined" onPress={handleGoBack}>
          Cancelar
        </Button>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={clearError}>Fechar</Button>
        </View>
      )}

      <CompanyForm onSubmit={handleSubmit} isLoading={isLoading} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#B00020',
    flex: 1,
  },
}); 