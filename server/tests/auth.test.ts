import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../src/app.js'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import { User } from '../src/models/User.js'
import { Student } from '../src/models/Student.js'
import { PlacementAssessment } from '../src/models/PlacementAssessment.js'
import { UserRole } from '../src/types/auth.types.js'
import { env } from '../src/config/env.js'
import { hashPassword } from '../src/utils/password.js'
import { ReadinessLevel } from '../src/types/index.js'

async function runAuthTests() {
  console.log('\n====================================================')
  console.log('STARTING PHASE 4 AUTHENTICATION & RBAC INTEGRATION TESTS')
  console.log('====================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`PASS: ${testName}`)
      passed++
    } else {
      console.error(`FAIL: ${testName}${detail ? ` -> ${detail}` : ''}`)
      failed++
    }
  }

  try {
    // 1. Establish Database Connection
    await connectDatabase()

    // Clean up any test users from previous test runs
    const testEmailStudentA = 'test.student.a@univ.edu'
    const testEmailStudentB = 'test.student.b@univ.edu'
    const testEmailOfficer = 'test.officer@univ.edu'
    const testEmailDisabled = 'test.disabled@univ.edu'
    const testEmailAdmin = 'test.admin@univ.edu'

    await User.deleteMany({
      email: {
        $in: [
          testEmailStudentA,
          testEmailStudentB,
          testEmailOfficer,
          testEmailDisabled,
          testEmailAdmin,
        ],
      },
    })

    // ============================================================
    // TEST CASE 1: Successful Registration (Student)
    // ============================================================
    const regStudentRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Student One',
        email: testEmailStudentA,
        password: 'Password123!',
        role: UserRole.STUDENT,
      })

    assert(regStudentRes.status === 201, 'Case 1.1: Student registration returns 201 Created')
    assert(regStudentRes.body.success === true, 'Case 1.2: Registration returns success: true')
    assert(regStudentRes.body.data.user.role === UserRole.STUDENT, 'Case 1.3: User role is STUDENT')
    assert(Boolean(regStudentRes.body.data.token), 'Case 1.4: Registration returns JWT access token')
    assert(
      regStudentRes.body.data.user.passwordHash === undefined &&
        regStudentRes.body.data.user.password === undefined,
      'Case 1.5: Password and passwordHash are NEVER returned in response'
    )
    const studentAToken = regStudentRes.body.data.token
    const studentAId = regStudentRes.body.data.user.id

    // ============================================================
    // TEST CASE 2: Duplicate Email Registration Prevention
    // ============================================================
    const dupRegRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Duplicate Student',
        email: testEmailStudentA,
        password: 'Password123!',
        role: UserRole.STUDENT,
      })

    assert(dupRegRes.status === 409, 'Case 2.1: Duplicate email registration returns 409 Conflict')
    assert(dupRegRes.body.success === false, 'Case 2.2: Duplicate registration returns success: false')
    assert(
      dupRegRes.body.error?.code === 'EMAIL_ALREADY_EXISTS',
      'Case 2.3: Error code is EMAIL_ALREADY_EXISTS'
    )

    // ============================================================
    // TEST CASE 3: Invalid Registration Input
    // ============================================================
    const invalidRegRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'A', // too short (< 2)
        email: 'invalid-email-format',
        password: 'weak', // too short (< 8, no uppercase/digit)
      })

    assert(invalidRegRes.status === 400, 'Case 3.1: Invalid registration input returns 400 Bad Request')
    assert(invalidRegRes.body.success === false, 'Case 3.2: Invalid input returns success: false')
    assert(
      invalidRegRes.body.error?.code === 'VALIDATION_ERROR',
      'Case 3.3: Error code is VALIDATION_ERROR'
    )

    // ============================================================
    // TEST CASE 4: Prevent Self-Escalation to ADMIN via Public Registration
    // ============================================================
    const adminRegRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Hacker Admin',
        email: 'hacker.admin@univ.edu',
        password: 'Password123!',
        role: UserRole.ADMIN,
      })

    assert(
      adminRegRes.status === 403,
      'Case 4.1: Public registration with ADMIN role returns 403 Forbidden'
    )
    assert(
      adminRegRes.body.error?.code === 'FORBIDDEN_ROLE_REGISTRATION',
      'Case 4.2: Error code is FORBIDDEN_ROLE_REGISTRATION'
    )

    // ============================================================
    // Register Student B & Placement Officer for multi-user tests
    // ============================================================
    const regStudentBRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Student Two',
        email: testEmailStudentB,
        password: 'Password123!',
        role: UserRole.STUDENT,
      })
    const studentBToken = regStudentBRes.body.data.token
    const studentBId = regStudentBRes.body.data.user.id

    const regOfficerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Placement Officer Jane',
        email: testEmailOfficer,
        password: 'Password123!',
        role: UserRole.PLACEMENT_OFFICER,
      })
    const officerToken = regOfficerRes.body.data.token

    // Create an Admin user directly in DB for admin role testing
    const adminPasswordHash = await hashPassword('AdminPass123!')
    const adminUser = await User.create({
      name: 'System Admin',
      email: testEmailAdmin,
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isActive: true,
    })
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmailAdmin,
        password: 'AdminPass123!',
      })
    const adminToken = adminLoginRes.body.data.token

    // ============================================================
    // TEST CASE 5: Successful Login
    // ============================================================
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmailStudentA,
        password: 'Password123!',
      })

    assert(loginRes.status === 200, 'Case 5.1: Successful login returns 200 OK')
    assert(loginRes.body.success === true, 'Case 5.2: Successful login returns success: true')
    assert(Boolean(loginRes.body.data.token), 'Case 5.3: Login returns fresh JWT token')
    assert(
      loginRes.headers['set-cookie'] && loginRes.headers['set-cookie'].length > 0,
      'Case 5.4: Login sets httpOnly auth cookie'
    )

    // ============================================================
    // TEST CASE 6: Wrong Password Rejection
    // ============================================================
    const wrongPassRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmailStudentA,
        password: 'WrongPassword999!',
      })

    assert(wrongPassRes.status === 401, 'Case 6.1: Wrong password returns 401 Unauthorized')
    assert(
      wrongPassRes.body.message === 'Invalid email or password.',
      'Case 6.2: Returns generic message preventing password inference'
    )
    assert(
      wrongPassRes.body.error?.code === 'INVALID_CREDENTIALS',
      'Case 6.3: Error code is INVALID_CREDENTIALS'
    )

    // ============================================================
    // TEST CASE 7: Non-Existent Email Rejection
    // ============================================================
    const nonExistentRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'does.not.exist@univ.edu',
        password: 'Password123!',
      })

    assert(nonExistentRes.status === 401, 'Case 7.1: Non-existent email returns 401 Unauthorized')
    assert(
      nonExistentRes.body.message === 'Invalid email or password.',
      'Case 7.2: Returns generic message preventing user enumeration'
    )

    // ============================================================
    // TEST CASE 8: Disabled Account Rejection
    // ============================================================
    const disabledPassHash = await hashPassword('Password123!')
    await User.create({
      name: 'Disabled User',
      email: testEmailDisabled,
      passwordHash: disabledPassHash,
      role: UserRole.STUDENT,
      isActive: false,
    })

    const disabledLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmailDisabled,
        password: 'Password123!',
      })

    assert(disabledLoginRes.status === 403, 'Case 8.1: Disabled account login returns 403 Forbidden')
    assert(
      disabledLoginRes.body.error?.code === 'ACCOUNT_DISABLED',
      'Case 8.2: Error code is ACCOUNT_DISABLED'
    )

    // ============================================================
    // TEST CASE 9: GET /auth/me with Valid Authentication
    // ============================================================
    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${studentAToken}`)

    assert(meRes.status === 200, 'Case 9.1: GET /auth/me with valid Bearer token returns 200 OK')
    assert(meRes.body.data.user.email === testEmailStudentA, 'Case 9.2: Returns correct user profile')
    assert(
      meRes.body.data.user.passwordHash === undefined &&
        meRes.body.data.user.password === undefined,
      'Case 9.3: passwordHash is not returned by /auth/me'
    )

    // ============================================================
    // TEST CASE 10: GET /auth/me without Authentication
    // ============================================================
    const unauthMeRes = await request(app).get('/api/v1/auth/me')
    assert(unauthMeRes.status === 401, 'Case 10.1: GET /auth/me without token returns 401 Unauthorized')
    assert(
      unauthMeRes.body.error?.code === 'UNAUTHORIZED',
      'Case 10.2: Error code is UNAUTHORIZED'
    )

    // ============================================================
    // TEST CASE 11: Invalid / Tampered JWT
    // ============================================================
    const invalidJwtRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid.tampered.token')

    assert(invalidJwtRes.status === 401, 'Case 11.1: Tampered JWT returns 401 Unauthorized')
    assert(
      invalidJwtRes.body.error?.code === 'INVALID_TOKEN',
      'Case 11.2: Error code is INVALID_TOKEN'
    )

    // ============================================================
    // TEST CASE 12: Expired JWT
    // ============================================================
    const expiredToken = jwt.sign(
      { sub: studentAId, role: UserRole.STUDENT, email: testEmailStudentA },
      env.JWT_SECRET,
      { expiresIn: -10 } // Expired 10 seconds ago
    )

    const expiredRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`)

    assert(expiredRes.status === 401, 'Case 12.1: Expired JWT returns 401 Unauthorized')
    assert(
      expiredRes.body.error?.code === 'TOKEN_EXPIRED',
      'Case 12.2: Error code is TOKEN_EXPIRED'
    )

    // ============================================================
    // TEST CASE 13: Student Role Authorization
    // ============================================================
    const studentAccessDashboardRes = await request(app)
      .get('/api/v1/students/me/dashboard')
      .set('Authorization', `Bearer ${studentAToken}`)

    assert(
      studentAccessDashboardRes.status === 200,
      'Case 13.1: Student is authorized to access student dashboard'
    )

    const studentAccessOfficerRes = await request(app)
      .get('/api/v1/officers/analytics')
      .set('Authorization', `Bearer ${studentAToken}`)

    assert(
      studentAccessOfficerRes.status === 403,
      'Case 13.2: Student is forbidden from accessing officer analytics'
    )
    assert(
      studentAccessOfficerRes.body.error?.code === 'FORBIDDEN',
      'Case 13.3: Error code is FORBIDDEN'
    )

    // ============================================================
    // TEST CASE 14: Placement Officer Role Authorization
    // ============================================================
    const officerTestStudent = await Student.create({
      userId: studentAId,
      studentId: 'TEST-OFFICER-ANALYTICS',
      fullName: 'Officer Analytics Student',
      email: testEmailStudentA,
      college: 'Test University',
      department: 'Computer Science',
      degree: 'B.Tech',
      graduationYear: new Date().getFullYear() + 1,
      currentSemester: 7,
      cgpa: 8.4,
      profileCompletion: 80,
    })
    await PlacementAssessment.create({
      studentId: officerTestStudent._id,
      targetRole: 'Software Engineer',
      overallReadinessScore: 84,
      estimatedPlacementProbability: 72,
      readinessLevel: ReadinessLevel.PLACEMENT_READY,
      assessmentSummary: 'Officer analytics test assessment.',
      aiModel: 'test',
      assessmentVersion: 1,
      generatedAt: new Date(),
    })

    const officerAccessOfficerRes = await request(app)
      .get('/api/v1/officers/analytics?search=TEST-OFFICER-ANALYTICS')
      .set('Authorization', `Bearer ${officerToken}`)

    assert(
      officerAccessOfficerRes.status === 200,
      'Case 14.1: Placement Officer is authorized to access officer analytics'
    )
    assert(
      Array.isArray(officerAccessOfficerRes.body.data.students),
      'Case 14.2: Officer analytics returns a student directory'
    )
    assert(
      typeof officerAccessOfficerRes.body.data.summary.totalStudents === 'number' &&
        typeof officerAccessOfficerRes.body.data.pagination.totalPages === 'number',
      'Case 14.3: Officer analytics returns cohort totals and pagination'
    )
    const reportedStudent = officerAccessOfficerRes.body.data.students.find(
      (student: { studentId: string }) => student.studentId === 'TEST-OFFICER-ANALYTICS'
    )
    assert(
      reportedStudent?.readinessScore === 84 &&
        reportedStudent?.readinessLevel === ReadinessLevel.PLACEMENT_READY,
      'Case 14.4: Student directory includes the latest readiness assessment'
    )

    const invalidOfficerQueryRes = await request(app)
      .get('/api/v1/officers/analytics?page=invalid')
      .set('Authorization', `Bearer ${officerToken}`)
    assert(
      invalidOfficerQueryRes.status === 400,
      'Case 14.5: Invalid officer analytics pagination is rejected'
    )

    const officerAccessStudentRes = await request(app)
      .get('/api/v1/students/me/dashboard')
      .set('Authorization', `Bearer ${officerToken}`)

    assert(
      officerAccessStudentRes.status === 403,
      'Case 14.2: Placement Officer is forbidden from student-only dashboard'
    )

    // ============================================================
    // TEST CASE 15: Admin Role Authorization
    // ============================================================
    const adminAccessStatsRes = await request(app)
      .get('/api/v1/admin/system-stats')
      .set('Authorization', `Bearer ${adminToken}`)

    assert(adminAccessStatsRes.status === 200, 'Case 15.1: Admin is authorized to access admin routes')

    const studentAccessAdminRes = await request(app)
      .get('/api/v1/admin/system-stats')
      .set('Authorization', `Bearer ${studentAToken}`)

    assert(
      studentAccessAdminRes.status === 403,
      'Case 15.2: Student is forbidden from accessing admin routes'
    )

    // ============================================================
    // TEST CASE 16: Student Data Isolation
    // ============================================================
    // Student A accessing own record -> 200 OK
    const ownRecordRes = await request(app)
      .get(`/api/v1/students/${studentAId}/record`)
      .set('Authorization', `Bearer ${studentAToken}`)

    assert(
      ownRecordRes.status === 200,
      'Case 16.1: Student A can successfully access their own data'
    )

    // Student A attempting to access Student B's record -> 403 Forbidden
    const crossStudentRes = await request(app)
      .get(`/api/v1/students/${studentBId}/record`)
      .set('Authorization', `Bearer ${studentAToken}`)

    assert(
      crossStudentRes.status === 403,
      'Case 16.2: Student A is strictly FORBIDDEN from accessing Student B data'
    )
    assert(
      crossStudentRes.body.error?.code === 'STUDENT_DATA_ISOLATION_VIOLATION',
      'Case 16.3: Error code is STUDENT_DATA_ISOLATION_VIOLATION'
    )

    // Placement Officer accessing Student B's record -> 200 OK (Authorized supervisor access)
    const officerInspectStudentRes = await request(app)
      .get(`/api/v1/students/${studentBId}/record`)
      .set('Authorization', `Bearer ${officerToken}`)

    assert(
      officerInspectStudentRes.status === 200,
      'Case 16.4: Placement Officer is authorized to inspect Student records'
    )

    // ============================================================
    // TEST CASE 17: Logout Clears Session Cookies
    // ============================================================
    const logoutRes = await request(app).post('/api/v1/auth/logout')
    assert(logoutRes.status === 200, 'Case 17.1: Logout returns 200 OK')
    assert(logoutRes.body.success === true, 'Case 17.2: Logout returns success: true')

    // Clean up created test accounts
    await PlacementAssessment.deleteMany({ studentId: officerTestStudent._id })
    await Student.deleteOne({ _id: officerTestStudent._id })
    await User.deleteMany({
      email: {
        $in: [
          testEmailStudentA,
          testEmailStudentB,
          testEmailOfficer,
          testEmailDisabled,
          testEmailAdmin,
          'hacker.admin@univ.edu',
        ],
      },
    })

    console.log(`\n====================================================`)
    console.log(`Phase 4 Auth Test Summary: ${passed} passed, ${failed} failed.`)
    console.log(`====================================================\n`)

    await disconnectDatabase()

    if (failed > 0) {
      process.exit(1)
    } else {
      process.exit(0)
    }
  } catch (error) {
    console.error('Fatal test runner error:', error)
    await disconnectDatabase()
    process.exit(1)
  }
}

runAuthTests()
