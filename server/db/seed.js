import bcrypt from 'bcryptjs';
import { dbGet, dbAll, dbRun } from './database.js';

export function seedDatabase() {
    // --- Users ---
    const existingUsers = dbAll('SELECT id FROM users');
    if (existingUsers.length === 0) {
        const users = [
            { name: 'Zakiyah Zuhair', email: 'zakiyah@glisteninternationalacademy.com', pass: 'Zakiyah123!', role: 'ADMIN', phone: '+2348012345001' },
            { name: 'Zarah Zuhair', email: 'zarah@glisteninternationalacademy.com', pass: 'Zarah123!', role: 'ADMIN', phone: '+2348012345002' },
            { name: 'Mr. Alabi', email: 'alabi@glisteninternationalacademy.com', pass: 'Alabi123!', role: 'MANAGER', phone: '+2348012345003' },
            { name: 'Amina Bello', email: 'amina.bello@glisteninternationalacademy.com', pass: 'Amina123!', role: 'VIEWER', phone: '+2348012345004' },
            { name: 'Yusuf Ibrahim', email: 'yusuf.ibrahim@glisteninternationalacademy.com', pass: 'Yusuf123!', role: 'VIEWER', phone: '+2348012345005' }
        ];
        for (const u of users) {
            const hash = bcrypt.hashSync(u.pass, 10);
            dbRun('INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
                [u.name, u.email, hash, u.role, u.phone]);
        }
        console.log('✓ Seeded 5 users');
    }

    // --- School Profile ---
    const existingProfile = dbGet('SELECT id FROM school_profile LIMIT 1');
    if (!existingProfile) {
        const profile = {
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
            studentCount: {
                total: 1250,
                male: 600,
                female: 650,
                specialNeeds: 45
            },
            staffCount: {
                teaching: 120,
                nonTeaching: 50
            },
            facilities: [
                'Robotics & AI Lab',
                'Science Laboratories (Physics, Chemistry, Biology)',
                'ICT Complex',
                'Library & Research Center',
                'Sports Complex',
                'Auditorium',
                'Boarding Facilities'
            ],
            programs: [
                'Earley Years Foundation Stage',
                'Primary Education (Nigerian/British)',
                'Junior Secondary (BECE/Cambridge Checkpoint)',
                'Senior Secondary (WAEC/NECO/IGCSE)',
                'Robotics & Coding Club'
            ],
            achievements: [
                'Best Private Primary School in FCT (Inaugural Year)',
                'Outstanding NGO of the Year (Alumni Award)',
                'VEX Robotics World Championship Participants',
                'Accredited by Dept of Quality Assurance'
            ],
            focusAreas: [
                'Academic Excellence',
                'Technological Innovation',
                'Moral & Character Development',
                'Global Citizenship'
            ],
            registrationDetails: {
                registrationNumber: 'GIA-2006-REG',
                accreditationStatus: 'Fully Accredited',
                ngoStatus: false
            },
            contactInfo: {
                email: 'info@glisteninternationalacademy.com',
                phone: '+234 803 123 4567',
                website: 'https://glisteninternationalacademy.com'
            },
            documents: [],
            impactStories: [],
            strategicGoals: [
                'Expand AI & Robotics integration across all levels',
                'Maintain 100% distinction rate in external exams',
                'Foster global partnerships for student exchange'
            ]
        };
        dbRun('INSERT INTO school_profile (data) VALUES (?)', [JSON.stringify(profile)]);
        console.log('✓ Seeded school profile');
    }

    // --- Sample Grants ---
    const existingGrants = dbAll('SELECT id FROM grants');
    if (existingGrants.length === 0) {
        const grants = [
            {
                name: 'Africa STEM Education Innovation Grant',
                organization: 'World Bank Education Fund',
                amount_min: 50000, amount_max: 250000, currency: 'USD',
                deadline: '2026-06-15',
                description: 'Supporting innovative STEM education models in Sub-Saharan Africa with focus on technology integration, teacher training, and scalable curriculum development.',
                eligibility: JSON.stringify(['Registered educational institution in Africa', 'Minimum 3 years operational', 'Demonstrated STEM programs']),
                category: 'TECHNOLOGY',
                relevance_score: 'HIGH', status: 'NEW',
                requirements: JSON.stringify([{ id: '1', name: 'Project Proposal', type: 'document', status: 'PENDING', description: 'Detailed project plan' }, { id: '2', name: 'Financial Report', type: 'document', status: 'PENDING' }]),
                readiness_score: 78, estimated_success_rate: 35, source: 'Seeded'
            },
            {
                name: 'Google AI for Education Grant',
                organization: 'Google.org',
                amount_min: 100000, amount_max: 500000, currency: 'USD',
                deadline: '2026-07-31',
                description: 'Empowering schools to integrate AI and machine learning into curricula across developing nations, with emphasis on ethical AI education and practical applications.',
                eligibility: JSON.stringify(['Existing AI/tech curriculum', 'Measurable student outcomes', 'Open to schools worldwide']),
                category: 'TECHNOLOGY',
                relevance_score: 'HIGH', status: 'NEW',
                requirements: JSON.stringify([]),
                readiness_score: 85, estimated_success_rate: 25, source: 'Seeded'
            },
            {
                name: 'UNICEF Inclusive Education Fund',
                organization: 'UNICEF',
                amount_min: 25000, amount_max: 100000, currency: 'USD',
                deadline: '2026-05-20',
                description: 'Supporting schools in developing inclusive education models that serve children with disabilities and diverse learning needs.',
                eligibility: JSON.stringify(['K-12 educational institutions', 'Active inclusion programs', 'Located in eligible UNICEF countries']),
                category: 'GENERAL',
                relevance_score: 'HIGH', status: 'REVIEWING',
                requirements: JSON.stringify([]),
                readiness_score: 65, estimated_success_rate: 40, source: 'Seeded'
            },
            {
                name: 'UK FCDO Education Technology Grant',
                organization: 'UK Foreign, Commonwealth & Development Office',
                amount_min: 75000, amount_max: 300000, currency: 'GBP',
                deadline: '2026-08-15',
                description: 'Funding innovative use of technology in education across Commonwealth nations, focused on bridging the digital divide.',
                eligibility: JSON.stringify(['Commonwealth nation institution', 'Track record in ed-tech', 'Partnership with local government']),
                category: 'TECHNOLOGY',
                relevance_score: 'MEDIUM', status: 'NEW',
                requirements: JSON.stringify([]),
                readiness_score: 55, estimated_success_rate: 20, source: 'Seeded'
            },
            {
                name: 'Mastercard Foundation Scholars Program',
                organization: 'Mastercard Foundation',
                amount_min: 200000, amount_max: 1000000, currency: 'USD',
                deadline: '2026-09-30',
                description: 'Enabling young people in Africa to access quality education and develop leadership skills for transforming their communities.',
                eligibility: JSON.stringify(['African institution', 'Scholarship program capacity', 'Community impact focus']),
                category: 'GENERAL',
                relevance_score: 'MEDIUM', status: 'SUBMITTED',
                requirements: JSON.stringify([]),
                readiness_score: 50, estimated_success_rate: 15, source: 'Seeded'
            },
            {
                name: 'USAID Robotics & Innovation in Learning',
                organization: 'USAID',
                amount_min: 50000, amount_max: 200000, currency: 'USD',
                deadline: '2026-04-30',
                description: 'Promoting hands-on robotics and innovation labs within schools across Africa, emphasizing practical skills for future workforce readiness.',
                eligibility: JSON.stringify(['Schools with existing STEM infrastructure', 'Robotics programs or plans', 'Measurable outcomes']),
                category: 'TECHNOLOGY',
                relevance_score: 'HIGH', status: 'APPLYING',
                requirements: JSON.stringify([]),
                readiness_score: 72, estimated_success_rate: 30, source: 'Seeded'
            }
        ];

        for (const g of grants) {
            dbRun(`INSERT INTO grants (name, organization, amount_min, amount_max, currency, deadline, 
             description, eligibility, category, relevance_score, status, requirements, 
             readiness_score, estimated_success_rate, source)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [g.name, g.organization, g.amount_min, g.amount_max, g.currency, g.deadline,
                g.description, g.eligibility, g.category, g.relevance_score, g.status, g.requirements,
                g.readiness_score, g.estimated_success_rate, g.source]);
        }
        console.log('✓ Seeded 6 grants');
    }

    // --- Sample Notifications ---
    const existingNotifications = dbAll('SELECT id FROM notifications');
    if (existingNotifications.length === 0) {
        const notifications = [
            { type: 'GRANT_FOUND', title: 'New High-Match Grant', message: 'AI found "Africa STEM Education Innovation Grant" — 78% match', priority: 'HIGH' },
            { type: 'DEADLINE', title: 'Deadline Approaching', message: 'USAID Robotics grant deadline in 72 days', priority: 'URGENT' },
            { type: 'SYSTEM', title: 'Agent Complete', message: 'AI Agent scan completed. 6 grants found, 4 high-relevance matches.', priority: 'LOW' },
            { type: 'GRANT_FOUND', title: 'Google AI Grant Available', message: 'New $100K-$500K grant from Google.org for AI education — 85% match', priority: 'HIGH' },
            { type: 'DEADLINE', title: 'UNICEF Fund Closing Soon', message: 'UNICEF Inclusive Education Fund deadline in 92 days', priority: 'MEDIUM' }
        ];
        for (const n of notifications) {
            dbRun('INSERT INTO notifications (type, title, message, priority) VALUES (?, ?, ?, ?)',
                [n.type, n.title, n.message, n.priority]);
        }
        console.log('✓ Seeded 5 notifications');
    }
}
