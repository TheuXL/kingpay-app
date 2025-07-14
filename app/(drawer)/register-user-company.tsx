// app/(drawer)/register-user-company.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUserStore } from '../../src/store/userStore';
import { RegisterUserAndCompanyPayload } from '../../src/types/users';

const RegisterUserAndCompanyScreen = () => {
  const router = useRouter();
  const { registerUserAndCompany, loading, error } = useUserStore();
  const [payload, setPayload] = useState<RegisterUserAndCompanyPayload>({
    user: {
      name: '',
      email: '',
      phone: '',
    },
    company: {
      name: '',
      tax_id: '',
      website: '',
    },
  });

  const handleRegister = async () => {
    await registerUserAndCompany(payload);
    if (!error) {
      router.replace('/users' as any);
    }
  };

  const handleGoBack = () => {
    router.replace('/users' as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registrar Novo Usuário e Empresa</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.subHeader}>Dados do Usuário</Text>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={payload.user.name}
        onChangeText={(text) => setPayload(p => ({ ...p, user: { ...p.user, name: text } }))}
        placeholder="Nome Completo"
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={payload.user.email}
        onChangeText={(text) => setPayload(p => ({ ...p, user: { ...p.user, email: text } }))}
        placeholder="email@example.com"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={payload.user.phone}
        onChangeText={(text) => setPayload(p => ({ ...p, user: { ...p.user, phone: text } }))}
        placeholder="(99) 99999-9999"
        keyboardType="phone-pad"
      />

      <Text style={styles.subHeader}>Dados da Empresa</Text>
      <Text style={styles.label}>Nome da Empresa:</Text>
      <TextInput
        style={styles.input}
        value={payload.company.name}
        onChangeText={(text) => setPayload(p => ({ ...p, company: { ...p.company, name: text } }))}
        placeholder="Nome Fantasia"
      />
      <Text style={styles.label}>CNPJ:</Text>
      <TextInput
        style={styles.input}
        value={payload.company.tax_id}
        onChangeText={(text) => setPayload(p => ({ ...p, company: { ...p.company, tax_id: text } }))}
        placeholder="00.000.000/0000-00"
      />
      <Text style={styles.label}>Website:</Text>
      <TextInput
        style={styles.input}
        value={payload.company.website}
        onChangeText={(text) => setPayload(p => ({ ...p, company: { ...p.company, website: text } }))}
        placeholder="https://suaempresa.com"
        keyboardType="url"
      />

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Registrar" onPress={handleRegister} />
        )}
        <Button title="Cancelar" onPress={handleGoBack} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RegisterUserAndCompanyScreen; 