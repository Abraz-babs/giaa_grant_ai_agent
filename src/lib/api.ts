const API_BASE = '/api';

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
    if (res.status === 401 || res.status === 403) {
        // Don't reload — let the AuthContext handle the logout flow
        throw new Error('Session expired');
    }
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || 'Request failed');
    }
    return data.data;
}

// Auth
export const api = {
    auth: {
        login: async (email: string, password: string) => {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            return handleResponse<{ token: string; user: any }>(res);
        },
        verify: async () => {
            const res = await fetch(`${API_BASE}/auth/verify`, { headers: getHeaders() });
            return handleResponse<{ user: any }>(res);
        },
        getUsers: async () => {
            const res = await fetch(`${API_BASE}/auth/users`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
    },

    grants: {
        list: async (params?: { category?: string; status?: string; relevance?: string; search?: string }) => {
            const query = new URLSearchParams(params as any).toString();
            const res = await fetch(`${API_BASE}/grants?${query}`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        get: async (id: string) => {
            const res = await fetch(`${API_BASE}/grants/${id}`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        updateStatus: async (id: string, status: string) => {
            const res = await fetch(`${API_BASE}/grants/${id}/status`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ status }),
            });
            return handleResponse<any>(res);
        },
        getStats: async () => {
            const res = await fetch(`${API_BASE}/grants/stats/dashboard`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        getDeadlineAlerts: async () => {
            const res = await fetch(`${API_BASE}/grants/alerts/deadlines`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
    },

    proposals: {
        list: async () => {
            const res = await fetch(`${API_BASE}/proposals`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        create: async (grantId: string, title?: string) => {
            const res = await fetch(`${API_BASE}/proposals`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ grantId, title }),
            });
            return handleResponse<any>(res);
        },
        update: async (id: string, data: any) => {
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
            const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        unreadCount: async () => {
            const res = await fetch(`${API_BASE}/notifications/unread-count`, { headers: getHeaders() });
            return handleResponse<{ count: number }>(res);
        },
        markRead: async (id: string) => {
            const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
        markAllRead: async () => {
            const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
    },

    profile: {
        get: async () => {
            const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        update: async (data: any) => {
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
            const res = await fetch(`${API_BASE}/agent/status`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        run: async () => {
            const res = await fetch(`${API_BASE}/agent/run`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
    },
};

export default api;
