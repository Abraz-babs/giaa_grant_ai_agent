import type { Grant, SchoolProfile, AIAgent, DashboardStats, DeadlineAlert, Notification, Proposal, User, ActivityLog } from '@/types';

export const mockGrants: Grant[] = [
  {
    id: '1',
    name: 'AI in Education Innovation Fund',
    organization: 'Google for Education',
    amount: { min: 25000, max: 100000, currency: 'USD' },
    deadline: '2026-03-15',
    description: 'Supporting innovative AI-powered educational initiatives in African schools. This grant aims to foster digital literacy and prepare students for the AI-driven future.',
    eligibility: ['Private schools', 'Technology-focused programs', 'African institutions', 'STEM curriculum'],
    category: 'AI_EDUCATION',
    relevanceScore: 'HIGH',
    status: 'REVIEWING',
    requirements: ['Detailed project proposal', 'Budget breakdown', 'School registration documents', 'Impact metrics plan'],
    documents: ['Proposal Template', 'Budget Form', 'Registration Cert'],
    contactEmail: 'africa.grants@google.com',
    websiteUrl: 'https://edu.google.com/grants',
    createdAt: '2026-01-10',
    updatedAt: '2026-02-15',
    aiSummary: 'Highly relevant grant aligned with school\'s AI focus. Strong eligibility match. Requires detailed proposal on AI curriculum integration.',
    applicationReadiness: {
      score: 85,
      missingRequirements: [],
      strengths: ['Strong AI program', 'Registered institution', 'Technology infrastructure'],
      recommendations: ['Emphasize robotics lab achievements', 'Include student AI project examples'],
      estimatedSuccessRate: 75
    }
  },
  {
    id: '2',
    name: 'STEM Robotics Lab Grant',
    organization: 'TechFuture Foundation',
    amount: { min: 50000, max: 150000, currency: 'USD' },
    deadline: '2026-04-30',
    description: 'Funding for establishing or expanding robotics laboratories in schools. Includes equipment, training, and curriculum development support.',
    eligibility: ['Schools with existing STEM programs', 'Minimum 200 students', 'Dedicated lab space'],
    category: 'ROBOTICS',
    relevanceScore: 'HIGH',
    status: 'APPLYING',
    requirements: ['Lab space photos', 'Teacher qualifications', 'Safety plan', 'Sustainability plan'],
    documents: ['Lab Layout', 'Teacher CVs', 'Safety Certificate'],
    contactEmail: 'grants@techfuture.org',
    websiteUrl: 'https://techfuture.org/robotics',
    createdAt: '2026-01-15',
    updatedAt: '2026-02-14',
    aiSummary: 'Perfect match for school\'s robotics program. Strong track record in robotics competitions is a major advantage.',
    applicationReadiness: {
      score: 92,
      missingRequirements: [],
      strengths: ['Existing robotics program', 'Competition winners', 'Qualified teachers', 'Dedicated lab space'],
      recommendations: ['Highlight competition achievements', 'Include student testimonials'],
      estimatedSuccessRate: 85
    }
  },
  {
    id: '3',
    name: 'Inclusive Education Technology Grant',
    organization: 'UNESCO Africa',
    amount: { min: 30000, max: 80000, currency: 'USD' },
    deadline: '2026-03-01',
    description: 'Supporting technology integration for inclusive education, focusing on students with special educational needs.',
    eligibility: ['Schools with SEN programs', 'Inclusive education policy', 'Trained SEN staff'],
    category: 'INCLUSIVE_EDUCATION',
    relevanceScore: 'HIGH',
    status: 'NEW',
    requirements: ['SEN policy document', 'Staff training certificates', 'Accessibility audit', 'Impact assessment plan'],
    documents: ['SEN Policy', 'Training Certs'],
    contactEmail: 'inclusive@unesco-africa.org',
    websiteUrl: 'https://unesco-africa.org/grants',
    createdAt: '2026-02-10',
    updatedAt: '2026-02-10',
    aiSummary: 'Strong alignment with school\'s inclusive education initiatives. Requires documentation of SEN programs.',
    applicationReadiness: {
      score: 70,
      missingRequirements: ['Accessibility audit', 'Updated SEN policy'],
      strengths: ['Existing SEN program', 'Trained staff', 'Inclusive culture'],
      recommendations: ['Complete accessibility audit', 'Update SEN policy document'],
      estimatedSuccessRate: 65
    }
  },
  {
    id: '4',
    name: 'Agricultural Innovation in Schools',
    organization: 'AgriTech Africa',
    amount: { min: 20000, max: 60000, currency: 'USD' },
    deadline: '2026-05-15',
    description: 'Promoting agricultural technology education and school farming programs with modern technology integration.',
    eligibility: ['Schools with agricultural programs', 'Land availability', 'Community partnership'],
    category: 'AGRICULTURE',
    relevanceScore: 'MEDIUM',
    status: 'NEW',
    requirements: ['Land documentation', 'Agricultural curriculum', 'Community partnership letter'],
    documents: ['Land Title', 'Curriculum Outline'],
    contactEmail: 'education@agritech-africa.org',
    websiteUrl: 'https://agritech-africa.org/schools',
    createdAt: '2026-02-12',
    updatedAt: '2026-02-12',
    aiSummary: 'Moderate relevance. School has basic agricultural program but could expand. Good opportunity for program growth.',
    applicationReadiness: {
      score: 55,
      missingRequirements: ['Community partnership', 'Detailed curriculum'],
      strengths: ['Available land', 'Basic agricultural facilities'],
      recommendations: ['Establish community partnership', 'Develop detailed curriculum'],
      estimatedSuccessRate: 45
    }
  },
  {
    id: '5',
    name: 'Youth Entrepreneurship Program',
    organization: 'African Development Bank',
    amount: { min: 40000, max: 120000, currency: 'USD' },
    deadline: '2026-06-30',
    description: 'Supporting entrepreneurship education and student business incubation programs in secondary schools.',
    eligibility: ['Secondary schools', 'Business/entrepreneurship curriculum', 'Mentorship program'],
    category: 'ENTREPRENEURSHIP',
    relevanceScore: 'MEDIUM',
    status: 'NEW',
    requirements: ['Business curriculum', 'Mentor profiles', 'Student business plans', 'Impact metrics'],
    documents: ['Curriculum', 'Mentor Profiles'],
    contactEmail: 'youth@afdb.org',
    websiteUrl: 'https://afdb.org/youth-entrepreneurship',
    createdAt: '2026-02-08',
    updatedAt: '2026-02-08',
    aiSummary: 'Good opportunity to expand entrepreneurship programs. School has basic business education but needs development.',
    applicationReadiness: {
      score: 60,
      missingRequirements: ['Mentorship program', 'Student business plans'],
      strengths: ['Business curriculum exists', 'Strong student interest'],
      recommendations: ['Recruit business mentors', 'Guide students to develop business plans'],
      estimatedSuccessRate: 50
    }
  },
  {
    id: '6',
    name: 'Digital Infrastructure Development',
    organization: 'Microsoft Philanthropies',
    amount: { min: 75000, max: 200000, currency: 'USD' },
    deadline: '2026-03-30',
    description: 'Funding for school digital infrastructure including computers, networking, and educational software.',
    eligibility: ['Underserved schools', 'Technology improvement plan', 'Sustainability strategy'],
    category: 'INFRASTRUCTURE',
    relevanceScore: 'HIGH',
    status: 'APPLYING',
    requirements: ['Infrastructure audit', 'Technology plan', 'Budget breakdown', 'Maintenance plan'],
    documents: ['Infrastructure Audit', 'Tech Plan'],
    contactEmail: 'grants@microsoft.philanthropy',
    websiteUrl: 'https://microsoft.com/philanthropies',
    createdAt: '2026-01-20',
    updatedAt: '2026-02-13',
    aiSummary: 'Excellent match for infrastructure needs. School has clear technology gaps that this grant addresses.',
    applicationReadiness: {
      score: 88,
      missingRequirements: [],
      strengths: ['Clear infrastructure needs', 'Technology plan ready', 'Strong leadership support'],
      recommendations: ['Emphasize student impact', 'Include teacher training plan'],
      estimatedSuccessRate: 80
    }
  },
  {
    id: '7',
    name: 'Sustainability Education Initiative',
    organization: 'Green Schools Global',
    amount: { min: 15000, max: 50000, currency: 'USD' },
    deadline: '2026-04-15',
    description: 'Supporting environmental education and sustainability projects in schools across Africa.',
    eligibility: ['Schools with green initiatives', 'Environmental curriculum', 'Student eco-clubs'],
    category: 'SUSTAINABILITY',
    relevanceScore: 'MEDIUM',
    status: 'NEW',
    requirements: ['Environmental audit', 'Sustainability plan', 'Student club documentation'],
    documents: ['Eco Club Docs'],
    contactEmail: 'africa@greenschools.global',
    websiteUrl: 'https://greenschools.global',
    createdAt: '2026-02-14',
    updatedAt: '2026-02-14',
    aiSummary: 'Moderate fit. School has basic environmental awareness but could develop stronger sustainability programs.',
    applicationReadiness: {
      score: 50,
      missingRequirements: ['Environmental audit', 'Sustainability plan'],
      strengths: ['Student eco-club exists', 'Green awareness'],
      recommendations: ['Conduct environmental audit', 'Develop comprehensive sustainability plan'],
      estimatedSuccessRate: 40
    }
  },
  {
    id: '8',
    name: 'STEM Teacher Training Grant',
    organization: 'Intel Foundation',
    amount: { min: 25000, max: 75000, currency: 'USD' },
    deadline: '2026-05-01',
    description: 'Professional development funding for STEM teachers, including certification and specialized training.',
    eligibility: ['Schools with STEM programs', 'Teacher development plan', 'Minimum 5 STEM teachers'],
    category: 'STEM',
    relevanceScore: 'HIGH',
    status: 'REVIEWING',
    requirements: ['Teacher roster', 'Training plan', 'Budget allocation', 'Impact measurement'],
    documents: ['Teacher List', 'Training Plan'],
    contactEmail: 'education@intel-foundation.org',
    websiteUrl: 'https://intel-foundation.org/education',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-12',
    aiSummary: 'Strong alignment with school\'s STEM focus. Excellent opportunity for teacher capacity building.',
    applicationReadiness: {
      score: 82,
      missingRequirements: [],
      strengths: ['Strong STEM teacher team', 'Clear training needs', 'Leadership support'],
      recommendations: ['Include specific training providers', 'Detail certification outcomes'],
      estimatedSuccessRate: 78
    }
  }
];

