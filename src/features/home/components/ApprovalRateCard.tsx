import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ApprovalRateData {
  geral: number;
  pix: number;
  cartao: number;
  boleto: number;
}

interface ApprovalRateCardProps {
  data?: ApprovalRateData;
}

const ApprovalRateCard: React.FC<ApprovalRateCardProps> = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 30 dias');
  
  // Mock data para demonstração
  const approvalData = data || {
    geral: 96.5,
    pix: 98.2,
    cartao: 94.8,
    boleto: 97.1
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Taxa de aprovação</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Valor principal em destaque */}
        <Text style={styles.mainValue}>{approvalData.geral.toFixed(1)}%</Text>
        <Text style={styles.mainLabel}>Taxa geral de aprovação</Text>
        
        {/* Barras de progresso por meio de pagamento */}
        <View style={styles.progressBars}>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.paymentMethod}>Pix</Text>
              <Text style={styles.percentage}>{approvalData.pix.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, styles.pixBar, { width: `${approvalData.pix}%` }]} />
            </View>
          </View>
          
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.paymentMethod}>Cartão</Text>
              <Text style={styles.percentage}>{approvalData.cartao.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, styles.cartaoBar, { width: `${approvalData.cartao}%` }]} />
            </View>
          </View>
          
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.paymentMethod}>Boleto</Text>
              <Text style={styles.percentage}>{approvalData.boleto.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, styles.boletoBar, { width: `${approvalData.boleto}%` }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    color: '#6B6B6B',
    marginRight: 4,
  },
  content: {
    paddingVertical: 16,
  },
  mainValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  mainLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressBars: {
    gap: 16,
  },
  progressItem: {
    marginBottom: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F5F6FA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  pixBar: {
    backgroundColor: '#1A1AFF', // Azul para Pix
  },
  cartaoBar: {
    backgroundColor: '#8B5CF6', // Roxo para Cartão
  },
  boletoBar: {
    backgroundColor: '#10B981', // Verde para Boleto
  },
});

export default ApprovalRateCard;
