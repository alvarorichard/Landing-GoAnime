"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { Download, Menu, Star, X } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { GitHubIcon } from "@/components/icons"
import { LanguageSwitcher } from "@/components/language-switcher"
import { EASE } from "@/components/motion"
import { LANGUAGES, useLanguage } from "@/contexts/language-context"
import { formatStars, useGitHubStars } from "@/hooks/use-github-stars"
import { links } from "@/lib/links"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { t, language } = useLanguage()
  const stars = useGitHubStars()
  const locale = LANGUAGES.find((l) => l.code === language)?.htmlLang ?? "pt-BR"
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  // Only flips at the threshold, so scrolling does not re-render the header.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8))

  // Close the menu on Escape and when the screen grows past the phone layout.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const desktop = window.matchMedia("(min-width: 768px)")
    const onResize = () => desktop.matches && setOpen(false)
    window.addEventListener("keydown", onKey)
    desktop.addEventListener("change", onResize)
    return () => {
      window.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", onResize)
    }
  }, [open])

  const nav = [
    { href: "/#features", label: t("nav.features") },
    { href: "/#demo", label: t("nav.demo") },
    { href: "/#install", label: t("nav.install") },
    { href: "/download", label: t("nav.download") },
  ]

  const starCount = stars !== null && (
    <span className="inline-flex items-center gap-1 border-l border-border pl-2 tabular-nums">
      <Star className="h-3.5 w-3.5" aria-hidden="true" />
      {formatStars(stars, locale)}
      <span className="sr-only">{t("hero.stars")}</span>
    </span>
  )

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled || open ? "border-border/70 bg-background/80 backdrop-blur-md" : "border-transparent bg-background/0",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={t("nav.home")} className="group flex items-center gap-2.5 rounded-md">
          <BrandMark
            size={30}
            priority
            className="transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110"
          />
          <span className="text-[17px] font-semibold tracking-tight">GoAnime</span>
        </Link>

        <nav aria-label={t("nav.label")} className="hidden items-center gap-1 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground md:h-9"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="hidden md:inline">GitHub</span>
            <span className="hidden md:inline-flex">{starCount}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.menu.close") : t("nav.menu.open")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-border/70 md:hidden"
          >
            <motion.nav
              aria-label={t("nav.label")}
              className="container flex flex-col gap-1 py-4"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {nav.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center rounded-md px-3 text-base text-foreground/90 hover:bg-white/[0.04]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-4"
              >
                <LanguageSwitcher />
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground"
                >
                  <GitHubIcon className="h-4 w-4" />
                  GitHub
                  {starCount}
                </a>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="pt-3">
                <Link
                  href="/download"
                  onClick={() => setOpen(false)}
                  className="btn-shine flex h-12 items-center justify-center gap-2 rounded-md bg-primary font-medium text-primary-foreground"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {t("hero.download")}
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
