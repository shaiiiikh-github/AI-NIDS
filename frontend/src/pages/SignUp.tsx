// src/pages/SignUp.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const PrimaryButton: React.FC<{
    children: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
}> = ({ children, className = '', type = "button", onClick, disabled }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 px-6 py-3 text-base flex items-center justify-center gap-2 ${className}`}
        >
            {children}
        </button>
    );
};

export const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useUser();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await signup({ fullName, email, password });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="bg-[#0B1220] text-white h-screen overflow-y-auto overflow-x-hidden font-sans selection:bg-primary/30 selection:text-white flex flex-col px-4">
            <div className="flex-grow" />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 mx-auto py-6"
            >
                {/* Logo & Header */}
                <div className="text-center mb-4">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Create an account</h1>
                    <p className="text-sm text-neutral-400">Join AI-NIDS to secure your network</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-neutral-500" />
                                    </div>
                                    <input 
                                        id="name" 
                                        type="text" 
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="block w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors sm:text-sm" 
                                        placeholder="John Doe" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-neutral-500" />
                                    </div>
                                    <input 
                                        id="email" 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors sm:text-sm" 
                                        placeholder="you@company.com" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="password">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-500" />
                                    </div>
                                    <input 
                                        id="password" 
                                        type="password" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors sm:text-sm" 
                                        placeholder="••••••••" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="confirm-password">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-500" />
                                    </div>
                                    <input 
                                        id="confirm-password" 
                                        type="password" 
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors sm:text-sm" 
                                        placeholder="••••••••" 
                                    />
                                </div>
                            </div>
                        </div>

                        <PrimaryButton type="submit" className="py-2.5" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </PrimaryButton>
                    </form>

                    <div className="mt-5">
                        <div className="flex items-center">
                            <div className="flex-1 border-t border-white/10"></div>
                            <div className="px-3 text-xs text-neutral-400">Or continue with</div>
                            <div className="flex-1 border-t border-white/10"></div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-neutral-300 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <svg className="h-4 w-4 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                                    <path
                                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                        fill="#34A853"
                                    />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-neutral-300 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <svg className="h-4 w-4 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-neutral-400">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
            <div className="flex-grow" />
            
            {/* Background glowing effects */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default SignUp;