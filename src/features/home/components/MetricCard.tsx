import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MetricCardProps {
  title: string;
  value: string;
  variation?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, variation }) => {
    const isPositive = variation !== undefined && variation >= 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.periodButton}>
                    <Text style={styles.periodText}>30 dias</Text>
                    <ChevronDown size={16} color="#6B6B6B" />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <Text style={styles.value}>{value}</Text>
                {variation !== undefined && (
                    <View style={styles.variationContainer}>
                        {isPositive ? (
                            <TrendingUp size={14} color="#00C48C" />
                        ) : (
                            <TrendingDown size={14} color="#FF647C" />
                        )}
                        <Text style={[
                            styles.variationText,
                            { color: isPositive ? '#00C48C' : '#FF647C' }
                        ]}>
                            {Math.abs(variation).toFixed(1)}%
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 4,
        flex: 1, // Para ocupar o espaço no grid
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    periodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    periodText: {
        fontSize: 12,
        color: '#333333',
        marginRight: 4,
    },
    body: {
        alignItems: 'flex-start',
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    variationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    variationText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default MetricCard; 