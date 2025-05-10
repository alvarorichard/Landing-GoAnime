"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Check } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: "pt", name: t("language.pt") },
    { code: "en", name: t("language.en") },
    { code: "es", name: t("language.es") },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        className="border-white/20 text-white/70 hover:text-white hover:border-white/50 gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{t("language")}</span>
        <ChevronDown className={`h-3 w-3 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 border border-white/10 text-white z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                  language === lang.code ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => {
                  setLanguage(lang.code as "pt" | "en" | "es")
                  setIsOpen(false)
                }}
              >
                <div className="w-6">{language === lang.code && <Check className="h-4 w-4 text-teal-400" />}</div>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
