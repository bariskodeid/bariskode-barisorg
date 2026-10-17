import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

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
          'Meski namanya mirip, JavaScript dan Java adalah dua bahasa yang berbeda: dibuat untuk tujuan yang berbeda dan tidak saling terkait.',
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
            ['Satu bahasa yang sama dipakai untuk frontend (di browser) maupun backend (di server lewat Node.js)', true],
            ['JavaScript hanya jalan di browser, jadi sisi server wajib memakai bahasa lain seperti PHP atau Java', false],
            ['JavaScript dan Java digabung dalam satu program supaya bisa dijalankan di semua perangkat', false],
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
          'Di sandbox belajar ini, JavaScript dijalankan lewat Node.js — sebuah runtime yang mengeksekusi kode JavaScript di luar browser, langsung dari terminal. Sandbox memakai Node.js 12, jadi kamu tidak perlu menginstal apa pun untuk mencoba kode di course ini.',
          '## Menjalankan di komputer sendiri',
          'Kalau ingin mencoba di komputermu, pasang Node.js dari situs resmi nodejs.org, lalu cek versinya di terminal:',
          '```bash\nnode --version\n```',
          'Simpan kode di sebuah file, misal `halo.js`, lalu jalankan dengan perintah `node` diikuti nama filenya:',
          '```bash\nnode halo.js\n```',
          'Mengetik `node` tanpa nama file membuka REPL (Read-Eval-Print Loop): prompt `>` menerima satu perintah JavaScript demi satu dan langsung menampilkan hasilnya. Keluar dengan `.exit` atau tombol Ctrl+D.',
          `\`\`\`plaintext
$ node
> 2 + 3
5
> "halo".toUpperCase()
'HALO'
> .exit
\`\`\``,
          '## console.log dan process',
          'Perintah paling dasar untuk menampilkan output ke layar adalah `console.log()`. Ia bisa menerima beberapa argumen sekaligus dan mencetaknya dalam satu baris dengan dipisah spasi. Hampir setiap program yang kita tulis di course ini akan memakai `console.log()` untuk melihat hasilnya.',
          '```javascript\nconsole.log("Halo");\nconsole.log("Umur:", 20, "tahun"); // Umur: 20 tahun\n```',
          'Objek bawaan `process` di Node.js menyimpan informasi tentang environment yang sedang berjalan, misalnya `process.version` untuk mengetahui versi Node.js yang dipakai.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `console.log("Halo, JavaScript!");
