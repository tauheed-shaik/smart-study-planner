import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';
let token = '';

const logResult = (name, status, details = '') => {
    const symbol = status === 'PASSED' ? '✅' : '❌';
    console.log(`${symbol} [${name}] - ${status} ${details ? ': ' + details : ''}`);
};

const runTests = async () => {
    console.log('--- Starting Comprehensive API Testing ---\n');

    try {
        // 1. Auth Tests
        const email = `test_total_${Date.now()}@example.com`;

        console.log('Testing Authentication...');
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            username: 'Tester',
            email,
            password: 'password123'
        });
        token = regRes.data.token;
        logResult('User Registration', 'PASSED');

        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password: 'password123'
        });
        logResult('User Login', 'PASSED');

        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        logResult('Fetch Profile (/me)', 'PASSED');

        // 2. Subject Tests
        console.log('\nTesting Subjects...');
        const subRes = await axios.post(`${BASE_URL}/subjects`, {
            name: 'Mathematics',
            color: '#ff0000'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const subjectId = subRes.data._id;
        logResult('Create Subject', 'PASSED');

        const getSubs = await axios.get(`${BASE_URL}/subjects`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        logResult('Fetch Subjects', 'PASSED', `Count: ${getSubs.data.length}`);

        // 3. Task Tests
        console.log('\nTesting Tasks...');
        const taskRes = await axios.post(`${BASE_URL}/tasks`, {
            title: 'Calculus Assignment',
            description: 'Derivatives and Integrals',
            deadline: '2023-12-31',
            priority: 'high',
            subject: subjectId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const taskId = taskRes.data._id;
        logResult('Create Task', 'PASSED');

        const updateTask = await axios.put(`${BASE_URL}/tasks/${taskId}`, {
            status: 'completed'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        logResult('Complete Task (Gamification)', 'PASSED', `Points Awarded: ${updateTask.data.userPoints > 0}`);

        // 4. AI Tests
        console.log('\nTesting AI Services...');
        const chatRes = await axios.post(`${BASE_URL}/ai/chat`, {
            message: 'What is the capital of France?'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        logResult('AI Chatbot', 'PASSED');

        const planRes = await axios.post(`${BASE_URL}/ai/generate-plan`, {
            subjects: ['Mathematics'],
            tasks: [{ title: 'Calculus Assignment', deadline: '2023-12-31' }],
            hoursPerDay: 4
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        logResult('AI Study Plan Generation', 'PASSED', `Schedule Days: ${planRes.data.schedule.length}`);

        console.log('\n--- All Tests Completed Successfully ---');
    } catch (error) {
        console.error('\n❌ Test Suite Failed!');
        console.error('Error:', error.response?.data || error.message);
        process.exit(1);
    }
};

runTests();
