import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ApprovalRateData {
  geral?: number;
  pix?: number;
  cartao?: number;
  boleto?: number;
}

interface ApprovalRateCarouselCardProps {
  data?: ApprovalRateData;
  approvalRate?: number; // Taxa de aprovação calculada
  isLoading?: boolean;
}

const ApprovalRateCarouselCard: React.FC<ApprovalRateCarouselCardProps> = ({ 
  data, 
  approvalRate, 
  isLoading = false 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando taxa de aprovação...</Text>
        </View>
      </View>
    );
  }

  // Usar taxa de aprovação calculada ou dados específicos
  const geralValue = approvalRate !== undefined ? `${approvalRate.toFixed(1)}%` : 
                    data?.geral !== undefined ? `${data.geral.toFixed(1)}%` : '--%';
  const pixValue = data?.pix !== undefined ? `${data.pix.toFixed(1)}%` : '--%';
  const cartaoValue = data?.cartao !== undefined ? `${data.cartao.toFixed(1)}%` : '--%';
  const boletoValue = data?.boleto !== undefined ? `${data.boleto.toFixed(1)}%` : '--%';

  const pixWidth = data?.pix !== undefined ? `${Math.min(data.pix, 100)}%` : '0%';
  const cartaoWidth = data?.cartao !== undefined ? `${Math.min(data.cartao, 100)}%` : '0%';
  const boletoWidth = data?.boleto !== undefined ? `${Math.min(data.boleto, 100)}%` : '0%';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Taxa de Aprovação</Text>
          <Text style={styles.value}>{geralValue}</Text>
        </View>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.methodRow}>
          <Text style={styles.methodLabel}>PIX</Text>
          <View style={styles.methodValue}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: pixWidth, backgroundColor: '#00B69B' }]} />
            </View>
            <Text style={styles.percentageText}>{pixValue}</Text>
          </View>
        </View>
        
        <View style={styles.methodRow}>
          <Text style={styles.methodLabel}>Cartão</Text>
          <View style={styles.methodValue}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: cartaoWidth, backgroundColor: '#6366F1' }]} />
            </View>
            <Text style={styles.percentageText}>{cartaoValue}</Text>
          </View>
        </View>
        
        <View style={styles.methodRow}>
          <Text style={styles.methodLabel}>Boleto</Text>
          <View style={styles.methodValue}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: boletoWidth, backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={styles.percentageText}>{boletoValue}</Text>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
    height: 220,
    justifyContent: 'space-around',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B6B6B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
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
    color: '#333333',
    marginRight: 4,
  },
  metricsContainer: {
    gap: 16,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    width: 60,
  },
  methodValue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    flex: 1,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    width: 35,
    textAlign: 'right',
  },
});

export default ApprovalRateCarouselCard;
