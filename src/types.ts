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

export interface EventExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'past' | 'current' | 'upcoming';
}

export interface EventCategory {
  id: string;
  name: string;
  emoji: string;
  budget: number;
  expenses: EventExpense[];
  createdAt: string;
}

export interface FinancialData {
  incomes: IncomeSource[];
  creditCards: CreditCardData[];
  expenses: FixedExpense[];
  eventCategories: EventCategory[];
}

export interface AdviceLog {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}
