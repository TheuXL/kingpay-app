import { PaymentLinkItem } from '@/components/links/PaymentLinkItem';
import { usePaymentLinks } from '@/features/paymentLinks/hooks/usePaymentLinks';
import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { ChevronRight, Filter, Plus, Search } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PaymentLinksScreen() {
  const router = useRouter();
  const { links, isLoading, error, refetch } = usePaymentLinks();

  const handleCopyLink = (linkId: string) => {
    // Lógica para copiar o link
    console.log('Copied link ID:', linkId);
  };
  
  const handleToggleStatus = (linkId: string, currentStatus: boolean) => {
    // Lógica para ativar/desativar o link
    console.log('Toggling status for link ID:', linkId, 'from', currentStatus);
  };
  
  const handleEdit = (linkId: string) => {
    router.push(`/links/${linkId}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (links.length === 0) {
        return <Text style={styles.emptyText}>Nenhum link de pagamento encontrado.</Text>
    }

    return (
      <View style={styles.linksList}>
        {links.map((link) => (
          <PaymentLinkItem
            key={link.id}
            item={link}
            onCopy={() => handleCopyLink(link.id)}
            onToggle={(newStatus) => handleToggleStatus(link.id, !newStatus)}
            onEdit={() => handleEdit(link.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Links criados</Text>
          <TouchableOpacity onPress={() => console.log('Ver tudo')}>
            <Text style={styles.headerAction}>Ver tudo <ChevronRight size={16} color={colors.primary} /></Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          Gerencie seus links de pagamento e acompanhe suas vendas
        </Text>

        <TouchableOpacity style={styles.createButton}>
          <Plus size={20} color="#fff" />
          <Text style={styles.createButtonText}>Criar novo link</Text>
        </TouchableOpacity>

        <View style={styles.searchFilterRow}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.gray} />
            <TextInput
              placeholder="Buscar links de pagamento"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    headerAction: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#52525B',
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchFilterRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 14,
        marginLeft: 8,
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    linksList: {
        marginTop: 8,
    },
    errorText: {
        textAlign: 'center',
        color: colors.danger,
        marginTop: 20,
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: 40,
        fontSize: 16,
    }
});
