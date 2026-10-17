import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan C',
    lessons: [
      {
        title: 'Apa itu C?',
        slug: 'cfz-apa-itu-c',
        content: [
          'C adalah bahasa pemrograman tingkat rendah-menengah yang dibuat oleh Dennis Ritchie di Bell Labs pada awal tahun 1970-an, awalnya untuk menulis ulang sistem operasi Unix. C menjadi salah satu bahasa paling berpengaruh sepanjang sejarah komputasi.',
          'Meski usianya sudah puluhan tahun, C masih sangat relevan hari ini: sistem operasi (Linux kernel, Windows), firmware embedded system, driver perangkat keras, dan bahkan komponen inti interpreter/runtime bahasa lain (Python, PHP) ditulis dalam C karena performanya yang mendekati bahasa mesin.',
          'C adalah compiled language — kode sumber (`.c`) harus diproses oleh compiler (misalnya GCC) menjadi file executable (biner mesin) sebelum bisa dijalankan, berbeda dengan interpreted language seperti Python yang dijalankan baris per baris oleh interpreter.',
          'C juga dikenal sebagai bahasa yang "dekat dengan mesin" — memberi programmer kontrol langsung atas memori (lewat pointer) dan sumber daya sistem, dengan konsekuensi tanggung jawab yang lebih besar dibanding bahasa modern yang punya garbage collector otomatis.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa pencipta bahasa C?', [
            ['Dennis Ritchie', true],
            ['Guido van Rossum', false],
            ['Linus Torvalds', false],
            ['James Gosling', false],
          ]),
          q('C awalnya dibuat untuk keperluan apa?', [
            ['Menulis ulang sistem operasi Unix', true],
            ['Menulis kernel Linux', false],
            ['Membuat bahasa scripting untuk mengotomasi tugas di terminal', false],
            ['Menggantikan Fortran untuk komputasi ilmiah di superkomputer', false],
          ]),
          q('C adalah jenis bahasa apa dari segi eksekusi?', [
            ['Compiled language', true],
            ['Interpreted language', false],
            ['Markup language', false],
            ['Query language', false],
          ]),
          q('Apa yang membedakan C dengan bahasa modern yang punya garbage collector?', [
            ['C memberi programmer kontrol langsung atas memori', true],
            ['C tidak bisa mengelola memori sama sekali', false],
            ['C otomatis membersihkan semua memori tanpa pointer', false],
            ['C tidak butuh compiler', false],
          ]),
        ],
      },
      {
        title: 'Struktur Program C Dasar',
        slug: 'cfz-struktur-program-c-dasar',
        content: [
          'Setiap program C butuh minimal satu fungsi bernama `main` — ini adalah titik awal eksekusi program, dipanggil otomatis saat program dijalankan.',
          'Baris `#include <stdio.h>` di awal file adalah preprocessor directive yang menyalin isi header standard I/O ke dalam kode kita, menyediakan fungsi seperti `printf` untuk mencetak teks ke layar.',
          'Fungsi `main` biasa dituliskan sebagai `int main(void) { ... }` — kata `int` berarti fungsi ini mengembalikan angka, dan `return 0;` di akhir menandakan program selesai dengan sukses (tanpa error) ke sistem operasi.',
          'Setiap statement di C diakhiri titik koma (`;`), dan blok kode dikelompokkan dengan kurung kurawal `{}` — berbeda dengan Python yang memakai indentasi sebagai penentu blok.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int main(void) {
    printf("Halo, C!\\n");
    printf("Ini program C pertama saya.\\n");
    return 0;
}
`,
      },
      {
        title: 'Compile & Run',
        slug: 'cfz-compile-run',
        content: [
          'Compiler adalah program yang menerjemahkan source code (`.c`) menjadi bahasa mesin (biner) yang bisa langsung dieksekusi prosesor. Untuk C, compiler yang umum dipakai adalah GCC (GNU Compiler Collection); Clang adalah alternatif lain yang cara pakainya mirip.',
          'Prosesnya biasanya dua langkah: compile dulu, lalu jalankan hasilnya. Opsi `-o` menentukan nama file executable yang dihasilkan; kalau `-o` tidak ditulis, GCC menamainya `a.out`.',
          '```bash\ngcc program.c -o program\n./program\n```',
          'Awalan `./` berarti "file di folder saat ini". Kalau ada kesalahan sintaks, compiler menolak menghasilkan executable dan menampilkan pesan `error` di tahap compile — bukan saat program berjalan. Pesan `warning` berbeda: compile tetap berhasil, tapi compiler memberi tahu ada kode yang mencurigakan. Opsi `-Wall` (warning all) menyalakan peringatan tambahan, dan sebaiknya selalu dipakai: `gcc -Wall program.c -o program`.',
          'Ini beda mendasar dengan interpreted language seperti Python: di Python, error baru ketahuan saat baris bermasalah itu benar-benar dieksekusi (runtime), sedangkan di C banyak kesalahan (tipe data salah, titik koma hilang, fungsi tidak dikenal) sudah tertangkap sebelum program pernah dijalankan sekali pun. Tapi compiler tidak menangkap semuanya: kesalahan seperti mengakses index array di luar batas tetap lolos compile dan baru bermasalah saat program berjalan.',
          'Konsekuensinya, program C yang sudah berhasil di-compile umumnya berjalan lebih cepat karena tidak ada overhead penerjemahan saat runtime — semua penerjemahan sudah selesai di tahap compile.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dihasilkan compiler dari file program.c?', [
            ['File executable berisi instruksi mesin yang bisa dijalankan sistem operasi', true],
            ['File bytecode yang harus dijalankan oleh interpreter C setiap kali program dipakai', false],
            ['File program.c baru yang sudah dioptimalkan sehingga bisa langsung dieksekusi', false],
            ['File executable yang baru terbentuk setelah perintah ./program dijalankan', false],
          ]),
          q('Kapan kesalahan sintaks di C biasanya terdeteksi?', [
            ['Saat proses compile, sebelum program dijalankan', true],
            ['Hanya saat program dijalankan (runtime)', false],
            ['Tidak pernah terdeteksi otomatis', false],
            ['Setelah program selesai berjalan', false],
          ]),
          q('Perintah apa untuk meng-compile program.c menjadi executable bernama program?', [
            ['gcc program.c -o program', true],
            ['gcc program.c (nama executable otomatis mengikuti nama file sumber)', false],
            ['gcc -o program.c program', false],
            ['./program.c', false],
          ]),
          q('Mana kesalahan yang biasanya lolos compile dan baru bermasalah saat program berjalan?', [
            ['Mengakses index array di luar batas ukurannya', true],
            ['Lupa menulis titik koma di akhir statement', false],
            ['Lupa menutup kurung kurawal di akhir fungsi', false],
            ['Memakai nama variabel yang belum pernah dideklarasikan', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Variabel & Tipe Data',
    lessons: [
      {
        title: 'Variabel & Tipe Data Dasar',
        slug: 'cfz-variabel-tipe-data-dasar',
        content: [
          'Berbeda dengan Python yang dynamically typed, C adalah statically typed — setiap variabel harus dideklarasikan dengan tipe data eksplisit sebelum dipakai, dan tipe itu tidak bisa berubah selama program berjalan.',
          'Empat tipe data dasar yang paling sering dipakai: `int` (bilangan bulat, misal 10), `float` (bilangan desimal presisi tunggal, misal 3.14f), `double` (bilangan desimal presisi ganda, lebih akurat dari float), dan `char` (satu karakter tunggal, misal \'A\').',
          'Deklarasi variabel di C mengikuti pola `tipe nama_variabel = nilai;`, contoh: `int umur = 20;`. Variabel bisa dideklarasikan tanpa nilai awal lalu diisi belakangan, tapi untuk variabel lokal (yang dideklarasikan di dalam fungsi, seperti di `main`) nilainya akan berisi sampah (garbage value) — nilai acak yang tidak boleh diandalkan — sampai benar-benar diisi. Variabel global (dideklarasikan di luar fungsi apa pun) dan variabel `static` berbeda: keduanya otomatis diisi 0 kalau tidak diberi nilai awal.',
          'Aturan penamaan variabel di C: hanya huruf, angka, underscore (`_`), tidak boleh diawali angka, case-sensitive, dan tidak boleh memakai kata kunci reserved seperti `int` atau `return` sebagai nama variabel.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int main(void) {
    int umur = 20;
    float tinggi_badan = 165.5f;
    double luas_bumi = 510072000.75;
    char inisial = 'B';

    printf("Umur: %d tahun\\n", umur);
    printf("Tinggi badan: %.1f cm\\n", tinggi_badan);
    printf("Luas bumi (approx): %.2f km2\\n", luas_bumi);
    printf("Inisial: %c\\n", inisial);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('C bersifat statically typed, artinya?', [
            ['Tipe variabel harus dideklarasikan eksplisit dan tidak berubah', true],
            ['Tipe variabel ditentukan otomatis saat runtime', false],
            ['Semua variabel dianggap string', false],
            ['C tidak punya konsep tipe data', false],
          ]),
          q('Tipe data apa untuk menyimpan satu karakter tunggal?', [
            ['char', true],
            ['int', false],
            ['float', false],
            ['double', false],
          ]),
          q('Apa yang terjadi kalau variabel lokal di dalam main dideklarasikan tanpa nilai awal lalu langsung dipakai?', [
            ['Berisi garbage value (nilai sampah) yang tidak boleh diandalkan', true],
            ['Otomatis bernilai 0 karena C mengisi nol untuk semua variabel baru', false],
            ['Program pasti gagal compile', false],
            ['Program berhenti dengan pesan error runtime saat variabel itu dibaca', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'cfz-operator',
        content: [
          'Operator aritmatika di C: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo, hanya untuk integer). Perlu hati-hati: pembagian antar dua `int` di C menghasilkan hasil integer (desimalnya dibuang), misal `7 / 2` menghasilkan `3`, bukan `3.5`.',
          '## Assignment, increment, dan decrement',
          'Selain `=`, ada operator assignment gabungan: `+=`, `-=`, `*=`, `/=`, dan `%=`. Ekspresi `x += 3` artinya `x = x + 3`. Untuk menambah atau mengurangi 1 ada `++` dan `--`, yang sering dipakai di perulangan.',
          'Operator `++` dan `--` punya dua bentuk. Bentuk postfix (`x++`) menghasilkan nilai x yang lama lalu menaikkan x; bentuk prefix (`++x`) menaikkan x dulu lalu menghasilkan nilai barunya. Kalau ditulis sebagai statement sendiri hasilnya sama; bedanya baru terasa saat nilai ekspresinya dipakai:',
          '```c\nint x = 5;\nx += 3;           // x menjadi 8\nx++;              // x menjadi 9\nint lama = x++;   // lama = 9, x menjadi 10\nint baru = ++x;   // x menjadi 11, baru = 11\n```',
          '## Operator perbandingan dan logika',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — hasilnya berupa `int`, `1` untuk benar dan `0` untuk salah. Sejak C99, C punya tipe boolean bawaan bernama `_Bool` yang hanya menyimpan `0` atau `1`. Header `<stdbool.h>` tidak menambah tipe baru, hanya menyediakan macro `bool` (sama dengan `_Bool`), `true` (sama dengan `1`), dan `false` (sama dengan `0`) supaya kode lebih enak dibaca.',
          'Operator logika: `&&` (AND), `||` (OR), `!` (NOT) — dipakai menggabungkan beberapa kondisi, mengembalikan `1` atau `0` sama seperti operator perbandingan.',
          '## Urutan prioritas (precedence)',
          'Kalau satu ekspresi memakai beberapa operator, C mengikuti urutan prioritas, bukan sekadar kiri ke kanan. Dari yang paling dulu dihitung: `!`, `++`, `--`; lalu `*`, `/`, `%`; lalu `+`, `-`; lalu `<`, `<=`, `>`, `>=`; lalu `==`, `!=`; lalu `&&`; lalu `||`; terakhir assignment (`=`, `+=`, dan sejenisnya). Tanda kurung `()` selalu didahulukan, jadi pakai kurung kalau ragu atau supaya maksud kode lebih jelas.',
          '```c\nint a = 2 + 3 * 4;      // 14: perkalian dulu\nint b = (2 + 3) * 4;    // 20: kurung didahulukan\nint c = 10 - 4 / 2;     // 8, bukan 3\nint d = 2 + 3 > 4;      // (2 + 3) > 4, hasilnya 1\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int a = 10;
    int b = 3;

    printf("Penjumlahan: %d\\n", a + b);
    printf("Pembagian integer: %d\\n", a / b);
    printf("Sisa bagi: %d\\n", a % b);

    printf("Perbandingan a > b: %d\\n", a > b);
    printf("Logika (a > b) && (b > 0): %d\\n", (a > b) && (b > 0));

    int skor = 5;
    skor += 3;
    printf("skor setelah += 3: %d\\n", skor);
    skor++;
    printf("skor setelah ++: %d\\n", skor);
    int lama = skor++;
    printf("lama = %d, skor = %d\\n", lama, skor);
    int baru = ++skor;
    printf("baru = %d, skor = %d\\n", baru, skor);

    printf("2 + 3 * 4 = %d\\n", 2 + 3 * 4);
    printf("(2 + 3) * 4 = %d\\n", (2 + 3) * 4);

    bool lulus = skor >= 10;
    printf("lulus = %d\\n", lulus);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Setelah int x = 5; int y = x++; berapa nilai x dan y?', [
            ['x = 6 dan y = 5', true],
            ['x = 6 dan y = 6', false],
            ['x = 5 dan y = 5', false],
            ['x = 5 dan y = 6', false],
          ]),
          q('Bagaimana urutan prioritas operator di C, dari yang dihitung paling dulu?', [
            ['Perkalian (*), penjumlahan (+), perbandingan (>), lalu logika (&&)', true],
            ['Logika (&&), perbandingan (>), penjumlahan (+), lalu perkalian (*)', false],
            ['Penjumlahan (+), perkalian (*), logika (&&), lalu perbandingan (>)', false],
            ['Semua operator setara prioritasnya dan dihitung dari kiri ke kanan', false],
          ]),
          q('Pernyataan mana yang benar tentang _Bool dan <stdbool.h>?', [
            ['_Bool adalah tipe bawaan sejak C99; <stdbool.h> hanya menambah macro bool, true, dan false', true],
            ['Tipe boolean baru ada kalau <stdbool.h> di-include; tanpa itu C tidak punya tipe boolean', false],
            ['<stdbool.h> mengubah hasil operator perbandingan dari int menjadi tipe bool', false],
            ['true dan false adalah keyword bawaan C sejak versi pertamanya', false],
          ]),
        ],
      },
      {
        title: 'printf & Format Specifier',
        slug: 'cfz-printf-format-specifier',
        content: [
          '`printf` adalah fungsi standar C untuk mencetak teks ke layar, disediakan lewat header `<stdio.h>`. Untuk mencetak nilai variabel di tengah teks, `printf` memakai format specifier — placeholder yang diganti dengan nilai variabel sesuai urutan argumen.',
          'Format specifier yang paling umum:',
          '- `%d` untuk `int` (bilangan bulat bertanda)\n- `%u` untuk `unsigned int` (bilangan bulat tanpa tanda)\n- `%ld` untuk `long`, dan `%lld` untuk `long long`\n- `%zu` untuk `size_t`, tipe hasil `sizeof` dan `strlen`\n- `%f` untuk `float` atau `double`\n- `%c` untuk satu karakter (`char`)\n- `%s` untuk string (array karakter yang diakhiri null terminator)\n- `%%` untuk mencetak tanda persen itu sendiri',
          'Tipe argumen harus cocok dengan specifier-nya. Misalnya `printf("%d", 3.14)` adalah undefined behavior: hasilnya bisa berupa angka ngawur, bukan 3. Menyalakan opsi `-Wall` saat compile membuat GCC memperingatkan ketidakcocokan seperti ini.',
          'Karakter escape `\\n` menyisipkan baris baru (newline), dan `\\t` menyisipkan tab — keduanya sering dipakai di dalam string `printf` untuk merapikan tampilan output.',
          '## Lebar field dan presisi',
          'Antara `%` dan huruf specifier boleh disisipkan lebar minimum field. `%5d` mencetak integer rata kanan dalam 5 kolom, `%-5d` rata kiri, dan `%05d` mengisi kolom kosong dengan angka 0. Untuk `float`/`double`, `%.2f` menampilkan tepat 2 angka di belakang koma, dan keduanya bisa digabung: `%8.2f` berarti lebar 8 kolom dengan 2 desimal.',
          '```c\nprintf("[%5d]\\n", 42);        // [   42]\nprintf("[%-5d]\\n", 42);       // [42   ]\nprintf("[%05d]\\n", 42);       // [00042]\nprintf("[%8.2f]\\n", 3.14159); // [    3.14]\nprintf("Diskon %d%%\\n", 15);  // Diskon 15%\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>
#include <string.h>

int main(void) {
    int umur = 20;
    unsigned int stok = 4000000000u;
    long populasi = 270000000L;
    float ipk = 3.75f;
    char grade = 'A';
    char nama[] = "Siswa BarisORG";

    printf("Nama: %s\\n", nama);
    printf("Umur: %d tahun\\n", umur);
    printf("Stok (unsigned): %u\\n", stok);
    printf("Populasi (long): %ld\\n", populasi);
    printf("IPK: %.2f\\n", ipk);
    printf("Grade: %c\\n", grade);
    printf("Panjang nama: %zu karakter\\n", strlen(nama));
    printf("Lulus dengan nilai %d%%\\n", 85);

    printf("[%5d]\\n", 42);
    printf("[%-5d]\\n", 42);
    printf("[%05d]\\n", 42);
    printf("[%8.2f]\\n", 3.14159);

    printf("Baris ini\\tpakai tab\\ndan baris ini baris baru.\\n");

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Format specifier mana yang tepat untuk mencetak hasil strlen atau sizeof (bertipe size_t)?', [
            ['%zu', true],
            ['%d', false],
            ['%u', false],
            ['%f', false],
          ]),
          q('Apa yang dicetak oleh printf("[%5d]", 42)?', [
            ['[   42]', true],
            ['[42   ]', false],
            ['[00042]', false],
            ['[42]', false],
          ]),
          q('Bagaimana mencetak tanda persen sungguhan, misalnya "Diskon 15%"?', [
            ['Menulis %% di dalam format string: "Diskon 15%%"', true],
            ['Menulis % langsung di dalam format string: "Diskon 15%"', false],
            ['Menulis garis miring terbalik sebelum persen: "Diskon 15\\%"', false],
          ]),
        ],
      },
      {
        title: 'Konstanta & Type Casting',
        slug: 'cfz-konstanta-type-casting',
        content: [
          'Konstanta adalah nilai yang tidak boleh berubah setelah didefinisikan. Ada dua cara umum membuat konstanta di C: kata kunci `const` (misal `const int MAX = 100;`, variabel bertipe yang diperiksa compiler dan tidak boleh diubah) dan preprocessor directive `#define` (misal `#define MAX 100`, diganti langsung oleh preprocessor sebelum compile, tanpa tipe data).',
          'Keduanya punya tempat masing-masing; `const` bukan pengganti yang "lebih modern" untuk `#define`. `const` punya tipe data yang jelas dan diperiksa compiler, sedangkan `#define` sekadar text substitution murni sebelum tahap compile. Bedanya penting di C: variabel `const int` bukan constant expression, jadi tidak bisa dipakai di tempat yang mewajibkan nilai konstan sungguhan, seperti label `case` di `switch` atau ukuran array global (keduanya dibahas di modul berikutnya). `#define MAX 100` boleh dipakai di sana, karena preprocessor mengganti `MAX` menjadi literal `100`.',
          '## Type casting',
          'Type casting adalah mengubah nilai dari satu tipe data ke tipe lain secara eksplisit, ditulis dengan menaruh nama tipe dalam kurung sebelum nilai, misal `(float) 7 / 2`. Cast hanya berlaku untuk `7` (prioritasnya lebih tinggi dari `/`), sehingga `7` jadi float dulu dan hasil pembagian jadi `3.5`, bukan `3` seperti pembagian integer biasa.',
          '## Konversi otomatis antar tipe',
          'Tanpa cast pun C tetap mengubah tipe secara otomatis kalau kedua operand berbeda tipe, lewat aturan yang disebut usual arithmetic conversions: operand dikonversi ke common type yang lebih "tinggi", bukan yang paling sempit. Tipe floating-point mengalahkan tipe integer (`double` mengalahkan `float`), dan di antara integer, umumnya tipe yang lebih lebar menang (`long` mengalahkan `int`). Tipe yang lebih sempit dari `int`, seperti `char`, lebih dulu dinaikkan menjadi `int`.',
          'Jadi `5 / 2.0` menghasilkan `2.5`: `5` otomatis dikonversi ke `double` sebelum dibagi. Sedangkan `7 / 2` yang dua-duanya `int` tidak punya apa-apa untuk dikonversi, jadi hasilnya tetap `3`. Konversi ke arah sebaliknya (dari desimal ke integer) membuang bagian desimal, bukan membulatkan. Perhatikan juga bahwa cast harus diletakkan sebelum pembagian terjadi: `(float) (a / b)` terlambat, karena `a / b` sudah dihitung sebagai integer.',
          '```c\nint a = 7;\nint b = 2;\ndouble d1 = a / b;            // 3.0: a / b dihitung sebagai int (3) dulu\ndouble d2 = (double) a / b;   // 3.5: a dinaikkan menjadi double\ndouble d3 = a / 2.0;          // 3.5: a otomatis menjadi double\ndouble desimal = 3.9;\nint n = desimal;               // 3: desimal dibuang, bukan dibulatkan\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

#define MAX_NILAI 100

int main(void) {
    const float PAJAK = 0.11f;

    printf("Nilai maksimum: %d\\n", MAX_NILAI);
    printf("Pajak: %.2f\\n", PAJAK);

    int a = 7;
    int b = 2;
    printf("Pembagian integer biasa: %d\\n", a / b);
    printf("Pembagian setelah casting ke float: %.1f\\n", (float) a / b);
    printf("Int dibagi double (konversi otomatis): %.1f\\n", a / 2.0);
    printf("Cast setelah pembagian (terlambat): %.1f\\n", (float) (a / b));

    double desimal = 3.9;
    int terpotong = desimal;
    printf("int dari 3.9: %d\\n", terpotong);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama const dan #define di C?', [
            ['const adalah variabel bertipe yang diperiksa compiler; #define sekadar text substitution tanpa tipe', true],
            ['const diganti preprocessor sebelum compile; #define adalah variabel bertipe yang diperiksa compiler', false],
            ['const boleh diubah nilainya setelah dideklarasikan; #define tidak boleh', false],
            ['const dan #define identik: keduanya variabel bertipe yang disimpan di memori', false],
          ]),
          q('Hasil dari 7 / 2 di C jika keduanya bertipe int adalah?', [
            ['3 (desimal dibuang)', true],
            ['3.5', false],
            ['4 (dibulatkan ke atas)', false],
            ['Error compile', false],
          ]),
          q('Apa hasil 5 / 2.0 di C, dan kenapa?', [
            ['2.5, karena 5 otomatis dikonversi ke double sebelum dibagi', true],
            ['2, karena operand dihitung dengan tipe paling sempit di antara keduanya (int)', false],
            ['2.5, tapi hanya kalau ditulis dengan cast eksplisit: (double) 5 / 2.0', false],
            ['Error compile, karena kedua operand berbeda tipe', false],
          ]),
          q('Dengan int a = 7 dan int b = 2, ekspresi mana yang menghasilkan 3.5?', [
            ['(float) a / b', true],
            ['(float) (a / b)', false],
            ['float(a) / b', false],
            ['a / b', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Kontrol Alur & Array',
    lessons: [
      {
        title: 'Percabangan if/else/switch',
        slug: 'cfz-percabangan-if-else-switch',
        content: [
          '`if` menjalankan blok kode hanya jika kondisi di dalam kurung bernilai bukan nol (dianggap "benar"). `else if` mengecek kondisi tambahan kalau `if` sebelumnya salah, dan `else` menjalankan blok kalau semua kondisi di atasnya salah.',
          'Blok kode di C dikelompokkan dengan kurung kurawal `{}`. Kalau blok hanya berisi satu statement, kurung kurawal boleh dihilangkan, tapi tetap disarankan dipakai supaya kode lebih jelas dan tidak rawan bug saat ditambah statement baru.',
          '`switch` adalah alternatif percabangan ketika kita membandingkan satu variabel dengan banyak nilai konstan tertentu. Setiap `case` butuh `break;` di akhirnya, kalau tidak eksekusi akan "jatuh" (fall-through) ke `case` berikutnya secara tidak sengaja. `default` menangani kasus yang tidak cocok dengan `case` mana pun.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int main(void) {
    int nilai = 75;

    if (nilai >= 90) {
        printf("Grade A\\n");
    } else if (nilai >= 75) {
        printf("Grade B\\n");
    } else if (nilai >= 60) {
        printf("Grade C\\n");
    } else {
        printf("Tidak lulus\\n");
    }

    int hari = 3;
    switch (hari) {
        case 1:
            printf("Senin\\n");
            break;
        case 2:
            printf("Selasa\\n");
            break;
        case 3:
            printf("Rabu\\n");
            break;
        default:
            printf("Hari tidak dikenal\\n");
            break;
    }

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi kalau lupa menaruh break di dalam case switch?', [
            ['Eksekusi jatuh (fall-through) ke case berikutnya', true],
            ['Program otomatis berhenti', false],
            ['Compiler menolak meng-compile', false],
            ['case tersebut diabaikan sepenuhnya', false],
          ]),
          q('Kondisi di dalam if dianggap benar (true) jika nilainya?', [
            ['Bukan nol', true],
            ['Harus persis 1', false],
            ['Harus string "true"', false],
            ['Selalu dianggap salah', false],
          ]),
          q('Kata kunci apa di switch yang menangani kasus tidak cocok dengan case mana pun?', [
            ['default', true],
            ['else', false],
            ['otherwise', false],
            ['fallback', false],
          ]),
        ],
      },
      {
        title: 'Perulangan for/while/do-while',
        slug: 'cfz-perulangan-for-while-do-while',
        content: [
          '`for` cocok dipakai kalau jumlah iterasi sudah diketahui, terdiri dari tiga bagian dipisah titik koma: inisialisasi, kondisi, dan increment/decrement — contoh: `for (int i = 0; i < 5; i++)`.',
          '`while` mengulang selama kondisi masih benar, kondisi dicek sebelum blok kode dijalankan — cocok kalau jumlah iterasi tidak diketahui di awal. Harus ada perubahan kondisi di dalam loop supaya tidak infinite loop.',
          '`do-while` mirip `while`, tapi kondisi dicek setelah blok kode dijalankan — artinya blok kode dijamin dijalankan minimal satu kali, meski kondisinya langsung salah sejak awal.',
          '`break` menghentikan loop lebih awal, `continue` melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya — sama seperti di Python.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int main(void) {
    for (int i = 0; i < 5; i++) {
        if (i == 3) {
            continue;
        }
        printf("Iterasi for ke-%d\\n", i);
    }

    int hitung = 0;
    while (hitung < 3) {
        printf("Iterasi while ke-%d\\n", hitung);
        hitung++;
    }

    int angka = 10;
    do {
        printf("do-while jalan minimal sekali, angka=%d\\n", angka);
    } while (angka < 5);

    return 0;
}
`,
      },
      {
        title: 'Array 1 Dimensi',
        slug: 'cfz-array-1-dimensi',
        content: [
          'Array adalah kumpulan data dengan tipe sama yang disimpan berurutan di memori, dideklarasikan dengan `tipe nama_array[ukuran];`, misal `int nilai[5];` membuat array 5 integer.',
          'Akses elemen array memakai index yang dimulai dari 0, bukan 1 — elemen pertama array `nilai` diakses dengan `nilai[0]`, elemen terakhir dari array berukuran 5 adalah `nilai[4]`.',
          'Array di C punya ukuran tetap (fixed size) yang ditentukan saat deklarasi dan tidak bisa membesar/mengecil secara dinamis seperti list Python — kalau butuh ukuran dinamis, biasanya dipakai alokasi memori manual dengan `malloc` (dibahas di modul berikutnya).',
          'C tidak melakukan bounds checking otomatis — mengakses index di luar ukuran array (misal `nilai[10]` pada array berukuran 5) tidak akan menghasilkan error yang jelas, melainkan undefined behavior (bisa membaca data acak di memori atau bahkan crash).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int main(void) {
    int nilai[5] = {80, 75, 90, 65, 88};

    printf("Elemen pertama: %d\\n", nilai[0]);
    printf("Elemen terakhir: %d\\n", nilai[4]);

    int total = 0;
    for (int i = 0; i < 5; i++) {
        total += nilai[i];
    }
    printf("Total semua nilai: %d\\n", total);
    printf("Rata-rata: %.2f\\n", (float) total / 5);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Index elemen pertama sebuah array di C adalah?', [
            ['0', true],
            ['1', false],
            ['-1', false],
            ['Tergantung compiler', false],
          ]),
          q('Apa yang terjadi kalau mengakses index di luar ukuran array di C?', [
            ['Undefined behavior, tidak ada bounds checking otomatis', true],
            ['Program otomatis memberi error yang jelas dan berhenti dengan aman', false],
            ['Array otomatis membesar untuk menampung index itu', false],
            ['Selalu mengembalikan nilai 0', false],
          ]),
          q('Bagaimana ukuran array di C dibandingkan dengan list Python?', [
            ['Ukuran array C tetap (fixed), tidak bisa membesar/mengecil otomatis', true],
            ['Array C bisa membesar otomatis seperti list Python', false],
            ['Array C dan list Python identik dalam segala hal', false],
            ['Array C tidak punya ukuran sama sekali', false],
          ]),
        ],
      },
      {
        title: 'Array Multidimensi & String sebagai Array Char',
        slug: 'cfz-array-multidimensi-string-array-char',
        content: [
          '## Array 2 dimensi',
          'Array multidimensi (misal array 2 dimensi) berguna merepresentasikan data berbentuk tabel/grid, dideklarasikan dengan dua ukuran: `int matriks[2][3];` membuat array 2 baris, 3 kolom. Akses elemen dengan dua index: `matriks[baris][kolom]`, dan seperti array biasa, kedua index mulai dari 0.',
          '```c\nint matriks[2][3] = {\n    {1, 2, 3},\n    {4, 5, 6}\n};\nprintf("%d\\n", matriks[1][2]);  // 6: baris ke-1, kolom ke-2 (elemen terakhir)\n```',
          '## String sebagai array char',
          'C tidak punya tipe data string bawaan seperti Python — string di C sebenarnya adalah array karakter (`char`) yang diakhiri karakter khusus null terminator (`\\0`) untuk menandai akhir string.',
          'String literal seperti `"Halo"` otomatis diberi null terminator oleh compiler, jadi `char teks[] = "Halo";` sebenarnya berisi 5 elemen: `H`, `a`, `l`, `o`, dan `\\0` di akhir — bukan 4 elemen seperti kelihatannya.',
          'Fungsi `strlen` (dari header `<string.h>`) menghitung panjang string tanpa menghitung null terminator, dan mengembalikan tipe `size_t` (bilangan bulat tanpa tanda untuk ukuran), jadi dicetak dengan `%zu`. Operator `sizeof` menghasilkan ukuran array dalam byte, termasuk null terminator dan sisa ruang kosong di dalam array.',
          '```c\nchar teks[] = "Halo";\nchar nama[20] = "Baris";\nprintf("%zu %zu\\n", strlen(teks), sizeof teks);  // 4 5\nprintf("%zu %zu\\n", strlen(nama), sizeof nama);  // 5 20\n```',
          'Fungsi `strcpy` menyalin string dan `strcat` menggabungkan string, keduanya bekerja dengan memanipulasi array `char` di baliknya. Keduanya tidak mengecek ukuran array tujuan: kalau tidak cukup menampung isi string ditambah null terminator, program menulis melewati batas array (buffer overflow, undefined behavior) yang bisa merusak data lain atau membuat program crash. Pastikan ukuran array tujuan cukup, yaitu `strlen(tujuan) + strlen(sumber) + 1` byte atau lebih.',
          'Contoh SALAH yang jangan ditiru (array `kecil` hanya muat 6 byte, sedangkan hasilnya butuh 9):',
          '```c\nchar kecil[6] = "Baris";\nstrcat(kecil, "ORG");  // buffer overflow!\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>
#include <string.h>

int main(void) {
    int matriks[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    for (int baris = 0; baris < 2; baris++) {
        for (int kolom = 0; kolom < 3; kolom++) {
            printf("%d ", matriks[baris][kolom]);
        }
        printf("\\n");
    }

    char nama[20] = "Baris";
    char tambahan[] = "ORG";

    if (strlen(nama) + strlen(tambahan) + 1 <= sizeof nama) {
        strcat(nama, tambahan);
    }
    printf("Setelah strcat: %s\\n", nama);
    printf("Panjang string (strlen): %zu\\n", strlen(nama));
    printf("Ukuran array (sizeof): %zu\\n", sizeof nama);

    char salinan[20];
    strcpy(salinan, nama);
    printf("Salinan: %s\\n", salinan);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Pada int matriks[2][3], elemen terakhir (baris kedua, kolom ketiga) diakses dengan?', [
            ['matriks[1][2]', true],
            ['matriks[2][3]', false],
            ['matriks[3][2]', false],
            ['matriks[2][1]', false],
          ]),
          q('Untuk char nama[20] = "Baris"; berapa nilai strlen(nama) dan sizeof nama?', [
            ['strlen = 5, sizeof = 20', true],
            ['strlen = 20, sizeof = 5', false],
            ['strlen = 6, sizeof = 20', false],
            ['strlen = 5, sizeof = 5', false],
          ]),
          q('Apa yang terjadi kalau strcat dipakai pada array tujuan yang terlalu kecil?', [
            ['Program menulis melewati batas array (buffer overflow, undefined behavior)', true],
            ['strcat otomatis memperbesar array tujuan sampai cukup', false],
            ['strcat memotong hasilnya supaya muat lalu menambah null terminator', false],
            ['Compiler menolak meng-compile program itu', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Fungsi & Pointer',
    lessons: [
      {
        title: 'Fungsi & Parameter',
        slug: 'cfz-fungsi-parameter',
        content: [
          'Fungsi di C dideklarasikan dengan pola `tipe_kembalian nama_fungsi(parameter) { ... }`. Tipe kembalian menyatakan tipe data yang dikembalikan lewat `return`; kalau fungsi tidak mengembalikan apa-apa, tipe kembaliannya `void`.',
          'Parameter fungsi di C dikirim secara pass by value secara default — artinya fungsi menerima salinan nilai argumen, bukan variabel aslinya. Mengubah parameter di dalam fungsi tidak memengaruhi variabel asli di pemanggil (berbeda dengan pass by reference yang baru dibahas lewat pointer di lesson berikutnya).',
          'Fungsi harus dideklarasikan (atau didefinisikan penuh) sebelum dipakai di `main` — kalau fungsi didefinisikan setelah `main`, biasanya perlu forward declaration (prototype fungsi) di bagian atas file.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int tambah(int a, int b) {
    return a + b;
}

void sapa(char nama[]) {
    printf("Halo, %s\\n", nama);
}

int main(void) {
    int hasil = tambah(5, 3);
    printf("Hasil tambah: %d\\n", hasil);
    sapa("Siswa BarisORG");
    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe kembalian apa dipakai untuk fungsi yang tidak mengembalikan nilai apa pun?', [
            ['void', true],
            ['int', false],
            ['null', false],
            ['empty', false],
          ]),
          q('Secara default, parameter fungsi di C dikirim dengan cara?', [
            ['Pass by value (salinan nilai)', true],
            ['Pass by reference (alamat asli)', false],
            ['Selalu sebagai pointer', false],
            ['Selalu sebagai array', false],
          ]),
          q('Apa yang terjadi jika parameter diubah di dalam fungsi pass by value?', [
            ['Variabel asli di pemanggil tidak ikut berubah', true],
            ['Variabel asli di pemanggil ikut berubah', false],
            ['Program akan error saat compile', false],
            ['Nilai parameter otomatis dikembalikan ke pemanggil', false],
          ]),
        ],
      },
      {
        title: 'Pointer Dasar',
        slug: 'cfz-pointer-dasar',
        content: [
          'Pointer adalah variabel yang menyimpan alamat memori dari variabel lain, bukan nilai datanya langsung. Ini adalah salah satu fitur paling khas dan sekaligus paling ditakuti pemula di C.',
          'Operator `&` (address-of) mengambil alamat memori sebuah variabel, sedangkan operator `*` (dereference) — saat dipakai di depan pointer yang sudah diisi — mengakses nilai yang disimpan di alamat yang ditunjuk pointer itu.',
          'Deklarasi pointer memakai tanda `*` setelah tipe data, misal `int *p;` mendeklarasikan pointer bernama `p` yang menunjuk ke sebuah `int`. Setelah diisi dengan `p = &x;`, `p` menyimpan alamat `x`, dan `*p` mengakses nilai `x` lewat pointer tersebut.',
          'Pointer memungkinkan fungsi mengubah nilai variabel asli di pemanggil (pass by reference secara manual) — dengan mengirim alamat variabel ke fungsi, fungsi bisa mengubah nilai di alamat itu langsung, bukan cuma salinannya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

void tambahSatu(int *p) {
    *p = *p + 1;
}

int main(void) {
    int x = 10;
    int *pointerKeX = &x;

    printf("Nilai x: %d\\n", x);
    printf("Alamat x (via &x): %p\\n", (void *) &x);
    printf("Nilai lewat dereference *pointerKeX: %d\\n", *pointerKeX);

    tambahSatu(&x);
    printf("Nilai x setelah tambahSatu: %d\\n", x);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Operator apa yang mengambil alamat memori sebuah variabel?', [
            ['& (address-of)', true],
            ['* (dereference)', false],
            ['# (preprocessor)', false],
            ['@ (annotation)', false],
          ]),
          q('Apa yang disimpan oleh sebuah variabel pointer?', [
            ['Alamat memori dari variabel lain', true],
            ['Salinan langsung dari nilai variabel lain', false],
            ['Nama variabel dalam bentuk teks', false],
            ['Ukuran tipe data dalam byte', false],
          ]),
          q('Bagaimana cara mengakses nilai yang ditunjuk oleh pointer p?', [
            ['*p (dereference)', true],
            ['&p', false],
            ['p()', false],
            ['p.value', false],
          ]),
        ],
      },
      {
        title: 'Pointer & Array',
        slug: 'cfz-pointer-array',
        content: [
          'Di C, nama array sebenarnya "meluruh" (decay) menjadi pointer ke elemen pertamanya ketika dipakai dalam ekspresi (kecuali sebagai operand `sizeof` atau `&`) — artinya `nilai` (nama array) hampir setara dengan `&nilai[0]`.',
          'Karena hubungan erat ini, aritmatika pointer bisa dipakai untuk menjelajahi array: `*(nilai + i)` menghasilkan nilai yang sama dengan `nilai[i]` — compiler C menerjemahkan notasi index array menjadi aritmatika pointer di balik layar.',
          'Saat sebuah array dikirim sebagai argumen ke fungsi, yang sebenarnya dikirim adalah pointer ke elemen pertamanya (bukan salinan seluruh array) — inilah sebabnya fungsi yang menerima array sebagai parameter bisa mengubah isi array asli, berbeda dengan variabel biasa yang pass by value.',
          'Memahami relasi pointer-array ini penting karena banyak fungsi standar library C (seperti `strlen`, `strcpy`) sebenarnya bekerja dengan menggeser pointer melalui array karakter sampai menemukan null terminator.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

void gandakanSemua(int arr[], int ukuran) {
    for (int i = 0; i < ukuran; i++) {
        arr[i] = arr[i] * 2;
    }
}

int main(void) {
    int nilai[4] = {1, 2, 3, 4};
    int *p = nilai;

    printf("Akses via index: %d\\n", nilai[2]);
    printf("Akses via pointer arithmetic: %d\\n", *(p + 2));

    gandakanSemua(nilai, 4);
    printf("Array setelah dikali 2 di dalam fungsi:\\n");
    for (int i = 0; i < 4; i++) {
        printf("%d ", nilai[i]);
    }
    printf("\\n");

    return 0;
}
`,
      },
      {
        title: 'Alokasi Memori Dinamis',
        slug: 'cfz-alokasi-memori-dinamis',
        content: [
          'Array biasa di C punya ukuran tetap yang harus diketahui saat compile. Kalau ukuran data baru diketahui saat program berjalan (runtime), kita butuh alokasi memori dinamis lewat fungsi `malloc` (memory allocate) dari header `<stdlib.h>`.',
          '`malloc(n * sizeof(tipe))` meminta sejumlah `n` elemen bertipe tertentu dari heap (area memori terpisah dari stack biasa) dan mengembalikan pointer ke blok memori itu. Tipe kembaliannya `void *` (pointer generik), dan di C pointer ini otomatis dikonversi ke tipe pointer tujuan, jadi tidak perlu di-cast: tulis `int *data = malloc(n * sizeof(int));`, bukan `(int *) malloc(...)`. Cast itu wajib di C++, tapi tidak di C.',
          'Isi blok hasil `malloc` belum diinisialisasi (berisi nilai sampah), dan `malloc` bisa gagal: kalau memori tidak cukup, ia mengembalikan `NULL` (pointer kosong, tidak menunjuk ke mana pun). Selalu cek hasilnya sebelum dipakai.',
          '```c\nint *data = malloc(5 * sizeof(int));\nif (data == NULL) {\n    return 1;  // alokasi gagal\n}\ndata[0] = 10;\nfree(data);\n```',
          'Memori yang dialokasikan dengan `malloc` tidak dibersihkan otomatis oleh C (tidak ada garbage collector) — programmer wajib memanggil `free(pointer)` setelah selesai memakainya, kalau tidak akan terjadi memory leak (memori yang terpakai tapi tidak pernah dilepaskan kembali ke sistem).',
          'Pola umum: alokasi dengan `malloc`, cek `NULL`, pakai memori itu, lalu `free` di akhir sebelum pointer keluar dari scope atau program selesai — kebiasaan ini krusial di program C yang berjalan lama seperti server atau aplikasi embedded.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Kapan alokasi memori dinamis dengan malloc dibutuhkan?', [
            ['Saat ukuran data baru diketahui ketika program berjalan (runtime)', true],
            ['Setiap kali mendeklarasikan variabel int biasa di dalam fungsi', false],
            ['Supaya memori dibersihkan otomatis saat fungsi selesai tanpa perlu free', false],
            ['Supaya isi array bisa diubah, karena array biasa bersifat read-only', false],
          ]),
          q('Bagaimana cara menyimpan hasil malloc ke pointer int di C?', [
            ['int *p = malloc(n * sizeof(int)); — void * otomatis dikonversi, tanpa cast', true],
            ['int *p = (int *) malloc(n * sizeof(int)); — cast wajib, void * tidak bisa dikonversi otomatis', false],
            ['int p = malloc(n * sizeof(int)); — malloc mengembalikan bilangan bulat berisi alamat', false],
            ['int *p = new int[n]; — malloc hanya bisa dipakai bersama operator new', false],
          ]),
          q('Apa yang terjadi kalau memori dari malloc tidak pernah di-free?', [
            ['Terjadi memory leak', true],
            ['Program otomatis membersihkannya saat fungsi selesai', false],
            ['Compiler menolak meng-compile', false],
            ['Memori langsung dibersihkan saat pointernya diberi nilai NULL', false],
          ]),
          q('Apa yang dikembalikan malloc kalau memori tidak cukup?', [
            ['NULL', true],
            ['Pointer ke blok yang lebih kecil dari yang diminta', false],
            ['Alamat acak yang tetap aman dipakai', false],
            ['0, yaitu bilangan bulat nol', false],
          ]),
          q('Header apa yang menyediakan fungsi malloc dan free?', [
            ['<stdlib.h>', true],
            ['<stdio.h>', false],
            ['<string.h>', false],
            ['<math.h>', false],
          ]),
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int jumlahData = 5;
    int *data = malloc(jumlahData * sizeof(int));

    if (data == NULL) {
        printf("Alokasi memori gagal\\n");
        return 1;
    }

    for (int i = 0; i < jumlahData; i++) {
        data[i] = i * 10;
    }

    printf("Isi data dinamis: ");
    for (int i = 0; i < jumlahData; i++) {
        printf("%d ", data[i]);
    }
    printf("\\n");

    free(data);
    printf("Memori sudah dibebaskan dengan free()\\n");

    return 0;
}
`,
      },
    ],
  },
  {
    title: 'Struct & Studi Kasus',
    lessons: [
      {
        title: 'Struct',
        slug: 'cfz-struct',
        content: [
          '`struct` adalah cara mengelompokkan beberapa variabel dengan tipe berbeda-beda menjadi satu tipe data baru yang lebih bermakna, misal menggabungkan nama, umur, dan IPK seorang mahasiswa jadi satu unit `struct Mahasiswa`.',
          'Deklarasi struct: `struct NamaStruct { tipe field1; tipe field2; ... };`. Membuat variabel dari struct itu: `struct NamaStruct variabel;`, lalu akses field-nya dengan titik: `variabel.field1`.',
          'Struct berbeda dari array — array menyimpan banyak data dengan tipe yang SAMA, sedangkan struct menyimpan beberapa data dengan tipe yang BISA BERBEDA-BEDA dalam satu unit logis.',
          'Struct sering dipakai bersama `typedef` untuk membuat alias nama yang lebih ringkas, misal `typedef struct { ... } Mahasiswa;` supaya variabel bisa dideklarasikan cukup dengan `Mahasiswa m1;` tanpa perlu menulis kata `struct` berulang-ulang.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

typedef struct {
    char nama[30];
    int umur;
    float ipk;
} Mahasiswa;

int main(void) {
    Mahasiswa m1 = {"Budi", 20, 3.75f};

    printf("Nama: %s\\n", m1.nama);
    printf("Umur: %d\\n", m1.umur);
    printf("IPK: %.2f\\n", m1.ipk);

    m1.ipk = 3.90f;
    printf("IPK setelah diupdate: %.2f\\n", m1.ipk);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi utama struct di C?', [
            ['Mengelompokkan beberapa variabel dengan tipe berbeda jadi satu unit', true],
            ['Menyimpan banyak data dengan tipe yang harus sama semua', false],
            ['Menggantikan fungsi sepenuhnya', false],
            ['Hanya bisa dipakai untuk angka', false],
          ]),
          q('Bagaimana cara mengakses field nama dari variabel struct m1?', [
            ['m1.nama', true],
            ['nama.m1', false],
            ['m1[nama]', false],
            ['nama(m1)', false],
          ]),
          q('Apa kegunaan typedef bersama struct?', [
            ['Membuat alias nama tipe yang lebih ringkas', true],
            ['Menghapus struct dari memori', false],
            ['Mengubah struct jadi array', false],
            ['Wajib dipakai, struct tidak bisa jalan tanpa typedef', false],
          ]),
        ],
      },
      {
        title: 'Header File & Modularitas',
        slug: 'cfz-header-file-modularitas',
        content: [
          'Program C yang besar biasanya dipecah menjadi beberapa file supaya lebih terorganisir dan mudah dipelihara — pola umumnya adalah file header (`.h`) berisi deklarasi (prototype fungsi, definisi struct, konstanta), dan file implementasi (`.c`) berisi kode fungsi yang sesungguhnya.',
          '## Contoh: tiga file dalam satu folder',
          'Tiga file berikut dipakai bersama dalam satu folder (bukan satu program tunggal). Pertama `matematika.h`, yang hanya mendeklarasikan fungsi `tambah`:',
          '```c\n#ifndef MATEMATIKA_H\n#define MATEMATIKA_H\n\nint tambah(int a, int b);\n\n#endif\n```',
          'Lalu `matematika.c`, yang berisi implementasi fungsinya dan meng-include header-nya sendiri:',
          '```c\n#include "matematika.h"\n\nint tambah(int a, int b) {\n    return a + b;\n}\n```',
          'Terakhir `main.c`, yang memakai fungsi itu setelah meng-include header-nya:',
          '```c\n#include <stdio.h>\n#include "matematika.h"\n\nint main(void) {\n    printf("2 + 3 = %d\\n", tambah(2, 3));\n    return 0;\n}\n```',
          'Saat compile, semua file `.c` disebutkan sekaligus (header tidak ditulis di perintah, karena sudah ikut lewat `#include`):',
          '```bash\ngcc main.c matematika.c -o program\n./program\n```',
          '## Include dengan tanda kutip dan kurung siku',
          'File header di-include ke file `.c` lain dengan `#include "nama_header.h"` (tanda kutip untuk header buatan sendiri, beda dengan `#include <stdio.h>` yang tanda kurung siku untuk header standard library).',
          'Modularitas seperti ini memungkinkan tim bekerja di file berbeda tanpa saling tabrakan, dan file `.c` yang jarang berubah tidak perlu di-compile ulang setiap kali (di proyek besar biasanya dibantu tool build seperti `make`).',
          '## Header guard',
          'Guard header (`#ifndef`/`#define`/`#endif`, seperti pada `matematika.h` di atas) dipakai di dalam file header untuk mencegah isi header ter-include dua kali dalam satu proses compile, yang bisa menyebabkan error "redefinition". Alternatifnya adalah `#pragma once` di baris pertama header: bukan bagian standar C, tapi didukung oleh GCC dan compiler populer lain.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa isi utama sebuah file header (.h) di C?', [
            ['Deklarasi (prototype fungsi, struct, konstanta)', true],
            ['Implementasi lengkap semua fungsi, sedangkan file .c hanya berisi deklarasi', false],
            ['Hasil compile berupa kode mesin dari file .c', false],
            ['Hanya komentar dan dokumentasi, tidak boleh ada kode', false],
          ]),
          q('Bagaimana cara meng-include header buatan sendiri, bukan header standard library?', [
            ['#include "nama_header.h" dengan tanda kutip', true],
            ['#include <nama_header.h> dengan tanda kurung siku', false],
            ['Tidak perlu di-include, cukup menyebut file .c-nya di perintah gcc', false],
            ['#define "nama_header.h" di awal file', false],
          ]),
          q('Apa fungsi header guard (#ifndef/#define/#endif)?', [
            ['Mencegah isi header ter-include dua kali dalam satu compile', true],
            ['Mempercepat eksekusi program saat runtime', false],
            ['Mengubah header jadi file .c', false],
            ['Menghapus komentar dari header', false],
          ]),
          q('Perintah mana yang meng-compile main.c dan matematika.c menjadi satu program?', [
            ['gcc main.c matematika.c -o program', true],
            ['gcc main.c -o program (matematika.h sudah membawa implementasinya)', false],
            ['gcc main.c matematika.h -o program', false],
            ['gcc matematika.c -o program (main.c ikut otomatis lewat include)', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus: Program Sederhana Gabungan',
        slug: 'cfz-studi-kasus-program-gabungan',
        content: [
          'Sekarang saatnya menggabungkan semua yang sudah dipelajari sepanjang course ini: variabel, tipe data, operator, percabangan, perulangan, array, fungsi, pointer, dan struct — semuanya dipakai bersama dalam satu program yang lebih realistis.',
          'Studi kasus di bawah ini adalah program sederhana pencatat nilai beberapa siswa: menyimpan data siswa dalam array of struct, menghitung rata-rata nilai tiap siswa lewat fungsi, lalu menentukan kelulusan lewat percabangan — pola yang sangat umum ditemui di program pengolahan data nyata.',
          'Perhatikan bagaimana fungsi `hitungRataRata` menerima array nilai (`int nilai[]`, yang di baliknya adalah pointer, seperti dibahas di modul sebelumnya) dari field `nilaiUjian` tiap siswa, dan bagaimana perulangan dipakai untuk memproses banyak data sekaligus tanpa menulis kode berulang-ulang secara manual.',
          'Sepanjang course "C from Zero" ini kita sudah belajar dari sintaks paling dasar, tipe data, kontrol alur, array, fungsi, pointer, alokasi memori dinamis, hingga struct — fondasi yang cukup kuat untuk mulai menulis program C yang lebih kompleks, termasuk memahami kode sumber proyek open source yang ditulis dalam C.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

typedef struct {
    char nama[30];
    int nilaiUjian[3];
} Siswa;

float hitungRataRata(int nilai[], int jumlah) {
    int total = 0;
    for (int i = 0; i < jumlah; i++) {
        total += nilai[i];
    }
    return (float) total / jumlah;
}

int main(void) {
    Siswa daftarSiswa[2] = {
        {"Budi", {80, 75, 90}},
        {"Siti", {60, 55, 58}}
    };

    for (int i = 0; i < 2; i++) {
        float rataRata = hitungRataRata(daftarSiswa[i].nilaiUjian, 3);
        printf("Nama: %s, Rata-rata: %.2f", daftarSiswa[i].nama, rataRata);

        if (rataRata >= 60) {
            printf(" -> LULUS\\n");
        } else {
            printf(" -> TIDAK LULUS\\n");
        }
    }

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Dalam studi kasus di atas, apa yang dipakai untuk menyimpan data beberapa siswa sekaligus?', [
            ['Array of struct', true],
            ['Satu variabel int tunggal', false],
            ['Hanya string tanpa struct', false],
            ['Preprocessor directive #define', false],
          ]),
          q('Fungsi hitungRataRata menerima array nilai sebagai parameter — apa yang sebenarnya dikirim ke fungsi itu?', [
            ['Pointer ke elemen pertama array', true],
            ['Salinan penuh seluruh struct Siswa', false],
            ['Hanya satu nilai integer tunggal', false],
            ['Nama variabel dalam bentuk teks', false],
          ]),
          q('Kalau baris terakhir hitungRataRata ditulis return total / jumlah; (tanpa cast ke float), berapa rata-rata Budi (total 245 dari 3 nilai) yang tercetak?', [
            ['81.00, karena total / jumlah dihitung sebagai pembagian integer lebih dulu', true],
            ['81.67, karena tipe kembalian fungsinya float', false],
            ['82.00, karena hasil pembagian otomatis dibulatkan', false],
            ['Program gagal compile karena int dibagi int tidak boleh dikembalikan sebagai float', false],
          ]),
        ],
      },
    ],
  },
]

const course: CourseDef = {
  title: 'C from Zero',
  slug: 'c-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'C from Zero adalah course pengantar untuk kamu yang belum pernah menulis kode sama sekali. C adalah bahasa di balik sistem operasi, firmware, dan banyak interpreter bahasa lain, jadi belajar C juga membantumu memahami apa yang sebenarnya terjadi di balik bahasa pemrograman yang lebih tinggi.',
    'Di sini kamu belajar dari dasar: struktur program dan proses compile, variabel dan tipe data, operator, `printf` dengan format specifier, konstanta dan type casting, percabangan dan perulangan, array dan string sebagai array `char`, fungsi, pointer dan hubungannya dengan array, alokasi memori dinamis dengan `malloc` dan `free`, `struct`, hingga memecah program menjadi beberapa file dengan header. Setiap lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan sebagian dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini menjalankan kode dengan GCC 9.2 (mode C11 `gnu11`), tanpa akses jaringan dan tanpa input keyboard, jadi `scanf` tidak bisa dicoba di sana. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun dan tidak perlu pengalaman programming sebelumnya.',
  ].join('\n\n'),
  sandboxLanguage: 'c',
  modules,
}

export default course
