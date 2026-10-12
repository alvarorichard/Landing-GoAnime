import { MaskedWords, Reveal } from "@/components/motion"
import { cn } from "@/lib/utils"

const SIZES = {
  md: "text-[clamp(2.25rem,9vw,3.25rem)] lg:text-[clamp(3rem,4.6vw,4.25rem)]",
  lg: "text-[clamp(2.5rem,11vw,4rem)] lg:text-[clamp(3.5rem,6vw,5.75rem)]",
}

// A section's heading: a numbered label with its Japanese gloss, the title
// rising word by word, and the subtitle, beside the title from lg
// ("split") or under it ("stack").
export function SectionHeading({
  id,
  index,
  label,
  jp,
  title,
  subtitle,
  layout = "split",
  size = "md",
  tone = "ink",
}: {
  id: string
  index: string
  label: string
  jp?: string
  title: string
  subtitle?: string
  layout?: "split" | "stack"
  size?: keyof typeof SIZES
  tone?: "ink" | "paper"
}) {
  const paper = tone === "paper"

  return (
    <div className={cn("flex flex-col gap-5", layout === "split" && "lg:flex-row lg:items-end lg:justify-between lg:gap-12")}>
      <div className="min-w-0 space-y-4 lg:flex-1">
        {/* The label repeats the title, so it is only for the eyes. */}
        <Reveal
          as="p"
          aria-hidden="true"
          className={cn(
            "flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-xs uppercase tracking-[0.16em]",
            paper ? "text-primary" : "text-brand",
          )}
        >
          <span>
            {index} / {label}
          </span>
          {jp && (
            <span lang="ja" className={cn("tracking-[0.24em]", paper ? "text-ink-soft" : "text-subtle")}>
              {jp}
            </span>
          )}
        </Reveal>
        <MaskedWords
          id={id}
          text={title}
          // leading comes after the size: tailwind-merge drops a leading-* that a
          // text-* size follows, since Tailwind 4 sizes set line-height too.
          className={cn("font-display tracking-[-0.01em] text-balance", SIZES[size], "leading-[1.05]")}
        />
      </div>
      {subtitle && (
        <Reveal
          as="p"
          className={cn(
            "text-pretty text-base leading-relaxed sm:text-lg",
            paper ? "text-ink-soft" : "text-muted-foreground",
            layout === "split" && "lg:max-w-[28rem]",
          )}
        >
          {subtitle}
        </Reveal>
      )}
    </div>
  )
}
