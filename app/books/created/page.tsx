// app/books/created/page.tsx
import { fetchUserOrRedirect, User } from "../../../lib/auth";
import BookCreatedClient from "./BookCreatedClient";
import { redirect } from "next/navigation";

export default async function BookCreatedPage() {
  const user = await fetchUserOrRedirect(); // 🔐 ensure logged-in user
   if (!user) {
     redirect("/");
   }
  return <BookCreatedClient user={user} />;
}
