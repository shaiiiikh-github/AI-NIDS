// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Download,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import {
  fetchSystemHealth,
  fetchMetrics,
  fetchAttackDistribution,
  fetchAttackTrends,
  fetchRecentPredictions,
} from '@/services/api';
import type {
  SystemHealth,
  NetworkMetrics,
  AttackDistribution,
  AttackTrendPoint,
  PredictionRecord,
  RiskLevel,
} from '@/types/nids';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [distribution, setDistribution] = useState<AttackDistribution[]>([]);
  const [trends, setTrends] = useState<AttackTrendPoint[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [hData, mData, dData, tData, pData] = await Promise.all([
        fetchSystemHealth(),
        fetchMetrics(),
        fetchAttackDistribution(),
        fetchAttackTrends(),
        fetchRecentPredictions(),
      ]);
      setHealth(hData);
      setMetrics(mData);
      setDistribution(dData);
      setTrends(tData);
      setPredictions(pData);
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getRiskBadge = (level: RiskLevel) => {
    const config = {
      CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
      HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
      MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      SAFE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-md border ${config[level]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {level}
      </span>
    );
  };

  const filteredPredictions = predictions.filter(
    (p) =>
      p.sourceIP.includes(searchQuery) ||
      p.destinationIP.includes(searchQuery) ||
      p.prediction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-grid-pattern p-6 md:p-8 space-y-8">
      {/* Top Banner / System Telemetry Header */}
      <div className="relative overflow-hidden bg-neutral-900/70 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" /> AI Engine v2.4 Active
              </span>
              <span className="text-xs font-mono text-neutral-500">Node: us-east-1a</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Security Telemetry & Threat Overview
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 max-w-2xl">
              Continuous packet-level monitoring using deep learning models for anomaly detection and automated threat mitigation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-neutral-950/80 border border-neutral-800 px-4 py-2 rounded-xl text-xs font-mono">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-neutral-200 font-semibold">
                {health?.status === 'operational' ? 'SYSTEM OPERATIONAL' : 'DEGRADED'}
              </span>
              <span className="text-neutral-700">|</span>
              <span className="text-neutral-400">99.98% Uptime</span>
            </div>

            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 px-4 py-2 rounded-xl text-xs font-medium text-neutral-200 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="group relative overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 transition-all duration-300 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Packet Scans</span>
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {metrics ? metrics.totalInspections.toLocaleString() : '---'}
            </div>
            <div className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{metrics?.inspectionDeltaPct}%
            </div>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">High volume network interface eth0</p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="group relative overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-red-500/40 transition-all duration-300 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-colors" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Threats Flagged</span>
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {metrics ? metrics.threatsDetected.toLocaleString() : '---'}
            </div>
            <div className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3 mr-1" />
              {metrics?.threatDeltaPct}%
            </div>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">Blocked via automated firewall rules</p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="group relative overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-emerald-500/40 transition-all duration-300 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Model Precision</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {metrics ? `${metrics.modelAccuracy}%` : '---'}
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              F1: 0.994
            </span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">Evaluated on test payload validation set</p>
        </motion.div>

        {/* Card 4 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="group relative overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-amber-500/40 transition-all duration-300 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Inference Latency</span>
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {metrics ? `${metrics.avgLatencyMs} ms` : '---'}
            </div>
            <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-full">
              p99: 18ms
            </span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">Sub-20ms real-time SLA maintained</p>
        </motion.div>
      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Traffic & Threat Trends Area Chart */}
        <div className="lg:col-span-2 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Network Traffic vs Anomaly Trends <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">24-hour continuous rolling snapshot</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Normal Traffic
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Threats
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="normalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="threatColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#404040',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Area type="monotone" dataKey="normalTraffic" stroke="#6366F1" fillOpacity={1} fill="url(#normalColor)" strokeWidth={2} />
                <Area type="monotone" dataKey="maliciousTraffic" stroke="#EF4444" fillOpacity={1} fill="url(#threatColor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Vector Distribution Pie Chart */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="pb-4 border-b border-neutral-800">
            <h3 className="text-base font-bold text-white">Attack Vector Breakdown</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Categorized by signature & ML model output</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="count">
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#171717" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#404040',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-3 border-t border-neutral-800">
            {distribution.slice(0, 3).map((item) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-neutral-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.category}
                </span>
                <span className="font-mono text-neutral-400 font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictions Table Layer */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Live Prediction Telemetry</h3>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono rounded">
                POST /predict
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Real-time classification stream evaluated against network payload parameters
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search IP, vector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-950/80 border border-neutral-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all w-full md:w-64"
              />
            </div>
            <button className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium px-3.5 py-1.5 rounded-xl transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Export Logs
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-950/80 text-neutral-400 font-mono text-[11px] uppercase tracking-wider border-b border-neutral-800">
                <th className="p-4">Prediction ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Source IP</th>
                <th className="p-4">Destination IP</th>
                <th className="p-4">Protocol</th>
                <th className="p-4">Classification</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filteredPredictions.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-800/40 transition-colors group">
                  <td className="p-4 font-mono font-medium text-neutral-400 group-hover:text-indigo-400 transition-colors">
                    {row.id}
                  </td>
                  <td className="p-4 text-neutral-400 whitespace-nowrap">{row.timestamp}</td>
                  <td className="p-4 font-mono">
                    <button
                      onClick={() => copyToClipboard(row.sourceIP)}
                      className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
                      title="Click to copy IP"
                    >
                      {row.sourceIP}
                      {copiedIp === row.sourceIP ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 font-mono text-neutral-400">{row.destinationIP}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-neutral-800 border border-neutral-700/60 text-neutral-300 rounded-md font-mono text-[10px]">
                      {row.protocol}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white">{row.prediction}</td>
                  <td className="p-4 font-mono text-neutral-300">
                    {(row.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-4">{getRiskBadge(row.riskLevel)}</td>
                  <td className="p-4 font-mono text-right text-neutral-400">{row.responseTimeMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;