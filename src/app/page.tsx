import { redirect } from "next/navigation";

/**
 * Root page — redirects to the login page.
 * This is the entry point for unauthenticated users.
 */
export default function Home() {
  redirect("/login");
}
