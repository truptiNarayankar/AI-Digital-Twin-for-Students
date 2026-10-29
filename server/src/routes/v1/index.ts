import { Router, type Request, type Response } from 'express'
import { ApiResponse } from '../../utils/apiResponse.js'
import { authRoutes } from '../auth.routes.js'
import { studentRoutes } from '../student.routes.js'
import { authenticate } from '../../middleware/auth.middleware.js'
import { authorizeRoles, requireStudentSelf } from '../../middleware/role.middleware.js'
import { UserRole } from '../../types/auth.types.js'
import { OfficerController } from '../../controllers/officer.controller.js'

const router = Router()

// Helper to create module stub routers for clean architecture
function createModuleStubRouter(moduleName: string): Router {
  const modRouter = Router()
  modRouter.all('*', (req: Request, res: Response) => {
    ApiResponse.success(
      res,
      `${moduleName} API module initialized (Architecture Ready)`,
      {
        module: moduleName,
        endpoint: `${req.method} ${req.originalUrl}`,
        status: 'READY_FOR_NEXT_PHASE',
      },
      200
    )
  })
  return modRouter
}

// ============================================================
// API v1 ROUTE DEFINITIONS & MODULAR ROUTING ARCHITECTURE
// ============================================================

// Base API v1 status
router.get('/', (_req: Request, res: Response) => {
  ApiResponse.success(res, 'AI Digital Twin API v1 Gateway', {
    version: 'v1',
    modules: [
      'auth',
      'students',
      'academics',
      'skills',
      'coding',
      'projects',
      'certifications',
      'aptitude',
      'interviews',
      'resumes',
      'digital-twin',
      'ai',
      'notifications',
      'admin',
    ],
  })
})

// Real Phase 4 Authentication Routes
router.use('/auth', authRoutes)

// Role-Based Access Control Protected Routes (Phase 4 Foundation)
router.get(
  '/students/me/dashboard',
  authenticate,
  authorizeRoles(UserRole.STUDENT),
  (req: Request, res: Response) => {
    ApiResponse.success(res, 'Student dashboard access authorized.', {
      studentId: req.user?.id,
      name: req.user?.name,
      role: req.user?.role,
    })
  }
)

// Student Data Isolation Endpoint (Phase 4 Requirement)
router.get(
  '/students/:studentId/record',
  authenticate,
  requireStudentSelf('studentId'),
  (req: Request, res: Response) => {
    ApiResponse.success(res, 'Student record accessed successfully.', {
      requestedStudentId: req.params.studentId,
      authenticatedUserId: req.user?.id,
      authenticatedUserRole: req.user?.role,
    })
  }
)

router.get(
  '/officers/analytics',
  authenticate,
  authorizeRoles(UserRole.PLACEMENT_OFFICER, UserRole.ADMIN),
  OfficerController.getCohortAnalytics
)

router.get(
  '/admin/system-stats',
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  (req: Request, res: Response) => {
    ApiResponse.success(res, 'Admin system stats access authorized.', {
      adminId: req.user?.id,
      role: req.user?.role,
    })
  }
)

// Phase 5 Student Profile & Digital Twin Data Foundation
router.use('/student', studentRoutes)
router.use('/students', studentRoutes)

// Modular Stubs for remaining Phase 6+ components
router.use('/academics', createModuleStubRouter('Academics'))
router.use('/skills', createModuleStubRouter('Skills'))
router.use('/coding', createModuleStubRouter('Coding Profiles'))
router.use('/projects', createModuleStubRouter('Projects'))
router.use('/certifications', createModuleStubRouter('Certifications'))
router.use('/aptitude', createModuleStubRouter('Aptitude'))
router.use('/interviews', createModuleStubRouter('Interviews'))
router.use('/resumes', createModuleStubRouter('Resumes'))
router.use('/digital-twin', createModuleStubRouter('Digital Twin'))
router.use('/ai', createModuleStubRouter('AI Services'))
router.use('/notifications', createModuleStubRouter('Notifications'))
router.use('/admin', createModuleStubRouter('Admin'))

export const v1Routes = router
