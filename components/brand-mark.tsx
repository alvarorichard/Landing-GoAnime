import Image from "next/image"

// The GoAnime dragon mark, in its variant for dark backgrounds. Decorative by
// default (alt=""), since it usually sits next to the name. Copies above the
// fold pass loading="eager"; the hero's, the page's largest image, also
// passes fetchPriority="high".
export function BrandMark({
  size,
  alt = "",
  loading = "lazy",
  fetchPriority,
  className,
}: {
  size: number
  alt?: string
  loading?: "eager" | "lazy"
  fetchPriority?: "high" | "low" | "auto"
  className?: string
}) {
  return (
    <Image
      src="/brand/goanime-mark.png"
      alt={alt}
      width={size}
      height={size}
      loading={loading}
      fetchPriority={fetchPriority}
      className={className}
    />
  )
}
