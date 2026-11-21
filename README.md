# KEBUN SENJA — Cari Perbedaannya

Game *spot-the-difference* prosedural 2D: dua gambar senja berdampingan,
temukan semua perbedaannya sebelum waktu habis. Dibangun untuk kompetisi
make.fun **best-spot-the-difference-game-20261121-0451**.

## Cara main

- Klik perbedaan di gambar **KIRI** atau **KANAN** — perbedaan yang ketemu
  ditandai cincin emas dan menambah skor (100 × kombo, kombo naik sampai ×5
  bila beruntun tanpa salah).
- Klik salah: kilat merah dan waktu berkurang **3 detik**.
- **Hint (H)**: 3× per level — satu perbedaan yang belum ketemu berdenyut emas.
- Tiap level punya timer sendiri; waktu habis berarti game over.

## Level

| Level | Scene | Perbedaan | Waktu |
|---|---|---|---|
| 1 | Kebun Senja — taman senja, kolam koi, lentera batu | 7 | 120 dtk |
| 2 | Pasar Senja — kios lampion malam | 8 | 100 dtk |
| 3 | Bukit Observatorium — langit malam, teleskop, planet | 10 | 90 dtk |

Selesaikan satu level untuk lanjut ke level berikutnya; selesaikan ketiganya
untuk menang. Bonus waktu (+10 per detik tersisa) ditambahkan saat level
selesai. Skor terbaik tersimpan di `localStorage`.

## Kontrol

- **Mouse**: klik perbedaan / tombol di layar
- **Spasi / Enter**: mulai, lanjut ke level berikutnya, main lagi
- **H**: hint · **P / Esc**: jeda · **M**: bisu / nyalakan suara · **R**: mulai ulang

## Teknologi

- Canvas 2D vanilla, tanpa library eksternal, tanpa WebGL, tanpa gambar
  eksternal, tanpa request network — semua gambar digambar prosedural dari
  data scene (`game/src/scenes.js`) oleh satu renderer (`game/src/render.js`).
- Suara disintesis dengan WebAudio (`game/src/audio.js`).
- Struktur source: `config.js` (konstanta), `scenes.js` (3 scene + perbedaan),
  `render.js` (renderer + layar), `world.js` (state, klik, timer, skor, hint),
  `input.js`, `audio.js`, `shots.js` (scene scripted untuk screenshot),
  `main.js` (loop + layar).
- Screenshot deterministik: `?shot=start|play|play2|clear` (lihat
  `game/src/shots.js`).

## Menjalankan

```sh
node serve.ts        # lalu buka http://localhost:8080
```

Atau buka `game/index.html` lewat server statis apa pun. Tidak perlu build.

## Kredit

Dibangun oleh **wayangprint** untuk make.fun. Semua art, suara, dan nama
orisinal, dibuat khusus untuk game ini.

Referral make.fun: https://make.fun/r/tkv25np3
