// src/features/home/components/Header.tsx
import { Bell, ChevronRight, Eye } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    userName?: string;
}

const Header = ({ userName = 'Gabriel' }: HeaderProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.userButton}>
                <Text style={styles.greetingText}>
                    Olá, <Text style={styles.userName}>{userName}!</Text>
                </Text>
                <ChevronRight size={20} color="#1A1AFF" />
            </TouchableOpacity>
            <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <Eye size={22} color="#333333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Bell size={22} color="#333333" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    userButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    greetingText: {
        fontSize: 16,
        color: '#333333',
        marginRight: 4,
    },
    userName: {
        fontWeight: 'bold',
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        backgroundColor: '#FFFFFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
});

export default Header;
