// src/navigation/BottomTabBar.tsx
import { useRouter, useSegments } from 'expo-router';
import { BarChart2, Home, Settings } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabRoutes = [
    { name: 'Home', route: '/', icon: Home },
    { name: 'Métricas', route: '/dashboard', icon: BarChart2 }, // Rota de exemplo
    { name: 'Conta', route: '/conta', icon: Settings },
];

const BottomTabBar = () => {
    const router = useRouter();
    const segments = useSegments();

    // Lógica para determinar a rota ativa. Ex: /(app)/index -> /
    const currentRoute = '/' + (segments[segments.length - 1] || '');
    const isActive = (route: string) => {
        if (route === '/') return currentRoute === '/index' || currentRoute === '/';
        return currentRoute.startsWith(route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {tabRoutes.map((tab) => {
                    const active = isActive(tab.route);
                    const Icon = tab.icon;

                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={active ? styles.activeButton : styles.inactiveButton}
                            onPress={() => router.replace(tab.route)}
                        >
                            <Icon color={active ? '#FFFFFF' : '#8A8A8A'} size={24} />
                            {active && <Text style={styles.activeButtonText}>{tab.name}</Text>}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo com leve transparência
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        // Efeito de vidro (requer bibliotecas adicionais como @react-native-community/blur)
        // Por enquanto, usaremos uma cor semitransparente.
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 8,
    },
    activeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D0D26', // Azul bem escuro/preto
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 8,
        flex: 1, // Ocupa mais espaço
        justifyContent: 'center',
    },
    activeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    inactiveButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
});

export default BottomTabBar;
