import { initDb } from './db/database.js';
import { runScraper } from './services/scraper.js';

async function test() {
    await initDb();
    console.log('Starting scraper test...');
    try {
        const result = await runScraper();
        console.log('Result:', result);
    } catch (err) {
        console.error('Failed:', err);
    }
}

test();
