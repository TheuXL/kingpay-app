import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';


export const UserHeader = ({
  backgroundColor = '#ffffff'
}) => {
  const { user } = useAppContext();
  const router = useRouter();

  const handlePress = () => {
    router.push('/(app)/settings');
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, { backgroundColor }]}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.email?.charAt(0)?.toUpperCase() || '👤'}
          </Text>
        </View>
        
        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.email || 'Usuário'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            Ver perfil
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0052cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101828',
  },
  userEmail: {
    fontSize: 14,
    color: '#667085',
  },
}); 