import { useUserData } from '@/contexts/UserDataContext';
import { AppWindow, Barcode, Reply } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

// Importando os componentes
import ApprovalRateCarouselCard from '@/features/home/components/ApprovalRateCarouselCard';
import BalanceCard from '@/features/home/components/BalanceCard';
import CarouselContainer from '@/features/home/components/CarouselContainer';
import Header from '@/features/home/components/Header';
import JourneyCard from '@/features/home/components/JourneyCard';
import MetricCard from '@/features/home/components/MetricCard';
import PaymentMethodsCarouselCard from '@/features/home/components/PaymentMethodsCarouselCard';
import QuickActions from '@/features/home/components/QuickActions';
import RefundsCarouselCard from '@/features/home/components/RefundsCarouselCard';
import SalesSummaryCard from '@/features/home/components/SalesSummaryCard';
import TotalSalesCarouselCard from '@/features/home/components/TotalSalesCarouselCard';


const HomeScreen = () => {
    const { userProfile } = useUserData();
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    const userName = useMemo(() => {
        if (userProfile?.fullname) return userProfile.fullname.split(' ')[0];
        return 'Usuário';
    }, [userProfile]);
    
    const MOCK_BALANCE = 138241.45;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.flexOne}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} tintColor="#1A1AFF" />}
                >
                    <Header userName={userName} /> 
                    <BalanceCard balance={MOCK_BALANCE} />
                    <QuickActions />
                    <JourneyCard />
                    <SalesSummaryCard />

                    <CarouselContainer>
                        <RefundsCarouselCard />
                        <PaymentMethodsCarouselCard />
                        <TotalSalesCarouselCard />
                        <ApprovalRateCarouselCard />
                    </CarouselContainer>

                    <Text style={styles.sectionTitle}>Métricas de vendas</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsCarousel}>
                        <MetricCard 
                            icon={<AppWindow size={20} color="#666666" />}
                            title="Vendas PIX"
                            value="R$ 64.689,36"
                            change="+15%"
                        />
                        <MetricCard 
                            icon={<Reply size={20} color="#666666" />}
                            title="Chargeback"
                            value="R$ 4.689,36"
                            change="+7,8%"
                        />
                        <MetricCard 
                            icon={<Barcode size={20} color="#666666" />}
                            title="Vendas Boletos"
                            value="R$ 344.689,36"
                            change="-23,8%"
                        />
                    </ScrollView>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    flexOne: { flex: 1 },
    content: {
        paddingTop: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 16,
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    metricsCarousel: {
        paddingHorizontal: 20,
    }
});

export default HomeScreen;
