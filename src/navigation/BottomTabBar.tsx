import { colors } from '@/theme/colors';
import { useRouter, useSegments } from 'expo-router';
import { Home, Trophy, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabRoutes = [
    { name: 'Home', route: '/', icon: Home },
    { name: 'Jornada', route: '/jornada', icon: Trophy },
    { name: 'Conta', route: '/conta', icon: User },
];

const BottomTabBar = () => {
    const router = useRouter();
    const segments = useSegments();
    const currentRoute = `/${segments[segments.length - 1] || ''}`;

    const isRouteActive = (route: string) => {
        if (route === '/') return currentRoute === '/' || currentRoute === '/index';
        return currentRoute.startsWith(route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {tabRoutes.map((tab) => {
                    const isActive = isRouteActive(tab.route);
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tabItem}
                            onPress={() => router.push(tab.route)}
                        >
                            <tab.icon color={isActive ? colors.primary : colors.textSecondary} size={24} />
                            {isActive && <Text style={styles.activeTabText}>{tab.name}</Text>}
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
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: 32,
        margin: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'space-around',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    tabItem: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    },
});

export default BottomTabBar; 