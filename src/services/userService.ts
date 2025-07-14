// src/services/userService.ts
import { ApiResponse } from '../types';
import {
  CreateUserPayload,
  EditUserPayload,
  RegisterUserAndCompanyPayload,
  User,
  UserApiKey,
  UserPermission,
} from '../types/users';
import { supabase } from './supabase';

/**
 * Retorna uma lista de todos os usuários.
 */
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke('users', {
      method: 'GET',
    });
    if (error) {
      return { success: false, error: { message: error.message || 'Erro ao buscar usuários' } };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro ao buscar usuários' } };
  }
};

/**
 * Retorna a chave de API de um usuário específico.
 */
export const getUserApiKey = async (userId: string): Promise<ApiResponse<UserApiKey>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`users/${userId}/apikey`, {
      method: 'GET',
    });
    if (error) {
        return { success: false, error: { message: error.message || 'Erro ao buscar a chave de API do usuário' } };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro ao buscar a chave de API do usuário' } };
  }
};

/**
 * Retorna a lista de permissões de um usuário específico.
 */
export const getUserPermissions = async (userId: string): Promise<ApiResponse<UserPermission[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`users/${userId}/permissions`, {
      method: 'GET',
    });
    if (error) {
        return { success: false, error: { message: error.message || 'Erro ao buscar permissões do usuário' } };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro ao buscar permissões do usuário' } };
  }
};

/**
 * Cria um novo usuário.
 */
export const createUser = async (payload: CreateUserPayload): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase.functions.invoke('users/create', {
      method: 'POST',
      body: payload,
    });
    if (error) {
        return { success: false, error: { message: error.message || 'Erro ao criar usuário' } };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro ao criar usuário' } };
  }
};

/**
 * Edita um usuário existente.
 */
export const editUser = async (userId: string, payload: EditUserPayload): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`users/${userId}/edit`, {
      method: 'PATCH',
      body: payload,
    });
    if (error) {
        return { success: false, error: { message: error.message || 'Erro ao editar usuário' } };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro ao editar usuário' } };
  }
};

/**
 * Cria um novo usuário e registra uma nova empresa.
 */
export const registerUserAndCompany = async (payload: RegisterUserAndCompanyPayload): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase.functions.invoke('users/register', {
      method: 'POST',
      body: payload,
    });
    if (error) {
        return { success: false, error: { message: error.message || 'Erro ao registrar usuário e empresa' } };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro ao registrar usuário e empresa' } };
  }
};