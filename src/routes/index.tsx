import { createFileRoute } from "@tanstack/react-router";
import { PortalApp } from "@/components/portal/PortalApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PropStream — Commercial Real Estate Broker Portal" },
      { name: "description", content: "PropStream: pipelines, 1031 exchange tracking, AI copilot and billing for CRE brokerages." },
      { property: "og:title", content: "PropStream — CRE Broker Portal" },
      { property: "og:description", content: "Pipelines, 1031 exchange tracking, AI copilot and billing for CRE brokerages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortalApp,
});
