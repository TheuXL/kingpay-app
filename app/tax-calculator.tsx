import { Stack } from 'expo-router';
import React from 'react';
import TaxCalculator from '../src/screens/TaxCalculator';

export default function TaxCalculatorScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Calculadora de Taxas', headerShown: false }} />
      <TaxCalculator />
    </>
  );
} 