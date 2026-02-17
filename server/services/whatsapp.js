import axios from 'axios';
import { dbAll } from '../db/database.js';
import dotenv from 'dotenv';
dotenv.config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_URL = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

export function isConfigured() {
    return !!(WHATSAPP_TOKEN && PHONE_NUMBER_ID && WHATSAPP_TOKEN !== 'your_whatsapp_cloud_api_token_here');
}

export async function sendTextMessage(to, message) {
    if (!isConfigured()) {
        console.log(`[WhatsApp] Not configured. Would send to ${to}: ${message}`);
        return { success: false, reason: 'not_configured' };
    }

    try {
        const response = await axios.post(API_URL, {
            messaging_product: 'whatsapp',
            to: to.replace(/[^0-9]/g, ''),
            type: 'text',
            text: { body: message }
        }, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`[WhatsApp] Message sent to ${to}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`[WhatsApp] Failed to send to ${to}:`, error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

// Called by scraper when a high-relevance grant is found
export async function sendGrantNotification(name, organization, amountMin, amountMax, deadline) {
    if (!isConfigured()) {
        console.log('[WhatsApp] Skipping notification — not configured');
        return;
    }

    const users = dbAll('SELECT phone, name FROM users WHERE phone IS NOT NULL AND phone != ""');
    const message = `🎓 *GIAA Grant Alert*\n\n📋 *${name}*\nOrg: ${organization}\n💰 $${(amountMin || 0).toLocaleString()} – $${(amountMax || 0).toLocaleString()}\n📅 Deadline: ${deadline || 'TBD'}\n\nLogin to the dashboard for details.`;

    const results = [];
    for (const user of users) {
        if (user.phone) {
            const result = await sendTextMessage(user.phone, message);
            results.push({ name: user.name, ...result });
        }
    }
    return results;
}

export async function notifyDeadlineApproaching(grantName, deadline, daysRemaining) {
    if (!isConfigured()) return;

    const users = dbAll('SELECT phone, name FROM users WHERE phone IS NOT NULL AND phone != ""');
    const urgency = daysRemaining <= 7 ? '🔴 URGENT' : daysRemaining <= 14 ? '🟡 IMPORTANT' : '🟢 REMINDER';
    const message = `${urgency}\n\n📋 *${grantName}*\n⏰ Deadline in *${daysRemaining} days* (${deadline})\n\nTake action on the GIAA dashboard.`;

    for (const user of users) {
        if (user.phone) {
            await sendTextMessage(user.phone, message);
        }
    }
}

export default { isConfigured, sendTextMessage, sendGrantNotification, notifyDeadlineApproaching };
