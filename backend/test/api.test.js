process.env.NODE_ENV = 'test';
import assert from 'assert';
import http from 'http';
import app from '../src/server.js';
import userModel from '../src/models/userModel.js';
import eventModel from '../src/models/eventModel.js';
import registrationModel from '../src/models/registrationModel.js';
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
  console.log('  RUNNING T&P CLUB SIMPLIFIED FULL-STACK API TESTS');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  };

  // Start test server on random port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`[Test Suite] Ephemeral test server running at ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    let staffToken = null;
    let createdEventId = null;

    // 1. Health Check
    await test('GET /api/health returns 200 and db status', async () => {
      const res = await request('GET', '/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.status, 'ok');
      assert.strictEqual(res.data.database, 'connected');
    });

    // 2. Public Event Discovery (No Auth)
    await test('GET /api/events publicly lists opportunities without authentication', async () => {
      const res = await request('GET', '/api/events');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data.data), 'Expected array of events');
      assert.ok(res.data.data.length > 0, 'Expected at least 1 seed event');
    });

    // 3. Public Event Details (No Auth)
    await test('GET /api/events/:id publicly returns event details', async () => {
      const listRes = await request('GET', '/api/events');
      const firstEvent = listRes.data.data[0];
      const res = await request('GET', `/api/events/${firstEvent.id}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.id, firstEvent.id);
      assert.strictEqual(res.data.data.title, firstEvent.title);
    });

    // 4. Staff Login & JWT Generation
    await test('POST /api/auth/login authenticates staff and returns JWT', async () => {
      const res = await request('POST', '/api/auth/login', {
        email: 'staff@college.edu',
        password: 'staff123'
      });
      assert.strictEqual(res.status, 200);
      assert.ok(res.data.data.token, 'Expected JWT token');
      assert.strictEqual(res.data.data.user.role, 'staff');
      staffToken = res.data.data.token;
    });

    // 5. Staff Profile via Token
    await test('GET /api/auth/me verifies valid staff token', async () => {
      const res = await request('GET', '/api/auth/me', null, staffToken);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.email, 'staff@college.edu');
      assert.strictEqual(res.data.data.role, 'staff');
    });

    // 6. Security: Deny Protected Endpoints Without Token
    await test('POST /api/events without token returns 401 Unauthorized', async () => {
      const res = await request('POST', '/api/events', {
        title: 'Unauthorized Event'
      });
      assert.strictEqual(res.status, 401);
    });

    // 7. Staff Event Creation
    await test('POST /api/events creates an opportunity with staff token', async () => {
      const testEvent = {
        title: `Automated Test Workshop ${Date.now()}`,
        subtitle: 'Hands-on practical verification session',
        type: 'club_event',
        category: 'Technical',
        description: 'Testing event creation pipeline',
        startDate: '2026-10-10',
        endDate: '2026-10-10',
        startTime: '10:00 AM',
        endTime: '01:00 PM',
        venue: 'Lab 3',
        city: 'On-Campus',
        institution: 'Training & Placement Club',
        registrationFee: 0,
        registrationDeadline: '2026-10-09',
        status: 'published'
      };

      const res = await request('POST', '/api/events', testEvent, staffToken);
      assert.strictEqual(res.status, 201);
      assert.ok(res.data.data.id, 'Expected event ID');
      createdEventId = res.data.data.id;
    });

    // 8. Public Student Registration (No Student Account Required)
    const uniqueRoll = `TEST${Date.now().toString().slice(-6)}`;
    const uniqueEmail = `student.${uniqueRoll.toLowerCase()}@college.edu`;

    await test('POST /api/registrations allows student registration without account', async () => {
      const regData = {
        eventId: createdEventId,
        studentName: 'Test Student',
        registerNumber: uniqueRoll,
        email: uniqueEmail,
        phone: '+91 9988776655',
        department: 'CSE',
        year: '3rd Year',
        college: 'Paavai Engineering College'
      };

      const res = await request('POST', '/api/registrations', regData);
      assert.strictEqual(res.status, 201);
      assert.ok(res.data.data.registrationNumber, 'Expected registration number');
      assert.strictEqual(res.data.data.registerNumber, uniqueRoll);
      assert.strictEqual(res.data.data.status, 'CONFIRMED');
    });

    // 9. Duplicate Registration Prevention
    await test('POST /api/registrations rejects duplicate registration with 409 Conflict', async () => {
      const regData = {
        eventId: createdEventId,
        studentName: 'Duplicate Student',
        registerNumber: uniqueRoll,
        email: uniqueEmail,
        department: 'CSE'
      };

      const res = await request('POST', '/api/registrations', regData);
      assert.strictEqual(res.status, 409);
      assert.ok(res.data.message.includes('already registered'), 'Expected duplicate error message');
    });

    // 10. Staff View Registrations for Event
    await test('GET /api/registrations/event/:eventId returns registrations for staff', async () => {
      const res = await request('GET', `/api/registrations/event/${createdEventId}`, null, staffToken);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data.data), 'Expected array of registrations');
      assert.strictEqual(res.data.data.length, 1);
      assert.strictEqual(res.data.data[0].registerNumber, uniqueRoll);
    });

    // 11. Staff Event Update
    await test('PUT /api/events/:id updates opportunity with staff token', async () => {
      const res = await request('PUT', `/api/events/${createdEventId}`, {
        title: 'Updated Workshop Title'
      }, staffToken);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.data.title, 'Updated Workshop Title');
    });

    // 12. Staff Event Deletion
    await test('DELETE /api/events/:id deletes opportunity with staff token', async () => {
      const res = await request('DELETE', `/api/events/${createdEventId}`, null, staffToken);
      assert.strictEqual(res.status, 200);

      // Verify it no longer exists
      const checkRes = await request('GET', `/api/events/${createdEventId}`);
      assert.strictEqual(checkRes.status, 404);
    });

    // 13. Automatic Past Opportunities: Active vs Past timeline filtering
    await test('GET /api/events?timeline=active and ?timeline=past filter correctly', async () => {
      const activeRes = await request('GET', '/api/events?timeline=active');
      assert.strictEqual(activeRes.status, 200);
      assert.ok(activeRes.data.data.every(e => e.isPast === false), 'All events should have isPast: false in active view');

      const pastRes = await request('GET', '/api/events?timeline=past');
      assert.strictEqual(pastRes.status, 200);
      assert.ok(pastRes.data.data.length > 0, 'Seed should contain past events');
      assert.ok(pastRes.data.data.every(e => e.isPast === true), 'All events should have isPast: true in past view');
    });

    // 14. Registration Security: Reject registration for expired event
    await test('POST /api/registrations rejects registration for past deadline event with 400', async () => {
      // Find a past event or create one
      const pastList = await request('GET', '/api/events?timeline=past');
      const pastEvent = pastList.data.data[0];
      assert.ok(pastEvent, 'Need a past event to test');

      const regRes = await request('POST', '/api/registrations', {
        eventId: pastEvent.id,
        studentName: 'Late Student',
        registerNumber: `LATE${Date.now().toString().slice(-4)}`,
        email: 'late@college.edu',
        phone: '9988776655',
        department: 'CSE'
      });

      assert.strictEqual(regRes.status, 400);
      assert.strictEqual(regRes.data.success, false);
      assert.strictEqual(regRes.data.message, 'Registration for this opportunity has closed.');
    });

    // 15. Direct URL Access for Past Event
    await test('GET /api/events/:id succeeds for past event without error and marks isPast', async () => {
      const pastList = await request('GET', '/api/events?timeline=past');
      const pastEvent = pastList.data.data[0];
      const singleRes = await request('GET', `/api/events/${pastEvent.id}`);
      assert.strictEqual(singleRes.status, 200);
      assert.strictEqual(singleRes.data.data.id, pastEvent.id);
      assert.strictEqual(singleRes.data.data.isPast, true);
    });
  } finally {
    if (server) {
      server.close();
    }
  }

  console.log('\n==================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch((e) => {
  console.error('Fatal Test Runner Error:', e);
  process.exit(1);
});
