import type { SidebarItem, DemoProfile, SkillData, ChartDataPoint, TimelineStep, FeatureCard, BenefitItem } from '@/types'

// ============================================================
// STUDENT SIDEBAR NAVIGATION
// ============================================================
export const STUDENT_NAV_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', path: '/student/dashboard', iconName: 'LayoutDashboard' },
  { label: 'Digital Twin', path: '/student/digital-twin', iconName: 'Brain' },
  { label: 'Analytics', path: '/student/analytics', iconName: 'BarChart3' },
  { label: 'My Profile', path: '/student/profile', iconName: 'User' },
  { label: 'Academics', path: '/student/academics', iconName: 'GraduationCap' },
  { label: 'Coding', path: '/student/coding', iconName: 'Code2' },
  { label: 'Projects', path: '/student/projects', iconName: 'FolderKanban' },
  { label: 'Certifications', path: '/student/certifications', iconName: 'Award' },
  { label: 'Skill Gap', path: '/student/skill-gap', iconName: 'Target' },
  { label: 'Career', path: '/student/career', iconName: 'TrendingUp' },
  { label: 'Learning Path', path: '/student/learning', iconName: 'BookOpen' },
  { label: 'Resume Analyzer', path: '/student/resume', iconName: 'FileText' },
  { label: 'Mock Interview', path: '/student/interview', iconName: 'MessageSquare' },
  { label: 'Placement Readiness', path: '/student/placement', iconName: 'Compass' },
  { label: 'AI Mentor', path: '/student/mentor', iconName: 'Sparkles' },
  { label: 'Settings', path: '/student/settings', iconName: 'Settings' },
]

// ============================================================
// ROUTES
// ============================================================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    DIGITAL_TWIN: '/student/digital-twin',
    ANALYTICS: '/student/analytics',
    PROFILE: '/student/profile',
    ACADEMICS: '/student/academics',
    CODING: '/student/coding',
    PROJECTS: '/student/projects',
    CERTIFICATIONS: '/student/certifications',
    SKILL_GAP: '/student/skill-gap',
    CAREER: '/student/career',
    LEARNING: '/student/learning',
    RESUME: '/student/resume',
    INTERVIEW: '/student/interview',
    PLACEMENT: '/student/placement',
    MENTOR: '/student/mentor',
    SETTINGS: '/student/settings',
  },
  OFFICER: {
    DASHBOARD: '/officer/dashboard',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
} as const

// ============================================================
// DEMO DATA
// ============================================================
export const DEMO_PROFILE: DemoProfile = {
  name: 'Alex Johnson',
  role: 'student',
  college: 'Tech University',
  branch: 'Computer Science Engineering',
  year: '3rd Year',
  cgpa: 8.7,
  placementReadiness: 78,
  skillGapScore: 65,
  resumeScore: 84,
  interviewScore: 72,
  codingScore: 86,
  twinHealth: 88,
  placementProbability: 82,
}

export const DEMO_SKILLS: SkillData[] = [
  { name: 'Data Structures', value: 86, fullMark: 100 },
  { name: 'Algorithms', value: 80, fullMark: 100 },
  { name: 'Full-Stack Web', value: 92, fullMark: 100 },
  { name: 'System Design', value: 68, fullMark: 100 },
  { name: 'Communication', value: 75, fullMark: 100 },
  { name: 'Problem Solving', value: 84, fullMark: 100 },
]

export const DEMO_PERFORMANCE_DATA: ChartDataPoint[] = [
  { name: 'Jan', value: 62, coding: 58, academic: 75 },
  { name: 'Feb', value: 66, coding: 64, academic: 76 },
  { name: 'Mar', value: 70, coding: 70, academic: 77 },
  { name: 'Apr', value: 73, coding: 74, academic: 79 },
  { name: 'May', value: 72, coding: 76, academic: 80 },
  { name: 'Jun', value: 78, coding: 82, academic: 82 },
  { name: 'Jul', value: 82, coding: 85, academic: 85 },
  { name: 'Aug', value: 88, coding: 89, academic: 87 },
]

export const DEMO_SKILL_DISTRIBUTION: ChartDataPoint[] = [
  { name: 'Technical', value: 40 },
  { name: 'Coding', value: 25 },
  { name: 'Soft Skills', value: 20 },
  { name: 'Domain', value: 15 },
]

// ============================================================
// TIMELINE STEPS (HOW IT WORKS - EXACT PROMPT TEXT)
// ============================================================
export const HOW_IT_WORKS_STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Build Your Profile',
    description: 'Academic records, coding performance, projects, certifications, resume and interview data.',
  },
  {
    number: '02',
    title: 'Create Your Digital Twin',
    description: 'Your information becomes a dynamic digital representation of your career profile.',
  },
  {
    number: '03',
    title: 'AI Analyzes Your Profile',
    description: 'The system analyzes strengths, weaknesses, skills and career readiness.',
  },
  {
    number: '04',
    title: 'Discover What To Improve',
    description: 'Identify skill gaps and areas requiring attention with precision.',
  },
  {
    number: '05',
    title: 'Take Personalized Action',
    description: 'Get recommendations, learning paths and career guidance to reach your goals.',
  },
]

