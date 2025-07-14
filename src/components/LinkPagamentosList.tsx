import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLinkPagamentosStore } from '../store/linkPagamentosStore';
import { LinkPagamento } from '../types/linkPagamentos';
import { formatCurrency } from '../utils/formatters';

interface LinkPagamentosListProps {
  companyId?: string;
  onSelectLink?: (link: LinkPagamento) => void;
}

export const LinkPagamentosList: React.FC<LinkPagamentosListProps> = ({ companyId, onSelectLink }) => {
  const router = useRouter();
  const { 
    linkPagamentos, 
    loading, 
    error, 
    fetchLinkPagamentos, 
    clearError 
  } = useLinkPagamentosStore();
  
  const [refreshing, setRefreshing] = useState(false);

  // Carregar links de pagamento ao montar o componente
  useEffect(() => {
    const loadLinks = async () => {
      if (companyId) {
        await fetchLinkPagamentos({ company: companyId });
      }
    };
    
    loadLinks();
  }, [companyId]);

  // Função para atualizar a lista
  const handleRefresh = async () => {
    setRefreshing(true);
    if (companyId) {
      await fetchLinkPagamentos({ company: companyId });
    }
    setRefreshing(false);
  };

  // Função para navegar para os detalhes do link
  const handleLinkPress = (link: LinkPagamento) => {
    if (onSelectLink) {
      onSelectLink(link);
    } else if (link.id) {
      // Usar o formato seguro para navegação com parâmetros
      router.push({
        pathname: "/link-pagamentos/[id]",
        params: { id: link.id }
      } as any);
    }
  };

  // Renderizar cada item da lista
  const renderItem = ({ item }: { item: LinkPagamento }) => {
    return (
      <TouchableOpacity 
        style={styles.linkItem} 
        onPress={() => handleLinkPress(item)}
      >
        <View style={styles.linkContent}>
          <Text style={styles.linkName}>{item.nome}</Text>
          <Text style={styles.linkValue}>{formatCurrency(item.valor)}</Text>
          
          <View style={styles.linkDetails}>
            <Text style={[
              styles.linkStatus, 
              item.status === 'ativo' ? styles.statusActive : 
              item.status === 'inativo' ? styles.statusInactive : 
              styles.statusExpired
            ]}>
              {item.status === 'ativo' ? 'Ativo' : 
               item.status === 'inativo' ? 'Inativo' : 
               'Expirado'}
            </Text>
            
            <View style={styles.paymentMethods}>
              {item.formas_pagamento.map((forma, index) => (
                <View key={index} style={styles.paymentMethod}>
                  <Ionicons 
                    name={
                      forma.tipo === 'pix' ? 'qr-code-outline' : 
                      forma.tipo === 'cartao' ? 'card-outline' : 
                      'document-text-outline'
                    } 
                    size={14} 
                    color={forma.ativo ? '#333' : '#999'} 
                  />
                  <Text style={[
                    styles.paymentMethodText,
                    !forma.ativo && styles.paymentMethodInactive
                  ]}>
                    {forma.tipo === 'pix' ? 'PIX' : 
                     forma.tipo === 'cartao' ? 'Cartão' : 
                     'Boleto'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </TouchableOpacity>
    );
  };

  // Renderizar mensagem de erro
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {
          clearError();
          handleRefresh();
        }}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizar lista vazia
  const renderEmptyList = () => {
    if (loading) return null;
    
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="link-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>Nenhum link de pagamento encontrado</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push("/link-pagamentos/novo" as any)}
        >
          <Text style={styles.createButtonText}>Criar novo link</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Carregando links de pagamento...</Text>
        </View>
      ) : (
        <FlatList
          data={linkPagamentos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={linkPagamentos.length === 0 ? styles.flatListEmpty : styles.flatList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  flatListEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  linkContent: {
    flex: 1,
    marginRight: 8,
  },
  linkName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  linkValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0066cc',
    marginBottom: 8,
  },
  linkDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusActive: {
    backgroundColor: '#e6f7ed',
    color: '#1e7e34',
  },
  statusInactive: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  statusExpired: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  paymentMethods: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 2,
  },
  paymentMethodInactive: {
    color: '#999',
  },
}); 