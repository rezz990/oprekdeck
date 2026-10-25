# OprekDeck

Panel kontrol Android lewat ADB di browser (WebUSB): profil perangkat, debloat yang bisa dipulihkan, tweak, dan rekomendasi optimasi. Semua logika ADB berjalan di browser; tidak ada backend untuk fungsi utama.

Sumber kebenaran produk dan arsitektur ada di [docs/PRD-OprekDeck-v1.md](docs/PRD-OprekDeck-v1.md). Aturan kerja AI per sesi ada di [docs/prompts/v1/master.md](docs/prompts/v1/master.md).

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000 dengan Chrome, Edge, atau Opera desktop.

## Script

| Script | Kegunaan |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build statis ke `out/` (Next.js `output: "export"`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript `--noEmit` |
| `npm test` | Unit test Vitest (saat ini belum ada test) |
| `npm run test:e2e` | Playwright (saat ini belum ada test) |

## Stack

Next.js App Router (static export), TypeScript strict, Tailwind CSS, Vitest, Playwright. Library ADB, motion, dan state ditambahkan pada task berikutnya sesuai PRD bagian 12.
