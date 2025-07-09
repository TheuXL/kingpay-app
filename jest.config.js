module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-url-polyfill|@supabase|@react-navigation|expo-secure-store)/)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }]
  },
  setupFiles: ['./jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '^@react-native/js-polyfills/error-guard$': '<rootDir>/__mocks__/errorGuardMock.js',
    '^@/(.*)$': '<rootDir>/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components$': '<rootDir>/src/components',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/contexts$': '<rootDir>/src/contexts',
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/services$': '<rootDir>/src/services',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/hooks$': '<rootDir>/src/hooks',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/theme$': '<rootDir>/src/theme',
    '^@/theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@/store$': '<rootDir>/src/store',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/utils$': '<rootDir>/src/utils',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  testTimeout: 30000,
  globals: {
    __DEV__: true
  },
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
}; 