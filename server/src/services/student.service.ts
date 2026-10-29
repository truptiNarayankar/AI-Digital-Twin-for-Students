import { Student, type IStudent } from '../models/Student.js'
import { User } from '../models/User.js'
import { AcademicRecord, type IAcademicRecord } from '../models/AcademicRecord.js'
import { Skill } from '../models/Skill.js'
import { CodingProfile, type ICodingProfile } from '../models/CodingProfile.js'
import { Project } from '../models/Project.js'
import { Certification } from '../models/Certification.js'
import { Resume } from '../models/Resume.js'
import { Interview } from '../models/Interview.js'
import { SkillGapAnalysis } from '../models/SkillGapAnalysis.js'
import { LearningPath } from '../models/LearningPath.js'
import { PlacementAssessment } from '../models/PlacementAssessment.js'
import { ApiError } from '../utils/apiError.js'
import {
  CodingPlatform,
  ProjectStatus,
  ProjectType,
  SkillCategory,
  SkillProficiency,
  SkillSource,
} from '../types/index.js'

export interface CompletenessMetrics {
  profileCompletionPercentage: number
  academicRecordsCount: number
  skillsCount: number
  projectsCount: number
  certificationsCount: number
  codingProfilesCount: number
  resumeUploaded: boolean
  checklist: Array<{
    key: string
    label: string
    completed: boolean
    weight: number
  }>
}

export interface DigitalTwinAggregation {
  profile: IStudent
  academics: unknown[]
  skills: unknown[]
  codingProfiles: unknown[]
  projects: unknown[]
  certifications: unknown[]
  resume: unknown | null
  interviews: unknown[]
  skillGap?: unknown | null
  learningPath?: unknown | null
  placement?: unknown | null
  careerGoals: {
    careerGoal: string
    preferredJobRoles: string[]
    preferredDomains: string[]
    preferredLocations: string[]
  }
  completeness: CompletenessMetrics
}

export class StudentService {
  private static normalizeStudentProfile(student: IStudent) {
    const raw = student.toObject ? student.toObject() : { ...student }

    return {
      ...raw,
      id: raw._id ? raw._id.toString() : raw.id,
      phoneNumber: raw.phone ?? '',
      avatarUrl: raw.profilePhoto ?? '',
      preferredRoles: raw.preferredJobRoles || raw.preferredRoles || [],
      preferredJobRoles: raw.preferredJobRoles || raw.preferredRoles || [],
      preferredDomains: raw.preferredDomains || [],
      preferredLocations: raw.preferredLocations || [],
    }
  }

  private static normalizeAcademicRecord(record: IAcademicRecord) {
    const raw = record.toObject()

    return {
      ...raw,
      id: String(raw._id),
      sgpa: raw.sgpa ?? 0,
      totalCredits: raw.totalCredits ?? 0,
      remarks: raw.remarks ?? '',
      subjects: Array.isArray(raw.subjects) ? raw.subjects : [],
    }
  }

  private static normalizeCodingProfile(profile: ICodingProfile) {
    const raw = profile.toObject()
    const breakdown = {
      easy: raw.easySolved ?? 0,
      medium: raw.mediumSolved ?? 0,
      hard: raw.hardSolved ?? 0,
    }

    return {
      ...raw,
      id: String(raw._id),
      handle: raw.username || '',
      username: raw.username || '',
      profileUrl: raw.profileUrl || '',
      problemsSolved: raw.problemsSolved ?? 0,
      breakdown,
      contestCount: raw.contestsParticipated ?? 0,
      isManual: raw.isManual ?? true,
    }
  }

