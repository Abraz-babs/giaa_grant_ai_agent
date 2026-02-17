import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'VIEWER';
    phone?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('giaa_token'));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const didVerify = useRef(false);

    const logout = useCallback(() => {
        localStorage.removeItem('giaa_token');
        localStorage.removeItem('giaa_user');
        setUser(null);
        setToken(null);
    }, []);

    // Verify existing token ONCE on mount — no dependency on token
    useEffect(() => {
        if (didVerify.current) return;
        didVerify.current = true;

        const storedToken = localStorage.getItem('giaa_token');
        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        api.auth.verify()
            .then(({ user: userData }) => {
                setUser(userData);
                setIsLoading(false);
            })
            .catch(() => {
                // Token invalid — clear silently, no reload
                localStorage.removeItem('giaa_token');
                localStorage.removeItem('giaa_user');
                setUser(null);
                setToken(null);
                setIsLoading(false);
            });
    }, []); // Empty deps — runs once

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const { token: newToken, user: userData } = await api.auth.login(email, password);
            localStorage.setItem('giaa_token', newToken);
            localStorage.setItem('giaa_user', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user && !!token,
            isLoading,
            login,
            logout,
            error,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
