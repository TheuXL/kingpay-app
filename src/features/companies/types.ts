export interface Company {
  id: string;
  name: string;
  taxid: string;
  status: 'approved' | 'pending' | 'denied' | 'blocked';
  logo_url?: string;
}

export interface CompanyDetails extends Company {
  // Assuming there are other properties here
}
