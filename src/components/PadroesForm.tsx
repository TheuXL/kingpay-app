import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Card, Divider, TextInput } from 'react-native-paper';
import { usePadroesStore } from '../store/padroesStore';
import { AtualizarPadroesRequest, MetodoPagamento } from '../types/padroes';
import { formatCurrency, formatPercent, parseCurrency } from '../utils/formatters';

interface PadroesFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export const PadroesForm: React.FC<PadroesFormProps> = ({ onCancel, onSave }) => {
  const { padroes, loading, error, fetchPadroes, updatePadroes, clearError } = usePadroesStore();
  const [formData, setFormData] = useState<AtualizarPadroesRequest>({});
  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>([]);
  
  // Inicializar o formulário com os dados atuais
  useEffect(() => {
    if (!padroes) {
      fetchPadroes();
      return;
    }
    
    // Clonar os métodos de pagamento para evitar modificar o estado original
    setMetodosPagamento([...padroes.metodos_pagamento]);
    
    // Inicializar o formulário com os valores atuais
    setFormData({
      percentual_reserva_antecipacao: padroes.percentual_reserva_antecipacao,
      dias_antecipacao: padroes.dias_antecipacao,
      taxa_antecipacao: padroes.taxa_antecipacao,
      taxa_saque: padroes.taxa_saque,
      valor_minimo_saque: padroes.valor_minimo_saque,
      dias_liberacao_saque: padroes.dias_liberacao_saque,
    });
  }, [padroes]);

