import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/breathwork")({
  head: () => ({
    meta: [
      { title: "Breathwork Library — Grandma's Herbals" },
      {
        name: "description",
        content: "Guided breathwork videos to support calm, focus, and recovery.",
      },
    ],
  }),
  component: BreathworkLibrary,
});

const breathworkVideos = [
  {
    title: "Morning Reset",
    description: "A short sequence for starting the day with calm focus.",
    src: "/home-video.mp4",
  },
  {
    title: "Midday Grounding",
    description: "A breathing practice to help you reset between tasks.",
    src: "/video-about.mp4",
  },
  {
    title: "Evening Wind-Down",
    description: "A slower practice for preparing the body for rest.",
    src: "/carousel-3.mp4",
  },
];

function BreathworkLibrary() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-olive-50 via-white to-stone-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Library</p>
            <h1 className="mt-3 text-4xl font-cormorant font-bold text-olive-900 md:text-5xl">
              Breathwork Library
            </h1>
            <p className="mt-4 max-w-3xl text-stone-600 leading-7">
              Use these guided sessions to support calm, nervous-system balance, and intentional breathing.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {breathworkVideos.map((video) => (
                <article key={video.title} className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm">
                  <video className="h-56 w-full object-cover" controls playsInline preload="metadata">
                    <source src={video.src} type="video/mp4" />
                  </video>
                  <div className="p-5">
                    <h2 className="text-xl font-cormorant font-bold text-olive-800">{video.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{video.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-olive-600 text-white hover:bg-olive-700">
                <a href="/consultation">Book Support</a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-olive-200 text-olive-700">
                <a href="/membership">View Memberships</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
