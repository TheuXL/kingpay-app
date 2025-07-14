import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import PixKeyList from '../src/components/PixKeyList';
import { useAuth } from '../src/contexts/AuthContext';

export default function PixKeyAdminScreen() {
  const { user } = useAuth();
  
  // Verificar se o usuário é administrador
  const isAdmin = user?.is_admin || false;
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Gerenciamento de Chaves Pix',
          headerTitleAlign: 'center',
        }}
      />
      
      {!isAdmin ? (
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedTitle}>Acesso Negado</Text>
          <Text style={styles.unauthorizedText}>
            Você não tem permissão para acessar esta área.
            Esta funcionalidade é exclusiva para administradores.
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Gerenciamento de Chaves Pix</Text>
          <Text style={styles.subtitle}>
            Aqui você pode visualizar, aprovar ou reprovar chaves Pix dos usuários.
          </Text>
          
          <PixKeyList />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 16,
  },
  unauthorizedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 