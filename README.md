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
| `app/[lang]/page.tsx` | Home page, one copy per language |
| `app/[lang]/download/page.tsx` | Download page |
| `app/[lang]/opengraph-image.tsx` | Link preview image, rendered at build time |
| `app/globals.css` | Colors, fonts, and the buttons, cards and halftones the pages share |
| `lib/i18n.ts` | Languages, their URLs, and all text in Portuguese, English and Spanish |
| `lib/releases.ts` | Picks the right files out of a GoAnime release |
| `lib/project.ts` | Fetches the live numbers shown on the site |
| `components/motion.tsx` | GSAP setup and the shared reveal, stagger, headline and count-up animations |
| `components/` | One file per section of the home page, plus header, footer, download cards, code blocks, icons |
| `public/brand/` | The GoAnime mark |
| `public/demo/` | The demo video and its poster |

The look is a manga panel on a terminal: ink, the mark's pale blue-white and
crimson, square corners and hard offset shadows, Dela Gothic One for headlines
and IBM Plex for the rest. Layouts are written phone first, with `sm`, `md`
and `lg` adding to them.

Animations use [GSAP](https://gsap.com) with ScrollTrigger, through
`@gsap/react`'s `useGSAP`, which cleans them up when a component unmounts.
CSS (`app/globals.css`) handles hover states and the cursor blink. Every
animation checks `prefersReducedMotion()` first and leaves the page as the
server rendered it for visitors who ask the system for reduced motion, and
none of them re-render React on pointer movement or scroll.

Text is never written inline: add the key to the Portuguese dictionary in
`lib/i18n.ts` first, and TypeScript will then require the
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
