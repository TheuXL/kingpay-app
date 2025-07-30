import { useState, useCallback } from 'react';
import { getTransactions } from '../services/transactionService';
import { Transaction, TransactionFilters } from '../types';

const PAGE_SIZE = 20;

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState<Partial<TransactionFilters>>({});

    const fetchTransactions = useCallback(async (newFilters?: Partial<TransactionFilters>) => {
        setLoading(true);
        setError(null);
        setPage(1); // Reset page on new filter/refresh
        setHasMore(true);

        const currentFilters = newFilters || filters;

        try {
            const response = await getTransactions({
                limit: PAGE_SIZE,
                offset: 0,
                ...currentFilters
            });
            setTransactions(response.data);
            if (response.data.length < PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (e: any) {
            setError(e.message || 'Ocorreu um erro ao buscar as transações.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchMoreTransactions = useCallback(async () => {
        if (loading || loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            const response = await getTransactions({
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
                ...filters
            });

            if (response.data.length > 0) {
                setTransactions(prev => [...prev, ...response.data]);
                setPage(prev => prev + 1);
            }

            if (response.data.length < PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (e: any) {
            setError(e.message || 'Ocorreu um erro ao carregar mais transações.');
        } finally {
            setLoadingMore(false);
        }
    }, [loading, loadingMore, hasMore, page, filters]);

    const applyFilters = (newFilters: Partial<TransactionFilters>) => {
        setFilters(newFilters);
        fetchTransactions(newFilters);
    };

    return {
        transactions,
        loading,
        loadingMore,
        error,
        hasMore,
        fetchTransactions,
        fetchMoreTransactions,
        applyFilters,
    };
}; 