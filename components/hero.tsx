"use client"

import type React from "react"
import { useRef, type PointerEvent } from "react"
import Link from "next/link"
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Download } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { GitHubIcon } from "@/components/icons"
import { EASE } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { usePlatform } from "@/hooks/use-platform"
import { links } from "@/lib/links"

// Three slow crimson lights. Each drifts on its own period, so the pattern
// never visibly repeats.
const AURORA: React.CSSProperties[] = [
  {
    width: "70vmax",
    height: "70vmax",
    left: "35%",
    top: "-35%",
    background: "radial-gradient(closest-side, hsl(var(--primary) / 0.32), transparent)",
    ["--aurora-x" as string]: "7%",
    ["--aurora-y" as string]: "9%",
    ["--aurora-duration" as string]: "21s",
  },
  {
    width: "55vmax",
    height: "55vmax",
    left: "-20%",
    top: "10%",
    background: "radial-gradient(closest-side, hsl(345 70% 22% / 0.45), transparent)",
    ["--aurora-x" as string]: "-6%",
    ["--aurora-y" as string]: "-7%",
    ["--aurora-duration" as string]: "27s",
  },
  {
    width: "40vmax",
    height: "40vmax",
    left: "60%",
    top: "35%",
    background: "radial-gradient(closest-side, hsl(353 100% 68% / 0.16), transparent)",
    ["--aurora-x" as string]: "-9%",
    ["--aurora-y" as string]: "6%",
    ["--aurora-duration" as string]: "17s",
  },
]

export function Hero() {
  const { t, language } = useLanguage()
  const { release } = useProject()
  const platform = usePlatform()
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  // Pointer position within the hero, -0.5 to 0.5 on each axis, eased by a
  // spring so the mark follows the cursor without jitter.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const spring = { stiffness: 110, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [12, -12]), spring)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-16, 16]), spring)

  // As the hero scrolls away, the mark drifts up and dims.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const markY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90])
  const markOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduceMotion ? 1 : 0.15])

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const words = t("hero.title").split(" ")
  const downloadLabel = platform ? t(`hero.download.${platform}`) : t("hero.download")
  const intro = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  })

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        {AURORA.map((style, i) => (
          <div key={i} className="aurora-blob" style={style} />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="container grid items-center gap-10 pb-16 pt-8 md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-24 lg:py-32">
        {/* The mark comes first on phones, beside the text from md up. */}
        <motion.div
          style={{ y: markY, opacity: markOpacity }}
          className="flex justify-center md:order-2 md:justify-end"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.82, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.1 }}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="animate-glow absolute inset-[12%] -z-10 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.55),transparent)]"
            />
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <BrandMark
                size={440}
                alt="GoAnime"
                priority
                className="h-auto w-[min(240px,62vw)] drop-shadow-[0_24px_60px_rgba(0,0,0,0.65)] md:w-[min(440px,40vw)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="space-y-6 md:order-1 md:space-y-7">
          {release && (
            <motion.a
              {...intro(0)}
              href={release.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-beam group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] py-1 pl-1 pr-3 text-[13px] text-muted-foreground backdrop-blur-xs transition-colors hover:text-foreground"
            >
              <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-xs text-brand">
                {release.tag_name}
              </span>
              {t("hero.release")}
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </motion.a>
          )}

          <h1
            id="hero-title"
            key={language}
            className="text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[4.1rem]"
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%", opacity: 0, filter: "blur(8px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.12 + i * 0.07 }}
                >
                  {word}
                </motion.span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h1>

          <motion.p {...intro(0.45)} className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </motion.p>

          <motion.div {...intro(0.6)} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="btn-shine group h-12 w-full px-5 sm:w-auto">
              <Link href="/download">
                <Download aria-hidden="true" />
                {downloadLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="-ml-0.5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full border-border bg-white/[0.02] px-5 backdrop-blur-xs hover:bg-white/[0.06] sm:w-auto"
            >
              <a href={links.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
                {t("hero.github")}
              </a>
            </Button>
          </motion.div>

          <motion.p {...intro(0.7)} className="font-mono text-[13px] tracking-wide text-muted-foreground">
            {t("hero.eyebrow")}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
