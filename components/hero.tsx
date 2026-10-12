"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Download, Smartphone, Star } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { GitHubIcon } from "@/components/icons"
import { MaskedWords, gsap, prefersReducedMotion, useGSAP } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { usePlatform } from "@/hooks/use-platform"
import { links } from "@/lib/links"
import { formatCount } from "@/lib/utils"

// The keys GoAnime's own interface lists at the bottom of the screen.
const KEYS = [
  ["↑/k", "up"],
  ["↓/j", "down"],
  ["/", "filter"],
  ["enter", "open"],
  ["esc", "back"],
] as const

export function Hero() {
  const { t, href, locale } = useLanguage()
  const { release, stars } = useProject()
  const platform = usePlatform()
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root || prefersReducedMotion()) return
      const q = gsap.utils.selector(root)

      // The intro: the disc of dots spins in, the dragon wipes up out of it,
      // the headline rises word by word and the rest follows. Every piece
      // here carries data-intro, which keeps it hidden until this runs.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q("[data-sun]"), { autoAlpha: 0, scale: 0.35, rotation: -40, duration: 1.8, ease: "power4.out" }, 0)
        .from(q("[data-ring]"), { autoAlpha: 0, scale: 0.6, duration: 1.6 }, 0.1)
        .fromTo(
          q("[data-dragon]"),
          { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)", yPercent: 10, scale: 1.08 },
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            yPercent: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            clearProps: "clipPath,transform",
          },
          0.2,
        )
        .from(q("[data-word]"), { autoAlpha: 0, yPercent: 120, duration: 1.2, stagger: 0.07, clearProps: "transform" }, 0.15)
        .from(q("[data-rise]"), { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08, clearProps: "transform" }, 0.55)
        .fromTo(
          q("[data-vjp]"),
          { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut", clearProps: "clipPath" },
          0.5,
        )
        .from(q("[data-status]"), { autoAlpha: 0, yPercent: 100, duration: 0.9, clearProps: "transform" }, 0.7)

      // Afterwards the dragon breathes and the dots turn, slowly.
      gsap.to(q("[data-float]"), { y: -12, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 })
      gsap.to(q("[data-sun]"), { rotation: "+=360", duration: 180, ease: "none", repeat: -1, delay: 1.8 })

      const cleanups: (() => void)[] = []

      // With a mouse, the dragon leans toward the pointer and the dots drift
      // the other way.
      if (window.matchMedia("(pointer: fine)").matches) {
        const [tilt] = q("[data-tilt]")
        const [sun] = q("[data-sun-wrap]")
        gsap.set(tilt, { transformPerspective: 1000 })
        const ease = { duration: 0.9, ease: "power3.out" }
        const rotateY = gsap.quickTo(tilt, "rotationY", ease)
        const rotateX = gsap.quickTo(tilt, "rotationX", ease)
        const moveX = gsap.quickTo(tilt, "x", ease)
        const sunX = gsap.quickTo(sun, "x", ease)
        const sunY = gsap.quickTo(sun, "y", ease)
        const onMove = (e: PointerEvent) => {
          const rect = root.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width - 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5
          rotateY(x * 16)
          rotateX(y * -12)
          moveX(x * 16)
          sunX(x * -30)
          sunY(y * -24)
        }
        const onLeave = () => [rotateY, rotateX, moveX, sunX, sunY].forEach((to) => to(0))
        root.addEventListener("pointermove", onMove)
        root.addEventListener("pointerleave", onLeave)
        cleanups.push(() => {
          root.removeEventListener("pointermove", onMove)
          root.removeEventListener("pointerleave", onLeave)
        })
      }

      // Side by side (from lg), the art sinks and the text fades as the hero
      // scrolls away. Stacked on a phone, that would slide one over the other.
      if (window.matchMedia("(min-width: 64rem)").matches) {
        const scrollTrigger = { trigger: root, start: "top top", end: "bottom top", scrub: true }
        gsap.to(q("[data-art]"), { yPercent: 12, ease: "none", scrollTrigger })
        gsap.to(q("[data-hero-text]"), { yPercent: -6, opacity: 0.25, ease: "none", scrollTrigger: { ...scrollTrigger } })
      }

      return () => cleanups.forEach((cleanup) => cleanup())
    },
    { scope: ref },
  )

  const downloadLabel = platform ? t(`hero.download.${platform}`) : t("hero.download")

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="panel-cols pointer-events-none absolute inset-0 -z-10" />

      <div className="container grid gap-6 pb-12 pt-4 sm:gap-8 sm:pb-16 sm:pt-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-6 lg:pb-20 lg:pt-20">
        {/* The art: a banner above the text on phones, beside it from lg. */}
        <div data-art="" className="relative h-64 sm:h-80 lg:order-2 lg:h-[min(44vw,620px)]">
          <div data-sun-wrap="" aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <div
              data-sun=""
              data-intro=""
              className="halftone-crimson aspect-square w-[min(118vw,30rem)] shrink-0 sm:w-[36rem] lg:w-[min(130%,680px)]"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <div
              data-ring=""
              data-intro=""
              className="aspect-square w-[min(76vw,18rem)] shrink-0 rounded-full border border-line sm:w-[24rem] lg:w-[min(104%,580px)]"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div data-tilt="" className="w-[min(60vw,15rem)] sm:w-[19rem] lg:w-[min(92%,520px)]">
              <div data-float="">
                <div data-dragon="" data-intro="">
                  <BrandMark
                    size={520}
                    loading="eager"
                    fetchPriority="high"
                    className="h-auto w-full drop-shadow-[0_28px_50px_rgba(0,0,0,0.55)]"
                  />
                </div>
              </div>
            </div>
          </div>
          <span
            data-vjp=""
            data-intro=""
            lang="ja"
            aria-hidden="true"
            className="absolute right-0 top-1 hidden font-display text-sm tracking-[0.5em] text-subtle [writing-mode:vertical-rl] sm:block"
          >
            ターミナルでアニメ
          </span>
        </div>

        <div data-hero-text="" className="relative z-10 flex min-w-0 flex-col items-start gap-5 sm:gap-6 lg:order-1 lg:gap-7">
          {release && (
            <a
              data-rise=""
              data-intro=""
              href={release.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline group inline-flex min-h-11 items-center gap-3 py-1 pl-1 pr-3.5 font-mono text-xs sm:text-[13px]"
            >
              <span className="bg-primary px-2 py-1 font-semibold tracking-wide text-primary-foreground">
                {release.tag_name}
              </span>
              {t("hero.release")}
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          )}

          <MaskedWords
            as="h1"
            id="hero-title"
            play="parent"
            text={t("hero.title")}
            after={
              <span
                aria-hidden="true"
                className="cursor-blink ml-[0.14em] inline-block h-[0.8em] w-[0.48em] bg-brand align-[-0.04em]"
              />
            }
            className="font-display text-[clamp(2.25rem,10.5vw,4rem)] leading-[1.04] tracking-[-0.01em] text-balance lg:text-[clamp(3.25rem,6vw,5.5rem)]"
          />

          <p
            data-rise=""
            data-intro=""
            className="max-w-[33em] text-pretty text-[17px] leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("hero.subtitle")}
          </p>

          <div data-rise="" data-intro="" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href={href("/download")}
              className="btn-crimson inline-flex h-14 items-center justify-center gap-3 px-5 text-base font-semibold"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              {downloadLabel}
              {release && (
                <span className="border-l border-white/35 pl-3 font-mono text-xs font-medium text-white/85">
                  {release.tag_name}
                </span>
              )}
            </Link>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex h-14 items-center justify-center gap-2.5 px-5 text-base font-medium"
            >
              <GitHubIcon className="h-[18px] w-[18px]" />
              {t("hero.github")}
              {stars !== null && (
                <span className="inline-flex items-center gap-1.5 border-l border-line pl-3 font-mono text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                  {formatCount(stars, locale)}
                  <span className="sr-only">{t("hero.stars")}</span>
                </span>
              )}
            </a>
          </div>

          <p data-rise="" data-intro="" className="font-mono text-[13px] tracking-wide text-subtle">
            {t("hero.eyebrow")}
          </p>

          {/* On a touch screen, say up front that this is a desktop app, and
              where the Android one is. */}
          <p
            data-rise=""
            data-intro=""
            className="hidden flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground pointer-coarse:flex lg:hidden"
          >
            <Smartphone className="h-4 w-4 text-brand" aria-hidden="true" />
            {t("hero.mobile")}
            <a
              href={links.mobile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-medium text-brand"
            >
              {t("faq.mobile.link")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>

      {/* A copy of GoAnime's own status line, from md up. */}
      <div data-status="" data-intro="" aria-hidden="true" className="hidden border-t border-border bg-panel md:block">
        <div className="container flex h-12 items-center justify-between gap-5 overflow-hidden whitespace-nowrap font-mono text-xs text-subtle">
          <span className="flex items-center gap-3">
            <span className="bg-primary px-2 py-0.5 font-semibold tracking-[0.06em] text-primary-foreground">
              GOANIME
            </span>
            Search › Results
          </span>
          <span className="hidden items-center gap-3.5 lg:flex">
            {KEYS.map(([key, action], i) => (
              <span key={key} className="flex items-center gap-3.5">
                {i > 0 && <span>·</span>}
                <span>
                  <span className="text-foreground">{key}</span> {action}
                </span>
              </span>
            ))}
          </span>
          <span>PT-BR · EN</span>
        </div>
      </div>
    </section>
  )
}
