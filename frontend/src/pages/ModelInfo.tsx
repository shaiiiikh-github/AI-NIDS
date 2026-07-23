// src/pages/ModelInfo.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Database, BrainCircuit, Layers } from 'lucide-react';

export const ModelInfo: React.FC = () => {
  return (
    <div className="min-h-full bg-grid-pattern p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-500" /> Model Architecture
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Technical specifications and training parameters of the active AI-NIDS engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <BrainCircuit className="w-6 h-6 text-indigo-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Algorithm</h3>
          <p className="text-sm text-neutral-400 mb-4">Deep Neural Network (DNN) optimized for sequential packet analysis and anomaly detection.</p>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-500">Framework</span><span className="text-white">PyTorch 2.0</span></div>
            <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-500">Layers</span><span className="text-white">6 Dense + 2 Dropout</span></div>
            <div className="flex justify-between pb-1"><span className="text-neutral-500">Activation</span><span className="text-white">ReLU / Softmax</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <Database className="w-6 h-6 text-emerald-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Training Dataset</h3>
          <p className="text-sm text-neutral-400 mb-4">Trained on a comprehensive dataset of modern network attack signatures and benign traffic.</p>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-500">Source</span><span className="text-white">CIC-IDS2017 / UNSW-NB15</span></div>
            <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-500">Sample Size</span><span className="text-white">2.8M Records</span></div>
            <div className="flex justify-between pb-1"><span className="text-neutral-500">Feature Count</span><span className="text-white">78 Network Features</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <Layers className="w-6 h-6 text-amber-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Hyperparameters</h3>
          <p className="text-sm text-neutral-400 mb-4">Tuned parameters for optimal balance between inference speed and detection accuracy.</p>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-500">Learning Rate</span><span className="text-white">0.001</span></div>
            <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-500">Batch Size</span><span className="text-white">512</span></div>
            <div className="flex justify-between pb-1"><span className="text-neutral-500">Optimizer</span><span className="text-white">AdamW</span></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};