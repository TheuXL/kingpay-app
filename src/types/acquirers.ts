export interface Acquirer {
  id: string;
  name: string;
  description?: string;
  acquirers_pix: boolean;
  acquirers_boleto: boolean;
  acquirers_card: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcquirerFee {
  id: string;
  acquirer_id: string;
  mdr_1x_adquirente: number;
  mdr_2x_adquirente: number;
  mdr_3x_adquirente: number;
  mdr_4x_adquirente: number;
  mdr_5x_adquirente: number;
  mdr_6x_adquirente: number;
  mdr_7x_adquirente: number;
  mdr_8x_adquirente: number;
  mdr_9x_adquirente: number;
  mdr_10x_adquirente: number;
  mdr_11x_adquirente: number;
  mdr_12x_adquirente: number;
  pix_fee_percentage: number;
  pix_fee_fixed: number;
  card_fee_percentage: number;
  card_fee_fixed: number;
  fee_type_boleto: string;
  fee_type_pix: string;
  fee_type_card: string;
  boleto_fee_percentage: number;
  boleto_fee_fixed: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateAcquirerActivePayload {
  acquirers_pix: boolean;
  acquirers_boleto: boolean;
  acquirers_card: boolean;
}

export interface UpdateAcquirerFeePayload {
  mdr_1x_adquirente?: number;
  mdr_2x_adquirente?: number;
  mdr_3x_adquirente?: number;
  mdr_4x_adquirente?: number;
  mdr_5x_adquirente?: number;
  mdr_6x_adquirente?: number;
  mdr_7x_adquirente?: number;
  mdr_8x_adquirente?: number;
  mdr_9x_adquirente?: number;
  mdr_10x_adquirente?: number;
  mdr_11x_adquirente?: number;
  mdr_12x_adquirente?: number;
  pix_fee_percentage?: number;
  pix_fee_fixed?: number;
  card_fee_percentage?: number;
  card_fee_fixed?: number;
  fee_type_boleto?: string;
  fee_type_pix?: string;
  fee_type_card?: string;
  boleto_fee_percentage?: number;
  boleto_fee_fixed?: number;
}

export interface CreateAcquirerPayload {
  name: string;
  description?: string;
  logo?: string;
  configurations?: { [key: string]: string };
}

export interface UpdateAcquirerPayload {
  name?: string;
  description?: string;
  logo?: string;
  configurations?: { [key: string]: string };
}

export interface AcquirerState {
  acquirers: Acquirer[];
  currentAcquirer: Acquirer | null;
  acquirerFees: AcquirerFee[];
  isLoading: boolean;
  error: string | null;
}

export interface UpdateCompanyAcquirerPayload {
  acquirers_pix?: boolean;
  acquirers_boleto?: boolean;
  acquirers_card?: boolean;
} 