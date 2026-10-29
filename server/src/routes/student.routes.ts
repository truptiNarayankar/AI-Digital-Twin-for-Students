import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { authorizeRoles } from '../middleware/role.middleware.js'
import { UserRole } from '../types/auth.types.js'
import { validateRequest } from '../middleware/validate.js'

// Controllers
import { StudentController } from '../controllers/student.controller.js'
import { AcademicController } from '../controllers/academic.controller.js'
import { SkillController } from '../controllers/skill.controller.js'
import { CodingProfileController } from '../controllers/codingProfile.controller.js'
import { ProjectController } from '../controllers/project.controller.js'
import { CertificationController } from '../controllers/certification.controller.js'
import { ResumeController } from '../controllers/resume.controller.js'
import { InterviewController } from '../controllers/interview.controller.js'
import { SkillGapController } from '../controllers/skill-gap.controller.js'
import { AnalyticsController } from '../controllers/analytics.controller.js'
import { PlacementController } from '../controllers/placement.controller.js'

// Validators
import {
  updateStudentProfileSchema,
  academicRecordSchema,
  updateAcademicRecordSchema,
  skillSchema,
  updateSkillSchema,
  codingProfileSchema,
  updateCodingProfileSchema,
  projectSchema,
  updateProjectSchema,
  certificationSchema,
  updateCertificationSchema,
  careerGoalsSchema,
  resumeSchema,
  createInterviewSchema,
  submitAnswerSchema,
} from '../validators/student.validator.js'
import {
  analyzeSkillGapSchema,
  generateLearningPathSchema,
  updateStageProgressSchema,
} from '../validators/skill-gap.validator.js'
import { assessPlacementSchema } from '../validators/placement.validator.js'
import path from 'node:path'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiError.js'

// Configure Multer for in-memory handling before storage/extraction
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_RESUME_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const allowedExts = ['.pdf', '.docx']
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ]

    if (allowedExts.includes(ext) || allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(ApiError.badRequest('Unsupported file type. Only PDF and DOCX documents are allowed.'))
    }
  },
})

// Rate limiter for expensive AI analysis requests (15 requests per 15 mins)
const aiAnalysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many resume analysis requests. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter for mock interview sessions and answer evaluations (60 requests per 15 mins)
const interviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Too many interview requests. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter for skill gap and learning path generation (15 requests per 15 mins)
const skillGapLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many skill gap or learning path requests. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter for placement readiness assessments (15 requests per 15 mins)
const placementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many placement assessment requests. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const router = Router()

// All student endpoints require authentication and STUDENT role
router.use(authenticate, authorizeRoles(UserRole.STUDENT))

// 1. Student Personal & Core Profile
router.get('/profile', StudentController.getProfile)
router.put('/profile', validateRequest(updateStudentProfileSchema), StudentController.updateProfile)

// 2. Career Goals & Preferred Roles
router.get('/career-goals', StudentController.getCareerGoals)
router.put('/career-goals', validateRequest(careerGoalsSchema), StudentController.updateCareerGoals)

// 3. Digital Twin Data Aggregator & Completeness
router.get('/digital-twin', StudentController.getDigitalTwin)

// 4. Academic Semester Records
router.get('/academic', AcademicController.getRecords)
router.post('/academic', validateRequest(academicRecordSchema), AcademicController.createRecord)
router.put('/academic/:id', validateRequest(updateAcademicRecordSchema), AcademicController.updateRecord)
router.delete('/academic/:id', AcademicController.deleteRecord)

// 5. Skills Matrix
router.get('/skills', SkillController.getSkills)
router.post('/skills', validateRequest(skillSchema), SkillController.createSkill)
router.put('/skills/:id', validateRequest(updateSkillSchema), SkillController.updateSkill)
router.delete('/skills/:id', SkillController.deleteSkill)

