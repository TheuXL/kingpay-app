import SubAccountList from '@/components/SubAccountList';
import { useAuth } from '@/contexts/AuthContext';
import { SubAccount } from '@/services/subAccountService';
import { hasPermission } from '@/utils/permissions';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubAccountAdminScreen() {
  const { session, user } = useAuth();
  const [hasAdminPermission, setHasAdminPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Verificar se o usuário tem permissão de administrador
        const adminPermission = await hasPermission(user?.id, 'admin_subaccount');
        setHasAdminPermission(adminPermission);
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      checkPermission();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleSelectSubAccount = (subAccount: SubAccount) => {
    // Aqui poderia navegar para uma tela de detalhes da subconta
    Alert.alert(
      'Subconta Selecionada',
      `Subconta: ${subAccount.name}\nID: ${subAccount.id}\nEmpresa: ${subAccount.company?.name || 'N/A'}`
    );
  };

  const handleCheckStatus = (subAccount: SubAccount) => {
    // A lógica já está implementada no componente SubAccountList
    console.log('Verificando status da subconta:', subAccount.id);
  };

  const handleCheckKyc = (subAccount: SubAccount) => {
    // A lógica já está implementada no componente SubAccountList
    console.log('Verificando status KYC da subconta:', subAccount.id);
  };

  const handleResendDocuments = (subAccount: SubAccount) => {
    // Aqui poderia navegar para uma tela de reenvio de documentos
    Alert.alert(
      'Reenviar Documentos',
      `Você será redirecionado para a tela de reenvio de documentos para a subconta ${subAccount.name}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Continuar',
          onPress: () => {
            // Navegação para tela de reenvio de documentos
            console.log('Navegar para tela de reenvio de documentos para subconta:', subAccount.id);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Administração de Subcontas' }} />
        <View style={styles.loadingContainer}>
          <Text>Verificando permissões...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Administração de Subcontas' }} />
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedText}>
            Você precisa estar logado para acessar esta tela.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => {
              // Navegar para a tela de login
            }}
          >
            <Text style={styles.loginButtonText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasAdminPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Administração de Subcontas' }} />
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedText}>
            Você não tem permissão para acessar esta tela.
          </Text>
          <Text style={styles.unauthorizedSubText}>
            Entre em contato com o administrador do sistema para solicitar acesso.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Administração de Subcontas' }} />
      <SubAccountList
        onSelectSubAccount={handleSelectSubAccount}
        onCheckStatus={handleCheckStatus}
        onCheckKyc={handleCheckKyc}
        onResendDocuments={handleResendDocuments}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unauthorizedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#d32f2f',
  },
  unauthorizedSubText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: 200,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 