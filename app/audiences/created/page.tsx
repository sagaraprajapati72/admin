// app/audiences/created/page.tsx
import { redirect } from "next/navigation";
import { fetchUserOrRedirect, User } from "../../../lib/auth";
import AudienceCreatedClient from "./AudienceCreatedClient";

export default async function AudienceCreatedPage() {
  // 🔒 Check if user is logged in
  const user: User = await fetchUserOrRedirect();

  // Optional: restrict to admins
  if (!user) {
    redirect("/");
  }

  // ✅ Pass user to client component (if needed)
  return <AudienceCreatedClient user={user} />;
}
