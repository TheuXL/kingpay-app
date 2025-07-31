// src/features/tax-calculator/screens/TaxCalculatorScreen.tsx
import { Stack } from 'expo-router';
import { ArrowDown, CaretDown } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { colors } from '../../../theme/colors';

const FeeCard = ({ type, value }) => (
  <View style={styles.feeCard}>
    <View style={styles.iconContainer}>
      <ArrowDown size={24} color={colors.text} />
    </View>
    <View>
      <Text style={styles.feeType}>{type}</Text>
      <Text style={styles.feeValue}>{value}</Text>
    </View>
  </View>
);

export default function TaxCalculatorScreen() {
  return (
    <ScreenContainer scrollable style={{ paddingHorizontal: 20, backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: 'Configurações', headerShadowVisible: false, headerStyle: { backgroundColor: colors.background } }} />
      
      {/* Configuração das taxas */}
      <View style={styles.section}>
        <Text style={styles.title}>Configuração das taxas</Text>
        <Text style={styles.subtitle}>Gerencie suas taxas e faça simulações de transações em tempo real.</Text>
        <View style={styles.grid}>
          <FeeCard type="Pix" value="R$ 0,50" />
          <FeeCard type="Cartão" value="R$ 2.99 + 5.9%" />
          <FeeCard type="Boleto" value="R$ 3.00 + 1.99%" />
          <FeeCard type="Saque" value="R$ 1,00" />
        </View>
      </View>

      {/* Simulador de Taxas */}
      <View style={styles.section}>
        <Text style={styles.title}>Simulador de Taxas</Text>
        <View style={styles.simulatorCard}>
          <Text style={styles.inputLabel}>Digite o valor da transação</Text>
          <TextInput
            style={styles.input}
            placeholder="R$ 0,00"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={styles.inputLabel}>Selecione a forma de pagamento</Text>
          <TouchableOpacity style={styles.select}>
            <Text style={styles.selectText}>Pix</Text>
            <CaretDown size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  feeCard: {
    width: '48%',
    backgroundColor: colors.cardSecondaryBackground,
    borderRadius: 12,
    padding: 20,
    gap: 32,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feeType: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  simulatorCard: {
    backgroundColor: colors.cardSecondaryBackground,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.iconBackground,
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  select: {
    backgroundColor: colors.iconBackground,
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
  },
});
