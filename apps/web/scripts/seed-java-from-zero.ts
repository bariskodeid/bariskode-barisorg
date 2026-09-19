import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "Java from Zero" — course keempat non-dummy, meniru pola
// seed-python-from-zero.ts. Jalankan: pnpm seed:java

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
    title: 'Pengenalan Java',
    lessons: [
      {
        title: 'Apa itu Java?',
        slug: 'javafz-apa-itu-java',
        content: [
          'Java adalah bahasa pemrograman tingkat tinggi yang dibuat oleh James Gosling di Sun Microsystems, pertama dirilis tahun 1995. Java dirancang dengan filosofi "write once, run anywhere" (WORA) — kode yang ditulis sekali bisa dijalankan di platform apa pun tanpa perlu ditulis ulang.',
          'Kunci dari WORA adalah Java Virtual Machine (JVM). Kode Java tidak dikompilasi langsung menjadi kode mesin spesifik satu sistem operasi, melainkan menjadi bytecode — format perantara yang bisa dijalankan oleh JVM di Windows, Linux, maupun macOS selama JVM yang sesuai terpasang.',
          'Java bersifat statically typed (tipe data variabel harus dideklarasikan eksplisit dan dicek saat compile) dan strongly object-oriented — hampir semua kode Java ditulis di dalam class.',
          'Java banyak dipakai untuk aplikasi enterprise, backend server, aplikasi Android, hingga sistem skala besar, ditopang ekosistem library yang matang lewat build tool seperti Maven atau Gradle.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa pencipta bahasa Java?', [
            ['James Gosling', true],
            ['Guido van Rossum', false],
            ['Dennis Ritchie', false],
            ['Linus Torvalds', false],
          ]),
          q('Apa maksud filosofi "write once, run anywhere" pada Java?', [
            ['Kode ditulis sekali bisa dijalankan di platform apa pun lewat JVM', true],
            ['Kode Java hanya bisa dijalankan sekali lalu harus ditulis ulang', false],
            ['Java hanya bisa berjalan di satu sistem operasi', false],
            ['Java tidak butuh proses kompilasi sama sekali', false],
          ]),
          q('Java bersifat tipe data apa?', [
            ['Statically typed', true],
            ['Dynamically typed sepenuhnya seperti Python', false],
            ['Tidak memiliki tipe data', false],
            ['Tipe data ditentukan acak oleh JVM', false],
          ]),
          q('Komponen apa yang membuat kode Java bisa jalan di berbagai platform?', [
            ['JVM (Java Virtual Machine)', true],
            ['Browser web', false],
            ['Sistem operasi Windows saja', false],
            ['Compiler C++', false],
          ]),
        ],
      },
      {
        title: 'Struktur Program Java',
        slug: 'javafz-struktur-program',
        content: [
          'Setiap program Java minimal punya satu class, dan file `.java` biasanya dinamai sama persis dengan nama class publik di dalamnya (huruf besar/kecil termasuk), misal class `Main` disimpan di file `Main.java`.',
          'Titik masuk (entry point) program Java adalah method `public static void main(String[] args)` — JVM mencari method ini persis untuk mulai menjalankan program. Tanda kurung siku `[]` menandakan `args` adalah array of String, menampung argumen command line.',
          'Kata kunci `public` berarti method/class bisa diakses dari luar, `static` berarti method milik class itu sendiri (bukan milik object/instance tertentu), dan `void` berarti method itu tidak mengembalikan nilai apa pun.',
          'Untuk mencetak output ke layar, dipakai `System.out.println(...)` (mencetak lalu pindah baris baru) atau `System.out.print(...)` (mencetak tanpa pindah baris).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Halo, Java!");
        System.out.print("Baris ini ");
        System.out.println("tanpa pindah baris di antaranya");
    }
}
`,
      },
      {
        title: 'JVM & Proses Compile-Run',
        slug: 'javafz-jvm-compile-run',
        content: [
          'Menjalankan program Java melalui dua tahap: compile dan run. Tahap compile memakai `javac NamaFile.java` untuk mengubah kode sumber (`.java`) menjadi bytecode (`.class`) — format perantara yang belum bisa dibaca langsung oleh prosesor komputer.',
          'Tahap run memakai perintah `java NamaClass` (tanpa ekstensi `.class`) untuk menjalankan bytecode tersebut lewat JVM. JVM-lah yang menerjemahkan bytecode menjadi instruksi yang dipahami sistem operasi dan prosesor spesifik yang sedang dipakai.',
          'Kenapa tidak langsung dikompilasi jadi kode mesin seperti C? Karena bytecode bersifat platform-independent — file `.class` yang sama bisa dijalankan di JVM Windows, Linux, atau macOS tanpa dikompilasi ulang, selama masing-masing punya JVM yang kompatibel terpasang.',
          'Di sandbox pembelajaran ini, Judge0 sudah menangani proses compile dan run secara otomatis di baliknya — kita cukup menulis kode Java dan menekan tombol Run.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Perintah apa untuk mengompilasi file Java menjadi bytecode?', [
            ['javac', true],
            ['java', false],
            ['javab', false],
            ['jrun', false],
          ]),
          q('Ekstensi file hasil kompilasi Java (bytecode) adalah?', [
            ['.class', true],
            ['.jar', false],
            ['.exe', false],
            ['.obj', false],
          ]),
          q('Kenapa Java memakai bytecode, bukan langsung kode mesin seperti C?', [
            ['Supaya bytecode bisa dijalankan di berbagai platform lewat JVM', true],
            ['Supaya kode Java berjalan lebih lambat', false],
            ['Karena Java tidak bisa dikompilasi', false],
            ['Karena bytecode hanya berjalan di Windows', false],
          ]),
          q('Apa peran JVM dalam menjalankan program Java?', [
            ['Menerjemahkan bytecode menjadi instruksi yang dipahami sistem/prosesor', true],
            ['Menulis kode Java secara otomatis', false],
            ['Mengganti kebutuhan compiler sepenuhnya', false],
            ['Hanya dipakai untuk debugging', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Variabel & Tipe Data',
    lessons: [
      {
        title: 'Tipe Data Primitif',
        slug: 'javafz-tipe-data-primitif',
        content: [
          "Java punya delapan tipe data primitif, empat yang paling sering dipakai pemula: `int` (bilangan bulat, mis. `int umur = 20;`), `double` (bilangan desimal presisi ganda, mis. `double tinggi = 165.5;`), `char` (satu karakter tunggal ditulis dengan kutip tunggal, mis. `char inisial = 'B';`), dan `boolean` (hanya bernilai `true` atau `false`).",
          'Berbeda dari Python/JavaScript, Java mewajibkan deklarasi tipe data secara eksplisit di depan nama variabel — ini bagian dari sifat statically typed Java, tipe data dicek compiler sebelum program dijalankan.',
          'Setiap tipe primitif punya ukuran memori dan rentang nilai tetap, misal `int` menampung bilangan bulat 32-bit, sedangkan `long` (dengan sufiks `L`) dipakai untuk bilangan bulat yang lebih besar.',
          'Selain tipe primitif, Java juga punya reference type seperti `String` (teks) yang sebenarnya adalah object, bukan primitif — akan dibahas lebih lanjut di pelajaran String.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        int umur = 20;
        double tinggiBadan = 165.5;
        char inisial = 'B';
        boolean sudahLulus = true;

        System.out.println("Umur: " + umur);
        System.out.println("Tinggi badan: " + tinggiBadan);
        System.out.println("Inisial: " + inisial);
        System.out.println("Sudah lulus: " + sudahLulus);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe data apa untuk menyimpan bilangan bulat di Java?', [
            ['int', true],
            ['double', false],
            ['char', false],
            ['boolean', false],
          ]),
          q('Tipe data apa untuk menyimpan satu karakter tunggal?', [
            ['char', true],
            ['String', false],
            ['int', false],
            ['double', false],
          ]),
          q('Apa saja nilai valid untuk tipe boolean di Java?', [
            ['true dan false', true],
            ['1 dan 0', false],
            ['Yes dan No', false],
            ['Benar dan Salah (kata Indonesia)', false],
          ]),
          q('Kenapa Java disebut statically typed terkait deklarasi variabel?', [
            ['Tipe data harus dideklarasikan eksplisit dan dicek saat compile', true],
            ['Tipe data ditentukan otomatis saat runtime seperti Python', false],
            ['Java tidak punya tipe data', false],
            ['Semua variabel otomatis bertipe String', false],
          ]),
        ],
      },
      {
        title: 'Variabel & Operator',
        slug: 'javafz-variabel-operator',
        content: [
          'Deklarasi variabel di Java memakai format `tipe namaVariabel = nilai;`, misal `int nilai = 100;`. Nama variabel harus diawali huruf/underscore/dolar (bukan angka), bersifat case-sensitive, dan konvensi umum Java memakai `camelCase`, misal `nilaiUjian`.',
          'Operator aritmatika Java: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo). Perlu diperhatikan: pembagian dua `int` menghasilkan `int` (hasil desimal dibuang), sementara pembagian yang melibatkan `double` menghasilkan `double`.',
          'Operator perbandingan (`==`, `!=`, `>`, `<`, `>=`, `<=`) menghasilkan `boolean`. Operator logika `&&` (AND), `||` (OR), `!` (NOT) menggabungkan beberapa kondisi boolean.',
          'Java juga punya operator increment/decrement singkat: `nilai++` menambah 1, `nilai--` mengurangi 1, serta compound assignment seperti `nilai += 5` setara dengan `nilai = nilai + 5`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        System.out.println("Penjumlahan: " + (a + b));
        System.out.println("Pembagian int (dibulatkan): " + (a / b));
        System.out.println("Pembagian double: " + ((double) a / b));
        System.out.println("Sisa bagi: " + (a % b));

        boolean lebihBesar = a > b;
        System.out.println("a lebih besar dari b: " + lebihBesar);

        a++;
        System.out.println("Setelah increment, a = " + a);
    }
}
`,
      },
      {
        title: 'Type Casting',
        slug: 'javafz-type-casting',
        content: [
          'Type casting adalah proses mengubah nilai dari satu tipe data ke tipe lain. Java membedakan dua jenis casting: implicit (widening) dan explicit (narrowing).',
          'Implicit casting terjadi otomatis ketika mengubah tipe data yang lebih kecil ke tipe yang lebih besar (tidak berisiko kehilangan data), misal `int` ke `double` — Java melakukannya otomatis tanpa perlu penulisan khusus.',
          'Explicit casting harus ditulis manual dengan tanda kurung berisi tipe tujuan, misal `(int) 9.7`, dipakai ketika mengubah tipe data yang lebih besar ke tipe lebih kecil (berisiko kehilangan presisi/data), misal `double` ke `int` akan memotong bagian desimalnya.',
          'Casting antara `int` dan `char` juga dimungkinkan karena `char` di Java sebenarnya disimpan sebagai kode numerik (Unicode) di baliknya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        // Implicit casting: int ke double, otomatis, aman
        int angkaBulat = 10;
        double angkaDesimal = angkaBulat;
        System.out.println("Implicit int ke double: " + angkaDesimal);

        // Explicit casting: double ke int, harus ditulis manual
        double nilaiAsli = 9.7;
        int hasilCasting = (int) nilaiAsli;
        System.out.println("Explicit double ke int: " + hasilCasting);

        // Casting char ke int (kode Unicode)
        char huruf = 'A';
        int kodeHuruf = huruf;
        System.out.println("Kode Unicode dari 'A': " + kodeHuruf);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Casting dari int ke double di Java disebut?', [
            ['Implicit casting (widening)', true],
            ['Explicit casting (narrowing)', false],
            ['Tidak bisa dilakukan', false],
            ['Dynamic casting', false],
          ]),
          q('Bagaimana cara menulis explicit casting dari double ke int?', [
            ['(int) nilaiDouble', true],
            ['int(nilaiDouble)', false],
            ['nilaiDouble.toInt()', false],
            ['cast<int>(nilaiDouble)', false],
          ]),
          q('Apa yang terjadi saat double di-casting eksplisit ke int?', [
            ['Bagian desimalnya dipotong/dibuang', true],
            ['Otomatis dibulatkan ke atas', false],
            ['Terjadi error compile', false],
            ['Nilainya tidak berubah sama sekali', false],
          ]),
        ],
      },
      {
        title: 'String di Java',
        slug: 'javafz-string',
        content: [
          'Di Java, `String` adalah reference type (bukan primitif) yang merepresentasikan teks, ditulis dengan kutip ganda, misal `String nama = "Budi";`.',
          'Karakteristik penting `String` di Java adalah immutable — setelah sebuah objek `String` dibuat, isinya tidak bisa diubah. Operasi seperti `.toUpperCase()` atau penggabungan (`+`) sebenarnya membuat objek `String` baru, bukan mengubah objek yang lama.',
          'Method umum `String`: `.length()` mengembalikan jumlah karakter, `.toUpperCase()`/`.toLowerCase()` mengubah huruf besar/kecil, `.equals()` membandingkan isi dua String (bukan `==`, yang membandingkan referensi objek), `.substring(awal, akhir)` mengambil sebagian teks, `.charAt(index)` mengambil satu karakter di posisi tertentu.',
          'Penting: jangan membandingkan isi `String` dengan `==` karena bisa membandingkan referensi objek, bukan isi teksnya — selalu gunakan `.equals()` untuk membandingkan isi dua String.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        String nama = "Siswa BarisORG";

        System.out.println("Panjang string: " + nama.length());
        System.out.println("Huruf besar: " + nama.toUpperCase());
        System.out.println("Karakter ke-0: " + nama.charAt(0));
        System.out.println("Substring 0-5: " + nama.substring(0, 6));

        String a = "Java";
        String b = "Java";
        System.out.println("Bandingkan isi dengan equals: " + a.equals(b));
    }
}
`,
      },
    ],
  },
  {
    title: 'Kontrol Alur & Array',
    lessons: [
      {
        title: 'Percabangan if/switch',
        slug: 'javafz-percabangan-if-switch',
        content: [
          'Percabangan `if` di Java menjalankan blok kode (ditandai `{}`) hanya jika kondisi dalam kurung bernilai `true`. `else if` mengecek kondisi tambahan, `else` menjadi fallback kalau semua kondisi di atasnya `false`.',
          '`switch` cocok dipakai ketika ada banyak kemungkinan nilai dari satu variabel yang sama, sebagai alternatif rantai `if/else if` yang panjang. Setiap `case` diikuti `break;` untuk menghentikan eksekusi, kalau tidak eksekusi akan "jatuh" (fall-through) ke `case` berikutnya.',
          'Java juga punya ternary operator singkat: `hasil = (nilai >= 60) ? "lulus" : "gagal";` — satu baris menggantikan if/else sederhana yang hanya menghasilkan satu nilai.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        int nilai = 75;

        if (nilai >= 90) {
            System.out.println("Grade A");
        } else if (nilai >= 75) {
            System.out.println("Grade B");
        } else if (nilai >= 60) {
            System.out.println("Grade C");
        } else {
            System.out.println("Tidak lulus");
        }

        int hari = 3;
        switch (hari) {
            case 1:
                System.out.println("Senin");
                break;
            case 2:
                System.out.println("Selasa");
                break;
            case 3:
                System.out.println("Rabu");
                break;
            default:
                System.out.println("Hari lain");
        }

        String status = (nilai >= 60) ? "lulus" : "gagal";
        System.out.println("Status: " + status);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi jika lupa menulis break; di dalam case switch?', [
            ['Eksekusi jatuh (fall-through) ke case berikutnya', true],
            ['Program langsung berhenti total', false],
            ['Terjadi error compile', false],
            ['Case tersebut diabaikan sepenuhnya', false],
          ]),
          q('Bagaimana syntax ternary operator di Java?', [
            ['kondisi ? nilaiJikaTrue : nilaiJikaFalse', true],
            ['if kondisi then nilaiJikaTrue else nilaiJikaFalse', false],
            ['kondisi => nilaiJikaTrue, nilaiJikaFalse', false],
            ['ternary(kondisi, nilaiJikaTrue, nilaiJikaFalse)', false],
          ]),
          q('Kapan switch lebih cocok dipakai dibanding if/else if berantai?', [
            ['Ketika mengecek banyak kemungkinan nilai dari satu variabel yang sama', true],
            ['Ketika hanya ada satu kondisi boolean', false],
            ['Switch tidak pernah dianjurkan dipakai', false],
            ['Ketika ingin membandingkan dua variabel berbeda tipe', false],
          ]),
        ],
      },
      {
        title: 'Perulangan for & while',
        slug: 'javafz-perulangan-for-while',
        content: [
          '`for` loop di Java punya tiga bagian dipisah titik koma: inisialisasi, kondisi, dan increment/decrement. Contoh: `for (int i = 0; i < 5; i++)` mengulang 5 kali dengan `i` bernilai 0 sampai 4.',
          '`while` mengulang selama kondisi dalam kurung masih `true`, cocok kalau jumlah pengulangan tidak diketahui pasti di awal. `do-while` mirip `while` tapi kondisinya dicek di akhir, sehingga blok kode dijamin dijalankan minimal satu kali.',
          '`break` menghentikan loop lebih awal, `continue` melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya — sama seperti di banyak bahasa lain.',
          'Java juga punya enhanced for loop (for-each), misal `for (int angka : arrayAngka)`, yang akan dipraktikkan lebih lanjut di pelajaran Array.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            if (i == 3) {
                continue;
            }
            System.out.println("Iterasi for ke-" + i);
        }

        int hitung = 0;
        while (hitung < 3) {
            System.out.println("Iterasi while ke-" + hitung);
            hitung++;
        }

        int coba = 0;
        do {
            System.out.println("do-while jalan minimal sekali, coba = " + coba);
            coba++;
        } while (coba < 0);
    }
}
`,
      },
      {
        title: 'Array',
        slug: 'javafz-array',
        content: [
          'Array di Java menyimpan sekumpulan nilai dengan tipe data yang sama dan ukuran tetap (tidak bisa berubah setelah dibuat). Deklarasi: `int[] angka = {1, 2, 3, 4, 5};` atau `int[] angka = new int[5];` untuk array kosong berukuran 5.',
          'Akses elemen array memakai index yang dimulai dari 0, misal `angka[0]` mengambil elemen pertama. Properti `.length` (tanpa kurung, bukan method) mengembalikan jumlah elemen array.',
          'Karena ukuran array tetap, mencoba mengakses index di luar rentang (misal `angka[10]` pada array berukuran 5) akan melempar `ArrayIndexOutOfBoundsException` saat runtime.',
          'Enhanced for loop (for-each) memudahkan iterasi seluruh elemen array tanpa perlu index manual: `for (int nilai : angka) { ... }`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        int[] angka = {10, 20, 30, 40, 50};

        System.out.println("Elemen pertama: " + angka[0]);
        System.out.println("Jumlah elemen: " + angka.length);

        int total = 0;
        for (int nilai : angka) {
            total += nilai;
        }
        System.out.println("Total semua elemen: " + total);

        angka[2] = 99;
        System.out.println("Setelah diubah, elemen ke-2: " + angka[2]);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Index elemen pertama dalam array Java dimulai dari?', [
            ['0', true],
            ['1', false],
            ['-1', false],
            ['Tergantung tipe data', false],
          ]),
          q('Bagaimana cara mendapatkan jumlah elemen sebuah array bernama angka?', [
            ['angka.length', true],
            ['angka.length()', false],
            ['angka.size()', false],
            ['length(angka)', false],
          ]),
          q('Apa yang terjadi jika mengakses index array di luar rentang yang valid?', [
            ['ArrayIndexOutOfBoundsException dilempar saat runtime', true],
            ['Program otomatis memperbesar array', false],
            ['Mengembalikan nilai null tanpa error', false],
            ['Diabaikan begitu saja', false],
          ]),
          q('Apakah ukuran array di Java bisa berubah setelah dibuat?', [
            ['Tidak, ukurannya tetap', true],
            ['Bisa, otomatis membesar sesuai kebutuhan', false],
            ['Bisa, tapi hanya mengecil', false],
            ['Tergantung tipe datanya', false],
          ]),
        ],
      },
      {
        title: 'ArrayList',
        slug: 'javafz-arraylist',
        content: [
          '`ArrayList` (dari package `java.util`) adalah struktur data mirip array tapi ukurannya dinamis — bisa bertambah atau berkurang sesuai kebutuhan, berbeda dari array biasa yang ukurannya tetap.',
          'Untuk memakainya, perlu `import java.util.ArrayList;` di bagian atas file. Deklarasi memakai generic type, misal `ArrayList<String> daftar = new ArrayList<>();` untuk ArrayList yang hanya menampung `String`.',
          'Method umum `ArrayList`: `.add(nilai)` menambah elemen di akhir, `.get(index)` mengambil elemen di posisi tertentu, `.remove(index)` menghapus elemen, `.size()` mengembalikan jumlah elemen (mirip `.length` pada array, tapi ditulis sebagai method dengan kurung).',
          'ArrayList hanya bisa menampung reference type (object), bukan tipe primitif langsung — untuk `int`, dipakai wrapper class `Integer`, misal `ArrayList<Integer>`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> daftarBuah = new ArrayList<>();
        daftarBuah.add("Apel");
        daftarBuah.add("Jeruk");
        daftarBuah.add("Mangga");

        System.out.println("Daftar buah: " + daftarBuah);
        System.out.println("Elemen pertama: " + daftarBuah.get(0));
        System.out.println("Jumlah elemen: " + daftarBuah.size());

        daftarBuah.remove("Jeruk");
        System.out.println("Setelah remove Jeruk: " + daftarBuah);

        ArrayList<Integer> daftarAngka = new ArrayList<>();
        daftarAngka.add(1);
        daftarAngka.add(2);
        System.out.println("Daftar angka: " + daftarAngka);
    }
}
`,
      },
    ],
  },
  {
    title: 'OOP Dasar',
    lessons: [
      {
        title: 'Class & Object',
        slug: 'javafz-class-object',
        content: [
          'Object-Oriented Programming (OOP) mengorganisir kode ke dalam class (cetakan/blueprint) dan object (instance konkret dari class). Class dideklarasikan dengan kata kunci `class`, object dibuat dengan kata kunci `new`.',
          'Sebuah class bisa memiliki atribut/field (data yang dimiliki object, misal `nama`, `umur`) dan method (perilaku/fungsi yang dimiliki object, misal `perkenalan()`). Setiap object yang dibuat dari class yang sama punya field-nya sendiri-sendiri, terpisah satu sama lain.',
          'Akses field/method sebuah object memakai tanda titik, misal `siswa1.nama` atau `siswa1.perkenalan()`. Satu file bisa berisi beberapa class, tapi hanya satu yang boleh `public` dan namanya harus sama dengan nama file.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Siswa {
    String nama;
    int umur;

    void perkenalan() {
        System.out.println("Halo, saya " + nama + ", umur " + umur + " tahun");
    }
}

public class Main {
    public static void main(String[] args) {
        Siswa siswa1 = new Siswa();
        siswa1.nama = "Budi";
        siswa1.umur = 20;

        Siswa siswa2 = new Siswa();
        siswa2.nama = "Siti";
        siswa2.umur = 22;

        siswa1.perkenalan();
        siswa2.perkenalan();
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan mendasar antara class dan object?', [
            ['Class adalah cetakan/blueprint, object adalah instance konkretnya', true],
            ['Class dan object adalah istilah untuk hal yang sama', false],
            ['Object selalu lebih besar ukurannya dari class', false],
            ['Class hanya dipakai untuk menyimpan angka', false],
          ]),
          q('Kata kunci apa untuk membuat object baru dari sebuah class?', [
            ['new', true],
            ['create', false],
            ['make', false],
            ['object', false],
          ]),
          q('Bagaimana cara mengakses field nama milik object siswa1?', [
            ['siswa1.nama', true],
            ['siswa1->nama', false],
            ['siswa1[nama]', false],
            ['nama(siswa1)', false],
          ]),
        ],
      },
      {
        title: 'Constructor',
        slug: 'javafz-constructor',
        content: [
          'Constructor adalah method khusus yang otomatis dijalankan saat object baru dibuat dengan `new`, biasanya dipakai untuk mengisi nilai awal field. Nama constructor harus persis sama dengan nama class, dan tidak memiliki tipe return (bahkan tidak `void`).',
          'Kalau sebuah class tidak mendefinisikan constructor sama sekali, Java otomatis menyediakan default constructor kosong tanpa parameter di baliknya.',
          'Constructor bisa menerima parameter untuk langsung mengisi field saat object dibuat, misal `Siswa(String nama, int umur) { this.nama = nama; this.umur = umur; }`. Kata kunci `this` merujuk ke object itu sendiri, dipakai untuk membedakan field class dari parameter yang kebetulan bernama sama.',
          'Java mendukung constructor overloading — satu class boleh punya lebih dari satu constructor selama jumlah/tipe parameternya berbeda.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Siswa {
    String nama;
    int umur;

    Siswa(String nama, int umur) {
        this.nama = nama;
        this.umur = umur;
    }

    void perkenalan() {
        System.out.println("Halo, saya " + this.nama + ", umur " + this.umur + " tahun");
    }
}

public class Main {
    public static void main(String[] args) {
        Siswa siswa1 = new Siswa("Budi", 20);
        Siswa siswa2 = new Siswa("Siti", 22);

        siswa1.perkenalan();
        siswa2.perkenalan();
    }
}
`,
      },
      {
        title: 'Encapsulation',
        slug: 'javafz-encapsulation',
        content: [
          'Encapsulation adalah prinsip OOP yang menyembunyikan detail internal sebuah object dan hanya mengekspos apa yang perlu diakses dari luar, biasanya dengan menjadikan field `private` dan menyediakan method publik (getter/setter) untuk mengaksesnya.',
          'Field `private` hanya bisa diakses dari dalam class itu sendiri, tidak bisa langsung diakses dari luar class (misal `siswa1.umur` akan error kalau `umur` dideklarasikan `private`).',
          'Getter adalah method untuk membaca nilai field private (konvensi nama `getNamaField()`), setter adalah method untuk mengubah nilai field private (konvensi nama `setNamaField(nilaiBaru)`). Setter bisa menambahkan validasi sebelum mengubah nilai, sesuatu yang tidak bisa dilakukan kalau field diakses langsung.',
          'Manfaat encapsulation: kontrol penuh atas bagaimana data diakses/diubah, dan detail implementasi internal class bisa berubah tanpa merusak kode lain yang memakai class tersebut selama getter/setter-nya tetap konsisten.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Akun {
    private double saldo;

    Akun(double saldoAwal) {
        this.saldo = saldoAwal;
    }

    double getSaldo() {
        return this.saldo;
    }

    void setor(double jumlah) {
        if (jumlah > 0) {
            this.saldo += jumlah;
        } else {
            System.out.println("Jumlah setoran harus lebih dari 0");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Akun akun = new Akun(100000);
        System.out.println("Saldo awal: " + akun.getSaldo());

        akun.setor(50000);
        System.out.println("Saldo setelah setor: " + akun.getSaldo());

        akun.setor(-1000);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa tujuan utama dari encapsulation?', [
            ['Menyembunyikan detail internal object dan mengontrol akses lewat getter/setter', true],
            ['Membuat semua field bisa diakses bebas dari mana saja', false],
            ['Menghapus kebutuhan akan constructor', false],
            ['Membuat program berjalan lebih cepat', false],
          ]),
          q('Modifier akses apa yang membuat field hanya bisa diakses dari dalam class itu sendiri?', [
            ['private', true],
            ['public', false],
            ['static', false],
            ['final', false],
          ]),
          q('Apa keuntungan memakai setter dibanding mengubah field langsung?', [
            ['Setter bisa menambahkan validasi sebelum mengubah nilai', true],
            ['Setter selalu lebih cepat dieksekusi', false],
            ['Setter menghapus kebutuhan constructor', false],
            ['Tidak ada bedanya sama sekali', false],
          ]),
        ],
      },
      {
        title: 'Inheritance & Polymorphism Dasar',
        slug: 'javafz-inheritance-polymorphism',
        content: [
          'Inheritance memungkinkan sebuah class (subclass/child class) mewarisi field dan method dari class lain (superclass/parent class), memakai kata kunci `extends`. Ini menghindari duplikasi kode untuk class-class yang punya kesamaan perilaku.',
          'Subclass bisa menambah field/method baru miliknya sendiri, dan bisa meng-override (menimpa ulang) method milik superclass dengan menuliskan ulang method yang sama persis (nama & parameter), ditandai anotasi `@Override` sebagai konvensi baik (bukan wajib, tapi membantu mencegah typo).',
          'Polymorphism ("banyak bentuk") berarti sebuah object subclass bisa diperlakukan sebagai object superclass-nya, dan method yang dipanggil akan menjalankan versi milik subclass sesuai tipe object aslinya saat runtime — ini disebut dynamic method dispatch.',
          'Kata kunci `super` dipakai untuk memanggil constructor atau method versi superclass dari dalam subclass, misal `super(nama)` di constructor subclass untuk mengisi field yang didefinisikan di superclass.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Hewan {
    String nama;

    Hewan(String nama) {
        this.nama = nama;
    }

    void bersuara() {
        System.out.println(nama + " mengeluarkan suara");
    }
}

class Kucing extends Hewan {
    Kucing(String nama) {
        super(nama);
    }

    @Override
    void bersuara() {
        System.out.println(nama + " berkata: Meong!");
    }
}

public class Main {
    public static void main(String[] args) {
        Hewan hewanUmum = new Hewan("Hewan tak dikenal");
        hewanUmum.bersuara();

        Hewan kucingSebagaiHewan = new Kucing("Si Meong");
        kucingSebagaiHewan.bersuara();
    }
}
`,
      },
    ],
  },
  {
    title: 'Exception & Ringkasan',
    lessons: [
      {
        title: 'Exception Handling',
        slug: 'javafz-exception-handling',
        content: [
          'Exception adalah kondisi error yang terjadi saat program berjalan (runtime), misal membagi bilangan bulat dengan nol atau mengakses index array di luar rentang. Tanpa penanganan, exception akan menghentikan program secara paksa dan mencetak stack trace.',
          'Blok `try`/`catch` menangkap exception supaya program tidak crash — kode yang berpotensi error ditaruh di `try`, penanganannya di `catch`, dengan tipe exception yang mau ditangkap dituliskan sebagai parameter `catch`, misal `catch (ArithmeticException e)`.',
          'Blok `finally` (opsional) selalu dijalankan setelah `try`/`catch`, baik ada error maupun tidak — cocok untuk kode pembersihan (cleanup) yang wajib jalan apa pun hasilnya.',
          'Java membedakan checked exception (harus ditangani atau dideklarasikan eksplisit dengan `throws`, dicek compiler) dan unchecked exception (turunan `RuntimeException`, seperti `ArithmeticException`, tidak wajib ditangani tapi tetap praktik baik untuk ditangani).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    static void bagi(int a, int b) {
        try {
            int hasil = a / b;
            System.out.println("Hasil bagi: " + hasil);
        } catch (ArithmeticException e) {
            System.out.println("Error: tidak bisa membagi dengan nol");
        } finally {
            System.out.println("Percobaan pembagian selesai");
        }
    }

    public static void main(String[] args) {
        bagi(10, 2);
        bagi(10, 0);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Blok apa yang menangkap exception supaya program tidak crash?', [
            ['catch', true],
            ['try saja tanpa catch', false],
            ['finally', false],
            ['throws', false],
          ]),
          q('Kapan blok finally dijalankan?', [
            ['Selalu dijalankan baik ada error maupun tidak', true],
            ['Hanya kalau ada error', false],
            ['Hanya kalau tidak ada error', false],
            ['Tidak pernah dijalankan otomatis', false],
          ]),
          q('Exception apa yang terjadi saat membagi bilangan bulat dengan nol di Java?', [
            ['ArithmeticException', true],
            ['NullPointerException', false],
            ['ArrayIndexOutOfBoundsException', false],
            ['ClassCastException', false],
          ]),
        ],
      },
      {
        title: 'Interface Dasar',
        slug: 'javafz-interface-dasar',
        content: [
          'Interface adalah "kontrak" yang mendefinisikan method apa saja yang harus dimiliki sebuah class, tanpa menentukan bagaimana implementasinya — dideklarasikan dengan kata kunci `interface`, semua method di dalamnya default `abstract` (tanpa body) kecuali dinyatakan lain.',
          'Sebuah class memakai interface dengan kata kunci `implements`, lalu wajib menyediakan implementasi konkret untuk semua method yang dideklarasikan interface tersebut — kalau tidak, akan terjadi error compile.',
          'Berbeda dari inheritance class (`extends`, hanya boleh satu superclass), sebuah class boleh `implements` lebih dari satu interface sekaligus, memberi fleksibilitas desain yang tidak dimiliki inheritance tunggal.',
          'Manfaat interface: memungkinkan beberapa class yang tidak berhubungan secara struktur tetap punya "kontrak" perilaku yang sama, sehingga bisa diperlakukan seragam lewat tipe interface-nya — ini juga bentuk lain dari polymorphism.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa yang dipakai class untuk memakai sebuah interface?', [
            ['implements', true],
            ['extends', false],
            ['interface', false],
            ['uses', false],
          ]),
          q('Apakah sebuah class boleh implements lebih dari satu interface?', [
            ['Ya, boleh lebih dari satu', true],
            ['Tidak, maksimal satu seperti extends', false],
            ['Boleh, tapi maksimal dua', false],
            ['Tidak pernah diizinkan Java', false],
          ]),
          q('Apa yang terjadi kalau sebuah class implements interface tapi tidak mengimplementasikan semua method-nya?', [
            ['Terjadi error saat compile', false],
            ['Program tetap jalan normal', false],
            ['Method yang belum diimplementasikan otomatis kosong', false],
            ['Terjadi error compile karena kontrak interface tidak terpenuhi', true],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'javafz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, mari gabungkan semua konsep yang sudah dipelajari: class & object, constructor, encapsulation, array/ArrayList, perulangan, dan exception handling dalam satu program utuh yang mensimulasikan sistem nilai siswa sederhana.',
          'Program di bawah ini mendefinisikan class `Siswa` dengan field private dan getter, menyimpan beberapa object `Siswa` dalam `ArrayList`, menghitung rata-rata nilai lewat perulangan, dan menangani kemungkinan exception (misal daftar kosong) dengan `try`/`catch`.',
          'Studi kasus seperti ini menunjukkan bagaimana konsep-konsep OOP dan kontrol alur yang dipelajari terpisah sebenarnya saling melengkapi dalam program Java yang lebih realistis — bukan sekadar dipakai satu-satu secara terisolasi.',
          'Selamat, sepanjang course ini kita sudah belajar dasar Java: sintaks & struktur program, tipe data & operator, kontrol alur & array, OOP (class, constructor, encapsulation, inheritance), hingga exception handling & interface — fondasi yang cukup untuk mulai membangun program Java yang lebih kompleks.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `import java.util.ArrayList;

class Siswa {
    private String nama;
    private int nilai;

    Siswa(String nama, int nilai) {
        this.nama = nama;
        this.nilai = nilai;
    }

    String getNama() {
        return this.nama;
    }

    int getNilai() {
        return this.nilai;
    }
}

public class Main {
    static double hitungRataRata(ArrayList<Siswa> daftarSiswa) {
        if (daftarSiswa.size() == 0) {
            throw new ArithmeticException("Daftar siswa kosong, tidak bisa dihitung rata-rata");
        }
        int total = 0;
        for (Siswa siswa : daftarSiswa) {
            total += siswa.getNilai();
        }
        return (double) total / daftarSiswa.size();
    }

    public static void main(String[] args) {
        ArrayList<Siswa> daftarSiswa = new ArrayList<>();
        daftarSiswa.add(new Siswa("Budi", 80));
        daftarSiswa.add(new Siswa("Siti", 90));
        daftarSiswa.add(new Siswa("Andi", 70));

        for (Siswa siswa : daftarSiswa) {
            System.out.println(siswa.getNama() + ": " + siswa.getNilai());
        }

        try {
            double rataRata = hitungRataRata(daftarSiswa);
            System.out.println("Rata-rata nilai kelas: " + rataRata);
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Di studi kasus ini, kenapa field nama dan nilai pada class Siswa dibuat private?', [
            ['Untuk menerapkan encapsulation, akses lewat getter', true],
            ['Karena Java mewajibkan semua field private', false],
            ['Supaya program berjalan lebih cepat', false],
            ['Tidak ada alasan khusus', false],
          ]),
          q('Struktur data apa yang dipakai untuk menampung banyak object Siswa dengan ukuran dinamis?', [
            ['ArrayList<Siswa>', true],
            ['int[]', false],
            ['String', false],
            ['boolean', false],
          ]),
          q('Kenapa perhitungan rata-rata dalam contoh dibungkus try/catch?', [
            ['Untuk menangani kasus daftar siswa kosong yang bisa memicu exception', true],
            ['Karena ArrayList selalu error saat diakses', false],
            ['Supaya kode terlihat lebih panjang', false],
            ['try/catch wajib ada di setiap method Java', false],
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
      title: 'Java from Zero',
      slug: 'java-from-zero',
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
            ? { sandboxLanguage: 'java', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "Java from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
