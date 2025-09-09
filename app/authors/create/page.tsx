import { fetchUserOrRedirect, User } from "../../../lib/auth";
import CreateAuthorClient from "./CreateAuthorClient";
import { redirect } from "next/navigation";


export default async function CreateAuthorPage() {
  // 🔒 Ensure user is logged in
  const user: User = await fetchUserOrRedirect();
if (!user) {
    redirect("/");
  }

  // ✅ Pass user to client component if needed
  return <CreateAuthorClient user={user} />;
}
