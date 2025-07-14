import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useEmailTemplatesStore } from '../store/emailTemplatesStore';

interface AceitarTermosButtonProps {
  onSuccess?: () => void;
  style?: object;
}

export const AceitarTermosButton: React.FC<AceitarTermosButtonProps> = ({ onSuccess, style }) => {
  const { aceitandoTermos, error, aceitarTermos, resetError } = useEmailTemplatesStore();

  const handleAceitarTermos = async () => {
    resetError();
    
    Alert.alert(
      'Aceitar Termos de Uso',
      'Você confirma que leu e concorda com os termos de uso?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceitar',
          onPress: async () => {
            const success = await aceitarTermos();
            
            if (success) {
              Alert.alert('Sucesso', 'Termos de uso aceitos com sucesso!');
              if (onSuccess) {
                onSuccess();
              }
            } else if (error) {
              Alert.alert('Erro', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleAceitarTermos}
      disabled={aceitandoTermos}
    >
      {aceitandoTermos ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.buttonText}>Aceitar Termos de Uso</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 