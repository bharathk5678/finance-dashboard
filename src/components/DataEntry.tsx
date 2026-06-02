import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2 } from 'lucide-react';

export const DataEntry: React.FC = () => {
  const { data, addIncome, removeIncome, addCard, removeCard, addExpense, removeExpense } = useFinance();

  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  const [cardName, setCardName] = useState('');
  const [cardBalance, setCardBalance] = useState('');
  const [cardApr, setCardApr] = useState('');
  const [cardPayment, setCardPayment] = useState('');

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeName || !incomeAmount) return;
    addIncome({ id: Date.now().toString(), name: incomeName, amount: Number(incomeAmount) });
    setIncomeName('');
    setIncomeAmount('');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardBalance || !cardApr || !cardPayment) return;
    addCard({
      id: Date.now().toString(),
      name: cardName,
      balance: Number(cardBalance),
      apr: Number(cardApr),
      monthlyPayment: Number(cardPayment)
    });
    setCardName('');
    setCardBalance('');
    setCardApr('');
    setCardPayment('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;
    addExpense({ id: Date.now().toString(), name: expenseName, amount: Number(expenseAmount) });
    setExpenseName('');
    setExpenseAmount('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="data-entry-grid">
      {/* Income Section */}
      <div className="glass-panel">
        <h3 className="section-title text-gradient">💰 Income Sources</h3>
        <form onSubmit={handleAddIncome} style={{ marginBottom: '24px' }}>
          <div className="input-group">
            <label className="input-label">Source Name</label>
            <input type="text" className="input-field" value={incomeName} onChange={e => setIncomeName(e.target.value)} placeholder="e.g. Salary" />
          </div>
          <div className="input-group">
            <label className="input-label">Monthly Amount ($)</label>
            <input type="number" className="input-field" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} placeholder="0.00" step="0.01" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <Plus size={16} /> Add Income
          </button>
        </form>
        <div className="list-container">
          {data.incomes.map(income => (
            <div key={income.id} className="list-item">
              <div>
                <div style={{ fontWeight: 500 }}>{income.name}</div>
                <div className="text-success" style={{ fontSize: '0.875rem' }}>{formatCurrency(income.amount)}/mo</div>
              </div>
              <button onClick={() => removeIncome(income.id)} className="delete-btn">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Cards Section */}
      <div className="glass-panel">
        <h3 className="section-title text-gradient">💳 Credit Cards</h3>
        <form onSubmit={handleAddCard} style={{ marginBottom: '24px' }}>
          <div className="input-group">
            <label className="input-label">Card Name</label>
            <input type="text" className="input-field" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="e.g. Chase Sapphire" />
          </div>
          <div className="card-form-row">
            <div className="input-group">
              <label className="input-label">Balance ($)</label>
              <input type="number" className="input-field" value={cardBalance} onChange={e => setCardBalance(e.target.value)} placeholder="0.00" step="0.01" />
            </div>
            <div className="input-group">
              <label className="input-label">APR (%)</label>
              <input type="number" className="input-field" value={cardApr} onChange={e => setCardApr(e.target.value)} placeholder="0.0" step="0.01" />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Monthly Payment ($)</label>
            <input type="number" className="input-field" value={cardPayment} onChange={e => setCardPayment(e.target.value)} placeholder="0.00" step="0.01" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <Plus size={16} /> Add Card
          </button>
        </form>
        <div className="list-container">
          {data.creditCards.map(card => (
            <div key={card.id} className="list-item">
              <div>
                <div style={{ fontWeight: 500 }}>
                  {card.name} <span className="text-muted-color" style={{ fontSize: '0.75rem' }}>({card.apr}% APR)</span>
                </div>
                <div className="text-danger" style={{ fontSize: '0.875rem' }}>{formatCurrency(card.balance)}</div>
                <div className="text-muted-color" style={{ fontSize: '0.75rem' }}>Paying {formatCurrency(card.monthlyPayment)}/mo</div>
              </div>
              <button onClick={() => removeCard(card.id)} className="delete-btn">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Section */}
      <div className="glass-panel">
        <h3 className="section-title text-gradient">📋 Fixed Expenses</h3>
        <form onSubmit={handleAddExpense} style={{ marginBottom: '24px' }}>
          <div className="input-group">
            <label className="input-label">Expense Name</label>
            <input type="text" className="input-field" value={expenseName} onChange={e => setExpenseName(e.target.value)} placeholder="e.g. Rent" />
          </div>
          <div className="input-group">
            <label className="input-label">Monthly Amount ($)</label>
            <input type="number" className="input-field" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="0.00" step="0.01" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <Plus size={16} /> Add Expense
          </button>
        </form>
        <div className="list-container">
          {data.expenses.map(expense => (
            <div key={expense.id} className="list-item">
              <div>
                <div style={{ fontWeight: 500 }}>{expense.name}</div>
                <div className="text-warning" style={{ fontSize: '0.875rem' }}>{formatCurrency(expense.amount)}/mo</div>
              </div>
              <button onClick={() => removeExpense(expense.id)} className="delete-btn">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
