// src/pages/Reports.tsx
import React from 'react';
import { FileText, Download, FileJson } from 'lucide-react';

export const Reports: React.FC = () => {
    const reports = [
        { id: 'REP-24-081', date: '2026-07-22', type: 'Weekly Summary', size: '2.4 MB' },
        { id: 'REP-24-080', date: '2026-07-21', type: 'Threat Incident (High Risk)', size: '845 KB' },
        { id: 'REP-24-079', date: '2026-07-15', type: 'Weekly Summary', size: '2.1 MB' },
    ];

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-500" /> Security Reports
                </h1>
                <p className="text-sm text-neutral-400 mt-1">Download auto-generated compliance and incident reports.</p>
            </div>

            <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl max-w-4xl">
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
                            <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                                <td className="p-4 font-mono text-indigo-400">{r.id}</td>
                                <td className="p-4 text-neutral-400">{r.date}</td>
                                <td className="p-4">{r.type}</td>
                                <td className="p-4 font-mono text-neutral-500">{r.size}</td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                                    <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors" title="Download JSON"><FileJson className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};