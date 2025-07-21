import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AppContext';

export const UserDataDisplay = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Carregando dados do usuário...</Text>;
  }

  if (!user) {
    return <Text>Nenhum usuário logado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dados do Usuário</Text>
      <Text>Email: {user.email}</Text>
      <Text>ID: {user.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 