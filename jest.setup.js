// Definir explicitamente o ambiente como teste
process.env.NODE_ENV = 'test';

// Configurar variáveis de ambiente para testes apenas se não estiverem definidas
// Isso permite que os testes usem as variáveis reais do app quando disponíveis
if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://ntswqzoftcvzsxwbmsef.supabase.co';
}

if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c3dxem9mdGN2enN4d2Jtc2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzkyODUsImV4cCI6MjA2NDExNTI4NX0.-UUHbgSHmEd86qgdcwgZ5p6sjBkBOPKNWls9dMaDsgs';
}

// Configuração para evitar vazamentos de memória em testes assíncronos
jest.setTimeout(30000); // 30 segundos de timeout para testes

// Mock para react-native
jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'web',
      select: jest.fn(obj => obj.web || obj.default)
    },
    NativeModules: {},
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeListener: jest.fn()
    })),
    Linking: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      openURL: jest.fn(),
      canOpenURL: jest.fn(() => Promise.resolve(true)),
      getInitialURL: jest.fn(() => Promise.resolve(''))
    }
  };
});

// Mock para expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve())
}));

// Mock para o AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Polyfill para URL e URLSearchParams no ambiente Node.js
if (typeof global.URL !== 'function') {
  const { URL } = require('url');
  global.URL = URL;
}

if (typeof global.URLSearchParams !== 'function') {
  const { URLSearchParams } = require('url');
  global.URLSearchParams = URLSearchParams;
}

// Polyfill para self (usado pelo Supabase)
if (typeof global.self === 'undefined') {
  global.self = global;
}

// Polyfill para localStorage no ambiente Node.js
if (typeof global.localStorage === 'undefined') {
  class LocalStorageMock {
    constructor() {
      this.store = {};
    }
    
    clear() {
      this.store = {};
    }
    
    getItem(key) {
      return this.store[key] || null;
    }
    
    setItem(key, value) {
      this.store[key] = String(value);
    }
    
    removeItem(key) {
      delete this.store[key];
    }
  }
  
  global.localStorage = new LocalStorageMock();
}

// Variáveis globais para compartilhar entre testes
global.testTicketId = null;
global.directApiTicketId = null; 