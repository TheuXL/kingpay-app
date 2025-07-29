import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ExploreCard = () => {
    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Explore outras funcionalidades</Text>
                <Text style={styles.subtitle}>Descubra tudo que a KingPay pode fazer pelo seu negócio.</Text>
            </View>
            <View style={styles.imagePlaceholder}>
                <ArrowRight size={24} color="#1A1AFF" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 24,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B6B6B',
        lineHeight: 20,
    },
    imagePlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EAF1FB',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ExploreCard; 