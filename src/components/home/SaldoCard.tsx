import { ArrowForward, MoreVert } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SaldoCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.frame1}>
        <View style={styles.frame2}>
            <View style={styles.topRow}>
                <Text style={styles.title}>Saldo disponível</Text>
                <TouchableOpacity>
                    <MoreVert color="#F9FAFC" size={20} />
                </TouchableOpacity>
            </View>
            <Text style={styles.amount}>R$ 138.241,45</Text>
        </View>
        <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>Antecipar Saque</Text>
            <ArrowForward color="#F9FAFC" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%', // 350px
    height: 176,
    backgroundColor: '#1313F2',
    borderRadius: 12,
    paddingHorizontal: 19,
    paddingVertical: 19,
    justifyContent: 'center',
  },
  frame1: {
      height: 135,
      justifyContent: 'space-between',
  },
  frame2: {
      gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#E5EBFF',
    letterSpacing: -0.16,
  },
  amount: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    color: '#F9FAFC',
    letterSpacing: -0.48,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    color: '#F9FAFC',
  },
});

export default SaldoCard;
