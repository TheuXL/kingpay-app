import axios from 'axios';
import { ENV } from '../config/env';
import { supabase } from '../config/supabaseClient';

const api = axios.create({
  baseURL: `${ENV.SUPABASE_URL}/`,
});

// Interceptor para adicionar o token de autenticação e apikey
api.interceptors.request.use(async (config) => {
    if (config.url?.includes('functions/v1')) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        
        config.headers.apikey = ENV.SUPABASE_ANON_KEY;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api; 