import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteLayout } from '@/components/site/SiteLayout'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList, Mail, MessageSquare, Check, Plus, Minus,
  ShoppingCart, Star, Loader2, ChevronRight,
} from 'lucide-react'

export const Route = createFileRoute('/membership')({
  component: Membership,
})

type MembershipPlan = {
  id?: string
  tier_key: string
  name: string
  tagline: string
  subtitle: string
  price_monthly: number
  features: string[]
  focus_areas: string
  ideal_for: string
  is_popular: boolean
  display_order: number
}

type MembershipAddon = {
  id?: string
  name: string
  price_label: string
  description: string
  is_priority: boolean
  display_order: number
}

const DEFAULT_PLANS: MembershipPlan[] = [
  {
    tier_key: 'tier-1',
    name: 'Foundation Awareness Package',
    tagline: 'Restore & Reconnect',
    subtitle: 'Tier I',
    price_monthly: 199,
    features: [
      'Online evaluation & assessment with personalized report',
      'Assessment Report',
      '30-minute Guided Awareness & Breathwork Meditation',
      'Herbal Wellness Intake Assessment',
      'Personalized Lifestyle Survey',
      'Basic Meal Guidance Protocol',
      'Medication & Herbal Interaction Review',
      'Circulation & Relaxation Focus Recommendations',
      'Foundational Herbal Recommendations',
      'Educational Wellness Summary PDF',
      'Access to beginner guided meditation library',
    ],
    focus_areas: 'Stress awareness • Relaxation support • Sleep support • Mental clarity • Foundational circulation support • Lifestyle balance',
    ideal_for: 'Individuals beginning their wellness journey seeking foundational guidance and awareness support.',
    is_popular: false,
    display_order: 1,
  },
  {
    tier_key: 'tier-2',
    name: 'Integrated Wellness Package',
    tagline: 'Elevate & Optimize',
    subtitle: 'Tier II',
    price_monthly: 399,
    features: [
      'Everything in Tier I',
      '1 x 10-minute consultation',
      'Advanced herbal protocol recommendations',
      'Personalized meal plan protocols',
      'Advanced meditation library access',
      'Monthly wellness product access',
      'Personalized herbal tea & wellness kits',
      'Wellness tracking & progress reports',
      'Group meditation session access',
    ],
    focus_areas: 'Comprehensive wellness transformation with personalized guidance',
    ideal_for: 'Individuals committed to comprehensive wellness transformation with personalized guidance and tracking.',
    is_popular: true,
    display_order: 2,
  },
  {
    tier_key: 'tier-3',
    name: 'Premium Transformation Package',
    tagline: 'Master Your Wellness',
    subtitle: 'Tier III',
    price_monthly: 799,
    features: [
      'Everything in Tier II',
      '3 x 10-minute consultations',
      'Premium herbal compounds & custom blends',
      'Integrative practitioner collaboration',
      'Comprehensive wellness lifestyle design',
      'Advanced automated wellness optimization',
      'Priority customer support',
      'Exclusive wellness summit access',
      'Family wellness integration program',
    ],
    focus_areas: 'Premium comprehensive lifestyle transformation',
    ideal_for: 'Executives, entrepreneurs, high-performance professionals seeking a comprehensive wellness lifestyle transformation.',
    is_popular: false,
    display_order: 3,
  },
]

const DEFAULT_ADDONS: MembershipAddon[] = [
  { name: 'Guided Meditation Library Access', price_label: '$19–$49/month', description: '', is_priority: false, display_order: 1 },
  { name: 'Smart Meal Protocol Generator', price_label: '$79/month', description: '', is_priority: false, display_order: 2 },
  { name: 'Urgent Consultation', price_label: 'Follow-Up Included', description: '1 next if issue subsides 50% during consultation or next day after follow up!', is_priority: true, display_order: 3 },
  { name: 'Personalized Herbal Tea & Wellness Kits', price_label: 'Starting at $49', description: '', is_priority: false, display_order: 4 },
  { name: 'Premium Herbal Compounds', price_label: 'Custom pricing', description: '', is_priority: false, display_order: 5 },
  { name: 'Group Meditation Sessions', price_label: 'Starting at $199/session', description: '', is_priority: false, display_order: 6 },
  { name: 'Corporate Wellness Programs', price_label: 'Custom enterprise pricing', description: '', is_priority: false, display_order: 7 },
]

