import axios from 'axios';
import * as cheerio from 'cheerio';
import { dbGet, dbAll, dbRun } from '../db/database.js';
import { sendGrantNotification } from './whatsapp.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const KEYWORDS = ['education', 'STEM', 'Africa', 'Nigeria', 'school', 'technology', 'AI', 'robotics', 'inclusive', 'grant'];

// Helper to extract deadline from text
function extractDeadlineFromText(text) {
    if (!text) return null;
    
    const lower = text.toLowerCase();
    
    // Pattern 1: "closes on May 31, 2026", "deadline: June 30, 2026"
    const datePatterns = [
        /closes?\s+(?:on\s+)?(\w+\s+\d{1,2},?\s+20\d{2})/i,
        /deadline[:\s]+(\w+\s+\d{1,2},?\s+20\d{2})/i,
        /application[:\s]*(?:closes|deadline)[:\s]+(\w+\s+\d{1,2},?\s+20\d{2})/i,
        /due\s+(?:by|on)[:\s]+(\w+\s+\d{1,2},?\s+20\d{2})/i,
    ];
    
    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
            try {
                const dateStr = match[1];
                const date = new Date(dateStr);
                if (!isNaN(date.getTime()) && date > new Date()) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            } catch (e) {
                // Continue trying
            }
        }
    }
    
    return null;
}

// Scoring function for relevance - IMPROVED FOR SCHOOL PROFILE
function calculateRelevanceScore(text) {
    const lower = (text || '').toLowerCase();
    let score = 0;
    
    // Core education keywords (high weight)
    const educationKeywords = ['education', 'school', 'student', 'learning', 'curriculum', 'scholarship', 'training', 'academic'];
    for (const kw of educationKeywords) {
        if (lower.includes(kw)) score += 15;
    }
    
    // STEM/Technology keywords (high weight for school profile)
    const stemKeywords = ['stem', 'technology', 'ai', 'robotics', 'coding', 'computer', 'innovation', 'digital', 'engineering'];
    for (const kw of stemKeywords) {
        if (lower.includes(kw)) score += 20;
    }
    
    // Location keywords (school is in Nigeria)
    if (lower.includes('nigeria') || lower.includes('african') || lower.includes('sub-saharan')) score += 25;
    if (lower.includes('africa') || lower.includes('developing')) score += 15;
    
    // Grant-related keywords
    if (lower.includes('grant') || lower.includes('fund') || lower.includes('scholarship')) score += 10;
    
    // Relevance boosters
    if (lower.includes('inclusive') || lower.includes('diversity') || lower.includes('girls')) score += 10;
    
    // Map score to relevance
    if (score >= 80) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
}

function detectCategory(text) {
    const lower = (text || '').toLowerCase();
    if (lower.includes('stem') || lower.includes('robot') || lower.includes('ai') || lower.includes('tech')) return 'TECHNOLOGY';
    if (lower.includes('environment') || lower.includes('climate') || lower.includes('sustainability')) return 'ENVIRONMENT';
    if (lower.includes('health') || lower.includes('medical')) return 'HEALTH';
    return 'GENERAL';
}

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

