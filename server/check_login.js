import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/login';

const credentials = {
    email: 'zakiyah@glisteninternationalacademy.com',
    password: 'Zakiyah123!'
};

console.log(`Attempting login for ${credentials.email}...`);

try {
    const response = await axios.post(API_URL, credentials);
    console.log('Login Successful!');
    console.log('Token:', response.data.token ? 'Present' : 'Missing');
    console.log('User:', response.data.user);
} catch (error) {
    if (error.response) {
        console.error('Login Failed:', error.response.status, error.response.data);
    } else {
        console.error('Login Error:', error.message, error.code);
        if (error.cause) console.error('Cause:', error.cause);
    }
}
