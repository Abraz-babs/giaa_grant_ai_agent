
import { initDb, getDb } from './db/database.js';

async function test() {
    console.log('Testing DB connection...');
    try {
        await initDb();
        const db = getDb();
        const users = db.exec("SELECT * FROM users");
        console.log('Users found:', users.length > 0 ? users[0].values.length : 0);
    } catch (err) {
        console.error('DB Test Failed:', err);
    }
}

test();
