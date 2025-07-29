/**
 * Tipos para Links de Pagamento
 * Baseado nos endpoints da documentação
 */

export interface PaymentLink {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  status: 'active' | 'inactive' | 'expired';
  paymentMethods: PaymentMethod[];
  expiresAt?: Date;
  maxUses?: number;
  currentUses: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

export interface PaymentMethod {
  type: 'PIX' | 'CARD' | 'BOLETO';
  enabled: boolean;
  config?: Record<string, any>;
}

export interface CreatePaymentLinkRequest {
  name: string;
  description?: string;
  amount: number;
  paymentMethods: PaymentMethod[];
  expiresAt?: Date;
  maxUses?: number;
}

export interface UpdatePaymentLinkRequest {
  name?: string;
  description?: string;
  amount?: number;
  paymentMethods?: PaymentMethod[];
  status?: 'active' | 'inactive';
  expiresAt?: Date;
  maxUses?: number;
}

export interface PaymentLinkView {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  companyInfo: {
    name: string;
    logo?: string;
  };
  isExpired: boolean;
  isActive: boolean;
}
