"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// A block of shell commands with a copy button. Lines starting with "#" are
// shown as comments; the rest get a "$" prompt. Copying takes the commands
// only, so the clipboard holds something that can be pasted and run.
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lines = code.trim().split("\n")
  const commands = lines.filter((line) => line.trim() && !line.trim().startsWith("#")).join("\n")

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commands)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard refused (insecure context or permissions); the text stays selectable.
    }
  }

  return (
    <div className={cn("group relative rounded-lg border border-border bg-black/40", className)}>
      <pre className="overflow-x-auto px-4 py-3.5 pr-14 font-mono text-[13px] leading-6">
        <code>
          {lines.map((line, i) =>
            line.trim().startsWith("#") ? (
              <span key={i} className="block text-muted-foreground">
                {line}
              </span>
            ) : line.trim() ? (
              <span key={i} className="block">
                <span className="select-none text-muted-foreground/70">$ </span>
                {line}
              </span>
            ) : (
              <span key={i} className="block h-3" />
            ),
          )}
        </code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        aria-label={copied ? t("copy.copied") : t("copy.copy")}
        title={copied ? t("copy.copied") : t("copy.copy")}
      >
        {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t("copy.copied") : ""}
      </span>
    </div>
  )
}
