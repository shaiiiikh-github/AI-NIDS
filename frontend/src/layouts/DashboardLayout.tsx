// src/layouts/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Cpu,
  BarChart3,
  BookOpen,
  FileText,
  Settings,
  Info,
  Shield,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Prediction', href: '/predict', icon: Cpu },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Model Info', href: '/model-info', icon: BookOpen },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'About', href: '/about', icon: Info },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-6">
          <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white leading-tight">AI-NIDS</h2>
            <p className="text-[10px] text-neutral-400 font-mono">ENTERPRISE SAAS</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 hover:translate-x-1'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-neutral-800/80 mt-auto">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-white">SecOps Lead</div>
              <div className="text-[10px] text-neutral-500 font-mono">admin@nids.internal</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative flex h-screen bg-[#09090b] text-neutral-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ABSOLUTE BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="relative z-10 w-64 border-r border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md hidden md:flex flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-neutral-800/80 bg-neutral-900/30 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 md:hidden text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">SYSTEM ONLINE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-neutral-900" />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};