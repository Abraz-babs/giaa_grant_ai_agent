import type {
  Grant,
  Notification,
  DashboardStats,
  User,
  SchoolProfile,
  AIAgent,
} from "../types";

// ... (imports remain)

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Zakiyah Zuhair",
    email: "zakiyah@glisteninternationalacademy.com",
    role: "ADMIN",
    permissions: ["ALL"],
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Zarah Zuhair",
    email: "zarah@glisteninternationalacademy.com",
    role: "ADMIN",
    permissions: ["ALL"],
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Mr. Alabi",
    email: "alabi@glisteninternationalacademy.com",
    role: "MANAGER",
    permissions: ["GRANTS_READ", "GRANTS_WRITE", "PROPOSALS_READ"],
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Amina Bello",
    email: "amina.bello@glisteninternationalacademy.com",
    role: "VIEWER",
    permissions: ["GRANTS_READ"],
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Yusuf Ibrahim",
    email: "yusuf.ibrahim@glisteninternationalacademy.com",
    role: "VIEWER",
    permissions: ["GRANTS_READ"],
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export const mockUser = mockUsers[0];

export const mockSchoolProfile: SchoolProfile = {
  id: "1",
  name: "Glisten International Academy",
  type: "PRIVATE",
  location: {
    country: "Nigeria",
    state: "FCT",
    city: "Abuja",
    address: "Plot 1457, Cadastral Zone B8, Jahi District",
  },
  establishedYear: 2006,
  studentCount: { total: 1250, male: 600, female: 650, specialNeeds: 45 },
  staffCount: { teaching: 120, nonTeaching: 50 },
  facilities: [
    "Robotics & AI Lab",
    "Science Laboratories",
    "ICT Complex",
    "Library & Research Center",
    "Sports Complex",
  ],
  programs: [
    "Early Years",
    "Primary Education",
    "Junior Secondary",
    "Senior Secondary",
    "Robotics & Coding Club",
  ],
  achievements: [
    "Best Private Primary School in FCT",
    "VEX Robotics World Championship Participants",
  ],
  focusAreas: ["Academic Excellence", "Technological Innovation"],
  registrationDetails: {
    registrationNumber: "GIA-2006-REG",
    accreditationStatus: "Fully Accredited",
  },
  contactInfo: {
    email: "info@glisteninternationalacademy.com",
    phone: "+234 803 123 4567",
    website: "https://glisteninternationalacademy.com",
  },
  documents: [],
  impactStories: [],
  strategicGoals: ["Expand AI & Robotics", "Maintain 100% distinction rate"],
};

