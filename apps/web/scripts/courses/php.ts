import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

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
          '## Menerima data dari form web',
          'Salah satu pekerjaan utama PHP adalah menerima data yang dikirim dari browser. PHP menyediakan variabel khusus `$_GET` untuk data yang ikut di alamat URL (misal `halo.php?nama=Budi`) dan `$_POST` untuk data yang dikirim form dengan method POST. Keduanya berbentuk array: nilainya dibaca lewat key, misal `$_GET["nama"]`.',
          'Data dari pengguna tidak boleh langsung dicetak ke halaman. Kalau pengguna mengetik `<b>Budi</b>` atau bahkan skrip berbahaya, browser akan menganggapnya HTML sungguhan (celah keamanan yang disebut XSS). Fungsi `htmlspecialchars()` mengubah karakter khusus HTML seperti `<` dan `>` menjadi entity (`&lt;` dan `&gt;`), sehingga tampil sebagai teks biasa.',
          'Contoh berikut tidak jalan di sandbox, karena sandbox hanya menjalankan skrip dari baris perintah dan tidak menerima request dari browser, jadi `$_GET` dan `$_POST` tidak terisi:',
          '```php\n<?php\n// diakses lewat alamat: halo.php?nama=<b>Budi</b>\necho "Halo, " . htmlspecialchars($_GET["nama"]) . "!";\n// tercetak: Halo, &lt;b&gt;Budi&lt;/b&gt;!\n```',
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
          q('Data form yang dikirim dengan method POST dibaca PHP lewat variabel apa?', [
            ['$_POST', true],
            ['$_GET, karena semua data form masuk ke sana', false],
            ['$_FORM, variabel khusus untuk elemen form HTML', false],
            ['$_INPUT, variabel yang menampung ketikan pengguna', false],
          ]),
          q('Untuk apa htmlspecialchars() dipakai pada data dari pengguna sebelum dicetak ke halaman?', [
            ['Mengubah karakter seperti < dan > menjadi entity supaya tampil sebagai teks dan tidak dibaca browser sebagai HTML', true],
            ['Menghapus semua spasi dan huruf besar dari input supaya data seragam sebelum disimpan', false],
            ['Mengenkripsi data supaya tidak bisa dibaca orang lain saat dikirim lewat jaringan', false],
            ['Memeriksa bahwa input berupa angka sebelum dipakai untuk perhitungan', false],
          ]),
        ],
      },
      {
        title: 'Struktur Dasar PHP',
        slug: 'phpfz-struktur-dasar',
        content: [
          'Kode PHP ditulis setelah tag pembuka `<?php`. Semua teks di luar tag PHP diperlakukan sebagai teks/HTML biasa, dikirim apa adanya ke browser.',
          'Perintah `echo` (atau `print`) dipakai untuk menampilkan output ke layar — ini adalah perintah paling dasar yang akan sering dipakai untuk melihat hasil kode kita.',
          'Setiap statement (perintah) di PHP diakhiri dengan titik koma (`;`). Lupa titik koma adalah salah satu kesalahan paling umum bagi pemula PHP.',
          'Komentar satu baris ditulis dengan `//` atau `#`, sedangkan komentar banyak baris ditulis di antara `/*` dan `*/` — komentar diabaikan sepenuhnya oleh interpreter PHP.',
          '## Tag penutup ?>',
          'Tag penutup `?>` dipakai kalau PHP disisipkan di tengah HTML dan kita perlu kembali menulis HTML sesudahnya:',
          '```php\n<p>Ini HTML biasa.</p>\n<?php echo "Ini hasil dari PHP" ?>\n<p>Kembali ke HTML.</p>\n```',
          'Tag penutup menyiratkan titik koma, sehingga statement terakhir sebelum `?>` boleh tanpa `;` (seperti `echo` pada contoh di atas). Meski begitu, biasakan tetap menulis `;`.',
          'Untuk file yang isinya murni PHP (seperti semua contoh di course ini), tag penutup `?>` sebaiknya dihilangkan. Spasi atau baris kosong yang tak sengaja tertinggal setelah `?>` ikut dikirim sebagai output, dan itu bisa menimbulkan efek yang tidak diinginkan, misalnya mengganggu pengiriman header HTTP.',
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
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang sebaiknya dilakukan dengan tag penutup ?> pada file yang isinya murni PHP?', [
            ['Dihilangkan, supaya tidak ada spasi atau baris kosong yang tak sengaja ikut terkirim sebagai output', true],
            ['Ditulis di akhir file, karena tanpa itu PHP menolak menjalankan file', false],
            ['Ditulis setelah setiap statement sebagai pengganti titik koma', false],
          ]),
          q('Apakah <?php echo "Halo" ?> valid tanpa titik koma setelah "Halo"?', [
            ['Valid, karena tag penutup ?> menyiratkan titik koma', true],
            ['Parse error, karena setiap statement PHP wajib berakhir dengan titik koma tanpa pengecualian', false],
            ['Valid, tapi hanya untuk print, tidak untuk echo', false],
            ['Valid, tapi hanya kalau ada spasi sebelum ?>', false],
          ]),
          q('Apa yang terjadi pada teks yang ada di luar tag <?php ... ?> dalam sebuah file PHP?', [
            ['Dikirim apa adanya ke browser sebagai teks/HTML biasa', true],
            ['Diabaikan seperti komentar', false],
            ['Menyebabkan parse error karena bukan kode PHP', false],
            ['Dijalankan juga sebagai kode PHP', false],
          ]),
        ],
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
          'PHP punya beberapa tipe data dasar: `int` (bilangan bulat), `float` (bilangan desimal), `string` (teks), `bool` (`true`/`false`), dan `array` (kumpulan data). Ada juga satu tipe khusus bernama `null`, yang dibahas di lesson berikutnya.',
          '## Mengecek tipe: gettype() dan var_dump()',
          'Fungsi bawaan `gettype()` mengembalikan nama tipe dari sebuah nilai/variabel sebagai teks — berguna untuk debugging. Hati-hati, nama yang dicetaknya adalah nama lama dari sejarah PHP: `integer` (bukan `int`), `boolean` (bukan `bool`), dan `double` untuk bilangan desimal (bukan `float`). Maknanya sama, hanya namanya berbeda. Sisanya tercetak `string` dan `array`.',
          'Fungsi `var_dump()` menampilkan tipe sekaligus nilainya, dan memakai nama yang sama dengan yang kita pelajari (`int`, `float`, `bool`). Untuk string, angka dalam kurung adalah panjangnya dalam byte; untuk array, jumlah elemennya:',
          '```php\n<?php\nvar_dump(10);          // int(10)\nvar_dump(3.14);        // float(3.14)\nvar_dump("Halo");      // string(4) "Halo"\nvar_dump(true);        // bool(true)\nvar_dump(["a", "b"]);  // array(2) { ... } diikuti isi tiap elemen\n```',
          '## Boolean',
          'Nilai boolean ditulis `true` atau `false`. Keduanya tidak peka huruf besar-kecil, jadi `TRUE`, `True`, dan `true` sama-sama valid dan bernilai sama; konvensi yang umum adalah huruf kecil. Ini berbeda dengan nama variabel, yang case-sensitive.',
          'Satu jebakan saat mencetak: `echo true` mencetak `1`, sedangkan `echo false` tidak mencetak apa-apa (teks kosong). Pakai `var_dump()` kalau ingin melihat `bool(true)` atau `bool(false)` dengan jelas.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$angka_bulat = 10;
