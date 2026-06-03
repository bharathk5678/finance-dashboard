import React, { createContext, useContext, useState, useEffect } from 'react';
import type { FinancialData, IncomeSource, CreditCardData, FixedExpense, EventCategory, EventExpense } from '../types';

interface FinanceContextType {
  data: FinancialData;
  addIncome: (income: IncomeSource) => void;
  removeIncome: (id: string) => void;
  addCard: (card: CreditCardData) => void;
  removeCard: (id: string) => void;
  addExpense: (expense: FixedExpense) => void;
  removeExpense: (id: string) => void;
  addEventCategory: (category: EventCategory) => void;
  removeEventCategory: (id: string) => void;
  addEventExpense: (categoryId: string, expense: EventExpense) => void;
  removeEventExpense: (categoryId: string, expenseId: string) => void;
  clearData: () => void;
}

const defaultData: FinancialData = {
  incomes: [],
  creditCards: [],
  expenses: [],
  eventCategories: []
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FinancialData>(() => {
    const saved = localStorage.getItem('financeData');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure eventCategories exists for backwards compatibility
      if (!parsed.eventCategories) {
        parsed.eventCategories = [];
      }
      return parsed;
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(data));
  }, [data]);

  const addIncome = (income: IncomeSource) => setData(prev => ({ ...prev, incomes: [...prev.incomes, income] }));
  const removeIncome = (id: string) => setData(prev => ({ ...prev, incomes: prev.incomes.filter(i => i.id !== id) }));
  
  const addCard = (card: CreditCardData) => setData(prev => ({ ...prev, creditCards: [...prev.creditCards, card] }));
  const removeCard = (id: string) => setData(prev => ({ ...prev, creditCards: prev.creditCards.filter(c => c.id !== id) }));
  
  const addExpense = (expense: FixedExpense) => setData(prev => ({ ...prev, expenses: [...prev.expenses, expense] }));
  const removeExpense = (id: string) => setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));

  const addEventCategory = (category: EventCategory) => setData(prev => ({
    ...prev,
    eventCategories: [...prev.eventCategories, category]
  }));

  const removeEventCategory = (id: string) => setData(prev => ({
    ...prev,
    eventCategories: prev.eventCategories.filter(c => c.id !== id)
  }));

  const addEventExpense = (categoryId: string, expense: EventExpense) => setData(prev => ({
    ...prev,
    eventCategories: prev.eventCategories.map(cat =>
      cat.id === categoryId ? { ...cat, expenses: [...cat.expenses, expense] } : cat
    )
  }));

  const removeEventExpense = (categoryId: string, expenseId: string) => setData(prev => ({
    ...prev,
    eventCategories: prev.eventCategories.map(cat =>
      cat.id === categoryId ? { ...cat, expenses: cat.expenses.filter(e => e.id !== expenseId) } : cat
    )
  }));

  const clearData = () => setData(defaultData);

  return (
    <FinanceContext.Provider value={{
      data, addIncome, removeIncome, addCard, removeCard, addExpense, removeExpense,
      addEventCategory, removeEventCategory, addEventExpense, removeEventExpense, clearData
    }}>
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
