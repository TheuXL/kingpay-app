/**
 * Formata um número como moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data como string no formato brasileiro (DD/MM/YYYY)
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Formata uma data e hora como string no formato brasileiro (DD/MM/YYYY HH:MM)
 */
export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Formata um valor como porcentagem
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Converte uma string de moeda para um número
 */
export const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^\d,-]/g, '').replace(',', '.'));
}; 