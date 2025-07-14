import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { customTheme, theme } from '../theme/theme';

// Import screens from app/(drawer) instead of src/screens
import AnticipationsScreen from '../../app/(drawer)/anticipations';
import CompaniesScreen from '../../app/(drawer)/companies/index';
import DashboardScreen from '../../app/(drawer)/index';
import SystemSettingsScreen from '../../app/(drawer)/system-settings';
import TransactionsScreen from '../../app/(drawer)/transactions';
import UsersScreen from '../../app/(drawer)/users';
import WithdrawalsScreen from '../../app/(drawer)/withdrawals';
import SettingsScreen from '../../app/(tabs)/settings/index';

// Create drawer navigator
const Drawer = createDrawerNavigator();

// Custom drawer content
const CustomDrawerContent = (props: any) => {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Define sections for the drawer
  const mainItems = [
    { name: 'Dashboard', title: 'Dashboard', icon: 'home-outline' },
    { name: 'Companies', title: 'Empresas', icon: 'business-outline' },
    { name: 'Transactions', title: 'Transações', icon: 'swap-horizontal-outline' },
  ];
  
  const financialItems = [
    { name: 'Withdrawals', title: 'Saques', icon: 'cash-outline' },
    { name: 'Anticipations', title: 'Antecipações', icon: 'timer-outline' },
  ];
  
  const adminItems = user?.is_admin ? [
    { name: 'Users', title: 'Usuários', icon: 'people-outline' },
    { name: 'SystemSettings', title: 'Configurações do Sistema', icon: 'settings-outline' },
  ] : [];
  
  // Render a section of drawer items
  const renderSection = (title: string, items: any[]) => (
    <View key={title} style={styles.section}>
      <Text style={[
        styles.sectionTitle,
        { color: isDark ? customTheme.colors.text.secondary.dark : customTheme.colors.text.secondary.light }
      ]}>
        {title}
      </Text>
      {items.map(item => (
        <DrawerItem
          key={item.name}
          label={item.title}
          icon={({ color, size }) => <Ionicons name={item.icon} size={size} color={color} />}
          onPress={() => props.navigation.navigate(item.name)}
          activeTintColor={theme.colors.primary}
          inactiveTintColor={isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light}
        />
      ))}
    </View>
  );

  return (
    <DrawerContentScrollView 
      {...props}
      style={{
        backgroundColor: isDark ? customTheme.colors.background.dark : customTheme.colors.background.light,
      }}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View>
            <Text style={[
              styles.userName,
              { color: isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light }
            ]}>
              {user?.name || 'Usuário'}
            </Text>
            <Text style={[
              styles.userEmail,
              { color: isDark ? customTheme.colors.text.secondary.dark : customTheme.colors.text.secondary.light }
            ]}>
              {user?.email}
            </Text>
          </View>
        </View>
      </View>
      
      {renderSection('Principal', mainItems)}
      {renderSection('Financeiro', financialItems)}
      {adminItems.length > 0 && renderSection('Administração', adminItems)}
      
      <View style={styles.divider} />
      
      <DrawerItem
        label="Configurações"
        icon={({ color, size }) => <Ionicons name="cog-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Settings')}
        activeTintColor={theme.colors.primary}
        inactiveTintColor={isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light}
      />
      
      <DrawerItem
        label="Sair"
        icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={customTheme.colors.danger} />}
        onPress={signOut}
        labelStyle={{ color: customTheme.colors.danger }}
      />
    </DrawerContentScrollView>
  );
};

const MainDrawerNavigator = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? customTheme.colors.background.dark : customTheme.colors.background.light,
        },
        headerTintColor: isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light,
        drawerActiveBackgroundColor: isDark ? '#2C2C2E' : '#E8E8E8',
        drawerInactiveTintColor: isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light,
        drawerActiveTintColor: theme.colors.primary,
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Companies" component={CompaniesScreen} options={{ title: 'Empresas' }} />
      <Drawer.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Transações' }} />
      <Drawer.Screen name="Withdrawals" component={WithdrawalsScreen} options={{ title: 'Saques' }} />
      <Drawer.Screen name="Anticipations" component={AnticipationsScreen} options={{ title: 'Antecipações' }} />
      <Drawer.Screen name="Users" component={UsersScreen} options={{ title: 'Usuários' }} />
      <Drawer.Screen name="SystemSettings" component={SystemSettingsScreen} options={{ title: 'Config. do Sistema' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    marginLeft: 16,
    marginVertical: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default MainDrawerNavigator; 