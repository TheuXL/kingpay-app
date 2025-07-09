import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { AppButton } from './AppButton';

interface FinancialPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  title?: string;
  message?: string;
}

export const FinancialPasswordModal: React.FC<FinancialPasswordModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Senha Financeira',
  message = 'Digite sua senha financeira para confirmar esta operação.',
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password) {
      setError('Por favor, digite sua senha financeira.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onConfirm(password);
      handleClose();
    } catch (err) {
      setError('Senha financeira incorreta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View 
          style={styles.container}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <Text variant="titleLarge" style={styles.title}>
            {title}
          </Text>
          
          <Text variant="bodyMedium" style={styles.message}>
            {message}
          </Text>
          
          <TextInput
            label="Senha Financeira"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            error={!!error}
          />
          
          {error && (
            <Text variant="bodySmall" style={styles.errorText}>
              {error}
            </Text>
          )}
          
          <View style={styles.buttonContainer}>
            <AppButton 
              mode="outlined" 
              onPress={handleClose} 
              style={styles.button}
              disabled={loading}
            >
              Cancelar
            </AppButton>
            
            <AppButton 
              mode="contained" 
              onPress={handleConfirm} 
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Confirmar
            </AppButton>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#B00020',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 