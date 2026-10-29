process.env.NODE_ENV = 'test'
process.env.MOCK_GEMINI = 'true'

import request from 'supertest'
import { app } from '../src/app.js'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import { User } from '../src/models/User.js'
import { Student } from '../src/models/Student.js'
import { Interview } from '../src/models/Interview.js'
import { UserRole } from '../src/types/auth.types.js'
import { InterviewType, InterviewDifficulty, InterviewStatus } from '../src/types/index.js'

async function runInterviewTests() {
  console.log('\n====================================================')
  console.log('STARTING PHASE 8 AI MOCK INTERVIEW TESTS')
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

    const emailA = 'phase8.student.a@univ.edu'
    const emailB = 'phase8.student.b@univ.edu'

    // Clean up previous test runs
    const existingUsers = await User.find({ email: { $in: [emailA, emailB] } })
    const userIds = existingUsers.map((u) => u._id)
    const existingStudents = await Student.find({ userId: { $in: userIds } })
    const studentIds = existingStudents.map((s) => s._id)

    await Promise.all([
      User.deleteMany({ _id: { $in: userIds } }),
      Student.deleteMany({ _id: { $in: studentIds } }),
      Interview.deleteMany({ studentId: { $in: studentIds } }),
    ])

    // 1. Register Student A
    const regResA = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Jordan Lee',
        email: emailA,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.STUDENT,
        institutionId: 'INST-P8-001',
      })
    assert(regResA.status === 201, 'Student A registration succeeds', regResA.body.message)
    const tokenA = regResA.body.data.token

    // 2. Register Student B (for authorization isolation tests)
    const regResB = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Taylor Swift',
        email: emailB,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.STUDENT,
        institutionId: 'INST-P8-002',
      })
    assert(regResB.status === 201, 'Student B registration succeeds', regResB.body.message)
    const tokenB = regResB.body.data.token

    // 3. Unauthenticated access blocked
    const unauthRes = await request(app).get('/api/v1/student/interviews')
    assert(unauthRes.status === 401, 'Unauthenticated interview access is rejected with 401')

    // 4. Start interview session with 3 questions
    const startRes = await request(app)
      .post('/api/v1/student/interviews')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        interviewType: InterviewType.TECHNICAL,
        targetRole: 'Full Stack Engineer',
        difficulty: InterviewDifficulty.INTERMEDIATE,
        questionCount: 3,
      })

    assert(startRes.status === 201, 'Interview session initialized successfully', startRes.body.message)
    const interviewData = startRes.body.data.interview
    assert(Boolean(interviewData.sessionId), 'Session ID generated')
    assert(interviewData.status === InterviewStatus.IN_PROGRESS, 'Session status is IN_PROGRESS')
    assert(interviewData.questionCount === 3, 'Question count is 3')
    assert(interviewData.questions.length === 1, 'First question is pre-generated on start')

    const firstQuestion = interviewData.questions[0]
    assert(Boolean(firstQuestion.questionId), 'Question 1 has unique questionId')
    assert(Boolean(firstQuestion.questionText), 'Question 1 has questionText')
    assert(Boolean(firstQuestion.category), 'Question 1 has category')
    assert(Array.isArray(firstQuestion.expectedTopics), 'Question 1 has expectedTopics array')

    const sessionId = interviewData.sessionId

    // 5. Retrieve session by sessionId
    const getRes = await request(app)
      .get(`/api/v1/student/interviews/${sessionId}`)
      .set('Authorization', `Bearer ${tokenA}`)
    assert(getRes.status === 200, 'Session retrieved successfully by sessionId')
    assert(getRes.body.data.interview.sessionId === sessionId, 'Session ID matches requested ID')

    // 6. Student B cannot access Student A's session
    const forbiddenRes = await request(app)
      .get(`/api/v1/student/interviews/${sessionId}`)
      .set('Authorization', `Bearer ${tokenB}`)
    assert(
      forbiddenRes.status === 404,
      'Student B cannot access Student A session (isolated ownership)'
    )

    // 7. Submit answer to question 1
    const answer1Res = await request(app)
      .post(`/api/v1/student/interviews/${sessionId}/answer`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        questionId: firstQuestion.questionId,
        answer:
          'To design an efficient LRU caching layer, I would use a combination of a Hash Map for O(1) key lookups and a Doubly Linked List to maintain temporal access ordering. When a key is accessed or updated, its node is detached and moved to the head. When capacity is exceeded, the tail node is evicted. For concurrency, fine-grained striped mutex locks or Read-Write locks can protect partitions to prevent bottlenecks.',
      })

    assert(answer1Res.status === 200, 'Answer 1 submitted and evaluated successfully')
    const answer1Data = answer1Res.body.data
    assert(
      typeof answer1Data.evaluatedQuestion.answerScore === 'number',
      'Answer 1 received evaluation score'
    )
    assert(
      answer1Data.evaluatedQuestion.answerScore >= 60,
      'Answer 1 scored well on expected topics'
    )
    assert(
      Boolean(answer1Data.evaluatedQuestion.answerFeedback),
      'Answer 1 received constructive feedback'
    )
    assert(
      Array.isArray(answer1Data.evaluatedQuestion.strengths),
      'Answer 1 strengths returned'
    )
    assert(
      Boolean(answer1Data.nextQuestion),
      'Next question (Question 2) was generated and returned'
    )
    assert(answer1Data.isCompleted === false, 'Session is not yet completed after 1 of 3')

    const secondQuestion = answer1Data.nextQuestion

    // 8. Prevent duplicate answer on already answered question
    const dupRes = await request(app)
      .post(`/api/v1/student/interviews/${sessionId}/answer`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        questionId: firstQuestion.questionId,
        answer: 'Trying to answer again to game the score.',
      })
    assert(
      dupRes.status === 400,
      'Duplicate answer to same question is rejected with 400 Bad Request'
    )

    // 9. Submit answer to question 2
    const answer2Res = await request(app)
      .post(`/api/v1/student/interviews/${sessionId}/answer`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        questionId: secondQuestion.questionId,
        answer:
          'Vertical scaling adds compute resources like CPU and RAM to a single database node, avoiding network latency and partitioning complexity but hitting physical hardware limits. Horizontal scaling partitions or shards data across distributed nodes, providing high availability and near-unlimited scale at the cost of network latency and eventual consistency under the CAP theorem.',
      })
    assert(answer2Res.status === 200, 'Answer 2 submitted successfully')
    assert(Boolean(answer2Res.body.data.nextQuestion), 'Question 3 generated')

    const thirdQuestion = answer2Res.body.data.nextQuestion

    // 10. Submit answer to question 3 (final question)
    const answer3Res = await request(app)
      .post(`/api/v1/student/interviews/${sessionId}/answer`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        questionId: thirdQuestion.questionId,
        answer:
          'To prevent cascading failures across microservices, I implement the Circuit Breaker pattern to fail fast when downstream services become unresponsive, accompanied by exponential backoff with randomized jitter to prevent thundering herd retries. Bulkheading isolates thread pools, and fallback responses provide graceful degradation.',
      })
    assert(answer3Res.status === 200, 'Answer 3 submitted successfully')
    assert(answer3Res.body.data.isCompleted === true, 'All questions answered (isCompleted = true)')

    // 11. Complete interview and synthesize final evaluation report
    const completeRes = await request(app)
      .post(`/api/v1/student/interviews/${sessionId}/complete`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({})

    assert(completeRes.status === 200, 'Interview completed and finalized successfully')
    const finalSession = completeRes.body.data.interview
    assert(finalSession.status === InterviewStatus.COMPLETED, 'Session status is COMPLETED')
    assert(typeof finalSession.overallScore === 'number', 'Overall score calculated')
    assert(finalSession.overallScore > 0, 'Overall score is positive')
    assert(Boolean(finalSession.categoryScores), 'Category scores object present')
    assert(
      Array.isArray(finalSession.strengths) && finalSession.strengths.length > 0,
      'Strengths array generated'
    )
    assert(
      Array.isArray(finalSession.weaknesses) && finalSession.weaknesses.length > 0,
      'Areas for improvement / weaknesses generated'
    )
    assert(
      Array.isArray(finalSession.recommendations) && finalSession.recommendations.length > 0,
      'Actionable recommendations generated'
    )
    assert(Boolean(finalSession.feedback), 'Comprehensive synthesis feedback generated')

    // 12. Fetch interview result report
    const resultRes = await request(app)
      .get(`/api/v1/student/interviews/${sessionId}/result`)
      .set('Authorization', `Bearer ${tokenA}`)
    assert(resultRes.status === 200, 'Result report fetched successfully via /result endpoint')
    assert(resultRes.body.data.interview.sessionId === sessionId, 'Result belongs to session')

    // 13. Fetch student interview history
    const historyRes = await request(app)
      .get('/api/v1/student/interviews')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(historyRes.status === 200, 'History retrieved successfully')
    assert(Array.isArray(historyRes.body.data.interviews), 'Interviews is an array')
    assert(historyRes.body.data.interviews.length >= 1, 'History contains completed session')

    // 14. Abandon session functionality
    const sessionToAbandon = await request(app)
      .post('/api/v1/student/interviews')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        interviewType: InterviewType.BEHAVIORAL,
        targetRole: 'Engineering Lead',
        difficulty: InterviewDifficulty.ADVANCED,
        questionCount: 3,
      })
    const abandonId = sessionToAbandon.body.data.interview.sessionId

    const abandonRes = await request(app)
      .post(`/api/v1/student/interviews/${abandonId}/abandon`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({})
    assert(abandonRes.status === 200, 'Session abandoned successfully')
    assert(abandonRes.body.data.interview.status === InterviewStatus.ABANDONED, 'Status is ABANDONED')

    // 15. Verify Analytics integration reflects interview performance
    const analyticsRes = await request(app)
      .get('/api/v1/student/analytics')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(analyticsRes.status === 200, 'Analytics retrieved')
    const interviewsAnalytics = analyticsRes.body.data.interviews
    assert(Boolean(interviewsAnalytics), 'Analytics includes interviews section')
    assert(interviewsAnalytics.hasData === true, 'interviews.hasData is true')
    assert(interviewsAnalytics.completedInterviews >= 1, 'completedInterviews count >= 1')
    assert(
      typeof interviewsAnalytics.averageScore === 'number',
      'interviews.averageScore is calculated'
    )
    assert(
      Array.isArray(interviewsAnalytics.scoreProgression) &&
        interviewsAnalytics.scoreProgression.length >= 1,
      'interviews.scoreProgression contains completed sessions'
    )

    // 16. Verify Digital Twin aggregation includes interviews
    const twinRes = await request(app)
      .get('/api/v1/student/digital-twin')
      .set('Authorization', `Bearer ${tokenA}`)
    assert(twinRes.status === 200, 'Digital Twin summary retrieved')
    assert(Array.isArray(twinRes.body.data.interviews), 'Digital Twin data includes interviews array')
    assert(twinRes.body.data.interviews.length >= 2, 'Digital twin contains both sessions')

    // Clean up test data
    await Promise.all([
      User.deleteMany({ _id: { $in: userIds } }),
      Student.deleteMany({ _id: { $in: studentIds } }),
      Interview.deleteMany({ studentId: { $in: studentIds } }),
    ])
  } catch (err) {
    console.error('Test run failed with error:', err)
    failed++
  } finally {
    await disconnectDatabase()
  }

  console.log('\n----------------------------------------------------')
  console.log(`INTERVIEW TESTS SUMMARY: ${passed} PASSED, ${failed} FAILED`)
  console.log('----------------------------------------------------\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runInterviewTests()
