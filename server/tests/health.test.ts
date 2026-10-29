import request from 'supertest'
import { app } from '../src/app.js'
import { logger } from '../src/utils/logger.js'

async function runTests() {
  logger.info('Running backend health & routing integration tests...')
  let passed = 0
  let failed = 0

  // Helper assert
  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`PASS: ${testName}`)
      passed++
    } else {
      console.error(`FAIL: ${testName}`)
      failed++
    }
  }

  try {
    // 1. Test GET /health
    const healthRes = await request(app).get('/health')
    assert(healthRes.status === 200, 'GET /health returns 200 OK')
    assert(healthRes.body.success === true, 'GET /health response has success: true')
    assert(
      healthRes.body.message === 'AI Digital Twin API is running',
      'GET /health contains correct message'
    )

    // 2. Test GET /health/db
    const dbHealthRes = await request(app).get('/health/db')
    assert(
      dbHealthRes.status === 200 || dbHealthRes.status === 503,
      'GET /health/db returns 200 (connected) or 503 (disconnected gracefully)'
    )
    assert(
      typeof dbHealthRes.body.success === 'boolean',
      'GET /health/db response has boolean success flag'
    )

    // 3. Test GET /api/v1 (Gateway)
    const v1Res = await request(app).get('/api/v1')
    assert(v1Res.status === 200, 'GET /api/v1 returns 200 OK')
    assert(Array.isArray(v1Res.body.data.modules), 'GET /api/v1 lists architecture modules')

    // 4. Test 404 Endpoint Handler
    const notFoundRes = await request(app).get('/api/v1/invalid-route-does-not-exist')
    assert(notFoundRes.status === 404, 'Unknown endpoint returns 404')
    assert(notFoundRes.body.success === false, '404 response has success: false')
    assert(notFoundRes.body.error.code === 'NOT_FOUND', '404 error code is NOT_FOUND')

    // 5. Test JSON Content-Type Header
    assert(
      healthRes.headers['content-type'].includes('application/json'),
      'Endpoints return application/json headers'
    )

    console.log(`\nTest Summary: ${passed} passed, ${failed} failed.\n`)

    if (failed > 0) {
      process.exit(1)
    } else {
      process.exit(0)
    }
  } catch (err) {
    console.error('Test execution error:', err)
    process.exit(1)
  }
}

runTests()