export const mockSchoolProfile: SchoolProfile = {
  id: '1',
  name: 'Glisten International Academy',
  type: 'PRIVATE',
  location: {
    country: 'Nigeria',
    state: 'Abuja FCT',
    city: 'Abuja',
    address: '123 Innovation Drive, Garki'
  },
  establishedYear: 2005,
  studentCount: {
    total: 850,
    male: 420,
    female: 430,
    specialNeeds: 45
  },
  staffCount: {
    teaching: 65,
    nonTeaching: 25
  },
  facilities: [
    'Computer Laboratory (50 stations)',
    'Robotics Lab with 3D Printers',
    'Science Laboratories (Physics, Chemistry, Biology)',
    'Library with Digital Resources',
    'Smart Classrooms with Interactive Boards',
    'Agricultural Plot',
    'Sports Complex',
    'Auditorium (500 capacity)'
  ],
  programs: [
    'AI and Machine Learning Club',
    'Robotics and Automation',
    'STEM Innovation Lab',
    'Inclusive Education Program',
    'Agricultural Technology',
    'Young Entrepreneurs Club',
    'Coding and Software Development',
    'Digital Arts and Design'
  ],
  achievements: [
    'National Robotics Competition Winners 2024',
    'Best STEM School Abuja 2023',
    'Google Code-in Finalists 2024',
    'Microsoft Imagine Cup Regional Winners',
    '100% WAEC Pass Rate for 5 consecutive years',
    'Inclusive Education Excellence Award 2024'
  ],
  focusAreas: [
    'Artificial Intelligence Education',
    'Robotics and Automation',
    'STEM Innovation',
    'Inclusive Education',
    'Agricultural Technology',
    'Youth Entrepreneurship'
  ],
  registrationDetails: {
    registrationNumber: 'RC-123456',
    taxId: 'TIN-987654321',
    ngoStatus: false,
    accreditationStatus: 'Fully Accredited'
  },
  contactInfo: {
    email: 'info@glistenacademy.edu.ng',
    phone: '+234-800-123-4567',
    website: 'https://glistenacademy.edu.ng',
    socialMedia: {
      facebook: 'https://facebook.com/glistenacademy',
      twitter: '@glistenacademy',
      linkedin: 'https://linkedin.com/school/glistenacademy'
    }
  },
  bankDetails: {
    accountName: 'Glisten International Academy',
    accountNumber: '0123456789',
    bankName: 'First Bank of Nigeria',
    swiftCode: 'FBNINGLA'
  },
  documents: [
    {
      id: '1',
      name: 'Certificate of Registration',
      type: 'PDF',
      url: '/docs/registration.pdf',
      uploadedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Tax Clearance Certificate',
      type: 'PDF',
      url: '/docs/tax-clearance.pdf',
      uploadedAt: '2024-01-15',
      expiresAt: '2025-01-15'
    },
    {
      id: '3',
      name: 'Accreditation Certificate',
      type: 'PDF',
      url: '/docs/accreditation.pdf',
      uploadedAt: '2024-01-15'
    }
  ],
  impactStories: [
    {
      id: '1',
      title: 'AI Club Transforms Student Learning',
      description: 'Our AI club has trained over 200 students in machine learning basics, with 5 students advancing to national competitions.',
      beneficiaries: 200,
      outcome: '5 national competition finalists, 2 internship placements',
      date: '2024-12-01'
    },
    {
      id: '2',
      title: 'Inclusive Education Success Story',
      description: 'Our SEN program has successfully integrated 45 students with special needs, achieving 95% academic success rate.',
      beneficiaries: 45,
      outcome: '95% academic success, full social integration',
      date: '2024-11-15'
    }
  ],
  strategicGoals: [
    'Become the leading AI education center in West Africa',
    'Expand robotics program to all grade levels',
    'Achieve 1000 student enrollment by 2027',
    'Establish international partnerships with tech companies',
    'Develop award-winning STEM curriculum',
    'Create sustainable agricultural program'
  ]
};

