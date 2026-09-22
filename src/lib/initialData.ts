import {
  ContributionsResponse,
  ExpensesResponse,
  PerformancesResponse,
  VolunteersResponse,
} from './types';

export const initialContributions: ContributionsResponse = {
  success: true,
  contributions: [
    { name: 'Kasera Pariwar', amountMasked: '₹ ● ● ● ●' },
    { name: 'Laleet Kumar', amountMasked: '₹ ● ● ● ●' },
    { name: 'Mridula Kumar', amountMasked: '₹ ● ● ● ●' },
    { name: 'Malay Kanti Saha', amountMasked: '₹ ● ● ● ●' },
    { name: 'Jagdish Kashimpuria', amountMasked: '₹ ● ● ● ●' },
    { name: 'Asit Ghosh', amountMasked: '₹ ● ● ● ●' },
    { name: 'Manmohan Kariwala', amountMasked: '₹ ● ● ● ●' },
    { name: 'Sanjeev Agarwal', amountMasked: '₹ ● ● ● ●' },
    { name: 'Sushil Tewari', amountMasked: '₹ ● ● ● ●' },
  ],
  totalCount: 9,
  totalAmount: 63303,
};

export const initialExpenses: ExpensesResponse = {
  success: true,
  expenses: [
    {
      date: '',
      item: 'Light + Sound',
      category: 'Decoration',
      amount: 65000,
      paidTo: 'Yet to be',
      notes: '',
    },
    {
      date: '',
      item: 'Pratima/Murti',
      category: 'Idol',
      amount: 50350,
      paidTo: 'Yet to be',
      notes: '',
    },
  ],
  totalAmount: 115350,
};

export const initialPerformances: PerformancesResponse = {
  success: true,
  performances: [],
  totalCount: 0,
};

export const initialVolunteers: VolunteersResponse = {
  success: true,
  volunteers: [
    {
      name: 'Arunima Guha',
      role: 'Cultural & Stage Support',
      availability: 'Flexible / As Needed',
    },
    {
      name: 'Swati Rana',
      role: 'Cultural and Stage Support',
      availability: 'Saptami & Ashtami',
    },
    {
      name: 'Sanjukta Saha',
      role: 'Cultural & Stage Support',
      availability: 'Saptami & Ashtami',
    },
    {
      name: 'SUSHIL JAGNANI',
      role: 'General Help & Support',
      availability: 'All 5 Days (Sasthi to Dashami)',
    },
    {
      name: 'Aditya Rana',
      role: 'General Help & Support',
      availability: 'Flexible / As Needed',
    },
  ],
  totalCount: 5,
};