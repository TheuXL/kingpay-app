import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * 💰 Formatador de Moeda Brasileira
 * Formata valores em centavos para Real brasileiro
 */
export const formatCurrency = (value: number = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100); // Converte centavos para reais
};

/**
 * 📊 Formatador de Porcentagem
 * Formata valores numéricos como porcentagem
 */
export const formatPercentage = (value: number = 0): string => {
  return `${Number(value).toFixed(1)}%`;
};

/**
 * 📅 Formatador de Data para API
 * Converte Date para formato YYYY-MM-DD
 */
export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * 📅 Formatador de Data Curta
 * Converte Date para formato dd/MM
 */
export const formatShortDate = (date: Date): string => {
  return format(date, 'dd/MM', { locale: ptBR });
};

/**
 * 📅 Formatador de Data Completa
 * Converte Date para formato dd/MM/yyyy
 */
export const formatFullDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * 📈 Formatador de String de Data do Gráfico
 * Formata strings de data baseado no padrão (igual ao sistema web)
 * @param value - String no formato "2025", "03/2025" ou "01/04/2025"
 */
export const formatDateString = (value: string): string => {
  // Ano completo: "2025"
  if (/^\d{4}$/.test(value)) {
    return value;
  }
  
  // Mês/Ano: "03/2025" -> "Mar 2025"
  if (/^\d{2}\/\d{4}$/.test(value)) {
    const [month, year] = value.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return format(date, 'MMM yyyy', { locale: ptBR });
  }
  
  // Data completa: "01/04/2025" -> "01/04"
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month] = value.split('/');
    return `${day}/${month}`;
  }
  
  return value; // Retorna original se não reconhecer o formato
};

/**
 * 🔢 Formatador de Números Grandes
 * Formata números grandes com sufixos (K, M, B)
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * 📊 Formatador de Valores para Gráfico
 * Formata valores monetários para exibição em gráficos
 */
export const formatChartValue = (value: number): string => {
  if (value === 0) return 'R$ 0';
  
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(0)}K`;
  }
  
  return formatCurrency(value * 100); // Converte para centavos antes de formatar
};

/**
 * 🎯 Formatador de Indicador de Tendência
 * Retorna ícone e cor baseado na tendência
 */
export const formatTrend = (value: number, isPositive?: boolean) => {
  const actuallyPositive = isPositive !== undefined ? isPositive : value > 0;
  
  return {
    icon: actuallyPositive ? '↑' : '↓',
    color: actuallyPositive ? '#00C48C' : '#FF647C',
    text: `${actuallyPositive ? '+' : ''}${Math.abs(value).toFixed(1)}%`
  };
};

/**
 * 💳 Formatador de Método de Pagamento
 * Padroniza nomes dos métodos de pagamento
 */
export const formatPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'PIX': 'Pix',
    'CARD': 'Cartão',
    'BOLETO': 'Boleto',
    'pix': 'Pix',
    'card': 'Cartão',
    'boleto': 'Boleto',
  };
  
  return methodMap[method] || method;
};

/**
 * ⏰ Formatador de Data e Hora
 * Converte Date para formato dd/MM/yyyy às HH:mm
 */
export const formatDateTime = (date: Date): string => {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}; 