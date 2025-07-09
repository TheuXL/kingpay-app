import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // ou um componente de loading
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
} 