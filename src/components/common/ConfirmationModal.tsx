import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme
} from 'react-native';
import { customTheme } from '../../theme/theme';

export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message?: string;
  content?: string;  // Alternative to message
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;  // Alternative to onCancel
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  content,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  onDismiss,
  confirmButtonColor,
  cancelButtonColor,
  isDestructive = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use onDismiss as fallback for onCancel
  const handleCancel = onCancel || onDismiss;
  
  // Use content as fallback for message
  const finalMessage = message || content;

  // Determine button colors
  const defaultConfirmColor = isDestructive ? customTheme.colors.danger : customTheme.colors.primary;
  const buttonConfirmColor = confirmButtonColor || defaultConfirmColor;
  const buttonCancelColor = cancelButtonColor || (isDark ? '#666' : '#999');

  const backgroundStyle = {
    backgroundColor: isDark ? customTheme.colors.card.dark : customTheme.colors.card.light,
  };
  
  const textColorStyle = {
    color: isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light,
  };

  if (!handleCancel) {
    console.warn('ConfirmationModal requires either onCancel or onDismiss prop');
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, backgroundStyle]}>
              <Text style={[styles.title, textColorStyle]}>{title}</Text>
              <Text style={[styles.message, {
                color: isDark 
                  ? customTheme.colors.text.secondary.dark 
                  : customTheme.colors.text.secondary.light
              }]}>
                {finalMessage}
              </Text>
              
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, { color: buttonCancelColor }]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <Text style={[styles.buttonText, { color: buttonConfirmColor }]}>
                    {confirmText}
                  </Text>
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
    width: '80%',
    borderRadius: customTheme.borderRadius.medium,
    padding: customTheme.spacing.lg,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: customTheme.fontSizes.lg,
    fontWeight: '700', // Changed from theme.fontWeights.bold to '700'
    marginBottom: customTheme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: customTheme.fontSizes.md,
    marginBottom: customTheme.spacing.lg,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: customTheme.spacing.md,
    paddingHorizontal: customTheme.spacing.md,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
  confirmButton: {
    borderLeftWidth: 0.5,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: customTheme.fontSizes.md,
    fontWeight: '600', // Changed from theme.fontWeights.semibold to '600'
  },
}); 