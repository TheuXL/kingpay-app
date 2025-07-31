// src/features/settings/screens/SettingsScreen.tsx
import { Stack, useRouter } from 'expo-router';
import { Buildings, Percent, SignOut, User } from 'phosphor-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { colors } from '../../../theme/colors';
import { SettingsMenuItem } from '../components/SettingsMenuItem';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={{ paddingHorizontal: 20, backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: 'Configurações', headerShadowVisible: false, headerStyle: { backgroundColor: colors.background } }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ST</Text>
          </View>
          <Text style={styles.companyName}>Soutech Tecnologia de Pagamentos</Text>
          <Text style={styles.companyId}>69635d93-560a-4161-8a46-67e4eb58c</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <SettingsMenuItem
            label="Meus dados"
            icon={<User size={24} color={colors.text} />}
            onPress={() => router.push('/(app)/settings/personal-data')} // Exemplo de rota
          />
          <SettingsMenuItem
            label="Dados da empresa"
            icon={<Buildings size={24} color={colors.text} />}
            onPress={() => router.push('/(app)/settings/company-data')} // Exemplo de rota
          />
          <SettingsMenuItem
            label="Taxas"
            icon={<Percent size={24} color={colors.text} />}
            onPress={() => router.push('/(app)/tax-calculator')} // Rota para tela de taxas
          />
          <SettingsMenuItem
            label="Sair da conta"
            icon={<SignOut size={24} color={colors.text} />}
            onPress={() => { /* Lógica de Logout */ }}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: colors.cardSecondaryBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  companyId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menuContainer: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
});
