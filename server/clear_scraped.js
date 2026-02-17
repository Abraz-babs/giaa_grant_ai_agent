
import { dbRun, initDb } from './db/database.js';

async function clearScraped() {
    await initDb();
    dbRun("DELETE FROM grants WHERE source != 'Seeded'");
    console.log('✓ Cleared scraped grants to force re-fetch with amounts.');
}

clearScraped();
