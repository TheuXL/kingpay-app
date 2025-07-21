import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Gestão de Usuários (Admin)
 * Endpoints da documentação INTEGRACAO.md
 */
export class UserManagementService {

  /**
   * Listar Todos os Usuários (GET /functions/v1/users)
   * Propósito: Obter lista paginada de todos os usuários
   */
  async getUsers(filters?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.status) params.append('status', filters.status);

      const { data, error } = await supabase.functions.invoke(`users?${params.toString()}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Buscar Usuário por ID (GET /functions/v1/users/:id)
   * Propósito: Obter detalhes de um usuário específico
   */
  async getUserById(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}`, {
        method: 'GET',
      });
      if (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Erro inesperado ao buscar usuário:', error);
      throw error;
    }
  }

  /**
   * POST /users/register
   * Propósito: Registrar um novo usuário, potencialmente por um admin ou via convite.
   */
  async registerUser(userData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('users/register', {
        method: 'POST',
        body: userData,
      });

      if (error) {
        console.error('Erro ao registrar usuário:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Erro inesperado ao registrar usuário:', error);
      throw error;
    }
  }

  /**
   * Obter Chave de API do Usuário (GET /functions/v1/users/:id/apikey)
   * Propósito: Buscar as chaves de API de um usuário
   */
  async getUserApiKey(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}/apikey`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar API key:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Ver Permissões do Usuário (GET /functions/v1/users/:id/permissions)
   * Propósito: Obter permissões específicas de um usuário
   */
  async getUserPermissions(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}/permissions`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar permissões:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Criar Usuário (POST /functions/v1/users/create)
   * Propósito: Criar um novo usuário no sistema
   */
  async createUser(userData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('users/create', {
        method: 'POST',
        body: userData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Editar Perfil do Usuário (PATCH /functions/v1/users/:id/edit)
   * Propósito: Atualizar dados do perfil de um usuário
   */
  async editUser(userId: string, userData: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}/edit`, {
        method: 'PATCH',
        body: userData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao editar usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Registrar Usuário + Empresa (POST /functions/v1/users/register)
   * Propósito: Criar usuário e empresa em uma única operação
   */
  async registerUserWithCompany(registrationData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('users/register', {
        method: 'POST',
        body: registrationData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Atualizar Permissões de Usuário (PATCH /functions/v1/users/:id/permissions)
   * Propósito: Modificar permissões específicas de um usuário
   */
  async updateUserPermissions(userId: string, permissions: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}/permissions`, {
        method: 'PATCH',
        body: permissions,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Bloquear/Desbloquear Usuário
   */
  async toggleUserStatus(userId: string, isActive: boolean) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}/status`, {
        method: 'PATCH',
        body: { is_active: isActive },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao alterar status:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Gerar Nova API Key para Usuário
   */
  async regenerateApiKey(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}/apikey/regenerate`, {
        method: 'POST',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao regenerar API key:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Buscar Histórico de Atividades do Usuário
   */
  async getUserActivity(userId: string, limit: number = 20, offset: number = 0) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `users/${userId}/activity?limit=${limit}&offset=${offset}`,
        { method: 'GET' }
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar atividades:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Método alias para getAllUsers (usado pelo UsersScreen)
   */
  async getAllUsers(filters?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    return await this.getUsers(filters);
  }

  /**
   * Formatação de papéis do usuário
   */
  formatUserRole(role: string): string {
    const roleMap: Record<string, string> = {
      'admin': 'Administrador',
      'user': 'Usuário',
      'manager': 'Gerente',
      'operator': 'Operador',
      'viewer': 'Visualizador'
    };
    
    return roleMap[role] || role;
  }

  /**
   * Obter cor para o papel do usuário
   */
  getRoleColor(role: string): string {
    const colorMap: Record<string, string> = {
      'admin': '#ff4444',
      'user': '#4444ff',
      'manager': '#ff8800',
      'operator': '#44ff44',
      'viewer': '#888888'
    };
    
    return colorMap[role] || '#666666';
  }
}

export const userManagementService = new UserManagementService(); 