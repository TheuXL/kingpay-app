import React from 'react';
import { Modal, Portal, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

import { AppButton } from './AppButton';

type ConfirmationModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
};

export const ConfirmationModal = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  content,
}: ConfirmationModalProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}>
        <Text variant="headlineSmall">{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.actions}>
          <AppButton onPress={onDismiss} style={styles.button}>
            Cancelar
          </AppButton>
          <AppButton
            mode="contained"
            onPress={onConfirm}
            style={styles.button}>
            Confirmar
          </AppButton>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#183153', // surface color from theme
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  content: {
    marginVertical: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 8,
  },
}); 