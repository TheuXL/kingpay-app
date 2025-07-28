import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentLink } from '@/features/paymentLinks/types';
import { useRouter } from 'expo-router';

interface PaymentLinkItemProps {
  link: PaymentLink;
}

const PaymentLinkItem: React.FC<PaymentLinkItemProps> = ({ link }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/links/${link.id}`);
  };

  const handleCopyLink = () => {
    // Lógica para copiar o link
    console.log(`Copiar link: ${link.id}`);
  };

  const handleQRCode = () => {
    // Lógica para mostrar QR Code
    console.log(`QR Code para: ${link.id}`);
  };

  const handleToggleStatus = (value: boolean) => {
    // Lógica para atualizar o status do link
    console.log(`Alterar status para ${value} para o link: ${link.id}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{link.nome}</Text>
        <Text style={styles.price}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(link.valor / 100)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
          <Ionicons name="copy-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Copiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleQRCode}>
          <Ionicons name="qr-code-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Ionicons name="pencil-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.statusText}>Ativo</Text>
        <Switch
          value={link.ativo}
          onValueChange={handleToggleStatus}
          thumbColor={link.ativo ? '#34C759' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#34C759',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E5E5EA',
      paddingVertical: 12,
    },
    actionButton: {
      alignItems: 'center',
    },
    actionText: {
      color: '#007AFF',
      marginTop: 4,
      fontSize: 12,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
    },
    statusText: {
      fontSize: 16,
      color: '#3C3C43',
    },
});
  
export default PaymentLinkItem; 