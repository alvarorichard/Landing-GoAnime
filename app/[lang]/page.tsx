import { Community } from "@/components/community"
import { DemoSection } from "@/components/demo-section"
import { DownloadSection } from "@/components/download-section"
import { Faq } from "@/components/faq"
import { Features } from "@/components/features"
import { Hero } from "@/components/hero"
import { Install } from "@/components/install"
import { Marquee } from "@/components/marquee"
import { ProjectStats } from "@/components/project-stats"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Usage } from "@/components/usage"

// The sections are numbered in their headings (01 Demo to 07 Download), and
// the header's links follow the same numbers.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Marquee />
        <ProjectStats />
        <DemoSection />
        <Features />
        <Install />
        <Usage />
        <Faq />
        <Community />
        <DownloadSection />
      </main>
      <SiteFooter />
    </>
  )
}
