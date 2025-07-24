import api from '../../../services/api';

interface TaxCalculatorPayload {
  company_id: string;
  valor: number; // Em centavos
  payment_method: 'PIX' | 'CARD' | 'BOLETO';
  parcelas: number;
}

/**
 * Calcula as taxas para uma transação.
 * @param data - O payload com os dados para o cálculo.
 * @returns Promise com o valor das taxas.
 */
export const calculateTaxes = (data: TaxCalculatorPayload) => {
  return api.post('/functions/v1/taxas', data);
};
