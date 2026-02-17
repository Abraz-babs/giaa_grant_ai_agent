import { dbGet, initDb } from './db/database.js';
import bcrypt from 'bcryptjs';

console.log('Initializing Database...');
await initDb();

const email = 'zakiyah@glisteninternationalacademy.com';
const password = 'Zakiyah123!';

console.log(`Checking user: ${email}`);
const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);

if (!user) {
    console.log('User NOT FOUND in database.');
} else {
    console.log('User FOUND.');
    console.log('Stored Hash:', user.password);

    const match = bcrypt.compareSync(password, user.password);
    console.log(`Password match for '${password}': ${match}`);

    // Debug: Hash it again and compare
    const newHash = bcrypt.hashSync(password, 10);
    console.log('New Hash sample:', newHash);
    console.log(`New Hash match: ${bcrypt.compareSync(password, newHash)}`);
}
