import { randomUUID } from 'node:crypto'
import { Interview, type IInterview, type IInterviewQuestion } from '../models/Interview.js'
import { StudentService } from './student.service.js'
import { InterviewAiService } from './interview-ai.service.js'
import { Skill } from '../models/Skill.js'
import { ApiError } from '../utils/apiError.js'
import { InterviewType, InterviewDifficulty, InterviewStatus } from '../types/index.js'
import { env } from '../config/env.js'

export interface CreateInterviewDto {
  interviewType?: InterviewType
  targetRole: string
  difficulty?: InterviewDifficulty
  questionCount?: number
}

export interface SubmitAnswerDto {
  questionId?: string
  answer: string
}

export class InterviewService {
  /**
   * Starts a new interview session and generates the first AI interview question.
   */
  static async createSession(userId: string, data: CreateInterviewDto): Promise<IInterview> {
    const student = await StudentService.getOrCreateStudent(userId)

    const interviewType = data.interviewType || InterviewType.TECHNICAL
    const difficulty = data.difficulty || InterviewDifficulty.INTERMEDIATE
    const targetRole = (data.targetRole || student.careerGoal || 'Software Engineer').trim()
    const questionCount = Math.min(20, Math.max(1, data.questionCount || 5))

    // Pull student skills and department for contextual AI generation
    const skillsList = await Skill.find({ studentId: student._id }).select('name')
    const studentSkills = skillsList.map((s) => s.name)

    const sessionId = `int_${Date.now()}_${randomUUID().slice(0, 8)}`

    // Create session skeleton
    const interview = new Interview({
      studentId: student._id,
      sessionId,
      interviewType,
      type: interviewType,
      targetRole,
      difficulty,
      questionCount,
      currentQuestionIndex: 0,
      status: InterviewStatus.IN_PROGRESS,
      questions: [],
      startedAt: new Date(),
      interviewDate: new Date(),
      aiModel: env.GEMINI_MODEL,
    })

    // Generate first question
    const firstQuestion = await InterviewAiService.generateQuestion(interview, 1, {
      department: student.department,
      skills: studentSkills,
    })

    interview.questions.push(firstQuestion)
    await interview.save()

    return interview
  }

  /**
   * Retrieves an interview session by sessionId or MongoDB _id, verifying student ownership.
   */
  static async getSession(userId: string, sessionIdOrId: string): Promise<IInterview> {
    const student = await StudentService.getOrCreateStudent(userId)

    const interview = await Interview.findOne({
      $or: [{ sessionId: sessionIdOrId }, { _id: sessionIdOrId.match(/^[0-9a-fA-F]{24}$/) ? sessionIdOrId : null }],
      studentId: student._id,
    })

    if (!interview) {
      throw ApiError.notFound('Interview session not found or access denied.')
    }

    return interview
  }

  /**
   * Submits an answer for the current question, evaluates it with AI, and loads/generates the next question.
   */
  static async submitAnswer(
    userId: string,
    sessionIdOrId: string,
    payload: SubmitAnswerDto
  ): Promise<{
    session: IInterview
    evaluatedQuestion: IInterviewQuestion
    nextQuestion: IInterviewQuestion | null
    isCompleted: boolean
  }> {
    const student = await StudentService.getOrCreateStudent(userId)

    const interview = await Interview.findOne({
      $or: [{ sessionId: sessionIdOrId }, { _id: sessionIdOrId.match(/^[0-9a-fA-F]{24}$/) ? sessionIdOrId : null }],
      studentId: student._id,
    })

    if (!interview) {
      throw ApiError.notFound('Interview session not found or access denied.')
    }

    if (interview.status !== InterviewStatus.IN_PROGRESS) {
      throw ApiError.badRequest(
        `Cannot submit answers to an interview with status: ${interview.status}`
      )
    }

    const answerText = payload.answer ? payload.answer.trim() : ''
    if (!answerText) {
      throw ApiError.badRequest('Answer text cannot be empty.')
    }

    // Determine target question
    let targetQuestionIndex = interview.currentQuestionIndex
    if (payload.questionId) {
      const foundIdx = interview.questions.findIndex((q) => q.questionId === payload.questionId)
      if (foundIdx !== -1) {
        targetQuestionIndex = foundIdx
      }
    }

    const currentQuestion = interview.questions[targetQuestionIndex]
    if (!currentQuestion) {
      throw ApiError.badRequest('Target question not found in interview session.')
    }

    if (currentQuestion.studentAnswer) {
      throw ApiError.badRequest('This question has already been answered and evaluated.')
    }

    // Evaluate answer with AI
    const evaluation = await InterviewAiService.evaluateAnswer(
      currentQuestion,
      answerText,
      interview.targetRole,
      interview.difficulty
    )

    // Save answer and evaluation on the question subdocument
    currentQuestion.studentAnswer = answerText
    currentQuestion.answerScore = evaluation.answerScore
    currentQuestion.answerFeedback = evaluation.answerFeedback
    currentQuestion.strengths = evaluation.strengths
    currentQuestion.improvements = evaluation.improvements
    currentQuestion.missingTopics = evaluation.missingTopics
    currentQuestion.answeredAt = new Date()

    let nextQuestion: IInterviewQuestion | null = null
    const answeredCount = interview.questions.filter((q) => Boolean(q.studentAnswer)).length

    // Check if we need to advance to next question
    if (answeredCount < interview.questionCount) {
      const nextQuestionNumber = answeredCount + 1
      interview.currentQuestionIndex = targetQuestionIndex + 1

      // Generate next question if not already prepared
      if (interview.questions.length < nextQuestionNumber) {
        const skillsList = await Skill.find({ studentId: student._id }).select('name')
        nextQuestion = await InterviewAiService.generateQuestion(interview, nextQuestionNumber, {
          department: student.department,
          skills: skillsList.map((s) => s.name),
        })
        interview.questions.push(nextQuestion)
      } else {
        nextQuestion = interview.questions[interview.currentQuestionIndex] || null
      }
    }

    await interview.save()

    return {
      session: interview,
      evaluatedQuestion: currentQuestion,
      nextQuestion,
      isCompleted: answeredCount >= interview.questionCount,
    }
  }

