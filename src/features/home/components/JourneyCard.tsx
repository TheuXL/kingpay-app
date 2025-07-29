import { Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const JourneyCard = () => {
  const progress = 75; // Exemplo de progresso

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Trophy size={28} color="#1A1AFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Jornada KingPay</Text>
        <Text style={styles.subtitle}>Receba recompensas pelo desempenho</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF1FB', // Fundo azul-claro
    borderRadius: 16,
    padding: 16,
    marginVertical: 12, // Espaçamento entre seções
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 2,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1A1AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1AFF',
    marginLeft: 8,
  },
});

export default JourneyCard; 