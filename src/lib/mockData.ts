import type { Grant, Notification, DashboardStats, User, SchoolProfile, AIAgent } from '@/types';

// ... (existing code) ...

export const mockNotifications: Notification[] = [
    { id: '1', type: 'GRANT_FOUND', title: 'New High-Match Grant', message: 'Africa STEM Education Grant found', priority: 'HIGH', read: false, createdAt: new Date().toISOString() },
    { id: '2', type: 'DEADLINE_ALERT', title: 'Deadline Approaching', message: 'USAID Robotics deadline in 72 days', priority: 'HIGH', read: false, createdAt: new Date().toISOString() }
];

export const mockAgent: AIAgent = {
    id: '1',
    name: 'GrantScout-X1',
    status: 'ACTIVE',
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 6 * 3600000).toISOString(),
    tasks: [],
    configuration: {
        searchKeywords: ['STEM', 'Education', 'Africa'],
        grantSources: [],
        notificationSettings: { emailEnabled: true, whatsappEnabled: true, digestFrequency: 'DAILY', urgentAlertsEnabled: true, recipients: [] },
        autoDraftEnabled: false,
        filteringCriteria: { minAmount: 10000, maxAmount: 1000000, categories: [], eligibleRegions: [], deadlineRange: 180 }
    },
    stats: { totalGrantsFound: 26, totalGrantsFiltered: 100, totalApplicationsSubmitted: 0, totalFundingSecured: 0, successRate: 0, averageResponseTime: 45 }
};
