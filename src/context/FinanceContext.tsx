import React, { createContext, useContext, useState, useEffect } from 'react';
import { FinancialData, IncomeSource, CreditCard, FixedExpense } from '../types';

interface FinanceContextType {
  data: FinancialData;
  addIncome: (income: IncomeSource) => void;
  removeIncome: (id: string) => void;
  addCard: (card: CreditCard) => void;
  removeCard: (id: string) => void;
  addExpense: (expense: FixedExpense) => void;
  removeExpense: (id: string) => void;
  clearData: () => void;
}

const defaultData: FinancialData = {
  incomes: [],
  creditCards: [],
  expenses: []
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FinancialData>(() => {
    const saved = localStorage.getItem('financeData');
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(data));
  }, [data]);

  const addIncome = (income: IncomeSource) => setData(prev => ({ ...prev, incomes: [...prev.incomes, income] }));
  const removeIncome = (id: string) => setData(prev => ({ ...prev, incomes: prev.incomes.filter(i => i.id !== id) }));
  
  const addCard = (card: CreditCard) => setData(prev => ({ ...prev, creditCards: [...prev.creditCards, card] }));
  const removeCard = (id: string) => setData(prev => ({ ...prev, creditCards: prev.creditCards.filter(c => c.id !== id) }));
  
  const addExpense = (expense: FixedExpense) => setData(prev => ({ ...prev, expenses: [...prev.expenses, expense] }));
  const removeExpense = (id: string) => setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));

  const clearData = () => setData(defaultData);

  return (
    <FinanceContext.Provider value={{ data, addIncome, removeIncome, addCard, removeCard, addExpense, removeExpense, clearData }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
