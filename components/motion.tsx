"use client"

import type React from "react"
import { Fragment, createElement, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
  // Phones resize the viewport as the address bar slides in and out;
  // recalculating every trigger then would make scrubbed animations jump.
  ScrollTrigger.config({ ignoreMobileResize: true })
}

export { gsap, ScrollTrigger, useGSAP }

// Every animation checks this first and leaves the page as the server
// rendered it for visitors who ask the system for reduced motion.
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

type Tag = "div" | "p" | "li" | "ul" | "ol" | "span" | "section" | "figcaption" | "header"

// Fades and lifts its content in the first time it scrolls into view. Only
// opacity is animated, never visibility, so links inside stay reachable with
// the keyboard before they have been revealed.
export function Reveal({
  as = "div",
  delay = 0,
  y = 28,
  className,
  children,
  ...rest
}: {
  as?: Tag
  delay?: number
  y?: number
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 1,
        delay,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
      })
    },
    { scope: ref },
  )

  return createElement(as, { ref, className, ...rest }, children)
}

// Reveals its children one after another as they scroll into view, in
// batches, so a long list arrives row by row.
export function Stagger({
  as = "div",
  from = { y: 32 },
  stagger = 0.08,
  ease = "power3.out",
  className,
  children,
  ...rest
}: {
  as?: Tag
  from?: gsap.TweenVars
  stagger?: number
  ease?: string
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      const items = Array.from(ref.current.children)
      if (items.length === 0) return
      gsap.set(items, { opacity: 0, ...from })
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease,
            stagger,
            clearProps: "transform,opacity",
          }),
      })
    },
    { scope: ref },
  )

  return createElement(as, { ref, className, ...rest }, children)
}

// A headline whose words rise out of their own masks. "scroll" plays when it
// scrolls into view; "load" plays at once (for a page's h1, hidden before
// the first paint like the hero); "parent" leaves it to an enclosing
// timeline, which finds the words by [data-word]. Trailing punctuation is
// set in crimson, and `after` goes inside the last word, so it rises with it.
export function MaskedWords({
  as = "h2",
  text,
  play = "scroll",
  after,
  id,
  className,
}: {
  as?: "h1" | "h2" | "h3"
  text: string
  play?: "scroll" | "load" | "parent"
  after?: React.ReactNode
  id?: string
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const words = text.split(" ")
  const last = words.length - 1

  useGSAP(
    () => {
      if (play === "parent" || !ref.current || prefersReducedMotion()) return
      const targets = ref.current.querySelectorAll("[data-word]")
      gsap.from(targets, {
        yPercent: 120,
        ...(play === "load" ? { autoAlpha: 0 } : { opacity: 0 }),
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.07,
        delay: play === "load" ? 0.1 : 0,
        clearProps: "transform,opacity",
        ...(play === "scroll" && { scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } }),
      })
    },
    { scope: ref, dependencies: [text] },
  )

  return createElement(
    as,
    { ref, id, className },
    words.map((word, i) => {
      const [, body, punctuation] = i === last ? (word.match(/^(.*?)([.!?]*)$/) ?? ["", word, ""]) : ["", word, ""]
      return (
        <Fragment key={`${i}-${word}`}>
          {/* The mask: padding keeps accents and descenders inside it. */}
          <span className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top">
            <span data-word="" data-intro={play === "scroll" ? undefined : ""} className="inline-block">
              {body}
              {punctuation && <span className="text-brand">{punctuation}</span>}
              {i === last && after}
            </span>
          </span>
          {i < last && " "}
        </Fragment>
      )
    }),
  )
}

// Counts up to value the first time it is seen. The server HTML carries the
// real number; the count rewrites the same text node React rendered, so the
// page never re-renders while it runs, and puts the number back if the
// animation is torn down early.
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const node = ref.current?.firstChild
      if (!ref.current || !node || prefersReducedMotion()) return
      const counter = { n: 0 }
      node.nodeValue = format(0)
      gsap.to(counter, {
        n: value,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
        onUpdate: () => {
          node.nodeValue = format(Math.round(counter.n))
        },
      })
      return () => {
        node.nodeValue = format(value)
      }
    },
    { scope: ref, dependencies: [value] },
  )

  return <span ref={ref}>{format(value)}</span>
}
