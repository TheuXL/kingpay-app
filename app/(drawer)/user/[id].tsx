// app/(drawer)/user/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUserStore } from '../../../src/store/userStore';
import { EditUserPayload } from '../../../src/types/users';

const UserDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    selectedUser,
    selectedUserApiKey,
    selectedUserPermissions,
    loading,
    error,
    fetchUserApiKey,
    fetchUserPermissions,
    editUser,
    selectUser,
    users,
  } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editPayload, setEditPayload] = useState<EditUserPayload>({});

  useEffect(() => {
    const user = users.find(u => u.id === id);
    if (user) {
      selectUser(user);
    }
  }, [id, users, selectUser]);

  useEffect(() => {
    if (id) {
      fetchUserApiKey(id);
      fetchUserPermissions(id);
    }
  }, [id, fetchUserApiKey, fetchUserPermissions]);

  useEffect(() => {
    if (selectedUser) {
      setEditPayload({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
      });
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    if (id) {
      await editUser(id, editPayload);
      setIsEditing(false);
    }
  };

  if (loading && !selectedUser) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!selectedUser) {
    return <Text>Usuário não encontrado.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.header}>Detalhes do Usuário</Text>
      
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={editPayload.name}
        onChangeText={(text) => setEditPayload(p => ({ ...p, name: text }))}
        editable={isEditing}
      />
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={editPayload.email}
        onChangeText={(text) => setEditPayload(p => ({ ...p, email: text }))}
        editable={isEditing}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={editPayload.phone}
        onChangeText={(text) => setEditPayload(p => ({ ...p, phone: text }))}
        editable={isEditing}
        keyboardType="phone-pad"
      />

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <Button title="Salvar" onPress={handleUpdate} disabled={loading} />
        ) : (
          <Button title="Editar" onPress={() => setIsEditing(true)} />
        )}
        <Button title="Voltar" onPress={() => router.back()} />
      </View>

      <Text style={styles.header}>API Key</Text>
      {loading && !selectedUserApiKey ? <ActivityIndicator /> : (
        <Text style={styles.apiKey}>{selectedUserApiKey?.api_key || 'Nenhuma chave de API encontrada.'}</Text>
      )}

      <Text style={styles.header}>Permissões</Text>
      {loading && selectedUserPermissions.length === 0 ? <ActivityIndicator /> : (
        selectedUserPermissions.map(p => (
          <Text key={p.id} style={styles.permission}>{p.permission}</Text>
        ))
      )}
      {selectedUserPermissions.length === 0 && !loading && <Text>Nenhuma permissão encontrada.</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  apiKey: {
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
  },
  permission: {
    fontSize: 16,
    padding: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default UserDetailsScreen; 