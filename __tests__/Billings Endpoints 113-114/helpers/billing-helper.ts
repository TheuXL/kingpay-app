import { Billing } from '../../../src/types/billing';

export const createMockBilling = (overrides: Partial<Billing> = {}): Billing => {
  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 30); // Due date 30 days from now
  
  return {
    id: `bill_${Math.random().toString(36).substring(2, 11)}`,
    amount: 100 + Math.floor(Math.random() * 900), // Random amount between 100 and 999
    description: `Fatura mensal ${now.getMonth() + 1}/${now.getFullYear()}`,
    due_date: dueDate.toISOString(),
    status: 'pending',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    user_id: `user_${Math.random().toString(36).substring(2, 11)}`,
    company_id: `company_${Math.random().toString(36).substring(2, 11)}`,
    ...overrides,
  };
};

export const createMockBillingList = (count: number, overrides: Partial<Billing> = {}): Billing[] => {
  return Array.from({ length: count }, () => createMockBilling(overrides));
}; 