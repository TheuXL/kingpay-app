import { colors } from '@/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, Copy, Link, Send, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentLinkDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  // Dados estáticos para a UI
  const linkDetails = {
    value: 'R$ 34,90',
    active: true,
    name: 'Capa Notebook Acer Nitro 5',
    createdAt: 'Criado em 22 de julho de 2025 às 11:33h.',
    description: 'A Capa Survivor para Notebook da Gshield oferece mais do que apenas proteção para o seu dispositivo - é um escudo que...',
    fullDescription: 'A Capa Survivor para Notebook da Gshield oferece mais do que apenas proteção para o seu dispositivo - é um escudo que o envolve em 360°, garantindo a segurança contra arranhões, quedas e impactos do dia a dia. Com um design slim e material de alta qualidade, ela não adiciona volume extra, preservando a elegância do seu notebook.',
    paymentMethods: ['Pix', 'Cartão', 'Boleto'],
    url: `https://app.kingpaybr.com/pay/${id || '27a8d0f5-8967-42c5-8f45-c51d4b377748'}`,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Link de Pagamento</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.mainIconContainer}>
              <Link size={32} color={colors.primary} />
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Send size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]}>
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.value}>{linkDetails.value}</Text>
          <View style={[styles.badge, linkDetails.active ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={[styles.badgeText, linkDetails.active ? styles.activeBadgeText : styles.inactiveBadgeText]}>
              {linkDetails.active ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
          
          <Text style={styles.productName}>{linkDetails.name}</Text>
          <Text style={styles.createdAt}>{linkDetails.createdAt}</Text>

          <View style={styles.paymentMethods}>
            {linkDetails.paymentMethods.map(method => (
              <View key={method} style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>{method}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Descrição</Text>
          <Text style={styles.descriptionText} numberOfLines={isExpanded ? undefined : 2}>
            {isExpanded ? linkDetails.fullDescription : linkDetails.description}
          </Text>
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.seeMore}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
            <ChevronDown size={16} color={colors.primary} style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]}}/>
          </TouchableOpacity>
        </View>

        <View style={styles.linkCard}>
          <Text style={styles.linkCardTitle}>Link de pagamento</Text>
          <View style={styles.linkUrlContainer}>
            <Text style={styles.linkUrl} numberOfLines={1}>{linkDetails.url}</Text>
            <TouchableOpacity>
              <Copy size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  scrollContent: {
    padding: 20,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mainIconContainer: {
    backgroundColor: '#E6F0FF',
    padding: 16,
    borderRadius: 99,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#E6F0FF',
    padding: 12,
    borderRadius: 99,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  createdAt: {
    fontSize: 14,
    color: '#52525B',
    marginBottom: 16,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  methodBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  methodBadgeText: {
    color: '#374151',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#52525B',
    lineHeight: 24,
  },
  seeMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  seeMoreText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  linkCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  linkCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#52525B',
    marginBottom: 12,
  },
  linkUrlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkUrl: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginRight: 16,
  },
   badge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#E6F9F0',
  },
  inactiveBadge: {
    backgroundColor: '#FDECEC',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeBadgeText: {
    color: '#00875F',
  },
  inactiveBadgeText: {
    color: '#F75A68',
  },
});
