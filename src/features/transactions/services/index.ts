import { TransactionService } from './transactionService';

export const transactionService = new TransactionService();
export * from '../types';

// Export specific items from transactionService to avoid conflicts
export type {
    CardData, CreateTransactionRequest,
    Credentials, Customer, PixConfig, ShippingAddress, TransactionItem
} from './transactionService';

