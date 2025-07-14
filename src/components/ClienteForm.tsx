import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { useClientesStore } from '../store/clientesStore';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../types/clientes';

interface ClienteFormProps {
  cliente?: Cliente;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onSave,
  onCancel
}) => {
  // Determina se é edição ou criação
  const isEdicao = !!cliente?.id;
  
  // Acesso à store de clientes
  const { createCliente, updateCliente, loading, error, clearError } = useClientesStore();
  
  // Estado do formulário
  const [formData, setFormData] = useState<CreateClienteRequest | UpdateClienteRequest>({
    nome: '',
    taxId: '',
    email: '',
    telefone: '',
    tipo: 'PF',
    status: 'ativo',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil'
    },
    observacoes: '',
    limite_credito: 0
  });
  
  // Erros de validação
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Preencher o formulário com os dados do cliente se estiver editando
  useEffect(() => {
    if (cliente) {
      setFormData({
        ...cliente,
        endereco: cliente.endereco || {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          pais: 'Brasil'
        }
      });
    }
  }, [cliente]);
  
  // Função para atualizar campos do formulário
  const handleChange = (field: string, value: any) => {
    // Limpar erro de validação ao editar o campo
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Atualizar o campo
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Função para atualizar campos de endereço
  const handleEnderecoChange = (field: string, value: string) => {
    // Limpar erro de validação ao editar o campo
    if (validationErrors[`endereco.${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`endereco.${field}`];
        return newErrors;
      });
    }
    
    // Atualizar o campo de endereço
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...(prev.endereco || {}),
        [field]: value
      }
    }));
  };
  
  // Validar o formulário
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validar campos obrigatórios
    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.taxId || formData.taxId.trim() === '') {
      errors.taxId = 'CPF/CNPJ é obrigatório';
    } else {
      // Validar formato do CPF/CNPJ
      const taxIdNumerico = formData.taxId.replace(/\D/g, '');
      
      if (formData.tipo === 'PF' && taxIdNumerico.length !== 11) {
        errors.taxId = 'CPF deve ter 11 dígitos';
      }
      
      if (formData.tipo === 'PJ' && taxIdNumerico.length !== 14) {
        errors.taxId = 'CNPJ deve ter 14 dígitos';
      }
    }
    
    // Validar email (se fornecido)
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Email inválido';
    }
    
    // Validar CEP (se fornecido)
    if (formData.endereco?.cep && formData.endereco.cep.replace(/\D/g, '').length !== 8) {
      errors['endereco.cep'] = 'CEP inválido';
    }
    
    // Validar limite de crédito
    if (formData.limite_credito && formData.limite_credito < 0) {
      errors.limite_credito = 'Limite de crédito não pode ser negativo';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Função para salvar o cliente
  const handleSave = async () => {
    // Limpar erros anteriores
    clearError();
    
    // Validar formulário
    if (!validateForm()) {
      return;
    }
    
    try {
      let success = false;
      
      if (isEdicao && cliente?.id) {
        // Atualizar cliente existente
        const updateData: UpdateClienteRequest = {
          id: cliente.id,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          status: formData.status as 'ativo' | 'inativo' | 'bloqueado',
          endereco: formData.endereco,
          observacoes: formData.observacoes,
          limite_credito: formData.limite_credito
        };
        
        success = await updateCliente(updateData);
      } else {
        // Criar novo cliente
        const createData: CreateClienteRequest = {
          nome: formData.nome || '', // Garantir que não seja undefined
          taxId: formData.taxId || '', // Garantir que não seja undefined
          email: formData.email,
          telefone: formData.telefone,
          tipo: formData.tipo as 'PF' | 'PJ',
          endereco: formData.endereco,
          observacoes: formData.observacoes,
          limite_credito: formData.limite_credito
        };
        
        success = await createCliente(createData);
      }
      
      if (success) {
        Alert.alert(
          isEdicao ? 'Cliente Atualizado' : 'Cliente Criado',
          isEdicao ? 'O cliente foi atualizado com sucesso.' : 'O cliente foi criado com sucesso.',
          [{ text: 'OK', onPress: onSave }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Ocorreu um erro ao salvar o cliente'
      );
    }
  };
  
  // Função para renderizar erro
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro</Text>
        <Text>{error}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>
          {isEdicao ? 'Editar Cliente' : 'Novo Cliente'}
        </Text>
      </View>
      
      {renderError()}
      
      {/* Campo de nome */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={[
            styles.input,
            validationErrors.nome ? styles.inputError : null
          ]}
          value={formData.nome}
          onChangeText={(value) => handleChange('nome', value)}
          placeholder="Nome completo"
        />
        {validationErrors.nome && (
          <Text style={styles.errorText}>{validationErrors.nome}</Text>
        )}
      </View>
      
      {/* Campo de tipo */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tipo *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.tipo}
            onValueChange={(value) => handleChange('tipo', value)}
            enabled={!isEdicao} // Desabilitar edição do tipo se for edição
            style={styles.picker}
          >
            <Picker.Item label="Pessoa Física" value="PF" />
            <Picker.Item label="Pessoa Jurídica" value="PJ" />
          </Picker>
        </View>
      </View>
      
      {/* Campo de CPF/CNPJ */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          {formData.tipo === 'PF' ? 'CPF *' : 'CNPJ *'}
        </Text>
        <TextInputMask
          type={formData.tipo === 'PF' ? 'cpf' : 'cnpj'}
          style={[
            styles.input,
            validationErrors.taxId ? styles.inputError : null
          ]}
          value={formData.taxId}
          onChangeText={(value: string) => handleChange('taxId', value)}
          placeholder={formData.tipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
          editable={!isEdicao} // Desabilitar edição do taxId se for edição
        />
        {validationErrors.taxId && (
          <Text style={styles.errorText}>{validationErrors.taxId}</Text>
        )}
      </View>
      
      {/* Campo de status (somente edição) */}
      {isEdicao && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Status *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value) => handleChange('status', value)}
                style={styles.picker}
              >
                <Picker.Item label="Ativo" value="ativo" />
                <Picker.Item label="Inativo" value="inativo" />
                <Picker.Item label="Bloqueado" value="bloqueado" />
              </Picker>
            </View>
        </View>
      )}
      
      {/* Campo de email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            validationErrors.email ? styles.inputError : null
          ]}
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {validationErrors.email && (
          <Text style={styles.errorText}>{validationErrors.email}</Text>
        )}
      </View>
      
      {/* Campo de telefone */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Telefone</Text>
        <TextInputMask
          type={'cel-phone'}
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) '
          }}
          style={styles.input}
          value={formData.telefone}
          onChangeText={(value: string) => handleChange('telefone', value)}
          placeholder="(00) 00000-0000"
        />
      </View>
      
      {/* Campos de endereço */}
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitle}>Endereço</Text>
      </View>
      
      {/* CEP */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>CEP</Text>
        <TextInputMask
          type={'zip-code'}
          style={[
            styles.input,
            validationErrors['endereco.cep'] ? styles.inputError : null
          ]}
          value={formData.endereco?.cep}
          onChangeText={(value: string) => handleEnderecoChange('cep', value)}
          placeholder="00000-000"
        />
        {validationErrors['endereco.cep'] && (
          <Text style={styles.errorText}>{validationErrors['endereco.cep']}</Text>
        )}
      </View>
      
      {/* Logradouro */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Logradouro</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco?.logradouro}
          onChangeText={(value) => handleEnderecoChange('logradouro', value)}
          placeholder="Rua, Avenida, etc."
        />
      </View>
      
      {/* Número */}
      <View style={styles.rowContainer}>
        <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco?.numero}
            onChangeText={(value) => handleEnderecoChange('numero', value)}
            placeholder="Número"
            keyboardType="numeric"
          />
        </View>
        
        {/* Complemento */}
        <View style={[styles.fieldContainer, { flex: 2 }]}>
          <Text style={styles.label}>Complemento</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco?.complemento}
            onChangeText={(value) => handleEnderecoChange('complemento', value)}
            placeholder="Apto, Sala, etc."
          />
        </View>
      </View>
      
      {/* Bairro */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco?.bairro}
          onChangeText={(value) => handleEnderecoChange('bairro', value)}
          placeholder="Bairro"
        />
      </View>
      
      {/* Cidade e Estado */}
      <View style={styles.rowContainer}>
        <View style={[styles.fieldContainer, { flex: 2, marginRight: 8 }]}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco?.cidade}
            onChangeText={(value) => handleEnderecoChange('cidade', value)}
            placeholder="Cidade"
          />
        </View>
        
        {/* Estado */}
        <View style={[styles.fieldContainer, { flex: 1 }]}>
          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco?.estado}
            onChangeText={(value) => handleEnderecoChange('estado', value)}
            placeholder="UF"
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
      </View>
      
      {/* País */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>País</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco?.pais}
          onChangeText={(value) => handleEnderecoChange('pais', value)}
          placeholder="País"
          defaultValue="Brasil"
        />
      </View>
      
      {/* Observações */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.observacoes}
          onChangeText={(value) => handleChange('observacoes', value)}
          placeholder="Observações adicionais sobre o cliente"
          multiline={true}
          numberOfLines={4}
        />
      </View>
      
      {/* Limite de Crédito */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Limite de Crédito (R$)</Text>
        <TextInput
          style={[
            styles.input,
            validationErrors.limite_credito ? styles.inputError : null
          ]}
          value={formData.limite_credito?.toString()}
          onChangeText={(value) => handleChange('limite_credito', parseFloat(value) || 0)}
          keyboardType="numeric"
          placeholder="0.00"
        />
        {validationErrors.limite_credito && (
          <Text style={styles.errorText}>{validationErrors.limite_credito}</Text>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isEdicao ? 'Atualizar' : 'Salvar'}
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
    padding: 16,
  },
  formHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    width: '100%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#0066CC',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffeeee',
    borderRadius: 4,
    marginBottom: 16,
  },
  errorTitle: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 