// app/audiences/create/page.tsx
import { redirect } from "next/navigation";
import { fetchUserOrRedirect, User } from "../../../lib/auth";
import CreateAudienceClient from "./CreateAudienceClient";

export default async function CreateAudiencePage() {
  // 🔒 Check if user is logged in
  const user: User = await fetchUserOrRedirect();

  // Optional: restrict to admins
  if (!user) {
    redirect("/");
  }

  // ✅ Pass the user to the client component
  return <CreateAudienceClient user={user} />;
}
