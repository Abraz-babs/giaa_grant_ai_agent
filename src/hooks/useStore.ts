import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import type {
  Grant, SchoolProfile, DashboardStats, DeadlineAlert,
  Notification, Proposal, SearchFilters
} from '@/types';

// Grants Store — API-backed
export const useGrantsStore = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchGrants = useCallback(async (params?: { category?: string; status?: string; relevance?: string; search?: string }) => {
    setIsLoading(true);
    try {
      const data = await api.grants.list(params);
      setGrants(data);
    } catch (err) {
      console.error('Failed to fetch grants:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  const filterGrants = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    const params: any = {};
    if (newFilters.query) params.search = newFilters.query;
    if (newFilters.categories?.length === 1) params.category = newFilters.categories[0];
    if (newFilters.status?.length === 1) params.status = newFilters.status[0];
    if (newFilters.relevanceScore?.length === 1) params.relevance = newFilters.relevanceScore[0];
    fetchGrants(params);
  }, [fetchGrants]);

  const updateGrantStatus = useCallback(async (grantId: string, status: Grant['status']) => {
    try {
      const updated = await api.grants.updateStatus(grantId, status);
      setGrants(prev => prev.map(g => g.id === grantId ? updated : g));
    } catch (err) {
      console.error('Failed to update grant status:', err);
    }
  }, []);

  const refreshGrants = useCallback(() => {
    fetchGrants();
  }, [fetchGrants]);

  return {
    grants,
    selectedGrant,
    filters,
    isLoading,
    setSelectedGrant,
    filterGrants,
    updateGrantStatus,
    refreshGrants
  };
};

// Dashboard Store — API-backed
export const useDashboardStore = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGrants: 0,
    activeApplications: 0,
    pendingReview: 0,
    fundedGrants: 0,
    totalFunding: 0,
    upcomingDeadlines: 0,
    aiMatches: 0,
    successRate: 0
  });
  const [deadlineAlerts, setDeadlineAlerts] = useState<DeadlineAlert[]>([]);
  const [recentActivity] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.grants.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await api.grants.getDeadlineAlerts();
      setDeadlineAlerts(data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchAlerts();
  }, [fetchStats, fetchAlerts]);

  const refreshStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchStats();
      await fetchAlerts();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchStats, fetchAlerts]);

  const dismissAlert = useCallback((alertId: string) => {
    setDeadlineAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  return {
    stats,
    deadlineAlerts,
    recentActivity,
    isRefreshing,
    refreshStats,
    dismissAlert
  };
};

// AI Agent Store — API-backed
// AI Agent Store — API-backed
export const useAIAgentStore = () => {
  const [agent, setAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.agent.status();
      setAgent(data.agent);
      setIsRunning(data.isRunning);
      if (data.logs?.length) {
        setLogs(data.logs.map((l: any) =>
          `[${l.startedAt || 'N/A'}] ${l.action}: ${l.status} — Found: ${l.grantsFound}, Matched: ${l.grantsMatched}${l.error ? ` Error: ${l.error}` : ''}`
        ));
      }
      return data;
    } catch (err) {
      console.error('Failed to fetch agent status:', err);
      return null;
    }
  }, []);

  // Poll based on running state (faster when running)
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, isRunning ? 2000 : 5000);
    return () => clearInterval(interval);
  }, [fetchStatus, isRunning]);

  const runAgent = useCallback(async () => {
    setIsRunning(true);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] Requesting agent start...`, ...prev]);

    try {
      const res = await api.agent.run();
      if (!res.success) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Error: ${res.error}`, ...prev]);
        setIsRunning(false);
        if (res.error === 'Agent is already running') fetchStatus();
      } else {
        // Success, the polling effect will handle updates
        fetchStatus();
      }
    } catch (err) {
      setIsRunning(false);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] Connection Error: ${err}`, ...prev]);
    }
  }, [fetchStatus]);

  const stopAgent = useCallback(async () => {
    try {
      await api.agent.stop();
      setIsRunning(false);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] Agent stopped by user`, ...prev]);
      fetchStatus();
    } catch (err) {
      console.error('Failed to stop agent:', err);
    }
  }, [fetchStatus]);

  const toggleAgent = useCallback(() => {
    if (agent) {
      setAgent((prev: any) => ({
        ...prev,
        status: prev.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
      }));
    }
  }, [agent]);

  const updateConfiguration = useCallback((config: any) => {
    if (agent) {
      setAgent((prev: any) => ({
        ...prev,
        configuration: { ...prev.configuration, ...config }
      }));
    }
  }, [agent]);

  return {
    agent,
    isRunning,
    logs,
    runAgent,
    stopAgent,
    toggleAgent,
    updateConfiguration
  };
};

// Notifications Store — API-backed
export const useNotificationsStore = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.notifications.list();
      setNotifications(data);
      const countData = await api.notifications.unreadCount();
      setUnreadCount(countData.count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await api.notifications.markRead(notificationId);
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    addNotification,
    refreshNotifications: fetchNotifications
  };
};

// School Profile Store — API-backed
export const useSchoolProfileStore = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await api.profile.get();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<SchoolProfile>) => {
    try {
      const merged = { ...profile, ...updates };
      const data = await api.profile.update(merged);
      setProfile(data);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  }, [profile]);

  const addDocument = useCallback((document: any) => {
    if (profile) {
      setProfile(prev => prev ? {
        ...prev,
        documents: [...(prev.documents || []), document]
      } : prev);
    }
  }, [profile]);

  const removeDocument = useCallback((documentId: string) => {
    if (profile) {
      setProfile(prev => prev ? {
        ...prev,
        documents: (prev.documents || []).filter((d: any) => d.id !== documentId)
      } : prev);
    }
  }, [profile]);

  return {
    profile,
    isEditing,
    setIsEditing,
    updateProfile,
    addDocument,
    removeDocument
  };
};

// Proposal Store — API-backed
export const useProposalStore = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const fetchProposals = useCallback(async () => {
    try {
      const data = await api.proposals.list();
      setProposals(data);
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const createProposal = useCallback((grantId: string, title: string) => {
    const newProposal: Proposal = {
      id: Math.random().toString(36).substr(2, 9),
      grantId,
      title,
      content: [],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiGenerated: false,
      version: 1
    };
    setProposals(prev => [...prev, newProposal]);
    return newProposal;
  }, []);

  const updateProposal = useCallback((proposalId: string, updates: Partial<Proposal>) => {
    setProposals(prev => prev.map(p =>
      p.id === proposalId
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    ));
  }, []);

  const generateAIProposal = useCallback(async (grantId: string) => {
    try {
      const proposal = await api.proposals.create(grantId);
      setProposals(prev => [...prev, proposal]);
      return proposal;
    } catch (err) {
      console.error('Failed to generate AI proposal:', err);
      return null;
    }
  }, []);

  return {
    proposals,
    selectedProposal,
    setSelectedProposal,
    createProposal,
    updateProposal,
    generateAIProposal
  };
};

// User Store — API-backed
export const useUserStore = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.auth.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  useEffect(() => {
    // Get current user from localStorage (set by AuthContext)
    try {
      const stored = localStorage.getItem('giaa_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch { /* ignore */ }
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = useCallback((userId: string, updates: any) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser((prev: any) => ({ ...prev, ...updates }));
    }
  }, [currentUser]);

  return {
    currentUser,
    users,
    updateUser
  };
};
