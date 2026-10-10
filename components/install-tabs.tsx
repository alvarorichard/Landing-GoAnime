"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"
import { useLanguage } from "@/contexts/language-context"
import { usePlatform } from "@/hooks/use-platform"
import { LATEST_RELEASE_URL } from "@/lib/releases"
import { cn } from "@/lib/utils"

type TabId = "windows" | "macos" | "linux" | "arch" | "go"

const TABS: { id: TabId; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "arch", label: "Arch Linux" },
  { id: "go", label: "Go" },
]

const COMMANDS = {
  macos: `brew install mpv
curl -Lo goanime ${LATEST_RELEASE_URL}/download/goanime-darwin-universal
chmod +x goanime
sudo mv goanime /usr/local/bin/
sudo xattr -d com.apple.quarantine /usr/local/bin/goanime`,
  linux: `curl -LO ${LATEST_RELEASE_URL}/download/goanime-linux-amd64.tar.gz
tar -xzf goanime-linux-amd64.tar.gz
sudo install goanime-linux-amd64 /usr/local/bin/goanime`,
  go: "go install github.com/alvarorichard/Goanime/cmd/goanime@latest",
}

export function InstallTabs() {
  const { t } = useLanguage()
  const platform = usePlatform()
  const [picked, setPicked] = useState<TabId | null>(null)
  const active: TabId = picked ?? platform ?? "windows"
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    windows: null,
    macos: null,
    linux: null,
    arch: null,
    go: null,
  })

  // Arrow keys move between tabs, as the WAI-ARIA tabs pattern expects.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((tab) => tab.id === active)
    let next = -1
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length
    if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length
    if (e.key === "Home") next = 0
    if (e.key === "End") next = TABS.length - 1
    if (next < 0) return
    e.preventDefault()
    setPicked(TABS[next].id)
    tabRefs.current[TABS[next].id]?.focus()
  }

  return (
    <div className="min-w-0 space-y-6">
      <div
        role="tablist"
        aria-label={t("install.tabs")}
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card/60 p-1"
      >
        {TABS.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el
              }}
              type="button"
              role="tab"
              id={`install-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`install-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setPicked(tab.id)}
              className={cn(
                "shrink-0 rounded-md px-3.5 py-2 text-sm transition-colors",
                selected ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`install-panel-${active}`}
        aria-labelledby={`install-tab-${active}`}
        tabIndex={0}
        className="space-y-4 rounded-md"
      >
        {active === "windows" && (
          <>
            <p className="text-muted-foreground">{t("install.windows.body")}</p>
            <Button asChild size="lg">
              <Link href="/download">
                <Download aria-hidden="true" />
                {t("install.windows.button")}
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">{t("install.windows.note")}</p>
          </>
        )}
        {active === "macos" && (
          <>
            <p className="text-muted-foreground">{t("install.macos.body")}</p>
            <CodeBlock code={COMMANDS.macos} />
          </>
        )}
        {active === "linux" && (
          <>
            <p className="text-muted-foreground">{t("install.linux.body")}</p>
            <CodeBlock code={COMMANDS.linux} />
            <p className="text-sm text-muted-foreground">{t("install.linux.note")}</p>
          </>
        )}
        {active === "arch" && (
          <>
            <p className="text-muted-foreground">{t("install.arch.body")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <CodeBlock code="yay -S goanime" />
              <CodeBlock code="paru -S goanime" />
            </div>
          </>
        )}
        {active === "go" && (
          <>
            <p className="text-muted-foreground">{t("install.go.body")}</p>
            <CodeBlock code={COMMANDS.go} />
            <p className="text-sm text-muted-foreground">{t("install.go.note")}</p>
          </>
        )}
      </div>
    </div>
  )
}
