// src/pages/Reports.tsx
import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  X,
} from 'lucide-react';
import { useFlowLogs, useFlowDetail } from '@/hooks/useFlowLogs';

const PAGE_SIZE = 25;

const riskBadgeClasses = (isAlert: boolean) =>
  isAlert
    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// ----------------------------------------------------------------------------
// Row detail drill-down -- fetches the Tier 2 raw_features blob on expand
// ----------------------------------------------------------------------------
const FlowDetailRow: React.FC<{ id: number; colSpan: number }> = ({ id, colSpan }) => {
  const { data, isLoading, isError } = useFlowDetail(id);

  return (
    <tr className="bg-neutral-950/60">
      <td colSpan={colSpan} className="p-4">
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading full feature vector...
          </div>
        )}
        {isError && (
          <div className="text-xs text-red-400">Failed to load flow detail.</div>
        )}
        {data && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2 font-semibold">
              Raw Feature Vector (Tier 2 -- 77 model inputs)
              {data.uncertain && data.alternative && (
                <span className="ml-3 text-amber-400 normal-case tracking-normal">
                  Uncertain -- alternative label: {data.alternative}
                </span>
              )}
            </div>
            {data.rawFeatures ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
                {Object.entries(data.rawFeatures).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-neutral-900/60 border border-neutral-800/60 rounded-lg px-2.5 py-1.5"
                  >
                    <div className="text-[9px] text-neutral-500 truncate" title={key}>
                      {key}
                    </div>
                    <div className="text-xs font-mono text-neutral-200">
                      {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 4 }) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-600">No raw feature data stored for this flow.</div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export const Reports: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [labelFilter, setLabelFilter] = useState('');
  const [srcIpFilter, setSrcIpFilter] = useState('');
  const [dstIpFilter, setDstIpFilter] = useState('');
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Debounced-ish: filters only take effect once committed via the Apply button,
  // so typing doesn't refetch on every keystroke.
  const [appliedFilters, setAppliedFilters] = useState({
    label: '',
    srcIp: '',
    dstIp: '',
    alertsOnly: false,
  });

  const { data, isLoading, isError, isFetching, refetch } = useFlowLogs({
    limit: PAGE_SIZE,
    offset,
    label: appliedFilters.label,
    srcIp: appliedFilters.srcIp,
    dstIp: appliedFilters.dstIp,
    alertsOnly: appliedFilters.alertsOnly,
  });

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const alertCount = useMemo(() => items.filter((i) => i.isAlert).length, [items]);

  const applyFilters = () => {
    setOffset(0);
    setAppliedFilters({
      label: labelFilter.trim(),
      srcIp: srcIpFilter.trim(),
      dstIp: dstIpFilter.trim(),
      alertsOnly,
    });
  };

  const clearFilters = () => {
    setLabelFilter('');
    setSrcIpFilter('');
    setDstIpFilter('');
    setAlertsOnly(false);
    setOffset(0);
    setAppliedFilters({ label: '', srcIp: '', dstIp: '', alertsOnly: false });
  };

  const hasActiveFilters =
    appliedFilters.label || appliedFilters.srcIp || appliedFilters.dstIp || appliedFilters.alertsOnly;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-500" /> Flow Logs
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Every classified flow, not just alerts. Click a row to inspect its full feature vector.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-200 px-4 py-2 rounded-xl text-xs font-medium transition-colors border border-neutral-700/60"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Total Flows</div>
            <div className="text-xl font-bold text-white">{total.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Alerts (this page)</div>
            <div className="text-xl font-bold text-white">{alertCount}</div>
          </div>
        </div>
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-neutral-500/10 rounded-xl border border-neutral-500/20 text-neutral-300">
            <ChevronRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Page</div>
            <div className="text-xl font-bold text-white">{currentPage} / {totalPages}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Label</label>
          <input
            value={labelFilter}
            onChange={(e) => setLabelFilter(e.target.value)}
            placeholder="e.g. DDoS, Benign"
            className="w-full bg-neutral-950/80 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 font-mono"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Source IP</label>
          <input
            value={srcIpFilter}
            onChange={(e) => setSrcIpFilter(e.target.value)}
            placeholder="192.168.1.1"
            className="w-full bg-neutral-950/80 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 font-mono"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Destination IP</label>
          <input
            value={dstIpFilter}
            onChange={(e) => setDstIpFilter(e.target.value)}
            placeholder="10.0.0.5"
            className="w-full bg-neutral-950/80 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 font-mono"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-neutral-300 pb-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={alertsOnly}
            onChange={(e) => setAlertsOnly(e.target.checked)}
            className="accent-indigo-500 w-3.5 h-3.5"
          />
          Alerts only
        </label>
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Apply
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 px-3 py-2 rounded-lg text-xs font-medium transition-colors border border-neutral-700/60"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-950/80 text-neutral-400 font-mono text-xs uppercase tracking-wider border-b border-neutral-800">
                <th className="p-4 w-8" />
                <th className="p-4">Timestamp</th>
                <th className="p-4">Source</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Protocol</th>
                <th className="p-4">Label</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Fwd/Bwd Pkts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin inline mr-2" /> Loading flow logs...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-red-400 text-xs">
                    Failed to load flow logs. Confirm the backend is running and reachable.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && items.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500 text-xs">
                    No flows match the current filters.
                  </td>
                </tr>
              )}
              {items.map((flow) => (
                <React.Fragment key={flow.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === flow.id ? null : flow.id)}
                    className="hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${
                          expandedId === flow.id ? 'rotate-180' : ''
                        }`}
                      />
                    </td>
                    <td className="p-4 text-neutral-400 font-mono text-xs whitespace-nowrap">
                      {formatTimestamp(flow.timestamp)}
                    </td>
                    <td className="p-4 font-mono text-xs text-neutral-300">
                      {flow.srcIp}:{flow.srcPort}
                    </td>
                    <td className="p-4 font-mono text-xs text-neutral-300">
                      {flow.dstIp}:{flow.dstPort}
                    </td>
                    <td className="p-4 font-mono text-xs text-neutral-500">{flow.protocol}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${riskBadgeClasses(flow.isAlert)}`}>
                        {flow.label}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-neutral-400 text-xs">
                      {(flow.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 font-mono text-neutral-500 text-xs">
                      {flow.totFwdPkts} / {flow.totBwdPkts}
                    </td>
                  </tr>
                  {expandedId === flow.id && <FlowDetailRow id={flow.id} colSpan={8} />}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800/80 text-xs text-neutral-400">
          <span>
            Showing {items.length === 0 ? 0 : offset + 1}-{offset + items.length} of {total.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              disabled={offset === 0}
              className="p-1.5 rounded-lg border border-neutral-700/60 text-neutral-400 hover:text-white hover:bg-neutral-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOffset(offset + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= total}
              className="p-1.5 rounded-lg border border-neutral-700/60 text-neutral-400 hover:text-white hover:bg-neutral-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;