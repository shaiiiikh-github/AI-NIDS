// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Shield,
    Cpu,
    BarChart3,
    Zap,
    LayoutDashboard,
    Database,
    Cloud,
    ExternalLink,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Activity,
    Network,
    Server,
    TrendingUp,
    ShieldCheck,
    Award,
    Globe,
    Lock,
    Users,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// --- Custom Button Components (replaces shadcn/ui) ---
const PrimaryButton: React.FC<{ children: React.ReactNode; className?: string; size?: 'sm' | 'lg'; onClick?: () => void }> = ({
    children,
    className = '',
    size = 'lg',
    onClick,
}) => {
    const sizeClasses = size === 'lg' ? 'px-8 py-3 text-base' : 'px-6 py-2 text-sm';
    return (
        <button
            onClick={onClick}
            className={`bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 ${sizeClasses} ${className}`}
        >
            {children}
        </button>
    );
};

const SecondaryButton: React.FC<{ children: React.ReactNode; className?: string; size?: 'sm' | 'lg'; onClick?: () => void }> = ({
    children,
    className = '',
    size = 'lg',
    onClick,
}) => {
    const sizeClasses = size === 'lg' ? 'px-8 py-3 text-base' : 'px-6 py-2 text-sm';
    return (
        <button
            onClick={onClick}
            className={`border border-white/20 text-white hover:bg-white/10 rounded-full font-medium transition-all active:scale-95 ${sizeClasses} ${className}`}
        >
            {children}
        </button>
    );
};

// --- Animation variants (without explicit easing to avoid TypeScript errors) ---
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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
    <motion.div variants={fadeInUp} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
        {icon}
        <span className="text-sm font-medium text-white/80">{label}</span>
    </motion.div>
);

