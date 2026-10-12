"use client"

import { useRef } from "react"
import { DemoVideo } from "@/components/demo-video"
import { Reveal, gsap, prefersReducedMotion, useGSAP } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { useLanguage } from "@/contexts/language-context"

// The terminal recording in a panel with a hard crimson shadow. As it scrolls
// into place the panel grows to full size and the shadow slides out from
// behind it.
export function DemoSection() {
  const { t } = useLanguage()
  const panel = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!panel.current || prefersReducedMotion()) return
      gsap.from(panel.current, {
        scale: 0.9,
        "--offset": "0px",
        ease: "none",
        scrollTrigger: { trigger: panel.current, start: "top bottom", end: "top 35%", scrub: 0.8 },
      })
    },
    { scope: panel },
  )

  return (
    <section id="demo" aria-labelledby="demo-title" className="border-t border-border py-16 sm:py-20 lg:py-32">
      <div className="container space-y-10 lg:space-y-16">
        <SectionHeading
          id="demo-title"
          index="01"
          label={t("nav.demo")}
          jp="デモ"
          title={t("demo.title")}
          subtitle={t("demo.subtitle")}
        />
        <figure className="space-y-5">
          <div
            ref={panel}
            className="mr-2 border-2 border-paper bg-black [--offset:8px] sm:mr-3.5 sm:[--offset:14px]"
            style={{ boxShadow: "var(--offset) var(--offset) 0 var(--primary)" }}
          >
            <DemoVideo />
          </div>
          <Reveal
            as="figcaption"
            className="flex items-start gap-3 font-mono text-xs leading-relaxed text-subtle sm:text-[13px]"
          >
            <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 shrink-0 bg-brand" />
            {t("demo.caption")}
          </Reveal>
        </figure>
      </div>
    </section>
  )
}
