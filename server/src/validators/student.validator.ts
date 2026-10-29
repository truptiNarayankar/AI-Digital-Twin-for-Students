import { z } from 'zod'
import {
  SkillCategory,
  SkillProficiency,
  SkillSource,
  CodingPlatform,
  ProjectType,
  ProjectStatus,
  InterviewType,
  InterviewDifficulty,
} from '../types/index.js'

export const updateStudentProfileSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().trim().optional(),
    college: z.string().trim().min(2).max(150).optional(),
    department: z.string().trim().min(2).max(100).optional(),
    degree: z.string().trim().min(2).max(50).optional(),
    specialization: z.string().trim().optional(),
    graduationYear: z.number().int().min(2020).max(2040).optional(),
    currentSemester: z.number().int().min(1).max(12).optional(),
    cgpa: z
      .number({ invalid_type_error: 'CGPA must be a valid number' })
      .min(0, 'CGPA cannot be negative')
      .max(10, 'CGPA cannot exceed 10.0')
      .optional(),
    location: z.string().trim().optional(),
    bio: z.string().trim().max(1000).optional(),
    profilePhoto: z.string().trim().optional(),
    careerGoal: z.string().trim().max(300).optional(),
    preferredJobRoles: z.array(z.string().trim()).optional(),
    preferredLocations: z.array(z.string().trim()).optional(),
    preferredDomains: z.array(z.string().trim()).optional(),
  }),
})

export const academicRecordSchema = z.object({
  body: z.object({
    semester: z.number({ required_error: 'Semester is required' }).int().min(1).max(12),
    academicYear: z.string().trim().optional(),
    cgpa: z
      .number({ required_error: 'CGPA is required' })
      .min(0, 'CGPA cannot be negative')
      .max(10, 'CGPA cannot exceed 10.0'),
    percentage: z.number().min(0).max(100).optional(),
    backlogs: z.number().int().min(0).default(0),
    attendance: z.number().min(0).max(100).optional(),
    subjects: z
      .array(
        z.object({
          name: z.string().trim().min(1, 'Subject name is required'),
          code: z.string().trim().optional(),
          marks: z.number().min(0).max(100).optional(),
          grade: z.string().trim().optional(),
          credits: z.number().min(0).max(20).optional(),
        })
      )
      .optional()
      .default([]),
  }),
})

export const updateAcademicRecordSchema = z.object({
  body: z.object({
    semester: z.number().int().min(1).max(12).optional(),
    academicYear: z.string().trim().optional(),
    cgpa: z.number().min(0).max(10).optional(),
    percentage: z.number().min(0).max(100).optional(),
    backlogs: z.number().int().min(0).optional(),
    attendance: z.number().min(0).max(100).optional(),
    subjects: z
      .array(
        z.object({
          name: z.string().trim().min(1),
          code: z.string().trim().optional(),
          marks: z.number().min(0).max(100).optional(),
          grade: z.string().trim().optional(),
          credits: z.number().min(0).max(20).optional(),
        })
      )
      .optional(),
  }),
})

export const skillSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Skill name is required' }).trim().min(1).max(100),
    category: z.nativeEnum(SkillCategory).default(SkillCategory.PROGRAMMING),
    proficiency: z.nativeEnum(SkillProficiency).default(SkillProficiency.INTERMEDIATE),
    yearsOfExperience: z.number().min(0).default(1),
    source: z.nativeEnum(SkillSource).default(SkillSource.SELF_REPORTED),
  }),
})

export const updateSkillSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),
    category: z.nativeEnum(SkillCategory).optional(),
    proficiency: z.nativeEnum(SkillProficiency).optional(),
    yearsOfExperience: z.number().min(0).optional(),
    source: z.nativeEnum(SkillSource).optional(),
  }),
})

export const codingProfileSchema = z.object({
  body: z.object({
    platform: z.nativeEnum(CodingPlatform, {
      required_error: 'Coding platform is required',
    }),
    username: z.string({ required_error: 'Username is required' }).trim().min(1),
    profileUrl: z.string().trim().optional(),
    problemsSolved: z.number().int().min(0).default(0),
    contestsParticipated: z.number().int().min(0).default(0),
    rating: z.number().min(0).optional(),
    highestRating: z.number().min(0).optional(),
    easySolved: z.number().int().min(0).default(0),
    mediumSolved: z.number().int().min(0).default(0),
    hardSolved: z.number().int().min(0).default(0),
  }),
})

