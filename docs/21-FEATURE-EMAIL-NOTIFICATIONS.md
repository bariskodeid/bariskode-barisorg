# 21. Fitur: Notifikasi Email

## Ringkasan

Dua trigger: (a) course baru published, (b) reminder untuk course yang
progress-nya mandek. Pakai `nodemailer` + env `SMTP_HOST/PORT/USER/PASS/FROM`
yang sudah di-scaffold sejak Fase 3 di `.env.example` tapi baru sekarang
benar-benar dipakai — BUKAN reset password (belum ada flow itu di v1).

## Helper Email

`src/lib/email.ts` — `sendEmail({to, subject, html})`. Kalau `SMTP_HOST`
kosong: log warning & skip kirim (dev lokal tanpa SMTP tetap jalan normal).
**Tidak pernah melempar error** ke pemanggil — kegagalan kirim TIDAK BOLEH
menggagalkan save course di admin panel atau menghentikan cron reminder di
tengah jalan.

## Trigger A — Course Baru Published

Hook `afterChange` di `src/collections/Courses.ts` (hook pertama di
repo ini selain `beforeValidate` slug) — deteksi transisi
`previousDoc.status !== 'published' && doc.status === 'published'` (course
pakai field `select` biasa untuk status, bukan native Payload draft/publish
event, jadi harus dibandingkan manual). `notifyCoursePublished()`
(`src/lib/notifications.ts`) kirim ke semua user `role: 'student'`, loop
sequential — **sengaja tanpa queue/batching** (MVP, jumlah user masih
kecil), dipanggil `void ...catch(...)` (fire-and-forget) supaya save course
di admin panel tidak menunggu semua email terkirim.

## Trigger B — Reminder Progress Mandek

Script standalone `apps/web/scripts/send-progress-reminders.ts`, dijalankan
via `payload run` (pola identik `scripts/seed-dev.ts` yang sudah ada — CATATAN
PENTING: `payload run` tidak menunggu promise yang tidak di-await di top
level, jadi wajib `await main()` di baris terakhir, bukan `.then()`/
`process.exit()` manual).

Logika: untuk tiap user `role: student`, hitung `lastActivity` (max
`completedAt`) per course yang progress-nya `< 100%`. Kirim reminder HANYA
kalau `7 <= hari sejak lastActivity < 8`.

**Dedup tanpa collection tracking baru (sengaja, MVP)**: window sempit 7-8
hari ini yang jadi mekanisme dedup — cron harian otomatis hanya kena window
ini sekali per user per course. Trade-off yang diketahui: kalau cron sempat
skip jalan sehari pas user pas di window itu, reminder untuk course itu
tidak akan pernah terkirim (bukan retry-able). Kalau kelak butuh dedup yang
lebih andal, itu perlu collection `EmailLog`/field `remindedAt` — belum
dibangun sekarang (jangan over-engineer sebelum ada bukti kebutuhan).

## Infra: Menjalankan Script di Production

`infra/docker-compose.yml` punya service baru `web-script` (pola identik
`web-migrate` yang sudah ada — image `web` production sengaja ramping/
standalone, tidak bisa jalankan script, jadi `web-script` pakai stage
`builder` yang masih punya source+pnpm lengkap):

```bash
docker compose -f infra/docker-compose.yml run --rm web-script scripts/send-progress-reminders.ts
```

Dokumentasi cron lengkap ada di `docs/14-DEPLOYMENT-ORACLE-VM.md` bagian 10.
