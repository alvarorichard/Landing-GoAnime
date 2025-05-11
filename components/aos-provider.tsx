"use client"

import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

export function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-in-out',
      offset: 50,
      delay: 0,
      anchorPlacement: 'top-bottom',
    })

    window.addEventListener('resize', () => {
      AOS.refresh()
    })

    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh()
      })
    }
  }, [])

  return <>{children}</>
} 