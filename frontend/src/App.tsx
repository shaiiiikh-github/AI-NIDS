// src/App.tsx
import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DocsPage from './pages/DocsPage';
import { UserProfilePage } from '@/pages/UserProfilePage';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Features = lazy(() => import('./pages/Features'));
const Architecture = lazy(() => import('./pages/Architecture'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Prediction = lazy(() => import('./pages/Prediction'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ModelInfo = lazy(() => import('./pages/ModelInfo'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const SignIn = lazy(() => import('./pages/SignIn').then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import('./pages/SignUp').then(m => ({ default: m.SignUp })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const IdentityCenter = lazy(() => import('./pages/IdentityCenter'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 2 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<div className="p-8 text-center text-neutral-400">Loading...</div>}>
            <Routes>
              {/* Public landing page – no layout */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<Features />} />
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<Features />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/docs/:pageId" element={<DocsPage />} />
              <Route path="/docs" element={<Navigate to="/docs/overview" replace />} />

              {/* Auth routes - no layout */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Authenticated dashboard routes – with layout */}
              <Route path="/dashboard" element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } />
              <Route path="/predict" element={
                <DashboardLayout>
                  <Prediction />
                </DashboardLayout>
              } />
              <Route path="/analytics" element={
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              } />
              <Route path="/model-info" element={
                <DashboardLayout>
                  <ModelInfo />
                </DashboardLayout>
              } />
              <Route path="/reports" element={
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              } />
              <Route path="/settings" element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              } />
              <Route path="/about" element={
                <DashboardLayout>
                  <About />
                </DashboardLayout>
              } />
              {/* Authenticated dashboard routes – with layout */}
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/predict" element={<DashboardLayout><Prediction /></DashboardLayout>} />
              <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
              <Route path="/model-info" element={<DashboardLayout><ModelInfo /></DashboardLayout>} />
              <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
              <Route path="/identity" element={<DashboardLayout><IdentityCenter /></DashboardLayout>} />
              <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
              <Route path="/about" element={<DashboardLayout><About /></DashboardLayout>} />
              <Route path="/profile" element={<DashboardLayout><UserProfilePage /></DashboardLayout>} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;