// 6. Coding Profiles
router.get('/coding-profiles', CodingProfileController.getProfiles)
router.post('/coding-profiles', validateRequest(codingProfileSchema), CodingProfileController.createProfile)
router.put(
  '/coding-profiles/:id',
  validateRequest(updateCodingProfileSchema),
  CodingProfileController.updateProfile
)
router.delete('/coding-profiles/:id', CodingProfileController.deleteProfile)

// 7. Projects Portfolio
router.get('/projects', ProjectController.getProjects)
router.post('/projects', validateRequest(projectSchema), ProjectController.createProject)
router.put('/projects/:id', validateRequest(updateProjectSchema), ProjectController.updateProject)
router.delete('/projects/:id', ProjectController.deleteProject)

// 8. Certifications
router.get('/certifications', CertificationController.getCertifications)
router.post('/certifications', validateRequest(certificationSchema), CertificationController.createCertification)
router.put(
  '/certifications/:id',
  validateRequest(updateCertificationSchema),
  CertificationController.updateCertification
)
router.delete('/certifications/:id', CertificationController.deleteCertification)

// 9. AI Resume Analyzer — Phase 7
router.get('/resume', ResumeController.getResume)
router.post(
  '/resume',
  (req, res, next) => {
    const contentType = req.headers['content-type'] || ''
    if (contentType.includes('multipart/form-data')) {
      return upload.single('resume')(req, res, next)
    }
    return validateRequest(resumeSchema)(req, res, next)
  },
  ResumeController.saveResume
)
router.delete('/resume', ResumeController.deleteResume)
router.post('/resume/analyze', aiAnalysisLimiter, ResumeController.analyzeResume)
router.get('/resume/analysis', ResumeController.getAnalysis)
router.post('/resume/reanalyze', aiAnalysisLimiter, ResumeController.reanalyzeResume)

// 10. Analytics — Phase 6
// Student resolved from req.user.id (JWT) — no arbitrary studentId parameter accepted
router.get('/analytics', AnalyticsController.getAnalytics)

// 11. AI Mock Interview System — Phase 8
router.post(
  '/interviews',
  interviewLimiter,
  validateRequest(createInterviewSchema),
  InterviewController.createSession
)
router.get('/interviews', InterviewController.getHistory)
router.get('/interviews/:id', InterviewController.getSession)
router.post(
  '/interviews/:id/answer',
  interviewLimiter,
  validateRequest(submitAnswerSchema),
  InterviewController.submitAnswer
)
router.post(
  '/interviews/:id/answers',
  interviewLimiter,
  validateRequest(submitAnswerSchema),
  InterviewController.submitAnswer
)
router.post('/interviews/:id/complete', interviewLimiter, InterviewController.completeInterview)
router.post('/interviews/:id/abandon', InterviewController.abandonInterview)
router.get('/interviews/:id/result', InterviewController.getResult)

// 12. AI Skill Gap Detection & Personalized Learning Path — Phase 9
router.post(
  '/skill-gap/analyze',
  skillGapLimiter,
  validateRequest(analyzeSkillGapSchema),
  SkillGapController.analyzeSkillGap
)
router.get('/skill-gap/latest', SkillGapController.getLatestSkillGap)
router.get('/skill-gap/history', SkillGapController.getSkillGapHistory)

router.post(
  '/learning-path/generate',
  skillGapLimiter,
  validateRequest(generateLearningPathSchema),
  SkillGapController.generateLearningPath
)
router.get('/learning-path', SkillGapController.getLearningPath)
router.put(
  '/learning-path/:id/stage/:stageNumber',
  validateRequest(updateStageProgressSchema),
  SkillGapController.updateStageProgress
)

// 13. AI Placement Readiness & Estimated Placement Probability — Phase 10
router.post(
  '/placement/assess',
  placementLimiter,
  validateRequest(assessPlacementSchema),
  PlacementController.assessPlacement
)
router.get('/placement/latest', PlacementController.getLatestAssessment)
router.get('/placement/history', PlacementController.getAssessmentHistory)
router.get('/placement/readiness', PlacementController.getReadinessSummary)

export const studentRoutes = router
