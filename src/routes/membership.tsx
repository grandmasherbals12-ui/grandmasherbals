import { createFileRoute } from '@tanstack/react-router'
import { SiteLayout } from '@/components/site/SiteLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ClipboardList, Mail, MessageSquare, Clock } from 'lucide-react'

export const Route = createFileRoute('/membership')({
  component: Membership,
})

function Membership() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-olive-50 to-white">
        {/* Hero Section */}
        <section className="bg-olive-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-cormorant font-bold text-olive-700 mb-6">
              Grandma's Herbals
            </h1>
            <p className="text-lg text-olive-600 mb-2">
              Guided Meditation • Herbal Wellness • Personalized Lifestyle Optimization
            </p>
            <p className="text-base text-olive-700 font-semibold max-w-3xl mx-auto mb-6">
              "Wholistic Wellness Through Awareness, Circulation & Strategic Herbal Guidance"
            </p>
            <p className="text-olive-600 max-w-3xl mx-auto">
              Grandma's Herbals combines traditional herbal wisdom, guided awareness practices, data-assisted wellness assessments, and multidisciplinary wellness perspectives to help clients create healthier lifestyle pathways.
            </p>
          </div>
        </section>

        {/* Progress Report CTA — Members Enter Daily Data Here */}
        <section className="py-12 bg-gradient-to-br from-olive-800 to-olive-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-olive-600/50 text-olive-100 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                  <ClipboardList className="h-3.5 w-3.5" /> Member Dashboard
                </div>
                <h2 className="text-3xl font-cormorant font-bold text-white mb-3">
                  Submit Your Daily Progress Report
                </h2>
                <p className="text-olive-200 max-w-2xl mx-auto">
                  Enter your wellness data each evening. Your personalized branded report is automatically
                  generated and delivered to you each morning.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-xl p-5 text-center text-white">
                  <ClipboardList className="h-8 w-8 mx-auto mb-3 text-olive-300" />
                  <div className="font-semibold mb-1">Enter Tonight</div>
                  <div className="text-xs text-olive-200">Fill in your 3-day progress data each evening before bed</div>
                </div>
                <div className="bg-white/10 rounded-xl p-5 text-center text-white">
                  <div className="text-3xl mb-3">💌</div>
                  <div className="font-bold text-lg mb-1">8:00 AM</div>
                  <div className="font-semibold mb-1 flex items-center justify-center gap-1">
                    <MessageSquare className="h-4 w-4 text-olive-300" /> Encouragement
                  </div>
                  <div className="text-xs text-olive-200">Personalized SMS & email generated from your data</div>
                </div>
                <div className="bg-white/10 rounded-xl p-5 text-center text-white">
                  <div className="text-3xl mb-3">📊</div>
                  <div className="font-bold text-lg mb-1">9:00 AM</div>
                  <div className="font-semibold mb-1 flex items-center justify-center gap-1">
                    <Mail className="h-4 w-4 text-olive-300" /> Full Report
                  </div>
                  <div className="text-xs text-olive-200">Your branded 3-day progress report by email & text</div>
                </div>
              </div>
              <div className="text-center">
                <Button asChild size="lg" className="bg-white text-olive-800 hover:bg-olive-50 rounded-full px-10 py-6 text-lg font-semibold shadow-lg">
                  <Link to="/progress-report">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Submit My Progress Report
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-cormorant font-bold text-olive-700 mb-8 text-center">
              Our Wellness Ecosystem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-olive-600">Core Offerings</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2">•</span>
                    <span>Guided meditation for awareness, relaxation, and circulation support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2">•</span>
                    <span>Herbal wellness consultations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2">•</span>
                    <span>Personalized meal and lifestyle recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2">•</span>
                    <span>Wellness education protocols</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2">•</span>
                    <span>Medication and herbal interaction screening</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-olive-600">Expert Advisory Team</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2">•</span>
                    <span>Master Herbalist & Energy Flow Specialist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2 shrink-0 flex-none">•</span>
                    <span>Psychologist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2 shrink-0 flex-none">•</span>
                    <span>Physiotherapist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2 shrink-0 flex-none">•</span>
                    <span>Internal Medicine</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2 shrink-0 flex-none">•</span>
                    <span>Psychiatrist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-olive-500 mr-2">•</span>
                    <span>Smart wellness analysis systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-cormorant font-bold text-olive-700 mb-12 text-center">
              Membership Tiers
            </h2>

            {/* Tier I */}
            <div className="mb-12">
              <Card className="p-8 border-2 border-olive-200 hover:border-olive-400 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-olive-700 mb-2">
                      Tier I
                    </h3>
                    <p className="text-lg font-semibold text-olive-600 mb-2">
                      Foundation Awareness Package
                    </p>
                    <p className="italic text-olive-500 mb-4">
                      "Restore & Reconnect"
                    </p>
                    <p className="text-2xl font-bold text-olive-700 mb-4">
                      $199<span className="text-sm font-normal text-gray-600">/month</span>
                    </p>
                    <Button asChild className="w-full bg-olive-500 hover:bg-olive-600">
                      <Link to="/checkout" search={{ tier: 'tier-1' }}>Get Started</Link>
                    </Button>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-olive-700 mb-4">Includes:</h4>
                    <ul className="space-y-3">
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Each membership includes an online evaluation & assessment with a report generated for you best recommendation for outcomes.</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">No consultation</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">No consultation</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Online Evaluation</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Assessment Report</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">30-minute Guided Awareness & Breathwork Meditation</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Herbal Wellness Intake Assessment</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Personalized Lifestyle Survey</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Basic Meal Guidance Protocol</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Medication & Herbal Interaction Review</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Circulation & Relaxation Focus Recommendations</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Foundational Herbal Recommendations</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Educational Wellness Summary PDF</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Access to beginner guided meditation library</span>
                      </li>
                    </ul>
                    <div className="mt-6 p-4 bg-olive-50 rounded-lg">
                      <h4 className="font-semibold text-olive-700 mb-2">Focus Areas:</h4>
                      <p className="text-sm text-gray-700">
                        Stress awareness • Relaxation support • Sleep support • Mental clarity • Foundational circulation support • Lifestyle balance
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      <strong>Ideal For:</strong> Individuals beginning their wellness journey seeking foundational guidance and awareness support.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tier II */}
            <div className="mb-12">
              <Card className="p-8 border-2 border-olive-300 bg-olive-50 hover:border-olive-400 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-olive-700 mb-2">
                      Tier II
                    </h3>
                    <p className="text-lg font-semibold text-olive-600 mb-2">
                      Integrated Wellness Package
                    </p>
                    <p className="italic text-olive-500 mb-4">
                      "Elevate & Optimize"
                    </p>
                    <p className="text-2xl font-bold text-olive-700 mb-4">
                      $399<span className="text-sm font-normal text-gray-600">/month</span>
                    </p>
                    <Button asChild className="w-full bg-olive-600 hover:bg-olive-700">
                      <Link to="/checkout" search={{ tier: 'tier-2' }}>Get Started</Link>
                    </Button>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-olive-700 mb-4">Includes Tier I Plus:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Each membership includes an online evaluation & assessment with a report generated for you best recommendation for outcomes.</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">1 x 10-minute consultation</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Advanced herbal protocol recommendations</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Personalized meal plan protocols</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Advanced meditation library access</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Monthly wellness product access</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Personalized herbal tea & wellness kits</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Wellness tracking & progress reports</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-500 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Group meditation session access</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-4">
                      <strong>Ideal For:</strong> Individuals committed to comprehensive wellness transformation with personalized guidance and tracking.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tier III */}
            <div className="mb-12">
              <Card className="p-8 border-2 border-olive-400 bg-gradient-to-r from-olive-50 to-white hover:border-olive-500 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-olive-800 mb-2">
                      Tier III
                    </h3>
                    <p className="text-lg font-semibold text-olive-700 mb-2">
                      Premium Transformation Package
                    </p>
                    <p className="italic text-olive-600 mb-4">
                      "Master Your Wellness"
                    </p>
                    <p className="text-2xl font-bold text-olive-800 mb-4">
                      $799<span className="text-sm font-normal text-gray-600">/month</span>
                    </p>
                    <Button asChild className="w-full bg-olive-700 hover:bg-olive-800">
                      <Link to="/checkout" search={{ tier: 'tier-3' }}>Get Started</Link>
                    </Button>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-olive-700 mb-4">Includes Tier II Plus:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Each membership includes an online evaluation & assessment with a report generated for you best recommendation for outcomes.</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">3 x 10-minute consultations</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Premium herbal compounds & custom blends</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Integrative practitioner collaboration</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Comprehensive wellness lifestyle design</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Advanced automated wellness optimization</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Priority customer support</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Exclusive wellness summit access</span>
                      </li>
                      <li className="grid grid-cols-[1rem_1fr] gap-2 items-start">
                        <span className="text-olive-600 leading-none mt-1">✓</span>
                        <span className="min-w-0 leading-relaxed">Family wellness integration program</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-4">
                      <strong>Ideal For:</strong> Executives, entrepreneurs, high-performance professionals, and clients seeking a comprehensive wellness lifestyle transformation experience.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Add-On Services */}
        <section className="py-16 bg-olive-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-cormorant font-bold text-olive-700 mb-12 text-center">
              Optional Add-On Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 hover:shadow-lg transition">
                <h3 className="font-semibold text-olive-700 mb-2">Guided Meditation Library Access</h3>
                <p className="text-olive-600 text-lg font-bold">$19–$49<span className="text-sm font-normal text-gray-600">/month</span></p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <h3 className="font-semibold text-olive-700 mb-2">Smart Meal Protocol Generator</h3>
                <p className="text-olive-600 text-lg font-bold">$79<span className="text-sm font-normal text-gray-600">/month</span></p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition border-2 border-olive-400">
                <div className="inline-block bg-olive-100 text-olive-800 text-xs font-bold px-2 py-1 rounded mb-2">Priority</div>
                <h3 className="font-semibold text-olive-800 mb-2">Urgent Consultation</h3>
                <p className="text-olive-600 text-lg font-bold">Follow-Up Included</p>
                <p className="text-sm text-gray-600 mt-2">1 next if issue subsides 50% during consultation or next day after follow up!</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <h3 className="font-semibold text-olive-700 mb-2">Personalized Herbal Tea & Wellness Kits</h3>
                <p className="text-olive-600 text-lg font-bold">Starting at $49</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <h3 className="font-semibold text-olive-700 mb-2">Premium Herbal Compounds</h3>
                <p className="text-olive-600 text-lg font-bold">Custom pricing</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <h3 className="font-semibold text-olive-700 mb-2">Group Meditation Sessions</h3>
                <p className="text-olive-600 text-lg font-bold">Starting at $199<span className="text-sm font-normal text-gray-600">/session</span></p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition">
                <h3 className="font-semibold text-olive-700 mb-2">Corporate Wellness Programs</h3>
                <p className="text-olive-600 text-lg font-bold">Custom enterprise pricing</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Wellness Notice</h3>
              <p className="text-yellow-800 text-sm mb-3">
                Grandma's Herbals wellness consultations, guided meditation services, and auto-generated wellness recommendations are educational and wellness-supportive in nature and are not intended to diagnose, treat, cure, or prevent disease.
              </p>
              <p className="text-yellow-800 text-sm mb-3">
                Clients should always consult with licensed healthcare professionals regarding medical concerns, medications, or treatment decisions.
              </p>
              <p className="text-yellow-800 text-sm">
                Auto-generated wellness recommendations are informational tools designed to support wellness awareness and should not replace individualized medical advice from licensed healthcare providers.
              </p>
            </div>
          </div>
        </section>

        {/* Professional Support */}
        <section className="py-16 bg-olive-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs font-bold tracking-[0.3em] text-olive-500 uppercase mb-3">Integrated Professional Support</p>
                <h3 className="text-3xl font-cormorant font-bold text-olive-800">Our Therapist Team</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  "Internal Medicine",
                  "Psychologist",
                  "Physiotherapist",
                  "Psychiatrist",
                ].map((title) => (
                  <Card key={title} className="p-6 text-center border border-olive-200 bg-white shadow-sm">
                    <div className="h-12 w-12 mx-auto rounded-full bg-olive-100 text-olive-700 flex items-center justify-center text-xl mb-4">✦</div>
                    <h4 className="text-lg font-semibold text-olive-800">{title}</h4>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brand Positioning */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-[2rem] border border-olive-200 bg-gradient-to-b from-olive-50 to-white px-6 py-12 text-center shadow-[0_18px_60px_rgba(73,88,52,0.08)]">
              <p className="text-xs font-bold tracking-[0.3em] text-olive-500 uppercase mb-4">Our Mission</p>
              <p className="text-2xl md:text-3xl leading-relaxed text-olive-800 font-medium max-w-3xl mx-auto">
                Grandma’s Herbals delivers Integrative Regenerative Wellness through a personalized, bespoke concierge experience tailored to support your mind, body, spirit, and overall quality of life.
              </p>
              <blockquote className="mt-8 text-olive-600 italic text-xl md:text-2xl font-semibold max-w-2xl mx-auto">
                “Adjusting to changing paradigms strategically & methodically.”
              </blockquote>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  )
}
