import { CompanyListItem } from '@/components/companies/CompanyListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { CompanyStatus } from '@/services/companyService';
import { useCompanyStore } from '@/store/companyStore';
import { Company } from '@/types/company';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, FAB, Searchbar, Text } from 'react-native-paper';

export default function CompaniesScreen() {
  const { companies, companyCount, isLoading, error, fetchCompanies, fetchCompanyCount } = useCompanyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CompanyStatus | undefined>('approved');

  useEffect(() => {
    fetchCompanies(activeFilter);
    fetchCompanyCount();
  }, [fetchCompanies, fetchCompanyCount, activeFilter]);

  const handleRefresh = () => {
    fetchCompanies(activeFilter);
    fetchCompanyCount();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you might want to implement server-side search
    // For now, we'll just filter the local data
  };

  const handleFilterChange = (filter?: CompanyStatus) => {
    setActiveFilter(filter);
  };

  const handleCreateCompany = () => {
    router.push({
      pathname: '/(drawer)/companies/new' as any
    });
  };

  const filteredCompanies = searchQuery
    ? companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.tax_id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (company.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    : companies;

  const renderItem = ({ item }: { item: Company }) => <CompanyListItem company={item} />;

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Empresas
        </Text>
        <Button mode="contained" onPress={handleCreateCompany}>
          Nova Empresa
        </Button>
      </View>

      <Searchbar
        placeholder="Buscar empresas"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={activeFilter === undefined}
          onPress={() => handleFilterChange(undefined)}
          style={styles.filterChip}
        >
          Todas ({companyCount?.total || 0})
        </Chip>
        <Chip
          selected={activeFilter === 'approved'}
          onPress={() => handleFilterChange('approved')}
          style={styles.filterChip}
        >
          Aprovadas ({companyCount?.approved || 0})
        </Chip>
        <Chip
          selected={activeFilter === 'pending'}
          onPress={() => handleFilterChange('pending')}
          style={styles.filterChip}
        >
          Pendentes ({companyCount?.pending || 0})
        </Chip>
        <Chip
          selected={activeFilter === 'rejected'}
          onPress={() => handleFilterChange('rejected')}
          style={styles.filterChip}
        >
          Rejeitadas ({companyCount?.rejected || 0})
        </Chip>
        <Chip
          selected={activeFilter === 'blocked'}
          onPress={() => handleFilterChange('blocked')}
          style={styles.filterChip}
        >
          Bloqueadas ({companyCount?.blocked || 0})
        </Chip>
      </View>

      {isLoading && companies.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge" style={styles.errorText}>
            {error}
          </Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
            Tentar Novamente
          </Button>
        </View>
      ) : filteredCompanies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">Nenhuma empresa encontrada.</Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.refreshButton}>
            Atualizar
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredCompanies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateCompany}
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
  title: {
    flex: 1,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 80, // Add padding for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#B00020',
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 