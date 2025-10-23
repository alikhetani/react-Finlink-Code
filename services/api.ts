import { Transaction, Bank, User, TransactionType, WalletCurrency, Loan, Notification, AdminUser, KycRequest, LoanRequest } from '../types';

const MOCK_BANKS: Bank[] = [
  { id: 'bank-1', name: 'Chase Bank', logoUrl: 'https://picsum.photos/seed/bank1/48/48', country: 'USA' },
  { id: 'bank-2', name: 'Revolut', logoUrl: 'https://picsum.photos/seed/bank2/48/48', country: 'UK' },
  { id: 'bank-3', name: 'Wise', logoUrl: 'https://picsum.photos/seed/bank3/48/48', country: 'EU' },
  { id: 'bank-4', name: 'Citibank', logoUrl: 'https://picsum.photos/seed/bank4/48/48', country: 'Singapore' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-1', date: '2024-07-29', description: 'Netflix Subscription', amount: -15.99, type: TransactionType.PAYMENT },
  { id: 't-2', date: '2024-07-28', description: 'Salary Deposit', amount: 3500.00, type: TransactionType.DEPOSIT },
  { id: 't-3', date: '2024-07-28', description: 'Grocery Shopping', amount: -85.50, type: TransactionType.PAYMENT },
  { id: 't-4', date: '2024-07-27', description: 'ATM Withdrawal', amount: -100.00, type: TransactionType.WITHDRAWAL },
  { id: 't-5', date: '2024-07-26', description: 'Transfer to John Doe', amount: -250.00, type: TransactionType.TRANSFER },
  { id: 't-6', date: '2024-07-25', description: 'Loan Disbursement', amount: 10000.00, type: TransactionType.LOAN },
  { id: 't-7', date: '2024-07-24', description: 'Online Course Purchase', amount: -199.99, type: TransactionType.PAYMENT },
  { id: 't-8', date: '2024-07-23', description: 'Refund from Amazon', amount: 45.00, type: TransactionType.DEPOSIT },
  { id: 't-9', date: '2024-07-22', description: 'USD to EUR Conversion', amount: -500.00, type: TransactionType.FOREX },
];

const MOCK_WALLET: WalletCurrency[] = [
    { code: 'USD', name: 'US Dollar', balance: 13498.02, symbol: '$' },
    { code: 'EUR', name: 'Euro', balance: 5230.50, symbol: '€' },
    { code: 'GBP', name: 'British Pound', balance: 1200.00, symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', balance: 85000.00, symbol: '₹' },
];

const MOCK_LOANS: Loan[] = [
    { id: 'loan-1', amount: 10000, purpose: 'Home Renovation', status: 'Approved', date: '2024-07-20' },
    { id: 'loan-2', amount: 5000, purpose: 'Debt Consolidation', status: 'Pending', date: '2024-07-28' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', title: 'Withdrawal Successful', message: 'Your withdrawal of $100.00 has been processed.', date: '2024-07-27', read: false },
    { id: 'notif-2', title: 'Loan Approved!', message: 'Congratulations! Your loan for $10,000 has been approved.', date: '2024-07-20', read: true },
];

const MOCK_USER: User = {
    id: 'user-123',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    balance: 13498.02,
    partnerBank: MOCK_BANKS[0],
    wallet: MOCK_WALLET,
    loans: MOCK_LOANS,
    notifications: MOCK_NOTIFICATIONS,
};

// Admin Panel Mock Data
const MOCK_ADMIN_USERS: AdminUser[] = [
    { id: 'user-123', name: 'Alex Johnson', email: 'alex.j@example.com', joinDate: '2024-01-15' },
    { id: 'user-456', name: 'Jane Doe', email: 'jane.d@example.com', joinDate: '2024-03-22' },
    { id: 'user-789', name: 'Sam Wilson', email: 'sam.w@example.com', joinDate: '2024-05-10' },
];

let MOCK_KYC_REQUESTS: KycRequest[] = [
    { id: 'kyc-1', userId: 'user-456', userName: 'Jane Doe', status: 'Pending', submissionDate: '2024-07-29' },
    { id: 'kyc-2', userId: 'user-789', userName: 'Sam Wilson', status: 'Pending', submissionDate: '2024-07-28' },
];

let MOCK_LOAN_REQUESTS: LoanRequest[] = [
     { id: 'loan-2', userId: 'user-123', userName: 'Alex Johnson', amount: 5000, purpose: 'Debt Consolidation', status: 'Pending', date: '2024-07-28' },
     { id: 'loan-3', userId: 'user-456', userName: 'Jane Doe', amount: 15000, purpose: 'Car Purchase', status: 'Pending', date: '2024-07-27' },
];


const DUMMY_QUM_API = {
  "open_account": "Sure! To open a foreign bank account, please complete your KYC first in the FinLink dashboard. You can find the KYC section in the main menu.",
  "loan": "Your loan application is currently under review. We’ll notify you via push notification and email as soon as it's approved. You can check the Loan page for detailed status.",
  "withdraw": "Withdrawals to your linked Indian account are typically processed within 24 business hours after verification. You can initiate a withdrawal from the Dashboard.",
  "convert": "Currency conversion is done at the real-time forex rate, which you can view in the Wallet section. A small conversion fee applies.",
  "history": "You can view your full transaction history by navigating to the 'Transactions' page from the main menu. You can also filter by date and type.",
  "kyc": "To complete KYC, please go to the KYC page and upload a clear picture of your Aadhaar/Passport and PAN card. You will also need to complete a quick facial verification step.",
  "human": "I'm connecting you with a human support representative now. Please wait a moment.",
  "default": "I didn’t quite catch that. Could you please rephrase? You can also try one of the suggestions below or ask to speak with a human support rep."
  "Thanks": "Thank's for asking qum"
};


const simulateDelay = <T,>(data: T, delay = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

export const api = {
  login: (email: string, pass: string): Promise<{ user: User, token: string }> => {
    console.log(`Simulating login for ${email} with password ${pass}`);
    return simulateDelay({ user: MOCK_USER, token: 'fake-jwt-token' });
  },
  getDashboardData: (): Promise<{ user: User; recentTransactions: Transaction[] }> => {
    return simulateDelay({
      user: MOCK_USER,
      recentTransactions: MOCK_TRANSACTIONS.slice(0, 5),
    });
  },
  getAllTransactions: (): Promise<Transaction[]> => {
    return simulateDelay(MOCK_TRANSACTIONS);
  },
  getPartnerBanks: (): Promise<Bank[]> => {
    return simulateDelay(MOCK_BANKS);
  },
  uploadKycDocuments: (files: FileList): Promise<{ success: boolean; message: string }> => {
    console.log(`Simulating upload for ${files.length} documents.`);
    return simulateDelay({ success: true, message: 'KYC documents uploaded successfully! Your request is pending review.' });
  },
  applyForLoan: (amount: number, purpose: string): Promise<{ success: boolean; message: string, newLoan: Loan }> => {
    console.log(`Simulating loan application for ${amount} for purpose: ${purpose}`);
    const newLoan: Loan = {
        id: `loan-${Date.now()}`,
        amount,
        purpose,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
    };
    MOCK_USER.loans.push(newLoan);
    MOCK_LOAN_REQUESTS.push({ ...newLoan, userId: MOCK_USER.id, userName: MOCK_USER.name });
    return simulateDelay({ success: true, message: `Loan application for $${amount.toFixed(2)} submitted.`, newLoan });
  },
  makeDeposit: (amount: number): Promise<{ success: boolean; newBalance: number }> => {
    MOCK_USER.balance += amount;
    return simulateDelay({ success: true, newBalance: MOCK_USER.balance });
  },
  makeWithdrawal: (amount: number): Promise<{ success: boolean; newBalance: number }> => {
    if (MOCK_USER.balance >= amount) {
        MOCK_USER.balance -= amount;
        return simulateDelay({ success: true, newBalance: MOCK_USER.balance });
    }
    return Promise.reject({ success: false, message: 'Insufficient funds.'});
  },
  getWalletData: (): Promise<WalletCurrency[]> => {
    return simulateDelay(MOCK_WALLET);
  },
  getQumResponse: (message: string): Promise<{ text: string }> => {
    const lowerCaseMessage = message.toLowerCase();
    let responseText = DUMMY_QUM_API.default;

    if (lowerCaseMessage.includes('open') && lowerCaseMessage.includes('account')) {
        responseText = DUMMY_QUM_API.open_account;
    } else if (lowerCaseMessage.includes('loan')) {
        responseText = DUMMY_QUM_API.loan;
    } else if (lowerCaseMessage.includes('withdraw')) {
        responseText = DUMMY_QUM_API.withdraw;
    } else if (lowerCaseMessage.includes('convert') || lowerCaseMessage.includes('currency')) {
        responseText = DUMMY_QUM_API.convert;
    } else if (lowerCaseMessage.includes('transaction') || lowerCaseMessage.includes('history')) {
        responseText = DUMMY_QUM_API.history;
    } else if (lowerCaseMessage.includes('kyc')) {
        responseText = DUMMY_QUM_API.kyc;
    } else if (lowerCaseMessage.includes('human') || lowerCaseMessage.includes('agent') || lowerCaseMessage.includes('support')) {
        responseText = DUMMY_QUM_API.human;
    }
    
    return simulateDelay({ text: responseText }, 1500);
  },
  getUserLoans: (): Promise<Loan[]> => {
    return simulateDelay(MOCK_USER.loans);
  },
  getUserNotifications: (): Promise<Notification[]> => {
      return simulateDelay(MOCK_USER.notifications);
  },
  markNotificationsAsRead: (): Promise<{success: boolean}> => {
      MOCK_USER.notifications.forEach(n => n.read = true);
      return simulateDelay({ success: true });
  },
  updateUserProfile: (name: string, email: string): Promise<{user: User}> => {
      MOCK_USER.name = name;
      MOCK_USER.email = email;
      return simulateDelay({ user: MOCK_USER });
  },

  // Admin API
  getAdminDashboardData: (): Promise<{users: AdminUser[], kycRequests: KycRequest[], loanRequests: LoanRequest[]}> => {
      return simulateDelay({
          users: MOCK_ADMIN_USERS,
          kycRequests: MOCK_KYC_REQUESTS.filter(r => r.status === 'Pending'),
          loanRequests: MOCK_LOAN_REQUESTS.filter(r => r.status === 'Pending'),
      });
  },
  updateKycRequest: (id: string, status: 'Approved' | 'Rejected'): Promise<{success: boolean}> => {
      MOCK_KYC_REQUESTS = MOCK_KYC_REQUESTS.map(r => r.id === id ? {...r, status} : r);
      return simulateDelay({ success: true });
  },
  updateLoanRequest: (id: string, status: 'Approved' | 'Rejected'): Promise<{success: boolean}> => {
      MOCK_LOAN_REQUESTS = MOCK_LOAN_REQUESTS.map(r => r.id === id ? {...r, status} : r);
      // Also update the user's loan record
      const userLoan = MOCK_USER.loans.find(l => l.id === id);
      if (userLoan) {
          userLoan.status = status;
      }
      return simulateDelay({ success: true });
  },
  broadcastNotification: (title: string, message: string): Promise<{success: boolean}> => {
      const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          title,
          message,
          date: new Date().toISOString().split('T')[0],
          read: false
      };
      MOCK_USER.notifications.unshift(newNotif); // Add to the start
      return simulateDelay({ success: true });
  }
};