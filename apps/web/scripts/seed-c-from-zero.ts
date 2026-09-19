import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "C from Zero" — course ketiga non-dummy, meniru pola
// seed-python-from-zero.ts. Jalankan: pnpm seed:c

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
            ['Membuat halaman web', false],
            ['Analisis data', false],
            ['Machine learning', false],
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
          'Compiler adalah program yang menerjemahkan source code (`.c`) menjadi bahasa mesin (biner) yang bisa langsung dieksekusi prosesor. Untuk C, compiler yang umum dipakai adalah GCC (GNU Compiler Collection).',
          'Prosesnya biasanya dua langkah: `gcc program.c -o program` untuk compile menjadi file executable bernama `program`, lalu `./program` untuk menjalankannya. Kalau ada kesalahan sintaks, compiler akan menolak menghasilkan executable dan menampilkan pesan error di tahap compile — bukan saat program berjalan.',
          'Ini beda mendasar dengan interpreted language seperti Python: di Python, error baru ketahuan saat baris bermasalah itu benar-benar dieksekusi (runtime), sedangkan di C banyak kesalahan (tipe data salah, titik koma hilang, fungsi tidak dikenal) sudah tertangkap sebelum program pernah dijalankan sekali pun.',
          'Konsekuensinya, program C yang sudah berhasil di-compile umumnya berjalan lebih cepat karena tidak ada overhead penerjemahan saat runtime — semua penerjemahan sudah selesai di tahap compile.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa nama compiler C yang paling umum dipakai?', [
            ['GCC', true],
            ['pip', false],
            ['npm', false],
            ['JVM', false],
          ]),
          q('Kapan kesalahan sintaks di C biasanya terdeteksi?', [
            ['Saat proses compile, sebelum program dijalankan', true],
            ['Hanya saat program dijalankan (runtime)', false],
            ['Tidak pernah terdeteksi otomatis', false],
            ['Setelah program selesai berjalan', false],
          ]),
          q('Perintah apa untuk meng-compile program.c menjadi executable bernama program?', [
            ['gcc program.c -o program', true],
            ['python program.c', false],
            ['node program.c', false],
            ['run program.c', false],
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
          'Deklarasi variabel di C mengikuti pola `tipe nama_variabel = nilai;`, contoh: `int umur = 20;`. Variabel bisa dideklarasikan tanpa nilai awal lalu diisi belakangan, tapi nilainya akan berisi sampah (garbage value) sampai benar-benar diisi.',
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
          q('Apa yang terjadi kalau variabel dideklarasikan tanpa nilai awal lalu langsung dipakai?', [
            ['Berisi garbage value (nilai sampah) yang tidak terdefinisi', true],
            ['Otomatis bernilai 0', false],
            ['Program pasti gagal compile', false],
            ['Otomatis bernilai string kosong', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'cfz-operator',
        content: [
          'Operator aritmatika di C: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo, hanya untuk integer). Perlu hati-hati: pembagian antar dua `int` di C menghasilkan hasil integer (desimalnya dibuang), misal `7 / 2` menghasilkan `3`, bukan `3.5`.',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — hasilnya berupa integer, `1` untuk benar dan `0` untuk salah (C klasik tidak punya tipe boolean native seperti bahasa lain, meski C99 ke atas menyediakan `_Bool` lewat `<stdbool.h>`).',
          'Operator logika: `&&` (AND), `||` (OR), `!` (NOT) — dipakai menggabungkan beberapa kondisi, mengembalikan `1` atau `0` sama seperti operator perbandingan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 3;

    printf("Penjumlahan: %d\\n", a + b);
    printf("Pembagian integer: %d\\n", a / b);
    printf("Sisa bagi: %d\\n", a % b);

    printf("Perbandingan a > b: %d\\n", a > b);
    printf("Logika (a > b) && (b > 0): %d\\n", (a > b) && (b > 0));

    return 0;
}
`,
      },
      {
        title: 'printf & Format Specifier',
        slug: 'cfz-printf-format-specifier',
        content: [
          '`printf` adalah fungsi standar C untuk mencetak teks ke layar, disediakan lewat header `<stdio.h>`. Untuk mencetak nilai variabel di tengah teks, `printf` memakai format specifier — placeholder yang diganti dengan nilai variabel sesuai urutan argumen.',
          'Format specifier yang paling umum: `%d` untuk integer, `%f` untuk float/double, `%c` untuk karakter tunggal, `%s` untuk string (array karakter yang diakhiri null terminator).',
          'Karakter escape `\\n` menyisipkan baris baru (newline), dan `\\t` menyisipkan tab — keduanya sering dipakai di dalam string `printf` untuk merapikan tampilan output.',
          'Untuk float/double, bisa ditentukan jumlah digit desimal yang ditampilkan, misal `%.2f` menampilkan tepat 2 angka di belakang koma.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

int main(void) {
    int umur = 20;
    float ipk = 3.75f;
    char grade = 'A';
    char nama[] = "Siswa BarisORG";

    printf("Nama: %s\\n", nama);
    printf("Umur: %d tahun\\n", umur);
    printf("IPK: %.2f\\n", ipk);
    printf("Grade: %c\\n", grade);
    printf("Baris ini\\tpakai tab\\ndan baris ini baris baru.\\n");

    return 0;
}
`,
      },
      {
        title: 'Konstanta & Type Casting',
        slug: 'cfz-konstanta-type-casting',
        content: [
          'Konstanta adalah nilai yang tidak boleh berubah setelah didefinisikan. Ada dua cara umum membuat konstanta di C: kata kunci `const` (misal `const int MAX = 100;`, diperiksa compiler) dan preprocessor directive `#define` (misal `#define MAX 100`, diganti langsung oleh preprocessor sebelum compile, tanpa tipe data).',
          '`const` lebih disarankan di kode modern karena punya tipe data yang jelas dan diperiksa oleh compiler, sedangkan `#define` sekadar text substitution murni yang dilakukan sebelum tahap compile dimulai.',
          'Type casting adalah mengubah nilai dari satu tipe data ke tipe lain secara eksplisit, ditulis dengan menaruh nama tipe dalam kurung sebelum nilai, misal `(float) 7 / 2` memaksa `7` jadi float dulu sehingga hasil pembagian jadi `3.5`, bukan `3` seperti pembagian integer biasa.',
          'Type casting penting dipahami di C karena operasi antar tipe data yang berbeda (misal `int` dibagi `int`) mengikuti aturan tipe data yang paling "sempit" di antara operand — tanpa casting eksplisit, hasil desimal bisa hilang tanpa disadari.',
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

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Perbedaan utama const dan #define adalah?', [
            ['const punya tipe data & diperiksa compiler, #define hanya text substitution', true],
            ['const dan #define benar-benar identik dalam segala hal', false],
            ['#define hanya bisa dipakai untuk angka desimal', false],
            ['const hanya bisa dipakai di dalam fungsi main', false],
          ]),
          q('Hasil dari 7 / 2 di C jika keduanya bertipe int adalah?', [
            ['3 (desimal dibuang)', true],
            ['3.5', false],
            ['4 (dibulatkan ke atas)', false],
            ['Error compile', false],
          ]),
          q('Bagaimana cara melakukan type casting eksplisit ke float pada variabel a?', [
            ['(float) a', true],
            ['float(a)', false],
            ['a.toFloat()', false],
            ['cast<float>(a)', false],
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
          'Array multidimensi (misal array 2 dimensi) berguna merepresentasikan data berbentuk tabel/grid, dideklarasikan dengan dua ukuran: `int matriks[2][3];` membuat array 2 baris, 3 kolom. Akses elemen dengan dua index: `matriks[baris][kolom]`.',
          'C tidak punya tipe data string bawaan seperti Python — string di C sebenarnya adalah array karakter (`char`) yang diakhiri karakter khusus null terminator (`\\0`) untuk menandai akhir string.',
          'String literal seperti `"Halo"` otomatis diberi null terminator oleh compiler, jadi `char teks[] = "Halo";` sebenarnya berisi 5 elemen: `H`, `a`, `l`, `o`, dan `\\0` di akhir — bukan 4 elemen seperti kelihatannya.',
          'Fungsi `strlen` (dari header `<string.h>`) menghitung panjang string tanpa menghitung null terminator, sedangkan `strcpy` dan `strcat` masing-masing menyalin dan menggabungkan string — semuanya bekerja dengan memanipulasi array `char` di baliknya.',
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
    strcat(nama, "ORG");
    printf("Setelah strcat: %s\\n", nama);
    printf("Panjang string: %lu\\n", strlen(nama));

    return 0;
}
`,
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
          'Di C, nama array sebenarnya "meluruh" (decay) menjadi pointer ke elemen pertamanya ketika dipakai dalam ekspresi — artinya `nilai` (nama array) hampir setara dengan `&nilai[0]`.',
          'Karena hubungan erat ini, aritmatika pointer bisa dipakai untuk menjelajahi array: `*(nilai + i)` menghasilkan nilai yang sama dengan `nilai[i]` — compiler C menerjemahkan notasi index array menjadi aritmatika pointer di balik layar.',
          'Saat sebuah array dikirim sebagai argumen ke fungsi, yang sebenarnya dikirim adalah pointer ke elemen pertamanya (bukan salinan seluruh array) — inilah sebabnya fungsi yang menerima array sebagai parameter bisa mengubah isi array asli, berbeda dengan variabel biasa yang pass by value.',
          'Memahami relasi pointer-array ini penting karena banyak fungsi standar library C (seperti `strlen`, `strcpy`) sebenarnya bekerja dengan menggeser pointer melalui array karakter sampai menemukan null terminator.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <stdio.h>

void cetakSemua(int arr[], int ukuran) {
    for (int i = 0; i < ukuran; i++) {
        arr[i] = arr[i] * 2;
    }
}

int main(void) {
    int nilai[4] = {1, 2, 3, 4};
    int *p = nilai;

    printf("Akses via index: %d\\n", nilai[2]);
    printf("Akses via pointer arithmetic: %d\\n", *(p + 2));

    cetakSemua(nilai, 4);
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
          '`malloc(n * sizeof(tipe))` meminta sejumlah `n` elemen bertipe tertentu dari heap (area memori terpisah dari stack biasa) dan mengembalikan pointer ke blok memori itu — perlu di-cast ke tipe pointer yang sesuai.',
          'Memori yang dialokasikan dengan `malloc` tidak dibersihkan otomatis oleh C (tidak ada garbage collector) — programmer wajib memanggil `free(pointer)` setelah selesai memakainya, kalau tidak akan terjadi memory leak (memori yang terpakai tapi tidak pernah dilepaskan kembali ke sistem).',
          'Pola umum: alokasi dengan `malloc`, pakai memori itu, lalu `free` di akhir sebelum pointer keluar dari scope atau program selesai — kebiasaan ini krusial di program C yang berjalan lama seperti server atau aplikasi embedded.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi apa yang dipakai untuk alokasi memori dinamis di C?', [
            ['malloc', true],
            ['alloc', false],
            ['new', false],
            ['create', false],
          ]),
          q('Apa yang terjadi kalau memori dari malloc tidak pernah di-free?', [
            ['Terjadi memory leak', true],
            ['Program otomatis membersihkannya saat fungsi selesai', false],
            ['Compiler menolak meng-compile', false],
            ['Memori otomatis dikembalikan tiap 1 detik', false],
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
    int *data = (int *) malloc(jumlahData * sizeof(int));

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
            ['m1->nama() ', false],
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
          'File header di-include ke file `.c` lain dengan `#include "nama_header.h"` (tanda kutip untuk header buatan sendiri, beda dengan `#include <stdio.h>` yang tanda kurung siku untuk header standard library).',
          'Modularitas seperti ini memungkinkan tim bekerja di file berbeda tanpa saling tabrakan, dan file `.c` yang jarang berubah tidak perlu di-compile ulang setiap kali (di proyek besar biasanya dibantu tool build seperti `make`).',
          'Guard header (`#ifndef`/`#define`/`#endif` atau `#pragma once`) dipakai di dalam file header untuk mencegah isi header ter-include dua kali dalam satu proses compile, yang bisa menyebabkan error "redefinition".',
          'Catatan: topik pemisahan file `.h`/`.c` ini butuh beberapa file terpisah yang tidak bisa didemonstrasikan lewat satu potongan skrip sandbox tunggal, jadi dipelajari lewat penjelasan konsep dan quiz.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa isi utama sebuah file header (.h) di C?', [
            ['Deklarasi (prototype fungsi, struct, konstanta)', true],
            ['Selalu berisi seluruh implementasi program', false],
            ['Hanya boleh berisi komentar', false],
            ['Kode yang tidak bisa di-include ke file lain', false],
          ]),
          q('Bagaimana cara meng-include header buatan sendiri, bukan header standard library?', [
            ['#include "nama_header.h" dengan tanda kutip', true],
            ['#include <nama_header.h> dengan tanda kurung siku', false],
            ['import nama_header.h', false],
            ['require("nama_header.h")', false],
          ]),
          q('Apa fungsi header guard (#ifndef/#define/#endif)?', [
            ['Mencegah isi header ter-include dua kali dalam satu compile', true],
            ['Mempercepat eksekusi program saat runtime', false],
            ['Mengubah header jadi file .c', false],
            ['Menghapus komentar dari header', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus: Program Sederhana Gabungan',
        slug: 'cfz-studi-kasus-program-gabungan',
        content: [
          'Sekarang saatnya menggabungkan semua yang sudah dipelajari sepanjang course ini: variabel, tipe data, operator, percabangan, perulangan, array, fungsi, pointer, dan struct — semuanya dipakai bersama dalam satu program yang lebih realistis.',
          'Studi kasus di bawah ini adalah program sederhana pencatat nilai beberapa siswa: menyimpan data siswa dalam array of struct, menghitung rata-rata nilai tiap siswa lewat fungsi, lalu menentukan kelulusan lewat percabangan — pola yang sangat umum ditemui di program pengolahan data nyata.',
          'Perhatikan bagaimana fungsi `hitungRataRata` menerima array struct sebagai parameter (yang di baliknya adalah pointer, seperti dibahas di modul sebelumnya), dan bagaimana perulangan dipakai untuk memproses banyak data sekaligus tanpa menulis kode berulang-ulang secara manual.',
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
          q('Topik utama apa saja yang tercakup sepanjang course C from Zero ini?', [
            ['Variabel, kontrol alur, array, fungsi, pointer, hingga struct', true],
            ['Hanya sintaks dasar tanpa pointer maupun struct', false],
            ['Hanya machine learning dengan C', false],
            ['Hanya pengembangan web dengan C', false],
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
      title: 'C from Zero',
      slug: 'c-from-zero',
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
            ? { sandboxLanguage: 'c', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "C from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
