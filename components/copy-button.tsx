"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// Copies text to the clipboard and confirms it for two seconds, on screen and
// to screen readers.
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

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
          className,
        )}
        aria-label={copied ? t("copy.copied") : t("copy.copy")}
        title={copied ? t("copy.copied") : t("copy.copy")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t("copy.copied") : ""}
      </span>
    </>
  )
}
