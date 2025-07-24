import { Alert, Platform, ToastAndroid } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

/**
 * Exibe um toast nativo no Android ou um Alert no iOS.
 * @param message A mensagem a ser exibida.
 * @param type O tipo de toast (usado para o título no iOS).
 */
export const showToast = (message: string, type: ToastType = 'success') => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    const title = type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Aviso';
    Alert.alert(title, message);
  }
}; 