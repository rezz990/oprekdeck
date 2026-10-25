# PRD & Rencana Vibe Coding: OprekDeck (Web Pengatur Android via ADB)

Versi 1.0 · 25 Oktober 2026 · Nama kerja: OprekDeck (belum final) · Disusun sebagai konteks untuk AI coding assistant

## 1. Ringkasan

OprekDeck adalah web app yang mengatur HP Android lewat ADB langsung dari browser (WebUSB). Pengguna mencolok kabel USB, klik hubungkan, lalu bisa membaca profil perangkat, menghapus bloatware (debloat) secara aman dan bisa dibatalkan, menerapkan tweak performa dan baterai, serta mendapat rekomendasi optimasi yang disesuaikan dengan perangkatnya. Tanpa install tool ADB, tanpa root, dan tanpa mengirim data perangkat ke server. Tampilannya full motion ala cockpit/HUD, terasa seperti panel kontrol untuk HP.

Nilai dalam satu kalimat: colok HP, lihat kondisinya, dan beresin dengan aman dalam beberapa klik.

## 2. Tujuan dan Metrik Sukses

Tujuan:

- Menggantikan ritual 'install platform-tools, hafal command, copy-paste dari forum' dengan satu halaman yang aman dan visual.
- Setiap aksi punya penjelasan, tingkat risiko, command yang transparan, dan jalan kembali (undo).
- Rekomendasi yang jujur: hanya klaim dampak yang bisa diukur lewat perbandingan sebelum dan sesudah.
- Pengalaman visual penuh motion yang memukau di desktop.

Metrik 30 hari setelah launch:

- 500+ perangkat terhubung (dihitung dari event anonim opt-in).
- 70% sesi yang berhasil connect menjalankan minimal 1 aksi.
- 90%+ aksi selesai tanpa error.
- 0 laporan HP bootloop akibat aksi dari app; setiap laporan diselidiki.
- Waktu dari buka web sampai perangkat terdeteksi kurang dari 60 detik untuk pengguna yang driver-nya sudah siap.
- 40%+ pengunjung mencoba demo mode.

Bukan tujuan: root, unlock bootloader, flashing ROM, bypass kunci layar atau FRP, mengelola banyak perangkat sekaligus, dukungan iOS.

## 3. Pengguna

- Pengguna HP lama atau entry-level yang ingin HP-nya lebih lancar (primer).
- Enthusiast yang suka ngoprek dan paham dasar ADB (primer).
- Teknisi konter atau servis yang butuh cepat melihat info perangkat dan debloat (sekunder).
- Developer yang butuh terminal, logcat, dan install APK (sekunder, v1.1).

## 4. Prasyarat dan Batasan Teknis (wajib dipahami AI coder)

- WebUSB hanya jalan di Chrome, Edge, atau Opera desktop (Windows, macOS, Linux, ChromeOS) lewat HTTPS atau localhost. Firefox dan Safari tidak mendukung. Deteksi navigator.usb dan tampilkan panduan ramah jika tidak ada.
- Pengguna harus mengaktifkan Opsi Pengembang dan USB debugging, lalu menyetujui dialog sidik jari RSA di HP.
- Windows: perlu driver WinUSB/ADB interface (driver USB produsen, Google USB Driver, atau Zadig sebagai alternatif). Jika proses adb server lokal sedang berjalan, ia menguasai perangkat dan browser gagal membukanya: instruksikan menjalankan adb kill-server. Linux: perlu aturan udev. macOS: umumnya langsung jalan.
- Kunci ADB (key pair RSA) dibuat dan disimpan di browser (IndexedDB), bukan di server.
- Library inti: @yume-chan/adb, @yume-chan/adb-daemon-webusb, dan @yume-chan/adb-credential-web (proyek Tango/ya-webadb). API-nya bisa berubah antar versi, jadi task T-010 wajib membaca dokumentasi versi yang dipasang dan mengunci (pin) versinya sebelum menulis kode. Dilarang mengarang nama API dari ingatan.
- Semua command berjalan dengan hak akses shell, bukan root. Karena itu debloat memakai pm uninstall -k --user 0 (menghapus untuk user 0 saja; aplikasi sistem tetap ada di partisi sistem dan bisa dipulihkan), tidak pernah menyentuh partisi sistem.
- Perilaku command berbeda antar versi Android dan vendor. Setiap tweak wajib punya batas versi (minSdk/maxSdk), perintah baca nilai saat ini, perintah revert, dan penanda verified yang baru boleh true setelah diuji manusia di perangkat nyata.

