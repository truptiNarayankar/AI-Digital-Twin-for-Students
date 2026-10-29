process.env.NODE_ENV = 'test'
process.env.MOCK_GEMINI = 'true'

import request from 'supertest'
import { app } from '../src/app.js'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import { User } from '../src/models/User.js'
import { Student } from '../src/models/Student.js'
import { Resume } from '../src/models/Resume.js'
import { ResumeAnalysis } from '../src/models/ResumeAnalysis.js'
import { UserRole } from '../src/types/auth.types.js'
import { ResumeAnalysisStatus } from '../src/types/index.js'
import { ResumeAnalysisOutputSchema } from '../src/services/resume-analyzer.service.js'

async function runResumeTests() {
  console.log('\n====================================================')
  console.log('STARTING PHASE 7 AI RESUME ANALYZER TESTS')
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
    await connectDatabase()

    const emailA = 'phase7.student.a@univ.edu'
    const emailB = 'phase7.student.b@univ.edu'

    // Clean up test data
    const existingUsers = await User.find({ email: { $in: [emailA, emailB] } })
    const userIds = existingUsers.map((u) => u._id)
    const existingStudents = await Student.find({ userId: { $in: userIds } })
    const studentIds = existingStudents.map((s) => s._id)

    await Promise.all([
      User.deleteMany({ _id: { $in: userIds } }),
      Student.deleteMany({ _id: { $in: studentIds } }),
      Resume.deleteMany({ studentId: { $in: studentIds } }),
      ResumeAnalysis.deleteMany({ studentId: { $in: studentIds } }),
    ])

    // Register Student A
    const regResA = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Alex Johnson',
        email: emailA,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.STUDENT,
        institutionId: 'INST-P7-001',
      })
    assert(regResA.status === 201, 'Student A registration succeeds', regResA.body.message)

    const loginResA = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: emailA, password: 'Password123!' })
    const tokenA = regResA.body.data?.token || loginResA.body.data?.token

    // Register Student B
    const regResB = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Dana Smith',
        email: emailB,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.STUDENT,
        institutionId: 'INST-P7-002',
      })
    assert(regResB.status === 201, 'Student B registration succeeds')

    const loginResB = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: emailB, password: 'Password123!' })
    const tokenB = regResB.body.data?.token || loginResB.body.data?.token

    // Setup student profile with target role
    await request(app)
      .put('/api/v1/student/profile')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        headline: 'Aspiring Full Stack Engineer',
        department: 'Computer Science & Engineering',
        degree: 'Bachelor of Technology',
        graduationYear: 2026,
        preferredJobRoles: ['Full Stack Developer', 'Software Engineer'],
        careerGoal: 'Become a Senior Full Stack Engineer building high-scale web platforms.',
      })

    // Test 1: Upload resume without authentication fails with 401
    const unauthRes = await request(app).get('/api/v1/student/resume')
    assert(unauthRes.status === 401, 'Unauthenticated access to resume metadata is rejected')

    // Test 2: Initial state has no resume
    const initialGet = await request(app)
      .get('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(initialGet.status === 200, 'GET /resume returns 200')
    assert(initialGet.body.data.hasResume === false, 'Initially hasResume is false')

    // Test 3: Uploading an unsupported file format (.txt) is rejected
    const invalidFormatRes = await request(app)
      .post('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
      .attach('resume', Buffer.from('Plain text resume content that is invalid'), 'resume.txt')
    assert(
      invalidFormatRes.status === 400,
      'Unsupported file format (.txt) is rejected with 400',
      invalidFormatRes.body.message
    )

    // Test 4: Uploading an empty / image-only resume is rejected
    const emptyPdfRes = await request(app)
      .post('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
      .attach('resume', Buffer.from('%PDF-1.4 empty'), 'empty.pdf')
    assert(
      emptyPdfRes.status === 400,
      'Empty / unparseable resume rejected with clear diagnostic',
      emptyPdfRes.body.message
    )

    // Test 5: Upload valid PDF resume via metadata / service
    // For reliable cross-environment integration test, save valid resume record
    const validResumeDoc = await request(app)
      .post('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'alex_johnson_master_resume.pdf',
        fileUrl: '/uploads/resumes/alex_johnson_master_resume.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 180,
      })
    assert(validResumeDoc.status === 201, 'Resume metadata recording succeeds', validResumeDoc.body.message)
    assert(validResumeDoc.body.data.resume.version === 1, 'Initial resume version is 1')
    assert(
      validResumeDoc.body.data.resume.analysisStatus === ResumeAnalysisStatus.NOT_ANALYZED,
      'Initial analysisStatus is NOT_ANALYZED'
    )

    // Test 6: GET /api/v1/student/resume returns active metadata
    const activeGet = await request(app)
      .get('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(activeGet.status === 200, 'GET /resume returns active metadata')
    assert(activeGet.body.data.hasResume === true, 'hasResume is now true')
    assert(activeGet.body.data.resume.version === 1, 'Version is 1')

    // Test 7: Student ownership security: Student B cannot see Student A's resume
    const studentBGet = await request(app)
      .get('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenB}`)
    assert(studentBGet.body.data.hasResume === false, 'Student B cannot see Student A resume')

    // Test 8: Analyze Resume with Gemini Service (Mocked in test environment)
    const analyzeRes = await request(app)
      .post('/api/v1/student/resume/analyze')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ targetRole: 'Full Stack Developer' })

    assert(analyzeRes.status === 200, 'POST /resume/analyze succeeds with 200', analyzeRes.body.message)
    const analysis = analyzeRes.body.data?.analysis
    assert(typeof analysis?.overallScore === 'number', 'Analysis has overallScore')
    assert(analysis?.overallScore >= 0 && analysis?.overallScore <= 100, 'overallScore is between 0 and 100')
    assert(typeof analysis?.sectionScores === 'object', 'Analysis contains sectionScores')
    assert(analysis?.sectionScores?.projects >= 0, 'Projects section score present')
    assert(Array.isArray(analysis?.strengths) && analysis.strengths.length > 0, 'Strengths detected and returned')
    assert(Array.isArray(analysis?.atsRecommendations), 'ATS recommendations provided')
    assert(Array.isArray(analysis?.improvementSuggestions), 'Actionable improvement suggestions provided')
    assert(analysis?.targetRole === 'Full Stack Developer', 'Target role preserved')

    // Test 9: GET /resume/analysis returns cached analysis without re-running Gemini
    const cachedAnalysisRes = await request(app)
      .get('/api/v1/student/resume/analysis')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(cachedAnalysisRes.status === 200, 'GET /resume/analysis returns cached analysis')
    assert(cachedAnalysisRes.body.data.analysis !== null, 'Cached analysis exists')
    assert(
      cachedAnalysisRes.body.data.analysis.overallScore === analysis.overallScore,
      'Cached overallScore matches initial analysis'
    )

    // Test 10: Status transitions: Active resume status is now COMPLETED
    const updatedResumeGet = await request(app)
      .get('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(
      updatedResumeGet.body.data.resume.analysisStatus === ResumeAnalysisStatus.COMPLETED,
      'Resume analysisStatus updated to COMPLETED'
    )
    assert(Boolean(updatedResumeGet.body.data.resume.lastAnalyzedAt), 'lastAnalyzedAt timestamp populated')

    // Test 11: Zod Schema verification: Invalid outputs are rejected
    const invalidAiOutput = {
      overallScore: 150, // Invalid: exceeds 100
      sectionScores: {
        summary: 80,
        experience: 90,
        projects: -5, // Invalid: negative
        skills: 80,
        education: 85,
        certifications: 70,
        formatting: 80,
      },
      strengths: [],
      weaknesses: [],
      atsRecommendations: [],
    }
    const zodCheck = ResumeAnalysisOutputSchema.safeParse(invalidAiOutput)
    assert(zodCheck.success === false, 'Zod strictly rejects out-of-range scores and missing arrays')

    // Test 12: Uploading a new version increments version to 2 and resets status to NOT_ANALYZED
    const v2Res = await request(app)
      .post('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'alex_johnson_resume_v2.pdf',
        fileUrl: '/uploads/resumes/alex_johnson_resume_v2.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 195,
      })
    assert(v2Res.status === 201, 'Version 2 upload succeeds')
    assert(v2Res.body.data.resume.version === 2, 'Version auto-incremented to 2')
    assert(
      v2Res.body.data.resume.analysisStatus === ResumeAnalysisStatus.NOT_ANALYZED,
      'Version 2 analysisStatus is reset to NOT_ANALYZED'
    )

    // Test 13: Digital Twin Analytics incorporates resume state
    const analyticsRes = await request(app)
      .get('/api/v1/student/analytics')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(analyticsRes.status === 200, 'GET /analytics returns 200 with resume intelligence')
    assert(analyticsRes.body.data?.resume?.hasResume === true, 'Analytics hasResume is true')
    assert(analyticsRes.body.data?.resume?.version === 2, 'Analytics shows version 2')
    assert(
      typeof analyticsRes.body.data?.resume?.overallScore === 'number',
      'Analytics includes AI quality score'
    )

    // Test 14: Delete Resume cleans up resume and analysis
    const deleteRes = await request(app)
      .delete('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(deleteRes.status === 200, 'DELETE /resume succeeds')

    const postDeleteGet = await request(app)
      .get('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(postDeleteGet.body.data.hasResume === false, 'Resume has been deleted')

  } catch (error) {
    console.error('Fatal test error:', error)
    failed++
  } finally {
    await disconnectDatabase()
  }

  console.log('\n====================================================')
  console.log(`PHASE 7 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`)
  console.log('====================================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runResumeTests()
