# Landing-GoAnime

The website for [GoAnime](https://github.com/alvarorichard/GoAnime), served at
[goanime.online](https://goanime.online). It is a Next.js app styled with
Tailwind CSS, with two pages: the home page and `/download`, which reads the
latest GitHub release to offer the right file for each system.

## Development

With Node.js 20 or later and pnpm:

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

## Layout

| Path | What it holds |
| --- | --- |
| `app/page.tsx` | Home page |
| `app/download/page.tsx` | Download page |
| `app/opengraph-image.tsx` | Link preview image, rendered at build time |
| `contexts/language-context.tsx` | All text, in Portuguese, English and Spanish |
| `lib/releases.ts` | Picks the right files out of a GoAnime release |
| `components/` | Header, footer, install tabs, code blocks |
| `public/brand/` | The GoAnime mark |
| `public/demo/` | The demo video and its poster |

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
