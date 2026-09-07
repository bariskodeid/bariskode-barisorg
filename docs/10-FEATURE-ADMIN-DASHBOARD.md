# 10. Fitur: Admin Dashboard

## Bawaan Payload (gratis, tanpa kerja tambahan)

Setiap collection yang didaftarkan otomatis dapat CRUD UI di `/admin`:

- **Content management**: buat/edit/hapus Course, Module, Lesson, Post, Category.
- **User management**: lihat semua user, ubah role, nonaktifkan akun.
- **Media library**: upload & kelola gambar.

## Role-Based Access Control

Role `student`, `instructor`, `admin` sudah didefinisikan di collection `Users`
(lihat `04-DATA-MODEL.md`). Ringkasan hak akses:

| Aksi | student | instructor | admin |
|---|:---:|:---:|:---:|
| Baca course/lesson published | ✅ | ✅ | ✅ |
| Buat/edit course/lesson | ❌ | ✅ | ✅ |
| Hapus course/lesson | ❌ | ❌ | ✅ |
| Tulis/edit post blog | ❌ | ✅ | ✅ |
| Kelola role user lain | ❌ | ❌ | ✅ |
| Lihat progress semua user | ❌ | ❌ | ✅ |

Access control ini didefinisikan langsung di masing-masing file collection lewat
fungsi `access.read/create/update/delete` — lihat kode di `04-DATA-MODEL.md`, jangan
duplikasi logic ini di frontend (frontend hanya menyembunyikan UI, bukan sumber
kebenaran keamanan).

## Custom Dashboard (statistik)

Payload admin panel default tidak punya widget statistik — perlu custom component
yang di-inject ke halaman dashboard admin.

```tsx
// src/components/admin/DashboardStats.tsx
import { getPayload } from '@/lib/payload'

export default async function DashboardStats() {
  const payload = await getPayload()

  const [users, courses, completions] = await Promise.all([
    payload.count({ collection: 'users' }),
    payload.count({ collection: 'courses', where: { status: { equals: 'published' } } }),
    payload.count({ collection: 'progress' }),
  ])

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <StatCard label="Total User" value={users.totalDocs} />
      <StatCard label="Course Published" value={courses.totalDocs} />
      <StatCard label="Lesson Diselesaikan" value={completions.totalDocs} />
    </div>
  )
}
```

Daftarkan komponen ini lewat `admin.components.beforeDashboard` di `payload.config.ts`:

```ts
admin: {
  components: {
    beforeDashboard: ['/components/admin/DashboardStats'],
  },
}
```

## Statistik Lanjutan (opsional, fase berikutnya)

- **Course terpopuler** — agregasi jumlah record `Progress` per `course`, urutkan
  descending.
- **Completion rate rata-rata** — total `Progress` selesai ÷ (total user aktif ×
  total lesson per course yang mereka mulai).
- Kalau butuh visualisasi chart, tambahkan library chart (recharts) di dalam
  custom component yang sama — jangan install plugin admin analytics pihak ketiga
  tanpa evaluasi keamanan terlebih dahulu (lihat `16-SECURITY-CHECKLIST.md`).
