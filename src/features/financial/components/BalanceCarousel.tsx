import { ArrowDown, Banknote, CreditCard, Landmark, PiggyBank } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BalanceCardProps {
    type: 'pix' | 'card' | 'receivable' | 'reserve';
    title: string;
    amount: string;
    actionText?: string;
    description?: string;
}

const cardStyles = {
    pix: {
        backgroundColor: '#1A1AFF',
        textColor: '#FFFFFF',
        icon: Landmark,
    },
    card: {
        backgroundColor: '#0A174E',
        textColor: '#FFFFFF',
        icon: CreditCard,
    },
    receivable: {
        backgroundColor: '#19C37D',
        textColor: '#FFFFFF',
        icon: Banknote,
    },
    reserve: {
        backgroundColor: '#FFFFFF',
        textColor: '#222222',
        icon: PiggyBank,
    },
};

const BalanceCard: React.FC<BalanceCardProps> = ({ type, title, amount, actionText, description }) => {
    const stylesConfig = cardStyles[type];
    const Icon = stylesConfig.icon;

    return (
        <View style={[styles.card, { backgroundColor: stylesConfig.backgroundColor }]}>
            <View style={styles.cardHeader}>
                <Icon size={24} color={stylesConfig.textColor} />
            </View>
            <Text style={[styles.cardTitle, { color: stylesConfig.textColor }]}>{title}</Text>
            <Text style={[styles.cardAmount, { color: stylesConfig.textColor }]}>{amount}</Text>
            {actionText && (
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={[styles.actionText, { color: stylesConfig.backgroundColor }]}>{actionText}</Text>
                    <ArrowDown size={16} color={stylesConfig.backgroundColor} />
                </TouchableOpacity>
            )}
            {description && (
                <Text style={[styles.description, { color: stylesConfig.textColor }]}>{description}</Text>
            )}
        </View>
    );
};


interface BalanceCarouselProps {
    pixBalance: string;
    cardBalance: string;
    receivableBalance: string;
    reserveBalance: string;
}

const BalanceCarousel: React.FC<BalanceCarouselProps> = ({ pixBalance, cardBalance, receivableBalance, reserveBalance }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <BalanceCard type="pix" title="Saldo disponível PIX" amount={pixBalance} actionText="Solicitar saque" />
            <BalanceCard type="card" title="Saldo disponível Cartão" amount={cardBalance} actionText="Solicitar saque" />
            <BalanceCard type="receivable" title="A receber" amount={receivableBalance} />
            <BalanceCard type="reserve" title="Reserva Financeira" amount={reserveBalance} description="Este valor protege suas transações." />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        minWidth: 280,
        marginRight: 12,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 5,
        minHeight: 180,
    },
    cardHeader: {},
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.9
    },
    cardAmount: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },
    actionText: {
        fontWeight: 'bold',
        marginRight: 8,
    },
    description: {
        fontSize: 12,
        opacity: 0.8
    }
});

export default BalanceCarousel; 