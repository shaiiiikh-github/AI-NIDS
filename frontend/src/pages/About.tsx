// src/pages/About.tsx
import React from 'react';
import {
  Info,
  ShieldCheck,
  Users,
  Award,
  ExternalLink,
  Mail,
  Calendar,
  // Github is removed – we use inline SVG instead
} from 'lucide-react';

export const About: React.FC = () => {
  const teamMembers = [
    { name: 'Dr. Sarah Chen', role: 'Lead ML Engineer', avatar: 'SC' },
    { name: 'Michael Torres', role: 'Security Architect', avatar: 'MT' },
    { name: 'Priya Patel', role: 'Full Stack Developer', avatar: 'PP' },
    { name: 'James Okafor', role: 'DevOps Engineer', avatar: 'JO' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-800/80 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Info className="w-8 h-8 text-indigo-500" /> About AI-NIDS
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Platform information and license details.
        </p>
      </div>

      {/* Main Info Card + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-400 shrink-0">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">AI-NIDS Enterprise Platform</h2>
              <p className="text-sm text-neutral-400 mb-4">Version 2.4.0-prod</p>
              <p className="text-sm text-neutral-300 leading-relaxed">
                This system is an AI-powered Network Intrusion Detection & Threat Analysis System designed to identify anomalies, prevent malicious packet injections, and provide SOC teams with real-time actionable telemetry.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Calendar className="w-4 h-4" /> Released: 2026-07-01
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Award className="w-4 h-4" /> SOC 2 Type II Compliant
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Total Detections</div>
            <div className="text-2xl font-bold text-white">1.2M+</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Active Sensors</div>
            <div className="text-2xl font-bold text-white">24</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Detection Accuracy</div>
            <div className="text-2xl font-bold text-emerald-400">99.4%</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4">
          <Users className="w-5 h-5 text-indigo-400" /> Core Team
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex items-center gap-3 bg-neutral-950/50 border border-neutral-800/60 rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-mono text-sm font-bold">
                {member.avatar}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{member.name}</div>
                <div className="text-[10px] text-neutral-400">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-6 text-xs text-neutral-500">
        <div className="flex items-center gap-6">
          <span>© 2026 Security Operations Framework. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <span>Licensed under Enterprise Agreement v3.1</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
            <ExternalLink className="w-4 h-4" /> Docs
          </a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
            <Mail className="w-4 h-4" /> Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;