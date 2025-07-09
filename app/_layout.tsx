import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { theme } from '@/theme/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SessionProvider>
        <PaperProvider theme={theme}>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </PaperProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
