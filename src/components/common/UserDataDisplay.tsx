import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AppContext';

export const UserDataDisplay = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Carregando dados do usuário...</Text>;
  }

  if (!user) {
    return <Text>Nenhum usuário logado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Usuário:</Text>
      <Text style={styles.value}>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', fontSize: 16 },
  value: { fontSize: 16, color: '#333' },
}); 