export const mockAIAgent: AIAgent = {
  id: '1',
  name: 'GIAA Grant Intelligence Agent',
  status: 'ACTIVE',
  lastRun: '2026-02-17T14:30:00Z',
  nextRun: '2026-02-17T20:00:00Z',
  tasks: [
    {
      id: '1',
      type: 'DISCOVER',
      status: 'COMPLETED',
      priority: 'HIGH',
      createdAt: '2026-02-17T14:00:00Z',
      completedAt: '2026-02-17T14:30:00Z',
      result: { grantsFound: 12 }
    },
    {
      id: '2',
      type: 'FILTER',
      status: 'COMPLETED',
      priority: 'HIGH',
      createdAt: '2026-02-17T14:30:00Z',
      completedAt: '2026-02-17T14:35:00Z',
      result: { grantsMatched: 5 }
    },
    {
      id: '3',
      type: 'ANALYZE',
      status: 'RUNNING',
      priority: 'MEDIUM',
      createdAt: '2026-02-17T14:35:00Z'
    },
    {
      id: '4',
      type: 'NOTIFY',
      status: 'PENDING',
      priority: 'HIGH',
      createdAt: '2026-02-17T19:00:00Z'
    }
  ],
  configuration: {
    searchKeywords: [
      'education grant Africa',
      'STEM funding Nigeria',
      'AI education grant',
      'robotics school funding',
      'inclusive education Africa',
      'technology grant schools',
      'private school funding'
    ],
    grantSources: [
      {
        id: '1',
        name: 'FundsforNGOs',
        url: 'https://fundsforngos.org',
        type: 'WEBSITE',
        isActive: true,
        lastScraped: '2026-02-17T14:30:00Z'
      },
      {
        id: '2',
        name: 'Opportunity Desk',
        url: 'https://opportunitydesk.org',
        type: 'WEBSITE',
        isActive: true,
        lastScraped: '2026-02-17T14:30:00Z'
      },
      {
        id: '3',
        name: 'Google for Education',
        url: 'https://edu.google.com/grants',
        type: 'RSS',
        isActive: true,
        lastScraped: '2026-02-17T14:30:00Z'
      },
      {
        id: '4',
        name: 'Microsoft Philanthropies',
        url: 'https://microsoft.com/philanthropies',
        type: 'API',
        isActive: true,
        lastScraped: '2026-02-17T14:30:00Z'
      }
    ],
    notificationSettings: {
      emailEnabled: true,
      whatsappEnabled: true,
      digestFrequency: 'WEEKLY',
      urgentAlertsEnabled: true,
      recipients: ['director@glistenacademy.edu.ng', 'grants@glistenacademy.edu.ng']
    },
    autoDraftEnabled: true,
    filteringCriteria: {
      minAmount: 10000,
      maxAmount: 500000,
      categories: ['STEM', 'AI_EDUCATION', 'ROBOTICS', 'EDUCATION_INNOVATION', 'INCLUSIVE_EDUCATION', 'TECHNOLOGY'],
      eligibleRegions: ['Nigeria', 'West Africa', 'Africa'],
      deadlineRange: 180
    }
  },
  stats: {
    totalGrantsFound: 156,
    totalGrantsFiltered: 48,
    totalApplicationsSubmitted: 12,
    totalFundingSecured: 450000,
    successRate: 35,
    averageResponseTime: 14
  }
};

