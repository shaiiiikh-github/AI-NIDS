// src/pages/DocsPage.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  Terminal,
  Shield,
  Layers,
  Code2,
  Rocket,
  ExternalLink,
  Keyboard,
  Hash,
  Info,
  AlertTriangle,
  Lightbulb,
  Lock,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

// ---------- Types ----------
interface DocPage {
  id: string;
  title: string;
  description?: string;
  content: string;
  readTime?: number;
  lastUpdated?: string;
}

interface DocCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  pages: DocPage[];
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

// ---------- Category icon map ----------
const categoryIcons: Record<string, React.ReactNode> = {
  'getting-started': <Rocket className="w-4 h-4" />,
  architecture: <GitBranch className="w-4 h-4" />,
  api: <Server className="w-4 h-4" />,
  frontend: <LayoutDashboard className="w-4 h-4" />,
  'ml-pipeline': <Cpu className="w-4 h-4" />,
  deployment: <Globe className="w-4 h-4" />,
  contributing: <HelpCircle className="w-4 h-4" />,
};

// ---------- Full Documentation Data (enhanced) ----------
const docData: DocCategory[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: <Rocket className="w-4 h-4" />,
    pages: [
      {
        id: 'overview',
        title: 'Project Overview',
        description: 'High-level introduction to AI-NIDS platform',
        readTime: 4,
        lastUpdated: '2025-01-15',
        content: `
          <h1>AI-NIDS: AI-Powered Network Intrusion Detection</h1>
          <p>AI-NIDS is an enterprise-grade cybersecurity platform that combines <strong>Data Mining</strong>, <strong>Machine Learning</strong>, <strong>FastAPI</strong>, and <strong>React</strong> to detect malicious network traffic in real time.</p>
          <p>Built for security operations teams, AI-NIDS processes millions of packets per second and provides actionable threat intelligence through an intuitive dashboard.</p>

          <h2>Key Capabilities</h2>
          <ul>
            <li><strong>Real-time Detection:</strong> Sub-millisecond inference on network packets</li>
            <li><strong>Multi-model Support:</strong> Random Forest, XGBoost, and Neural Network ensembles</li>
            <li><strong>78 Feature Extraction:</strong> Comprehensive flow-based feature engineering</li>
            <li><strong>RESTful API:</strong> Fully documented FastAPI backend with OpenAPI schema</li>
            <li><strong>Interactive Dashboard:</strong> React-based UI with real-time telemetry</li>
            <li><strong>ONNX Export:</strong> Optimized model serving for production workloads</li>
          </ul>

          <h2>Tech Stack</h2>
          <table>
            <thead><tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td>Frontend</td><td>React 18 + TypeScript</td><td>Dashboard & visualization</td></tr>
              <tr><td>Backend</td><td>FastAPI + Uvicorn</td><td>REST API & model serving</td></tr>
              <tr><td>ML</td><td>Scikit-learn + XGBoost</td><td>Training & inference</td></tr>
              <tr><td>Data</td><td>Pandas + NumPy</td><td>Preprocessing & EDA</td></tr>
              <tr><td>Deployment</td><td>Docker + Kubernetes</td><td>Container orchestration</td></tr>
            </tbody>
          </table>

          <div class="callout info">📘 AI-NIDS is open-source and community-driven. Contributions are welcome!</div>
        `,
      },
      {
        id: 'quickstart',
        title: 'Quick Start',
        description: 'Get AI-NIDS running locally in minutes',
        readTime: 6,
        lastUpdated: '2025-01-20',
        content: `
          <h1>Quick Start</h1>
          <p>Get AI-NIDS running locally in under five minutes.</p>

          <h2>Prerequisites</h2>
          <ul>
            <li>Python 3.9+ (recommended: 3.11)</li>
            <li>Node.js 18+ (recommended: 20 LTS)</li>
            <li>Git 2.30+</li>
            <li>Docker (optional, for containerized deployment)</li>
          </ul>

          <h2>Clone & Install</h2>
          <pre><code>git clone https://github.com/your-repo/ai-nids.git
cd ai-nids

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\\Scripts\\activate  # Windows

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install</code></pre>

          <h2>Start Development Servers</h2>
          <pre><code># Terminal 1: Backend
cd ai-nids
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd ai-nids/frontend
npm run dev</code></pre>

          <p>Open <code>http://localhost:3000</code> to access the dashboard. The API will be available at <code>http://localhost:8000</code> with Swagger UI at <code>/docs</code>.</p>

          <div class="callout tip">💡 Use <code>pip install -r requirements.txt --quiet</code> to suppress verbose output during installation.</div>
          <div class="callout warning">⚠️ Ensure port 8000 and 3000 are not in use before starting the servers.</div>
        `,
      },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: <GitBranch className="w-4 h-4" />,
    pages: [
      {
        id: 'system-architecture',
        title: 'System Architecture',
        description: 'Microservices architecture and component design',
        readTime: 7,
        lastUpdated: '2025-01-18',
        content: `
          <h1>System Architecture</h1>
          <p>AI-NIDS follows a modern microservices architecture with clear separation of concerns, enabling independent scaling and deployment of each component.</p>

          <h2>High-Level Components</h2>
          <ul>
            <li><strong>Data Mining Engine:</strong> Ingests raw network traffic (PCAP/NetFlow), performs cleaning, normalization, and feature extraction into a 78-dimensional feature vector.</li>
            <li><strong>ML Pipeline:</strong> Trains ensemble models (Random Forest + XGBoost) on the CIC-IDS2017 dataset, exports to ONNX for optimized inference.</li>
            <li><strong>FastAPI Backend:</strong> Provides REST APIs with automatic OpenAPI documentation, JWT authentication, and async request handling.</li>
            <li><strong>React Frontend:</strong> Interactive dashboard with real-time telemetry, threat analysis charts, and model performance metrics.</li>
          </ul>

          <h2>Component Diagram</h2>
          <div class="diagram-box">
            <div class="diagram-row">
              <div class="diagram-node primary">Network Interface</div>
              <div class="diagram-arrow">→</div>
              <div class="diagram-node primary">Data Mining Engine</div>
              <div class="diagram-arrow">→</div>
              <div class="diagram-node accent">ML Inference</div>
            </div>
            <div class="diagram-row" style="margin-top: 1rem;">
              <div class="diagram-node secondary">FastAPI</div>
              <div class="diagram-arrow">↕</div>
              <div class="diagram-node secondary">React Dashboard</div>
              <div class="diagram-arrow">→</div>
              <div class="diagram-node muted">User / SOC Analyst</div>
            </div>
          </div>

          <h2>Design Principles</h2>
          <ul>
            <li><strong>Loose Coupling:</strong> Each service communicates via well-defined APIs</li>
            <li><strong>High Cohesion:</strong> Related functionality is grouped within services</li>
            <li><strong>Fail-Safe:</strong> Graceful degradation when ML model is unavailable</li>
            <li><strong>Observable:</strong> Structured logging, metrics, and health checks</li>
          </ul>
        `,
      },
      {
        id: 'data-flow',
        title: 'Data Flow',
        description: 'How packets travel through the detection pipeline',
        readTime: 5,
        lastUpdated: '2025-01-18',
        content: `
          <h1>Data Flow</h1>
          <p>Understanding how a network packet is processed from capture to dashboard display.</p>

          <h2>Pipeline Stages</h2>
          <ol>
            <li><strong>Raw Packet Capture</strong> — Network interface captures traffic in real time using libpcap or similar.</li>
            <li><strong>Flow Aggregation</strong> — Individual packets are aggregated into bi-directional network flows based on 5-tuple (src_ip, dst_ip, src_port, dst_port, protocol).</li>
            <li><strong>Feature Extraction</strong> — 78 statistical features are computed per flow: packet count, byte count, duration, inter-arrival time statistics, flag distributions, etc.</li>
            <li><strong>Normalization</strong> — Features are scaled using a pre-fitted StandardScaler to match training distribution.</li>
            <li><strong>Model Inference</strong> — The ONNX model produces a probability distribution across attack classes.</li>
            <li><strong>Post-Processing</strong> — Results are aggregated, risk scores calculated, and alerts generated based on configurable thresholds.</li>
            <li><strong>Dashboard Update</strong> — The React dashboard receives updates via WebSocket/SSE and displays results in real time.</li>
          </ol>

          <h2>Latency Budget</h2>
          <table>
            <thead><tr><th>Stage</th><th>Target Latency</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>Capture + Aggregation</td><td>&lt; 1ms</td><td>Kernel-level, highly optimized</td></tr>
              <tr><td>Feature Extraction</td><td>&lt; 2ms</td><td>Vectorized NumPy operations</td></tr>
              <tr><td>Model Inference</td><td>&lt; 1ms</td><td>ONNX Runtime with SIMD</td></tr>
              <tr><td>API + Serialization</td><td>&lt; 2ms</td><td>FastAPI async + msgpack</td></tr>
              <tr><td><strong>Total</strong></td><td><strong>&lt; 6ms</strong></td><td><strong>End-to-end per flow</strong></td></tr>
            </tbody>
          </table>

          <div class="callout note">🔒 All packet payloads are discarded after feature extraction. No raw data is stored or transmitted.</div>
        `,
      },
    ],
  },
  {
    id: 'api',
    label: 'REST API',
    icon: <Server className="w-4 h-4" />,
    pages: [
      {
        id: 'api-overview',
        title: 'API Overview',
        description: 'REST API endpoints and usage patterns',
        readTime: 8,
        lastUpdated: '2025-01-22',
        content: `
          <h1>REST API Overview</h1>
          <p>FastAPI provides a fully documented REST API with automatic OpenAPI (Swagger) UI available at <code>/docs</code> when the server is running.</p>

          <h2>Base URL</h2>
          <pre><code>http://localhost:8000/api/v1</code></pre>

          <h2>Endpoints</h2>
          <table>
            <thead><tr><th>Method</th><th>Path</th><th>Description</th><th>Auth</th></tr></thead>
            <tbody>
              <tr><td><span class="method post">POST</span></td><td>/predict</td><td>Submit a packet for prediction</td><td>Required</td></tr>
              <tr><td><span class="method get">GET</span></td><td>/predict/batch</td><td>Submit multiple packets</td><td>Required</td></tr>
              <tr><td><span class="method get">GET</span></td><td>/health</td><td>Check service health</td><td>None</td></tr>
              <tr><td><span class="method get">GET</span></td><td>/metrics</td><td>Get system metrics</td><td>Required</td></tr>
              <tr><td><span class="method get">GET</span></td><td>/model/info</td><td>Get model metadata</td><td>None</td></tr>
              <tr><td><span class="method post">POST</span></td><td>/auth/login</td><td>Obtain JWT token</td><td>None</td></tr>
            </tbody>
          </table>

          <h2>Example: Single Prediction</h2>
          <pre><code>curl -X POST http://localhost:8000/api/v1/predict \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGci..." \\
  -d '{
    "sourceIP": "192.168.1.1",
    "destinationIP": "10.0.0.1",
    "protocol": "TCP",
    "packetSize": 512,
    "port": 443,
    "flowDuration": 1200,
    "totalFwdPackets": 5,
    "totalBackwardPackets": 3
  }'</code></pre>

          <h2>Response Format</h2>
          <pre><code>{
  "prediction": "Benign",
  "confidence": 0.9742,
  "riskScore": 2,
  "riskLevel": "Low",
  "probabilities": {
    "Benign": 0.9742,
    "DoS": 0.0121,
    "PortScan": 0.0089,
    "BruteForce": 0.0031,
    "Other": 0.0017
  },
  "modelVersion": "2.4.0",
  "inferenceTimeMs": 0.43
}</code></pre>

          <div class="callout note">🔐 All production endpoints require a valid JWT token. Tokens expire after 24 hours.</div>
          <div class="callout tip">💡 Use the interactive Swagger UI at <code>/docs</code> for exploratory testing without curl.</div>
        `,
      },
      {
        id: 'authentication',
        title: 'Authentication',
        description: 'JWT-based authentication flow',
        readTime: 4,
        lastUpdated: '2025-01-20',
        content: `
          <h1>Authentication</h1>
          <p>AI-NIDS uses JSON Web Tokens (JWT) for API authentication. All protected endpoints require a valid token in the <code>Authorization</code> header.</p>

          <h2>Obtaining a Token</h2>
          <pre><code>curl -X POST http://localhost:8000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username": "analyst", "password": "your-password"}'</code></pre>

          <h2>Using the Token</h2>
          <pre><code>Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code></pre>

          <h2>Token Lifecycle</h2>
          <ul>
            <li>Access tokens expire after <strong>24 hours</strong></li>
            <li>Refresh tokens expire after <strong>7 days</strong></li>
            <li>Use <code>/auth/refresh</code> to obtain a new access token</li>
          </ul>

          <div class="callout warning">⚠️ Never expose your JWT token in client-side code or public repositories.</div>
        `,
      },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: <LayoutDashboard className="w-4 h-4" />,
    pages: [
      {
        id: 'frontend-architecture',
        title: 'Frontend Architecture',
        description: 'React component structure and patterns',
        readTime: 6,
        lastUpdated: '2025-01-19',
        content: `
          <h1>Frontend Architecture</h1>
          <p>The React dashboard uses a component-based architecture with TypeScript for type safety and Framer Motion for fluid animations.</p>

          <h2>Project Structure</h2>
          <pre><code>frontend/src/
├── components/       # Reusable UI components
│   ├── ui/          # Primitives (Button, Card, Badge)
│   ├── layout/      # DashboardLayout, Sidebar, Header
│   └── charts/      # Recharts-based visualizations
├── pages/           # Route-level components
├── hooks/           # Custom React hooks
├── services/        # API client & data fetching
├── stores/          # Zustand state management
├── types/           # TypeScript interfaces
└── utils/           # Helper functions</code></pre>

          <h2>Key Modules</h2>
          <ul>
            <li><strong>Layout:</strong> DashboardLayout with responsive sidebar and header</li>
            <li><strong>Pages:</strong> Dashboard, Prediction, Analytics, Model Info, Reports, Settings, About</li>
            <li><strong>Hooks:</strong> useDashboardData, useCopyToClipboard, useDebounce</li>
            <li><strong>Services:</strong> API client with Axios and React Query for caching</li>
            <li><strong>UI Components:</strong> KPICard, ErrorBoundary, Skeleton loaders, RiskBadge</li>
          </ul>

          <p>All pages are <strong>lazy-loaded</strong> via React.lazy() and Suspense for optimal initial bundle size. Dark mode is enforced for consistency with the cybersecurity theme.</p>

          <div class="callout info">📘 We use Zustand for state management instead of Redux for simpler boilerplate and better TypeScript support.</div>
        `,
      },
      {
        id: 'components',
        title: 'Reusable Components',
        description: 'Component library and design system',
        readTime: 5,
        lastUpdated: '2025-01-19',
        content: `
          <h1>Reusable Components</h1>
          <p>A curated library of components ensures consistency and accelerates development.</p>

          <h2>Core Components</h2>
          <ul>
            <li><strong>KPICard:</strong> Displays key metrics with trend indicators, sparklines, and color-coded status.</li>
            <li><strong>ErrorBoundary:</strong> Catches JavaScript errors in the UI tree and displays a recovery interface.</li>
            <li><strong>RiskBadge:</strong> Shows threat risk levels (Safe, Low, Medium, High, Critical) with semantic colors.</li>
            <li><strong>Skeleton:</strong> Content placeholder with shimmer animation for loading states.</li>
            <li><strong>DataTable:</strong> Sortable, filterable table with pagination and row selection.</li>
          </ul>

          <h2>Design Tokens</h2>
          <p>All components use a centralized token system for colors, spacing, typography, and shadows, ensuring visual consistency across the application.</p>

          <div class="callout tip">💡 Run <code>npm run storybook</code> to browse the full component library in isolation.</div>
        `,
      },
    ],
  },
  {
    id: 'ml-pipeline',
    label: 'ML Pipeline',
    icon: <Cpu className="w-4 h-4" />,
    pages: [
      {
        id: 'ml-overview',
        title: 'ML Pipeline Overview',
        description: 'Training workflow and model architecture',
        readTime: 9,
        lastUpdated: '2025-01-21',
        content: `
          <h1>Machine Learning Pipeline</h1>
          <p>The ML pipeline is built using Scikit-learn and XGBoost, following a rigorous workflow from data collection to production deployment.</p>

          <h2>Pipeline Stages</h2>
          <ol>
            <li><strong>Data Collection:</strong> CIC-IDS2017 dataset (2.8M records, 78 features, 15 attack categories)</li>
            <li><strong>Exploratory Data Analysis:</strong> Distribution analysis, correlation matrices, outlier detection</li>
            <li><strong>Preprocessing:</strong> Missing value imputation (median), infinite value handling, encoding</li>
            <li><strong>Feature Engineering:</strong> 78 flow-based features including temporal, volumetric, and flag-based</li>
            <li><strong>Class Balancing:</strong> SMOTE oversampling for minority classes</li>
            <li><strong>Model Training:</strong> Random Forest, XGBoost, and Neural Network with hyperparameter tuning</li>
            <li><strong>Evaluation:</strong> Stratified k-fold CV with Accuracy, Precision, Recall, F1, AUC-ROC</li>
            <li><strong>Export:</strong> ONNX format for optimized inference via ONNX Runtime</li>
          </ol>

          <h2>Model Performance</h2>
          <table>
            <thead><tr><th>Model</th><th>Accuracy</th><th>F1 Score</th><th>AUC-ROC</th><th>Inference (ms)</th></tr></thead>
            <tbody>
              <tr><td>Random Forest</td><td>99.42%</td><td>0.9891</td><td>0.9997</td><td>0.8</td></tr>
              <tr><td>XGBoost</td><td>99.56%</td><td>0.9932</td><td>0.9998</td><td>0.4</td></tr>
              <tr><td>Neural Network</td><td>99.38%</td><td>0.9887</td><td>0.9996</td><td>0.6</td></tr>
            </tbody>
          </table>

          <div class="callout tip">💡 Use the provided Jupyter notebook in <code>/notebooks</code> for experimentation and custom training runs.</div>
        `,
      },
      {
        id: 'dataset',
        title: 'Dataset',
        description: 'CIC-IDS2017 dataset details and preprocessing',
        readTime: 5,
        lastUpdated: '2025-01-17',
        content: `
          <h1>Dataset</h1>
          <p>We use the <strong>CIC-IDS2017</strong> dataset from the Canadian Institute for Cybersecurity, the gold standard for network intrusion detection research.</p>

          <h2>Dataset Statistics</h2>
          <table>
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Total Records</td><td>2,830,743</td></tr>
              <tr><td>Features</td><td>78 (after engineering)</td></tr>
              <tr><td>Attack Categories</td><td>15</td></tr>
              <tr><td>Benign Ratio</td><td>83.1%</td></tr>
              <tr><td>Duration</td><td>5 days (Mon–Fri)</td></tr>
              <tr><td>Format</td><td>CSV (PCAP-derived)</td></tr>
            </tbody>
          </table>

          <h2>Attack Categories</h2>
          <ul>
            <li>DoS (Denial of Service) — SSH, Hulk, GoldenEye, Slowloris, Slowhttptest</li>
            <li>DDoS (Distributed DoS) — DDoS, LOIC, HOIC</li>
            <li>Brute Force — FTP, SSH</li>
            <li>Web Attacks — XSS, SQL Injection, Brute Force</li>
            <li>Port Scanning — Nmap</li>
            <li>Botnet — Ares</li>
            <li>Infiltration — Dropper</li>
          </ul>

          <div class="callout warning">⚠️ The dataset is heavily imbalanced (83% benign). We applied SMOTE with k=5 neighbors for minority class oversampling during training.</div>
        `,
      },
    ],
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: <Globe className="w-4 h-4" />,
    pages: [
      {
        id: 'deployment-guide',
        title: 'Deployment Guide',
        description: 'Docker and Kubernetes deployment instructions',
        readTime: 7,
        lastUpdated: '2025-01-22',
        content: `
          <h1>Deployment Guide</h1>
          <p>Deploy AI-NIDS to production using Docker for simple setups or Kubernetes for scalable, highly-available deployments.</p>

          <h2>Docker Compose (Recommended for Staging)</h2>
          <pre><code>version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/models/best_model.onnx
      - LOG_LEVEL=info
    volumes:
      - ./models:/app/models:ro

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend</code></pre>

          <h2>Kubernetes (Production)</h2>
          <p>We provide Helm charts for easy deployment on any Kubernetes cluster.</p>
          <pre><code># Install the Helm chart
helm install ai-nids ./helm/ai-nids \\
  --namespace security \\
  --create-namespace \\
  --set backend.replicaCount=3 \\
  --set backend.resources.requests.cpu=500m \\
  --set backend.resources.limits.cpu=2000m</code></pre>

          <h2>Environment Variables</h2>
          <table>
            <thead><tr><th>Variable</th><th>Default</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>MODEL_PATH</code></td><td>./models/best_model.onnx</td><td>Path to ONNX model file</td></tr>
              <tr><td><code>LOG_LEVEL</code></td><td>info</td><td>Logging verbosity</td></tr>
              <tr><td><code>JWT_SECRET</code></td><td>(required)</td><td>JWT signing secret</td></tr>
              <tr><td><code>CORS_ORIGINS</code></td><td>http://localhost:3000</td><td>Allowed CORS origins</td></tr>
            </tbody>
          </table>

          <div class="callout warning">⚠️ Always set a strong <code>JWT_SECRET</code> in production. Never use the default value.</div>
        `,
      },
    ],
  },
  {
    id: 'contributing',
    label: 'Contributing',
    icon: <HelpCircle className="w-4 h-4" />,
    pages: [
      {
        id: 'contributing-guide',
        title: 'Contributing Guide',
        description: 'How to contribute to AI-NIDS',
        readTime: 4,
        lastUpdated: '2025-01-16',
        content: `
          <h1>Contributing to AI-NIDS</h1>
          <p>We welcome contributions from the community! Whether it's a bug fix, new feature, documentation improvement, or dataset enhancement — every contribution matters.</p>

          <h2>Getting Started</h2>
          <ol>
            <li><strong>Fork</strong> the repository on GitHub</li>
            <li><strong>Clone</strong> your fork locally</li>
            <li><strong>Create a branch</strong> with a descriptive name: <code>feat/new-detector</code></li>
            <li><strong>Make changes</strong> with clear commit messages</li>
            <li><strong>Run tests:</strong> <code>pytest tests/</code> and <code>npm test</code></li>
            <li><strong>Submit a PR</strong> against the <code>main</code> branch</li>
          </ol>

          <h2>Code Style</h2>
          <ul>
            <li>Python: Follow PEP 8, use <code>black</code> and <code>isort</code></li>
            <li>TypeScript: Follow the existing patterns, use <code>prettier</code></li>
            <li>Commits: Follow Conventional Commits (<code>feat:</code>, <code>fix:</code>, <code>docs:</code>)</li>
          </ul>

          <div class="callout info">📘 Please ensure all CI checks pass before submitting a pull request.</div>
        `,
      },
    ],
  },
];

// ---------- Helpers ----------
const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const detectLanguage = (code: string): string => {
  if (code.includes('pip install') || code.includes('python') || code.includes('def ') || code.includes('import '))
    return 'Python';
  if (code.includes('npm ') || code.includes('npx ') || code.includes('console.') || code.includes('const '))
    return 'TypeScript';
  if (code.includes('curl ') || code.includes('http://') || code.includes('https://'))
    return 'Bash';
  if (code.includes('version:') || code.includes('services:') || code.includes('image:'))
    return 'YAML';
  if (code.includes('helm '))
    return 'Bash';
  return 'Code';
};

// ---------- Callout icon map ----------
const calloutIcons: Record<string, React.ReactNode> = {
  note: <Lock className="w-4 h-4" />,
  tip: <Lightbulb className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
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
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const commandInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);

  // ---- Toast helper ----
  const addToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  // ---- Hotkeys ----
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setIsCommandPaletteOpen(true);
    setTimeout(() => commandInputRef.current?.focus(), 100);
  });

  useHotkeys('mod+/', (e) => {
    e.preventDefault();
    setShowShortcuts((prev) => !prev);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ---- Find current page ----
  const currentPage = useMemo(() => {
    if (!pageId) return docData[0]?.pages[0];
    for (const category of docData) {
      for (const page of category.pages) {
        if (page.id === pageId) return page;
      }
    }
    return docData[0]?.pages[0];
  }, [pageId]);

  const currentCategory = useMemo(() => {
    for (const category of docData) {
      if (category.pages.some((p) => p.id === currentPage.id)) {
        return category;
      }
    }
    return docData[0];
  }, [currentPage]);

  const pageIndexInCategory = useMemo(
    () => currentCategory.pages.findIndex((p) => p.id === currentPage.id),
    [currentCategory, currentPage]
  );

  const prevPage = useMemo(() => {
    if (pageIndexInCategory > 0) return currentCategory.pages[pageIndexInCategory - 1];
    const catIndex = docData.findIndex((c) => c.id === currentCategory.id);
    if (catIndex > 0) {
      const prevCat = docData[catIndex - 1];
      return prevCat.pages[prevCat.pages.length - 1];
    }
    return null;
  }, [currentCategory, pageIndexInCategory]);

  const nextPage = useMemo(() => {
    if (pageIndexInCategory < currentCategory.pages.length - 1) return currentCategory.pages[pageIndexInCategory + 1];
    const catIndex = docData.findIndex((c) => c.id === currentCategory.id);
    if (catIndex < docData.length - 1) {
      const nextCat = docData[catIndex + 1];
      return nextCat.pages[0];
    }
    return null;
  }, [currentCategory, pageIndexInCategory]);

  // ---- Toggle category ----
  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  // ---- Reading progress & scroll-to-top ----
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowScrollTop(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---- Scroll to top on page change ----
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFeedbackGiven(null);
  }, [currentPage.id]);

  // ---- Scroll spy for TOC ----
  useEffect(() => {
    const headings = mainContentRef.current?.querySelectorAll('h2[id]') || [];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [currentPage.id]);

  // ---- Filter sidebar ----
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return docData;
    const q = searchQuery.toLowerCase().trim();
    return docData
      .map((cat) => ({
        ...cat,
        pages: cat.pages.filter(
          (p) => p.title.toLowerCase().includes(q) || stripHtml(p.content).toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.pages.length > 0);
  }, [searchQuery]);

  // ---- TOC from content ----
  const tocItems = useMemo(() => {
    const headings = currentPage.content.match(/<h2>(.*?)<\/h2>/g) || [];
    return headings.map((h) => {
      const text = h.replace(/<\/?h2>/g, '');
      const id = `heading-${slugify(text)}`;
      return { text, id };
    });
  }, [currentPage]);

  // ---- Flatten pages for command palette ----
  const allPages = useMemo(() => {
    const pages: { id: string; title: string; category: string; description?: string }[] = [];
    docData.forEach((cat) => {
      cat.pages.forEach((p) => {
        pages.push({ id: p.id, title: p.title, category: cat.label, description: p.description });
      });
    });
    return pages;
  }, []);

  const commandResults = useMemo(() => {
    if (!commandSearch.trim()) return allPages;
    const q = commandSearch.toLowerCase().trim();
    return allPages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [commandSearch, allPages]);

  // ---- Keyboard nav for command palette ----
  useEffect(() => {
    if (!isCommandPaletteOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, commandResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
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

  // ---- Render content ----
  const renderContent = (html: string) => {
    // 1. Add IDs to h2
    let processed = html.replace(/<h2>(.*?)<\/h2>/g, (_, text) => {
      const id = `heading-${slugify(text)}`;
      return `<h2 id="${id}">${text}</h2>`;
    });

    // 2. Replace block code with placeholders
    const codeBlocks: string[] = [];
    processed = processed.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_match, code) => {
      const lang = detectLanguage(code);
      const idx = codeBlocks.length;
      codeBlocks.push(
        `<div class="code-block"><div class="code-header"><span class="code-lang">${lang}</span><button class="copy-btn" data-code="${encodeURIComponent(
          code
        )}"><span class="copy-icon-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span><span class="copied-icon-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> Copy</button></div><pre><code>${code}</code></pre></div>`
      );
      return `__CODE_BLOCK_${idx}__`;
    });

    // 3. Style inline code (remaining <code> tags)
    processed = processed.replace(/<code>(.*?)<\/code>/g, '<code class="inline-code">$1</code>');

    // 4. Style tables
    processed = processed.replace(/<table>/g, '<table class="docs-table">');

    // 5. Style callouts with icons
    processed = processed.replace(
      /<div class="callout (note|tip|warning|info)">(.*?)<\/div>/gs,
      (match, type, content) => {
        return `<div class="callout ${type}"><div class="callout-icon">${type}</div><div class="callout-content">${content}</div></div>`;
      }
    );

    // 6. Style method badges
    processed = processed.replace(
      /<span class="method (get|post|put|delete|patch)">(.*?)<\/span>/g,
      '<span class="method-badge $1">$2</span>'
    );

    // 7. Style diagram boxes
    processed = processed.replace(
      /<div class="diagram-box">([\s\S]*?)<\/div>/g,
      '<div class="diagram-box">$1</div>'
    );

    // 8. Restore code blocks
    codeBlocks.forEach((block, idx) => {
      processed = processed.replace(`__CODE_BLOCK_${idx}__`, block);
    });

    return <div dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  // ---- Copy button handler ----
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.copy-btn') as HTMLElement;
      if (btn) {
        const code = decodeURIComponent(btn.dataset.code || '');
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            btn.classList.add('copied');
            addToast('Copied to clipboard!', 'success');
            setTimeout(() => btn.classList.remove('copied'), 2000);
          });
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [addToast]);

  // ---- Callout icon renderer in content ----
  useEffect(() => {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.callout-icon').forEach((el) => {
        const type = el.textContent?.trim();
        if (type && calloutIcons[type] && !el.hasChildNodes()) {
          // We can't render React here, so we use a data attribute approach
        }
      });
    });
    if (mainContentRef.current) {
      observer.observe(mainContentRef.current, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [currentPage.id]);

  // ---- Quick cards ----
  const quickCards = [
    { title: 'Quick Start', desc: 'Run locally in minutes', icon: <Zap className="w-5 h-5" />, slug: 'quickstart', color: 'from-cyan-500/20 to-blue-500/20' },
    { title: 'Architecture', desc: 'System design & data flow', icon: <GitBranch className="w-5 h-5" />, slug: 'system-architecture', color: 'from-violet-500/20 to-purple-500/20' },
    { title: 'ML Pipeline', desc: 'Training & model details', icon: <Cpu className="w-5 h-5" />, slug: 'ml-overview', color: 'from-amber-500/20 to-orange-500/20' },
    { title: 'REST API', desc: 'Endpoints & auth', icon: <Server className="w-5 h-5" />, slug: 'api-overview', color: 'from-emerald-500/20 to-green-500/20' },
    { title: 'Frontend', desc: 'React dashboard guide', icon: <LayoutDashboard className="w-5 h-5" />, slug: 'frontend-architecture', color: 'from-pink-500/20 to-rose-500/20' },
    { title: 'Deployment', desc: 'Docker & Kubernetes', icon: <Globe className="w-5 h-5" />, slug: 'deployment-guide', color: 'from-sky-500/20 to-indigo-500/20' },
    { title: 'Dataset', desc: 'CIC-IDS2017 details', icon: <Database className="w-5 h-5" />, slug: 'dataset', color: 'from-teal-500/20 to-cyan-500/20' },
    { title: 'Contributing', desc: 'Join the community', icon: <HelpCircle className="w-5 h-5" />, slug: 'contributing-guide', color: 'from-lime-500/20 to-green-500/20' },
  ];

  const isHome = !pageId || pageId === '';

  // ---- Total page count ----
  const totalPages = useMemo(() => docData.reduce((sum, cat) => sum + cat.pages.length, 0), []);

  return (
    <>
      {/* ====== Command Palette ====== */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[12vh]"
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setCommandSearch('');
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-[#0f1729]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center px-5 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
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
                <kbd className="text-[11px] text-neutral-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded ml-3">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {commandResults.length === 0 ? (
                  <div className="py-8 text-center">
                    <Search className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-neutral-500">No results for "{commandSearch}"</p>
                  </div>
                ) : (
                  <ul className="space-y-0.5">
                    {commandResults.map((page, idx) => (
                      <motion.button
                        key={page.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.015 }}
                        onClick={() => {
                          navigate(`/docs/${page.id}`);
                          setIsCommandPaletteOpen(false);
                          setCommandSearch('');
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                          idx === selectedIndex
                            ? 'bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/5'
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        <FileText
                          className={`w-4 h-4 shrink-0 ${
                            idx === selectedIndex ? 'text-cyan-400' : 'text-neutral-600'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{page.title}</div>
                          {page.description && (
                            <div className="text-xs text-neutral-500 truncate mt-0.5">{page.description}</div>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded-md shrink-0">
                          {page.category}
                        </span>
                      </motion.button>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-4 px-5 py-3 border-t border-white/5 text-[11px] text-neutral-600">
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">↵</kbd> Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">esc</kbd> Close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Keyboard Shortcuts Modal ====== */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0f1729] border border-white/10 rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-cyan-400" /> Keyboard Shortcuts
                </h3>
                <button onClick={() => setShowShortcuts(false)} className="text-neutral-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { keys: ['⌘', 'K'], desc: 'Open search' },
                  { keys: ['⌘', '/'], desc: 'Show shortcuts' },
                  { keys: ['ESC'], desc: 'Close modal / palette' },
                  { keys: ['↑', '↓'], desc: 'Navigate search results' },
                  { keys: ['↵'], desc: 'Open selected result' },
                ].map((shortcut) => (
                  <div key={shortcut.desc} className="flex items-center justify-between py-2">
                    <span className="text-sm text-neutral-300">{shortcut.desc}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="text-xs text-neutral-400 bg-white/5 border border-white/10 px-2 py-1 rounded-md font-mono"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Toasts ====== */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="flex items-center gap-2 bg-[#0f1729] border border-white/10 rounded-xl px-4 py-3 shadow-xl shadow-black/30"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-sm text-white">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ====== Scroll to Top ====== */}
      <AnimatePresence>
        {showScrollTop && !isHome && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-40 w-10 h-10 rounded-full bg-[#0f1729] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-cyan-500/30 shadow-lg shadow-black/30 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ====== Main Layout ====== */}
      <div className="h-screen flex flex-col bg-[#0B1220] text-white font-sans overflow-hidden">
        {/* ---- Reading Progress Bar (top of page) ---- */}
        {!isHome && (
          <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
        )}

        {/* ---- Header ---- */}
        <header className="shrink-0 bg-[#0f1729]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 md:px-6 py-3 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/docs" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold tracking-tight text-white">AI-NIDS</span>
                <span className="hidden sm:inline text-[11px] text-neutral-500 font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  Docs v2.4
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsCommandPaletteOpen(true);
                setTimeout(() => commandInputRef.current?.focus(), 100);
              }}
              className="hidden md:flex items-center gap-2 text-sm text-neutral-400 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 hover:bg-white/[0.06] hover:border-white/10 transition-all"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Search docs...</span>
              <kbd className="text-[11px] text-neutral-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setShowShortcuts(true)}
              className="hidden md:flex text-neutral-500 hover:text-neutral-300 p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/10 hidden md:block" />

            <a
              href="#"
              className="text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              aria-label="GitHub"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <Link
              to="/"
              className="text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 hidden md:flex"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* ---- Body ---- */}
        <div className="flex-1 flex overflow-hidden">
          {/* ====== Sidebar ====== */}
          <aside
            className={`
              fixed md:static inset-y-0 left-0 z-30 w-[280px] bg-[#0f1729]/95 backdrop-blur-xl border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              pt-[60px] md:pt-0
            `}
          >
            {/* Mobile close */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-sm font-semibold text-white">Navigation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
              {filteredCategories.map((category) => {
                const isCollapsed = collapsedCategories.includes(category.id);
                const hasActive = category.pages.some((p) => p.id === currentPage.id);
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-semibold rounded-lg transition-colors ${
                        hasActive
                          ? 'text-white'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className={hasActive ? 'text-cyan-400' : 'text-neutral-500'}>
                        {categoryIcons[category.id] || <FileText className="w-4 h-4" />}
                      </span>
                      <span className="flex-1 text-left truncate">{category.label}</span>
                      <motion.div
                        animate={{ rotate: isCollapsed ? 0 : 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 pl-3 border-l border-white/[0.06] space-y-0.5 py-1">
                            {category.pages.map((page) => {
                              const isActive = currentPage.id === page.id;
                              return (
                                <button
                                  key={page.id}
                                  onClick={() => {
                                    navigate(`/docs/${page.id}`);
                                    setSidebarOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] transition-all text-left relative ${
                                    isActive
                                      ? 'text-cyan-400 bg-cyan-500/[0.08]'
                                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                                  }`}
                                >
                                  {isActive && (
                                    <motion.div
                                      layoutId="sidebar-active"
                                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-cyan-400 rounded-full -ml-[17px]"
                                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                  )}
                                  <span className="truncate">{page.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Sidebar footer */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{totalPages} pages · 7 categories</span>
              </div>
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* ====== Main Content ====== */}
          <main ref={mainContentRef} className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-5 md:px-10 py-8 md:py-12">
              {isHome ? (
                /* ====== HOME PAGE ====== */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center text-center pt-8 md:pt-16 relative"
                >
                  {/* Animated background orbs */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.07] rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/[0.04] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
                  </div>

                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative z-10 inline-flex items-center gap-2 bg-cyan-500/[0.08] text-cyan-400 text-sm font-medium px-4 py-1.5 rounded-full border border-cyan-500/20 mb-8 backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Enterprise Documentation
                    <span className="text-[11px] bg-cyan-500/20 px-2 py-0.5 rounded-md font-mono">v2.4.0</span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
                  >
                    <span className="text-white">Build with the</span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                      AI-NIDS Platform
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 mt-5 text-base md:text-lg text-neutral-400 max-w-2xl leading-relaxed"
                  >
                    Everything you need to understand, deploy, and extend the AI-powered Network Intrusion Detection System.
                  </motion.p>

                  {/* Search bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 mt-10 w-full max-w-xl"
                  >
                    <button
                      onClick={() => {
                        setIsCommandPaletteOpen(true);
                        setTimeout(() => commandInputRef.current?.focus(), 100);
                      }}
                      className="w-full flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-5 pr-4 py-4 text-left hover:bg-white/[0.05] hover:border-white/15 transition-all group"
                    >
                      <Search className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-neutral-500 text-base flex-1">Search the docs...</span>
                      <kbd className="text-sm text-neutral-500 bg-white/5 border border-white/10 px-3 py-1 rounded-lg hidden sm:block">
                        ⌘K
                      </kbd>
                    </button>
                  </motion.div>

                  {/* Quick cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl"
                  >
                    {quickCards.map((card, idx) => (
                      <motion.button
                        key={card.slug}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/docs/${card.slug}`)}
                        className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 md:p-5 text-left hover:border-white/15 hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                      >
                        {/* Gradient glow on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        />
                        <div className="relative z-10">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/[0.06] border border-white/[0.06] text-neutral-400 group-hover:text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            {card.icon}
                          </div>
                          <h3 className="font-semibold text-white text-sm">{card.title}</h3>
                          <p className="text-[11px] text-neutral-500 mt-1 hidden md:block">{card.desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative z-10 mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm"
                  >
                    {[
                      { label: 'Pages', value: totalPages },
                      { label: 'Categories', value: docData.length },
                      { label: 'API Endpoints', value: '6+' },
                      { label: 'ML Models', value: '3' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Bottom CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="relative z-10 mt-12 flex flex-col sm:flex-row items-center gap-3"
                  >
                    <button
                      onClick={() => navigate('/docs/quickstart')}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm"
                    >
                      Get Started →
                    </button>
                    <button
                      onClick={() => navigate('/docs/overview')}
                      className="px-6 py-3 bg-white/[0.03] border border-white/[0.08] text-neutral-300 font-medium rounded-xl hover:bg-white/[0.06] transition-all text-sm"
                    >
                      Read Overview
                    </button>
                  </motion.div>

                  <div className="h-16" />
                </motion.div>
              ) : (
                /* ====== ARTICLE PAGE ====== */
                <motion.div
                  key={currentPage.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Breadcrumb */}
                  <nav className="flex items-center gap-1.5 text-sm text-neutral-500 mb-8 flex-wrap">
                    <Link to="/docs" className="hover:text-neutral-300 transition-colors flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Docs
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-neutral-400">{currentCategory.label}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white font-medium">{currentPage.title}</span>
                  </nav>

                  {/* Title & Meta */}
                  <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-white leading-tight">
                      {currentPage.title}
                    </h1>
                    {currentPage.description && (
                      <p className="mt-3 text-lg text-neutral-400">{currentPage.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {currentPage.readTime || 5} min read
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        v2.4.0
                      </span>
                      {currentPage.lastUpdated && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(currentPage.lastUpdated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="docs-content">{renderContent(currentPage.content)}</div>

                  {/* Feedback */}
                  <div className="mt-14 pt-8 border-t border-white/[0.06]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <span className="text-sm text-neutral-400 font-medium">Was this page helpful?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFeedbackGiven('yes')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all ${
                            feedbackGiven === 'yes'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:border-white/15 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Yes
                        </button>
                        <button
                          onClick={() => setFeedbackGiven('no')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all ${
                            feedbackGiven === 'no'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:border-white/15 hover:text-white'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          No
                        </button>
                      </div>
                      {feedbackGiven && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-sm text-neutral-500"
                        >
                          Thanks for your feedback!
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Prev / Next */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prevPage ? (
                      <button
                        onClick={() => navigate(`/docs/${prevPage.id}`)}
                        className="group flex flex-col items-start gap-1 p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all text-left"
                      >
                        <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                          Previous
                        </span>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {prevPage.title}
                        </span>
                      </button>
                    ) : (
                      <div />
                    )}
                    {nextPage && (
                      <button
                        onClick={() => navigate(`/docs/${nextPage.id}`)}
                        className="group flex flex-col items-end gap-1 p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all text-right"
                      >
                        <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                          Next
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {nextPage.title}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="h-12" />
                </motion.div>
              )}
            </div>
          </main>

          {/* ====== Right Panel ====== */}
          {!isHome && (
            <aside className="hidden xl:block w-60 shrink-0 border-l border-white/[0.06] overflow-y-auto sticky top-0 h-screen pt-[60px]">
              <div className="p-5 space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-500 mb-2">
                    <span>Progress</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </div>

                {/* TOC */}
                {tocItems.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                      On this page
                    </h4>
                    <ul className="space-y-1">
                      {tocItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`block py-1.5 text-[13px] transition-colors border-l-2 pl-3 ${
                              activeTocId === item.id
                                ? 'border-cyan-400 text-cyan-400 font-medium'
                                : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:border-white/20'
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Summary */}
                <div className="p-4 bg-gradient-to-br from-cyan-500/[0.06] to-blue-500/[0.04] rounded-xl border border-cyan-500/10">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-400 mb-2">
                    <Bot className="w-3.5 h-3.5" /> AI Summary
                  </div>
                  <p className="text-[12px] text-neutral-400 leading-relaxed">
                    {currentPage.description ||
                      `This article covers ${currentPage.title.toLowerCase()} within the AI-NIDS platform.`}
                  </p>
                </div>

                {/* Related */}
                <div>
                  <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    Related
                  </h4>
                  <ul className="space-y-1.5">
                    {currentCategory.pages
                      .filter((p) => p.id !== currentPage.id)
                      .slice(0, 4)
                      .map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/docs/${p.id}`}
                            className="flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition-colors group"
                          >
                            <ChevronRight className="w-3 h-3 text-neutral-700 group-hover:text-cyan-400 transition-colors" />
                            {p.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Shortcuts hint */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={() => setShowShortcuts(true)}
                    className="flex items-center gap-2 text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors"
                  >
                    <Keyboard className="w-3 h-3" />
                    Keyboard shortcuts
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ====== Global Styles ====== */}
      <style>{`
        /* ---- Scrollbar ---- */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

        /* ---- Docs Content ---- */
        .docs-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 2.5rem 0 1rem;
          color: white;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .docs-content h2 {
          font-size: 1.4rem;
          font-weight: 600;
          margin: 2.5rem 0 0.75rem;
          color: white;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          scroll-margin-top: 5rem;
          letter-spacing: -0.01em;
        }
        .docs-content h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 1.5rem 0 0.5rem;
          color: #e5e7eb;
        }
        .docs-content p {
          margin: 0.85rem 0;
          color: #a1a1aa;
          line-height: 1.8;
          font-size: 0.95rem;
        }
        .docs-content strong {
          color: #e4e4e7;
          font-weight: 600;
        }
        .docs-content ul, .docs-content ol {
          margin: 0.85rem 0;
          padding-left: 1.25rem;
          color: #a1a1aa;
        }
        .docs-content li {
          margin: 0.4rem 0;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .docs-content li::marker {
          color: #3f3f46;
        }

        /* Inline code */
        .docs-content code.inline-code {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 0.15rem 0.45rem;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          color: #e5e7eb;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }

        /* Code blocks */
        .docs-content .code-block {
          position: relative;
          margin: 1.5rem 0;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: #0c1222;
        }
        .docs-content .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .docs-content .code-lang {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #52525b;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }
        .docs-content .copy-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: #71717a;
          padding: 0.25rem 0.65rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.7rem;
          font-family: system-ui;
          transition: all 0.2s;
        }
        .docs-content .copy-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #a1a1aa;
          border-color: rgba(255,255,255,0.1);
        }
        .docs-content .copy-btn .copied-icon-wrap {
          display: none;
        }
        .docs-content .copy-btn.copied {
          color: #34d399;
          border-color: rgba(52, 211, 153, 0.2);
          background: rgba(52, 211, 153, 0.06);
        }
        .docs-content .copy-btn.copied .copy-icon-wrap {
          display: none;
        }
        .docs-content .copy-btn.copied .copied-icon-wrap {
          display: flex;
        }
        .docs-content pre {
          padding: 1.25rem 1.25rem;
          overflow-x: auto;
          font-size: 0.85rem;
          line-height: 1.7;
        }
        .docs-content pre code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: #d4d4d8;
          white-space: pre;
          tab-size: 2;
        }

        /* Callouts */
        .docs-content .callout {
          display: flex;
          gap: 0.85rem;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          border: 1px solid;
        }
        .docs-content .callout-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
          font-size: 0;
        }
        .docs-content .callout-content {
          flex: 1;
          min-width: 0;
        }
        .docs-content .callout-content p {
          margin: 0;
          line-height: 1.6;
        }
        .docs-content .callout.note {
          background: rgba(59, 130, 246, 0.06);
          border-color: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
        }
        .docs-content .callout.note .callout-icon {
          color: #60a5fa;
        }
        .docs-content .callout.tip {
          background: rgba(16, 185, 129, 0.06);
          border-color: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
        }
        .docs-content .callout.tip .callout-icon {
          color: #34d399;
        }
        .docs-content .callout.warning {
          background: rgba(245, 158, 11, 0.06);
          border-color: rgba(245, 158, 11, 0.15);
          color: #fcd34d;
        }
        .docs-content .callout.warning .callout-icon {
          color: #fbbf24;
        }
        .docs-content .callout.info {
          background: rgba(139, 92, 246, 0.06);
          border-color: rgba(139, 92, 246, 0.15);
          color: #c4b5fd;
        }
        .docs-content .callout.info .callout-icon {
          color: #a78bfa;
        }

        /* Tables */
        .docs-content table.docs-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 1.5rem 0;
          font-size: 0.875rem;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .docs-content table.docs-table th {
          background: rgba(255,255,255,0.03);
          color: #a1a1aa;
          padding: 0.65rem 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .docs-content table.docs-table td {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: #a1a1aa;
        }
        .docs-content table.docs-table tr:last-child td {
          border-bottom: none;
        }
        .docs-content table.docs-table tbody tr:hover {
          background: rgba(255,255,255,0.015);
        }

        /* Method badges */
        .docs-content .method-badge {
          display: inline-block;
          padding: 0.1rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .docs-content .method-badge.get {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        .docs-content .method-badge.post {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }
        .docs-content .method-badge.put {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }
        .docs-content .method-badge.delete {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .docs-content .method-badge.patch {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        /* Diagram box */
        .docs-content .diagram-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 0.75rem;
          padding: 2rem;
          text-align: center;
          margin: 1.5rem 0;
        }
        .docs-content .diagram-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .docs-content .diagram-node {
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid;
        }
        .docs-content .diagram-node.primary {
          background: rgba(6, 182, 212, 0.08);
          border-color: rgba(6, 182, 212, 0.2);
          color: #22d3ee;
        }
        .docs-content .diagram-node.accent {
          background: rgba(59, 130, 246, 0.08);
          border-color: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }
        .docs-content .diagram-node.secondary {
          background: rgba(139, 92, 246, 0.08);
          border-color: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
        }
        .docs-content .diagram-node.muted {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.08);
          color: #a1a1aa;
        }
        .docs-content .diagram-arrow {
          color: #3f3f46;
          font-size: 1.25rem;
          font-weight: 300;
        }
      `}</style>
    </>
  );
};

// Simple Calendar icon (since lucide Calendar wasn't imported above)
const Calendar: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default DocsPage;