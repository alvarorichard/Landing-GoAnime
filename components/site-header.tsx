"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Download, Star } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { GitHubIcon } from "@/components/icons"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { usePlatform } from "@/hooks/use-platform"
import type { TranslationKey } from "@/lib/i18n"
import { links } from "@/lib/links"
import { cn, formatCount } from "@/lib/utils"

// The home page's sections, in page order, numbered as their headings are.
const SECTIONS: { id: string; label: TranslationKey }[] = [
  { id: "demo", label: "nav.demo" },
  { id: "features", label: "nav.features" },
  { id: "install", label: "nav.install" },
  { id: "usage", label: "usage.title" },
  { id: "faq", label: "nav.faq" },
]

const number = (i: number) => String(i + 1).padStart(2, "0")

export function SiteHeader() {
  const { t, href, locale } = useLanguage()
  const { stars } = useProject()
  const platform = usePlatform()
  // open is what the visitor asked for; shown keeps the menu on screen while
  // it animates closed.
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef(false)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useGSAP(
    () => {
      const header = headerRef.current
      if (!header) return

      // Marks the section being read, on the home page.
      for (const { id } of SECTIONS) {
        const section = document.getElementById(id)
        if (!section) continue
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => setActive((current) => (self.isActive ? id : current === id ? null : current)),
        })
      }

      if (prefersReducedMotion()) return

      // Slides away while reading down, comes back on the way up, and stays
      // while the menu is open or anything in it has focus.
      let hidden = false
      const hide = (value: boolean) => {
        if (value === hidden) return
        hidden = value
        gsap.to(header, { yPercent: value ? -100 : 0, duration: 0.35, ease: "power2.out", overwrite: true })
      }
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (openRef.current || header.contains(document.activeElement)) hide(false)
          else if (self.direction === 1 && self.scroll() > 240) hide(true)
          else if (self.direction === -1) hide(false)
        },
      })
      const show = () => hide(false)
      header.addEventListener("focusin", show)
      return () => header.removeEventListener("focusin", show)
    },
    { scope: headerRef },
  )

  // The menu wipes down from under the bar and its rows follow; closing wipes
  // it back up before it is hidden.
  useGSAP(
    () => {
      const menu = menuRef.current
      if (!menu || !shown) return
      const reduce = prefersReducedMotion()
      if (open) {
        if (!reduce) {
          gsap.fromTo(
            menu,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "expo.out", clearProps: "clipPath" },
          )
          gsap.from(menu.querySelectorAll("[data-menu-item]"), {
            y: 28,
            opacity: 0,
            duration: 0.6,
            ease: "expo.out",
            stagger: 0.045,
            delay: 0.08,
            clearProps: "transform,opacity",
          })
        }
        menu.querySelector<HTMLElement>("a")?.focus({ preventScroll: true })
      } else if (reduce) {
        setShown(false)
      } else {
        gsap.to(menu, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.4,
          ease: "expo.in",
          onComplete: () => setShown(false),
        })
      }
    },
    { dependencies: [open, shown], scope: menuRef },
  )

  // While the menu covers the page: no scrolling behind it, the page out of
  // the tab order, Escape closes it, and it closes when the screen grows
  // into the desktop layout.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const behind = Array.from(document.querySelectorAll<HTMLElement>("main, footer"))
    root.style.overflow = "hidden"
    behind.forEach((el) => (el.inert = true))
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const desktop = window.matchMedia("(min-width: 64rem)")
    const onResize = () => desktop.matches && setOpen(false)
    window.addEventListener("keydown", onKey)
    desktop.addEventListener("change", onResize)
    return () => {
      root.style.overflow = ""
      behind.forEach((el) => (el.inert = false))
      window.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", onResize)
    }
  }, [open])

  const openMenu = () => {
    setShown(true)
    setOpen(true)
  }
  // A link in the menu: let the page scroll again before the browser jumps
  // to the section.
  const closeMenu = () => {
    document.documentElement.style.overflow = ""
    setOpen(false)
  }

  const starCount = stars !== null && (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      {formatCount(stars, locale)}
      <span className="sr-only">{t("hero.stars")}</span>
    </span>
  )

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between gap-4 lg:h-[4.25rem]">
          <Link href={href("/")} aria-label={t("nav.home")} className="group flex min-h-11 items-center gap-2.5">
            <BrandMark
              size={32}
              loading="eager"
              className="h-8 w-8 transition-transform duration-500 ease-snap group-hover:-rotate-6 group-hover:scale-110"
            />
            <span className="font-display text-[15px] tracking-[0.04em] lg:text-[17px]">GOANIME</span>
          </Link>

          <nav
            aria-label={t("nav.label")}
            className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.14em] lg:flex"
          >
            {SECTIONS.map(({ id, label }, i) => (
              <Link
                key={id}
                href={href(`/#${id}`)}
                aria-current={active === id ? "true" : undefined}
                className={cn(
                  "relative flex items-center gap-2 py-2 transition-colors",
                  active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-brand">{number(i)}</span>
                {t(label)}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand transition-transform duration-500 ease-snap",
                    active === id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden lg:flex" />
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline hidden h-9 items-center gap-2 px-3 font-mono text-xs lg:inline-flex"
            >
              <GitHubIcon className="h-4 w-4" />
              {starCount ? (
                <>
                  <span className="sr-only">GitHub,</span>
                  {starCount}
                </>
              ) : (
                "GitHub"
              )}
            </a>
            <Link
              href={href("/download")}
              className="btn-crimson hidden h-9 items-center px-3.5 text-sm font-semibold sm:inline-flex"
            >
              {t("nav.download")}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? setOpen(false) : openMenu())}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t("nav.menu.close") : t("nav.menu.open")}
              className="relative inline-flex h-11 w-11 items-center justify-center border border-line text-foreground transition-colors hover:bg-raised lg:hidden"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute h-0.5 w-5 bg-current transition-[translate,rotate] duration-300 ease-snap",
                  open ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute h-0.5 w-5 bg-current transition-[translate,rotate] duration-300 ease-snap",
                  open ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its blur and slide would trap a fixed element inside it. */}
      <div
        ref={menuRef}
        id="site-menu"
        hidden={!shown}
        className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto overscroll-contain bg-background lg:hidden"
      >
        <nav aria-label={t("nav.label")} className="container flex min-h-full flex-col gap-8 pb-8 pt-4">
          <ul className="border-t border-border">
            {SECTIONS.map(({ id, label }, i) => (
              <li key={id} data-menu-item="" className="border-b border-border">
                <Link
                  href={href(`/#${id}`)}
                  onClick={closeMenu}
                  aria-current={active === id ? "true" : undefined}
                  className="flex min-h-16 items-center gap-4 py-3"
                >
                  <span className="w-7 font-mono text-xs text-brand">{number(i)}</span>
                  <span className="font-display text-[1.75rem] leading-none">{t(label)}</span>
                  {active === id && <span aria-hidden="true" className="ml-auto h-2.5 w-2.5 bg-brand" />}
                </Link>
              </li>
            ))}
          </ul>

          <div data-menu-item="" className="flex flex-col gap-3">
            <LanguageSwitcher />
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex h-12 items-center justify-center gap-2.5 font-medium"
            >
              <GitHubIcon className="h-[18px] w-[18px]" />
              GitHub
              {stars !== null && <span className="font-mono text-xs text-muted-foreground">{starCount}</span>}
            </a>
          </div>

          <Link
            data-menu-item=""
            href={href("/download")}
            onClick={closeMenu}
            className="btn-crimson mt-auto flex h-14 items-center justify-center gap-2.5 text-base font-semibold"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            {platform ? t(`hero.download.${platform}`) : t("hero.download")}
          </Link>
        </nav>
      </div>
    </>
  )
}
