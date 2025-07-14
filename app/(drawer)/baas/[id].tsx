import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useBaasStore } from '../../../src/store/baasStore';
import { BaasFee } from '../../../src/types/baas';
import { formatCurrency } from '../../../src/utils/formatters';

const BaasDetailScreen = () => {
  const params = useLocalSearchParams();
  const baasId = params.id as string;
  const { 
    selectedBaas, 
    baasFees, 
    loading, 
    error, 
    fetchBaasById, 
    fetchBaasFees,
    toggleBaasActive,
    updateBaasFee
  } = useBaasStore();

  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [newFeeValue, setNewFeeValue] = useState<string>('');

  useEffect(() => {
    if (baasId) {
      fetchBaasById(baasId);
      fetchBaasFees(baasId);
    }
  }, [baasId, fetchBaasById, fetchBaasFees]);

  const handleRefresh = () => {
    if (baasId) {
      fetchBaasById(baasId);
      fetchBaasFees(baasId);
    }
  };

  const handleToggleActive = async () => {
    if (!selectedBaas) return;

    Alert.alert(
      selectedBaas.active ? 'Desativar BaaS' : 'Ativar BaaS',
      `Deseja ${selectedBaas.active ? 'desativar' : 'ativar'} o BaaS "${selectedBaas.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const success = await toggleBaasActive(baasId);
            if (success) {
              Alert.alert(
                'Sucesso',
                `BaaS ${selectedBaas.active ? 'desativado' : 'ativado'} com sucesso!`
              );
            }
          },
        },
      ]
    );
  };

  const handleEditFee = (fee: BaasFee) => {
    setEditingFeeId(fee.id);
    setNewFeeValue(fee.fee_value.toString());
  };

  const handleSaveFee = async (fee: BaasFee) => {
    const numericValue = parseFloat(newFeeValue);
    
    if (isNaN(numericValue)) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    const success = await updateBaasFee(baasId, numericValue);
    
    if (success) {
      Alert.alert('Sucesso', 'Taxa atualizada com sucesso!');
      setEditingFeeId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderFeeItem = ({ item }: { item: BaasFee }) => {
    const isEditing = editingFeeId === item.id;

    return (
      <View style={styles.feeItem}>
        <View style={styles.feeInfo}>
          <Text style={styles.feeType}>{item.fee_type}</Text>
          {item.description && <Text style={styles.feeDescription}>{item.description}</Text>}
        </View>
        
        <View style={styles.feeActions}>
          {isEditing ? (
            <View style={styles.editFeeContainer}>
              <TextInput
                style={styles.feeInput}
                value={newFeeValue}
                onChangeText={setNewFeeValue}
                keyboardType="numeric"
                autoFocus
              />
              <Button 
                title="Salvar" 
                onPress={() => handleSaveFee(item)} 
                disabled={loading}
              />
            </View>
          ) : (
            <>
              <Text style={styles.feeValue}>{formatCurrency(item.fee_value)}</Text>
              <TouchableOpacity 
                onPress={() => handleEditFee(item)}
                disabled={loading}
              >
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  if (loading && !selectedBaas) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity onPress={handleRefresh}>
          <ThemedText style={{ color: '#007AFF' }}>Tentar novamente</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!selectedBaas) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>BaaS não encontrado.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        {selectedBaas.logo_url && (
          <Image source={{ uri: selectedBaas.logo_url }} style={styles.logo} />
        )}
        <View style={styles.headerInfo}>
          <ThemedText type="title">{selectedBaas.name}</ThemedText>
          {selectedBaas.description && (
            <Text style={styles.description}>{selectedBaas.description}</Text>
          )}
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText,
              { color: selectedBaas.active ? '#4cd964' : '#ff3b30' }
            ]}>
              {selectedBaas.active ? 'Ativo' : 'Inativo'}
            </Text>
            <Switch
              value={selectedBaas.active}
              onValueChange={handleToggleActive}
              disabled={loading}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={selectedBaas.active ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Criado em:</Text>
          <Text style={styles.infoValue}>{formatDate(selectedBaas.created_at)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Última atualização:</Text>
          <Text style={styles.infoValue}>{formatDate(selectedBaas.updated_at)}</Text>
        </View>
      </View>

      <View style={styles.feesSection}>
        <ThemedText type="subtitle">Taxas</ThemedText>
        
        <FlatList
          data={baasFees}
          keyExtractor={(item) => item.id}
          renderItem={renderFeeItem}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text>Nenhuma taxa encontrada para este BaaS.</Text>
            </View>
          }
          refreshControl={
            <RefreshControl 
              refreshing={loading} 
              onRefresh={() => fetchBaasFees(baasId)} 
            />
          }
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  feesSection: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  feeInfo: {
    flex: 1,
  },
  feeType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  feeDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  feeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
  },
  editButton: {
    fontSize: 14,
    color: '#007AFF',
  },
  editFeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    width: 80,
    marginRight: 8,
    fontSize: 16,
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
});

export default BaasDetailScreen; 