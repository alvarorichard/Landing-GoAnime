"use client"

import { Fragment, useEffect } from "react"
import { ArrowUpRight, Plus } from "lucide-react"
import { Reveal, Stagger } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { useLanguage } from "@/contexts/language-context"
import type { TranslationKey } from "@/lib/i18n"
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
      <code key={i} className="inline-code">
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
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-16 sm:py-20 lg:py-32">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-24">
        <div className="min-w-0 space-y-6">
          <SectionHeading
            id="faq-title"
            index="05"
            label={t("nav.faq")}
            jp="よくある質問"
            title={t("faq.title")}
            subtitle={t("faq.subtitle")}
            layout="stack"
          />
          {/* Beside the questions from lg; after them on a phone. */}
          <Reveal as="p" className="hidden text-[15px] text-muted-foreground lg:block">
            {t("faq.more")}{" "}
            <a
              href={links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-brand underline-offset-4 hover:underline"
            >
              {t("faq.more.link")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <div className="min-w-0 space-y-8">
          <Stagger from={{ y: 24 }} className="border-t border-line">
            {QUESTIONS.map(({ id, link }, i) => (
              <details key={id} id={`faq-${id}`} className="faq-item group border-b border-border">
                <summary className="flex list-none items-start gap-4 py-5 sm:items-center sm:gap-5 sm:py-6 [&::-webkit-details-marker]:hidden">
                  <span className="w-9 shrink-0 pt-1 font-mono text-xs tracking-[0.1em] text-brand sm:pt-0">
                    Q.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[17px] font-medium leading-snug text-pretty sm:text-[19px]">
                    {t(`faq.${id}.q`)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-line transition-[rotate,background-color,border-color,color] duration-500 ease-snap group-hover:border-foreground group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <div className="space-y-3 pb-6 text-[15px] leading-relaxed text-muted-foreground sm:pl-14 sm:pr-14 sm:text-base">
                  <p className="max-w-3xl text-pretty">{withCode(t(`faq.${id}.a`))}</p>
                  {link && (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex min-h-11 items-center gap-1 font-medium text-brand"
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
            ))}
          </Stagger>
          <p className="text-[15px] text-muted-foreground lg:hidden">
            {t("faq.more")}{" "}
            <a
              href={links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-medium text-brand"
            >
              {t("faq.more.link")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
