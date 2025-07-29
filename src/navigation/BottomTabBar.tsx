import { useRouter, useSegments } from 'expo-router';
import { Home, Trophy, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabRoutes = [
    { name: 'Home', route: '/', icon: Home },
    { name: 'Jornada', route: '/jornada', icon: Trophy },
    { name: 'Conta', route: '/conta', icon: User },
];

const BottomTabBar = () => {
    const router = useRouter();
    const segments = useSegments();
    // Normaliza a rota atual para lidar com a rota raiz
    const currentRoute = `/${segments.join('/') || ''}`.replace(/\/index$/, '/');

    const isRouteActive = (route: string) => {
        if (route === '/') return currentRoute === '/';
        return currentRoute.startsWith(route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {tabRoutes.map((tab) => {
                    const isActive = isRouteActive(tab.route);
                    const Icon = tab.icon;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={[styles.tabItem, isActive && styles.activeTabItem]}
                            onPress={() => router.push(tab.route)}
                        >
                            <Icon color={isActive ? '#FFFFFF' : '#7B7BFF'} size={24} />
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab.name}
                            </Text>
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
        bottom: 10, // Adiciona um respiro na parte inferior
        left: 16,
        right: 16,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF', // Fundo branco
        borderRadius: 99, // Cantos totalmente arredondados
        paddingHorizontal: 12,
        paddingVertical: 12,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 99,
        gap: 8, // Espaço entre ícone e texto
    },
    activeTabItem: {
        backgroundColor: '#1A1AFF', // Fundo azul para o item ativo
    },
    tabText: {
        color: '#7B7BFF', // Azul claro para texto inativo
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#FFFFFF', // Texto branco para o item ativo
        fontWeight: 'bold',
    },
});

export default BottomTabBar; 