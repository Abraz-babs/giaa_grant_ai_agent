
import { dbAll, initDb } from './db/database.js';

async function checkData() {
    await initDb();
    const grants = dbAll("SELECT id, name, deadline, relevance_score, amount_min, amount_max FROM grants");
    console.log('Total Grants:', grants.length);
    console.log('Sample (first 5):');
    grants.slice(0, 5).forEach(g => console.log(g));

    const high = grants.filter(g => g.relevance_score === 'HIGH').length;
    console.log('High Relevance Count:', high);

    const nullDeadlines = grants.filter(g => !g.deadline).length;
    console.log('Null Deadlines:', nullDeadlines);
}

checkData();
