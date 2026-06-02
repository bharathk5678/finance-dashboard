import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { SummaryCards } from './components/SummaryCards';
import { DataEntry } from './components/DataEntry';
import { AdviceEngine } from './components/AdviceEngine';
import { Activity } from 'lucide-react';

function App() {
  return (
    <FinanceProvider>
      <div className="container">
        <header className="header">
          <div className="header-left">
            <div className="header-icon">
              <Activity color="white" size={28} />
            </div>
            <div>
              <h1 className="header-title text-gradient">Genius Financial Dashboard</h1>
              <p className="header-subtitle">Smart tracking &amp; intelligent advice for your money.</p>
            </div>
          </div>
          <div>
            <span className="badge badge-success">🔒 Local Secure Mode</span>
          </div>
        </header>

        <main>
          <SummaryCards />
          <DataEntry />
          <AdviceEngine />
        </main>
        
        <footer className="footer">
          <p>Your data is stored securely and privately in your local browser storage.</p>
        </footer>
      </div>
    </FinanceProvider>
  );
}

export default App;