## 5. Scope

MVP (wajib):

- Koneksi WebUSB dengan alur panduan (driver, USB debugging, otorisasi).
- Profil perangkat dan dashboard live.
- Debloat aman: daftar paket, kategori, rating risiko, deskripsi, cari dan filter, pilih banyak, dry-run, eksekusi, undo, snapshot.
- Katalog tweak (sekitar 12 entri awal) dengan baca nilai saat ini, terapkan, dan revert.
- Rekomendasi optimasi per perangkat, Skor Kesehatan, dan pengukuran sebelum/sesudah.
- Terminal shell dengan peringatan dan konfirmasi untuk command berbahaya.
- Riwayat aksi, ekspor dan impor snapshot (JSON).
- Demo mode dengan perangkat tiruan.
- Tier kualitas motion dan dukungan reduced motion.

v1.1: pemasangan APK, manajer aplikasi (izin, force-stop, clear cache), manajer file (push/pull), logcat viewer, screenshot dan screen record.

v2: database komunitas (kontribusi via GitHub PR), profil per model, kartu hasil sebelum/sesudah untuk dibagikan, dukungan bahasa lain.

Di luar scope: root, flash, bootloader, FRP bypass, ADB nirkabel (pairing butuh TCP yang tidak tersedia di browser), akun pengguna dan backend, command yang merusak data tanpa konfirmasi berlapis.

## 6. Alur Pengguna

1. Landing: hero dengan model HP 3D yang bereaksi ke kursor, tombol 'Colok HP' dan 'Coba demo'.
2. Cek kompatibilitas browser otomatis; jika gagal, tampilkan penjelasan beranimasi.
3. Wizard persiapan tiga langkah (bisa dilewati bila sudah siap): aktifkan USB debugging, colok kabel, siapkan driver sesuai OS yang terdeteksi.
4. Klik 'Hubungkan', pilih perangkat di dialog browser, setujui sidik jari di HP, lalu animasi handshake.
5. Pindai awal (sekitar 5 sampai 10 detik): baca properti, RAM, storage, baterai, dan daftar paket, dengan progres yang nyata.
6. Cockpit: Dashboard menampilkan Skor Kesehatan, rekomendasi teratas, dan gauge live.
7. Pengguna masuk ke modul (Debloat, Tweaks, Optimize, Terminal, Riwayat). Setiap aksi melewati panel konfirmasi: apa yang dilakukan, command yang dijalankan, risiko, dan cara undo.
8. Setelah aksi: ukur ulang, tampilkan kartu sebelum/sesudah, tawarkan reboot jika perlu.
9. Kabel dicabut atau perangkat putus ditangani anggun: UI berubah menjadi 'terputus' dengan opsi sambung ulang, tidak crash.

## 7. Modul dan Kebutuhan Fungsional

7.1 Koneksi

- Deteksi perangkat dan tampilkan model; serial hanya tampil sebagian.
- Tangani: izin ditolak, perangkat unauthorized, kabel dicabut, perangkat tidur, antarmuka diblokir adb server; masing-masing dengan pesan spesifik dan langkah perbaikan.
- Sambung ulang cepat bila perangkat yang sama dicolok lagi.

7.2 Profil perangkat

- Dibaca via getprop, /proc/meminfo, df, dumpsys battery, wm size dan wm density, serta pm list packages.
- Field: merek, model, kodenama, versi Android dan SDK, patch keamanan, RAM total dan tersedia, storage total dan bebas, baterai (level, suhu, status, health), resolusi dan DPI, refresh rate maksimum bila terbaca, jumlah paket (sistem, pihak ketiga, nonaktif), dan skin vendor yang terdeteksi dari properti.

7.3 Dashboard live

- Polling ringan: RAM tiap 3 detik, baterai tiap 10 detik, storage tiap 30 detik. Polling berhenti saat tab tersembunyi atau saat operasi besar berjalan. Gauge beranimasi dengan data nyata.

7.4 Debloat: lihat bagian 9. 7.5 Tweaks: lihat bagian 8. 7.6 Optimize: lihat bagian 10.

7.7 Terminal

- xterm.js dengan shell interaktif, riwayat command, dan salin output.
- Pola berbahaya (rm -rf, dd, format, setprop persist, pm uninstall tanpa --user 0, reboot ke bootloader atau recovery) butuh konfirmasi eksplisit. Banner: 'Command di sini jadi tanggung jawab Anda.'

