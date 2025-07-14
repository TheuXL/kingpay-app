import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme
} from 'react-native';
import { customTheme } from '../../theme/theme';
import { AppTextInput } from './AppTextInput';

export interface FinancialPasswordModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (password: string) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export const FinancialPasswordModal: React.FC<FinancialPasswordModalProps> = ({
  visible,
  title = 'Senha Financeira',
  message = 'Digite sua senha financeira para confirmar esta operação.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  isLoading = false,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleConfirm = async () => {
    if (!password) {
      setError('A senha financeira é obrigatória');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onConfirm(password);
      setPassword('');
      setLoading(false);
    } catch (err) {
      setError('Senha financeira incorreta');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  const backgroundStyle = {
    backgroundColor: isDark ? customTheme.colors.card.dark : customTheme.colors.card.light,
  };
  
  const textColorStyle = {
    color: isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, backgroundStyle]}>
              <Text style={[styles.title, textColorStyle]}>{title}</Text>
              
              <Text style={[styles.message, {
                color: isDark 
                  ? customTheme.colors.text.secondary.dark 
                  : customTheme.colors.text.secondary.light
              }]}>
                {message}
              </Text>
              
              <AppTextInput
                label="Senha Financeira"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null);
                }}
                secureTextEntry
                error={error || undefined}
                autoFocus
              />
              
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleClose}
                  disabled={loading || isLoading}
                >
                  <Text style={[styles.buttonText, { 
                    color: isDark ? '#666' : '#999',
                    opacity: (loading || isLoading) ? 0.5 : 1
                  }]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleConfirm}
                  disabled={loading || isLoading || !password}
                >
                  {loading || isLoading ? (
                    <ActivityIndicator size="small" color={customTheme.colors.primary} />
                  ) : (
                    <Text style={[styles.buttonText, { 
                      color: customTheme.colors.primary,
                      opacity: (!password) ? 0.5 : 1
                    }]}>
                      {confirmText}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  modalContainer: {
    width: '90%',
    borderRadius: customTheme.borderRadius.medium,
    padding: customTheme.spacing.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: customTheme.fontSizes.lg,
    fontWeight: '700', // Changed from theme.fontWeights.bold
    marginBottom: customTheme.spacing.sm,
  },
  message: {
    fontSize: customTheme.fontSizes.md,
    marginBottom: customTheme.spacing.md,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: customTheme.spacing.md,
  },
  button: {
    paddingVertical: customTheme.spacing.md,
    paddingHorizontal: customTheme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: customTheme.fontSizes.md,
    fontWeight: '600', // Changed from theme.fontWeights.semibold
  },
}); 