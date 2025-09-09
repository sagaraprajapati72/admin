import { fetchUserOrRedirect, User } from "@/lib/auth";
import AuthorCreatedClient from "./AuthorCreatedClient";
import { redirect } from "next/navigation";

export default async function AuthorCreatedPage() {
  const user: User | null = await fetchUserOrRedirect();

 if (!user) {
     redirect("/");
   }
  return <AuthorCreatedClient user={user} />;
}
