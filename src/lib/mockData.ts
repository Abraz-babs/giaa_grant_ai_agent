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
        name: 'Tony Elumelu Foundation Entrepreneurship Programme 2026',
        organization: 'Tony Elumelu Foundation',
        amount: { min: 5000, max: 5000, currency: 'USD' },
        deadline: '2026-03-01',
        description: 'A flagship African entrepreneurship program offering $5,000 non-refundable seed capital, mentorship, and business training. Ideal for school-based entrepreneurship initiatives and student ventures.',
        eligibility: ['African Entrepreneurs', 'Startups 0-3 years', 'Legal Residents of Africa'],
        category: 'ENTREPRENEURSHIP',
        relevanceScore: 'HIGH',
        status: 'NEW',
        requirements: ['Valid ID', 'Business Idea/Plan', 'Participation in Training'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://www.tefconnect.com',
        aiSummary: 'Excellent opportunity for Glisten\'s "Young Entrepreneurs" club or student-led initiatives. Requires a business plan.',
        applicationReadiness: {
            score: 90,
            missingRequirements: [],
            strengths: ['Strong Business Curriculum', 'Student Innovation'],
            recommendations: ['Register student ventures', 'Prepare pitch decks'],
            estimatedSuccessRate: 45
        }
    },
    {
        id: '2',
        name: 'African Union Innovating Education in Africa (IEA) 2026',
        organization: 'African Union',
        amount: { min: 40000, max: 50000, currency: 'USD' },
        deadline: '2026-04-15', // Estimated based on typical cycle
        description: 'Grant funding for innovative solutions that address education challenges in Africa. Supports scalable projects improving access, quality, and relevance of education.',
        eligibility: ['African Organizations', 'Education Innovators', 'Scalable Models'],
        category: 'EDUCATION_INNOVATION',
        relevanceScore: 'HIGH',
        status: 'NEW',
        requirements: ['Innovation Description', 'Scalability Plan', 'Impact Evidence'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://iea.edu-au.org',
        aiSummary: 'Perfect fit for the "Robotics & AI Center" expansion. Focuses on scalable educational innovations.',
        applicationReadiness: {
            score: 85,
            missingRequirements: ['Impact Evidence Report'],
            strengths: ['Existing AI Lab', 'Track Record'],
            recommendations: ['Document student outcomes', 'Partner with Ministry'],
            estimatedSuccessRate: 30
        }
    },
    {
        id: '3',
        name: 'STEM to Space Scholarship & Grant 2026',
        organization: 'Opolo Global Innovation',
        amount: { min: 1000, max: 10000, currency: 'USD' },
        deadline: '2026-04-02',
        description: 'Supporting Nigerian students and institutions in STEM fields, specifically targeting space science, technology, and astronomy.',
        eligibility: ['Nigerian Students/Schools', 'STEM Focus'],
        category: 'STEM',
        relevanceScore: 'MEDIUM',
        status: 'REVIEWING',
        requirements: ['Academic Transcripts', 'Essay', 'Project Description'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://scholarsworld.ng/stem-to-space-scholarship', // Link to info page
        applicationReadiness: {
            score: 70,
            missingRequirements: ['Student Essays'],
            strengths: ['Physics Department'],
            recommendations: ['Identify top physics students'],
            estimatedSuccessRate: 40
        }
    },
    {
        id: '4',
        name: 'Google for Education Impact Fund',
        organization: 'Google.org',
        amount: { min: 50000, max: 150000, currency: 'USD' },
        deadline: '2026-08-30',
        description: 'Funding for nonprofits and schools using technology to close learning gaps.',
        eligibility: ['Nonprofits', 'Educational Institutions'],
        category: 'TECHNOLOGY',
        relevanceScore: 'HIGH',
        status: 'NEW',
        requirements: ['Theory of Change', 'Budget', 'Tech Implementation Plan'],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        websiteUrl: 'https://www.google.org/our-work/education/',
        applicationReadiness: {
            score: 60,
            missingRequirements: ['Theory of Change Document'],
            strengths: ['Google Classroom Usage'],
            recommendations: ['Draft a Theory of Change'],
            estimatedSuccessRate: 20
        }
    }
];

export const mockStats: DashboardStats = {
    totalGrants: 4, // Real current grants
    activeApplications: 0,
    pendingReview: 4, // All 4 are new/pending
    fundedGrants: 0,
    totalFunding: 0,
    upcomingDeadlines: 2,
    aiMatches: 4,
    successRate: 0
};

export const mockNotifications: Notification[] = [
    { id: '1', type: 'GRANT_FOUND', title: 'New High-Match Grant', message: 'Tony Elumelu Foundation 2026 is now open!', priority: 'HIGH', read: false, createdAt: new Date().toISOString() },
    { id: '2', type: 'DEADLINE_ALERT', title: 'Deadline Approaching', message: 'TEF 2026 application closes in 12 days', priority: 'HIGH', read: false, createdAt: new Date().toISOString() }
];

export const mockAgent: AIAgent = {
    id: '1',
    name: 'GrantScout-X1',
    status: 'ACTIVE',
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 6 * 3600000).toISOString(),
    tasks: [
        { id: 't1', type: 'DISCOVER', status: 'RUNNING', priority: 'HIGH', createdAt: new Date().toISOString() },
        { id: 't2', type: 'ANALYZE', status: 'COMPLETED', priority: 'HIGH', createdAt: new Date(Date.now() - 3600000).toISOString(), result: 'Identified 4 active opportunities' },
        { id: 't3', type: 'FILTER', status: 'PENDING', priority: 'MEDIUM', createdAt: new Date().toISOString() }
    ],
    configuration: {
        searchKeywords: ['STEM', 'Education', 'Africa', 'Robotics', 'Special Needs', 'Entrepreneurship'],
        grantSources: [
            { id: 's1', name: 'TEFConnect', url: 'https://tefconnect.com', type: 'WEBSITE', isActive: true, lastScraped: new Date().toISOString() },
            { id: 's2', name: 'African Union', url: 'https://au.int', type: 'WEBSITE', isActive: true, lastScraped: new Date().toISOString() },
            { id: 's3', name: 'Google for Education', url: 'https://edu.google.com', type: 'WEBSITE', isActive: true, lastScraped: new Date(Date.now() - 86400000).toISOString() }
        ],
        notificationSettings: { emailEnabled: true, whatsappEnabled: true, digestFrequency: 'DAILY', urgentAlertsEnabled: true, recipients: ['zakiyah@glisten.com'] },
        autoDraftEnabled: false,
        filteringCriteria: { minAmount: 1000, maxAmount: 1000000, categories: ['STEM', 'EDUCATION_INNOVATION', 'ENTREPRENEURSHIP'], eligibleRegions: ['Africa', 'Nigeria'], deadlineRange: 180 }
    },
    stats: { totalGrantsFound: 4, totalGrantsFiltered: 0, totalApplicationsSubmitted: 0, totalFundingSecured: 0, successRate: 0, averageResponseTime: 120 }
};
