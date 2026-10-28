"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { REPO } from "@/lib/releases"

// The same recording the GoAnime README shows, read straight from the
// repository, so the site follows it whenever it is re-recorded. A GIF cannot
// be paused, so visitors who asked for reduced motion get a still instead.
const DEMO_GIF = `https://raw.githubusercontent.com/${REPO}/main/docs/demo/demo.gif`

export function DemoVideo() {
  const { t } = useLanguage()
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(query.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={reduceMotion ? "/demo/goanime-demo-poster.png" : DEMO_GIF}
      className="block h-auto w-full"
      width={1200}
      height={640}
      alt={t("demo.subtitle")}
      decoding="async"
    />
  )
}
