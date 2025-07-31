// src/features/home/components/SalesSummary.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = ["Hoje", "Semana", "Mês", "Ano"];

const SalesSummary = () => {
    const [activeTab, setActiveTab] = useState("Hoje");

    // Dados mocados para o resumo
    const summaryData = {
        totalSales: "R$ 1.250,80",
        transactions: "25 transações",
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumo de vendas</Text>
            <View style={styles.tabsContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.summaryInfo}>
                <Text style={styles.totalSales}>{summaryData.totalSales}</Text>
                <Text style={styles.transactions}>{summaryData.transactions}</Text>
            </View>

            <View style={styles.chartContainer}>
                {/* O componente de gráfico será inserido aqui */}
                <Text style={{textAlign: 'center', padding: 40, color: '#999'}}>Gráfico de Vendas</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginTop: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F4F4F6',
        borderRadius: 20,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 16,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
    },
    activeTabText: {
        color: '#1A1AFF',
    },
    summaryInfo: {
        marginBottom: 16,
    },
    totalSales: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
    },
    transactions: {
        fontSize: 14,
        color: '#666666',
    },
    chartContainer: {
        height: 150, // Altura para o container do gráfico
    }
});

export default SalesSummary;
