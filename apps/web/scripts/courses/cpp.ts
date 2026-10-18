import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan C++',
    lessons: [
      {
        title: 'Apa itu C++?',
        slug: 'cppfz-apa-itu-cpp',
        content: [
          'C++ adalah bahasa pemrograman yang dibuat oleh Bjarne Stroustrup di Bell Labs, mulai dikembangkan sekitar tahun 1979 sebagai "C with Classes" dan dirilis dengan nama C++ pada tahun 1985. C++ dibangun di atas bahasa C dengan menambahkan konsep Object-Oriented Programming (OOP).',
          'Karena berakar dari C, C++ mendukung sebagian besar sintaks C, lalu menambahkan fitur seperti class, object, template, dan standard library (STL) yang jauh lebih kaya. Tapi C++ bukan "superset" ketat dari C: ada kode C yang valid namun ditolak compiler C++. Contohnya `int* p = malloc(sizeof(int));` boleh di C, tapi di C++ error karena `void*` tidak otomatis dikonversi ke `int*`; dan `int new = 5;` valid di C, tapi di C++ `new` adalah kata kunci.',
          'C++ dikenal sebagai bahasa compiled (bukan interpreted seperti Python) yang menghasilkan kode mesin native, sehingga sangat cepat dan efisien. C++ dipakai luas untuk game engine (Unreal Engine), sistem operasi, driver, aplikasi finansial berkecepatan tinggi, dan software embedded.',
          'Belajar C++ juga membantu memahami konsep dasar komputer lebih dalam, seperti manajemen memori manual, pointer, dan cara compiler bekerja — pengetahuan yang berguna bahkan kalau nanti pindah ke bahasa lain.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa pencipta bahasa C++?', [
            ['Bjarne Stroustrup', true],
            ['Dennis Ritchie', false],
            ['Guido van Rossum', false],
            ['James Gosling', false],
          ]),
          q('C++ awalnya dikembangkan dengan nama apa?', [
            ['C with Classes', true],
            ['C Sharp', false],
            ['Objective-C', false],
            ['C Plus', false],
          ]),
          q('C++ bersifat?', [
            ['Compiled, menghasilkan kode mesin native', true],
            ['Interpreted seperti Python', false],
            ['Hanya bisa jalan di browser', false],
            ['Tidak bisa dikompilasi sama sekali', false],
          ]),
          q('Fitur utama yang ditambahkan C++ dibanding C adalah?', [
            ['Object-Oriented Programming (class & object)', true],
            ['Garbage collection otomatis penuh', false],
            ['Dynamic typing', false],
            ['Pointer dan manajemen memori manual', false],
          ]),
          q('Bagaimana hubungan sintaks C dan C++?', [
            ['Sebagian besar kode C bisa di-compile C++, tapi tidak semua', true],
            ['Semua kode C yang valid otomatis bisa di-compile sebagai C++', false],
            ['C++ sudah menggantikan C sehingga sintaks C tidak berlaku lagi', false],
            ['C dan C++ tidak punya kesamaan sintaks sama sekali', false],
          ]),
        ],
      },
      {
        title: 'Struktur Program & cout/cin',
        slug: 'cppfz-struktur-program-cout-cin',
        content: [
          'Setiap program C++ punya struktur dasar yang wajib ada: header yang di-include (misal `#include <iostream>`), dan fungsi `main()` sebagai titik masuk (entry point) program — di sinilah eksekusi program dimulai.',
          '`#include <iostream>` mengimpor pustaka input/output standar, yang menyediakan `std::cout` untuk mencetak output ke layar dan `std::cin` untuk membaca input dari pengguna. Operator `<<` dipakai untuk mengirim data ke `cout`, sedangkan `>>` dipakai untuk mengambil data dari `cin`. `std::endl` mengakhiri baris (pindah ke baris baru).',
          'Fungsi `main()` harus mengembalikan nilai bertipe `int` — nilai `0` menandakan program selesai tanpa error. Setiap statement di C++ diakhiri titik koma (`;`), berbeda dengan Python yang tidak memakainya.',
          'Setiap pustaka punya header sendiri. Untuk memakai `std::string` (tipe untuk teks, dibahas lengkap di lesson Array & std::string), tambahkan `#include <string>`:',
          '```cpp\n#include <iostream>\n#include <string>\n\nint main() {\n    std::string nama = "Budi";\n    std::cout << "Halo, " << nama << std::endl;\n    return 0;\n}\n```',
          'Karena sandbox latihan tidak menyediakan input interaktif lewat stdin, contoh kode di sini akan menghardcode nilai yang biasanya diminta dari `cin`, supaya program tetap bisa langsung dijalankan dan diperiksa hasilnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>

int main() {
    std::cout << "Halo, C++!" << std::endl;

    // Biasanya nilai ini didapat dari std::cin >> nama;
    // tapi di sini di-hardcode supaya program bisa langsung dijalankan.
    std::string nama = "Siswa BarisORG";
    std::cout << "Halo, " << nama << "!" << std::endl;

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi mana yang menjadi titik masuk (entry point) program C++?', [
            ['main()', true],
            ['start()', false],
            ['begin()', false],
            ['run()', false],
          ]),
          q('Operator mana yang dipakai untuk mengirim data ke std::cout?', [
            ['<<', true],
            ['>>', false],
            ['->', false],
            ['<-', false],
          ]),
          q('Apa arti return 0; di akhir fungsi main()?', [
            ['Program selesai tanpa error', true],
            ['Program berhenti karena terjadi error', false],
            ['Angka 0 dicetak ke layar sebagai hasil program', false],
            ['Semua variabel di program diisi nilai awal 0', false],
          ]),
        ],
      },
      {
        title: 'Compile & Namespace',
        slug: 'cppfz-compile-namespace',
        content: [
          'Berbeda dengan Python yang langsung dijalankan interpreter, kode C++ harus di-compile dulu jadi kode mesin sebelum bisa dieksekusi. Compiler populer di antaranya GCC (`g++`) dan Clang. Perintah dasar: `g++ nama_file.cpp -o program`, lalu jalankan hasilnya dengan `./program`.',
          '```bash\ng++ main.cpp -o program\n./program\n```',
          'Jangan tertukar: compiler (`g++`, Clang) yang menerjemahkan kode. Editor seperti VS Code hanya tempat menulis kode, `make` mengotomatiskan perintah build, dan `gdb` adalah debugger untuk melacak bug — alat-alat itu memanggil atau melengkapi compiler, bukan menggantikannya.',
          'Proses compile ini penting karena compiler memeriksa kesalahan sintaks dan tipe data sebelum program pernah dijalankan sama sekali — berbeda dengan bahasa interpreted yang baru ketahuan error saat baris itu dieksekusi.',
          '`namespace` adalah cara mengelompokkan nama (fungsi, class, variabel) supaya tidak bentrok antar pustaka. Statement `using namespace std;` membuat kita bisa menulis `cout` langsung tanpa awalan `std::` — tapi menulis `std::cout` secara eksplisit tetap dianggap praktik yang lebih aman di proyek besar, karena nama dari `std` bisa bentrok dengan nama buatan kita sendiri. Perhatikan juga: `using namespace std;` hanya soal cara menulis nama, ia tidak menggantikan `#include` — header seperti `<iostream>` tetap harus ditulis.',
          'Sandbox Judge0 yang dipakai di platform ini otomatis menjalankan proses compile (`g++`) di belakang layar sebelum mengeksekusi program, jadi kita cukup fokus menulis kode C++-nya saja.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

int main() {
    // Karena sudah "using namespace std;", tidak perlu menulis std::cout
    cout << "Program ini sudah di-compile oleh g++ sebelum dijalankan" << endl;
    cout << "using namespace std membuat kode lebih ringkas" << endl;
    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi pada file .cpp sebelum programnya bisa dijalankan?', [
            ['Compiler menerjemahkannya jadi file executable berisi kode mesin', true],
            ['Interpreter membaca dan menjalankan barisnya satu per satu seperti Python', false],
            ['Tidak ada proses apa pun, file .cpp langsung dijalankan sistem operasi', false],
            ['File diubah jadi bytecode yang dijalankan oleh virtual machine C++', false],
          ]),
          q('Mana yang berfungsi sebagai compiler C++?', [
            ['g++ (GCC)', true],
            ['VS Code (editor tempat menulis kode)', false],
            ['make (otomatisasi perintah build)', false],
            ['gdb (debugger untuk melacak bug)', false],
          ]),
          q('Fungsi statement using namespace std; adalah?', [
            ['Supaya nama dari std (misal cout dan endl) bisa ditulis tanpa awalan std::', true],
            ['Menggantikan #include <iostream> sehingga header tidak perlu ditulis lagi', false],
            ['Membuat program ter-compile lebih cepat karena pustaka di-cache', false],
            ['Menjamin nama di program kita tidak akan pernah bentrok dengan nama pustaka', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Variabel, Tipe Data & Operator',
    lessons: [
      {
        title: 'Variabel & Tipe Data',
        slug: 'cppfz-variabel-tipe-data',
        content: [
          'C++ adalah bahasa statically typed — tipe data setiap variabel harus dideklarasikan eksplisit saat pembuatan, dan tidak bisa berubah tipe setelahnya. Contoh: `int umur = 20;` mendeklarasikan variabel `umur` bertipe integer.',
          'Tipe data dasar di C++: `int` (bilangan bulat), `float` (desimal presisi tunggal), `double` (desimal presisi ganda, lebih akurat), `char` (satu karakter, ditulis dengan kutip tunggal `\'a\'`), dan `bool` (`true`/`false`).',
          'Deklarasi variabel di C++ mengikuti pola `tipe nama_variabel = nilai;`. Nama variabel harus diawali huruf atau underscore, tidak boleh diawali angka, dan bersifat case-sensitive.',
          'Karena statically typed, tipe setiap variabel dicek compiler saat compile. Nilai yang sama sekali tidak cocok dengan tipenya — misalnya teks `"halo"` untuk variabel `int` — langsung ditolak dengan error. Tapi antar tipe angka, C++ melakukan implicit conversion secara otomatis: `int x = 3.7;` TIDAK error. Compiler diam-diam membuang bagian desimalnya (dipotong, bukan dibulatkan), jadi `x` bernilai `3`. Ini sumber bug yang halus karena tidak ada pesan apa pun, kecuali kamu menyalakan warning khusus seperti `-Wconversion`.',
          'Kalau ingin compiler menjaga dari konversi yang menghilangkan data, pakai brace initialization (kurung kurawal): `int y{3.7};` ditolak dengan error "narrowing conversion". Hanya sintaks `{}` yang menolak narrowing; sintaks `=` dan `()` tetap mengizinkannya.',
          '```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 3.7;       // compile, a bernilai 3 (desimal dibuang)\n    double b = 3;      // compile, b bernilai 3\n    int c{3};          // compile, 3 muat di int\n    // int d{3.7};     // error: narrowing conversion\n    // int e = "halo"; // error: teks tidak bisa jadi int\n    cout << a << " " << b << " " << c << endl;  // 3 3 3\n    return 0;\n}\n```',
          'Nilai `bool` dicetak oleh `cout` sebagai `1` (untuk `true`) atau `0` (untuk `false`). Kalau ingin tercetak sebagai teks `true`/`false`, kirim `boolalpha` ke `cout` dulu: `cout << boolalpha;`. Pengaturan ini berlaku untuk semua cetakan `bool` setelahnya, sampai diganti dengan `noboolalpha`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

int main() {
    int umur = 20;
    float tinggi = 165.5f;
    double berat = 55.25;
    char inisial = 'B';
    bool sudahLulus = true;

    // Tanpa boolalpha, bool dicetak sebagai 1 (true) atau 0 (false).
    cout << "Sudah lulus (tanpa boolalpha): " << sudahLulus << endl;

    // Setelah baris ini, bool dicetak sebagai teks true / false.
    cout << boolalpha;

    cout << "Umur: " << umur << endl;
    cout << "Tinggi: " << tinggi << endl;
    cout << "Berat: " << berat << endl;
    cout << "Inisial: " << inisial << endl;
    cout << "Sudah lulus: " << sudahLulus << endl;

    // Implicit conversion: double -> int, desimal dibuang (bukan dibulatkan).
    int hasilKonversi = 3.7;
    cout << "int hasilKonversi = 3.7 -> " << hasilKonversi << endl;

    // Brace initialization menolak narrowing. Hapus tanda // di bawah untuk
    // melihat compiler menolaknya (error: narrowing conversion).
    // int ditolak{3.7};

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('C++ bersifat?', [
            ['Statically typed — tipe data dideklarasikan eksplisit', true],
            ['Dynamically typed seperti Python', false],
            ['Tidak punya tipe data sama sekali', false],
            ['Tipe data ditentukan otomatis saat runtime', false],
          ]),
          q('Tipe data mana yang dipakai untuk satu karakter di C++?', [
            ['char', true],
            ['int', false],
            ['string', false],
            ['bool', false],
          ]),
          q('Apa yang terjadi pada baris int x = 3.7; ?', [
            ['Compile berhasil, x bernilai 3 karena desimalnya dibuang', true],
            ['Compile error karena double tidak boleh dimasukkan ke int', false],
            ['Compile berhasil, x bernilai 4 karena dibulatkan', false],
            ['Compile berhasil, x tetap menyimpan 3.7 karena otomatis berubah jadi double', false],
          ]),
          q('Baris mana yang ditolak compiler (error)?', [
            ['int a{3.7};', true],
            ['int b = 3.7;', false],
            ['double c = 3;', false],
            ['char d = 65;', false],
          ]),
          q('Apa yang dicetak cout << true; kalau boolalpha belum dipakai?', [
            ['1', true],
            ['true', false],
            ['True', false],
            ['Tidak mencetak apa pun', false],
          ]),
        ],
      },
      {
        title: 'Konstanta (const) & auto',
        slug: 'cppfz-const-auto',
        content: [
          'Kata kunci `const` menandai sebuah variabel sebagai konstanta: nilainya diisi saat deklarasi dan tidak bisa diubah lagi. Variabel `const` wajib langsung diberi nilai (`const int x;` tanpa nilai awal adalah error), dan setiap usaha mengubahnya ditolak compiler. Jadi `const` cocok untuk nilai yang memang tidak boleh berubah, seperti `PI` — kesalahannya tertangkap saat compile, bukan jadi bug saat program berjalan.',
          '```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    const double PI = 3.14159;\n    // PI = 3.14;  // error: PI adalah const dan tidak bisa diubah\n    double jariJari = 2.0;\n    cout << PI * jariJari * jariJari << endl;  // 12.5664\n    return 0;\n}\n```',
          '`const` juga bisa dipasang pada referensi. Tanda `&` setelah tipe membuat referensi (alias, nama lain untuk variabel yang sama) — dibahas lengkap di lesson Referensi Dasar. Untuk saat ini cukup tahu bahwa parameter `const string& nama` berarti fungsi memakai string aslinya tanpa menyalin isinya, sekaligus berjanji tidak mengubahnya; compiler menolak setiap usaha mengubah `nama` di dalam fungsi. Ini pola standar untuk parameter yang hanya dibaca, terutama untuk data besar seperti `std::string` dan `std::vector`. Bonusnya, `const&` boleh menerima nilai sementara seperti teks literal `"Siti"`, sedangkan referensi biasa (`string&`) tidak.',
          'Dengan `auto`, compiler menebak tipe variabel dari nilai awalnya: `auto umur = 20;` bertipe `int`, `auto berat = 55.25;` bertipe `double`. Ini BUKAN dynamic typing: tipenya tetap ditentukan saat compile dan tidak bisa berubah setelahnya; `auto` hanya menghemat penulisan tipe. Karena tipenya diambil dari nilai awal, variabel `auto` wajib punya nilai awal (`auto y;` adalah error). Perhatikan juga hasil ekspresinya: `auto a = 7 / 2;` bertipe `int` (nilainya `3`), sedangkan `auto b = 7 / 2.0;` bertipe `double` (nilainya `3.5`).',
          'Dua jebakan `auto`. Pertama, `auto teks = "halo";` bertipe `const char*` (pointer ke teks gaya C), BUKAN `std::string`; tulis `auto teks = string("halo");` kalau butuh `std::string`. Kedua, `auto` selalu membuat salinan baru: kalau nilai awalnya variabel `const` atau referensi, hasilnya tetap salinan biasa (bukan `const`, bukan alias). Kalau butuh alias baca-saja, tulis `const auto&`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

// const& : fungsi memakai string aslinya (tanpa menyalin) dan tidak boleh mengubahnya.
void sapa(const string& nama) {
    // nama = "lain";  // hapus tanda // untuk melihat error: nama bersifat const
    cout << "Halo, " << nama << "!" << endl;
}

int main() {
    const double PI = 3.14159;
    // PI = 3.14;  // error: PI adalah const, tidak bisa diubah
    double jariJari = 2.0;
    cout << "Luas lingkaran: " << PI * jariJari * jariJari << endl;

    string nama = "Budi";
    sapa(nama);
    sapa("Siti");  // teks literal boleh karena parameternya const&

    // auto: compiler menebak tipe dari nilai awal (tipe tetap, bukan dynamic typing)
    auto umur = 20;                // int
    auto berat = 55.25;            // double
    auto hasilInt = 7 / 2;         // int, jadi 3
    auto hasilDesimal = 7 / 2.0;   // double, jadi 3.5
    auto sapaan = string("Halo");  // std::string
    cout << "umur = " << umur << ", berat = " << berat << endl;
    cout << "7 / 2 = " << hasilInt << ", 7 / 2.0 = " << hasilDesimal << endl;
    cout << "sapaan: " << sapaan << endl;

    // auto menyalin: salinan bertipe int biasa, BUKAN const
    const int batas = 100;
    auto salinan = batas;
    salinan = 5;  // boleh diubah
    cout << "batas = " << batas << ", salinan = " << salinan << endl;

    // auto teks = "halo";  // bertipe const char*, BUKAN std::string

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi kalau program menulis PI = 3.14; padahal PI dideklarasikan const double PI = 3.14159; ?', [
            ['Compile error karena PI bersifat const', true],
            ['Nilai PI berubah, const hanya memberi peringatan', false],
            ['Nilai PI tetap, perubahannya diabaikan tanpa error', false],
            ['Program ter-compile, errornya baru muncul saat baris itu dijalankan', false],
          ]),
          q('Apa arti parameter const string& nama pada sebuah fungsi?', [
            ['Memakai string aslinya tanpa menyalin, dan fungsi tidak boleh mengubahnya', true],
            ['Menerima salinan string, jadi perubahannya tidak memengaruhi variabel asli', false],
            ['Boleh mengubah string asli, tapi tidak boleh membaca isinya', false],
            ['Fungsi hanya bisa dipanggil dengan variabel, bukan dengan teks literal', false],
          ]),
          q('Apa tipe variabel hasil pada auto hasil = 7 / 2.0; ?', [
            ['double, bernilai 3.5', true],
            ['int, bernilai 3, karena 7 dan 2 adalah bilangan bulat', false],
            ['float, bernilai 3.5', false],
            ['Tidak punya tipe pasti, tipenya bisa berubah saat program berjalan', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'cppfz-operator',
        content: [
          'Operator aritmatika di C++ mirip banyak bahasa lain: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo, hanya untuk integer). Perlu diingat: pembagian antar dua `int` menghasilkan `int` (desimal dibuang), berbeda dengan Python yang selalu float. Kalau salah satu operand bertipe `double`, hasilnya `double`: `10 / 3` adalah `3`, tapi `10 / 3.0` adalah `3.33333`.',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — semuanya menghasilkan nilai `bool` (`true`/`false`). Saat dicetak dengan `cout`, hasil `bool` tampil sebagai `1` (true) atau `0` (false), kecuali kamu menulis `cout << boolalpha;` lebih dulu — setelah itu yang tampil adalah teks `true`/`false`.',
          'Operator logika: `&&` (AND/dan), `||` (OR/atau), `!` (NOT/negasi) — dipakai menggabungkan beberapa kondisi boolean. Berbeda dengan Python yang menulis kata `and`/`or`/`not`, C++ memakai simbol.',
          'C++ juga punya operator increment/decrement pendek `++` dan `--`, misal `angka++;` setara dengan `angka = angka + 1;`.',
          '```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 10;\n    int b = 3;\n    cout << (a / b) << endl;    // 3\n    cout << (a / 3.0) << endl;  // 3.33333\n    cout << (a % b) << endl;    // 1\n    cout << (a > b) << endl;    // 1\n    cout << boolalpha;\n    cout << (a > b) << endl;    // true\n    return 0;\n}\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 3;

    cout << "Penjumlahan: " << (a + b) << endl;
    cout << "Pembagian integer: " << (a / b) << " (desimal dibuang)" << endl;
    cout << "Pembagian dengan double: " << (a / 3.0) << endl;
    cout << "Sisa bagi: " << (a % b) << endl;

    // Hasil perbandingan bertipe bool; tanpa boolalpha tercetak 1 atau 0.
    cout << "Perbandingan a > b (tanpa boolalpha): " << (a > b) << endl;

    cout << boolalpha;
    cout << "Perbandingan a > b: " << (a > b) << endl;
    cout << "Logika a > b && b > 0: " << (a > b && b > 0) << endl;

    a++;
    cout << "Setelah increment, a = " << a << endl;

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Berapa hasil 7 / 2 di C++ kalau keduanya bertipe int?', [
            ['3', true],
            ['3.5', false],
            ['4', false],
            ['3.0', false],
          ]),
          q('Apa yang dicetak cout << (5 > 3); kalau boolalpha belum dipakai?', [
            ['1', true],
            ['true', false],
            ['True', false],
            ['5', false],
          ]),
          q('Apa hasil operator % pada dua bilangan bulat?', [
            ['Sisa bagi', true],
            ['Persentase dari bilangan pertama', false],
            ['Hasil bagi yang dibulatkan', false],
            ['Hasil bagi dalam bentuk desimal', false],
          ]),
        ],
      },
      {
        title: 'Array & std::string',
        slug: 'cppfz-array-string',
        content: [
          'Array di C++ adalah kumpulan data dengan tipe sama yang ukurannya tetap (fixed-size), dideklarasikan dengan `tipe nama[ukuran]`, misal `int nilai[3] = {80, 90, 75};`. Akses elemen lewat index mulai dari 0: `nilai[0]`.',
          'Ukuran array C++ murni (native array) tidak bisa berubah setelah dibuat — berbeda dengan list Python yang bisa `append()`. Untuk kebutuhan ukuran dinamis, C++ modern lebih sering memakai `std::vector` dari STL (dibahas di modul terakhir).',
          '`std::string` adalah tipe untuk menyimpan teks, jauh lebih mudah dipakai dibanding array `char` mentah dari C. Ia didefinisikan di header `<string>`, jadi tulis `#include <string>` setiap kali memakainya. Di beberapa compiler, `<iostream>` kebetulan ikut menyertakan `<string>`, sehingga kode tanpa include itu kadang tetap bisa compile — tapi standar C++ tidak menjamin hal itu, dan kode yang sama bisa gagal di compiler lain. Operator `+` bisa dipakai untuk menggabungkan (concatenate) dua `string`.',
          'Method umum `std::string`: `.length()` mengembalikan jumlah karakter, `.substr(mulai, panjang)` mengambil sebagian teks, dan operator `[]` untuk mengakses karakter tertentu seperti array.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int nilai[3] = {80, 90, 75};
    cout << "Nilai pertama: " << nilai[0] << endl;
    cout << "Nilai kedua: " << nilai[1] << endl;

    string nama = "Budi";
    string sapaan = "Halo, " + nama + "!";
    cout << sapaan << endl;
    cout << "Panjang nama: " << nama.length() << endl;
    cout << "3 huruf pertama: " << nama.substr(0, 3) << endl;

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Sifat utama array murni (native array) di C++ adalah?', [
            ['Ukurannya tetap (fixed-size) setelah dibuat', true],
            ['Ukurannya otomatis bertambah seperti list Python', false],
            ['Bisa menampung tipe data berbeda-beda', false],
            ['Tidak bisa diakses lewat index', false],
          ]),
          q('Tipe apa yang dipakai untuk menyimpan teks di C++ modern?', [
            ['std::string', true],
            ['std::text', false],
            ['std::word', false],
            ['std::char', false],
          ]),
          q('Method apa untuk mendapatkan jumlah karakter sebuah std::string?', [
            ['.length()', true],
            ['.size_of()', false],
            ['.count()', false],
            ['.total()', false],
          ]),
          q('Programmu memakai std::string. Apa yang sebaiknya selalu kamu lakukan?', [
            ['Menulis #include <string> sendiri, walau kadang compiler tetap menerima tanpa itu', true],
            ['Tidak perlu apa-apa karena #include <iostream> pasti menyertakan <string> di semua compiler', false],
            ['Cukup menulis using namespace std; tanpa #include apa pun', false],
            ['Menulis #include <char> karena string adalah kumpulan karakter', false],
          ]),
        ],
      },
      {
        title: 'Referensi Dasar',
        slug: 'cppfz-referensi-dasar',
        content: [
          'Referensi di C++ adalah "alias" atau nama lain untuk sebuah variabel yang sudah ada, dideklarasikan dengan tanda `&` setelah tipe data, misal `int& ref = angka;` — `ref` sekarang jadi nama lain untuk `angka`, mengubah `ref` juga mengubah `angka`.',
          'Referensi paling sering dipakai sebagai parameter fungsi (pass by reference), supaya fungsi bisa mengubah nilai asli variabel yang dikirim, atau supaya data besar tidak perlu disalin (copy) setiap kali fungsi dipanggil.',
          'Referensi berbeda dengan pointer: referensi tidak bisa "kosong" (harus langsung diisi saat dideklarasikan) dan tidak bisa "diarahkan ulang" ke variabel lain setelah itu, sedangkan pointer bisa `nullptr` dan bisa berpindah menunjuk ke alamat lain kapan saja.',
          'Karena referensi lebih sederhana dan lebih aman dibanding pointer, C++ modern menyarankan memakai referensi dulu untuk kasus umum, dan baru memakai pointer kalau memang butuh fleksibilitas seperti alokasi memori dinamis (dibahas nanti di modul STL).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

void tambahSepuluh(int& nilai) {
    // Karena parameter berupa referensi (&), perubahan di sini
    // langsung mengubah variabel asli di pemanggil.
    nilai = nilai + 10;
}

int main() {
    int angka = 5;
    int& ref = angka;

    cout << "Sebelum: angka = " << angka << ", ref = " << ref << endl;

    ref = 100;
    cout << "Setelah ref diubah: angka = " << angka << endl;

    tambahSepuluh(angka);
    cout << "Setelah tambahSepuluh: angka = " << angka << endl;

    return 0;
}
`,
      },
    ],
  },
  {
    title: 'Kontrol Alur & Fungsi',
    lessons: [
      {
        title: 'Percabangan if/else/switch',
        slug: 'cppfz-percabangan-if-else-switch',
        content: [
          'Percabangan `if`/`else if`/`else` di C++ mirip banyak bahasa lain, tapi kondisinya wajib ditulis dalam tanda kurung `()` dan blok kodenya dalam kurung kurawal `{}` (bukan indentasi seperti Python).',
          '`switch` adalah alternatif untuk percabangan dengan banyak nilai diskrit dari satu variabel, memakai `case` untuk tiap kemungkinan nilai dan `break` untuk menghentikan eksekusi supaya tidak "jatuh" (fall-through) ke `case` berikutnya. `default` menangani nilai yang tidak cocok dengan `case` mana pun.',
          'C++ juga punya conditional (ternary) operator: `hasil = (nilai >= 60) ? "lulus" : "gagal";` — satu baris menggantikan if/else sederhana, mirip konsep di Python tapi dengan sintaks `? :`. Kalau hasilnya disimpan ke `std::string`, ingat menulis `#include <string>` di bagian atas program.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int nilai = 75;

    if (nilai >= 90) {
        cout << "Grade A" << endl;
    } else if (nilai >= 75) {
        cout << "Grade B" << endl;
    } else if (nilai >= 60) {
        cout << "Grade C" << endl;
    } else {
        cout << "Tidak lulus" << endl;
    }

    int hari = 3;
    switch (hari) {
        case 1:
            cout << "Senin" << endl;
            break;
        case 2:
            cout << "Selasa" << endl;
            break;
        case 3:
            cout << "Rabu" << endl;
            break;
        default:
            cout << "Hari tidak dikenal" << endl;
    }

    string status = (nilai >= 60) ? "lulus" : "gagal";
    cout << "Status: " << status << endl;

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang wajib membungkus kondisi if di C++?', [
            ['Tanda kurung ()', true],
            ['Titik dua :', false],
            ['Tidak perlu apa-apa', false],
            ['Kurung siku []', false],
          ]),
          q('Kata kunci apa yang mencegah fall-through di dalam switch?', [
            ['break', true],
            ['stop', false],
            ['end', false],
            ['exit', false],
          ]),
          q('Bagaimana sintaks ternary operator di C++?', [
            ['kondisi ? nilai_jika_benar : nilai_jika_salah', true],
            ['if kondisi then nilai_benar else nilai_salah', false],
            ['kondisi -> nilai_benar , nilai_salah', false],
            ['kondisi ?? nilai_benar :: nilai_salah', false],
          ]),
        ],
      },
      {
        title: 'Perulangan for & while',
        slug: 'cppfz-perulangan-for-while',
        content: [
          '`for` di C++ punya bentuk klasik tiga bagian: `for (inisialisasi; kondisi; increment) { ... }`, misal `for (int i = 0; i < 5; i++)` mengulang 5 kali dengan `i` bernilai 0 sampai 4.',
          '`while` mengulang selama kondisi masih `true`, cocok kalau jumlah pengulangan tidak diketahui di awal. Kondisinya dicek sebelum blok dijalankan, jadi kalau kondisi sudah `false` sejak awal, isi `while` tidak dijalankan sama sekali.',
          '## do-while',
          '`do-while` kebalikannya: blok kode dijalankan dulu, baru kondisi dicek. Akibatnya blok `do-while` selalu berjalan minimal satu kali, meski kondisinya sudah `false` sejak awal. Perhatikan titik koma (`;`) yang wajib ada setelah `while (...)`.',
          '```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int percobaan = 10;\n\n    do {\n        cout << "do-while jalan, percobaan = " << percobaan << endl;\n        percobaan++;\n    } while (percobaan < 5);\n\n    while (percobaan < 5) {\n        cout << "while ini tidak pernah jalan" << endl;\n    }\n\n    return 0;\n}\n```',
          '`break` menghentikan loop lebih awal (keluar sepenuhnya dari loop), `continue` melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya — sama persis konsepnya dengan bahasa lain.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 5; i++) {
        if (i == 3) {
            continue;
        }
        cout << "Iterasi for ke-" << i << endl;
    }

    int hitung = 0;
    while (hitung < 3) {
        cout << "Iterasi while ke-" << hitung << endl;
        hitung++;
    }

    // do-while: blok jalan dulu, baru kondisi dicek. Kondisinya (percobaan < 5)
    // sudah false sejak awal, tapi blok tetap berjalan satu kali.
    int percobaan = 10;
    do {
        cout << "do-while jalan, percobaan = " << percobaan << endl;
        percobaan++;
    } while (percobaan < 5);

    // while dengan kondisi yang sama: blok tidak dijalankan sama sekali.
    while (percobaan < 5) {
        cout << "while ini tidak pernah jalan" << endl;
    }

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Berapa kali isi loop for (int i = 0; i < 5; i++) dijalankan?', [
            ['5 kali', true],
            ['4 kali karena i berhenti di 4', false],
            ['6 kali karena i = 5 juga ikut dijalankan', false],
            ['Tak terhingga karena tidak ada break', false],
          ]),
          q('Berapa kali blok do-while dijalankan kalau kondisinya sudah false sejak awal?', [
            ['Tepat satu kali', true],
            ['Nol kali, sama seperti while', false],
            ['Terus-menerus tanpa henti', false],
            ['Tidak jalan karena compile error', false],
          ]),
          q('Apa yang dilakukan continue di dalam loop?', [
            ['Melompati sisa iterasi ini dan lanjut ke iterasi berikutnya', true],
            ['Menghentikan seluruh loop dan langsung keluar ke baris setelah loop', false],
            ['Mengulang iterasi yang sama lagi dari awal tanpa menambah counter', false],
            ['Menghentikan seluruh program dan kembali ke sistem operasi', false],
          ]),
        ],
      },
      {
        title: 'Fungsi & Function Overloading',
        slug: 'cppfz-fungsi-overloading',
        content: [
          'Fungsi di C++ dideklarasikan dengan format `tipe_return nama_fungsi(parameter) { ... }`. Berbeda dengan Python, tipe return dan tipe tiap parameter harus dituliskan eksplisit. Kalau fungsi tidak mengembalikan nilai, tipe returnnya `void`.',
          '`return` mengembalikan nilai dari fungsi sekaligus menghentikan eksekusinya. Compiler membaca kode dari atas ke bawah, jadi fungsi harus sudah dideklarasikan sebelum dipakai: tulis definisinya di atas `main()`, atau tulis function prototype (baris deklarasi tanpa isi, diakhiri `;`) di atas `main()` kalau definisinya ditulis setelah `main()`.',
          '```cpp\n#include <iostream>\nusing namespace std;\n\nint kuadrat(int x);  // prototype: fungsi sudah dikenal compiler\n\nint main() {\n    cout << kuadrat(4) << endl;  // 16\n    return 0;\n}\n\nint kuadrat(int x) {  // definisi ditulis setelah main()\n    return x * x;\n}\n```',
          'Function overloading adalah fitur khas C++: kita bisa membuat beberapa fungsi dengan nama sama tapi jumlah/tipe parameter berbeda — compiler otomatis memilih versi yang cocok berdasarkan argumen yang diberikan saat pemanggilan. Perbedaan tipe return saja tidak cukup untuk membedakan dua fungsi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

int tambah(int a, int b) {
    return a + b;
}

// Function overloading: nama sama, tipe parameter beda
double tambah(double a, double b) {
    return a + b;
}

void sapa(string nama) {
    cout << "Halo, " << nama << endl;
}

int main() {
    cout << "Tambah int: " << tambah(5, 3) << endl;
    cout << "Tambah double: " << tambah(5.5, 3.2) << endl;
    sapa("Siswa BarisORG");
    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang harus dituliskan eksplisit pada setiap fungsi C++?', [
            ['Tipe return dan tipe tiap parameter', true],
            ['Tidak perlu tipe apa pun', false],
            ['Hanya nama fungsi saja', false],
            ['Jumlah baris kode fungsi', false],
          ]),
          q('Tipe return apa yang dipakai kalau fungsi tidak mengembalikan nilai?', [
            ['void', true],
            ['null', false],
            ['empty', false],
            ['none', false],
          ]),
          q('Apa itu function overloading?', [
            ['Beberapa fungsi nama sama dengan parameter berbeda', true],
            ['Memanggil fungsi berkali-kali dalam loop', false],
            ['Fungsi yang memanggil dirinya sendiri', false],
            ['Fungsi tanpa parameter sama sekali', false],
          ]),
          q('Fungsi tambah didefinisikan SETELAH main(), tanpa prototype, tapi dipanggil di dalam main(). Apa yang terjadi?', [
            ['Compile error karena compiler belum mengenal tambah saat membaca main()', true],
            ['Program jalan normal karena compiler mencari fungsi ke seluruh isi file', false],
            ['Compile berhasil, tapi error saat baris pemanggilan itu dijalankan', false],
            ['Compile berhasil dengan warning, lalu fungsi dipanggil dari bagian bawah file', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'OOP Dasar',
    lessons: [
      {
        title: 'Class & Object',
        slug: 'cppfz-class-object',
        content: [
          'Class di C++ adalah blueprint/cetakan untuk membuat object, dideklarasikan dengan kata kunci `class`. Class berisi atribut (data yang dimiliki object) dan method (fungsi yang dimiliki object).',
          'Anggota class (atribut dan method) punya tingkat akses. Secara default, anggota `class` bersifat `private`: hanya bisa dipakai dari dalam class itu sendiri. Label `public:` membuat semua anggota setelahnya bisa diakses dari luar class, misalnya dari `main()` lewat titik. Di contoh sandbox, semua anggota `Siswa` ditulis setelah `public:` supaya bisa langsung diisi dari `main()`. Tingkat akses selengkapnya (`private`, `protected`) dibahas di lesson Encapsulation.',
          'Object dibuat dari class dengan cara mendeklarasikan variabel bertipe class tersebut, misal `Siswa siswa1;` — mirip mendeklarasikan variabel bertipe `int`, tapi tipe di sini adalah class buatan sendiri.',
          'Akses atribut dan method sebuah object memakai titik (`.`), misal `siswa1.nama` atau `siswa1.perkenalan()`. Ini konsep dasar yang sama di hampir semua bahasa OOP, termasuk Python. Atribut hanya bisa diakses lewat titik dari luar class kalau berstatus `public`:',
          '```cpp\n#include <iostream>\nusing namespace std;\n\nclass Kotak {\n    int panjang;  // tanpa label: otomatis private\npublic:\n    int lebar;    // public\n};\n\nint main() {\n    Kotak k;\n    k.lebar = 5;      // OK\n    // k.panjang = 3; // error: panjang bersifat private\n    cout << k.lebar << endl;\n    return 0;\n}\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

class Siswa {
public:  // anggota di bawah label ini bisa diakses dari luar class (mis. dari main)
    string nama;
    int umur;

    void perkenalan() {
        cout << "Halo, saya " << nama << ", umur " << umur << " tahun" << endl;
    }
};

int main() {
    Siswa siswa1;
    siswa1.nama = "Budi";
    siswa1.umur = 20;

    Siswa siswa2;
    siswa2.nama = "Siti";
    siswa2.umur = 22;

    siswa1.perkenalan();
    siswa2.perkenalan();

    // Coba hapus baris "public:" di atas: siswa1.nama = ... jadi error
    // karena anggota class secara default private.

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan class dan object di C++?', [
            ['Class adalah cetakan, object adalah instance-nya', true],
            ['Class dan object adalah hal yang persis sama', false],
            ['Object dibuat sebelum class', false],
            ['Class hanya bisa dipakai sekali saja', false],
          ]),
          q('Apa fungsi label public: pada class Siswa di lesson ini?', [
            ['Membuat anggota di bawahnya bisa diakses dari luar class', true],
            ['Membuat class ini bisa dipakai juga oleh file program lain', false],
            ['Membuat compiler otomatis membuatkan constructor untuk class ini', false],
            ['Wajib ditulis, tanpa itu class tidak bisa di-compile sama sekali', false],
          ]),
          q('Class Kotak punya int panjang; tanpa label apa pun. Apa yang terjadi saat main() menulis k.panjang = 5; ?', [
            ['Compile error karena anggota class secara default private', true],
            ['Berjalan normal karena atribut selalu bisa diakses dengan titik', false],
            ['Compile berhasil, tapi nilai panjang tetap tidak berubah', false],
            ['Compile berhasil dengan warning, lalu nilainya berubah', false],
          ]),
          q('Bagaimana cara mengakses atribut public nama dari object siswa1?', [
            ['siswa1.nama', true],
            ['siswa1->nama', false],
            ['siswa1[nama]', false],
            ['Siswa::nama', false],
          ]),
        ],
      },
      {
        title: 'Constructor & Destructor',
        slug: 'cppfz-constructor-destructor',
        content: [
          'Constructor adalah method khusus yang otomatis dijalankan saat object baru dibuat, dipakai untuk mengisi nilai awal atribut. Nama constructor harus sama persis dengan nama class-nya, dan tidak punya tipe return (bahkan bukan `void`).',
          'Constructor bisa menerima parameter, sehingga kita bisa langsung membuat object dengan nilai awal tertentu, misal `Siswa siswa1("Budi", 20);` — ini menghindari perlu mengisi atribut satu per satu setelah object dibuat.',
          'Ada cara kedua untuk mengisi atribut: member initializer list, ditulis setelah tanda `:` di antara kurung parameter dan `{`, misal `Siswa(string n, int u) : nama(n), umur(u) {}`. Atribut langsung dibuat dengan nilai itu, bukan dibuat kosong dulu lalu diisi ulang di dalam body. Initializer list juga wajib dipakai untuk mengisi atribut `const` atau referensi dari parameter constructor, dan untuk memanggil constructor class induk yang butuh argumen (dipakai di lesson Inheritance). Atribut selalu diinisialisasi sesuai urutan deklarasinya di class, bukan urutan penulisan di list.',
          '```cpp\n#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Siswa {\npublic:\n    string nama;\n    int umur;\n    Siswa(string namaAwal, int umurAwal) : nama(namaAwal), umur(umurAwal) {}\n};\n\nint main() {\n    Siswa s("Budi", 20);\n    cout << s.nama << " " << s.umur << endl;\n    return 0;\n}\n```',
          'Destructor adalah kebalikan dari constructor — otomatis dijalankan saat object dihancurkan/keluar dari scope, ditulis dengan tanda `~` di depan nama class, misal `~Siswa()`. Berguna untuk "membersihkan" resource yang dipakai object (misal memori yang dialokasikan manual). Object yang dibuat di dalam blok `{ }` dihancurkan saat blok berakhir, sedangkan object di `main()` dihancurkan saat `main()` selesai, dengan urutan terbalik dari urutan pembuatannya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

class Siswa {
public:
    string nama;
    int umur;

    // Constructor dengan member initializer list: dijalankan otomatis saat object dibuat
    Siswa(string namaAwal, int umurAwal) : nama(namaAwal), umur(umurAwal) {
        cout << "Object Siswa " << nama << " dibuat" << endl;
    }

    // Destructor: dijalankan otomatis saat object dihancurkan
    ~Siswa() {
        cout << "Object Siswa " << nama << " dihancurkan" << endl;
    }
};

int main() {
    Siswa siswa1("Budi", 20);

    {
        Siswa siswa2("Siti", 22);
        cout << "Di dalam blok" << endl;
    }  // siswa2 keluar dari scope: destructor jalan di sini

    Siswa siswa3("Andi", 21);
    cout << "Nama: " << siswa1.nama << ", Umur: " << siswa1.umur << endl;

    // Di akhir main(): siswa3 dihancurkan dulu, baru siswa1 (urutan terbalik).
    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang benar tentang constructor di C++?', [
            ['Namanya sama dengan nama class dan tidak punya tipe return', true],
            ['Namanya bebas, tapi harus bertipe return void di semua class', false],
            ['Harus dipanggil manual lewat method setelah object dibuat', false],
            ['Namanya selalu constructor() sama di semua class', false],
          ]),
          q('Apa fungsi bagian : nama(n), umur(u) pada Siswa(string n, int u) : nama(n), umur(u) {} ?', [
            ['Mengisi atribut nama dan umur langsung dengan nilai n dan u', true],
            ['Mendeklarasikan ulang nama dan umur sebagai variabel lokal', false],
            ['Membuat nama dan umur menjadi atribut milik class induk', false],
            ['Menyalin seluruh object Siswa lain ke object yang baru dibuat', false],
          ]),
          q('Kapan destructor ~Siswa() dijalankan untuk object yang dibuat di dalam blok { }?', [
            ['Saat blok itu berakhir dan object keluar dari scope', true],
            ['Saat program selesai sepenuhnya, setelah main() berakhir', false],
            ['Saat object dibuat, tepat sebelum constructor-nya jalan', false],
            ['Hanya kalau kita memanggil ~Siswa() secara manual', false],
          ]),
        ],
      },
      {
        title: 'Encapsulation & Access Modifier',
        slug: 'cppfz-encapsulation-access-modifier',
        content: [
          'Encapsulation adalah prinsip OOP yang membungkus data (atribut) dan menyembunyikannya dari akses langsung dari luar class, hanya bisa diakses lewat method tertentu — tujuannya menjaga data tetap valid dan konsisten.',
          'C++ punya tiga access modifier: `public` (bisa diakses dari mana saja), `private` (hanya bisa diakses dari dalam class itu sendiri), dan `protected` (bisa diakses dari dalam class dan class turunannya/inheritance, tapi tidak dari luar). Anggota `class` yang tidak diberi label apa pun otomatis `private`.',
          'Pola umum encapsulation: atribut dibuat `private`, lalu disediakan method `public` untuk membaca (getter) dan mengubah (setter) nilainya — setter bisa menambahkan validasi sebelum benar-benar mengubah data, sesuatu yang tidak bisa dilakukan kalau atribut diakses langsung.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

class RekeningBank {
private:
    double saldo;

public:
    RekeningBank(double saldoAwal) {
        saldo = saldoAwal;
    }

    // Getter: cara aman membaca saldo dari luar
    double getSaldo() {
        return saldo;
    }

    // Setter dengan validasi: tidak boleh setor nilai negatif
    void setor(double jumlah) {
        if (jumlah > 0) {
            saldo = saldo + jumlah;
        } else {
            cout << "Jumlah setoran tidak valid" << endl;
        }
    }
};

int main() {
    RekeningBank rekening(100000);
    cout << "Saldo awal: " << rekening.getSaldo() << endl;

    rekening.setor(50000);
    cout << "Saldo setelah setor: " << rekening.getSaldo() << endl;

    rekening.setor(-1000);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Access modifier mana yang hanya bisa diakses dari dalam class itu sendiri, tidak dari luar maupun dari class turunan?', [
            ['private', true],
            ['protected', false],
            ['public', false],
          ]),
          q('Apa tujuan utama encapsulation?', [
            ['Menyembunyikan data & menjaganya tetap valid lewat method', true],
            ['Membuat program berjalan lebih cepat', false],
            ['Menghapus kebutuhan constructor', false],
            ['Mengizinkan semua atribut diakses bebas dari luar', false],
          ]),
          q('Access modifier mana yang bisa diakses dari class turunan, tapi tidak dari kode di luar class (misal dari main())?', [
            ['protected', true],
            ['private', false],
            ['public', false],
            ['Tidak ada, class turunan selalu punya akses yang sama dengan kode luar', false],
          ]),
        ],
      },
      {
        title: 'Inheritance Dasar',
        slug: 'cppfz-inheritance-dasar',
        content: [
          'Inheritance (pewarisan) memungkinkan sebuah class (child/derived class) mewarisi atribut dan method dari class lain (parent/base class), sehingga kode tidak perlu ditulis ulang untuk hal-hal yang sudah sama.',
          'Sintaks inheritance di C++: `class Anak : public Induk { ... };` — dengan ini, class `Anak` otomatis punya semua anggota `public`/`protected` milik `Induk`, ditambah anggota barunya sendiri. Anggota `private` milik `Induk` tetap ada di dalam object, tapi tidak bisa diakses langsung dari `Anak`.',
          'Constructor tidak otomatis diwariskan. Constructor class turunan memanggil constructor induk lewat initializer list (dibahas di lesson Constructor & Destructor), misal `Kucing(string namaKucing) : Hewan(namaKucing) {}`. Bagian induk selalu dibuat lebih dulu, baru body constructor turunan dijalankan.',
          'Class turunan juga bisa mendefinisikan ulang method milik induk dengan nama yang sama, seperti `bersuara()` di contoh sandbox. Tapi hati-hati: kalau method di induk tidak ditandai `virtual`, versi di turunan hanya menyembunyikan (name hiding) versi induk, bukan meng-override-nya. Lewat object bertipe `Kucing`, yang terpanggil memang versi `Kucing`. Tapi lewat referensi bertipe `Hewan`, yang terpanggil tetap versi `Hewan`, karena compiler memilih versi berdasarkan tipe referensinya, bukan object aslinya.',
          'Intinya (potongan dari contoh sandbox di bawah, bukan program utuh):',
          '```cpp\nKucing kucing("Kitty");\nkucing.bersuara();          // versi Kucing\n\nHewan& ref = kucing;\nref.bersuara();             // versi Hewan: name hiding, bukan override\n```',
          'Supaya versi yang terpanggil ditentukan oleh object aslinya (bukan tipe referensinya), method di induk harus ditandai `virtual`. Itulah override yang sebenarnya, dan menjadi dasar dari polymorphism — dibahas di lesson berikutnya, Virtual Function & Polymorphism.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

class Hewan {
public:
    string nama;

    Hewan(string namaHewan) : nama(namaHewan) {}

    void bersuara() {
        cout << nama << " mengeluarkan suara" << endl;
    }
};

// Kucing mewarisi semua anggota public dari Hewan
class Kucing : public Hewan {
public:
    // Memanggil constructor Hewan lewat initializer list
    Kucing(string namaKucing) : Hewan(namaKucing) {}

    // bersuara() di Hewan TIDAK virtual, jadi ini hanya menyembunyikan
    // (name hiding) versi milik Hewan, bukan meng-override-nya.
    void bersuara() {
        cout << nama << " berkata: Meong!" << endl;
    }
};

int main() {
    Hewan hewan("Hewan generik");
    hewan.bersuara();

    Kucing kucing("Kitty");
    kucing.bersuara();

    // Lewat referensi bertipe Hewan, yang terpanggil tetap versi Hewan.
    Hewan& ref = kucing;
    ref.bersuara();

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi bagian : Hewan(namaKucing) pada constructor Kucing?', [
            ['Memanggil constructor induk Hewan sebelum body constructor Kucing jalan', true],
            ['Menyalin semua method Hewan ke dalam Kucing saat program berjalan', false],
            ['Menandai constructor Kucing sebagai override dari constructor Hewan', false],
            ['Mengisi semua atribut Hewan dengan nilai default 0 secara otomatis', false],
          ]),
          q('Hewan& ref = kucing; ref.bersuara(); Method bersuara() di Hewan TIDAK virtual. Versi mana yang dijalankan?', [
            ['Versi Hewan, karena versi Kucing hanya menyembunyikannya (name hiding)', true],
            ['Versi milik Kucing, karena object yang sebenarnya adalah Kucing', false],
            ['Compile error karena referensi Hewan tidak boleh merujuk ke Kucing', false],
            ['Kedua versi dijalankan berurutan, versi Hewan dulu baru versi Kucing', false],
          ]),
          q('Anggota Induk yang mana yang tidak bisa diakses langsung dari class Anak (class Anak : public Induk)?', [
            ['Anggota private milik Induk', true],
            ['Anggota protected milik Induk', false],
            ['Anggota public milik Induk', false],
          ]),
        ],
      },
      {
        title: 'Virtual Function & Polymorphism',
        slug: 'cppfz-virtual-polymorphism',
        content: [
          'Di lesson Inheritance kita melihat jebakannya: lewat referensi bertipe `Hewan`, method `bersuara()` yang tidak `virtual` selalu memanggil versi `Hewan`, meski object aslinya `Kucing`. Padahal sering kita justru ingin sebaliknya: kode yang hanya tahu `Hewan` tetap menjalankan perilaku khas tiap jenis hewan. Itulah runtime polymorphism ("banyak bentuk"): satu pemanggilan `h.bersuara()`, hasilnya menyesuaikan tipe object yang sebenarnya pada saat program berjalan.',
          'Caranya: tandai method di class induk dengan `virtual`. Setelah itu method di class turunan dengan nama dan parameter yang sama meng-override-nya, dan versi yang dijalankan dipilih berdasarkan object aslinya. Di class turunan, tulis juga `override` setelah daftar parameter. Kata kunci ini opsional, tapi sangat dianjurkan: kalau method itu ternyata tidak menimpa method virtual mana pun (misal salah ketik nama atau beda tipe parameter), compiler langsung memberi error, bukan diam-diam membuat method baru yang menyembunyikan.',
          '```cpp\n#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Hewan {\npublic:\n    string nama;\n    Hewan(string n) : nama(n) {}\n    virtual ~Hewan() {}\n    virtual void bersuara() { cout << nama << " mengeluarkan suara" << endl; }\n};\n\nclass Kucing : public Hewan {\npublic:\n    Kucing(string n) : Hewan(n) {}\n    void bersuara() override { cout << nama << " berkata: Meong!" << endl; }\n};\n\nvoid perintahkanBersuara(Hewan& h) {\n    h.bersuara();  // versi mana yang jalan ditentukan oleh object aslinya\n}\n\nint main() {\n    Kucing kucing("Kitty");\n    perintahkanBersuara(kucing);  // Kitty berkata: Meong!\n    return 0;\n}\n```',
          'Polymorphism hanya bekerja lewat referensi atau pointer ke class induk, seperti parameter `Hewan& h` di atas. Kalau object turunan disalin ke variabel bertipe induk, `Hewan salinan = kucing;`, bagian `Kucing`-nya terpotong (object slicing) dan yang dipanggil tetap versi `Hewan`. Di kode nyata, object turunan biasanya disimpan lewat pointer ke class induk (`Hewan*`); pointer dibahas di lesson Pointer di modul berikutnya.',
          'Satu kebiasaan penting: kalau sebuah class punya method `virtual`, beri juga destructor `virtual` (`virtual ~Hewan() {}`, seperti di contoh). Meng-`delete` object turunan lewat pointer ke class induk yang destructor-nya bukan virtual adalah undefined behavior (biasanya destructor turunan tidak ikut dijalankan). Alasan lengkapnya akan jelas setelah kamu belajar `new` dan `delete`.',
          'Method virtual yang tidak punya implementasi masuk akal di class induk bisa ditulis `virtual void bersuara() = 0;` (pure virtual). Class yang punya pure virtual method disebut abstract class: object-nya tidak bisa dibuat langsung, dan class turunan wajib meng-override method itu kalau ingin bisa dibuat object-nya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
using namespace std;

class Hewan {
public:
    string nama;

    Hewan(string namaHewan) : nama(namaHewan) {}

    // Destructor virtual: kebiasaan baik untuk class dengan method virtual
    virtual ~Hewan() {}

    // virtual: versi yang jalan ditentukan oleh object aslinya (saat program berjalan)
    virtual void bersuara() {
        cout << nama << " mengeluarkan suara" << endl;
    }
};

class Kucing : public Hewan {
public:
    Kucing(string namaKucing) : Hewan(namaKucing) {}

    // override: compiler akan error kalau ini tidak benar-benar menimpa method virtual
    void bersuara() override {
        cout << nama << " berkata: Meong!" << endl;
    }
};

class Anjing : public Hewan {
public:
    Anjing(string namaAnjing) : Hewan(namaAnjing) {}

    void bersuara() override {
        cout << nama << " berkata: Guk guk!" << endl;
    }
};

// Parameter berupa referensi ke Hewan: bisa menerima Hewan, Kucing, maupun Anjing.
void perintahkanBersuara(Hewan& h) {
    h.bersuara();
}

int main() {
    Hewan hewan("Hewan generik");
    Kucing kucing("Kitty");
    Anjing anjing("Doggo");

    perintahkanBersuara(hewan);
    perintahkanBersuara(kucing);
    perintahkanBersuara(anjing);

    // Object slicing: kucing DISALIN ke variabel bertipe Hewan, bagian Kucing-nya
    // terpotong, jadi yang terpanggil versi Hewan walau method-nya virtual.
    Hewan salinan = kucing;
    salinan.bersuara();

    // Coba hapus kata "virtual" di Hewan::bersuara(): compiler menolak "override"
    // di Kucing dan Anjing karena tidak ada method virtual yang ditimpa. Hapus juga
    // semua "override" untuk melihat semua pemanggilan memakai versi Hewan.

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa efek menandai method di class induk dengan virtual?', [
            ['Versi yang jalan ditentukan oleh object aslinya, saat program berjalan', true],
            ['Method itu terkunci dan tidak bisa ditimpa oleh class turunan mana pun', false],
            ['Method itu otomatis dipanggil sekali setiap object turunan dibuat', false],
            ['Method itu hanya bisa dipanggil dari dalam class induknya sendiri', false],
          ]),
          q('Apa manfaat menulis override pada method di class turunan?', [
            ['Compiler memberi error kalau method itu tidak menimpa method virtual induk', true],
            ['Tanpa override, method turunan pasti tidak akan menimpa method virtual induk', false],
            ['Method itu berjalan lebih cepat karena sudah ditandai sebagai penimpa', false],
            ['Method induk jadi tersembunyi dan tidak bisa dipanggil lagi dari luar class', false],
          ]),
          q('Method bersuara() di Hewan sudah virtual. Apa yang dicetak oleh Hewan salinan = kucing; salinan.bersuara(); ?', [
            ['Versi Hewan, karena kucing disalin menjadi object Hewan (object slicing)', true],
            ['Versi Kucing, karena method-nya sudah virtual', false],
            ['Compile error karena object Kucing tidak boleh disalin ke variabel Hewan', false],
            ['Kedua versi dicetak berurutan, versi Hewan dulu baru versi Kucing', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'STL & Studi Kasus',
    lessons: [
      {
        title: 'Pointer & Referensi Lanjutan',
        slug: 'cppfz-pointer-referensi-lanjutan',
        content: [
          '## Pointer ke variabel',
          'Pointer adalah variabel yang menyimpan alamat memori dari variabel lain, dideklarasikan dengan tanda `*`, misal `int* p;`. Operator `&` di depan variabel mengambil alamat memori variabel tersebut, sedangkan `*` di depan pointer men-dereference (mengambil nilai yang ditunjuk). Pointer boleh diarahkan ulang (rebind) ke variabel lain kapan saja, misal `p = &b;`.',
          '## Memori dinamis: new dan delete',
          'Selain menunjuk ke variabel yang sudah ada, pointer juga bisa menunjuk ke memori yang dialokasikan secara dinamis (di runtime) memakai `new`, misal `int* p = new int(10);`. Memori seperti ini harus dibebaskan manual dengan `delete p;` setelah tidak dipakai lagi, kalau tidak akan terjadi memory leak.',
          '```cpp\n#include <iostream>\n\nint main() {\n    int* p = new int(10);   // alokasi dinamis, nilai awal 10\n    std::cout << *p << std::endl;\n    delete p;               // bebaskan memori\n    p = nullptr;            // tandai: tidak menunjuk apa pun\n    return 0;\n}\n```',
          'Setelah `delete p;`, variabel `p` masih menyimpan alamat lama yang sudah tidak valid (dangling pointer), dan memakainya lagi adalah bug klasik di C++. Kebiasaan baik: langsung isi `p = nullptr;`. Men-`delete` pointer yang bernilai `nullptr` aman (tidak melakukan apa-apa), tapi men-`delete` alamat yang sama dua kali adalah bug.',
          '## Pointer vs referensi',
          'Berbeda dari referensi (`&` di deklarasi variabel, dibahas di Modul 2) yang tidak bisa `nullptr` dan tidak bisa diarahkan ulang (rebind) ke variabel lain setelah dibuat, pointer bisa keduanya. Pointer lebih fleksibel tapi juga lebih berisiko: pointer yang tidak diinisialisasi atau menjadi dangling tidak ditolak compiler, dan baru menimbulkan masalah saat program berjalan. Karena itu, mulailah dengan referensi, dan pakai pointer kalau memang butuh fleksibilitas itu.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 20;

    // Pointer ke variabel yang sudah ada
    int* p = &a;  // p menyimpan alamat a
    cout << "Nilai a lewat p: " << *p << endl;
    *p = 11;      // mengubah a lewat pointer
    cout << "a sekarang: " << a << endl;

    // Pointer boleh diarahkan ulang (rebind) ke variabel lain
    p = &b;
    cout << "Setelah diarahkan ulang, *p = " << *p << endl;

    // Memori dinamis: new mengalokasikan, delete membebaskan
    int* dinamis = new int(42);
    cout << "Nilai di memori dinamis: " << *dinamis << endl;
    *dinamis = *dinamis + 8;
    cout << "Setelah diubah: " << *dinamis << endl;

    delete dinamis;     // wajib, kalau tidak terjadi memory leak
    dinamis = nullptr;  // hindari dangling pointer

    if (dinamis == nullptr) {
        cout << "dinamis sudah nullptr, aman dicek sebelum dipakai" << endl;
    }

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang disimpan oleh sebuah pointer?', [
            ['Alamat memori dari variabel lain', true],
            ['Nilai langsung dari variabel lain', false],
            ['Nama variabel lain', false],
            ['Tipe data variabel lain', false],
          ]),
          q('Kata kunci apa untuk mengalokasikan memori dinamis di C++?', [
            ['new', true],
            ['alloc', false],
            ['create', false],
            ['make', false],
          ]),
          q('Apa yang wajib dilakukan setelah selesai memakai memori dari new?', [
            ['Membebaskannya dengan delete', true],
            ['Membiarkannya begitu saja', false],
            ['Mengubahnya jadi referensi', false],
            ['Tidak perlu tindakan apa pun', false],
          ]),
          q('Apa perbedaan utama pointer dengan referensi?', [
            ['Pointer bisa nullptr dan diarahkan ulang, referensi tidak', true],
            ['Referensi bisa nullptr, pointer tidak', false],
            ['Keduanya persis identik tanpa perbedaan', false],
            ['Pointer hanya bisa dipakai di dalam class', false],
          ]),
          q('Setelah delete p;, apa kebiasaan baik berikutnya terhadap pointer p?', [
            ['Mengisinya dengan nullptr supaya tidak menjadi dangling pointer', true],
            ['Memanggil delete p; sekali lagi untuk memastikan memorinya bersih', false],
            ['Tidak perlu apa-apa, p otomatis berubah jadi nullptr setelah delete', false],
            ['Membaca *p sekali lagi untuk memeriksa bahwa nilainya sudah hilang', false],
          ]),
        ],
      },
      {
        title: 'Vector (std::vector) Dasar dari STL',
        slug: 'cppfz-vector-stl-dasar',
        content: [
          'STL (Standard Template Library) adalah kumpulan struktur data dan algoritma siap pakai bawaan C++. `std::vector` (dari header `<vector>`) adalah salah satu yang paling sering dipakai — mirip list di Python, ukurannya bisa bertambah secara dinamis, berbeda dengan array C++ murni yang ukurannya tetap.',
          'Method umum `std::vector`: `.push_back(nilai)` menambah item di akhir, `.size()` mengembalikan jumlah item, dan akses elemen lewat index dengan `[]` sama seperti array biasa, misal `angka[0]`.',
          'Karena `vector` adalah template (bisa menyimpan tipe data apa saja), deklarasinya perlu menyebutkan tipe di dalam kurung siku sudut, misal `vector<int> angka;` untuk vector berisi integer, atau `vector<string> nama;` untuk vector berisi string.',
          'Loop `for` berbasis range (`for (int x : angka)`) adalah cara modern dan ringkas untuk mengulang seluruh elemen sebuah vector tanpa perlu index manual — mirip `for item in list` di Python.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> angka;
    angka.push_back(10);
    angka.push_back(20);
    angka.push_back(30);

    cout << "Jumlah elemen: " << angka.size() << endl;
    cout << "Elemen pertama: " << angka[0] << endl;

    cout << "Semua elemen: ";
    for (int x : angka) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa keunggulan std::vector dibanding array C++ murni?', [
            ['Ukurannya bisa bertambah secara dinamis', true],
            ['Selalu lebih cepat tanpa syarat apa pun', false],
            ['Tidak butuh header tambahan', false],
            ['Hanya bisa menyimpan integer', false],
          ]),
          q('Method apa untuk menambah item ke akhir std::vector?', [
            ['.push_back()', true],
            ['.append()', false],
            ['.add()', false],
            ['.insert_end()', false],
          ]),
          q('Bagaimana cara mendeklarasikan vector berisi tipe string?', [
            ['vector<string> nama;', true],
            ['vector[string] nama;', false],
            ['vector nama<string>;', false],
            ['string vector nama;', false],
          ]),
        ],
      },
      {
        title: 'Map (std::map) & Sort (std::sort)',
        slug: 'cppfz-stl-map-sort',
        content: [
          'Selain `vector`, STL punya `std::map` (header `<map>`): koleksi pasangan key-value, mirip dictionary di Python. Tiap key unik, dan isinya otomatis terurut berdasarkan key. Deklarasinya menyebut tipe key dan tipe value, misal `map<string, int> nilai;` (key `string`, value `int`). Mengisi atau mengubah: `nilai["Budi"] = 80;` — kalau key belum ada, entry baru dibuat; kalau sudah ada, nilainya ditimpa (tidak pernah ada key ganda). `.size()` memberi jumlah entry dan `.erase(key)` menghapus satu entry.',
          'Hati-hati: membaca `nilai["Dewi"]` untuk key yang belum ada TIDAK error. `map` justru menambahkan entry baru `"Dewi"` dengan nilai default (`0` untuk `int`), sehingga `.size()` ikut bertambah. Untuk sekadar mengecek apakah sebuah key ada tanpa menambahkannya, pakai `.find(key)` (kalau hasilnya sama dengan `.end()`, artinya key tidak ketemu) atau `.count(key)` (hasilnya `0` atau `1`).',
          'Untuk mengulang isi map, pakai range-for. Setiap elemennya adalah sepasang data: `.first` adalah key dan `.second` adalah value. Urutannya mengikuti key (alfabet untuk `string`), bukan urutan data dimasukkan.',
          '```cpp\n#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<string, int> nilai;\n    nilai["Siti"] = 90;\n    nilai["Budi"] = 80;\n    nilai["Budi"] = 85;  // key sudah ada: nilainya ditimpa\n\n    for (const auto& pasangan : nilai) {\n        cout << pasangan.first << ": " << pasangan.second << endl;\n    }\n    return 0;\n}\n```',
          '`std::sort` (header `<algorithm>`) mengurutkan isi `vector` di tempatnya. Ia menerima dua iterator, yaitu penanda posisi dalam wadah: `v.begin()` menunjuk elemen pertama dan `v.end()` menunjuk posisi tepat setelah elemen terakhir. `sort(v.begin(), v.end());` mengurutkan menaik (kecil ke besar; `string` urut alfabet). Untuk urutan lain, beri argumen ketiga berupa fungsi pembanding yang menerima dua elemen dan mengembalikan `true` kalau elemen pertama harus berada sebelum elemen kedua, misal `bool lebihBesar(int a, int b) { return a > b; }`, lalu `sort(v.begin(), v.end(), lebihBesar);` untuk urutan menurun.',
          '`std::sort` tidak bisa dipakai pada `std::map`: map selalu terurut berdasarkan key-nya, dan iterator-nya tidak mendukung akses acak yang dibutuhkan `sort`. `sort` cocok untuk `vector` (dan array).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

// Fungsi pembanding untuk sort: true kalau a harus berada SEBELUM b.
bool lebihBesar(int a, int b) {
    return a > b;
}

void cetak(const vector<int>& v) {
    for (int x : v) {
        cout << x << " ";
    }
    cout << endl;
}

void cetak(const vector<string>& v) {
    for (const string& s : v) {
        cout << s << " ";
    }
    cout << endl;
}

int main() {
    // map: nama siswa -> nilai
    map<string, int> nilai;
    nilai["Budi"] = 80;
    nilai["Siti"] = 90;
    nilai["Andi"] = 70;
    nilai["Budi"] = 85;  // key sudah ada: nilainya ditimpa, bukan entry baru

    cout << "Jumlah siswa: " << nilai.size() << endl;
    cout << "Nilai Siti: " << nilai["Siti"] << endl;

    // find: cek key tanpa menambahkannya. end() berarti "tidak ketemu".
    if (nilai.find("Dewi") == nilai.end()) {
        cout << "Dewi tidak ada di map" << endl;
    }

    // Iterasi: urut berdasarkan key (alfabet), bukan urutan insert.
    cout << "Isi map (urut berdasarkan key):" << endl;
    for (const auto& pasangan : nilai) {
        cout << pasangan.first << " -> " << pasangan.second << endl;
    }

    // Jebakan: membaca key yang belum ada lewat [] MENAMBAHKAN entry baru.
    cout << "Nilai Dewi (key baru lewat []): " << nilai["Dewi"] << endl;
    cout << "Jumlah siswa sekarang: " << nilai.size() << endl;

    // sort pada vector
    vector<int> angka = {40, 10, 30, 20};  // cara singkat mengisi vector dengan {}
    sort(angka.begin(), angka.end());
    cout << "Menaik: ";
    cetak(angka);

    sort(angka.begin(), angka.end(), lebihBesar);
    cout << "Menurun: ";
    cetak(angka);

    vector<string> nama = {"Siti", "Budi", "Andi"};
    sort(nama.begin(), nama.end());
    cout << "Nama terurut: ";
    cetak(nama);

    return 0;
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Berapa nilai m.size() setelah map<string, int> m; m["a"] = 1; m["a"] = 2; ?', [
            ['1, karena key sama hanya satu entry dan nilainya ditimpa', true],
            ['2, karena setiap penugasan menambah satu entry baru ke dalam map', false],
            ['0, karena penugasan kedua menghapus entry dari penugasan pertama', false],
            ['Compile error karena key "a" sudah ada di dalam map', false],
          ]),
          q('Apa yang terjadi kalau kode membaca m["zzz"] padahal key "zzz" belum ada di map<string, int> m?', [
            ['Entry "zzz" ditambahkan dengan nilai default 0, jadi size() naik', true],
            ['Program berhenti dengan error runtime karena key tidak ditemukan', false],
            ['Mengembalikan 0 sebagai nilai bawaan, namun isi map tidak berubah', false],
            ['Mengembalikan nilai acak dari memori, dan map tidak berubah', false],
          ]),
          q('Mana yang mengurutkan vector<int> v dari besar ke kecil, kalau lebihBesar(a, b) mengembalikan a > b?', [
            ['sort(v.begin(), v.end(), lebihBesar);', true],
            ['sort(v.begin(), v.end());', false],
            ['v.sort(lebihBesar);', false],
            ['sort(lebihBesar, v.begin(), v.end());', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus: Program Sederhana Gabungan',
        slug: 'cppfz-studi-kasus-gabungan',
        content: [
          'Sekarang saatnya menggabungkan konsep yang sudah dipelajari — class, vector, dan fungsi — ke dalam satu program sederhana yang lebih realistis: sistem pencatat nilai beberapa siswa.',
          'Program di bawah mendefinisikan class `Siswa` dengan constructor untuk inisialisasi, menyimpan beberapa object `Siswa` di dalam `std::vector<Siswa>`, lalu memakai fungsi terpisah untuk menghitung rata-rata nilai — menunjukkan bagaimana class, vector, dan fungsi biasa saling melengkapi dalam satu program. Perhatikan dua pola dari lesson sebelumnya: constructor memakai member initializer list, dan fungsi `hitungRataRata` menerima `const vector<Siswa>&` karena hanya membaca data (tanpa menyalin vector dan tanpa mengubahnya).',
          'Pola seperti ini — memisahkan data (class), koleksi data (vector), dan logika pemrosesan (fungsi) — adalah struktur umum yang akan sering ditemui saat menulis program C++ yang lebih besar.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Siswa {
public:
    string nama;
    int nilai;

    Siswa(string namaSiswa, int nilaiSiswa) : nama(namaSiswa), nilai(nilaiSiswa) {}
};

// const& : hanya membaca daftar, tidak menyalin dan tidak mengubahnya
double hitungRataRata(const vector<Siswa>& daftarSiswa) {
    double total = 0;
    for (const Siswa& s : daftarSiswa) {
        total = total + s.nilai;
    }
    return total / daftarSiswa.size();
}

int main() {
    vector<Siswa> daftarSiswa;
    daftarSiswa.push_back(Siswa("Budi", 80));
    daftarSiswa.push_back(Siswa("Siti", 90));
    daftarSiswa.push_back(Siswa("Andi", 70));

    cout << "Daftar nilai siswa:" << endl;
    for (const Siswa& s : daftarSiswa) {
        cout << "- " << s.nama << ": " << s.nilai << endl;
    }

    cout << "Rata-rata nilai: " << hitungRataRata(daftarSiswa) << endl;

    return 0;
}
`,
      },
      {
        title: 'Ringkasan & Best Practice C++',
        slug: 'cppfz-ringkasan-best-practice',
        content: [
          'RAII (Resource Acquisition Is Initialization) adalah prinsip penting di C++: sebuah resource (memori, file, koneksi) sebaiknya diikat ke lifetime sebuah object — dialokasikan saat object dibuat (constructor) dan dibebaskan otomatis saat object hancur (destructor). Ini mencegah lupa membersihkan resource secara manual.',
          'Aturan praktis memilih referensi vs pointer: pakai referensi (`&`) sebagai default untuk parameter fungsi — dan `const&` untuk parameter yang hanya dibaca — karena lebih sederhana dan tidak bisa `nullptr`. Tapi referensi bukan tanpa risiko: ia bisa menggantung (dangling) kalau objek yang dirujuk sudah hancur, misalnya fungsi yang mengembalikan referensi ke variabel lokalnya sendiri. Baru pakai pointer kalau memang butuh merepresentasikan "mungkin tidak ada nilai" (`nullptr`) atau butuh mengubah target yang ditunjuk di tengah jalan.',
          'Contoh referensi menggantung (SALAH, jangan ditiru):',
          '```cpp\nint& salah() {\n    int lokal = 5;\n    return lokal;  // lokal hancur saat fungsi selesai: referensi menggantung\n}\n```',
          'C++ modern (C++11 ke atas) menyediakan "smart pointer" (`std::unique_ptr`, `std::shared_ptr`) yang otomatis menerapkan RAII untuk memori dinamis, sehingga `delete` manual jarang dibutuhkan lagi di kode modern — meski penting tetap memahami `new`/`delete` mentah sebagai fondasi.',
          'Sepanjang course ini kita sudah belajar dari struktur program dasar, tipe data, `const` dan `auto`, operator, kontrol alur, fungsi, OOP (class, constructor, encapsulation, inheritance, virtual function dan polymorphism), hingga pointer dan STL (`std::vector`, `std::map`, `std::sort`) — fondasi yang cukup untuk mulai membangun program C++ yang lebih kompleks dan mengeksplorasi topik lanjutan seperti template dan smart pointer.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa inti dari prinsip RAII?', [
            ['Resource diikat ke lifetime object: dialokasikan di constructor, dibebaskan di destructor', true],
            ['Semua variabel harus global', false],
            ['Resource harus dialokasikan di luar class', false],
            ['Program tidak boleh memakai memori dinamis sama sekali', false],
          ]),
          q('Kapan sebaiknya memakai pointer dibanding referensi?', [
            ['Saat butuh merepresentasikan "tidak ada nilai" (nullptr) atau berpindah target', true],
            ['Selalu, referensi tidak pernah dipakai', false],
            ['Tidak pernah, pointer sudah usang total', false],
            ['Hanya untuk menyimpan angka', false],
          ]),
          q('Apa yang disediakan C++ modern untuk mengotomatiskan RAII pada memori dinamis?', [
            ['Smart pointer seperti std::unique_ptr / std::shared_ptr', true],
            ['Garbage collector bawaan wajib', false],
            ['Penghapusan otomatis semua variabel', false],
            ['Fitur ini tidak tersedia di C++', false],
          ]),
          q('Mana pernyataan yang benar tentang referensi di C++?', [
            ['Referensi bisa menggantung kalau objek yang dirujuk sudah hancur, misal variabel lokal', true],
            ['Referensi selalu aman dipakai karena tidak mungkin menggantung seperti pointer', false],
            ['Referensi ke variabel lokal otomatis memperpanjang umur variabel itu setelah fungsinya selesai', false],
            ['Referensi hanya bisa menggantung kalau lebih dulu diubah menjadi pointer', false],
          ]),
        ],
      },
    ],
  },
]

const course: CourseDef = {
  title: 'C++ from Zero',
  slug: 'cpp-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'C++ from Zero adalah course pengantar untuk kamu yang belum pernah menulis kode sama sekali, maupun yang sudah kenal bahasa lain seperti Python dan ingin memahami bahasa yang dekat dengan mesin. C++ dipakai di balik game engine, sistem operasi, driver, dan software yang butuh kecepatan tinggi, jadi belajar C++ juga membantumu memahami apa yang terjadi di balik bahasa pemrograman yang lebih tinggi.',
    'Di sini kamu belajar dari dasar: struktur program dan proses compile, variabel dan tipe data (termasuk implicit conversion dan narrowing), `const` dan `auto`, operator, array dan `std::string`, referensi, percabangan, perulangan (`for`, `while`, dan `do-while`), fungsi dan function overloading, OOP (class, constructor dan destructor, encapsulation, inheritance, `virtual` dan polymorphism), pointer dengan alokasi memori dinamis (`new` dan `delete`), `std::vector`, `std::map` dan `std::sort`, hingga studi kasus gabungan dan best practice seperti RAII dan smart pointer. Hampir semua lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan hampir semua juga dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini menjalankan kode dengan GCC 9.2 (mode C++14, `gnu++14`), tanpa akses jaringan dan tanpa input keyboard, jadi `std::cin` tidak bisa dicoba di sana dan fitur C++17 ke atas (misalnya `std::optional` dan structured bindings) tidak tersedia. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun dan tidak perlu pengalaman programming sebelumnya.',
  ].join('\n\n'),
  sandboxLanguage: 'cpp',
  modules,
}

export default course
