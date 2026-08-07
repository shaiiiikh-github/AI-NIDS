// src/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type {
  SystemHealth,
  NetworkMetrics,
  AttackDistribution,
  AttackTrendPoint,
  PredictionRecord,
} from '@/types/nids';

// ---------- Mock Data (aligned with types) ----------
const mockHealth: SystemHealth = {
  status: 'operational',
  uptimeSeconds: 86400 * 30, // 30 days
  cpuUsage: 12.5,
  memoryUsage: 45.2,
  activeNodes: 24,
  lastSync: new Date().toISOString(),
};

const mockMetrics: NetworkMetrics = {
  totalInspections: 1_847_293,
  inspectionDeltaPct: 12.4,
  threatsDetected: 1_203,
  threatDeltaPct: -8.1,
  modelAccuracy: 99.4,
  avgLatencyMs: 8,
};

const mockDistribution: AttackDistribution[] = [
  { category: 'DDoS', count: 420, percentage: 34.9, color: '#EF4444' },
  { category: 'Brute Force', count: 312, percentage: 25.9, color: '#F59E0B' },
  { category: 'Malware', count: 198, percentage: 16.5, color: '#8B5CF6' },
  { category: 'Reconnaissance', count: 156, percentage: 13.0, color: '#3B82F6' },
  { category: 'Other', count: 117, percentage: 9.7, color: '#6B7280' },
];

// Generate 24 data points for trend
const now = Date.now();
const mockTrends: AttackTrendPoint[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(now - (23 - i) * 3600_000).toISOString(),
  normalTraffic: Math.floor(Math.random() * 800) + 200,
  maliciousTraffic: Math.floor(Math.random() * 100) + 10,
  anomalies: Math.floor(Math.random() * 20) + 2,
}));

const mockPredictions: PredictionRecord[] = [
  {
    id: 'pred-7f3a2c',
    timestamp: new Date().toISOString(),
    sourceIP: '192.168.1.105',
    destinationIP: '10.0.0.24',
    protocol: 'TCP',
    prediction: 'Benign',
    confidence: 0.997,
    riskLevel: 'SAFE',
    responseTimeMs: 7,
  },
  {
    id: 'pred-8b4d1e',
    timestamp: new Date(Date.now() - 120_000).toISOString(),
    sourceIP: '10.0.0.7',
    destinationIP: '192.168.1.1',
    protocol: 'UDP',
    prediction: 'Suspicious Payload',
    confidence: 0.89,
    riskLevel: 'HIGH',
    responseTimeMs: 14,
  },
  {
    id: 'pred-9c5f2g',
    timestamp: new Date(Date.now() - 300_000).toISOString(),
    sourceIP: '172.16.0.45',
    destinationIP: '10.0.0.99',
    protocol: 'TCP',
    prediction: 'Benign',
    confidence: 0.992,
    riskLevel: 'SAFE',
    responseTimeMs: 6,
  },
  {
    id: 'pred-0d6e3h',
    timestamp: new Date(Date.now() - 600_000).toISOString(),
    sourceIP: '192.168.2.88',
    destinationIP: '10.0.0.12',
    protocol: 'ICMP',
    prediction: 'Malicious Packet',
    confidence: 0.78,
    riskLevel: 'MEDIUM',
    responseTimeMs: 11,
  },
  {
    id: 'pred-1e7f4i',
    timestamp: new Date(Date.now() - 900_000).toISOString(),
    sourceIP: '10.0.0.34',
    destinationIP: '192.168.1.200',
    protocol: 'HTTP',
    prediction: 'Benign',
    confidence: 0.995,
    riskLevel: 'SAFE',
    responseTimeMs: 5,
  },
];

// ---------- Fetch function (with mock fallback) ----------
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const fetchDashboardData = async () => {
  if (useMockData) {
    console.log('🔵 Using mock dashboard data');
    return {
      health: mockHealth,
      metrics: mockMetrics,
      distribution: mockDistribution,
      trends: mockTrends,
      predictions: mockPredictions,
    };
  }

  // Real API calls
  const [health, metrics, distribution, trends, predictions] = await Promise.all([
    apiClient.get<SystemHealth>('/health'),
    apiClient.get<NetworkMetrics>('/metrics'),
    apiClient.get<AttackDistribution[]>('/attacks/distribution'),
    apiClient.get<AttackTrendPoint[]>('/attacks/trends'),
    apiClient.get<PredictionRecord[]>('/predictions/recent'),
  ]);

  return {
    health: health.data,
    metrics: metrics.data,
    distribution: distribution.data,
    trends: trends.data,
    predictions: predictions.data,
  };
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 30_000,
    refetchInterval: useMockData ? false : 60_000,
    retry: useMockData ? false : 3,
  });
};