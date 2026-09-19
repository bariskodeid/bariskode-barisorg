import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "JavaScript from Zero" — course baru, meniru pola
// seed-python-from-zero.ts / seed-linux-from-zero.ts. Jalankan: pnpm seed:javascript

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
    title: 'Pengenalan JavaScript',
    lessons: [
      {
        title: 'Apa itu JavaScript?',
        slug: 'jsfz-apa-itu-javascript',
        content: [
          'JavaScript adalah bahasa pemrograman yang awalnya dibuat untuk membuat halaman web menjadi interaktif — mengubah tampilan, merespons klik, memvalidasi form, dan sebagainya, langsung di dalam browser.',
          'Sejak kemunculan Node.js pada 2009, JavaScript tidak lagi terbatas di browser. Node.js memungkinkan JavaScript dijalankan langsung di server, dipakai untuk membangun backend, script otomasi, hingga command-line tool.',
          'Karena itu, JavaScript termasuk bahasa yang unik: satu bahasa yang sama bisa dipakai untuk frontend (di browser) maupun backend (di server lewat Node.js) — sering disebut "full-stack JavaScript".',
          'JavaScript bersifat dynamically typed (tipe data ditentukan otomatis saat runtime) dan interpreted (dijalankan langsung tanpa proses compile terpisah), mirip Python, tapi dengan sintaks yang berbeda.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('JavaScript awalnya dibuat untuk berjalan di mana?', [
            ['Browser (halaman web)', true],
            ['Server saja', false],
            ['Sistem operasi', false],
            ['Database', false],
          ]),
          q('Teknologi apa yang memungkinkan JavaScript berjalan di server?', [
            ['Node.js', true],
            ['jQuery', false],
            ['PHP', false],
            ['Apache', false],
          ]),
          q('Apa maksud "full-stack JavaScript"?', [
            ['JavaScript dipakai untuk frontend maupun backend', true],
            ['JavaScript hanya untuk desain visual', false],
            ['JavaScript hanya bisa dipakai sekali', false],
            ['JavaScript tidak bisa dipakai di server', false],
          ]),
          q('JavaScript bersifat dynamically typed, artinya?', [
            ['Tipe data ditentukan otomatis saat runtime', true],
            ['Tipe data harus dideklarasikan eksplisit', false],
            ['Tidak punya tipe data sama sekali', false],
            ['Harus di-compile dulu sebelum jalan', false],
          ]),
        ],
      },
      {
        title: 'Menjalankan JavaScript',
        slug: 'jsfz-menjalankan-javascript',
        content: [
          'Di sandbox belajar ini, JavaScript dijalankan lewat Node.js — sebuah runtime yang mengeksekusi kode JavaScript di luar browser, langsung dari terminal.',
          'Perintah paling dasar untuk menampilkan output ke layar adalah `console.log()`. Hampir setiap program yang kita tulis di course ini akan memakai `console.log()` untuk melihat hasilnya.',
          'Objek bawaan `process` di Node.js menyimpan informasi tentang environment yang sedang berjalan, misalnya `process.version` untuk mengetahui versi Node.js yang dipakai.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `console.log("Halo, JavaScript!");
console.log("Node.js versi:", process.version);
`,
      },
      {
        title: 'Variabel: var, let, dan const',
        slug: 'jsfz-variabel-var-let-const',
        content: [
          'JavaScript punya tiga kata kunci untuk membuat variabel: `var` (cara lama, sejak awal JavaScript), `let`, dan `const` (keduanya diperkenalkan di ES6/2015 dan sekarang jadi standar).',
          '`const` dipakai untuk variabel yang nilainya tidak akan diubah setelah diisi — mencoba reassign `const` akan menghasilkan error. `let` dipakai kalau nilainya memang perlu berubah nanti.',
          'Perbedaan penting `var` vs `let`/`const` ada di scope: `var` ber-scope function (bisa "bocor" keluar dari blok `if`/`for`), sedangkan `let`/`const` ber-scope block (hanya berlaku di dalam `{}` tempat ia didefinisikan).',
          'Praktik modern: gunakan `const` sebagai default, pakai `let` hanya kalau nilainya memang perlu diubah, dan hindari `var` kecuali untuk membaca kode lama.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `var namaVar = "Budi";
let namaLet = "Siti";
const namaConst = "Andi";

console.log("var:", namaVar);
console.log("let:", namaLet);
console.log("const:", namaConst);

namaLet = "Siti Baru";
console.log("let setelah diubah:", namaLet);

function contohScope() {
  if (true) {
    var didalamVar = "saya var, bisa bocor keluar blok if";
    let didalamLet = "saya let, hanya di dalam blok if";
    console.log(didalamVar, "|", didalamLet);
  }
  console.log("var di luar blok if masih terbaca:", didalamVar);
}
contohScope();
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci mana yang nilainya tidak boleh di-reassign?', [
            ['const', true],
            ['let', false],
            ['var', false],
            ['Semua bisa di-reassign', false],
          ]),
          q('Apa perbedaan utama scope var dengan let/const?', [
            ['var ber-scope function, let/const ber-scope block', true],
            ['var ber-scope block, let/const ber-scope function', false],
            ['Keduanya identik tanpa perbedaan', false],
            ['var hanya bisa dipakai di dalam fungsi async', false],
          ]),
          q('Praktik modern yang disarankan untuk deklarasi variabel adalah?', [
            ['Gunakan const sebagai default, let kalau perlu diubah', true],
            ['Selalu gunakan var untuk semua variabel', false],
            ['Hindari deklarasi variabel sama sekali', false],
            ['Gunakan let untuk semua kasus tanpa terkecuali', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Tipe Data & Operator',
    lessons: [
      {
        title: 'Tipe Data Dasar',
        slug: 'jsfz-tipe-data-dasar',
        content: [
          'JavaScript punya beberapa tipe data primitif dasar: `number` (angka, tidak membedakan integer/desimal seperti bahasa lain), `string` (teks), `boolean` (`true`/`false`), `undefined` (variabel dideklarasikan tapi belum diisi nilai), dan `null` (representasi "sengaja kosong").',
          'Operator `typeof` dipakai untuk mengecek tipe data sebuah nilai, misalnya `typeof 10` menghasilkan `"number"`. Ini berguna untuk debugging saat tidak yakin tipe data apa yang sedang dipegang variabel.',
          'Perbedaan `undefined` dan `null`: `undefined` terjadi otomatis (variabel belum diisi, atau parameter fungsi tidak diberikan), sedangkan `null` harus diisi secara sengaja oleh programmer untuk menandakan "memang kosong".',
        ],
        hasSandbox: true,
        sandboxStarterCode: `let umur = 20;
let nama = "Siswa BarisORG";
let lulus = true;
let alamat;
let dataKosong = null;

console.log(typeof umur, "->", umur);
console.log(typeof nama, "->", nama);
console.log(typeof lulus, "->", lulus);
console.log(typeof alamat, "->", alamat);
console.log(typeof dataKosong, "->", dataKosong);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Operator apa untuk mengecek tipe data sebuah nilai?', [
            ['typeof', true],
            ['type()', false],
            ['gettype', false],
            ['instanceof', false],
          ]),
          q('Variabel yang dideklarasikan tapi belum diisi nilai bertipe?', [
            ['undefined', true],
            ['null', false],
            ['number', false],
            ['boolean', false],
          ]),
          q('Kapan sebaiknya nilai null dipakai?', [
            ['Untuk menandakan "memang sengaja kosong" secara eksplisit', true],
            ['Untuk semua variabel angka', false],
            ['Hanya untuk boolean', false],
            ['null tidak pernah dipakai di JavaScript', false],
          ]),
          q('JavaScript membedakan integer dan desimal dengan tipe data terpisah?', [
            ['Tidak, keduanya sama-sama bertipe number', true],
            ['Ya, integer dan float adalah tipe berbeda', false],
            ['Ya, tapi hanya untuk angka negatif', false],
            ['JavaScript tidak punya tipe angka', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'jsfz-operator',
        content: [
          'Operator aritmatika JavaScript: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo), `**` pangkat — mirip kebanyakan bahasa pemrograman lain.',
          'JavaScript punya dua jenis operator perbandingan kesetaraan: `==` (loose equality, membandingkan nilai setelah konversi tipe otomatis) dan `===` (strict equality, membandingkan nilai DAN tipe tanpa konversi). Contoh: `5 == "5"` bernilai `true`, tapi `5 === "5"` bernilai `false`.',
          'Praktik yang direkomendasikan: selalu gunakan `===` dan `!==`, hindari `==`/`!=`, supaya perilaku program lebih bisa diprediksi dan tidak terjebak konversi tipe tak terduga.',
          'Operator logika: `&&` (AND, keduanya harus benar), `||` (OR, salah satu benar), `!` (NOT, membalik nilai boolean) — dipakai untuk menggabungkan beberapa kondisi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const a = 10;
const b = 3;

console.log("Penjumlahan:", a + b);
console.log("Pembagian:", a / b);
console.log("Sisa bagi:", a % b);
console.log("Pangkat:", a ** 2);

console.log("Loose equality 5 == '5':", 5 == "5");
console.log("Strict equality 5 === '5':", 5 === "5");

const cukupUmur = a > b && b > 0;
console.log("Logika AND:", cukupUmur);
console.log("Logika NOT:", !cukupUmur);
`,
      },
      {
        title: 'Template Literal & String Method',
        slug: 'jsfz-template-literal-string-method',
        content: [
          'Template literal ditulis dengan backtick (`` ` ``), bukan kutip biasa, dan memungkinkan menyisipkan variabel langsung ke dalam string memakai `${...}` — jauh lebih ringkas dibanding penggabungan string manual dengan `+`.',
          'Beberapa method string yang sering dipakai: `.toUpperCase()`/`.toLowerCase()` mengubah huruf besar/kecil, `.trim()` menghapus spasi di awal/akhir, `.split()` memecah string jadi array berdasarkan pemisah, dan `.slice()` mengambil sebagian teks berdasarkan index.',
          'Array hasil `.split()` bisa digabung kembali jadi string dengan method `.join()` — kebalikan dari `.split()`, berguna saat perlu menyatukan potongan teks dengan pemisah tertentu.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const nama = "budi";
const umur = 20;

console.log(\`Nama saya \${nama}, umur \${umur} tahun\`);
console.log("Huruf besar:", nama.toUpperCase());

const kalimat = "  Belajar JavaScript itu seru  ";
console.log("Setelah trim:", kalimat.trim());

const kataKata = kalimat.trim().split(" ");
console.log("Setelah split:", kataKata);
console.log("Setelah join dengan '-':", kataKata.join("-"));

console.log("Slice 6 karakter pertama:", "JavaScript from Zero".slice(0, 6));
`,
      },
      {
        title: 'Type Coercion',
        slug: 'jsfz-type-coercion',
        content: [
          'Type coercion adalah konversi tipe data yang dilakukan JavaScript secara otomatis (implisit) saat operator dipakai pada nilai bertipe berbeda, tanpa kita minta secara eksplisit.',
          'Contoh paling terkenal: `"5" + 3` menghasilkan `"53"` (string), bukan `8` — karena operator `+` pada string memicu penggabungan (concatenation), sehingga angka `3` dikonversi jadi string dulu.',
          'Sebaliknya, operator `-`, `*`, `/` cenderung memaksa konversi ke number, sehingga `"5" - 3` menghasilkan `2` (number), bukan error atau string.',
          'Karena perilaku ini sering membingungkan pemula, praktik yang aman adalah melakukan konversi tipe secara eksplisit (misal `Number("5")` atau `String(3)`) daripada mengandalkan coercion otomatis, dan selalu memakai `===` untuk perbandingan.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q("Apa hasil dari \"5\" + 3 di JavaScript?", [
            ['"53" (string)', true],
            ['8 (number)', false],
            ['Error', false],
            ['undefined', false],
          ]),
          q('Kenapa "5" + 3 menghasilkan penggabungan string, bukan penjumlahan?', [
            ['Operator + pada string memicu concatenation, angka dikonversi jadi string', true],
            ['JavaScript tidak mendukung operator +', false],
            ['Angka 3 dianggap invalid', false],
            ['String selalu diabaikan oleh operator +', false],
          ]),
          q('Apa hasil dari "5" - 3 di JavaScript?', [
            ['2 (number)', true],
            ['"5-3" (string)', false],
            ['Error', false],
            ['NaN selalu', false],
          ]),
          q('Apa praktik yang disarankan untuk menghindari bug akibat type coercion?', [
            ['Konversi tipe secara eksplisit dan gunakan ===', false],
            ['Selalu gunakan == agar fleksibel', false],
            ['Hindari operator matematika sama sekali', false],
            ['Konversi tipe secara eksplisit dan gunakan === untuk perbandingan', true],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Kontrol Alur & Struktur Data',
    lessons: [
      {
        title: 'Percabangan if/else/switch',
        slug: 'jsfz-percabangan-if-else-switch',
        content: [
          '`if` menjalankan blok kode hanya kalau kondisi bernilai truthy. `else if` mengecek kondisi tambahan kalau `if` sebelumnya tidak terpenuhi, dan `else` menjalankan blok kalau semua kondisi di atasnya tidak terpenuhi.',
          '`switch` adalah alternatif untuk percabangan dengan banyak nilai spesifik yang dibandingkan ke satu variabel — setiap `case` dicocokkan memakai strict equality, dan `break` wajib ditulis supaya eksekusi tidak "jatuh" ke case berikutnya (fall-through).',
          '`default` di dalam `switch` berfungsi seperti `else` — dijalankan kalau tidak ada `case` yang cocok.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const nilai = 75;

if (nilai >= 90) {
  console.log("Grade A");
} else if (nilai >= 75) {
  console.log("Grade B");
} else if (nilai >= 60) {
  console.log("Grade C");
} else {
  console.log("Tidak lulus");
}

const hari = 3;
switch (hari) {
  case 1:
    console.log("Senin");
    break;
  case 2:
    console.log("Selasa");
    break;
  case 3:
    console.log("Rabu");
    break;
  default:
    console.log("Hari tidak dikenali");
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi kalau break lupa ditulis di dalam switch?', [
            ['Eksekusi "jatuh" (fall-through) ke case berikutnya', true],
            ['Program langsung berhenti total', false],
            ['Terjadi error saat menjalankan program', false],
            ['Tidak ada efek apa pun', false],
          ]),
          q('Bagaimana switch mencocokkan nilai case dengan variabel?', [
            ['Strict equality (===)', true],
            ['Loose equality (==)', false],
            ['Selalu mengubah tipe data dulu', false],
            ['Perbandingan berdasarkan panjang string', false],
          ]),
          q('Apa fungsi default di dalam switch?', [
            ['Dijalankan kalau tidak ada case yang cocok', true],
            ['Selalu dijalankan pertama kali', false],
            ['Menghentikan seluruh program', false],
            ['Wajib ditulis di case pertama', false],
          ]),
        ],
      },
      {
        title: 'Perulangan for & while',
        slug: 'jsfz-perulangan-for-while',
        content: [
          '`for` cocok dipakai saat jumlah pengulangan sudah diketahui, ditulis dengan tiga bagian: inisialisasi, kondisi, dan increment/decrement, misal `for (let i = 0; i < 5; i++)`.',
          '`while` mengulang selama kondisinya masih `true`, cocok kalau jumlah pengulangan tidak diketahui di awal. Pastikan ada perubahan kondisi di dalam loop supaya tidak terjadi infinite loop.',
          '`break` menghentikan loop lebih awal secara total, sedangkan `continue` hanya melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `for (let i = 0; i < 5; i++) {
  if (i === 3) continue;
  console.log("Iterasi for ke-", i);
}

let hitung = 0;
while (hitung < 3) {
  console.log("Iterasi while ke-", hitung);
  hitung++;
}
`,
      },
      {
        title: 'Array & Method Array',
        slug: 'jsfz-array-method-array',
        content: [
          'Array adalah struktur data untuk menyimpan kumpulan nilai terurut, ditulis dengan `[]`, misal `const buah = ["apel", "jeruk", "mangga"]`. Akses item lewat index dimulai dari 0, misal `buah[0]`.',
          '`.map()` membuat array baru berisi hasil transformasi setiap item (tidak mengubah array asli). `.filter()` membuat array baru berisi item yang lolos suatu kondisi. `.forEach()` menjalankan sebuah fungsi untuk tiap item tanpa menghasilkan array baru.',
          '`.reduce()` "meringkas" seluruh item array jadi satu nilai (misal total penjumlahan), dengan menerima fungsi accumulator dan nilai awal sebagai argumen.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const angka = [1, 2, 3, 4, 5];

const dikali2 = angka.map((n) => n * 2);
console.log("Setelah map (dikali 2):", dikali2);

const genap = angka.filter((n) => n % 2 === 0);
console.log("Setelah filter (genap saja):", genap);

angka.forEach((n) => console.log("forEach item:", n));

const total = angka.reduce((akumulator, n) => akumulator + n, 0);
console.log("Total dengan reduce:", total);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Method array mana yang menghasilkan array baru dari hasil transformasi tiap item?', [
            ['map()', true],
            ['forEach()', false],
            ['filter()', false],
            ['reduce()', false],
          ]),
          q('Method array mana yang menyaring item berdasarkan kondisi tertentu?', [
            ['filter()', true],
            ['map()', false],
            ['forEach()', false],
            ['push()', false],
          ]),
          q('Method array mana yang meringkas seluruh item jadi satu nilai?', [
            ['reduce()', true],
            ['map()', false],
            ['filter()', false],
            ['forEach()', false],
          ]),
        ],
      },
      {
        title: 'Object',
        slug: 'jsfz-object',
        content: [
          'Object menyimpan data sebagai pasangan key-value, ditulis dengan `{}`, misal `const siswa = { nama: "Budi", umur: 20 }`. Akses nilai lewat dot notation (`siswa.nama`) atau bracket notation (`siswa["nama"]`).',
          'Object bisa punya method — fungsi yang jadi milik object itu, biasa dipakai untuk perilaku yang terkait data di dalamnya. Di dalam method, kata kunci `this` merujuk ke object pemanggilnya.',
          'Properti baru bisa ditambahkan ke object kapan saja setelah dibuat, cukup dengan assignment biasa (`siswa.kelas = "12 IPA"`). `Object.keys()` mengembalikan array berisi semua nama properti (key) dari sebuah object.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const siswa = {
  nama: "Budi",
  umur: 20,
  aktif: true,
  perkenalan: function () {
    console.log(\`Halo, saya \${this.nama}, umur \${this.umur} tahun\`);
  },
};

console.log("Akses dengan titik:", siswa.nama);
console.log("Akses dengan bracket:", siswa["umur"]);
siswa.perkenalan();

siswa.kelas = "12 IPA";
console.log("Setelah tambah properti kelas:", siswa);

console.log("Semua key:", Object.keys(siswa));
`,
      },
    ],
  },
  {
    title: 'Fungsi',
    lessons: [
      {
        title: 'Function Declaration & Function Expression',
        slug: 'jsfz-function-declaration-expression',
        content: [
          'Function declaration ditulis dengan `function namaFungsi(parameter) { ... }` — cara paling umum mendefinisikan fungsi bernama di JavaScript.',
          'Function expression menyimpan sebuah fungsi (biasanya anonim) ke dalam variabel, misal `const kali = function(a, b) { return a * b; }`. Fungsi ini dipanggil lewat nama variabelnya.',
          'Perbedaan penting: function declaration mengalami hoisting penuh — bisa dipanggil sebelum baris definisinya ditulis dalam kode. Function expression tidak bisa dipanggil sebelum baris assignment-nya dieksekusi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function tambah(a, b) {
  return a + b;
}

const kali = function (a, b) {
  return a * b;
};

console.log("Hasil tambah (declaration):", tambah(5, 3));
console.log("Hasil kali (expression):", kali(5, 3));

console.log("Hoisting: dipanggil sebelum definisinya ditulis ->", sapa("Siswa"));

function sapa(nama) {
  return \`Halo, \${nama}!\`;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang membedakan function declaration dari function expression soal hoisting?', [
            ['Function declaration bisa dipanggil sebelum ditulis, expression tidak', true],
            ['Keduanya sama-sama tidak bisa hoisting', false],
            ['Function expression selalu hoisting penuh', false],
            ['Hoisting hanya berlaku untuk arrow function', false],
          ]),
          q('Bagaimana cara menulis function expression?', [
            ['Menyimpan fungsi ke dalam variabel, misal const f = function(){}', true],
            ['Selalu diawali kata kunci class', false],
            ['Tidak bisa disimpan ke variabel', false],
            ['Harus memakai kata kunci export', false],
          ]),
          q('Apa kata kunci untuk mendefinisikan function declaration?', [
            ['function', true],
            ['def', false],
            ['func', false],
            ['lambda', false],
          ]),
        ],
      },
      {
        title: 'Arrow Function',
        slug: 'jsfz-arrow-function',
        content: [
          'Arrow function adalah sintaks fungsi yang lebih ringkas, diperkenalkan di ES6, ditulis dengan tanda panah `=>`, misal `const tambah = (a, b) => a + b;`.',
          'Kalau body fungsi hanya satu ekspresi, kurung kurawal dan `return` bisa dihilangkan (implicit return) — hasil ekspresi otomatis dikembalikan. Kalau body-nya lebih dari satu statement, tetap perlu `{}` dan `return` eksplisit.',
          'Perbedaan penting dengan function biasa: arrow function tidak punya `this` sendiri — ia "mewarisi" `this` dari lingkup di sekitarnya (lexical `this`), berbeda dari function biasa yang `this`-nya ditentukan saat dipanggil.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const tambah = (a, b) => a + b;
const kuadrat = (n) => n * n;
const sapa = (nama) => {
  console.log(\`Halo, \${nama}!\`);
};

console.log("Arrow tambah:", tambah(5, 3));
console.log("Arrow kuadrat:", kuadrat(4));
sapa("Siswa BarisORG");

const objek = {
  nilai: 10,
  tampilkanDenganFunction: function () {
    console.log("this.nilai lewat function biasa:", this.nilai);
  },
};
objek.tampilkanDenganFunction();
`,
      },
      {
        title: 'Scope & Closure Dasar',
        slug: 'jsfz-scope-closure-dasar',
        content: [
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Variabel yang dibuat di dalam fungsi disebut local variable, hanya bisa diakses di dalam fungsi itu sendiri. Variabel di luar semua fungsi disebut global variable.',
          'Closure terjadi ketika sebuah fungsi "mengingat" variabel dari scope tempat ia dibuat, meskipun fungsi luar (yang membuat variabel itu) sudah selesai dieksekusi. Ini terjadi karena fungsi dalam menyimpan referensi ke lingkungan (environment) tempat ia didefinisikan, bukan tempat ia dipanggil.',
          'Contoh klasik closure: fungsi `buatCounter()` yang mengembalikan fungsi lain, dan fungsi yang dikembalikan itu tetap bisa mengakses dan mengubah variabel counter dari `buatCounter()`, walau `buatCounter()` sudah selesai berjalan.',
          'Closure sering dipakai untuk membuat data privat (yang tidak bisa diakses langsung dari luar) — konsep ini penting dipahami secara konsep dulu lewat penjelasan dan quiz sebelum dipraktikkan di kode nyata.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dimaksud dengan closure di JavaScript?', [
            ['Fungsi yang tetap mengingat variabel dari scope tempat ia dibuat', true],
            ['Fungsi yang selalu mengembalikan undefined', false],
            ['Fungsi yang tidak bisa menerima parameter', false],
            ['Fungsi bawaan untuk menutup program', false],
          ]),
          q('Variabel yang dibuat di dalam fungsi disebut?', [
            ['local variable', true],
            ['global variable', false],
            ['static variable', false],
            ['public variable', false],
          ]),
          q('Kenapa closure bisa mengakses variabel meski fungsi luarnya sudah selesai dieksekusi?', [
            ['Fungsi dalam menyimpan referensi ke environment tempat ia didefinisikan', true],
            ['JavaScript menyalin ulang seluruh program setiap saat', false],
            ['Variabel global otomatis dipakai sebagai pengganti', false],
            ['Ini sebenarnya tidak mungkin terjadi di JavaScript', false],
          ]),
        ],
      },
      {
        title: 'Callback Function',
        slug: 'jsfz-callback-function',
        content: [
          'Callback function adalah fungsi yang diteruskan sebagai argumen ke fungsi lain, lalu dipanggil ("dipanggil balik") di dalam fungsi tersebut — pola ini sangat umum di JavaScript, terutama untuk operasi asynchronous.',
          'Contoh sederhana: `.forEach()` pada array sebenarnya menerima sebuah callback yang dijalankan untuk tiap item array. Kita mendefinisikan "apa yang harus dilakukan per item", dan `.forEach()` yang menjalankannya berulang kali.',
          '`setTimeout(callback, delay)` adalah contoh callback untuk operasi yang tertunda — fungsi `callback` baru dijalankan setelah `delay` milidetik berlalu, tanpa menghentikan (blocking) eksekusi kode lain di baris berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function prosesData(data, callback) {
  console.log("Memproses data:", data);
  callback(data);
}

function tampilkanHasil(data) {
  console.log("Hasil diproses:", data.toUpperCase());
}

prosesData("halo dunia", tampilkanHasil);

const angka = [1, 2, 3];
angka.forEach(function (item) {
  console.log("Callback di forEach, item:", item);
});

setTimeout(() => {
  console.log("Callback dijalankan lewat setTimeout setelah delay singkat");
}, 10);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa itu callback function?', [
            ['Fungsi yang diteruskan sebagai argumen lalu dipanggil oleh fungsi lain', true],
            ['Fungsi yang hanya bisa dipanggil sekali seumur hidup program', false],
            ['Fungsi bawaan untuk menghapus variabel', false],
            ['Nama lain untuk arrow function', false],
          ]),
          q('setTimeout(callback, delay) melakukan apa?', [
            ['Menjalankan callback setelah delay milidetik, tanpa blocking', true],
            ['Menjalankan callback langsung tanpa delay', false],
            ['Menghentikan seluruh program selama delay', false],
            ['Menghapus callback dari memory', false],
          ]),
          q('Method array mana yang menerima callback untuk dijalankan per item?', [
            ['forEach()', true],
            ['length', false],
            ['toString()', false],
            ['Array.isArray()', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Ringkasan & Async Dasar',
    lessons: [
      {
        title: 'Destructuring & Spread Operator',
        slug: 'jsfz-destructuring-spread-operator',
        content: [
          'Destructuring adalah cara ringkas mengambil nilai dari array atau object lalu langsung menyimpannya ke variabel baru. Untuk object: `const { nama, umur } = siswa;`. Untuk array: `const [pertama, kedua] = angka;`.',
          'Destructuring array bisa dikombinasikan dengan rest pattern (`...sisanya`) untuk menampung item-item yang tersisa ke dalam array baru, misal `const [pertama, ...sisanya] = angka;`.',
          'Spread operator (`...`) dipakai untuk "membentangkan" isi array atau object, berguna untuk menggabungkan atau menyalin dengan mudah, misal `const arrayBaru = [...arrayLama, itemBaru];` atau `const objectBaru = { ...objectLama, propertiBaru: nilai };`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const siswa = { nama: "Budi", umur: 20, kelas: "12 IPA" };
const { nama, umur } = siswa;
console.log("Destructuring object:", nama, umur);

const angka = [1, 2, 3, 4, 5];
const [pertama, kedua, ...sisanya] = angka;
console.log("Destructuring array:", pertama, kedua, sisanya);

const angkaBaru = [...angka, 6, 7];
console.log("Spread array:", angkaBaru);

const siswaBaru = { ...siswa, kelas: "12 IPS" };
console.log("Spread object (override kelas):", siswaBaru);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara destructuring nilai dari sebuah object?', [
            ['const { nama, umur } = siswa;', true],
            ['const [nama, umur] = siswa;', false],
            ['const nama, umur = siswa;', false],
            ['destructure(siswa, nama, umur);', false],
          ]),
          q('Apa fungsi spread operator (...)?', [
            ['Membentangkan isi array/object, berguna untuk menggabungkan atau menyalin', true],
            ['Menghapus semua item dari array', false],
            ['Mengubah array jadi string', false],
            ['Membuat variabel jadi const', false],
          ]),
          q('Apa hasil dari const [a, ...b] = [1, 2, 3]; console.log(b)?', [
            ['[2, 3]', true],
            ['[1, 2, 3]', false],
            ['1', false],
            ['undefined', false],
          ]),
        ],
      },
      {
        title: 'Promise & Async/Await Dasar',
        slug: 'jsfz-promise-async-await-dasar',
        content: [
          'Promise adalah object yang merepresentasikan hasil dari operasi asynchronous (yang butuh waktu, seperti mengambil data) yang akan selesai di masa depan — bisa berakhir "resolved" (berhasil) atau "rejected" (gagal).',
          '`async`/`await` adalah sintaks yang lebih mudah dibaca untuk bekerja dengan Promise. Fungsi yang diberi kata kunci `async` otomatis mengembalikan Promise, dan `await` di dalamnya "menunggu" sebuah Promise selesai sebelum melanjutkan baris berikutnya — tanpa perlu menulis `.then()` berantai.',
          '`await` hanya boleh dipakai di dalam fungsi `async`. Kalau ingin memakai `await` langsung di level atas skrip, pola umum yang aman adalah membungkusnya dalam sebuah async IIFE (Immediately Invoked Function Expression) seperti `(async function() { ... })();`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `function ambilData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data berhasil diambil");
    }, 10);
  });
}

(async function main() {
  console.log("Mulai mengambil data...");
  const hasil = await ambilData();
  console.log("Hasil:", hasil);
  console.log("Selesai.");
})();
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dikembalikan oleh sebuah fungsi async secara otomatis?', [
            ['Promise', true],
            ['Callback', false],
            ['undefined selalu', false],
            ['Array', false],
          ]),
          q('Kata kunci await hanya boleh dipakai di mana?', [
            ['Di dalam fungsi async', true],
            ['Di mana saja tanpa syarat', false],
            ['Hanya di dalam class', false],
            ['Hanya di dalam callback setTimeout', false],
          ]),
          q('Dua kemungkinan hasil akhir sebuah Promise adalah?', [
            ['Resolved (berhasil) atau rejected (gagal)', true],
            ['True atau false saja', false],
            ['Selalu berhasil tanpa kemungkinan gagal', false],
            ['Null atau undefined', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'jsfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita akan menggabungkan beberapa konsep yang sudah dipelajari: array method (`filter`, `map`, `reduce`), destructuring parameter fungsi, dan template literal — semua dalam satu studi kasus sederhana: mengelola daftar produk.',
          'Perhatikan bagaimana `filter()` dipakai untuk menyaring produk yang stoknya masih ada, lalu `map()` dipakai untuk mengubah tiap produk jadi teks yang siap ditampilkan, dan `reduce()` dipakai untuk menghitung total nilai seluruh stok.',
          'Sepanjang course ini kita sudah belajar dari dasar JavaScript, tipe data, operator, kontrol alur, array, object, fungsi (termasuk arrow function dan closure), sampai dasar-dasar asynchronous dengan Promise/async-await — fondasi yang cukup untuk mulai membangun program JavaScript yang lebih kompleks, baik di browser maupun dengan Node.js.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const produkList = [
  { nama: "Buku", harga: 15000, stok: 10 },
  { nama: "Pensil", harga: 2000, stok: 0 },
  { nama: "Penghapus", harga: 3000, stok: 5 },
];

function formatProduk({ nama, harga }) {
  return \`\${nama}: Rp\${harga}\`;
}

const tersedia = produkList.filter((p) => p.stok > 0);
const namaFormat = tersedia.map(formatProduk);

console.log("Produk tersedia:");
namaFormat.forEach((teks) => console.log("-", teks));

const totalNilaiStok = produkList.reduce((total, p) => total + p.harga * p.stok, 0);
console.log("Total nilai stok semua produk: Rp" + totalNilaiStok);
`,
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
      title: 'JavaScript from Zero',
      slug: 'javascript-from-zero',
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
            ? { sandboxLanguage: 'javascript', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "JavaScript from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
