import { mockUser, mockGrants, mockStats, mockNotifications, mockSchoolProfile, mockAgent } from './mockData';
import { Grant, Proposal } from '@/types';

const API_BASE = '/api';

// Enable Mock Mode if on GitHub Pages or if explicitly set
const IS_GH_PAGES = window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app');
const IS_DEMO_ENV = import.meta.env.MODE === 'demo';
const FORCE_MOCK = true; // Temporary overriding to ensure it works for the presentation
const IS_DEMO = IS_GH_PAGES || IS_DEMO_ENV || FORCE_MOCK;

console.log(' [DEBUG] API Initialization:', {
    hostname: window.location.hostname,
    IS_GH_PAGES,
    IS_DEMO_ENV,
    IS_DEMO
});

function getToken(): string | null {
    return localStorage.getItem('giaa_token');
}

function getHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Request failed');
        return data.data;
    } else {
        // If we get HTML (404/500), throw specific error to trigger fallback
        throw new Error('INVALID_JSON_RESPONSE');
    }
}

// Helper to simulate network delay in demo mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth
export const api = {
    auth: {
        login: async (email: string, password: string) => {
            try {
                if (IS_DEMO) {
                    await delay(800);
                    // Accept any password for demo simplicity, or the specific ones
                    return { token: 'demo-token-123', user: mockUser };
                }
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                return await handleResponse<{ token: string; user: any }>(res);
            } catch (error: any) {
                console.warn('Login failed, attempting fallback...', error);
                // Fallback to mock if network/server fails (e.g. on static deployment)
                if (error.message === 'INVALID_JSON_RESPONSE' || error.message.includes('Unexpected token')) {
                    await delay(500);
                    return { token: 'demo-token-123', user: mockUser };
                }
                throw error;
            }
        },
        verify: async () => {
            if (IS_DEMO) {
                // If token exists in local storage (checked by caller essentially), return user
                return { user: mockUser };
            }
            const res = await fetch(`${API_BASE}/auth/verify`, { headers: getHeaders() });
            return handleResponse<{ user: any }>(res);
        },
        getUsers: async () => {
            if (IS_DEMO) return [mockUser];
            const res = await fetch(`${API_BASE}/auth/users`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
    },

    grants: {
        list: async (params?: { category?: string; status?: string; relevance?: string; search?: string }) => {
            if (IS_DEMO) {
                await delay(500);
                let filtered = [...mockGrants];
                if (params?.status && params.status !== 'ALL') filtered = filtered.filter(g => g.status === params.status);
                if (params?.category && params.category !== 'ALL') filtered = filtered.filter(g => g.category === params.category);
                if (params?.search) {
                    const q = params.search.toLowerCase();
                    filtered = filtered.filter(g => g.name.toLowerCase().includes(q) || g.organization.toLowerCase().includes(q));
                }
                return filtered;
            }
            const query = new URLSearchParams(params as any).toString();
            const res = await fetch(`${API_BASE}/grants?${query}`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        get: async (id: string) => {
            if (IS_DEMO) return mockGrants.find(g => g.id === id);
            const res = await fetch(`${API_BASE}/grants/${id}`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        updateStatus: async (id: string, status: string) => {
            if (IS_DEMO) {
                const grant = mockGrants.find(g => g.id === id);
                if (grant) grant.status = status as any;
                return grant;
            }
            const res = await fetch(`${API_BASE}/grants/${id}/status`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ status }),
            });
            return handleResponse<any>(res);
        },
        getStats: async () => {
            if (IS_DEMO) return mockStats;
            const res = await fetch(`${API_BASE}/grants/stats/dashboard`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        getDeadlineAlerts: async () => {
            if (IS_DEMO) {
                return mockGrants
                    .filter(g => g.deadline)
                    .map(g => ({
                        id: g.id,
                        grantId: g.id,
                        grantName: g.name,
                        deadline: g.deadline,
                        daysRemaining: Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (86400000)),
                        priority: 'HIGH',
                        status: 'PENDING'
                    }))
                    .filter(a => a.daysRemaining > 0 && a.daysRemaining < 90)
                    .slice(0, 5);
            }
            const res = await fetch(`${API_BASE}/grants/alerts/deadlines`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
    },

    proposals: {
        list: async () => {
            if (IS_DEMO) return [];
            const res = await fetch(`${API_BASE}/proposals`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        create: async (grantId: string, title?: string) => {
            if (IS_DEMO) {
                const newProposal: Proposal = {
                    id: `demo-${Date.now()}`,
                    grantId,
                    title: title || 'Demo Proposal',
                    status: 'DRAFT',
                    content: [
                        { id: '1', title: 'Executive Summary', content: 'This is a demo proposal generated in static mode.', wordCount: 10, maxWords: 500 }
                    ],
                    aiGenerated: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1
                };
                return newProposal;
            }
            const res = await fetch(`${API_BASE}/proposals`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ grantId, title }),
            });
            return handleResponse<any>(res);
        },
        update: async (id: string, data: any) => {
            if (IS_DEMO) return null;
            const res = await fetch(`${API_BASE}/proposals/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse<any>(res);
        },
    },

    notifications: {
        list: async () => {
            if (IS_DEMO) return mockNotifications;
            const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        unreadCount: async () => {
            if (IS_DEMO) return { count: 2 };
            const res = await fetch(`${API_BASE}/notifications/unread-count`, { headers: getHeaders() });
            return handleResponse<{ count: number }>(res);
        },
        markRead: async (id: string) => {
            if (IS_DEMO) return { success: true };
            const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
        markAllRead: async () => {
            if (IS_DEMO) return { success: true };
            const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
    },

    profile: {
        get: async () => {
            if (IS_DEMO) return mockSchoolProfile;
            const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        update: async (data: any) => {
            if (IS_DEMO) return data;
            const res = await fetch(`${API_BASE}/profile`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse<any>(res);
        },
    },

    agent: {
        status: async () => {
            if (IS_DEMO) return mockAgent;
            const res = await fetch(`${API_BASE}/agent/status`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        run: async () => {
            if (IS_DEMO) {
                await delay(2000);
                return { success: true, message: 'Agent run simulated' };
            }
            const res = await fetch(`${API_BASE}/agent/run`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
    },
};

export default api;
