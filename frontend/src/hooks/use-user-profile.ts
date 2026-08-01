import { useState, useEffect } from "react";

export interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  role: string;
  department: string;
  jobTitle: string;
  phone: string;
  location: string;
  timezone: string;
  language: string;
  bio: string;
  organization: string;
  workspace: string;
  memberSince: string;
  mfaEnabled: boolean;
  verified: boolean;
  permissions: string[];
  team: string;
  license: string;
  securityScore: number;
  lastLogin: string;
  lastLoginIp: string;
  currentSession: string;
  connectedDevices: number;
}

const mockUser: UserProfile = {
  fullName: "Sarah Chen",
  username: "sarahchen",
  email: "sarah.chen@ainids.com",
  role: "Security Operations Lead",
  department: "Security Operations",
  jobTitle: "Lead Analyst",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  timezone: "America/Los_Angeles",
  language: "English",
  bio: "Experienced cybersecurity professional focused on threat detection and incident response.",
  organization: "Acme Corp",
  workspace: "US-East",
  memberSince: "2023-10-15",
  mfaEnabled: true,
  verified: true,
  permissions: ["read:alerts", "write:alerts", "manage:users"],
  team: "Threat Response",
  license: "Enterprise",
  securityScore: 98,
  lastLogin: "2025-03-10T09:42:00Z",
  lastLoginIp: "192.168.1.42",
  currentSession: "Chrome on macOS",
  connectedDevices: 3,
};

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return { user, loading, updateUser: (updated: Partial<UserProfile>) => setUser(prev => prev ? { ...prev, ...updated } : prev) };
}