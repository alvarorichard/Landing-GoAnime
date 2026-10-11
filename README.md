# Landing-GoAnime

The website for [GoAnime](https://github.com/alvarorichard/GoAnime), served at
[goanime.online](https://goanime.online). It is a Next.js app styled with
Tailwind CSS, with two pages: the home page and `/download`, which reads the
latest GitHub release to offer the right file for each system.

## Development

With Node.js 22 or later and pnpm:

```bash
pnpm install
pnpm dev
```

Or with Deno, which reads the same `package.json`:

```bash
deno install
deno run -A npm:next dev
```

The site runs at http://localhost:3000. Before opening a pull request, make
sure the production build passes; it also type-checks the code:

```bash
pnpm build
```

## Live numbers

The star count, downloads, contributors, latest release and Discord members
are fetched on the server (`lib/project.ts`) and cached, GitHub for an hour
and Discord for ten minutes, so the pages are static and regenerate every
ten minutes. Anything that cannot be fetched is left out of the page.

Without a token the GitHub API allows 60 requests an hour per IP, which hosts
that share outgoing IPs can run out of. Set `GITHUB_TOKEN` in the hosting
environment to raise that to 5,000; a fine-grained token with no permissions
is enough, since everything it reads is public.

## Layout

| Path | What it holds |
| --- | --- |
| `app/page.tsx` | Home page |
| `app/download/page.tsx` | Download page |
| `app/opengraph-image.tsx` | Link preview image, rendered at build time |
| `contexts/language-context.tsx` | All text, in Portuguese, English and Spanish |
| `lib/releases.ts` | Picks the right files out of a GoAnime release |
| `lib/project.ts` | Fetches the live numbers shown on the site |
| `components/motion.tsx` | Reveal, stagger, count-up and spotlight animations |
| `components/` | Hero, stats, contributors, header, footer, install tabs, code blocks, OS icons |
| `public/brand/` | The GoAnime mark |
| `public/demo/` | The demo video and its poster |

Animations use framer-motion for anything driven by scroll, pointer or
layout, and CSS (`app/globals.css`) for ambient loops. Both stop for visitors
who ask the system for reduced motion, and none of them re-render React on
pointer movement or scroll.

Text is never written inline: add the key to the Portuguese dictionary in
`contexts/language-context.tsx` first, and TypeScript will then require the
English and Spanish versions.

## Assets

- The dragon mark was designed by a member of the GoAnime community.
- The demo video is recorded from the GoAnime repository with
  [VHS](https://github.com/charmbracelet/vhs), using
  [`docs/demo/demo.tape`](https://github.com/alvarorichard/GoAnime/tree/dev/docs/demo)
  with `Output` lines for `.mp4` and `.webm`. The recording uses only animated
  shorts in the public domain and touches no real source.

## License

[MIT](LICENSE)
