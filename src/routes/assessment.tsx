import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/assessment')({
  component: Assessment,
})

function Assessment() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Begin Your Personalized Wellness Assessment</h1>
      <p className="mb-6">
        Your wellness experience should be personalized. Our immersive wellness assessment is designed to help identify emotional stress patterns, nervous-system overload, environmental preferences, relaxation barriers, wellness goals, and restorative lifestyle opportunities.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Assessment Areas</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Stress & Emotional Wellness</li>
            <li>Sleep & Recovery</li>
            <li>Breath Awareness</li>
            <li>Digestive Wellness</li>
            <li>Relaxation Capacity</li>
            <li>Emotional Overload Patterns</li>
            <li>Environmental Comfort Preferences</li>
            <li>Focus & Mental Fatigue</li>
            <li>Wellness Lifestyle Habits</li>
            <li>Movement & Recovery</li>
            <li>Appetite & Lifestyle Awareness</li>
            <li>Nervous-System Recovery</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3">After Assessment, You May Receive:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Recommended immersive environments</li>
            <li>Guided breath protocols</li>
            <li>Wellness-supportive recommendations</li>
            <li>Product suggestions</li>
            <li>Aromatherapy recommendations</li>
            <li>Sound immersion recommendations</li>
            <li>Relaxation experiences</li>
            <li>Integrative consultation options</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
