// Grant Types
export interface Grant {
  id: string;
  name: string;
  organization: string;
  amount: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  description: string;
  eligibility: string[];
  category: GrantCategory;
  relevanceScore: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'REVIEWING' | 'APPLYING' | 'SUBMITTED' | 'FUNDED' | 'REJECTED';
  requirements: string[];
  documents: string[];
  contactEmail?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  applicationReadiness?: ApplicationReadiness;
}

export type GrantCategory = 
  | 'STEM'
  | 'AI_EDUCATION'
  | 'ROBOTICS'
  | 'EDUCATION_INNOVATION'
  | 'INCLUSIVE_EDUCATION'
  | 'AGRICULTURE'
  | 'SUSTAINABILITY'
  | 'ENTREPRENEURSHIP'
  | 'INFRASTRUCTURE'
  | 'YOUTH_DEVELOPMENT'
  | 'TECHNOLOGY'
  | 'GENERAL';

export interface ApplicationReadiness {
  score: number;
  missingRequirements: string[];
  strengths: string[];
  recommendations: string[];
  estimatedSuccessRate: number;
}

// School Profile Types
export interface SchoolProfile {
  id: string;
  name: string;
  type: 'PRIVATE' | 'PUBLIC' | 'NGO';
  location: {
    country: string;
    state: string;
    city: string;
    address: string;
  };
  establishedYear: number;
  studentCount: {
    total: number;
    male: number;
    female: number;
    specialNeeds: number;
  };
  staffCount: {
    teaching: number;
    nonTeaching: number;
  };
  facilities: string[];
  programs: string[];
  achievements: string[];
  focusAreas: string[];
  registrationDetails: {
    registrationNumber: string;
    taxId?: string;
    ngoStatus?: boolean;
    accreditationStatus: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    swiftCode?: string;
  };
  documents: SchoolDocument[];
  impactStories: ImpactStory[];
  strategicGoals: string[];
}

export interface SchoolDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  expiresAt?: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  description: string;
  beneficiaries: number;
  outcome: string;
  images?: string[];
  date: string;
}

// AI Agent Types
export interface AIAgent {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  lastRun: string;
  nextRun: string;
  tasks: AgentTask[];
  configuration: AgentConfiguration;
  stats: AgentStats;
}

export interface AgentTask {
  id: string;
  type: 'DISCOVER' | 'FILTER' | 'ANALYZE' | 'NOTIFY' | 'DRAFT';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export interface AgentConfiguration {
  searchKeywords: string[];
  grantSources: GrantSource[];
  notificationSettings: NotificationSettings;
  autoDraftEnabled: boolean;
  filteringCriteria: FilteringCriteria;
}

export interface GrantSource {
  id: string;
  name: string;
  url: string;
  type: 'WEBSITE' | 'RSS' | 'API' | 'EMAIL';
  isActive: boolean;
  lastScraped?: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  digestFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  urgentAlertsEnabled: boolean;
  recipients: string[];
}

export interface FilteringCriteria {
  minAmount: number;
  maxAmount: number;
  categories: GrantCategory[];
  eligibleRegions: string[];
  deadlineRange: number; // days
}

export interface AgentStats {
  totalGrantsFound: number;
  totalGrantsFiltered: number;
  totalApplicationsSubmitted: number;
  totalFundingSecured: number;
  successRate: number;
  averageResponseTime: number;
}

// Dashboard Types
export interface DashboardStats {
  totalGrants: number;
  activeApplications: number;
  pendingReview: number;
  fundedGrants: number;
  totalFunding: number;
  upcomingDeadlines: number;
  aiMatches: number;
  successRate: number;
}

export interface DeadlineAlert {
  id: string;
  grantId: string;
  grantName: string;
  deadline: string;
  daysRemaining: number;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  status: 'NOTIFIED' | 'PENDING';
}

// Proposal Types
export interface Proposal {
  id: string;
  grantId: string;
  title: string;
  content: ProposalSection[];
  status: 'DRAFT' | 'REVIEW' | 'FINAL' | 'SUBMITTED';
  createdAt: string;
  updatedAt: string;
  aiGenerated: boolean;
  version: number;
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  aiSuggestions?: string[];
  wordCount: number;
  maxWords?: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'GRANT_FOUND' | 'DEADLINE_ALERT' | 'STATUS_UPDATE' | 'AI_RECOMMENDATION' | 'SYSTEM';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
  avatar?: string;
  permissions: string[];
  lastLogin: string;
  createdAt: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'GRANT' | 'PROPOSAL' | 'APPLICATION' | 'SYSTEM';
  entityId?: string;
  details: string;
  timestamp: string;
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  categories?: GrantCategory[];
  status?: Grant['status'][];
  minAmount?: number;
  maxAmount?: number;
  deadlineFrom?: string;
  deadlineTo?: string;
  relevanceScore?: ('HIGH' | 'MEDIUM' | 'LOW')[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
