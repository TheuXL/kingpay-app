import { colors } from '@/theme/colors';
import { Trophy } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function JourneyScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Trophy color={colors.primary} size={48} />
                <Text style={styles.title}>Jornada KingPay</Text>
                <Text style={styles.subtitle}>
                    Esta funcionalidade está em desenvolvimento e estará disponível em breve.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
    },
}); 