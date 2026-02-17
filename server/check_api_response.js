
import axios from 'axios';

async function checkProfile() {
    try {
        // Login first to get token
        const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'zakiyah@glisteninternationalacademy.com',
            password: 'Zakiyah123!'
        });
        const token = loginRes.data.data.token;
        console.log('Login successful, token obtained:', token ? 'YES' : 'NO');

        // Fetch profile
        const profileRes = await axios.get('http://localhost:3001/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile Data Status:', profileRes.status);
        console.log('Profile Data:', JSON.stringify(profileRes.data, null, 2));

        // Fetch grants
        const grantsRes = await axios.get('http://localhost:3001/api/grants', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Initial Grants Data count:', grantsRes.data?.data?.length || 0);

        // Trigger Scraper
        console.log('Triggering Scraper...');
        const runRes = await axios.post('http://localhost:3001/api/agent/run', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Scraper Trigger Status:', runRes.status, runRes.data);

        // Wait for scraper (poll status for 15s)
        console.log('Waiting for scraper results...');
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Check grants again
        const newGrantsRes = await axios.get('http://localhost:3001/api/grants', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Final Grants Data count:', newGrantsRes.data?.data?.length || 0);

    } catch (err) {
        console.error('API Check FailedFull:', err);
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', JSON.stringify(err.response.data, null, 2));
        } else if (err.request) {
            console.error('No response received (Network Error?)');
        } else {
            console.error('Error Message:', err.message);
        }
    }
}

checkProfile();
