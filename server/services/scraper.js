import axios from 'axios';
import * as cheerio from 'cheerio';
import { dbGet, dbAll, dbRun } from '../db/database.js';
import { sendGrantNotification } from './whatsapp.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const KEYWORDS = ['education', 'STEM', 'Africa', 'Nigeria', 'school', 'technology', 'AI', 'robotics', 'inclusive', 'grant'];

// Helper to validate and format deadline
function validateDeadline(deadline) {
    if (!deadline) return { valid: false, formatted: null };
    
    // Try to parse as ISO date (YYYY-MM-DD)
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoRegex.test(deadline)) {
        // Verify it's a valid date
        const date = new Date(deadline + 'T00:00:00Z');
        if (!isNaN(date.getTime())) {
            return { valid: true, formatted: deadline };
        }
    }
    
    // Try common formats and convert to ISO
    try {
        const date = new Date(deadline);
        if (!isNaN(date.getTime())) {
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            return { valid: true, formatted: `${year}-${month}-${day}` };
        }
    } catch (e) {
        // Continue to reject
    }
    
    return { valid: false, formatted: null };
}

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
            headers: { 'User-Agent': USER_AGENT }
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
            headers: { 'User-Agent': USER_AGENT }
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
            {
                timeout: 15000,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': USER_AGENT
                }
            }
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
        // Log but don't fail the whole process
        console.warn(`[Scraper] Grants.gov API failed: ${err.message}`);
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

        // Helper to extract amount
        function extractAmount(text) {
            const combined = (text || '').toLowerCase();
            // Match $10,000, 5000 USD, etc.
            // Regex for grabbing the first significant number associated with currency
            const match = combined.match(/(\$|€|£|₦)\s?(\d{1,3}(?:,\d{3})*(?:\.\d+)?)|(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s?(usd|eur|gbp|ngn)/i);

            if (match) {
                // Parse the number
                const numStr = (match[2] || match[3]).replace(/,/g, '');
                const amount = parseFloat(numStr);
                if (!isNaN(amount)) {
                    return { min: amount, max: amount * 2 }; // Estimate max as 2x min if range not found
                }
            }
            return { min: 0, max: 0 };
        }

        for (const g of allGrants) {
            const combined = `${g.name} ${g.description}`;
            const relevance = calculateRelevanceScore(combined);
            const category = detectCategory(combined);
            const { min, max } = extractAmount(combined);

            // Validate deadline
            const deadlineValidation = validateDeadline(g.deadline);
            const deadline = deadlineValidation.valid ? deadlineValidation.formatted : null;
            
            // Check if grant is already expired
            const isExpired = deadline ? new Date(deadline) < new Date() ? 1 : 0 : 0;

            // Check for duplicate
            const existing = dbGet('SELECT id FROM grants WHERE name = ? AND source = ?', [g.name, g.source]);
            if (existing) continue;

            dbRun(`INSERT INTO grants (name, organization, description, category, relevance_score, 
             website_url, source, deadline, is_expired, status, estimated_success_rate, readiness_score, amount_min, amount_max, currency)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?, ?, ?, 'USD')`,
                [g.name, g.organization, g.description, category, relevance,
                g.website_url, g.source, deadline, isExpired,
                relevance === 'HIGH' ? 25 : 10,
                relevance === 'HIGH' ? 60 : 30,
                    min, max]);

            totalMatched++;

            // WhatsApp notification for high-relevance grants (only if not expired)
            if (relevance === 'HIGH' && !isExpired) {
                try {
                    await sendGrantNotification(g.name, g.organization || 'Unknown', 0, 0, deadline || 'TBD');
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