console.log("Umur:", 20, "tahun");
console.log("Node.js versi:", process.version);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa peran Node.js dalam menjalankan JavaScript di sandbox ini?', [
            ['Runtime yang menjalankan kode JavaScript di luar browser', true],
            ['Library yang harus di-import dulu supaya console.log bisa dipakai', false],
            ['Compiler yang mengubah JavaScript menjadi bahasa C sebelum dijalankan', false],
          ]),
          q('Apa yang terjadi kalau kamu mengetik node di terminal tanpa nama file?', [
            ['Masuk ke REPL interaktif yang menjalankan perintah satu per satu', true],
            ['Node.js menjalankan semua file .js yang ada di folder itu', false],
            ['Muncul error karena nama file wajib diisi', false],
          ]),
          q('Apa yang dicetak oleh console.log("Umur:", 20, "tahun")?', [
            ['Umur: 20 tahun', true],
            ['Umur:20tahun', false],
            ['"Umur:", 20, "tahun" (tanda kutip dan koma ikut tercetak)', false],
          ]),
        ],
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
          'JavaScript punya 7 tipe data primitif: `string` (teks), `number` (angka), `bigint` (bilangan bulat berukuran sangat besar), `boolean` (`true`/`false`), `undefined` (variabel dideklarasikan tapi belum diisi nilai), `symbol` (pengenal unik), dan `null` (representasi "sengaja kosong"). Di luar primitif ada tipe `object`, yang mencakup array dan object biasa.',
          'Tipe `number` tidak membedakan integer dan desimal: `5` dan `5.5` sama-sama `number`. Kalau butuh bilangan bulat yang lebih besar dari batas aman `number` (`Number.MAX_SAFE_INTEGER`, yaitu 9007199254740991), pakai `bigint`: tulis akhiran `n` seperti `123n`, atau panggil `BigInt(123)`. Sedangkan `symbol` jarang dipakai di level pemula; cukup tahu bahwa tipe ini ada.',
          '## Mengecek tipe dengan typeof',
          'Operator `typeof` dipakai untuk mengecek tipe data sebuah nilai dan hasilnya berupa string, misalnya `typeof 10` menghasilkan `"number"`. Ini berguna untuk debugging saat tidak yakin tipe data apa yang sedang dipegang variabel.',
          `\`\`\`javascript
console.log(typeof 10);             // number
console.log(typeof "halo");         // string
console.log(typeof true);           // boolean
console.log(typeof undefined);      // undefined
console.log(typeof BigInt(123));    // bigint
console.log(typeof Symbol("id"));   // symbol
\`\`\``,
          '## typeof null: bug lama',
          'Kejutan: `typeof null` menghasilkan `"object"`, bukan `"null"`. Ini bug lama (legacy) dari JavaScript versi awal yang tidak pernah diperbaiki karena memperbaikinya akan merusak banyak program yang sudah ada. Meski begitu, `null` tetap termasuk tipe primitif. Untuk mengecek apakah sebuah nilai `null`, bandingkan langsung dengan `=== null`.',
          '```javascript\nconst data = null;\nconsole.log(typeof data); // object (bug lama, bukan berarti data adalah object)\nconsole.log(data === null); // true, cara yang benar untuk mengecek null\n```',
          'Perbedaan `undefined` dan `null`: `undefined` terjadi otomatis (variabel belum diisi, atau parameter fungsi tidak diberikan), sedangkan `null` harus diisi secara sengaja oleh programmer untuk menandakan "memang kosong".',
        ],
        hasSandbox: true,
        sandboxStarterCode: `let umur = 20;
let nama = "Siswa BarisORG";
let lulus = true;
let alamat;
let dataKosong = null;
const angkaBesar = BigInt(123);
const pengenal = Symbol("id");

console.log(typeof umur, "->", umur);
console.log(typeof nama, "->", nama);
console.log(typeof lulus, "->", lulus);
console.log(typeof alamat, "->", alamat);
console.log(typeof dataKosong, "->", dataKosong); // "object", bukan "null"
console.log(typeof angkaBesar, "->", angkaBesar);
console.log(typeof pengenal, "->", pengenal.toString());

console.log("Cek null yang benar:", dataKosong === null);
console.log("Batas aman number:", Number.MAX_SAFE_INTEGER);
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
            ['Untuk menandakan secara sengaja bahwa sebuah variabel memang kosong', true],
            ['Sebagai nilai awal otomatis untuk variabel yang belum diisi', false],
            ['Untuk menghapus variabel dari memori', false],
          ]),
          q('Apa hasil typeof null di JavaScript?', [
            ['"object", bug lama yang tidak diperbaiki supaya program lama tidak rusak', true],
            ['"null", karena null punya tipe sendiri', false],
            ['"undefined", karena null berarti belum ada nilai', false],
          ]),
          q('Angka 5 dan 5.5 bertipe apa di JavaScript?', [
            ['Keduanya bertipe number', true],
            ['5 bertipe integer dan 5.5 bertipe float', false],
            ['5 bertipe number dan 5.5 bertipe decimal', false],
          ]),
          q('Tipe primitif mana yang dipakai untuk bilangan bulat yang melebihi batas aman number?', [
            ['bigint', true],
            ['long', false],
            ['integer', false],
            ['symbol', false],
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
          'Kalau string tidak bisa dikonversi jadi angka, hasilnya `NaN` (Not a Number), misalnya `"abc" - 3`.',
          `\`\`\`javascript
console.log("5" + 3);          // 53 (string)
console.log("5" - 3);          // 2 (number)
console.log("abc" - 3);        // NaN
console.log(Number("5") + 3);  // 8 (konversi eksplisit)
console.log(String(3) + "5");  // 35 (konversi eksplisit)
\`\`\``,
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
            ['Error, karena string tidak bisa dikurangi', false],
            ['NaN, karena "5" bukan angka', false],
          ]),
          q('Apa praktik yang disarankan untuk menghindari bug akibat type coercion?', [
            ['Konversi tipe secara eksplisit (misal Number("5")) dan bandingkan dengan ===', true],
            ['Selalu gunakan == supaya JavaScript menyamakan tipe otomatis', false],
            ['Andalkan coercion otomatis, karena JavaScript selalu menebak tipe yang tepat', false],
            ['Tulis semua angka sebagai string supaya tipenya seragam', false],
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
          '## Truthy dan falsy',
          'Kondisi di `if` tidak harus bernilai `true` atau `false` persis: JavaScript mengonversi nilai apa pun ke boolean. Nilai yang dianggap `true` disebut truthy, dan nilai yang dianggap `false` disebut falsy. Nilai falsy hanya ada sedikit, yaitu: `false`, `0`, `-0`, `0n` (bigint nol), `""` (string kosong), `null`, `undefined`, dan `NaN`. Semua nilai lain adalah truthy, termasuk `"0"`, `"false"`, array kosong `[]`, dan object kosong `{}`. (Di browser ada satu tambahan peninggalan lama, `document.all`, yang tidak dipakai lagi.)',
          `\`\`\`javascript
if ("halo") {
  console.log("String tidak kosong -> truthy");
}
if (!0) {
  console.log("Angka 0 -> falsy, jadi !0 bernilai true");
}
console.log(Boolean(""), Boolean("0"), Boolean([])); // false true true
\`\`\``,
          '## switch',
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

const namaPengguna = "";
if (namaPengguna) {
  console.log("Halo,", namaPengguna);
} else {
  console.log("Nama kosong (string kosong itu falsy)");
}

console.log("Boolean(0):", Boolean(0));
console.log("Boolean(null):", Boolean(null));
console.log("Boolean('0'):", Boolean("0"));
console.log("Boolean([]):", Boolean([]));
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
          q('Manakah nilai berikut yang dianggap falsy di JavaScript?', [
            ['Angka 0', true],
            ['String "0"', false],
            ['Array kosong []', false],
            ['String "false"', false],
          ]),
          q('Apa yang dicetak oleh kode: const nama = ""; if (nama) { console.log("A"); } else { console.log("B"); }', [
            ['B, karena string kosong bersifat falsy', true],
            ['A, karena variabel nama sudah dideklarasikan', false],
            ['Error, karena kondisi if harus berupa boolean', false],
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
        title: 'Perulangan for...of & for...in',
        slug: 'jsfz-for-of-for-in',
        content: [
          'Selain `for` biasa, JavaScript punya dua perulangan khusus untuk menelusuri koleksi data: `for...of` dan `for...in`. Keduanya sering tertukar, padahal yang ditelusuri berbeda. Array dan object dibahas lengkap di dua lesson berikutnya; di sini cukup tahu bentuknya: array ditulis `["apel", "jeruk"]` dan object ditulis `{ nama: "Budi" }`.',
          '## for...of: menelusuri nilai',
          '`for...of` mengambil nilai satu per satu dari sesuatu yang bisa ditelusuri (iterable), misalnya array dan string. Ia cocok kalau yang dibutuhkan adalah isi koleksinya, tanpa perlu mengurus index. `break` dan `continue` bekerja seperti di `for` biasa.',
          `\`\`\`javascript
const buah = ["apel", "jeruk", "mangga"];
for (const item of buah) {
  console.log(item); // apel, jeruk, lalu mangga
}

for (const huruf of "JS") {
  console.log(huruf); // J, lalu S
}
\`\`\``,
          '## for...in: menelusuri nama properti',
          '`for...in` mengambil nama properti (key) dari sebuah object, satu per satu, dan key itu selalu bertipe string. Untuk mengambil nilainya, pakai bracket notation seperti `siswa[key]`.',
          `\`\`\`javascript
const siswa = { nama: "Budi", umur: 20 };
for (const key in siswa) {
  console.log(key, "=", siswa[key]); // nama = Budi, lalu umur = 20
}
\`\`\``,
          '## Jebakan: for...in pada array',
          'Kalau `for...in` dipakai pada array, yang didapat adalah index sebagai string ("0", "1", dan seterusnya), bukan nilainya, dan loop juga bisa ikut menelusuri properti tambahan non-index milik array. Sebaliknya, `for...of` tidak bisa dipakai langsung pada object biasa: JavaScript melempar `TypeError` karena object biasa bukan iterable. Aturan praktisnya:',
          '- `for...of`: untuk menelusuri nilai, dipakai pada array dan string.\n- `for...in`: untuk menelusuri nama properti (key), dipakai pada object.',
          `\`\`\`javascript
const buah = ["apel", "jeruk"];
for (const index in buah) {
  console.log(index, typeof index); // 0 string, lalu 1 string
}
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `const buah = ["apel", "jeruk", "mangga"];

console.log("for...of pada array (nilai):");
for (const item of buah) {
  console.log("-", item);
}

console.log("for...of dengan break:");
for (const item of buah) {
  if (item === "mangga") break;
  console.log("-", item);
}

console.log("for...of pada string (huruf):");
for (const huruf of "JS") {
  console.log("-", huruf);
}

const siswa = { nama: "Budi", umur: 20, kelas: "12 IPA" };

console.log("for...in pada object (key):");
for (const key in siswa) {
  console.log("-", key, "=", siswa[key]);
}

console.log("for...in pada array (index sebagai string):");
for (const index in buah) {
  console.log("-", index, typeof index);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang diambil oleh for (const x of ["a", "b"]) pada setiap putaran?', [
            ['Nilai item: "a" lalu "b"', true],
            ['Index item sebagai angka: 0 lalu 1', false],
            ['Index item sebagai string: "0" lalu "1"', false],
          ]),
          q('Apa yang diberikan for (const k in { nama: "Budi", umur: 20 }) pada setiap putaran?', [
            ['Nama propertinya: "nama" lalu "umur"', true],
            ['Nilainya: "Budi" lalu 20', false],
            ['Pasangan key dan value dalam bentuk array', false],
          ]),
          q('Kalau for...in dipakai pada array ["a", "b"], variabel loop-nya bertipe apa?', [
            ['string, yaitu "0" dan "1"', true],
            ['number, yaitu 0 dan 1', false],
            ['Sama dengan nilai itemnya, yaitu "a" dan "b"', false],
          ]),
        ],
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
          'Arrow function adalah sintaks fungsi yang lebih ringkas, diperkenalkan di ES6, ditulis dengan tanda panah `=>`. Contoh berikut menulis fungsi yang sama dengan dua cara.',
          `\`\`\`javascript
// function expression biasa
const tambahBiasa = function (a, b) {
  return a + b;
};

// arrow function
const tambah = (a, b) => a + b;
\`\`\``,
          '## Implicit return',
          'Kalau body fungsi hanya satu ekspresi, kurung kurawal dan `return` bisa dihilangkan (implicit return) — hasil ekspresi otomatis dikembalikan. Kalau body-nya lebih dari satu statement, tetap perlu `{}` dan `return` eksplisit. Arrow function dengan satu parameter boleh menulis parameternya tanpa kurung (`n => n * n`), tapi tanpa parameter atau dengan lebih dari satu parameter, kurung wajib ditulis.',
          `\`\`\`javascript
const kuadrat = (n) => n * n;   // implicit return

const sapa = (nama) => {        // pakai {} jadi perlu return eksplisit
  const pesan = \`Halo, \${nama}!\`;
  return pesan;
};

const buatSiswa = (nama) => ({ nama: nama, aktif: true }); // object dibungkus kurung
\`\`\``,
          'Perhatikan baris terakhir: untuk mengembalikan object literal lewat implicit return, bungkus object itu dengan kurung `( )`. Tanpa kurung, JavaScript menganggap `{ ... }` sebagai body fungsi, bukan object.',
          '## Lexical this',
          'Perbedaan penting dengan function biasa: arrow function tidak punya `this` sendiri — ia "mewarisi" `this` dari lingkup di sekitarnya (lexical `this`), berbeda dari function biasa yang `this`-nya ditentukan saat dipanggil. Perbedaan ini paling terasa pada callback di dalam method object.',
          `\`\`\`javascript
const kelas = {
  nama: "12 IPA",
  siswa: ["Budi", "Siti"],
  daftarDenganFunction: function () {
    this.siswa.forEach(function (s) {
      console.log(s, this.nama); // this BUKAN object kelas, jadi this.nama tidak ketemu
    });
  },
  daftarDenganArrow: function () {
    this.siswa.forEach((s) => {
      console.log(s, this.nama); // this diwarisi dari daftarDenganArrow, yaitu object kelas
    });
  },
};
\`\`\``,
          'Pada callback function biasa, `this` bukan lagi object `kelas` (di skrip biasa ia merujuk ke object global, di strict mode nilainya `undefined`), sehingga `this.nama` tidak ketemu. Pada callback arrow function, `this` tetap sama dengan `this` milik method yang membungkusnya, yaitu object `kelas`. Coba jalankan contoh lengkapnya di sandbox.',
          'Karena itu arrow function cocok untuk callback di dalam method, tapi jangan dipakai sebagai method object itu sendiri: `this` di dalamnya tidak menunjuk ke object tersebut.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const tambah = (a, b) => a + b;
const kuadrat = (n) => n * n;
const sapa = (nama) => {
  console.log(\`Halo, \${nama}!\`);
};
const buatSiswa = (nama) => ({ nama: nama, aktif: true });

console.log("Arrow tambah:", tambah(5, 3));
console.log("Arrow kuadrat:", kuadrat(4));
sapa("Siswa BarisORG");
console.log("Object dari arrow:", buatSiswa("Budi"));

const kelas = {
  nama: "12 IPA",
  siswa: ["Budi", "Siti"],
  daftarDenganFunction: function () {
    this.siswa.forEach(function (s) {
      console.log(s, "-> function biasa, this.nama:", this.nama);
    });
  },
  daftarDenganArrow: function () {
    this.siswa.forEach((s) => {
      console.log(s, "-> arrow, this.nama:", this.nama);
    });
  },
};

kelas.daftarDenganFunction();
kelas.daftarDenganArrow();
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa hasil dari const kuadrat = (n) => n * n; kuadrat(4)?', [
            ['16', true],
            ['undefined, karena tidak ada kata return', false],
            ['Error, karena arrow function wajib memakai kurung kurawal', false],
          ]),
          q('Apa maksud arrow function memakai lexical this?', [
            ['Ia tidak punya this sendiri, melainkan memakai this dari lingkup tempat ia ditulis', true],
            ['this-nya ditentukan oleh siapa yang memanggilnya, sama seperti function biasa', false],
            ['this-nya selalu menunjuk ke object global', false],
            ['Arrow function tidak boleh dipakai di dalam method object', false],
          ]),
          q('Di dalam method object, callback manakah yang this-nya tetap menunjuk ke object tersebut?', [
            ['Callback berbentuk arrow function', true],
            ['Callback berbentuk function biasa', false],
            ['Keduanya sama saja, this selalu menunjuk ke object itu', false],
          ]),
        ],
      },
      {
        title: 'Scope & Closure Dasar',
        slug: 'jsfz-scope-closure-dasar',
        content: [
          '## Scope',
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Variabel yang dibuat di dalam fungsi disebut local variable, hanya bisa diakses di dalam fungsi itu sendiri. Variabel di luar semua fungsi disebut global variable.',
          `\`\`\`javascript
const pesanGlobal = "saya variabel global";

function contohScope() {
  const pesanLokal = "saya variabel lokal";
  console.log(pesanGlobal, "|", pesanLokal); // keduanya terbaca di sini
}

contohScope();
console.log(pesanGlobal);  // terbaca
// console.log(pesanLokal); // ReferenceError: pesanLokal hanya ada di dalam fungsi
\`\`\``,
          '## Closure',
          'Closure terjadi ketika sebuah fungsi "mengingat" variabel dari scope tempat ia dibuat, meskipun fungsi luar (yang membuat variabel itu) sudah selesai dieksekusi. Ini terjadi karena fungsi dalam menyimpan referensi ke lingkungan (environment) tempat ia didefinisikan, bukan tempat ia dipanggil. Yang disimpan adalah referensi ke variabelnya, bukan salinan nilainya, jadi perubahan nilai ikut terbawa antar pemanggilan.',
          'Contoh klasik closure: fungsi `buatCounter()` yang mengembalikan fungsi lain, dan fungsi yang dikembalikan itu tetap bisa mengakses dan mengubah variabel `hitung` dari `buatCounter()`, walau `buatCounter()` sudah selesai berjalan.',
          `\`\`\`javascript
function buatCounter() {
  let hitung = 0;
  return function () {
    hitung++;
    return hitung;
  };
}

const counterA = buatCounter();
console.log(counterA()); // 1
console.log(counterA()); // 2

const counterB = buatCounter();
console.log(counterB()); // 1, counterB punya variabel hitung sendiri
\`\`\``,
          'Setiap kali `buatCounter()` dipanggil, JavaScript membuat environment baru berisi `hitung` yang baru. Karena itu `counterA` dan `counterB` menghitung sendiri-sendiri dan tidak saling mengganggu.',
          '## Closure untuk data privat',
          'Closure sering dipakai untuk membuat data privat (yang tidak bisa diakses langsung dari luar): variabel disimpan di fungsi luar, dan dunia luar hanya bisa mengaksesnya lewat fungsi-fungsi yang dikembalikan. Contoh lengkapnya, rekening bank dengan saldo yang tidak bisa diubah sembarangan, ada di sandbox.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `const pesanGlobal = "saya variabel global";

function contohScope() {
  const pesanLokal = "saya variabel lokal";
  console.log("Di dalam fungsi:", pesanGlobal, "|", pesanLokal);
}
contohScope();
console.log("Di luar fungsi:", pesanGlobal);
// console.log(pesanLokal); // hapus tanda // di awal untuk melihat ReferenceError

function buatCounter() {
  let hitung = 0;
  return function () {
    hitung++;
    return hitung;
  };
}

const counterA = buatCounter();
console.log("counterA:", counterA());
console.log("counterA:", counterA());
const counterB = buatCounter();
console.log("counterB (counter baru):", counterB());
console.log("counterA lagi:", counterA());

function buatRekening(saldoAwal) {
  let saldo = saldoAwal;
  return {
    setor: function (jumlah) {
      saldo += jumlah;
      return saldo;
    },
    lihatSaldo: function () {
      return saldo;
    },
  };
}

const rekening = buatRekening(100);
rekening.setor(50);
console.log("Saldo lewat lihatSaldo():", rekening.lihatSaldo());
console.log("Akses langsung rekening.saldo:", rekening.saldo);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dimaksud dengan closure di JavaScript?', [
            ['Fungsi yang tetap bisa mengakses variabel dari scope tempat ia dibuat, meski fungsi luarnya sudah selesai berjalan', true],
            ['Fungsi yang langsung dijalankan saat didefinisikan', false],
            ['Fungsi yang dipanggil kembali setelah operasi asynchronous selesai', false],
            ['Fungsi yang menutup akses ke semua variabel global', false],
          ]),
          q('Variabel yang dibuat di dalam fungsi disebut?', [
            ['local variable', true],
            ['global variable', false],
            ['static variable', false],
            ['public variable', false],
          ]),
          q('Kenapa closure bisa mengakses variabel meski fungsi luarnya sudah selesai dieksekusi?', [
            ['Fungsi dalam menyimpan referensi ke environment tempat ia didefinisikan', true],
            ['Variabel itu otomatis berubah menjadi global saat fungsi luar selesai', false],
            ['Fungsi dalam menyimpan salinan nilai variabel pada saat fungsi itu dibuat', false],
            ['Fungsi luar sebenarnya tidak pernah selesai dieksekusi selama program berjalan', false],
          ]),
          q('Pada contoh buatCounter, apa yang dikembalikan counterA() pada pemanggilan ketiga?', [
            ['3, karena hitung diingat dan bertambah di setiap pemanggilan', true],
            ['1, karena hitung dibuat ulang setiap kali counterA dipanggil', false],
            ['0, karena hitung dikembalikan ke nilai awal setelah fungsi selesai', false],
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
            ['Fungsi yang dipanggil otomatis tepat saat ia didefinisikan', false],
            ['Fungsi yang mengembalikan fungsi lain', false],
            ['Nama lain untuk arrow function', false],
          ]),
          q('setTimeout(callback, delay) melakukan apa?', [
            ['Menjalankan callback setelah delay milidetik, tanpa blocking', true],
            ['Menjalankan callback langsung tanpa delay', false],
            ['Menghentikan seluruh program selama delay', false],
            ['Menjalankan callback berulang-ulang setiap delay milidetik', false],
          ]),
          q('Pada angka.forEach(function (item) { ... }), siapa yang memanggil fungsi callback itu?', [
            ['forEach sendiri, satu kali untuk setiap item di array', true],
            ['Kita sendiri, lewat baris kode terpisah setelah forEach selesai', false],
            ['forEach, tapi hanya satu kali setelah semua item selesai diproses', false],
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
        title: 'Penanganan Error: try/catch/throw',
        slug: 'jsfz-try-catch-throw',
        content: [
          'Saat program berjalan, kadang terjadi kesalahan yang baru ketahuan di tengah jalan (runtime error), misalnya mengakses properti dari `null`. Pada saat itu JavaScript melempar (throw) sebuah error. Kalau tidak ada yang menangkapnya, program berhenti dan sisa kode tidak dijalankan. `try...catch` memungkinkan kita menangkap error itu supaya program bisa lanjut dengan cara yang terkendali.',
          '## try, catch, dan finally',
          'Kode yang berisiko error ditaruh di blok `try`. Kalau terjadi error, sisa baris di dalam `try` dilewati dan eksekusi langsung pindah ke blok `catch`, dengan object error sebagai parameternya. Blok `finally` (opsional) selalu dijalankan, ada error atau tidak, cocok untuk langkah "bersih-bersih". Blok `try` harus diikuti `catch`, `finally`, atau keduanya.',
          `\`\`\`javascript
try {
  console.log("Mulai");
  const pengguna = null;
  console.log(pengguna.nama); // error: null tidak punya properti
  console.log("Baris ini dilewati");
} catch (error) {
  console.log("Tertangkap:", error.name); // TypeError
} finally {
  console.log("finally selalu dijalankan");
}
\`\`\``,
          '## Object error',
          'Error adalah object dengan properti `name` (jenis error, misalnya `TypeError`, `ReferenceError`, atau `SyntaxError`) dan `message` (penjelasannya). Teks `message` bawaan JavaScript bisa berbeda antar versi Node.js dan browser, jadi jangan bergantung pada bunyi persisnya.',
          '## throw: melempar error sendiri',
          'Kita juga bisa melempar error sendiri dengan `throw`. Eksekusi fungsi berhenti saat itu juga dan langsung pindah ke `catch` terdekat. Biasakan melempar object `Error` (`throw new Error("pesan")`), bukan string biasa, supaya error punya `name` dan `message`. Ini berguna untuk menolak input yang tidak masuk akal. Misalnya JavaScript tidak menganggap `10 / 0` sebagai error (hasilnya `Infinity`), jadi fungsi pembagian berikut melempar error sendiri.',
          `\`\`\`javascript
function bagi(a, b) {
  if (b === 0) {
    throw new Error("Pembagi tidak boleh nol");
  }
  return a / b;
}

try {
  console.log(bagi(10, 2)); // 5
  console.log(bagi(10, 0)); // melempar error
} catch (error) {
  console.log("Gagal:", error.message); // Gagal: Pembagi tidak boleh nol
}
\`\`\``,
          'Catatan: `try...catch` hanya menangkap error yang dilempar selagi kode di dalam `try` berjalan. Error yang baru dilempar kemudian, di dalam callback asynchronous seperti `setTimeout`, tidak tertangkap oleh `try...catch` di luarnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `// 1. Error bawaan JavaScript
try {
  console.log("Mulai");
  const pengguna = null;
  console.log(pengguna.nama);
  console.log("Baris ini dilewati");
} catch (error) {
  console.log("Tertangkap:", error.name);
} finally {
  console.log("finally selalu dijalankan");
}

// 2. Error buatan sendiri dengan throw
function bagi(a, b) {
  if (b === 0) {
    throw new Error("Pembagi tidak boleh nol");
  }
  return a / b;
}

try {
  console.log("10 / 2 =", bagi(10, 2));
  console.log("10 / 0 =", bagi(10, 0));
  console.log("Baris ini tidak pernah dijalankan");
} catch (error) {
  console.log("Gagal:", error.message);
}

console.log("Program tetap lanjut setelah error ditangkap");
console.log("10 / 0 tanpa pengecekan:", 10 / 0);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi pada sisa baris di dalam blok try setelah sebuah error dilempar?', [
            ['Dilewati, eksekusi langsung pindah ke blok catch', true],
            ['Tetap dijalankan sampai selesai, baru blok catch dijalankan', false],
            ['Program langsung berhenti total walaupun ada blok catch', false],
          ]),
          q('Kapan blok finally dijalankan?', [
            ['Selalu, baik ada error maupun tidak', true],
            ['Hanya kalau ada error dan sudah ditangkap oleh catch', false],
            ['Hanya kalau tidak ada error di blok try', false],
          ]),
          q('Apa fungsi throw new Error("pesan")?', [
            ['Menghentikan fungsi saat itu juga dan melempar error ke catch terdekat', true],
            ['Mencetak pesan ke layar lalu program lanjut seperti biasa', false],
            ['Menangkap error yang terjadi sebelumnya', false],
          ]),
        ],
      },
      {
        title: 'Promise & Async/Await Dasar',
        slug: 'jsfz-promise-async-await-dasar',
        content: [
          'Promise adalah object yang merepresentasikan hasil dari operasi asynchronous (yang butuh waktu, seperti mengambil data) yang akan selesai di masa depan. Sebuah Promise selalu ada di salah satu dari tiga keadaan: pending (awal, belum selesai), fulfilled (selesai dengan berhasil), atau rejected (selesai dengan gagal). Fulfilled dan rejected disebut hasil akhir: setelah itu Promise tidak berubah lagi.',
          'Di kode, nasib Promise ditentukan lewat dua fungsi yang disediakan constructor-nya: `resolve(nilai)` memenuhi promise dengan sebuah nilai (jadi fulfilled), dan `reject(alasan)` menolaknya (jadi rejected). Kamu juga akan sering mendengar kata "resolved" untuk hasil yang berhasil. Di dokumentasi resmi, arti kata itu lebih luas dari sekadar berhasil, jadi istilah yang tepat untuk hasil berhasil adalah fulfilled.',
          `\`\`\`javascript
const janji = new Promise((resolve, reject) => {
  resolve("data siap");                // pending -> fulfilled
  // reject(new Error("server mati")); // pending -> rejected
});
\`\`\``,
          '## async dan await',
          '`async`/`await` adalah sintaks yang lebih mudah dibaca untuk bekerja dengan Promise. Fungsi yang diberi kata kunci `async` otomatis mengembalikan Promise, bahkan kalau isinya cuma `return 42` (hasilnya Promise yang fulfilled dengan nilai 42). Di dalamnya, `await` "menunggu" sebuah Promise selesai sebelum melanjutkan baris berikutnya — tanpa perlu menulis `.then()` berantai.',
          'Kalau Promise yang ditunggu berakhir rejected, `await` melempar error, jadi bisa ditangkap dengan blok `try`/`catch` seperti di lesson sebelumnya (contohnya ada di starter code).',
          '## Di mana await boleh dipakai',
          '`await` boleh dipakai di dalam fungsi `async`, atau di level atas sebuah ES module (top-level await). Skrip Node.js biasa (CommonJS) tidak mendukung top-level await, dan Node.js 12 di sandbox ini juga tidak mendukungnya sama sekali: hasilnya SyntaxError. Kalau ingin memakai `await` langsung di level atas skrip, pola umum yang aman adalah membungkusnya dalam sebuah async IIFE (Immediately Invoked Function Expression):',
          `\`\`\`javascript
(async function () {
  const hasil = await janji; // janji dari contoh di atas
  console.log(hasil);
})();
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `function ambilData(berhasil) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (berhasil) {
        resolve("Data berhasil diambil");
      } else {
        reject(new Error("Server tidak merespons"));
      }
    }, 10);
  });
}

