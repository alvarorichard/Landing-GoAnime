"use client"

import { Fragment, useRef } from "react"
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"

// A tilted crimson band that runs the features past, faster while the page
// scrolls. It repeats what the features section says, so screen readers skip
// it.
export function Marquee() {
  const { t } = useLanguage()
  const track = useRef<HTMLDivElement>(null)

  const items = [
    t("features.sources.title"),
    t("features.languages.title"),
    t("features.download.title"),
    t("features.resume.title"),
    "Discord Rich Presence",
    "Anime4K",
    "mpv",
  ]

  useGSAP(
    () => {
      const el = track.current
      if (!el || prefersReducedMotion()) return

      // Two identical halves: sliding by one half loops without a seam.
      const loop = gsap.to(el, { xPercent: -50, duration: 34, ease: "none", repeat: -1 })
      let settle: gsap.core.Tween | undefined

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const boost = 1 + Math.min(4, Math.abs(self.getVelocity()) / 450)
          gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true })
          settle?.kill()
          settle = gsap.to(loop, { timeScale: 1, duration: 1.4, delay: 0.25, ease: "power2.out" })
        },
      })
      // No need to keep it running off screen.
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      })
    },
    { scope: track },
  )

  const half = (
    <div className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8">
      {items.map((item) => (
        <Fragment key={item}>
          <span>{item}</span>
          <span className="text-ink">・</span>
        </Fragment>
      ))}
    </div>
  )

  return (
    <div aria-hidden="true" className="overflow-hidden py-8 sm:py-11">
      <div className="-mx-10 -rotate-[1.6deg] border-y-2 border-paper bg-primary">
        <div
          ref={track}
          className="flex w-max whitespace-nowrap py-3 font-display text-lg leading-none text-white sm:py-4 sm:text-[1.625rem]"
        >
          {half}
          {half}
        </div>
      </div>
    </div>
  )
}