$angka_desimal = 3.14;
$teks = "Halo dunia";
$benar_salah = true;
$daftar = ["apel", "jeruk", "mangga"];

// gettype() mencetak nama tipe (nama lama: integer, double, boolean)
echo gettype($angka_bulat) . "\\n";
echo gettype($angka_desimal) . "\\n";
echo gettype($teks) . "\\n";
echo gettype($benar_salah) . "\\n";
echo gettype($daftar) . "\\n";

// var_dump() mencetak tipe sekaligus nilainya
var_dump($angka_bulat);
var_dump($angka_desimal);
var_dump($teks);
var_dump($benar_salah);
var_dump($daftar);

// true dan false tidak peka huruf besar-kecil
var_dump(TRUE);
var_dump(False);

// echo mengubah boolean jadi teks: true menjadi "1", false menjadi teks kosong
echo "echo true: [" . true . "]\\n";
echo "echo false: [" . false . "]\\n";
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
          q('Apa yang dicetak oleh echo gettype(3.14);?', [
            ['double', true],
            ['float', false],
            ['decimal', false],
            ['number', false],
          ]),
          q('Bagaimana PHP memperlakukan penulisan true, TRUE, dan True?', [
            ['Ketiganya valid dan bernilai sama; konvensinya huruf kecil', true],
            ['Hanya true huruf kecil yang valid, TRUE dan True menyebabkan error', false],
            ['Hanya TRUE huruf besar yang valid, seperti konstanta di bahasa C', false],
            ['Ketiganya valid, tapi TRUE dan True berupa string, bukan boolean', false],
          ]),
          q('Fungsi mana yang menampilkan tipe sekaligus nilai, misalnya int(10)?', [
            ['var_dump()', true],
            ['gettype(), yang mencetak nilai beserta tipenya', false],
            ['echo, yang menampilkan tipe di depan nilai', false],
          ]),
          q('Apa yang tercetak oleh echo true;?', [
            ['1', true],
            ['true', false],
            ['Tidak ada, teks kosong', false],
            ['bool(true)', false],
          ]),
        ],
      },
      {
        title: 'Null, isset(), empty() & ??',
        slug: 'phpfz-null-isset-coalesce',
        content: [
          'Selain `int`, `float`, `string`, `bool`, dan `array`, PHP punya satu tipe khusus bernama `null`, yang artinya "tidak ada nilai". Variabel bernilai `null` kalau kita mengisinya dengan `null` secara eksplisit, kalau belum pernah diisi sama sekali, atau kalau sudah dihapus dengan `unset()`. Seperti `true` dan `false`, `null` tidak peka huruf besar-kecil. `gettype()` dan `var_dump()` mencetaknya sebagai `NULL`.',
          '## isset()',
          '`isset($x)` bernilai `true` kalau variabel `$x` ada DAN nilainya bukan `null`. `isset()`, juga `empty()` di bawah, sebenarnya bukan fungsi melainkan language construct (bagian dari sintaks PHP, seperti `echo`). `isset()` aman dipakai untuk variabel yang belum pernah dibuat atau key array yang tidak ada, tanpa pesan error, sehingga cocok untuk memeriksa dulu sebelum membaca. Contohnya `isset($siswa["kota"])`: di sini `$siswa` adalah array associative, yaitu kumpulan pasangan `key => value` yang dibahas lengkap di modul berikutnya, dan `$siswa["kota"]` membaca nilai dari key `"kota"`.',
          '## empty()',
          '`empty($x)` bernilai `true` kalau nilai `$x` dianggap "kosong": `null`, `false`, `0`, `0.0`, string kosong `""`, string `"0"`, dan array kosong `[]`. Jebakannya, `0` dan `"0"` ikut dianggap kosong padahal bisa jadi nilai yang sah, misal umur 0 atau skor 0. Sebaliknya `"false"`, string berisi satu spasi, dan array yang punya elemen (walau elemennya `0`) tidak dianggap kosong. Kalau yang ingin dicek hanya ada-tidaknya nilai, pakai `isset()`.',
          '## Operator ??',
          'Operator null coalescing `??` mengembalikan nilai di sebelah kirinya kalau ada dan bukan `null`, kalau tidak, nilai di sebelah kanannya. Seperti `isset()`, ia tidak mengeluarkan pesan error kalau variabel atau key di kiri tidak ada, jadi cocok untuk memberi nilai default. Tanpa `??`, membaca key array yang tidak ada menghasilkan `null` disertai pesan Notice (menjadi Warning sejak PHP 8.0). Perhatikan bahwa `??` hanya mengganti `null`, sedangkan `0` dan `""` tetap dipakai apa adanya.',
          '```php\n<?php\n$siswa = ["nama" => "Budi", "umur" => 0];\n\necho $siswa["kota"] ?? "belum diisi";   // belum diisi\necho $siswa["umur"] ?? 18;              // 0, bukan 18: hanya null yang diganti\n\nvar_dump(isset($siswa["nama"]));    // bool(true)\nvar_dump(isset($siswa["kota"]));    // bool(false)\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$kosong = null;
$nol = 0;
$teks_kosong = "";
// array associative: pasangan key => value; $siswa["kota"] membaca nilai dari key "kota"
$siswa = ["nama" => "Budi", "umur" => 0];

var_dump($kosong);                // NULL
echo "Tipe null: " . gettype($kosong) . "\\n";

var_dump(isset($kosong));         // false, null dianggap "tidak ada"
var_dump(isset($nol));            // true, 0 tetap nilai yang ada
var_dump(isset($belum_dibuat));   // false, tanpa pesan error
var_dump(isset($siswa["nama"]));  // true
var_dump(isset($siswa["kota"]));  // false

var_dump(empty($nol));            // true
var_dump(empty($teks_kosong));    // true
var_dump(empty("0"));             // true
var_dump(empty("false"));         // false, teks tidak kosong
var_dump(empty([0]));             // false, array berisi elemen tidak kosong
var_dump(empty([]));              // true

echo "Kota: " . ($siswa["kota"] ?? "belum diisi") . "\\n";
echo "Umur: " . ($siswa["umur"] ?? 18) . "\\n";   // 0, bukan 18
echo "Teks kosong: [" . ($teks_kosong ?? "default") . "]\\n";   // tetap kosong, bukan "default"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa hasil isset($x) setelah $x = null; dijalankan?', [
            ['false, karena isset() menganggap nilai null sebagai tidak ada', true],
            ['true, karena variabel $x sudah dibuat', false],
            ['null, karena isset() mengembalikan nilai variabelnya', false],
            ['Error, karena null tidak boleh dicek dengan isset()', false],
          ]),
          q('Mana dari nilai berikut yang membuat empty() bernilai true?', [
            ['"0", yaitu string berisi angka nol', true],
            ['"false", yaitu string berisi kata false', false],
            ['" ", yaitu string berisi satu spasi', false],
            ['[0], yaitu array dengan satu elemen angka nol', false],
          ]),
          q('Apa yang dicetak oleh echo $umur ?? 18; kalau $umur bernilai 0?', [
            ['0, karena ?? hanya mengganti nilai null', true],
            ['18, karena 0 dianggap kosong', false],
            ['Error, karena ?? hanya bisa dipakai pada array', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'phpfz-operator',
        content: [
          '## Operator aritmatika',
          'Operator aritmatika PHP: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo), `**` pangkat. Hasil `/` berupa `int` kalau habis dibagi (`10 / 2` menghasilkan `5`) dan `float` kalau tidak (`10 / 3`).',
          'Operator penugasan gabungan menyingkat penulisan: `$skor += 5` sama dengan `$skor = $skor + 5`, begitu juga `-=`, `*=`, dan `/=`. Sedangkan `++` dan `--` menambah atau mengurangi nilai variabel sebanyak 1.',
          '## Operator perbandingan',
          'Operator perbandingan `==` mengecek kesamaan nilai saja (dengan konversi tipe otomatis kalau perlu), sedangkan `===` mengecek kesamaan nilai DAN tipe data sekaligus — ini perbedaan penting yang sering jadi sumber bug bagi pemula. Lawannya adalah `!=` dan `!==`, dan ada juga `<`, `>`, `<=`, serta `>=`.',
          '## Operator logika',
          'Operator logika: `&&` (dan), `||` (atau), `!` (negasi) — dipakai menggabungkan beberapa kondisi boolean.',
          'PHP juga menyediakan versi kata, `and` dan `or`, tapi keduanya BUKAN sinonim persis dari `&&` dan `||`. Precedence (urutan pengerjaan) `and` dan `or` lebih rendah daripada `=`, sedangkan `&&` dan `||` lebih tinggi. Akibatnya `$h = true and false;` dibaca PHP sebagai `($h = true) and false`, sehingga `$h` bernilai `true`, bukan `false`. Sebaliknya, `$g = true && false;` dibaca `$g = (true && false)`, jadi `$g` bernilai `false`.',
          '```php\n<?php\n$g = true && false;\n$h = true and false;\nvar_dump($g);  // bool(false)\nvar_dump($h);  // bool(true), $h sudah terisi true sebelum "and false" dihitung\n```',
          'Karena itu, pakai `&&` dan `||` untuk logika sehari-hari. Kalau tetap ingin memakai `and`/`or`, bungkus ekspresinya dengan kurung: `$i = (true and false);` menghasilkan `false`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$a = 10;
$b = 3;

echo "Penjumlahan: " . ($a + $b) . "\\n";
echo "Pembagian: " . ($a / $b) . "\\n";
echo "Sisa bagi: " . ($a % $b) . "\\n";
echo "Pangkat: " . ($a ** 2) . "\\n";
var_dump($a / 2);     // int(5), habis dibagi jadi tetap int

$skor = 10;
$skor += 5;
$skor++;
echo "Skor akhir: $skor\\n";

var_dump(0 == "0");   // true, nilai sama setelah konversi
var_dump(0 === "0");  // false, tipe berbeda (int vs string)

echo "Logika: " . (($a > $b) && ($b > 0) ? "true" : "false") . "\\n";

// && dan and BUKAN sinonim: and/or punya precedence lebih rendah dari =
$g = true && false;
var_dump($g);         // false, dibaca $g = (true && false)
$h = true and false;
var_dump($h);         // true, dibaca ($h = true) and false
$i = (true and false);
var_dump($i);         // false, kurung memaksa and dihitung dulu
`,
        hasQuiz: true,
        quizQuestions: [
          q('Berapa nilai $h setelah baris $h = true and false; dijalankan?', [
            ['true, karena $h sudah terisi true sebelum "and false" dihitung', true],
            ['false, karena true and false bernilai false seperti pada &&', false],
            ['null, karena and hanya memberi hasil kalau dibungkus kurung', false],
            ['Error, karena and tidak boleh dipakai bersama = dalam satu baris', false],
          ]),
          q('Apa perbedaan operator == dan === di PHP?', [
            ['=== mengecek nilai dan tipe, sedangkan == hanya nilai (dengan konversi tipe otomatis)', true],
            ['=== hanya mengecek tipe dan tidak peduli nilainya', false],
            ['== melempar error kalau tipe kedua sisi berbeda', false],
            ['Keduanya sama persis, === hanya penulisan gaya lama', false],
          ]),
          q('Berapa hasil 10 % 3 di PHP?', [
            ['1, yaitu sisa bagi', true],
            ['3, yaitu hasil bagi bulatnya', false],
            ['3.33, yaitu hasil bagi desimalnya', false],
          ]),
          q('Apa tipe hasil 10 / 3 di PHP?', [
            ['float, karena 10 tidak habis dibagi 3', true],
            ['int bernilai 3, karena kedua angkanya bilangan bulat', false],
            ['int bernilai 4, karena PHP membulatkan hasil bagi ke atas', false],
          ]),
        ],
      },
      {
        title: 'String & Concatenation',
        slug: 'phpfz-string-concatenation',
        content: [
          '## Menggabungkan string',
          'PHP menggunakan operator titik (`.`) untuk menggabungkan (concatenate) string, berbeda dengan bahasa lain yang memakai `+`. Contoh: `"Halo, " . "dunia"` menghasilkan `"Halo, dunia"`. Operator `+` khusus untuk angka: `"5" . "3"` menghasilkan teks `"53"`, sedangkan `"5" + "3"` menghasilkan angka `8`.',
          'Ada juga operator gabung-tugas `.=` untuk menambahkan teks ke variabel string yang sudah ada, mirip `+=` untuk angka di bahasa lain.',
          'Kalau menggabung teks dengan hasil hitungan, bungkus hitungannya dengan kurung, misal `"Total: " . ($a + $b)`. Tanpa kurung, urutan pengerjaan `.` dan `+` bisa tidak sesuai harapan (dan berbeda antara PHP 7 dan PHP 8).',
          '## Kutip tunggal dan kutip ganda',
          'String berkutip ganda (`"..."`) memproses variabel dan karakter escape seperti `\\n` (baris baru) dan `\\t` (tab). String berkutip tunggal (`\'...\'`) menampilkan isinya apa adanya: `\'Halo $depan\\n\'` mencetak persis `Halo $depan\\n`. Kalau butuh baris baru atau interpolasi variabel, pakai kutip ganda.',
          '## Fungsi string umum',
          'Fungsi string umum: `strlen()` menghitung panjang string, `strtoupper()`/`strtolower()` mengubah huruf besar/kecil, `str_replace()` mengganti bagian teks, `trim()` menghapus spasi di awal/akhir.',
          'Fungsi-fungsi ini mengembalikan string baru, sedangkan variabel aslinya tidak berubah. Kalau ingin menyimpan hasilnya, tugaskan kembali ke variabel:',
          '```php\n<?php\n$teks = "  Halo Budi  ";\necho strtoupper($teks);    // "  HALO BUDI  ", $teks sendiri tetap sama\n$teks = trim($teks);       // sekarang $teks berisi "Halo Budi"\necho str_replace("Budi", "Andi", $teks);  // Halo Andi\n```',
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
echo strtolower("BUDI") . "\\n";
echo "[" . trim("   spasi di tepi   ") . "]\\n";
echo str_replace("Budi", "Andi", $lengkap) . "\\n";
echo "Variabel asli tidak berubah: " . $lengkap . "\\n";

// Titik (.) untuk teks, plus (+) untuk angka
echo "5" . "3" . "\\n";
echo "5" + "3";
echo "\\n";

// Kutip tunggal menampilkan isinya apa adanya, kutip ganda memproses variabel dan \\n
echo 'Kutip tunggal: Halo $depan\\n';
echo "\\n";
echo "Kutip ganda: Halo $depan\\n";
`,
        hasQuiz: true,
        quizQuestions: [
          q('Operator apa untuk menggabungkan string di PHP?', [
            ['. (titik)', true],
            ['+ (plus)', false],
            ['& (ampersand)', false],
          ]),
          q('Apa isi $teks setelah $teks = "Halo"; $teks .= " dunia"; dijalankan?', [
            ['Halo dunia', true],
            [' dunia, karena nilai lama tertimpa', false],
            ['Halo, karena .= tidak mengubah variabelnya', false],
            ['Error, karena .= hanya untuk angka', false],
          ]),
          q("Apa yang tercetak oleh echo 'Halo\\nDunia'; (kutip tunggal)?", [
            ['Halo\\nDunia, ditulis apa adanya dalam satu baris', true],
            ['Halo di baris pertama dan Dunia di baris kedua', false],
            ['HaloDunia, karena \\n dibuang', false],
          ]),
          q('Apa yang dilakukan str_replace("Budi", "Andi", $lengkap) terhadap variabel $lengkap?', [
            ['Tidak mengubahnya; fungsi ini mengembalikan string baru', true],
            ['Langsung mengganti isi $lengkap menjadi versi baru', false],
            ['Mengganti isi $lengkap hanya kalau hasilnya ditampilkan dengan echo', false],
          ]),
        ],
      },
      {
        title: 'Type Casting & Type Juggling',
        slug: 'phpfz-type-casting-juggling',
        content: [
          'Type juggling adalah kebiasaan PHP mengonversi tipe data secara otomatis saat dibutuhkan, misal saat menjumlahkan string angka dengan integer: `"5" + 3` menghasilkan `8` (integer), karena PHP otomatis mengubah `"5"` jadi angka.',
          'Type casting adalah konversi tipe data secara eksplisit yang kita lakukan sendiri, ditulis dengan menaruh nama tipe dalam kurung di depan nilai, misal `(int) "10"`, `(float) "3.14"`, `(string) 100`, `(bool) 1`. Saat cast ke `int`, bagian desimal dipotong, bukan dibulatkan: `(int) 3.99` menghasilkan `3`.',
          '```php\n<?php\nvar_dump("5" + 3);       // int(8), juggling\nvar_dump((int) "10");    // int(10), casting\nvar_dump((int) 3.99);    // int(3)\n```',
          '## Jebakan type juggling',
          'Type juggling memudahkan tapi juga bisa jadi sumber bug tak terduga — misal `"10 apel" + 5` tetap menghasilkan `15` karena PHP mengambil angka di awal string dan mengabaikan sisanya. Di PHP 7.4 (versi yang dipakai sandbox), PHP juga mengeluarkan pesan Notice `A non well formed numeric value encountered`; sejak PHP 8.0 pesan itu naik tingkat menjadi Warning. Muncul atau tidaknya pesan Notice bergantung pada pengaturan `error_reporting` PHP, jadi jangan mengandalkannya untuk menangkap kesalahan.',
          'Berbeda dengan operator `+` di atas, cast eksplisit `(int) "10 apel"` menghasilkan `10` tanpa pesan apa pun, karena kita sendiri yang meminta konversi. Karena itu operator `===` (strict comparison) penting dipakai saat perbandingan tipe harus ketat.',
          '## Casting ke bool',
          'Pada `(bool)`, nilai yang dianggap "kosong" menjadi `false`: `false`, `0`, `0.0`, string kosong `""`, string `"0"`, array kosong `[]`, dan `null`. Semua nilai lain menjadi `true`, termasuk string `"false"` dan string berisi satu spasi `" "`, karena keduanya bukan string kosong.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
// Type juggling: PHP mengonversi tipe sendiri
var_dump("5" + 3);        // int(8)
var_dump("5" . 3);        // string(2) "53"
var_dump("2.5" + 1);      // float(3.5)

// Type casting: kita yang menentukan tipenya
var_dump((int) "10");        // int(10)
var_dump((float) "3.14");    // float(3.14)
var_dump((string) 100);      // string(3) "100"
var_dump((int) 3.99);        // int(3), dipotong, bukan dibulatkan
var_dump((int) "10 apel");   // int(10), cast eksplisit tidak mengeluarkan Notice

// (bool): nilai "kosong" menjadi false, selain itu true
var_dump((bool) 1);          // bool(true)
var_dump((bool) "0");        // bool(false)
var_dump((bool) "");         // bool(false)
var_dump((bool) "false");    // bool(true), teksnya tidak kosong
`,
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
            ['"8" (string), karena salah satu sisi berupa string', false],
            ['Error, karena tipe kedua sisi berbeda', false],
          ]),
          q('Apa hasil "10 apel" + 5 di PHP 7.4?', [
            ['15, disertai pesan Notice karena teksnya tidak sepenuhnya angka', true],
            ['"10 apel5", string digabung seperti di JavaScript', false],
            ['Fatal error, program langsung berhenti', false],
            ['5, karena seluruh teks "10 apel" dianggap 0', false],
          ]),
          q('Berapa hasil (int) 3.99 di PHP?', [
            ['3, bagian desimal dipotong', true],
            ['4, dibulatkan ke angka terdekat', false],
            ['3.99, karena cast ke int tidak mengubah float', false],
          ]),
          q('Apa hasil casting (bool) "false", yaitu string berisi kata false?', [
            ['true, karena string tidak kosong', true],
            ['false, karena isinya kata false', false],
            ['Error, karena kata false bukan angka', false],
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
        title: 'Percabangan switch',
        slug: 'phpfz-switch',
        content: [
          '`switch` cocok dipakai kalau satu nilai dibandingkan dengan banyak kemungkinan, sebagai pengganti rantai `if`/`elseif` yang panjang. Nilai di dalam `switch (...)` dibandingkan dengan tiap `case` dari atas ke bawah memakai perbandingan longgar `==` (bukan `===`), sehingga string `"1"` cocok dengan `case 1`.',
          '```php\n<?php\n$hari = 6;\n\nswitch ($hari) {\n    case 1:\n        echo "Senin";\n        break;\n    case 6:\n    case 7:\n        echo "Akhir pekan";\n        break;\n    default:\n        echo "Hari kerja";\n}\n```',
          '## break dan fall-through',
          'Setelah menemukan `case` yang cocok, PHP menjalankan semua statement dari situ sampai bertemu `break` atau akhir `switch`, termasuk statement di `case` berikutnya yang sebenarnya tidak cocok. Perilaku ini disebut fall-through, dan lupa menulis `break` adalah kesalahan paling umum pada `switch`. Di sisi lain, fall-through bisa dipakai dengan sengaja untuk menggabungkan beberapa `case` yang tindakannya sama, seperti `case 6:` dan `case 7:` di contoh di atas.',
          '## default',
          '`default` dijalankan kalau tidak ada `case` yang cocok, mirip `else` pada `if`. Bagian ini opsional dan biasanya ditulis paling bawah.',
          '`switch` cocok untuk mencocokkan nilai yang persis sama. Untuk rentang nilai, misal nilai >= 90, tetap pakai `if`/`elseif`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$hari = 6;

switch ($hari) {
    case 1:
        echo "Senin\\n";
        break;
    case 6:
    case 7:
        echo "Akhir pekan\\n";
        break;
    default:
        echo "Hari kerja\\n";
}

// Tanpa break, eksekusi "jatuh" ke case berikutnya (fall-through)
$level = 2;
switch ($level) {
    case 3:
        echo "Akses admin\\n";
    case 2:
        echo "Akses editor\\n";
    case 1:
        echo "Akses pembaca\\n";
}

// switch memakai perbandingan longgar (==), jadi "1" cocok dengan case 1
switch ("1") {
    case 1:
        echo "Teks \\"1\\" cocok dengan case 1\\n";
        break;
    default:
        echo "Tidak cocok\\n";
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi kalau sebuah case di switch tidak diakhiri break?', [
            ['Eksekusi lanjut ke statement case berikutnya, walaupun case itu tidak cocok', true],
            ['PHP menolak menjalankan kode dan memberi parse error', false],
            ['switch berhenti sendiri di akhir case, jadi break hanya soal gaya penulisan', false],
            ['Eksekusi kembali ke case pertama dan mengulang dari atas', false],
          ]),
          q('Apa yang dicetak oleh: switch ("1") { case 1: echo "A"; break; default: echo "B"; }', [
            ['A, karena switch memakai == yang menyamakan "1" dan 1', true],
            ['B, karena string "1" dan integer 1 berbeda tipe', false],
            ['AB, karena kedua blok dijalankan', false],
            ['Error, karena tipe nilai switch dan case tidak sama', false],
          ]),
          q('Kapan blok default di switch dijalankan?', [
            ['Kalau tidak ada case yang cocok dengan nilai switch', true],
            ['Selalu dijalankan di akhir switch, setelah case yang cocok selesai', false],
            ['Hanya kalau nilai switch berupa string', false],
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
          'Array indexed adalah array biasa dengan index angka otomatis dimulai dari 0, ditulis `$buah = ["apel", "jeruk", "mangga"];`. Akses item dengan `$buah[0]`. Untuk menambah elemen di akhir array, tulis `$buah[] = "pisang";`.',
          'Array associative menyimpan data sebagai pasangan key-value, ditulis `$siswa = ["nama" => "Budi", "umur" => 20];`. Akses nilai lewat key: `$siswa["nama"]`. Key baru ditambahkan cukup dengan menugaskannya: `$siswa["kota"] = "Bandung";`.',
          '## Key: integer atau string',
          'Key array boleh berupa integer atau string. Array indexed sebenarnya hanyalah array yang key-nya integer 0, 1, 2, ... diisi otomatis oleh PHP. Keduanya jenis array yang sama, dan key integer dan string boleh dicampur dalam satu array. Array dan object tidak bisa dipakai sebagai key.',
          'PHP mengubah beberapa key secara otomatis: string yang berisi bilangan bulat desimal seperti `"5"` disimpan sebagai integer `5`, float seperti `8.7` dipotong menjadi `8`, `true` menjadi `1`, dan `false` menjadi `0`. Akibatnya `$a["5"]` dan `$a[5]` adalah elemen yang sama, dan nilai yang ditulis belakangan menimpa nilai sebelumnya. Sebaliknya `"05"` dan `"1.5"` bukan bilangan bulat desimal, jadi tetap berupa string.',
          '```php\n<?php\n$kunci = [];\n$kunci["5"] = "lima";\n$kunci[5] = "LIMA";        // key sama dengan "5", nilai lama tertimpa\n$kunci["lima"] = "teks";\nvar_dump($kunci);         // 2 elemen: key 5 dan key "lima"\n```',
          '## count() dan print_r()',
          'Fungsi `count()` menghitung jumlah elemen dalam array, sedangkan `print_r()` menampilkan seluruh isi array (termasuk array bersarang) dengan format yang mudah dibaca — sangat berguna untuk debugging.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$buah = ["apel", "jeruk", "mangga"];
echo "Item pertama: " . $buah[0] . "\\n";
echo "Jumlah buah: " . count($buah) . "\\n";

$buah[] = "pisang";   // menambah di akhir, key-nya otomatis 3
echo "Item terakhir: " . $buah[3] . "\\n";

$siswa = ["nama" => "Budi", "umur" => 20];
echo "Nama siswa: " . $siswa["nama"] . "\\n";
$siswa["kota"] = "Bandung";   // menambah key baru

print_r($buah);
print_r($siswa);

// Key bisa integer atau string. "5" (string bilangan bulat) otomatis jadi integer 5.
$kunci = [];
$kunci["5"] = "lima";
$kunci[5] = "LIMA";      // key yang sama, nilai lama tertimpa
$kunci["lima"] = "teks";
var_dump($kunci);
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
          q('Tipe apa yang boleh dipakai sebagai key array di PHP?', [
            ['Integer atau string', true],
            ['Hanya string; angka tidak bisa jadi key', false],
            ['Hanya integer untuk array indexed dan hanya string untuk array associative, tidak boleh dicampur', false],
            ['Tipe apa saja, termasuk array dan object', false],
          ]),
          q('Berapa elemen di $a setelah $a = []; $a["3"] = "x"; $a[3] = "y"; dijalankan?', [
            ['1, karena key "3" otomatis menjadi integer 3 sehingga nilainya tertimpa', true],
            ['2, karena "3" (string) dan 3 (integer) adalah dua key yang berbeda', false],
            ['Error, karena key string dan key integer tidak boleh dicampur', false],
          ]),
        ],
      },
      {
        title: 'Fungsi Array Bawaan',
        slug: 'phpfz-fungsi-array-bawaan',
        content: [
          'Fungsi-fungsi array bawaan membuat manipulasi data jauh lebih ringkas dibanding menulis loop manual. Di lesson ini kita memakai `implode(", ", $array)` untuk menggabungkan elemen array menjadi satu string dengan pemisah `", "`, dan `print_r()` untuk menampilkan isi array.',
          '## array_map dan array_filter',
          '`array_map()` menerapkan sebuah fungsi ke setiap elemen array dan mengembalikan array baru hasil transformasi, contoh: menggandakan setiap angka dalam array. Array aslinya tidak berubah.',
          '`array_filter()` menyaring elemen array berdasarkan kondisi tertentu, mengembalikan array baru berisi hanya elemen yang memenuhi kondisi (misalnya hanya angka genap). Key asli dipertahankan, jadi hasilnya bisa punya key yang tidak berurutan, misal 1 dan 3.',
          'Fungsi yang dikirim ke `array_map()` dan `array_filter()` di sini ditulis langsung sebagai fungsi anonim (fungsi tanpa nama), misal `function ($n) { return $n * 2; }`. Fungsi bernama dibahas di modul Fungsi.',
          '## sort, in_array, dan array_keys',
          '`sort()` mengurutkan array dari kecil ke besar (untuk teks, urut abjad). Fungsi ini mengubah array aslinya langsung, memberi key baru 0, 1, 2, ..., dan mengembalikan `true`, bukan array yang sudah terurut. Jadi `$urut = sort($buah);` adalah kesalahan umum: `$urut` hanya berisi `true`.',
          '`in_array($nilai, $array)` mengecek apakah sebuah nilai ada di dalam array dan mengembalikan `true` atau `false`. Secara default perbandingannya longgar (seperti `==`), sehingga `in_array("2", [1, 2, 3])` bernilai `true`. Beri argumen ketiga `true` untuk perbandingan ketat (seperti `===`): `in_array("2", [1, 2, 3], true)` bernilai `false`.',
          '`array_keys($array)` mengembalikan semua key dari sebuah array sebagai array baru, berguna untuk array associative: `array_keys(["nama" => "Budi", "umur" => 20])` menghasilkan array berisi `"nama"` dan `"umur"`.',
          '```php\n<?php\n$buah = ["mangga", "apel", "jeruk"];\nsort($buah);                        // $buah sekarang: apel, jeruk, mangga\nvar_dump(in_array("apel", $buah));  // bool(true)\nprint_r(array_keys(["nama" => "Budi", "umur" => 20]));  // nama, umur\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$angka = [1, 2, 3, 4, 5];

// Fungsi anonim (tanpa nama) dikirim sebagai argumen ke array_map
$dua_kali = array_map(function ($n) {
    return $n * 2;
}, $angka);
echo "Dua kali lipat: " . implode(", ", $dua_kali) . "\\n";

$genap = array_filter($angka, function ($n) {
    return $n % 2 == 0;
});
echo "Angka genap: " . implode(", ", $genap) . "\\n";
print_r($genap);   // key asli (1 dan 3) dipertahankan

echo "Jumlah elemen asli: " . count($angka) . "\\n";

$buah = ["mangga", "apel", "jeruk"];
sort($buah);       // mengurutkan $buah langsung, key jadi 0, 1, 2
print_r($buah);

var_dump(in_array("apel", $buah));          // true
var_dump(in_array("pisang", $buah));        // false
var_dump(in_array("2", [1, 2, 3]));         // true, perbandingan longgar
var_dump(in_array("2", [1, 2, 3], true));   // false, perbandingan ketat

$siswa = ["nama" => "Budi", "umur" => 20];
print_r(array_keys($siswa));
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dikembalikan sort() ketika dipanggil, misal sort($buah)?', [
            ['true; array $buah sendiri yang diurutkan langsung', true],
            ['Array baru yang sudah terurut, sedangkan $buah tidak berubah', false],
            ['null, karena sort() tidak mengembalikan apa pun', false],
            ['Jumlah elemen yang berhasil diurutkan', false],
          ]),
          q('Apa hasil in_array("2", [1, 2, 3]) dan in_array("2", [1, 2, 3], true)?', [
            ['true lalu false, karena tanpa argumen ketiga perbandingannya longgar', true],
            ['false lalu false, karena string "2" tidak pernah sama dengan angka 2', false],
            ['true lalu true, karena argumen ketiga tidak mengubah cara membandingkan', false],
            ['false lalu true, karena argumen ketiga membuat perbandingan jadi longgar', false],
          ]),
          q('Apa hasil array_keys(["nama" => "Budi", "umur" => 20])?', [
            ['Array berisi "nama" dan "umur"', true],
            ['Array berisi "Budi" dan 20', false],
            ['Angka 2, yaitu jumlah key-nya', false],
          ]),
          q('Apa yang dilakukan array_map() terhadap array aslinya?', [
            ['Tidak mengubahnya; hasil transformasi dikembalikan sebagai array baru', true],
            ['Mengubah setiap elemen array aslinya langsung', false],
            ['Menghapus elemen yang tidak memenuhi syarat dari array aslinya', false],
          ]),
          q('Key apa saja yang tersisa pada hasil array_filter([1, 2, 3, 4], ...) kalau hanya angka genap yang lolos?', [
            ['1 dan 3, karena key asli dipertahankan', true],
            ['0 dan 1, karena key disusun ulang dari 0', false],
            ['2 dan 4, karena key mengikuti nilai elemennya', false],
          ]),
        ],
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
          'Fitur ini berguna saat kita tidak tahu di awal berapa banyak nilai yang akan dikirim ke fungsi, misalnya fungsi kalkulator yang bisa menerima 2, 3, atau lebih angka sekaligus. Pada contoh di bawah, `array_sum()` (fungsi bawaan yang menjumlahkan semua elemen array) dipakai untuk menjumlahkan `$angka`.',
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
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Variabel yang dibuat di dalam fungsi disebut local variable, hanya bisa diakses di dalam fungsi itu sendiri — bahkan variabel dengan nama sama di luar fungsi dianggap variabel yang berbeda. Parameter fungsi juga termasuk local variable.',
          'Variabel yang dibuat di luar semua fungsi disebut global variable. Berbeda dengan beberapa bahasa lain, PHP TIDAK otomatis memberi akses variabel global dari dalam fungsi: nama yang sama di dalam fungsi dianggap variabel baru yang belum terisi (nilainya `null`). Untuk memakainya, variabel harus dideklarasikan eksplisit dengan kata kunci `global`. Dengan begitu fungsi bisa membaca sekaligus mengubah variabel global aslinya:',
          '```php\n<?php\n$hitungan = 0;\n\nfunction tambah() {\n    global $hitungan;\n    $hitungan++;\n}\n\ntambah();\necho $hitungan;   // 1\n```',
          'Praktik yang baik: hindari terlalu banyak variabel global karena membuat kode sulit dilacak alurnya — lebih baik lewatkan data lewat parameter dan return value fungsi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
$pesan = "Halo dari luar fungsi";
$hitungan = 0;

function tanpa_global() {
    // $pesan dibuat di luar fungsi, jadi di sini dianggap variabel yang belum ada
    echo isset($pesan) ? "Terlihat\\n" : "Tidak terlihat di dalam fungsi\\n";
}

function dengan_global() {
    global $pesan, $hitungan;
    echo "Dengan global: $pesan\\n";
    $hitungan++;   // mengubah variabel global yang asli
}

function buat_lokal() {
    $rahasia = "hanya hidup di dalam fungsi";
}

function tambah_ongkir($harga) {
    return $harga + 5000;   // $harga hanya ada di dalam fungsi ini
}

tanpa_global();
dengan_global();
dengan_global();
echo "Hitungan sekarang: $hitungan\\n";

buat_lokal();
var_dump(isset($rahasia));   // false, variabel lokal tidak terlihat dari luar

$total = tambah_ongkir(20000);   // lebih baik: data lewat parameter dan return
echo "Total: $total\\n";
`,
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
            ['Ya, seperti di JavaScript fungsi selalu bisa membaca variabel di luarnya', false],
            ['Ya untuk membaca nilainya; kata kunci global hanya wajib kalau ingin mengubahnya', false],
            ['Ya, asalkan variabel global dibuat sebelum fungsinya didefinisikan', false],
          ]),
          q('Apa yang dicetak oleh: $x = 5; function ubah() { $x = 10; } ubah(); echo $x;', [
            ['5, karena $x di dalam fungsi adalah variabel local yang berbeda', true],
            ['10, karena fungsi mengubah $x yang sama', false],
            ['Tidak ada, karena $x hilang setelah fungsi dipanggil', false],
          ]),
          q('Bagaimana cara yang lebih baik daripada memakai banyak variabel global?', [
            ['Mengirim data lewat parameter dan mengembalikan hasil lewat return', true],
            ['Mendeklarasikan semua variabel dengan global di baris pertama file', false],
            ['Menulis nama variabel global dengan huruf besar semua', false],
          ]),
        ],
      },
      {
        title: 'Include/Require Dasar',
        slug: 'phpfz-include-require',
        content: [
          'PHP mendukung modularitas kode dengan memecah program jadi beberapa file terpisah, lalu menggabungkannya kembali memakai `include`, `include_once`, `require`, atau `require_once`. Keempatnya adalah language construct (bagian dari sintaks PHP), bukan fungsi biasa, sehingga kurung di sekitar nama file tidak diperlukan: tulis `require \'koneksi.php\';`, bukan `require(\'koneksi.php\');`.',
          '## include dan require',
          'Perbedaan `include` dan `require`: kalau file yang dipanggil tidak ditemukan, `include` hanya menampilkan warning dan program tetap lanjut jalan, sedangkan `require` menghentikan program sepenuhnya (fatal error) — dipakai untuk file yang benar-benar wajib ada, misal file koneksi database.',
          '## Versi _once',
          'Versi `_once` (`include_once`/`require_once`) memastikan file yang sama hanya dimasukkan satu kali meski dipanggil berkali-kali di tempat berbeda. Ini mencegah error karena deklarasi fungsi/class ganda: kalau file berisi fungsi dimasukkan dua kali dengan `include`/`require` biasa, PHP berhenti dengan fatal error "Cannot redeclare" karena nama fungsi yang sama tidak boleh dideklarasikan dua kali.',
          'Contoh dua file berikut tidak jalan di sandbox, karena sandbox hanya menjalankan satu file. Kalau ingin mencobanya, simpan keduanya di komputermu dalam satu folder. File pertama berisi fungsi yang akan dipakai:',
          '```php\n<?php\n// koneksi.php\nfunction koneksi_ke_database() {\n    return "terhubung";\n}\n```',
          'File kedua memakai file pertama, jadi ini juga tidak jalan di sandbox:',
          '```php\n<?php\n// index.php\nrequire_once \'koneksi.php\';   // wajib: fatal error kalau file tidak ada\ninclude \'sidebar.php\';        // opsional: hanya warning kalau file tidak ada\nrequire_once \'koneksi.php\';   // dilewati karena sudah pernah dimasukkan\n\necho koneksi_ke_database();\n```',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama antara include dan require kalau file tidak ditemukan?', [
            ['include hanya warning & lanjut, require fatal error & berhenti', true],
            ['Keduanya identik tanpa perbedaan', false],
            ['include selalu fatal error, require hanya warning', false],
            ['Keduanya menghentikan program dengan fatal error, hanya teks pesannya yang berbeda', false],
          ]),
          q('Pernyataan mana yang mencegah file yang sama dimasukkan lebih dari sekali?', [
            ['require_once atau include_once', true],
            ['include biasa, karena PHP otomatis melewati file yang sudah pernah dimasukkan', false],
            ['require biasa, karena fatal error hanya terjadi sekali per program', false],
            ['use, seperti import di bahasa lain', false],
          ]),
          q('Apa status include dan require di PHP?', [
            ['Language construct, bagian dari sintaks PHP, sehingga kurung di sekitar nama file tidak wajib', true],
            ['Fungsi bawaan seperti strlen(), sehingga kurung di sekitar nama file wajib', false],
            ['Statement khusus yang hanya boleh ditulis di baris-baris awal file, sebelum kode lain', false],
          ]),
          q('File fungsi.php berisi fungsi hitung(), lalu dimasukkan dua kali dengan require. Apa yang terjadi?', [
            ['Fatal error, karena fungsi hitung() dideklarasikan dua kali', true],
            ['hitung() otomatis dijalankan dua kali', false],
            ['PHP diam-diam memakai deklarasi pertama dan mengabaikan yang kedua', false],
            ['Hanya muncul warning, dan program tetap lanjut', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'OOP, Exception & Ringkasan',
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
          '## Visibilitas: public, protected, private',
          'Setiap property dan method punya visibilitas yang menentukan dari mana ia boleh diakses. `public` bisa diakses dari mana saja. `protected` hanya bisa diakses dari dalam class itu sendiri dan class turunannya (pewarisan class tidak dibahas di course ini). `private` hanya bisa diakses dari dalam class yang mendefinisikannya. Method yang ditulis tanpa penanda visibilitas otomatis `public`.',
          'Mengakses member `private` atau `protected` dari luar class menyebabkan Fatal error. Itu disengaja: data hanya bisa diubah lewat method milik class sendiri, sehingga class bisa menjaga nilainya tetap masuk akal (prinsip ini disebut encapsulation). Biasanya class menyediakan method `public` untuk membaca nilainya, misal `getNama()`.',
          '```php\n<?php\nclass Rekening {\n    private $saldo = 0;\n\n    public function setor($jumlah) {\n        $this->saldo += $jumlah;\n    }\n\n    public function lihatSaldo() {\n        return $this->saldo;\n    }\n}\n\n$r = new Rekening();\n$r->setor(1000);\necho $r->lihatSaldo();   // 1000\n// echo $r->saldo;       // Fatal error: Cannot access private property\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
class Siswa {
    private $nama;
    protected $umur;

    public function __construct($nama, $umur) {
        $this->nama = $nama;
        $this->umur = $umur;
    }

    public function getNama() {
        return $this->nama;
    }

    public function perkenalan() {
        echo "Halo, saya {$this->nama}, umur {$this->umur} tahun\\n";
    }
}

$siswa1 = new Siswa("Budi", 20);
$siswa2 = new Siswa("Siti", 22);

$siswa1->perkenalan();
$siswa2->perkenalan();
echo "Nama lewat method: " . $siswa1->getNama() . "\\n";

// Hapus tanda // di baris berikut untuk mencoba: Fatal error karena $nama bersifat private
// echo $siswa1->nama;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dirujuk oleh $this di dalam method sebuah class?', [
            ['Object itu sendiri yang sedang menjalankan method tersebut', true],
            ['Class induk dari class tersebut', false],
            ['Object terakhir yang dibuat dengan new dari class yang sama', false],
            ['Class itu sendiri sebagai cetakan, bukan object-nya', false],
          ]),
          q('Apa yang terjadi kalau kode di luar class menjalankan echo $siswa1->nama; padahal $nama berstatus private?', [
            ['Fatal error, karena property private hanya bisa diakses dari dalam class', true],
            ['Nilainya tercetak biasa, karena private hanya berlaku untuk method', false],
            ['Tercetak teks kosong tanpa pesan apa pun, program lanjut', false],
          ]),
          q('Apa arti visibilitas protected?', [
            ['Bisa diakses dari dalam class itu sendiri dan class turunannya, tapi tidak dari luar', true],
            ['Bisa diakses dari mana saja, tapi nilainya tidak boleh diubah', false],
            ['Hanya bisa diakses dari dalam class yang mendefinisikannya, class turunan pun tidak boleh', false],
          ]),
        ],
      },
      {
        title: 'try/catch & Exception',
        slug: 'phpfz-try-catch-exception',
        content: [
          'Saat program berjalan, hal yang tak terduga bisa terjadi: pembagi nol, data tidak valid, file yang hilang. PHP menangani situasi ini dengan exception. Kode yang menemukan masalah "melempar" exception dengan `throw new Exception("pesan")`, dan kode di sekitarnya bisa "menangkapnya" dengan `try`/`catch` supaya program tidak langsung berhenti.',
          '## try, catch, dan finally',
          '`try` membungkus kode yang mungkin gagal. Begitu exception dilempar, sisa kode di dalam `try` dilewati dan PHP lompat ke blok `catch (Exception $e)`. Di dalam `catch`, `$e->getMessage()` mengembalikan pesan exception. Blok `finally` bersifat opsional dan selalu dijalankan, entah ada exception atau tidak, cocok untuk pekerjaan bersih-bersih. Exception yang tidak ditangkap menghentikan program dengan Fatal error.',
          '```php\n<?php\nfunction bagi($a, $b) {\n    if ($b == 0) {\n        throw new Exception("Pembagi tidak boleh nol");\n    }\n    return $a / $b;\n}\n\ntry {\n    echo bagi(10, 0);\n} catch (Exception $e) {\n    echo "Error: " . $e->getMessage();   // Error: Pembagi tidak boleh nol\n} finally {\n    echo " (selesai)";\n}\n```',
          '## Exception dan Error',
          'PHP punya dua jenis objek yang bisa dilempar. `Exception` biasanya dilempar oleh kode kita sendiri. Kesalahan yang dilempar oleh PHP, misal `intdiv(10, 0)` (pembagian bilangan bulat) yang melempar `DivisionByZeroError`, termasuk class `Error`, bukan `Exception`. Karena itu `catch (Exception $e)` TIDAK menangkapnya. Untuk menangkap keduanya, pakai `catch (Throwable $e)`; `Throwable` adalah induk dari `Exception` dan `Error`. Catatan: operator `/` pada PHP 7.4 hanya memberi warning kalau pembaginya nol, baru PHP 8 yang melempar `DivisionByZeroError` juga untuk `/`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `<?php
function bagi($a, $b) {
    if ($b == 0) {
        throw new Exception("Pembagi tidak boleh nol");
    }
    return $a / $b;
}

try {
    echo "Hasil: " . bagi(10, 2) . "\\n";
    echo "Hasil: " . bagi(10, 0) . "\\n";   // melempar exception, baris-baris sesudahnya dilewati
    echo "Baris ini tidak pernah dicetak\\n";
} catch (Exception $e) {
    echo "Terjadi error: " . $e->getMessage() . "\\n";
} finally {
    echo "Blok finally selalu dijalankan\\n";
}

echo "Program tetap lanjut setelah try/catch\\n";

// intdiv() melempar DivisionByZeroError, yang termasuk Error, bukan Exception.
// Karena itu perlu catch (Throwable ...); get_class() mencetak nama class dari objeknya.
try {
    echo intdiv(10, 0);
} catch (Throwable $e) {
    echo get_class($e) . ": " . $e->getMessage() . "\\n";
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kapan blok finally dijalankan?', [
            ['Selalu, baik ada exception maupun tidak', true],
            ['Hanya kalau ada exception yang ditangkap oleh catch', false],
            ['Hanya kalau tidak ada exception sama sekali', false],
            ['Hanya kalau blok catch tidak ditulis', false],
          ]),
          q('Apa yang terjadi pada baris di dalam try yang ada sesudah baris yang melempar exception?', [
            ['Dilewati, eksekusi lompat ke blok catch yang cocok', true],
            ['Tetap dijalankan, baru kemudian catch dijalankan', false],
            ['Dijalankan setelah blok catch selesai', false],
            ['Program berhenti total tanpa menjalankan catch', false],
          ]),
          q('Mengapa catch (Exception $e) tidak menangkap kesalahan dari intdiv(10, 0)?', [
            ['intdiv() melempar DivisionByZeroError yang termasuk Error, bukan Exception; pakai Throwable untuk menangkap keduanya', true],
            ['intdiv() tidak melempar apa pun, ia hanya mengembalikan false', false],
            ['catch hanya berlaku untuk exception dari kode kita sendiri; kesalahan milik PHP tidak pernah bisa ditangkap', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'phpfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita akan menggabungkan semua yang sudah dipelajari: array, fungsi, dan class, dalam satu program utuh yang menghitung nilai rata-rata beberapa siswa dan menentukan status kelulusan masing-masing.',
          'Program di bawah membuat beberapa object `Siswa` dari sebuah class, menyimpannya dalam array, lalu menggunakan `foreach` dan fungsi buatan sendiri untuk memproses data setiap siswa — persis alur kerja aplikasi PHP sungguhan yang mengolah data dari database.',
          'Sepanjang course ini kita sudah belajar sintaks dasar, tipe data, operator, kontrol alur, array, fungsi, OOP dasar, hingga penanganan error dengan `try`/`catch` — fondasi yang cukup untuk mulai membangun aplikasi PHP yang lebih kompleks, termasuk yang terhubung ke database dan web framework.',
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

const course: CourseDef = {
  title: 'PHP from Zero',
  slug: 'php-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'PHP from Zero adalah course pengantar untuk kamu yang belum pernah menulis PHP, bahasa server-side yang menjalankan WordPress dan banyak website dinamis lainnya. Cocok sebagai bahasa pertama untuk web development; pengalaman di bahasa lain membantu tapi tidak wajib.',
    'Di sini kamu belajar struktur dasar file PHP, variabel, tipe data (termasuk membaca output `gettype()` dan `var_dump()`), `null` dengan `isset()`, `empty()`, dan operator `??`, operator (termasuk jebakan `and`/`or` dibanding `&&`/`||`), string, type juggling dan type casting, percabangan `if`/`elseif` dan `switch`, perulangan, array indexed dan associative, fungsi array bawaan, fungsi, scope variabel, `include`/`require`, serta class, object, constructor, visibilitas `public`/`protected`/`private`, dan penanganan error dengan `try`/`catch`/`finally`, ditutup dengan studi kasus yang menggabungkan semuanya. Lesson pembuka juga menjelaskan cara PHP menerima data form lewat `$_GET`/`$_POST` dan mengamankan outputnya dengan `htmlspecialchars()`. Hampir semua lesson punya contoh kode yang bisa langsung dijalankan di code sandbox dan dilengkapi quiz pilihan ganda.',
    'Sandbox di course ini menjalankan kode dengan PHP 7.4 lewat baris perintah, tanpa akses jaringan dan tanpa input keyboard, jadi `$_GET`/`$_POST` tidak bisa dicoba di sana dan fitur yang lebih baru dari PHP 7.4 (misalnya `match`) tidak dipakai di contoh. Beberapa pesan error, seperti Notice, berbeda tingkatnya di PHP 8, dan perbedaan itu disebut di lesson terkait. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun.',
  ].join('\n\n'),
  sandboxLanguage: 'php',
  modules,
}

export default course
