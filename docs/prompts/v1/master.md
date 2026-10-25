# Master Prompt — OprekDeck v1

Rujuk file ini di awal setiap sesi, bersama prompt task aktif di folder yang sama.

## Konteks

OprekDeck adalah web pengatur Android via ADB (WebUSB): profil perangkat, debloat yang bisa dipulihkan, tweak, dan rekomendasi optimasi. Tampilan full motion. Seluruh logika ADB berjalan di browser pengguna; server hanya menyajikan aset statis dan data JSON berversi.

## Stack

Next.js App Router dengan static export, TypeScript strict, Tailwind CSS, Motion, GSAP, React Three Fiber (lazy), Zustand, Zod, Dexie, xterm.js, TanStack Virtual. Library ADB: `@yume-chan/adb`, `@yume-chan/adb-daemon-webusb`, `@yume-chan/adb-credential-web` (hanya di `lib/adb`).

Dependensi ditambahkan saat task membutuhkannya. Jangan menambah dependensi baru tanpa izin eksplisit.

## Sumber kebenaran

`docs/PRD-OprekDeck-v1.md`. Bagian 4, 8, 9, dan 13 wajib dipatuhi. Jika berubah, ubah PRD dulu baru kodenya.

## Aturan

- Kerjakan HANYA task yang diminta. Jangan ubah file di luar scope task.
- Dilarang stub, placeholder, TODO kosong, atau data palsu di kode final (kecuali fixture dan mock yang memang diminta).
- Dilarang mengarang command ADB, nama paket, atau API library. Command hanya dari `data/*.json` atau yang disebut eksplisit di task. Baca dokumentasi versi terpasang sebelum memakai API.
- Semua command ke perangkat WAJIB lewat `shell.run()`. Jangan memanggil library ADB dari UI.
- Jangan menambah atau mengubah entri tweak dan debloat.
- Animasikan hanya transform dan opacity; hormati tier kualitas dan `prefers-reduced-motion`.
- Jalankan lint, typecheck, dan test sebelum menyatakan selesai.
- Akhiri dengan daftar file yang dibuat/diubah dan cara verifikasi. Jika ada yang ambigu, tanya dulu.

## Alur sesi

1. Baca master ini, PRD, dan prompt task aktif (`T-XXX.md`).
2. Kerjakan satu task saja; jangan lanjut ke task berikutnya di sesi yang sama.
3. Verifikasi Definition of Done di PRD bagian 16.
4. Satu task = satu sesi = satu commit.
5. Jika ada keputusan baru, catat di prompt task atau PRD sebelum mengubah kode.

## Definition of Done

- Build, lint, typecheck, dan test lulus.
- Perilaku sesuai kriteria "Selesai jika" pada task.
- Tidak ada file di luar scope yang berubah.
- Tidak ada stub atau TODO tersisa.
