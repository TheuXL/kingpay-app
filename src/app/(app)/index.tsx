import { useUserData } from '@/contexts/UserDataContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

// Importando TODOS os componentes da tela
import ApprovalRateCarouselCard from '@/features/home/components/ApprovalRateCarouselCard';
import CarouselContainer from '@/features/home/components/CarouselContainer';
import ExploreCard from '@/features/home/components/ExploreCard';
import HeaderUser from '@/features/home/components/HeaderUser';
import JourneyCard from '@/features/home/components/JourneyCard';
import PaymentMethodsCarouselCard from '@/features/home/components/PaymentMethodsCarouselCard';
import QuickActions from '@/features/home/components/QuickActions';
import RefundsCarouselCard from '@/features/home/components/RefundsCarouselCard';
import RevenueChartCard from '@/features/home/components/RevenueChartCard';
import SaldoCard from '@/features/home/components/SaldoCard';
import SalesAnalysisCard from '@/features/home/components/SalesAnalysisCard';
import SalesMetricsGrid from '@/features/home/components/SalesMetricsGrid';
import TotalSalesCarouselCard from '@/features/home/components/TotalSalesCarouselCard';

const HomeScreen = () => {
    const { userProfile, company } = useUserData();
    const isLoading = false;
    const refreshData = () => {};

    const userName = useMemo(() => {
        if (userProfile?.fullname) return userProfile.fullname.split(' ')[0];
        if (userProfile?.email) return userProfile.email.split('@')[0];
        return 'Usuário';
    }, [userProfile]);

    const mockDashboardData = {
        taxaChargeback: 0.2,
        approvalRateGrowthPercentage: -4.0,
        sumPixPaid: 4580000,
        salesGrowthPercentage: 12.8,
        sumBoletoPaid: 2840000,
    };

    return (
        <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.container}>
            <SafeAreaView style={styles.flexOne}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} tintColor="#1A1AFF" />}
                >
                    <HeaderUser userName={userName} userPhoto={company?.logo_url} />
                    <SaldoCard balance={13824115} />
                    <QuickActions />
                    <JourneyCard />
                    
                    <Text style={styles.sectionTitle}>Resumo de vendas</Text>
                    <RevenueChartCard />
                    <SalesAnalysisCard />
                    
                    <CarouselContainer>
                        <RefundsCarouselCard />
                        <ApprovalRateCarouselCard />
                        <TotalSalesCarouselCard />
                        <PaymentMethodsCarouselCard />
                    </CarouselContainer>

                    <Text style={styles.sectionTitle}>Métricas de vendas</Text>
                    <SalesMetricsGrid dashboardData={mockDashboardData} />

                    <ExploreCard />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    flexOne: { flex: 1 },
    content: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 32,
        marginBottom: 16,
    },
});

export default HomeScreen; 