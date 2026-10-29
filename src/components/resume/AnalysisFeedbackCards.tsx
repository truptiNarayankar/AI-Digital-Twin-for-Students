import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { ResumeAnalysis } from '@/types/resume'
import {
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Tag,
  Code2,
} from 'lucide-react'

interface AnalysisFeedbackCardsProps {
  analysis: ResumeAnalysis
}

export function AnalysisFeedbackCards({ analysis }: AnalysisFeedbackCardsProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'ats' | 'sections'>('suggestions')

  return (
    <div className="space-y-6">
      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 border-emerald-500/20 bg-emerald-950/5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display">Identified Strengths</h3>
              <p className="text-[11px] text-foreground-muted">Grounded elements that boost recruiter impression</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {analysis.strengths.map((str, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-emerald-500/10 text-xs text-foreground leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Areas to Improve */}
        <Card className="p-6 border-amber-500/20 bg-amber-950/5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display">Areas to Improve</h3>
              <p className="text-[11px] text-foreground-muted">Critical gaps impacting clarity or technical depth</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {analysis.weaknesses.map((weak, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-amber-500/10 text-xs text-foreground leading-relaxed"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{weak}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Missing / Weak Sections Alert if present */}
      {analysis.missingSections && analysis.missingSections.length > 0 && (
        <Card className="p-5 border-rose-500/30 bg-rose-950/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground font-display">
                Missing or Underdeveloped Resume Sections
              </h4>
              <p className="text-xs text-foreground-muted mt-0.5">
                Technical recruiters standardly look for these dedicated sections. Adding them improves structural completeness:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {analysis.missingSections.map((sec, i) => (
                  <Badge key={i} variant="danger" size="sm" className="gap-1 font-medium">
                    <span>-</span> {sec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab Navigation for Deep Dive */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'suggestions'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          Actionable Suggestions ({analysis.improvementSuggestions?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('ats')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'ats'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          ATS-Oriented Recommendations ({analysis.atsRecommendations?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'sections'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Keywords & Skills Detected
        </button>
      </div>

      {/* Tab Content: Actionable Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 ? (
            analysis.improvementSuggestions.map((sug, idx) => (
              <Card key={idx} className="p-5 border-border/80 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {sug.section}
                    </Badge>
                    <span className="text-xs font-bold text-foreground">Deficiency & Solution</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>

                <div className="mt-3 space-y-2">
                  <div className="text-xs">
                    <span className="font-semibold text-rose-400">Observed Issue: </span>
                    <span className="text-foreground-muted">{sug.problem}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-400">Recommended Change: </span>
                    <span className="text-foreground">{sug.suggestion}</span>
                  </div>

                  {(sug.exampleBefore || sug.exampleAfter) && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/50 text-[11px]">
                      {sug.exampleBefore && (
                        <div className="p-3 rounded-lg bg-surface border border-rose-500/20">
                          <span className="font-bold text-rose-400 block mb-1">Before:</span>
                          <span className="text-foreground-muted italic font-mono">
                            "{sug.exampleBefore}"
                          </span>
                        </div>
                      )}
                      {sug.exampleAfter && (
                        <div className="p-3 rounded-lg bg-surface border border-emerald-500/20">
                          <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                            <ArrowRight className="w-3 h-3" />
                            Suggested Direction:
                          </span>
                          <span className="text-foreground font-medium font-mono">
                            "{sug.exampleAfter}"
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center text-foreground-muted text-xs">
              No specific itemized suggestions generated.
            </Card>
          )}
        </div>
      )}

      {/* Tab Content: ATS Recommendations */}
      {activeTab === 'ats' && (
        <div className="space-y-4">
          {/* Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-foreground">ATS Readability Notice</h4>
              <p className="text-[11px] text-foreground-muted mt-0.5 leading-relaxed">
                These recommendations are intended to improve ATS-oriented readability and keyword alignment. They do not guarantee ATS acceptance.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.atsRecommendations.map((rec, i) => (
              <Card key={i} className="p-4 flex items-start gap-3 text-xs text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                  {i + 1}
                </div>
                <span className="leading-relaxed">{rec}</span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Detected Skills & Keywords */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-primary" />
              Technical & Core Skills Detected in Document
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsDetected && analysis.skillsDetected.length > 0 ? (
                analysis.skillsDetected.map((skill, i) => (
                  <Badge key={i} variant="primary" size="sm" className="font-mono">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-foreground-muted">No explicit skills parsed.</span>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-secondary" />
              Role-Relevant Industry Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords && analysis.keywords.length > 0 ? (
                analysis.keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary" size="sm">
                    {kw}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-foreground-muted">No keywords indexed.</span>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
