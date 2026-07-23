// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';

export const App: React.FC = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="*"
            element={
              <div className="p-8 text-neutral-400">
                Page under construction. Check back soon!
              </div>
            }
          />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;