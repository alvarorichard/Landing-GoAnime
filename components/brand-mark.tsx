import Image from "next/image"

// The GoAnime dragon mark, in its variant for dark backgrounds. Decorative by
// default (alt=""), since it usually sits next to the name.
export function BrandMark({
  size,
  alt = "",
  priority = false,
  className,
}: {
  size: number
  alt?: string
  priority?: boolean
  className?: string
}) {
  return (
    <Image
      src="/brand/goanime-mark.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  )
}
