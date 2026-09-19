import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "PHP from Zero" — meniru pola seed-python-from-zero.ts.
// Jalankan: pnpm seed:php

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
    title: 'Pengenalan PHP',
    lessons: [
      {
        title: 'Apa itu PHP?',
        slug: 'phpfz-apa-itu-php',
        content: [
          'PHP (PHP: Hypertext Preprocessor) adalah bahasa pemrograman server-side yang dirancang khusus untuk pengembangan web. PHP pertama kali dibuat oleh Rasmus Lerdorf pada tahun 1994 dan sekarang jadi salah satu bahasa paling populer untuk web development.',
          'Sebagai bahasa server-side, kode PHP dijalankan di server web, bukan di browser pengguna. Server memproses kode PHP terlebih dahulu, menghasilkan output HTML biasa, baru kemudian mengirimkannya ke browser — browser tidak pernah melihat kode PHP aslinya.',
          'PHP banyak dipakai untuk membangun website dinamis, sistem manajemen konten (CMS) seperti WordPress, aplikasi e-commerce, hingga API backend. Banyak platform besar seperti Facebook (versi awal) dan Wikipedia dibangun di atas PHP.',
          'PHP bersifat mudah dipelajari untuk pemula karena sintaksnya cukup sederhana dan bisa disisipkan langsung di dalam file HTML, tapi tetap punya fitur lengkap untuk membangun aplikasi web yang kompleks.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('PHP adalah bahasa pemrograman jenis apa?', [
            ['Server-side', true],
            ['Client-side saja', false],
            ['Hanya untuk styling', false],
            ['Bahasa markup seperti HTML', false],
          ]),
          q('Siapa yang pertama kali membuat PHP?', [
            ['Rasmus Lerdorf', true],
            ['Guido van Rossum', false],
            ['Brendan Eich', false],
            ['James Gosling', false],
          ]),
          q('Kapan kode PHP dijalankan?', [
            ['Di server, sebelum HTML dikirim ke browser', true],
            ['Di browser pengguna', false],
            ['Setelah HTML sampai di browser', false],
            ['Tidak pernah benar-benar dijalankan', false],
          ]),
          q('Contoh CMS populer yang dibangun dengan PHP adalah?', [
            ['WordPress', true],
            ['Django', false],
            ['Ruby on Rails', false],
            ['Angular', false],
          ]),
        ],
      },
      {
        title: 'Struktur Dasar PHP',
        slug: 'phpfz-struktur-dasar',
        content: [
          'Setiap kode PHP harus ditulis di dalam tag pembuka `<?php` dan tag penutup `?>`. Semua kode di luar tag ini diperlakukan sebagai teks/HTML biasa, dikirim apa adanya ke browser.',
          'Perintah `echo` (atau `print`) dipakai untuk menampilkan output ke layar — ini adalah perintah paling dasar yang akan sering dipakai untuk melihat hasil kode kita.',
          'Setiap statement (perintah) di PHP harus diakhiri dengan titik koma (`;`). Lupa titik koma adalah salah satu kesalahan paling umum bagi pemula PHP.',
          'Komentar satu baris ditulis dengan `//` atau `#`, sedangkan komentar banyak baris ditulis di antara `/*` dan `*/` — komentar diabaikan sepenuhnya oleh interpreter PHP.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
// Ini komentar satu baris
echo "Halo, PHP!";
echo "\\n";
print "Baris ini pakai print.";
echo "\\n";

/*
Ini komentar
banyak baris.
*/
echo "Selesai mencoba struktur dasar PHP.";
`,
      },
      {
        title: 'Variabel di PHP',
        slug: 'phpfz-variabel',
        content: [
          'Variabel di PHP selalu diawali dengan tanda dolar (`$`), contoh: `$nama = "Budi";`. Tidak ada kata kunci deklarasi seperti `var`/`let` — cukup langsung tulis `$` diikuti nama variabel lalu diisi nilai.',
          'Aturan penamaan variabel: harus diawali huruf atau underscore (`_`), boleh diikuti huruf/angka/underscore, dan case-sensitive (`$umur` berbeda dengan `$Umur`).',
          'PHP bersifat dynamically typed — tipe data variabel ditentukan otomatis berdasarkan nilai yang diberikan, dan bisa berubah tipe kalau diisi ulang dengan nilai bertipe lain.',
          "String di PHP bisa disisipi variabel langsung kalau memakai kutip ganda (`\"...\"`), tapi tidak kalau memakai kutip tunggal (`'...'`) — ini disebut string interpolation.",
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$nama = "Siswa BarisORG";
$umur = 20;
$tinggi_badan = 165.5;

echo "Nama: $nama, Umur: $umur, Tinggi: $tinggi_badan\\n";

$umur = "dua puluh"; // dynamically typed, boleh ganti tipe
echo "Umur sekarang bertipe string: $umur\\n";
`,
        hasQuiz: true,
        quizQuestions: [
          q('Setiap variabel di PHP harus diawali dengan tanda apa?', [
            ['$ (dolar)', true],
            ['# (pagar)', false],
            ['@ (at)', false],
            ['& (ampersand)', false],
          ]),
          q('Apakah PHP bersifat dynamically typed?', [
            ['Ya, tipe ditentukan otomatis dari nilai', true],
            ['Tidak, semua variabel harus dideklarasikan tipenya', false],
            ['PHP tidak punya tipe data', false],
            ['Hanya bertipe string semua', false],
          ]),
          q('String mana yang mendukung interpolasi variabel langsung?', [
            ['Kutip ganda "..."', true],
            ["Kutip tunggal '...'", false],
            ['Keduanya tidak mendukung', false],
            ['Hanya heredoc', false],
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
        slug: 'phpfz-tipe-data-dasar',
        content: [
          'PHP punya beberapa tipe data dasar: `int` (bilangan bulat), `float` (bilangan desimal), `string` (teks), `bool` (`true`/`false`), dan `array` (kumpulan data).',
          'Fungsi bawaan `gettype()` menampilkan tipe data dari sebuah nilai/variabel — berguna untuk debugging saat ingin memastikan tipe data yang sedang dipegang variabel tertentu.',
          'Fungsi `var_dump()` juga sering dipakai untuk debugging karena menampilkan tipe data sekaligus nilainya secara lebih detail dibanding `gettype()`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$angka_bulat = 10;
$angka_desimal = 3.14;
$teks = "Halo dunia";
$benar_salah = true;
$daftar = ["apel", "jeruk", "mangga"];

echo gettype($angka_bulat) . "\\n";
echo gettype($angka_desimal) . "\\n";
echo gettype($teks) . "\\n";
echo gettype($benar_salah) . "\\n";
echo gettype($daftar) . "\\n";
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi apa untuk mengecek tipe data sebuah variabel di PHP?', [
            ['gettype()', true],
            ['typeof()', false],
            ['checktype()', false],
            ['vartype()', false],
          ]),
          q('Tipe data apa untuk kumpulan data di PHP?', [
            ['array', true],
            ['list', false],
            ['collection', false],
            ['set', false],
          ]),
          q('Nilai boolean di PHP ditulis dengan huruf apa?', [
            ['huruf kecil: true / false', true],
            ['huruf besar: TRUE / FALSE saja yang valid', false],
            ['1 dan 0 saja, tidak ada kata kunci', false],
            ['Yes / No', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'phpfz-operator',
        content: [
          'Operator aritmatika PHP: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo), `**` pangkat.',
          'Operator perbandingan `==` mengecek kesamaan nilai saja (dengan konversi tipe otomatis kalau perlu), sedangkan `===` mengecek kesamaan nilai DAN tipe data sekaligus — ini perbedaan penting yang sering jadi sumber bug bagi pemula.',
          'Operator logika: `&&` (dan), `||` (atau), `!` (negasi) — dipakai menggabungkan beberapa kondisi boolean. PHP juga menyediakan versi kata: `and`, `or`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$a = 10;
$b = 3;

echo "Penjumlahan: " . ($a + $b) . "\\n";
echo "Pembagian: " . ($a / $b) . "\\n";
echo "Sisa bagi: " . ($a % $b) . "\\n";
echo "Pangkat: " . ($a ** 2) . "\\n";

var_dump(0 == "0");   // true, nilai sama setelah konversi
var_dump(0 === "0");  // false, tipe berbeda (int vs string)

echo "Logika: " . (($a > $b) && ($b > 0) ? "true" : "false") . "\\n";
`,
      },
      {
        title: 'String & Concatenation',
        slug: 'phpfz-string-concatenation',
        content: [
          'PHP menggunakan operator titik (`.`) untuk menggabungkan (concatenate) string, berbeda dengan bahasa lain yang memakai `+`. Contoh: `"Halo, " . "dunia"` menghasilkan `"Halo, dunia"`.',
          'Ada juga operator gabung-tugas `.=` untuk menambahkan teks ke variabel string yang sudah ada, mirip `+=` untuk angka di bahasa lain.',
          'Fungsi string umum: `strlen()` menghitung panjang string, `strtoupper()`/`strtolower()` mengubah huruf besar/kecil, `str_replace()` mengganti bagian teks, `trim()` menghapus spasi di awal/akhir.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$depan = "Budi";
$belakang = "Santoso";
$lengkap = $depan . " " . $belakang;
echo $lengkap . "\\n";

$lengkap .= " (Siswa BarisORG)";
echo $lengkap . "\\n";

echo "Panjang teks: " . strlen($lengkap) . "\\n";
echo strtoupper($depan) . "\\n";
echo str_replace("Budi", "Andi", $lengkap) . "\\n";
`,
      },
      {
        title: 'Type Casting & Type Juggling',
        slug: 'phpfz-type-casting-juggling',
        content: [
          'Type juggling adalah kebiasaan PHP mengonversi tipe data secara otomatis saat dibutuhkan, misal saat menjumlahkan string angka dengan integer: `"5" + 3` menghasilkan `8` (integer), karena PHP otomatis mengubah `"5"` jadi angka.',
          'Type casting adalah konversi tipe data secara eksplisit yang kita lakukan sendiri, ditulis dengan menaruh nama tipe dalam kurung di depan nilai, misal `(int) "10"`, `(float) "3.14"`, `(string) 100`, `(bool) 1`.',
          'Type juggling memudahkan tapi juga bisa jadi sumber bug tak terduga — misal `"10 apel" + 5` tetap menghasilkan `15` karena PHP mengambil angka di awal string, mengabaikan sisanya (dengan warning). Karena itu operator `===` (strict comparison) penting dipakai saat perbandingan tipe harus ketat.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa itu type juggling di PHP?', [
            ['Konversi tipe data otomatis oleh PHP saat dibutuhkan', true],
            ['Fitur untuk menghapus semua tipe data', false],
            ['Cara membuat array multidimensi', false],
            ['Nama lain untuk fungsi bawaan PHP', false],
          ]),
          q('Bagaimana cara melakukan type casting eksplisit ke integer?', [
            ['(int) $nilai', true],
            ['int($nilai) seperti fungsi', false],
            ['$nilai->toInt()', false],
            ['cast($nilai, "int")', false],
          ]),
          q('Hasil dari "5" + 3 di PHP adalah?', [
            ['8 (integer)', true],
            ['"53" (string digabung)', false],
            ['Error langsung', false],
            ['null', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Kontrol Alur & Array',
    lessons: [
      {
        title: 'Percabangan if/elseif/else',
        slug: 'phpfz-percabangan',
        content: [
          'Percabangan `if` menjalankan blok kode hanya jika kondisi bernilai `true`. `elseif` mengecek kondisi tambahan kalau kondisi sebelumnya `false`, dan `else` menjalankan blok kalau semua kondisi di atasnya `false`.',
          'Blok kode PHP ditulis di dalam kurung kurawal `{}`, berbeda dengan Python yang memakai indentasi. Kondisi ditulis di dalam kurung `()`.',
          'PHP juga punya operator ternary singkat: `$hasil = $nilai >= 60 ? "lulus" : "gagal";` — satu baris menggantikan if/else penuh untuk kasus sederhana.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$nilai = 75;

if ($nilai >= 90) {
    echo "Grade A\\n";
} elseif ($nilai >= 75) {
    echo "Grade B\\n";
} elseif ($nilai >= 60) {
    echo "Grade C\\n";
} else {
    echo "Tidak lulus\\n";
}

$status = $nilai >= 60 ? "lulus" : "gagal";
echo "Status: $status\\n";
`,
        hasQuiz: true,
        quizQuestions: [
          q("Kata kunci apa untuk 'else if' di PHP?", [
            ['elseif', true],
            ['elif', false],
            ['elsif', false],
            ['else when', false],
          ]),
          q('Blok kode di PHP ditandai dengan apa?', [
            ['Kurung kurawal {}', true],
            ['Indentasi seperti Python', false],
            ['Kata kunci begin/end', false],
            ['Titik dua di akhir baris', false],
          ]),
          q('Operator ternary di PHP ditulis dengan simbol apa?', [
            ['? dan :', true],
            ['-> dan <-', false],
            ['=> saja', false],
            ['if() else()', false],
          ]),
        ],
      },
      {
        title: 'Perulangan for/while/foreach',
        slug: 'phpfz-perulangan',
        content: [
          '`for` dipakai saat kita tahu berapa kali perulangan harus dijalankan, ditulis `for ($i = 0; $i < 5; $i++) { ... }` — inisialisasi, kondisi, dan increment ditulis dalam satu baris.',
          '`while` mengulang selama kondisi masih `true`, cocok kalau jumlah pengulangan tidak diketahui di awal. Pastikan ada perubahan kondisi di dalam loop supaya tidak infinite loop.',
          '`foreach` khusus dipakai untuk mengiterasi setiap elemen dalam array, ditulis `foreach ($array as $item) { ... }` — lebih ringkas dibanding `for` biasa untuk kasus ini.',
          '`break` menghentikan loop lebih awal, `continue` melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
for ($i = 0; $i < 5; $i++) {
    if ($i == 3) {
        continue;
    }
    echo "Iterasi for ke-$i\\n";
}

$hitung = 0;
while ($hitung < 3) {
    echo "Iterasi while ke-$hitung\\n";
    $hitung++;
}

$buah = ["apel", "jeruk", "mangga"];
foreach ($buah as $item) {
    echo "Buah: $item\\n";
}
`,
      },
      {
        title: 'Array Indexed & Associative',
        slug: 'phpfz-array-indexed-associative',
        content: [
          'Array indexed adalah array biasa dengan index angka otomatis dimulai dari 0, ditulis `$buah = ["apel", "jeruk", "mangga"];`. Akses item dengan `$buah[0]`.',
          'Array associative menyimpan data sebagai pasangan key-value dengan key berupa string, ditulis `$siswa = ["nama" => "Budi", "umur" => 20];`. Akses nilai lewat key: `$siswa["nama"]`.',
          'Fungsi `count()` menghitung jumlah elemen dalam array, sedangkan `print_r()` menampilkan seluruh isi array (termasuk array bersarang) dengan format yang mudah dibaca — sangat berguna untuk debugging.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$buah = ["apel", "jeruk", "mangga"];
echo "Item pertama: " . $buah[0] . "\\n";
echo "Jumlah buah: " . count($buah) . "\\n";

$siswa = ["nama" => "Budi", "umur" => 20];
echo "Nama siswa: " . $siswa["nama"] . "\\n";

print_r($buah);
print_r($siswa);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara mengakses nilai di array associative lewat key "nama"?', [
            ['$siswa["nama"]', true],
            ['$siswa->nama', false],
            ['$siswa.nama', false],
            ['$siswa(nama)', false],
          ]),
          q('Fungsi apa untuk menghitung jumlah elemen dalam array?', [
            ['count()', true],
            ['length()', false],
            ['size()', false],
            ['sum()', false],
          ]),
          q('Array associative menggunakan simbol apa untuk pasangan key-value?', [
            ['=>', true],
            [':', false],
            ['->', false],
            ['==', false],
          ]),
        ],
      },
      {
        title: 'Fungsi Array Bawaan',
        slug: 'phpfz-fungsi-array-bawaan',
        content: [
          '`array_map()` menerapkan sebuah fungsi ke setiap elemen array dan mengembalikan array baru hasil transformasi, contoh: menggandakan setiap angka dalam array.',
          '`array_filter()` menyaring elemen array berdasarkan kondisi tertentu, mengembalikan array baru berisi hanya elemen yang memenuhi kondisi (misalnya hanya angka genap).',
          '`count()` sudah kita pakai sebelumnya untuk menghitung jumlah elemen — fungsi-fungsi array bawaan ini membuat manipulasi data jadi jauh lebih ringkas dibanding menulis loop manual.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$angka = [1, 2, 3, 4, 5];

$dua_kali = array_map(function ($n) {
    return $n * 2;
}, $angka);
echo "Dua kali lipat: " . implode(", ", $dua_kali) . "\\n";

$genap = array_filter($angka, function ($n) {
    return $n % 2 == 0;
});
echo "Angka genap: " . implode(", ", $genap) . "\\n";

echo "Jumlah elemen asli: " . count($angka) . "\\n";
`,
      },
    ],
  },
  {
    title: 'Fungsi',
    lessons: [
      {
        title: 'Membuat Fungsi',
        slug: 'phpfz-membuat-fungsi',
        content: [
          'Fungsi di PHP didefinisikan dengan kata kunci `function`, diikuti nama fungsi dan parameter dalam kurung, lalu blok kode dalam kurung kurawal. Fungsi memudahkan kita menulis kode sekali lalu memakainya berulang kali.',
          '`return` mengembalikan nilai dari fungsi ke pemanggilnya, sekaligus menghentikan eksekusi fungsi di titik itu. Fungsi tanpa `return` otomatis mengembalikan `null`.',
          'Memanggil fungsi cukup dengan nama fungsi diikuti kurung berisi argumen, misal `$hasil = tambah(5, 3);`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
function tambah($a, $b) {
    return $a + $b;
}

function sapa($nama) {
    echo "Halo, $nama\\n";
}

$hasil = tambah(5, 3);
echo "Hasil tambah: $hasil\\n";
sapa("Siswa BarisORG");
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk mendefinisikan fungsi di PHP?', [
            ['function', true],
            ['def', false],
            ['func', false],
            ['method', false],
          ]),
          q('Apa yang dikembalikan fungsi PHP tanpa return eksplisit?', [
            ['null', true],
            ['0', false],
            ['Error', false],
            ['String kosong', false],
          ]),
          q('Apa fungsi dari return dalam sebuah fungsi PHP?', [
            ['Mengembalikan nilai & menghentikan eksekusi fungsi', true],
            ['Mencetak nilai ke layar', false],
            ['Membuat variabel global', false],
            ['Menghapus fungsi', false],
          ]),
        ],
      },
      {
        title: 'Default Argument & Variadic Function',
        slug: 'phpfz-default-variadic',
        content: [
          'Parameter fungsi bisa diberi nilai default, dipakai kalau pemanggil tidak memberikan argumen untuk parameter itu. Contoh: `function sapa($nama = "Tamu") { ... }` — kalau dipanggil `sapa()` tanpa argumen, `$nama` bernilai `"Tamu"`.',
          'Variadic function menerima jumlah argumen yang tidak tetap dengan menambahkan `...` di depan nama parameter, contoh: `function jumlahkan(...$angka) { ... }` — semua argumen yang dikirim akan ditampung sebagai array `$angka`.',
          'Fitur ini berguna saat kita tidak tahu di awal berapa banyak nilai yang akan dikirim ke fungsi, misalnya fungsi kalkulator yang bisa menerima 2, 3, atau lebih angka sekaligus.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
function sapa($nama = "Tamu") {
    echo "Halo, $nama\\n";
}

sapa();
sapa("Budi");

function jumlahkan(...$angka) {
    return array_sum($angka);
}

echo "Jumlah semua: " . jumlahkan(1, 2, 3, 4) . "\\n";
`,
      },
      {
        title: 'Scope Variabel',
        slug: 'phpfz-scope-variabel',
        content: [
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Variabel yang dibuat di dalam fungsi disebut local variable, hanya bisa diakses di dalam fungsi itu sendiri — bahkan variabel dengan nama sama di luar fungsi dianggap variabel yang berbeda.',
          'Variabel yang dibuat di luar semua fungsi disebut global variable. Berbeda dengan beberapa bahasa lain, PHP TIDAK otomatis memberi akses baca variabel global dari dalam fungsi — untuk memakainya di dalam fungsi, harus dideklarasikan eksplisit dengan kata kunci `global`.',
          'Praktik yang baik: hindari terlalu banyak variabel global karena membuat kode sulit dilacak alurnya — lebih baik lewatkan data lewat parameter dan return value fungsi.',
          'Catatan: topik scope ini bersifat konseptual dan sulit didemonstrasikan lewat satu potongan skrip sandbox singkat tanpa membingungkan, jadi dipelajari lewat penjelasan dan quiz konsep.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Variabel yang dibuat di dalam fungsi PHP disebut?', [
            ['local variable', true],
            ['global variable', false],
            ['static variable', false],
            ['public variable', false],
          ]),
          q('Kata kunci apa untuk mengakses variabel global dari dalam fungsi di PHP?', [
            ['global', true],
            ['local', false],
            ['public', false],
            ['extern', false],
          ]),
          q('Apakah PHP otomatis memberi akses variabel global di dalam fungsi tanpa kata kunci apapun?', [
            ['Tidak, harus pakai kata kunci global secara eksplisit', true],
            ['Ya, selalu otomatis bisa diakses', false],
            ['Hanya untuk variabel bertipe array', false],
            ['Hanya untuk variabel bertipe integer', false],
          ]),
        ],
      },
      {
        title: 'Include/Require Dasar',
        slug: 'phpfz-include-require',
        content: [
          'PHP mendukung modularitas kode dengan memecah program jadi beberapa file terpisah, lalu menggabungkannya kembali memakai `include`, `include_once`, `require`, atau `require_once`.',
          'Perbedaan `include` dan `require`: kalau file yang dipanggil tidak ditemukan, `include` hanya menampilkan warning dan program tetap lanjut jalan, sedangkan `require` menghentikan program sepenuhnya (fatal error) — dipakai untuk file yang benar-benar wajib ada, misal file koneksi database.',
          'Versi `_once` (`include_once`/`require_once`) memastikan file yang sama hanya dimasukkan satu kali meski dipanggil berkali-kali di tempat berbeda, mencegah error karena deklarasi fungsi/class ganda.',
          'Catatan: fitur ini bekerja lintas file di server sungguhan, sehingga tidak relevan didemonstrasikan lewat satu file sandbox tunggal — dipelajari lewat penjelasan konsep dan quiz.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama antara include dan require kalau file tidak ditemukan?', [
            ['include hanya warning & lanjut, require fatal error & berhenti', true],
            ['Keduanya identik tanpa perbedaan', false],
            ['include selalu fatal error, require hanya warning', false],
            ['Keduanya tidak menghasilkan error apapun', false],
          ]),
          q('Fungsi apa yang mencegah file yang sama dimasukkan lebih dari sekali?', [
            ['require_once / include_once', true],
            ['require_single', false],
            ['include_unique', false],
            ['import_once', false],
          ]),
          q('Untuk file yang benar-benar wajib ada (misal koneksi database), sebaiknya pakai?', [
            ['require', true],
            ['include', false],
            ['echo', false],
            ['print', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'OOP Dasar & Ringkasan',
    lessons: [
      {
        title: 'Class & Object',
        slug: 'phpfz-class-object',
        content: [
          'Object-Oriented Programming (OOP) mengorganisir kode ke dalam class (cetakan/blueprint) dan object (instance dari class). Class dibuat dengan kata kunci `class`, object dibuat dengan kata kunci `new` diikuti nama class.',
          'Atribut (property) adalah data yang dimiliki object, dideklarasikan di dalam class dengan visibilitas seperti `public`. Method adalah fungsi yang dimiliki object, ditulis seperti fungsi biasa tapi di dalam class.',
          'Akses property dan method dari sebuah object memakai tanda panah `->`, contoh: `$siswa->nama` untuk property, `$siswa->perkenalan()` untuk method — berbeda dengan titik (`.`) yang dipakai bahasa lain seperti Python/JavaScript.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
class Siswa {
    public $nama;
    public $umur;

    function perkenalan() {
        echo "Halo, saya {$this->nama}, umur {$this->umur} tahun\\n";
    }
}

$siswa1 = new Siswa();
$siswa1->nama = "Budi";
$siswa1->umur = 20;

$siswa1->perkenalan();
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk membuat object baru dari sebuah class di PHP?', [
            ['new', true],
            ['create', false],
            ['make', false],
            ['object', false],
          ]),
          q('Simbol apa untuk mengakses property/method dari object di PHP?', [
            ['-> (tanda panah)', true],
            ['. (titik)', false],
            [':: (double colon) selalu', false],
            ['=> (fat arrow)', false],
          ]),
          q('Apa perbedaan class dan object?', [
            ['Class adalah cetakan, object adalah instance-nya', true],
            ['Class dan object adalah hal yang sama', false],
            ['Object selalu lebih besar dari class', false],
            ['Class hanya untuk angka', false],
          ]),
        ],
      },
      {
        title: 'Constructor & Method',
        slug: 'phpfz-constructor-method',
        content: [
          '`__construct()` adalah constructor — method khusus yang otomatis dijalankan saat object baru dibuat dengan `new`, biasanya dipakai untuk mengisi nilai awal property object langsung saat pembuatan.',
          'Di dalam method class, kata kunci `$this` merujuk ke object itu sendiri, dipakai untuk mengakses property atau method lain milik object yang sama, contoh: `$this->nama`.',
          'Dengan constructor, kita tidak perlu lagi mengisi property satu per satu setelah `new` seperti pada lesson sebelumnya — cukup kirim nilai awal langsung sebagai argumen saat membuat object.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
class Siswa {
    public $nama;
    public $umur;

    function __construct($nama, $umur) {
        $this->nama = $nama;
        $this->umur = $umur;
    }

    function perkenalan() {
        echo "Halo, saya {$this->nama}, umur {$this->umur} tahun\\n";
    }
}

$siswa1 = new Siswa("Budi", 20);
$siswa2 = new Siswa("Siti", 22);

$siswa1->perkenalan();
$siswa2->perkenalan();
`,
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'phpfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita akan menggabungkan semua yang sudah dipelajari: array, fungsi, dan class, dalam satu program utuh yang menghitung nilai rata-rata beberapa siswa dan menentukan status kelulusan masing-masing.',
          'Program di bawah membuat beberapa object `Siswa` dari sebuah class, menyimpannya dalam array, lalu menggunakan `foreach` dan fungsi buatan sendiri untuk memproses data setiap siswa — persis alur kerja aplikasi PHP sungguhan yang mengolah data dari database.',
          'Sepanjang course ini kita sudah belajar sintaks dasar, tipe data, operator, kontrol alur, array, fungsi, hingga OOP dasar — fondasi yang cukup untuk mulai membangun aplikasi PHP yang lebih kompleks, termasuk yang terhubung ke database dan web framework.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
class Siswa {
    public $nama;
    public $nilai;

    function __construct($nama, $nilai) {
        $this->nama = $nama;
        $this->nilai = $nilai;
    }
}

function tentukan_status($nilai) {
    return $nilai >= 60 ? "Lulus" : "Tidak Lulus";
}

$daftar_siswa = [
    new Siswa("Budi", 85),
    new Siswa("Siti", 55),
    new Siswa("Andi", 70),
];

$total_nilai = 0;
foreach ($daftar_siswa as $siswa) {
    $status = tentukan_status($siswa->nilai);
    echo "$siswa->nama: nilai $siswa->nilai, status $status\\n";
    $total_nilai += $siswa->nilai;
}

$rata_rata = $total_nilai / count($daftar_siswa);
echo "Rata-rata kelas: $rata_rata\\n";
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi apa yang dipakai untuk menghitung jumlah siswa dalam array pada studi kasus di atas?', [
            ['count()', true],
            ['length()', false],
            ['size()', false],
            ['array_length()', false],
          ]),
          q('Method khusus apa yang dipakai untuk mengisi nilai awal object Siswa secara langsung?', [
            ['__construct()', true],
            ['__init__()', false],
            ['__new__()', false],
            ['__start()', false],
          ]),
          q('Struktur kontrol apa yang dipakai untuk mengiterasi setiap object dalam array $daftar_siswa?', [
            ['foreach', true],
            ['switch', false],
            ['do-while', false],
            ['goto', false],
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
      title: 'PHP from Zero',
      slug: 'php-from-zero',
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
            ? { sandboxLanguage: 'php', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "PHP from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
