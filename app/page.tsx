// app/login/page.tsx
import { redirect } from "next/navigation";
import { fetchUserOrRedirect } from "@/lib/auth";
import LoginClient from "./components/LoginClient";

export default async function LoginPage() {
  try {
    // 🔒 Check if user is already logged in
    const user = await fetchUserOrRedirect();

    // If user exists, redirect to dashboard
    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // Not logged in, render client login form
  }

  return <LoginClient />;
}
