import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ExploreCard = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Explore outras funcionalidades</Text>
            <TouchableOpacity style={styles.card}>
                {/* Conteúdo do card de exploração, pode ser uma imagem ou texto */}
                <View style={styles.cardContent}>
                     <Text style={styles.cardText}>Ver todas</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00051B',
        marginBottom: 16,
    },
    card: {
        height: 188,
        backgroundColor: '#1313F2',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        // Placeholder para o conteúdo visual do card
    },
    cardText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default ExploreCard;
