// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Prediction } from '@/pages/Prediction';
import { Analytics } from '@/pages/Analytics';
import { ModelInfo } from '@/pages/ModelInfo';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { About } from '@/pages/About';

export const App: React.FC = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/model-info" element={<ModelInfo />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          
          <Route
            path="*"
            element={
              <div className="h-full flex items-center justify-center p-8 text-neutral-500 font-mono text-sm bg-grid-pattern">
                404 // ROUTE_NOT_FOUND
              </div>
            }
          />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;