// src/pages/Reports.tsx
import React from 'react';
import { FileText, Download, FileJson, Calendar, FileBarChart, Plus } from 'lucide-react';

export const Reports: React.FC = () => {
  const reports = [
    { id: 'REP-24-081', date: '2026-07-22', type: 'Weekly Summary', size: '2.4 MB' },
    { id: 'REP-24-080', date: '2026-07-21', type: 'Threat Incident (High Risk)', size: '845 KB' },
    { id: 'REP-24-079', date: '2026-07-15', type: 'Weekly Summary', size: '2.1 MB' },
    { id: 'REP-24-078', date: '2026-07-14', type: 'Compliance Audit', size: '3.2 MB' },
    { id: 'REP-24-077', date: '2026-07-12', type: 'Monthly Summary', size: '5.6 MB' },
  ];

  // Summary stats (optional, to fill space)
  const totalReports = reports.length;
  const latestDate = reports[0]?.date || 'N/A';
  const totalSize = reports.reduce((acc, r) => acc + parseFloat(r.size), 0).toFixed(1);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-500" /> Security Reports
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Download auto-generated compliance and incident reports.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          <Plus className="w-4 h-4" /> Generate New Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Total Reports</div>
            <div className="text-xl font-bold text-white">{totalReports}</div>
          </div>
        </div>
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Latest Report</div>
            <div className="text-xl font-bold text-white">{latestDate}</div>
          </div>
        </div>
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Total Storage</div>
            <div className="text-xl font-bold text-white">{totalSize} MB</div>
          </div>
        </div>
      </div>

      {/* Reports Table - Full width */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-950/80 text-neutral-400 font-mono text-xs uppercase tracking-wider border-b border-neutral-800">
                <th className="p-4">Report ID</th>
                <th className="p-4">Date Generated</th>
                <th className="p-4">Report Type</th>
                <th className="p-4">Size</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors group">
                  <td className="p-4 font-mono text-indigo-400 font-medium">{r.id}</td>
                  <td className="p-4 text-neutral-400">{r.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                      r.type.includes('Threat') 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : r.type.includes('Compliance')
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-neutral-800/50 text-neutral-300 border border-neutral-700'
                    }`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-neutral-500">{r.size}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors" title="Download PDF">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors" title="Download JSON">
                      <FileJson className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;