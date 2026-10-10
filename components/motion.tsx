"use client"

import type React from "react"
import { useEffect, useRef, type PointerEvent } from "react"
import { animate, motion, useInView, useMotionValue, useTransform, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

// The site's one easing curve: a long, soft ease-out (easeOutQuint).
export const EASE = [0.22, 1, 0.36, 1] as const

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
}

// Fades and lifts its content in the first time it scrolls into view.
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "div" | "section" | "li" | "header"
}) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}

export const staggerVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

// Reveals its StaggerItem children one after another.
export function Stagger({
  children,
  className,
  as = "div",
  gap = 0.08,
}: {
  children: React.ReactNode
  className?: string
  as?: "div" | "ul"
  gap?: number
}) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Component>
  )
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  as?: "div" | "li" | "article" | "section"
}) {
  const Component = motion[as]
  return (
    <Component className={className} variants={revealVariants}>
      {children}
    </Component>
  )
}

// Counts up to value the first time it is seen.
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const text = useTransform(count, (n) => format(Math.round(n)))

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, { duration: 1.4, ease: EASE })
    return () => controls.stop()
  }, [inView, value, count])

  return <motion.span ref={ref}>{text}</motion.span>
}

// A card whose background lights up under the pointer. The position goes
// through CSS variables, so moving the pointer never re-renders React.
export function Spotlight({
  children,
  className,
  as: Component = "div",
}: {
  children: React.ReactNode
  className?: string
  as?: "div" | "li" | "article" | "section"
}) {
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`)
  }
  return (
    <Component onPointerMove={onPointerMove} className={cn("spotlight", className)}>
      {children}
    </Component>
  )
}
