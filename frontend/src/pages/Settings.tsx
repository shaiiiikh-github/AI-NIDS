// src/pages/Settings.tsx
import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, HardDrive } from 'lucide-react';

export const Settings: React.FC = () => {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-indigo-500" /> System Settings
                </h1>
                <p className="text-sm text-neutral-400 mt-1">Configure threat thresholds, alerts, and node management.</p>
            </div>

            <div className="max-w-2xl space-y-6">
                <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-neutral-800 pb-2">
                        <Shield className="w-5 h-5 text-indigo-400" /> Protection Levels
                    </h3>
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
                </div>

                <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-neutral-800 pb-2">
                        <Bell className="w-5 h-5 text-indigo-400" /> Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-white">Email Alerts (High & Critical)</div>
                            <div className="text-xs text-neutral-500">Send alerts to admin@nids.internal.</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};