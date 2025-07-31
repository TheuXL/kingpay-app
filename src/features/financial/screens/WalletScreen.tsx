// src/features/financial/screens/WalletScreen.tsx
import { Stack, useRouter } from 'expo-router';
import { ArrowDown, ArrowRight, ArrowUp, ClockClockwise, Wallet } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { colors } from '../../../theme/colors';

const TABS = [
    { id: 'extrato', label: 'Extrato', icon: <Wallet size={20} /> },
    { id: 'antecipacoes', label: 'Antecipações', icon: <ClockClockwise size={20} /> },
    { id: 'transferencias', label: 'Transferências' }, // Exemplo de tab sem ícone
];

const statementData = [
    { id: '1', type: 'Entrada', description: 'Reserva Financeira', amount: '+ R$ 21.124,56', date: 'Hoje', icon: <ArrowDown /> },
    { id: '2', type: 'Saída', description: 'Transação Gateway', amount: 'R$ 2.664,45', date: 'Ontem', icon: <ArrowUp /> },
    { id: '3', type: 'Entrada', description: 'Reserva Financeira', amount: '+ R$ 1.164,37', date: '11 de jul', icon: <ArrowDown /> },
];

const emptyData = [];

const BalanceCard = ({ title, balance, onWithdraw }) => (
    <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>{title}</Text>
        <Text style={styles.balanceAmount}>{balance}</Text>
        <TouchableOpacity style={styles.withdrawButton} onPress={onWithdraw}>
            <Text style={styles.withdrawText}>Solicitar saque</Text>
            <ArrowRight size={20} color={colors.white} />
        </TouchableOpacity>
    </View>
);

export default function WalletScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('extrato');
    const width = Dimensions.get('window').width;

    const renderItem = ({ item }) => {
        const isIncome = item.type === 'Entrada';
        return (
            <View style={styles.transactionItem}>
                <View style={[styles.transactionIconContainer, {backgroundColor: isIncome ? colors.greenPill : '#FEE2E2'}]}>
                    {React.cloneElement(item.icon, { color: isIncome ? colors.greenPillText : colors.red, size: 24, weight: 'bold' })}
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDesc}>{item.description}</Text>
                    <Text style={[styles.transactionAmount, {color: isIncome ? colors.greenPillText : colors.text}]}>{item.amount}</Text>
                </View>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
        );
    }
    
    return (
        <ScreenContainer>
            <Stack.Screen options={{ title: 'Carteira', headerTransparent: true, headerTitleStyle: { color: colors.text } }} />

            <View style={{ height: 180, marginTop: 80 }}>
                <Carousel
                    loop={false}
                    width={width}
                    height={150}
                    data={[{id: 1, title: 'Saldo disponível (Pix)', balance: 'R$ 138.241,15'}, {id: 2, title: 'Saldo a receber', balance: 'R$ 12.500,00'}]}
                    scrollAnimationDuration={500}
                    renderItem={({ item }) => (
                        <BalanceCard title={item.title} balance={item.balance} onWithdraw={() => {}} />
                    )}
                />
            </View>
            
            <Text style={styles.sectionTitle}>Movimentações</Text>
            
            <View style={styles.tabsContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity 
                        key={tab.id}
                        style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        {tab.icon && React.cloneElement(tab.icon, { color: activeTab === tab.id ? colors.primaryDark : colors.textSecondary, weight: 'bold' })}
                        <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={activeTab === 'extrato' ? statementData : emptyData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Image source={require('../../../assets/images/empty-state.png')} style={styles.emptyImage} />
                        <Text style={styles.emptyText}>Ainda não há nada por aqui...</Text>
                    </View>
                }
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    balanceCard: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: 24,
        height: 150,
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    balanceTitle: { color: colors.white, fontSize: 16, opacity: 0.8 },
    balanceAmount: { color: colors.white, fontSize: 28, fontWeight: 'bold' },
    withdrawButton: { flexDirection: 'row', alignItems: 'center' },
    withdrawText: { color: colors.white, fontSize: 16, fontWeight: 'bold', marginRight: 8 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginVertical: 24 },
    tabsContainer: { flexDirection: 'row', marginBottom: 16, gap: 8 },
    tab: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lightGray2, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
    activeTab: { backgroundColor: colors.primaryDark },
    tabText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginLeft: 6 },
    activeTabText: { color: colors.white },
    transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.lightGray },
    transactionIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    transactionDetails: { flex: 1, marginLeft: 16 },
    transactionDesc: { fontSize: 16, fontWeight: '600', color: colors.text },
    transactionAmount: { fontSize: 14, marginTop: 4 },
    transactionDate: { fontSize: 12, color: colors.textSecondary },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
    emptyImage: { width: 150, height: 150, opacity: 0.8 },
    emptyText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
});
