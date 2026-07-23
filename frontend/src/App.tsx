// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Prediction } from '@/pages/Prediction';
import { Analytics } from '@/pages/Analytics';

export const App: React.FC = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/analytics" element={<Analytics />} />
          
          {/* Fallback for unbuilt pages */}
          <Route
            path="*"
            element={
              <div className="h-full flex items-center justify-center p-8 text-neutral-500 font-mono text-sm bg-grid-pattern">
                MODULE_UNDER_CONSTRUCTION // CHECK BACK LATER
              </div>
            }
          />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;