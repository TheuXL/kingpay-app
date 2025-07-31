import { ChevronRight, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const JourneyCard = () => {
  const currentAmount = 8974;
  const goalAmount = 10000;
  const progress = (currentAmount / goalAmount) * 100;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        <Trophy size={28} color="#FFFFFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Jornada KingPay</Text>
        <Text style={styles.progressValue}>
          R$ {formatCurrency(currentAmount)} /{' '}
          <Text style={styles.goalValue}>{formatCurrency(goalAmount)}</Text>
        </Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>
      <ChevronRight size={24} color="#1313F2" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1313F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  goalValue: {
    color: '#6B6B6B',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#EAEBF1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1313F2',
    borderRadius: 4,
  },
});

export default JourneyCard;
