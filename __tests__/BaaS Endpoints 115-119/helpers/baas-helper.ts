import { Baas, BaasFee } from '../../../src/types/baas';

export const createMockBaas = (overrides: Partial<Baas> = {}): Baas => {
  const now = new Date();
  
  return {
    id: `baas_${Math.random().toString(36).substring(2, 11)}`,
    name: `BaaS Provider ${Math.floor(Math.random() * 100)}`,
    description: 'A banking as a service provider',
    active: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    logo_url: `https://example.com/logos/baas-${Math.floor(Math.random() * 100)}.png`,
    ...overrides,
  };
};

export const createMockBaasList = (count: number, overrides: Partial<Baas> = {}): Baas[] => {
  return Array.from({ length: count }, () => createMockBaas(overrides));
};

export const createMockBaasFee = (overrides: Partial<BaasFee> = {}): BaasFee => {
  const now = new Date();
  
  return {
    id: `fee_${Math.random().toString(36).substring(2, 11)}`,
    baas_id: overrides.baas_id || `baas_${Math.random().toString(36).substring(2, 11)}`,
    fee_type: 'transaction',
    fee_value: parseFloat((Math.random() * 5).toFixed(2)),
    description: 'Transaction fee',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    ...overrides,
  };
};

export const createMockBaasFeeList = (count: number, baasId: string, overrides: Partial<BaasFee> = {}): BaasFee[] => {
  return Array.from({ length: count }, () => createMockBaasFee({ ...overrides, baas_id: baasId }));
};
