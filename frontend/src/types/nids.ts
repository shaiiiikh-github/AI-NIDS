export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export interface SystemHealth {
  status: 'operational' | 'degraded' | 'offline';
  uptimeSeconds: number;
  cpuUsage: number;
  memoryUsage: number;
  activeNodes: number;
  lastSync: string;
}

export interface NetworkMetrics {
  totalInspections: number;
  threatsDetected: number;
  modelAccuracy: number;
  avgLatencyMs: number;
  inspectionDeltaPct: number;
  threatDeltaPct: number;
}

export interface AttackDistribution {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AttackTrendPoint {
  timestamp: string;
  normalTraffic: number;
  maliciousTraffic: number;
  anomalies: number;
}

export interface PredictionRecord {
  id: string;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP';
  prediction: string;
  confidence: number;
  riskLevel: RiskLevel;
  responseTimeMs: number;
}   