  private static async seedStarterData(student: IStudent, user: { name: string; email: string }) {
    const currentYear = new Date().getFullYear()

    const hasAcademicRecord = await AcademicRecord.exists({ studentId: student._id })
    if (!hasAcademicRecord) {
      await AcademicRecord.create({
        studentId: student._id,
        semester: student.currentSemester || 6,
        academicYear: `${currentYear - 1}-${currentYear}`,
        sgpa: student.cgpa || 8.7,
        cgpa: student.cgpa || 8.7,
        percentage: 87,
        backlogs: 0,
        totalCredits: 22,
        remarks: 'Strong academic foundation and consistent performance.',
        subjects: [
          { name: 'Data Structures', code: 'CS101', marks: 88, grade: 'A', credits: 4 },
          { name: 'Operating Systems', code: 'CS201', marks: 90, grade: 'A+', credits: 4 },
          { name: 'Database Management', code: 'CS210', marks: 86, grade: 'A', credits: 4 },
          { name: 'Web Development', code: 'CS240', marks: 89, grade: 'A', credits: 3 },
        ],
      })
    }

    if ((await Skill.countDocuments({ studentId: student._id })) < 3) {
      await Skill.create([
        {
          studentId: student._id,
          name: 'TypeScript',
          category: SkillCategory.PROGRAMMING,
          proficiency: SkillProficiency.ADVANCED,
          yearsOfExperience: 2,
          source: SkillSource.SELF_REPORTED,
          verified: true,
        },
        {
          studentId: student._id,
          name: 'React',
          category: SkillCategory.WEB_DEVELOPMENT,
          proficiency: SkillProficiency.ADVANCED,
          yearsOfExperience: 2,
          source: SkillSource.SELF_REPORTED,
          verified: true,
        },
        {
          studentId: student._id,
          name: 'Node.js',
          category: SkillCategory.WEB_DEVELOPMENT,
          proficiency: SkillProficiency.INTERMEDIATE,
          yearsOfExperience: 2,
          source: SkillSource.PROJECT,
          verified: true,
        },
      ])
    }

    if ((await CodingProfile.countDocuments({ studentId: student._id })) === 0) {
      await CodingProfile.create({
        studentId: student._id,
        platform: CodingPlatform.LEETCODE,
        username: user.name.toLowerCase().replace(/\s+/g, '') || 'student-dev',
        profileUrl: 'https://leetcode.com/profile',
        problemsSolved: 220,
        contestsParticipated: 12,
        easySolved: 130,
        mediumSolved: 70,
        hardSolved: 20,
        rating: 1600,
        isManual: true,
      })
    }

    if ((await Project.countDocuments({ studentId: student._id })) === 0) {
      await Project.create({
        studentId: student._id,
        title: 'AI Placement Dashboard',
        description: 'Built a student placement platform with student profile, skill tracking, coding profiles, and project portfolio management.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
        role: 'Full-Stack Developer',
        projectType: ProjectType.PERSONAL,
        githubUrl: 'https://github.com/example/student-placement-dashboard',
        liveUrl: 'https://example.com/demo',
        status: ProjectStatus.COMPLETED,
        teamSize: 1,
        highlights: ['Responsive dashboard', 'Career readiness tracking', 'Portfolio and skill management'],
      })
    }

    if ((await Certification.countDocuments({ studentId: student._id })) === 0) {
      await Certification.create({
        studentId: student._id,
        name: 'AWS Cloud Practitioner',
        issuingOrganization: 'Amazon Web Services',
        issueDate: new Date(),
        credentialId: 'AWS-CP-101',
        skills: ['Cloud', 'AWS'],
        verified: true,
      })
    }

    if (!student.careerGoal && !student.preferredJobRoles?.length) {
      student.careerGoal = 'Software Engineer'
      student.preferredJobRoles = ['Software Engineer', 'Full Stack Developer']
      student.preferredLocations = ['Bengaluru', 'Hyderabad']
      student.preferredDomains = ['Web Development', 'Product Engineering']
      student.profileCompletion = 75
      await student.save()
    }
  }

  /**
   * Resolves or auto-initializes a Student profile for an authenticated User.
   */
  static async getOrCreateStudent(userId: string): Promise<IStudent> {
    let student = await Student.findOne({ userId })
    if (!student) {
      const user = await User.findById(userId)
      if (!user) {
        throw ApiError.notFound('Associated user account was not found.')
      }

      const generatedId = `STU-${userId.slice(-6).toUpperCase()}`
      const currentYear = new Date().getFullYear()

      student = await Student.create({
        userId,
        studentId: generatedId,
        fullName: user.name,
        email: user.email,
        college: 'University Institute of Technology',
        department: 'Computer Science & Engineering',
        degree: 'B.Tech',
        graduationYear: currentYear + 1,
        currentSemester: 6,
        cgpa: 8.7,
        careerGoal: 'Software Engineer',
        preferredJobRoles: ['Software Engineer', 'Full Stack Developer'],
        preferredLocations: ['Bengaluru', 'Hyderabad'],
        preferredDomains: ['Web Development', 'Product Engineering'],
        profileCompletion: 25,
      })
    }

    await this.seedStarterData(student, { name: student.fullName || 'Student', email: student.email })
    return student
  }

  /**
   * Retrieves the authenticated student's profile.
   */
  static async getProfile(userId: string): Promise<IStudent> {
    return await this.getOrCreateStudent(userId)
  }

  /**
   * Updates student personal and academic information.
   */
  static async updateProfile(userId: string, data: Partial<IStudent>): Promise<IStudent> {
    const student = await this.getOrCreateStudent(userId)

    // Apply allowed updates
    const allowedFields: (keyof IStudent)[] = [
      'fullName',
      'phone',
      'dateOfBirth',
      'gender',
      'college',
      'department',
      'degree',
      'specialization',
      'graduationYear',
      'currentSemester',
      'cgpa',
      'location',
      'bio',
      'profilePhoto',
      'careerGoal',
      'preferredJobRoles',
      'preferredLocations',
      'preferredDomains',
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(student as any)[field] = data[field]
      }
    }