export const mockGrants: Grant[] = [
  {
    id: "1",
    name: "UNICEF Inclusive Education Fund",
    organization: "UNICEF",
    amount: { min: 25000, max: 100000, currency: "USD" },
    deadline: "2026-05-20",
    description:
      "Supporting schools in developing inclusive education models that serve children with disabilities and diverse learning needs. Focus on creating accessible learning environments and specialized teaching resources.",
    eligibility: [
      "K-12 educational institutions",
      "Active inclusion programs",
      "Located in eligible UNICEF countries",
    ],
    category: "INCLUSIVE_EDUCATION",
    relevanceScore: "HIGH",
    status: "REVIEWING",
    requirements: [
      "Inclusion Program Description",
      "Student Needs Assessment",
      "Budget Plan",
    ],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    websiteUrl: "https://www.unicef.org/education",
    aiSummary:
      "Strong match for GIA's inclusive education initiatives. School already has 45 special needs students and dedicated support programs.",
    applicationReadiness: {
      score: 65,
      missingRequirements: ["Student Needs Assessment Report"],
      strengths: ["Existing Inclusion Programs", "Special Needs Facilities"],
      recommendations: [
        "Document current inclusion metrics",
        "Prepare case studies",
      ],
      estimatedSuccessRate: 40,
    },
  },
  {
    id: "2",
    name: "Africa STEM Education Innovation Grant",
    organization: "World Bank Education Fund",
    amount: { min: 50000, max: 250000, currency: "USD" },
    deadline: "2026-06-15",
    description:
      "Supporting innovative STEM education models in Sub-Saharan Africa with focus on technology integration, teacher training, and scalable curriculum development for secondary schools.",
    eligibility: [
      "Registered educational institution in Africa",
      "Minimum 3 years operational",
      "Demonstrated STEM programs",
    ],
    category: "STEM",
    relevanceScore: "HIGH",
    status: "NEW",
    requirements: [
      "Project Proposal",
      "Financial Report",
      "STEM Program Documentation",
    ],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    websiteUrl: "https://www.worldbank.org/en/topic/education",
    aiSummary:
      "Excellent fit for GIA's Robotics & AI Lab expansion. School has strong STEM track record with VEX Robotics participation.",
    applicationReadiness: {
      score: 78,
      missingRequirements: ["Detailed Project Proposal"],
      strengths: [
        "Existing Robotics Lab",
        "STEM Curriculum",
        "Qualified Staff",
      ],
      recommendations: [
        "Develop 3-year STEM roadmap",
        "Partner with tech companies",
      ],
      estimatedSuccessRate: 35,
    },
  },
  {
    id: "3",
    name: "Google AI for Education Grant",
    organization: "Google.org",
    amount: { min: 100000, max: 500000, currency: "USD" },
    deadline: "2026-07-31",
    description:
      "Empowering schools to integrate AI and machine learning into curricula across developing nations, with emphasis on ethical AI education and practical applications in classroom settings.",
    eligibility: [
      "Existing AI/tech curriculum",
      "Measurable student outcomes",
      "Open to schools worldwide",
    ],
    category: "AI_EDUCATION",
    relevanceScore: "HIGH",
    status: "NEW",
    requirements: [
      "Theory of Change",
      "AI Implementation Plan",
      "Budget Breakdown",
    ],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    websiteUrl: "https://www.google.org/our-work/education/",
    aiSummary:
      "Transformational opportunity for GIA to become a regional AI education leader. School already uses Google Classroom extensively.",
    applicationReadiness: {
      score: 85,
      missingRequirements: ["Theory of Change Document"],
      strengths: [
        "Google Classroom Usage",
        "Tech-Savvy Staff",
        "ICT Infrastructure",
      ],
      recommendations: [
        "Draft AI curriculum roadmap",
        "Identify pilot classes",
      ],
      estimatedSuccessRate: 25,
    },
  },
  {
    id: "4",
    name: "UK FCDO Education Technology Grant",
    organization: "UK Foreign, Commonwealth & Development Office",
    amount: { min: 75000, max: 300000, currency: "GBP" },
    deadline: "2026-08-15",
    description:
      "Funding innovative use of technology in education across Commonwealth nations, focused on bridging the digital divide and improving learning outcomes through ed-tech solutions.",
    eligibility: [
      "Commonwealth nation institution",
      "Track record in ed-tech",
      "Partnership with local government",
    ],
    category: "EDUCATION_INNOVATION",
    relevanceScore: "MEDIUM",
    status: "NEW",
    requirements: [
      "Innovation Proposal",
      "Government Partnership Letter",
      "Impact Metrics",
    ],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    websiteUrl:
      "https://www.gov.uk/government/organisations/foreign-commonwealth-development-office",
    aiSummary:
      "Good opportunity given Nigeria's Commonwealth status. Requires government partnership documentation.",
    applicationReadiness: {
      score: 55,
      missingRequirements: ["Government Partnership Letter"],
      strengths: [
        "Nigeria is Commonwealth Member",
        "Existing Ed-Tech Programs",
      ],
      recommendations: [
        "Contact Ministry of Education",
        "Prepare partnership MOUs",
      ],
      estimatedSuccessRate: 20,
    },
  },
  {
    id: "5",
    name: "IBRO Neuroscience Training Grants 2026",
    organization: "International Brain Research Organization (IBRO)",
    amount: { min: 10000, max: 50000, currency: "USD" },
    deadline: "2026-09-14",
    description:
      "Supporting neuroscience education and research training programs in Africa, with emphasis on building local capacity in brain research and related STEM fields for secondary and tertiary institutions.",
    eligibility: [
      "African educational institutions",
      "Neuroscience or related STEM programs",
      "Research training capacity",
    ],
    category: "STEM",
    relevanceScore: "MEDIUM",
    status: "NEW",
    requirements: [
      "Research Training Plan",
      "Faculty Qualifications",
      "Lab Facilities Description",
    ],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    websiteUrl: "https://www.ibro.org/grants",
    aiSummary:
      "Niche opportunity for GIA's science department. Could establish neuroscience as a unique offering in the school's STEM portfolio.",
    applicationReadiness: {
      score: 60,
      missingRequirements: ["Specialized Lab Equipment List"],
      strengths: ["Strong Science Faculty", "Existing Lab Infrastructure"],
      recommendations: [
        "Partner with university neuroscience dept",
        "Identify interested students",
      ],
      estimatedSuccessRate: 25,
    },
  },
  {
    id: "6",
    name: "Mastercard Foundation Scholars Program",
    organization: "Mastercard Foundation",
    amount: { min: 200000, max: 1000000, currency: "USD" },
    deadline: "2026-09-30",
    description:
      "Enabling young people in Africa to access quality education and develop leadership skills for transforming their communities. Focus on scholarship programs and leadership development.",
    eligibility: [
      "African institution",
      "Scholarship program capacity",
      "Community impact focus",
    ],
    category: "YOUTH_DEVELOPMENT",
    relevanceScore: "MEDIUM",
    status: "SUBMITTED",
    requirements: [
      "Scholarship Framework",
      "Leadership Curriculum",
      "Community Impact Plan",
    ],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    websiteUrl: "https://mastercardfdn.org/all/scholars/",
    aiSummary:
      "Already submitted. Large-scale opportunity that could fund 20+ GIA students annually through secondary education.",
    applicationReadiness: {
      score: 50,
      missingRequirements: ["Community Impact Metrics"],
      strengths: ["Strong Student Body", "Leadership Programs"],
      recommendations: [
        "Track alumni success stories",
        "Strengthen community partnerships",
      ],
      estimatedSuccessRate: 15,
    },
  },
  {
    id: "7",
    name: "USAID Robotics & Innovation in Learning",
    organization: "USAID",
    amount: { min: 50000, max: 200000, currency: "USD" },
    deadline: "2026-10-30",
    description:
      "Promoting hands-on robotics and innovation labs within schools across Africa, emphasizing practical skills for future workforce readiness and STEM career pathways.",
    eligibility: [
      "Schools with existing STEM infrastructure",
      "Robotics programs or plans",
      "Measurable outcomes",
    ],
    category: "ROBOTICS",
    relevanceScore: "HIGH",
    status: "NEW",
    requirements: [
      "Robotics Program Plan",
      "Equipment Budget",
      "Teacher Training Plan",
    ],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    websiteUrl: "https://www.usaid.gov/education",
    aiSummary:
      "Perfect match for GIA's VEX Robotics program. School already has robotics lab and competition experience. High potential for funding.",
    applicationReadiness: {
      score: 72,
      missingRequirements: ["Detailed Equipment Budget"],
      strengths: [
        "VEX Robotics Experience",
        "Dedicated Lab Space",
        "Trained Instructors",
      ],
      recommendations: [
        "Document competition achievements",
        "Plan lab expansion",
      ],
      estimatedSuccessRate: 30,
    },
  },
];

