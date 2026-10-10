"use client"

import { motion } from "framer-motion"
import {
  ArrowUpRight,
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
import { DemoSection } from "@/components/demo-section"
import { Hero } from "@/components/hero"
import { GitHubIcon } from "@/components/icons"
import { InstallTabs } from "@/components/install-tabs"
import { CountUp, Reveal, Spotlight, Stagger, StaggerItem } from "@/components/motion"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { LANGUAGES, useLanguage, type TranslationKey } from "@/contexts/language-context"
import { formatStars, useGitHubStars } from "@/hooks/use-github-stars"
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
    <Reveal className="max-w-2xl space-y-3">
      <h2 id={id} className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="text-pretty text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </Reveal>
  )
}

export default function Home() {
  const { t, language } = useLanguage()
  const stars = useGitHubStars()
  const locale = LANGUAGES.find((l) => l.code === language)?.htmlLang ?? "pt-BR"

  const community = [
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
  ]

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
        <Hero />

        <DemoSection
          heading={<SectionHeading id="demo-title" title={t("demo.title")} subtitle={t("demo.subtitle")} />}
        />

        {/* Features */}
        <section id="features" aria-labelledby="features-title" className="border-t border-border/70 py-16 md:py-28">
          <div className="container space-y-10 md:space-y-12">
            <SectionHeading id="features-title" title={t("features.title")} subtitle={t("features.subtitle")} />
            <Stagger
              as="ul"
              className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
            >
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <StaggerItem key={title} as="li" className="bg-background">
                  <Spotlight className="group h-full space-y-3 p-6 md:p-7">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white/[0.03] text-brand transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-medium">{t(title)}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t(body)}</p>
                  </Spotlight>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Installation */}
        <section id="install" aria-labelledby="install-title" className="border-t border-border/70 py-16 md:py-28">
          <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            <div className="min-w-0 space-y-6">
              <SectionHeading id="install-title" title={t("install.title")} subtitle={t("install.subtitle")} />
              <Reveal delay={0.1}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("install.after")} <code className="font-mono text-foreground">goanime</code>. {t("install.update")}{" "}
                  <code className="font-mono text-foreground">goanime --update</code>.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="min-w-0">
              <InstallTabs />
            </Reveal>
          </div>
        </section>

        {/* Usage */}
        <section id="usage" aria-labelledby="usage-title" className="border-t border-border/70 py-16 md:py-28">
          <div className="container space-y-10">
            <SectionHeading id="usage-title" title={t("usage.title")} subtitle={t("usage.subtitle")} />
            <Reveal delay={0.1}>
              {/* A list on phones, so no command is cut off; a table from md up. */}
              <ul className="divide-y divide-border rounded-xl border border-border md:hidden">
                {USAGE.map(({ label, command }) => (
                  <li key={command} className="space-y-1.5 px-4 py-3.5">
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
                      <tr key={command} className="border-t border-border transition-colors hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-muted-foreground">{t(label)}</td>
                        <td className="px-5 py-3">
                          <code className="whitespace-nowrap font-mono text-[13px] text-foreground">{command}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
            <p className="text-sm text-muted-foreground">{t("usage.help")}</p>
          </div>
        </section>

        {/* Community */}
        <section aria-labelledby="community-title" className="border-t border-border/70 py-16 md:py-28">
          <div className="container space-y-10 md:space-y-12">
            <SectionHeading id="community-title" title={t("community.title")} subtitle={t("community.subtitle")} />
            <Stagger className="grid gap-4 md:grid-cols-3">
              {community.map((card) => (
                <StaggerItem key={card.title} as="article">
                  <motion.a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-foreground/20"
                  >
                    <span className="text-brand">{card.icon}</span>
                    <h3 className="font-medium">{card.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                      {card.cta}
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </motion.a>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal>
              <div className="flex flex-col gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-pretty text-muted-foreground">{t("community.star")}</p>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full shrink-0 border-border bg-transparent sm:w-auto"
                >
                  <a href={links.github} target="_blank" rel="noopener noreferrer">
                    <Star aria-hidden="true" />
                    {t("community.star.cta")}
                    {stars !== null && (
                      <span className="border-l border-border pl-2 tabular-nums text-muted-foreground">
                        <CountUp value={stars} format={(n) => formatStars(n, locale)} />
                      </span>
                    )}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
