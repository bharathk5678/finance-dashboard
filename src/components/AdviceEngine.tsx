import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import type { AdviceLog } from '../types';

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
      return logs;
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
          title: '🧠 Smart Payoff Strategy (Avalanche)',
          message: `Focus extra payments on your "${highestAprCard.name}" card (${highestAprCard.apr}% APR) to minimize total interest paid. Pay the minimums on the rest.`
        });
        
        logs.push({
          id: 'snowball-method',
          type: 'info',
          title: '🎯 Motivation Strategy (Snowball)',
          message: `Alternatively, pay off "${lowestBalanceCard.name}" first ($${lowestBalanceCard.balance.toLocaleString()} balance) for a quick psychological win.`
        });
      }

      if (highestAprCard.apr > 20) {
        logs.push({
          id: 'high-apr',
          type: 'danger',
          title: '🔥 High Interest Warning',
          message: `Your "${highestAprCard.name}" has a very high APR of ${highestAprCard.apr}%. This debt is highly toxic. Prioritize clearing this balance or look into balance transfer cards.`
        });
      }

      // Monthly interest cost
      const monthlyInterest = data.creditCards.reduce((acc, card) => acc + (card.balance * (card.apr / 100) / 12), 0);
      if (monthlyInterest > 50) {
        logs.push({
          id: 'interest-cost',
          type: 'warning',
          title: '💸 Interest Eating Your Money',
          message: `You're paying approximately $${monthlyInterest.toFixed(2)} per month just in interest. That's $${(monthlyInterest * 12).toFixed(2)} per year going to banks instead of your pocket.`
        });
      }
    }

    return logs;
  }, [data]);

  const getIcon = (type: string) => {
    const style: React.CSSProperties = { marginTop: '2px', flexShrink: 0 };
    switch (type) {
      case 'success': return <CheckCircle color="#10B981" size={20} style={style} />;
      case 'warning': return <AlertTriangle color="#F59E0B" size={20} style={style} />;
      case 'danger': return <AlertTriangle color="#EF4444" size={20} style={style} />;
      case 'info':
      default: return <Lightbulb color="#6366F1" size={20} style={style} />;
    }
  };

  const getBorderClass = (type: string) => {
    switch (type) {
      case 'success': return 'border-success';
      case 'warning': return 'border-warning';
      case 'danger': return 'border-danger';
      case 'info':
      default: return 'border-info';
    }
  };

  return (
    <div className="glass-panel advice-section">
      <div className="advice-header">
        <div className="advice-icon-wrap">
          <Lightbulb size={24} />
        </div>
        <h2 className="advice-title text-gradient">Smart Advice Engine</h2>
      </div>

      <div className="advice-grid">
        {advice.map((log) => (
          <div key={log.id} className={`advice-card ${getBorderClass(log.type)}`}>
            {getIcon(log.type)}
            <div>
              <h4 className="advice-card-title">{log.title}</h4>
              <p className="advice-card-message">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
