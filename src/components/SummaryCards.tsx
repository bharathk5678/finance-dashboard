import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, CreditCard, TrendingDown, Activity } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { data } = useFinance();

  const totalIncome = data.incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCardPayments = data.creditCards.reduce((acc, curr) => acc + curr.monthlyPayment, 0);
  const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebt = data.creditCards.reduce((acc, curr) => acc + curr.balance, 0);
  
  const overallCashflow = totalIncome - (totalCardPayments + totalExpenses);
  
  const monthlyInterest = data.creditCards.reduce((acc, card) => acc + (card.balance * (card.apr / 100) / 12), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="summary-grid">
      <div className="glass-panel">
        <div className="card-header">
          <span className="card-label">Total Monthly Income</span>
          <Wallet size={20} color="#10B981" />
        </div>
        <div className="card-value text-gradient">{formatCurrency(totalIncome)}</div>
      </div>

      <div className="glass-panel">
        <div className="card-header">
          <span className="card-label">Total Monthly Expenses</span>
          <TrendingDown size={20} color="#F59E0B" />
        </div>
        <div className="card-value text-gradient">{formatCurrency(totalExpenses + totalCardPayments)}</div>
        <div className="card-sub">Includes card payments</div>
      </div>

      <div className="glass-panel">
        <div className="card-header">
          <span className="card-label">Overall Cashflow</span>
          <Activity size={20} color={overallCashflow >= 0 ? "#10B981" : "#EF4444"} />
        </div>
        <div className={`card-value ${overallCashflow >= 0 ? 'text-success' : 'text-danger'}`}>
          {overallCashflow >= 0 ? '+' : ''}{formatCurrency(overallCashflow)}
        </div>
      </div>

      <div className="glass-panel">
        <div className="card-header">
          <span className="card-label">Total Credit Card Debt</span>
          <CreditCard size={20} color="#EF4444" />
        </div>
        <div className="card-value text-danger">{formatCurrency(totalDebt)}</div>
        <div className="card-sub">Est. Interest: {formatCurrency(monthlyInterest)}/mo</div>
      </div>
    </div>
  );
};
