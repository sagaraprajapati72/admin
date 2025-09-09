import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export type User = {

  name: string;
};

export async function fetchUserOrRedirect(): Promise<User> {
  
  // 👇 Await cookies() because it's async in this context
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  console.log("➡️ Forwarding cookies to backend:", cookieHeader);

  const res = await fetch(`${process.env.READ_BACKEND_URL}/api/admin/me`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader, // ✅ explicitly forward cookies
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    console.warn("🔒 Unauthorized: redirecting to login");
    redirect("/");
  }

  if (!res.ok) {
    console.error("❌ Backend error:", res.status, res.statusText);
    redirect("/");
  }

  return res.json();
}
export async function fetchUserSafe(): Promise<User | null> {
  // 👇 Extract cookies from Next.js request context
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  console.log("➡️ Forwarding cookies to backend:", cookieHeader);

  const res = await fetch(`${process.env.READ_BACKEND_URL}/api/admin/me`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader, // ✅ Explicitly pass session cookies
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    return null; // not logged in
  }

  if (!res.ok) {
    return null;
  }

  return res.json();
}
