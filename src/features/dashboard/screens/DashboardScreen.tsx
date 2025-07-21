import { router } from 'expo-router';
import React from 'react';
import { DashboardMain } from '../components/DashboardMain';

export const DashboardScreen = () => {
  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'transactions':
        router.push('/(app)/(tabs)/transactions');
        break;
      case 'wallet':
        router.push('/(app)/(tabs)/financial');
        break;
      case 'movements':
        router.push('/(app)/(tabs)/movements');
        break;
      case 'settings':
        router.push('/(app)/(tabs)/settings');
        break;
      default:
        console.log('Navegação para:', screen);
    }
  };

  return <DashboardMain onNavigate={handleNavigate} />;
}; 