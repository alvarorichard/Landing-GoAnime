"use client"

import { InstallTabs } from "@/components/install-tabs"
import { Reveal } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { useLanguage } from "@/contexts/language-context"

export function Install() {
  const { t } = useLanguage()

  return (
    <section id="install" aria-labelledby="install-title" className="border-t border-border bg-panel py-16 sm:py-20 lg:py-32">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
        <div className="min-w-0 space-y-6">
          <SectionHeading
            id="install-title"
            index="03"
            label={t("nav.install")}
            jp="インストール"
            title={t("install.title")}
            subtitle={t("install.subtitle")}
            layout="stack"
          />
          <Reveal as="p" className="text-[15px] leading-relaxed text-muted-foreground">
            {t("install.after")} <code className="inline-code">goanime</code>. {t("install.update")}{" "}
            <code className="inline-code">goanime --update</code>.
          </Reveal>
        </div>
        <Reveal className="min-w-0 pr-1.5 sm:pr-2.5">
          <InstallTabs />
        </Reveal>
      </div>
    </section>
  )
}
