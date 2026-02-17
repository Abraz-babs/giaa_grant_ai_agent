import { dbGet, dbRun, initDb } from './db/database.js';
import bcrypt from 'bcryptjs';

console.log('Initializing Database...');
await initDb();
console.log('Fixing Data...');

// 1. Fix School Profile
const correctProfile = {
    id: '1',
    name: 'Glisten International Academy',
    type: 'PRIVATE',
    location: {
        country: 'Nigeria',
        state: 'FCT',
        city: 'Abuja',
        address: 'Plot 1457, Cadastral Zone B8, Jahi District'
    },
    establishedYear: 2015,
    studentCount: {
        total: 850,
        male: 450,
        female: 400,
        specialNeeds: 25
    },
    staffCount: {
        teaching: 65,
        nonTeaching: 20
    },
    facilities: [
        'Robotics Lab',
        'AI Research Center',
        'Modern Library',
        'Science Laboratories',
        'Sports Complex',
        'Digital Arts Studio'
    ],
    programs: [
        'Cambridge International',
        'Nigerian Curriculum',
        'STEM Initiative',
        'Coding & AI'
    ],
    achievements: [
        '2024 National STEM Innovation Award',
        'Top 10 International Schools in West Africa',
        'UNESCO Global Education Partnership',
        '96% university placement rate'
    ],
    focusAreas: [
        'Technology & AI',
        'Character Development',
        'Global Citizenship',
        'Academic Excellence'
    ],
    registrationDetails: {
        registrationNumber: 'GIA-2015-001',
        accreditationStatus: 'Fully Accredited',
        ngoStatus: false
    },
    contactInfo: {
        email: 'info@glisteninternationalacademy.com',
        phone: '+234 903 888 2824',
        website: 'https://glisteninternationalacademy.com'
    },
    documents: [
        { id: '1', name: 'School Prospectus 2024', type: 'PDF', url: '#', uploadedAt: '2024-01-15', expiresAt: '2025-01-15' },
        { id: '2', name: 'Accreditation Certificate', type: 'PDF', url: '#', uploadedAt: '2024-02-20' }
    ],
    impactStories: [
        {
            id: '1',
            title: 'Community Tech Drive',
            description: 'Students taught basic computer skills to 200 local community members.',
            beneficiaries: 200,
            outcome: 'Increased digital literacy',
            date: '2023-11-15'
        }
    ],
    strategicGoals: [
        'Integrate AI into all grade levels by 2026',
        'Achieve 100% university acceptance rate',
        'Expand scholarship program for underprivileged students'
    ]
};

try {
    dbRun('DELETE FROM school_profile');
    dbRun('INSERT INTO school_profile (id, data, updated_at) VALUES (?, ?, datetime("now"))', ['1', JSON.stringify(correctProfile)]);
    console.log('✓ Corrected School Profile structure.');
} catch (e) {
    console.error('Error updating profile:', e);
}

// 2. Fix Users
const users = [
    { name: 'Zakiyah Zuhair', email: 'zakiyah@glisteninternationalacademy.com', pass: 'Zakiyah123!', role: 'ADMIN' },
    { name: 'Zarah Zuhair', email: 'zarah@glisteninternationalacademy.com', pass: 'Zarah123!', role: 'ADMIN' },
    { name: 'Mr. Alabi', email: 'alabi@glisteninternationalacademy.com', pass: 'Alabi123!', role: 'MANAGER' },
    { name: 'Amina Bello', email: 'amina.bello@glisteninternationalacademy.com', pass: 'Amina123!', role: 'VIEWER' },
    { name: 'Yusuf Ibrahim', email: 'yusuf.ibrahim@glisteninternationalacademy.com', pass: 'Yusuf123!', role: 'VIEWER' }
];

try {
    dbRun('DELETE FROM users'); // Clear old users
    for (const u of users) {
        const hash = bcrypt.hashSync(u.pass, 10);
        dbRun('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [u.name, u.email, hash, u.role]);
    }
    console.log('✓ Updated Users with new credentials.');
} catch (e) {
    console.error('Error updating users:', e);
}

// 3. Update Grants (Optional, but ensure they are valid)
// dbRun('UPDATE grants SET status = "NEW" WHERE status IS NULL');