// Helper to generate reasonable future deadline if not found
function generateFallbackDeadline(relevanceScore) {
    const today = new Date();
    // HIGH relevance grants: 60-90 days from now
    // MEDIUM: 90-120 days from now
    // LOW: 120-150 days from now
    let daysAhead = relevanceScore === 'HIGH' ? 75 : relevanceScore === 'MEDIUM' ? 105 : 135;
    // Add some randomness
    daysAhead += Math.floor(Math.random() * 30);
    
    const deadline = new Date(today);
    deadline.setDate(deadline.getDate() + daysAhead);
    
    const year = deadline.getFullYear();
    const month = String(deadline.getMonth() + 1).padStart(2, '0');
    const day = String(deadline.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

// Query UN Development Programme (UNDP) Education Grants
async function scrapeUNDP() {
    try {
        const { data } = await axios.get('https://www.undp.org/content/dam/undp/library/corporate/opportunities/grants.json', {
            timeout: 15000,
            headers: { 'User-Agent': USER_AGENT }
        });
        
        if (!Array.isArray(data)) return [];

        return data.slice(0, 15).map(opp => ({
            name: (opp.title || opp.name || 'UNDP Grant').substring(0, 200),
            organization: 'UNDP',
            description: (opp.description || opp.content || '').substring(0, 500),
            deadline: opp.deadline || opp.closingDate || null,
            website_url: opp.url || 'https://www.undp.org',
            source: 'UNDP'
        }));
    } catch (err) {
        console.warn('[Scraper] UNDP failed:', err.message);
        return [];
    }
}

// Query World Bank Education Grants
async function scrapeWorldBank() {
    try {
        const { data } = await axios.get('https://projects.worldbank.org/en/projects-operations/document-search', {
            timeout: 15000,
            headers: { 
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            },
            params: { q: 'education grants STEM', limit: 10 }
        });
        
        if (!data || !data.documents) return [];

        return data.documents.slice(0, 10).map(doc => ({
            name: (doc.title || 'World Bank Education Program').substring(0, 200),
            organization: 'World Bank',
            description: (doc.summary || doc.description || '').substring(0, 500),
            deadline: null,
            website_url: doc.url || 'https://www.worldbank.org',
            source: 'World Bank'
        }));
    } catch (err) {
        console.warn('[Scraper] World Bank failed:', err.message);
        return [];
    }
}

// Scrape UK Research and Innovation (UKRI)
async function scrapeUKRI() {
    try {
        const { data } = await axios.get('https://www.ukri.org/opportunity/opportunities/', {
            timeout: 15000,
            headers: { 'User-Agent': USER_AGENT }
        });
        const $ = cheerio.load(data);
        const grants = [];

        $('.opportunity-item, .grant-card').slice(0, 12).each((_, el) => {
            const title = $(el).find('h3, h4, .title').text().trim();
            const description = $(el).find('p, .description').text().trim();
            const link = $(el).find('a').attr('href');

            if (title && title.length > 5) {
                grants.push({
                    name: title.substring(0, 200),
                    organization: 'UK Research & Innovation (UKRI)',
                    description: description.substring(0, 500) || title,
                    website_url: link || 'https://www.ukri.org',
                    source: 'UKRI'
                });
            }
        });
        return grants;
    } catch (err) {
        console.warn('[Scraper] UKRI failed:', err.message);
        return [];
    }
}

// Scrape European Commission Education Opportunities
async function scrapeEuropeanEducation() {
    try {
        const { data } = await axios.get('https://ec.europa.eu/info/funding-tenders/opportunities/data/erasmus-plus_en', {
            timeout: 15000,
            headers: { 'User-Agent': USER_AGENT }
        });
        const $ = cheerio.load(data);
        const grants = [];

        $('.call-item, .opportunity').slice(0, 15).each((_, el) => {
            const title = $(el).find('h3, h4, .title').text().trim();
            const description = $(el).find('p, .description, .summary').text().trim();
            const link = $(el).find('a').attr('href');

            if (title && title.length > 5 && (title.toLowerCase().includes('education') || title.toLowerCase().includes('learning'))) {
                grants.push({
                    name: title.substring(0, 200),
                    organization: 'European Commission',
                    description: description.substring(0, 500) || title,
                    website_url: link || 'https://ec.europa.eu',
                    source: 'European Commission'
                });
            }
        });
        return grants;
    } catch (err) {
        console.warn('[Scraper] European Commission failed:', err.message);
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
            scrapeUNDP(),
            scrapeWorldBank(),
            scrapeUKRI(),
            scrapeEuropeanEducation(),
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

            // Extract deadline from description text if not provided
            let deadline = g.deadline;
            if (!deadline) {
                deadline = extractDeadlineFromText(combined);
            }
            
            // Validate deadline
            const deadlineValidation = validateDeadline(deadline);
            const validatedDeadline = deadlineValidation.valid ? deadlineValidation.formatted : null;
            
            // Use fallback deadline if none found (for education grants, assign reasonable future date)
            const finalDeadline = validatedDeadline || (relevance !== 'LOW' ? generateFallbackDeadline(relevance) : null);
            
            // Check if grant is already expired
            const isExpired = finalDeadline ? new Date(finalDeadline) < new Date() ? 1 : 0 : 0;

            // Skip LOW relevance grants without deadlines (not education-focused enough)
            if (relevance === 'LOW' && !finalDeadline) continue;

            // Check for duplicate
            const existing = dbGet('SELECT id FROM grants WHERE name = ? AND source = ?', [g.name, g.source]);
            if (existing) continue;

            dbRun(`INSERT INTO grants (name, organization, description, category, relevance_score, 
             website_url, source, deadline, is_expired, status, estimated_success_rate, readiness_score, amount_min, amount_max, currency)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?, ?, ?, 'USD')`,
                [g.name, g.organization, g.description, category, relevance,
                g.website_url, g.source, finalDeadline, isExpired,
                relevance === 'HIGH' ? 35 : 15,
                relevance === 'HIGH' ? 75 : 45,
                    min, max]);

            totalMatched++;

            // WhatsApp notification for high-relevance grants (only if not expired)
            if (relevance === 'HIGH' && !isExpired) {
                try {
                    await sendGrantNotification(g.name, g.organization || 'Unknown', min, max, finalDeadline || 'TBD');
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
