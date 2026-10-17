import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan TypeScript',
    lessons: [
      {
        title: 'Apa itu TypeScript?',
        slug: 'tsfz-apa-itu-typescript',
        content: [
          'TypeScript adalah superset dari JavaScript, dikembangkan dan dirawat oleh Microsoft, pertama dirilis tahun 2012. "Superset" artinya semua sintaks JavaScript yang valid juga valid sebagai sintaks TypeScript — TypeScript menambahkan fitur baru di atas JavaScript, bukan menggantikannya. (Pemeriksaan tipenya bisa saja melaporkan error untuk kode JavaScript yang longgar soal tipe, misalnya variabel angka yang diisi teks, tapi sintaksnya tetap dikenali.)',
          'Fitur utama yang ditambahkan TypeScript adalah static typing (tipe data statis) — kita bisa menentukan tipe data variabel, parameter fungsi, dan return value secara eksplisit, sesuatu yang tidak ada di JavaScript murni. Fitur lain yang sering dikira milik TypeScript, seperti class, modul, dan `async`/`await`, sebenarnya sudah ada di JavaScript modern.',
          'Kode TypeScript (file `.ts`) tidak bisa langsung dijalankan browser — harus dikompilasi (di-transpile) dulu jadi JavaScript biasa lewat compiler `tsc`. Tipe hanya dipakai saat pemeriksaan dan dihapus dari hasil kompilasi, jadi TypeScript tidak membuat program berjalan lebih cepat; manfaatnya ada di keamanan dan kenyamanan saat menulis kode. Cara kerja `tsc` dibahas di lesson Menjalankan TypeScript.',
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
            ['Semua sintaks JavaScript yang valid juga valid di TypeScript', true],
            ['TypeScript sama sekali berbeda dari JavaScript', false],
            ['TypeScript menggantikan JavaScript sepenuhnya', false],
            ['JavaScript adalah superset dari TypeScript', false],
          ]),
          q('Fitur utama apa yang ditambahkan TypeScript di atas JavaScript?', [
            ['Static typing (sistem tipe statis)', true],
            ['Sintaks class dan modul yang tidak ada di JavaScript', false],
            ['Eksekusi kode yang lebih cepat daripada JavaScript biasa', false],
            ['Fitur async/await untuk operasi asynchronous', false],
          ]),
        ],
      },
      {
        title: 'Kenapa Perlu Static Typing?',
        slug: 'tsfz-kenapa-perlu-static-typing',
        content: [
          'JavaScript bersifat dynamically typed — tipe data variabel baru diketahui saat program benar-benar dijalankan (runtime). Ini berarti kesalahan tipe, misalnya memanggil method yang tidak ada pada sebuah nilai, baru ketahuan setelah kode itu dieksekusi, bisa jadi setelah aplikasi sudah dipakai pengguna.',
          'Dengan static typing di TypeScript, compiler `tsc` memeriksa kecocokan tipe SEBELUM kode dijalankan (compile-time). Kalau ada ketidakcocokan tipe, compiler langsung memberi error, jauh sebelum kode itu sempat dijalankan sama sekali.',
          'Contoh berikut salah ketik nama property: `nmaa`, seharusnya `nama`. Di JavaScript murni, kesalahan ini baru meledak sebagai `TypeError` saat baris itu dijalankan. Di TypeScript, `tsc` langsung melaporkan bahwa property `nmaa` tidak ada, saat kompilasi. Contoh ini sengaja salah, jadi tidak akan lolos kompilasi di sandbox.',
          `\`\`\`typescript
const pengguna = { nama: "Budi" }
console.log(pengguna.nmaa.toUpperCase())
// error: Property 'nmaa' does not exist on type '{ nama: string; }'.
\`\`\``,
          'Manfaat lain: editor kode (seperti VS Code) memakai informasi tipe TypeScript untuk memberi autocomplete yang lebih akurat, menampilkan dokumentasi parameter fungsi, dan mendeteksi typo nama properti secara instan saat mengetik.',
          'Static typing sangat membantu pada proyek besar dengan banyak file dan banyak orang yang berkontribusi — tipe data berfungsi seperti dokumentasi hidup yang selalu diverifikasi oleh compiler, mengurangi bug akibat kesalahan asumsi tipe data. Perlu diingat batasnya: static typing hanya memeriksa tipe, bukan logika program — rumus yang salah atau kondisi yang keliru tetap lolos pemeriksaan tipe dan tetap perlu dites.',
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
            ['Autocomplete lebih akurat dan typo nama property langsung terdeteksi', true],
            ['Kode otomatis dioptimalkan sehingga berjalan lebih cepat saat runtime', false],
            ['Semua bug logika, bukan hanya salah tipe, ditemukan sebelum kode dijalankan', false],
          ]),
        ],
      },
      {
        title: 'Menjalankan TypeScript',
        slug: 'tsfz-menjalankan-typescript',
        content: [
          'Untuk menjalankan file `.ts` di komputer sendiri, compiler `tsc` (TypeScript Compiler) mengubahnya jadi file `.js` biasa terlebih dahulu, baru file `.js` hasil kompilasi itu yang dijalankan oleh Node.js. Alur ini disebut "transpile" (translate + compile). Pasang TypeScript lewat npm, lalu kompilasi dan jalankan:',
          '```bash\nnpm install --save-dev typescript\nnpx tsc halo.ts\nnode halo.js\n```',
          '## Error tipe dan hasil kompilasi',
          'Selama kompilasi, `tsc` memeriksa seluruh anotasi tipe di kode. Kalau semua cocok, `halo.js` dihasilkan tanpa masalah. Kalau ada ketidakcocokan tipe, `tsc` menampilkan pesan error lengkap dengan lokasi barisnya. Perhatikan: secara default `tsc` tetap menghasilkan `halo.js` walau ada error tipe — error hanya dilaporkan (dan exit code-nya tidak nol). Supaya file `.js` tidak dihasilkan kalau ada error, jalankan dengan opsi `noEmitOnError`:',
          '```bash\nnpx tsc --noEmitOnError halo.ts\n```',
          '## Sandbox di course ini',
          'Sandbox memakai TypeScript 3.7.4 yang dikompilasi TANPA flag `--strict` (sandbox tidak bisa diberi flag atau `tsconfig.json`), lalu hasilnya dijalankan di Node.js 12. Kalau `tsc` melaporkan error tipe, sandbox menampilkan error kompilasi itu dan tidak menjalankan kodenya — ini perilaku sandbox, bukan perilaku default TypeScript. Karena `--strict` mati, beberapa error yang muncul di proyek sungguhan (misalnya mengisi `null` ke variabel `string`) tidak akan terlihat di sandbox.',
          '## tsconfig.json dan strict',
          'Di proyek sungguhan, opsi compiler disimpan di file `tsconfig.json` (bisa dibuat dengan `npx tsc --init`), lalu cukup jalankan `npx tsc` tanpa nama file. Opsi `"strict": true` menyalakan sekelompok pemeriksaan tipe yang lebih ketat, termasuk `noImplicitAny` dan `strictNullChecks` (dibahas di lesson any/unknown dan lesson null/undefined); hampir semua proyek TypeScript modern menyalakannya.',
          '```plaintext\n{\n  "compilerOptions": {\n    "target": "es2017",\n    "strict": true\n  }\n}\n```',
          '## Type erasure',
          'Setelah dikompilasi menjadi JavaScript biasa, semua anotasi tipe TypeScript dihapus (fitur ini disebut "type erasure") — artinya tipe data hanya berguna saat development untuk pengecekan, sama sekali tidak memperlambat kode saat dijalankan. Catatan: Node.js versi baru (misalnya v24) bisa menjalankan file `.ts` langsung dengan membuang anotasi tipe, tapi tanpa memeriksa tipe sama sekali, jadi `tsc` tetap dibutuhkan untuk pengecekan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function sapa(nama: string): string {
  return "Halo, " + nama + "!"
}

console.log(sapa("Siswa BarisORG"))
console.log("TypeScript berhasil dikompilasi dan dijalankan.")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Sebuah file .ts berisi error tipe. Apa yang dilakukan tsc secara default (tanpa noEmitOnError)?', [
            ['Melaporkan error, tetapi tetap menghasilkan file .js', true],
            ['Tidak menghasilkan file .js sama sekali sampai semua error diperbaiki', false],
            ['Memperbaiki tipe yang salah secara otomatis, lalu menghasilkan file .js', false],
          ]),
          q('Apa fungsi opsi noEmitOnError pada tsc?', [
            ['Mencegah tsc menghasilkan file .js kalau ada error tipe', true],
            ['Mengaktifkan pemeriksaan tipe yang lebih ketat seperti strictNullChecks', false],
            ['Menyembunyikan pesan error tipe dari terminal supaya tidak mengganggu', false],
            ['Mengubah semua error tipe menjadi peringatan yang boleh diabaikan', false],
          ]),
          q('Apa yang benar tentang cara sandbox course ini mengompilasi TypeScript?', [
            ['Memakai TypeScript 3.7.4 tanpa --strict; kalau ada error tipe, kode tidak dijalankan', true],
            ['Memakai tsconfig.json dengan strict: true, sama seperti proyek TypeScript modern', false],
            ['Selalu menjalankan hasil kompilasi walaupun tsc melaporkan error tipe di kodenya', false],
            ['Menjalankan file .ts langsung di Node.js 12 tanpa langkah kompilasi lebih dulu', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Type Annotation, Union & Narrowing',
    lessons: [
      {
        title: 'Tipe Data Dasar & Annotation',
        slug: 'tsfz-tipe-data-dasar-annotation',
        content: [
          'Type annotation adalah cara menuliskan tipe data secara eksplisit pada variabel, ditulis setelah nama variabel dengan tanda titik dua, contoh: `let umur: number = 20`. Tipe dasar yang paling sering dipakai: `number` (semua angka, termasuk desimal), `string` (teks), dan `boolean` (true/false).',
          'JavaScript tidak punya tipe `int` dan `float` yang terpisah, jadi TypeScript juga tidak: `42` dan `3.14` sama-sama bertipe `number`.',
          'Untuk bilangan bulat yang melebihi batas aman `number`, ada tipe terpisah `bigint` (sejak TypeScript 3.2). Contoh berikut tidak jalan di sandbox karena sandbox memakai target kompilasi bawaan yang lebih lama dari ES2020, sehingga `BigInt` tidak dikenali:',
          `\`\`\`typescript
const besar: bigint = BigInt("9007199254740993")
console.log(typeof besar)   // bigint
\`\`\``,
          'Kalau kita mencoba memasukkan nilai dengan tipe yang tidak cocok, misal `let umur: number = "dua puluh"`, compiler `tsc` melaporkan error saat kompilasi, sebelum kode sempat dijalankan — inilah inti dari static typing yang sudah kita bahas di modul sebelumnya. Baris terakhir contoh berikut sengaja salah:',
          `\`\`\`typescript
let umur: number = 20
let tinggi: number = 170.5   // desimal tetap number
let nama: string = "Siswa"
umur = "dua puluh"
// error: Type '"dua puluh"' is not assignable to type 'number'.
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `let nama: string = "Siswa BarisORG"
let umur: number = 20
let tinggi: number = 170.5
let sudahLulus: boolean = false

console.log(nama, umur, tinggi, sudahLulus)
console.log("Tipe nama:", typeof nama)
console.log("Tipe umur:", typeof umur)
console.log("Tipe tinggi:", typeof tinggi)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara menuliskan type annotation pada variabel di TypeScript?', [
            ['let umur: number = 20', true],
            ['let umur = number(20)', false],
            ['let number umur = 20', false],
            ['let umur<number> = 20', false],
          ]),
          q('Angka 42 dan 3.14 bertipe apa di TypeScript?', [
            ['Sama-sama number, tidak ada tipe int dan float yang terpisah', true],
            ['42 bertipe int dan 3.14 bertipe float', false],
            ['42 bertipe integer dan 3.14 bertipe double', false],
            ['42 bertipe number dan 3.14 bertipe decimal', false],
          ]),
          q('Apa yang terjadi kalau tipe nilai tidak cocok dengan annotation-nya, misal let umur: number = "dua puluh"?', [
            ['tsc melaporkan error saat kompilasi, sebelum kode dijalankan', true],
            ['TypeScript otomatis mengubah nilainya menjadi tipe yang sesuai', false],
            ['Kode tetap jalan normal dan tidak ada pesan apa pun', false],
            ['Program berjalan dulu, error baru muncul saat baris itu dieksekusi (runtime)', false],
          ]),
        ],
      },
      {
        title: 'any, unknown, never & Literal Type',
        slug: 'tsfz-any-unknown-never',
        content: [
          'Selain tipe dasar seperti `number` dan `string`, TypeScript punya tiga tipe khusus yang perlu dipahami sejak awal: `any`, `unknown`, dan `never`. Setelah itu kita bahas literal type, yaitu tipe yang hanya punya satu nilai persis.',
          '## any: mematikan pengecekan tipe',
          '`any` berarti "tipe apa saja". Nilai bertipe `any` boleh diisi apa pun dan boleh dipakai seperti tipe apa pun tanpa dicek compiler. Itu membuatnya praktis, tapi sama saja dengan menulis JavaScript biasa: kesalahan baru ketahuan saat program berjalan. Anggap `any` sebagai jalan keluar darurat, bukan pilihan default. Variabel tanpa tipe dan tanpa nilai awal (misal `let x`) juga otomatis bertipe `any` (implicit any); opsi `noImplicitAny`, bagian dari `strict`, melarangnya.',
          `\`\`\`typescript
let bebas: any = "teks"
bebas = 42                // boleh: any menerima nilai apa saja
bebas.toUpperCase()       // lolos kompilasi, tapi TypeError saat dijalankan: angka tidak punya toUpperCase
\`\`\``,
          '## unknown: any yang aman',
          '`unknown` juga menerima nilai apa pun, tapi sebelum dipakai nilainya harus dipersempit (narrowing) dulu, misalnya dengan `typeof`. Selama belum dipersempit, compiler menolak memakainya, misalnya memanggil method atau mengakses property. Karena itu `unknown` cocok untuk data yang tipenya belum pasti, misal hasil parsing JSON, sebagai pengganti `any` yang aman. Narrowing dibahas lebih lengkap di lesson Narrowing & Type Assertion.',
          `\`\`\`typescript
let data: unknown = "halo"
// data.toUpperCase()   // error: Property 'toUpperCase' does not exist on type 'unknown'.

if (typeof data === "string") {
  console.log(data.toUpperCase())   // aman: di dalam if ini data sudah dipersempit jadi string
}
\`\`\``,
          '## never: tidak pernah ada nilainya',
          '`never` adalah tipe untuk sesuatu yang tidak pernah terjadi. Pemakaian paling umum adalah return type fungsi yang tidak pernah selesai secara normal: selalu melempar error atau berputar selamanya. Bedakan dari `void`: fungsi `void` selesai tapi tidak mengembalikan nilai, sedangkan fungsi `never` tidak pernah sampai ke akhir. `never` juga muncul sebagai sisa tipe kalau semua kemungkinan sudah dicek; pemakaian itu dibahas di lesson Narrowing & Type Assertion.',
          `\`\`\`typescript
function gagal(pesan: string): never {
  throw new Error(pesan)   // tidak pernah return secara normal
}
\`\`\``,
          '## Literal type',
          'Selain tipe umum seperti `string` dan `number`, kita bisa menulis nilai persisnya sebagai tipe — disebut literal type. Variabel bertipe `"kiri"` hanya boleh bernilai `"kiri"`. Literal type baru berguna kalau digabung dengan tanda `|` (artinya "atau", dibahas di lesson Union Type): variabel hanya boleh salah satu dari beberapa nilai tertentu, jadi salah ketik langsung ketahuan.',
          `\`\`\`typescript
let arah: "kiri" | "kanan" = "kiri"
arah = "kanan"
// arah = "atas"   // error: Type '"atas"' is not assignable to type '"kiri" | "kanan"'.
\`\`\``,
          'TypeScript sendiri memakai literal type saat meng-infer: `const salam = "halo"` bertipe literal `"halo"` karena `const` tidak bisa diubah, sedangkan `let salam = "halo"` bertipe `string` karena nilainya boleh diganti.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `let bebas: any = "teks"
console.log("any, tipe awal:", typeof bebas)
bebas = 42
console.log("any, setelah diubah:", typeof bebas)
try {
  bebas.toUpperCase()   // lolos kompilasi karena any, tapi gagal saat dijalankan
} catch (e) {
  console.log("Runtime error dari any:", e.message)
}

function deskripsi(nilai: unknown): string {
  if (typeof nilai === "string") {
    return "string dengan panjang " + nilai.length
  }
  if (typeof nilai === "number") {
    return "number dengan nilai " + nilai.toFixed(1)
  }
  return "tipe lain"
}

console.log(deskripsi("halo"))
console.log(deskripsi(3))
console.log(deskripsi(true))

function gagal(pesan: string): never {
  throw new Error(pesan)
}

try {
  gagal("fungsi never selalu melempar error")
} catch (e) {
  console.log("Ditangkap:", e.message)
}

let arah: "kiri" | "kanan" = "kiri"
console.log("Arah awal:", arah)
arah = "kanan"
console.log("Arah sekarang:", arah)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama any dan unknown?', [
            ['unknown harus dipersempit dulu sebelum dipakai, sedangkan any bisa langsung dipakai tanpa dicek', true],
            ['any hanya menerima number dan string, sedangkan unknown menerima semua tipe', false],
            ['unknown berarti nilai kosong seperti null, sedangkan any berarti nilai apa saja', false],
            ['Tidak ada beda, keduanya sama-sama dicek ketat oleh compiler sebelum dipakai', false],
          ]),
          q('Fungsi function gagal(pesan: string): never { throw new Error(pesan) } bertipe return never. Apa maksudnya?', [
            ['Fungsi itu tidak pernah selesai secara normal: selalu melempar error atau berputar selamanya', true],
            ['Fungsi itu selesai dengan normal tapi tidak mengembalikan nilai apa pun, sama seperti void', false],
            ['Fungsi itu tidak boleh dipanggil sama sekali di bagian mana pun dari program', false],
            ['Fungsi itu selalu mengembalikan nilai null ketika dipanggil', false],
          ]),
          q('Pada let arah: "kiri" | "kanan" = "kiri", apa yang terjadi kalau kita menulis arah = "atas"?', [
            ['tsc melaporkan error karena "atas" bukan salah satu nilai literal yang diizinkan', true],
            ['Boleh, karena "atas" tetap bertipe string', false],
            ['Boleh, TypeScript otomatis menambahkan "atas" ke daftar nilai yang diizinkan', false],
            ['Nilainya otomatis kembali menjadi "kiri" karena "atas" tidak dikenal', false],
          ]),
        ],
      },
      {
        title: 'Array & Tuple Type',
        slug: 'tsfz-array-tuple-type',
        content: [
          'Tipe array ditulis dengan menambahkan `[]` setelah tipe elemennya, contoh: `let angka: number[] = [1, 2, 3]` berarti array yang HANYA boleh berisi angka. Alternatif penulisan yang setara: `Array<number>`.',
          'Tuple adalah array dengan panjang tetap dan tipe tiap elemen yang sudah ditentukan urutannya, ditulis dengan `[]` tapi berisi daftar tipe, contoh: `let koordinat: [number, number] = [10, 20]` — elemen pertama dan kedua harus `number`.',
          'Tuple berguna ketika urutan dan jumlah elemen punya makna spesifik, misal `[string, number]` untuk pasangan nama dan umur — beda dengan array biasa yang elemennya harus seragam tipenya tapi jumlahnya bebas. Nilai yang diberikan harus cocok persis dengan urutan dan jumlah tipe di tuple.',
          `\`\`\`typescript
let angka: number[] = [1, 2, 3]
let buah: Array<string> = ["apel", "jeruk"]   // penulisan alternatif

let siswa: [string, number] = ["Budi", 20]
// siswa = [20, "Budi"]         // error: urutan tipe terbalik
// siswa = ["Budi", 20, "TI"]   // error: jumlah elemen kelebihan
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `let angka: number[] = [1, 2, 3, 4, 5]
let namaBuah: string[] = ["apel", "jeruk", "mangga"]

console.log("Array angka:", angka)
console.log("Array buah:", namaBuah)

let siswa: [string, number] = ["Budi", 20]
console.log("Tuple siswa - nama:", siswa[0], "umur:", siswa[1])
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa arti let angka: number[] di TypeScript?', [
            ['Array yang hanya boleh berisi elemen bertipe number', true],
            ['Array dengan tepat satu elemen bertipe number', false],
            ['Array yang boleh berisi number dan string campuran', false],
          ]),
          q('Apa yang membedakan tuple dari array biasa?', [
            ['Tuple menentukan jumlah elemen dan tipe tiap posisinya; array biasa bertipe elemen seragam', true],
            ['Tuple hanya boleh berisi string, sedangkan array boleh berisi elemen bertipe apa pun', false],
            ['Tuple ditulis dengan Array<...>, sedangkan array biasa ditulis dengan tanda [...]', false],
            ['Tuple otomatis mengurutkan elemennya berdasarkan tipe', false],
          ]),
          q('Dari nilai berikut, mana yang valid untuk let siswa: [string, number]?', [
            ['["Budi", 20]', true],
            ['[20, "Budi"]', false],
            ['["Budi", 20, "TI"]', false],
            ['["Budi"]', false],
          ]),
        ],
      },
      {
        title: 'Union Type',
        slug: 'tsfz-union-type',
        content: [
          'Union type memungkinkan sebuah variabel menerima lebih dari satu tipe data, ditulis dengan tanda `|` (pipe) di antara tipe-tipenya, contoh: `let id: string | number` — variabel `id` boleh diisi `string` ATAU `number`.',
          'Union type berguna untuk kasus yang di JavaScript murni sering ditangani dengan longgar, misal ID yang kadang berupa angka dari database, kadang berupa string UUID — TypeScript tetap memastikan hanya dua tipe itu yang diizinkan, bukan tipe lain seperti `boolean`.',
          'Saat memakai variabel bertipe union, TypeScript sering meminta kita melakukan "narrowing" (penyempitan tipe) dengan `typeof` sebelum memanggil method yang spesifik untuk satu tipe saja, supaya compiler yakin operasi itu aman untuk kedua kemungkinan tipe. Teknik narrowing lain (`instanceof`, `in`, discriminated union) dibahas di lesson Narrowing & Type Assertion.',
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
        title: 'null, undefined & strictNullChecks',
        slug: 'tsfz-null-undefined-strict',
        content: [
          'Di JavaScript, `null` dan `undefined` sama-sama berarti "tidak ada nilai": `undefined` muncul otomatis (variabel belum diisi, argumen tidak diberikan, property tidak ada), sedangkan `null` diisi sengaja oleh programmer. Nasib keduanya di TypeScript bergantung pada opsi compiler `strictNullChecks`, bagian dari `strict`.',
          '## strictNullChecks',
          'Kalau `strictNullChecks` mati (default `tsc` tanpa konfigurasi), `null` dan `undefined` boleh diisi ke tipe apa pun — dan itu sumber klasik error seperti `Cannot read property ... of null` saat program berjalan. Kalau aktif (otomatis lewat `"strict": true`), `null` dan `undefined` menjadi tipe tersendiri: variabel bertipe `string` tidak boleh diisi `null`, kecuali tipenya ditulis sebagai union `string | null`.',
          'Contoh berikut mengasumsikan `strictNullChecks` aktif. Sandbox kita tidak mengaktifkannya (tanpa `--strict`), jadi error di komentar tidak akan muncul di sandbox; kamu hanya akan melihatnya di proyek yang memakai `"strict": true`.',
          `\`\`\`typescript
let nama: string = "Budi"
// nama = null   // error (strictNullChecks aktif): Type 'null' is not assignable to type 'string'.

let namaBisaKosong: string | null = "Budi"
namaBisaKosong = null   // aman: null memang bagian dari tipenya
\`\`\``,
          '## Menangani nilai yang bisa null',
          'Dengan tipe seperti `string | null`, TypeScript memaksa kita mengecek `null` dulu sebelum memakai nilainya; pengecekan itu sekaligus mempersempit (narrow) tipenya. Dua operator membantu menangani nilai kosong: `??` (nullish coalescing) memberi nilai cadangan hanya kalau sisi kirinya `null` atau `undefined`, dan `?.` (optional chaining) berhenti dan menghasilkan `undefined` kalau nilainya `null` atau `undefined`. Keduanya didukung TypeScript sejak versi 3.7; compiler menerjemahkannya ke JavaScript lama, jadi tetap jalan di sandbox (Node.js 12). Bedakan `??` dari `||`: `||` menganggap `0` dan string kosong juga "kosong", sedangkan `??` tidak.',
          `\`\`\`typescript
function sapa(nama: string | null): string {
  if (nama === null) {
    return "Halo, tamu"
  }
  return "Halo, " + nama.toUpperCase()   // di sini nama sudah dipersempit jadi string
}

const stok: number | null = 0
console.log(stok || 10)   // 10: || menganggap 0 sebagai "kosong"
console.log(stok ?? 10)   // 0: ?? hanya mengganti null atau undefined
\`\`\``,
          'Ada juga `!` (non-null assertion), yang menegaskan bahwa sebuah nilai pasti bukan `null` atau `undefined`. Itu salah satu bentuk type assertion, dibahas di lesson Narrowing & Type Assertion setelah ini.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function sapa(nama: string | null): string {
  if (nama === null) {
    return "Halo, tamu"
  }
  return "Halo, " + nama.toUpperCase()
}

console.log(sapa("Budi"))
console.log(sapa(null))

// ?. berhenti dan menghasilkan undefined kalau nilainya null atau undefined
function hurufBesar(teks: string | null | undefined): string | undefined {
  return teks?.toUpperCase()
}

console.log(hurufBesar("halo"))
console.log(hurufBesar(null))
console.log(hurufBesar(undefined))

// || menganggap 0 sebagai "kosong", ?? hanya mengganti null atau undefined
const stok: number | null = 0
console.log("stok || 10 =", stok || 10)
console.log("stok ?? 10 =", stok ?? 10)

const kosong: string | null = null
console.log(kosong ?? "(tanpa nama)")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Dengan strictNullChecks aktif, apa yang terjadi pada let nama: string = null?', [
            ['tsc melaporkan error karena null bukan bagian dari tipe string', true],
            ['Boleh, karena null boleh diisi ke variabel bertipe apa pun', false],
            ['Boleh, karena null otomatis diubah menjadi string kosong oleh compiler', false],
            ['Boleh, tapi baru bermasalah saat variabel nama dipakai di runtime', false],
          ]),
          q('Bagaimana menulis variabel nama yang boleh berisi string atau null di proyek dengan strictNullChecks?', [
            ['let nama: string | null', true],
            ['let nama: string?', false],
            ['let nama: string || null', false],
            ['let nama = string | null', false],
          ]),
          q('Berapa hasil 0 ?? 10 dan 0 || 10?', [
            ['0 ?? 10 menghasilkan 0, sedangkan 0 || 10 menghasilkan 10', true],
            ['Keduanya menghasilkan 10', false],
            ['Keduanya menghasilkan 0', false],
            ['0 ?? 10 menghasilkan 10, sedangkan 0 || 10 menghasilkan 0', false],
          ]),
        ],
      },
      {
        title: 'Narrowing & Type Assertion',
        slug: 'tsfz-narrowing-type-assertion',
        content: [
          'Narrowing (penyempitan tipe) artinya TypeScript mempersempit tipe sebuah variabel dari tipe yang luas (misal union) menjadi tipe yang lebih spesifik, berdasarkan pengecekan di dalam kode. Kita sudah memakai `typeof` dan perbandingan `=== null`; di sini ada tiga teknik lain, lalu type assertion untuk saat kita tahu lebih baik daripada compiler.',
          '## instanceof',
          '`instanceof` mengecek apakah sebuah object dibuat dari class tertentu. Di dalam blok `if`-nya, TypeScript mempersempit tipe ke class itu.',
          `\`\`\`typescript
function infoWaktu(nilai: Date | string): string {
  if (nilai instanceof Date) {
    return "Tahun " + nilai.getFullYear()   // di sini nilai bertipe Date
  }
  return nilai.toUpperCase()                 // di sini nilai bertipe string
}
\`\`\``,
          '## Operator in',
          '`"properti" in objek` mengecek apakah sebuah property ada di object. TypeScript memakainya untuk memilih anggota union yang punya property itu. (Bentuk object ditulis `{ properti: tipe }`; dibahas lengkap di modul berikutnya.)',
          `\`\`\`typescript
function jenisHewan(hewan: { sayap: number } | { sirip: number }): string {
  if ("sayap" in hewan) {
    return "bersayap: " + hewan.sayap
  }
  return "bersirip: " + hewan.sirip
}
\`\`\``,
          '## Discriminated union',
          'Pola yang sangat umum: setiap anggota union punya property penanda (misal `jenis`) dengan nilai literal yang berbeda. Memeriksa property penanda itu mempersempit seluruh object ke anggota union yang cocok. (`type Bentuk = ...` di bawah memberi nama pada sebuah tipe; dibahas di lesson Type Alias.)',
          `\`\`\`typescript
type Bentuk =
  | { jenis: "lingkaran"; radius: number }
  | { jenis: "persegi"; sisi: number }

function luas(bentuk: Bentuk): number {
  if (bentuk.jenis === "lingkaran") {
    return Math.PI * bentuk.radius * bentuk.radius
  }
  return bentuk.sisi * bentuk.sisi
}
\`\`\``,
          'Kalau semua kemungkinan sudah dicek, sisa tipenya adalah `never`. Trik exhaustive checking: di cabang `default`, oper nilainya ke fungsi yang parameternya bertipe `never`. Kalau suatu hari ada anggota union baru yang belum ditangani, compiler langsung melaporkan error. Contoh ini melanjutkan `Bentuk` di atas.',
          `\`\`\`typescript
function tidakMungkin(nilai: never): never {
  throw new Error("Kasus tidak tertangani: " + JSON.stringify(nilai))
}

function namaBentuk(bentuk: Bentuk): string {
  switch (bentuk.jenis) {
    case "lingkaran":
      return "lingkaran dengan radius " + bentuk.radius
    case "persegi":
      return "persegi dengan sisi " + bentuk.sisi
    default:
      return tidakMungkin(bentuk)   // error kalau ada jenis baru yang belum ditangani
  }
}
\`\`\``,
          '## Type assertion',
          'Kadang kita tahu tipe sebuah nilai lebih baik daripada compiler. Type assertion, ditulis `nilai as Tipe`, menyuruh compiler memperlakukan nilai itu sebagai `Tipe`. Penting: assertion hanya ada saat kompilasi dan dihapus dari JavaScript hasil kompilasi, jadi tidak ada pengecekan atau konversi saat program berjalan. Kalau tebakan kita salah, kode tetap lolos kompilasi dan baru error saat dijalankan. Karena itu, narrowing yang benar-benar mengecek lebih aman daripada assertion. TypeScript juga hanya mengizinkan assertion ke tipe yang lebih spesifik atau lebih umum: `"teks" as number` ditolak karena kedua tipe itu tidak berhubungan.',
          `\`\`\`typescript
const nilai: unknown = 42
const teks = nilai as string      // lolos kompilasi, padahal isinya number
console.log(teks.toUpperCase())   // TypeError saat dijalankan: assertion tidak mengubah nilai
\`\`\``,
          'Ada juga non-null assertion `nilai!`, yang menegaskan bahwa `nilai` bukan `null` atau `undefined`. Risikonya sama dengan `as`: tanda `!` hanya menenangkan compiler dan dihapus saat kompilasi, jadi program tetap error kalau nilainya ternyata `null`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function infoWaktu(nilai: Date | string): string {
  if (nilai instanceof Date) {
    return "Tahun " + nilai.getFullYear()
  }
  return nilai.toUpperCase()
}

function jenisHewan(hewan: { sayap: number } | { sirip: number }): string {
  if ("sayap" in hewan) {
    return "bersayap: " + hewan.sayap
  }
  return "bersirip: " + hewan.sirip
}

type Bentuk =
  | { jenis: "lingkaran"; radius: number }
  | { jenis: "persegi"; sisi: number }

function tidakMungkin(nilai: never): never {
  throw new Error("Kasus tidak tertangani: " + JSON.stringify(nilai))
}

function luas(bentuk: Bentuk): number {
  switch (bentuk.jenis) {
    case "lingkaran":
      return Math.PI * bentuk.radius * bentuk.radius
    case "persegi":
      return bentuk.sisi * bentuk.sisi
    default:
      return tidakMungkin(bentuk)
  }
}

console.log(infoWaktu(new Date(2024, 0, 15)))
console.log(infoWaktu("halo"))
console.log(jenisHewan({ sayap: 2 }))
console.log(jenisHewan({ sirip: 4 }))
console.log("Luas lingkaran:", luas({ jenis: "lingkaran", radius: 1 }).toFixed(2))
console.log("Luas persegi:", luas({ jenis: "persegi", sisi: 4 }))

// Type assertion tidak mengubah nilai: salah tebak baru ketahuan saat runtime
const nilai: unknown = 42
const teks = nilai as string
try {
  console.log(teks.toUpperCase())
} catch (e) {
  console.log("Runtime error:", e.message)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dilakukan ekspresi "sayap" in hewan pada hewan bertipe union?', [
            ['Mengecek apakah object punya property sayap, lalu mempersempit tipenya', true],
            ['Mengecek apakah nilai property sayap lebih besar dari nol (truthy)', false],
            ['Mengulang semua property hewan satu per satu seperti pada for...in', false],
            ['Mengubah tipe hewan menjadi tipe yang punya property sayap tanpa pengecekan', false],
          ]),
          q('Apa yang terjadi saat program dijalankan kalau type assertion nilai as string ternyata salah (nilainya number)?', [
            ['Tidak ada pengecekan: assertion dihapus saat kompilasi, error baru muncul saat nilainya dipakai', true],
            ['Program langsung melempar error tepat di baris yang berisi assertion itu, sebelum baris lain berjalan', false],
            ['Nilainya otomatis dikonversi menjadi string saat assertion dijalankan', false],
            ['tsc menolak mengompilasi kode itu sejak awal karena tipenya tidak cocok', false],
          ]),
          q('Apa gunanya cabang default berisi tidakMungkin(bentuk) pada switch atas discriminated union?', [
            ['Compiler melaporkan error kalau ada anggota union baru yang belum ditangani di switch', true],
            ['Membuat switch berjalan lebih cepat karena tipe sisanya sudah diketahui', false],
            ['Mengubah semua kasus yang belum ditangani menjadi nilai null secara otomatis', false],
            ['Mencegah switch dipakai pada tipe union supaya kode tetap sederhana', false],
          ]),
        ],
      },
      {
        title: 'Type Inference',
        slug: 'tsfz-type-inference',
        content: [
          'Type inference adalah kemampuan TypeScript menebak (infer) tipe data sebuah variabel secara otomatis dari nilai yang diberikan, tanpa kita perlu menulis anotasi tipe secara eksplisit. Contoh: `let nama = "Budi"` — TypeScript otomatis menganggap `nama` bertipe `string`.',
          'Meski tipe tidak dituliskan eksplisit, TypeScript tetap menegakkan aturan tipe itu setelahnya — mencoba `nama = 100` pada variabel di atas tetap akan ditolak compiler, karena `nama` sudah "terkunci" sebagai `string` sejak inisialisasi pertama.',
          '## Kapan menulis tipe, kapan membiarkan inference',
          'Praktik umum: biarkan inference bekerja untuk variabel lokal yang nilai awalnya sudah jelas, dan untuk return type fungsi — TypeScript menyimpulkan return type dari pernyataan `return` di dalam fungsi, jadi biasanya tidak perlu ditulis. Sebaliknya, parameter fungsi sebaiknya selalu diberi tipe, karena TypeScript tidak bisa menebaknya dari isi fungsi (tanpa anotasi, parameter jadi bertipe `any`, tipe yang mematikan pengecekan, dibahas di lesson any/unknown). Return type boleh tetap ditulis kalau kamu ingin mendokumentasikan kontrak fungsi.',
          'Inference juga tidak membantu kalau variabel dideklarasikan tanpa nilai awal: `let nilai` bertipe `any`. Kalau nilainya baru diisi nanti, tulis tipenya: `let nilai: number`.',
          `\`\`\`typescript
function kali(a: number, b: number) {   // return type di-infer: number
  return a * b
}

const hasil = kali(3, 4)                // hasil: number
// hasil = "dua belas"                  // error: tipe hasil sudah terkunci sebagai number
\`\`\``,
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

// Return type fungsi juga di-infer dari isi fungsi (di sini: number),
// sedangkan parameternya tetap kita beri tipe.
function kali(a: number, b: number) {
  return a * b
}

const hasil = kali(3, 4)
console.log("3 x 4 =", hasil)
console.log("Tipe hasil:", typeof hasil)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dilakukan TypeScript pada let nama = "Budi" tanpa annotation?', [
            ['Menyimpulkan nama bertipe string dari nilai awalnya', true],
            ['Memberi nama tipe any karena tidak ada annotation', false],
            ['Menolak kode itu karena annotation tipe wajib ditulis', false],
            ['Membiarkan nama tanpa tipe sampai kode dijalankan', false],
          ]),
          q('Setelah let kota = "Jakarta", apa yang terjadi pada kota = 100?', [
            ['tsc melaporkan error, karena kota sudah terkunci sebagai string', true],
            ['Boleh, tipe kota ikut berubah menjadi number', false],
            ['Boleh, karena tipe hasil inference bisa diganti kapan saja', false],
            ['Boleh, asalkan kota dideklarasikan dengan let', false],
          ]),
          q('Mana yang paling tepat untuk function kali(a: number, b: number) { return a * b }?', [
            ['Parameter diberi tipe; return type boleh dibiarkan karena di-infer sebagai number', true],
            ['Return type wajib ditulis, kalau tidak compiler menolak fungsinya', false],
            ['Parameter tidak perlu diberi tipe karena TypeScript menebaknya dari isi fungsi', false],
            ['Tidak perlu menulis tipe apa pun, karena TypeScript selalu bisa menebak semuanya', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Fungsi, Object & Type Alias',
    lessons: [
      {
        title: 'Fungsi dengan Type',
        slug: 'tsfz-fungsi-dengan-type',
        content: [
          'Fungsi di TypeScript bisa diberi tipe pada tiap parameter dan tipe return value-nya, ditulis setelah tanda kurung parameter, contoh: `function tambah(a: number, b: number): number { return a + b }`. Tipe parameter sebaiknya selalu ditulis, karena TypeScript tidak bisa menebaknya dari isi fungsi.',
          'Tipe return value boleh tidak ditulis: TypeScript akan meng-inference-nya otomatis dari pernyataan `return` di dalam fungsi, jadi biasanya tidak wajib. Banyak tim tetap menuliskannya secara eksplisit untuk fungsi yang dipakai di banyak tempat, sebagai dokumentasi kontrak fungsi dan supaya perubahan isi fungsi tidak mengubah tipe return secara tak sengaja — tapi itu pilihan gaya, bukan aturan.',
          'Fungsi yang tidak mengembalikan nilai apa pun (hanya melakukan aksi, misal `console.log`) diberi tipe return `void`, menandakan pemanggil fungsi tidak seharusnya memakai hasil return-nya.',
          `\`\`\`typescript
function tambah(a: number, b: number): number {   // return type ditulis eksplisit
  return a + b
}

function kali(a: number, b: number) {              // return type di-infer: number
  return a * b
}

function sapa(nama: string): void {                // tidak mengembalikan nilai
  console.log("Halo,", nama)
}
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `function tambah(a: number, b: number): number {
  return a + b
}

function kali(a: number, b: number) {
  return a * b
}

function sapa(nama: string): void {
  console.log("Halo,", nama)
}

const hasil: number = tambah(5, 3)
console.log("Hasil tambah:", hasil)
console.log("Hasil kali (return type di-infer):", kali(5, 3))
sapa("Siswa BarisORG")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe return apa yang dipakai untuk fungsi yang tidak mengembalikan nilai?', [
            ['void', true],
            ['null', false],
            ['undefined', false],
            ['never', false],
          ]),
          q('Di mana tipe return value fungsi dituliskan?', [
            ['Setelah tanda kurung parameter, sebelum kurung kurawal isi fungsi', true],
            ['Sebelum kata kunci function', false],
            ['Di dalam kurung parameter bersama parameter lain', false],
            ['TypeScript tidak mengizinkan tipe return value', false],
          ]),
          q('Kenapa sebagian tim tetap menulis tipe return value walau bisa di-infer?', [
            ['Sebagai dokumentasi kontrak fungsi dan pengaman supaya tipe return tidak berubah tanpa sengaja', true],
            ['Karena TypeScript sama sekali tidak bisa meng-infer return type dari isi fungsi', false],
            ['Supaya fungsi berjalan lebih cepat saat dijalankan karena tipenya sudah pasti', false],
            ['Karena tanpa tipe return, fungsi tidak bisa dipanggil dari bagian kode lain', false],
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
          `\`\`\`typescript
function sapa(nama: string, gelar?: string): void { }          // gelar opsional
function beriSalam(nama: string, salam = "Selamat pagi"): void { }   // tipe salam di-infer: string

// function salah(gelar?: string, nama: string): void { }
// error: A required parameter cannot follow an optional parameter.
\`\`\``,
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
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana menandai parameter fungsi sebagai opsional?', [
            ['Tambahkan ? setelah nama parameter, contoh gelar?: string', true],
            ['Tambahkan ! setelah nama parameter, contoh gelar!: string', false],
            ['Tulis kata kunci optional sebelum nama parameter', false],
            ['Tulis tipenya dengan tanda tanya, contoh gelar: string?', false],
          ]),
          q('Apa yang terjadi pada function sapa(nama: string, gelar: string = "Bapak/Ibu") kalau dipanggil sapa("Budi")?', [
            ['gelar otomatis bernilai "Bapak/Ibu"', true],
            ['tsc melaporkan error karena argumen gelar kurang', false],
            ['gelar bernilai undefined karena tidak diberikan', false],
            ['gelar bernilai string kosong', false],
          ]),
          q('Di mana parameter opsional diletakkan dalam daftar parameter fungsi?', [
            ['Setelah semua parameter wajib', true],
            ['Sebelum semua parameter wajib', false],
            ['Di posisi mana pun, asalkan diberi tanda ?', false],
          ]),
        ],
      },
      {
        title: 'Interface',
        slug: 'tsfz-interface',
        content: [
          'Interface mendefinisikan "bentuk" (shape) yang harus dipenuhi sebuah object — daftar properti apa saja yang wajib ada dan tipe datanya masing-masing. Ditulis dengan kata kunci `interface`, contoh: `interface Siswa { nama: string; umur: number }`.',
          'Object yang dideklarasikan dengan tipe sebuah interface akan diperiksa compiler agar strukturnya cocok persis — kalau ada properti wajib yang hilang, atau tipe salah satu properti tidak sesuai, compiler akan melaporkan error.',
          'Properti interface bisa dibuat opsional dengan `?`, sama seperti parameter fungsi, contoh: `interface Siswa { nama: string; nilai?: number }` — properti `nilai` boleh tidak ada.',
          'Interface hanya ada saat kompilasi: di JavaScript hasil kompilasi, interface hilang sepenuhnya (type erasure) dan tidak menambah apa pun ke kode yang dijalankan.',
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
            ['Membuat object baru dari cetak biru, lengkap dengan method-nya, seperti class', false],
            ['Menyimpan nilai default untuk tiap properti object', false],
            ['Memeriksa tipe object saat program berjalan (runtime)', false],
          ]),
          q('Bagaimana cara membuat properti interface menjadi opsional?', [
            ['Tambahkan ? setelah nama properti', true],
            ['Tambahkan ! setelah nama properti', false],
            ['Tambahkan kata optional sebelum properti', false],
            ['Semua properti interface otomatis opsional', false],
          ]),
          q('Apa yang terjadi kalau object tidak memenuhi struktur interface-nya?', [
            ['Compiler tsc melaporkan error', true],
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
          'Object type literal cocok dipakai untuk tipe yang hanya dipakai sekali di satu tempat dan tidak perlu dipakai ulang di bagian lain kode — kalau bentuknya perlu dipakai berulang kali di banyak tempat, `interface` (atau `type`, yang dibahas di lesson Type Alias setelah ini) lebih rapi.',
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
// ?? memakai nilai di kanan hanya kalau nilai di kiri null atau undefined
console.log("Stok produk:", produk.stok ?? "tidak diketahui")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kapan object type literal lebih cocok dipakai daripada interface?', [
            ['Saat bentuk object hanya dipakai sekali di satu tempat', true],
            ['Saat bentuk object perlu dipakai ulang di banyak tempat', false],
            ['Saat butuh properti opsional, karena interface tidak mendukungnya', false],
            ['Saat butuh pemeriksaan yang lebih ketat daripada interface', false],
          ]),
          q('Bagaimana menulis tipe object dengan properti nama (string) dan umur (number) langsung di annotation?', [
            ['let siswa: { nama: string; umur: number }', true],
            ['let siswa = { nama: string, umur: number }', false],
            ['let siswa: object { nama, umur }', false],
            ['let siswa: (nama: string, umur: number)', false],
          ]),
          q('Apa yang terjadi kalau properti wajib harga tidak diisi pada object bertipe { nama: string; harga: number }?', [
            ['tsc melaporkan error karena properti wajib harga hilang', true],
            ['harga otomatis bernilai 0', false],
            ['Tidak ada error, harga bernilai undefined', false],
            ['Error baru muncul saat harga dipakai di runtime', false],
          ]),
        ],
      },
      {
        title: 'Type Alias',
        slug: 'tsfz-type-alias',
        content: [
          'Type alias dibuat dengan kata kunci `type`, memberi nama baru untuk sebuah tipe (termasuk union type, object type literal, atau tipe primitif) — setelah itu nama tersebut bisa dipakai sebagai annotation tipe di mana saja.',
          `\`\`\`typescript
type ID = string | number
type Arah = "kiri" | "kanan"   // alias untuk union dari literal type
type Siswa = { id: ID; nama: string; umur: number }

function cetak(siswa: Siswa): void {
  console.log(siswa.id, siswa.nama)
}
\`\`\``,
          'Untuk mendeskripsikan bentuk object, `type` dan `interface` terlihat sangat mirip (`type Siswa = { nama: string; umur: number }` vs `interface Siswa { nama: string; umur: number }`) — keduanya bisa dipakai bergantian untuk kasus sederhana.',
          '## Perbedaan type dan interface',
          'Perbedaan pentingnya: `type` bisa dipakai untuk union type dan alias tipe primitif (hal yang TIDAK bisa dilakukan `interface`), sedangkan `interface` punya keunggulan bisa "digabung" (declaration merging) kalau dideklarasikan dua kali dengan nama sama. `type` yang dideklarasikan dua kali justru menghasilkan error. Untuk bentuk object biasa, konvensi tim sering menentukan mana yang dipakai.',
          `\`\`\`typescript
interface Guru { nama: string }
interface Guru { mapel: string }   // digabung: Guru sekarang punya nama dan mapel

// type Kelas = { nama: string }
// type Kelas = { ruang: string }  // error: Duplicate identifier 'Kelas'.
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `type ID = string | number

type Siswa = {
  id: ID
  nama: string
}

interface Guru {
  nama: string
}

interface Guru {
  mapel: string
}

function tampilkanId(id: ID): void {
  console.log("ID:", id)
}

const siswa: Siswa = { id: "S-001", nama: "Budi" }
const guru: Guru = { nama: "Bu Rina", mapel: "Matematika" }

tampilkanId(siswa.id)
tampilkanId(42)
console.log(siswa)
console.log(guru)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk membuat type alias?', [
            ['type', true],
            ['alias', false],
            ['typedef', false],
            ['using', false],
          ]),
          q('Kemampuan apa yang dimiliki type alias tapi TIDAK dimiliki interface?', [
            ['Memberi nama pada union type atau tipe primitif', true],
            ['Mendefinisikan bentuk object dengan properti opsional', false],
            ['Dipakai sebagai annotation tipe parameter fungsi', false],
            ['Digabung otomatis ketika dideklarasikan dua kali dengan nama sama', false],
          ]),
          q('Contoh manakah yang merupakan union type alias yang valid?', [
            ['type ID = string | number', true],
            ['interface ID = string | number', false],
            ['type ID: string | number', false],
            ['union ID = string | number', false],
          ]),
        ],
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
          'Class di TypeScript ditulis mirip class JavaScript ES6, dengan satu perbedaan penting: property harus dideklarasikan di badan class sebelum dipakai lewat `this` di constructor atau method. Tipe property boleh ditulis eksplisit (`nama: string`) atau di-infer dari nilai awalnya (`poin = 0` otomatis bertipe `number`). Tanpa deklarasi, `this.nama = ...` menghasilkan error karena property itu tidak dikenal.',
          `\`\`\`typescript
class Siswa {
  nama: string        // tipe ditulis eksplisit
  umur: number
  poin = 0            // tipe di-infer dari nilai awal: number

  constructor(nama: string, umur: number) {
    this.nama = nama
    this.umur = umur
  }
}
\`\`\``,
          'Constructor (`constructor(...)`) tetap dipakai untuk mengisi nilai awal property saat object baru dibuat lewat `new`. Parameter constructor juga diberi tipe seperti parameter fungsi biasa. Dengan opsi `strictPropertyInitialization` (bagian dari `strict`), property tanpa nilai awal wajib diisi di constructor, kalau tidak compiler melaporkan error.',
          '## Parameter property',
          'TypeScript punya singkatan: kalau parameter constructor diberi modifier seperti `public` (artinya bisa diakses dari luar class), parameter itu otomatis menjadi property class dengan nama dan nilai yang sama — kita tidak perlu mendeklarasikan property dan menulis `this.x = x` lagi. Bentuk ini dipakai lagi di lesson Inheritance nanti.',
          `\`\`\`typescript
class Produk {
  constructor(public nama: string, public harga: number) {}
}

const p = new Produk("Buku", 75000)
console.log(p.nama, p.harga)   // Buku 75000
\`\`\``,
          'Method dalam class juga bisa diberi tipe parameter dan return value-nya, persis seperti fungsi biasa yang sudah kita pelajari — bedanya method dipanggil lewat `object.method()`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Siswa {
  nama: string
  umur: number
  poin = 0

  constructor(nama: string, umur: number) {
    this.nama = nama
    this.umur = umur
  }

  perkenalan(): string {
    return "Halo, saya " + this.nama + ", umur " + this.umur + " tahun"
  }
}

