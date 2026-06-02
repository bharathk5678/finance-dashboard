import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, CreditCard, TrendingDown, DollarSign, Activity } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { data } = useFinance();

  const totalIncome = data.incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCardPayments = data.creditCards.reduce((acc, curr) => acc + curr.monthlyPayment, 0);
  const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebt = data.creditCards.reduce((acc, curr) => acc + curr.balance, 0);
  
  const overallCashflow = totalIncome - (totalCardPayments + totalExpenses);
  
  // Calculate approximate monthly interest (assuming APR is annual, so /12)
  const monthlyInterest = data.creditCards.reduce((acc, card) => acc + (card.balance * (card.apr / 100) / 12), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="grid grid-cols-4 mb-8">
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-secondary text-sm font-medium">Total Monthly Income</h3>
          <Wallet size={20} className="text-success" />
        </div>
        <div className="text-2xl font-bold text-gradient">{formatCurrency(totalIncome)}</div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-secondary text-sm font-medium">Total Monthly Expenses</h3>
          <TrendingDown size={20} className="text-warning" />
        </div>
        <div className="text-2xl font-bold text-gradient">{formatCurrency(totalExpenses + totalCardPayments)}</div>
        <div className="text-xs text-muted mt-2">Includes card payments</div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-secondary text-sm font-medium">Overall Cashflow</h3>
          <Activity size={20} className={overallCashflow >= 0 ? "text-success" : "text-danger"} />
        </div>
        <div className={`text-2xl font-bold ${overallCashflow >= 0 ? 'text-success' : 'text-danger'}`}>
          {overallCashflow >= 0 ? '+' : ''}{formatCurrency(overallCashflow)}
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-secondary text-sm font-medium">Total Credit Card Debt</h3>
          <CreditCard size={20} className="text-danger" />
        </div>
        <div className="text-2xl font-bold text-danger">{formatCurrency(totalDebt)}</div>
        <div className="text-xs text-muted mt-2">Est. Interest: {formatCurrency(monthlyInterest)}/mo</div>
      </div>
    </div>
  );
};
