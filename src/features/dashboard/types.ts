export interface DashboardData {
  total_transactions: number;
  total_amount: number;
  total_volume: number;
  total_customers: number;
  total_companies: number;
  period_start: string;
  period_end: string;
}

export interface DashboardFilters {
  start_date?: string;
  end_date?: string;
  company_id?: string;
  payment_method?: string[];
  status?: string[];
}

export interface AdditionalInfo {
  total_clientes: number;
  total_companies: number;
  new_customers_month: number;
  active_customers: number;
  total_revenue_month: number;
  average_ticket: number;
}

export interface ChartData {
  date: string;
  value: number;
  amount: number;
  count: number;
} 