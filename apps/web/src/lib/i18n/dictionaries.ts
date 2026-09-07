// i18n UI-ONLY (lihat docs/20-FEATURE-I18N-UI.md). Hanya string interface
// (nav/tombol/label/pesan) yang diterjemahkan di sini. Konten dari Payload
// (title/description/richText course, lesson, post) TIDAK PERNAH masuk ke
// dictionary ini — tetap apa adanya sesuai bahasa penulis konten.
export type Locale = 'id' | 'en'

export const locales: Locale[] = ['id', 'en']

const id = {
  nav: {
    home: 'Beranda',
    courses: 'Kursus',
    blog: 'Blog',
    myLearning: 'Belajar Saya',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
  },
  footer: {
    tagline:
      'Platform pembelajaran open source untuk programming, database, data science, dan cybersecurity — dari nol sampai production.',
    explore: 'Jelajahi',
    license: (year: number) =>
      `© ${year} bariskode.org — Kode berlisensi MIT, konten CC BY-SA 4.0.`,
    openSource: 'Open source dari hari pertama.',
  },
  home: {
    badge: 'Open source & gratis',
    heroTitle1: 'Belajar coding, data,',
    heroTitle2: 'sampai cybersecurity.',
    heroDesc:
      'Materi terstruktur, lab praktik langsung di browser, dan progress tracking — semuanya gratis dan open source di bariskode.org.',
    startLearning: 'Mulai Belajar',
    viewCategories: 'Lihat Kategori',
    categories: 'Kategori',
    featuredCourses: 'Kursus Pilihan',
    viewCourse: 'Lihat kursus',
  },
  courses: {
    title: 'Kursus',
    desc: 'Materi terstruktur dari dasar sampai lanjutan — pilih kategori atau jelajahi semuanya.',
    all: 'Semua',
    empty: 'Belum ada kursus published di kategori ini.',
  },
  courseDetail: {
    materials: 'Materi',
    empty: 'Belum ada materi untuk kursus ini.',
  },
  blog: {
    title: 'Blog',
    desc: 'Artikel tutorial, pengumuman, dan tulisan seputar programming, data, dan security.',
    all: 'Semua',
    empty: 'Belum ada artikel published.',
  },
  blogDetail: {
    continueLearning: 'Lanjut belajar',
  },
  auth: {
    login: {
      title: 'Masuk',
      subtitle: 'Lanjutkan progress belajarmu di bariskode.org.',
      email: 'Email',
      password: 'Password',
      submit: 'Masuk',
      submitting: 'Memproses...',
      noAccount: 'Belum punya akun?',
      register: 'Daftar',
      genericError: 'Email atau password salah.',
      networkError: 'Tidak bisa terhubung ke server. Coba lagi.',
    },
    register: {
      title: 'Daftar Akun',
      subtitle: 'Gratis, langsung bisa tandai progress belajar.',
      name: 'Nama',
      email: 'Email',
      password: 'Password',
      submit: 'Daftar',
      submitting: 'Memproses...',
      hasAccount: 'Sudah punya akun?',
      login: 'Masuk',
      genericError: 'Registrasi gagal.',
      networkError: 'Tidak bisa terhubung ke server. Coba lagi.',
    },
  },
  lesson: {
    loginToSandbox: 'untuk mencoba sandbox kode interaktif di lesson ini.',
    sandboxUnsupported: (lang: string) => `Bahasa sandbox lesson ini ("${lang}") belum didukung.`,
    labTitle: 'Lab Praktik',
    openLab: 'Buka Lab CTF',
    labDesc:
      'Ruang lab terpisah — perlu akun sendiri di sana (tidak terhubung dengan akun bariskode.org ini).',
    loginToComplete: 'untuk menandai lesson ini selesai dan melacak progress belajarmu.',
  },
  markComplete: {
    done: 'Selesai',
    markDone: 'Tandai Selesai',
    saving: 'Menyimpan...',
  },
  quiz: {
    submit: 'Submit Quiz',
    submitting: 'Mengirim...',
    done: 'Quiz Selesai',
    scoreLabel: 'Skor kamu:',
    answerAll: 'Jawab semua soal dulu sebelum submit.',
    genericError: 'Gagal submit quiz.',
  },
  myLearning: {
    title: 'Belajar Saya',
    subtitle: 'Progress kursus yang sedang atau sudah kamu jalani.',
    emptyDesc:
      'Belum ada progress. Mulai kursus dan tandai lesson selesai untuk melihatnya di sini.',
    explore: 'Jelajahi Kursus',
    lessonsCompleted: (completed: number, total: number) => `${completed} / ${total} lesson selesai`,
    downloadCertificate: 'Download Sertifikat',
  },
  contentNotice: 'Konten kursus, lesson, dan blog saat ini hanya tersedia dalam Bahasa Indonesia.',
}

