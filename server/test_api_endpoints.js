import axios from 'axios';

const API_Base = 'http://localhost:3001/api';
const credentials = {
    email: 'zakiyah@glisteninternationalacademy.com',
    password: 'Zakiyah123!'
};

async function test() {
    try {
        // Login
        console.log('Logging in...');
        const auth = await axios.post(`${API_Base}/auth/login`, credentials);
        const token = auth.data.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('Login successful.');

        // Get Profile
        console.log('Fetching Profile...');
        const profile = await axios.get(`${API_Base}/profile`, { headers });
        console.log('Profile Data Keys:', Object.keys(profile.data.data));
        console.log('Profile Contact:', profile.data.data.contactInfo);

        // Get Grants
        console.log('Fetching Grants...');
        const grants = await axios.get(`${API_Base}/grants`, { headers });
        console.log('Grants Count:', grants.data.data.length);
        if (grants.data.data.length > 0) {
            console.log('Grant[0] Example:', grants.data.data[0].title || grants.data.data[0].name);
        }

    } catch (e) {
        if (e.response) {
            console.error('API Error:', e.response.status, e.response.data);
        } else {
            console.error('Error:', e.message);
        }
    }
}

test();
