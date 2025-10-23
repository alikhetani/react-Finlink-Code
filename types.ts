export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  TRANSFER = 'Transfer',
  PAYMENT = 'Payment',
  LOAN = 'Loan Disbursement',
  FOREX = 'Forex Conversion',
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export interface Bank {
  id:string;
  name: string;
  logoUrl: string;
  country: string;
}

export interface WalletCurrency {
  code: 'INR' | 'USD' | 'EUR' | 'GBP';
  name: string;
  balance: number;
  symbol: string;
}

export interface Loan {
    id: string;
    amount: number;
    purpose: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    date: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    joinDate: string;
}

export interface KycRequest {
    id: string;
    userId: string;
    userName: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submissionDate: string;
}

export interface LoanRequest extends Loan {
    userId: string;
    userName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number; 
  partnerBank: Bank | null;
  wallet: WalletCurrency[];
  loans: Loan[];
  notifications: Notification[];
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'qum';
    timestamp: string;
}