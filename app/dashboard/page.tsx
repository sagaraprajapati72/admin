import { fetchUserOrRedirect } from "@/lib/auth";
import LandingPageClient from "./LandingPageClient";

export default async function LandingPage() {
  // Ensure user is logged in
  const user = await fetchUserOrRedirect();

  // Hardcoded metrics
  const metrics = {
    bookCount: 120,
    audienceCount: 250,
    partnerCount: 15,
    revenue: "$12K",
  };

  return <LandingPageClient user={user} metrics={metrics} />;
}
