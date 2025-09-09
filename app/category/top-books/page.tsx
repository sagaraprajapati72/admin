import { fetchUserOrRedirect, User } from "../../../lib/auth";
import TopBooksByCategoryClient from "./TopBooksByCategoryClient";

export default async function TopBooksByCategoryPage() {
  const user: User | null = await fetchUserOrRedirect();

  if (!user) {
    // redirect handled in fetchUserOrRedirect
    return null;
  }

  return <TopBooksByCategoryClient user={user} />;
}
