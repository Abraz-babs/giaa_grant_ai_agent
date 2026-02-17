
import axios from 'axios';
import * as cheerio from 'cheerio';

// Mock DB functions to avoid errors
const dbGet = () => null;
const dbAll = () => [];
const dbRun = () => ({ lastInsertRowid: 1 });

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function scrapeFundsForNGOs() {
    console.log('Testing fundsforNGOs...');
    try {
        const { data } = await axios.get('https://fundsforngos.org/tag/education/', {
            timeout: 15000,
            headers: { 'User-Agent': USER_AGENT }
        });
        const $ = cheerio.load(data);
        const titles = [];
        $('article, .post').slice(0, 5).each((_, el) => {
            const title = $(el).find('h2 a, .entry-title a').text().trim();
            if (title) titles.push(title);
        });
        console.log(`✓ fundsforNGOs found ${titles.length} grants:`, titles);
    } catch (err) {
        console.error('✗ fundsforNGOs failed:', err.message);
    }
}

async function scrapeOpportunityDesk() {
    console.log('\nTesting Opportunity Desk...');
    try {
        const { data } = await axios.get('https://opportunitydesk.org/category/grants/', {
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);
        const titles = [];
        $('article, .post').slice(0, 5).each((_, el) => {
            const title = $(el).find('h2 a, .entry-title a').text().trim();
            if (title) titles.push(title);
        });
        console.log(`✓ Opportunity Desk found ${titles.length} grants:`, titles);
    } catch (err) {
        console.error('✗ Opportunity Desk failed:', err.message);
    }
}

async function scrapeGrantsGov() {
    console.log('\nTesting Grants.gov API...');
    try {
        const { data } = await axios.post('https://grantsapi.com/api/v2/opportunities/search',
            { keyword: 'education STEM', oppStatuses: 'posted', rows: 5 },
            { timeout: 15000, headers: { 'Content-Type': 'application/json' } }
        );
        const count = data?.opportunities?.length || 0;
        console.log(`✓ Grants.gov found ${count} grants`);
        if (count > 0) console.log('Sample:', data.opportunities[0].title);
    } catch (err) {
        console.error('✗ Grants.gov failed:', err.message);
    }
}

async function run() {
    await scrapeFundsForNGOs();
    await scrapeOpportunityDesk();
    await scrapeGrantsGov();
}

run();
