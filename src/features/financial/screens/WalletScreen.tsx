/**
 * 💰 TELA DE CARTEIRA - KINGPAY
 * ============================
 * 
 * Tela de carteira seguindo o fluxograma com:
 * - Saldo PIX/Cartão
 * - A receber
 * - Reserva Financeira
 * - Integração com dados reais do Supabase
 */

import React, { useState } from 'react';
import { Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';
import AnticipationsList from '../components/AnticipationsList';
import BalanceCarousel from '../components/BalanceCarousel';
import FeesCard from '../components/FeesCard';
import NavigationTabs from '../components/NavigationTabs';
import RefundsCard from '../components/RefundsCard';
import StatementList from '../components/StatementList';
import WithdrawalsList from '../components/WithdrawalsList';

// Habilita LayoutAnimation para Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WalletScreen() {
    const [activeTab, setActiveTab] = useState('Extrato'); // Mudei para a aba final
    const [refreshing, setRefreshing] = useState(false);

    // Dados estáticos para o design
    const MOCK_BALANCE = {
        pix: "R$ 5.123,45",
        card: "R$ 10.876,12",
        receivable: "R$ 22.450,00",
        reserve: "R$ 1.500,00"
    };

    const onRefresh = () => {
        setRefreshing(true);
        console.log("Refreshing wallet screen...");
        setTimeout(() => setRefreshing(false), 1000);
    };

    const renderContentForTab = () => {
        switch (activeTab) {
            case 'Extrato':
                return <StatementList />;
            case 'Saques':
                return <WithdrawalsList />;
            case 'Antecipações':
                return <AnticipationsList />;
            case 'Reembolsos':
                return <RefundsCard />;
            case 'Taxas':
                return <FeesCard />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Carteira</Text>
            </View>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <BalanceCarousel 
                    pixBalance={MOCK_BALANCE.pix}
                    cardBalance={MOCK_BALANCE.card}
                    receivableBalance={MOCK_BALANCE.receivable}
                    reserveBalance={MOCK_BALANCE.reserve}
                />
                <NavigationTabs onTabChange={setActiveTab} />
                
                {renderContentForTab()}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Um cinza bem claro para o fundo geral
    },
    scrollView: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#101828',
    },
    contentContainer: {
        padding: 16,
    },
    tabContentText: {
        fontSize: 16,
        color: '#666'
    }
}); 