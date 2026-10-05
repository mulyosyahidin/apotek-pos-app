Tanggal Pembayaran Berikutnya:
- 31 Mei 2027

## Deploy

Image tetap di-build di GitHub Actions dan di-push ke GHCR. Server menyimpan source code, menarik image, lalu menjalankan `docker compose`. Container tidak bind-mount kode aplikasi.

`docker-compose.yml` memakai `image: ${DOCKER_IMAGE}`. Nilai itu nama tag lokal yang stabil, misalnya `apotek-pos-app:local`, dan tidak berubah tiap rilis.

### Sekali di server

1. Cadangkan `.env` yang sedang dipakai.
2. Buat deploy key read-only di server, lalu daftarkan public key-nya di repo GitHub (Deploy keys, tanpa write access).
3. Pindahkan isi direktori aplikasi, lalu clone repo ke path yang sama dengan variable `APP_PATH`:

```bash
git clone git@github.com:<owner>/<repo>.git .
```

4. Kembalikan `.env`. Pastikan baris ini ada dan bukan tag SHA:

```bash
DOCKER_IMAGE=apotek-pos-app:local
```

`.env` ada di `.gitignore`, jadi `git reset --hard` pada deploy berikutnya tidak menimpanya.

5. Uji build manual, atau biarkan push ke `main` menjalankan deploy CI.

### Tailscale untuk GitHub Actions

Port 22 di IP publik ditutup. Job deploy masuk ke tailnet dulu, lalu SSH ke `HOST`.

1. Di Tailscale, buat tag `tag:ci`.
2. Buat OAuth client dengan scope `auth_keys` (write) yang boleh memakai tag itu.
3. Di ACL, izinkan `tag:ci` mengakses server pada port 22.
4. Simpan credential OAuth sebagai secret repository:
   - `TS_OAUTH_CLIENT_ID`
   - `TS_OAUTH_SECRET`
5. Ubah variable `HOST` ke IP Tailscale (`100.x.x.x`) atau hostname MagicDNS, bukan IP publik.

### Perintah di server

Build image di server lalu restart, tanpa mengubah `docker-compose.yml`:

```bash
./scripts/deploy.sh local
```

Deploy image yang sudah ada di GHCR (ini yang dipanggil GitHub Actions):

```bash
./scripts/deploy.sh remote ghcr.io/<owner>/<image>:<sha>
```

Kedua perintah menandai image sebagai `$DOCKER_IMAGE`, menjalankan `docker compose up -d`, lalu menunggu health check container `app`.
