import { Settings } from 'lucide-react'
import { PlaceholderPage } from '@/pages/common/PlaceholderPage'

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Platform Settings"
      description="Account preferences, linked coding accounts (GitHub, LeetCode), privacy settings, and notifications will appear here."
      icon={<Settings className="w-8 h-8 text-foreground-muted" />}
      tag="Preferences"
      highlights={[
        'Connected platforms OAuth token management and auto-sync intervals',
        'Theme configuration, motion preferences, and accessibility overrides',
        'Placement cell data sharing toggles and anonymized recruiter visibility',
      ]}
    />
  )
}
