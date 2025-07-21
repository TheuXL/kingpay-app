import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AppContext';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Pode-se adicionar um componente de loading aqui
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
} 