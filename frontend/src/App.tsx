// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Prediction } from '@/pages/Prediction';
import { Analytics } from '@/pages/Analytics';
import { ModelInfo } from '@/pages/ModelInfo';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { About } from '@/pages/About';

// A wrapper to animate page changes seamlessly
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="h-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/predict" element={<PageWrapper><Prediction /></PageWrapper>} />
        <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
        <Route path="/model-info" element={<PageWrapper><ModelInfo /></PageWrapper>} />
        <Route path="/reports" element={<PageWrapper><Reports /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        
        <Route
          path="*"
          element={
            <PageWrapper>
              <div className="h-full flex items-center justify-center p-8 text-neutral-500 font-mono text-sm">
                404 // ROUTE_NOT_FOUND
              </div>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Toaster 
        theme="dark" 
        position="top-right" 
        toastOptions={{
          className: 'bg-neutral-900 border border-neutral-800 text-neutral-200 font-sans',
        }}
      />
      <DashboardLayout>
        <AnimatedRoutes />
      </DashboardLayout>
    </Router>
  );
};

export default App;