  /**
   * Finalizes the interview, synthesizes overall evaluation, category scores, and recommendations.
   */
  static async completeInterview(userId: string, sessionIdOrId: string): Promise<IInterview> {
    const student = await StudentService.getOrCreateStudent(userId)

    const interview = await Interview.findOne({
      $or: [{ sessionId: sessionIdOrId }, { _id: sessionIdOrId.match(/^[0-9a-fA-F]{24}$/) ? sessionIdOrId : null }],
      studentId: student._id,
    })

    if (!interview) {
      throw ApiError.notFound('Interview session not found or access denied.')
    }

    if (interview.status === InterviewStatus.COMPLETED) {
      return interview
    }

    const answeredQuestions = interview.questions.filter((q) => q.studentAnswer)
    if (answeredQuestions.length === 0) {
      throw ApiError.badRequest('Cannot complete an interview without answering at least one question.')
    }

    // Synthesize comprehensive evaluation
    const finalReport = await InterviewAiService.evaluateInterview(interview)

    interview.status = InterviewStatus.COMPLETED
    interview.overallScore = finalReport.overallScore
    interview.categoryScores = finalReport.categoryScores
    interview.strengths = finalReport.strengths
    interview.weaknesses = finalReport.weaknesses
    interview.recommendations = finalReport.recommendations
    interview.feedback = finalReport.feedback
    interview.completedAt = new Date()

    await interview.save()
    return interview
  }

  /**
   * Abandons an active interview session.
   */
  static async abandonInterview(userId: string, sessionIdOrId: string): Promise<IInterview> {
    const student = await StudentService.getOrCreateStudent(userId)

    const interview = await Interview.findOne({
      $or: [{ sessionId: sessionIdOrId }, { _id: sessionIdOrId.match(/^[0-9a-fA-F]{24}$/) ? sessionIdOrId : null }],
      studentId: student._id,
    })

    if (!interview) {
      throw ApiError.notFound('Interview session not found or access denied.')
    }

    if (interview.status === InterviewStatus.COMPLETED) {
      throw ApiError.badRequest('Cannot abandon a completed interview.')
    }

    interview.status = InterviewStatus.ABANDONED
    await interview.save()

    return interview
  }

  /**
   * Retrieves all interview sessions for the authenticated student.
   */
  static async getHistory(userId: string): Promise<IInterview[]> {
    const student = await StudentService.getOrCreateStudent(userId)

    return await Interview.find({ studentId: student._id }).sort({ createdAt: -1 })
  }

  /**
   * Retrieves completed interview results and detailed post-interview evaluation report.
   */
  static async getResult(userId: string, sessionIdOrId: string): Promise<IInterview> {
    const session = await this.getSession(userId, sessionIdOrId)

    if (session.status !== InterviewStatus.COMPLETED) {
      throw ApiError.badRequest('Interview session is not yet completed.')
    }

    return session
  }
}
