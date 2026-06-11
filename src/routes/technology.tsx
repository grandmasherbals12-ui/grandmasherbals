import { BeachEnvironment } from '@/components/site/BeachEnvironment'
import { DesertEnvironment } from '@/components/site/DesertEnvironment'
import { HealingGardenEnvironment } from '@/components/site/HealingGardenEnvironment'
import { MountainEnvironment } from '@/components/site/MountainEnvironment'
import { SacredReflectionEnvironment } from '@/components/site/SacredReflectionEnvironment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/technology')({
  component: Technology,
})

function Technology() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Immersive Wellness Technology</h1>
      <p className="mt-4">
        Technology should help reduce stress — not increase it.
      </p>
      <p className="mt-2">
        Our immersive wellness technology collection was designed to create calming sensory experiences that support relaxation, emotional balance, breath awareness, and restorative wellness routines.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Beach Environment</h2>
        <div className="mt-4 rounded-lg border">
          <BeachEnvironment />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Desert Environment</h2>
        <div className="mt-4 rounded-lg border">
          <DesertEnvironment />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Mountain Environment</h2>
        <div className="mt-4 rounded-lg border">
          <MountainEnvironment />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Healing Garden Environment</h2>
        <div className="mt-4 rounded-lg border">
          <HealingGardenEnvironment />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Sacred Reflection Environment</h2>
        <div className="mt-4 rounded-lg border">
          <SacredReflectionEnvironment />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">AV Meditation Headsets</h2>
          <p className="mt-2">
            Immersive visual and audio environments designed to help individuals disconnect from overstimulation and reconnect with calm, focus, breath awareness, and emotional stillness.
          </p>
          <h3 className="mt-4 font-semibold">Features may include:</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Guided meditation visuals</li>
            <li>Environmental simulations</li>
            <li>Breath synchronization systems</li>
            <li>Relaxation-focused sound immersion</li>
            <li>Nervous-system calming experiences</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Sound Bowls & Sound Immersion</h2>
          <p className="mt-2">
            Sound immersion experiences designed to support mindfulness, grounding, meditation enhancement, emotional decompression, and restorative calm.
          </p>
          <h3 className="mt-4 font-semibold">Products may include:</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Crystal singing bowls</li>
            <li>Meditation sound systems</li>
            <li>Guided sound journeys</li>
            <li>Frequency-based relaxation experiences</li>
            <li>Deep resonance meditation tools</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Diffusers & Aromatherapy</h2>
          <p className="mt-2">
            Aromatherapy experiences designed to support emotional calm, relaxation rituals, sleep-supportive environments, grounding experiences, and restorative wellness routines.
          </p>
          <h3 className="mt-4 font-semibold">Aroma categories include:</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Calm & Relaxation</li>
            <li>Sleep Support</li>
            <li>Focus & Clarity</li>
            <li>Breath Support</li>
            <li>Grounding & Meditation</li>
            <li>Sacred Reflection</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