// --- Main Component ---
export const LandingPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Mock data for dashboard preview ---
    const areaData = [
        { time: '00:00', traffic: 200, threats: 10 },
        { time: '04:00', traffic: 150, threats: 8 },
        { time: '08:00', traffic: 350, threats: 25 },
        { time: '12:00', traffic: 550, threats: 45 },
        { time: '16:00', traffic: 480, threats: 32 },
        { time: '20:00', traffic: 280, threats: 18 },
    ];

    const pieData = [
        { name: 'DDoS', value: 42 },
        { name: 'Brute Force', value: 28 },
        { name: 'Malware', value: 20 },
        { name: 'Other', value: 10 },
    ];
    const pieColors = ['#EF4444', '#F59E0B', '#8B5CF6', '#6B7280'];

    // --- Statistics counter ---
    const StatCounter = ({ value, label, suffix = '', icon }: { value: number; label: string; suffix?: string; icon: React.ReactNode }) => {
        const ref = useRef<HTMLDivElement>(null);
        const isInView = useInView(ref, { once: true, amount: 0.3 });
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (isInView) {
                let start = 0;
                const duration = 2000;
                const step = Math.max(1, Math.floor(value / (duration / 16)));
                const timer = setInterval(() => {
                    start += step;
                    if (start >= value) {
                        setCount(value);
                        clearInterval(timer);
                    } else {
                        setCount(start);
                    }
                }, 16);
                return () => clearInterval(timer);
            }
        }, [isInView, value]);

        return (
            <div ref={ref} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="flex justify-center mb-2 text-primary">{icon}</div>
                <div className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tight">
                    {count.toLocaleString()}
                    {suffix}
                </div>
                <div className="text-sm text-neutral-400 mt-1">{label}</div>
            </div>
        );
    };

    // --- Feature card ---
    const FeatureCard = ({ icon, title, description, gradient = false }: any) => (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`group relative p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 ${gradient ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20' : 'bg-white/5'
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

    return (
        <div className="bg-[#0B1220] text-white min-h-screen overflow-x-hidden font-sans selection:bg-primary/30 selection:text-white">

            {/* ---- Navbar ---- */}
            <header
                className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? 'bg-surface/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}
        `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-primary" />
                            <span className="text-xl font-bold tracking-tight text-white">AI‑NIDS</span>
                            <span className="text-[10px] font-mono text-primary/60 border border-primary/30 px-2 py-0.5 rounded-full">
                                ENTERPRISE
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Features</a>
                            <a href="#architecture" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Architecture</a>
                            <a href="#docs" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Docs</a>
                            <a href="#about" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">About</a>
                            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                            </a>
                            <Link to="/dashboard">
                                <PrimaryButton size="lg" className="px-8">
                                    Launch Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" />
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
                </div>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-white/5"
                        >
                            <div className="px-4 py-6 space-y-4">
                                <a href="#features" className="block text-neutral-300 hover:text-white">Features</a>
                                <a href="#architecture" className="block text-neutral-300 hover:text-white">Architecture</a>
                                <a href="#docs" className="block text-neutral-300 hover:text-white">Documentation</a>
                                <a href="#about" className="block text-neutral-300 hover:text-white">About</a>
                                <Link to="/dashboard">
                                    <PrimaryButton size="lg" className="px-8">
                                        Launch Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" />
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ---- Hero ---- */}
            <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
                >
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="space-y-8"
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20">
                                <Sparkles className="w-4 h-4" />
                                Next‑Gen AI Security
                            </motion.div>
                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                                AI‑Powered Network
                                <span className="text-primary block">Intrusion Detection</span>
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-xl text-neutral-400 max-w-xl leading-relaxed">
                                Combining Data Mining, Machine Learning, FastAPI, and React to detect malicious traffic in real time, with sub‑20ms latency.
                            </motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <Link to="/dashboard">
                                    <PrimaryButton size="lg" className="px-8">
                                        Launch Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" />
                                    </PrimaryButton>
                                </Link>
                                <SecondaryButton size="lg" className="px-8">
                                    View Docs <ExternalLink className="w-4 h-4 ml-2 inline" />
                                </SecondaryButton>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
                                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> ML Powered</span>
                                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> FastAPI Backend</span>
                                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> React Frontend</span>
                                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> CIC‑IDS2017</span>
                            </motion.div>
                        </motion.div>

                        {/* Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative"
                        >
                            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1 space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                                            <Shield className="w-4 h-4 text-primary" /> AI‑NIDS
                                        </div>
                                        <div className="space-y-1">
                                            {['Dashboard', 'Prediction', 'Analytics', 'Model Info', 'Reports'].map((item) => (
                                                <div key={item} className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${item === 'Dashboard' ? 'bg-primary/20 text-white' : 'text-neutral-400 hover:bg-white/5'}`}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2 text-xs text-neutral-400">
                                                <Users className="w-4 h-4" /> SecOps Lead
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white">Live Threat Overview</span>
                                            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> System Online
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <div className="text-[10px] text-neutral-500">Total Scans</div>
                                                <div className="text-xl font-bold text-white">1.84M</div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <div className="text-[10px] text-neutral-500">Threats</div>
                                                <div className="text-xl font-bold text-red-400">1,203</div>
                                            </div>
                                        </div>
                                        <div className="h-24 w-full bg-white/5 rounded-xl p-2">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={areaData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                                                    <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                                    <Area type="monotone" dataKey="traffic" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                                                    <Area type="monotone" dataKey="threats" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-2 text-xs">
                                            <div className="flex justify-between border-b border-white/10 py-1.5 text-neutral-400">
                                                <span>ID</span>
                                                <span>Risk</span>
                                                <span>Conf.</span>
                                            </div>
                                            <div className="flex justify-between py-1.5">
                                                <span className="text-white">pred-7f3a</span>
                                                <span className="text-emerald-400">SAFE</span>
                                                <span className="text-white">99.7%</span>
                                            </div>
                                            <div className="flex justify-between py-1.5">
                                                <span className="text-white">pred-8b4d</span>
                                                <span className="text-amber-400">HIGH</span>
                                                <span className="text-white">89.0%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-card/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-2xl hidden lg:block">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <div>
                                        <div className="text-[10px] text-neutral-400">Latency</div>
                                        <div className="text-sm font-bold text-white">8ms</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-card/80 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-2xl hidden lg:block">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <div>
                                        <div className="text-[10px] text-neutral-400">Accuracy</div>
                                        <div className="text-sm font-bold text-white">99.4%</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
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
                    </motion.div>
                </div>
            </section>

            {/* ---- Features ---- */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>Enterprise‑Grade Capabilities</SectionTitle>
                    <SectionSubtitle>
                        Engineered for security teams who demand speed, accuracy, and scale.
                    </SectionSubtitle>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <FeatureCard
                            icon={<Cpu className="w-6 h-6" />}
                            title="AI Detection"
                            description="Deep learning models trained on CIC‑IDS2017 to detect zero‑day threats with 99%+ accuracy."
                            gradient
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="Threat Analytics"
                            description="Rich visualizations and real‑time dashboards to understand attack vectors and trends."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Fast Predictions"
                            description="Sub‑20ms inference latency for mission‑critical packet inspection."
                        />
                        <FeatureCard
                            icon={<LayoutDashboard className="w-6 h-6" />}
                            title="Interactive Dashboard"
                            description="Monitor network health, model performance, and threat status at a glance."
                        />
                        <FeatureCard
                            icon={<Cloud className="w-6 h-6" />}
                            title="Scalable Architecture"
                            description="Designed to handle enterprise‑scale traffic with horizontal scaling."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Enterprise Security"
                            description="Role‑based access control, audit logs, and compliance with SOC 2 standards."
                            gradient
                        />
                    </motion.div>
                </div>
            </section>

            {/* ---- Architecture ---- */}
            <section id="architecture" className="py-24 bg-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>Platform Architecture</SectionTitle>
                    <SectionSubtitle>
                        From data ingestion to actionable intelligence.
                    </SectionSubtitle>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="relative flex flex-col items-center"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
                            {[
                                { icon: Database, label: 'Dataset' },
                                { icon: Cpu, label: 'ML Model' },
                                { icon: Server, label: 'FastAPI' },
                                { icon: Network, label: 'REST API' },
                                { icon: LayoutDashboard, label: 'Dashboard' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-sm font-medium text-white">{item.label}</span>
                                    {idx < 4 && (
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2 }}
                                            className="hidden md:block text-primary/40 mt-2"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                        <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* ---- Live Dashboard Preview ---- */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>Live Dashboard</SectionTitle>
                    <SectionSubtitle>
                        Real‑time telemetry and threat visualisation at your fingertips.
                    </SectionSubtitle>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
                    >
                        <div className="grid lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                                    <Shield className="w-4 h-4 text-primary" /> AI‑NIDS
                                </div>
                                <div className="space-y-1">
                                    {['Dashboard', 'Prediction', 'Analytics', 'Model Info', 'Reports', 'Settings'].map((item) => (
                                        <div key={item} className={`text-sm px-3 py-2 rounded-lg transition-colors ${item === 'Dashboard' ? 'bg-primary/20 text-white' : 'text-neutral-400 hover:bg-white/5'}`}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                                        <Users className="w-4 h-4" /> SecOps Lead
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-3 space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Total Inspections</div>
                                        <div className="text-2xl font-bold text-white">1,847,293</div>
                                        <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +12.4%</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Threats Detected</div>
                                        <div className="text-2xl font-bold text-red-400">1,203</div>
                                        <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> -8.1%</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Model Accuracy</div>
                                        <div className="text-2xl font-bold text-emerald-400">99.4%</div>
                                        <div className="text-xs text-neutral-400 mt-1">F1: 0.994</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Avg Latency</div>
                                        <div className="text-2xl font-bold text-white">8ms</div>
                                        <div className="text-xs text-neutral-400 mt-1">p99: 18ms</div>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2 bg-white/5 rounded-xl p-4 h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={areaData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                                                <YAxis stroke="#9CA3AF" fontSize={10} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                                <Area type="monotone" dataKey="traffic" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                                                <Area type="monotone" dataKey="threats" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 h-48 flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                                                    {pieData.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-medium text-white">Recent Predictions</span>
                                        <span className="text-xs text-neutral-400">Live</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="text-neutral-400 border-b border-white/10">
                                                    <th className="py-2 text-left">ID</th>
                                                    <th className="py-2 text-left">Source</th>
                                                    <th className="py-2 text-left">Risk</th>
                                                    <th className="py-2 text-left">Conf.</th>
                                                    <th className="py-2 text-left">Latency</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-white/5">
                                                    <td className="py-2 text-white">pred-7f3a</td>
                                                    <td className="text-neutral-300">192.168.1.105</td>
                                                    <td><span className="text-emerald-400">SAFE</span></td>
                                                    <td>99.7%</td>
                                                    <td>7ms</td>
                                                </tr>
                                                <tr className="border-b border-white/5">
                                                    <td className="py-2 text-white">pred-8b4d</td>
                                                    <td className="text-neutral-300">10.0.0.7</td>
                                                    <td><span className="text-amber-400">HIGH</span></td>
                                                    <td>89.0%</td>
                                                    <td>14ms</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 text-white">pred-9c5f</td>
                                                    <td className="text-neutral-300">172.16.0.45</td>
                                                    <td><span className="text-emerald-400">SAFE</span></td>
                                                    <td>99.2%</td>
                                                    <td>6ms</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---- ML Pipeline ---- */}
            <section className="py-24 bg-white/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>ML Pipeline</SectionTitle>
                    <SectionSubtitle>
                        From raw data to production model.
                    </SectionSubtitle>
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-primary/10" />
                        <div className="space-y-8 pl-12">
                            {[
                                { label: 'Dataset (CIC‑IDS2017)', icon: Database },
                                { label: 'Data Cleaning', icon: CheckCircle },
                                { label: 'EDA', icon: BarChart3 },
                                { label: 'Feature Engineering', icon: Cpu },
                                { label: 'Training (Scikit‑Learn)', icon: Activity },
                                { label: 'Evaluation', icon: ShieldCheck },
                                { label: 'Deployment (FastAPI)', icon: Server },
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                    className="relative flex items-center gap-4"
                                >
                                    <div className="absolute -left-10 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">
                                        {index + 1}
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 flex-1 hover:border-primary/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <step.icon className="w-5 h-5 text-primary" />
                                            <span className="text-sm font-medium text-white">{step.label}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ---- Technology Stack ---- */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>Technology Stack</SectionTitle>
                    <SectionSubtitle>
                        Modern tools for performance and reliability.
                    </SectionSubtitle>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-6"
                    >
                        {[
                            { name: 'React', icon: '⚛️' },
                            { name: 'FastAPI', icon: '🚀' },
                            { name: 'Python', icon: '🐍' },
                            { name: 'Scikit‑Learn', icon: '🧠' },
                            { name: 'Tailwind CSS', icon: '🎨' },
                            { name: 'Vite', icon: '⚡' },
                            { name: 'GitHub', icon: '🐙' },
                            { name: 'Docker', icon: '🐳' },
                        ].map((tech) => (
                            <motion.div
                                key={tech.name}
                                variants={fadeInUp}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors group"
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{tech.icon}</div>
                                <div className="text-sm font-medium text-white">{tech.name}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ---- Statistics ---- */}
            <section className="py-24 bg-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle>Project Scale</SectionTitle>
                    <SectionSubtitle>
                        Built on a robust dataset and evaluated for enterprise deployment.
                    </SectionSubtitle>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCounter value={79} label="Features" icon={<Database className="w-6 h-6" />} />
                        <StatCounter value={610492} label="Records" suffix="+" icon={<Activity className="w-6 h-6" />} />
                        <StatCounter value={15} label="Attack Categories" suffix="+" icon={<Shield className="w-6 h-6" />} />
                        <StatCounter value={98} label="Accuracy" suffix="%" icon={<Award className="w-6 h-6" />} />
                    </div>
                </div>
            </section>

            {/* ---- Social Proof ---- */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
                    >
                        <div className="flex justify-center mb-4">
                            <ShieldCheck className="w-12 h-12 text-primary/60" />
                        </div>
                        <blockquote className="text-xl md:text-2xl font-light text-neutral-300 leading-relaxed">
                            “AI‑NIDS provides the visibility and speed our SOC needs. The ML models are accurate, and the dashboard is a game‑changer.”
                        </blockquote>
                        <div className="mt-6">
                            <div className="text-sm font-semibold text-white">– CISO, Global Financial Services</div>
                            <div className="text-xs text-neutral-400">Fortune 500 Enterprise</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---- Final CTA ---- */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Ready to Secure Your Network?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
                    >
                        Join leading enterprises that trust AI‑NIDS for real‑time threat detection.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link to="/dashboard">
                            <PrimaryButton size="lg" className="px-8">
                                Launch Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" />
                            </PrimaryButton>
                        </Link>
                        <SecondaryButton size="lg" className="px-8">
                            Explore Docs <ExternalLink className="w-4 h-4 ml-2 inline" />
                        </SecondaryButton>
                    </motion.div>
                </div>
            </section>

            {/* ---- Footer ---- */}
            <footer className="border-t border-white/5 bg-surface/30 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-6 h-6 text-primary" />
                                <span className="text-lg font-bold text-white">AI‑NIDS</span>
                            </div>
                            <p className="text-sm text-neutral-400">AI‑Powered Network Intrusion Detection &amp; Threat Analysis.</p>
                            <div className="flex gap-4 mt-4">
                                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-neutral-400 hover:text-white transition-colors"><ExternalLink className="w-5 h-5" /></a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#architecture" className="hover:text-white transition-colors">Architecture</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                            <p className="text-xs text-neutral-500 mt-4">© 2026 AI‑NIDS. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;