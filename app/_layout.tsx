import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { customTheme, theme } from '@/theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

export const CustomDrawerContent = (props: any) => {
  const { signOut } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Antecipações"
        onPress={() => props.navigation.navigate('anticipations')}
        labelStyle={{ color: customTheme.colors.text.primary.light }}
        icon={({ size }) => <MaterialCommunityIcons name="cash-fast" size={size} color={theme.colors.primary} />}
      />
      <DrawerItem
        label="Sair"
        onPress={signOut}
        labelStyle={{ color: theme.colors.error }}
        icon={({ size }) => <MaterialCommunityIcons name="logout" size={size} color={theme.colors.error} />}
      />
    </DrawerContentScrollView>
  );
};

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
