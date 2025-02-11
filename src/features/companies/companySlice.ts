import { createSlice } from '@reduxjs/toolkit';

export interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  tax: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

export interface HR {
  id: number;
  position: string;
  company: Company;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: number;
  };
}

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  hr: HR | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  hr: null,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {},
});

export default companySlice.reducer;
