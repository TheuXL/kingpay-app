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

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Balance {
  id: string;
  title: string;
  amount: number;
  type: 'available' | 'pending' | 'total';
}

const WalletScreen: React.FC = () => {
    // Removida a lógica de busca de dados, estado de loading, etc.
    // O estado de refreshing pode ser mantido para uma futura tentativa de recarregar.
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const onRefresh = () => {
        // Lógica para tentar recarregar os dados pode ser adicionada aqui no futuro
        console.log("Tentando recarregar os dados da carteira...");
    }

    const navigateToMovements = () => {
        router.push('/(app)/(tabs)/movements');
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Carteira</Text>
                </View>

                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Serviço Indisponível</Text>
                    <Text style={styles.errorMessage}>
                        Não foi possível carregar os dados da sua carteira no momento.
                        Por favor, tente novamente mais tarde.
                    </Text>
                </View>
                
                {/* As seções de ações podem ser mantidas, pois podem levar a outras telas que funcionam */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={navigateToMovements}>
                        <Text style={styles.actionButtonText}>Ver Movimentações</Text>
                    </TouchableOpacity>
                    {/* ... botões de ação */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#101828',
    },
    totalAmount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#101828',
    },
    balancesContainer: {
        margin: 20,
    },
    balanceCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
    },
    balanceTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    loadingContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#b91c1c',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        color: '#667085',
        textAlign: 'center',
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    balanceSection: {
        marginHorizontal: 20,
    },
    balanceLabel: {
        fontSize: 14,
        color: '#667085',
    },
    balanceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#101828',
        marginTop: 4,
    },
    actionsSection: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    actionButton: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#101828',
    },
});

export default WalletScreen; 