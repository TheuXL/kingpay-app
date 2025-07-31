// src/features/authentication/screens/LoginScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KingPayLogo } from '../../../components/common/KingPayLogo';

// Usaremos esta nova imagem para a tela de login.
// Certifique-se de adicionar 'login-cards.png' em 'src/assets/images/'
// const loginCards = require('../../../assets/images/login-cards.png');

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F4F7FF']}
      style={styles.container}
    >
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
            <KingPayLogo width={106} height={20} />
        </View>

        <View style={styles.content}>
            <Text style={styles.title}>
                Tudo que seu negócio precisa, {'\n'}
                <Text style={styles.titleHighlight}>em um só lugar.</Text>
            </Text>

            {/* <Image 
                source={loginCards}
                style={styles.cardsImage}
                resizeMode="contain"
            /> */}
        </View>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(app)/dashboard')}>
                <Text style={styles.primaryButtonText}>Fazer login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.secondaryButtonText}>Esqueci minha senha</Text>
            </TouchableOpacity>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 40,
        marginLeft: -4, // Ajuste fino para alinhar com o texto
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -60, // Puxa o conteúdo para cima para centralizar melhor
    },
    title: {
        fontSize: 38,
        color: '#8C8CBA',
        textAlign: 'left',
        alignSelf: 'flex-start',
        lineHeight: 46,
        marginBottom: 32,
    },
    titleHighlight: {
        color: '#1A1AFF',
    },
    // cardsImage: {
    //     width: '120%', // A imagem pode precisar de um overflow para o efeito desejado
    //     height: 300,
    //     marginBottom: 40,
    // },
    footer: {
        paddingBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#1A1AFF',
        height: 56,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        marginTop: 16,
        height: 56,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A3A3FF',
    },
    secondaryButtonText: {
        color: '#1A1AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
