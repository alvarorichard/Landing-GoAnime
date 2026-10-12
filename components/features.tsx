"use client"

import { useRef } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { useLanguage } from "@/contexts/language-context"
import type { TranslationKey } from "@/lib/i18n"

const FEATURES: { title: TranslationKey; body: TranslationKey }[] = [
  { title: "features.sources.title", body: "features.sources.body" },
  { title: "features.languages.title", body: "features.languages.body" },
  { title: "features.download.title", body: "features.download.body" },
  { title: "features.resume.title", body: "features.resume.body" },
  { title: "features.discord.title", body: "features.discord.body" },
  { title: "features.upscale.title", body: "features.upscale.body" },
]

// The features as a list of episodes: EP.01 to EP.06, with the Japanese
// "episode n" (第n話) beside each number.
export function Features() {
  const { t } = useLanguage()
  const list = useRef<HTMLOListElement>(null)

  useGSAP(
    () => {
      if (!list.current || prefersReducedMotion()) return
      // Each row draws its rule across, then its content rises.
      for (const row of Array.from(list.current.children)) {
        const at = () => ({ trigger: row, start: "top 90%", once: true })
        gsap.from(row.querySelector("[data-rule]"), {
          scaleX: 0,
          duration: 1.2,
          ease: "expo.inOut",
          clearProps: "transform",
          scrollTrigger: at(),
        })
        gsap.from(row.querySelectorAll("[data-rise]"), {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.12,
          clearProps: "transform,opacity",
          scrollTrigger: at(),
        })
      }
    },
    { scope: list },
  )

  return (
    <section id="features" aria-labelledby="features-title" className="border-t border-border py-16 sm:py-20 lg:py-32">
      <div className="container space-y-10 lg:space-y-16">
        <SectionHeading
          id="features-title"
          index="02"
          label={t("nav.features")}
          jp="機能"
          title={t("features.title")}
          subtitle={t("features.subtitle")}
        />
        <ol ref={list} className="border-b border-line">
          {FEATURES.map(({ title, body }, i) => (
            <li
              key={title}
              className="group relative grid gap-2.5 py-6 sm:py-8 lg:grid-cols-[150px_minmax(0,1fr)_minmax(0,1.1fr)] lg:items-baseline lg:gap-10 lg:px-5 lg:py-9 lg:transition-colors lg:duration-500 lg:hover:bg-card"
            >
              <span data-rule="" aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <div data-rise="" className="flex items-baseline gap-3.5">
                <span className="font-mono text-xs tracking-[0.16em] text-subtle">
                  EP.{String(i + 1).padStart(2, "0")}
                </span>
                <span lang="ja" aria-hidden="true" className="font-display text-lg text-brand sm:text-xl">
                  第{i + 1}話
                </span>
              </div>
              <h3
                data-rise=""
                className="font-display text-[1.375rem] leading-tight sm:text-2xl lg:text-[clamp(1.5rem,2.2vw,1.875rem)] lg:transition-transform lg:duration-500 lg:ease-snap lg:group-hover:translate-x-2.5"
              >
                {t(title)}
              </h3>
              <p data-rise="" className="text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {t(body)}
              </p>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-700 ease-snap group-hover:scale-x-100"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
