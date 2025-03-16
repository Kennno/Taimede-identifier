import { redirect } from "next/navigation";

export default async function Pricing() {
  // Redirect to home page where pricing plans are already shown
  return redirect("/");
}
