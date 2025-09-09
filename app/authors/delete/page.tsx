import { fetchUserOrRedirect, User } from "../../../lib/auth";
import DeleteAuthorClient from "./DeleteAuthorClient";
import { redirect } from "next/navigation";


export default async function DeleteAuthorPage() {
  // 🔒 Ensure the user is logged in
  const user: User = await fetchUserOrRedirect();
 if (!user) {
     redirect("/");
   }
  // ✅ Pass user to client component if needed
  return <DeleteAuthorClient user={user} />;
}
