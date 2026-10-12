import { notFound } from "next/navigation"

// Any path no page matches, so the 404 renders inside the site's layout, in
// the language of the URL.
export default function UnknownPage() {
  notFound()
}
