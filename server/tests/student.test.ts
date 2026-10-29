import request from 'supertest'
import { app } from '../src/app.js'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import { User } from '../src/models/User.js'
import { Student } from '../src/models/Student.js'
import { AcademicRecord } from '../src/models/AcademicRecord.js'
import { Skill } from '../src/models/Skill.js'
import { CodingProfile } from '../src/models/CodingProfile.js'
import { Project } from '../src/models/Project.js'
import { Certification } from '../src/models/Certification.js'
import { Resume } from '../src/models/Resume.js'
import { UserRole } from '../src/types/auth.types.js'

async function runStudentTests() {
  console.log('\n====================================================')
  console.log('STARTING PHASE 5 STUDENT PROFILE & DIGITAL TWIN TESTS')
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

    const emailA = 'phase5.student.a@univ.edu'
    const emailB = 'phase5.student.b@univ.edu'
    const officerEmail = 'phase5.officer@univ.edu'

    // Clean up test data
    const existingUsers = await User.find({ email: { $in: [emailA, emailB, officerEmail] } })
    const userIds = existingUsers.map((u) => u._id)
    const existingStudents = await Student.find({ userId: { $in: userIds } })
    const studentIds = existingStudents.map((s) => s._id)

    await Promise.all([
      User.deleteMany({ _id: { $in: userIds } }),
      Student.deleteMany({ _id: { $in: studentIds } }),
      AcademicRecord.deleteMany({ studentId: { $in: studentIds } }),
      Skill.deleteMany({ studentId: { $in: studentIds } }),
      CodingProfile.deleteMany({ studentId: { $in: studentIds } }),
      Project.deleteMany({ studentId: { $in: studentIds } }),
      Certification.deleteMany({ studentId: { $in: studentIds } }),
      Resume.deleteMany({ studentId: { $in: studentIds } }),
    ])

    // Register Student A
    const regResA = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Alex Johnson',
        email: emailA,
        password: 'Password123!',
        role: UserRole.STUDENT,
      })
    const tokenA = regResA.body.data.token

    // Register Student B
    const regResB = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Bob Smith',
        email: emailB,
        password: 'Password123!',
        role: UserRole.STUDENT,
      })
    const tokenB = regResB.body.data.token

    // Register Placement Officer
    const regOfficer = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Officer Jane',
        email: officerEmail,
        password: 'Password123!',
        role: UserRole.PLACEMENT_OFFICER,
      })
    const officerToken = regOfficer.body.data.token

    // ============================================================
    // 1. Student Profile Retrieval & Auto-Initialization
    // ============================================================
    const getProfileRes = await request(app)
      .get('/api/v1/student/profile')
      .set('Authorization', `Bearer ${tokenA}`)

    assert(getProfileRes.status === 200, 'Case 1.1: GET /api/v1/student/profile returns 200 OK')
    assert(
      getProfileRes.body.data.student.fullName === 'Alex Johnson',
      'Case 1.2: Profile fullName initialized from User account'
    )
    assert(
      Boolean(getProfileRes.body.data.student.studentId),
      'Case 1.3: Unique studentId assigned'
    )

    // ============================================================
    // 2. Student Profile Update
    // ============================================================
    const updateProfileRes = await request(app)
      .put('/api/v1/student/profile')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        phone: '+1 555-0199',
        college: 'Apex Institute of Technology',
        department: 'Computer Science & Engineering',
        degree: 'B.Tech',
        graduationYear: 2026,
        currentSemester: 7,
        cgpa: 8.85,
        bio: 'Passionate full stack builder and algorithm enthusiast.',
      })

    assert(updateProfileRes.status === 200, 'Case 2.1: PUT /api/v1/student/profile returns 200 OK')
    assert(
      updateProfileRes.body.data.student.cgpa === 8.85,
      'Case 2.2: CGPA updated accurately'
    )
    assert(
      updateProfileRes.body.data.student.college === 'Apex Institute of Technology',
      'Case 2.3: College updated accurately'
    )

    // ============================================================
    // 3. Career Goals Retrieval & Update
    // ============================================================
    const updateCareerRes = await request(app)
      .put('/api/v1/student/career-goals')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        careerGoal: 'Principal Full Stack Architect at tier-1 tech firm',
        preferredJobRoles: ['Full Stack Engineer', 'Backend Specialist', 'Cloud Architect'],
        preferredDomains: ['Cloud Infrastructure', 'Distributed Systems'],
        preferredLocations: ['Bengaluru', 'Remote'],
      })

    assert(updateCareerRes.status === 200, 'Case 3.1: Career aspirations updated successfully')
    assert(
      updateCareerRes.body.data.careerGoals.preferredJobRoles.length === 3,
      'Case 3.2: Preferred roles recorded'
    )

    const getCareerRes = await request(app)
      .get('/api/v1/student/career-goals')
      .set('Authorization', `Bearer ${tokenA}`)

    assert(getCareerRes.status === 200, 'Case 3.3: Career aspirations retrieved successfully')
    assert(
      getCareerRes.body.data.careerGoals.preferredJobRoles.length === 3,
      'Case 3.4: Saved career roles returned'
    )

    // ============================================================
    // 4. CGPA Validation (Reject < 0 or > 10)
    // ============================================================
    const invalidCgpaRes = await request(app)
      .put('/api/v1/student/profile')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        cgpa: 10.5,
      })

    assert(
      invalidCgpaRes.status === 400,
      'Case 3.1: CGPA > 10 rejected with 400 Bad Request'
    )

    const negativeCgpaRes = await request(app)
      .put('/api/v1/student/profile')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        cgpa: -1,
      })

    assert(
      negativeCgpaRes.status === 400,
      'Case 3.2: Negative CGPA rejected with 400 Bad Request'
    )

    // ============================================================
    // 4. Academic Record CRUD & Semester Uniqueness
    // ============================================================
    const addAcadRes = await request(app)
      .post('/api/v1/student/academic')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        semester: 1,
        academicYear: '2022-2023',
        cgpa: 8.4,
        backlogs: 0,
        subjects: [
          { name: 'Data Structures', code: 'CS101', marks: 88, grade: 'A', credits: 4 },
          { name: 'Discrete Mathematics', code: 'MA101', marks: 82, grade: 'A', credits: 4 },
        ],
      })

    assert(addAcadRes.status === 201, 'Case 4.1: POST /api/v1/student/academic returns 201 Created')
    const academicRecordId = addAcadRes.body.data.record.id

    // Attempt duplicate semester
    const dupAcadRes = await request(app)
      .post('/api/v1/student/academic')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        semester: 1,
        cgpa: 8.5,
      })

    assert(
      dupAcadRes.status === 409,
      'Case 4.2: Duplicate semester academic record rejected with 409 Conflict'
    )

    // Update academic record
    const updateAcadRes = await request(app)
      .put(`/api/v1/student/academic/${academicRecordId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        cgpa: 8.6,
      })

    assert(updateAcadRes.status === 200, 'Case 4.3: Academic record updated successfully')
    assert(updateAcadRes.body.data.record.cgpa === 8.6, 'Case 4.4: CGPA updated in record')

    // ============================================================
    // 5. Skills CRUD
    // ============================================================
    const addSkillRes = await request(app)
      .post('/api/v1/student/skills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'TypeScript',
        category: 'PROGRAMMING',
        proficiency: 'ADVANCED',
        yearsOfExperience: 3,
      })

    assert(addSkillRes.status === 201, 'Case 5.1: POST /api/v1/student/skills returns 201 Created')
    const skillId = addSkillRes.body.data.skill.id

    // Add additional skills
    await request(app)
      .post('/api/v1/student/skills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'React',
        category: 'WEB_DEVELOPMENT',
        proficiency: 'ADVANCED',
      })

    await request(app)
      .post('/api/v1/student/skills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Node.js',
        category: 'WEB_DEVELOPMENT',
        proficiency: 'INTERMEDIATE',
      })

    // Duplicate skill name
    const dupSkillRes = await request(app)
      .post('/api/v1/student/skills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'TypeScript',
      })

    assert(dupSkillRes.status === 409, 'Case 5.2: Duplicate skill name rejected with 409 Conflict')

    // Update skill
    const updateSkillRes = await request(app)
      .put(`/api/v1/student/skills/${skillId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        proficiency: 'EXPERT',
      })

    assert(updateSkillRes.status === 200, 'Case 5.3: Skill updated successfully')
    assert(
      updateSkillRes.body.data.skill.proficiency === 'EXPERT',
      'Case 5.4: Skill proficiency changed to EXPERT'
    )

    // ============================================================
    // 6. Coding Profile CRUD
    // ============================================================
    const addCodingRes = await request(app)
      .post('/api/v1/student/coding-profiles')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        platform: 'LEETCODE',
        username: 'alex_codes',
        problemsSolved: 420,
        rating: 1850,
        easySolved: 150,
        mediumSolved: 220,
        hardSolved: 50,
      })

    assert(
      addCodingRes.status === 201,
      'Case 6.1: POST /api/v1/student/coding-profiles returns 201 Created'
    )
    const codingProfileId = addCodingRes.body.data.profile.id

    // Duplicate platform
    const dupPlatformRes = await request(app)
      .post('/api/v1/student/coding-profiles')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        platform: 'LEETCODE',
        username: 'another_user',
      })

    assert(
      dupPlatformRes.status === 409,
      'Case 6.2: Duplicate coding platform rejected with 409 Conflict'
    )

    // Update coding profile
    const updateCodingRes = await request(app)
      .put(`/api/v1/student/coding-profiles/${codingProfileId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        problemsSolved: 450,
      })

    assert(updateCodingRes.status === 200, 'Case 6.3: Coding profile updated')
    assert(
      updateCodingRes.body.data.profile.problemsSolved === 450,
      'Case 6.4: Problems solved updated'
    )

    // ============================================================
    // 7. Project Portfolio CRUD
    // ============================================================
    const addProjectRes = await request(app)
      .post('/api/v1/student/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Distributed File Storage Engine',
        description:
          'High throughput distributed storage engine built with Node.js and Raft consensus algorithm.',
        technologies: ['Node.js', 'TypeScript', 'Docker', 'MongoDB'],
        role: 'Lead Backend Engineer',
        projectType: 'PERSONAL',
        githubUrl: 'https://github.com/alex/storage-engine',
        status: 'COMPLETED',
        teamSize: 2,
      })

    assert(
      addProjectRes.status === 201,
      'Case 7.1: POST /api/v1/student/projects returns 201 Created'
    )
    const projectIdA = addProjectRes.body.data.project.id

    // Update project
    const updateProjRes = await request(app)
      .put(`/api/v1/student/projects/${projectIdA}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Distributed File Storage Engine v2',
      })

    assert(updateProjRes.status === 200, 'Case 7.2: Project updated successfully')

    // ============================================================
    // 8. Certification CRUD
    // ============================================================
    const addCertRes = await request(app)
      .post('/api/v1/student/certifications')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'AWS Certified Solutions Architect',
        issuingOrganization: 'Amazon Web Services',
        credentialId: 'AWS-ARCH-9901',
        skills: ['Cloud', 'AWS', 'Networking'],
      })

    assert(
      addCertRes.status === 201,
      'Case 8.1: POST /api/v1/student/certifications returns 201 Created'
    )
    const certId = addCertRes.body.data.certification.id

    // Update certification
    const updateCertRes = await request(app)
      .put(`/api/v1/student/certifications/${certId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        credentialId: 'AWS-ARCH-9902',
      })

    assert(updateCertRes.status === 200, 'Case 8.2: Certification updated')

    // ============================================================
    // 9. Resume Metadata
    // ============================================================
    const saveResumeRes = await request(app)
      .post('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'Alex_Johnson_Resume_2026.pdf',
        fileUrl: 'https://storage.university.edu/resumes/alex_2026.pdf',
        fileType: 'application/pdf',
      })

    assert(saveResumeRes.status === 201, 'Case 10.1: Resume metadata stored successfully')
    assert(saveResumeRes.body.data.resume.version === 1, 'Case 10.2: Resume version is 1')

    const getResumeRes = await request(app)
      .get('/api/v1/student/resume')
      .set('Authorization', `Bearer ${tokenA}`)

    assert(getResumeRes.status === 200, 'Case 10.3: GET /api/v1/student/resume returns metadata')
    assert(getResumeRes.body.data.hasResume === true, 'Case 10.4: hasResume flag is true')

    // ============================================================
    // 11. Digital Twin Aggregation & Completeness
    // ============================================================
    const twinRes = await request(app)
      .get('/api/v1/student/digital-twin')
      .set('Authorization', `Bearer ${tokenA}`)

    assert(twinRes.status === 200, 'Case 11.1: GET /api/v1/student/digital-twin returns 200 OK')
    assert(
      Array.isArray(twinRes.body.data.skills) && twinRes.body.data.skills.length === 3,
      'Case 11.2: Digital Twin aggregates skills accurately'
    )
    assert(
      Array.isArray(twinRes.body.data.projects) && twinRes.body.data.projects.length === 1,
      'Case 11.3: Digital Twin aggregates projects accurately'
    )
    assert(
      twinRes.body.data.completeness.profileCompletionPercentage === 100,
      'Case 11.4: All vectors filled yields 100% deterministic completeness'
    )
    assert(
      twinRes.body.data.completeness.resumeUploaded === true,
      'Case 11.5: Resume uploaded flag is true'
    )

    // ============================================================
    // 12. Student Data Isolation & Cross-Student Ownership Protection
    // ============================================================
    // Student B attempts to update Student A's project -> MUST BE FORBIDDEN (403)
    const crossProjUpdateRes = await request(app)
      .put(`/api/v1/student/projects/${projectIdA}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        title: 'Hacked Project Title',
      })

    assert(
      crossProjUpdateRes.status === 403,
      'Case 12.1: Student B is strictly FORBIDDEN from updating Student A project'
    )

    // Student B attempts to delete Student A's academic record -> MUST BE FORBIDDEN (403)
    const crossAcadDeleteRes = await request(app)
      .delete(`/api/v1/student/academic/${academicRecordId}`)
      .set('Authorization', `Bearer ${tokenB}`)

    assert(
      crossAcadDeleteRes.status === 403,
      'Case 12.2: Student B is strictly FORBIDDEN from deleting Student A academic record'
    )

    // Student B attempts to delete Student A's skill -> MUST BE FORBIDDEN (403)
    const crossSkillDeleteRes = await request(app)
      .delete(`/api/v1/student/skills/${skillId}`)
      .set('Authorization', `Bearer ${tokenB}`)

    assert(
      crossSkillDeleteRes.status === 403,
      'Case 12.3: Student B is strictly FORBIDDEN from deleting Student A skill'
    )

    // Placement Officer attempting to call /api/v1/student/profile -> MUST BE FORBIDDEN (STUDENT role required)
    const officerStudentAccessRes = await request(app)
      .get('/api/v1/student/profile')
      .set('Authorization', `Bearer ${officerToken}`)

    assert(
      officerStudentAccessRes.status === 403,
      'Case 12.4: Placement Officer is rejected from student mutation endpoints (STUDENT role required)'
    )

    // Clean up test data
    await Promise.all([
      User.deleteMany({ email: { $in: [emailA, emailB, officerEmail] } }),
      Student.deleteMany({ userId: { $in: [regResA.body.data.user.id, regResB.body.data.user.id] } }),
    ])

    console.log(`\n====================================================`)
    console.log(`Phase 5 Student Test Summary: ${passed} passed, ${failed} failed.`)
    console.log(`====================================================\n`)

    await disconnectDatabase()

    if (failed > 0) {
      process.exit(1)
    } else {
      process.exit(0)
    }
  } catch (error) {
    console.error('Fatal student test runner error:', error)
    await disconnectDatabase()
    process.exit(1)
  }
}

runStudentTests()
