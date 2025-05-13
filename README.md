# Landing-GoAnime



The GoAnime web front‑end is a lightweight, static site that showcases the **GoAnime** CLI and its features.  
To work locally you only need a current  version of **Node.js ≥ 18.12** (20 LTS recommended) and **pnpm**.  
Clone, `pnpm install`, and `pnpm dev`—that’s it.  
The project welcomes PRs; we use Conventional Commits and automated checks to keep the main branch green.


## Table of contents
1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Getting started](#getting-started)  
4. [Contribution guide](#contribution-guide)  


## Features
- **Blazing‑fast dev loop** thanks to pnpm’s hard‑link‑store architecture  
- Fully static output; can be deployed to any CDN or object‑storage.  
- Zero‑JS above‑the‑fold and responsive design, mirroring the CLI’s minimalism.

## Prerequisites
| Tool | Minimum | Recommended | Notes |
|------|---------|-------------|-------|
| Node.js | 18.12 LTS | 20 LTS / 22 Current | Node 18 reaches EOL on 30 Apr 2025 |
| pnpm | 8 | latest | See official install script |

> **Install pnpm**  
> ```bash
> curl -fsSL https://get.pnpm.io/install.sh | sh -
> # or: npm install -g pnpm
> ```  

Confirm both tools:

```bash
node -v   # v20.x.x
pnpm -v   # 8.x.x or newer
```

## Getting started

1. **Clone the repository**  
```bash
git clone https://github.com/alvarorichard/Landing-GoAnime
cd Landing-GoAnime
```
2. **Install dependencies**
```bash
pnpm i # or pnpm install
```
3. **Start the development server**
```bash
pnpm run dev
 ```

## Contribution guide

Fork the repository and create a branch:
```bash
git checkout -b feat/amazing‑idea.
```

If you’re unsure, open a draft PR or start a discussion—we’d love to help.