export const mockDashboardStats: DashboardStats = {
  totalGrants: 156,
  activeApplications: 8,
  pendingReview: 15,
  fundedGrants: 5,
  totalFunding: 450000,
  upcomingDeadlines: 3,
  aiMatches: 24,
  successRate: 35
};

export const mockDeadlineAlerts: DeadlineAlert[] = [
  {
    id: '1',
    grantId: '3',
    grantName: 'Inclusive Education Technology Grant',
    deadline: '2026-03-01',
    daysRemaining: 12,
    priority: 'URGENT',
    status: 'PENDING'
  },
  {
    id: '2',
    grantId: '1',
    grantName: 'AI in Education Innovation Fund',
    deadline: '2026-03-15',
    daysRemaining: 26,
    priority: 'HIGH',
    status: 'NOTIFIED'
  },
  {
    id: '3',
    grantId: '6',
    grantName: 'Digital Infrastructure Development',
    deadline: '2026-03-30',
    daysRemaining: 41,
    priority: 'HIGH',
    status: 'NOTIFIED'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'GRANT_FOUND',
    title: 'New High-Relevance Grant Found',
    message: 'AI in Education Innovation Fund - $100,000 - Deadline: March 15, 2026',
    data: { grantId: '1' },
    read: false,
    createdAt: '2026-02-17T14:30:00Z',
    priority: 'HIGH'
  },
  {
    id: '2',
    type: 'DEADLINE_ALERT',
    title: 'URGENT: Grant Deadline Approaching',
    message: 'Inclusive Education Technology Grant deadline in 12 days!',
    data: { grantId: '3', daysRemaining: 12 },
    read: false,
    createdAt: '2026-02-17T10:00:00Z',
    priority: 'HIGH'
  },
  {
    id: '3',
    type: 'AI_RECOMMENDATION',
    title: 'AI Recommendation: Strong Match',
    message: 'STEM Robotics Lab Grant has 85% success probability based on your profile.',
    data: { grantId: '2', successRate: 85 },
    read: true,
    createdAt: '2026-02-16T16:00:00Z',
    priority: 'MEDIUM'
  },
  {
    id: '4',
    type: 'STATUS_UPDATE',
    title: 'Application Status Updated',
    message: 'Digital Infrastructure Development grant moved to Applying stage.',
    data: { grantId: '6', newStatus: 'APPLYING' },
    read: true,
    createdAt: '2026-02-15T09:00:00Z',
    priority: 'MEDIUM'
  }
];

