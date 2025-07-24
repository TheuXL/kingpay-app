import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { ChevronRight, Plus, Search, Filter } from 'lucide-react-native';
import PaymentLinkItem from '@/components/links/PaymentLinkItem';

const linksData = [
  { id: '1', name: 'Capa Notebook', value: 'R$ 245,45', active: true },
  { id: '2', name: 'Capa Notebook', value: 'R$ 245,50', active: false },
  { id: '3', name: 'Mouse Sem Fio', value: 'R$ 89,90', active: true },
];

export default function PaymentLinksScreen() {
  const router = useRouter();

  const handleCopyLink = (link: string) => {
    // Lógica para copiar o link
    console.log('Copied:', link);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <View style={styles.linksList}>
          {linksData.map((link) => (
            <PaymentLinkItem
              key={link.id}
              name={link.name}
              value={link.value}
              active={link.active}
              onPress={() => router.push(`/links/${link.id}`)}
              onCopy={() => handleCopyLink(`https://app.kingpaybr.com/pay/${link.id}`)}
            />
          ))}
        </View>
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
    }
});
