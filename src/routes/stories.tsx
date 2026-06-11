import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { StoriesSection } from "@/components/site/StoriesSection";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Community Stories — Grandma's Herbals" },
      { name: "description", content: "Real wellness journeys from the Grandma's Herbals community. Share your story and inspire others." },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  return (
    <SiteLayout>
      <div className="pt-20">
        <StoriesSection />
      </div>
    </SiteLayout>
  );
}
