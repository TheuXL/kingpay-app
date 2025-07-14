import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { CompanyTaxesForm } from '@/components/companies/CompanyTaxesForm';
import { useCompanyStore } from '@/store/companyStore';
import { UpdateCompanyTaxesPayload } from '@/types/company';

export default function CompanyTaxesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    currentCompany, 
    companyTaxes, 
    isLoading, 
    error, 
    fetchCompanyById, 
    fetchCompanyTaxes,
    updateTaxes,
    clearError 
  } = useCompanyStore();

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
      fetchCompanyTaxes(id);
    }
  }, [id, fetchCompanyById, fetchCompanyTaxes]);

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmit = async (data: UpdateCompanyTaxesPayload) => {
    if (id) {
      await updateTaxes(id, data);
      
      // If no error, navigate back to company details
      if (!error) {
        router.back();
      }
    }
  };

  if (isLoading && !companyTaxes) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenLayout>
    );
  }

  if (error || !companyTaxes || !currentCompany) {
    return (
      <ScreenLayout>
        <View style={styles.header}>
          <Text variant="headlineMedium">Taxas da Empresa</Text>
          <Button mode="outlined" onPress={handleGoBack}>
            Voltar
          </Button>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Não foi possível carregar os dados da empresa.'}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <Text variant="headlineMedium">Taxas: {currentCompany.name}</Text>
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

      <CompanyTaxesForm 
        initialData={companyTaxes} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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