// src/pages/Architecture.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Database,
  Cpu,
  Server,
  LayoutDashboard,
  Network,
  Cloud,
  Boxes,
  GitBranch,
  Code2,
  FileText,
  Zap,
  Activity,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Lock,
  Globe,
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

// --- Button Components ---
const PrimaryButton: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <button className={`bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 px-8 py-3 text-base ${className}`}>
    {children}
  </button>
);

const SecondaryButton: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <button className={`border border-white/20 text-white hover:bg-white/10 rounded-full font-medium transition-all active:scale-95 px-8 py-3 text-base ${className}`}>
    {children}
  </button>
);

// --- Subcomponents ---
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white text-center mb-4 tracking-tight">
    {children}
  </motion.h2>
);

const SectionSubtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-400 text-center max-w-3xl mx-auto mb-12">
    {children}
  </motion.p>
);

// --- Architecture Step (for flow diagrams) ---
interface FlowStepProps {
  label: string;
  icon: React.ReactNode;
  index: number;
  isLast?: boolean;
  color?: string;
}

const FlowStep: React.FC<FlowStepProps> = ({ label, icon, index, isLast = false, color = 'primary' }) => (
  <div className="flex flex-col items-center w-full max-w-[120px] mx-auto">
    <div className="relative">
      <div className={`w-16 h-16 rounded-2xl bg-${color}/10 border border-${color}/30 flex items-center justify-center text-${color} shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {!isLast && (
        <motion.div
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.15 }}
          className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 text-neutral-600"
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      )}
    </div>
    <span className="mt-3 text-sm font-medium text-white text-center max-w-[100px]">{label}</span>
  </div>
);

// --- Main Component ---
export const Architecture: React.FC = () => {
  // Data for high-level flow
  const highLevelSteps = [
    { label: 'Dataset', icon: <Database className="w-7 h-7" /> },
    { label: 'Data Cleaning', icon: <CheckCircle className="w-7 h-7" /> },
    { label: 'EDA', icon: <Activity className="w-7 h-7" /> },
    { label: 'Feature Engineering', icon: <GitBranch className="w-7 h-7" /> },
    { label: 'Model Training', icon: <Cpu className="w-7 h-7" /> },
    { label: 'FastAPI', icon: <Server className="w-7 h-7" /> },
    { label: 'REST API', icon: <Network className="w-7 h-7" /> },
    { label: 'React Dashboard', icon: <LayoutDashboard className="w-7 h-7" /> },
  ];

  // System components
  const systemComponents = [
    { title: 'Data Mining Engine', icon: <Database className="w-6 h-6" />, desc: 'Ingests and preprocesses network traffic data from multiple sources.', stat: '10K req/s' },
    { title: 'ML Pipeline', icon: <Cpu className="w-6 h-6" />, desc: 'Scikit‑Learn pipelines with feature extraction, model training, and versioning.', stat: '99.4% Acc' },
    { title: 'FastAPI Backend', icon: <Server className="w-6 h-6" />, desc: 'High‑performance async API with automatic OpenAPI documentation.', stat: '8ms Latency' },
    { title: 'React Frontend', icon: <LayoutDashboard className="w-6 h-6" />, desc: 'Modern, responsive dashboard with real‑time updates and charts.', stat: 'Fully interactive' },
    { title: 'Prediction Service', icon: <Zap className="w-6 h-6" />, desc: 'On‑demand inference with model caching and batch support.', stat: 'Sub‑20ms' },
    { title: 'Auth & Security', icon: <Lock className="w-6 h-6" />, desc: 'JWT‑based authentication, role‑based access, and audit logging.', stat: 'SOC 2 ready' },
  ];

  // Backend architecture components
  const backendComponents = [
    { title: 'FastAPI App', icon: <Server className="w-5 h-5" />, items: ['REST endpoints', 'WebSocket', 'OpenAPI'] },
    { title: 'Prediction Engine', icon: <Zap className="w-5 h-5" />, items: ['Model inference', 'Batch processing', 'Cache'] },
    { title: 'Model Loader', icon: <Cpu className="w-5 h-5" />, items: ['PyTorch', 'Scikit‑Learn', 'ONNX'] },
    { title: 'Validation Layer', icon: <CheckCircle className="w-5 h-5" />, items: ['Pydantic', 'Data validation', 'Error handling'] },
    { title: 'API Routes', icon: <Network className="w-5 h-5" />, items: ['/predict', '/health', '/metrics'] },
  ];

  // Frontend architecture components
  const frontendComponents = [
    { title: 'Pages', icon: <LayoutDashboard className="w-5 h-5" />, items: ['Dashboard', 'Prediction', 'Analytics', 'About'] },
    { title: 'Components', icon: <Boxes className="w-5 h-5" />, items: ['KPICard', 'Charts', 'Tables', 'Forms'] },
    { title: 'Services', icon: <Cloud className="w-5 h-5" />, items: ['API client', 'WebSocket', 'Auth'] },
    { title: 'Hooks', icon: <Code2 className="w-5 h-5" />, items: ['useDashboardData', 'useCopy', 'useWebSocket'] },
    { title: 'API Layer', icon: <Network className="w-5 h-5" />, items: ['Axios', 'React Query', 'Interceptors'] },
  ];

  // Deployment flow
  const deploymentSteps = [
    { label: 'Browser', icon: <Globe className="w-6 h-6" /> },
    { label: 'React App', icon: <LayoutDashboard className="w-6 h-6" /> },
    { label: 'FastAPI', icon: <Server className="w-6 h-6" /> },
    { label: 'ML Model', icon: <Cpu className="w-6 h-6" /> },
    { label: 'Prediction', icon: <Zap className="w-6 h-6" /> },
    { label: 'JSON Response', icon: <FileText className="w-6 h-6" /> },
  ];

  // Folder structure
  const folderStructure = [
    { name: 'frontend/', icon: <LayoutDashboard className="w-4 h-4" />, children: ['public/', 'src/', 'components/', 'pages/', 'hooks/', 'services/', 'utils/', 'types/'] },
    { name: 'backend/', icon: <Server className="w-4 h-4" />, children: ['app/', 'models/', 'routers/', 'schemas/', 'core/', 'utils/'] },
    { name: 'ml/', icon: <Cpu className="w-4 h-4" />, children: ['data/', 'notebooks/', 'models/', 'pipelines/'] },
  ];

  return (
    <div className="bg-[#0B1220] text-white min-h-screen overflow-x-hidden font-sans">

      {/* ---- Hero ---- */}
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
              System Architecture
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
            >
              Platform Architecture
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
            >
              AI‑NIDS is built on a modern, scalable architecture combining Data Mining, Machine Learning, FastAPI, and React to deliver real‑time threat detection.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <PrimaryButton>Explore Components</PrimaryButton>
              <SecondaryButton>View on GitHub <ExternalLink className="w-4 h-4 ml-2 inline" /></SecondaryButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---- High-Level Architecture ---- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>High‑Level Architecture</SectionTitle>
          <SectionSubtitle>
            End‑to‑end data flow from raw network packets to actionable intelligence.
          </SectionSubtitle>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative flex flex-wrap justify-center items-center gap-8 md:gap-12 pt-8"
          >
            {highLevelSteps.map((step, idx) => (
              <FlowStep
                key={idx}
                label={step.label}
                icon={step.icon}
                index={idx}
                isLast={idx === highLevelSteps.length - 1}
                color={idx < 3 ? 'yellow' : idx < 5 ? 'blue' : 'emerald'}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- System Components ---- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>System Components</SectionTitle>
          <SectionSubtitle>
            Each component is designed for performance, scalability, and security.
          </SectionSubtitle>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {systemComponents.map((comp, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group relative p-6 rounded-2xl border border-white/10 backdrop-blur-sm bg-white/5 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {comp.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{comp.title}</h3>
                    <p className="text-sm text-neutral-400 mt-1">{comp.desc}</p>
                    <div className="mt-2 inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-neutral-300">
                      {comp.stat}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Data Flow Animation ---- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Data Flow</SectionTitle>
          <SectionSubtitle>
            How a packet travels through the system.
          </SectionSubtitle>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-primary/10" />
            <div className="space-y-8 pl-12">
              {[
                { label: 'Raw Packet Captured', icon: <Network className="w-5 h-5" />, desc: 'Network traffic is captured from the interface.' },
                { label: 'Preprocessing', icon: <Database className="w-5 h-5" />, desc: 'Data is cleaned, normalised, and features are extracted.' },
                { label: 'Model Inference', icon: <Cpu className="w-5 h-5" />, desc: 'The ML model predicts if the packet is malicious.' },
                { label: 'Post‑Processing', icon: <Activity className="w-5 h-5" />, desc: 'Results are aggregated and risk scores are calculated.' },
                { label: 'Dashboard Update', icon: <LayoutDashboard className="w-5 h-5" />, desc: 'The React dashboard displays the result in real time.' },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-6"
                >
                  <div className="absolute -left-10 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 flex-1 hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-3">
                      {step.icon}
                      <div>
                        <div className="text-sm font-medium text-white">{step.label}</div>
                        <div className="text-xs text-neutral-400">{step.desc}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Backend Architecture ---- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Backend Architecture</SectionTitle>
          <SectionSubtitle>
            FastAPI‑powered core with modular design.
          </SectionSubtitle>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {backendComponents.map((comp, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    {comp.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{comp.title}</h3>
                </div>
                <ul className="space-y-2">
                  {comp.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-primary/60" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Frontend Architecture ---- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Frontend Architecture</SectionTitle>
          <SectionSubtitle>
            React‑powered dashboard with a modern component hierarchy.
          </SectionSubtitle>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {frontendComponents.map((comp, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    {comp.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{comp.title}</h3>
                </div>
                <ul className="space-y-2">
                  {comp.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-primary/60" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- API Flow ---- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>API Flow</SectionTitle>
          <SectionSubtitle>
            How requests flow from client to prediction.
          </SectionSubtitle>

          <div className="relative overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] py-8">
              {[
                { label: 'Client', icon: <Globe className="w-8 h-8" /> },
                { label: 'FastAPI', icon: <Server className="w-8 h-8" /> },
                { label: 'Validation', icon: <CheckCircle className="w-8 h-8" /> },
                { label: 'Prediction', icon: <Cpu className="w-8 h-8" /> },
                { label: 'Response', icon: <FileText className="w-8 h-8" /> },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  {idx < 4 && (
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2 }}
                      className="text-neutral-500 -mt-2"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Deployment Architecture ---- */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Deployment Architecture</SectionTitle>
          <SectionSubtitle>
            From development to production.
          </SectionSubtitle>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12 pt-8"
          >
            {deploymentSteps.map((step, idx) => (
              <FlowStep
                key={idx}
                label={step.label}
                icon={step.icon}
                index={idx}
                isLast={idx === deploymentSteps.length - 1}
                color="emerald"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Folder Structure ---- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Folder Structure</SectionTitle>
          <SectionSubtitle>
            Clean, organised codebase for maintainability.
          </SectionSubtitle>

          <div className="grid md:grid-cols-3 gap-6">
            {folderStructure.map((folder, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                  {folder.icon} {folder.name}
                </div>
                <ul className="space-y-1.5">
                  {folder.children.map((child, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-300 pl-2 border-l-2 border-primary/30">
                      <Boxes className="w-3 h-3 text-primary/60" /> {child}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
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
            Explore the Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
          >
            Dive deeper into the code and documentation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <PrimaryButton>View on GitHub <ExternalLink className="w-4 h-4 ml-2 inline" /></PrimaryButton>
            <SecondaryButton>Read Docs <ExternalLink className="w-4 h-4 ml-2 inline" /></SecondaryButton>
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

export default Architecture;