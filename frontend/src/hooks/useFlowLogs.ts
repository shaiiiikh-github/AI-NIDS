import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface FlowLog {
  id: number;
  timestamp: string;

  srcIp: string;
  srcPort: number;

  dstIp: string;
  dstPort: number;

  protocol: string;

  flowDuration: number;

  totFwdPkts: number;
  totBwdPkts: number;

  label: string;
  confidence: number;

  uncertain: boolean;
  alternative: string | null;

  isAlert: boolean;
}

export interface FlowLogsResponse {
  total: number;
  items: FlowLog[];
}

export interface FlowDetailResponse {
  id: number;
  timestamp: string;

  srcIp: string;
  srcPort: number;

  dstIp: string;
  dstPort: number;

  protocol: string;

  label: string;
  confidence: number;

  uncertain: boolean;
  alternative: string | null;

  isAlert: boolean;

  rawFeatures: Record<string, unknown> | null;
}

interface FlowLogFilters {
  limit: number;
  offset: number;
  label?: string;
  srcIp?: string;
  dstIp?: string;
  alertsOnly?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Hooks                                                                       */
/* -------------------------------------------------------------------------- */

export const useFlowLogs = (filters: FlowLogFilters) => {
  return useQuery({
    queryKey: ["flow-logs", filters],

    queryFn: async () => {
      const { data } = await apiClient.get<FlowLogsResponse>("/flows", {
  params: {
    limit: filters.limit,
    offset: filters.offset,
    label: filters.label,
    src_ip: filters.srcIp,
    dst_ip: filters.dstIp,
    alerts_only: filters.alertsOnly,
  },
});

      return data;
    },

  });
};

export const useFlowDetail = (id: number) => {
  return useQuery({
    queryKey: ["flow-detail", id],

    queryFn: async () => {
      const { data } = await apiClient.get<FlowDetailResponse>(`/flows/${id}`);
      return data;
    },

    enabled: !!id,
  });
};