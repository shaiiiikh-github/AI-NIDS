// src/pages/IdentityCenter.tsx
"use client";

import { useUserProfile } from "../hooks/use-user-profile";
import { ProfileHero } from "../components/identity/ProfileHero";
import { InfoCard } from "../components/identity/InfoCard";
import { EditableField } from "../components/identity/EditableField";
import { CollapsibleSection } from "../components/identity/CollapsibleSection";
import { SettingToggle } from "../components/identity/SettingToggle";
import { DangerAction } from "../components/identity/DangerAction";
import { TimelineEvent } from "../components/identity/TimelineEvent";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import {
  Shield,
  Clock,
  Monitor,
  KeyRound,
  LogIn,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { z } from "zod";

export default function IdentityCenterPage() {
  const { user, loading, updateUser } = useUserProfile();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    threatNotifications: true,
    weeklyReports: false,
    maintenance: true,
    securityAdvisories: true,
  });

  if (loading || !user) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 glass-panel" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 glass-panel" />
          <div className="h-80 glass-panel" />
        </div>
      </div>
    );
  }

  const handleQuickAction = (action: string) => {
    const el = document.getElementById(action);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFieldSave = (key: string, value: string) => {
    updateUser({ [key]: value });
  };

  const lastLoginDate = new Date(user.lastLogin);
  const timeAgo = formatDistanceToNow(lastLoginDate, { addSuffix: true });

  const activityLog = [
    { icon: LogIn, timestamp: "Today at 09:42 UTC", description: "Successful login from 192.168.1.42", type: "success" as const },
    { icon: UserCheck, timestamp: "Yesterday at 16:30 UTC", description: "Profile updated", type: "info" as const },
    { icon: KeyRound, timestamp: "Mar 8 at 10:15 UTC", description: "Password changed", type: "warning" as const },
    { icon: AlertTriangle, timestamp: "Mar 7 at 23:55 UTC", description: "Failed login attempt from 10.0.0.5", type: "danger" as const },
    { icon: Monitor, timestamp: "Mar 5 at 14:20 UTC", description: "New device added (Firefox on Windows)", type: "info" as const },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Hero */}
      <ProfileHero user={user} onQuickAction={handleQuickAction} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Cards */}
         <div className="grid grid-cols-2 gap-4">
  {/* Last Login */}
  <div className="glass-panel p-4 transition-all hover:border-accent/30">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-400">Last Login</span>
      <Clock className="h-5 w-5 text-accent" />
    </div>
    <div className="mt-2">
      <span className="text-xl font-bold">{timeAgo}</span>
    </div>
    <p className="mt-1 text-xs text-slate-500">IP: {user.lastLoginIp}</p>
  </div>

  {/* Security Score */}
  <div className="glass-panel p-4 transition-all hover:border-accent/30">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-400">Security Score</span>
      <Shield className="h-5 w-5 text-accent" />
    </div>
    <div className="mt-2">
      <span className="text-xl font-bold">{user.securityScore}/100</span>
      <span className="ml-2 text-xs font-medium text-benign">+Excellent</span>
    </div>
  </div>

  {/* MFA Status */}
  <div className="glass-panel p-4 transition-all hover:border-accent/30">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-400">MFA Status</span>
      <KeyRound className="h-5 w-5 text-accent" />
    </div>
    <div className="mt-2">
      <span className="text-xl font-bold">{user.mfaEnabled ? 'Enabled' : 'Disabled'}</span>
    </div>
    <p className="mt-1 text-xs text-slate-500">Authenticator app</p>
  </div>

  {/* Connected Devices */}
  <div className="glass-panel p-4 transition-all hover:border-accent/30">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-400">Connected Devices</span>
      <Monitor className="h-5 w-5 text-accent" />
    </div>
    <div className="mt-2">
      <span className="text-xl font-bold">{user.connectedDevices}</span>
    </div>
    <p className="mt-1 text-xs text-slate-500">Trusted</p>
  </div>
