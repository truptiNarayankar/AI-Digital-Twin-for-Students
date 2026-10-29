import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const authUser = await login({ email, password, rememberMe })

      // Check if user was redirected from a protected route
      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname

      if (destination && destination !== '/login' && destination !== '/register') {
        navigate(destination, { replace: true })
        return
      }

      // Default role-based routing
      if (authUser.role === 'PLACEMENT_OFFICER') {
        navigate('/officer/dashboard', { replace: true })
      } else if (authUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/student/dashboard', { replace: true })
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: AI Digital Twin Branding / Visual */}
      <motion.div
        className="hidden lg:flex lg:col-span-6 flex-col justify-center pr-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 w-fit mb-6">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Intelligent Student Portal</span>
        </div>

        <h2 className="text-display font-extrabold text-foreground font-display leading-tight">
          Welcome Back to Your <span className="text-gradient-primary">Career Twin</span>
        </h2>

        <p className="mt-4 text-body text-foreground-muted leading-relaxed max-w-md">
          Sign in to inspect your updated placement readiness, sync your latest coding challenges,
          and track AI-recommended skill paths.
        </p>

        {/* Feature highlight bullets */}
        <div className="mt-8 space-y-3.5">
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Real-time sync with coursework, coding, & academics</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>JWT Session security with Argon2id encryption</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Role-isolated student analytics & privacy protection</span>
          </div>
        </div>

        <div className="mt-10 p-4 rounded-2xl bg-surface-raised border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-foreground-muted">
            <span className="font-semibold text-foreground block">Verified Backend Authentication</span>
            Live Node.js + Express + MongoDB authorization engine with RBAC enforcement.
          </div>
        </div>
      </motion.div>

      {/* Right Column: Login Card */}
      <motion.div
        className="lg:col-span-6 w-full max-w-md mx-auto"
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
              <h3 className="text-h2 font-bold text-foreground font-display">Sign In</h3>
              <Badge variant="primary" size="sm">Phase 4 Active</Badge>
            </div>
            <p className="text-body-sm text-foreground-muted mt-1">
              Enter your credentials to access your Digital Twin dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-danger/10 border border-danger/25 text-danger text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            {/* Controls: Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground-muted hover:text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-surface-raised"
                />
                <span>Remember me</span>
              </label>

              <span className="text-xs text-foreground-subtle">
                Secure Session
              </span>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                className="w-full text-sm font-bold shadow-lg shadow-primary/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Create Account Link */}
          <div className="mt-6 text-center text-xs text-foreground-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
