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
  LogOut,
  Sparkles,
  LifeBuoy,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Prediction', href: '/predict', icon: Cpu },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Model Info', href: '/model-info', icon: BookOpen },
  { name: 'Reports', href: '/reports', icon: FileText },
  // { name: 'Identity', href: '/identity', icon: Shield }, // commented out
  // { name: 'Profile', href: '/profile', icon: User },    // commented out
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'About', href: '/about', icon: Info },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      {/* Brand – fixed height */}
      <div className="p-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 bg-gradient-to-r from-indigo-600/15 to-indigo-400/5 rounded-xl border border-indigo-500/20 shadow-[0_0_40px_rgba(79,70,229,0.12)]">
          <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400 shadow-[0_0_25px_rgba(79,70,229,0.25)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-white leading-tight flex items-center gap-1.5">
              AI‑NIDS
              <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                v2.4
              </span>
            </h2>
            <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
              ENTERPRISE SAAS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation – takes all remaining space */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-indigo-500/5 text-indigo-400 border border-indigo-500/30 shadow-[0_0_25px_rgba(79,70,229,0.15)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 hover:translate-x-0.5'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.7)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-indigo-400' : 'group-hover:text-white'
                }`}
              />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(79,70,229,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Help & Support – fills the gap above user section */}
      <div className="px-3 py-2 flex-shrink-0">
        <Link
          to="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Help & Support</span>
        </Link>
      </div>

      {/* User section – always at the bottom */}
      <div className="p-4 border-t border-neutral-800/60 flex-shrink-0">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/5 hover:border-indigo-500/20 transition-all group">
          <Link
            to="/profile"
            className="flex-1 flex items-center gap-3 px-1 py-1 rounded-lg hover:bg-neutral-800/30 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 border-2 border-indigo-500/30 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] group-hover:shadow-[0_0_35px_rgba(79,70,229,0.5)] transition-shadow">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0) || 'U'
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-neutral-900 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.fullName || 'Guest'}</div>
              <div className="text-[10px] text-neutral-400 font-mono truncate">{user?.email || 'guest@example.com'}</div>
            </div>
          </Link>
          <button
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors shrink-0"
            title="Sign out"
            onClick={() => {
              // handle logout
              console.log('Logout clicked');
            }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative flex h-screen bg-[#0A0E1A] text-neutral-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Desktop Sidebar – full height */}
      <aside className="relative z-10 w-64 border-r border-neutral-800/60 bg-neutral-900/40 backdrop-blur-xl hidden md:flex flex-col h-full shadow-2xl shadow-black/30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
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
              transition={{ type: 'spring', damping: 28, stiffness: 180 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950/95 border-r border-neutral-800 flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-neutral-800/60 bg-neutral-900/20 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 md:hidden text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              <span className="hidden sm:inline">SYSTEM ONLINE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors relative group">
              <Bell className="w-4 h-4 group-hover:scale-105 transition-transform" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-neutral-900 shadow-[0_0_12px_rgba(79,70,229,0.6)] animate-pulse" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};