import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';

const PrimaryButton: React.FC<{ children: React.ReactNode; className?: string; type?: "button" | "submit" | "reset"; onClick?: () => void }> = ({
    children,
    className = '',
    type = "button",
    onClick,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 px-6 py-3 text-base flex items-center justify-center gap-2 ${className}`}
        >
            {children}
        </button>
    );
};

export const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleRequestOTP = (e: React.FormEvent) => {
        e.preventDefault();
        // UI-only flow: switch to OTP verification step
        setStep('otp');
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        // UI-only flow: navigate to dashboard or back to sign in
        navigate('/signin');
    };

    return (
        <div className="bg-[#0B1220] text-white min-h-screen flex items-center justify-center overflow-hidden font-sans selection:bg-primary/30 selection:text-white p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Shield className="w-7 h-7 text-primary" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        {step === 'email' ? 'Reset password' : 'Check your email'}
                    </h1>
                    <p className="text-neutral-400">
                        {step === 'email' 
                            ? "Enter your email and we'll send a verification OTP to the admin."
                            : `We've sent a 6-digit OTP code to ${email || 'the admin'}.`}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    
                    <AnimatePresence mode="wait">
                        {step === 'email' ? (
                            <motion.form 
                                key="email-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleRequestOTP} 
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5" htmlFor="email">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-neutral-500" />
                                            </div>
                                            <input 
                                                id="email" 
                                                type="email" 
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors sm:text-sm" 
                                                placeholder="you@company.com" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <PrimaryButton type="submit">
                                    Send Verification OTP
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </PrimaryButton>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="otp-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleVerifyOTP} 
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5" htmlFor="otp">Verification Code</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyRound className="h-5 w-5 text-neutral-500" />
                                            </div>
                                            <input 
                                                id="otp" 
                                                type="text" 
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors text-center tracking-[0.5em] font-mono sm:text-lg" 
                                                placeholder="••••••" 
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <PrimaryButton type="submit">
                                    Verify Code
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </PrimaryButton>
                                
                                <div className="text-center mt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep('email')}
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center"
                                    >
                                        <ArrowLeft className="w-3 h-3 mr-1" />
                                        Wrong email? Go back
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <p className="mt-8 text-center text-sm text-neutral-400">
                    Remember your password?{' '}
                    <Link to="/signin" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
            
            {/* Background glowing effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default ForgotPassword;
