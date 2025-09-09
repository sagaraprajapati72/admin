import { fetchUserOrRedirect, User } from "../../../lib/auth";
import AudienceDeletionSuccessClient from "./AudienceDeletionSuccessClient";
import { redirect } from "next/navigation";


export default async function AudienceDeletionSuccessPage() {
  // Ensure the user is logged in
  const user: User = await fetchUserOrRedirect();
if (!user) {
    redirect("/");
  }

  // Ex
  // Pass user info to client component (optional, if needed)
  return <AudienceDeletionSuccessClient user={user} />;
}