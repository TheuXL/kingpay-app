import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  // Add Stack Screen options
  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack>
      {/* Fix the Href type error by using a string without type annotation */}
      <Redirect href="/(tabs)" />
    </>
  );
} 