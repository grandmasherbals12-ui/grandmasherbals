import { createFileRoute } from '@tanstack/react-router'
import { SiteLayout } from '@/components/site/SiteLayout'

export const Route = createFileRoute('/assessment')({
  component: Assessment,
})

function Assessment() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl font-cormorant font-bold text-olive-900 mb-6 text-center">Begin Your Personalized Wellness Assessment</h1>
        <div className="max-w-4xl mx-auto">
          <p className="mb-10 text-stone-600 text-lg text-center leading-relaxed">
            Your wellness experience should be personalized. Our immersive wellness assessment is designed to help identify emotional stress patterns, nervous-system overload, environmental preferences, relaxation barriers, wellness goals, and restorative lifestyle opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-cormorant font-bold text-olive-900 mb-6 border-b border-stone-100 pb-4">Assessment Areas</h2>
              <ul className="space-y-3 text-stone-700">
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Stress & Emotional Wellness</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Sleep & Recovery</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Breath Awareness</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Digestive Wellness</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Relaxation Capacity</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Emotional Overload Patterns</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Environmental Comfort Preferences</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Focus & Mental Fatigue</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Wellness Lifestyle Habits</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Movement & Recovery</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Appetite & Lifestyle Awareness</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-olive-500"></span> Nervous-System Recovery</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-olive-200 bg-olive-50/50 p-8 shadow-sm">
              <h2 className="text-2xl font-cormorant font-bold text-olive-900 mb-6 border-b border-olive-200/60 pb-4">After Assessment, You May Receive:</h2>
              <ul className="space-y-3 text-stone-700">
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Recommended immersive environments</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Guided breath protocols</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Wellness-supportive recommendations</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Product suggestions</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Aromatherapy recommendations</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Sound immersion recommendations</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Relaxation experiences</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Integrative consultation options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
