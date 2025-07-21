/**
 * Utilitários para conversão de moeda
 * O banco armazena valores em centavos (bigint), a UI exibe em reais
 */

/**
 * Converte valor de centavos para reais
 * @param centavos Valor em centavos (bigint do banco)
 * @returns Valor em reais (float)
 */
export function centavosParaReais(centavos: number | bigint): number {
  if (typeof centavos === 'bigint') {
    return Number(centavos) / 100;
  }
  return centavos / 100;
}

/**
 * Converte valor de reais para centavos
 * @param reais Valor em reais (float da UI)
 * @returns Valor em centavos (int para o banco)
 */
export function reaisParaCentavos(reais: number): number {
  return Math.round(reais * 100);
}

/**
 * Formata valor em centavos para exibição em reais
 * @param centavos Valor em centavos
 * @param locale Locale para formatação (padrão: pt-BR)
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export function formatarCentavosParaReais(
  centavos: number | bigint, 
  locale: string = 'pt-BR'
): string {
  const reais = centavosParaReais(centavos);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL'
  }).format(reais);
}

/**
 * Formata valor em reais para exibição
 * @param reais Valor em reais
 * @param locale Locale para formatação (padrão: pt-BR)
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export function formatarReais(
  reais: number, 
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL'
  }).format(reais);
}

/**
 * Alias para formatarReais - usado para compatibilidade
 * @param valor Valor em reais
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export function formatCurrency(valor: number): string {
  return formatarReais(valor);
}

/**
 * Verifica se um valor representa zero ou está vazio
 * @param valor Valor a verificar
 * @returns true se for zero/vazio
 */
export function isValorVazio(valor: number | bigint | null | undefined): boolean {
  if (valor === null || valor === undefined) return true;
  if (typeof valor === 'bigint') return valor === 0n;
  return valor === 0;
} 