    await student.save()
    return student
  }

  /**
   * Updates career goals and aspiration settings.
   */
  static async updateCareerGoals(
    userId: string,
    data: {
      careerGoal?: string
      preferredJobRoles?: string[]
      preferredDomains?: string[]
      preferredLocations?: string[]
    }
  ): Promise<IStudent> {
    const student = await this.getOrCreateStudent(userId)

    if (data.careerGoal !== undefined) student.careerGoal = data.careerGoal
    if (data.preferredJobRoles !== undefined) student.preferredJobRoles = data.preferredJobRoles
    if (data.preferredDomains !== undefined) student.preferredDomains = data.preferredDomains
    if (data.preferredLocations !== undefined) student.preferredLocations = data.preferredLocations

    await student.save()
    return student
  }

  /**
   * Aggregates the complete Digital Twin data foundation and calculates deterministic completeness.
   */
  static async getDigitalTwinSummary(userId: string): Promise<DigitalTwinAggregation> {
    const student = await this.getOrCreateStudent(userId)
    const studentId = student._id

    // Parallel retrieval of continuous data vectors
    const [
      academics,
      skills,
      codingProfiles,
      projects,
      certifications,
      resume,
      interviews,
      skillGap,
      learningPath,
      placement,
    ] = await Promise.all([
      AcademicRecord.find({ studentId }).sort({ semester: 1 }),
      Skill.find({ studentId }).sort({ category: 1, name: 1 }),
      CodingProfile.find({ studentId }).sort({ platform: 1 }),
      Project.find({ studentId }).sort({ createdAt: -1 }),
      Certification.find({ studentId }).sort({ issueDate: -1 }),
      Resume.findOne({ studentId }).sort({ createdAt: -1 }),
      Interview.find({ studentId }).sort({ createdAt: -1 }),
      SkillGapAnalysis.findOne({ studentId }).sort({ analyzedAt: -1 }),
      LearningPath.findOne({ studentId }).sort({ updatedAt: -1 }),
      PlacementAssessment.findOne({ studentId }).sort({ generatedAt: -1 }),
    ])

    // Transparent, Deterministic Completeness Calculation
    const isPersonalComplete = Boolean(
      student.fullName &&
        student.department &&
        student.degree &&
        student.graduationYear &&
        student.cgpa > 0
    )
    const isAcademicsComplete = academics.length >= 1
    const isSkillsComplete = skills.length >= 3
    const isProjectsComplete = projects.length >= 1
    const isCodingComplete = codingProfiles.length >= 1
    const isCertsComplete = certifications.length >= 1
    const isCareerComplete = Boolean(
      student.careerGoal && student.preferredJobRoles && student.preferredJobRoles.length > 0
    )
    const isResumeUploaded = Boolean(resume)

    const checklist = [
      { key: 'personal', label: 'Personal & Academic Profile', completed: isPersonalComplete, weight: 25 },
      { key: 'academics', label: 'Semester Academic Records', completed: isAcademicsComplete, weight: 15 },
      { key: 'skills', label: 'Technical & Soft Skills (3+)', completed: isSkillsComplete, weight: 15 },
      { key: 'projects', label: 'Project Portfolio (1+)', completed: isProjectsComplete, weight: 15 },
      { key: 'coding', label: 'Coding Platforms Linked', completed: isCodingComplete, weight: 10 },
      { key: 'certifications', label: 'Industry Certifications', completed: isCertsComplete, weight: 10 },
      { key: 'career', label: 'Career Goals & Preferred Roles', completed: isCareerComplete, weight: 10 },
    ]

    const profileCompletionPercentage = checklist.reduce(
      (acc, item) => (item.completed ? acc + item.weight : acc),
      0
    )

    // Save updated completion score to student record
    if (student.profileCompletion !== profileCompletionPercentage) {
      student.profileCompletion = profileCompletionPercentage
      await student.save()
    }

    const completeness: CompletenessMetrics = {
      profileCompletionPercentage,
      academicRecordsCount: academics.length,
      skillsCount: skills.length,
      projectsCount: projects.length,
      certificationsCount: certifications.length,
      codingProfilesCount: codingProfiles.length,
      resumeUploaded: isResumeUploaded,
      checklist,
    }

    return {
      profile: this.normalizeStudentProfile(student),
      academics: academics.map((record) => this.normalizeAcademicRecord(record)),
      skills,
      codingProfiles: codingProfiles.map((profile) => this.normalizeCodingProfile(profile)),
      projects,
      certifications,
      resume,
      interviews,
      skillGap,
      learningPath,
      placement,
      careerGoals: {
        careerGoal: student.careerGoal || '',
        preferredJobRoles: student.preferredJobRoles || [],
        preferredDomains: student.preferredDomains || [],
        preferredLocations: student.preferredLocations || [],
      },
      completeness,
    }
  }
}
