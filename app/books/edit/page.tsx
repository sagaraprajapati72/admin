import { fetchUserOrRedirect, User } from "../../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BookSearchClient from "./BookSearchClient";
import { redirect } from "next/navigation";

export default async function BookSearchPage() {
  const user: User | null = await fetchUserOrRedirect();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BookSearchClient user={user} />
      <Footer />
    </div>
  );
}
