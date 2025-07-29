import { CreditCard, Landmark, Percent } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FeeItemProps {
    icon: React.ElementType;
    method: string;
    fee: string;
    isPromotional?: boolean;
}

const FeeItem = ({ icon: Icon, method, fee, isPromotional }: FeeItemProps) => (
    <View style={styles.feeItem}>
        <View style={styles.iconContainer}>
            <Icon size={20} color="#1A1AFF" />
        </View>
        <Text style={styles.methodText}>{method}</Text>
        {isPromotional && (
            <View style={styles.promoBadge}>
                <Text style={styles.promoText}>Promo</Text>
            </View>
        )}
        <Text style={styles.feeText}>{fee}</Text>
    </View>
);

const MOCK_DATA: FeeItemProps[] = [
    { icon: Landmark, method: 'Pix', fee: '0.50%' },
    { icon: CreditCard, method: 'Crédito à vista', fee: '3.99%', isPromotional: true },
    { icon: CreditCard, method: 'Crédito parcelado', fee: '4.59%' },
    { icon: CreditCard, method: 'Débito', fee: '1.99%' },
    { icon: Percent, method: 'Taxa de antecipação', fee: '2.5% ao mês' },
];

const FeesCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Minhas Taxas</Text>
                <View style={styles.feesList}>
                    {MOCK_DATA.map((item, index) => (
                        <FeeItem
                            key={index}
                            icon={item.icon}
                            method={item.method}
                            fee={item.fee}
                            isPromotional={item.isPromotional}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    feesList: {
        gap: 16,
    },
    feeItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EAF1FB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    methodText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
    },
    promoBadge: {
        backgroundColor: '#E6F9F1',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginHorizontal: 8,
    },
    promoText: {
        color: '#19C37D',
        fontSize: 12,
        fontWeight: 'bold',
    },
    feeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default FeesCard;