7.8 Riwayat dan snapshot

- Setiap aksi dicatat (waktu, perangkat, command, hasil, status revert).
- Snapshot daftar paket dan nilai setting diambil sebelum aksi. Ekspor dan impor JSON. Tombol 'Pulihkan semua'.

7.9 Demo mode

- Adapter MockAdb dengan beberapa perangkat fiktif (HP 2 GB RAM Android 10, HP menengah Android 13, flagship Android 15) agar semua fitur bisa dicoba tanpa HP. Wajib, karena juga dipakai untuk pengembangan dan tes otomatis.

7.10 Pengaturan

- Tier motion, tampilkan command mentah, telemetri anonim opt-in, dan 'hapus semua data lokal' (kunci ADB, riwayat, snapshot).

## 8. Katalog Tweak (seed v1)

Aturan keras: data tweak ditulis manusia di file JSON dan divalidasi skema (Zod). AI coder TIDAK boleh menambah atau mengubah command tweak sendiri. Semua entri berstatus verified: false sampai diuji di perangkat nyata, termasuk revert-nya. Sebelum apply, nilai asli dibaca dan disimpan ke snapshot; revert memakai nilai asli, bukan nilai default tebakan.

Bentuk data:

```ts
type TweakDef = {
  id: string;
  title: string;
  description: string;
  category: 'animasi' | 'baterai' | 'jaringan' | 'tampilan' | 'sistem';
  risk: 'aman' | 'sedang' | 'lanjutan';
  minSdk: number;
  maxSdk?: number;
  read: { command: string; parse: 'string' | 'number' | 'bool' };
  apply: string[];
  revert: string[];
  impact: { performa?: 1 | 2 | 3; baterai?: 1 | 2 | 3; ram?: 1 | 2 | 3 };
  needsReboot: boolean;
  verified: boolean;
};
```

Daftar seed (command dari penulis, harus diuji sebelum verified):

1. Animasi 0.5x (aman): settings put global window\_animation\_scale 0.5, transition\_animation\_scale 0.5, animator\_duration\_scale 0.5. Baca: settings get global window\_animation\_scale.
2. Animasi dimatikan (aman): nilai ketiganya 0.
3. Hentikan scan Wi-Fi dan Bluetooth saat radio mati (aman): settings put global wifi\_scan\_always\_enabled 0 dan ble\_scan\_always\_enabled 0.
4. Penghemat baterai (aman): settings put global low\_power 1. Perilaku berbeda per vendor.
5. Kompilasi ulang aplikasi (aman, lama): cmd package compile -m speed-profile -a. Revert: cmd package compile --reset -a. SDK 24 ke atas.
6. Bersihkan cache semua aplikasi (aman): pm trim-caches dengan nilai byte besar. Data aplikasi tidak terhapus.
7. Private DNS (sedang): settings put global private\_dns\_mode hostname dan private\_dns\_specifier dengan hostname pilihan dari daftar preset. Revert ke mode asli. SDK 28 ke atas. Jika hostname salah, internet mati, jadi revert cepat harus mudah dijangkau.
8. Refresh rate minimum tinggi (sedang): settings put system min\_refresh\_rate dengan nilai yang didukung layar. Hanya tampil bila layar lebih dari 60 Hz; boros baterai; perilaku bergantung vendor.
9. Ubah DPI (sedang): wm density dengan batas aman sekitar 20% dari bawaan. Revert: wm density reset. Wajib timer auto-revert 15 detik jika tidak dikonfirmasi.
10. Ubah resolusi (lanjutan): wm size WxH. Revert: wm size reset. Wajib auto-revert seperti DPI.
11. Layar tetap menyala saat mengisi daya (aman): settings put global stay\_on\_while\_plugged\_in 3. Revert ke nilai asli.
12. Batasi aplikasi di latar belakang per aplikasi (sedang): cmd appops set nama.paket RUN\_IN\_BACKGROUND ignore. Revert: allow. Dipilih dari daftar aplikasi pihak ketiga.

## 9. Debloat

Sumber data: database paket kurasi (JSON) per vendor dan versi Android. Opsi: tulis sendiri, atau memakai daftar komunitas seperti Universal Android Debloater Next Generation. Periksa dulu lisensinya (GPL-3.0) dan kompatibilitasnya dengan lisensi proyek ini sebelum menyalin, serta beri atribusi. Ini keputusan terbuka (bagian 17).

Bentuk data:

