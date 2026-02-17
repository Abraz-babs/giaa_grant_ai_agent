import { Grant, Proposal, Notification, DashboardStats, User, SchoolProfile, AIAgent } from '@/types';

export const mockUser: User = {
    id: '1',
    name: 'Zakiyah Zuhair',
    email: 'zakiyah@glisteninternationalacademy.com',
    role: 'ADMIN',
    permissions: ['ALL'],
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString()
};

export const mockSchoolProfile: SchoolProfile = {
    id: '1',
    name: 'Glisten International Academy',
    type: 'PRIVATE',
    location: {
        country: 'Nigeria',
        state: 'FCT',
        city: 'Abuja',
        address: 'Plot 1457, Cadastral Zone B8, Jahi District'
    },
    establishedYear: 2006,
    studentCount: { total: 1250, male: 600, female: 650, specialNeeds: 45 },
    staffCount: { teaching: 120, nonTeaching: 50 },
    facilities: [
        'Robotics & AI Lab',
        'Science Laboratories',
        'ICT Complex',
        'Library & Research Center',
        'Sports Complex'
    ],
    programs: [
        'Early Years',
        'Primary Education',
        'Junior Secondary',
        'Senior Secondary',
        'Robotics & Coding Club'
    ],
    achievements: [
        'Best Private Primary School in FCT',
        'VEX Robotics World Championship Participants'
    ],
    focusAreas: ['Academic Excellence', 'Technological Innovation'],
    registrationDetails: {
        registrationNumber: 'GIA-2006-REG',
        accreditationStatus: 'Fully Accredited'
    },
    contactInfo: {
        email: 'info@glisteninternationalacademy.com',
        phone: '+234 803 123 4567',
        website: 'https://glisteninternationalacademy.com'
    },
    documents: [],
    impactStories: [],
    strategicGoals: ['Expand AI & Robotics', 'Maintain 100% distinction rate']
};

export const mockGrants: Grant[] = [
    {
        id: '1',
        name: 'Africa STEM Education Innovation Grant',
        organization: 'World Bank Education Fund',
        amount: { min: 50000, max: 250000, currency: 'USD' },
        deadline: '2026-06-15',
        description: 'Supporting innovative STEM education models in Sub-Saharan Africa.',
        eligibility: ['Registered educational institution', 'STEM programs'],
        category: 'TECHNOLOGY',
        relevanceScore: 'HIGH',
        status: 'NEW',
        requirements: ['Project Proposal'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiSummary: 'Strong match for Glisten\'s Robotics program.',
        applicationReadiness: {
            score: 78,
            missingRequirements: [],
            strengths: ['Robotics Lab'],
            recommendations: ['Highlight VEX participation'],
            estimatedSuccessRate: 35
        }
    },
    {
        id: '2',
        name: 'Google AI for Education Grant',
        organization: 'Google.org',
        amount: { min: 100000, max: 500000, currency: 'USD' },
        deadline: '2026-07-31',
        description: 'Empowering schools to integrate AI and machine learning.',
        eligibility: ['Existing AI curriculum'],
        category: 'TECHNOLOGY',
        relevanceScore: 'HIGH',
        status: 'NEW',
        requirements: [],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiSummary: 'Perfect fit for the new AI curriculum.',
        applicationReadiness: {
            score: 85,
            missingRequirements: [],
            strengths: ['AI Curriculum'],
            recommendations: [],
            estimatedSuccessRate: 25
        }
    },
    {
        id: '3',
        name: 'UNICEF Inclusive Education Fund',
        organization: 'UNICEF',
        amount: { min: 25000, max: 100000, currency: 'USD' },
        deadline: '2026-05-20',
        description: 'Supporting inclusive education models.',
        eligibility: ['K-12 institutions'],
        category: 'GENERAL',
        relevanceScore: 'HIGH',
        status: 'REVIEWING',
        requirements: [],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicationReadiness: {
            score: 65, missingRequirements: [], strengths: [], recommendations: [], estimatedSuccessRate: 40
        }
    },
    {
        id: '4',
        name: 'USAID Robotics & Innovation',
        organization: 'USAID',
        amount: { min: 50000, max: 200000, currency: 'USD' },
        deadline: '2026-04-30',
        description: 'Promoting hands-on robotics labs.',
        eligibility: ['STEM infrastructure'],
        category: 'TECHNOLOGY',
        relevanceScore: 'HIGH',
        status: 'APPLYING',
        requirements: [],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicationReadiness: {
            score: 72, missingRequirements: [], strengths: [], recommendations: [], estimatedSuccessRate: 30
        }
    }
];

export const mockStats: DashboardStats = {
    totalGrants: 26,
    activeApplications: 3,
    pendingReview: 1,
    fundedGrants: 0,
    totalFunding: 0,
    upcomingDeadlines: 4,
    aiMatches: 4,
    successRate: 0
};

export const mockNotifications: Notification[] = [
    { id: '1', type: 'GRANT_FOUND', title: 'New High-Match Grant', message: 'Africa STEM Education Grant found', priority: 'HIGH', read: false, createdAt: new Date().toISOString() },
    { id: '2', type: 'DEADLINE_ALERT', title: 'Deadline Approaching', message: 'USAID Robotics deadline in 72 days', priority: 'URGENT', read: false, createdAt: new Date().toISOString() }
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
