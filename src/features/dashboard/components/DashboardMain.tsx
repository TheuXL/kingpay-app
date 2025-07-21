/**
 * 📊 DASHBOARD PRINCIPAL - KINGPAY
 * ===============================
 * 
 * Este é o componente principal do dashboard, responsável por orquestrar
 * a exibição dos diferentes módulos de dados.
 */
import React, { useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import PaymentMethodsCard from './PaymentMethodsCard';
import RefundsCard from './RefundsCard';
import RevenueSummaryCard from './RevenueSummaryCard';
import SalesMetricsCard from './SalesMetricsCard';

interface DashboardMainProps {
  onNavigate: (screen: string) => void;
}

export const DashboardMain: React.FC<DashboardMainProps> = ({ onNavigate }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Adicionar lógica para recarregar os dados de todos os cartões
    console.log("Recarregando dados...");
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f5" />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
            <RevenueSummaryCard />
            <View style={styles.cardsContainer}>
                <View style={styles.column}>
                    <RefundsCard />
                </View>
                <View style={styles.column}>
                    <PaymentMethodsCard />
                </View>
            </View>
            <SalesMetricsCard onNavigate={onNavigate} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Um cinza mais claro para o fundo
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%', // Para ter um pequeno espaço entre as colunas
  }
}); 