```ts
type DebloatEntry = {
  pkg: string;
  label: string;
  description: string;
  vendors: string[];
  risk: 'aman' | 'disarankan' | 'lanjutan' | 'ahli' | 'jangan';
  category: 'iklan' | 'telemetri' | 'duplikat' | 'media' | 'game' | 'sosial' | 'sistem';
  minSdk?: number;
  maxSdk?: number;
  note?: string;
};
```

Isi database tidak boleh dikarang oleh AI. Contoh bentuk saja (verifikasi sebelum dipakai): com.facebook.appmanager, label Facebook App Manager, kategori sosial, risiko aman.

Perintah:

- Hapus untuk user 0: pm uninstall -k --user 0 nama.paket.
- Pulihkan: cmd package install-existing nama.paket.
- Nonaktifkan: pm disable-user --user 0 nama.paket. Aktifkan lagi: pm enable nama.paket.

Aturan keselamatan:

- Default hanya menampilkan risiko aman dan disarankan. Lanjutan dan ahli tersembunyi di balik toggle dengan peringatan. Risiko jangan tidak bisa dipilih.
- Paket yang tidak ada di database tampil sebagai 'tidak dikenal' dan hanya boleh dinonaktifkan, bukan dihapus, dengan peringatan.
- Daftar blokir keras di kode (tidak bisa dilewati lewat UI): systemui, phone, settings, providers inti, Google Play Services, serta paket yang sedang aktif sebagai launcher, keyboard, dialer, dan SMS (dideteksi dinamis dari perangkat).
- Alur: pilih, dry-run (tampilkan daftar dan command), konfirmasi (ketik jumlah paket bila lebih dari 5), eksekusi berurutan dengan animasi per paket sesuai hasil nyata, simpan snapshot, tombol Pulihkan.
- Batas 20 paket per batch. Sarankan reboot dan cek perangkat sebelum batch berikutnya.
- Halaman bantuan menjelaskan langkah jika perangkat bermasalah (recovery, factory reset sebagai pilihan terakhir dengan peringatan kehilangan data).

## 10. Rekomendasi Optimasi dan Skor

Skor Kesehatan Perangkat (0 sampai 100) memakai rumus transparan yang ditampilkan ke pengguna lewat tombol 'cara menghitung':

- Memori, 25 poin: dari rasio MemAvailable terhadap MemTotal saat idle (penuh bila 45% atau lebih, turun linier ke nol).
- Penyimpanan, 25 poin: dari rasio ruang bebas (penuh bila 30% atau lebih, nol bila di bawah 10%).
- Bloat, 20 poin: dari jumlah paket berisiko aman atau disarankan yang masih terpasang (penuh bila 0, nol bila 25 atau lebih).
- Animasi dan tweak dasar, 15 poin: animasi 0.5x atau lebih cepat, scan radio dimatikan, dan sejenisnya.
- Baterai, 15 poin: dari health dan suhu bila tersedia. Jika tidak terbaca, bobotnya dibagi ke komponen lain.

Semua ambang disimpan di file konfigurasi, bukan di dalam kode UI.

Mesin rekomendasi (fungsi murni, rule-based):

- Input: DeviceProfile dan hasil pemindaian. Output: daftar Recommendation berisi id, judul, alasan, id tweak atau debloat terkait, prioritas, risiko, estimasi dampak (kecil, sedang, besar), dan apakah dampaknya bisa diukur.
- RAM total 3 GB atau kurang dan animasi masih 1.0x: sarankan percepat animasi (prioritas tinggi).
- Ruang bebas di bawah 15%: sarankan bersihkan cache dan tinjau aplikasi terbesar (dari dumpsys diskstats).
- Paket bloat aman 10 atau lebih: sarankan debloat, dikelompokkan per kategori.
- Layar lebih dari 60 Hz terdeteksi: tampilkan info refresh rate tanpa dorongan agresif karena boros baterai.
- Hanya tampilkan paket dan tweak yang sesuai merek dan versi Android perangkat.
- Prinsip jujur: tidak ada klaim angka seperti 'jadi 40% lebih cepat'. Dampak ditulis kualitatif dan dibuktikan lewat pengukuran.

Pengukuran sebelum dan sesudah:

- MemAvailable dari /proc/meminfo setelah 10 detik idle, rata-rata 3 sampel.
- Ruang bebas dari df pada /data.
- Waktu cold start satu aplikasi pilihan pengguna: am force-stop lalu am start -W, ambil TotalTime, rata-rata 3 kali.
- Jumlah paket aktif.
- Hasil ditampilkan sebagai kartu perbandingan beranimasi dengan catatan bahwa hasil bisa bervariasi.

