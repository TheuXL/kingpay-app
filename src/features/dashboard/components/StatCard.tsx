import { colors } from '@/theme/colors';
import { formatCurrency, formatPercentage, formatTrend } from '@/utils/formatters';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: number;
  type: 'currency' | 'percentage';
  icon: keyof typeof Feather.glyphMap | keyof typeof MaterialIcons.glyphMap;
  iconProvider?: 'feather' | 'material';
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  isWalletCard?: boolean;
  onWithdraw?: () => void;
  isLoading?: boolean;
  error?: string;
  showBalance?: boolean;
  onToggleBalance?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  type,
  icon,
  iconProvider = 'feather',
  trend,
  isWalletCard = false,
  onWithdraw,
  isLoading = false,
  error,
  showBalance = true,
  onToggleBalance,
}) => {
  const [localShowBalance, setLocalShowBalance] = useState(true);
  const shouldShowBalance = showBalance && localShowBalance;

  // Formatação do valor baseado no tipo
  const formatValue = (val: number) => {
    if (type === 'currency') {
      return formatCurrency(val);
    } else {
      return formatPercentage(val);
    }
  };

  // Renderizar ícone baseado no provider
  const renderIcon = () => {
    const iconProps = {
      name: icon as any,
      size: 24,
      color: colors.primary,
    };

    if (iconProvider === 'material') {
      return <MaterialIcons {...iconProps} />;
    }
    return <Feather {...iconProps} />;
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <View style={styles.errorContent}>
          <Feather name="alert-circle" size={32} color={colors.danger} />
          <Text style={styles.errorTitle}>Erro</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        
        {/* Header: Ícone e Badge de Tendência */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
            {renderIcon()}
          </View>
          
          {trend && (
            <View style={[
              styles.trendBadge,
              { backgroundColor: trend.isPositive ? '#00C48C15' : '#FF647C15' }
            ]}>
              <Text style={[
                styles.trendText,
                { color: trend.isPositive ? '#00C48C' : '#FF647C' }
              ]}>
                {formatTrend(trend.value, trend.isPositive).text}
              </Text>
            </View>
          )}
        </View>

        {/* Conteúdo Principal */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          
          {/* Valor com toggle de visibilidade (para carteira) */}
          {isWalletCard ? (
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {shouldShowBalance ? formatValue(value) : '••••••'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setLocalShowBalance(!localShowBalance);
                  onToggleBalance?.();
                }}
                style={styles.eyeButton}
              >
                <Feather 
                  name={shouldShowBalance ? 'eye' : 'eye-off'} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.value}>{formatValue(value)}</Text>
          )}
        </View>

        {/* Botão de Saque (apenas para carteira) */}
        {isWalletCard && onWithdraw && (
          <TouchableOpacity 
            style={[styles.withdrawButton, { backgroundColor: colors.primary }]}
            onPress={onWithdraw}
          >
            <Feather name="arrow-down-circle" size={20} color="#fff" />
            <Text style={styles.withdrawButtonText}>Sacar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  cardContent: {
    
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorCard: {
    borderColor: colors.danger,
    borderWidth: 1,
    backgroundColor: '#FF647C08',
  },
  errorContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.danger,
    marginTop: 8,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    
  },
  title: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  eyeButton: {
    padding: 8,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatCard; 