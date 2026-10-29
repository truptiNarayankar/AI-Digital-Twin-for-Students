import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Lock,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'student' | 'officer'>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  // Calculate password strength visually
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'Empty', color: 'bg-border' }
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-danger' }
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-warning' }
      case 3:
        return { score: 75, label: 'Good', color: 'bg-secondary' }
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-success' }
      default:
        return { score: 10, label: 'Very Weak', color: 'bg-danger' }
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please complete all required fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one digit.')
      return
    }

    setLoading(true)
    setError('')

    const targetRole = role === 'officer' ? 'PLACEMENT_OFFICER' : 'STUDENT'

    try {
      await register({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: targetRole,
      })

      if (targetRole === 'PLACEMENT_OFFICER') {
        navigate('/officer/dashboard', { replace: true })
      } else {
        navigate('/student/dashboard', { replace: true })
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please check your details.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: AI Digital Twin Information */}
      <motion.div
        className="hidden lg:flex lg:col-span-5 flex-col justify-center pr-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 w-fit mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Twin Profile Genesis</span>
        </div>

        <h2 className="text-display font-extrabold text-foreground font-display leading-tight">
          Start Building Your <span className="text-gradient-secondary">Living Profile</span>
        </h2>

        <p className="mt-4 text-body text-foreground-muted leading-relaxed">
          Create your account to establish a continuous digital twin that models your performance
          and generates tailored guidance for placement triumph.
        </p>

        {/* Benefits list */}
        <div className="mt-8 space-y-4">
          <div className="p-4 rounded-2xl bg-surface border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">For Students</h4>
                <p className="text-xs text-foreground-muted">
                  Continuous readiness tracking, skill gap maps, & mentor recommendations.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">For Placement Officers</h4>
                <p className="text-xs text-foreground-muted">
                  Cohort readiness analytics, company skill match, & batch telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Register Card */}
      <motion.div
        className="lg:col-span-7 w-full max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card
          variant="default"
          className="p-8 sm:p-10 rounded-3xl border-border bg-surface/90 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Card Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-h2 font-bold text-foreground font-display">Create Account</h3>
              <Badge variant="primary" size="sm">Phase 4 Active</Badge>
            </div>
            <p className="text-body-sm text-foreground-muted mt-1">
              Select your role and enter your details to generate your twin.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-danger/10 border border-danger/25 text-danger text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Role Selection (Student or Placement Officer - Strict Protection against ADMIN) */}
          <div className="mb-6">
            <label className="text-label text-foreground-muted block mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all',
                  role === 'student'
                    ? 'bg-primary/15 border-primary text-primary shadow-sm'
                    : 'bg-surface-raised border-border text-foreground-muted hover:text-foreground'
                )}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('officer')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all',
                  role === 'officer'
                    ? 'bg-secondary/15 border-secondary text-secondary shadow-sm'
                    : 'bg-surface-raised border-border text-foreground-muted hover:text-foreground'
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Placement Officer</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {/* Password Strength Indicator UI Component */}
              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-foreground-subtle">Strength:</span>
                    <span className="font-semibold text-foreground">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-300', passwordStrength.color)}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            {/* Register CTA Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                className="w-full text-sm font-bold shadow-lg shadow-primary/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {loading
                  ? 'Generating Account...'
                  : `Create ${role === 'student' ? 'Student Twin' : 'Officer Account'}`}
              </Button>
            </div>
          </form>

          {/* Already have an account */}
          <div className="mt-6 text-center text-xs text-foreground-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
