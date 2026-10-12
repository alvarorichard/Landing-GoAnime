"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// Copies text to the clipboard and confirms it for two seconds, on screen and
// to screen readers. A 44px square with just the icon on phones; the word
// joins it from sm up.
export function CopyButton({ text, className }: { text: string; className?: string }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard refused (insecure context or permissions); the text stays selectable.
    }
  }

  const label = copied ? t("copy.copied") : t("copy.copy")

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className={cn(
          "inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-raised hover:text-foreground",
          className,
        )}
      >
        {copied ? (
          <Check className="h-4 w-4 text-brand" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        <span aria-hidden="true" className="hidden sm:inline">
          {label}
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t("copy.copied") : ""}
      </span>
    </>
  )
}
