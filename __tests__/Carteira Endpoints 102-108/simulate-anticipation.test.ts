import { SimulateAnticipationPayload } from '../../src/types/wallet';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Wallet Service - simulateAnticipation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return simulation data on success', async () => {
    const payload: SimulateAnticipationPayload = { userId: 'user-123' };
    const mockResponse = { simulationId: 'sim-456', anticipatedValue: 950.0 };

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    const result = await walletService.simulateAnticipation(payload);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('antecipacoes/create', {
      method: 'POST',
      body: payload,
    });
  });

  it('should return an error if the simulation fails', async () => {
    const payload: SimulateAnticipationPayload = { userId: 'user-123' };
    const errorMessage = 'Simulation failed due to insufficient funds.';
    
    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await walletService.simulateAnticipation(payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });

  it('should handle exceptions', async () => {
    const payload: SimulateAnticipationPayload = { userId: 'user-123' };
    const errorMessage = 'Network Error';
    
    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await walletService.simulateAnticipation(payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 