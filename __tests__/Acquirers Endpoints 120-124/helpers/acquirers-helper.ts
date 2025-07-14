import { supabase } from '../../../src/services/supabase';

// Mock acquirer data
export const mockAcquirer = {
  id: 'a22e8e59-1fcf-431a-8b85-e88a26f61113',
  name: 'Test Acquirer',
  description: 'Test acquirer description',
  active: true,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  acquirers_pix: true,
  acquirers_boleto: true,
  acquirers_card: true,
};

// Mock acquirer fees data
export const mockAcquirerFees = {
  id: 'fee-123',
  acquirer_id: 'a22e8e59-1fcf-431a-8b85-e88a26f61113',
  mdr_1x_adquirente: 1.99,
  mdr_2x_adquirente: 2.99,
  mdr_3x_adquirente: 3.99,
  mdr_4x_adquirente: 4.99,
  mdr_5x_adquirente: 5.99,
  mdr_6x_adquirente: 6.99,
  mdr_7x_adquirente: 7.99,
  mdr_8x_adquirente: 8.99,
  mdr_9x_adquirente: 9.99,
  mdr_10x_adquirente: 10.99,
  mdr_11x_adquirente: 11.99,
  mdr_12x_adquirente: 12.99,
  pix_fee_percentage: 0.99,
  pix_fee_fixed: 0.5,
  card_fee_percentage: 1.5,
  card_fee_fixed: 0.3,
  fee_type_boleto: 'percentage',
  fee_type_pix: 'percentage',
  fee_type_card: 'percentage',
  boleto_fee_percentage: 2.5,
  boleto_fee_fixed: 3.0,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

// Mock list of acquirers
export const mockAcquirersList = [
  mockAcquirer,
  {
    ...mockAcquirer,
    id: 'b33f9e59-2fcf-432a-9b85-f88a26f61114',
    name: 'Another Acquirer',
  },
];

// Setup mock responses for supabase
export const setupMocks = () => {
  // Mock for getAllAcquirers
  jest.spyOn(supabase, 'from').mockImplementation((table: string): any => {
    if (table === 'functions/v1/acquirers') {
      return {
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            data: mockAcquirersList,
            error: null,
          }),
          eq: jest.fn().mockImplementation((field, value) => {
            if (field === 'id' && value === mockAcquirer.id) {
              return {
                single: jest.fn().mockReturnValue({
                  data: mockAcquirer,
                  error: null,
                }),
                append: jest.fn().mockImplementation((path) => {
                  if (path === '/taxas') {
                    return {
                      data: [mockAcquirerFees],
                      error: null,
                    };
                  }
                  return { data: null, error: new Error('Invalid path') };
                }),
              };
            }
            return {
              single: jest.fn().mockReturnValue({
                data: null,
                error: new Error('Acquirer not found'),
              }),
              append: jest.fn().mockReturnValue({
                data: null,
                error: new Error('Acquirer not found'),
              }),
            };
          }),
        }),
        update: jest.fn().mockImplementation((payload) => {
          return {
            eq: jest.fn().mockImplementation((field, value) => {
              if (field === 'id' && value === mockAcquirer.id) {
                return {
                  append: jest.fn().mockImplementation((path) => {
                    if (path === '/active') {
                      return {
                        single: jest.fn().mockReturnValue({
                          data: { ...mockAcquirer, ...payload },
                          error: null,
                        }),
                      };
                    } else if (path === '/taxas') {
                      return {
                        single: jest.fn().mockReturnValue({
                          data: { ...mockAcquirerFees, ...payload },
                          error: null,
                        }),
                      };
                    }
                    return {
                      single: jest.fn().mockReturnValue({
                        data: null,
                        error: new Error('Invalid path'),
                      }),
                    };
                  }),
                };
              }
              return {
                append: jest.fn().mockReturnValue({
                  single: jest.fn().mockReturnValue({
                    data: null,
                    error: new Error('Acquirer not found'),
                  }),
                }),
              };
            }),
          };
        }),
        // Adicionar métodos faltantes para corresponder ao tipo PostgrestQueryBuilder
        insert: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        url: '',
        headers: {}
      };
    }
    return {
      select: jest.fn().mockReturnValue({
        data: null,
        error: new Error('Table not found'),
      }),
      // Adicionar métodos faltantes para corresponder ao tipo PostgrestQueryBuilder
      insert: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      url: '',
      headers: {}
    };
  });
};

// Clean up mocks
export const cleanupMocks = () => {
  jest.restoreAllMocks();
}; 