## 11. Desain dan Motion

Konsep: 'Cockpit' bergaya HUD sci-fi. Gelap, kontras tinggi, aksen neon yang mengikuti risiko (hijau aman, kuning sedang, merah lanjutan), garis grid halus, glow, font mono untuk data dan font display yang tegas untuk judul. Seluruh pengalaman adalah satu dek kontrol dengan sidebar modul.

Prinsip motion: setiap gerakan membawa informasi (status, progres, hasil), bukan sekadar hiasan, dan angka yang tampil selalu data nyata.

Momen utama:

1. Hero landing: model HP 3D prosedural (tanpa file besar) yang mengikuti kursor, kabel USB yang 'tercolok' saat tombol di-hover, partikel data mengalir.
2. Handshake: kabel menyala dengan tiga tahap (deteksi, otorisasi, sinkron) dan cincin progres. Saat sidik jari disetujui, layar HP pada animasi 'menyala'.
3. Pindai awal: garis radar menyapu profil perangkat; angka naik (count-up) saat data nyata tiba.
4. Dashboard: gauge melingkar RAM, storage, dan baterai bergerak halus mengikuti data live; Skor Kesehatan besar dengan cincin yang terisi.
5. Debloat: kartu paket 'pecah jadi partikel' hanya setelah hasil sukses nyata, dan 'terbentuk kembali' saat dipulihkan. Daftar divirtualisasi agar ringan.
6. Tweaks: saklar bergaya mekanik dengan glow sesuai risiko dan transisi nilai lama ke nilai baru.
7. Sebelum/sesudah: kartu terbelah dengan slider dan angka beranimasi.
8. Terminal: tampilan CRT halus (opsional) dengan kursor berkedip.
9. Transisi antar modul: shared layout, 400 ms atau kurang.

Anggaran performa dan keselamatan:

- Target 60 fps di laptop menengah dengan iGPU. Animasikan transform dan opacity; efek berat (blur, shader) hanya di hero dan satu momen per layar.
- Tier kualitas high, medium, low otomatis dari hardwareConcurrency, deviceMemory, dan probe FPS 1 detik; bisa diganti manual. Tier low: tanpa 3D dan partikel, transisi sederhana. prefers-reduced-motion: hanya fade.
- Animasi tidak boleh memblokir operasi ADB. Logika ADB terpisah dari komponen UI, polling berhenti saat tab tersembunyi, daftar panjang divirtualisasi, dan 3D di-pause saat tidak terlihat.
- React Three Fiber dimuat lazy, hanya untuk hero dan satu momen di cockpit.
- Aksesibilitas: kontras cukup, semua aksi bisa lewat keyboard, status tidak hanya lewat warna (ikon dan teks), ada tombol 'jeda animasi'.

## 12. Arsitektur dan Stack

Prinsip: seluruh logika ADB berjalan di browser pengguna. Server hanya menyajikan aset statis dan database JSON (debloat dan tweak) yang berversi.

Stack:

- Next.js (App Router) dengan output statis dan TypeScript strict. Hosting statis (Vercel atau Cloudflare Pages), HTTPS wajib.
- Tailwind CSS. Motion (Framer Motion) untuk UI, GSAP untuk timeline sinematik (hero, handshake), Lenis untuk scroll landing, React Three Fiber dan drei untuk 3D (lazy).
- ADB: @yume-chan/adb, @yume-chan/adb-daemon-webusb, @yume-chan/adb-credential-web (versi dipin di T-010).
- State dengan Zustand, validasi data dengan Zod, penyimpanan lokal dengan Dexie (IndexedDB) untuk kunci, riwayat, dan snapshot.
- Terminal dengan xterm.js, virtualisasi daftar dengan TanStack Virtual.
- Uji: Vitest untuk unit dan Playwright untuk e2e memakai MockAdb, sehingga CI tidak butuh perangkat nyata.
- Opsional: analitik tanpa cookie (Plausible atau Umami) untuk event anonim opt-in.

Struktur folder:

