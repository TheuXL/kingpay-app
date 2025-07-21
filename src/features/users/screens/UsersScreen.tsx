import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userManagementService } from '../services';
import { User } from '../types';

interface UserListItem extends User {
  displayRole: string;
  roleColor: string;
  statusColor: string;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const responseUsers = await userManagementService.getAllUsers();

      if (Array.isArray(responseUsers)) {
        const processedUsers: UserListItem[] = responseUsers.map((user): UserListItem => ({
          ...user,
          displayRole: userManagementService.formatUserRole(user.role),
          roleColor: userManagementService.getRoleColor(user.role),
          statusColor: user.is_active ? '#10B981' : '#EF4444'
        }));
        setUsers(processedUsers);
      } else {
        throw new Error("Formato de resposta inesperado do serviço de usuários.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleCreateUser = () => {
    router.push('/(app)/admin/users/create');
  };

  const handleUserPress = (user: User) => {
    router.push({
      pathname: '/(app)/admin/users/[id]',
      params: { id: user.id }
    });
  };

  const handleUserLongPress = (user: User) => {
    Alert.alert(
      'Opções do Usuário',
      `Escolha uma ação para ${user.name}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ver Detalhes',
          onPress: () => handleUserPress(user)
        },
        {
          text: 'Editar',
          onPress: () => router.push({
            pathname: '/(app)/admin/users/edit/[id]',
            params: { id: user.id }
          })
        },
        {
          text: user.is_active ? 'Desativar' : 'Ativar',
          style: user.is_active ? 'destructive' : 'default',
          onPress: () => handleToggleUserStatus(user)
        }
      ]
    );
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const newStatus = !user.is_active;
      const action = newStatus ? 'ativar' : 'desativar';
      
      Alert.alert(
        'Confirmar Ação',
        `Tem certeza que deseja ${action} o usuário ${user.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            style: newStatus ? 'default' : 'destructive',
            onPress: async () => {
              try {
                await userManagementService.editUser(user.id, {
                  is_active: newStatus
                });
                Alert.alert('✅ Sucesso', `Usuário ${action}do com sucesso`);
                loadUsers(); // Recarregar lista
              } catch (e) {
                const errorMsg = e instanceof Error ? e.message : 'Erro desconhecido';
                Alert.alert('❌ Erro', errorMsg || `Erro ao ${action} usuário`);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error);
      Alert.alert('❌ Erro', 'Erro inesperado ao alterar status do usuário');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const renderUserItem = ({ item: user }: { item: UserListItem }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(user)}
      onLongPress={() => handleUserLongPress(user)}
      activeOpacity={0.7}
    >
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={24} color="#666" />
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.phone && (
            <Text style={styles.userPhone}>{user.phone}</Text>
          )}
        </View>

        <View style={styles.userBadges}>
          <View style={[styles.roleBadge, { backgroundColor: user.roleColor }]}>
            <Text style={styles.roleBadgeText}>{user.displayRole}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: user.statusColor }]}>
            <Text style={styles.statusBadgeText}>
              {user.is_active ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        {user.company_id && (
          <View style={styles.detailItem}>
            <Ionicons name="business" size={16} color="#666" />
            <Text style={styles.detailText}>
              Empresa: {user.company_id}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionIndicator}>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Nenhum usuário encontrado</Text>
      <Text style={styles.emptyStateText}>
        Crie o primeiro usuário para começar
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={handleCreateUser}>
        <Text style={styles.emptyStateButtonText}>Criar Usuário</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle" size={64} color="#EF4444" />
      <Text style={styles.errorTitle}>Erro ao carregar usuários</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={handleCreateUser}>
          <Ionicons name="add" size={24} color="#0052cc" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter(u => u.is_active).length}
          </Text>
          <Text style={styles.statLabel}>Ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter(u => u.role === 'admin').length}
          </Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      {error ? (
        renderError()
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={users.length === 0 ? styles.emptyContainer : styles.listContainer}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: '#999',
  },
  userBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  userDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  actionIndicator: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#0052cc',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