class Produk {
  constructor(public nama: string, public harga: number) {}
}

const siswa1 = new Siswa("Budi", 20)
console.log(siswa1.perkenalan())
console.log("Poin awal:", siswa1.poin)

const buku = new Produk("Buku TypeScript", 75000)
console.log(buku.nama, "- Rp", buku.harga)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang benar tentang property class di TypeScript?', [
            ['Harus dideklarasikan di badan class; tipenya boleh ditulis eksplisit atau di-infer dari nilai awal', true],
            ['Tidak perlu dideklarasikan, cukup diisi lewat this di constructor seperti di JavaScript', false],
            ['Harus ditulis dengan tipe eksplisit, karena tipe property tidak pernah bisa di-infer', false],
            ['Harus diinisialisasi null di badan class sebelum diisi di constructor', false],
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
          q('Apa efek constructor(public nama: string) {} pada sebuah class?', [
            ['Otomatis membuat property nama di class sekaligus mengisinya dari argumen', true],
            ['Hanya memberi tipe pada parameter, property harus dibuat terpisah di badan class', false],
            ['Membuat nama bisa dipakai tanpa membuat object, seperti anggota static', false],
            ['Menimbulkan error karena parameter constructor tidak boleh punya modifier', false],
          ]),
        ],
      },
      {
        title: 'Access Modifier',
        slug: 'tsfz-access-modifier',
        content: [
          'Access modifier menentukan dari mana sebuah property atau method class bisa diakses. `public` (default kalau tidak ditulis) bisa diakses dari mana saja, termasuk dari luar class.',
          '`private` hanya bisa diakses dari dalam class itu sendiri — mencoba mengakses property `private` dari luar class akan dilaporkan sebagai error oleh compiler.',
          '`protected` mirip `private`, tapi juga bisa diakses dari class turunan (subclass), yaitu class yang mewarisi class tersebut lewat `extends` (dibahas lengkap di lesson berikutnya).',
          `\`\`\`typescript
class Akun {
  public nama = "Budi"
  private saldo = 100000
  protected jenis = "reguler"
}

const akun = new Akun()
console.log(akun.nama)   // boleh: public
// console.log(akun.saldo)   // error: Property 'saldo' is private and only accessible within class 'Akun'.
// console.log(akun.jenis)   // error: Property 'jenis' is protected and only accessible within class 'Akun' and its subclasses.
\`\`\``,
          '## private hanya dicek saat kompilasi',
          'Modifier `private` dan `protected` murni pengecekan compiler. Setelah dikompilasi, modifier itu hilang (type erasure) dan nilainya tetap ada di object JavaScript biasa, sehingga kode di luar TypeScript tetap bisa mengaksesnya. Untuk privasi yang sungguhan berlaku di runtime, JavaScript modern punya private field `#nama` (butuh TypeScript 3.8+, tidak jalan di sandbox).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Akun {
  public nama: string
  private saldo: number
  protected jenis: string = "reguler"

  constructor(nama: string, saldoAwal: number) {
    this.nama = nama
    this.saldo = saldoAwal
  }

  public tampilkanSaldo(): void {
    console.log(this.nama + " (" + this.jenis + ") memiliki saldo Rp" + this.saldo)
  }

  public setor(jumlah: number): void {
    this.saldo += jumlah
  }
}

// extends = mewarisi class Akun (dibahas lengkap di lesson berikutnya)
class AkunPremium extends Akun {
  constructor(nama: string, saldoAwal: number) {
    super(nama, saldoAwal)   // menjalankan constructor Akun
    this.jenis = "premium"   // boleh: protected bisa diakses dari subclass
  }
}

const akun1 = new Akun("Budi", 100000)
akun1.tampilkanSaldo()
akun1.setor(50000)
akun1.tampilkanSaldo()

const akun2 = new AkunPremium("Siti", 500000)
akun2.tampilkanSaldo()

console.log("Nama (public):", akun1.nama)
// console.log(akun1.saldo)   // hapus tanda // untuk melihat error compile: saldo adalah private
// console.log(akun1.jenis)   // hapus tanda // untuk melihat error compile: jenis adalah protected
`,
        hasQuiz: true,
        quizQuestions: [
          q('Property bermodifier private bisa diakses dari mana?', [
            ['Hanya dari dalam class itu sendiri', true],
            ['Dari class itu dan semua class turunannya', false],
            ['Dari mana saja di file yang sama', false],
            ['Dari mana saja, tetapi hanya untuk dibaca', false],
          ]),
          q('Apa perbedaan protected dan private?', [
            ['protected juga bisa diakses dari subclass, private tidak', true],
            ['private juga bisa diakses dari subclass, protected tidak', false],
            ['protected bisa diakses dari mana saja, private tidak', false],
            ['Tidak ada beda, keduanya hanya soal gaya penulisan', false],
          ]),
          q('Kode di luar class mengakses property private. Kapan itu dilaporkan sebagai error?', [
            ['Saat kompilasi oleh tsc; JavaScript hasil kompilasinya tidak punya pengaman private', true],
            ['Saat runtime, JavaScript melempar error karena property itu bersifat private', false],
            ['Tidak pernah, karena private hanya anjuran penulisan kode yang tidak dicek compiler', false],
          ]),
        ],
      },
      {
        title: "Inheritance & implements Interface",
        slug: 'tsfz-inheritance-implements-interface',
        content: [
          'Inheritance (pewarisan) memungkinkan sebuah class mewarisi property dan method dari class lain memakai kata kunci `extends`, contoh: `class Mahasiswa extends Siswa`. Class turunan otomatis punya semua yang dimiliki class induknya, dan bisa menambah property/method baru.',
          'Di dalam constructor class turunan, `super(...)` wajib dipanggil terlebih dahulu (sebelum memakai `this`) untuk menjalankan constructor class induk, baru setelah itu menambahkan logika constructor milik class turunan itu sendiri.',
          'Kata kunci `implements` dipakai class untuk berjanji memenuhi struktur sebuah interface — class itu wajib punya semua property dan method yang didefinisikan interface, kalau tidak compiler akan melaporkan error. Berbeda dengan `extends`, `implements` tidak mewarisi isi apa pun: class tetap harus menulis sendiri implementasinya.',
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
          'Secara default, tiap anggota enum diberi nilai angka otomatis mulai dari 0 (`Baru` = 0, `Diproses` = 1, `Selesai` = 2). Enum numerik juga punya reverse mapping: kita bisa mengambil nama anggota dari angkanya.',
          `\`\`\`typescript
enum StatusPesanan {
  Baru,       // 0
  Diproses,   // 1
  Selesai,    // 2
}

console.log(StatusPesanan.Selesai)   // 2
console.log(StatusPesanan[0])        // "Baru" (reverse mapping, khusus enum numerik)
\`\`\``,
          '## String enum',
          'Kita juga bisa menetapkan nilai string secara eksplisit. String enum tidak punya reverse mapping, tapi nilainya jelas terbaca saat dicetak atau disimpan.',
          `\`\`\`typescript
enum Warna {
  Merah = "MERAH",
  Biru = "BIRU",
}

const pilihan: Warna = Warna.Biru
console.log(pilihan)   // BIRU
\`\`\``,
          'Enum membuat kode lebih mudah dibaca dibanding memakai angka atau string mentah secara langsung tersebar di banyak tempat — cukup memakai `StatusPesanan.Selesai` daripada mengingat-ingat angka `2` artinya apa.',
          'Berbeda dengan interface dan type alias yang hilang total saat kompilasi, enum menghasilkan kode JavaScript sungguhan (sebuah object), jadi enum ada juga saat program berjalan. Banyak tim juga memakai union dari beberapa literal type string, misal `"baru" | "diproses" | "selesai"`, sebagai alternatif ringan yang tidak menghasilkan kode JavaScript tambahan; pilih sesuai konvensi tim.',
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
console.log("Nama untuk angka 0:", StatusPesanan[0])

enum Warna {
  Merah = "MERAH",
  Biru = "BIRU",
}

const pilihan: Warna = Warna.Biru
console.log("Warna pilihan:", pilihan)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Berapa nilai StatusPesanan.Diproses pada enum StatusPesanan { Baru, Diproses, Selesai }?', [
            ['1', true],
            ['0', false],
            ['2', false],
            ['"Diproses"', false],
          ]),
          q('Apa hasil StatusPesanan[0] pada enum numerik tersebut?', [
            ['String "Baru", lewat reverse mapping', true],
            ['Angka 0 itu sendiri', false],
            ['undefined, karena enum bukan array', false],
            ['Error, karena enum tidak bisa diakses dengan angka', false],
          ]),
          q('Apa beda enum dan interface setelah dikompilasi ke JavaScript?', [
            ['Enum menjadi object nyata di JavaScript, interface hilang sepenuhnya', true],
            ['Keduanya hilang sepenuhnya karena type erasure', false],
            ['Interface menjadi object nyata, enum hilang sepenuhnya', false],
            ['Keduanya menjadi object nyata di JavaScript', false],
          ]),
        ],
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
          'Generic memungkinkan kita menulis fungsi, class, atau interface yang bisa bekerja dengan berbagai tipe data, TANPA kehilangan pengecekan tipe yang ketat. Ditulis dengan kurung sudut (`<` dan `>`) berisi placeholder huruf, biasanya `<T>`, contoh: `function identitas<T>(nilai: T): T { return nilai }`.',
          'Tanpa generic, kita harus memilih antara menulis fungsi terpisah untuk tiap tipe (banyak duplikasi kode), atau memakai tipe `any` yang menghilangkan sama sekali manfaat static typing. Generic memberi jalan tengah: fleksibel untuk tipe apa pun, tapi tetap type-safe.',
          'Saat memanggil fungsi generic, ada dua cara menentukan tipe `T`. Pertama, menuliskannya eksplisit di kurung sudut sebagai type argument: `identitas<number>(5)` langsung menetapkan `T` menjadi `number`. Kedua, membiarkan TypeScript meng-inference `T` dari argumen yang diberikan: `identitas(5)` otomatis menjadikan `T` bertipe `number`. Cara kedua paling umum; tulis type argument eksplisit hanya kalau inference gagal atau hasilnya tidak sesuai harapan. Pada kedua cara, return value dijamin bertipe `number`, bukan `any`.',
          `\`\`\`typescript
function identitas<T>(nilai: T): T {
  return nilai
}

const a = identitas<number>(5)       // type argument ditulis eksplisit: T = number
const b = identitas("halo")          // T di-infer dari argumen: string
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `function identitas<T>(nilai: T): T {
  return nilai
}

