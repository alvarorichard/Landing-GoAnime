"use client"

import { useId, useRef } from "react"
import { DRAGON_PATHS } from "@/components/dragon-paths"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion"

const PALE = "#E6EDF3"
const CRIMSON = "#A0001C"
// Where the eye sits, as a fraction of the mark's width and height.
const EYE = { x: 218 / 1024, y: 399 / 1024 }

// The hero's dragon, alive. Once the hero has drawn it in, it opens its eye
// with a flash; then it breathes, its wing band rises with each breath, its
// crest flickers like a flame, it blinks now and then, and its eye glows
// faintly and follows the pointer. Pointing at it, or tapping it on a touch
// screen, makes it bristle. For visitors who ask for reduced motion it is the
// mark, still, eye open.
export function Dragon({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const id = useId().replace(/[^a-zA-Z0-9]/g, "")

  useGSAP(
    () => {
      const svg = ref.current
      if (!svg || prefersReducedMotion()) return
      const part = (name: string) => svg.querySelector<SVGGElement>(`[data-part="${name}"]`)!
      const [whole, wing, crest, mane, look, eye, glow, flare] = [
        "whole",
        "wing",
        "crest",
        "mane",
        "look",
        "eye",
        "glow",
        "flare",
      ].map(part)

      gsap.set(eye, { transformOrigin: "50% 50%", scaleY: 0.08 })
      gsap.set([crest, mane], { transformOrigin: "15% 100%" })
      gsap.set(wing, { transformOrigin: "73% 100%" })

      // Waking up, as the hero's wipe finishes: the eye snaps open with a
      // flash and the crest flares and settles.
      const wake = gsap.timeline({ delay: 1.05 })
      wake
        .to(eye, { scaleY: 1, duration: 0.35, ease: "back.out(3)" })
        .fromTo(flare, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" }, "<")
        .to(flare, { opacity: 0, duration: 1.4, ease: "power2.inOut" })
        .fromTo(crest, { rotation: -10 }, { rotation: 0, duration: 1.4, ease: "elastic.out(1, 0.35)" }, "<-1.2")

      // Breathing: the body swells a little and settles, the wing band rising
      // with it.
      const breath = { duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 }
      gsap.to(whole, { scale: 1.012, transformOrigin: "50% 85%", ...breath })
      gsap.to(wing, { rotation: 1.3, ...breath })
      gsap.fromTo(glow, { opacity: 0.2 }, { opacity: 0.5, ...breath, delay: 1.6 })

      // The crest never quite rests: a new small sway every moment.
      gsap.to(mane, {
        rotation: "random(-3.5, 2)",
        skewX: "random(-3, 3)",
        duration: 0.8,
        ease: "sine.inOut",
        repeat: -1,
        repeatRefresh: true,
      })

      // Blinks at uneven intervals, one of them double, on an eleven-second
      // loop that reads as random.
      const close = { scaleY: 0.08, duration: 0.07, ease: "power2.in" }
      const open = { scaleY: 1, duration: 0.14, ease: "power2.out" }
      gsap
        .timeline({ delay: 4, repeat: -1 })
        .to(eye, close)
        .to(eye, open)
        .to(eye, close, "+=5.1")
        .to(eye, open)
        .to(eye, close, "+=2.6")
        .to(eye, open)
        .to(eye, close, "+=0.08")
        .to(eye, open)
        .to({}, { duration: 3.2 })

      const cleanups: (() => void)[] = []
      const listen = <K extends keyof WindowEventMap>(
        target: Window | SVGSVGElement,
        type: K,
        handler: (e: WindowEventMap[K]) => void,
      ) => {
        target.addEventListener(type, handler as EventListener)
        cleanups.push(() => target.removeEventListener(type, handler as EventListener))
      }

      // Bristling: the crest rises and the eye flares.
      const bristle = gsap
        .timeline({ paused: true })
        .to(crest, { rotation: -7, duration: 0.35, ease: "back.out(2)" }, 0)
        .to(flare, { opacity: 0.7, duration: 0.3, ease: "power2.out" }, 0)

      // A tap bristles it for a moment.
      listen(svg, "pointerdown", (e) => {
        if (e.pointerType === "mouse") return
        bristle.play().then(() => gsap.delayedCall(0.5, () => bristle.reverse()))
      })

      // With a mouse, the eye follows the pointer, and pointing at the dragon
      // keeps it bristling.
      if (window.matchMedia("(pointer: fine)").matches) {
        const lookX = gsap.quickTo(look, "x", { duration: 0.6, ease: "power3.out" })
        const lookY = gsap.quickTo(look, "y", { duration: 0.6, ease: "power3.out" })
        const onMove = (e: PointerEvent) => {
          const rect = svg.getBoundingClientRect()
          const dx = (e.clientX - (rect.left + rect.width * EYE.x)) / rect.width
          const dy = (e.clientY - (rect.top + rect.height * EYE.y)) / rect.height
          lookX(gsap.utils.clamp(-7, 7, dx * 20))
          lookY(gsap.utils.clamp(-4, 4, dy * 12))
        }
        listen(window, "pointermove", onMove)
        listen(svg, "pointerenter", () => bristle.play())
        listen(svg, "pointerleave", () => bristle.reverse())
      }

      return () => cleanups.forEach((cleanup) => cleanup())
    },
    { scope: ref },
  )

  return (
    <svg ref={ref} viewBox="0 0 1024 1024" aria-hidden="true" className={className}>
      <defs>
        <filter id={`${id}-glow`} x="-150%" y="-300%" width="400%" height="700%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`${id}-flare`} x="-300%" y="-600%" width="700%" height="1300%">
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </defs>
      <g data-part="whole">
        <path fill={PALE} fillRule="evenodd" d={DRAGON_PATHS.body} />
        <g data-part="wing">
          <path fill={CRIMSON} fillRule="evenodd" d={DRAGON_PATHS.wing} />
        </g>
        <g data-part="crest">
          <g data-part="mane">
            <path fill={CRIMSON} fillRule="evenodd" d={DRAGON_PATHS.mane} />
          </g>
        </g>
        <path fill={CRIMSON} fillRule="evenodd" d={DRAGON_PATHS.jaw} />
        <g data-part="look">
          <g data-part="eye">
            <g data-part="flare" opacity="0">
              <path fill="#FF2D4A" d={DRAGON_PATHS.eye} filter={`url(#${id}-flare)`} />
            </g>
            <g data-part="glow" opacity="0">
              <path fill="#FF2D4A" d={DRAGON_PATHS.eye} filter={`url(#${id}-glow)`} />
            </g>
            <path fill={CRIMSON} fillRule="evenodd" d={DRAGON_PATHS.eye} />
          </g>
        </g>
      </g>
    </svg>
  )
}
