import { useRouter, useSegments } from 'expo-router';
import { BarChart2, Home, Settings } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabRoutes = [
    { name: 'Home', route: '/', icon: Home },
    { name: 'Métricas', route: '/metricas', icon: BarChart2 },
    { name: 'Conta', route: '/conta', icon: Settings },
];

const BottomTabBar = () => {
    const router = useRouter();
    const segments = useSegments();
    const currentRoute = `/${segments.join('/') || ''}`.replace(/\/index$/, '/');

    const isRouteActive = (route: string) => {
        if (route === '/') return currentRoute === '/';
        return currentRoute.startsWith(route);
    };

    return (
        <View style={styles.navBarContainer}>
            <View style={styles.navBar}>
                {tabRoutes.map((tab, index) => {
                    const isActive = isRouteActive(tab.route);
                    const Icon = tab.icon;

                    if (isActive) {
                        return (
                            <View key={tab.name} style={styles.activeTab}>
                                <View style={styles.activeTabContent}>
                                    <Icon color="#F9FAFC" size={24} />
                                    <Text style={styles.activeTabText}>{tab.name}</Text>
                                </View>
                            </View>
                        );
                    }
                    
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.inactiveTab}
                            onPress={() => router.push(tab.route)}
                        >
                            <Icon color="#B0B0B0" size={24} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 94,
        backgroundColor: '#F9FAFC',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 54,
        gap: 10,
    },
    activeTab: {
        flex: 1, // Ocupa o espaço restante
        height: 54,
        backgroundColor: '#00051B',
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
    },
    activeTabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    activeTabText: {
        fontFamily: 'Inter',
        fontWeight: '500',
        fontSize: 14,
        color: '#F9FAFC',
        lineHeight: 21,
    },
    inactiveTab: {
        width: 56,
        height: 54,
        backgroundColor: '#F2F2F2',
        borderRadius: 64,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
    },
});

export default BottomTabBar;
