"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { DemoVideo } from "@/components/demo-video"
import { EASE } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"

// The terminal recording, which tilts up from a 3D angle into place as it
// scrolls into view.
export function DemoSection({ heading }: { heading: React.ReactNode }) {
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 24, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0.9, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [reduceMotion ? 1 : 0.35, 1])

  return (
    <section id="demo" aria-labelledby="demo-title" className="border-t border-border/70 py-16 md:py-28">
      <div className="container space-y-10">
        {heading}
        <figure className="space-y-4">
          <div ref={ref} style={{ perspective: 1400 }}>
            <motion.div
              style={{ rotateX, scale, opacity, transformOrigin: "50% 0%" }}
              className="overflow-hidden rounded-xl border border-border bg-black shadow-[0_30px_90px_-45px_hsl(var(--primary)/0.45)]"
            >
              <DemoVideo />
            </motion.div>
          </div>
          <motion.figcaption
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            {t("demo.caption")}
          </motion.figcaption>
        </figure>
      </div>
    </section>
  )
}
