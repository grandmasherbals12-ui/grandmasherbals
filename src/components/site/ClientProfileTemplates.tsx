import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Activity, FileText, Download } from "lucide-react";

export function ClientProfileTemplates() {
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  const profiles = [
    {
      id: "torarie",
      name: "Mr. Torarie",
      title: "Welcome To Concierge Wellness Care",
      description: "Baseline setup and intake welcome package following initial consultation.",
      type: "Intake",
      content: (
        <div className="space-y-4 rounded-[1.5rem] border border-amber-200 bg-[#faf8f2] p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-olive-500 uppercase">Welcome To</p>
              <h3 className="mt-1 text-2xl font-cormorant font-bold text-olive-800">Concierge Wellness Care</h3>
            </div>
            <div className="text-right text-xs text-stone-500">
              <div><span className="font-semibold text-stone-700">Client Name:</span> Mr. Torarie</div>
              <div><span className="font-semibold text-stone-700">Age:</span> 48</div>
              <div><span className="font-semibold text-stone-700">Formula:</span> Torarie Vitality Formula</div>
              <div><span className="font-semibold text-stone-700">Date:</span> June 3, 2026</div>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-5 text-stone-700 leading-7">
            <p className="font-cormorant text-xl italic text-olive-700 mb-3">Dear Mr. Torarie,</p>
            <p>
              Welcome to the Grandma&apos;s Herbals Concierge Wellness Community. We are honored to walk alongside you as you invest in your health, vitality, and overall quality of life.
            </p>
            <p className="mt-3">
              Your protocol has been designed as a bespoke concierge experience with a focus on mind, body, spirit, and sustainable daily wellness habits.
            </p>
            <div className="mt-4 rounded-xl bg-olive-50 p-4">
              <h4 className="font-semibold text-olive-800 mb-2">Initial Protocol Focus</h4>
              <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                <li>30-minute daily breathwork</li>
                <li>Morning circulation support formula</li>
                <li>Evening relaxation blend</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t border-amber-200 pt-6">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 text-center">Branded Document Preview</p>
            <div className="relative border rounded-xl overflow-hidden shadow-md max-w-md mx-auto aspect-[3/4] bg-white flex items-center justify-center">
              <img src="/welcomereport.png" alt="Welcome Report Preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "childs",
      name: "Mr. Childs",
      title: "Blood Pressure Timeline",
      description: "Detailed progress report tracking BP improvements and circulation support.",
      type: "Progress Report",
      content: (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-cormorant font-bold text-blue-800 mb-4">Blood Pressure Timeline Report</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
              <span className="font-semibold text-sm">Day 1</span>
              <span className="text-sm text-stone-600">Baseline established. Mild adjustments.</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
              <span className="font-semibold text-sm">Day 4</span>
              <span className="text-sm text-stone-600">Significant stabilization reported in evening readings.</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-blue-500">
              <span className="font-semibold text-sm">Day 7</span>
              <span className="text-sm text-stone-600">Consistent readings within optimal target range.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ashford",
      name: "Mr. Ashford",
      title: "Pain & Mobility Out-of-10",
      description: "Daily reporting of joint comfort and mobility levels.",
      type: "Tracking",
      content: (
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
          <h3 className="text-xl font-cormorant font-bold text-amber-800 mb-4">Mobility & Comfort Scale</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded text-center">
              <div className="text-3xl font-bold text-amber-600 mb-1">8/10</div>
              <div className="text-xs font-semibold text-stone-500 uppercase">Current Comfort</div>
            </div>
            <div className="bg-white p-4 rounded text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">9/10</div>
              <div className="text-xs font-semibold text-stone-500 uppercase">Mobility</div>
            </div>
          </div>
          <p className="text-sm text-stone-600 mt-4 italic">"Walking without the brace for the first time this month."</p>
        </div>
      )
    },
    {
      id: "felix",
      name: "Felix",
      title: "3-Day Fast Track",
      description: "Intensive 3-day turnaround focusing on mood and energy spikes.",
      type: "Progress Report",
      content: (
        <div className="space-y-5 rounded-[1.5rem] border border-olive-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-olive-500 uppercase">3-Day Client</p>
            <h3 className="mt-1 text-2xl font-cormorant font-bold text-olive-800">Progress Report</h3>
            <p className="mt-2 text-sm text-stone-500">Celebrating consistency, movement, and well-being.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Focus", 78],
              ["Energy", 82],
              ["Mood", 76],
              ["Mental Clarity", 74],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-stone-200 p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-stone-700">
                  <span>{label}</span>
                  <span className="text-olive-700">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full rounded-full bg-olive-600" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-olive-50 p-4">
            <h4 className="font-semibold text-olive-800 mb-2">Any concerns, side effects, or negative experiences?</h4>
            <p className="text-sm text-stone-600">
              Your feedback helps us improve your protocol and wellness recommendations.
            </p>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            Reported waking with increased consistency and improved energy throughout the day.
          </p>
          <div className="mt-6 border-t border-olive-200 pt-6">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 text-center">Branded Document Preview</p>
            <div className="relative border rounded-xl overflow-hidden shadow-md max-w-md mx-auto aspect-[3/4] bg-white flex items-center justify-center">
              <img src="/3daysreport.png" alt="3-Day Progress Report Preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "willg",
      name: "Will G",
      title: "10-Day Deep Dive",
      description: "Extended progress tracking covering long-term adherence and compounding effects.",
      type: "Deep Dive",
      content: (
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-xl font-cormorant font-bold text-purple-800 mb-4">10-Day Compounding Results</h3>
          <p className="text-sm text-stone-700 mb-4">Sustained protocol adherence has led to compounding benefits across cognitive and physical domains.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white p-2 rounded border border-purple-100">
              <div className="text-xs text-stone-500">Day 1-3</div>
              <div className="font-bold text-purple-700 text-lg">+15%</div>
            </div>
            <div className="bg-white p-2 rounded border border-purple-100">
              <div className="text-xs text-stone-500">Day 4-6</div>
              <div className="font-bold text-purple-700 text-lg">+35%</div>
            </div>
            <div className="bg-white p-2 rounded border border-purple-100">
              <div className="text-xs text-stone-500">Day 7-9</div>
              <div className="font-bold text-purple-700 text-lg">+60%</div>
            </div>
            <div className="bg-white p-2 rounded border border-purple-100 bg-purple-600 text-white">
              <div className="text-xs text-purple-200">Day 10</div>
              <div className="font-bold text-lg">+85%</div>
            </div>
          </div>
          <div className="mt-6 border-t border-purple-200 pt-6">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 text-center">Branded Document Preview</p>
            <div className="relative border rounded-xl overflow-hidden shadow-md max-w-md mx-auto aspect-[3/4] bg-white flex items-center justify-center">
              <img src="/10daysreport.png" alt="10-Day Progress Report Preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleExportPDF = (profileId: string) => {
    const reportImageMap: Record<string, string> = {
      torarie: "/welcomereport.png",
      felix: "/3daysreport.png",
      willg: "/10daysreport.png"
    };

    const imageUrl = reportImageMap[profileId];

    if (imageUrl) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Grandma's Herbals - Report Preview</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background-color: #faf9f5;
                  font-family: sans-serif;
                }
                .container {
                  max-width: 900px;
                  background: #fff;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                  border-radius: 12px;
                  padding: 20px;
                  text-align: center;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
                  border: 1px solid #ebdcb7;
                }
                @media print {
                  body { background: none; }
                  .container { box-shadow: none; padding: 0; }
                  img { max-width: 100%; height: auto; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="${imageUrl}" onload="window.print();" />
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      window.print();
    }
  };

  if (activeProfile) {
    const profile = profiles.find(p => p.id === activeProfile);
    if (!profile) return null;
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button onClick={() => setActiveProfile(null)} className="text-sm text-olive-600 hover:text-olive-800 font-semibold mb-4 inline-flex items-center">
          ← Back to Profiles
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-cormorant font-bold text-olive-800">{profile.name}</h2>
            <p className="text-stone-500">{profile.title}</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => handleExportPDF(profile.id)}>
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
        
        {profile.content}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-2">Client Success Profiles & Templates</h2>
        <p className="text-sm text-stone-500 mb-6">
          Access specialized templates, intake packages, and benchmark progress reports modeled from successful client journeys.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md hover:border-olive-300 transition-all cursor-pointer group" onClick={() => setActiveProfile(p.id)}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-olive-100 p-2 rounded-lg text-olive-700">
                {p.type === 'Intake' ? <User className="w-5 h-5" /> : 
                 p.type === 'Tracking' ? <Activity className="w-5 h-5" /> : 
                 <FileText className="w-5 h-5" />}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 group-hover:text-olive-500 transition-colors">{p.type}</span>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-1">{p.name}</h3>
            <h4 className="text-sm font-semibold text-olive-600 mb-3">{p.title}</h4>
            <p className="text-sm text-stone-500 line-clamp-2 mb-4">{p.description}</p>
            <div className="text-sm font-bold text-olive-700 group-hover:translate-x-1 transition-transform">
              View Profile →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
