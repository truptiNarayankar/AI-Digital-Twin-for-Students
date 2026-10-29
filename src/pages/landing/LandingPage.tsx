import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { ShowcaseSection } from './components/ShowcaseSection'
import { PersonalizedAiSection } from './components/PersonalizedAiSection'
import { CareerGrowthSection } from './components/CareerGrowthSection'
import { BenefitsSection } from './components/BenefitsSection'
import { FinalCtaSection } from './components/FinalCtaSection'

export function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ShowcaseSection />
      <PersonalizedAiSection />
      <CareerGrowthSection />
      <BenefitsSection />
      <FinalCtaSection />
    </div>
  )
}
