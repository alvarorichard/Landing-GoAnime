"use client"

import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

// A block of shell commands with a copy button. Lines starting with "#" are
// shown as comments; the rest get a "$" prompt. Copying takes the commands
// only, so the clipboard holds something that can be pasted and run.
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const lines = code.trim().split("\n")
  const commands = lines.filter((line) => line.trim() && !line.trim().startsWith("#")).join("\n")

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
      <CopyButton text={commands} className="absolute right-2 top-2" />
    </div>
  )
}
