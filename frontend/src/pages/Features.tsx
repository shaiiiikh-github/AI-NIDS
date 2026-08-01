// src/pages/Features.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Cpu,
  BarChart3,
  Zap,
  Database,
  LayoutDashboard,
  BookOpen,
  Lock,
  Server,
  TrendingUp,
  CheckCircle,
  XCircle,
  Cloud,
  Package,
  Lightbulb,
  Globe,
  Activity,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Menu,
  X,
  Users,
  ShieldCheck,
  Award,
} from 'lucide-react';

// --- Custom Button Components ---
const PrimaryButton: React.FC<{ children: React.ReactNode; className?: string; size?: 'sm' | 'lg'; onClick?: () => void }> = ({
  children,
  className = '',
  size = 'lg',
  onClick,
}) => {
  const sizeClasses = size === 'lg' ? 'px-8 py-3 text-base' : 'px-5 py-1.5 text-sm';
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden group bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] ${sizeClasses} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.button>
  );
};

const SecondaryButton: React.FC<{ children: React.ReactNode; className?: string; size?: 'sm' | 'lg'; onClick?: () => void }> = ({
  children,
  className = '',
  size = 'lg',
  onClick,
}) => {
  const sizeClasses = size === 'lg' ? 'px-8 py-3 text-base' : 'px-5 py-1.5 text-sm';
  return (
    <button
      onClick={onClick}
      className={`border border-white/20 text-white hover:bg-white/10 rounded-full font-medium transition-all active:scale-95 ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// --- Subcomponents ---
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white text-center mb-4 tracking-tight">
    {children}
  </motion.h2>
);

const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
  <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-400 text-center max-w-3xl mx-auto mb-12">
    {children}
  </motion.p>
);

const TrustBadge = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-white/10"
  >
    {icon}
    <span className="text-sm font-medium text-white/80">{label}</span>
  </motion.div>
);

// --- Feature Card ---
const FeatureCard = ({ icon, title, description, gradient = false }: any) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className={`group relative p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 ${
      gradient ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20' : 'bg-white/5'
    } hover:border-primary/40 hover:bg-white/10`}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
    {gradient && (
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    )}
  </motion.div>
);

// --- Main Component ---
export const Features: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  // Ref for the features section
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live dashboard data simulation
  const [liveScans, setLiveScans] = useState(1847293);
  const [liveThreats, setLiveThreats] = useState(1203);
  const [liveAccuracy, setLiveAccuracy] = useState(99.4);
  const [liveLatency, setLiveLatency] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScans(prev => prev + Math.floor(Math.random() * 5));
      setLiveThreats(prev => prev + (Math.random() > 0.7 ? 1 : 0));
      setLiveAccuracy(prev => Math.min(99.99, prev + (Math.random() > 0.9 ? 0.01 : 0)));
      setLiveLatency(prev => Math.max(6, prev + (Math.random() > 0.8 ? 0.1 : -0.1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- Data Arrays ---
  const featureCategories = [
    {
      id: 'ai-detection',
      icon: <Cpu className="w-6 h-6" />,
      title: 'AI Detection',
      description: 'Deep learning models trained on CIC-IDS2017 to detect zero-day threats with 99%+ accuracy.',
      visual: '🧠',
      color: 'from-blue-500/20 to-indigo-500/10',
    },
    {
      id: 'threat-analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Threat Analytics',
      description: 'Rich visualizations and real-time dashboards to understand attack vectors and trends.',
      visual: '📊',
      color: 'from-purple-500/20 to-pink-500/10',
    },
    {
      id: 'realtime-monitoring',
      icon: <Zap className="w-6 h-6" />,
      title: 'Real‑Time Monitoring',
      description: 'Sub‑20ms inference latency for mission‑critical packet inspection.',
      visual: '⚡',
      color: 'from-yellow-500/20 to-orange-500/10',
    },
    {
      id: 'rest-apis',
      icon: <Server className="w-6 h-6" />,
      title: 'REST APIs',
      description: 'Fully documented REST APIs for seamless integration with your existing security stack.',
      visual: '🔌',
      color: 'from-cyan-500/20 to-blue-500/10',
    },
    {
      id: 'machine-learning',
      icon: <Database className="w-6 h-6" />,
      title: 'Machine Learning',
      description: 'Scikit‑Learn powered pipelines with explainability and model versioning.',
      visual: '🤖',
      color: 'from-green-500/20 to-emerald-500/10',
    },
    {
      id: 'interactive-dashboard',
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: 'Interactive Dashboard',
      description: 'Monitor network health, model performance, and threat status at a glance.',
      visual: '📋',
      color: 'from-indigo-500/20 to-blue-500/10',
    },
    {
      id: 'documentation',
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Documentation',
      description: 'Comprehensive guides, API references, and integration tutorials.',
      visual: '📚',
      color: 'from-rose-500/20 to-pink-500/10',
    },
    {
      id: 'security',
      icon: <Lock className="w-6 h-6" />,
      title: 'Enterprise Security',
      description: 'Role‑based access control, audit logs, and compliance with SOC 2 standards.',
      visual: '🔒',
      color: 'from-red-500/20 to-rose-500/10',
    },
  ];

  const showcaseFeatures = [
    {
      id: 'dashboard',
      title: 'Live Dashboard',
      description: 'Real‑time telemetry and threat visualisation with customisable widgets.',
      preview: (
        <div className="bg-surface/80 rounded-xl p-4 border border-white/10 h-full flex flex-col">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Threat Overview</span>
            <span className="text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-[10px] text-neutral-500">Scans</div>
              <div className="text-sm font-bold text-white">{liveScans.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-[10px] text-neutral-500">Threats</div>
              <div className="text-sm font-bold text-red-400">{liveThreats.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-auto h-8 w-full bg-white/5 rounded-lg" />
        </div>
      ),
    },
    {
      id: 'prediction',
      title: 'Real‑Time Predictions',
      description: 'Instant classification of network packets with confidence scoring.',
      preview: (
        <div className="bg-surface/80 rounded-xl p-4 border border-white/10 h-full flex flex-col">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Activity className="w-4 h-4 text-primary" /> Prediction Stream
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs border-b border-white/5 pb-1">
              <span>Source</span>
              <span>Risk</span>
              <span>Conf.</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-300">192.168.1.105</span>
              <span className="text-emerald-400">SAFE</span>
              <span>99.7%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-300">10.0.0.7</span>
              <span className="text-amber-400">HIGH</span>
              <span>89.0%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Deep dive into attack patterns, model performance, and system health.',
      preview: (
        <div className="bg-surface/80 rounded-xl p-4 border border-white/10 h-full flex flex-col">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <BarChart3 className="w-4 h-4 text-primary" /> Attack Distribution
          </div>
          <div className="mt-3 flex items-end h-16 gap-1">
            <div className="flex-1 h-8 bg-red-500/40 rounded-t" style={{ height: '80%' }} />
            <div className="flex-1 h-10 bg-yellow-500/40 rounded-t" style={{ height: '60%' }} />
            <div className="flex-1 h-6 bg-purple-500/40 rounded-t" style={{ height: '40%' }} />
            <div className="flex-1 h-4 bg-neutral-500/40 rounded-t" style={{ height: '20%' }} />
          </div>
        </div>
      ),
    },
  ];

  const benefits = [
    { icon: <Server className="w-6 h-6 text-primary" />, title: 'Enterprise Architecture', desc: 'Designed for scale and resilience in large‑scale deployments.' },
    { icon: <Zap className="w-6 h-6 text-primary" />, title: 'Fast Predictions', desc: 'Sub‑20ms inference latency ensures real‑time security.' },
    { icon: <TrendingUp className="w-6 h-6 text-primary" />, title: 'High Accuracy', desc: '99%+ detection rate with minimal false positives.' },
    { icon: <Cloud className="w-6 h-6 text-primary" />, title: 'Scalable', desc: 'Horizontally scalable to handle enterprise‑grade traffic.' },
    { icon: <Cpu className="w-6 h-6 text-primary" />, title: 'Modern Stack', desc: 'Built with FastAPI, React, and Scikit‑Learn for performance.' },
    { icon: <Globe className="w-6 h-6 text-primary" />, title: 'Open Source', desc: 'Transparent, community‑driven, and extensible.' },
  ];

  const comparisonData = [
    { feature: 'AI‑Powered Detection', aiNids: true, traditional: false },
    { feature: 'Real‑Time (<20ms) Inference', aiNids: true, traditional: false },
    { feature: 'Interactive Dashboard', aiNids: true, traditional: false },
    { feature: 'REST API Integration', aiNids: true, traditional: false },
    { feature: 'Cloud‑Ready', aiNids: true, traditional: false },
    { feature: 'Open Source', aiNids: true, traditional: false },
  ];

  const futureFeatures = [
    { icon: <Activity className="w-5 h-5" />, label: 'Real‑Time Detection' },
    { icon: <Cloud className="w-5 h-5" />, label: 'Cloud Deployment' },
    { icon: <Package className="w-5 h-5" />, label: 'Docker' },
    { icon: <Lightbulb className="w-5 h-5" />, label: 'XAI' },
    { icon: <Shield className="w-5 h-5" />, label: 'Threat Intelligence' },
    { icon: <Server className="w-5 h-5" />, label: 'SIEM' },
  ];

  const [activeShowcase, setActiveShowcase] = useState(showcaseFeatures[0]);

  return (
    <div className="bg-[#0B1220] text-white min-h-screen overflow-x-hidden font-sans selection:bg-primary/30 selection:text-white">

      {/* ---- Floating Pill Navbar ---- */}
      <header
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl
          transition-all duration-300
          ${scrolled
            ? 'bg-surface/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20'
            : 'bg-surface/60 backdrop-blur-md border border-white/5 shadow-lg shadow-black/10'
          }
          rounded-full px-6 py-2
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-white">AI‑NIDS</span>
            <span className="hidden md:inline text-[10px] font-mono text-primary/60 border border-primary/30 px-2 py-0.5 rounded-full">
              ENTERPRISE
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Features</Link>
            <Link to="/architecture" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Architecture</Link>
            <Link to="/docs" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Docs</Link>
            <Link to="/about" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">About</Link>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <Link to="/dashboard">
              <PrimaryButton size="sm" className="px-5 py-1.5 text-sm">
                Launch Dashboard <ArrowRight className="w-4 h-4 ml-1 inline" />
              </PrimaryButton>
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-neutral-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 pt-4 border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col gap-3 pb-3">
                <Link to="/features" className="text-neutral-300 hover:text-white transition-colors">Features</Link>
                <Link to="/architecture" className="text-neutral-300 hover:text-white transition-colors">Architecture</Link>
                <Link to="/docs" className="text-neutral-300 hover:text-white transition-colors">Documentation</Link>
                <Link to="/about" className="text-neutral-300 hover:text-white transition-colors">About</Link>
                <Link to="/dashboard" className="w-full">
                  <PrimaryButton size="sm" className="w-full justify-center px-5 py-2 text-sm">
                    Launch Dashboard <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </PrimaryButton>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-3/4 left-1/2 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Enterprise‑Grade Capabilities
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
            >
              AI-Powered Cybersecurity Platform
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
            >
              AI‑NIDS combines Machine Learning, Data Mining, FastAPI, and React to deliver intelligent, real‑time threat detection for modern enterprises.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <PrimaryButton onClick={scrollToFeatures}>
                Explore Features
              </PrimaryButton>
              <Link to="/docs">
                <SecondaryButton>View Documentation <ExternalLink className="w-4 h-4 ml-2 inline" /></SecondaryButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Shield className="w-4 h-4 text-primary" /> AI‑NIDS
                  </div>
                  <div className="space-y-1">
                    {['Dashboard', 'Prediction', 'Analytics', 'Model Info'].map((item) => (
                      <div key={item} className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${item === 'Dashboard' ? 'bg-primary/20 text-white' : 'text-neutral-400'}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-3 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">Live Threat Overview</span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-neutral-500">Scans</div>
                      <div className="text-xl font-bold text-white">{liveScans.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-neutral-500">Threats</div>
                      <div className="text-xl font-bold text-red-400">{liveThreats.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="h-16 w-full bg-white/5 rounded-xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ---- Trust Section ---- */}
      <section className="py-12 border-y border-white/5 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            <TrustBadge icon={<ShieldCheck className="w-5 h-5 text-primary" />} label="SOC 2 Type II" />
            <TrustBadge icon={<Lock className="w-5 h-5 text-primary" />} label="GDPR Compliant" />
            <TrustBadge icon={<Users className="w-5 h-5 text-primary" />} label="Fortune 500 Ready" />
            <TrustBadge icon={<Globe className="w-5 h-5 text-primary" />} label="Global Deployment" />
            <TrustBadge icon={<Award className="w-5 h-5 text-primary" />} label="ML-Powered" />
            <TrustBadge icon={<Cloud className="w-5 h-5 text-primary" />} label="AWS Ready" />
          </motion.div>
        </div>
      </section>

      {/* ---- Feature Categories ---- */}
      <section ref={featuresRef} id="features" className="py-24 pt-32 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Enterprise‑Grade Capabilities</SectionTitle>
          <SectionSubtitle>
            Explore the capabilities that make AI‑NIDS the choice of Fortune 500 security teams.
          </SectionSubtitle>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featureCategories.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.id === 'ai-detection' || feature.id === 'security'}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Interactive Showcase ---- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Interactive Showcase</SectionTitle>
          <SectionSubtitle>
            Hover over a feature to see a live preview.
          </SectionSubtitle>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-2">
              {showcaseFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setActiveShowcase(feature)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeShowcase.id === feature.id
                      ? 'bg-primary/20 border border-primary/30 shadow-[0_0_30px_rgba(37,99,235,0.15)]'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              key={activeShowcase.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 bg-surface/50 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-xl"
            >
              {activeShowcase.preview}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---- Benefits ---- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Why Choose AI‑NIDS?</SectionTitle>
          <SectionSubtitle>
            Designed for security teams who demand speed, accuracy, and scale.
          </SectionSubtitle>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                    <p className="text-sm text-neutral-400">{benefit.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Comparison ---- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Comparison</SectionTitle>
          <SectionSubtitle>
            How AI‑NIDS stacks up against traditional IDS systems.
          </SectionSubtitle>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-sm font-semibold text-neutral-400">Feature</th>
                  <th className="p-4 text-center text-sm font-semibold text-primary">AI‑NIDS</th>
                  <th className="p-4 text-center text-sm font-semibold text-neutral-500">Traditional IDS</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-white">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.aiNids ? <CheckCircle className="w-5 h-5 text-emerald-400 inline" /> : <XCircle className="w-5 h-5 text-neutral-600 inline" />}
                    </td>
                    <td className="p-4 text-center">
                      {row.traditional ? <CheckCircle className="w-5 h-5 text-emerald-400 inline" /> : <XCircle className="w-5 h-5 text-neutral-600 inline" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ---- Future Roadmap ---- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Future Roadmap</SectionTitle>
          <SectionSubtitle>
            Features we're building to make AI‑NIDS even more powerful.
          </SectionSubtitle>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {futureFeatures.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-lg font-medium text-white">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
          >
            Launch the dashboard or explore the documentation to see AI‑NIDS in action.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/dashboard">
              <PrimaryButton>Launch Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" /></PrimaryButton>
            </Link>
            <Link to="/docs">
              <SecondaryButton>View Documentation <ExternalLink className="w-4 h-4 ml-2 inline" /></SecondaryButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-white/5 bg-surface/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-white">AI‑NIDS</span>
            </div>
            <p className="text-sm text-neutral-400">© 2026 AI‑NIDS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;