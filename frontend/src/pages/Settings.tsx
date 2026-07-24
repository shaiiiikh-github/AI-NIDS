// src/pages/Settings.tsx
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  HardDrive, 
  Globe, 
  User, 
  Lock, 
  Activity,
  Save,
  RefreshCw
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-500" /> System Settings
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Configure threat thresholds, alerts, and node management.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Settings Grid - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protection Levels */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Shield className="w-5 h-5 text-indigo-400" /> Protection Levels
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Auto-block Critical Threats</div>
                <div className="text-xs text-neutral-500">Automatically update firewall rules for CRITICAL alerts.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Strict Payload Entropy Check</div>
                <div className="text-xs text-neutral-500">Enable aggressive scanning on encrypted payloads.</div>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-indigo-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Enable Anomaly Scoring</div>
                <div className="text-xs text-neutral-500">Use ML-based anomaly scoring for all packets.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Bell className="w-5 h-5 text-indigo-400" /> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Email Alerts (High & Critical)</div>
                <div className="text-xs text-neutral-500">Send alerts to admin@nids.internal.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Slack / Teams Integration</div>
                <div className="text-xs text-neutral-500">Post threat summaries to #security channel.</div>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-indigo-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Daily Digest Email</div>
                <div className="text-xs text-neutral-500">Receive a summary of all events every 24h.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
            </div>
          </div>
        </div>

        {/* Node & Network */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Globe className="w-5 h-5 text-indigo-400" /> Node & Network
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Current Node</span>
              <span className="text-sm font-mono text-white">us-east-1a (active)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Interface</span>
              <span className="text-sm font-mono text-white">eth0 (10 Gbps)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Model Version</span>
              <span className="text-sm font-mono text-indigo-400">v2.4.0-prod</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Activity className="w-5 h-5 text-indigo-400" /> System Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Uptime</span>
              <span className="text-sm font-mono text-white">99.98% (30 days)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Last Restart</span>
              <span className="text-sm font-mono text-white">2026-07-22 03:14 UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-[10px] text-neutral-500 text-center border-t border-neutral-800/60 pt-4">
        All settings are saved automatically. Changes may require a service restart.
      </p>
    </div>
  );
};

export default Settings;