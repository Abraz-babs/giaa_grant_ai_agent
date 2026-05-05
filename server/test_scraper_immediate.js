import { initDb } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import { runScraper } from './services/scraper.js';
import { dbAll } from './db/database.js';

console.log('\n🔍 Testing Scraper and Grant Fetching...\n');

async function test() {
    try {
        // Initialize database
        await initDb();
        console.log('✓ Database initialized');

        // Seed initial data
        seedDatabase();
        console.log('✓ Database seeded');

        // Check grants before scraper
        const grantsBefore = dbAll('SELECT COUNT(*) as count FROM grants');
        console.log(`\n📊 Grants BEFORE scraper: ${grantsBefore[0]?.count || 0}`);

        // Run scraper immediately
        console.log('\n🚀 Running scraper...');
        const result = await runScraper();
        console.log(`✓ Scraper complete: ${result.totalFound} found, ${result.totalMatched} new grants added`);

        // Check grants after scraper
        const grantsAfter = dbAll('SELECT COUNT(*) as count FROM grants');
        console.log(`\n📊 Grants AFTER scraper: ${grantsAfter[0]?.count || 0}`);

        // Show active (non-expired) grants
        const activeGrants = dbAll(`
            SELECT id, name, deadline, relevance_score, status 
            FROM grants 
            WHERE deadline IS NULL OR deadline > date('now')
            ORDER BY deadline ASC
            LIMIT 10
        `);
        
        console.log(`\n✅ Active (non-expired) Grants: ${activeGrants.length}\n`);
        activeGrants.forEach((g, i) => {
            console.log(`${i + 1}. ${g.name}`);
            console.log(`   Deadline: ${g.deadline || 'No deadline'}`);
            console.log(`   Relevance: ${g.relevance_score}`);
            console.log(`   Status: ${g.status}`);
        });

        console.log('\n✓ Test complete. Server is ready to serve live grants!\n');
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

test();
