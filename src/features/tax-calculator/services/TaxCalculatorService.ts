/**
 * Módulo: Calculadora de Taxas
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface TaxCalculationRequest {
    company_id: string;
    valor: number; // em centavos
    payment_method: 'PIX' | 'CARD' | 'BOLETO';
    parcelas: number;
}

export interface TaxCalculationResponse {
    taxaIntermediacao: string;
    totalTaxas: string;
}

/**
 * Calcula as taxas para uma transação simulada.
 * Endpoint: POST /taxas
 */
export const calculateTax = async (payload: TaxCalculationRequest) => {
    return edgeFunctionsProxy.post<TaxCalculationResponse>('taxas', payload);
};
