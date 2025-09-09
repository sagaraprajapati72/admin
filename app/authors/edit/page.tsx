import { fetchUserOrRedirect, User } from "../../../lib/auth";
import AuthorSearchClient from "./AuthorSearchClient";
import { redirect } from "next/navigation";


export default async function AuthorSearchPage() {
  // 🔒 Ensure user is logged in
  const user: User = await fetchUserOrRedirect();
 if (!user) {
     redirect("/");
   }
  // Pass user (if needed for UI or API calls)
  return <AuthorSearchClient user={user} />;
}
