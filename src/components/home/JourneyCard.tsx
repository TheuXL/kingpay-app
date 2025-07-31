import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const JourneyCard = () => {
  const progress = 89.74; // 8974 / 10000

  return (
    <TouchableOpacity style={styles.rewardCard}>
      <View style={styles.iconFrame}>
        <Trophy color="#E5EBFF" size={25} />
      </View>
      <View style={styles.detailsFrame}>
        <View style={styles.textAndArrowFrame}>
            <View style={styles.textFrame}>
                <Text style={styles.title}>Jornada KingPay</Text>
                <Text style={styles.progressAmount}>R$ 8.974,00/ 10.000,00</Text>
            </View>
            <ChevronRight color="#1313F2" size={20} />
        </View>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={['#1313F2', '#9898FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${progress}%` }]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 10,
    backgroundColor: '#F9FAFC', // O gradiente é um overlay, o fundo é sólido
    borderRadius: 12,
    height: 100,
    width: '100%',
  },
  iconFrame: {
    width: 48,
    height: 48,
    borderRadius: 37.5,
    backgroundColor: '#1313F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsFrame: {
    flex: 1,
    gap: 15,
  },
  textAndArrowFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },
  textFrame: {
      flex: 1,
      gap: 15,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 16,
    color: '#5B5B5B',
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  progressAmount: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    color: '#00051B',
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#ECECEC',
    borderRadius: 148,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 148,
  },
});

export default JourneyCard;
