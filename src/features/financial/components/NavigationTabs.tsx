import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const TABS = ['Extrato', 'Saques', 'Antecipações', 'Taxas', 'Reembolsos'];

interface NavigationTabsProps {
    onTabChange: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.pill, isActive ? styles.activePill : styles.inactivePill]}
                        onPress={() => handleTabPress(tab)}
                    >
                        <Text style={[styles.pillText, isActive ? styles.activePillText : styles.inactivePillText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    pill: {
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginRight: 8,
    },
    activePill: {
        backgroundColor: '#1A1AFF',
    },
    inactivePill: {
        backgroundColor: '#EAF1FB',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activePillText: {
        color: '#FFFFFF',
    },
    inactivePillText: {
        color: '#1A1AFF',
    },
});

export default NavigationTabs; 