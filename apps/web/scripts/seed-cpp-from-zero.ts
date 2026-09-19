import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "C++ from Zero" — meniru pola seed-python-from-zero.ts.
// Jalankan: pnpm seed:cpp

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
    title: 'Pengenalan C++',
    lessons: [
      {
        title: 'Apa itu C++?',
        slug: 'cppfz-apa-itu-cpp',
        content: [
          'C++ adalah bahasa pemrograman yang dibuat oleh Bjarne Stroustrup di Bell Labs, mulai dikembangkan sekitar tahun 1979 sebagai "C with Classes" dan dirilis dengan nama C++ pada tahun 1985. C++ dibangun di atas bahasa C dengan menambahkan konsep Object-Oriented Programming (OOP).',
          'Karena berakar dari C, C++ tetap mendukung hampir seluruh sintaks C, tapi menambahkan fitur seperti class, object, template, dan standard library (STL) yang jauh lebih kaya. Bisa dibilang C++ adalah "superset" dari C dengan tambahan kemampuan OOP.',
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
            ['Tidak butuh compiler', false],
          ]),
        ],
      },
      {
        title: 'Struktur Program & cout/cin',
        slug: 'cppfz-struktur-program-cout-cin',
        content: [
          'Setiap program C++ punya struktur dasar yang wajib ada: header yang di-include (misal `#include <iostream>`), dan fungsi `main()` sebagai titik masuk (entry point) program — di sinilah eksekusi program dimulai.',
          '`#include <iostream>` mengimpor pustaka input/output standar, yang menyediakan `std::cout` untuk mencetak output ke layar dan `std::cin` untuk membaca input dari pengguna. Operator `<<` dipakai untuk mengirim data ke `cout`, sedangkan `>>` dipakai untuk mengambil data dari `cin`.',
          'Fungsi `main()` harus mengembalikan nilai bertipe `int` — nilai `0` menandakan program selesai tanpa error. Setiap statement di C++ diakhiri titik koma (`;`), berbeda dengan Python yang tidak memakainya.',
          'Karena sandbox latihan tidak menyediakan input interaktif lewat stdin, contoh kode di sini akan menghardcode nilai yang biasanya diminta dari `cin`, supaya program tetap bisa langsung dijalankan dan diperiksa hasilnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>

int main() {
    std::cout << "Halo, C++!" << std::endl;

    // Biasanya nilai ini didapat dari std::cin >> nama;
    // tapi di sini di-hardcode supaya program bisa langsung dijalankan.
    std::string nama = "Siswa BarisORG";
    std::cout << "Halo, " << nama << "!" << std::endl;

    return 0;
}
`,
      },
      {
        title: 'Compile & Namespace',
        slug: 'cppfz-compile-namespace',
        content: [
          'Berbeda dengan Python yang langsung dijalankan interpreter, kode C++ harus di-compile dulu jadi kode mesin sebelum bisa dieksekusi. Compiler populer di antaranya GCC (`g++`) dan Clang. Perintah dasar: `g++ nama_file.cpp -o program`, lalu jalankan hasilnya dengan `./program`.',
          'Proses compile ini penting karena compiler memeriksa kesalahan sintaks dan tipe data sebelum program pernah dijalankan sama sekali — berbeda dengan bahasa interpreted yang baru ketahuan error saat baris itu dieksekusi.',
          '`namespace` adalah cara mengelompokkan nama (fungsi, class, variabel) supaya tidak bentrok antar pustaka. Statement `using namespace std;` membuat kita bisa menulis `cout` langsung tanpa awalan `std::` — tapi menulis `std::cout` secara eksplisit tetap dianggap praktik yang lebih aman di proyek besar.',
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
          q('Apa yang harus dilakukan sebelum kode C++ bisa dijalankan?', [
            ['Di-compile dulu jadi kode mesin', true],
            ['Langsung dijalankan interpreter seperti Python', false],
            ['Tidak perlu proses apa pun', false],
            ['Dikirim ke server khusus', false],
          ]),
          q('Compiler C++ yang umum dipakai adalah?', [
            ['g++ (GCC)', true],
            ['pip', false],
            ['node', false],
            ['python3', false],
          ]),
          q('Fungsi statement using namespace std; adalah?', [
            ['Supaya tidak perlu menulis awalan std:: setiap kali', true],
            ['Meng-import pustaka dari internet', false],
            ['Mengubah bahasa C++ jadi C', false],
            ['Menghapus fungsi main()', false],
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
          'Karena statically typed, compiler akan langsung menolak (error saat compile) kalau kita mencoba memasukkan nilai dengan tipe yang tidak cocok ke sebuah variabel — ini membantu menangkap bug lebih awal dibanding bahasa dynamically typed.',
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

    cout << "Umur: " << umur << endl;
    cout << "Tinggi: " << tinggi << endl;
    cout << "Berat: " << berat << endl;
    cout << "Inisial: " << inisial << endl;
    cout << "Sudah lulus: " << sudahLulus << endl;

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
          q('Apa yang terjadi kalau memasukkan nilai bertipe salah ke variabel di C++?', [
            ['Compiler akan menolak/error saat compile', true],
            ['Otomatis diubah tipenya tanpa masalah', false],
            ['Program tetap jalan normal', false],
            ['Hanya muncul warning, tidak berpengaruh', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'cppfz-operator',
        content: [
          'Operator aritmatika di C++ mirip banyak bahasa lain: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo, hanya untuk integer). Perlu diingat: pembagian antar dua `int` menghasilkan `int` (desimal dibuang), berbeda dengan Python yang selalu float.',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — semuanya menghasilkan nilai `bool` (`true`/`false`).',
          'Operator logika: `&&` (AND/dan), `||` (OR/atau), `!` (NOT/negasi) — dipakai menggabungkan beberapa kondisi boolean. Berbeda dengan Python yang menulis kata `and`/`or`/`not`, C++ memakai simbol.',
          'C++ juga punya operator increment/decrement pendek `++` dan `--`, misal `angka++;` setara dengan `angka = angka + 1;`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 3;

    cout << "Penjumlahan: " << (a + b) << endl;
    cout << "Pembagian integer: " << (a / b) << " (desimal dibuang)" << endl;
    cout << "Sisa bagi: " << (a % b) << endl;

    cout << "Perbandingan a > b: " << (a > b) << endl;
    cout << "Logika a > b && b > 0: " << (a > b && b > 0) << endl;

    a++;
    cout << "Setelah increment, a = " << a << endl;

    return 0;
}
`,
      },
      {
        title: 'Array & std::string',
        slug: 'cppfz-array-string',
        content: [
          'Array di C++ adalah kumpulan data dengan tipe sama yang ukurannya tetap (fixed-size), dideklarasikan dengan `tipe nama[ukuran]`, misal `int nilai[3] = {80, 90, 75};`. Akses elemen lewat index mulai dari 0: `nilai[0]`.',
          'Ukuran array C++ murni (native array) tidak bisa berubah setelah dibuat — berbeda dengan list Python yang bisa `append()`. Untuk kebutuhan ukuran dinamis, C++ modern lebih sering memakai `std::vector` dari STL (dibahas di modul terakhir).',
          '`std::string` (dari header `<string>`, biasanya sudah ikut ter-include lewat `<iostream>`) adalah tipe untuk menyimpan teks, jauh lebih mudah dipakai dibanding array `char` mentah dari C. Operator `+` bisa dipakai untuk menggabungkan (concatenate) dua `string`.',
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
          'C++ juga punya conditional (ternary) operator: `hasil = (nilai >= 60) ? "lulus" : "gagal";` — satu baris menggantikan if/else sederhana, mirip konsep di Python tapi dengan sintaks `? :`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
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
          '`while` mengulang selama kondisi masih `true`, cocok kalau jumlah pengulangan tidak diketahui di awal. Ada juga `do-while` yang menjalankan blok kode minimal satu kali sebelum mengecek kondisi.',
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

    return 0;
}
`,
      },
      {
        title: 'Fungsi & Function Overloading',
        slug: 'cppfz-fungsi-overloading',
        content: [
          'Fungsi di C++ dideklarasikan dengan format `tipe_return nama_fungsi(parameter) { ... }`. Berbeda dengan Python, tipe return dan tipe tiap parameter harus dituliskan eksplisit. Kalau fungsi tidak mengembalikan nilai, tipe returnnya `void`.',
          '`return` mengembalikan nilai dari fungsi sekaligus menghentikan eksekusinya. Fungsi harus dipanggil sebelum dipakai, atau dideklarasikan (function prototype) di atas `main()` kalau definisinya ditulis setelah `main()`.',
          'Function overloading adalah fitur khas C++: kita bisa membuat beberapa fungsi dengan nama sama tapi jumlah/tipe parameter berbeda — compiler otomatis memilih versi yang cocok berdasarkan argumen yang diberikan saat pemanggilan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
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
          'Object dibuat dari class dengan cara mendeklarasikan variabel bertipe class tersebut, misal `Siswa siswa1;` — mirip mendeklarasikan variabel bertipe `int`, tapi tipe di sini adalah class buatan sendiri.',
          'Akses atribut dan method sebuah object memakai titik (`.`), misal `siswa1.nama` atau `siswa1.perkenalan()`. Ini konsep dasar yang sama di hampir semua bahasa OOP, termasuk Python.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

class Siswa {
public:
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
          q('Kata kunci apa untuk mendeklarasikan class di C++?', [
            ['class', true],
            ['struct only', false],
            ['object', false],
            ['type', false],
          ]),
          q('Bagaimana cara mengakses atribut sebuah object?', [
            ['Dengan titik, misal object.atribut', true],
            ['Dengan kurung siku, misal object[atribut]', false],
            ['Dengan panah wajib, misal object->atribut', false],
            ['Atribut tidak bisa diakses dari luar class', false],
          ]),
        ],
      },
      {
        title: 'Constructor & Destructor',
        slug: 'cppfz-constructor-destructor',
        content: [
          'Constructor adalah method khusus yang otomatis dijalankan saat object baru dibuat, dipakai untuk mengisi nilai awal atribut. Nama constructor harus sama persis dengan nama class-nya, dan tidak punya tipe return (bahkan bukan `void`).',
          'Constructor bisa menerima parameter, sehingga kita bisa langsung membuat object dengan nilai awal tertentu, misal `Siswa siswa1("Budi", 20);` — ini menghindari perlu mengisi atribut satu per satu setelah object dibuat.',
          'Destructor adalah kebalikan dari constructor — otomatis dijalankan saat object dihancurkan/keluar dari scope, ditulis dengan tanda `~` di depan nama class, misal `~Siswa()`. Berguna untuk "membersihkan" resource yang dipakai object (misal memori yang dialokasikan manual).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

class Siswa {
public:
    string nama;
    int umur;

    // Constructor: dijalankan otomatis saat object dibuat
    Siswa(string namaAwal, int umurAwal) {
        nama = namaAwal;
        umur = umurAwal;
        cout << "Object Siswa " << nama << " dibuat" << endl;
    }

    // Destructor: dijalankan otomatis saat object dihancurkan
    ~Siswa() {
        cout << "Object Siswa " << nama << " dihancurkan" << endl;
    }
};

int main() {
    Siswa siswa1("Budi", 20);
    cout << "Nama: " << siswa1.nama << ", Umur: " << siswa1.umur << endl;
    return 0;
}
`,
      },
      {
        title: 'Encapsulation & Access Modifier',
        slug: 'cppfz-encapsulation-access-modifier',
        content: [
          'Encapsulation adalah prinsip OOP yang membungkus data (atribut) dan menyembunyikannya dari akses langsung dari luar class, hanya bisa diakses lewat method tertentu — tujuannya menjaga data tetap valid dan konsisten.',
          'C++ punya tiga access modifier: `public` (bisa diakses dari mana saja), `private` (hanya bisa diakses dari dalam class itu sendiri), dan `protected` (bisa diakses dari dalam class dan class turunannya/inheritance).',
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
          q('Access modifier mana yang hanya bisa diakses dari dalam class itu sendiri?', [
            ['private', true],
            ['public', false],
            ['protected juga dari luar bebas', false],
            ['global', false],
          ]),
          q('Apa tujuan utama encapsulation?', [
            ['Menyembunyikan data & menjaganya tetap valid lewat method', true],
            ['Membuat program berjalan lebih cepat', false],
            ['Menghapus kebutuhan constructor', false],
            ['Mengizinkan semua atribut diakses bebas dari luar', false],
          ]),
          q('Access modifier apa yang bisa diakses class turunan (inheritance)?', [
            ['protected', true],
            ['private', false],
            ['hanya public', false],
            ['tidak ada yang bisa', false],
          ]),
        ],
      },
      {
        title: 'Inheritance Dasar',
        slug: 'cppfz-inheritance-dasar',
        content: [
          'Inheritance (pewarisan) memungkinkan sebuah class (child/derived class) mewarisi atribut dan method dari class lain (parent/base class), sehingga kode tidak perlu ditulis ulang untuk hal-hal yang sudah sama.',
          'Sintaks inheritance di C++: `class Anak : public Induk { ... };` — dengan ini, class `Anak` otomatis punya semua anggota `public`/`protected` milik `Induk`, ditambah anggota barunya sendiri.',
          'Child class bisa menambahkan method baru atau meng-override (menimpa) method milik parent dengan mendefinisikan ulang method bernama sama — ini dasar dari konsep polymorphism yang lebih lanjut di OOP.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
using namespace std;

class Hewan {
public:
    string nama;

    Hewan(string namaHewan) {
        nama = namaHewan;
    }

    void bersuara() {
        cout << nama << " mengeluarkan suara" << endl;
    }
};

// Kucing mewarisi semua anggota public dari Hewan
class Kucing : public Hewan {
public:
    Kucing(string namaKucing) : Hewan(namaKucing) {}

    // Meng-override method bersuara() milik parent
    void bersuara() {
        cout << nama << " berkata: Meong!" << endl;
    }
};

int main() {
    Hewan hewan("Hewan generik");
    hewan.bersuara();

    Kucing kucing("Kitty");
    kucing.bersuara();

    return 0;
}
`,
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
          'Pointer adalah variabel yang menyimpan alamat memori dari variabel lain, dideklarasikan dengan tanda `*`, misal `int* p;`. Operator `&` di depan variabel mengambil alamat memori variabel tersebut, sedangkan `*` di depan pointer men-dereference (mengambil nilai yang ditunjuk).',
          'Selain menunjuk ke variabel yang sudah ada, pointer juga bisa menunjuk ke memori yang dialokasikan secara dinamis (di runtime) memakai `new`, misal `int* p = new int(10);`. Memori seperti ini harus dibebaskan manual dengan `delete p;` setelah tidak dipakai lagi, kalau tidak akan terjadi memory leak.',
          'Ini berbeda dari referensi (`&` di deklarasi variabel, dibahas di Modul 2) yang tidak bisa `nullptr` dan tidak bisa dialokasikan ulang. Pointer lebih fleksibel tapi juga lebih berisiko: pointer yang tidak diinisialisasi atau sudah di-`delete` tapi masih dipakai (dangling pointer) adalah sumber bug klasik di C++.',
          'Karena topik alokasi memori manual ini krusial dipahami secara konsep sebelum dipraktikkan bebas, dan berisiko menimbulkan kebingungan kalau langsung dipraktikkan tanpa konteks lengkap, lesson ini dipelajari lewat penjelasan dan quiz konsep terlebih dahulu.',
        ],
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
            ['malloc_cpp', false],
            ['create', false],
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
        title: 'Studi Kasus: Program Sederhana Gabungan',
        slug: 'cppfz-studi-kasus-gabungan',
        content: [
          'Sekarang saatnya menggabungkan konsep yang sudah dipelajari — class, vector, dan fungsi — ke dalam satu program sederhana yang lebih realistis: sistem pencatat nilai beberapa siswa.',
          'Program di bawah mendefinisikan class `Siswa` dengan constructor untuk inisialisasi, menyimpan beberapa object `Siswa` di dalam `std::vector<Siswa>`, lalu memakai fungsi terpisah untuk menghitung rata-rata nilai — menunjukkan bagaimana class, vector, dan fungsi biasa saling melengkapi dalam satu program.',
          'Pola seperti ini — memisahkan data (class), koleksi data (vector), dan logika pemrosesan (fungsi) — adalah struktur umum yang akan sering ditemui saat menulis program C++ yang lebih besar.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#include <iostream>
#include <vector>
using namespace std;

class Siswa {
public:
    string nama;
    int nilai;

    Siswa(string namaSiswa, int nilaiSiswa) {
        nama = namaSiswa;
        nilai = nilaiSiswa;
    }
};

double hitungRataRata(vector<Siswa>& daftarSiswa) {
    double total = 0;
    for (Siswa& s : daftarSiswa) {
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
    for (Siswa& s : daftarSiswa) {
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
          'Aturan praktis memilih referensi vs pointer: pakai referensi (`&`) sebagai default untuk parameter fungsi, karena lebih aman (tidak bisa `nullptr`, tidak bisa "menggantung"). Baru pakai pointer kalau memang butuh merepresentasikan "mungkin tidak ada nilai" (`nullptr`) atau butuh mengubah target yang ditunjuk di tengah jalan.',
          'C++ modern (C++11 ke atas) menyediakan "smart pointer" (`std::unique_ptr`, `std::shared_ptr`) yang otomatis menerapkan RAII untuk memori dinamis, sehingga `delete` manual jarang dibutuhkan lagi di kode modern — meski penting tetap memahami `new`/`delete` mentah sebagai fondasi.',
          'Sepanjang course ini kita sudah belajar dari struktur program dasar, tipe data, operator, kontrol alur, fungsi, OOP (class, constructor, encapsulation, inheritance), hingga pointer dan STL (`std::vector`) — fondasi yang cukup untuk mulai membangun program C++ yang lebih kompleks dan mengeksplorasi topik lanjutan seperti template dan smart pointer.',
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
      title: 'C++ from Zero',
      slug: 'cpp-from-zero',
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
            ? { sandboxLanguage: 'cpp', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "C++ from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
