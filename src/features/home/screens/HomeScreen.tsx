import { useUserData } from '@/contexts/UserDataContext';
import { useHomeData } from '@/features/dashboard/hooks/useHomeData';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ApprovalRateCarouselCard from '../components/ApprovalRateCarouselCard';
import CarouselContainer from '../components/CarouselContainer';
import ExploreCard from '../components/ExploreCard';
import PaymentMethodsCarouselCard from '../components/PaymentMethodsCarouselCard';
import RefundsCarouselCard from '../components/RefundsCarouselCard';
import SaldoCard from '../components/SaldoCard';
import SalesChart from '../components/SalesChart';
import SalesMetricsGrid from '../components/SalesMetricsGrid';
import TotalSalesCarouselCard from '../components/TotalSalesCarouselCard';

const HomeScreen = () => {
  const { userProfile, company } = useUserData();
  const { data, isLoading, error, refetch } = useHomeData();

  // Função para calcular taxa de aprovação
  const calculateApprovalRate = (dashboardData: any) => {
    if (!dashboardData || !dashboardData.countTotal || dashboardData.countTotal === 0) {
      return 0;
    }
    return (dashboardData.countPaid / dashboardData.countTotal) * 100;
  };

  // Se há erro, exibir tela de erro
  if (error) {
    return (
      <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.container}>
        <SafeAreaView style={styles.flexOne}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Text style={styles.retryText} onPress={refetch}>
              Tentar novamente
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.container}>
      <SafeAreaView style={styles.flexOne}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#1A1AFF" />
          }
        >
          {/* Header com informações do usuário */}
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>
              Olá, {userProfile?.fullname?.split(' ')[0] || 'Usuário'} 👋
            </Text>
            <Text style={styles.companyText}>
              {company?.name || 'Carregando empresa...'}
            </Text>
          </View>

          {/* Card de saldo da carteira */}
          <SaldoCard 
            data={data?.financialSummary}
            isLoading={isLoading}
          />

          {/* Carousel de vendas */}
          <CarouselContainer>
            <TotalSalesCarouselCard 
              data={data?.dashboardData} 
              isLoading={isLoading}
            />
            <ApprovalRateCarouselCard 
              approvalRate={data?.dashboardData ? calculateApprovalRate(data.dashboardData) : undefined}
              isLoading={isLoading}
            />
            <RefundsCarouselCard 
              data={{
                countRefused: data?.dashboardData?.countRefused || 0,
                sumRefused: data?.dashboardData?.sumRefused || 0,
                countChargeback: data?.dashboardData?.countChargeback || 0,
                sumChargeback: data?.dashboardData?.sumChargeback || 0,
                countRefunded: data?.dashboardData?.countRefunded || 0,
                sumRefunded: data?.dashboardData?.sumRefunded || 0,
              }}
              isLoading={isLoading}
            />
            <PaymentMethodsCarouselCard 
              data={data?.additionalInfo?.paymentMethods || []}
              isLoading={isLoading}
            />
          </CarouselContainer>

          <Text style={styles.sectionTitle}>Métricas de vendas</Text>
          <SalesMetricsGrid 
            data={data?.dashboardData}
            isLoading={isLoading}
          />

          {/* Gráfico de vendas */}
          <Text style={styles.sectionTitle}>Gráfico de vendas</Text>
          <SalesChart chartData={data?.chartData || null} />

          <ExploreCard />

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexOne: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    companyText: {
        fontSize: 16,
        color: '#6B6B6B',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 32,
        marginBottom: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#6B6B6B',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryText: {
        fontSize: 16,
        color: '#1A1AFF',
        fontWeight: '600',
    },
});

export default HomeScreen; 