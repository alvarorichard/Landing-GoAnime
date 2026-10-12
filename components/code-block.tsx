"use client"

import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

// Shell commands with a copy button. Lines starting with "#" are shown as
// comments; the rest get a "$" prompt. Copying takes the commands only, so
// the clipboard holds something that can be pasted and run. One command sits
// on a single row beside its button; several get a bar above them.
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const lines = code.trim().split("\n")
  const commands = lines.filter((line) => line.trim() && !line.trim().startsWith("#")).join("\n")

  const body = (
    <code>
      {lines.map((line, i) =>
        line.trim().startsWith("#") ? (
          <span key={i} className="block text-subtle">
            {line}
          </span>
        ) : line.trim() ? (
          <span key={i} className="block">
            <span className="select-none text-brand">$ </span>
            {line}
          </span>
        ) : (
          <span key={i} className="block h-3" />
        ),
      )}
    </code>
  )

  if (lines.length === 1) {
    return (
      <div className={cn("flex min-w-0 items-center border border-border bg-card", className)}>
        <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6 sm:text-sm">{body}</pre>
        <CopyButton text={commands} className="border-l border-border" />
      </div>
    )
  }

  return (
    <div className={cn("min-w-0 border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border pl-4">
        <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.16em] text-subtle">
          TERMINAL
        </span>
        <CopyButton text={commands} className="border-l border-border" />
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-[1.9] sm:px-5">{body}</pre>
    </div>
  )
}
