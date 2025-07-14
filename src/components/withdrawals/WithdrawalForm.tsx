import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, Text, TextInput } from 'react-native-paper';
import { useWithdrawalStore } from '../../store';
import { CreateWithdrawalPayload, PixKey } from '../../types';

interface WithdrawalFormProps {
  pixKeys: PixKey[];
  onSuccess: () => void;
}

export const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  pixKeys,
  onSuccess,
}) => {
  const { createNewWithdrawal, isCreating, error } = useWithdrawalStore();
  
  const [selectedPixKeyId, setSelectedPixKeyId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Selecionar a primeira chave PIX por padrão, se disponível
    if (pixKeys.length > 0 && !selectedPixKeyId) {
      setSelectedPixKeyId(pixKeys[0].id);
    }
  }, [pixKeys]);
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!selectedPixKeyId) {
      errors.pixKey = 'Selecione uma chave PIX';
    }
    
    const amountValue = parseFloat(amount.replace(',', '.'));
    if (isNaN(amountValue) || amountValue <= 0) {
      errors.amount = 'Informe um valor válido maior que zero';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    const payload: CreateWithdrawalPayload = {
      pixkeyid: selectedPixKeyId,
      requestedamount: parseFloat(amount.replace(',', '.')),
      description: description.trim() || undefined,
      isPix: true, // Assumindo que sempre será PIX
    };
    
    const success = await createNewWithdrawal(payload);
    
    if (success) {
      Alert.alert('Sucesso', 'Solicitação de saque enviada com sucesso');
      setAmount('');
      setDescription('');
      onSuccess();
    } else if (error) {
      Alert.alert('Erro', error);
    }
  };
  
  return (
    <Card style={styles.card}>
      <Card.Title title="Solicitar Saque" />
      <Card.Content>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Chave PIX</Text>
          <View style={[styles.pickerContainer, formErrors.pixKey ? styles.inputError : null]}>
            <Picker
              selectedValue={selectedPixKeyId}
              onValueChange={(value) => setSelectedPixKeyId(value)}
              style={styles.picker}
              enabled={!isCreating && pixKeys.length > 0}
            >
              {pixKeys.length === 0 ? (
                <Picker.Item label="Nenhuma chave PIX disponível" value="" />
              ) : (
                pixKeys.map((key) => (
                  <Picker.Item
                    key={key.id}
                    label={`${key.key} (${key.key_type})`}
                    value={key.id}
                  />
                ))
              )}
            </Picker>
          </View>
          {formErrors.pixKey && (
            <HelperText type="error">{formErrors.pixKey}</HelperText>
          )}
          
          {pixKeys.length === 0 && (
            <HelperText type="info">
              Você precisa cadastrar uma chave PIX antes de solicitar um saque.
            </HelperText>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0,00"
            style={styles.input}
            error={!!formErrors.amount}
            disabled={isCreating}
            left={<TextInput.Affix text="R$" />}
          />
          {formErrors.amount && (
            <HelperText type="error">{formErrors.amount}</HelperText>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição do saque"
            style={styles.input}
            multiline
            numberOfLines={3}
            disabled={isCreating}
          />
        </View>
        
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isCreating}
          disabled={isCreating || pixKeys.length === 0}
          style={styles.button}
        >
          Solicitar Saque
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
  button: {
    marginTop: 16,
  },
  inputError: {
    borderColor: 'red',
  },
}); 