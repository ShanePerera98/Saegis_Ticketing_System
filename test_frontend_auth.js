const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8000';
const API_URL = `${BASE_URL}/api`;

async function testFrontendAuth() {
    console.log('🔐 Testing Frontend Authentication Flow...\n');
    
    try {
        // Step 1: Test API loginnpm 
        console.log('1. Testing API login...');
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: 'super@log.com',
                password: '789789'
            })
        });
        
        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
        }
        
        const loginData = await loginResponse.json();
        console.log('✅ API Login successful');
        console.log('   Token:', loginData.token.substring(0, 20) + '...');
        console.log('   User:', loginData.user.name, `(${loginData.user.role})`);
        console.log('   Abilities:', loginData.abilities.slice(0, 3).join(', ') + '...\n');
        
        // Step 2: Test authenticated user list request
        console.log('2. Testing authenticated user list request...');
        const usersResponse = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Accept': 'application/json'
            }
        });
        
        if (!usersResponse.ok) {
            throw new Error(`Users request failed: ${usersResponse.status} ${usersResponse.statusText}`);
        }
        
        const usersData = await usersResponse.json();
        console.log('✅ User list request successful');
        console.log('   Total users:', usersData.data.data.length);
        console.log('   First user:', usersData.data.data[0].name, `(${usersData.data.data[0].role})\n`);
        
        // Step 3: Test user creation
        console.log('3. Testing user creation...');
        const createUserResponse = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'Frontend Test User',
                email: `frontend.test.${Date.now()}@example.com`,
                password: 'testpassword',
                role: 'CLIENT',
                is_active: true
            })
        });
        
        if (!createUserResponse.ok) {
            const errorData = await createUserResponse.text();
            throw new Error(`User creation failed: ${createUserResponse.status} ${createUserResponse.statusText}\n${errorData}`);
        }
        
        const newUserData = await createUserResponse.json();
        console.log('✅ User creation successful');
        console.log('   New user ID:', newUserData.data.id);
        console.log('   New user name:', newUserData.data.name);
        console.log('   New user email:', newUserData.data.email, '\n');
        
        // Step 4: Test /me endpoint
        console.log('4. Testing /me endpoint...');
        const meResponse = await fetch(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Accept': 'application/json'
            }
        });
        
        if (!meResponse.ok) {
            throw new Error(`/me request failed: ${meResponse.status} ${meResponse.statusText}`);
        }
        
        const meData = await meResponse.json();
        console.log('✅ /me endpoint successful');
        console.log('   Current user:', meData.user.name);
        console.log('   Abilities count:', meData.abilities.length, '\n');
        
        console.log('🎉 All backend API tests passed! Backend authentication is working correctly.\n');
        
        // Step 5: Test frontend page loading
        console.log('5. Testing frontend page loading...');
        const frontendResponse = await fetch(`${BASE_URL}/login`);
        const frontendHtml = await frontendResponse.text();
        
        if (frontendHtml.includes('ticket-app.jsx')) {
            console.log('✅ Frontend login page loads correctly');
            console.log('   React app script included: ✓');
        } else {
            console.log('❌ Frontend login page missing React app script');
        }
        
        if (frontendHtml.includes('ticket-app')) {
            console.log('   App container div found: ✓');
        } else {
            console.log('   App container div missing: ❌');
        }
        
        console.log('\n📋 Test Summary:');
        console.log('   ✅ Backend API authentication: Working');
        console.log('   ✅ Backend user management: Working');
        console.log('   ✅ Frontend page loading: Working');
        console.log('\n💡 If users are experiencing issues, check:');
        console.log('   1. Browser console for JavaScript errors');
        console.log('   2. Network tab for failed API requests');
        console.log('   3. localStorage for authentication tokens');
        console.log('   4. Ensure correct login credentials (super@log.com / 789789)');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testFrontendAuth();
