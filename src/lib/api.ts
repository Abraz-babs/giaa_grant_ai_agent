import {
  mockGrants,
  mockStats,
  mockNotifications,
  mockSchoolProfile,
  mockAgent,
  mockUser,
  mockUsers,
  mockDeadlineAlerts,
} from "./mockData";

const API_BASE = "/api";

// Detect if running on GitHub Pages (no backend available)
const IS_GH_PAGES =
  window.location.hostname === "abraz-babs.github.io" ||
  window.location.hostname.endsWith(".github.io");

function getToken(): string | null {
  return localStorage.getItem("giaa_token");
}

function getHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Request failed");
    return data.data;
  } else {
    const text = await res.text().catch(() => "");
    const snippet = text.substring(0, 200);
    throw new Error(
      `Backend returned non-JSON response (status ${res.status}). Make sure the backend server is running on port 3001. Response: ${snippet}`,
    );
  }
}

// Simulate network delay for mock data
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Auth
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      if (IS_GH_PAGES) {
        await delay();
        const user = mockUsers.find((u) => u.email === email);
        if (!user) throw new Error("Invalid email or password");
        // On GitHub Pages (demo mode), accept any non-empty password
        if (!password) throw new Error("Password is required");
        return {
          token: "mock-jwt-token-for-github-pages",
          user,
        };
      }
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await handleResponse<{ token: string; user: any }>(res);
    },
    verify: async () => {
      if (IS_GH_PAGES) {
        await delay();
        const token = getToken();
        if (!token) throw new Error("No token found");
        return { user: mockUser };
      }
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getHeaders(),
      });
      return handleResponse<{ user: any }>(res);
    },
    getUsers: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return mockUsers;
      }
      const res = await fetch(`${API_BASE}/auth/users`, {
        headers: getHeaders(),
      });
      return handleResponse<any[]>(res);
    },
  },

  grants: {
    list: async (params?: {
      category?: string;
      status?: string;
      relevance?: string;
      search?: string;
    }) => {
      if (IS_GH_PAGES) {
        await delay();
        let filtered = [...mockGrants];
        if (params?.category) {
          filtered = filtered.filter((g) => g.category === params.category);
        }
        if (params?.status) {
          filtered = filtered.filter((g) => g.status === params.status);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (g) =>
              g.name.toLowerCase().includes(q) ||
              g.organization.toLowerCase().includes(q) ||
              g.description.toLowerCase().includes(q),
          );
        }
        return filtered;
      }
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/grants?${query}`, {
        headers: getHeaders(),
      });
      return handleResponse<any[]>(res);
    },
    get: async (id: string) => {
      if (IS_GH_PAGES) {
        await delay();
        const grant = mockGrants.find((g) => g.id === id);
        if (!grant) throw new Error("Grant not found");
        return grant;
      }
      const res = await fetch(`${API_BASE}/grants/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
    updateStatus: async (id: string, status: string) => {
      if (IS_GH_PAGES) {
        await delay();
        const grant = mockGrants.find((g) => g.id === id);
        if (!grant) throw new Error("Grant not found");
        return { ...grant, status };
      }
      const res = await fetch(`${API_BASE}/grants/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse<any>(res);
    },
    getStats: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return mockStats;
      }
      const res = await fetch(`${API_BASE}/grants/stats/dashboard`, {
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
    getDeadlineAlerts: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return mockDeadlineAlerts;
      }
      const res = await fetch(`${API_BASE}/grants/alerts/deadlines`, {
        headers: getHeaders(),
      });
      return handleResponse<any[]>(res);
    },
  },

  proposals: {
    list: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return [];
      }
      const res = await fetch(`${API_BASE}/proposals`, {
        headers: getHeaders(),
      });
      return handleResponse<any[]>(res);
    },
    create: async (grantId: string, title?: string) => {
      if (IS_GH_PAGES) {
        await delay();
        return {
          id: Date.now().toString(),
          grantId,
          title: title || "New Proposal",
          content: [],
          status: "DRAFT",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiGenerated: false,
          version: 1,
        };
      }
      const res = await fetch(`${API_BASE}/proposals`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ grantId, title }),
      });
      return handleResponse<any>(res);
    },
    update: async (id: string, data: any) => {
      if (IS_GH_PAGES) {
        await delay();
        return { id, ...data, updatedAt: new Date().toISOString() };
      }
      const res = await fetch(`${API_BASE}/proposals/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<any>(res);
    },
  },

  notifications: {
    list: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return mockNotifications;
      }
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: getHeaders(),
      });
      return handleResponse<any[]>(res);
    },
    unreadCount: async () => {
      if (IS_GH_PAGES) {
        await delay();
        const count = mockNotifications.filter((n) => !n.read).length;
        return { count };
      }
      const res = await fetch(`${API_BASE}/notifications/unread-count`, {
        headers: getHeaders(),
      });
      return handleResponse<{ count: number }>(res);
    },
    markRead: async (id: string) => {
      if (IS_GH_PAGES) {
        await delay();
        return { success: true };
      }
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
    markAllRead: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return { success: true };
      }
      const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "POST",
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
  },

  profile: {
    get: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return mockSchoolProfile;
      }
      const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
      return handleResponse<any>(res);
    },
    update: async (data: any) => {
      if (IS_GH_PAGES) {
        await delay();
        return { ...mockSchoolProfile, ...data };
      }
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<any>(res);
    },
  },

  agent: {
    status: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return mockAgent;
      }
      const res = await fetch(`${API_BASE}/agent/status`, {
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
    run: async () => {
      if (IS_GH_PAGES) {
        await delay(1500);
        return {
          ...mockAgent,
          lastRun: new Date().toISOString(),
          status: "ACTIVE",
        };
      }
      const res = await fetch(`${API_BASE}/agent/run`, {
        method: "POST",
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
    stop: async () => {
      if (IS_GH_PAGES) {
        await delay();
        return { ...mockAgent, status: "PAUSED" };
      }
      const res = await fetch(`${API_BASE}/agent/stop`, {
        method: "POST",
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
  },
};

export default api;
