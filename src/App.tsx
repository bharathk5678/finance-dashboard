import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { SummaryCards } from './components/SummaryCards';
import { DataEntry } from './components/DataEntry';
import { AdviceEngine } from './components/AdviceEngine';
import { Activity } from 'lucide-react';

function App() {
  return (
    <FinanceProvider>
      <div className="container py-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Activity className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Genius Financial Dashboard</h1>
              <p className="text-secondary mt-1">Smart tracking & intelligent advice for your money.</p>
            </div>
          </div>
          <div>
            <span className="badge badge-success">Local Secure Mode</span>
          </div>
        </header>

        <main>
          <SummaryCards />
          <DataEntry />
          <AdviceEngine />
        </main>
        
        <footer className="mt-12 text-center text-sm text-muted pb-8">
          <p>Your data is stored securely and privately in your local browser storage.</p>
        </footer>
      </div>
    </FinanceProvider>
  );
}

export default App;
