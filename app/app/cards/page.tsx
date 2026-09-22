import { redirect } from "next/navigation";

/** Old all-cards list — Browse tab owns this now. */
export default function CardsRedirect() {
  redirect("/browse");
}
