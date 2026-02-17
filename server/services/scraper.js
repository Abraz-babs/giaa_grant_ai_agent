import axios from 'axios';
import * as cheerio from 'cheerio';
import { dbGet, dbAll, dbRun } from '../db/database.js';
import { sendGrantNotification } from './whatsapp.js';

const KEYWORDS = ['education', 'STEM', 'Africa', 'Nigeria', 'school', 'technology', 'AI', 'robotics', 'inclusive', 'grant'];

// Scoring function for relevance
function calculateRelevanceScore(text) {
    const lower = (text || '').toLowerCase();
    let score = 0;
    for (const kw of KEYWORDS) {
        if (lower.includes(kw.toLowerCase())) score += 10;
    }
    if (lower.includes('africa') || lower.includes('nigeria')) score += 15;
    if (lower.includes('education') && lower.includes('technology')) score += 10;

    if (score >= 50) return 'HIGH';
    if (score >= 25) return 'MEDIUM';
    return 'LOW';
}

function detectCategory(text) {
    const lower = (text || '').toLowerCase();
    if (lower.includes('stem') || lower.includes('robot') || lower.includes('ai') || lower.includes('tech')) return 'TECHNOLOGY';
    if (lower.includes('environment') || lower.includes('climate') || lower.includes('sustainability')) return 'ENVIRONMENT';
    if (lower.includes('health') || lower.includes('medical')) return 'HEALTH';
    return 'GENERAL';
}

// Scrape fundsforNGOs
async function scrapeFundsForNGOs() {
    try {
        const { data } = await axios.get('https://fundsforngos.org/tag/education/', {
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0 (GIAA Grant Agent Bot)' }
        });
        const $ = cheerio.load(data);
        const grants = [];

        $('article, .post').slice(0, 10).each((_, el) => {
            const title = $(el).find('h2 a, .entry-title a').text().trim();
            const link = $(el).find('h2 a, .entry-title a').attr('href');
            const excerpt = $(el).find('.entry-summary, .entry-content p').first().text().trim();

            if (title && title.length > 5) {
                grants.push({
                    name: title.substring(0, 200),
                    organization: 'fundsforNGOs Discovery',
                    description: excerpt.substring(0, 500) || title,
                    website_url: link || 'https://fundsforngos.org',
                    source: 'fundsforNGOs'
                });
            }
        });
        return grants;
    } catch (err) {
        console.warn('[Scraper] fundsforNGOs failed:', err.message);
        return [];
    }
}

// Scrape Opportunity Desk
async function scrapeOpportunityDesk() {
    try {
        const { data } = await axios.get('https://opportunitydesk.org/category/grants/', {
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0 (GIAA Grant Agent Bot)' }
        });
        const $ = cheerio.load(data);
        const grants = [];

        $('article, .post').slice(0, 10).each((_, el) => {
            const title = $(el).find('h2 a, .entry-title a').text().trim();
            const link = $(el).find('h2 a, .entry-title a').attr('href');
            const excerpt = $(el).find('.entry-summary p, .entry-content p').first().text().trim();

            if (title && title.length > 5) {
                grants.push({
                    name: title.substring(0, 200),
                    organization: 'Opportunity Desk Discovery',
                    description: excerpt.substring(0, 500) || title,
                    website_url: link || 'https://opportunitydesk.org',
                    source: 'Opportunity Desk'
                });
            }
        });
        return grants;
    } catch (err) {
        console.warn('[Scraper] Opportunity Desk failed:', err.message);
        return [];
    }
}

// Query Grants.gov API
async function scrapeGrantsGov() {
    try {
        const { data } = await axios.post('https://grantsapi.com/api/v2/opportunities/search',
            { keyword: 'education STEM', oppStatuses: 'posted', rows: 10 },
            { timeout: 15000, headers: { 'Content-Type': 'application/json' } }
        );

        if (!data || !data.opportunities) return [];

        return data.opportunities.map(opp => ({
            name: (opp.title || 'Untitled').substring(0, 200),
            organization: opp.agency || 'Grants.gov',
            description: (opp.description || opp.synopsis || '').substring(0, 500),
            deadline: opp.closeDate || null,
            website_url: opp.url || `https://grants.gov/search-results-detail/${opp.oppNumber}`,
            source: 'Grants.gov'
        }));
    } catch (err) {
        console.warn('[Scraper] Grants.gov API failed:', err.message);
        return [];
    }
}

// Main scraper runner
export async function runScraper() {
    const logResult = dbRun(
        'INSERT INTO agent_logs (action, status, details) VALUES (?, ?, ?)',
        ['FULL_SCAN', 'RUNNING', 'Scanning all sources for education grants']
    );
    const logId = logResult.lastInsertRowid;

    let totalFound = 0;
    let totalMatched = 0;

    try {
        console.log('[Scraper] Starting full scan...');

        const results = await Promise.allSettled([
            scrapeFundsForNGOs(),
            scrapeOpportunityDesk(),
            scrapeGrantsGov()
        ]);

        const allGrants = results
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value);

        totalFound = allGrants.length;
        console.log(`[Scraper] Found ${totalFound} raw opportunities`);

        for (const g of allGrants) {
            const combined = `${g.name} ${g.description}`;
            const relevance = calculateRelevanceScore(combined);
            const category = detectCategory(combined);

            // Check for duplicate
            const existing = dbGet('SELECT id FROM grants WHERE name = ? AND source = ?', [g.name, g.source]);
            if (existing) continue;

            dbRun(`INSERT INTO grants (name, organization, description, category, relevance_score, 
             website_url, source, deadline, status, estimated_success_rate, readiness_score)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?)`,
                [g.name, g.organization, g.description, category, relevance,
                g.website_url, g.source, g.deadline || null,
                relevance === 'HIGH' ? 25 : 10,
                relevance === 'HIGH' ? 60 : 30]);

            totalMatched++;

            // WhatsApp notification for high-relevance grants
            if (relevance === 'HIGH') {
                try {
                    await sendGrantNotification(g.name, g.organization || 'Unknown', 0, 0, g.deadline || 'TBD');
                } catch { /* continue */ }
            }
        }

        dbRun(
            'UPDATE agent_logs SET status = ?, grants_found = ?, grants_matched = ?, completed_at = datetime("now") WHERE id = ?',
            ['COMPLETED', totalFound, totalMatched, logId]
        );

        console.log(`[Scraper] Complete: ${totalFound} found, ${totalMatched} new matches stored`);
        return { totalFound, totalMatched };
    } catch (err) {
        dbRun(
            'UPDATE agent_logs SET status = ?, error = ?, completed_at = datetime("now") WHERE id = ?',
            ['FAILED', err.message, logId]
        );
        throw err;
    }
}

export default { runScraper };
