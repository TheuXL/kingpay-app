import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Import screens
import MainDrawerNavigator from './src/navigation/MainDrawerNavigator';
import ChangePasswordScreen from './src/screens/auth/ChangePasswordScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import SecurityCodeScreen from './src/screens/auth/SecurityCodeScreen';
import SetFinancialPasswordScreen from './src/screens/auth/SetFinancialPasswordScreen';
import TwoFactorScreen from './src/screens/auth/TwoFactorScreen';

const Stack = createNativeStackNavigator();

// Authentication navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="SecurityCode" component={SecurityCodeScreen} />
    <Stack.Screen name="SetFinancialPassword" component={SetFinancialPasswordScreen} />
    <Stack.Screen name="TwoFactor" component={TwoFactorScreen} />
  </Stack.Navigator>
);

// Main app navigator
const AppNavigator = () => {
  const { user, session, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {session && user ? <MainDrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
} 