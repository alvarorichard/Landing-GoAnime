"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Command, Github, Terminal, Download, Play, X, Search } from "lucide-react"

interface CommandItem {
  id: string
  name: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

export function CommandMenu({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commandItems: CommandItem[] = [
    {
      id: "github",
      name: "Ver no GitHub",
      icon: <Github className="h-4 w-4" />,
      shortcut: "G",
      action: () => window.open("https://github.com/alvarorichard/GoAnime", "_blank"),
    },
    {
      id: "features",
      name: "Ver Recursos",
      icon: <Terminal className="h-4 w-4" />,
      shortcut: "F",
      action: () => {
        window.location.href = "#features"
        onClose()
      },
    },
    {
      id: "installation",
      name: "Instalação",
      icon: <Download className="h-4 w-4" />,
      shortcut: "I",
      action: () => {
        window.location.href = "#installation"
        onClose()
      },
    },
    {
      id: "usage",
      name: "Como Usar",
      icon: <Play className="h-4 w-4" />,
      shortcut: "U",
      action: () => {
        window.location.href = "#usage"
        onClose()
      },
    },
  ]

  const filteredItems = commandItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + Math.max(1, filteredItems.length)) % Math.max(1, filteredItems.length))
      } else if (e.key === "Enter" && filteredItems.length > 0) {
        e.preventDefault()
        filteredItems[selectedIndex]?.action()
      } else if (e.key.match(/^[a-z]$/i) && (e.metaKey || e.ctrlKey)) {
        const item = commandItems.find((item) => item.shortcut?.toLowerCase() === e.key.toLowerCase())
        if (item) {
          e.preventDefault()
          item.action()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredItems, selectedIndex, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.1 }}
        className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b border-white/10">
          <Command className="h-5 w-5 text-white/50 mr-2" />
          <input
            type="text"
            placeholder="Digite um comando..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-2 max-h-80 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`px-4 py-2 flex items-center justify-between cursor-pointer ${
                  index === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => item.action()}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-gray-800 flex items-center justify-center mr-3 text-white/70">
                    {item.icon}
                  </div>
                  <span className="text-white">{item.name}</span>
                </div>
                {item.shortcut && (
                  <kbd className="px-2 py-1 text-xs bg-gray-800 rounded text-white/70">⌘ {item.shortcut}</kbd>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-white/50">
              <Search className="h-6 w-6 mx-auto mb-2" />
              <p>Nenhum resultado encontrado</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