export const mockStats: DashboardStats = {
  totalGrants: 7, // 7 active education grants with valid deadlines
  activeApplications: 1, // Mastercard Foundation is SUBMITTED
  pendingReview: 1, // UNICEF is REVIEWING
  fundedGrants: 0,
  totalFunding: 0,
  upcomingDeadlines: 2, // UNICEF (May 20) and Africa STEM (June 15) within 30 days
  aiMatches: 4, // UNICEF, Africa STEM, Google AI, USAID Robotics = HIGH relevance
  successRate: 0, // No funded grants yet
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "GRANT_FOUND",
    title: "New High-Match Grant",
    message: "UNICEF Inclusive Education Fund — 65% match with school profile",
    priority: "HIGH",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "DEADLINE_ALERT",
    title: "Deadline Approaching",
    message:
      "UNICEF Inclusive Education Fund closes May 20, 2026 — 12 days remaining",
    priority: "HIGH",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    type: "GRANT_FOUND",
    title: "AI Match Found",
    message:
      "USAID Robotics & Innovation in Learning — 72% match, HIGH relevance",
    priority: "HIGH",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    type: "SYSTEM",
    title: "Agent Scan Complete",
    message:
      "AI Agent scan completed. 7 active grants in system, 4 high-relevance matches.",
    priority: "LOW",
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "5",
    type: "STATUS_UPDATE",
    title: "Application Submitted",
    message:
      "Mastercard Foundation Scholars Program has been submitted for review.",
    priority: "MEDIUM",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockAgent: AIAgent = {
  id: "1",
  name: "GrantScout-X1",
  status: "ACTIVE",
  lastRun: new Date().toISOString(),
  nextRun: new Date(Date.now() + 6 * 3600000).toISOString(),
  tasks: [
    {
      id: "t1",
      type: "DISCOVER",
      status: "RUNNING",
      priority: "HIGH",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t2",
      type: "ANALYZE",
      status: "COMPLETED",
      priority: "HIGH",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      result: "Identified 7 active opportunities",
    },
    {
      id: "t3",
      type: "FILTER",
      status: "PENDING",
      priority: "MEDIUM",
      createdAt: new Date().toISOString(),
    },
  ],
  configuration: {
    searchKeywords: [
      "STEM",
      "Education",
      "Africa",
      "Robotics",
      "Special Needs",
      "Neuroscience",
      "AI",
    ],
    grantSources: [
      {
        id: "s1",
        name: "UNICEF",
        url: "https://www.unicef.org/education",
        type: "WEBSITE",
        isActive: true,
        lastScraped: new Date().toISOString(),
      },
      {
        id: "s2",
        name: "World Bank",
        url: "https://www.worldbank.org/en/topic/education",
        type: "WEBSITE",
        isActive: true,
        lastScraped: new Date().toISOString(),
      },
      {
        id: "s3",
        name: "Google.org",
        url: "https://www.google.org",
        type: "WEBSITE",
        isActive: true,
        lastScraped: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "s4",
        name: "USAID",
        url: "https://www.usaid.gov/education",
        type: "WEBSITE",
        isActive: true,
        lastScraped: new Date().toISOString(),
      },
      {
        id: "s5",
        name: "IBRO",
        url: "https://www.ibro.org/grants",
        type: "WEBSITE",
        isActive: true,
        lastScraped: new Date().toISOString(),
      },
      {
        id: "s6",
        name: "Mastercard Foundation",
        url: "https://mastercardfdn.org",
        type: "WEBSITE",
        isActive: true,
        lastScraped: new Date().toISOString(),
      },
      {
        id: "s7",
        name: "UK FCDO",
        url: "https://www.gov.uk",
        type: "WEBSITE",
        isActive: true,
        lastScraped: new Date().toISOString(),
      },
    ],
    notificationSettings: {
      emailEnabled: true,
      whatsappEnabled: true,
      digestFrequency: "DAILY",
      urgentAlertsEnabled: true,
      recipients: ["zakiyah@glisteninternationalacademy.com"],
    },
    autoDraftEnabled: false,
    filteringCriteria: {
      minAmount: 1000,
      maxAmount: 1000000,
      categories: [
        "STEM",
        "EDUCATION_INNOVATION",
        "ROBOTICS",
        "AI_EDUCATION",
        "INCLUSIVE_EDUCATION",
        "YOUTH_DEVELOPMENT",
      ],
      eligibleRegions: ["Africa", "Nigeria", "Commonwealth"],
      deadlineRange: 180,
    },
  },
  stats: {
    totalGrantsFound: 7,
    totalGrantsFiltered: 4,
    totalApplicationsSubmitted: 1,
    totalFundingSecured: 0,
    successRate: 0,
    averageResponseTime: 120,
  },
};
