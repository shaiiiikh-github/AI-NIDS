import { useEffect, useState } from 'react';
import type { PredictionRecord } from '../types/nids';

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      const newPrediction: PredictionRecord = JSON.parse(event.data);
      setData((prev) => [newPrediction, ...prev].slice(0, 50)); // keep last 50
    };
    return () => ws.close();
  }, [url]);

  return data;
};