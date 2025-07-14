import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Redirect, useRouter, withLayoutContext } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';

// Definição de tipos
interface MenuItem {
  name: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface DrawerIconProps {
  color: string;
  size: number;
}

interface CustomDrawerContentProps {
  state: {
    routes: Array<{ name: string }>;
    index: number;
  };
  navigation: any;
}

// Criar o drawer navigator
const { Navigator } = createDrawerNavigator();
const Drawer = withLayoutContext(Navigator);

// Definição das seções do menu
const MENU_SECTIONS: Record<string, MenuItem[]> = {
  PRINCIPAL: [
    { name: 'index', title: 'Dashboard', icon: 'view-dashboard-outline' },
    { name: 'wallet', title: 'Carteira', icon: 'wallet-outline' },
    { name: 'billings', title: 'Faturas', icon: 'file-document-outline' },
    { name: 'transactions', title: 'Transações', icon: 'swap-horizontal' },
    { name: 'payment-link', title: 'Link de Pagamento', icon: 'link-variant' },
    { name: 'tax-calculator', title: 'Calculadora de Taxas', icon: 'calculator' },
  ],
  GESTAO: [
    { name: 'clients', title: 'Clientes', icon: 'account-group-outline' },
  ],
  INTEGRACOES: [
    { name: 'integrations', title: 'Integrações', icon: 'application-brackets-outline' },
    { name: 'api-key', title: 'Chave de API', icon: 'key-outline' },
    { name: 'webhooks', title: 'Webhooks', icon: 'webhook' },
  ],
  SISTEMA: [
    { name: 'system-settings', title: 'Configurações', icon: 'cog-outline' },
  ],
  ADMINISTRADOR: [
    { name: 'admin-dashboard', title: 'Dashboard Admin', icon: 'view-dashboard' },
    { name: 'companies', title: 'Empresas', icon: 'domain' },
    { name: 'users', title: 'Usuários', icon: 'account-multiple-outline' },
    { name: 'all-transactions', title: 'Todas Transações', icon: 'swap-horizontal' },
    { name: 'withdrawals', title: 'Saques', icon: 'cash-multiple' },
    { name: 'anticipations', title: 'Antecipações', icon: 'fast-forward' },
    { name: 'tickets', title: 'Tickets', icon: 'ticket-outline' },
    { name: 'acquirers', title: 'Adquirentes', icon: 'credit-card-outline' },
    { name: 'baas', title: 'BaaS', icon: 'bank-outline' },
    { name: 'pix-keys', title: 'Chaves PIX', icon: 'key-chain-variant' },
    { name: 'pix-key-admin', title: 'Gerenciar Chaves PIX', icon: 'key-variant' },
    { name: 'subaccount-admin', title: 'Gerenciar Subcontas', icon: 'account-cash-outline' },
    { name: 'alerts', title: 'Alertas', icon: 'bell-outline' },
    { name: 'admin-settings', title: 'Configurações', icon: 'cog-outline' },
  ],
};

function CustomDrawerContent(props: CustomDrawerContentProps) {
  const theme = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();

  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.sectionContainer} key={title}>
      <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.outline }]}>
        {title}
      </Text>
      {items.map((item) => (
        <TouchableRipple
          key={item.name}
          onPress={() => router.push(item.name as any)}
          style={[
            styles.menuItem,
            props.state.routes[props.state.index].name === item.name && 
            { backgroundColor: theme.colors.primaryContainer }
          ]}
        >
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={
                props.state.routes[props.state.index].name === item.name
                  ? theme.colors.primary
                  : theme.colors.onSurface
              }
            />
            <Text
              style={[
                styles.menuItemText,
                {
                  color:
                    props.state.routes[props.state.index].name === item.name
                      ? theme.colors.primary
                      : theme.colors.onSurface,
                },
              ]}
            >
              {item.title}
            </Text>
          </View>
        </TouchableRipple>
      ))}
    </View>
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text variant="headlineMedium" style={styles.headerTitle}>KingPay</Text>
      </View>

      {renderSection('PRINCIPAL', MENU_SECTIONS.PRINCIPAL)}
      {renderSection('GESTÃO', MENU_SECTIONS.GESTAO)}
      {renderSection('INTEGRAÇÕES', MENU_SECTIONS.INTEGRACOES)}
      {renderSection('SISTEMA', MENU_SECTIONS.SISTEMA)}
      {renderSection('ADMINISTRADOR', MENU_SECTIONS.ADMINISTRADOR)}

      <View style={styles.footer}>
        <TouchableRipple
          onPress={() => signOut()}
          style={styles.signOutButton}
        >
          <View style={styles.signOutContent}>
            <MaterialCommunityIcons 
              name="logout" 
              size={24} 
              color={theme.colors.onSurface} 
            />
            <Text style={[styles.signOutText, { color: theme.colors.onSurface }]}>
              Sair
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { session, loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return null; // ou um componente de loading
  }

  // Fix the Href type error by using the Redirect component with a string
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Drawer
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        drawerType: 'front',
        swipeEdgeWidth: 100,
      }}
    >
      {/* Principal */}
      <Drawer.Screen
        name="index"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="wallet"
        options={{
          title: 'Carteira',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="wallet-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="billings"
        options={{
          title: 'Faturas',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="file-document-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="transactions"
        options={{
          title: 'Transações',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="payment-link"
        options={{
          title: 'Link de Pagamento',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="link-variant" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="tax-calculator"
        options={{
          title: 'Calculadora de Taxas',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="calculator" color={color} size={size} />
          ),
        }}
      />

      {/* Gestão */}
      <Drawer.Screen
        name="clients"
        options={{
          title: 'Clientes',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="account-group-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Integrações */}
      <Drawer.Screen
        name="integrations"
        options={{
          title: 'Integrações',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="application-brackets-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="api-key"
        options={{
          title: 'Chave de API',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="key-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="webhooks"
        options={{
          title: 'Webhooks',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="webhook" color={color} size={size} />
          ),
        }}
      />

      {/* Sistema */}
      <Drawer.Screen
        name="system-settings"
        options={{
          title: 'Configurações',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Administrador */}
      <Drawer.Screen
        name="admin-dashboard"
        options={{
          title: 'Dashboard Admin',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="companies"
        options={{
          title: 'Empresas',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="domain" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          title: 'Usuários',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="account-multiple-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="all-transactions"
        options={{
          title: 'Todas Transações',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="withdrawals"
        options={{
          title: 'Saques',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="cash-multiple" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="anticipations"
        options={{
          title: 'Antecipações',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="fast-forward" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="ticket-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="acquirers"
        options={{
          title: 'Adquirentes',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="credit-card-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="baas"
        options={{
          title: 'BaaS',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="bank-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="pix-keys"
        options={{
          title: 'Chaves PIX',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="key-chain-variant" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="pix-key-admin"
        options={{
          title: 'Gerenciar Chaves PIX',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="key-variant" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="subaccount-admin"
        options={{
          title: 'Gerenciar Subcontas',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="account-cash-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="admin-settings"
        options={{
          title: 'Configurações',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    fontWeight: '500',
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  menuItemText: {
    marginLeft: 32,
    fontWeight: '500',
  },
  footer: {
    marginTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  signOutButton: {
    paddingVertical: 16,
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  signOutText: {
    marginLeft: 32,
    fontWeight: '500',
  },
}); 