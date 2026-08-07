import type {
  SystemHealth,
  NetworkMetrics,
  AttackDistribution,
  AttackTrendPoint,
  PredictionRecord,
} from '@/types/nids';

const MOCK_DELAY = 400;

export const fetchSystemHealth = async (): Promise<SystemHealth> => {
  await new Promise((res) => setTimeout(res, MOCK_DELAY));
  return {
    status: 'operational',
    uptimeSeconds: 1249200,
    cpuUsage: 24.5,
    memoryUsage: 41.2,
    activeNodes: 12,
    lastSync: new Date().toISOString(),
  };
};

export const fetchMetrics = async (): Promise<NetworkMetrics> => {
  await new Promise((res) => setTimeout(res, MOCK_DELAY));
  return {
    totalInspections: 4892104,
    threatsDetected: 14208,
    modelAccuracy: 99.42,
    avgLatencyMs: 12.4,
    inspectionDeltaPct: 14.2,
    threatDeltaPct: -3.8,
  };
};

export const fetchAttackDistribution = async (): Promise<AttackDistribution[]> => {
  return [
    { category: 'DDoS / Syn Flood', count: 5420, percentage: 38.1, color: '#EF4444' },
    { category: 'Port Scanning', count: 3210, percentage: 22.6, color: '#F59E0B' },
    { category: 'SQL Injection', count: 2890, percentage: 20.3, color: '#6366F1' },
    { category: 'Malware Payload', count: 1840, percentage: 12.9, color: '#EC4899' },
    { category: 'Anomaly / Unknown', count: 848, percentage: 6.1, color: '#10B981' },
  ];
};

export const fetchAttackTrends = async (): Promise<AttackTrendPoint[]> => {
  return [
    { timestamp: '00:00', normalTraffic: 14200, maliciousTraffic: 120, anomalies: 15 },
    { timestamp: '04:00', normalTraffic: 11000, maliciousTraffic: 90, anomalies: 8 },
    { timestamp: '08:00', normalTraffic: 28400, maliciousTraffic: 410, anomalies: 42 },
    { timestamp: '12:00', normalTraffic: 42100, maliciousTraffic: 890, anomalies: 78 },
    { timestamp: '16:00', normalTraffic: 38900, maliciousTraffic: 620, anomalies: 51 },
    { timestamp: '20:00', normalTraffic: 24500, maliciousTraffic: 310, anomalies: 22 },
  ];
};

export const fetchRecentPredictions = async (): Promise<PredictionRecord[]> => {
  return [
    {
      id: 'PRED-8902',
      timestamp: 'Just now',
      sourceIP: '192.168.1.104',
      destinationIP: '10.0.0.12',
      protocol: 'TCP',
      prediction: 'DDoS Attack (SYN Flood)',
      confidence: 0.984,
      riskLevel: 'CRITICAL',
      responseTimeMs: 11.2,
    },
    {
      id: 'PRED-8901',
      timestamp: '2 min ago',
      sourceIP: '45.33.32.156',
      destinationIP: '10.0.0.4',
      protocol: 'HTTP',
      prediction: 'SQL Injection Attempt',
      confidence: 0.941,
      riskLevel: 'HIGH',
      responseTimeMs: 14.8,
    },
    {
      id: 'PRED-8900',
      timestamp: '5 min ago',
      sourceIP: '10.0.4.12',
      destinationIP: '10.0.0.1',
      protocol: 'UDP',
      prediction: 'Normal Network Traffic',
      confidence: 0.998,
      riskLevel: 'SAFE',
      responseTimeMs: 8.4,
    },
    {
      id: 'PRED-8899',
      timestamp: '12 min ago',
      sourceIP: '185.220.101.5',
      destinationIP: '10.0.2.88',
      protocol: 'TCP',
      prediction: 'Port Scan Reconnaissance',
      confidence: 0.876,
      riskLevel: 'MEDIUM',
      responseTimeMs: 13.1,
    },
    {
      id: 'PRED-8898',
      timestamp: '18 min ago',
      sourceIP: '10.0.4.55',
      destinationIP: '10.0.0.1',
      protocol: 'ICMP',
      prediction: 'Normal Network Traffic',
      confidence: 0.999,
      riskLevel: 'SAFE',
      responseTimeMs: 7.9,
    },
  ];
};