</div>

          {/* Personal Information */}
          <InfoCard title="Personal Information" description="Manage your personal details">
            <div className="divide-y divide-white/5">
              <EditableField label="Full Name" value={user.fullName} fieldKey="fullName" onSave={handleFieldSave} />
              <EditableField label="Username" value={user.username} fieldKey="username" onSave={handleFieldSave} />
              <EditableField label="Email" value={user.email} fieldKey="email" onSave={handleFieldSave} schema={z.string().email()} />
              <EditableField label="Phone" value={user.phone} fieldKey="phone" onSave={handleFieldSave} />
              <EditableField label="Job Title" value={user.jobTitle} fieldKey="jobTitle" onSave={handleFieldSave} />
              <EditableField label="Department" value={user.department} fieldKey="department" onSave={handleFieldSave} />
              <EditableField label="Location" value={user.location} fieldKey="location" onSave={handleFieldSave} />
              <EditableField label="Timezone" value={user.timezone} fieldKey="timezone" onSave={handleFieldSave} />
              <EditableField label="Language" value={user.language} fieldKey="language" onSave={handleFieldSave} />
              <EditableField label="Bio" value={user.bio} fieldKey="bio" onSave={handleFieldSave} />
            </div>
          </InfoCard>

          {/* Organization */}
          <InfoCard title="Organization" description="Your workspace and team">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-400">Company</span><p className="font-medium">{user.organization}</p></div>
              <div><span className="text-slate-400">Workspace</span><p className="font-medium">{user.workspace}</p></div>
              <div><span className="text-slate-400">Team</span><p className="font-medium">{user.team}</p></div>
              <div><span className="text-slate-400">License</span><p className="font-medium">{user.license}</p></div>
              <div className="col-span-2"><span className="text-slate-400">Permissions</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.permissions.map(p => (
                    <span key={p} className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security Center */}
          <InfoCard title="Security Center">
            <CollapsibleSection title="Password" summary="Last changed 30 days ago">
              <p className="text-xs text-slate-400 mb-2">Choose a strong, unique password.</p>
              <Button variant="outline" size="sm">Update Password</Button>
            </CollapsibleSection>
            <Separator className="bg-white/5" />
            <CollapsibleSection title="Multi-Factor Authentication" summary={user.mfaEnabled ? "Active" : "Inactive"}>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${user.mfaEnabled ? "bg-benign" : "bg-danger"}`} />
                <span className="text-sm">{user.mfaEnabled ? "Enabled via authenticator app" : "Not configured"}</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2">{user.mfaEnabled ? "Manage MFA" : "Enable MFA"}</Button>
            </CollapsibleSection>
            <Separator className="bg-white/5" />
            <CollapsibleSection title="Active Sessions">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Chrome on macOS</span>
                  <span className="text-slate-400">Current</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Firefox on Windows</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-danger">Revoke</Button>
                </div>
              </div>
            </CollapsibleSection>
          </InfoCard>

          {/* Activity Timeline */}
          <InfoCard title="Recent Activity">
            <div className="space-y-1">
              {activityLog.map((event, i) => (
                <TimelineEvent key={i} {...event} />
              ))}
            </div>
          </InfoCard>
        </div>
      </div>

      {/* Notification Preferences */}
      <InfoCard title="Notification Preferences" description="Control how you receive alerts and updates">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <SettingToggle label="Email Alerts" description="Receive critical threat alerts" checked={notifications.emailAlerts} onCheckedChange={(v) => setNotifications(prev => ({ ...prev, emailAlerts: v }))} />
          <SettingToggle label="Threat Notifications" description="Real-time intrusion alerts" checked={notifications.threatNotifications} onCheckedChange={(v) => setNotifications(prev => ({ ...prev, threatNotifications: v }))} />
          <SettingToggle label="Weekly Reports" description="Summary of weekly activity" checked={notifications.weeklyReports} onCheckedChange={(v) => setNotifications(prev => ({ ...prev, weeklyReports: v }))} />
          <SettingToggle label="System Maintenance" description="Planned downtime and updates" checked={notifications.maintenance} onCheckedChange={(v) => setNotifications(prev => ({ ...prev, maintenance: v }))} />
          <SettingToggle label="Security Advisories" description="Vulnerability notices" checked={notifications.securityAdvisories} onCheckedChange={(v) => setNotifications(prev => ({ ...prev, securityAdvisories: v }))} />
        </div>
      </InfoCard>

      {/* Appearance */}
      <InfoCard title="Appearance" description="Customize your dashboard look">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className="text-xs text-slate-400 mb-1">Theme</p><p className="text-sm font-medium">Dark (default)</p></div>
          <div><p className="text-xs text-slate-400 mb-1">Accent Color</p><p className="text-sm font-medium">Cyan</p></div>
          <div><p className="text-xs text-slate-400 mb-1">Dashboard Density</p><p className="text-sm font-medium">Comfortable</p></div>
          <div><p className="text-xs text-slate-400 mb-1">Time Format</p><p className="text-sm font-medium">24-hour</p></div>
        </div>
      </InfoCard>

      {/* Privacy */}
      <InfoCard title="Privacy & Data" description="Manage your data and connected apps">
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="sm">Download My Data</Button>
          <Button variant="outline" size="sm">Export Account Data</Button>
          <Button variant="outline" size="sm">Connected Applications</Button>
        </div>
      </InfoCard>

      {/* Danger Zone */}
      <div className="glass-panel border border-danger/30 bg-danger/5 p-6">
        <h3 className="text-lg font-semibold text-danger mb-4">Danger Zone</h3>
        <div className="space-y-1">
          <DangerAction
            title="Delete Account"
            description="Permanently remove your account and all associated data."
            buttonLabel="Delete Account"
            onConfirm={() => alert("Account deletion triggered (demo)")}
          />
          <DangerAction
            title="Deactivate Account"
            description="Temporarily suspend your account."
            buttonLabel="Deactivate"
            onConfirm={() => alert("Deactivation triggered (demo)")}
          />
          <DangerAction
            title="Transfer Ownership"
            description="Transfer your ownership to another user."
            buttonLabel="Transfer"
            onConfirm={() => alert("Transfer triggered (demo)")}
          />
          <DangerAction
            title="Logout All Sessions"
            description="Revoke all active sessions except this one."
            buttonLabel="Logout All"
            onConfirm={() => alert("All sessions revoked (demo)")}
          />
        </div>
      </div>
    </div>
  );
}