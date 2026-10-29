import { Sparkles } from 'lucide-react'
import { PlaceholderPage } from '@/pages/common/PlaceholderPage'

export function MentorPage() {
  return (
    <PlaceholderPage
      title="AI Career Mentor"
      description="24/7 intelligent career advisor providing context-aware guidance based on your live Digital Twin model will appear here."
      icon={<Sparkles className="w-8 h-8 text-primary" />}
      tag="AI Advisory Vector"
      highlights={[
        'Interactive AI chat assistant calibrated specifically to your academic records',
        'Daily prioritized study goals and prompt answers for tricky interview concepts',
        'Campus placement calendar reminders and target company application prep',
      ]}
    />
  )
}
