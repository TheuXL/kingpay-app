module.exports = {
  // Configurações básicas para o preset
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-url-polyfill|@supabase|@react-navigation|expo-secure-store)/)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }]
  }
}; 