function Membership() {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [addons, setAddons] = useState<MembershipAddon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pData }, { data: aData }] = await Promise.all([
          supabase.from('membership_plans').select('*').order('display_order'),
          supabase.from('membership_addons').select('*').order('display_order'),
        ])
        setPlans(pData && pData.length > 0 ? (pData as MembershipPlan[]) : DEFAULT_PLANS)
        setAddons(aData && aData.length > 0 ? (aData as MembershipAddon[]) : DEFAULT_ADDONS)
      } catch {
        setPlans(DEFAULT_PLANS)
        setAddons(DEFAULT_ADDONS)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleAddon = (name: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const handleProceed = () => {
    if (!selectedPlan) {
      toast.error('Please select a membership plan first.')
      return
    }
    const plan = plans.find(p => p.tier_key === selectedPlan)
    const addonNames = Array.from(selectedAddons).join(', ')
    toast.success(
      `Selected: ${plan?.name}${addonNames ? ` + ${selectedAddons.size} add-on(s)` : ''}. Proceeding to checkout...`
    )
  }

  const tierColors: Record<string, string> = {
    'tier-1': 'from-stone-50 to-white border-stone-200',
    'tier-2': 'from-olive-50 to-white border-olive-300',
    'tier-3': 'from-amber-50 to-white border-amber-300',
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-olive-600" />
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-olive-50 to-white">

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-olive-800 to-olive-950 py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #a3b18a 0%, transparent 60%), radial-gradient(circle at 70% 50%, #588157 0%, transparent 60%)' }} />
          <div className="relative container mx-auto max-w-3xl">
            <p className="text-xs font-bold tracking-[0.3em] text-olive-300 uppercase mb-4">Grandma's Herbals</p>
            <h1 className="text-5xl md:text-6xl font-cormorant font-bold text-white mb-5 leading-tight">
              Membership Plans
            </h1>
            <p className="text-olive-200 text-lg mb-2">
              Guided Meditation • Herbal Wellness • Personalized Lifestyle Optimization
            </p>
            <p className="text-olive-300 max-w-2xl mx-auto text-sm">
              "Wholistic Wellness Through Awareness, Circulation & Strategic Herbal Guidance"
            </p>
          </div>
        </section>

        {/* Progress Report CTA */}
        <section className="py-10 bg-olive-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-olive-600/50 text-olive-100 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3">
                  <ClipboardList className="h-3.5 w-3.5" /> Member Dashboard
                </div>
                <h2 className="text-2xl font-cormorant font-bold text-white mb-2">
                  Submit Your Daily Progress Report
                </h2>
                <p className="text-olive-200 max-w-xl mx-auto text-sm">
                  Enter your wellness data each evening. Your personalized branded report is automatically generated and delivered each morning.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: <ClipboardList className="h-7 w-7 mx-auto mb-2 text-olive-300" />, title: 'Enter Tonight', desc: 'Fill in your 3-day progress data each evening before bed' },
                  { icon: <div className="text-2xl mb-2">💌</div>, title: '8:00 AM', desc: 'Personalized SMS & email generated from your data' },
                  { icon: <div className="text-2xl mb-2">📊</div>, title: '9:00 AM', desc: 'Your branded 3-day progress report by email & text' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4 text-center text-white">
                    {item.icon}
                    <div className="font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-olive-200">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button asChild size="lg" className="bg-white text-olive-800 hover:bg-olive-50 rounded-full px-10 font-semibold shadow-lg">
                  <Link to="/progress-report">
                    <ClipboardList className="h-5 w-5 mr-2" /> Submit My Progress Report
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.3em] text-olive-500 uppercase mb-3">Choose Your Path</p>
              <h2 className="text-4xl font-cormorant font-bold text-olive-800">Membership Tiers</h2>
              <p className="text-stone-600 mt-3 max-w-xl mx-auto">
                Select the plan that best fits your wellness journey. All plans include our core wellness assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.tier_key
                return (
                  <motion.div
                    key={plan.tier_key}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedPlan(plan.tier_key)}
                    className={`relative rounded-[2rem] border-2 bg-gradient-to-b p-8 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl ${tierColors[plan.tier_key] || 'from-stone-50 to-white border-stone-200'} ${isSelected ? 'ring-4 ring-olive-400 border-olive-400 shadow-xl' : ''}`}
                  >
                    {plan.is_popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-olive-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow">
                          <Star className="h-3 w-3 fill-current" /> Most Popular
                        </span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-olive-500 text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{plan.subtitle}</p>
                      <h3 className="text-xl font-cormorant font-bold text-olive-800 mb-1">{plan.name}</h3>
                      <p className="text-sm text-olive-600 italic">"{plan.tagline}"</p>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-olive-800">${plan.price_monthly}</span>
                      <span className="text-stone-500 text-sm ml-1">/month</span>
                    </div>

                    <ul className="space-y-2.5 mb-8">
                      {(plan.features || []).slice(0, 8).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                          <Check className="h-4 w-4 text-olive-500 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                      {(plan.features || []).length > 8 && (
                        <li className="text-xs text-olive-600 font-semibold pl-6">
                          +{(plan.features || []).length - 8} more features...
                        </li>
                      )}
                    </ul>

                    <Button
                      asChild
                      className={`w-full rounded-full font-semibold transition ${isSelected ? 'bg-olive-600 hover:bg-olive-700 text-white' : 'bg-olive-100 text-olive-800 hover:bg-olive-200'}`}
                    >
                      <Link to="/checkout" search={{ tier: plan.tier_key as 'tier-1' | 'tier-2' | 'tier-3' }}>
                        {isSelected ? (
                          <><Check className="h-4 w-4 mr-1" /> Selected</>
                        ) : (
                          <>Get Started <ChevronRight className="h-4 w-4 ml-1" /></>
                        )}
                      </Link>
                    </Button>

                    {plan.focus_areas && (
                      <div className="mt-4 p-3 bg-olive-50 rounded-xl">
                        <p className="text-xs font-semibold text-olive-700 mb-1">Focus Areas:</p>
                        <p className="text-xs text-stone-600">{plan.focus_areas}</p>
                      </div>
                    )}
                    {plan.ideal_for && (
                      <p className="text-xs text-stone-500 mt-3"><strong className="text-stone-700">Ideal For:</strong> {plan.ideal_for}</p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Add-On Services */}
        <section className="py-16 px-4 bg-gradient-to-b from-stone-50 to-white">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.3em] text-olive-500 uppercase mb-3">Enhance Your Experience</p>
              <h2 className="text-4xl font-cormorant font-bold text-olive-800">Optional Add-On Services</h2>
              <p className="text-stone-600 mt-3 max-w-xl mx-auto">
                Customize your wellness journey by adding services that complement your selected plan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {addons.map((addon, i) => {
                const selected = selectedAddons.has(addon.name)
                return (
                  <motion.div
                    key={addon.id || i}
                    whileHover={{ y: -2 }}
                    onClick={() => toggleAddon(addon.name)}
                    className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                      selected
                        ? 'border-olive-400 bg-olive-50 shadow-lg ring-2 ring-olive-200'
                        : addon.is_priority
                          ? 'border-olive-300 bg-white hover:border-olive-400 hover:shadow-md'
                          : 'border-stone-200 bg-white hover:border-olive-300 hover:shadow-md'
                    }`}
                  >
                    {addon.is_priority && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-olive-100 text-olive-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Priority</span>
                      </div>
                    )}
                    {selected && (
                      <div className="absolute top-3 left-3 bg-olive-500 text-white rounded-full p-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div className={selected ? 'pl-6' : ''}>
                      <h3 className="font-semibold text-olive-800 text-sm pr-12">{addon.name}</h3>
                      <p className="text-olive-600 font-bold text-base mt-1">{addon.price_label}</p>
                      {addon.description && (
                        <p className="text-xs text-stone-500 mt-1.5">{addon.description}</p>
                      )}
                    </div>
                    <div className={`mt-3 flex justify-end`}>
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'bg-olive-500 border-olive-500 text-white' : 'border-stone-300 text-stone-300'}`}>
                        {selected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Billing Summary */}
            <AnimatePresence>
              {(selectedPlan || selectedAddons.size > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-[2rem] border-2 border-olive-200 shadow-xl p-8"
                >
                  <h3 className="text-2xl font-cormorant font-bold text-olive-800 mb-5 flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6" /> Your Wellness Package
                  </h3>

                  {selectedPlan && (() => {
                    const plan = plans.find(p => p.tier_key === selectedPlan)
                    return plan ? (
                      <div className="flex items-center justify-between py-3 border-b border-stone-100">
                        <div>
                          <p className="font-semibold text-olive-800">{plan.name}</p>
                          <p className="text-xs text-stone-500">{plan.subtitle} Membership</p>
                        </div>
                        <p className="font-bold text-olive-700">${plan.price_monthly}/mo</p>
                      </div>
                    ) : null
                  })()}

                  {selectedAddons.size > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Add-Ons Selected:</p>
                      {Array.from(selectedAddons).map(name => {
                        const addon = addons.find(a => a.name === name)
                        return (
                          <div key={name} className="flex items-center justify-between py-1.5">
                            <p className="text-sm text-stone-700 flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-olive-500 shrink-0" /> {name}
                            </p>
                            <p className="text-sm font-medium text-olive-600">{addon?.price_label || 'Varies'}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <p className="text-xs text-stone-500 mb-4">
                      * Add-on pricing is in addition to your monthly membership. Final billing confirmed at checkout.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleProceed}
                        size="lg"
                        className="flex-1 bg-olive-600 hover:bg-olive-700 text-white rounded-full font-semibold"
                        asChild
                      >
                        <Link to="/checkout" search={{ tier: (selectedPlan || 'tier-1') as 'tier-1' | 'tier-2' | 'tier-3' }}>
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Proceed to Checkout
                          <ChevronRight className="h-5 w-5 ml-1" />
                        </Link>
                      </Button>
                      {selectedAddons.size > 0 && (
                        <Button
                          onClick={() => setSelectedAddons(new Set())}
                          variant="outline"
                          className="rounded-full border-stone-300 text-stone-600"
                        >
                          Clear Add-Ons
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Wellness Ecosystem */}
        <section className="py-12 bg-white px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-cormorant font-bold text-olive-700 mb-8 text-center">Our Wellness Ecosystem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-olive-600">Core Offerings</h3>
                {[
                  'Guided meditation for awareness, relaxation, and circulation support',
                  'Herbal wellness consultations',
                  'Personalized meal and lifestyle recommendations',
                  'Wellness education protocols',
                  'Medication and herbal interaction screening',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <Check className="h-4 w-4 text-olive-500 mt-0.5 shrink-0" /> {item}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-olive-600">Expert Advisory Team</h3>
                {['Master Herbalist & Energy Flow Specialist', 'Psychologist', 'Physiotherapist', 'Internal Medicine', 'Psychiatrist', 'Smart wellness analysis systems'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <Check className="h-4 w-4 text-olive-500 mt-0.5 shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-10 bg-stone-50 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Wellness Notice</h3>
              <p className="text-yellow-800 text-sm mb-2">
                Grandma's Herbals wellness consultations, guided meditation services, and auto-generated wellness recommendations are educational and wellness-supportive in nature and are not intended to diagnose, treat, cure, or prevent disease.
              </p>
              <p className="text-yellow-800 text-sm">
                Clients should always consult with licensed healthcare professionals regarding medical concerns, medications, or treatment decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto rounded-[2rem] border border-olive-200 bg-gradient-to-b from-olive-50 to-white px-6 py-12 text-center shadow-[0_18px_60px_rgba(73,88,52,0.08)]">
              <p className="text-xs font-bold tracking-[0.3em] text-olive-500 uppercase mb-4">Our Mission</p>
              <p className="text-2xl md:text-3xl leading-relaxed text-olive-800 font-medium max-w-3xl mx-auto">
                Grandma's Herbals delivers Integrative Regenerative Wellness through a personalized, bespoke concierge experience tailored to support your mind, body, spirit, and overall quality of life.
              </p>
              <blockquote className="mt-8 text-olive-600 italic text-xl font-semibold">
                "Adjusting to changing paradigms strategically & methodically."
              </blockquote>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  )
}
