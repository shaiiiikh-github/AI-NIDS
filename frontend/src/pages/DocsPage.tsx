// src/pages/DocsPage.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Home,
  Sparkles,
  Zap,
  Database,
  Server,
  LayoutDashboard,
  GitBranch,
  Cpu,
  Globe,
  FileText,
  Clock,
  User,
  Tag,
  Bot,
  HelpCircle,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

// ---------- Types ----------
interface DocPage {
  id: string;
  title: string;
  content: string;
}

interface DocCategory {
  id: string;
  label: string;
  pages: DocPage[];
}

// ---------- Full Documentation Data ----------
const docData: DocCategory[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    pages: [
      {
        id: 'overview',
        title: 'Project Overview',
        content: `
          <h1>AI-NIDS: AI-Powered Network Intrusion Detection</h1>
          <p>AI-NIDS is an enterprise-grade cybersecurity platform that combines Data Mining, Machine Learning, FastAPI, and React to detect malicious network traffic in real time.</p>
          <p>This documentation covers architecture, API, ML pipeline, frontend, and deployment.</p>
          <div class="callout info">📘 AI-NIDS is open-source and community-driven.</div>
        `,
      },
      {
        id: 'quickstart',
        title: 'Quick Start',
        content: `
          <h1>Quick Start</h1>
          <p>Get AI-NIDS running locally in minutes.</p>
          <h2>Prerequisites</h2>
          <ul>
            <li>Python 3.9+</li>
            <li>Node.js 18+</li>
            <li>Git</li>
          </ul>
          <h2>Installation</h2>
          <pre><code>git clone https://github.com/your-repo/ai-nids.git
cd ai-nids
pip install -r requirements.txt
cd frontend && npm install</code></pre>
          <div class="callout tip">💡 Use a virtual environment for Python.</div>
        `,
      },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    pages: [
      {
        id: 'system-architecture',
        title: 'System Architecture',
        content: `
          <h1>System Architecture</h1>
          <p>AI-NIDS follows a modern microservices architecture with clear separation of concerns.</p>
          <h2>High-Level Components</h2>
          <ul>
            <li><strong>Data Mining Engine:</strong> Ingests and preprocesses network traffic.</li>
            <li><strong>ML Pipeline:</strong> Trains and serves Scikit‑Learn models.</li>
            <li><strong>FastAPI Backend:</strong> Provides REST APIs with OpenAPI documentation.</li>
            <li><strong>React Frontend:</strong> Interactive dashboard for telemetry and threat analysis.</li>
          </ul>
          <div class="diagram-placeholder">[System Architecture Diagram – SVG]</div>
        `,
      },
      {
        id: 'data-flow',
        title: 'Data Flow',
        content: `
          <h1>Data Flow</h1>
          <p>How a packet travels through the system:</p>
          <ol>
            <li><strong>Raw Packet Captured</strong> – Network interface captures traffic.</li>
            <li><strong>Preprocessing</strong> – Data is cleaned, normalised, and features are extracted.</li>
            <li><strong>Model Inference</strong> – The ML model predicts if the packet is malicious.</li>
            <li><strong>Post‑Processing</strong> – Results are aggregated and risk scores are calculated.</li>
            <li><strong>Dashboard Update</strong> – The React dashboard displays the result in real time.</li>
          </ol>
        `,
      },
    ],
  },
  {
    id: 'api',
    label: 'REST API',
    pages: [
      {
        id: 'api-overview',
        title: 'API Overview',
        content: `
          <h1>REST API Overview</h1>
          <p>FastAPI provides a fully documented REST API with automatic OpenAPI (Swagger) UI.</p>
          <h2>Endpoints</h2>
          <table>
            <thead><tr><th>Method</th><th>Path</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td>POST</td><td>/predict</td><td>Submit a packet for prediction</td></tr>
              <tr><td>GET</td><td>/health</td><td>Check service health</td></tr>
              <tr><td>GET</td><td>/metrics</td><td>Get system metrics</td></tr>
            </tbody>
          </table>
          <h2>Example Request</h2>
          <pre><code>curl -X POST http://localhost:8000/predict \\
  -H "Content-Type: application/json" \\
  -d '{"sourceIP":"192.168.1.1","destinationIP":"10.0.0.1","protocol":"TCP","packetSize":512,"port":443}'</code></pre>
          <div class="callout note">🔐 Authentication is required for production endpoints.</div>
        `,
      },
      {
        id: 'authentication',
        title: 'Authentication',
        content: `
          <h1>Authentication</h1>
          <p>API requests must include a JWT token in the <code>Authorization</code> header.</p>
          <pre><code>Authorization: Bearer <your-token></code></pre>
          <p>Tokens are obtained via the <code>/auth/login</code> endpoint.</p>
        `,
      },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    pages: [
      {
        id: 'frontend-architecture',
        title: 'Frontend Architecture',
        content: `
          <h1>Frontend Architecture</h1>
          <p>The React dashboard uses a component‑based architecture with the following key modules:</p>
          <ul>
            <li><strong>Layout:</strong> DashboardLayout with sidebar and header</li>
            <li><strong>Pages:</strong> Dashboard, Prediction, Analytics, Model Info, Reports, Settings, About</li>
            <li><strong>Hooks:</strong> useDashboardData, useCopyToClipboard</li>
            <li><strong>Services:</strong> API client with Axios and React Query</li>
            <li><strong>UI Components:</strong> KPICard, ErrorBoundary, Skeleton loaders</li>
          </ul>
          <p>All pages are lazy‑loaded for performance. Dark mode is enforced for consistency.</p>
        `,
      },
      {
        id: 'components',
        title: 'Reusable Components',
        content: `
          <h1>Reusable Components</h1>
          <p>We maintain a library of reusable components to speed up development.</p>
          <ul>
            <li><strong>KPICard:</strong> Displays key metrics with trend indicators.</li>
            <li><strong>ErrorBoundary:</strong> Catches JavaScript errors in the UI.</li>
            <li><strong>RiskBadge:</strong> Shows threat risk levels (Safe, Low, Medium, High, Critical).</li>
          </ul>
        `,
      },
    ],
  },
  {
    id: 'ml-pipeline',
    label: 'ML Pipeline',
    pages: [
      {
        id: 'ml-overview',
        title: 'ML Pipeline Overview',
        content: `
          <h1>Machine Learning Pipeline</h1>
          <p>The ML pipeline is built using Scikit‑Learn and follows a standard workflow:</p>
          <ol>
            <li><strong>Data Collection:</strong> CIC-IDS2017 dataset</li>
            <li><strong>Preprocessing:</strong> Normalisation, handling missing values</li>
            <li><strong>Feature Engineering:</strong> Extracting 78 features</li>
            <li><strong>Model Training:</strong> Random Forest, XGBoost, Neural Networks</li>
            <li><strong>Evaluation:</strong> Accuracy, Precision, Recall, F1</li>
            <li><strong>Deployment:</strong> ONNX export, served via FastAPI</li>
          </ol>
          <div class="callout tip">💡 Use the provided notebook in <code>/notebooks</code> for experimentation.</div>
        `,
      },
      {
        id: 'dataset',
        title: 'Dataset',
        content: `
          <h1>Dataset</h1>
          <p>We use the <strong>CIC-IDS2017</strong> dataset, which contains 2.8 million records with 78 features across 15 attack categories.</p>
          <p>The dataset is publicly available and widely used for intrusion detection research.</p>
          <p>We performed extensive EDA to understand feature distributions and correlations.</p>
          <div class="callout warning">⚠️ The dataset contains imbalanced classes; we applied SMOTE for training.</div>
        `,
      },
    ],
  },
  {
    id: 'deployment',
    label: 'Deployment',
    pages: [
      {
        id: 'deployment-guide',
        title: 'Deployment Guide',
        content: `
          <h1>Deployment Guide</h1>
          <p>Deploy AI-NIDS to production using Docker and Kubernetes.</p>
          <h2>Docker</h2>
          <pre><code>docker build -t ai-nids .
docker run -p 8000:8000 ai-nids</code></pre>
          <h2>Kubernetes</h2>
          <p>We provide Helm charts for easy deployment on any Kubernetes cluster.</p>
        `,
      },
    ],
  },
  {
    id: 'contributing',
    label: 'Contributing',
    pages: [
      {
        id: 'contributing-guide',
        title: 'Contributing Guide',
        content: `
          <h1>Contributing to AI-NIDS</h1>
          <p>We welcome contributions! Please read our guidelines.</p>
          <h2>How to Contribute</h2>
          <ol>
            <li>Fork the repository.</li>
            <li>Create a feature branch.</li>
            <li>Make your changes.</li>
            <li>Submit a pull request.</li>
          </ol>
          <div class="callout info">📘 Please ensure your code passes all tests.</div>
        `,
      },
    ],
  },
];

// ---------- Helper ----------
const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// ---------- Main Component ----------
export const DocsPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // ---- Hotkeys for Command Palette ----
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setIsCommandPaletteOpen(true);
    setTimeout(() => commandInputRef.current?.focus(), 100);
  });

  // ---- Close command palette on Escape ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ---- Find current page ----
  const currentPage = useMemo(() => {
    if (!pageId) return docData[0]?.pages[0]; // fallback if no pageId
    for (const category of docData) {
      for (const page of category.pages) {
        if (page.id === pageId) return page;
      }
    }
    return docData[0]?.pages[0]; // fallback if not found
  }, [pageId]);

  const currentCategory = useMemo(() => {
    for (const category of docData) {
      if (category.pages.some(p => p.id === currentPage.id)) {
        return category;
      }
    }
    return docData[0];
  }, [currentPage]);

  const pageIndexInCategory = useMemo(() => {
    return currentCategory.pages.findIndex(p => p.id === currentPage.id);
  }, [currentCategory, currentPage]);

  const prevPage = useMemo(() => {
    if (pageIndexInCategory > 0) {
      return currentCategory.pages[pageIndexInCategory - 1];
    }
    const catIndex = docData.findIndex(c => c.id === currentCategory.id);
    if (catIndex > 0) {
      const prevCat = docData[catIndex - 1];
      return prevCat.pages[prevCat.pages.length - 1];
    }
    return null;
  }, [currentCategory, pageIndexInCategory]);

  const nextPage = useMemo(() => {
    if (pageIndexInCategory < currentCategory.pages.length - 1) {
      return currentCategory.pages[pageIndexInCategory + 1];
    }
    const catIndex = docData.findIndex(c => c.id === currentCategory.id);
    if (catIndex < docData.length - 1) {
      const nextCat = docData[catIndex + 1];
      return nextCat.pages[0];
    }
    return null;
  }, [currentCategory, pageIndexInCategory]);

  // ---- Toggle category ----
  const toggleCategory = (id: string) => {
    setCollapsedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // ---- Reading progress ----
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---- Scroll to top on page change ----
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage.id]);

  // ---- Filter sidebar pages ----
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return docData;
    const q = searchQuery.toLowerCase().trim();
    return docData
      .map(cat => ({
        ...cat,
        pages: cat.pages.filter(p =>
          p.title.toLowerCase().includes(q) ||
          stripHtml(p.content).toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.pages.length > 0);
  }, [searchQuery]);

  // ---- TOC ----
  const tocItems = useMemo(() => {
    const headings = currentPage.content.match(/<h2>(.*?)<\/h2>/g) || [];
    return headings.map((h, idx) => {
      const text = h.replace(/<\/?h2>/g, '');
      const id = `heading-${idx}`;
      return { text, id };
    });
  }, [currentPage]);

  // ---- Flatten pages for command palette ----
  const allPages = useMemo(() => {
    const pages: { id: string; title: string; category: string }[] = [];
    docData.forEach(cat => {
      cat.pages.forEach(p => {
        pages.push({ id: p.id, title: p.title, category: cat.label });
      });
    });
    return pages;
  }, []);

  const commandResults = useMemo(() => {
    if (!commandSearch.trim()) return allPages;
    const q = commandSearch.toLowerCase().trim();
    return allPages.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [commandSearch, allPages]);

  // ---- Keyboard navigation for command palette ----
  useEffect(() => {
    if (!isCommandPaletteOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, commandResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        const selected = commandResults[selectedIndex];
        if (selected) {
          navigate(`/docs/${selected.id}`);
          setIsCommandPaletteOpen(false);
          setCommandSearch('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, commandResults, selectedIndex, navigate]);

  // ---- Render content with code copy ----
  const renderContent = (html: string) => {
    const withCopy = html.replace(
      /<pre><code>(.*?)<\/code><\/pre>/gs,
      (_match, code) => {
        const encoded = code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `
          <div class="code-wrapper">
            <pre><code>${encoded}</code></pre>
            <button class="copy-btn" data-code="${encodeURIComponent(code)}">📋 Copy</button>
          </div>
        `;
      }
    );
    const withCallouts = withCopy
      .replace(/<div class="callout note">/g, '<div class="callout note">')
      .replace(/<div class="callout tip">/g, '<div class="callout tip">')
      .replace(/<div class="callout warning">/g, '<div class="callout warning">')
      .replace(/<div class="callout info">/g, '<div class="callout info">')
      .replace(/<table>/g, '<table class="docs-table">');
    return <div dangerouslySetInnerHTML={{ __html: withCallouts }} />;
  };

  // ---- Copy button click handler ----
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('copy-btn')) {
        const code = decodeURIComponent(target.dataset.code || '');
        if (code) {
          navigator.clipboard.writeText(code);
          // Optionally show a toast; for now just copy
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // ---- Quick navigation cards ----
  const quickCards = [
    { title: 'Quick Start', icon: <Zap className="w-5 h-5" />, slug: 'quickstart' },
    { title: 'Architecture', icon: <GitBranch className="w-5 h-5" />, slug: 'system-architecture' },
    { title: 'ML Pipeline', icon: <Cpu className="w-5 h-5" />, slug: 'ml-overview' },
    { title: 'REST API', icon: <Server className="w-5 h-5" />, slug: 'api-overview' },
    { title: 'Frontend', icon: <LayoutDashboard className="w-5 h-5" />, slug: 'frontend-architecture' },
    { title: 'Deployment', icon: <Globe className="w-5 h-5" />, slug: 'deployment-guide' },
    { title: 'Dataset', icon: <Database className="w-5 h-5" />, slug: 'dataset' },
    { title: 'Contributing', icon: <HelpCircle className="w-5 h-5" />, slug: 'contributing-guide' },
  ];

  const isHome = !pageId || pageId === '';

  return (
    <>
      {/* ---- Command Palette ---- */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24"
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-neutral-500 mr-3" />
                <input
                  ref={commandInputRef}
                  type="text"
                  placeholder="Search documentation..."
                  value={commandSearch}
                  onChange={(e) => {
                    setCommandSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-neutral-500 text-lg"
                  autoFocus
                />
                <kbd className="text-xs text-neutral-500 bg-white/5 px-2 py-1 rounded">ESC</kbd>
              </div>
              <div className="max-h-96 overflow-y-auto p-2">
                {commandResults.length === 0 ? (
                  <div className="p-4 text-center text-neutral-500">No results found</div>
                ) : (
                  <ul className="space-y-0.5">
                    {commandResults.map((page, idx) => (
                      <motion.li
                        key={page.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        <button
                          onClick={() => {
                            navigate(`/docs/${page.id}`);
                            setIsCommandPaletteOpen(false);
                            setCommandSearch('');
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-left ${
                            idx === selectedIndex
                              ? 'bg-primary/20 text-white'
                              : 'text-neutral-300 hover:bg-white/5'
                          }`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <span className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-neutral-500" />
                            <span>{page.title}</span>
                          </span>
                          <span className="text-xs text-neutral-500 bg-white/5 px-2 py-0.5 rounded">
                            {page.category}
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Main Layout ---- */}
      <div className="h-screen flex flex-col bg-[#0B1220] text-white font-sans overflow-hidden">
        {/* Header */}
        <header className="shrink-0 bg-surface/80 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center justify-between z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-neutral-400 hover:text-white"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/docs" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold tracking-tight">AI-NIDS</span>
              <span className="hidden sm:inline text-xs text-neutral-500 font-mono bg-white/5 px-2 py-0.5 rounded">Docs</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsCommandPaletteOpen(true);
                setTimeout(() => commandInputRef.current?.focus(), 100);
              }}
              className="hidden md:flex items-center gap-2 text-sm text-neutral-400 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Search docs...</span>
              <kbd className="text-xs bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>

            {/* GitHub icon – custom SVG */}
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition-colors p-1.5"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <Link
              to="/"
              className="text-neutral-400 hover:text-white transition-colors p-1.5 hidden md:block"
              aria-label="Landing page"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Main body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`
              fixed md:static inset-y-0 left-0 z-30 w-72 bg-surface/95 backdrop-blur-md border-r border-white/10 p-4 overflow-y-auto transition-transform duration-300
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-white">Docs</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Filter articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <nav className="space-y-2">
              {filteredCategories.map((category) => {
                const isCollapsed = collapsedCategories.includes(category.id);
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-neutral-300 hover:text-white transition-colors rounded"
                    >
                      <span>{category.label}</span>
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {!isCollapsed && (
                      <div className="ml-2 space-y-1">
                        {category.pages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => {
                              navigate(`/docs/${page.id}`);
                              setSidebarOpen(false);
                              setSearchQuery('');
                            }}
                            className={`
                              w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left
                              ${currentPage.id === page.id
                                ? 'bg-primary/20 text-primary'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            {currentPage.id === page.id && (
                              <ChevronRight className="w-4 h-4 text-primary" />
                            )}
                            <span>{page.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 relative">
            <div className="max-w-4xl mx-auto">
              {isHome ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center text-center pt-12"
                >
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20 mb-6">
                    <Sparkles className="w-4 h-4" />
                    Enterprise Documentation
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white max-w-3xl">
                    Welcome to the AI‑NIDS <br />
                    <span className="text-primary">Documentation</span>
                  </h1>
                  <p className="mt-4 text-lg text-neutral-400 max-w-2xl">
                    Everything you need to understand, deploy, and extend the AI‑NIDS platform.
                  </p>

                  <div className="mt-8 w-full max-w-xl relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search the docs..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                      onClick={() => {
                        setIsCommandPaletteOpen(true);
                        setTimeout(() => commandInputRef.current?.focus(), 100);
                      }}
                    />
                    <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 bg-white/10 px-2 py-1 rounded hidden sm:block">
                      ⌘K
                    </kbd>
                  </div>

                  <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                    {quickCards.map((card) => (
                      <motion.button
                        key={card.slug}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/docs/${card.slug}`)}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left hover:border-primary/40 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          {card.icon}
                        </div>
                        <h3 className="font-semibold text-white text-sm">{card.title}</h3>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentPage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <nav className="text-sm text-neutral-400 mb-6 flex items-center gap-2 flex-wrap">
                    <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white">{currentPage.title}</span>
                  </nav>

                  <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                      {currentPage.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> 5 min read
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4" /> v2.4.0
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" /> Team
                      </span>
                    </div>
                  </div>

                  <div className="docs-content prose prose-invert max-w-none">
                    {renderContent(currentPage.content)}
                  </div>

                  <div className="flex justify-between mt-12 pt-6 border-t border-white/10">
                    {prevPage ? (
                      <button
                        onClick={() => navigate(`/docs/${prevPage.id}`)}
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>{prevPage.title}</span>
                      </button>
                    ) : <div />}
                    {nextPage && (
                      <button
                        onClick={() => navigate(`/docs/${nextPage.id}`)}
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
                      >
                        <span>{nextPage.title}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </main>

          {/* Right Panel (only for articles) */}
          {!isHome && (
            <aside className="hidden xl:block w-64 shrink-0 border-l border-white/10 p-6 overflow-y-auto sticky top-0 h-screen">
              <div className="mb-6">
                <div className="flex justify-between text-xs text-neutral-400 mb-1">
                  <span>Reading progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {tocItems.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    On this page
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-neutral-400 hover:text-white transition-colors block py-1"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mb-6">
                <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
                  <Bot className="w-4 h-4" /> AI Summary
                </div>
                <p className="text-xs text-neutral-300">
                  This article covers the core architecture of AI‑NIDS, including data flow and component interactions.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Related
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link to="/docs/quickstart" className="text-neutral-400 hover:text-white transition-colors">
                      Quick Start
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/api-overview" className="text-neutral-400 hover:text-white transition-colors">
                      API Overview
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ---- Global styles ---- */}
      <style>{`
        .docs-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 2rem 0 1rem;
          color: white;
          letter-spacing: -0.02em;
        }
        .docs-content h2 {
          font-size: 1.8rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          color: white;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          scroll-margin-top: 5rem;
        }
        .docs-content h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem;
          color: #e5e7eb;
        }
        .docs-content p {
          margin: 1rem 0;
          color: #d1d5db;
          line-height: 1.8;
        }
        .docs-content ul, .docs-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
          color: #d1d5db;
        }
        .docs-content li {
          margin: 0.5rem 0;
        }
        .docs-content code.inline-code {
          background: rgba(255,255,255,0.08);
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9rem;
          color: #e5e7eb;
          font-family: 'JetBrains Mono', monospace;
        }
        .docs-content .code-wrapper {
          position: relative;
          margin: 1.5rem 0;
        }
        .docs-content pre {
          background: #1f2937;
          border-radius: 0.75rem;
          padding: 1.5rem;
          overflow-x: auto;
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .docs-content pre code {
          font-family: 'JetBrains Mono', monospace;
          color: #e5e7eb;
          white-space: pre-wrap;
        }
        .docs-content .copy-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255,255,255,0.08);
          border: none;
          color: #9ca3af;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.75rem;
          transition: background 0.2s;
        }
        .docs-content .copy-btn:hover {
          background: rgba(255,255,255,0.15);
        }
        .docs-content .callout {
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          border-left: 4px solid;
          background: rgba(255,255,255,0.03);
        }
        .docs-content .callout.note {
          border-color: #3b82f6;
          color: #93c5fd;
        }
        .docs-content .callout.tip {
          border-color: #10b981;
          color: #6ee7b7;
        }
        .docs-content .callout.warning {
          border-color: #f59e0b;
          color: #fcd34d;
        }
        .docs-content .callout.info {
          border-color: #8b5cf6;
          color: #c4b5fd;
        }
        .docs-content table.docs-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9rem;
        }
        .docs-content table.docs-table th {
          background: rgba(255,255,255,0.05);
          color: #f9fafb;
          padding: 0.5rem 1rem;
          text-align: left;
          border-bottom: 2px solid rgba(255,255,255,0.1);
        }
        .docs-content table.docs-table td {
          padding: 0.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          color: #d1d5db;
        }
        .docs-content .diagram-placeholder {
          background: rgba(255,255,255,0.04);
          border: 2px dashed rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          padding: 2rem;
          text-align: center;
          color: #9ca3af;
          margin: 1.5rem 0;
        }
      `}</style>
    </>
  );
};

export default DocsPage;