export const mockProposals: Proposal[] = [
  {
    id: '1',
    grantId: '2',
    title: 'Advanced Robotics Lab Expansion Proposal',
    content: [
      {
        id: '1',
        title: 'Executive Summary',
        content: 'Glisten International Academy seeks funding to expand our existing robotics laboratory...',
        wordCount: 250,
        maxWords: 300,
        aiSuggestions: ['Emphasize competition wins', 'Include student testimonials']
      },
      {
        id: '2',
        title: 'Project Description',
        content: 'Our robotics program has grown from 20 students to over 150 in three years...',
        wordCount: 450,
        maxWords: 500,
        aiSuggestions: ['Add specific equipment list', 'Include safety protocols']
      }
    ],
    status: 'REVIEW',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-14T15:30:00Z',
    aiGenerated: true,
    version: 2
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'director@glistenacademy.edu.ng',
    role: 'ADMIN',
    avatar: '/avatars/director.jpg',
    permissions: ['ALL'],
    lastLogin: '2026-02-17T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Mr. Emmanuel Adeyemi',
    email: 'grants@glistenacademy.edu.ng',
    role: 'MANAGER',
    avatar: '/avatars/grants-manager.jpg',
    permissions: ['GRANTS_READ', 'GRANTS_WRITE', 'PROPOSALS_READ', 'PROPOSALS_WRITE'],
    lastLogin: '2026-02-17T09:30:00Z',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mrs. Fatima Ibrahim',
    email: 'admin@glistenacademy.edu.ng',
    role: 'VIEWER',
    avatar: '/avatars/admin.jpg',
    permissions: ['GRANTS_READ', 'DASHBOARD_READ'],
    lastLogin: '2026-02-16T14:00:00Z',
    createdAt: '2024-03-01T00:00:00Z'
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Dr. Sarah Johnson',
    action: 'CREATED',
    entityType: 'APPLICATION',
    entityId: '6',
    details: 'Started application for Digital Infrastructure Development grant',
    timestamp: '2026-02-15T09:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mr. Emmanuel Adeyemi',
    action: 'UPDATED',
    entityType: 'PROPOSAL',
    entityId: '1',
    details: 'Updated Robotics Lab proposal - version 2',
    timestamp: '2026-02-14T15:30:00Z'
  },
  {
    id: '3',
    userId: '1',
    userName: 'Dr. Sarah Johnson',
    action: 'VIEWED',
    entityType: 'GRANT',
    entityId: '1',
    details: 'Reviewed AI in Education Innovation Fund',
    timestamp: '2026-02-17T10:00:00Z'
  }
];
