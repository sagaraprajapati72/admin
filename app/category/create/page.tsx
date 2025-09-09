import { fetchUserOrRedirect, User } from "../../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CreateCategoryClient from "./CreateCategoryClient";
import { redirect } from "next/navigation";

export default async function CreateCategoryPage() {
  const user: User | null = await fetchUserOrRedirect();

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <CreateCategoryClient user={user} />
      <Footer />
    </div>
  );
}