export const updateCodingProfileSchema = z.object({
  body: z.object({
    username: z.string().trim().min(1).optional(),
    profileUrl: z.string().trim().optional(),
    problemsSolved: z.number().int().min(0).optional(),
    contestsParticipated: z.number().int().min(0).optional(),
    rating: z.number().min(0).optional(),
    highestRating: z.number().min(0).optional(),
    easySolved: z.number().int().min(0).optional(),
    mediumSolved: z.number().int().min(0).optional(),
    hardSolved: z.number().int().min(0).optional(),
  }),
})

export const projectSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Project title is required' }).trim().min(2).max(150),
    description: z
      .string({ required_error: 'Project description is required' })
      .trim()
      .min(5)
      .max(2000),
    technologies: z
      .array(z.string().trim())
      .min(1, 'Please specify at least one technology'),
    role: z.string().trim().default('Full-Stack Developer'),
    projectType: z.nativeEnum(ProjectType).default(ProjectType.PERSONAL),
    githubUrl: z.string().trim().optional(),
    liveUrl: z.string().trim().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.nativeEnum(ProjectStatus).default(ProjectStatus.COMPLETED),
    teamSize: z.number().int().min(1).default(1),
    highlights: z.array(z.string().trim()).optional().default([]),
  }),
})

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().min(5).max(2000).optional(),
    technologies: z.array(z.string().trim()).min(1).optional(),
    role: z.string().trim().optional(),
    projectType: z.nativeEnum(ProjectType).optional(),
    githubUrl: z.string().trim().optional(),
    liveUrl: z.string().trim().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
    teamSize: z.number().int().min(1).optional(),
    highlights: z.array(z.string().trim()).optional(),
  }),
})

export const certificationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Certification name is required' }).trim().min(2).max(150),
    issuingOrganization: z
      .string({ required_error: 'Issuing organization is required' })
      .trim()
      .min(2)
      .max(150),
    issuer: z.string().trim().optional(),
    credentialId: z.string().trim().optional(),
    credentialUrl: z.string().trim().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    skills: z.array(z.string().trim()).optional().default([]),
  }),
})

export const updateCertificationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150).optional(),
    issuingOrganization: z.string().trim().min(2).max(150).optional(),
    issuer: z.string().trim().optional(),
    credentialId: z.string().trim().optional(),
    credentialUrl: z.string().trim().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    skills: z.array(z.string().trim()).optional(),
  }),
})

export const careerGoalsSchema = z.object({
  body: z.object({
    careerGoal: z.string().trim().max(300).optional().default(''),
    preferredJobRoles: z.array(z.string().trim()).optional().default([]),
    preferredDomains: z.array(z.string().trim()).optional().default([]),
    preferredLocations: z.array(z.string().trim()).optional().default([]),
  }),
})

export const resumeSchema = z.object({
  body: z.object({
    fileName: z.string({ required_error: 'File name is required' }).trim().min(1),
    fileUrl: z.string({ required_error: 'File URL is required' }).trim().min(1),
    fileType: z.string().trim().default('application/pdf'),
    fileSize: z.number().min(0).optional(),
  }),
})

export const createInterviewSchema = z.object({
  body: z.object({
    interviewType: z.nativeEnum(InterviewType).optional().default(InterviewType.TECHNICAL),
    targetRole: z.string().trim().min(2, 'Target role must be at least 2 characters').max(120),
    difficulty: z.nativeEnum(InterviewDifficulty).optional().default(InterviewDifficulty.INTERMEDIATE),
    questionCount: z.number().int().min(1).max(20).optional().default(5),
  }),
})

export const submitAnswerSchema = z.object({
  body: z.object({
    questionId: z.string().optional(),
    answer: z.string().trim().min(2, 'Answer cannot be empty').max(10000, 'Answer exceeds maximum allowed length'),
  }),
})

