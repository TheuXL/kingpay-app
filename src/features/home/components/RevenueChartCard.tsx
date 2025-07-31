import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');
const CARD_MAX_WIDTH = 350;

const RevenueChartCard = () => {
  const [selectedPeriod] = useState('30 dias');
  const totalSales = 138241.15;

  // Dados fictícios para o gráfico
  const lineData = [
    { value: 2000, label: '27 de Jun/25', date: '27 de Jun/25' },
    { value: 4964.95, label: '05 de Julho', date: '05 de Julho' },
    { value: 3500 },
    { value: 7000 },
    { value: 4000 },
    { value: 3000 },
    { value: 2000 },
    { value: 2500, label: '27 de Jul/25', date: '27 de Jul/25' },
  ];

  const legendData = [
    { label: 'Vendas', value: 'R$ 7.724,23', color: '#1313F2' },
    { label: 'Pendente', value: 'R$ 2.822,91', color: '#F99963' },
    { label: 'Estorno', value: 'R$ 609,87', color: '#E24A3F' },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Resumo de vendas</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={15} color="#00051B" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      <Text style={styles.totalSalesAmount}>{formatCurrency(totalSales)}</Text>
      <Text style={styles.totalSalesPeriod}>Últimos 30 dias</Text>

      <View style={styles.chartWrapper}>
        <LineChart
          data={lineData}
          width={Math.min(width, CARD_MAX_WIDTH) - 40}
          height={160}
          color="#1313F2"
          thickness={2.5}
          startFillColor="rgba(19, 19, 242, 0.12)"
          endFillColor="rgba(19, 19, 242, 0.01)"
          startOpacity={1}
          endOpacity={0.1}
          spacing={36}
          curved
          yAxisTextStyle={{ color: 'transparent' }}
          xAxisLabelTextStyle={{ color: '#5B5B5B', fontSize: 12, opacity: 0.5, fontFamily: 'Inter' }}
          xAxisColor="transparent"
          yAxisColor="transparent"
          rulesType="dashed"
          rulesColor="#E5E7EB"
          dataPointsColor="#fff"
          dataPointsRadius={8}
          dataPointsBorderColor="#1313F2"
          dataPointsBorderWidth={3}
          showVerticalLines={false}
          showStripOnDataPoint
          stripColor="#1313F2"
          showDataPointOnPress
          dataPointLabelComponent={({ value, index }) =>
            index === 1 ? (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipValue}>R$ 4.964,95</Text>
                <Text style={styles.tooltipDate}>05 de Julho</Text>
              </View>
            ) : null
          }
          xAxisLabelsHeight={24}
          xAxisLabelsVerticalShift={8}
          xAxisLabels={[lineData[0].label, '', '', '', '', '', '', lineData[lineData.length - 1].label]}
        />
        <View style={styles.xAxisLabelsRow}>
          <Text style={styles.xAxisLabel}>{lineData[0].label}</Text>
          <Text style={styles.xAxisLabel}>{lineData[lineData.length - 1].label}</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        {legendData.map(item => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    color: '#00051B',
    letterSpacing: -0.01,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 89,
    paddingHorizontal: 25,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  periodText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    color: '#00051B',
  },
  totalSalesAmount: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 24,
    color: '#00051B',
    marginTop: 16,
    marginBottom: 4,
  },
  totalSalesPeriod: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: '#5B5B5B',
    marginBottom: 16,
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  xAxisLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -8,
    paddingHorizontal: 4,
  },
  xAxisLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    color: '#5B5B5B',
    opacity: 0.5,
  },
  tooltip: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: '#3A4DE9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 22,
    elevation: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  tooltipValue: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    color: '#00051B',
    marginBottom: 2,
  },
  tooltipDate: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: '#00051B',
    opacity: 0.5,
  },
  legendContainer: {
    marginTop: 12,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 59,
    marginRight: 10,
  },
  legendLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: '#5B5B5B',
    flex: 1,
  },
  legendValue: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    color: '#00051B',
    textAlign: 'right',
    minWidth: 80,
  },
});

export default RevenueChartCard;
