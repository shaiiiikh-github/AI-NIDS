// src/pages/About.tsx
import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Info className="w-8 h-8 text-indigo-500" /> About AI-NIDS
                </h1>
                <p className="text-sm text-neutral-400 mt-1">Platform information and license details.</p>
            </div>

            <div className="max-w-xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center">
                <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-400 mb-6">
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">AI-NIDS Enterprise Platform</h2>
                <p className="text-sm text-neutral-400 mb-6">Version 2.4.0-prod</p>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    This system is an AI-powered Network Intrusion Detection & Threat Analysis System designed to identify anomalies, prevent malicious packet injections, and provide SOC teams with real-time actionable telemetry.
                </p>
                <div className="w-full border-t border-neutral-800 pt-6 mt-2">
                    <p className="text-xs font-mono text-neutral-500">© 2026 Security Operations Framework. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};