import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from 'react-native-paper';

const Sidebar = () => {
  const theme = useTheme();
  const colors = theme.colors;
  
  const menuItems = [
    {
      title: 'Financeiro',
      icon: <MaterialCommunityIcons name="finance" size={24} color={colors.primary} />,
      route: '/financial',
      admin: false
    },
    {
      title: 'Calculadora de Taxas',
      icon: <FontAwesome5 name="calculator" size={24} color={colors.primary} />,
      route: '/tax-calculator',
      admin: false
    },
    {
      title: 'Gerenciar Chaves Pix',
      icon: <MaterialCommunityIcons name="key-variant" size={24} color={colors.primary} />,
      route: '/pix-key-admin',
      admin: true
    },
    {
      title: 'Gerenciar Subcontas',
      icon: <MaterialCommunityIcons name="account-cash-outline" size={24} color={colors.primary} />,
      route: '/subaccount-admin',
      admin: true
    },
  ];
  
  return null; // Implementação a ser completada
} 