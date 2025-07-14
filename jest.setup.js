// Load environment variables from .env.test file
require('dotenv').config({ path: '.env.test' });

// Set environment explicitly to test
process.env.NODE_ENV = 'test';

// Configure environment variables for tests only if not defined
// This allows tests to use real app variables when available
if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://ntswqzoftcvzsxwbmsef.supabase.co';
}

if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c3dxem9mdGN2enN4d2Jtc2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzkyODUsImV4cCI6MjA2NDExNTI4NX0.-UUHbgSHmEd86qgdcwgZ5p6sjBkBOPKNWls9dMaDsgs';
}

// Set test user credentials if not defined
if (!process.env.TEST_USER_EMAIL) {
  process.env.TEST_USER_EMAIL = 'test@example.com';
}

if (!process.env.TEST_USER_PASSWORD) {
  process.env.TEST_USER_PASSWORD = 'test-password';
}

if (!process.env.TEST_EXISTING_EMAIL) {
  process.env.TEST_EXISTING_EMAIL = 'existing@example.com';
}

// Log test configuration
console.log('Setting up test environment...');
console.log('Test user email:', process.env.TEST_USER_EMAIL);

// Configure timeout to avoid memory leaks in async tests
jest.setTimeout(30000); // 30 seconds timeout for tests

// Mock for react-native
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

// Mock for expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve())
}));

// Mock for AsyncStorage
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

// Polyfill for URL and URLSearchParams in Node.js environment
if (typeof global.URL !== 'function') {
  const { URL } = require('url');
  global.URL = URL;
}

if (typeof global.URLSearchParams !== 'function') {
  const { URLSearchParams } = require('url');
  global.URLSearchParams = URLSearchParams;
}

// Polyfill for self (used by Supabase)
if (typeof global.self === 'undefined') {
  global.self = global;
}

// Polyfill for localStorage in Node.js environment
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

// Global variables to share between tests
global.testTicketId = null;
global.directApiTicketId = null; 