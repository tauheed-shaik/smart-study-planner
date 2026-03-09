import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';
let token = '';

const login = async () => {
    try {
        // Register a random user to ensure we have a valid account
        const uniqueEmail = `test_ai_${Date.now()}@example.com`;
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            username: 'AI Test User',
            email: uniqueEmail,
            password: 'password123'
        });
        token = regRes.data.token;
        console.log('Login/Register Success. Token obtained.');
    } catch (error) {
        console.error('Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

const testAIChat = async () => {
    console.log('\n--- Testing AI Chat ---');
    try {
        const res = await axios.post(`${BASE_URL}/ai/chat`, {
            message: 'Hello, how are you?'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('AI Chat Response:', res.data);
    } catch (error) {
        console.error('AI Chat Error:', error.response?.data || error.message);
        if (error.response?.data) console.error('Full Error Data:', JSON.stringify(error.response.data, null, 2));
    }
};

const testStudyPlan = async () => {
    console.log('\n--- Testing Study Plan ---');
    try {
        const res = await axios.post(`${BASE_URL}/ai/generate-plan`, {
            subjects: ['Math', 'Science'],
            tasks: [{ title: 'Homework 1', deadline: '2023-12-31' }],
            hoursPerDay: 2
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Study Plan Response:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('Study Plan Error:', error.response?.data || error.message);
        if (error.response?.data) console.error('Full Error Data:', JSON.stringify(error.response.data, null, 2));
    }
};

const runTests = async () => {
    await login();
    await testAIChat();
    await testStudyPlan();
};

runTests();