```
app/                      # route UI (landing, /deck)
components/               # UI dan motion (tanpa logika ADB)
features/
  connect/ device/ dashboard/ debloat/ tweaks/ optimize/ terminal/ history/
lib/
  adb/
    types.ts              # interface AdbClient (kontrak)
    webusb-client.ts      # implementasi nyata
    mock-client.ts        # implementasi tiruan (demo dan tes)
    shell.ts              # jalankan command: timeout, pencatatan, safety
  parsers/                # getprop, meminfo, battery, pm list, diskstats
  engine/                 # score.ts, recommend.ts, safety.ts
  db/                     # loader dan skema Zod untuk data JSON
data/
  tweaks.json  debloat/*.json  mock-devices/*.json
```

Aturan arsitektur:

- UI hanya memakai interface AdbClient. Implementasi nyata dan mock bisa ditukar. Tidak ada import @yume-chan di luar lib/adb.
- Setiap command lewat satu fungsi shell.run() yang menerapkan timeout, pencatatan ke riwayat, dan pemeriksaan safety.ts (blokir keras) sebelum dijalankan.
- Parser berupa fungsi murni dengan tes memakai contoh output nyata dari beberapa perangkat (fixture).
- Tidak ada secret dan tidak ada backend untuk fungsi utama.

## 13. Model Data

```ts
type DeviceProfile = {
  brand: string; model: string; codename: string;
  androidVersion: string; sdk: number; securityPatch?: string;
  ramTotalMb: number; ramAvailMb: number;
  storageTotalMb: number; storageFreeMb: number;
  battery?: { level: number; tempC?: number; status: string; health?: string };
  display: { width: number; height: number; density: number; maxHz?: number };
  skin?: string;
  packages: { system: number; user: number; disabled: number };
};

type ActionLog = {
  id: string; at: number; deviceKey: string;
  kind: 'tweak' | 'debloat' | 'shell' | 'optimize';
  target: string; commands: string[];
  result: 'ok' | 'error'; output?: string;
  revert?: string[]; reverted?: boolean;
};

type Snapshot = {
  id: string; at: number; deviceKey: string;
  packages: { pkg: string; enabled: boolean; installedForUser0: boolean }[];
  settings: Record<string, string>;
};
```

deviceKey adalah hash lokal dari merek, model, dan serial. Serial mentah tidak disimpan.

## 14. Non-Fungsional dan Keamanan

- Privasi: tidak ada data perangkat yang dikirim ke server. Telemetri opt-in hanya berisi event anonim (jenis aksi, merek dan model, versi Android, sukses atau gagal), tanpa serial, nama paket milik pengguna, atau isi output.
- Keamanan: kunci ADB hanya ada di browser, ada tombol hapus semua data lokal, semua output command disanitasi sebelum dirender (tanpa HTML mentah), tidak ada eval, CSP ketat, dependensi dipin dan diaudit.
- Keselamatan pengguna: setiap aksi destruktif punya konfirmasi, log, dan jalan kembali; blokir keras untuk paket dan command kritis; auto-revert untuk perubahan tampilan; batas batch debloat; disclaimer jelas bahwa penggunaan atas risiko sendiri dan tidak untuk melewati kunci perangkat.
- Ketahanan: semua panggilan ADB punya timeout dan penanganan putus koneksi; operasi panjang bisa dibatalkan.
- Kompatibilitas: Android 7 (SDK 24) ke atas. Fitur yang tidak didukung ditandai jelas, bukan error.
- Performa: bundle awal landing di bawah 300 KB gzip tanpa 3D, modul dimuat lazy, LCP landing di bawah 2,5 detik.
- Lokalisasi: teks di file terpisah (siap i18n), bahasa Indonesia dulu.

## 15. Rencana Task

Format tiap task: Deliverable, Selesai jika, Jangan. Kerjakan berurutan. Satu task adalah satu sesi AI dan satu commit.

Fase 0: Fondasi

- T-001 Inisialisasi proyek. Deliverable: Next.js statis, TypeScript strict, Tailwind, ESLint, Vitest, Playwright, struktur folder bagian 12. Selesai jika: build, lint, typecheck, dan test kosong lulus. Jangan: menambah dependensi di luar bagian 12.
- T-002 Design tokens dan komponen dasar (panel HUD, tombol, badge risiko, gauge statis). Selesai jika: halaman uji menampilkan semua komponen di tier high dan low. Jangan: menulis logika ADB.
- T-003 Sistem tier kualitas dan motion (lib/quality, hook useMotionTier, dukungan prefers-reduced-motion). Selesai jika: tier bisa diganti manual dan tersimpan.

Fase 1: Lapisan ADB

