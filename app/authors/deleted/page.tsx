import { fetchUserOrRedirect, User } from "../../../lib/auth";
import AuthorDeletionSuccessClient from "./AuthorDeletionSuccessClient";
import { redirect } from "next/navigation";

export default async function AuthorDeletionSuccessPage() {
  // 🔒 Ensure the user is logged in
  const user: User = await fetchUserOrRedirect();
 if (!user) {
     redirect("/");
   }
  // ✅ Pass user to client component if needed
  return <AuthorDeletionSuccessClient user={user} />;
}
