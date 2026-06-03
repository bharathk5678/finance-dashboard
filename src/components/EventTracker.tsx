import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FolderPlus, Plus, Trash2, ChevronDown, MapPin } from 'lucide-react';

const EMOJI_OPTIONS = [
  '✈️', '🏖️', '🎉', '🎂', '🏕️', '🚗', '🎄', '🎓',
  '💒', '🎵', '🏠', '🍽️', '🛍️', '⚽', '🏥', '📚'
];

export const EventTracker: React.FC = () => {
  const { data, addEventCategory, removeEventCategory, addEventExpense, removeEventExpense } = useFinance();

  // Create category form state
  const [catName, setCatName] = useState('');
  const [catEmoji, setCatEmoji] = useState('✈️');
  const [catBudget, setCatBudget] = useState('');

  // Track which cards are expanded
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Per-category add-expense form state (keyed by category id)
  const [expForms, setExpForms] = useState<Record<string, { desc: string; amount: string; date: string; status: string }>>({});

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addEventCategory({
      id: Date.now().toString(),
      name: catName.trim(),
      emoji: catEmoji,
      budget: catBudget ? Number(catBudget) : 0,
      expenses: [],
      createdAt: new Date().toISOString()
    });
    setCatName('');
    setCatBudget('');
    setCatEmoji('✈️');
  };

  const getExpForm = (catId: string) => {
    return expForms[catId] || { desc: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'current' };
  };

  const updateExpForm = (catId: string, field: string, value: string) => {
    setExpForms(prev => ({
      ...prev,
      [catId]: { ...getExpForm(catId), [field]: value }
    }));
  };

  const handleAddExpense = (catId: string, e: React.FormEvent) => {
    e.preventDefault();
    const form = getExpForm(catId);
    if (!form.desc.trim() || !form.amount) return;
    addEventExpense(catId, {
      id: Date.now().toString(),
      description: form.desc.trim(),
      amount: Number(form.amount),
      date: form.date,
      status: form.status as 'past' | 'current' | 'upcoming'
    });
    setExpForms(prev => ({
      ...prev,
      [catId]: { desc: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'current' }
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="event-section">
      <div className="event-section-header">
        <div className="event-section-icon">
          <MapPin size={24} />
        </div>
        <h2 className="event-section-title text-gradient">Trip &amp; Event Tracker</h2>
      </div>

      {/* Create Category Form */}
      <form className="event-create-form" onSubmit={handleCreateCategory}>
        <div className="input-group">
          <label className="input-label">Event Name</label>
          <input
            type="text"
            className="input-field"
            value={catName}
            onChange={e => setCatName(e.target.value)}
            placeholder="e.g. Cancun Trip 2026"
          />
        </div>
        <div className="input-group" style={{ maxWidth: '120px', flex: '0 0 120px' }}>
          <label className="input-label">Icon</label>
          <select className="emoji-select" value={catEmoji} onChange={e => setCatEmoji(e.target.value)}>
            {EMOJI_OPTIONS.map(em => (
              <option key={em} value={em}>{em}</option>
            ))}
          </select>
        </div>
        <div className="input-group" style={{ maxWidth: '180px' }}>
          <label className="input-label">Budget (optional)</label>
          <input
            type="number"
            className="input-field"
            value={catBudget}
            onChange={e => setCatBudget(e.target.value)}
            placeholder="$0.00"
            step="0.01"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <FolderPlus size={16} /> Create Event
        </button>
      </form>

      {/* Category Cards */}
      {data.eventCategories.length === 0 ? (
        <div className="glass-panel">
          <div className="empty-state">
            <div className="empty-state-icon">🗂️</div>
            <p className="empty-state-text">No events yet. Create your first trip or event above to start tracking expenses!</p>
          </div>
        </div>
      ) : (
        <div className="event-categories-grid">
          {data.eventCategories.map(cat => {
            const totalSpent = cat.expenses.reduce((acc, exp) => acc + exp.amount, 0);
            const pastTotal = cat.expenses.filter(e => e.status === 'past').reduce((a, e) => a + e.amount, 0);
            const currentTotal = cat.expenses.filter(e => e.status === 'current').reduce((a, e) => a + e.amount, 0);
            const upcomingTotal = cat.expenses.filter(e => e.status === 'upcoming').reduce((a, e) => a + e.amount, 0);
            const isExpanded = expandedCards[cat.id] || false;
            const isOverBudget = cat.budget > 0 && totalSpent > cat.budget;
            const budgetPercent = cat.budget > 0 ? Math.min((totalSpent / cat.budget) * 100, 100) : 0;
            const form = getExpForm(cat.id);

            return (
              <div key={cat.id} className="event-card">
                {/* Header (clickable to expand) */}
                <div className="event-card-header" onClick={() => toggleCard(cat.id)}>
                  <div className="event-card-header-left">
                    <span className="event-card-emoji">{cat.emoji}</span>
                    <div>
                      <div className="event-card-name">{cat.name}</div>
                      <div className="event-card-meta">
                        {cat.expenses.length} expense{cat.expenses.length !== 1 ? 's' : ''}
                        {cat.budget > 0 && ` · Budget: ${formatCurrency(cat.budget)}`}
                      </div>
                    </div>
                  </div>
                  <div className="event-card-header-right">
                    {cat.budget > 0 && (
                      <span className={`budget-badge ${isOverBudget ? 'over' : 'under'}`}>
                        {isOverBudget ? '⚠️ Over Budget' : '✅ Under Budget'}
                      </span>
                    )}
                    <span className="event-card-total">{formatCurrency(totalSpent)}</span>
                    <ChevronDown size={18} className={`expand-icon ${isExpanded ? 'expanded' : ''}`} />
                  </div>
                </div>

                {/* Expandable Body */}
                <div className={`event-card-body ${isExpanded ? 'open' : ''}`}>
                  <div className="event-card-body-inner">
                    {/* Progress Bar (if budget set) */}
                    {cat.budget > 0 && (
                      <div className="progress-bar-container">
                        <div className="progress-bar-label">
                          <span>Spent: {formatCurrency(totalSpent)}</span>
                          <span>Budget: {formatCurrency(cat.budget)}</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${isOverBudget ? 'over-budget' : ''}`}
                            style={{ width: `${budgetPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Status Summary */}
                    <div className="status-summary">
                      <div className="status-badge past">Past: {formatCurrency(pastTotal)}</div>
                      <div className="status-badge current">Current: {formatCurrency(currentTotal)}</div>
                      <div className="status-badge upcoming">Upcoming: {formatCurrency(upcomingTotal)}</div>
                    </div>

                    {/* Expenses List */}
                    {cat.expenses.length > 0 && (
                      <div className="event-expenses-list">
                        {cat.expenses
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map(exp => (
                            <div key={exp.id} className="event-expense-row">
                              <div className="event-expense-info">
                                <div className={`event-expense-status-dot ${exp.status}`} />
                                <div className="event-expense-details">
                                  <span className="event-expense-desc">{exp.description}</span>
                                  <span className="event-expense-date">{formatDate(exp.date)} · {exp.status}</span>
                                </div>
                              </div>
                              <div className="event-expense-right">
                                <span className="event-expense-amount">{formatCurrency(exp.amount)}</span>
                                <button onClick={() => removeEventExpense(cat.id, exp.id)} className="delete-btn">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Add Expense Form */}
                    <form className="add-expense-form" onSubmit={(e) => handleAddExpense(cat.id, e)}>
                      <div className="input-group">
                        <label className="input-label">Description</label>
                        <input
                          type="text"
                          className="input-field"
                          value={form.desc}
                          onChange={e => updateExpForm(cat.id, 'desc', e.target.value)}
                          placeholder="e.g. Flight tickets"
                        />
                      </div>
                      <div className="input-group" style={{ maxWidth: '120px' }}>
                        <label className="input-label">Amount ($)</label>
                        <input
                          type="number"
                          className="input-field"
                          value={form.amount}
                          onChange={e => updateExpForm(cat.id, 'amount', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div className="input-group" style={{ maxWidth: '150px' }}>
                        <label className="input-label">Date</label>
                        <input
                          type="date"
                          className="input-field"
                          value={form.date}
                          onChange={e => updateExpForm(cat.id, 'date', e.target.value)}
                        />
                      </div>
                      <div className="input-group" style={{ maxWidth: '130px' }}>
                        <label className="input-label">Status</label>
                        <select
                          className="emoji-select"
                          value={form.status}
                          onChange={e => updateExpForm(cat.id, 'status', e.target.value)}
                        >
                          <option value="past">Past</option>
                          <option value="current">Current</option>
                          <option value="upcoming">Upcoming</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        <Plus size={14} /> Add
                      </button>
                    </form>

                    {/* Delete Category */}
                    <button
                      className="delete-category-btn"
                      onClick={() => {
                        if (window.confirm(`Delete "${cat.name}" and all its expenses?`)) {
                          removeEventCategory(cat.id);
                        }
                      }}
                    >
                      <Trash2 size={14} /> Delete Event
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
