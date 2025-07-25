/**
 * 🚀 APP PRINCIPAL - KINGPAY
 * =========================
 * 
 * Aplicativo principal com navegação integrada
 * seguindo o fluxograma e design apresentados
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona automaticamente para a tela de login
  return <Redirect href="/login" />;
} 