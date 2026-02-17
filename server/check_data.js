import { dbAll, initDb } from './db/database.js';

console.log('Initializing Database...');
await initDb();

const grants = dbAll('SELECT count(*) as count FROM grants');
console.log('Grants count:', grants[0].count);

const profile = dbAll('SELECT * FROM school_profile');
console.log('Profile count:', profile.length);
if (profile.length > 0) {
    console.log('Profile Data Sample:', profile[0].data.substring(0, 100));
}
