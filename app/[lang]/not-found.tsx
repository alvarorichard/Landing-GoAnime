"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useLanguage } from "@/contexts/language-context"

export default function NotFound() {
  const { t, href } = useLanguage()

  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="container flex min-h-[70dvh] flex-col justify-center gap-10 py-16 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="space-y-6">
          <p aria-hidden="true" className="text-outline font-display text-[clamp(5rem,26vw,10rem)] leading-none">
            404
          </p>
          <h1 className="font-display text-[clamp(2rem,8vw,3.5rem)] leading-[1.05] text-balance">{t("notfound.title")}</h1>
          <p className="max-w-md text-pretty text-lg text-muted-foreground">{t("notfound.body")}</p>
          <Link
            href={href("/")}
            className="btn-crimson inline-flex h-13 w-full items-center justify-center gap-2.5 px-5 font-semibold sm:w-auto"
          >
            <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
            {t("notfound.home")}
          </Link>
        </div>
        <BrandMark size={240} className="hidden h-auto w-60 opacity-20 lg:block" />
      </main>
      <SiteFooter />
    </>
  )
}
