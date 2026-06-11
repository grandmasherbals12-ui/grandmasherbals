import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Testimonials } from "@/components/site/Testimonials";

export const Route = createFileRoute("/testimonials")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SiteLayout>
      <div className="pt-20">
        <Testimonials />
      </div>
    </SiteLayout>
  );
}
