import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useLinkPagamentosStore } from '../store/linkPagamentosStore';
import { CreateLinkPagamentoRequest, FormaPagamento, LinkPagamento, UpdateLinkPagamentoRequest } from '../types/linkPagamentos';

interface LinkPagamentoFormProps {
  linkPagamento?: LinkPagamento;
  isEditing?: boolean;
  companyId?: string;
}

export const LinkPagamentoForm: React.FC<LinkPagamentoFormProps> = ({ 
  linkPagamento,
  isEditing = false,
  companyId
}) => {
  const router = useRouter();
  const { createLinkPagamento, updateLinkPagamento, loading, error } = useLinkPagamentosStore();
  
  // Estado do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([
    { tipo: 'pix', ativo: true },
    { tipo: 'cartao', ativo: false },
    { tipo: 'boleto', ativo: false }
  ]);
  const [dataExpiracao, setDataExpiracao] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [maxParcelas, setMaxParcelas] = useState('');
  const [permiteDesconto, setPermiteDesconto] = useState(false);
  const [descontoPorcentagem, setDescontoPorcentagem] = useState('');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  
  // Tema
  const [corPrimaria, setCorPrimaria] = useState('#0066cc');
  const [corSecundaria, setCorSecundaria] = useState('#ffffff');
  
  // Preencher o formulário com os dados do link se estiver editando
  useEffect(() => {
    if (isEditing && linkPagamento) {
      setNome(linkPagamento.nome);
      setDescricao(linkPagamento.descricao || '');
      setValor(linkPagamento.valor.toString());
      setFormasPagamento(linkPagamento.formas_pagamento);
      
      if (linkPagamento.data_expiracao) {
        setDataExpiracao(new Date(linkPagamento.data_expiracao));
      }
      
      if (linkPagamento.max_parcelas) {
        setMaxParcelas(linkPagamento.max_parcelas.toString());
      }
      
      setPermiteDesconto(linkPagamento.permite_desconto || false);
      
      if (linkPagamento.desconto_porcentagem) {
        setDescontoPorcentagem(linkPagamento.desconto_porcentagem.toString());
      }
      
      setStatus(linkPagamento.status === 'expirado' ? 'inativo' : linkPagamento.status);
      
      if (linkPagamento.tema) {
        if (linkPagamento.tema.cor_primaria) {
          setCorPrimaria(linkPagamento.tema.cor_primaria);
        }
        
        if (linkPagamento.tema.cor_secundaria) {
          setCorSecundaria(linkPagamento.tema.cor_secundaria);
        }
      }
    }
  }, [isEditing, linkPagamento]);

  // Alternar forma de pagamento
  const toggleFormaPagamento = (tipo: 'pix' | 'cartao' | 'boleto') => {
    setFormasPagamento(formas => formas.map(forma => 
      forma.tipo === tipo ? { ...forma, ativo: !forma.ativo } : forma
    ));
  };

  // Manipular alteração de data
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataExpiracao(selectedDate);
    }
  };

  // Validar formulário
  const validateForm = (): boolean => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome do link é obrigatório');
      return false;
    }

    if (!valor.trim() || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
      Alert.alert('Erro', 'Informe um valor válido maior que zero');
      return false;
    }

    if (!formasPagamento.some(forma => forma.ativo)) {
      Alert.alert('Erro', 'Selecione pelo menos uma forma de pagamento');
      return false;
    }

    if (maxParcelas && (isNaN(parseInt(maxParcelas)) || parseInt(maxParcelas) <= 0)) {
      Alert.alert('Erro', 'O número máximo de parcelas deve ser um número positivo');
      return false;
    }

    if (permiteDesconto && descontoPorcentagem && 
        (isNaN(parseFloat(descontoPorcentagem)) || 
         parseFloat(descontoPorcentagem) <= 0 || 
         parseFloat(descontoPorcentagem) > 100)) {
      Alert.alert('Erro', 'A porcentagem de desconto deve estar entre 0 e 100');
      return false;
    }

    if (!companyId) {
      Alert.alert('Erro', 'ID da empresa não fornecido');
      return false;
    }

    return true;
  };

  // Enviar formulário
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && linkPagamento?.id) {
        // Atualizar link existente
        const linkData: UpdateLinkPagamentoRequest = {
          id: linkPagamento.id,
          nome,
          descricao: descricao || undefined,
          valor: parseFloat(valor),
          formas_pagamento: formasPagamento,
          status,
          data_expiracao: dataExpiracao ? format(dataExpiracao, 'yyyy-MM-dd') : undefined,
          max_parcelas: maxParcelas ? parseInt(maxParcelas) : undefined,
          permite_desconto: permiteDesconto,
          desconto_porcentagem: descontoPorcentagem ? parseFloat(descontoPorcentagem) : undefined,
          tema: {
            cor_primaria: corPrimaria,
            cor_secundaria: corSecundaria
          }
        };

        const success = await updateLinkPagamento(linkData);
        
        if (success) {
          Alert.alert('Sucesso', 'Link de pagamento atualizado com sucesso', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        }
      } else {
        // Criar novo link
        const linkData: CreateLinkPagamentoRequest = {
          nome,
          descricao: descricao || undefined,
          valor: parseFloat(valor),
          formas_pagamento: formasPagamento,
          company_id: companyId!,
          data_expiracao: dataExpiracao ? format(dataExpiracao, 'yyyy-MM-dd') : undefined,
          max_parcelas: maxParcelas ? parseInt(maxParcelas) : undefined,
          permite_desconto: permiteDesconto,
          desconto_porcentagem: descontoPorcentagem ? parseFloat(descontoPorcentagem) : undefined,
          tema: {
            cor_primaria: corPrimaria,
            cor_secundaria: corSecundaria
          }
        };

        const success = await createLinkPagamento(linkData);
        
        if (success) {
          Alert.alert('Sucesso', 'Link de pagamento criado com sucesso', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar link de pagamento:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o link de pagamento');
    }
  };

  // Renderizar mensagem de erro
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Link*</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Pagamento Mensal"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição do link de pagamento"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Valor (R$)*</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={setValor}
          placeholder="0,00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Formas de Pagamento*</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              formasPagamento.find(f => f.tipo === 'pix')?.ativo && styles.paymentOptionActive
            ]}
            onPress={() => toggleFormaPagamento('pix')}
          >
            <Ionicons 
              name="qr-code-outline" 
              size={24} 
              color={formasPagamento.find(f => f.tipo === 'pix')?.ativo ? '#fff' : '#333'} 
            />
            <Text style={[
              styles.paymentOptionText,
              formasPagamento.find(f => f.tipo === 'pix')?.ativo && styles.paymentOptionTextActive
            ]}>PIX</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              formasPagamento.find(f => f.tipo === 'cartao')?.ativo && styles.paymentOptionActive
            ]}
            onPress={() => toggleFormaPagamento('cartao')}
          >
            <Ionicons 
              name="card-outline" 
              size={24} 
              color={formasPagamento.find(f => f.tipo === 'cartao')?.ativo ? '#fff' : '#333'} 
            />
            <Text style={[
              styles.paymentOptionText,
              formasPagamento.find(f => f.tipo === 'cartao')?.ativo && styles.paymentOptionTextActive
            ]}>Cartão</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              formasPagamento.find(f => f.tipo === 'boleto')?.ativo && styles.paymentOptionActive
            ]}
            onPress={() => toggleFormaPagamento('boleto')}
          >
            <Ionicons 
              name="document-text-outline" 
              size={24} 
              color={formasPagamento.find(f => f.tipo === 'boleto')?.ativo ? '#fff' : '#333'} 
            />
            <Text style={[
              styles.paymentOptionText,
              formasPagamento.find(f => f.tipo === 'boleto')?.ativo && styles.paymentOptionTextActive
            ]}>Boleto</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Data de Expiração</Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {dataExpiracao 
              ? format(dataExpiracao, 'dd/MM/yyyy', { locale: ptBR }) 
              : 'Selecionar data'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={dataExpiracao || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {formasPagamento.find(f => f.tipo === 'cartao')?.ativo && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Número máximo de parcelas</Text>
          <TextInput
            style={styles.input}
            value={maxParcelas}
            onChangeText={setMaxParcelas}
            placeholder="Ex: 12"
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Permitir desconto</Text>
          <Switch
            value={permiteDesconto}
            onValueChange={setPermiteDesconto}
            trackColor={{ false: '#ccc', true: '#0066cc' }}
            thumbColor={permiteDesconto ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        {permiteDesconto && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Porcentagem de desconto (%)</Text>
            <TextInput
              style={styles.input}
              value={descontoPorcentagem}
              onChangeText={setDescontoPorcentagem}
              placeholder="Ex: 10"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </View>
        )}
      </View>

      {isEditing && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusOptions}>
            <TouchableOpacity 
              style={[
                styles.statusOption, 
                status === 'ativo' && styles.statusOptionActive
              ]}
              onPress={() => setStatus('ativo')}
            >
              <Text style={[
                styles.statusOptionText,
                status === 'ativo' && styles.statusOptionTextActive
              ]}>Ativo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.statusOption, 
                status === 'inativo' && styles.statusOptionActive
              ]}
              onPress={() => setStatus('inativo')}
            >
              <Text style={[
                styles.statusOptionText,
                status === 'inativo' && styles.statusOptionTextActive
              ]}>Inativo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.sectionTitle}>Personalização</Text>
        
        <View style={styles.colorPickerContainer}>
          <View style={styles.colorPicker}>
            <Text style={styles.colorLabel}>Cor Primária</Text>
            <View style={[styles.colorPreview, { backgroundColor: corPrimaria }]} />
            <TextInput
              style={styles.colorInput}
              value={corPrimaria}
              onChangeText={setCorPrimaria}
              placeholder="#000000"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.colorPicker}>
            <Text style={styles.colorLabel}>Cor Secundária</Text>
            <View style={[styles.colorPreview, { backgroundColor: corSecundaria }]} />
            <TextInput
              style={styles.colorInput}
              value={corSecundaria}
              onChangeText={setCorSecundaria}
              placeholder="#FFFFFF"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Atualizar' : 'Criar'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#f9f9f9',
  },
  paymentOptionActive: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 6,
  },
  paymentOptionTextActive: {
    color: '#fff',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
  },
  statusOptionActive: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusOptionTextActive: {
    color: '#fff',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorPicker: {
    flex: 1,
    marginHorizontal: 4,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginBottom: 4,
  },
  colorPreview: {
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    marginLeft: 8,
    backgroundColor: '#0066cc',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: '#0066cc',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
}); 