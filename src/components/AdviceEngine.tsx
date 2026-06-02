import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { AdviceLog } from '../types';

export const AdviceEngine: React.FC = () => {
  const { data } = useFinance();

  const advice: AdviceLog[] = useMemo(() => {
    const logs: AdviceLog[] = [];

    const totalIncome = data.incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCardPayments = data.creditCards.reduce((acc, curr) => acc + curr.monthlyPayment, 0);
    const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const overallCashflow = totalIncome - (totalCardPayments + totalExpenses);

    if (totalIncome === 0 && (totalExpenses > 0 || data.creditCards.length > 0)) {
      logs.push({
        id: 'no-income',
        type: 'warning',
        title: 'No Income Recorded',
        message: 'You have expenses but no income. Please add your income sources to get an accurate cashflow analysis.'
      });
      return logs; // Stop here if no income
    }

    if (totalIncome === 0) {
        logs.push({
            id: 'empty',
            type: 'info',
            title: 'Welcome!',
            message: 'Start by adding your income, credit cards, and fixed expenses above to receive smart financial advice.'
        });
        return logs;
    }

    // Cashflow Advice
    if (overallCashflow < 0) {
      logs.push({
        id: 'negative-cashflow',
        type: 'danger',
        title: 'Negative Cash Flow Alert',
        message: `Your expenses exceed your income by $${Math.abs(overallCashflow).toFixed(2)}. You are accumulating debt. Consider cutting non-essential fixed expenses immediately.`
      });
    } else if (overallCashflow > 0 && overallCashflow < totalIncome * 0.1) {
      logs.push({
        id: 'low-cashflow',
        type: 'warning',
        title: 'Tight Margins',
        message: 'Your cash flow is positive but tight (less than 10% of income). Try to increase your savings buffer.'
      });
    } else if (overallCashflow >= totalIncome * 0.2) {
      logs.push({
        id: 'good-cashflow',
        type: 'success',
        title: 'Healthy Cash Flow',
        message: 'Great job! You have a strong positive cash flow. Consider investing the surplus or accelerating debt payoff.'
      });
    }

    // Debt Advice
    if (data.creditCards.length > 0) {
      const cards = [...data.creditCards];
      const highestAprCard = cards.reduce((prev, current) => (prev.apr > current.apr) ? prev : current);
      const lowestBalanceCard = cards.reduce((prev, current) => (prev.balance < current.balance) ? prev : current);

      if (cards.length > 1) {
        logs.push({
          id: 'avalanche-method',
          type: 'info',
          title: 'Smart Payoff Strategy (Avalanche)',
          message: `Focus extra payments on your ${highestAprCard.name} card (${highestAprCard.apr}% APR) to minimize total interest paid. Pay the minimums on the rest.`
        });
        
        logs.push({
          id: 'snowball-method',
          type: 'info',
          title: 'Motivation Strategy (Snowball)',
          message: `Alternatively, pay off ${lowestBalanceCard.name} first ($${lowestBalanceCard.balance} balance) for a quick psychological win.`
        });
      }

      if (highestAprCard.apr > 20) {
        logs.push({
          id: 'high-apr',
          type: 'danger',
          title: 'High Interest Warning',
          message: `Your ${highestAprCard.name} has a very high APR of ${highestAprCard.apr}%. This debt is highly toxic. Prioritize clearing this balance or look into balance transfer cards.`
        });
      }
    }

    return logs;
  }, [data]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-success mt-1 flex-shrink-0" size={20} />;
      case 'warning': return <AlertTriangle className="text-warning mt-1 flex-shrink-0" size={20} />;
      case 'danger': return <AlertTriangle className="text-danger mt-1 flex-shrink-0" size={20} />;
      case 'info':
      default: return <Lightbulb className="text-primary mt-1 flex-shrink-0" size={20} />;
    }
  };

  const getBorderClass = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-4 border-l-success';
      case 'warning': return 'border-l-4 border-l-warning';
      case 'danger': return 'border-l-4 border-l-danger';
      case 'info':
      default: return 'border-l-4 border-l-primary';
    }
  };

  return (
    <div className="glass-panel p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[rgba(99,102,241,0.2)] rounded-lg text-primary">
          <Lightbulb size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gradient">Smart Advice Engine</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advice.map((log) => (
          <div key={log.id} className={`flex gap-4 p-4 bg-[rgba(0,0,0,0.2)] rounded-lg ${getBorderClass(log.type)}`}>
            {getIcon(log.type)}
            <div>
              <h4 className="font-semibold text-primary-text mb-1">{log.title}</h4>
              <p className="text-sm text-secondary leading-relaxed">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
