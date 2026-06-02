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
    <div className="grid grid-cols-3 gap-6">
      {/* Income Section */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-4 text-gradient">Income Sources</h3>
        <form onSubmit={handleAddIncome} className="mb-6">
          <div className="input-group">
            <label className="input-label">Source Name</label>
            <input type="text" className="input-field" value={incomeName} onChange={e => setIncomeName(e.target.value)} placeholder="e.g. Salary" />
          </div>
          <div className="input-group">
            <label className="input-label">Monthly Amount ($)</label>
            <input type="number" className="input-field" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} placeholder="0.00" />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">
            <Plus size={16} /> Add Income
          </button>
        </form>
        <div className="flex flex-col gap-3">
          {data.incomes.map(income => (
            <div key={income.id} className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[rgba(255,255,255,0.05)]">
              <div>
                <div className="font-medium">{income.name}</div>
                <div className="text-success text-sm">{formatCurrency(income.amount)}/mo</div>
              </div>
              <button onClick={() => removeIncome(income.id)} className="text-danger hover:text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Cards Section */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-4 text-gradient">Credit Cards</h3>
        <form onSubmit={handleAddCard} className="mb-6">
          <div className="input-group">
            <label className="input-label">Card Name</label>
            <input type="text" className="input-field" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="e.g. Chase Sapphire" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Balance ($)</label>
              <input type="number" className="input-field" value={cardBalance} onChange={e => setCardBalance(e.target.value)} placeholder="0.00" />
            </div>
            <div className="input-group">
              <label className="input-label">APR (%)</label>
              <input type="number" className="input-field" value={cardApr} onChange={e => setCardApr(e.target.value)} placeholder="0.0" />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Monthly Payment ($)</label>
            <input type="number" className="input-field" value={cardPayment} onChange={e => setCardPayment(e.target.value)} placeholder="0.00" />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">
            <Plus size={16} /> Add Card
          </button>
        </form>
        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
          {data.creditCards.map(card => (
            <div key={card.id} className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[rgba(255,255,255,0.05)]">
              <div>
                <div className="font-medium">{card.name} <span className="text-xs text-muted">({card.apr}%)</span></div>
                <div className="text-danger text-sm">{formatCurrency(card.balance)}</div>
              </div>
              <button onClick={() => removeCard(card.id)} className="text-danger hover:text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Section */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-4 text-gradient">Fixed Expenses</h3>
        <form onSubmit={handleAddExpense} className="mb-6">
          <div className="input-group">
            <label className="input-label">Expense Name</label>
            <input type="text" className="input-field" value={expenseName} onChange={e => setExpenseName(e.target.value)} placeholder="e.g. Rent" />
          </div>
          <div className="input-group">
            <label className="input-label">Monthly Amount ($)</label>
            <input type="number" className="input-field" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="0.00" />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">
            <Plus size={16} /> Add Expense
          </button>
        </form>
        <div className="flex flex-col gap-3">
          {data.expenses.map(expense => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg border border-[rgba(255,255,255,0.05)]">
              <div>
                <div className="font-medium">{expense.name}</div>
                <div className="text-warning text-sm">{formatCurrency(expense.amount)}/mo</div>
              </div>
              <button onClick={() => removeExpense(expense.id)} className="text-danger hover:text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
