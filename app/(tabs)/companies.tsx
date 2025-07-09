import { View, ActivityIndicator } from 'react-native';
import { Text, List } from 'react-native-paper';
import { useRouter } from 'expo-router';
import React from 'react';

import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useCompanyStore, type Company } from '@/store/companyStore';

export default function CompaniesScreen() {
  const router = useRouter();
  const { companies, loading, fetchCompanies } = useCompanyStore();

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  const handleGoToDetails = (companyId: string) => {
    router.push(`/company-details?id=${companyId}`);
  };

  return (
    <ScreenLayout>
      <View>
        <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
          Empresas
        </Text>
        <AppTextInput
          label="Buscar por nome ou CNPJ"
          left={<AppTextInput.Icon icon="magnify" />}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <AppCard>
          {companies.map((company: Company) => (
            <AppListItem
              key={company.id}
              title={company.name}
              description={company.cnpj}
              right={(props: any) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => handleGoToDetails(company.id)}
            />
          ))}
        </AppCard>
      )}
    </ScreenLayout>
  );
} 