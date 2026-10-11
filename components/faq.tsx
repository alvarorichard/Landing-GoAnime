"use client"

import { Fragment, useEffect } from "react"
import { ArrowUpRight, Plus } from "lucide-react"
import { Stagger, StaggerItem } from "@/components/motion"
import { useLanguage, type TranslationKey } from "@/contexts/language-context"
import { links } from "@/lib/links"

type QuestionId = "windows" | "mpv" | "downloads" | "sources" | "mobile" | "uninstall"

const QUESTIONS: { id: QuestionId; link?: { href: string; label: TranslationKey } }[] = [
  { id: "windows" },
  { id: "mpv" },
  { id: "downloads" },
  { id: "sources", link: { href: links.issues, label: "faq.sources.link" } },
  { id: "mobile", link: { href: links.mobile, label: "faq.mobile.link" } },
  { id: "uninstall" },
]

// Text between backticks is shown as code.
function withCode(text: string) {
  return text.split("`").map((part, i) =>
    i % 2 ? (
      <code key={i} className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[0.85em] break-words text-foreground">
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

// Questions as native <details>, so the answers are in the HTML and open
// without JavaScript. Each has an id (#faq-windows and so on) that opens it,
// for linking an answer from Discord or an issue.
export function Faq() {
  const { t } = useLanguage()

  useEffect(() => {
    const openFromHash = () => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (target instanceof HTMLDetailsElement) target.open = true
    }
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [])

  return (
    <div className="space-y-6">
      <Stagger className="divide-y divide-border rounded-xl border border-border">
        {QUESTIONS.map(({ id, link }) => (
          <StaggerItem key={id}>
            <details id={`faq-${id}`} className="faq-item group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {t(`faq.${id}.q`)}
                <Plus
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground transition duration-300 group-hover:text-foreground group-open:rotate-45 group-open:text-brand"
                />
              </summary>
              <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                <p className="max-w-3xl text-pretty">{withCode(t(`faq.${id}.a`))}</p>
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1 font-medium text-brand"
                  >
                    {t(link.label)}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  </a>
                )}
              </div>
            </details>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="text-sm text-muted-foreground">
        {t("faq.more")}{" "}
        <a
          href={links.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          {t("faq.more.link")}
        </a>
      </p>
    </div>
  )
}
