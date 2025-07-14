import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLinkPagamentosStore } from '../store/linkPagamentosStore';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function LinkPagamentoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { 
    linkPagamentoAtual, 
    loading, 
    error, 
    fetchLinkPagamentoById, 
    clearError 
  } = useLinkPagamentosStore();

  useEffect(() => {
    if (id) {
      fetchLinkPagamentoById(id);
    }
    
    return () => {
      clearError();
    };
  }, [id]);

  const handleEdit = () => {
    if (id) {
      router.push({
        pathname: "/link-pagamentos/editar/[id]",
        params: { id }
      } as any);
    }
  };

  const handleShare = async () => {
    if (!linkPagamentoAtual?.url) {
      Alert.alert('Erro', 'Não foi possível compartilhar o link de pagamento');
      return;
    }

    try {
      await Share.share({
        message: `Link de pagamento: ${linkPagamentoAtual.nome}\n${linkPagamentoAtual.url}`,
        url: linkPagamentoAtual.url,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Renderizar mensagem de erro
  if (error) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            clearError();
            if (id) {
              fetchLinkPagamentoById(id);
            }
          }}
        >
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizar carregamento
  if (loading || !linkPagamentoAtual) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Carregando detalhes do link...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>{linkPagamentoAtual.nome}</Text>
          <View style={[
            styles.statusBadge, 
            linkPagamentoAtual.status === 'ativo' ? styles.statusActive : 
            linkPagamentoAtual.status === 'inativo' ? styles.statusInactive : 
            styles.statusExpired
          ]}>
            <Text style={styles.statusText}>
              {linkPagamentoAtual.status === 'ativo' ? 'Ativo' : 
               linkPagamentoAtual.status === 'inativo' ? 'Inativo' : 
               'Expirado'}
            </Text>
          </View>
        </View>

        {/* Valor */}
        <Text style={styles.value}>{formatCurrency(linkPagamentoAtual.valor)}</Text>
        
        {/* Descrição */}
        {linkPagamentoAtual.descricao && (
          <Text style={styles.description}>{linkPagamentoAtual.descricao}</Text>
        )}

        {/* Seção de Detalhes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Pagamento</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Formas de Pagamento:</Text>
            <View style={styles.paymentMethods}>
              {linkPagamentoAtual.formas_pagamento.map((forma, index) => (
                forma.ativo && (
                  <View key={index} style={styles.paymentMethod}>
                    <Ionicons 
                      name={
                        forma.tipo === 'pix' ? 'qr-code-outline' : 
                        forma.tipo === 'cartao' ? 'card-outline' : 
                        'document-text-outline'
                      } 
                      size={16} 
                      color="#333" 
                    />
                    <Text style={styles.paymentMethodText}>
                      {forma.tipo === 'pix' ? 'PIX' : 
                       forma.tipo === 'cartao' ? 'Cartão' : 
                       'Boleto'}
                    </Text>
                  </View>
                )
              ))}
            </View>
          </View>

          {linkPagamentoAtual.max_parcelas && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Máximo de Parcelas:</Text>
              <Text style={styles.detailValue}>{linkPagamentoAtual.max_parcelas}x</Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Permite Desconto:</Text>
            <Text style={styles.detailValue}>
              {linkPagamentoAtual.permite_desconto ? 'Sim' : 'Não'}
            </Text>
          </View>

          {linkPagamentoAtual.permite_desconto && linkPagamentoAtual.desconto_porcentagem && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Desconto:</Text>
              <Text style={styles.detailValue}>{linkPagamentoAtual.desconto_porcentagem}%</Text>
            </View>
          )}

          {linkPagamentoAtual.data_expiracao && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Data de Expiração:</Text>
              <Text style={styles.detailValue}>
                {formatDate(linkPagamentoAtual.data_expiracao)}
              </Text>
            </View>
          )}

          {linkPagamentoAtual.created_at && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Criado em:</Text>
              <Text style={styles.detailValue}>
                {formatDate(linkPagamentoAtual.created_at)}
              </Text>
            </View>
          )}
        </View>

        {/* URL do Link */}
        {linkPagamentoAtual.url && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Link de Pagamento</Text>
            <View style={styles.urlContainer}>
              <Text style={styles.url} numberOfLines={1} ellipsizeMode="middle">
                {linkPagamentoAtual.url}
              </Text>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={20} color="#fff" />
                <Text style={styles.shareButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Personalização */}
        {linkPagamentoAtual.tema && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalização</Text>
            
            <View style={styles.colorContainer}>
              {linkPagamentoAtual.tema.cor_primaria && (
                <View style={styles.colorItem}>
                  <Text style={styles.colorLabel}>Cor Primária</Text>
                  <View style={styles.colorPreviewContainer}>
                    <View 
                      style={[
                        styles.colorPreview, 
                        { backgroundColor: linkPagamentoAtual.tema.cor_primaria }
                      ]} 
                    />
                    <Text style={styles.colorValue}>{linkPagamentoAtual.tema.cor_primaria}</Text>
                  </View>
                </View>
              )}
              
              {linkPagamentoAtual.tema.cor_secundaria && (
                <View style={styles.colorItem}>
                  <Text style={styles.colorLabel}>Cor Secundária</Text>
                  <View style={styles.colorPreviewContainer}>
                    <View 
                      style={[
                        styles.colorPreview, 
                        { backgroundColor: linkPagamentoAtual.tema.cor_secundaria }
                      ]} 
                    />
                    <Text style={styles.colorValue}>{linkPagamentoAtual.tema.cor_secundaria}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botão de Editar */}
      <TouchableOpacity 
        style={[styles.editButton, { bottom: insets.bottom + 16 }]}
        onPress={handleEdit}
      >
        <Ionicons name="create-outline" size={24} color="#fff" />
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
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
  button: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusActive: {
    backgroundColor: '#e6f7ed',
  },
  statusInactive: {
    backgroundColor: '#f5f5f5',
  },
  statusExpired: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  paymentMethods: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  urlContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  url: {
    fontSize: 14,
    color: '#0066cc',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    borderRadius: 4,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  colorItem: {
    width: '48%',
    marginBottom: 8,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorValue: {
    fontSize: 14,
    color: '#333',
  },
  editButton: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#0066cc',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
  },
}); 