- T-010 Riset dan penguncian library. Deliverable: baca dokumentasi @yume-chan versi terpasang, pin versi, tulis catatan API ringkas di docs/adb-notes.md. Selesai jika: ada contoh minimal terhubung ke perangkat nyata, atau dicatat jelas bahwa belum diuji. Jangan: menebak nama API.
- T-011 Interface AdbClient dan implementasi WebUSB (connect, shell, disconnect, event putus). Selesai jika: bisa menjalankan getprop ro.product.model di perangkat nyata. Jangan: mengimpor library di luar lib/adb.
- T-012 MockAdbClient dan 3 perangkat fixture di data/mock-devices. Selesai jika: tes berikutnya berjalan tanpa perangkat nyata.
- T-013 shell.run() dengan timeout, pembatalan, pencatatan, dan safety.ts (blokir keras). Selesai jika: command terblokir ditolak dengan pesan jelas dan ada tesnya.
- T-014 Parser untuk getprop, meminfo, df, dumpsys battery, wm, pm list packages, dan diskstats, dengan fixture. Selesai jika: semua parser murni dan punya tes dengan minimal 3 fixture berbeda. Jangan: melakukan I/O di parser.

Fase 2: Koneksi dan Profil

- T-020 Deteksi browser dan halaman panduan kompatibilitas.
- T-021 Wizard persiapan (USB debugging, driver per OS, adb kill-server, aturan udev) dengan konten statis.
- T-022 Alur connect dan penanganan semua kondisi error pada bagian 7.1.
- T-023 Pembacaan DeviceProfile dan pembuatan deviceKey.

Fase 3: Data dan Mesin

- T-030 Skema Zod dan loader untuk tweaks.json dan debloat.json, validasi saat build.
- T-031 Mesin skor (engine/score.ts) dengan tes.
- T-032 Mesin rekomendasi (engine/recommend.ts) dengan tes memakai 3 perangkat fixture.
- T-033 Riwayat dan snapshot (Dexie): simpan, baca, ekspor dan impor JSON.

Fase 4: Modul Fitur

- T-040 Dashboard live dengan penjadwal polling yang berhenti saat tab tersembunyi.
- T-041 Modul Tweaks: daftar, filter versi, baca nilai saat ini, apply, revert, auto-revert untuk DPI dan resolusi.
- T-042 Modul Debloat: daftar virtual, filter, rating risiko, deteksi launcher/keyboard/dialer aktif, dry-run, eksekusi batch, undo.
- T-043 Modul Optimize: tampilkan rekomendasi, jalankan paket aksi, ukur sebelum dan sesudah.
- T-044 Terminal (xterm.js) dengan konfirmasi command berbahaya.
- T-045 Halaman Riwayat: lihat, pulihkan per aksi, pulihkan semua.
- T-046 Demo mode end-to-end dari landing.

Fase 5: Motion dan Poles

- T-050 Landing: hero 3D (lazy), kabel USB interaktif, CTA.
- T-051 Animasi handshake dan pindai awal dengan data nyata.
- T-052 Gauge live dan cincin Skor Kesehatan.
- T-053 Animasi debloat (partikel), saklar tweak, dan kartu sebelum/sesudah.
- T-054 Transisi antar modul dan tuning performa (profil di laptop menengah, bandingkan tiap tier).
- T-055 Aksesibilitas, reduced motion, tombol jeda animasi.

Fase 6: Rilis

- T-060 Data seed. Dikerjakan manusia, AI hanya membantu format: uji manual katalog tweak (minimal 12) di perangkat nyata termasuk revert-nya, lalu set verified; susun database debloat awal untuk 3 vendor paling umum di kalangan pengguna.
- T-061 Halaman bantuan, FAQ, disclaimer, dan kebijakan privasi.
- T-062 Uji e2e (Playwright dengan Mock) dan uji manual di Windows, Linux, macOS dengan minimal 5 perangkat nyata berbeda.
- T-063 Deploy HTTPS, domain, CSP, dan analitik opt-in.

Fase 7 (backlog v1.1): pemasangan APK, manajer aplikasi dan izin, manajer file, logcat, screenshot dan screen record.

## 16. Panduan Vibe Coding

Prompt master (tempel di awal setiap sesi):

