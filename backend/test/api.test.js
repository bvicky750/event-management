import assert from 'assert';
import http from 'http';
import app from '../src/server.js';
import { getSeedData } from '../database/seeds.js';
import userModel from '../src/models/userModel.js';
import eventModel from '../src/models/eventModel.js';
import registrationModel from '../src/models/registrationModel.js';
import attendanceModel from '../src/models/attendanceModel.js';
import odModel from '../src/models/odModel.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';

let server;
let baseUrl;

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n==================================================');
  console.log('  RUNNING COMPREHENSIVE BACKEND API TEST SUITE');
  console.log('==================================================\n');

  // Start test server on random port
  await new Promise((resolve) => {
    const testPort = 5055;
    server = app.listen(testPort, () => {
      baseUrl = `http://localhost:${testPort}`;
      console.log(`[Test Server] Started on ${baseUrl}`);
      resolve();
    });
  });

  let testsPassed = 0;
  let testsFailed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      testsPassed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    Error: ${err.message}`);
      testsFailed++;
    }
  }

  // TEST 1: Health Check
  await test('GET /api/health returns 200 OK', async () => {
    const res = await request('GET', '/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.message, 'T&P Club Event Management Backend Running');
  });

  // TEST 2: Seed / In-memory user token generation & verification
  const testStudentUser = {
    id: 'stud_test_001',
    name: 'Test Student',
    email: 'test.student@college.edu',
    role: 'student',
    registerNumber: '23CSE999'
  };

  const testStaffUser = {
    id: 'staff_test_001',
    name: 'Dr. Test Staff',
    email: 'test.staff@college.edu',
    role: 'staff',
    employeeId: 'EMP-999'
  };

  const studentToken = jwt.sign(testStudentUser, config.jwt.secret, { expiresIn: '1h' });
  const staffToken = jwt.sign(testStaffUser, config.jwt.secret, { expiresIn: '1h' });

  // TEST 3: Auth Login - Missing Credentials
  await test('POST /api/auth/login with empty body returns 400', async () => {
    const res = await request('POST', '/api/auth/login', {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  // TEST 4: Events Catalog - GET /api/events
  await test('GET /api/events returns event list', async () => {
    const res = await request('GET', '/api/events');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.data));
  });

  // TEST 5: Events Catalog - Filtering by Type
  await test('GET /api/events?type=club_event returns filtered events', async () => {
    const res = await request('GET', '/api/events?type=club_event');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    if (res.data.data.length > 0) {
      assert(res.data.data.every(e => e.type === 'club_event'));
    }
  });

  // TEST 6: RBAC - Student cannot create event
  await test('POST /api/events without staff role returns 403 Forbidden', async () => {
    const res = await request('POST', '/api/events', {
      title: 'Unauthorized Event',
      type: 'club_event'
    }, studentToken);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
  });

  // TEST 7: Attendance Scan - Missing Fields
  await test('POST /api/attendance/scan with missing fields returns 400', async () => {
    const res = await request('POST', '/api/attendance/scan', {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  // TEST 8: Attendance Scan - Invalid QR Token
  await test('POST /api/attendance/scan with invalid token returns INVALID_QR error', async () => {
    const res = await request('POST', '/api/attendance/scan', {
      eventId: 'evt_1',
      qrToken: 'NON_EXISTENT_QR_9999'
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.errorType, 'INVALID_QR');
  });

  // TEST 9: OD Requests - GET /api/od
  await test('GET /api/od returns list of OD applications', async () => {
    const res = await request('GET', '/api/od');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.data));
  });

  // TEST 10: Reports Analytics - GET /api/reports/analytics
  await test('GET /api/reports/analytics returns metrics overview', async () => {
    const res = await request('GET', '/api/reports/analytics');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.data.totals !== undefined);
  });

  console.log('\n==================================================');
  console.log(`  RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('==================================================\n');

  server.close();
  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests();
