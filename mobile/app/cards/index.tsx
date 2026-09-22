import { Redirect } from "expo-router";

/** Old /cards list route → Browse tab */
export default function CardsIndexRedirect() {
  return <Redirect href="/browse" />;
}
