import type { Grant, GrantCategory } from "../types";

// ─── Grant Source Templates ───────────────────────────────────────────────────

interface GrantTemplate {
  name: string;
  organization: string;
  description: string;
  category: GrantCategory;
  amountRange: { min: number; max: number };
  eligibility: string[];
  requirements: string[];
  websiteUrl: string;
  contactEmail: string;
}

const GRANT_TEMPLATES: GrantTemplate[] = [
  {
    name: "Africa EdTech Innovation Fund",
    organization: "African Development Bank",
    description:
      "The Africa EdTech Innovation Fund supports educational institutions leveraging technology to improve learning outcomes. Grants fund digital infrastructure, teacher training in EdTech, and development of digital learning content. Priority is given to projects that address equity gaps and reach underserved communities.",
    category: "TECHNOLOGY",
    amountRange: { min: 20000, max: 150000 },
    eligibility: [
      "Educational institutions in Africa",
      "Must have existing ICT infrastructure",
      "Must demonstrate capacity for digital content development",
      "Must have a sustainability plan",
    ],
    requirements: [
      "EdTech implementation proposal",
      "Infrastructure assessment report",
      "Teacher training plan",
      "Budget and sustainability plan",
    ],
    websiteUrl: "https://www.afdb.org",
    contactEmail: "grants@afdb.org",
  },
  {
    name: "Girls in STEM Scholarship Program",
    organization: "UNESCO & L'Oréal Foundation",
    description:
      "A joint initiative to promote girls' participation in STEM education. The program provides scholarships, mentorship, and laboratory equipment to schools that demonstrate commitment to gender equity in STEM. Selected schools receive funding to establish girls-only STEM clubs, purchase lab equipment, and train female STEM mentors.",
    category: "INCLUSIVE_EDUCATION",
    amountRange: { min: 10000, max: 75000 },
    eligibility: [
      "Primary or secondary schools",
      "Must have at least 40% female enrollment",
      "Must have qualified STEM teachers",
      "Must commit to gender equity policies",
    ],
    requirements: [
      "Gender equity assessment",
      "STEM club implementation plan",
      "Mentorship program outline",
      "Equipment and resource list",
    ],
    websiteUrl: "https://www.unesco.org",
    contactEmail: "stem.grants@unesco.org",
  },
  {
    name: "Digital Classroom Transformation Grant",
    organization: "Microsoft Education",
    description:
      "Microsoft Education's Digital Classroom Transformation Grant provides schools with Microsoft 365 licenses, Surface devices, and professional development for teachers. The program aims to create model digital classrooms that can serve as exemplars for other schools in the region.",
    category: "TECHNOLOGY",
    amountRange: { min: 25000, max: 100000 },
    eligibility: [
      "Primary or secondary schools",
      "Must have reliable internet connectivity",
      "Must have basic computer lab",
      "Must have IT support staff",
    ],
    requirements: [
      "Digital transformation roadmap",
      "Device deployment strategy",
      "Teacher training schedule",
      "Internet connectivity plan",
    ],
    websiteUrl: "https://www.microsoft.com/education",
    contactEmail: "edu.grants@microsoft.com",
  },
  {
    name: "Climate Action in Education Fund",
    organization: "Green Climate Fund",
    description:
      "The Climate Action in Education Fund supports schools in integrating climate change education into their curriculum. Grants fund development of climate education materials, establishment of school gardens and renewable energy projects, and teacher training in climate science and sustainability.",
    category: "SUSTAINABILITY",
    amountRange: { min: 15000, max: 60000 },
    eligibility: [
      "Educational institutions",
      "Must have outdoor space for sustainability projects",
      "Must have science teachers willing to integrate climate topics",
      "Must have community partnership for project sustainability",
    ],
    requirements: [
      "Climate education integration plan",
      "Sustainability project proposal",
      "Community partnership agreements",
      "Monitoring and impact assessment framework",
    ],
    websiteUrl: "https://www.greenclimate.fund",
    contactEmail: "proposals@gcfund.org",
  },
  {
    name: "Robotics & AI in Education Grant",
    organization: "Google DeepMind Education",
    description:
      "A grant program designed to bring robotics and artificial intelligence education to secondary schools. Selected schools receive robotics kits, AI learning platforms, and teacher training. The program includes access to online AI courses and participation in regional robotics competitions.",
    category: "ROBOTICS",
    amountRange: { min: 5000, max: 50000 },
    eligibility: [
      "Secondary schools with STEM focus",
      "Must have at least one dedicated STEM lab",
      "Must have teachers willing to undergo robotics training",
      "Must commit to participating in robotics competitions",
    ],
    requirements: [
      "Robotics lab setup plan",
      "Teacher training commitment letter",
      "Competition participation plan",
      "Budget for equipment and materials",
    ],
    websiteUrl: "https://deepmind.google",
    contactEmail: "ai-education@deepmind.google",
  },
  {
    name: "Special Needs Education Support Grant",
    organization: "Global Partnership for Education",
    description:
      "The Special Needs Education Support Grant provides funding for schools to improve accessibility and inclusive education. Grants cover infrastructure modifications, assistive technologies, specialized teacher training, and development of individualized education programs (IEPs) for students with special needs.",
    category: "INCLUSIVE_EDUCATION",
    amountRange: { min: 10000, max: 80000 },
    eligibility: [
      "Schools with special needs programs",
      "Must have at least 10 students with identified special needs",
      "Must have qualified special education teachers or plan to hire",
      "Must demonstrate commitment to inclusive education",
    ],
    requirements: [
      "Accessibility audit report",
      "Assistive technology needs assessment",
      "Teacher training plan for special education",
      "Inclusive education policy document",
    ],
    websiteUrl: "https://www.globalpartnership.org",
    contactEmail: "grants@globalpartnership.org",
  },
  {
    name: "Youth Entrepreneurship Bootcamp Grant",
    organization: "Tony Elumelu Foundation",
    description:
      "The Youth Entrepreneurship Bootcamp Grant funds schools to establish entrepreneurship bootcamps for students. The program covers curriculum development, mentorship from local entrepreneurs, seed funding for student startups, and business plan competitions. Schools become certified entrepreneurship hubs.",
    category: "ENTREPRENEURSHIP",
    amountRange: { min: 5000, max: 25000 },
    eligibility: [
      "Secondary schools and universities",
      "Must have business studies or entrepreneurship program",
      "Must have partnerships with local businesses",
      "Must have space for incubation activities",
    ],
    requirements: [
      "Entrepreneurship curriculum proposal",
      "Mentorship network plan",
      "Seed fund management framework",
      "Business competition guidelines",
    ],
    websiteUrl: "https://www.tonyelumelufoundation.org",
    contactEmail: "entrepreneurship@tonyelumelufoundation.org",
  },
  {
    name: "STEM Teacher Excellence Fellowship",
    organization: "Mastercard Foundation",
    description:
      "The STEM Teacher Excellence Fellowship provides funding for schools to upskill their STEM teachers through advanced training, conference attendance, and collaborative research. Schools receive grants to cover teacher training costs, laboratory equipment upgrades, and STEM resource development.",
    category: "STEM",
    amountRange: { min: 15000, max: 45000 },
    eligibility: [
      "Schools with STEM departments",
      "Must have at least 3 STEM teachers",
      "Must have a professional development plan for teachers",
      "Must have laboratory facilities",
    ],
    requirements: [
      "Teacher professional development plan",
      "Laboratory equipment upgrade list",
      "STEM resource development proposal",
      "Teacher commitment letters",
    ],
    websiteUrl: "https://mastercardfdn.org",
    contactEmail: "scholars@mastercardfdn.org",
  },
  {
    name: "Arts & Culture Integration in Education",
    organization: "African Cultural Foundation",
    description:
      "A grant supporting the integration of arts, culture, and creative expression into school curricula. Funding is available for arts equipment, cultural exchange programs, artist-in-residence initiatives, and development of creative arts curricula that celebrate African heritage and contemporary creativity.",
    category: "YOUTH_DEVELOPMENT",
    amountRange: { min: 5000, max: 30000 },
    eligibility: [
      "Schools with arts programs",
      "Must have dedicated space for arts activities",
      "Must have at least one arts teacher",
      "Must demonstrate community engagement in arts",
    ],
    requirements: [
      "Arts integration curriculum plan",
      "Cultural exchange program proposal",
      "Artist-in-residence program outline",
      "Equipment and materials budget",
    ],
    websiteUrl: "https://www.africanculturalfoundation.org",
    contactEmail: "arts.education@africanculturalfoundation.org",
  },
  {
    name: "School Infrastructure Development Fund",
    organization: "World Bank Education Group",
    description:
      "The School Infrastructure Development Fund provides grants for construction and renovation of school facilities. Priority is given to projects that improve access for students with disabilities, enhance safety, and create conducive learning environments. Projects include classroom construction, laboratory building, and library development.",
    category: "INFRASTRUCTURE",
    amountRange: { min: 50000, max: 500000 },
    eligibility: [
      "Schools with infrastructure deficits",
      "Must have land title or long-term lease",
      "Must have architectural plans or capacity to develop them",
      "Must have community contribution commitment",
    ],
    requirements: [
      "Infrastructure needs assessment",
      "Architectural plans and designs",
      "Environmental impact assessment",
      "Community contribution agreement",
      "Project implementation timeline",
    ],
    websiteUrl: "https://www.worldbank.org/en/topic/education",
    contactEmail: "education@worldbank.org",
  },
  {
    name: "AI Literacy for Secondary Schools",
    organization: "UNESCO & Intel",
    description:
      "The AI Literacy for Secondary Schools grant supports the introduction of artificial intelligence concepts into secondary education. Schools receive AI teaching kits, access to online learning platforms, teacher training in AI fundamentals, and opportunities to participate in AI project competitions.",
    category: "AI_EDUCATION",
    amountRange: { min: 8000, max: 40000 },
    eligibility: [
      "Secondary schools with ICT programs",
      "Must have computer lab with internet",
      "Must have teachers with basic programming knowledge",
      "Must commit to integrating AI into curriculum",
    ],
    requirements: [
      "AI curriculum integration plan",
      "Teacher training needs assessment",
      "Hardware and software requirements",
      "Student AI project proposal",
    ],
    websiteUrl: "https://www.unesco.org",
    contactEmail: "ai.education@unesco.org",
  },
  {
    name: "Water, Sanitation & Hygiene (WASH) in Schools",
    organization: "UNICEF",
    description:
      "The WASH in Schools grant provides funding for improving water, sanitation, and hygiene facilities in schools. Grants cover borehole drilling, toilet construction, handwashing stations, and hygiene education programs. The goal is to create healthy school environments that support student attendance and learning.",
    category: "INFRASTRUCTURE",
    amountRange: { min: 10000, max: 100000 },
    eligibility: [
      "Schools lacking adequate WASH facilities",
      "Must have at least 200 students enrolled",
      "Must have community support for maintenance",
      "Must have a WASH committee or willingness to form one",
    ],
    requirements: [
      "WASH facility needs assessment",
      "Community maintenance plan",
      "Hygiene education program proposal",
      "Budget and sustainability plan",
    ],
    websiteUrl: "https://www.unicef.org",
    contactEmail: "wash.schools@unicef.org",
  },
  {
    name: "Agricultural Science & Food Security Program",
    organization: "Food and Agriculture Organization (FAO)",
    description:
      "The Agricultural Science & Food Security Program supports schools in establishing agricultural science programs and school farms. Grants fund agricultural equipment, seeds and inputs, irrigation systems, and training for agricultural science teachers. Schools become demonstration centers for modern agricultural practices.",
    category: "AGRICULTURE",
    amountRange: { min: 8000, max: 35000 },
    eligibility: [
      "Schools with land available for agriculture",
      "Must have access to water for irrigation",
      "Must have or plan to hire agricultural science teacher",
      "Must have community support for farm activities",
    ],
    requirements: [
      "Agricultural program proposal",
      "Land and water resource assessment",
      "Equipment and input requirements",
      "Community engagement and market linkage plan",
    ],
    websiteUrl: "https://www.fao.org",
    contactEmail: "school-farming@fao.org",
  },
  {
    name: "Education Innovation & Research Grant",
    organization: "African Union Commission",
    description:
      "The Education Innovation & Research Grant funds pilot projects that test innovative approaches to teaching and learning. Projects may explore personalized learning, competency-based education, gamification, or alternative assessment methods. Selected schools become research sites and contribute to education policy development.",
    category: "EDUCATION_INNOVATION",
    amountRange: { min: 15000, max: 60000 },
    eligibility: [
      "Schools with research capacity",
      "Must have monitoring and evaluation experience",
      "Must have partnerships with research institutions",
      "Must be willing to share findings and best practices",
    ],
    requirements: [
      "Research proposal with methodology",
      "Innovation implementation plan",
      "Data collection and analysis framework",
      "Knowledge sharing and dissemination plan",
    ],
    websiteUrl: "https://au.int",
    contactEmail: "education.innovation@au.int",
  },
  {
    name: "Community Library & Literacy Initiative",
    organization: "Room to Read",
    description:
      "The Community Library & Literacy Initiative provides grants to establish or upgrade school libraries and promote reading culture. Funding covers book acquisition, library furniture, librarian training, and literacy programs. Schools are expected to open their libraries to the surrounding community.",
    category: "YOUTH_DEVELOPMENT",
    amountRange: { min: 5000, max: 20000 },
    eligibility: [
      "Schools without functional libraries",
      "Must have dedicated library space",
      "Must have a teacher willing to serve as librarian",
      "Must commit to community access hours",
    ],
    requirements: [
      "Library development plan",
      "Book and resource acquisition list",
      "Librarian training plan",
      "Community access and engagement strategy",
    ],
    websiteUrl: "https://www.roomtoread.org",
    contactEmail: "libraries@roomtoread.org",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = randomInt(min, Math.min(max, arr.length));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateDeadline(): string {
  const today = new Date();
  // Deadline between 7 and 120 days from now
  const daysAhead = randomInt(7, 120);
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + daysAhead);
  return deadline.toISOString().split("T")[0];
}

function generateRelevanceScore(): "HIGH" | "MEDIUM" | "LOW" {
  const r = Math.random();
  if (r < 0.35) return "HIGH";
  if (r < 0.7) return "MEDIUM";
  return "LOW";
}

function generateStatus(): Grant["status"] {
  const r = Math.random();
  if (r < 0.6) return "NEW";
  if (r < 0.8) return "REVIEWING";
  if (r < 0.9) return "APPLYING";
  return "SUBMITTED";
}

function generateApplicationReadiness(
  relevanceScore: "HIGH" | "MEDIUM" | "LOW",
) {
  const baseScore =
    relevanceScore === "HIGH" ? 70 : relevanceScore === "MEDIUM" ? 50 : 30;
  const score = Math.min(100, baseScore + randomInt(-10, 15));

  const allMissing = [
    "Complete application form",
    "Financial statements",
    "Board resolution",
    "Project budget",
    "Implementation timeline",
    "Risk assessment",
    "Stakeholder letters",
    "Environmental impact statement",
  ];
  const missingCount =
    relevanceScore === "HIGH" ? randomInt(1, 3) : randomInt(2, 5);
  const missingRequirements = randomSubset(
    allMissing,
    missingCount,
    missingCount,
  );

  const allStrengths = [
    "Strong institutional track record",
    "Qualified project team",
    "Previous grant management experience",
    "Clear alignment with grant objectives",
    "Demonstrated community impact",
    "Innovative approach",
    "Strong partnerships and networks",
    "Sustainable project design",
  ];
  const strengths = randomSubset(allStrengths, 2, 4);

  const allRecommendations = [
    "Gather financial documents early",
    "Develop detailed project budget",
    "Secure stakeholder support letters",
    "Prepare risk mitigation plan",
    "Review eligibility criteria carefully",
    "Contact grant officer for clarification",
    "Review past successful applications",
    "Start application process early",
  ];
  const recommendations = randomSubset(allRecommendations, 2, 3);

  const successRate = Math.min(95, Math.max(10, score + randomInt(-10, 10)));

  return {
    score,
    missingRequirements,
    strengths,
    recommendations,
    estimatedSuccessRate: successRate,
  };
}

// ─── Grant Generator ──────────────────────────────────────────────────────────

let grantCounter = 0;

export function generateGrants(count: number = 7): Grant[] {
  const grants: Grant[] = [];
  const shuffled = [...GRANT_TEMPLATES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const template = shuffled[i];
    grantCounter++;

    const amount = {
      min: template.amountRange.min,
      max: template.amountRange.max,
      currency: "USD" as const,
    };

    const deadline = generateDeadline();
    const relevanceScore = generateRelevanceScore();
    const status = generateStatus();

    grants.push({
      id: `gh-grant-${grantCounter}-${Date.now()}`,
      name: template.name,
      organization: template.organization,
      description: template.description,
      amount,
      deadline,
      category: template.category,
      status,
      relevanceScore,
      eligibility: template.eligibility,
      requirements: template.requirements,
      documents: [],
      websiteUrl: template.websiteUrl,
      contactEmail: template.contactEmail,
      createdAt: new Date(Date.now() - randomInt(1, 30) * 86400000)
        .toISOString()
        .split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      applicationReadiness: generateApplicationReadiness(relevanceScore),
    });
  }

  return grants;
}

// ─── Stats Generator ──────────────────────────────────────────────────────────

export function generateStats(grants: Grant[]) {
  const totalGrants = grants.length;
  const activeApplications = grants.filter(
    (g) => g.status === "APPLYING" || g.status === "SUBMITTED",
  ).length;
  const pendingReview = grants.filter((g) => g.status === "REVIEWING").length;
  const fundedGrants = grants.filter((g) => g.status === "FUNDED").length;
  const totalFunding = grants.reduce((sum, g) => sum + g.amount.max, 0);
  const upcomingDeadlines = grants.filter((g) => {
    const days = (new Date(g.deadline).getTime() - Date.now()) / 86400000;
    return days > 0 && days <= 30;
  }).length;
  const aiMatches = grants.filter((g) => g.relevanceScore === "HIGH").length;

  return {
    totalGrants,
    activeApplications,
    pendingReview,
    fundedGrants,
    totalFunding,
    upcomingDeadlines,
    aiMatches,
    successRate:
      fundedGrants > 0 ? Math.round((fundedGrants / totalGrants) * 100) : 0,
  };
}

// ─── Deadline Alerts Generator ────────────────────────────────────────────────

export function generateDeadlineAlerts(grants: Grant[]) {
  return grants
    .map((grant) => {
      const deadlineDate = new Date(grant.deadline);
      const now = Date.now();
      const daysRemaining = Math.ceil(
        (deadlineDate.getTime() - now) / 86400000,
      );

      if (daysRemaining <= 0) return null;

      let priority: "URGENT" | "HIGH" | "MEDIUM";
      if (daysRemaining <= 14) priority = "URGENT";
      else if (daysRemaining <= 45) priority = "HIGH";
      else priority = "MEDIUM";

      return {
        id: `alert-${grant.id}`,
        grantId: grant.id,
        grantName: grant.name,
        deadline: grant.deadline,
        daysRemaining,
        priority,
        status:
          daysRemaining <= 14 ? ("PENDING" as const) : ("NOTIFIED" as const),
      };
    })
    .filter(Boolean) as {
    id: string;
    grantId: string;
    grantName: string;
    deadline: string;
    daysRemaining: number;
    priority: "URGENT" | "HIGH" | "MEDIUM";
    status: "NOTIFIED" | "PENDING";
  }[];
}

// ─── Notifications Generator ──────────────────────────────────────────────────

export function generateNotifications(grants: Grant[]) {
  const notifications: import("../types").Notification[] = [];
  const now = new Date();

  // Deadline approaching notifications
  grants.forEach((grant, i) => {
    const deadlineDate = new Date(grant.deadline);
    const daysRemaining = Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / 86400000,
    );

    if (daysRemaining <= 14 && daysRemaining > 0) {
      notifications.push({
        id: `notif-deadline-${grant.id}`,
        type: "DEADLINE_ALERT",
        title: `Deadline approaching: ${grant.name}`,
        message: `The "${grant.name}" closes in ${daysRemaining} days. ${grant.status === "REVIEWING" ? "Your application is under review." : "Start preparing your application now."}`,
        data: { grantId: grant.id },
        read: false,
        createdAt: new Date(now.getTime() - i * 3600000).toISOString(),
        priority: daysRemaining <= 7 ? "HIGH" : "MEDIUM",
      });
    }
  });

  // New grant match notifications
  grants.slice(0, 3).forEach((grant, i) => {
    if (grant.relevanceScore === "HIGH") {
      notifications.push({
        id: `notif-match-${grant.id}`,
        type: "GRANT_FOUND",
        title: "New high-match grant found",
        message: `"${grant.name}" by ${grant.organization} matches your school profile with high relevance.`,
        data: { grantId: grant.id },
        read: false,
        createdAt: new Date(now.getTime() - (i + 1) * 7200000).toISOString(),
        priority: "MEDIUM",
      });
    }
  });

  // AI agent completion notification
  notifications.push({
    id: `notif-agent-${Date.now()}`,
    type: "AI_RECOMMENDATION",
    title: "AI Agent scan complete",
    message: `The AI Grant Agent scanned ${GRANT_TEMPLATES.length} grant sources and found ${grants.length} potential matches for your school.`,
    data: null,
    read: true,
    createdAt: new Date(now.getTime() - 86400000).toISOString(),
    priority: "LOW",
  });

  return notifications;
}