// ============================================================
// FEATURES (EXACT PROMPT REQUIREMENTS)
// ============================================================
export const FEATURES: FeatureCard[] = [
  {
    icon: 'Brain',
    title: 'AI Placement Readiness',
    description: 'Understand your current career readiness through intelligent analysis of your academic and professional profile.',
    gradient: 'from-primary/20 to-accent/10',
  },
  {
    icon: 'Target',
    title: 'Skill Gap Detection',
    description: 'Identify the technical and soft skills you need to strengthen for your target career.',
    gradient: 'from-secondary/20 to-primary/10',
  },
  {
    icon: 'BookOpen',
    title: 'Personalized Learning',
    description: 'Follow a learning path based on your current skills, weaknesses, and career goals.',
    gradient: 'from-success/20 to-secondary/10',
  },
  {
    icon: 'FileText',
    title: 'AI Resume Analysis',
    description: 'Get intelligent feedback on your resume and discover areas that can be improved.',
    gradient: 'from-accent/20 to-warning/10',
  },
  {
    icon: 'MessageSquare',
    title: 'AI Mock Interviews',
    description: 'Practice interviews and receive personalized feedback on your performance.',
    gradient: 'from-warning/20 to-danger/10',
  },
  {
    icon: 'TrendingUp',
    title: 'Career Recommendations',
    description: 'Discover career directions aligned with your skills, interests, and performance.',
    gradient: 'from-primary/20 to-secondary/10',
  },
]

// ============================================================
// CAREER GROWTH PROGRESSION STAGES
// ============================================================
export const CAREER_GROWTH_STEPS = [
  { step: '01', title: 'Current Profile', desc: 'Baseline academic & skill metrics', icon: 'UserCheck' },
  { step: '02', title: 'Skill Gaps', desc: 'Identified deficit zones vs targets', icon: 'Search' },
  { step: '03', title: 'Learning', desc: 'Targeted curricula & labs', icon: 'GraduationCap' },
  { step: '04', title: 'Practice', desc: 'Mock interviews & code challenges', icon: 'Code' },
  { step: '05', title: 'Improved Performance', desc: 'Higher readiness benchmarks', icon: 'TrendingUp' },
  { step: '06', title: 'Placement Ready', desc: 'Top-tier candidate profile', icon: 'Award' },
]

// ============================================================
// BENEFITS (EXACT PROMPT REQUIREMENTS)
// ============================================================
export const BENEFITS: BenefitItem[] = [
  { icon: 'Zap', title: 'Understand your strengths', description: 'Uncover your strongest technical and soft skill competencies with empirical AI analysis.' },
  { icon: 'Target', title: 'Discover your skill gaps', description: 'Pinpoint the missing technologies and knowledge required for your dream companies.' },
  { icon: 'LineChart', title: 'Track your progress', description: 'Observe real-time telemetry on how every project and test elevates your profile score.' },
  { icon: 'Award', title: 'Improve placement readiness', description: 'Systematically elevate your probability of securing high-tier campus offers.' },
  { icon: 'Compass', title: 'Get personalized guidance', description: 'Receive precision AI mentoring that adapts to your learning pace and career aspirations.' },
  { icon: 'ShieldCheck', title: 'Build career confidence', description: 'Face technical rounds and HR interviews fully verified and validated by your Digital Twin.' },
]

// ============================================================
// DIGITAL TWIN DIMENSIONS
// ============================================================
export const TWIN_DIMENSIONS = [
  { id: 'academic', label: 'Academic', angle: 0, color: '#818cf8', score: 87, icon: 'GraduationCap' },
  { id: 'coding', label: 'Coding', angle: 51.4, color: '#22d3ee', score: 86, icon: 'Code2' },
  { id: 'projects', label: 'Projects', angle: 102.8, color: '#a78bfa', score: 78, icon: 'FolderKanban' },
  { id: 'skills', label: 'Skills', angle: 154.2, color: '#34d399', score: 84, icon: 'Sparkles' },
  { id: 'resume', label: 'Resume', angle: 205.6, color: '#fbbf24', score: 84, icon: 'FileText' },
  { id: 'interview', label: 'Interview', angle: 257, color: '#f87171', score: 72, icon: 'MessageSquare' },
  { id: 'career', label: 'Career', angle: 308.4, color: '#fb923c', score: 80, icon: 'TrendingUp' },
] as const
