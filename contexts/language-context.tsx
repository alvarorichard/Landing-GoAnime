"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  DEFAULT_LANGUAGE,
  htmlLang,
  isLanguage,
  localizedPath,
  pathWithoutLanguage,
  translate,
  type Language,
  type TranslationKey,
} from "@/lib/i18n"

type LanguageContextType = {
  language: Language
  // Opens the current page in another language and remembers the choice.
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
  // BCP 47 tag for Intl formatting, such as "pt-BR".
  locale: string
  // An internal link in the current language: "/download" becomes "/en/download".
  href: (path: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "language"

// The blocks a page is made of, in the same order in every language: the
// sections of <main>, then the footer.
const BLOCKS = "main > *, footer"

type ReadingPosition = { block: number; progress: number; line: number } | "end"

// Where the visitor was reading when they changed language, so the page in
// the new language opens at the same place instead of at its top. It is kept
// as the block at the reading line (the bottom of the header, or the top of
// the screen while the header is away) and how far into that block the line
// was, which still points to the same place when the translation is longer
// or shorter.
let pendingPosition: ReadingPosition | null = null

function readingPosition(): ReadingPosition | null {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) return "end"
  const line = Math.max(0, document.querySelector("header")?.getBoundingClientRect().bottom ?? 0)
  const blocks = Array.from(document.querySelectorAll<HTMLElement>(BLOCKS))
  const block = blocks.findIndex((el) => el.getBoundingClientRect().bottom > line)
  if (block < 0) return null
  const { top, height } = blocks[block].getBoundingClientRect()
  return { block, progress: height > 0 ? (line - top) / height : 0, line }
}

// Anything the visitor does after the switch ends the restoring.
const INTERACTIONS = ["wheel", "touchstart", "keydown", "pointerdown"] as const

// Puts the visitor back where they were, and holds them there, frame by
// frame, while the new page settles: just after the first paint the install
// tabs switch to the visitor's system and grow, ScrollTrigger measures the
// page by scrolling it to the top and back, and the browser's own scroll
// anchoring nudges it, all of which would move the place they were reading.
// It lets go at the visitor's first scroll, tap or key, or after 1.2 seconds.
function restorePosition(position: ReadingPosition) {
  const root = document.documentElement
  const block = position === "end" ? null : document.querySelectorAll<HTMLElement>(BLOCKS)[position.block]
  if (position !== "end" && !block) return

  // Where the block's top belongs on screen: above the reading line, by how
  // far into the block it was.
  const offset =
    block && position !== "end" ? position.line - position.progress * block.getBoundingClientRect().height : 0
  const until = performance.now() + 1200
  let frame = 0

  const stop = () => {
    cancelAnimationFrame(frame)
    for (const type of INTERACTIONS) window.removeEventListener(type, stop)
  }
  const place = () => {
    if (block) window.scrollBy({ top: block.getBoundingClientRect().top - offset, behavior: "instant" })
    else window.scrollTo({ top: root.scrollHeight, behavior: "instant" })
    if (performance.now() < until) frame = requestAnimationFrame(place)
    else stop()
  }

  for (const type of INTERACTIONS) window.addEventListener(type, stop, { passive: true })
  place()
}

// The language comes from the URL, which the root layout reads.
export function LanguageProvider({ language, children }: { language: Language; children: React.ReactNode }) {
  const router = useRouter()

  // Someone who picked English or Spanish before gets it again on the
  // Portuguese URLs. /en and /es are never redirected, and crawlers, which
  // keep no storage, always get the page they asked for.
  useEffect(() => {
    if (language !== DEFAULT_LANGUAGE) return
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      // Storage can be unavailable (private mode); stay on this page.
    }
    if (saved && saved !== DEFAULT_LANGUAGE && isLanguage(saved)) {
      router.replace(localizedPath(saved, location.pathname + location.hash))
    }
  }, [language, router])

  // Back to where the visitor was, before the new page is first painted.
  useLayoutEffect(() => {
    const position = pendingPosition
    pendingPosition = null
    if (position) restorePosition(position)
  }, [language])

  const setLanguage = useCallback(
    (next: Language) => {
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Not remembered; the switch still happens.
      }
      pendingPosition = readingPosition()
      router.push(localizedPath(next, pathWithoutLanguage(location.pathname) + location.hash), { scroll: false })
    },
    [router],
  )

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t: (key) => translate(language, key),
      locale: htmlLang(language),
      href: (path) => localizedPath(language, path),
    }),
    [language, setLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
