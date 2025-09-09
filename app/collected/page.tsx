import { fetchUserOrRedirect, User } from "../../lib/auth";
import PendingDispatchClient from "./PendingDispatchClient";

export default async function PendingDispatchPage() {
  const user: User | null = await fetchUserOrRedirect();

  if (!user) {
    // redirect handled in fetchUserOrRedirect
    return null;
  }

  return <PendingDispatchClient user={user} />;
}
