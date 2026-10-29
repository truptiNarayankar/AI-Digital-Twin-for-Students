import { Shield, Server, Cpu, Activity } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-bold text-foreground font-display">
              System Admin Console
            </h1>
            <Badge variant="demo" size="sm">DEMO VIEW</Badge>
          </div>
          <p className="text-body-sm text-foreground-muted mt-1">
            Global system health, AI inference telemetry, tenant configuration, and security audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" dot size="lg">
            All Systems Nominal
          </Badge>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Registered Users"
          value="1,240"
          change={15}
          subtext="Students & Faculty"
          icon={<Server className="w-5 h-5 text-primary" />}
          color="primary"
          isDemo
        />
        <StatCard
          label="Active Twin Instances"
          value="1,180"
          change={8}
          subtext="Neural models synced"
          icon={<Cpu className="w-5 h-5 text-secondary" />}
          color="secondary"
          isDemo
        />
        <StatCard
          label="API Pipeline Latency"
          value="42ms"
          change={-12}
          subtext="Optimized throughput"
          icon={<Activity className="w-5 h-5 text-success" />}
          color="success"
          isDemo
        />
        <StatCard
          label="System Health"
          value="99.98%"
          icon={<Shield className="w-5 h-5 text-accent" />}
          color="accent"
          isDemo
        />
      </div>

      <Card variant="default" className="p-8 rounded-3xl border-border text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto">
          <Shield className="w-7 h-7" />
        </div>
        <h3 className="text-h3 font-bold text-foreground font-display">
          System Administration Engine
        </h3>
        <p className="text-body-sm text-foreground-muted max-w-xl mx-auto leading-relaxed">
          The Admin dashboard will provide user lifecycle management, rate limits, enterprise security controls,
          and model parameter adjustments in future platform releases.
        </p>
        <div className="pt-2">
          <Badge variant="accent" size="md">
            Administrative Layer Protected
          </Badge>
        </div>
      </Card>
    </div>
  )
}
