import { initDb, dbAll } from './db/database.js';

async function checkUsers() {
    await initDb();
    const users = dbAll('SELECT * FROM users');
    console.log('Users found:', users.length);
    users.forEach(u => {
        console.log(`- ${u.name} (${u.email}) Role: ${u.role}, Password length: ${u.password.length}`);
    });
}

checkUsers();
