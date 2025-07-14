/**
 * Formats a number as currency (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formats a number as percentage
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Converts a currency string to a number
 */
export const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^\d,-]/g, '').replace(',', '.'));
};

/**
 * Formats a date string to local date format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}; 