const en: typeof id = {
  nav: {
    home: 'Home',
    courses: 'Courses',
    blog: 'Blog',
    myLearning: 'My Learning',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
  },
  footer: {
    tagline:
      'An open-source learning platform for programming, databases, data science, and cybersecurity — from zero to production.',
    explore: 'Explore',
    license: (year: number) => `© ${year} bariskode.org — Code licensed under MIT, content CC BY-SA 4.0.`,
    openSource: 'Open source from day one.',
  },
  home: {
    badge: 'Open source & free',
    heroTitle1: 'Learn coding, data,',
    heroTitle2: 'all the way to cybersecurity.',
    heroDesc:
      'Structured materials, hands-on labs right in your browser, and progress tracking — all free and open source on bariskode.org.',
    startLearning: 'Start Learning',
    viewCategories: 'View Categories',
    categories: 'Categories',
    featuredCourses: 'Featured Courses',
    viewCourse: 'View course',
  },
  courses: {
    title: 'Courses',
    desc: 'Structured materials from beginner to advanced — pick a category or browse everything.',
    all: 'All',
    empty: 'No published courses in this category yet.',
  },
  courseDetail: {
    materials: 'Materials',
    empty: 'No materials for this course yet.',
  },
  blog: {
    title: 'Blog',
    desc: 'Tutorials, announcements, and writing about programming, data, and security.',
    all: 'All',
    empty: 'No published articles yet.',
  },
  blogDetail: {
    continueLearning: 'Continue learning',
  },
  auth: {
    login: {
      title: 'Log In',
      subtitle: 'Continue your learning progress on bariskode.org.',
      email: 'Email',
      password: 'Password',
      submit: 'Log In',
      submitting: 'Processing...',
      noAccount: "Don't have an account?",
      register: 'Sign up',
      genericError: 'Wrong email or password.',
      networkError: "Couldn't connect to the server. Try again.",
    },
    register: {
      title: 'Create Account',
      subtitle: 'Free, start tracking your learning progress right away.',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      submit: 'Sign Up',
      submitting: 'Processing...',
      hasAccount: 'Already have an account?',
      login: 'Log in',
      genericError: 'Registration failed.',
      networkError: "Couldn't connect to the server. Try again.",
    },
  },
  lesson: {
    loginToSandbox: 'to try the interactive code sandbox in this lesson.',
    sandboxUnsupported: (lang: string) => `This lesson's sandbox language ("${lang}") isn't supported yet.`,
    labTitle: 'Hands-on Lab',
    openLab: 'Open CTF Lab',
    labDesc: 'A separate lab space — needs its own account there (not connected to this bariskode.org account).',
    loginToComplete: 'to mark this lesson complete and track your learning progress.',
  },
  markComplete: {
    done: 'Completed',
    markDone: 'Mark Complete',
    saving: 'Saving...',
  },
  quiz: {
    submit: 'Submit Quiz',
    submitting: 'Submitting...',
    done: 'Quiz Completed',
    scoreLabel: 'Your score:',
    answerAll: 'Answer every question before submitting.',
    genericError: 'Failed to submit the quiz.',
  },
  myLearning: {
    title: 'My Learning',
    subtitle: 'Progress on courses you are taking or have completed.',
    emptyDesc: 'No progress yet. Start a course and mark lessons complete to see them here.',
    explore: 'Explore Courses',
    lessonsCompleted: (completed: number, total: number) => `${completed} / ${total} lessons completed`,
    downloadCertificate: 'Download Certificate',
  },
  contentNotice: 'Course, lesson, and blog content is currently only available in Indonesian.',
}

export const dictionaries = { id, en }

export type Dictionary = typeof id
