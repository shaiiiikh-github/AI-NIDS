// src/pages/Prediction.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    ShieldCheck,
    Activity,
    Server,
    Send,
    AlertTriangle,
    Clock,
    Terminal,
    Info
} from 'lucide-react';
import type { AxiosError } from 'axios';
import apiClient from '@/services/apiClient';
import type { RiskLevel } from '@/types/nids';

// 1. Define the strictly typed Zod Schema for the API Contract
const predictionSchema = z.object({
    sourceIP: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "Invalid IP address format"),
    destinationIP: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "Invalid IP address format"),
    protocol: z.enum(['TCP', 'UDP', 'ICMP', 'HTTP']),
    packetSize: z.number().min(1, "Packet size must be at least 1 byte").max(65535, "Max size exceeded"),
    port: z.number().min(1).max(65535, "Invalid port number"),
});

type PredictionFormValues = z.infer<typeof predictionSchema>;

// Mock Result Type
interface PredictionResult {
    classification: string;
    confidence: number;
    riskLevel: RiskLevel;
    recommendation: string;
    description: string;
    responseTimeMs: number;
}

export const Prediction: React.FC = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PredictionFormValues>({
        resolver: zodResolver(predictionSchema),
        defaultValues: {
            protocol: 'TCP',
            packetSize: 512,
        }
    });

    const onSubmit = async (data: PredictionFormValues) => {
        setIsAnalyzing(true);
        setResult(null);
        setError(null);

        try {
            const response = await apiClient.post<PredictionResult>('/predict', data);
            setResult(response.data);
        } catch (err) {
            const axiosErr = err as AxiosError<{ detail?: string }>;
            setError(
                axiosErr.response?.data?.detail ||
                axiosErr.message ||
                'Inference request failed. Confirm the backend is running on the configured API URL.'
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getRiskStyles = (level: RiskLevel) => {
        switch (level) {
            case 'CRITICAL': return 'text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
            case 'HIGH': return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
            case 'SAFE': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            default: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Real-time Inference Engine
                </h1>
                <p className="text-sm text-neutral-400 mt-1">
                    Manually test packet parameters against the AI-NIDS classification model.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Input Form */}
                <div className="w-full lg:w-1/2 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />

                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" /> Packet Parameters
                    </h2>

                    <div className="mb-6 flex items-start gap-2 text-[11px] leading-relaxed text-neutral-400 bg-neutral-950/50 border border-neutral-800/80 rounded-xl p-3 relative z-10">
                        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>
                            This form submits a single approximated packet (protocol, size, port) to the model,
                            not a captured flow. Fields the model needs beyond these are zero-filled, so results
                            are a best-effort estimate -- not equivalent to live traffic analysis.
                        </span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300">Source IP</label>
                                <input
                                    {...register('sourceIP')}
                                    placeholder="192.168.1.1"
                                    className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 font-mono transition-all"
                                />
                                {errors.sourceIP && <p className="text-[10px] text-red-400">{errors.sourceIP.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300">Destination IP</label>
                                <input
                                    {...register('destinationIP')}
                                    placeholder="10.0.0.5"
                                    className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 font-mono transition-all"
                                />
                                {errors.destinationIP && <p className="text-[10px] text-red-400">{errors.destinationIP.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300">Protocol</label>
                                <select
                                    {...register('protocol')}
                                    className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all"
                                >
                                    <option value="TCP">TCP</option>
                                    <option value="UDP">UDP</option>
                                    <option value="ICMP">ICMP</option>
                                    <option value="HTTP">HTTP</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300">Target Port</label>
                                <input
                                    type="number"
                                    {...register('port', { valueAsNumber: true })}
                                    placeholder="443"
                                    className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 font-mono transition-all"
                                />
                                {errors.port && <p className="text-[10px] text-red-400">{errors.port.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-300">Size (Bytes)</label>
                                <input
                                    type="number"
                                    {...register('packetSize', { valueAsNumber: true })}
                                    placeholder="512"
                                    className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 font-mono transition-all"
                                />
                                {errors.packetSize && <p className="text-[10px] text-red-400">{errors.packetSize.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isAnalyzing}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing Payload...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Run Inference
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Column: Animated Result Panel */}
                <div className="w-full lg:w-1/2 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!result && !isAnalyzing && !error && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center p-8 border border-neutral-800/50 border-dashed rounded-2xl bg-neutral-900/20"
                            >
                                <Server className="w-12 h-12 text-neutral-700 mb-4" />
                                <h3 className="text-neutral-400 font-medium">Awaiting Telemetry</h3>
                                <p className="text-xs text-neutral-600 mt-2 max-w-xs">
                                    Enter packet details and run inference to see the AI classification results here.
                                </p>
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-md border border-neutral-800"
                            >
                                <Activity className="w-12 h-12 text-indigo-500 animate-pulse mb-4" />
                                <h3 className="text-indigo-400 font-medium font-mono text-sm">EVALUATING TENSORS</h3>
                                <div className="w-48 h-1 bg-neutral-800 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-1/2 animate-[ping_1s_ease-in-out_infinite]" />
                                </div>
                            </motion.div>
                        )}

                        {error && !isAnalyzing && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-md border border-red-500/20"
                            >
                                <ShieldAlert className="w-12 h-12 text-red-400 mb-4" />
                                <h3 className="text-red-400 font-medium">Inference Failed</h3>
                                <p className="text-xs text-neutral-500 mt-2 max-w-xs">{error}</p>
                            </motion.div>
                        )}

                        {result && !isAnalyzing && !error && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="h-full flex flex-col bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${result.riskLevel === 'SAFE' ? 'bg-emerald-500' : 'bg-red-500'}`} />

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div>
                                        <span className="text-xs font-mono text-neutral-500 mb-1 block">PREDICTION RESULT</span>
                                        <h2 className="text-xl font-bold text-white">{result.classification}</h2>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${getRiskStyles(result.riskLevel)}`}>
                                        {result.riskLevel === 'SAFE' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                        <span className="text-xs font-bold tracking-wider">{result.riskLevel}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                                    <div className="bg-neutral-950/50 border border-neutral-800/80 rounded-xl p-4">
                                        <span className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">Confidence Score</span>
                                        <div className="text-2xl font-mono text-white mt-1">{(result.confidence * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-neutral-950/50 border border-neutral-800/80 rounded-xl p-4">
                                        <span className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">Inference Time</span>
                                        <div className="text-2xl font-mono text-white mt-1 flex items-center gap-2">
                                            {result.responseTimeMs}<span className="text-sm text-neutral-500">ms</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1 relative z-10">
                                    <div>
                                        <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Threat Analysis
                                        </h4>
                                        <p className="text-sm text-neutral-400 leading-relaxed bg-neutral-950/30 p-3 rounded-lg border border-neutral-800/50">
                                            {result.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                                            <Clock className="w-3.5 h-3.5" /> Recommended Action
                                        </h4>
                                        <p className="text-sm text-neutral-400 leading-relaxed bg-neutral-950/30 p-3 rounded-lg border border-neutral-800/50">
                                            {result.recommendation}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Prediction;