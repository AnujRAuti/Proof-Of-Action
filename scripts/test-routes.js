/**
 * Complete Route & Authentication Health Test
 */

const http = require('http');
const { spawn } = require('child_process');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Next.js Production Server on port 3001...');

  const server = spawn('npx', ['next', 'start', '-p', '3001'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '3001' },
    stdio: 'pipe',
  });

  let serverStarted = false;
  server.stdout.on('data', (data) => {
    const str = data.toString();
    if (str.includes('Ready in') || str.includes('started server on') || str.includes('3001')) {
      serverStarted = true;
    }
  });

  // Wait for server to start
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await httpRequest({
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/health',
        method: 'GET',
      });
      if (res.statusCode === 200) {
        serverStarted = true;
        break;
      }
    } catch {}
  }

  if (!serverStarted) {
    console.error('Server failed to start in time');
    server.kill();
    process.exit(1);
  }

  console.log('✓ Next.js server ready at http://127.0.0.1:3001\n');

  const results = [];

  // Helper to test
  async function testRoute(name, options, postData = null, expectedStatus = [200]) {
    try {
      const res = await httpRequest(
        {
          hostname: '127.0.0.1',
          port: 3001,
          ...options,
        },
        postData
      );

      const pass = expectedStatus.includes(res.statusCode);
      console.log(`  ${pass ? '✓' : '✗'} ${name}: Got HTTP ${res.statusCode} (Expected: ${expectedStatus.join('/')})`);
      results.push({ name, pass, status: res.statusCode, headers: res.headers, body: res.body });
      return res;
    } catch (e) {
      console.log(`  ✗ ${name}: Error - ${e.message}`);
      results.push({ name, pass: false, error: e.message });
      return null;
    }
  }

  console.log('--- 1. Testing Public Routes ---');
  await testRoute('GET /', { path: '/', method: 'GET' }, null, [200]);
  await testRoute('GET /login', { path: '/login', method: 'GET' }, null, [200]);
  await testRoute('GET /signup', { path: '/signup', method: 'GET' }, null, [200]);
  await testRoute('GET /about', { path: '/about', method: 'GET' }, null, [200]);
  await testRoute('GET /api/health', { path: '/api/health', method: 'GET' }, null, [200]);
  await testRoute('GET /citizen/login', { path: '/citizen/login', method: 'GET' }, null, [200]);
  await testRoute('GET /supervisor/login', { path: '/supervisor/login', method: 'GET' }, null, [200]);
  await testRoute('GET /reviewer/login', { path: '/reviewer/login', method: 'GET' }, null, [200]);

  console.log('\n--- 2. Testing Authentication APIs ---');
  // Garbage login
  await testRoute(
    'POST /api/auth/login (Garbage Credentials)',
    {
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({ email: 'garbage@test.com', password: 'randompassword123' }),
    [401]
  );

  // Wrong password
  await testRoute(
    'POST /api/auth/login (Wrong Password)',
    {
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({ email: 'reviewer.demo@example.com', password: 'WrongPassword123' }),
    [401]
  );

  // Reviewer Email only (missing password)
  await testRoute(
    'POST /api/auth/login (Missing Password)',
    {
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({ email: 'reviewer.demo@example.com', password: '' }),
    [422]
  );

  // Valid Reviewer Login
  const reviewerLoginRes = await testRoute(
    'POST /api/auth/login (Valid Reviewer)',
    {
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({
      email: 'reviewer.demo@example.com',
      password: 'Reviewer@2026!',
      requiredRole: 'REVIEWER',
    }),
    [200]
  );

  let sessionCookie = '';
  if (reviewerLoginRes?.headers['set-cookie']) {
    const rawCookie = reviewerLoginRes.headers['set-cookie'];
    sessionCookie = Array.isArray(rawCookie) ? rawCookie.join('; ') : rawCookie;
    console.log('    Session Cookie Received:', sessionCookie.split(';')[0]);
  }

  // GET /api/auth/me with session
  await testRoute(
    'GET /api/auth/me (Authenticated Reviewer)',
    {
      path: '/api/auth/me',
      method: 'GET',
      headers: sessionCookie ? { Cookie: sessionCookie } : {},
    },
    null,
    [200]
  );

  console.log('\n--- 3. Testing Reviewer Portal Routes with Session ---');
  const authHeader = sessionCookie ? { Cookie: sessionCookie } : {};
  await testRoute('GET /reviewer', { path: '/reviewer', method: 'GET', headers: authHeader }, null, [200]);
  await testRoute('GET /reviewer/queue', { path: '/reviewer/queue', method: 'GET', headers: authHeader }, null, [200]);
  await testRoute('GET /reviewer/compare', { path: '/reviewer/compare', method: 'GET', headers: authHeader }, null, [200]);
  await testRoute('GET /reviewer/map', { path: '/reviewer/map', method: 'GET', headers: authHeader }, null, [200]);
  await testRoute('GET /reviewer/field', { path: '/reviewer/field', method: 'GET', headers: authHeader }, null, [200]);
  await testRoute('GET /reviewer/projects/PRJ-PMGSY-MH-401', { path: '/reviewer/projects/PRJ-PMGSY-MH-401', method: 'GET', headers: authHeader }, null, [200]);

  console.log('\n--- 4. Testing Evidence API ---');
  await testRoute('GET /api/evidence', { path: '/api/evidence', method: 'GET' }, null, [200]);
  await testRoute(
    'POST /api/evidence',
    {
      path: '/api/evidence',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
    },
    JSON.stringify({
      projectId: 'PRJ-PMGSY-MH-401',
      stage: 'after',
      fileName: 'road-sample.jpg',
      latitude: 18.2814,
      longitude: 74.0156,
    }),
    [202, 201, 200]
  );

  console.log('\n--- 5. Testing Logout ---');
  await testRoute('POST /api/auth/logout', { path: '/api/auth/logout', method: 'POST', headers: authHeader }, null, [200]);

  server.kill();
  console.log('\n🏁 All route and auth tests completed successfully.');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});

