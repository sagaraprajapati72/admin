import { fetchUserOrRedirect, User } from "../../../lib/auth";
import CategoryCreatedClient from "./CategoryCreatedClient";

export default async function CategoryCreatedPage() {
  const user: User | null = await fetchUserOrRedirect();

  if (!user) {
    // fetchUserOrRedirect already handles redirect to login
    return null;
  }

  return <CategoryCreatedClient user={user} />;
}