  // Manipuladores de alteração de valores
  const handleChangeValue = (field: keyof AtualizarPadroesRequest, value: string) => {
    let parsedValue: number | undefined;
    
    // Converter para número se o campo for numérico
    if (value.trim() === '') {
      parsedValue = undefined;
    } else if (field === 'valor_minimo_saque') {
      parsedValue = parseCurrency(value);
    } else if (
      field === 'percentual_reserva_antecipacao' || 
      field === 'taxa_antecipacao' || 
      field === 'taxa_saque'
    ) {
      // Converter percentual (remove o % e divide por 100)
      parsedValue = parseFloat(value.replace('%', '')) / 100;
    } else {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  // Manipulador para alteração de status de método de pagamento
  const handleToggleMetodoStatus = (index: number) => {
    const updatedMetodos = [...metodosPagamento];
    updatedMetodos[index].ativo = !updatedMetodos[index].ativo;
    setMetodosPagamento(updatedMetodos);
  };

  // Manipulador para alteração de taxa de método de pagamento
  const handleChangeMetodoTaxa = (index: number, field: 'taxa_fixa' | 'taxa_percentual', value: string) => {
    const updatedMetodos = [...metodosPagamento];
    
    if (field === 'taxa_fixa') {
      updatedMetodos[index].taxa_fixa = parseCurrency(value);
    } else {
      // Converter percentual (remove o % e divide por 100)
      updatedMetodos[index].taxa_percentual = parseFloat(value.replace('%', '')) / 100;
    }
    
    setMetodosPagamento(updatedMetodos);
  };

  // Salvar alterações
  const handleSave = async () => {
    // Verificar se há alterações nos métodos de pagamento
    if (JSON.stringify(metodosPagamento) !== JSON.stringify(padroes?.metodos_pagamento)) {
      setFormData(prev => ({
        ...prev,
        metodos_pagamento: metodosPagamento
      }));
    }
    
    // Verificar se há campos vazios
    const requiredFields = [
      'percentual_reserva_antecipacao',
      'dias_antecipacao',
      'taxa_antecipacao',
      'taxa_saque',
      'valor_minimo_saque',
      'dias_liberacao_saque'
    ];
    
    const missingFields = requiredFields.filter(field => 
      formData[field as keyof AtualizarPadroesRequest] === undefined
    );
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha todos os campos obrigatórios.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Atualizar com os métodos de pagamento
    const dadosAtualizados: AtualizarPadroesRequest = {
      ...formData,
      metodos_pagamento: metodosPagamento
    };
    
    const success = await updatePadroes(dadosAtualizados);
    
    if (success) {
      Alert.alert(
        'Sucesso',
        'Padrões atualizados com sucesso!',
        [{ text: 'OK', onPress: onSave }]
      );
    }
  };

  if (loading && !padroes) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Carregando padrões do sistema...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            clearError();
            fetchPadroes();
          }}
        >
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Métodos de Pagamento */}
      <Card style={styles.card}>
        <Card.Title title="Métodos de Pagamento" />
        <Card.Content>
          {metodosPagamento.map((metodo, index) => (
            <View key={metodo.id || index}>
              <View style={styles.metodoHeader}>
                <Text style={styles.metodoNome}>{metodo.nome}</Text>
                <Switch
                  value={metodo.ativo}
                  onValueChange={() => handleToggleMetodoStatus(index)}
                  trackColor={{ false: '#ccc', true: '#bae6fd' }}
                  thumbColor={metodo.ativo ? '#0066cc' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Taxa Fixa:</Text>
                <TextInput
                  style={styles.input}
                  value={metodo.taxa_fixa !== undefined ? formatCurrency(metodo.taxa_fixa) : ''}
                  onChangeText={(value) => handleChangeMetodoTaxa(index, 'taxa_fixa', value)}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor="#ccc"
                  activeOutlineColor="#0066cc"
                  disabled={!metodo.ativo}
                />
              </View>
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Taxa Percentual:</Text>
                <TextInput
                  style={styles.input}
                  value={metodo.taxa_percentual !== undefined ? formatPercent(metodo.taxa_percentual) : ''}
                  onChangeText={(value) => handleChangeMetodoTaxa(index, 'taxa_percentual', value)}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor="#ccc"
                  activeOutlineColor="#0066cc"
                  disabled={!metodo.ativo}
                />
              </View>
              
              {index < metodosPagamento.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Configurações de Antecipação */}
      <Card style={styles.card}>
        <Card.Title title="Configurações de Antecipação" />
        <Card.Content>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Percentual de Reserva:</Text>
            <TextInput
              style={styles.input}
              value={
                formData.percentual_reserva_antecipacao !== undefined 
                  ? formatPercent(formData.percentual_reserva_antecipacao) 
                  : ''
              }
              onChangeText={(value) => handleChangeValue('percentual_reserva_antecipacao', value)}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#ccc"
              activeOutlineColor="#0066cc"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Dias para Antecipação:</Text>
            <TextInput
              style={styles.input}
              value={
                formData.dias_antecipacao !== undefined 
                  ? formData.dias_antecipacao.toString() 
                  : ''
              }
              onChangeText={(value) => handleChangeValue('dias_antecipacao', value)}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#ccc"
              activeOutlineColor="#0066cc"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Taxa de Antecipação:</Text>
            <TextInput
              style={styles.input}
              value={
                formData.taxa_antecipacao !== undefined 
                  ? formatPercent(formData.taxa_antecipacao) 
                  : ''
              }
              onChangeText={(value) => handleChangeValue('taxa_antecipacao', value)}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#ccc"
              activeOutlineColor="#0066cc"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Configurações de Saque */}
      <Card style={styles.card}>
        <Card.Title title="Configurações de Saque" />
        <Card.Content>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Taxa de Saque:</Text>
            <TextInput
              style={styles.input}
              value={
                formData.taxa_saque !== undefined 
                  ? formatPercent(formData.taxa_saque) 
                  : ''
              }
              onChangeText={(value) => handleChangeValue('taxa_saque', value)}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#ccc"
              activeOutlineColor="#0066cc"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Valor Mínimo para Saque:</Text>
            <TextInput
              style={styles.input}
              value={
                formData.valor_minimo_saque !== undefined 
                  ? formatCurrency(formData.valor_minimo_saque) 
                  : ''
              }
              onChangeText={(value) => handleChangeValue('valor_minimo_saque', value)}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#ccc"
              activeOutlineColor="#0066cc"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Dias para Liberação:</Text>
            <TextInput
              style={styles.input}
              value={
                formData.dias_liberacao_saque !== undefined 
                  ? formData.dias_liberacao_saque.toString() 
                  : ''
              }
              onChangeText={(value) => handleChangeValue('dias_liberacao_saque', value)}
              keyboardType="numeric"
              mode="outlined"
              outlineColor="#ccc"
              activeOutlineColor="#0066cc"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: 300,
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
    marginVertical: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  metodoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metodoNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  divider: {
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
  },
}); 