# BUILD NOTES — KEBUN SENJA (best-spot-the-difference-game-20261121-0451)

## Apa yang dibangun

Game spot-the-difference prosedural 2D "KEBUN SENJA", canvas vanilla tanpa
library eksternal, tanpa WebGL, tanpa gambar eksternal, tanpa request network.
Semua gambar digambar dari data scene oleh satu renderer.

- `game/index.html` — canvas 1280×720 + status ARIA.
- `game/src/config.js` — konstanta, layout panel/tombol, skor, palet.
- `game/src/scenes.js` — 3 level data-driven + 25 perbedaan (hide/patch/add)
  dan helper `rightElements()` untuk panel kanan.
- `game/src/render.js` — renderer prosedural (25+ jenis elemen), HUD, 6 layar.
- `game/src/world.js` — state, klik, skor/kombo, timer, hint, penalti.
- `game/src/input.js` — mouse + keyboard (H/M/R/P/Esc/Spasi/Enter).
- `game/src/audio.js` — efek synth WebAudio (tanpa file audio).
- `game/src/shots.js` — scene scripted deterministik `?shot=start|play|play2|clear`.
- `game/src/main.js` — boot + loop 60 Hz + mesin layar.
- `main.ts` — copy game/ + screenshots/ ke /output + dossier via
  `vendor/makefun-game.ts` (salinan kit starter, tanpa diubah).
- `serve.ts` — server statis dev (dari starter, tanpa diubah).
- `LICENSE` (MIT), `README.md`, `.makefun/owner.json` (wallet payout
  `2cy7DSBQwGoXa3w7qEr9VgtxhjLCF8KqpCRc3opcpFTt`).

Level: L1 Kebun Senja 7 perbedaan/120 dtk, L2 Pasar Senja 8/100 dtk,
L3 Bukit Observatorium 10/90 dtk. Klik benar = cincin emas + 100 × kombo
(×1–×5); klik salah = kilat merah + −3 dtk; hint 3×/level (denyut emas);
best score di localStorage.

## Cara verifikasi

```sh
node serve.ts --port 8123        # http://localhost:8123
# Screenshot deterministik (headless shell Remotion + driver CDP stdlib di
# folder kerja ../cdp.mjs — Chrome Hatch /opt/meta-chromium/chrome tidak bisa
# dipakai di VM ini: gagal start "Hatch WebGL domain policy"):
node ../cdp.mjs shot "http://localhost:8123/?shot=play" screenshots/1-play.jpg
node ../cdp.mjs playtest "http://localhost:8123/"   # playtest interaktif CDP
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts  # dossier + caps
```

## Hasil playtest (headless Chrome, CDP, 21 Nov 2026 ~12:15 WIB)

- Title → play setelah klik: OK.
- Klik benar (bulan, panel kanan): skor 0→100, kombo ×1, ditemukan 0→1.
- Klik salah (langit kosong): kombo reset 0, waktu 119,18→115,87
  (−3 dtk penalti + waktu berjalan).
- Hint (tombol H): hint tersisa 3→2, `hintDiff` = 1 (denyut aktif).
- Timer: turun tepat 2,00 dtk dalam 2 dtk.
- Jeda (P) → `paused`, P lagi → `play`.
- Temukan 7/7 L1 → layar `clear`, skor 3220 (termasuk bonus waktu
  +1120), Enter → Level 2, timer 100 dtk, hint reset 3.
- Request network: hanya 9 request localhost (index + 8 modul JS),
  nol request eksternal. Nol console error/exception.

## Hasil caps gate

- `game/`: 10 file, ~90 KiB (batas 993 file / 48 MiB).
- `game/index.html`: 813 byte (batas 1 MiB).
- Screenshot: 4 file JPEG 1280×720, 63.925 / 71.559 / 84.802 / 87.808 byte
  (batas 256 KiB per file).
- Tidak ada symlink di `game/`.
- `MAKEFUN_OUTPUT_DIR=out node main.ts`: berhasil, dossier.json ter-generate.

## Catatan

- Screenshot diambil ulang setelah perbaikan layout footer (teks footer sempat
  menumpuk tombol) dan perbaikan cap kombo di `debugSetFound` (kombo maks ×5).
- Perbedaan dirancang adil tapi tidak kentara: perubahan warna, hilang/tambah
  elemen, dan geser posisi — semuanya dari data, bukan gambar.
