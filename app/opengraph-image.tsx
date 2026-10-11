import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

// The preview shown when a link to the site is shared (Discord, X, WhatsApp).
// Rendered once at build time.
export const alt = "GoAnime: anime no terminal"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage() {
  const mark = await readFile(join(process.cwd(), "public/brand/goanime-mark.png"))
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 96px",
          background: "radial-gradient(60% 80% at 82% 50%, rgba(200,16,46,0.28), #0a0a0c 70%)",
          color: "#ededef",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 24 }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -3 }}>GoAnime</div>
          <div style={{ fontSize: 40, color: "#a1a1aa", lineHeight: 1.3 }}>
            Anime no terminal, em português e inglês.
          </div>
          <div style={{ fontSize: 28, color: "#ff5c6c" }}>Linux · macOS · Windows · código aberto</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={400} height={400} alt="" />
      </div>
    ),
    size,
  )
}
