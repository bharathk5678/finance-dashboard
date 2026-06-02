export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
}

export interface CreditCardData {
  id: string;
  name: string;
  balance: number;
  apr: number;
  monthlyPayment: number;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

export interface FinancialData {
  incomes: IncomeSource[];
  creditCards: CreditCardData[];
  expenses: FixedExpense[];
}

export interface AdviceLog {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}
