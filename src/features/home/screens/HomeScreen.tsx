import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { UserHeader } from '../../../components/common';
import { useAuth } from '../../../contexts/AppContext';

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <UserHeader />
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo(a)!</Text>
        <Text>Usuário: {user?.email}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen; 