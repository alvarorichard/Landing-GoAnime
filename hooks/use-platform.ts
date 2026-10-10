"use client"

import { useEffect, useState } from "react"
import { detectPlatform, type Platform } from "@/lib/releases"

// The visitor's operating system, or null on phones and unknown systems.
// Null during the first render, so server and client markup match.
export function usePlatform(): Platform | null {
  const [platform, setPlatform] = useState<Platform | null>(null)
  useEffect(() => {
    setPlatform(detectPlatform(navigator.userAgent))
  }, [])
  return platform
}
