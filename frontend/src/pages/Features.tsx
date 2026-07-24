// src/pages/Features.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Package,        // replaced Docker with Package
  Lightbulb,
  Globe,
  Activity,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

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

// --- Button Components (reuse from LandingPage) ---
const PrimaryButton: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = '',
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 px-8 py-3 text-base ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = '',
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`border border-white/20 text-white hover:bg-white/10 rounded-full font-medium transition-all active:scale-95 px-8 py-3 text-base ${className}`}
  >
    {children}
  </button>
);

// --- Feature Data ---
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

// --- Interactive Showcase Data ---
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
            <div className="text-sm font-bold text-white">1.84M</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-neutral-500">Threats</div>
            <div className="text-sm font-bold text-red-400">1,203</div>
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

// --- Benefits Data ---
const benefits = [
  { icon: <Server className="w-6 h-6 text-primary" />, title: 'Enterprise Architecture', desc: 'Designed for scale and resilience in large‑scale deployments.' },
  { icon: <Zap className="w-6 h-6 text-primary" />, title: 'Fast Predictions', desc: 'Sub‑20ms inference latency ensures real‑time security.' },
  { icon: <TrendingUp className="w-6 h-6 text-primary" />, title: 'High Accuracy', desc: '99%+ detection rate with minimal false positives.' },
  { icon: <Cloud className="w-6 h-6 text-primary" />, title: 'Scalable', desc: 'Horizontally scalable to handle enterprise‑grade traffic.' },
  { icon: <Cpu className="w-6 h-6 text-primary" />, title: 'Modern Stack', desc: 'Built with FastAPI, React, and Scikit‑Learn for performance.' },
  { icon: <Globe className="w-6 h-6 text-primary" />, title: 'Open Source', desc: 'Transparent, community‑driven, and extensible.' },
];

// --- Comparison Data ---
const comparisonData = [
  { feature: 'AI‑Powered Detection', aiNids: true, traditional: false },
  { feature: 'Real‑Time (<20ms) Inference', aiNids: true, traditional: false },
  { feature: 'Interactive Dashboard', aiNids: true, traditional: false },
  { feature: 'REST API Integration', aiNids: true, traditional: false },
  { feature: 'Cloud‑Ready', aiNids: true, traditional: false },
  { feature: 'Open Source', aiNids: true, traditional: false },
];

// --- Future Roadmap Data ---
const futureFeatures = [
  { icon: <Activity className="w-5 h-5" />, label: 'Real‑Time Detection' },
  { icon: <Cloud className="w-5 h-5" />, label: 'Cloud Deployment' },
  { icon: <Package className="w-5 h-5" />, label: 'Docker' },
  { icon: <Lightbulb className="w-5 h-5" />, label: 'XAI' },
  { icon: <Shield className="w-5 h-5" />, label: 'Threat Intelligence' },
  { icon: <Server className="w-5 h-5" />, label: 'SIEM' },
];

// --- Main Component ---
export const Features: React.FC = () => {
  const [activeShowcase, setActiveShowcase] = useState(showcaseFeatures[0]);

  return (
    <div className="bg-[#0B1220] text-white min-h-screen overflow-x-hidden font-sans">

      {/* ---- Hero Section ---- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <PrimaryButton>Explore Features</PrimaryButton>
              <SecondaryButton>View Documentation <ExternalLink className="w-4 h-4 ml-2 inline" /></SecondaryButton>
            </motion.div>
          </motion.div>

          {/* Premium illustration: dashboard mockup */}
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
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-neutral-500">Scans</div>
                      <div className="text-xl font-bold text-white">1.84M</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-neutral-500">Threats</div>
                      <div className="text-xl font-bold text-red-400">1,203</div>
                    </div>
                  </div>
                  <div className="h-16 w-full bg-white/5 rounded-xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Feature Categories ---- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">Feature Categories</motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              Explore the capabilities that make AI‑NIDS the choice of Fortune 500 security teams.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featureCategories.map((feature) => (
              <motion.div
                key={feature.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative p-6 rounded-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-br ${feature.color} hover:border-primary/40 hover:bg-white/5 transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{feature.description}</p>
                    <div className="mt-3 text-2xl">{feature.visual}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Interactive Showcase ---- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">Interactive Showcase</motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              Hover over a feature to see a live preview.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Feature list */}
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

            {/* Preview panel */}
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
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">Why Choose AI‑NIDS?</motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              Designed for security teams who demand speed, accuracy, and scale.
            </motion.p>
          </motion.div>

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

      {/* ---- Comparison Table ---- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">Comparison</motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              How AI‑NIDS stacks up against traditional IDS systems.
            </motion.p>
          </motion.div>

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
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">Future Roadmap</motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              Features we're building to make AI‑NIDS even more powerful.
            </motion.p>
          </motion.div>

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
            <PrimaryButton>Launch Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" /></PrimaryButton>
            <SecondaryButton>View Documentation <ExternalLink className="w-4 h-4 ml-2 inline" /></SecondaryButton>
          </motion.div>
        </div>
      </section>

      {/* ---- Footer (minimal, reused from landing) ---- */}
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