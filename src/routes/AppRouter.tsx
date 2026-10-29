import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { StudentLayout } from '@/layouts/StudentLayout'
import { OfficerLayout } from '@/layouts/OfficerLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Route Protectors
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'

// Public Pages
import { LandingPage } from '@/pages/landing/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard'
import { DigitalTwinPage } from '@/pages/student/DigitalTwinPage'
import { ProfilePage } from '@/pages/student/ProfilePage'
import { AcademicsPage } from '@/pages/student/AcademicsPage'
import { CodingPage } from '@/pages/student/CodingPage'
import { ProjectsPage } from '@/pages/student/ProjectsPage'
import { CertificationsPage } from '@/pages/student/CertificationsPage'
import { SkillGapPage } from '@/pages/student/SkillGapPage'
import { CareerPage } from '@/pages/student/CareerPage'
import { LearningPage } from '@/pages/student/LearningPage'
import { ResumePage } from '@/pages/student/ResumePage'
import { InterviewPage } from '@/pages/student/InterviewPage'
import { ActiveInterviewPage } from '@/pages/student/ActiveInterviewPage'
import { InterviewResultPage } from '@/pages/student/InterviewResultPage'
import { MentorPage } from '@/pages/student/MentorPage'
import { SettingsPage } from '@/pages/student/SettingsPage'
import { AnalyticsPage } from '@/pages/student/AnalyticsPage'
import { PlacementReadinessPage } from '@/pages/student/PlacementReadinessPage'

// Officer & Admin Pages
import { OfficerDashboard } from '@/pages/officer/OfficerDashboard'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth Routes with PublicOnlyRoute (redirects to dashboard if already authenticated) */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Authenticated Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* STUDENT Protected Routes (Strictly for STUDENT role) */}
          <Route element={<RoleProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="digital-twin" element={<DigitalTwinPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="academics" element={<AcademicsPage />} />
              <Route path="coding" element={<CodingPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="certifications" element={<CertificationsPage />} />
              <Route path="skill-gap" element={<SkillGapPage />} />
              <Route path="career" element={<CareerPage />} />
              <Route path="learning" element={<LearningPage />} />
              <Route path="learning-path" element={<Navigate to="/student/learning" replace />} />
              <Route path="resume" element={<ResumePage />} />
              <Route path="interview" element={<InterviewPage />} />
              <Route path="interview/:id" element={<ActiveInterviewPage />} />
              <Route path="interview/:id/result" element={<InterviewResultPage />} />
              <Route path="placement" element={<PlacementReadinessPage />} />
              <Route path="placement-readiness" element={<Navigate to="/student/placement" replace />} />
              <Route path="mentor" element={<MentorPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>

          {/* PLACEMENT OFFICER Protected Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']} />}>
            <Route path="/officer" element={<OfficerLayout />}>
              <Route index element={<Navigate to="/officer/dashboard" replace />} />
              <Route path="dashboard" element={<OfficerDashboard />} />
            </Route>
          </Route>

          {/* ADMIN Protected Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
