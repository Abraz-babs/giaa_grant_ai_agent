import { mockUser, mockGrants, mockStats, mockNotifications, mockSchoolProfile, mockAgent } from './mockData';
import type { Proposal } from '../types';

const API_BASE = '/api';

// Enable Mock Mode if on GitHub Pages or if explicitly set
const IS_GH_PAGES = window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app');
const IS_DEMO_ENV = import.meta.env.MODE === 'demo';
const FORCE_MOCK = true; // Temporary overriding to ensure it works for the presentation
const IS_DEMO = IS_GH_PAGES || IS_DEMO_ENV || FORCE_MOCK;

console.log(' [DEBUG] API Initialization:', {
    hostname: window.location.hostname,
    IS_GH_PAGES,
    IS_DEMO_ENV,
    IS_DEMO
});

// Mock Agent State for continuous loop simulation
let demoAgentState = {
    isRunning: false,
    logs: [] as any[],
    lastLogTime: 0
};

function getToken(): string | null {
    return localStorage.getItem('giaa_token');
}

function getHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Request failed');
        return data.data;
    } else {
        // If we get HTML (404/500), throw specific error to trigger fallback
        throw new Error('INVALID_JSON_RESPONSE');
    }
}

// Helper to simulate network delay in demo mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth
export const api = {
    auth: {
        login: async (email: string, password: string) => {
            try {
                if (IS_DEMO) {
                    await delay(800);
                    // Accept any password for demo simplicity, or the specific ones
                    return { token: 'demo-token-123', user: mockUser };
                }
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                return await handleResponse<{ token: string; user: any }>(res);
            } catch (error: any) {
                console.warn('Login failed, attempting fallback...', error);
                // Fallback to mock if network/server fails (e.g. on static deployment)
                if (error.message === 'INVALID_JSON_RESPONSE' || error.message.includes('Unexpected token')) {
                    await delay(500);
                    return { token: 'demo-token-123', user: mockUser };
                }
                throw error;
            }
        },
        verify: async () => {
            if (IS_DEMO) {
                // If token exists in local storage (checked by caller essentially), return user
                return { user: mockUser };
            }
            const res = await fetch(`${API_BASE}/auth/verify`, { headers: getHeaders() });
            return handleResponse<{ user: any }>(res);
        },
        getUsers: async () => {
            if (IS_DEMO) return [mockUser];
            const res = await fetch(`${API_BASE}/auth/users`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
    },

    grants: {
        list: async (params?: { category?: string; status?: string; relevance?: string; search?: string }) => {
            if (IS_DEMO) {
                await delay(500);
                let filtered = [...mockGrants];
                if (params?.status && params.status !== 'ALL') filtered = filtered.filter(g => g.status === params.status);
                if (params?.category && params.category !== 'ALL') filtered = filtered.filter(g => g.category === params.category);
                if (params?.search) {
                    const q = params.search.toLowerCase();
                    filtered = filtered.filter(g => g.name.toLowerCase().includes(q) || g.organization.toLowerCase().includes(q));
                }
                return filtered;
            }
            const query = new URLSearchParams(params as any).toString();
            const res = await fetch(`${API_BASE}/grants?${query}`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        get: async (id: string) => {
            if (IS_DEMO) return mockGrants.find(g => g.id === id);
            const res = await fetch(`${API_BASE}/grants/${id}`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        updateStatus: async (id: string, status: string) => {
            if (IS_DEMO) {
                const grant = mockGrants.find(g => g.id === id);
                if (grant) grant.status = status as any;
                return grant;
            }
            const res = await fetch(`${API_BASE}/grants/${id}/status`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ status }),
            });
            return handleResponse<any>(res);
        },
        getStats: async () => {
            if (IS_DEMO) return mockStats;
            const res = await fetch(`${API_BASE}/grants/stats/dashboard`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        getDeadlineAlerts: async () => {
            if (IS_DEMO) {
                return mockGrants
                    .filter(g => g.deadline)
                    .map(g => ({
                        id: g.id,
                        grantId: g.id,
                        grantName: g.name,
                        deadline: g.deadline,
                        daysRemaining: Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (86400000)),
                        priority: 'HIGH',
                        status: 'PENDING'
                    }))
                    .filter(a => a.daysRemaining > 0 && a.daysRemaining < 90)
                    .slice(0, 5);
            }
            const res = await fetch(`${API_BASE}/grants/alerts/deadlines`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
    },

    proposals: {
        list: async () => {
            if (IS_DEMO) return [];
            const res = await fetch(`${API_BASE}/proposals`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        create: async (grantId: string, title?: string) => {
            if (IS_DEMO) {
                // Template Generator for Real Grants
                const getProposalContent = (id: string, title: string) => {
                    const timestamp = new Date().toISOString().split('T')[0];
                    const grantId = String(id).trim();


                    // 1. Tony Elumelu Foundation (Entrepreneurship)
                    if (grantId === '1') {
                        return [
                            {
                                id: '1',
                                title: 'Full Application: ' + title,
                                content: `PROJECT TITLE: Glisten International Academy Student Entrepreneurship Incubator (SEI)
DATE: ${timestamp}

1. EXECUTIVE SUMMARY
Glisten International Academy (GIA) proposes the establishment of a "Student Entrepreneurship Incubator" (SEI) to empower young minds with the skills, mindset, and resources needed to launch sustainable ventures. Leveraging the Tony Elumelu Foundation's mission to democratize luck and create jobs, this initiative targets 50 high-potential students annually. The SEI will provide a structured curriculum, seed funding simulations, and mentorship from local business leaders. We seek $5,000 to procure training materials, invite expert facilitators, and provide micro-grants for student prototypes. This project aligns with the TEF's goal of fostering African prosperity by nurturing the next generation of business leaders at the secondary school level.

2. STATEMENT OF NEED / PROBLEM STATEMENT
Youth unemployment in Nigeria stands at over 40%, often due to a disconnect between academic training and market realities. Secondary education rarely offers practical exposure to business creation. GIA students are innovative but lack the structured guidance to transform ideas into viable businesses. Without early intervention, these potential job creators may join the labor market as job seekers. There is a critical need for a hands-on, mentorship-driven platform within the school environment to bridge this gap.

3. PROJECT GOALS AND OBJECTIVES
GOAL: To instill an entrepreneurial mindset in GIA students and launch 5 viable student-led ventures within 12 months.

OBJECTIVES:
1. Train 50 students in business ideation, financial literacy, and marketing by Q3 2026.
2. Facilitate mentorship pairings with 10 successful local entrepreneurs.
3. Host a "Shark Tank" style pitch competition where top ideas receive prototype funding.
4. Integrate the TEFConnect digital curriculum into the school's Economics and Business Studies syllabus.

4. PROJECT METHODOLOGY & IMPLEMENTATION PLAN
PHASE 1: MOBILIZATION (Month 1-2)
Recruitment of 50 students via essay application. Orientation for parents and staff. Partnership formation with local hubs (e.g., Abuja Enterprise Agency).

PHASE 2: TRAINING & WORKSHOPS (Month 3-6)
Weekly 2-hour workshops using the TEF Toolkit. Topics include: Market Research, Business Model Canvas, and Digital Marketing. Guest lectures from TEF Alumni to inspire students.

PHASE 3: INCUBATION & MENTORSHIP (Month 7-9)
Students form teams and develop business plans. Mentors assigned to each team for bi-weekly guidance. "Glisten Market Day" where teams test products with real customers (parents/teachers) to validate their business models.

PHASE 4: PITCH COMPETITION & LAUNCH (Month 10)
Final pitch event judged by external experts. Awarding of seed capital (from the grant) to top 3 teams to formally register and launch their businesses.

5. EXPECTED OUTCOMES & IMPACT EVALUATION
OUTCOMES:
50 students certified in Entrepreneurship Basics.
10 functional business prototypes developed (e.g., recycling services, apps, handmade crafts).
5 student ventures generated revenue during Market Day.

EVALUATION METRICS:
Pre- and post-training surveys measuring confidence and knowledge.
Number of business plans completed.
Revenue generated by student businesses.

6. BUDGET NARRATIVE (Total Request: $5,000)
1. Training Materials ($1,000): Workbooks, stationery, and access to paid online business simulations.
2. Facilitator Honorariums ($1,500): Stipends for visiting experts and workshop leads over 6 months.
3. Micro-Grant Pool ($2,000): Seed funding awarded to the top 3 winning student teams ($1,000 / $600 / $400) to launch their ideas.
4. Market Day Logistics ($500): Stalls, marketing materials, and event setup.

7. SUSTAINABILITY PLAN
The SEI is designed to be self-sustaining. Profits from the "Glisten Market Day" (10% levy on student sales) will be reinvested into the Micro-Grant Pool for the next cohort. Furthermore, GIA commits to budget 5% of its annual extracurricular fund to maintain the program. We will also leverage the TEF Alumni network for continued non-monetary support.

8. CONCLUSION
Investing in GIA's Student Entrepreneurship Incubator is an investment in Nigeria's future economic engine. By catching these minds young, we are not just teaching business; we are building a culture of self-reliance and innovation. We eagerly await the opportunity to partner with the Tony Elumelu Foundation.`,
                                wordCount: 950,
                                maxWords: 2000,
                                aiSuggestions: ['Include specific examples of past student projects', 'Mention the specific TEF 7 Pillars']
                            }
                        ];
                    }

                    // 2. African Union (Education Innovation)
                    if (grantId === '2') {
                        return [
                            {
                                id: '1',
                                title: 'Full Application: ' + title,
                                content: `PROJECT TITLE: Scalable Robotics & AI Integration Model for West African Schools
DATE: ${timestamp}

1. EXECUTIVE SUMMARY
Glisten International Academy (GIA), a pioneer in STEM education within Abuja, submits this proposal to the African Union's Innovating Education in Africa (IEA) program. We propose to scale our successful VEX Robotics curriculum into a "Hub-and-Spoke" model that benefits underserved public schools. Our project, "Tech-Share Africa," aims to train 100 teachers and provide access to our robotics labs for 500 external students. We request $50,000 to upgrade our facilities into a Regional Training Center and fund the outreach logistics. This aligns with the CESA 16-25 objective of expanding STEM access.

2. STATEMENT OF NEED
While the demand for digital skills in Africa is exploding, infrastructure in secondary schools lags behind. Most schools in the FCT lack functional computer labs, let alone robotics equipment. There is a "digital divide" where only private school students access future-ready skills. Existing government interventions are often one-off and lack continuity. There is an urgent need for a sustainable, school-to-school mentorship model where well-equipped institutions support their neighbors.

3. PROJECT GOALS
GOAL: To establish GIA as a Regional STEM Hub that democratizes access to robotics education for 10 partner schools.

OBJECTIVES:
1. Upgrade the GIA ICT Complex with 20 advanced AI workstations by Q2 2026.
2. Develop a "Mobile Robotics Lab" curriculum adaptable for low-resource settings.
3. Train 100 public school teachers in basic coding and robotics instruction.
4. Host the first "FCT Interschool Robotics League" to foster community and competition.

4. IMPLEMENTATION STRATEGY
PHASE 1: INFRASTRUCTURE & CURRICULUM (Months 1-3)
Procurement of additional VEX kits and AI-capable PCs. Developing the open-source "Tech-Share" teacher manual.

PHASE 2: TRAIN-THE-TRAINER (Months 4-6)
Hosting 3-day innovative bootcamps for teachers from partner public schools. Focus on scratch programming and assembling simple robots using local materials.

PHASE 3: THE MOBILE LAB (Months 7-12)
GIA students (as peer mentors) travel with staff to partner schools twice a month. Conducting practical sessions using the mobile kits.

PHASE 4: ASSESSMENT & SHOWCASE (Month 12)
A regional exhibition showcasing projects from all 10 schools. Evaluation report submitted to the AU commissions.

5. IMPACT & SCALABILITY
IMPACT:
Direct training of 600 individuals (100 teachers, 500 students).
Creation of a local community of practice for STEM educators.

SCALABILITY:
The "Hub-and-Spoke" model is highly replicable. Once proven, other private schools in Lagos, Accra, and Nairobi can adopt the "Tech-Share" framework. We will publish a blueprint for this model.

6. BUDGET NARRATIVE ($50,000)
1. Hardware Upgrade ($25,000): VEX V5 Competition Super Kits, 15 High-Performance Laptops, 3D Printers.
2. Mobile Lab Logistics ($10,000): Transportation bus rental for 1 year, fuel, and driver.
3. Training Costs ($10,000): Facilitation fees, printing of manuals, feeding for 100 teachers during workshops.
4. Monitoring & Evaluation ($5,000): Data collection tools, independent audit, final reporting.

7. SUSTAINABILITY
Post-grant, the project will be sustained by charging a nominal participation fee for private schools entering the Robotics League, which will subsidize the public school program. Additionally, GIA sees this as part of its CSR and marketing strategy, ensuring long-term institutional commitment.

8. CONCLUSION
The African Union's vision for 2063 relies on a skilled youth populace. By empowering Glisten International Academy to share its resources, you are not just funding a school; you are igniting a movement. We are ready to lead the charge in STEM democratization.`,
                                wordCount: 980,
                                maxWords: 2500,
                                aiSuggestions: ['Highlight the specific AU Agenda 2063 goals', 'Detail the criteria for selecting partner schools']
                            }
                        ];
                    }

                    // 3. STEM to Space
                    if (grantId === '3') {
                        return [
                            {
                                id: '1',
                                title: 'Full Application: ' + title,
                                content: `PROJECT TITLE: "Reach for the Stars" - Astronomy & Physics Excellence Program
DATE: ${timestamp}

1. APPLICANT DETAILS
Name: Glisten International Academy
Department: Physics & Geography Department
Contact: Zakiyah Zuhair (Director)

2. ACADEMIC EXCELLENCE & TRACK RECORD
Glisten International Academy has consistently led the region in science innovation. In 2024, our Physics team placed 2nd in the National Olympiad. Our "Space Club" actively tracks satellite movements using basic telescopic equipment. We have a dedicated cohort of 20 students specifically interested in Aerospace Engineering. This scholarship/grant would provide the crucial push needed to transition from theoretical study to practical observation.

3. PROPOSED PROJECT: THE GLISTEN OBSERVATORY
We propose to use the Opolo Global "STEM to Space" funding to establish a rooftop mini-observatory. This facility will not only serve our students but will be open to the community for events like lunar eclipses.

KEY COMPONENTS:
- Procurement of a Celestron NexStar 8SE Telescope.
- A subscription to remote observatory data feeds.
- Guest lectures from NASRDA (National Space Research and Development Agency) engineers.

4. ESSAY: WHY SPACE MATTERS TO AFRICA
(Draft for Student Submission): "Space technology is often viewed as a luxury for developed nations, but for Africa, it is a necessity. From agricultural monitoring (using satellite NDVI data) to tele-medicine in rural areas, space tech solves earthly problems. At Glisten, we want to be part of the generation that designs Nigeria's next satellite. This grant will help us master the fundamentals of orbital mechanics and astrophysics..."

5. BUDGET BREAKDOWN ($1,000 - $10,000)
Telescope & Mount: $2,500
Solar Filters & Lenses: $500
Educational Software Licenses: $500
Field Trip to NASRDA Center: $1,000
Total: $4,500

6. EXPECTED OUTCOME
Inspiration of 500+ students to pursue STEM careers. A deeper understanding of the universe among our student body.`,
                                wordCount: 500,
                                maxWords: 1000,
                                aiSuggestions: ['Include a letter of recommendation from the Physics HOD', 'Mention specific NASRDA contacts if known']
                            }
                        ];
                    }

                    // 4. Default / Fallback Template (High Quality & Plain Text)
                    return [
                        {
                            id: '1',
                            title: 'Full Application: ' + title,
                            content: `PROJECT TITLE: Comprehensive Digital Transformation in Education
DATE: ${timestamp}
REF: Grant Application (ID: ${grantId || 'N/A'})

1. EXECUTIVE SUMMARY
Glisten International Academy (GIA) seeks funding to implement a comprehensive digital transformation initiative. Our goal is to integrate advanced educational technologies into our core curriculum, ensuring every student is prepared for the 4th Industrial Revolution. This project addresses the critical need for digital literacy and collaborative learning environments in secondary education. We propose a phased implementation of smart classroom technology, teacher training, and curriculum enhancement.

2. INSTITUTIONAL BACKGROUND & CAPACITY
Established in 2006, GIA has a proven track record of academic excellence in Abuja. With over 1,200 students and a distinction rate of 100%, we are uniquely positioned to serve as a model for educational innovation. Our facilities already include a Robotics Lab and ICT Complex, demonstrating our capacity to manage and sustain technology-focused grants. We have successfully managed previous partnerships with local NGOs and educational bodies.

3. PROBLEM STATEMENT
Despite our achievements, resource gaps limit our ability to provide equitable access to advanced tools for all students. Current hardware is aging, and software licenses are limited. This creates a disparity in learning outcomes, particularly in specialized STEM subjects. Without external funding, the pace of our technological adoption cannot match the speed of global innovation. Specifically, our current student-to-computer ratio is 5:1, which impedes personalized learning.

4. PROJECT OBJECTIVES
1. Infrastructure: To upgrade 3 computer labs with 50 high-performance workstations by the end of 2026.
2. Pedagogy: To train 100% of our teaching staff in digital pedagogy and blended learning techniques.
3. Curriculum: To launch a new "Future Skills" module covering coding, data analysis, and digital citizenship.
4. Equity: To ensure 100% of scholarship students have access to take-home digital devices.

5. METHODOLOGY
NEEDS ASSESSMENT:
Conducting a baseline survey of student digital skills to identify specific gaps.
proCUREMENT:
Utilizing competitive bidding to secure cost-effective hardware from certified vendors.
IMPLEMENTATION:
Rolling out the new systems in a staged manner, starting with the Senior Secondary arm (SS1-SS3) before expanding to Junior Secondary.
MONITORING:
Tracking utilization rates and student performance metrics quarterly. A designated project manager will oversee the deployment.

6. BUDGET NARRATIVE
The requested funding will be allocated as follows:

A. HARDWARE & INFRASTRUCTURE (60%)
- Procurement of 50 Desktop Computers (Core i5, 16GB RAM).
- Installation of 5 Interactive Whiteboards.
- Networking gear (Routers, Switches, Cabling).

B. SOFTWARE & LICENSING (20%)
- Cloud subscriptions for learning management systems (e.g., Google Workspace for Education Plus).
- Anti-virus and security software for 2 years.

C. PROFESSIONAL DEVELOPMENT (15%)
- 3-day intensive workshop for 80 staff members.
- Certification fees for "Google Certified Educator" exams.

D. ADMINISTRATIVE COSTS (5%)
- Project management stipends.
- Reporting and auditing fees.

7. EXPECTED IMPACT
SHORT TERM:
Immediate improvement in student engagement and access to resources. Reduction in student-to-computer ratio to 2:1.

MEDIUM TERM:
Measurable increase in standardized test scores for ICT-related subjects. 100% of staff certified in basic digital competencies.

LONG TERM:
Graduation of students who are fully certified in industry-standard digital tools, increasing their employability and university readiness. Establishment of GIA as a regional center for digital excellence.

8. SUSTAINABILITY
GIA maintains a rigorous maintenance schedule for all assets. Recurring costs such as software subscriptions will be absorbed into the school's annual ICT levy, ensuring the project's longevity beyond the grant period. We also have a dedicated IT support team on staff to handle routine maintenance and repairs.

9. EVALUATION PLAN
We will define clear Key Performance Indicators (KPIs) at the start of the project. Data will be collected through:
- Usage logs from the computer labs.
- Termly assessment results.
- Annual stakeholder surveys (parents, students, teachers).
A final report will be submitted to the grantor 12 months post-disbursement.

10. CONCLUSION
This grant represents a pivotal opportunity for Glisten International Academy to leapfrog into the future of education. We are committed to transparency, excellence, and impact. We thank you for considering our proposal.`,
                            wordCount: 1100,
                            maxWords: 2500,
                            aiSuggestions: ['Customize the "Problem Statement" with specific data points', 'Attach the school\'s audited financial statement']
                        }
                    ];
                };

                const newProposal: Proposal = {
                    id: `demo-${Date.now()}`,
                    grantId,
                    title: title || 'Strategic Grant Proposal for Glisten International Academy',
                    status: 'DRAFT',
                    content: getProposalContent(grantId, title || 'Draft Proposal'),
                    aiGenerated: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1
                };
                return newProposal;
            }
            const res = await fetch(`${API_BASE}/proposals`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ grantId, title }),
            });
            return handleResponse<any>(res);
        },
        update: async (id: string, data: any) => {
            if (IS_DEMO) return null;
            const res = await fetch(`${API_BASE}/proposals/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse<any>(res);
        },
    },

    notifications: {
        list: async () => {
            if (IS_DEMO) return mockNotifications;
            const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
            return handleResponse<any[]>(res);
        },
        unreadCount: async () => {
            if (IS_DEMO) return { count: 2 };
            const res = await fetch(`${API_BASE}/notifications/unread-count`, { headers: getHeaders() });
            return handleResponse<{ count: number }>(res);
        },
        markRead: async (id: string) => {
            if (IS_DEMO) return { success: true };
            const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
        markAllRead: async () => {
            if (IS_DEMO) return { success: true };
            const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
    },

    profile: {
        get: async () => {
            if (IS_DEMO) return mockSchoolProfile;
            const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        update: async (data: any) => {
            if (IS_DEMO) return data;
            const res = await fetch(`${API_BASE}/profile`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse<any>(res);
        },
    },

    agent: {
        status: async () => {
            if (IS_DEMO) {
                // Simulate continuous activity if running
                if (demoAgentState.isRunning) {
                    const now = Date.now();
                    // Add a new log entry every 3 seconds to simulate activity
                    if (now - demoAgentState.lastLogTime > 3000) {
                        const actions = [
                            { action: 'SCANNING', detail: 'Scanning African Union Education Portal...' },
                            { action: 'ANALYZING', detail: 'Processing 45 new grant entries...' },
                            { action: 'FILTERING', detail: 'Matching eligibility against School Profile...' },
                            { action: 'CONNECTING', detail: 'Verifying source connectivity...' },
                            { action: 'DISCOVERING', detail: 'Found potential match: STEM Education Fund' }
                        ];
                        const randomEvent = actions[Math.floor(Math.random() * actions.length)];

                        demoAgentState.logs.unshift({
                            startedAt: new Date().toISOString(),
                            action: randomEvent.action,
                            status: 'COMPLETED',
                            grantsFound: Math.floor(Math.random() * 3),
                            grantsMatched: Math.floor(Math.random() * 1),
                            error: null
                        });

                        // Keep log size manageable
                        if (demoAgentState.logs.length > 50) demoAgentState.logs.pop();
                        demoAgentState.lastLogTime = now;
                    }
                }

                return {
                    agent: {
                        ...mockAgent,
                        status: demoAgentState.isRunning ? 'ACTIVE' : 'IDLE',
                        lastRun: new Date().toISOString()
                    },
                    isRunning: demoAgentState.isRunning,
                    logs: demoAgentState.logs
                };
            }
            const res = await fetch(`${API_BASE}/agent/status`, { headers: getHeaders() });
            return handleResponse<any>(res);
        },
        run: async () => {
            if (IS_DEMO) {
                if (!demoAgentState.isRunning) {
                    demoAgentState.isRunning = true;
                    demoAgentState.logs.unshift({
                        startedAt: new Date().toISOString(),
                        action: 'SYSTEM',
                        status: 'STARTED',
                        grantsFound: 0,
                        grantsMatched: 0,
                        error: null
                    });
                }
                return { success: true, message: 'Agent started' };
            }
            const res = await fetch(`${API_BASE}/agent/run`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        },
        stop: async () => {
            if (IS_DEMO) {
                demoAgentState.isRunning = false;
                demoAgentState.logs.unshift({
                    startedAt: new Date().toISOString(),
                    action: 'SYSTEM',
                    status: 'STOPPED',
                    grantsFound: 0,
                    grantsMatched: 0,
                    error: null
                });
                return { success: true };
            }
            const res = await fetch(`${API_BASE}/agent/stop`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse<any>(res);
        }
    },
};

export default api;
