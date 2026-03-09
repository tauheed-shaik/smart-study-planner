import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';
let token = '';
let userId = '';
let subjectId = '';
let taskId = '';

const testAuth = async () => {
    console.log('\n--- Testing Authentication ---');
    try {
        // Register
        const uniqueEmail = `test${Date.now()}@example.com`;
        console.log(`Registering user with email: ${uniqueEmail}`);
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            username: 'Test User',
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('Registration Success:', regRes.status);
        token = regRes.data.token;
        userId = regRes.data.user.id;

        // Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('Login Success:', loginRes.status);
        token = loginRes.data.token;

        // Get Me
        console.log('Fetching User Profile...');
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Me Success:', meRes.data.email === uniqueEmail);

    } catch (error) {
        console.error('Auth Error:', error.response?.data || error.message);
    }
};

const testSubjects = async () => {
    console.log('\n--- Testing Subjects ---');
    try {
        // Create Subject
        console.log('Creating Subject...');
        const createRes = await axios.post(`${BASE_URL}/subjects`, {
            name: 'Mathematics',
            color: '#FF5733'
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('Create Subject Success:', createRes.status);
        subjectId = createRes.data._id;

        // Get Subjects
        console.log('Fetching Subjects...');
        const getRes = await axios.get(`${BASE_URL}/subjects`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Subjects Success:', getRes.data.length > 0);

    } catch (error) {
        console.error('Subject Error:', error.response?.data || error.message);
    }
};

const testTasks = async () => {
    console.log('\n--- Testing Tasks ---');
    try {
        // Create Task
        console.log('Creating Task...');
        const createRes = await axios.post(`${BASE_URL}/tasks`, {
            title: 'Algebra Homework',
            description: 'Chapter 1-5',
            deadline: new Date().toISOString(),
            priority: 'high',
            subject: subjectId
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('Create Task Success:', createRes.status);
        taskId = createRes.data._id;

        // Get Tasks
        console.log('Fetching Tasks...');
        const getRes = await axios.get(`${BASE_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Tasks Success:', getRes.data.length > 0);

        // Update Task (Complete)
        console.log('Completing Task (Gamification Check)...');
        const updateRes = await axios.put(`${BASE_URL}/tasks/${taskId}`, {
            status: 'completed'
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('Update Task Success:', updateRes.data.status === 'completed');

        // Check Points
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Points Incremented:', meRes.data.points === 10);

    } catch (error) {
        console.error('Task Error:', error.response?.data || error.message);
    }
};

const runTests = async () => {
    await testAuth();
    if (token) {
        await testSubjects();
        await testTasks();
    }
};

runTests();
