/**
 * Interface representing a BaaS (Banking as a Service) provider
 */
export interface Baas {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  logo_url?: string;
}

/**
 * Interface representing a BaaS fee/tax
 */
export interface BaasFee {
  id: string;
  baas_id: string;
  fee_type: string;
  fee_value: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for updating a BaaS fee
 */
export interface UpdateBaasFeePayload {
  fee: number;
}

/**
 * Response from the API when fetching all BaaS providers
 */
export interface BaasListResponse {
  baas: Baas[];
}

/**
 * Response from the API when fetching a single BaaS provider
 */
export interface BaasResponse {
  baas: Baas;
}

/**
 * Response from the API when fetching BaaS fees
 */
export interface BaasFeesResponse {
  fees: BaasFee[];
}

/**
 * Response from the API when activating/deactivating a BaaS
 */
export interface BaasActivationResponse {
  success: boolean;
  message: string;
  baas: Baas;
}

/**
 * Response from the API when updating a BaaS fee
 */
export interface UpdateBaasFeeResponse {
  success: boolean;
  message: string;
  fee: BaasFee;
} 