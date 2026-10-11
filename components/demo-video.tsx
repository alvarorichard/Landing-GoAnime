"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

// The recording from the GoAnime repository (docs/demo). It loops silently;
// for visitors who asked for reduced motion it waits for them to press play.
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
    <video
      key={reduceMotion ? "still" : "loop"}
      className="block h-auto w-full"
      width={1200}
      height={640}
      poster="/demo/goanime-demo-poster.png"
      autoPlay={!reduceMotion}
      controls={reduceMotion}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={t("demo.subtitle")}
    >
      <source src="/demo/goanime-demo.webm" type="video/webm" />
      <source src="/demo/goanime-demo.mp4" type="video/mp4" />
      {t("demo.fallback")}
    </video>
  )
}
