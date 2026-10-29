export type InterviewType =
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'HR'
  | 'SYSTEM_DESIGN'
  | 'MIXED'

export type InterviewDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export type InterviewStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ABANDONED'

export interface InterviewQuestion {
  questionId: string
  questionNumber: number
  category: string
  questionText: string
  expectedTopics: string[]
  studentAnswer?: string
  answerScore?: number
  answerFeedback?: string
  strengths: string[]
  improvements: string[]
  missingTopics: string[]
  answeredAt?: string
}

export interface InterviewCategoryScores {
  technical?: number
  communication?: number
  problemSolving?: number
  behavioral?: number
  situational?: number
  [key: string]: number | undefined
}

export interface InterviewSession {
  _id: string
  sessionId: string
  studentId: string
  interviewType: InterviewType
  type?: InterviewType
  targetRole: string
  difficulty: InterviewDifficulty
  questionCount: number
  currentQuestionIndex: number
  status: InterviewStatus
  questions: InterviewQuestion[]
  overallScore?: number
  categoryScores?: InterviewCategoryScores
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  feedback?: string
  startedAt: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateInterviewPayload {
  interviewType?: InterviewType
  targetRole: string
  difficulty?: InterviewDifficulty
  questionCount?: number
}

export interface SubmitAnswerPayload {
  questionId?: string
  answer: string
}

export interface SubmitAnswerResponse {
  session: InterviewSession
  evaluatedQuestion: InterviewQuestion
  nextQuestion: InterviewQuestion | null
  isCompleted: boolean
}