function itemPertama<T>(daftar: T[]): T {
  return daftar[0]
}

console.log(identitas<number>(5))                  // type argument eksplisit
console.log(identitas("halo generic"))             // T di-infer: string
console.log(itemPertama(["apel", "jeruk", "mangga"]))  // T di-infer: string

const angkaPertama = itemPertama([10, 20, 30])     // T di-infer: number
console.log(angkaPertama + 1)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa manfaat utama generic dibanding memakai tipe any?', [
            ['Fleksibel untuk berbagai tipe tapi tetap type-safe', true],
            ['Generic membuat kode berjalan lebih cepat saat runtime', false],
            ['Generic mengubah tipe apa pun menjadi any secara otomatis', false],
            ['Generic hanya bisa dipakai di class, bukan di fungsi', false],
          ]),
          q('Pada identitas(5) tanpa tanda <...>, bagaimana TypeScript menentukan tipe T?', [
            ['T di-infer otomatis dari argumen 5, jadi number', true],
            ['T otomatis menjadi any karena tidak ditulis eksplisit', false],
            ['Kode itu error, type argument wajib ditulis eksplisit', false],
            ['T ditentukan dari nama fungsi', false],
          ]),
          q('Tanda apa yang dipakai menulis parameter tipe generic?', [
            ['<T> (kurung sudut dengan huruf placeholder)', true],
            ['{T} (kurung kurawal)', false],
            ['[T] (kurung siku)', false],
            ['(T) (kurung biasa)', false],
          ]),
          q('Apa yang dilakukan <number> pada pemanggilan identitas<number>(5)?', [
            ['Menetapkan type argument T secara eksplisit, bukan lewat inference', true],
            ['Mengonversi nilai 5 menjadi number saat program berjalan', false],
            ['Membatasi fungsi identitas supaya hanya menerima angka 5', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'tsfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita gabungkan konsep yang sudah dipelajari: interface untuk mendefinisikan bentuk data dan kontrak method, class dengan access modifier, inheritance, dan `implements` untuk memodelkan entitas, serta generic untuk membuat struktur data yang fleksibel dipakai ulang.',
          'Contoh di sandbox berikut membuat sebuah "Kotak Penyimpanan" generic (`Kotak<T>`) yang bisa menyimpan item bertipe apa pun (misal object yang mengikuti interface `Produk`). Class `KotakProduk` mewarisi `Kotak<Produk>` lewat `extends` sekaligus mengimplementasikan interface `Ringkasan` lewat `implements`.',
          'Dengan menguasai type annotation, interface, class, dan generic, kita sudah punya fondasi kuat untuk membangun aplikasi TypeScript yang lebih besar dan type-safe — mulai dari sini, langkah selanjutnya adalah mempraktikkannya di proyek nyata.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `interface Produk {
  nama: string
  harga: number
}

interface Ringkasan {
  ringkas(): string
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

class KotakProduk extends Kotak<Produk> implements Ringkasan {
  totalHarga(): number {
    return this.ambilSemua().reduce((total, produk) => total + produk.harga, 0)
  }

  ringkas(): string {
    return this.ambilSemua().length + " produk, total Rp" + this.totalHarga()
  }
}

const kotak = new KotakProduk()
kotak.tambah({ nama: "Buku TypeScript", harga: 75000 })
kotak.tambah({ nama: "Stiker BarisORG", harga: 15000 })

console.log("Semua produk:", kotak.ambilSemua())
console.log("Total harga:", kotak.totalHarga())
console.log("Ringkasan:", kotak.ringkas())
`,
        hasQuiz: true,
        quizQuestions: [
          q('Dalam studi kasus ini, apa fungsi interface Produk?', [
            ['Mendefinisikan bentuk data yang wajib dipenuhi tiap produk', true],
            ['Menjalankan logika perhitungan total harga', false],
            ['Menyimpan daftar produk di dalam Kotak', false],
            ['Membuat object Produk baru setiap kali tambah() dipanggil', false],
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
          q('Apa fungsi implements Ringkasan pada class KotakProduk?', [
            ['Memastikan KotakProduk punya method ringkas(); compiler melaporkan error kalau tidak ada', true],
            ['Membuat KotakProduk otomatis mewarisi isi method ringkas() dari interface', false],
            ['Membuat KotakProduk mewarisi semua property dan method dari class Kotak', false],
          ]),
        ],
      },
    ],
  },
]

const course: CourseDef = {
  title: 'TypeScript from Zero',
  slug: 'typescript-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'TypeScript from Zero adalah course pengantar untuk kamu yang sudah mengenal dasar JavaScript (variabel, fungsi, array, object, dan class) dan ingin menambahkan sistem tipe di atas pengetahuan itu. TypeScript adalah superset JavaScript yang memeriksa kecocokan tipe saat kompilasi, sehingga banyak bug ketahuan sebelum kode dijalankan.',
    'Di sini kamu belajar cara kerja `tsc` dan type erasure, type annotation dan type inference, `any`/`unknown`/`never` dan literal type, array dan tuple, union type, `null`/`undefined` dengan `strictNullChecks`, narrowing dan type assertion, fungsi bertipe, interface, object type literal, type alias, class dengan access modifier, inheritance dan `implements`, enum, hingga generic dasar. Setiap lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan sebagian dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini mengompilasi kode dengan TypeScript 3.7.4 tanpa flag `--strict`, lalu menjalankannya dengan Node.js 12, tanpa akses jaringan dan tanpa input keyboard. Error tipe tetap menghentikan kode, tapi pemeriksaan ketat seperti `strict` tidak aktif di sandbox, jadi bagian `strictNullChecks` hanya dibahas lewat teks dan quiz, dan fitur TypeScript yang lebih baru dari 3.7 tidak bisa dicoba di sana. Prasyaratnya: pemahaman dasar JavaScript. Tidak perlu menginstal apa pun untuk mencoba kode di sandbox.',
  ].join('\n\n'),
  sandboxLanguage: 'typescript',
  modules,
}

export default course
