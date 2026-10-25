# Catatan API ADB — T-010

Status: riset selesai. Contoh koneksi di bawah **belum diuji pada perangkat Android nyata** dan belum dijalankan di browser. Yang sudah diverifikasi hanya kompilasi tipe terhadap paket yang terpasang.

Tanggal riset: 2026-10-25

## Versi yang dipin

Dependensi langsung di `package.json` memakai versi exact (tanpa `^` atau `~`):

| Paket | Versi | Lisensi |
| --- | --- | --- |
| `@yume-chan/adb` | `2.6.4` | MIT |
| `@yume-chan/adb-daemon-webusb` | `2.3.2` | MIT |
| `@yume-chan/adb-credential-web` | `2.1.0` | MIT |

Versi transitive yang ikut terkunci di `package-lock.json`:

- `@yume-chan/stream-extra` `2.6.1`
- `@yume-chan/struct` `2.3.2`
- `@types/w3c-web-usb` `1.0.14`

Naik versi harus lewat task tersendiri: baca changelog paket, ulangi riset nama API di `esm/**/*.d.ts`, perbarui catatan ini, lalu uji ulang di perangkat nyata.

Sumber yang dibaca (langsung dari paket terpasang, bukan dari ingatan):

- `node_modules/@yume-chan/adb/esm/**/*.d.ts`
- `node_modules/@yume-chan/adb-daemon-webusb/esm/**/*.d.ts` dan implementasi `manager.js`, `device.js`
- `node_modules/@yume-chan/adb-credential-web/esm/index.d.ts` dan `index.js`
- README masing-masing paket (mengarah ke https://tangoadb.dev/)

## Batasan lingkungan

- WebUSB hanya tersedia di Chromium desktop (Chrome, Edge, Opera) pada secure context: HTTPS atau `localhost`.
- `navigator.usb` tidak ada di Firefox/Safari; UI harus mendeteksi dan menampilkan panduan, bukan error mentah.
- Pengguna wajib mengaktifkan Opsi Pengembang dan USB debugging. Saat koneksi pertama, perangkat menampilkan dialog sidik jari RSA yang harus disetujui.
- Windows memerlukan driver ADB/WinUSB. Jika `adb server` lokal sedang berjalan, browser bisa gagal membuka perangkat; panduan PRD meminta `adb kill-server`.
- Linux memerlukan aturan udev. macOS umumnya langsung bekerja.
- ADB berjalan sebagai shell user, bukan root. Tidak ada operasi partisi sistem.

## Peta API

### Memilih perangkat WebUSB

```ts
AdbDaemonWebUsbDeviceManager.BROWSER: AdbDaemonWebUsbDeviceManager | undefined

new AdbDaemonWebUsbDeviceManager(usb: USB)

manager.requestDevice(options?: {
  filters?: readonly USBDeviceFilter[];
  exclusionFilters?: readonly USBDeviceFilter[];
}): Promise<AdbDaemonWebUsbDevice | undefined>

manager.getDevices(options?): Promise<AdbDaemonWebUsbDevice[]>
manager.trackDevices(options?): Promise<AdbDaemonWebUsbDeviceObserver>
```

- `BROWSER` bernilai `undefined` bila runtime tidak punya `navigator.usb`.
- `requestDevice` mengembalikan `undefined` bila pengguna membatalkan dialog atau perangkat yang dipilih tidak cocok.
- Filter default ADB ditambahkan otomatis: `classCode 0xff`, `subclassCode 0x42`, `protocolCode 0x01`. Filter kustom tetap diisi class/subclass/protocol default bila kosong.
- `getDevices` hanya mengembalikan perangkat yang izinnya sudah pernah diberikan untuk origin ini.

`AdbDaemonWebUsbDeviceObserver`:

```ts
observer.onDeviceAdd
observer.onDeviceRemove
observer.onListChange
observer.current
observer.stop()
```

### Objek perangkat dan koneksi

```ts
device.raw: USBDevice
device.serial: string
device.name: string
device.connect(): Promise<AdbDaemonWebUsbConnection>
```

- `serial` memakai `USBDevice.serialNumber`; bila kosong, library memakai `vendorId x productId` yang sudah di-pad. Nilai ini belum tentu unik untuk semua perangkat.
- `connect()` membuka USB device dan mengklaim interface ADB. Error `DeviceBusyError` dilempar bila interface tidak bisa diklaim (misalnya karena dipakai proses lain).
- `AdbDaemonWebUsbConnection` adalah `ReadableWritablePair` paket ADB. Ia menangani event `disconnect` WebUSB dan menutup duplex-nya sendiri.

### Autentikasi

```ts
AdbDaemonTransport.authenticate({
  serial: string,
  connection: AdbDaemonConnection,
  credentialStore: AdbCredentialStore,
  authenticators?, features?, initialDelayedAckBytes?, preserveConnection?, readTimeLimit?,
}): Promise<AdbDaemonTransport>
```

- Autentikator default mencoba signature dengan key yang tersimpan; bila belum ada key, `generateKey()` dipanggil otomatis.
- Key dibuat RSA 2048, public exponent 65537, hash SHA-1 (keperluan protokol ADB), lalu diekspor sebagai PKCS#8.
- Bila pengguna menolak dialog otorisasi, `authenticate` gagal. Menurut dokumentasi tipe, koneksi tetap terbuka saat autentikasi gagal sehingga bisa dicoba lagi.
- `AdbDaemonTransport` menyediakan `disconnected`, `close()`, dan `connect(service)`.

### Kredensial

```ts
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";

new AdbWebCredentialStore(appName?: string)
store.generateKey(): Promise<AdbPrivateKey>
store.iterateKeys(): AsyncGenerator<AdbPrivateKey, void, void>
```

Temuan dari implementasi terpasang yang perlu diperhatikan:

- Key disimpan di IndexedDB, bukan localStorage. Nama database selalu `"Tango"` dan object store `"Authentication"`; `appName` hanya dipakai pada nama key (`<appName>@<hostname>`).
- Key disimpan sebagai PKCS#8 mentah tanpa enkripsi tambahan. Siapa pun yang bisa membaca IndexedDB origin ini bisa membaca key tersebut.
- Komentar di file `.d.ts` menyebut localStorage, tetapi implementasi `index.js` memakai IndexedDB. Implementasi adalah sumber kebenaran.
- Penghapusan data lokal nanti harus mencakup database `"Tango"` tersebut, bukan hanya database milik aplikasi.

### Menjalankan command

`Adb` membungkus transport:

```ts
import { Adb } from "@yume-chan/adb";

const adb = new Adb(transport);
adb.disconnected: Promise<void>
adb.close(): Promise<void>
adb.subprocess.noneProtocol
adb.subprocess.shellProtocol // bisa undefined
```

`noneProtocol`:

```ts
spawn(command: string | readonly string[], signal?: AbortSignal): Promise<AdbNoneProtocolProcess>
spawnWait(command): Promise<Uint8Array>
spawnWaitText(command): Promise<string>
```

- Output `noneProtocol` menggabungkan stdout dan stderr, tanpa exit code.
- `spawnWaitText` menunggu proses selesai dan mengembalikan seluruh output sebagai string.
- `spawn` menerima `AbortSignal`; `spawnWait`/`spawnWaitText` tidak. Untuk timeout dan pembatalan, gunakan `spawn` lalu baca stream sendiri.

`shellProtocol`:

```ts
shellProtocol.isSupported // cek fitur ShellV2 perangkat
spawn(command, signal?): Promise<AdbShellProtocolProcess>
spawnWaitText(command): Promise<{ stdout: string; stderr: string; exitCode: number }>
```

- Shell protocol memisahkan stdout/stderr dan memberi exit code, tetapi hanya tersedia bila perangkat mendukung fitur ShellV2.
- Untuk `shell.run()` di T-011, gunakan `spawn` + `AbortSignal` agar timeout/pembatalan benar-benar menghentikan proses. Jangan memakai `spawnWaitText` untuk command produksi karena tidak bisa dibatalkan.

Catatan penting:

- `adb.getProp(key)` ada, tetapi melewati pencatatan dan pemeriksaan safety milik `shell.run()`. Jangan dipakai langsung dari UI atau fitur.
- `adb.disconnected` selesai saat koneksi ditutup; ia dapat reject bila pembacaan transport gagal. T-011 harus menangani kedua jalur dan membersihkan state koneksi.
- Semua command tetap harus melewati satu `shell.run()` sesuai PRD bagian 12.

## Contoh minimal (BELUM DIUJI DI PERANGKAT)

Contoh ini hanya untuk memverifikasi alur API. Jangan dijadikan implementasi T-011 apa adanya: belum ada timeout, logging, safety, atau penanganan error yang dipetakan ke UI.

```ts
import { Adb, AdbDaemonTransport } from "@yume-chan/adb";
import { AdbDaemonWebUsbDeviceManager } from "@yume-chan/adb-daemon-webusb";
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";

export async function connectAndReadModel(): Promise<string | undefined> {
  const manager = AdbDaemonWebUsbDeviceManager.BROWSER;
  if (!manager) {
    throw new Error("WebUSB tidak tersedia di browser ini.");
  }

  const device = await manager.requestDevice();
  if (!device) {
    return undefined;
  }

  const connection = await device.connect();
  const transport = await AdbDaemonTransport.authenticate({
    serial: device.serial,
    connection,
    credentialStore: new AdbWebCredentialStore("OprekDeck"),
  });
  const adb = new Adb(transport);

  try {
    const output = await adb.subprocess.noneProtocol.spawnWaitText(
      "getprop ro.product.model",
    );
    return output.trim();
  } finally {
    await adb.close();
  }
}
```

Status verifikasi contoh:

- Dikompilasi dengan TypeScript strict terhadap deklarasi paket versi di atas: lulus.
- Dijalankan di browser dan perangkat nyata: **belum**. Karena itu T-011 tetap harus diuji dengan perangkat nyata dan hasilnya dicatat sebelum fitur dianggap selesai.

## Verifikasi ulang

```bash
npm ls @yume-chan/adb @yume-chan/adb-daemon-webusb @yume-chan/adb-credential-web --depth=1
npm run typecheck
```

Bila nama API berubah setelah upgrade, perbarui dokumen ini terlebih dahulu, lalu sesuaikan implementasi T-011.
