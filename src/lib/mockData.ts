import type { Grant, Notification, DashboardStats, User, SchoolProfile, AIAgent } from '../types';

// ... (imports remain)

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
        description: 'Supporting innovative STEM education models in Sub-Saharan Africa. Matches Glisten\'s focus on robotics and technology integration.',
        eligibility: ['Registered educational institution', 'STEM programs'],
        category: 'TECHNOLOGY',
        relevanceScore: 'HIGH',
        status: 'NEW',
        requirements: ['Project Proposal', 'Budget Breakdown', 'Impact Assessment'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://www.worldbank.org/en/topic/education',
        aiSummary: 'Strong match for Glisten\'s Robotics program. The fund prioritizes scalable STEM models in West Africa.',
        applicationReadiness: {
            score: 78,
            missingRequirements: ['Budget Breakdown'],
            strengths: ['Robotics Lab Infrastructure', 'Qualified Staff'],
            recommendations: ['Highlight VEX participation success', 'Detail community impact'],
            estimatedSuccessRate: 75
        }
    },
    {
        id: '2',
        name: 'Google AI for Education Grant',
        organization: 'Google.org',
        amount: { min: 100000, max: 500000, currency: 'USD' },
        deadline: '2026-07-31',
        description: 'Empowering schools to integrate AI and machine learning into their curriculum.',
        eligibility: ['Existing AI curriculum', 'Underserved students'],
        category: 'AI_EDUCATION',
        relevanceScore: 'HIGH',
        status: 'NEW',
        requirements: ['Curriculum Plan', 'Staff Training Schedule'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://www.google.org/our-work/education/',
        aiSummary: 'Perfect fit for the new AI curriculum expansion. Requires focus on student outcomes.',
        applicationReadiness: {
            score: 85,
            missingRequirements: [],
            strengths: ['AI Curriculum', 'ICT Complex'],
            recommendations: ['Quantify expected student improvement'],
            estimatedSuccessRate: 60
        }
    },
    {
        id: '3',
        name: 'UNICEF Inclusive Education Fund',
        organization: 'UNICEF',
        amount: { min: 25000, max: 100000, currency: 'USD' },
        deadline: '2026-05-20',
        description: 'Supporting inclusive education models that cater to children with special needs.',
        eligibility: ['K-12 institutions', 'Special needs program'],
        category: 'INCLUSIVE_EDUCATION',
        relevanceScore: 'MEDIUM',
        status: 'REVIEWING',
        requirements: ['Inclusion Strategy', 'Beneficiary Data'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://www.unicef.org/education/inclusive-education',
        applicationReadiness: {
            score: 65,
            missingRequirements: ['Detailed Inclusion Strategy'],
            strengths: ['Special Needs Department'],
            recommendations: ['Partner with local NGOs'],
            estimatedSuccessRate: 40
        }
    },
    {
        id: '4',
        name: 'USAID Robotics & Innovation',
        organization: 'USAID',
        amount: { min: 50000, max: 200000, currency: 'USD' },
        deadline: '2026-04-30',
        description: 'Promoting hands-on robotics labs and engineering skills in secondary schools.',
        eligibility: ['STEM infrastructure', 'Secondary School'],
        category: 'ROBOTICS',
        relevanceScore: 'HIGH',
        status: 'APPLYING',
        requirements: ['Lab Photos', 'Student Testimonials'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://www.usaid.gov/education',
        applicationReadiness: {
            score: 92,
            missingRequirements: [],
            strengths: ['Existing VEX Lab', 'Award-winning team'],
            recommendations: ['Video tour of the lab'],
            estimatedSuccessRate: 85
        }
    }
];

export const mockStats: DashboardStats = {
    totalGrants: 154,
    activeApplications: 3,
    pendingReview: 12,
    fundedGrants: 2,
    totalFunding: 75000,
    upcomingDeadlines: 4,
    aiMatches: 8,
    successRate: 15
};

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
    tasks: [
        { id: 't1', type: 'DISCOVER', status: 'RUNNING', priority: 'HIGH', createdAt: new Date().toISOString() },
        { id: 't2', type: 'ANALYZE', status: 'COMPLETED', priority: 'HIGH', createdAt: new Date(Date.now() - 3600000).toISOString(), result: 'Found 4 new matches' },
        { id: 't3', type: 'FILTER', status: 'PENDING', priority: 'MEDIUM', createdAt: new Date().toISOString() }
    ],
    configuration: {
        searchKeywords: ['STEM', 'Education', 'Africa', 'Robotics', 'Special Needs'],
        grantSources: [
            { id: 's1', name: 'Grants.gov', url: 'https://grants.gov', type: 'WEBSITE', isActive: true, lastScraped: new Date().toISOString() },
            { id: 's2', name: 'Terra Viva Grants', url: 'https://terravivagrants.org', type: 'WEBSITE', isActive: true, lastScraped: new Date().toISOString() },
            { id: 's3', name: 'Google for Education', url: 'https://edu.google.com', type: 'WEBSITE', isActive: true, lastScraped: new Date(Date.now() - 86400000).toISOString() }
        ],
        notificationSettings: { emailEnabled: true, whatsappEnabled: true, digestFrequency: 'DAILY', urgentAlertsEnabled: true, recipients: ['zakiyah@glisten.com'] },
        autoDraftEnabled: false,
        filteringCriteria: { minAmount: 10000, maxAmount: 1000000, categories: ['STEM', 'TECHNOLOGY'], eligibleRegions: ['Africa'], deadlineRange: 180 }
    },
    stats: { totalGrantsFound: 1520, totalGrantsFiltered: 450, totalApplicationsSubmitted: 12, totalFundingSecured: 75000, successRate: 18, averageResponseTime: 120 }
};
