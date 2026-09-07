import nodemailer from 'nodemailer'

// Helper email umum, dipakai oleh Courses.ts (hook afterChange, notifikasi
// course baru) dan scripts/send-progress-reminders.ts (cron, reminder
// progress). Pakai SMTP_HOST/PORT/USER/PASS/FROM yang sudah di-scaffold di
// .env.example (Fase 3) tapi belum pernah dipakai — lihat
// docs/21-FEATURE-EMAIL-NOTIFICATIONS.md.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter(): ReturnType<typeof nodemailer.createTransport> | null {
  if (!process.env.SMTP_HOST) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  }
  return transporter
}

// Tidak pernah melempar error ke pemanggil — kegagalan kirim email TIDAK
// BOLEH menggagalkan save course di admin panel atau menghentikan cron
// reminder di tengah jalan (lihat pemanggil masing-masing).
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const t = getTransporter()
  if (!t) {
    console.warn(`[email] SMTP_HOST belum dikonfigurasi, lewati pengiriman ke ${to}`)
    return
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@bariskode.org',
      to,
      subject,
      html,
    })
  } catch (err) {
    console.error(`[email] gagal kirim ke ${to}:`, err)
  }
}
