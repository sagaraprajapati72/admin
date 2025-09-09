import { fetchUserOrRedirect, User } from "../../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BookDeletionSuccessClient from "./BookDeletionSuccessClient";
import { redirect } from "next/navigation";

export default async function BookDeletionSuccessPage() {
  const user: User | null = await fetchUserOrRedirect();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BookDeletionSuccessClient user={user} />
      <Footer />
    </div>
  );
}
