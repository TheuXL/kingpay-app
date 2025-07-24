import { colors } from '@/theme/colors';
import { Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface JourneyCardProps {
  progress?: number;
  onPress?: () => void;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ progress = 0.6, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Trophy color={colors.white} size={28} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Jornada KingPay</Text>
        <Text style={styles.subtitle}>Receba recompensas pelo desempenho</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarForeground, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#52525B',
    marginTop: 2,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E4E4E7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarForeground: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default JourneyCard; 