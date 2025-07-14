import { ApiResponse } from './index';

// Interface para os métodos de pagamento
export interface MetodoPagamento {
  id: string;
  nome: string;
  tipo: 'pix' | 'boleto' | 'cartao';
  ativo: boolean;
  taxa_fixa?: number;
  taxa_percentual?: number;
}

// Interface para os padrões do sistema
export interface Padroes {
  id: string;
  metodos_pagamento: MetodoPagamento[];
  percentual_reserva_antecipacao: number;
  dias_antecipacao: number;
  taxa_antecipacao: number;
  taxa_saque: number;
  valor_minimo_saque: number;
  dias_liberacao_saque: number;
  updated_at: string;
  created_at: string;
}

// Interface para atualização de padrões
export interface AtualizarPadroesRequest {
  metodos_pagamento?: MetodoPagamento[];
  percentual_reserva_antecipacao?: number;
  dias_antecipacao?: number;
  taxa_antecipacao?: number;
  taxa_saque?: number;
  valor_minimo_saque?: number;
  dias_liberacao_saque?: number;
}

// Resposta da API para operações com padrões
export interface PadroesResponse extends ApiResponse<Padroes> {} 