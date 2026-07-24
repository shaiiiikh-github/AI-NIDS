// src/pages/Analytics.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    Crosshair,
    Network,
    Cpu,
    Download
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
} from 'recharts';

// Mock Data for Deep Analytics
const featureImportanceData = [
    { feature: 'Packet Size', weight: 0.85 },
    { feature: 'Destination Port', weight: 0.72 },
    { feature: 'Protocol Type', weight: 0.64 },
    { feature: 'Inter-arrival Time', weight: 0.58 },
    { feature: 'Flag Sequence', weight: 0.45 },
    { feature: 'Payload Entropy', weight: 0.38 },
];

const modelTrainingHistory = [
    { epoch: 1, loss: 0.84, accuracy: 65.2 },
    { epoch: 5, loss: 0.42, accuracy: 78.4 },
    { epoch: 10, loss: 0.21, accuracy: 89.1 },
    { epoch: 15, loss: 0.12, accuracy: 94.3 },
    { epoch: 20, loss: 0.08, accuracy: 97.8 },
    { epoch: 25, loss: 0.04, accuracy: 99.1 },
    { epoch: 30, loss: 0.02, accuracy: 99.4 },
];

export const Analytics: React.FC = () => {
    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Network className="w-8 h-8 text-indigo-500" /> Model Analytics
                    </h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        Deep dive into model architecture performance, feature weighting, and classification matrices.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 px-4 py-2 rounded-xl text-xs font-medium text-neutral-200 transition-all shadow-sm">
                    <Download className="w-4 h-4" /> Export Report PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Confusion Matrix (Custom Grid) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-400" /> Confusion Matrix
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">Model evaluation on validation set (n=10,000)</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                            {/* Headers */}
                            <div className="col-span-1"></div>
                            <div className="text-center text-[10px] font-mono text-neutral-500 mb-2">PREDICTED SAFE</div>
                            <div className="text-center text-[10px] font-mono text-neutral-500 mb-2">PREDICTED THREAT</div>

                            {/* Row 1: Actual Safe */}
                            <div className="flex items-center justify-end text-[10px] font-mono text-neutral-500 pr-4">ACTUAL SAFE</div>
                            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="text-2xl font-mono font-bold text-emerald-400">8,420</div>
                                <div className="text-[10px] text-emerald-500/70 uppercase">True Negative</div>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-mono font-bold text-red-400">12</div>
                                <div className="text-[10px] text-red-500/70 uppercase">False Positive</div>
                            </div>

                            {/* Row 2: Actual Threat */}
                            <div className="flex items-center justify-end text-[10px] font-mono text-neutral-500 pr-4">ACTUAL THREAT</div>
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-mono font-bold text-amber-400">8</div>
                                <div className="text-[10px] text-amber-500/70 uppercase">False Negative</div>
                            </div>
                            <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-mono font-bold text-indigo-400">1,560</div>
                                <div className="text-[10px] text-indigo-500/70 uppercase">True Positive</div>
                            </div>
                        </div>

                        <div className="w-full max-w-sm mt-6 grid grid-cols-2 gap-4 border-t border-neutral-800/80 pt-4">
                            <div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Precision</div>
                                <div className="text-lg font-mono text-white">99.23%</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Recall</div>
                                <div className="text-lg font-mono text-white">99.48%</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Feature Importance Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col"
                >
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-amber-400" /> Feature Importance
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">SHAP values indicating influence on model decisions</p>
                    </div>

                    <div className="flex-1 min-h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={featureImportanceData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#262626" />
                                <XAxis type="number" domain={[0, 1]} hide />
                                <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: '#262626', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '12px', fontSize: '12px' }}
                                />
                                <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={20}>
                                    {featureImportanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`rgba(99, 102, 241, ${entry.weight + 0.2})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Model Training Convergence */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
                        <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-indigo-400" /> Training Convergence History
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">Loss reduction and accuracy scaling over 30 epochs</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                            <span className="flex items-center gap-1.5 text-neutral-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Accuracy (%)
                            </span>
                            <span className="flex items-center gap-1.5 text-neutral-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Loss
                            </span>
                        </div>
                    </div>

                    <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={modelTrainingHistory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                                <XAxis dataKey="epoch" stroke="#737373" fontSize={11} tickLine={false} tickFormatter={(val) => `Ep ${val}`} />
                                <YAxis yAxisId="left" stroke="#737373" fontSize={11} tickLine={false} domain={[0, 100]} />
                                <YAxis yAxisId="right" orientation="right" stroke="#737373" fontSize={11} tickLine={false} domain={[0, 1]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '12px', fontSize: '12px' }}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Analytics;