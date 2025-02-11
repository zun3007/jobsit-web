import { createSlice } from '@reduxjs/toolkit';

export interface University {
  id: number;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  type: {
    id: number;
    name: string;
  };
  majors: Array<{
    id: number;
    name: string;
  }>;
}

export interface UniversityDemand {
  id: number;
  university: University;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

interface UniversityState {
  universities: University[];
  selectedUniversity: University | null;
  demands: UniversityDemand[];
  filters: {
    name?: string;
    universityTypeIds?: number[];
    majorIds?: number[];
    page: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UniversityState = {
  universities: [],
  selectedUniversity: null,
  demands: [],
  filters: {
    page: 0,
    limit: 10,
  },
  loading: false,
  error: null,
};

const universitySlice = createSlice({
  name: 'universities',
  initialState,
  reducers: {},
});

export default universitySlice.reducer;