```
Konteks: OprekDeck, web pengatur Android via ADB (WebUSB) dengan debloat, tweak, dan rekomendasi optimasi. Tampilan full motion.
Stack: Next.js statis, TypeScript strict, Tailwind, Motion, GSAP, React Three Fiber (lazy), Zustand, Zod, Dexie, xterm.js.
Aturan:
- Kerjakan HANYA task yang diminta. Jangan ubah file di luar scope task.
- Dilarang stub, placeholder, TODO kosong, atau data palsu di kode final (kecuali fixture dan mock yang memang diminta).
- Dilarang mengarang command ADB, nama paket, atau API library. Command hanya dari data/*.json atau yang disebut eksplisit di task. Baca dokumentasi versi terpasang sebelum memakai API.
- Semua command ke perangkat WAJIB lewat shell.run(). Jangan memanggil library ADB dari UI.
- Jangan menambah atau mengubah entri tweak dan debloat.
- Jangan tambah dependensi baru tanpa izin eksplisit.
- Animasikan hanya transform dan opacity; hormati tier kualitas dan reduced motion.
- Jalankan lint, typecheck, dan test sebelum menyatakan selesai.
- Akhiri dengan daftar file yang dibuat atau diubah dan cara memverifikasi. Jika ada yang ambigu, tanya dulu.
```

Template prompt per task:

```
Task: [ID dan judul]
Tujuan: [satu kalimat]
File yang boleh disentuh: [daftar]
Deliverable: [daftar dari bagian 15]
Selesai jika: [kriteria dari bagian 15]
Jangan: [larangan dari bagian 15]
```

Cara kerja:

- Simpan prompt master dan prompt tiap task sebagai file berversi di repo (misalnya docs/prompts/v1/), supaya mudah diulang dan diperbaiki.
- Satu task, satu sesi, satu commit. Verifikasi manual sebelum lanjut ke task berikutnya.
- Uji dengan MockAdb dulu, baru perangkat nyata. Pakai HP cadangan, bukan HP utama, sampai versi stabil.
- Kalau hasil AI melebar, jangan diperbaiki lewat chat panjang. Perketat bagian Jangan di prompt lalu ulang task.
- Bagian 4, 8, 9, dan 13 adalah sumber kebenaran. Jika berubah, ubah dokumen ini dulu baru kodenya.

Definition of Done (berlaku untuk semua task):

- Build, lint, typecheck, dan test lulus.
- Perilaku sesuai kriteria 'Selesai jika'.
- Tidak ada file di luar scope yang berubah.
- Tidak ada stub atau TODO tersisa.

## 17. Risiko dan Keputusan Terbuka

Risiko:

- HP bermasalah setelah debloat. Mitigasi: blokir keras paket kritis, hanya --user 0, batch kecil, snapshot, edukasi, tidak agresif secara default.
- Library WebUSB berubah atau punya bug. Mitigasi: pin versi, abstraksi AdbClient, tes dengan mock.
- Setup driver Windows membingungkan. Mitigasi: wizard visual dan deteksi kasus umum (adb server aktif).
- Command berbeda antar vendor dan versi. Mitigasi: batas minSdk/maxSdk, flag verified, uji di perangkat nyata, fitur laporan masalah di v2.
- Klaim performa berlebihan. Mitigasi: hanya tampilkan hasil yang terukur.
- Lisensi data debloat. Mitigasi: periksa lisensi sebelum menyalin dan beri atribusi.
- Disalahgunakan untuk melewati kunci perangkat. Mitigasi: di luar scope dan tidak ada fitur ke arah itu.
- Motion berat mengganggu operasi ADB. Mitigasi: pisahkan lapisan UI dan ADB, tier kualitas, uji performa.

Keputusan terbuka:

- Nama final dan domain.
- Sumber database debloat: tulis sendiri atau memakai daftar komunitas dengan atribusi sesuai lisensi.
- Apakah installer APK masuk v1 atau tetap v1.1.
- Hosting: Vercel atau Cloudflare Pages.
- Apakah database komunitas via GitHub PR masuk v2.

## 18. Checklist Launch

- Uji minimal 5 perangkat nyata (misalnya Xiaomi, Samsung, Oppo atau Realme atau Vivo, Infinix atau Tecno, dan Pixel atau stock Android) di 3 OS.
- Semua tweak berstatus verified true setelah revert-nya diuji.
- Video demo 30 detik: colok, pindai, debloat, sebelum dan sesudah.
- Halaman bantuan lengkap dan disclaimer jelas.
- Rencana cadangan: halaman status jika library bermasalah.
- Postingan peluncuran: masalah (HP lemot), hasil sebelum/sesudah yang nyata, link, dan ajakan mencoba demo mode.
