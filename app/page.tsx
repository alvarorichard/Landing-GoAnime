"use client"

import Link from "next/link"
import {
  Download,
  History,
  Languages,
  Layers,
  MessageCircle,
  Smartphone,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { DemoVideo } from "@/components/demo-video"
import { GitHubIcon } from "@/components/icons"
import { InstallTabs } from "@/components/install-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { LANGUAGES, useLanguage, type TranslationKey } from "@/contexts/language-context"
import { formatStars, useGitHubStars } from "@/hooks/use-github-stars"
import { usePlatform } from "@/hooks/use-platform"
import { links } from "@/lib/links"

const FEATURES: { icon: LucideIcon; title: TranslationKey; body: TranslationKey }[] = [
  { icon: Layers, title: "features.sources.title", body: "features.sources.body" },
  { icon: Languages, title: "features.languages.title", body: "features.languages.body" },
  { icon: Download, title: "features.download.title", body: "features.download.body" },
  { icon: History, title: "features.resume.title", body: "features.resume.body" },
  { icon: MessageCircle, title: "features.discord.title", body: "features.discord.body" },
  { icon: Sparkles, title: "features.upscale.title", body: "features.upscale.body" },
]

const USAGE: { label: TranslationKey; command: string }[] = [
  { label: "usage.interactive", command: "goanime" },
  { label: "usage.direct", command: 'goanime "one piece"' },
  { label: "usage.episode", command: 'goanime -d "one piece" 1' },
  { label: "usage.range", command: 'goanime -d -r "naruto" 1-12' },
  { label: "usage.all", command: 'goanime -d -a "one piece"' },
  { label: "usage.quality", command: 'goanime -d --quality 720p "frieren" 1' },
  { label: "usage.source", command: 'goanime --source animefire "jujutsu kaisen"' },
  { label: "usage.movie", command: 'goanime -dm "Interstellar"' },
  { label: "usage.upscale", command: "goanime --upscale --upscale-hq video.mp4" },
  { label: "usage.update", command: "goanime --update" },
]

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <h2 id={id} className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="text-pretty text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export default function Home() {
  const { t, language } = useLanguage()
  const platform = usePlatform()
  const stars = useGitHubStars()
  const locale = LANGUAGES.find((l) => l.code === language)?.htmlLang ?? "pt-BR"
  const downloadLabel = platform ? t(`hero.download.${platform}`) : t("hero.download")

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t("nav.skip")}
      </a>
      <SiteHeader />

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_78%_45%,hsl(var(--primary)/0.22),transparent_70%)]"
          />
          <div className="container relative grid items-center gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:py-24 lg:py-28">
            <div className="space-y-7">
              <p className="font-mono text-[13px] tracking-wide text-muted-foreground">{t("hero.eyebrow")}</p>
              <h1
                id="hero-title"
                className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              >
                {t("hero.title")}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">{t("hero.subtitle")}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-11 px-5">
                  <Link href="/download">
                    <Download aria-hidden="true" />
                    {downloadLabel}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 border-border bg-transparent px-5">
                  <a href={links.github} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                    {t("hero.github")}
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <BrandMark
                size={440}
                alt="GoAnime"
                priority
                className="h-auto w-[min(440px,78vw)] drop-shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </section>

        {/* Demo */}
        <section id="demo" aria-labelledby="demo-title" className="border-t border-border/70 py-20 md:py-28">
          <div className="container space-y-10">
            <SectionHeading id="demo-title" title={t("demo.title")} subtitle={t("demo.subtitle")} />
            <figure className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-black shadow-[0_30px_90px_-45px_hsl(var(--primary)/0.4)]">
                <DemoVideo />
              </div>
              <figcaption className="text-sm text-muted-foreground">{t("demo.caption")}</figcaption>
            </figure>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="features-title" className="border-t border-border/70 py-20 md:py-28">
          <div className="container space-y-12">
            <SectionHeading id="features-title" title={t("features.title")} subtitle={t("features.subtitle")} />
            <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="space-y-3 bg-background p-6 md:p-7">
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="font-medium">{t(title)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t(body)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Installation */}
        <section id="install" aria-labelledby="install-title" className="border-t border-border/70 py-20 md:py-28">
          <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div className="min-w-0 space-y-6">
              <SectionHeading id="install-title" title={t("install.title")} subtitle={t("install.subtitle")} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("install.after")} <code className="font-mono text-foreground">goanime</code>. {t("install.update")}{" "}
                <code className="font-mono text-foreground">goanime --update</code>.
              </p>
            </div>
            <InstallTabs />
          </div>
        </section>

        {/* Usage */}
        <section id="usage" aria-labelledby="usage-title" className="border-t border-border/70 py-20 md:py-28">
          <div className="container space-y-10">
            <SectionHeading id="usage-title" title={t("usage.title")} subtitle={t("usage.subtitle")} />
            {/* A table from md up; on phones each row stacks, so no command is cut off. */}
            <ul className="divide-y divide-border rounded-xl border border-border md:hidden">
              {USAGE.map(({ label, command }) => (
                <li key={command} className="space-y-1.5 px-4 py-3">
                  <p className="text-sm text-muted-foreground">{t(label)}</p>
                  <code className="block overflow-x-auto whitespace-nowrap font-mono text-[13px]">{command}</code>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-hidden rounded-xl border border-border md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-card/60 text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      {t("usage.want")}
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      {t("usage.command")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {USAGE.map(({ label, command }) => (
                    <tr key={command} className="border-t border-border">
                      <td className="px-5 py-3 text-muted-foreground">{t(label)}</td>
                      <td className="px-5 py-3">
                        <code className="whitespace-nowrap font-mono text-[13px] text-foreground">{command}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">{t("usage.help")}</p>
          </div>
        </section>

        {/* Community */}
        <section aria-labelledby="community-title" className="border-t border-border/70 py-20 md:py-28">
          <div className="container space-y-12">
            <SectionHeading id="community-title" title={t("community.title")} subtitle={t("community.subtitle")} />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: <GitHubIcon className="h-5 w-5" />,
                  title: t("community.github.title"),
                  body: t("community.github.body"),
                  cta: t("community.github.cta"),
                  href: links.github,
                },
                {
                  icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />,
                  title: t("community.discord.title"),
                  body: t("community.discord.body"),
                  cta: t("community.discord.cta"),
                  href: links.discord,
                },
                {
                  icon: <Smartphone className="h-5 w-5" aria-hidden="true" />,
                  title: t("community.mobile.title"),
                  body: t("community.mobile.body"),
                  cta: t("community.mobile.cta"),
                  href: links.mobile,
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-6"
                >
                  <span className="text-brand">{card.icon}</span>
                  <h3 className="font-medium">{card.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit rounded-sm text-sm font-medium text-brand underline-offset-4 hover:underline"
                  >
                    {card.cta}
                  </a>
                </article>
              ))}
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-pretty text-muted-foreground">{t("community.star")}</p>
              <Button asChild variant="outline" className="shrink-0 border-border bg-transparent">
                <a href={links.github} target="_blank" rel="noopener noreferrer">
                  <Star aria-hidden="true" />
                  {t("community.star.cta")}
                  {stars !== null && (
                    <span className="border-l border-border pl-2 tabular-nums text-muted-foreground">
                      {formatStars(stars, locale)}
                    </span>
                  )}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
