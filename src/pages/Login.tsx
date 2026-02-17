import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
    const { login, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
        } catch (err: any) {
            setLocalError(err.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    {/* Logo & Branding */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/30 mb-4">
                            <img
                                src="/glisten-logo.png"
                                alt="Glisten International Academy"
                                className="w-14 h-14 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <span className="hidden text-brand-400 font-bold text-2xl font-display">G</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                            GIAA Grant Agent
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Glisten International Academy — AI Grant Management
                        </p>
                    </div>

                    {/* Error Display */}
                    {(localError || error) && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {localError || error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="director@glistenacademy.edu.ng"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600/50
                           text-white placeholder-slate-500 outline-none
                           focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20
                           transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600/50
                           text-white placeholder-slate-500 outline-none
                           focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20
                           transition-all duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-brand-500 to-brand-600
                         hover:from-brand-400 hover:to-brand-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg shadow-brand-500/20
                         flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 text-center">
                            Glisten International Academy, Plot 1457, Jahi District, Abuja
                        </p>
                        <p className="text-xs text-slate-600 text-center mt-1">
                            Powered by GIAA AI Grant Intelligence
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
