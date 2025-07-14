// app/(drawer)/add-user.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../src/store/userStore';
import { CreateUserPayload } from '../../src/types/users';

const AddUserScreen = () => {
  const router = useRouter();
  const { createUser, loading, error } = useUserStore();
  const [payload, setPayload] = useState<CreateUserPayload>({
    name: '',
    email: '',
    phone: '',
  });

  const handleCreate = async () => {
    await createUser(payload);
    if (!error) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Criar Novo Usuário</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={payload.name}
        onChangeText={(text) => setPayload(p => ({ ...p, name: text }))}
        placeholder="Nome Completo"
      />
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={payload.email}
        onChangeText={(text) => setPayload(p => ({ ...p, email: text }))}
        placeholder="email@example.com"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={payload.phone}
        onChangeText={(text) => setPayload(p => ({ ...p, phone: text }))}
        placeholder="(99) 99999-9999"
        keyboardType="phone-pad"
      />

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Criar" onPress={handleCreate} />
        )}
        <Button title="Cancelar" onPress={() => router.back()} color="red" />
      </View>
    </View>
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
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AddUserScreen; 