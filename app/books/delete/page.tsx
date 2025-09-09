// app/books/delete/page.tsx
import { fetchUserOrRedirect, User } from "../../../lib/auth";
import DeleteBookClient from "./DeleteBookClient";
import { redirect } from "next/navigation";

export default async function DeleteBookPage() {
  const user = await fetchUserOrRedirect(); // 🔐 ensure authenticated
   if (!user) {
     redirect("/");
   }
  return <DeleteBookClient user={user} />;
}
