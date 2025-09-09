// app/books/create/page.tsx
import { fetchUserOrRedirect, User } from "../../../lib/auth";
import CreateBookClient from "./CreateBookClient";
import { redirect } from "next/navigation";

export default async function CreateBookPage() {
  // 🔒 Ensure the user is logged in before rendering the page
  const user = await fetchUserOrRedirect();
 if (!user) {
     redirect("/");
   }
  return <CreateBookClient user={user} />;
}
