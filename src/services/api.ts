import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { supabase } from '../config/supabaseClient';

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  if (config.url && (config.url.startsWith('/functions/v1/') || config.url.startsWith('functions/v1/'))) {
    try {
      // Constrói a chave de sessão dinamicamente
      const projectUrl = supabase.auth.getProjectUrl();
      const projectId = projectUrl.split('.')[0].replace('https://', '');
      const sessionKey = `sb-${projectId}-auth-token`;
      
      const sessionData = await AsyncStorage.getItem(sessionKey); 
      
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session && session.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      }
      
      config.headers.apikey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    } catch (error) {
      console.error('Erro ao configurar o interceptor do Axios:', error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api; 