(async function main() {
  console.log("Mulai mengambil data...");
  const hasil = await ambilData(true);
  console.log("Fulfilled:", hasil);

  try {
    await ambilData(false); // rejected: await melempar error
  } catch (error) {
    console.log("Rejected:", error.message);
  }
  console.log("Selesai.");
})();
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dikembalikan oleh sebuah fungsi async secara otomatis?', [
            ['Promise, walaupun di dalamnya tidak ada await', true],
            ['Nilai yang di-return apa adanya, tanpa dibungkus apa pun', false],
            ['Promise, tapi hanya kalau di dalam fungsinya ada await', false],
            ['Callback yang dipanggil setelah fungsi selesai', false],
          ]),
          q('Di mana kata kunci await boleh dipakai?', [
            ['Di dalam fungsi async, atau di level atas sebuah ES module (top-level await)', true],
            ['Di mana saja, termasuk di level atas skrip Node.js biasa tanpa fungsi async', false],
            ['Di dalam fungsi apa pun yang mengembalikan Promise, walau tidak diberi async', false],
            ['Hanya di dalam callback setTimeout', false],
          ]),
          q('Dua kemungkinan hasil akhir sebuah Promise adalah?', [
            ['Fulfilled (berhasil) atau rejected (gagal)', true],
            ['Pending (menunggu) atau fulfilled (berhasil)', false],
            ['True atau false, mengikuti nilai yang dikirim ke resolve', false],
          ]),
          q('Promise yang baru dibuat dan operasinya belum selesai berada di keadaan apa?', [
            ['pending', true],
            ['rejected, sampai ada hasil yang berhasil', false],
            ['fulfilled dengan nilai kosong', false],
          ]),
        ],
      },
      {
        title: 'Class Dasar',
        slug: 'jsfz-class-dasar',
        content: [
          'Class adalah "cetak biru" (blueprint) untuk membuat banyak object dengan bentuk dan perilaku yang sama. Sebelumnya kita membuat object satu per satu dengan `{}`; kalau butuh banyak object serupa (banyak siswa, banyak produk), class menghindarkan kita dari menulis ulang bentuknya berkali-kali.',
          '## Class, constructor, dan method',
          'Class ditulis dengan kata kunci `class`. `constructor` adalah method khusus yang dijalankan otomatis saat object dibuat dengan `new`. Di dalamnya, `this` merujuk ke object baru yang sedang dibuat (disebut instance) dan biasanya dipakai untuk mengisi properti awal. Method lain ditulis tanpa kata kunci `function` dan bisa dipakai oleh semua instance.',
          `\`\`\`javascript
class Siswa {
  constructor(nama, umur) {
    this.nama = nama;
    this.umur = umur;
  }

  perkenalan() {
    return \`Halo, saya \${this.nama}, umur \${this.umur} tahun\`;
  }
}

const budi = new Siswa("Budi", 20);
const siti = new Siswa("Siti", 19);
console.log(budi.perkenalan()); // Halo, saya Budi, umur 20 tahun
console.log(siti.perkenalan()); // Halo, saya Siti, umur 19 tahun
\`\`\``,
          'Setiap `new Siswa(...)` menghasilkan instance baru yang independen: mengubah `budi.nama` tidak memengaruhi `siti.nama`. Class wajib dipanggil dengan `new`; memanggil `Siswa("Budi", 20)` tanpa `new` memicu `TypeError`.',
          '## Inheritance dengan extends',
          'Class bisa mewarisi class lain lewat `extends`. Class turunan (subclass) otomatis punya properti dan method milik class induk, dan boleh menambah method baru atau menimpa (override) method induk. Di constructor class turunan, `super(...)` memanggil constructor class induk dan harus dipanggil sebelum memakai `this`. Sedangkan `super.namaMethod()` memanggil versi method milik class induk.',
          `\`\`\`javascript
// melanjutkan class Siswa di atas
class Mahasiswa extends Siswa {
  constructor(nama, umur, jurusan) {
    super(nama, umur);
    this.jurusan = jurusan;
  }

  perkenalan() {
    return \`\${super.perkenalan()}, jurusan \${this.jurusan}\`;
  }
}

const rina = new Mahasiswa("Rina", 21, "Informatika");
console.log(rina.perkenalan()); // Halo, saya Rina, umur 21 tahun, jurusan Informatika
\`\`\``,
          'Di balik layar, class JavaScript dibangun di atas mekanisme prototype. Kamu belum perlu mempelajarinya sekarang; sintaks `class` sudah cukup untuk memulai.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Siswa {
  constructor(nama, umur) {
    this.nama = nama;
    this.umur = umur;
  }

  perkenalan() {
    return \`Halo, saya \${this.nama}, umur \${this.umur} tahun\`;
  }
}

class Mahasiswa extends Siswa {
  constructor(nama, umur, jurusan) {
    super(nama, umur);
    this.jurusan = jurusan;
  }

  perkenalan() {
    return \`\${super.perkenalan()}, jurusan \${this.jurusan}\`;
  }
}

const budi = new Siswa("Budi", 20);
const siti = new Siswa("Siti", 19);
const rina = new Mahasiswa("Rina", 21, "Informatika");

console.log(budi.perkenalan());
console.log(siti.perkenalan());
console.log(rina.perkenalan());

budi.nama = "Budi Baru";
console.log("Setelah budi diubah:", budi.nama, "|", siti.nama);
console.log("Isi object:", rina);

try {
  Siswa("Tanpa new", 18);
} catch (error) {
  console.log("Tanpa new ->", error.name);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa peran constructor di dalam sebuah class?', [
            ['Dijalankan otomatis saat new dipanggil, untuk mengisi properti awal object baru', true],
            ['Dijalankan setiap kali method lain milik class itu dipanggil', false],
            ['Menghapus object dari memori saat sudah tidak dipakai', false],
          ]),
          q('Apa yang terjadi kalau class Siswa dipanggil sebagai Siswa("Budi", 20) tanpa kata kunci new?', [
            ['Muncul TypeError karena class wajib dipanggil dengan new', true],
            ['Menghasilkan object kosong tanpa properti', false],
            ['Berjalan seperti function biasa dan mengembalikan undefined', false],
          ]),
          q('Apa yang dilakukan super(nama, umur) di constructor class turunan?', [
            ['Memanggil constructor class induk, dan harus dipanggil sebelum memakai this', true],
            ['Membuat salinan dari object class induk yang sudah ada', false],
            ['Menghapus method class induk supaya tidak ikut diwarisi', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'jsfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita akan menggabungkan beberapa konsep yang sudah dipelajari: array method (`filter`, `map`, `reduce`), destructuring parameter fungsi, dan template literal — semua dalam satu studi kasus sederhana: mengelola daftar produk.',
          'Perhatikan bagaimana `filter()` dipakai untuk menyaring produk yang stoknya masih ada, lalu `map()` dipakai untuk mengubah tiap produk jadi teks yang siap ditampilkan, dan `reduce()` dipakai untuk menghitung total nilai seluruh stok.',
          'Sepanjang course ini kita sudah belajar dari dasar JavaScript, tipe data, operator, kontrol alur (termasuk for...of dan for...in), array, object, fungsi (termasuk arrow function dan closure), penanganan error dengan try/catch, dasar-dasar asynchronous dengan Promise/async-await, sampai class — fondasi yang cukup untuk mulai membangun program JavaScript yang lebih kompleks, baik di browser maupun dengan Node.js.',
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

const course: CourseDef = {
  title: 'JavaScript from Zero',
  slug: 'javascript-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'JavaScript from Zero adalah course pengantar untuk kamu yang belum pernah menulis kode sama sekali. JavaScript adalah bahasa utama untuk membuat halaman web interaktif, dan lewat Node.js ia juga dipakai di sisi server, sehingga cocok sebagai bahasa pemrograman pertama.',
    'Di sini kamu belajar dari dasar: menjalankan JavaScript, variabel (`var`, `let`, `const`), tipe data dan operator, type coercion, template literal, percabangan dan perulangan (`for`, `while`, `for...of`, `for...in`), array dan object, fungsi (function expression, arrow function, scope dan closure, callback), destructuring dan spread, penanganan error dengan `try`/`catch`/`throw`, dasar asynchronous dengan Promise dan async/await, hingga class dasar. Setiap lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan sebagian dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini menjalankan kode dengan Node.js 12, tanpa akses jaringan dan tanpa input keyboard, jadi fitur JavaScript yang lebih baru seperti optional chaining dan operator `??` tidak bisa dicoba di sana. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun dan tidak perlu pengalaman programming sebelumnya.',
  ].join('\n\n'),
  sandboxLanguage: 'javascript',
  modules,
}

export default course
