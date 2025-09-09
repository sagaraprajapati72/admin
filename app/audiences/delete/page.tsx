import { fetchUserOrRedirect, User } from "../../../lib/auth";
import DeleteAudienceClient from "./DeleteAudienceClient";
import { redirect } from "next/navigation";


export default async function DeleteAudiencePage() {
  const user: User = await fetchUserOrRedirect();
  if (!user) {
    redirect("/");
  }

  // Explicitly type the initial audiences as Audience[]
  const initialAudiences: Audience[] = []; // empty for now

  return <DeleteAudienceClient user={user} initialAudiences={initialAudiences} />;
}

// Make sure you export the Audience type so client can import it
export type Audience = {
  id: number;
  targetGroup: string;
};
