import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { List, Text } from 'react-native-paper';

import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useCompanyStore } from '@/store/companyStore';
import { Company } from '@/types/company';

export default function CompaniesScreen() {
  const router = useRouter();
  const { companies, isLoading, fetchCompanies } = useCompanyStore();

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  const handleGoToDetails = (companyId: string) => {
    router.push({
      pathname: '/company-details',
      params: { id: companyId }
    } as any);
  };

  return (
    <ScreenLayout>
      <View>
        <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
          Empresas
        </Text>
        <AppTextInput
          label="Buscar por nome ou CNPJ"
          left={(props) => <AppTextInput.Icon name="magnify" />}
        />
      </View>

      {isLoading ? (
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