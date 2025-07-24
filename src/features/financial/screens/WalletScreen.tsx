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
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AppContext';
import { formatCurrency } from '../../../utils/currency';
import { walletService } from '../services';

interface WalletData {
  available_balance: number;
  pending_balance: number;
  reserve_balance: number;
  total_balance: number;
}

const WalletScreen: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();

    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadWalletData = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);
        try {
            console.log(`[REQUEST] Buscando dados da carteira para o usuário: ${user.id}`);
            const data = await walletService.getWalletSummary(user.id);
            console.log(`[RESPONSE] Resposta crua da API da carteira:`, JSON.stringify(data, null, 2));

            if (data) {
                console.log('[SOURCE] Decisão: Renderizando dados da carteira recebidos da API.');
                setWalletData(data);
            } else {
                console.warn('[SOURCE] Decisão: API não retornou dados para a carteira. Renderizando estado vazio.');
                setWalletData(null);
            }
        } catch (err) {
            console.error("[ERROR] Falha ao buscar dados da carteira:", err);
            setError('Não foi possível carregar os dados da sua carteira no momento.');
            console.log('[SOURCE] Decisão: Renderizando estado de erro na carteira.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        setLoading(true);
        loadWalletData();
    }, [loadWalletData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadWalletData();
        setRefreshing(false);
    };

    const navigateToMovements = () => {
        router.push('/(app)/(tabs)/movements');
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#101828" />
                    <Text style={styles.loadingText}>Carregando sua carteira...</Text>
                </View>
            );
        }

        if (error || !walletData || walletData.total_balance === 0) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Dados Indisponíveis</Text>
                    <Text style={styles.errorMessage}>
                        {error || "Não foi possível carregar os dados da sua carteira no momento."}
                    </Text>
                </View>
            );
        }

        return (
            <>
                <View style={styles.totalBalanceContainer}>
                    <Text style={styles.totalAmount}>{formatCurrency(walletData.total_balance / 100)}</Text>
                    <Text style={styles.subtitle}>Saldo Total</Text>
                </View>

                <View style={styles.balancesContainer}>
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceTitle}>Disponível para saque</Text>
                        <Text style={styles.balanceAmount}>{formatCurrency(walletData.available_balance / 100)}</Text>
                    </View>
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceTitle}>Pendente</Text>
                        <Text style={styles.balanceAmount}>{formatCurrency(walletData.pending_balance / 100)}</Text>
                    </View>
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceTitle}>Reserva Financeira</Text>
                        <Text style={styles.balanceAmount}>{formatCurrency(walletData.reserve_balance / 100)}</Text>
                    </View>
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Carteira</Text>
                </View>

                {renderContent()}
                
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={navigateToMovements}>
                        <Text style={styles.actionButtonText}>Ver Movimentações</Text>
                    </TouchableOpacity>
                    {/* Outros botões podem ser adicionados aqui */}
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
    header: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#101828',
    },
    totalBalanceContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    totalAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#101828',
    },
    subtitle: {
        fontSize: 16,
        color: '#667085',
        marginTop: 4,
    },
    balancesContainer: {
        marginHorizontal: 20,
    },
    balanceCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        elevation: 3,
    },
    balanceTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#475467',
    },
    balanceAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101828',
        marginTop: 8,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#667085',
    },
    errorContainer: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D92D20',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        color: '#667085',
        textAlign: 'center',
    },
    actionsSection: {
        marginHorizontal: 20,
        marginTop: 20,
        paddingBottom: 20,
    },
    actionButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#101828',
    },
});

export default WalletScreen; 