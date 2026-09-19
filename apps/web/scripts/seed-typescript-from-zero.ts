import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "TypeScript from Zero" — meniru pola seed-python-from-zero.ts.
// Jalankan: pnpm seed:typescript

type QuizQuestion = {
  question: string
  options: { text: string; isCorrect: boolean }[]
}

type LessonDef = {
  title: string
  slug: string
  content: string[]
  hasSandbox?: boolean
  sandboxStarterCode?: string
  hasQuiz?: boolean
  quizQuestions?: QuizQuestion[]
}

type ModuleDef = {
  title: string
  lessons: LessonDef[]
}

function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function q(question: string, options: [string, boolean][]): QuizQuestion {
  return { question, options: options.map(([text, isCorrect]) => ({ text, isCorrect })) }
}

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan TypeScript',
    lessons: [
      {
        title: 'Apa itu TypeScript?',
        slug: 'tsfz-apa-itu-typescript',
        content: [
          'TypeScript adalah superset dari JavaScript, dikembangkan dan dirawat oleh Microsoft, pertama dirilis tahun 2012. "Superset" artinya semua kode JavaScript yang valid juga valid sebagai kode TypeScript — TypeScript menambahkan fitur baru di atas JavaScript, bukan menggantikannya.',
          'Fitur utama yang ditambahkan TypeScript adalah static typing (tipe data statis) — kita bisa menentukan tipe data variabel, parameter fungsi, dan return value secara eksplisit, sesuatu yang tidak ada di JavaScript murni.',
          'Kode TypeScript (file `.ts`) tidak dijalankan langsung oleh browser atau Node.js — harus dikompilasi (di-transpile) dulu jadi JavaScript biasa lewat compiler `tsc` sebelum bisa dieksekusi.',
          'Karena TypeScript adalah superset JavaScript, semua konsep JavaScript yang sudah kita kuasai (variabel, fungsi, array, object, loop, dsb) tetap berlaku sama persis — course ini fokus membahas apa yang TypeScript TAMBAHKAN, yaitu sistem tipe.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa yang mengembangkan TypeScript?', [
            ['Microsoft', true],
            ['Google', false],
            ['Meta (Facebook)', false],
            ['Mozilla', false],
          ]),
          q('Apa arti "TypeScript adalah superset dari JavaScript"?', [
            ['Semua kode JavaScript valid juga valid sebagai TypeScript', true],
            ['TypeScript sama sekali berbeda dari JavaScript', false],
            ['TypeScript menggantikan JavaScript sepenuhnya', false],
            ['JavaScript adalah superset dari TypeScript', false],
          ]),
          q('Fitur utama apa yang ditambahkan TypeScript di atas JavaScript?', [
            ['Static typing (sistem tipe statis)', true],
            ['Garbage collection', false],
            ['Multi-threading', false],
            ['Database bawaan', false],
          ]),
        ],
      },
      {
        title: 'Kenapa Perlu Static Typing?',
        slug: 'tsfz-kenapa-perlu-static-typing',
        content: [
          'JavaScript bersifat dynamically typed — tipe data variabel baru diketahui saat program benar-benar dijalankan (runtime). Ini berarti kesalahan tipe, misalnya memanggil method yang tidak ada pada sebuah nilai, baru ketahuan setelah kode itu dieksekusi, bisa jadi setelah aplikasi sudah dipakai pengguna.',
          'Dengan static typing di TypeScript, compiler `tsc` memeriksa kecocokan tipe SEBELUM kode dijalankan (compile-time). Kalau ada ketidakcocokan tipe, compiler langsung memberi error, jauh sebelum kode itu sempat dijalankan sama sekali.',
          'Manfaat lain: editor kode (seperti VS Code) memakai informasi tipe TypeScript untuk memberi autocomplete yang lebih akurat, menampilkan dokumentasi parameter fungsi, dan mendeteksi typo nama properti secara instan saat mengetik.',
          'Static typing sangat membantu pada proyek besar dengan banyak file dan banyak orang yang berkontribusi — tipe data berfungsi seperti dokumentasi hidup yang selalu diverifikasi oleh compiler, mengurangi bug akibat kesalahan asumsi tipe data.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Kapan JavaScript murni (tanpa TypeScript) mengetahui ketidakcocokan tipe data?', [
            ['Saat runtime (program sedang berjalan)', true],
            ['Saat compile-time, sebelum dijalankan', false],
            ['JavaScript tidak pernah mendeteksi ketidakcocokan tipe', false],
            ['Saat file disimpan di editor', false],
          ]),
          q('Kapan TypeScript mendeteksi error tipe data?', [
            ['Compile-time, sebelum kode dijalankan', true],
            ['Hanya saat runtime', false],
            ['Setelah aplikasi di-deploy ke production', false],
            ['TypeScript tidak bisa mendeteksi error tipe', false],
          ]),
          q('Apa manfaat static typing untuk editor kode seperti VS Code?', [
            ['Autocomplete lebih akurat & deteksi typo instan', true],
            ['Membuat file jadi lebih kecil', false],
            ['Mempercepat koneksi internet', false],
            ['Tidak ada manfaat untuk editor', false],
          ]),
        ],
      },
      {
        title: 'Menjalankan TypeScript',
        slug: 'tsfz-menjalankan-typescript',
        content: [
          'Untuk menjalankan file `.ts`, compiler `tsc` (TypeScript Compiler) mengubahnya jadi file `.js` biasa terlebih dahulu, baru file `.js` hasil kompilasi itu yang dijalankan oleh Node.js. Alur ini disebut "transpile" (translate + compile).',
          'Selama proses kompilasi, `tsc` memeriksa seluruh anotasi tipe di kode — kalau semua cocok, hasil `.js` dihasilkan tanpa masalah; kalau ada ketidakcocokan tipe, `tsc` menampilkan pesan error lengkap dengan lokasi barisnya.',
          'Setelah dikompilasi menjadi JavaScript biasa, semua anotasi tipe TypeScript dihapus (fitur ini disebut "type erasure") — artinya tipe data hanya berguna saat development untuk pengecekan, sama sekali tidak memperlambat kode saat dijalankan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function sapa(nama: string): string {
  return "Halo, " + nama + "!"
}

console.log(sapa("Siswa BarisORG"))
console.log("TypeScript berhasil dikompilasi dan dijalankan.")
`,
      },
    ],
  },
  {
    title: 'Type Annotation Dasar',
    lessons: [
      {
        title: 'Tipe Data Dasar & Annotation',
        slug: 'tsfz-tipe-data-dasar-annotation',
        content: [
          'Type annotation adalah cara menuliskan tipe data secara eksplisit pada variabel, ditulis setelah nama variabel dengan tanda titik dua, contoh: `let umur: number = 20`. Tipe dasar yang paling sering dipakai: `number` (semua angka, termasuk desimal), `string` (teks), dan `boolean` (true/false).',
          'Berbeda dengan JavaScript yang membedakan `int` dan `float`, TypeScript hanya punya satu tipe `number` untuk semua jenis angka.',
          'Kalau kita mencoba memasukkan nilai dengan tipe yang tidak cocok, misal `let umur: number = "dua puluh"`, compiler `tsc` langsung menolak dengan error sebelum kode sempat dijalankan — inilah inti dari static typing yang sudah kita bahas di modul sebelumnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `let nama: string = "Siswa BarisORG"
let umur: number = 20
let sudahLulus: boolean = false

console.log(nama, umur, sudahLulus)
console.log("Tipe nama:", typeof nama)
console.log("Tipe umur:", typeof umur)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara menuliskan type annotation pada variabel di TypeScript?', [
            ['let umur: number = 20', true],
            ['let umur = number(20)', false],
            ['let number umur = 20', false],
            ['let umur<number> = 20', false],
          ]),
          q('Berapa jenis tipe angka dasar yang dipunyai TypeScript?', [
            ['Hanya satu, yaitu number', true],
            ['Dua, int dan float', false],
            ['Tiga, int, float, dan double', false],
            ['TypeScript tidak punya tipe angka', false],
          ]),
          q('Apa yang terjadi kalau tipe nilai tidak cocok dengan annotation-nya?', [
            ['Compiler tsc menolak dengan error compile-time', true],
            ['TypeScript otomatis mengubah tipe nilainya', false],
            ['Tidak terjadi apa-apa, kode tetap jalan normal', false],
            ['Error baru muncul saat runtime, bukan compile-time', false],
          ]),
        ],
      },
      {
        title: 'Array & Tuple Type',
        slug: 'tsfz-array-tuple-type',
        content: [
          'Tipe array ditulis dengan menambahkan `[]` setelah tipe elemennya, contoh: `let angka: number[] = [1, 2, 3]` berarti array yang HANYA boleh berisi angka. Alternatif penulisan yang setara: `Array<number>`.',
          'Tuple adalah array dengan panjang tetap dan tipe tiap elemen yang sudah ditentukan urutannya, ditulis dengan `[]` tapi berisi daftar tipe, contoh: `let koordinat: [number, number] = [10, 20]` — elemen pertama dan kedua harus `number`.',
          'Tuple berguna ketika urutan dan jumlah elemen punya makna spesifik, misal `[string, number]` untuk pasangan nama dan umur — beda dengan array biasa yang elemennya harus seragam tipenya tapi jumlahnya bebas.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `let angka: number[] = [1, 2, 3, 4, 5]
let namaBuah: string[] = ["apel", "jeruk", "mangga"]

console.log("Array angka:", angka)
console.log("Array buah:", namaBuah)

let siswa: [string, number] = ["Budi", 20]
console.log("Tuple siswa - nama:", siswa[0], "umur:", siswa[1])
`,
      },
      {
        title: 'Union Type',
        slug: 'tsfz-union-type',
        content: [
          'Union type memungkinkan sebuah variabel menerima lebih dari satu tipe data, ditulis dengan tanda `|` (pipe) di antara tipe-tipenya, contoh: `let id: string | number` — variabel `id` boleh diisi `string` ATAU `number`.',
          'Union type berguna untuk kasus yang di JavaScript murni sering ditangani dengan longgar, misal ID yang kadang berupa angka dari database, kadang berupa string UUID — TypeScript tetap memastikan hanya dua tipe itu yang diizinkan, bukan tipe lain seperti `boolean`.',
          'Saat memakai variabel bertipe union, TypeScript sering meminta kita melakukan "narrowing" (penyempitan tipe) dengan `typeof` sebelum memanggil method yang spesifik untuk satu tipe saja, supaya compiler yakin operasi itu aman untuk kedua kemungkinan tipe.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function tampilkanId(id: string | number): void {
  if (typeof id === "string") {
    console.log("ID berupa string:", id.toUpperCase())
  } else {
    console.log("ID berupa number:", id.toFixed(0))
  }
}

tampilkanId("abc-123")
tampilkanId(456)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Simbol apa yang dipakai untuk menulis union type?', [
            ['| (pipe)', true],
            ['& (ampersand)', false],
            ['+ (plus)', false],
            ['/ (garis miring)', false],
          ]),
          q('Apa arti dari tipe `string | number`?', [
            ['Nilai boleh berupa string ATAU number', true],
            ['Nilai harus berupa string DAN number sekaligus', false],
            ['Nilai berupa array campuran string dan number', false],
            ['Nilai berupa objek dengan dua properti', false],
          ]),
          q('Kenapa perlu "narrowing" dengan typeof pada variabel union type?', [
            ['Supaya compiler yakin operasi aman untuk tipe yang aktif saat itu', true],
            ['Supaya program berjalan lebih cepat', false],
            ['Supaya variabel bisa diubah jadi tipe lain permanen', false],
            ['Narrowing wajib dipakai di semua variabel, bukan hanya union', false],
          ]),
        ],
      },
      {
        title: 'Type Inference',
        slug: 'tsfz-type-inference',
        content: [
          'Type inference adalah kemampuan TypeScript menebak (infer) tipe data sebuah variabel secara otomatis dari nilai yang diberikan, tanpa kita perlu menulis anotasi tipe secara eksplisit. Contoh: `let nama = "Budi"` — TypeScript otomatis menganggap `nama` bertipe `string`.',
          'Meski tipe tidak dituliskan eksplisit, TypeScript tetap menegakkan aturan tipe itu setelahnya — mencoba `nama = 100` pada variabel di atas tetap akan ditolak compiler, karena `nama` sudah "terkunci" sebagai `string` sejak inisialisasi pertama.',
          'Praktik umum di TypeScript: gunakan type inference untuk variabel lokal sederhana yang nilainya sudah jelas dari konteks, tapi tetap tuliskan annotation eksplisit untuk parameter fungsi dan return value, karena di situ TypeScript tidak selalu bisa menebak dengan pasti.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `let kota = "Jakarta"
let jumlahPenduduk = 10000000
let statusIbukota = true

console.log(typeof kota, typeof jumlahPenduduk, typeof statusIbukota)

// TypeScript menebak tipe di atas tanpa annotation eksplisit,
// tapi tetap menegakkan aturannya:
kota = "Bandung"
console.log("Kota diubah jadi:", kota)
`,
      },
    ],
  },
  {
    title: 'Fungsi & Object',
    lessons: [
      {
        title: 'Fungsi dengan Type',
        slug: 'tsfz-fungsi-dengan-type',
        content: [
          'Fungsi di TypeScript bisa diberi tipe pada tiap parameter dan tipe return value-nya, ditulis setelah tanda kurung parameter, contoh: `function tambah(a: number, b: number): number { return a + b }`.',
          'Kalau tipe return value tidak ditulis, TypeScript akan meng-inference-nya otomatis dari isi fungsi — tapi menuliskannya eksplisit tetap dianjurkan untuk fungsi publik, supaya jelas kontrak fungsi tersebut tanpa harus membaca isinya.',
          'Fungsi yang tidak mengembalikan nilai apa pun (hanya melakukan aksi, misal `console.log`) diberi tipe return `void`, menandakan pemanggil fungsi tidak seharusnya memakai hasil return-nya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function tambah(a: number, b: number): number {
  return a + b
}

function sapa(nama: string): void {
  console.log("Halo,", nama)
}

const hasil: number = tambah(5, 3)
console.log("Hasil tambah:", hasil)
sapa("Siswa BarisORG")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe return apa yang dipakai untuk fungsi yang tidak mengembalikan nilai?', [
            ['void', true],
            ['null', false],
            ['undefined saja tanpa nama tipe', false],
            ['empty', false],
          ]),
          q('Di mana tipe return value fungsi dituliskan?', [
            ['Setelah tanda kurung parameter, sebelum kurung kurawal isi fungsi', true],
            ['Sebelum kata kunci function', false],
            ['Di dalam kurung parameter bersama parameter lain', false],
            ['TypeScript tidak mengizinkan tipe return value', false],
          ]),
          q('Kenapa tetap dianjurkan menulis tipe return value secara eksplisit?', [
            ['Supaya kontrak fungsi jelas tanpa harus membaca isinya', true],
            ['Karena TypeScript wajib mensyaratkannya, tidak ada inference', false],
            ['Supaya fungsi berjalan lebih cepat saat runtime', false],
            ['Supaya fungsi bisa dipanggil tanpa argumen', false],
          ]),
        ],
      },
      {
        title: 'Optional & Default Parameter',
        slug: 'tsfz-optional-default-parameter',
        content: [
          'Parameter opsional ditandai dengan tanda tanya `?` setelah nama parameter, contoh: `function sapa(nama: string, gelar?: string)` — pemanggil boleh tidak memberikan argumen `gelar` sama sekali.',
          'Parameter dengan nilai default ditulis dengan `=` diikuti nilainya, contoh: `function sapa(nama: string, gelar: string = "Bapak/Ibu")` — kalau argumen tidak diberikan, `gelar` otomatis bernilai `"Bapak/Ibu"`. Tipe parameter ini biasanya bisa di-inference dari nilai defaultnya, tidak wajib dituliskan eksplisit.',
          'Aturan penting: parameter opsional atau berdefault harus diletakkan SETELAH parameter wajib dalam daftar parameter fungsi — TypeScript akan menolak kalau parameter wajib diletakkan setelah parameter opsional.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function sapa(nama: string, gelar?: string): void {
  if (gelar) {
    console.log("Halo,", gelar, nama)
  } else {
    console.log("Halo,", nama)
  }
}

function beriSalam(nama: string, salam: string = "Selamat pagi"): void {
  console.log(salam + ",", nama)
}

sapa("Budi")
sapa("Siti", "Dr.")
beriSalam("Andi")
beriSalam("Rina", "Selamat malam")
`,
      },
      {
        title: 'Interface',
        slug: 'tsfz-interface',
        content: [
          'Interface mendefinisikan "bentuk" (shape) yang harus dipenuhi sebuah object — daftar properti apa saja yang wajib ada dan tipe datanya masing-masing. Ditulis dengan kata kunci `interface`, contoh: `interface Siswa { nama: string; umur: number }`.',
          'Object yang dideklarasikan dengan tipe sebuah interface akan diperiksa compiler agar strukturnya cocok persis — kalau ada properti wajib yang hilang, atau tipe salah satu properti tidak sesuai, compiler akan menolak dengan error.',
          'Properti interface bisa dibuat opsional dengan `?`, sama seperti parameter fungsi, contoh: `interface Siswa { nama: string; nilai?: number }` — properti `nilai` boleh tidak ada.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `interface Siswa {
  nama: string
  umur: number
  nilai?: number
}

function tampilkanSiswa(siswa: Siswa): void {
  console.log("Nama:", siswa.nama, "- Umur:", siswa.umur)
  if (siswa.nilai !== undefined) {
    console.log("Nilai:", siswa.nilai)
  }
}

const siswa1: Siswa = { nama: "Budi", umur: 20 }
const siswa2: Siswa = { nama: "Siti", umur: 22, nilai: 90 }

tampilkanSiswa(siswa1)
tampilkanSiswa(siswa2)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi interface di TypeScript?', [
            ['Mendefinisikan bentuk/struktur yang harus dipenuhi sebuah object', true],
            ['Menjalankan kode secara asynchronous', false],
            ['Mengganti fungsi print/console.log', false],
            ['Membuat array bertipe campuran', false],
          ]),
          q('Bagaimana cara membuat properti interface menjadi opsional?', [
            ['Tambahkan ? setelah nama properti', true],
            ['Tambahkan ! setelah nama properti', false],
            ['Tambahkan kata optional sebelum properti', false],
            ['Semua properti interface otomatis opsional', false],
          ]),
          q('Apa yang terjadi kalau object tidak memenuhi struktur interface-nya?', [
            ['Compiler tsc menolak dengan error', true],
            ['Properti yang hilang otomatis diisi null', false],
            ['Tidak terjadi apa-apa, tetap jalan normal', false],
            ['Interface diabaikan sepenuhnya oleh compiler', false],
          ]),
        ],
      },
      {
        title: 'Object Type Literal',
        slug: 'tsfz-object-type-literal',
        content: [
          'Selain lewat `interface`, bentuk object juga bisa dituliskan langsung sebagai "object type literal" di tempat annotation tipe dibutuhkan, contoh: `let siswa: { nama: string; umur: number }`.',
          'Object type literal cocok dipakai untuk tipe yang hanya dipakai sekali di satu tempat dan tidak perlu dipakai ulang di bagian lain kode — kalau bentuknya perlu dipakai berulang kali di banyak tempat, `interface` (atau `type`, yang akan dibahas di modul terakhir) lebih rapi.',
          'Sama seperti interface, object type literal juga mendukung properti opsional dengan `?` dan akan diperiksa strukturnya secara ketat oleh compiler saat object diisi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `let produk: { nama: string; harga: number; stok?: number } = {
  nama: "Buku TypeScript",
  harga: 75000,
}

function cetakProduk(p: { nama: string; harga: number }): void {
  console.log(p.nama, "- Rp", p.harga)
}

cetakProduk(produk)
console.log("Stok produk:", produk.stok ?? "tidak diketahui")
`,
      },
    ],
  },
  {
    title: 'OOP dengan Type',
    lessons: [
      {
        title: 'Class dengan TypeScript',
        slug: 'tsfz-class-dengan-typescript',
        content: [
          'Class di TypeScript ditulis mirip JavaScript ES6, tapi setiap property WAJIB dideklarasikan dengan tipenya di badan class sebelum dipakai di constructor, contoh: `class Siswa { nama: string; umur: number }`.',
          'Constructor (`constructor(...)`) tetap dipakai untuk mengisi nilai awal property saat object baru dibuat lewat `new`. Parameter constructor juga diberi tipe seperti parameter fungsi biasa.',
          'Method dalam class juga bisa diberi tipe parameter dan return value-nya, persis seperti fungsi biasa yang sudah kita pelajari — bedanya method dipanggil lewat `object.method()`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Siswa {
  nama: string
  umur: number

  constructor(nama: string, umur: number) {
    this.nama = nama
    this.umur = umur
  }

  perkenalan(): string {
    return "Halo, saya " + this.nama + ", umur " + this.umur + " tahun"
  }
}

const siswa1 = new Siswa("Budi", 20)
console.log(siswa1.perkenalan())
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang wajib dilakukan pada property class di TypeScript sebelum dipakai di constructor?', [
            ['Dideklarasikan dengan tipenya di badan class', true],
            ['Diinisialisasi dengan nilai null', false],
            ['Diberi kata kunci var', false],
            ['Tidak ada yang wajib, sama persis seperti JavaScript', false],
          ]),
          q('Method dalam class dipanggil lewat sintaks apa?', [
            ['object.method()', true],
            ['method(object)', false],
            ['class::method()', false],
            ['object->method()', false],
          ]),
          q('Kapan constructor sebuah class dijalankan?', [
            ['Saat object baru dibuat lewat kata kunci new', true],
            ['Setiap kali method dipanggil', false],
            ['Hanya saat program pertama kali dimulai', false],
            ['Constructor harus dipanggil manual setelah new', false],
          ]),
        ],
      },
      {
        title: 'Access Modifier',
        slug: 'tsfz-access-modifier',
        content: [
          'Access modifier menentukan dari mana sebuah property atau method class bisa diakses. `public` (default kalau tidak ditulis) bisa diakses dari mana saja, termasuk dari luar class.',
          '`private` hanya bisa diakses dari dalam class itu sendiri — mencoba mengakses property `private` dari luar class akan ditolak compiler, meski secara JavaScript murni sebenarnya nilainya tetap ada di object.',
          '`protected` mirip `private`, tapi juga bisa diakses dari class turunan (subclass) yang meng-extend class tersebut — akan dibahas lebih lanjut di pelajaran inheritance berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Akun {
  public nama: string
  private saldo: number

  constructor(nama: string, saldoAwal: number) {
    this.nama = nama
    this.saldo = saldoAwal
  }

  public tampilkanSaldo(): void {
    console.log(this.nama + " memiliki saldo Rp" + this.saldo)
  }

  public setor(jumlah: number): void {
    this.saldo += jumlah
  }
}

const akun1 = new Akun("Budi", 100000)
akun1.tampilkanSaldo()
akun1.setor(50000)
akun1.tampilkanSaldo()
`,
      },
      {
        title: "Inheritance & implements Interface",
        slug: 'tsfz-inheritance-implements-interface',
        content: [
          'Inheritance (pewarisan) memungkinkan sebuah class mewarisi property dan method dari class lain memakai kata kunci `extends`, contoh: `class Mahasiswa extends Siswa`. Class turunan otomatis punya semua yang dimiliki class induknya, dan bisa menambah property/method baru.',
          'Di dalam constructor class turunan, `super(...)` wajib dipanggil terlebih dahulu untuk menjalankan constructor class induk, sebelum menambahkan logika constructor milik class turunan itu sendiri.',
          'Kata kunci `implements` dipakai class untuk berjanji memenuhi struktur sebuah interface — class itu wajib punya semua property dan method yang didefinisikan interface, kalau tidak compiler akan menolak.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `interface BisaMemperkenalkanDiri {
  perkenalan(): string
}

class Siswa implements BisaMemperkenalkanDiri {
  constructor(public nama: string, public umur: number) {}

  perkenalan(): string {
    return "Saya " + this.nama + ", umur " + this.umur
  }
}

class Mahasiswa extends Siswa {
  constructor(nama: string, umur: number, public jurusan: string) {
    super(nama, umur)
  }

  perkenalan(): string {
    return super.perkenalan() + ", jurusan " + this.jurusan
  }
}

const mhs = new Mahasiswa("Rina", 19, "Teknik Informatika")
console.log(mhs.perkenalan())
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa yang dipakai class untuk mewarisi class lain?', [
            ['extends', true],
            ['implements', false],
            ['inherits', false],
            ['super', false],
          ]),
          q('Apa yang wajib dipanggil pertama kali dalam constructor class turunan?', [
            ['super(...) untuk menjalankan constructor class induk', true],
            ['this.init()', false],
            ['extends()', false],
            ['Tidak wajib memanggil apa pun', false],
          ]),
          q('Apa konsekuensi sebuah class memakai implements pada sebuah interface?', [
            ['Class wajib punya semua property/method yang didefinisikan interface itu', true],
            ['Class otomatis mewarisi implementasi dari interface', false],
            ['Interface jadi tidak bisa dipakai class lain', false],
            ['Class tidak boleh punya property tambahan lain', false],
          ]),
        ],
      },
      {
        title: 'Enum',
        slug: 'tsfz-enum',
        content: [
          'Enum (enumeration) adalah cara memberi nama pada sekumpulan nilai konstan yang saling terkait, ditulis dengan kata kunci `enum`, contoh: `enum StatusPesanan { Baru, Diproses, Selesai }`.',
          'Secara default, tiap anggota enum diberi nilai angka otomatis mulai dari 0 (`Baru` = 0, `Diproses` = 1, `Selesai` = 2) — tapi kita juga bisa menetapkan nilai string secara eksplisit, contoh: `enum Warna { Merah = "MERAH", Biru = "BIRU" }`.',
          'Enum membuat kode lebih mudah dibaca dibanding memakai angka atau string mentah secara langsung tersebar di banyak tempat — cukup memakai `StatusPesanan.Selesai` daripada mengingat-ingat angka `2` artinya apa.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `enum StatusPesanan {
  Baru,
  Diproses,
  Selesai,
}

function tampilkanStatus(status: StatusPesanan): void {
  if (status === StatusPesanan.Baru) {
    console.log("Pesanan masih baru")
  } else if (status === StatusPesanan.Diproses) {
    console.log("Pesanan sedang diproses")
  } else {
    console.log("Pesanan sudah selesai")
  }
}

tampilkanStatus(StatusPesanan.Diproses)
console.log("Nilai numerik Selesai:", StatusPesanan.Selesai)
`,
      },
    ],
  },
  {
    title: 'Generic & Ringkasan',
    lessons: [
      {
        title: 'Generic Dasar',
        slug: 'tsfz-generic-dasar',
        content: [
          'Generic memungkinkan kita menulis fungsi, class, atau interface yang bisa bekerja dengan berbagai tipe data, TANPA kehilangan pengecekan tipe yang ketat. Ditulis dengan tanda kurung siku berisi placeholder huruf, biasanya `<T>`, contoh: `function identitas<T>(nilai: T): T { return nilai }`.',
          'Tanpa generic, kita harus memilih antara menulis fungsi terpisah untuk tiap tipe (banyak duplikasi kode), atau memakai tipe `any` yang menghilangkan sama sekali manfaat static typing. Generic memberi jalan tengah: fleksibel untuk tipe apa pun, tapi tetap type-safe.',
          'Saat fungsi generic dipanggil, TypeScript otomatis meng-inference tipe `T` dari argumen yang diberikan — memanggil `identitas<number>(5)` membuat `T` menjadi `number`, jadi return value-nya juga dijamin bertipe `number`, bukan `any`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function identitas<T>(nilai: T): T {
  return nilai
}

function itemPertama<T>(daftar: T[]): T {
  return daftar[0]
}

console.log(identitas<number>(5))
console.log(identitas<string>("halo generic"))
console.log(itemPertama<string>(["apel", "jeruk", "mangga"]))
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa manfaat utama generic dibanding memakai tipe any?', [
            ['Fleksibel untuk berbagai tipe tapi tetap type-safe', true],
            ['Generic membuat kode berjalan lebih cepat saat runtime', false],
            ['Generic menghapus kebutuhan compiler tsc', false],
            ['Generic hanya bisa dipakai untuk tipe number', false],
          ]),
          q('Bagaimana TypeScript menentukan tipe T saat fungsi generic dipanggil?', [
            ['Di-inference otomatis dari argumen yang diberikan', true],
            ['T selalu bertipe any secara default', false],
            ['T harus ditulis manual setiap kali, tidak bisa di-inference', false],
            ['T ditentukan dari nama fungsi', false],
          ]),
          q('Simbol apa yang dipakai menulis parameter tipe generic?', [
            ['<T> (kurung siku dengan huruf placeholder)', true],
            ['{T} (kurung kurawal)', false],
            ['[T] (kurung siku biasa tanpa arti khusus)', false],
            ['(T) (kurung biasa)', false],
          ]),
        ],
      },
      {
        title: 'Type Alias',
        slug: 'tsfz-type-alias',
        content: [
          'Type alias dibuat dengan kata kunci `type`, memberi nama baru untuk sebuah tipe (termasuk union type, object type literal, atau tipe primitif), contoh: `type ID = string | number` — setelah ini, `ID` bisa dipakai sebagai annotation tipe di mana saja.',
          'Untuk mendeskripsikan bentuk object, `type` dan `interface` terlihat sangat mirip (`type Siswa = { nama: string; umur: number }` vs `interface Siswa { nama: string; umur: number }`) — keduanya bisa dipakai bergantian untuk kasus sederhana.',
          'Perbedaan pentingnya: `type` bisa dipakai untuk union type dan alias tipe primitif (hal yang TIDAK bisa dilakukan `interface`), sedangkan `interface` punya keunggulan bisa "digabung" (declaration merging) kalau dideklarasikan dua kali dengan nama sama — untuk bentuk object biasa, konvensi tim sering menentukan mana yang dipakai.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk membuat type alias?', [
            ['type', true],
            ['alias', false],
            ['typedef', false],
            ['using', false],
          ]),
          q('Kemampuan apa yang dimiliki type alias tapi TIDAK dimiliki interface?', [
            ['Membuat alias untuk union type dan tipe primitif', true],
            ['Mendefinisikan bentuk object', false],
            ['Dipakai sebagai annotation tipe parameter fungsi', false],
            ['Bisa diberi nama', false],
          ]),
          q('Contoh manakah yang merupakan union type alias yang valid?', [
            ['type ID = string | number', true],
            ['interface ID = string | number', false],
            ['type ID: string | number', false],
            ['union ID = string | number', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'tsfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita gabungkan konsep yang sudah dipelajari: interface untuk mendefinisikan bentuk data, class dengan access modifier dan inheritance untuk memodelkan entitas, serta generic untuk membuat struktur data yang fleksibel dipakai ulang.',
          'Contoh di sandbox berikut membuat sebuah "Kotak Penyimpanan" generic (`Kotak<T>`) yang bisa menyimpan item bertipe apa pun (misal object yang mengikuti interface `Produk`), dipakai lewat class yang mengimplementasikan interface dan mewarisi class lain.',
          'Dengan menguasai type annotation, interface, class, dan generic, kita sudah punya fondasi kuat untuk membangun aplikasi TypeScript yang lebih besar dan type-safe — mulai dari sini, langkah selanjutnya adalah mempraktikkannya di proyek nyata.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `interface Produk {
  nama: string
  harga: number
}

class Kotak<T> {
  private isi: T[] = []

  tambah(item: T): void {
    this.isi.push(item)
  }

  ambilSemua(): T[] {
    return this.isi
  }
}

class KotakProduk extends Kotak<Produk> {
  totalHarga(): number {
    return this.ambilSemua().reduce((total, produk) => total + produk.harga, 0)
  }
}

const kotak = new KotakProduk()
kotak.tambah({ nama: "Buku TypeScript", harga: 75000 })
kotak.tambah({ nama: "Stiker BarisORG", harga: 15000 })

console.log("Semua produk:", kotak.ambilSemua())
console.log("Total harga:", kotak.totalHarga())
`,
        hasQuiz: true,
        quizQuestions: [
          q('Dalam studi kasus ini, apa fungsi interface Produk?', [
            ['Mendefinisikan bentuk data yang wajib dipenuhi tiap produk', true],
            ['Menjalankan logika perhitungan total harga', false],
            ['Menggantikan fungsi class Kotak', false],
            ['Membuat angka acak', false],
          ]),
          q('Kenapa class Kotak dibuat generic (Kotak<T>)?', [
            ['Supaya bisa menyimpan item bertipe apa pun secara type-safe', true],
            ['Karena class biasa tidak boleh punya property private', false],
            ['Supaya kelas otomatis mewarisi interface Produk', false],
            ['Generic wajib dipakai di semua class TypeScript', false],
          ]),
          q('Apa hubungan antara class KotakProduk dan Kotak<Produk>?', [
            ['KotakProduk mewarisi (extends) Kotak<Produk>', true],
            ['KotakProduk mengimplementasikan Kotak<Produk> sebagai interface', false],
            ['Keduanya adalah class yang sama persis, tidak ada relasi', false],
            ['Kotak<Produk> mewarisi dari KotakProduk', false],
          ]),
        ],
      },
    ],
  },
]

async function main() {
  const payload = await getPayload({ config })

  const existingCategory = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'programming' } },
    limit: 1,
  })
  const category =
    existingCategory.docs[0] ??
    (await payload.create({
      collection: 'categories',
      data: { name: 'Programming', slug: 'programming' },
    }))

  const course = await payload.create({
    collection: 'courses',
    data: {
      title: 'TypeScript from Zero',
      slug: 'typescript-from-zero',
      category: category.id,
      level: 'pemula',
      status: 'published',
    },
  })

  let lessonCount = 0

  for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
    const moduleDef = modules[moduleIndex]
    const mod = await payload.create({
      collection: 'modules',
      data: { title: moduleDef.title, course: course.id, order: moduleIndex + 1 },
    })

    for (let lessonIndex = 0; lessonIndex < moduleDef.lessons.length; lessonIndex++) {
      const lessonDef = moduleDef.lessons[lessonIndex]
      await payload.create({
        collection: 'lessons',
        data: {
          title: lessonDef.title,
          slug: lessonDef.slug,
          module: mod.id,
          order: lessonIndex + 1,
          content: richText(lessonDef.content),
          hasSandbox: Boolean(lessonDef.hasSandbox),
          ...(lessonDef.hasSandbox
            ? { sandboxLanguage: 'typescript', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "TypeScript from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
