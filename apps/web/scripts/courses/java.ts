import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

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
          'Java bersifat statically typed: setiap variabel punya tipe yang sudah pasti dan dicek compiler sebelum program dijalankan. Tipe itu biasanya ditulis eksplisit di depan nama variabel (`int umur = 20;`), dan sejak Java 10 boleh juga ditulis `var` supaya compiler menyimpulkan tipenya dari nilai awal. Java juga strongly object-oriented — hampir semua kode Java ditulis di dalam class.',
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
          q('Apa arti Java bersifat statically typed?', [
            ['Tipe setiap variabel sudah pasti dan dicek compiler sebelum program dijalankan', true],
            ['Tipe variabel baru ditentukan saat program berjalan, mengikuti nilai terakhir yang disimpan', false],
            ['Setiap variabel wajib ditulis tipenya secara manual, compiler tidak pernah menyimpulkan tipe', false],
            ['Variabel hanya boleh menyimpan tipe primitif seperti int dan boolean, bukan object', false],
          ]),
          q('Komponen apa yang membuat bytecode Java bisa dijalankan di Windows, Linux, maupun macOS tanpa ditulis ulang?', [
            ['JVM yang terpasang di tiap sistem operasi, yang menjalankan bytecode yang sama', true],
            ['Compiler javac, yang membuat kode mesin terpisah untuk tiap sistem operasi dari satu file .java', false],
            ['Bytecode itu sendiri, karena file .class sudah menyertakan salinan JVM untuk tiap sistem operasi', false],
            ['Sistem operasi, yang membaca file .java langsung tanpa perantara', false],
          ]),
        ],
      },
      {
        title: 'Struktur Program Java',
        slug: 'javafz-struktur-program',
        content: [
          'Setiap program Java minimal punya satu class. Kalau sebuah class dideklarasikan `public` di level paling luar (top-level), nama file `.java`-nya wajib sama persis dengan nama class itu (huruf besar/kecil termasuk): class `public Main` harus disimpan di `Main.java`, kalau tidak `javac` menolaknya dengan error `class Main is public, should be declared in a file named Main.java`. Class yang tidak `public` boleh ada di file dengan nama berbeda, dan satu file boleh berisi beberapa class selama paling banyak satu yang `public`.',
          'Di sandbox ini kode disimpan sebagai `Main.java` dan dijalankan lewat class `Main`, jadi class publik yang berisi method `main` harus bernama `Main`.',
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
            ['Supaya file .class yang sama bisa dijalankan di platform mana pun yang punya JVM, tanpa dikompilasi ulang', true],
            ['Supaya hasilnya otomatis lebih cepat dari kode mesin native, karena bytecode sudah teroptimasi untuk semua prosesor', false],
            ['Supaya kode sumber .java bisa dibaca JVM langsung baris demi baris, jadi javac tidak diperlukan', false],
            ['Supaya kode sumber tersembunyi, karena bytecode adalah versi terenkripsi dari file .java', false],
          ]),
          q('Apa peran JVM dalam menjalankan program Java?', [
            ['Menerjemahkan bytecode menjadi instruksi yang dipahami sistem operasi dan prosesor', true],
            ['Mengubah file .java menjadi bytecode, sama seperti perintah javac', false],
            ['Mengubah bytecode menjadi file .exe permanen yang bisa dijalankan tanpa JVM', false],
            ['Hanya dipakai saat debugging, program biasa berjalan langsung di sistem operasi', false],
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
          "Java punya delapan tipe data primitif: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, dan `boolean`. Empat yang paling sering dipakai pemula: `int` (bilangan bulat, mis. `int umur = 20;`), `double` (bilangan desimal presisi ganda, mis. `double tinggi = 165.5;`), `char` (satu karakter tunggal ditulis dengan kutip tunggal, mis. `char inisial = 'B';`), dan `boolean` (hanya bernilai `true` atau `false`).",
          'Java bersifat statically typed: setiap variabel punya tipe yang sudah pasti dan dicek compiler sebelum program dijalankan. Berbeda dari Python/JavaScript, tipe itu biasanya ditulis eksplisit di depan nama variabel, seperti `int umur = 20;`. Sejak Java 10 (jadi tersedia di OpenJDK 13 yang dipakai sandbox ini) ada alternatif `var` untuk variabel lokal: compiler menyimpulkan tipenya dari nilai awal.',
          '## var: tipe disimpulkan, bukan dinamis',
          'Potongan kode berikut ditaruh di dalam `main`. `var` tidak membuat variabel jadi dinamis: setelah disimpulkan, tipenya tetap `int` atau `String`, sehingga baris terakhir sengaja salah dan menjadi error compile. `var` hanya boleh dipakai untuk variabel lokal yang langsung diberi nilai awal, bukan untuk field, parameter method, atau return type.',
          `\`\`\`java
var umur = 20;          // tipenya int
var nama = "Budi";      // tipenya String
umur = "dua puluh";     // error compile: String tidak bisa disimpan di variabel int
\`\`\``,
          '## Ukuran dan rentang nilai',
          'Setiap tipe primitif punya ukuran memori dan rentang nilai tetap. `int` menampung bilangan bulat 32-bit (sekitar -2,1 miliar sampai 2,1 miliar), sedangkan `long` (64-bit; literalnya diberi sufiks `L`, misal `8000000000L`) dipakai untuk bilangan bulat yang lebih besar. Untuk desimal, `double` (64-bit) adalah pilihan umum; `float` (32-bit, literalnya diberi sufiks `f`, misal `1.5f`) lebih hemat memori tapi presisinya lebih rendah.',
          '## Primitif dan reference type',
          'Selain tipe primitif, Java juga punya reference type seperti `String` (teks) yang sebenarnya adalah object, bukan primitif — akan dibahas lebih lanjut di pelajaran String. Setiap tipe primitif juga punya pasangan berupa object (wrapper class), yang dibahas di pelajaran berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        int umur = 20;
        double tinggiBadan = 165.5;
        char inisial = 'B';
        boolean sudahLulus = true;
        long populasi = 8000000000L; // melebihi rentang int, jadi butuh long dan sufiks L
        var jumlahBuku = 3;          // var: compiler menyimpulkan tipenya, di sini int

        System.out.println("Umur: " + umur);
        System.out.println("Tinggi badan: " + tinggiBadan);
        System.out.println("Inisial: " + inisial);
        System.out.println("Sudah lulus: " + sudahLulus);
        System.out.println("Populasi: " + populasi);
        System.out.println("Jumlah buku: " + jumlahBuku);
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
          q('Pada var jumlah = 42;, tipe apa yang dimiliki variabel jumlah?', [
            ['int: compiler menyimpulkannya dari nilai 42, lalu tipenya tetap', true],
            ['Tipe dinamis, jadi nanti boleh diisi String atau nilai tipe lain', false],
            ['Object, karena tipenya belum ditulis eksplisit', false],
            ['Belum punya tipe sampai program berjalan, baru ditentukan saat runtime', false],
          ]),
        ],
      },
      {
        title: 'Wrapper Class, Autoboxing & final',
        slug: 'javafz-wrapper-autoboxing-final',
        content: [
          'Setiap tipe primitif punya pasangan berupa class yang disebut wrapper class: `int` punya `Integer`, `double` punya `Double`, `char` punya `Character`, `boolean` punya `Boolean`, dan seterusnya (`long` punya `Long`, `float` punya `Float`, `byte` punya `Byte`, `short` punya `Short`). Wrapper membungkus satu nilai primitif sebagai object. Ini perlu karena koleksi (penampung banyak nilai, seperti `ArrayList` dan `HashMap` yang dibahas di modul berikutnya) hanya bisa menampung object (`ArrayList<Integer>`, bukan `ArrayList<int>`), dan karena object boleh bernilai `null` (artinya tidak menunjuk ke object apa pun) sedangkan primitif tidak.',
          'Wrapper juga membawa method dan konstanta berguna yang dipanggil lewat nama class-nya tanpa membuat object (disebut method static, dibahas di pelajaran Method): `Integer.parseInt("123")` mengubah teks menjadi `int`, `Double.parseDouble("1.5")` mengubah teks menjadi `double`, `Integer.valueOf(5)` membungkus `5` menjadi `Integer`, dan `Integer.MAX_VALUE` adalah `int` terbesar (2147483647). `Integer.parseInt("abc")` melempar `NumberFormatException` karena teksnya bukan angka (exception dibahas di pelajaran Exception Handling).',
          'Autoboxing adalah pembungkusan otomatis: saat sebuah `int` dimasukkan ke variabel `Integer`, Java memanggil `Integer.valueOf` untukmu. Kebalikannya, unboxing, membuka bungkus `Integer` menjadi `int` secara otomatis. Jebakannya: unboxing pada `null` melempar `NullPointerException`, karena tidak ada nilai di dalam bungkusnya. Potongan kode di dalam `main`:',
          `\`\`\`java
Integer a = 42;          // autoboxing: int 42 dibungkus menjadi Integer
int b = a;               // unboxing: Integer dibuka menjadi int
Integer kosong = null;
int c = kosong;          // NullPointerException saat program berjalan
\`\`\``,
          '`==` (operator pembanding yang menghasilkan `true` atau `false`, dibahas lengkap di pelajaran Variabel & Operator) pada dua `Integer` membandingkan referensi object, bukan nilainya, jadi gunakan `.equals()` seperti pada `String`. Hasil `==` juga bisa menipu: Java menjamin nilai -128 sampai 127 yang dibungkus lewat autoboxing berbagi satu object yang sama (jadi `==` bernilai `true`), tetapi di luar rentang itu tidak ada jaminan dan biasanya setiap pembungkusan menghasilkan object baru (jadi `==` bernilai `false` walau nilainya sama).',
          'Kata kunci `final` membuat sebuah variabel hanya bisa diberi nilai satu kali; mengubahnya lagi adalah error compile (`cannot assign a value to final variable`). Konstanta di Java ditulis `static final` dengan nama HURUF_BESAR, misal `static final int BATAS_LULUS = 60;` (`static` di sini berarti milik class, bukan milik object tertentu). Untuk variabel `final` yang menyimpan object, yang terkunci adalah referensinya (tidak bisa diarahkan ke object lain), bukan isi object itu. `final` juga bisa dipasang pada method dan class untuk melarang override dan pewarisan, topik yang baru muncul di modul OOP.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    // Konstanta level class: static final, nama HURUF_BESAR
    static final int BATAS_LULUS = 60;

    public static void main(String[] args) {
        // Autoboxing dan unboxing
        Integer angkaObjek = 42;          // autoboxing: int dibungkus menjadi Integer
        int angkaPrimitif = angkaObjek;   // unboxing: Integer dibuka menjadi int
        System.out.println("Integer: " + angkaObjek + ", int: " + angkaPrimitif);

        // Method dan konstanta milik wrapper class
        int dariTeks = Integer.parseInt("123");
        System.out.println("Teks 123 diubah jadi int lalu ditambah 1: " + (dariTeks + 1));
        System.out.println("Integer.MAX_VALUE: " + Integer.MAX_VALUE);
        System.out.println("Double.parseDouble(1.5) dikali 2: " + (Double.parseDouble("1.5") * 2));

        // == pada Integer membandingkan referensi, bukan nilai
        Integer kecil1 = 100;
        Integer kecil2 = 100;
        Integer besar1 = 1000;
        Integer besar2 = 1000;
        System.out.println("100 == 100: " + (kecil1 == kecil2));              // true: dijamin untuk -128 sampai 127
        System.out.println("1000 == 1000: " + (besar1 == besar2));            // biasanya false: di luar rentang tidak dijamin
        System.out.println("1000 equals 1000: " + besar1.equals(besar2));     // true: equals membandingkan nilai

        // final: hanya bisa diberi nilai satu kali
        final int tahunLahir = 2000;
        System.out.println("Tahun lahir: " + tahunLahir);
        // tahunLahir = 2001;   // hapus tanda // di depan baris ini untuk melihat error compile

        int nilai = 75;
        System.out.println("Lulus (batas " + BATAS_LULUS + "): " + (nilai >= BATAS_LULUS));   // >= : lebih besar atau sama dengan
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dimaksud autoboxing di Java?', [
            ['Java otomatis membungkus nilai primitif (misal int) menjadi object wrapper (Integer)', true],
            ['Java otomatis mengubah object Integer menjadi String setiap kali dicetak dengan println', false],
            ['Java otomatis mengubah double menjadi int dengan memotong desimalnya saat disimpan ke variabel int', false],
            ['Compiler otomatis menyimpulkan tipe variabel yang dideklarasikan memakai kata kunci var', false],
          ]),
          q('Dua variabel Integer sama-sama bernilai 1000 dibandingkan dengan ==. Kenapa hasilnya tidak bisa diandalkan?', [
            ['== membandingkan referensi object; hanya nilai -128 sampai 127 yang dijamin berbagi object', true],
            ['Integer tidak punya operator ==, jadi membandingkan dua Integer selalu error compile', false],
            ['== otomatis mengubah kedua Integer menjadi double sebelum membandingkannya', false],
            ['== pada dua Integer selalu bernilai false, apa pun nilai yang dibungkusnya', false],
          ]),
          q('Apa yang terjadi kalau variabel final int tahunLahir = 2000; kemudian diberi nilai baru lewat tahunLahir = 2001;?', [
            ['Error compile: variabel final hanya bisa diberi nilai satu kali', true],
            ['Program jalan, tapi baris itu diabaikan dan nilainya tetap 2000', false],
            ['Program compile, lalu melempar exception saat baris itu dijalankan', false],
            ['Nilainya berubah menjadi 2001, karena final hanya melarang class diwarisi', false],
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
          '## Implicit casting (widening)',
          'Implicit casting terjadi otomatis ketika nilai dari tipe yang lebih sempit dimasukkan ke tipe yang lebih lebar, misal `int` ke `long` atau `int` ke `double`. Java melakukannya tanpa penulisan khusus dan tanpa error. Urutan pelebarannya: `byte` ke `short` ke `int` ke `long` ke `float` ke `double` (dan `char` ke `int`).',
          'Kebanyakan widening menjaga nilainya persis, misal `int` ke `long` atau `int` ke `double`. Tapi tiga pelebaran bisa mengubah nilai karena tipe tujuannya tidak menyimpan semua digit pentingnya: `int` ke `float`, `long` ke `float`, dan `long` ke `double`. Hasilnya dibulatkan ke nilai terdekat yang bisa disimpan, tanpa pesan error apa pun. Contoh potongan kode di dalam `main`:',
          `\`\`\`java
int besar = 123456789;
float hampir = besar;                // widening otomatis, tanpa error
System.out.println(hampir);          // 1.23456792E8
System.out.println((int) hampir);    // 123456792, bukan 123456789
\`\`\``,
          '## Explicit casting (narrowing)',
          'Explicit casting harus ditulis manual dengan tanda kurung berisi tipe tujuan, misal `(int) 9.7`, dipakai ketika mengubah tipe yang lebih lebar ke tipe yang lebih sempit. Nilainya bisa kehilangan presisi atau rentang: `double` ke `int` memotong bagian desimalnya (ke arah nol, bukan membulatkan, jadi `(int) -9.7` menjadi `-9`), dan nilai di luar rentang tipe tujuan "berputar", misal `(byte) 200` menjadi `-56`. Tanpa cast, `int x = 9.7;` adalah error compile: `incompatible types: possible lossy conversion from double to int`.',
          '## Casting dengan char',
          'Casting antara `int` dan `char` juga dimungkinkan karena `char` di Java sebenarnya disimpan sebagai kode numerik (Unicode) di baliknya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        // Implicit casting: int ke double, otomatis, nilainya tetap persis
        int angkaBulat = 10;
        double angkaDesimal = angkaBulat;
        System.out.println("Implicit int ke double: " + angkaDesimal);

        // Widening yang bisa kehilangan presisi: int ke float
        int besar = 123456789;
        float hampir = besar;
        System.out.println("int " + besar + " ke float: " + hampir);
        System.out.println("float tadi kembali ke int: " + (int) hampir);

        // Explicit casting: double ke int, harus ditulis manual
        double nilaiAsli = 9.7;
        int hasilCasting = (int) nilaiAsli;
        System.out.println("Explicit double ke int: " + hasilCasting);
        System.out.println("(int) -9.7 menjadi " + (int) -9.7);

        // Nilai di luar rentang tipe tujuan "berputar"
        int duaRatus = 200;
        byte dipaksa = (byte) duaRatus;
        System.out.println("(byte) 200 menjadi " + dipaksa);

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
          q('Konversi mana yang dilakukan Java otomatis (tanpa cast) tapi hasilnya bisa sedikit berbeda dari nilai aslinya?', [
            ['int ke float, karena float tidak menyimpan semua digit dari int yang besar', true],
            ['int ke long, karena bilangan bulat besar dipotong saat dimasukkan ke long', false],
            ['double ke int, karena bagian desimalnya dibuang otomatis tanpa perlu cast', false],
            ['char ke int, karena kode Unicode huruf ikut berubah', false],
          ]),
        ],
      },
      {
        title: 'String di Java',
        slug: 'javafz-string',
        content: [
          'Di Java, `String` adalah reference type (bukan primitif) yang merepresentasikan teks, ditulis dengan kutip ganda, misal `String nama = "Budi";`.',
          'Karakteristik penting `String` di Java adalah immutable — setelah sebuah objek `String` dibuat, isinya tidak bisa diubah. Operasi seperti `.toUpperCase()` atau penggabungan (`+`) sebenarnya membuat objek `String` baru, bukan mengubah objek yang lama.',
          'Method umum `String`: `.length()` mengembalikan jumlah karakter, `.toUpperCase()`/`.toLowerCase()` mengubah huruf besar/kecil, `.charAt(index)` mengambil satu karakter di posisi tertentu (index dimulai dari 0), `.equals()` membandingkan isi dua String, dan `.substring()` mengambil sebagian teks.',
          '## substring: index akhir tidak ikut',
          '`.substring(awal, akhir)` mengambil teks mulai dari index `awal` (ikut) sampai sebelum index `akhir` (tidak ikut), jadi panjang hasilnya `akhir - awal`. `.substring(awal)` dengan satu argumen mengambil sampai akhir teks. Index yang melewati panjang teks melempar `StringIndexOutOfBoundsException`. Contoh potongan kode di dalam `main`:',
          `\`\`\`java
String nama = "Siswa BarisORG";
System.out.println(nama.substring(0, 5));   // Siswa     (index 0 sampai 4)
System.out.println(nama.substring(6));      // BarisORG  (index 6 sampai akhir)
\`\`\``,
          '## Membandingkan isi String',
          'Jangan membandingkan isi `String` dengan `==`: operator itu membandingkan referensi objek (apakah dua variabel menunjuk objek yang sama), bukan isi teksnya. Dua literal yang sama kadang berbagi satu objek sehingga `==` kebetulan `true`, tapi String yang dibuat dengan `new String("Java")` adalah objek terpisah, jadi `==` bernilai `false` padahal isinya sama. Selalu gunakan `.equals()` untuk membandingkan isi dua String.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    public static void main(String[] args) {
        String nama = "Siswa BarisORG";

        System.out.println("Panjang string: " + nama.length());
        System.out.println("Huruf besar: " + nama.toUpperCase());
        System.out.println("Karakter ke-0: " + nama.charAt(0));
        System.out.println("substring(0, 5): " + nama.substring(0, 5));
        System.out.println("substring(6): " + nama.substring(6));

        String a = "Java";
        String b = "Java";
        String c = new String("Java");
        System.out.println("a.equals(b): " + a.equals(b));
        System.out.println("a.equals(c): " + a.equals(c));
        System.out.println("a == c (referensi, objek berbeda): " + (a == c));
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa hasil "BarisORG".substring(2, 5)?', [
            ['ris', true],
            ['risO', false],
            ['risOR', false],
          ]),
          q('Kenapa isi dua String sebaiknya dibandingkan dengan .equals(), bukan ==?', [
            ['== membandingkan referensi objek, bukan isi teksnya', true],
            ['== hanya bisa dipakai untuk angka, jadi String selalu error compile', false],
            ['== membandingkan panjang dua String, bukan isinya', false],
            ['.equals() hanya lebih cepat, hasilnya selalu sama dengan ==', false],
          ]),
          q('Apa yang terjadi pada String nama setelah nama.toUpperCase() dipanggil tanpa menyimpan hasilnya?', [
            ['Tidak berubah, karena method itu mengembalikan String baru', true],
            ['Isinya berubah menjadi huruf besar di tempat', false],
            ['Variabel nama otomatis menunjuk ke String huruf besar', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Kontrol Alur, Koleksi & Method',
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
          'Array di Java menyimpan sekumpulan nilai dengan tipe data yang sama dan ukuran tetap (tidak bisa berubah setelah dibuat). Deklarasi dengan nilai langsung: `int[] angka = {1, 2, 3, 4, 5};`. Deklarasi dengan ukuran saja: `int[] angka = new int[5];` membuat array berukuran 5 yang semua elemennya langsung berisi nilai default, yaitu `0` untuk `int` (`0.0` untuk `double`, `false` untuk `boolean`, `null` untuk reference type seperti `String`).',
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

        int[] belumDiisi = new int[3];
        System.out.println("Isi default new int[3]: " + belumDiisi[0] + ", " + belumDiisi[1] + ", " + belumDiisi[2]);

        String[] namaBelumDiisi = new String[2];
        System.out.println("Isi default new String[2]: " + namaBelumDiisi[0]);
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
          q('Apa isi array setelah int[] data = new int[3]; dan belum ada elemen yang diisi?', [
            ['Tiga elemen, semuanya bernilai 0', true],
            ['Tiga elemen berisi nilai acak sisa dari memori', false],
            ['Tiga elemen bernilai null', false],
            ['Array kosong tanpa elemen sampai nilai pertama ditambahkan', false],
          ]),
        ],
      },
      {
        title: 'ArrayList',
        slug: 'javafz-arraylist',
        content: [
          '`ArrayList` (dari package `java.util`) adalah struktur data mirip array tapi ukurannya dinamis — bisa bertambah atau berkurang sesuai kebutuhan, berbeda dari array biasa yang ukurannya tetap.',
          'Untuk memakainya, perlu `import java.util.ArrayList;` di bagian atas file. Deklarasi memakai generic type, misal `ArrayList<String> daftar = new ArrayList<>();` untuk ArrayList yang hanya menampung `String`.',
          'Method umum `ArrayList`: `.add(nilai)` menambah elemen di akhir, `.get(index)` mengambil elemen di posisi tertentu, `.size()` mengembalikan jumlah elemen (mirip `.length` pada array, tapi ditulis sebagai method dengan kurung), dan `.remove(...)` menghapus elemen (lihat bagian di bawah).',
          '## ArrayList<Integer> dan autoboxing',
          'ArrayList hanya bisa menampung reference type (object), bukan tipe primitif langsung. Untuk `int`, dipakai wrapper class `Integer`, misal `ArrayList<Integer>`; `ArrayList<int>` adalah error compile. Saat menulis `daftar.add(10)`, Java otomatis membungkus `int` 10 menjadi object `Integer` (disebut autoboxing, seperti di pelajaran Wrapper Class), dan `int x = daftar.get(0);` otomatis membuka bungkusnya lagi (unboxing).',
          '## remove: berdasarkan index atau berdasarkan nilai',
          '`ArrayList` punya dua versi `remove`: `remove(int index)` menghapus elemen di posisi tertentu, sedangkan `remove(Object o)` menghapus kemunculan pertama nilai yang sama. Di `ArrayList<String>` tidak ada yang membingungkan: `remove(0)` menghapus elemen pertama dan `remove("Jeruk")` menghapus elemen bernilai "Jeruk". Jebakannya ada di `ArrayList<Integer>`: `daftar.remove(1)` memanggil `remove(int index)`, jadi yang terhapus adalah elemen di index 1, BUKAN nilai 1. Penyebabnya, Java lebih dulu mencari method yang cocok tanpa autoboxing, dan `int` langsung cocok dengan `remove(int)`.',
          'Untuk menghapus nilai 1, bungkus dulu menjadi object `Integer` lewat `Integer.valueOf(1)`, sehingga yang dipanggil adalah `remove(Object)`. Contoh potongan kode di dalam `main`:',
          `\`\`\`java
ArrayList<Integer> daftar = new ArrayList<>();
daftar.add(10);
daftar.add(20);
daftar.add(30);

daftar.remove(1);                     // hapus elemen di index 1 -> [10, 30]
daftar.remove(Integer.valueOf(30));   // hapus nilai 30 -> [10]
\`\`\``,
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

        daftarBuah.remove(0);
        System.out.println("Setelah remove index 0: " + daftarBuah);

        ArrayList<Integer> daftarAngka = new ArrayList<>();
        daftarAngka.add(10);   // autoboxing: int 10 dibungkus menjadi Integer
        daftarAngka.add(20);
        daftarAngka.add(30);
        System.out.println("Daftar angka: " + daftarAngka);

        daftarAngka.remove(1);                     // remove(int index): hapus elemen di index 1
        System.out.println("Setelah remove(1): " + daftarAngka);

        daftarAngka.remove(Integer.valueOf(30));   // remove(Object): hapus nilai 30
        System.out.println("Setelah remove nilai 30: " + daftarAngka);

        int pertama = daftarAngka.get(0);          // unboxing: Integer dibuka menjadi int
        System.out.println("Elemen pertama sebagai int: " + pertama);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('ArrayList<Integer> berisi [10, 20, 30]. Apa isinya setelah daftar.remove(1); dijalankan?', [
            ['[10, 30], karena yang dihapus adalah elemen di index 1', true],
            ['[10, 20, 30], karena tidak ada nilai 1 di dalam list sehingga tidak ada yang dihapus', false],
            ['[20, 30], karena remove menghitung posisi mulai dari 1', false],
            ['Error compile, karena remove(1) ambigu antara remove(int) dan remove(Object)', false],
          ]),
          q('Bagaimana cara menghapus NILAI 30 (bukan elemen di index 30) dari ArrayList<Integer> bernama daftar?', [
            ['daftar.remove(Integer.valueOf(30));', true],
            ['daftar.remove(30);', false],
            ['daftar.remove((int) 30);', false],
          ]),
          q('Kenapa ArrayList<int> tidak valid dan harus ditulis ArrayList<Integer>?', [
            ['ArrayList hanya menampung reference type (object), jadi int dibungkus sebagai Integer', true],
            ['int terlalu kecil untuk disimpan di ArrayList, jadi dipakai tipe yang lebih besar', false],
            ['Integer lebih cepat daripada int saat disimpan di dalam ArrayList', false],
            ['ArrayList hanya bisa menampung dua tipe: String dan Integer', false],
          ]),
        ],
      },
      {
        title: 'HashMap',
        slug: 'javafz-hashmap',
        content: [
          '`HashMap` (dari package `java.util`) menyimpan data sebagai pasangan key dan value: setiap value dicari lewat key-nya, bukan lewat index seperti `ArrayList`, dan key harus unik. Memakainya perlu `import java.util.HashMap;`, dengan tipe key dan value ditulis sebagai generic, misal `HashMap<String, Integer> nilai = new HashMap<>();` untuk key berupa nama (`String`) dan value berupa nilai ujian (`Integer`). Seperti `ArrayList`, keduanya harus reference type, jadi `HashMap<String, int>` tidak valid (pakai wrapper `Integer`).',
          'Method utamanya: `.put(key, value)` menambah pasangan baru (kalau key sudah ada, value lamanya diganti), `.get(key)` mengambil value, `.containsKey(key)` mengecek apakah key ada, `.remove(key)` menghapus pasangan, dan `.size()` mengembalikan jumlah pasangan. Contoh potongan kode di dalam `main`:',
          `\`\`\`java
HashMap<String, Integer> nilai = new HashMap<>();
nilai.put("Budi", 80);
nilai.put("Siti", 90);
nilai.put("Budi", 85);                          // key "Budi" sudah ada: nilai lamanya diganti

System.out.println(nilai.get("Budi"));          // 85
System.out.println(nilai.containsKey("Andi"));  // false
System.out.println(nilai.size());               // 2
\`\`\``,
          'Kalau key tidak ada, `.get(key)` mengembalikan `null`, bukan error. Hati-hati: `int n = nilai.get("Dewi");` melempar `NullPointerException` karena `null` di-unboxing menjadi `int` (lihat pelajaran Wrapper Class). Solusinya cek `.containsKey(...)` dulu, atau pakai `.getOrDefault(key, nilaiCadangan)` yang mengembalikan nilai cadangan kalau key tidak ada, misal `nilai.getOrDefault("Dewi", 0)`.',
          'Untuk menelusuri semua pasangan, pakai for-each pada `.entrySet()`: tiap elemennya adalah `Map.Entry` (satu pasangan key-value) dengan `.getKey()` dan `.getValue()`; `Map` perlu di-import dari `java.util` juga. `.keySet()` memberi semua key dan `.values()` memberi semua value.',
          'HashMap tidak menjamin urutan penelusuran: urutan pasangan bisa berbeda dari urutan `put`, dan bisa berubah kalau isi map berubah, jadi jangan menulis kode yang bergantung pada urutan itu. Kalau urutan penting, Java punya `LinkedHashMap` (urutan sesuai `put`) dan `TreeMap` (terurut berdasarkan key), yang tidak dibahas di course ini.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> nilai = new HashMap<>();
        nilai.put("Budi", 80);
        nilai.put("Siti", 90);
        nilai.put("Andi", 70);

        System.out.println("Nilai Siti: " + nilai.get("Siti"));
        System.out.println("Jumlah data: " + nilai.size());
        System.out.println("Ada Budi? " + nilai.containsKey("Budi"));

        // Key tidak ada: get mengembalikan null, getOrDefault memberi nilai cadangan
        System.out.println("Nilai Dewi: " + nilai.get("Dewi"));
        System.out.println("Nilai Dewi (cadangan 0): " + nilai.getOrDefault("Dewi", 0));

        // put dengan key yang sudah ada mengganti value lamanya
        nilai.put("Budi", 85);
        nilai.remove("Andi");
        System.out.println("Jumlah data setelah put ulang dan remove: " + nilai.size());

        // Telusuri semua pasangan (urutan tidak dijamin)
        int total = 0;
        for (Map.Entry<String, Integer> pasangan : nilai.entrySet()) {
            System.out.println(pasangan.getKey() + " -> " + pasangan.getValue());
            total += pasangan.getValue();
        }
        System.out.println("Total nilai: " + total);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dikembalikan nilai.get("Dewi") kalau key "Dewi" tidak ada di HashMap?', [
            ['null', true],
            ['Exception NoSuchElementException dilempar saat get dipanggil', false],
            ['0, karena value-nya bertipe Integer', false],
            ['-1, sebagai penanda bahwa key tidak ditemukan', false],
          ]),
          q('Apa yang terjadi kalau nilai.put("Budi", 85) dipanggil padahal key "Budi" sudah ada?', [
            ['Value lama diganti dengan 85, dan jumlah pasangan tidak bertambah', true],
            ['Error, karena key harus unik dan tidak boleh di-put dua kali', false],
            ['Pasangan baru ditambahkan, sehingga key "Budi" muncul dua kali', false],
            ['Panggilan put diabaikan dan value lama tetap dipertahankan', false],
          ]),
          q('Apa yang terjadi saat int n = nilai.get("Dewi"); dijalankan padahal key "Dewi" tidak ada?', [
            ['NullPointerException, karena null dibuka bungkusnya menjadi int', true],
            ['n bernilai 0, karena int yang belum terisi bernilai default 0', false],
            ['Error compile, karena get mengembalikan Integer yang tidak boleh disimpan ke int', false],
            ['n bernilai null, karena key yang tidak ada dibalas dengan null', false],
          ]),
        ],
      },
      {
        title: 'Method: Parameter, Return, static & Overloading',
        slug: 'javafz-method-static-overloading',
        content: [
          'Method adalah blok kode bernama yang bisa dipanggil berulang kali, supaya kode tidak perlu ditulis ulang. Bentuknya: `static tipeReturn namaMethod(tipe parameter1, tipe parameter2) { ... }`. Parameter adalah variabel di deklarasi method, sedangkan argumen adalah nilai yang diberikan saat method dipanggil, misal `tambah(2, 3)`. Tipe return menyatakan jenis nilai yang dikembalikan lewat `return` (yang juga langsung mengakhiri method), atau `void` kalau method tidak mengembalikan apa pun. Dua contoh method di dalam class `Main`, sejajar dengan `main`:',
          `\`\`\`java
static int tambah(int a, int b) {
    return a + b;
}

static void sapa(String nama) {
    System.out.println("Halo, " + nama + "!");
}
\`\`\``,
          'Kata kunci `static` berarti method milik class, bukan milik object tertentu, sehingga bisa dipanggil langsung tanpa `new`; begitulah `main` (yang juga `static`) memanggil `tambah(2, 3)`. Method tanpa `static` (instance method, seperti `perkenalan()` di pelajaran OOP nanti) butuh sebuah object; memanggilnya dari method `static` tanpa object adalah error compile: `non-static method ... cannot be referenced from a static context`.',
          'Overloading berarti beberapa method dalam satu class memakai nama yang sama dengan daftar parameter berbeda (jumlah atau tipe parameternya), misal `tambah(int, int)`, `tambah(double, double)`, dan `tambah(int, int, int)`. Compiler memilih versi yang cocok dari tipe argumennya saat compile: `tambah(2, 3)` memakai versi `int`, sedangkan `tambah(2, 3.5)` memakai versi `double` karena `2` dilebarkan menjadi `2.0`. Perbedaan return type saja tidak cukup: dua method dengan nama dan parameter yang sama tapi return type berbeda adalah error compile (`already defined`).',
          'Java selalu mengirim argumen sebagai salinan nilai (pass by value). Untuk tipe primitif, mengubah parameter di dalam method tidak memengaruhi variabel milik pemanggil. Untuk array, yang disalin adalah referensinya, jadi method yang mengubah isi array mengubah array yang sama milik pemanggil (isinya berubah, tapi array pemanggil tidak diganti dengan array lain). Contoh program lengkap:',
          `\`\`\`java
public class Main {
    static void tambahSatu(int x) {
        x++;                         // hanya mengubah salinan
    }

    static void gandakan(int[] data) {
        for (int i = 0; i < data.length; i++) {
            data[i] = data[i] * 2;   // mengubah isi array milik pemanggil
        }
    }

    public static void main(String[] args) {
        int angka = 5;
        tambahSatu(angka);
        System.out.println(angka);   // 5, tidak berubah

        int[] data = {1, 2, 3};
        gandakan(data);
        System.out.println(data[0] + " " + data[1] + " " + data[2]);   // 2 4 6
    }
}
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `public class Main {
    // Method dengan parameter dan return value
    static int tambah(int a, int b) {
        return a + b;
    }

    // Overloading: nama sama, daftar parameter berbeda
    static double tambah(double a, double b) {
        return a + b;
    }

    static int tambah(int a, int b, int c) {
        return a + b + c;
    }

    // void: tidak mengembalikan nilai
    static void sapa(String nama) {
        System.out.println("Halo, " + nama + "!");
    }

    // Parameter primitif adalah salinan nilai
    static void tambahSatu(int x) {
        x++;
    }

    // Parameter array adalah salinan referensi: isi array yang sama berubah
    static void gandakan(int[] data) {
        for (int i = 0; i < data.length; i++) {
            data[i] = data[i] * 2;
        }
    }

    public static void main(String[] args) {
        sapa("Budi");

        System.out.println("tambah(2, 3) = " + tambah(2, 3));
        System.out.println("tambah(2.5, 3.5) = " + tambah(2.5, 3.5));
        System.out.println("tambah(1, 2, 3) = " + tambah(1, 2, 3));
        System.out.println("tambah(2, 3.5) = " + tambah(2, 3.5));   // 2 dilebarkan menjadi 2.0

        int angka = 5;
        tambahSatu(angka);
        System.out.println("angka setelah tambahSatu: " + angka);

        int[] data = {1, 2, 3};
        gandakan(data);
        System.out.println("isi data setelah gandakan: " + data[0] + ", " + data[1] + ", " + data[2]);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Pasangan method mana yang merupakan overloading yang valid dalam satu class?', [
            ['static int tambah(int a, int b) dan static double tambah(double a, double b)', true],
            ['static int tambah(int a, int b) dan static double tambah(int a, int b)', false],
            ['static int tambah(int a, int b) dan static int tambah(int x, int y)', false],
            ['static int tambah(int a, int b) dan int tambah(int a, int b)', false],
          ]),
          q('Apa yang terjadi kalau method tanpa static dipanggil langsung dari main tanpa membuat object?', [
            ['Error compile: method non-static tidak bisa dipanggil dari konteks static', true],
            ['Berjalan normal, karena Java otomatis membuat object Main untuk memanggilnya', false],
            ['Compile berhasil, lalu NullPointerException muncul saat program dijalankan', false],
            ['Berjalan normal, hanya saja method itu tidak bisa memakai field apa pun', false],
          ]),
          q('Variabel angka bernilai 5, lalu static void tambahSatu(int x) { x++; } dipanggil lewat tambahSatu(angka);. Berapa nilai angka sesudahnya?', [
            ['Tetap 5, karena method hanya menerima salinan nilainya', true],
            ['6, karena parameter x menunjuk ke variabel angka yang sama', false],
            ['0, karena variabel di dalam method di-reset setelah selesai', false],
            ['Error compile, karena parameter method tidak boleh diubah nilainya', false],
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
          'Subclass bisa menambah field/method baru miliknya sendiri, dan bisa meng-override (menimpa ulang) method milik superclass dengan menuliskan ulang method yang sama persis (nama & parameter). Anotasi `@Override` di atas method itu bukan wajib: tanpanya method tetap menimpa. Tapi dengan `@Override`, compiler memberi error kalau ternyata tidak ada method superclass yang ditimpa (misalnya salah ketik nama), jadi anotasi ini membantu mencegah typo.',
          'Polymorphism ("banyak bentuk") berarti sebuah object subclass bisa diperlakukan sebagai object superclass-nya, dan method yang dipanggil akan menjalankan versi milik subclass sesuai tipe object aslinya saat runtime — ini disebut dynamic method dispatch.',
          'Kata kunci `super` dipakai untuk memanggil constructor atau method versi superclass dari dalam subclass. `super(nama)` di constructor subclass mengisi field yang didefinisikan di superclass dan harus menjadi baris pertama constructor; `super.bersuara()` menjalankan versi superclass dari method yang sedang di-override.',
          '## Contoh: override dengan super dan polymorphism',
          'Class `Anjing` di bawah memakai class `Hewan` dari sandbox (jadi tidak bisa dijalankan sendirian). Ia meng-override `bersuara()` tapi tetap menjalankan versi `Hewan` lewat `super.bersuara()`:',
          `\`\`\`java
class Anjing extends Hewan {
    Anjing(String nama) {
        super(nama);          // wajib baris pertama
    }

    @Override
    void bersuara() {
        super.bersuara();     // jalankan dulu versi Hewan
        System.out.println(nama + " lalu menggonggong: Guk!");
    }
}
\`\`\``,
          'Karena `Kucing` dan `Anjing` adalah `Hewan`, satu array bertipe `Hewan` bisa menampung ketiganya, dan setiap `bersuara()` menjalankan versi milik object aslinya (potongan di dalam `main`, memakai class di sandbox):',
          `\`\`\`java
Hewan[] kandang = { new Hewan("Hewan tak dikenal"), new Kucing("Si Meong"), new Anjing("Si Doggo") };
for (Hewan h : kandang) {
    h.bersuara();   // versi yang dijalankan mengikuti tipe object aslinya
}
\`\`\``,
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

class Anjing extends Hewan {
    Anjing(String nama) {
        super(nama);
    }

    @Override
    void bersuara() {
        super.bersuara();
        System.out.println(nama + " lalu menggonggong: Guk!");
    }
}

public class Main {
    public static void main(String[] args) {
        // Variabel bertipe Hewan boleh memegang object Kucing atau Anjing
        Hewan[] kandang = {
            new Hewan("Hewan tak dikenal"),
            new Kucing("Si Meong"),
            new Anjing("Si Doggo")
        };

        for (Hewan h : kandang) {
            h.bersuara();
        }
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa yang dipakai sebuah class untuk mewarisi class lain?', [
            ['extends', true],
            ['implements', false],
            ['inherits', false],
            ['super', false],
          ]),
          q('Pada Hewan h = new Kucing("Si Meong"); h.bersuara(); versi bersuara() milik class mana yang dijalankan?', [
            ['Milik Kucing, karena yang menentukan adalah tipe object aslinya saat runtime', true],
            ['Milik Hewan, karena yang menentukan adalah tipe variabel h', false],
            ['Keduanya dijalankan berurutan: versi Hewan dulu, lalu versi Kucing', false],
            ['Error compile, karena variabel bertipe Hewan tidak boleh memegang object Kucing', false],
          ]),
          q('Apa fungsi super(nama) di dalam constructor Kucing?', [
            ['Memanggil constructor Hewan untuk mengisi field nama milik superclass', true],
            ['Membuat object Hewan baru yang terpisah dari object Kucing yang sedang dibuat', false],
            ['Menyalin semua method milik Hewan ke dalam class Kucing sebagai method baru', false],
            ['Memanggil method bersuara() milik Hewan saat object Kucing dibuat', false],
          ]),
          q('Apa manfaat menulis @Override di atas method subclass?', [
            ['Compiler memberi error kalau method itu ternyata tidak menimpa method superclass', true],
            ['Tanpa @Override, method subclass tidak akan menimpa method superclass sama sekali', false],
            ['@Override membuat method superclass tidak bisa lagi dipanggil lewat super.namaMethod()', false],
            ['@Override membuat method berjalan lebih cepat daripada method biasa saat dipanggil', false],
          ]),
        ],
      },
      {
        title: 'Interface Dasar',
        slug: 'javafz-interface-dasar',
        content: [
          'Interface adalah "kontrak" yang mendefinisikan method apa saja yang harus dimiliki sebuah class, tanpa menentukan bagaimana implementasinya. Interface dideklarasikan dengan kata kunci `interface`, dan method di dalamnya otomatis `public abstract` (hanya tanda tangan method, tanpa body). Sejak Java 8 interface juga bisa punya method `default` yang berisi body, tapi itu tidak dibahas di sini.',
          'Berikut interface `Bentuk` dan satu class yang mengimplementasikannya (tanpa `main`, program lengkapnya ada di sandbox):',
          `\`\`\`java
interface Bentuk {
    double luas();   // otomatis public abstract: hanya tanda tangan, tanpa body
}

class Persegi implements Bentuk {
    private double sisi;

    Persegi(double sisi) {
        this.sisi = sisi;
    }

    @Override
    public double luas() {   // wajib public, karena method interface selalu public
        return sisi * sisi;
    }
}
\`\`\``,
          'Sebuah class memakai interface dengan kata kunci `implements`, lalu wajib menyediakan implementasi konkret untuk semua method interface itu, dan method implementasinya harus ditulis `public` (tanpa `public`, compiler menolak dengan `attempting to assign weaker access privileges; was public`). Kalau ada method yang belum diimplementasikan, class itu error compile: `is not abstract and does not override abstract method`.',
          'Pengecualiannya adalah abstract class, yaitu class yang ditandai `abstract` dan tidak bisa langsung dibuat dengan `new`. Abstract class boleh `implements` interface tanpa mengimplementasikan semua method-nya; sisanya wajib diimplementasikan oleh subclass konkret pertama yang mewarisinya.',
          'Berbeda dari inheritance class (`extends`, hanya boleh satu superclass), sebuah class boleh `implements` lebih dari satu interface sekaligus, dipisah koma, misal `class Persegi implements Bentuk, Berlabel`. Ini memberi fleksibilitas desain yang tidak dimiliki inheritance tunggal.',
          'Manfaat interface: beberapa class yang tidak berhubungan secara struktur tetap punya "kontrak" perilaku yang sama, sehingga bisa diperlakukan seragam lewat tipe interface-nya. Misalnya `Bentuk[]` bisa menampung `Persegi` dan `Segitiga` sekaligus. Ini bentuk lain dari polymorphism seperti di pelajaran sebelumnya: method yang dijalankan mengikuti object aslinya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `interface Bentuk {
    double luas();
}

interface Berlabel {
    String label();
}

// Satu class boleh implements lebih dari satu interface
class Persegi implements Bentuk, Berlabel {
    private double sisi;

    Persegi(double sisi) {
        this.sisi = sisi;
    }

    // Method dari interface wajib ditulis public
    @Override
    public double luas() {
        return sisi * sisi;
    }

    @Override
    public String label() {
        return "Persegi dengan sisi " + sisi;
    }
}

class Segitiga implements Bentuk {
    private double alas;
    private double tinggi;

    Segitiga(double alas, double tinggi) {
        this.alas = alas;
        this.tinggi = tinggi;
    }

    @Override
    public double luas() {
        return alas * tinggi / 2;
    }
}

public class Main {
    public static void main(String[] args) {
        // Tipe interface bisa menampung object dari class mana pun yang implements-nya
        Bentuk[] daftar = { new Persegi(4), new Segitiga(6, 3) };
        for (Bentuk b : daftar) {
            System.out.println("Luas: " + b.luas());
        }

        Persegi persegi = new Persegi(5);
        Berlabel berlabel = persegi;   // object yang sama, dilihat sebagai Berlabel
        System.out.println(berlabel.label() + ", luas " + persegi.luas());
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa yang dipakai class untuk memakai sebuah interface?', [
            ['implements', true],
            ['extends', false],
            ['interface', false],
            ['inherits', false],
          ]),
          q('Apakah sebuah class boleh implements lebih dari satu interface?', [
            ['Ya, boleh lebih dari satu, dipisah koma', true],
            ['Tidak, seperti extends, hanya satu interface per class', false],
            ['Boleh, tapi hanya kalau class itu abstract', false],
            ['Boleh, tapi hanya kalau class itu juga memakai extends', false],
          ]),
          q('Class Segitiga ditulis class Segitiga implements Bentuk tetapi method luas() belum dibuat, dan Segitiga bukan abstract. Apa yang terjadi saat dikompilasi?', [
            ['Error compile: Segitiga tidak mengimplementasikan luas() dari kontrak Bentuk', true],
            ['Compile berhasil, error AbstractMethodError baru muncul saat luas() dipanggil', false],
            ['Compile berhasil, luas() otomatis kosong dan mengembalikan 0.0', false],
            ['Compile berhasil, karena method interface dianggap opsional bagi class yang implements', false],
          ]),
          q('Abstract class BentukDasar implements Bentuk dan tidak menulis method luas(). Apa yang berlaku?', [
            ['Valid, tapi luas() wajib diimplementasikan oleh subclass konkret pertama dari BentukDasar', true],
            ['Error compile: semua class yang implements wajib menulis semua method, tanpa kecuali', false],
            ['Valid, dan luas() otomatis kosong sehingga subclass tidak perlu menulisnya', false],
            ['Error compile: abstract class tidak boleh implements interface', false],
          ]),
          q('Di class Persegi, method luas() dari interface Bentuk ditulis double luas() { ... } tanpa public. Apa hasilnya?', [
            ['Error compile: method interface otomatis public, jadi implementasinya wajib public juga', true],
            ['Valid, akses default (tanpa public) sudah cukup kalau kedua class ada di file yang sama', false],
            ['Valid, tapi method itu hanya bisa dipanggil dari dalam class Persegi sendiri', false],
            ['Error runtime IllegalAccessException saat luas() dipanggil dari class lain', false],
          ]),
        ],
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
        title: 'Studi Kasus Gabungan',
        slug: 'javafz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, mari gabungkan semua konsep yang sudah dipelajari: class & object, constructor, encapsulation, array/ArrayList, method, perulangan, dan exception handling dalam satu program utuh yang mensimulasikan sistem nilai siswa sederhana.',
          'Program di bawah ini mendefinisikan class `Siswa` dengan field private dan getter, menyimpan beberapa object `Siswa` dalam `ArrayList`, lalu menghitung rata-rata nilai lewat perulangan di method `hitungRataRata`. Method itu melempar `IllegalArgumentException` kalau daftarnya kosong, dan `cetakRataRata` menangkapnya dengan `try`/`catch`. Program memanggil `cetakRataRata` dua kali, sekali untuk kelas berisi tiga siswa dan sekali untuk kelas kosong, supaya jalur berhasil dan jalur error sama-sama terjalankan.',
          'Studi kasus seperti ini menunjukkan bagaimana konsep-konsep OOP dan kontrol alur yang dipelajari terpisah sebenarnya saling melengkapi dalam program Java yang lebih realistis — bukan sekadar dipakai satu-satu secara terisolasi.',
          '## Kenapa daftar kosong ditolak lewat exception?',
          'Kalau daftar kosong dibiarkan sampai ke pembagian, Java tidak melempar exception: `total` di-cast ke `double`, dan pembagian `double` dengan nol menghasilkan `NaN` (atau `Infinity`) tanpa error. Rata-rata `NaN` itu diam-diam salah, jadi method memeriksa sendiri dan melempar `IllegalArgumentException`, exception standar untuk "argumen yang diberikan tidak layak dipakai". `ArithmeticException` dilempar Java untuk pembagian bilangan bulat dengan nol, seperti `10 / 0` di pelajaran Exception Handling.',
          '## Penutup',
          'Selamat, sepanjang course ini kita sudah belajar dasar Java: sintaks & struktur program, tipe data (termasuk wrapper class, autoboxing, dan final) & operator, kontrol alur, array, ArrayList, HashMap & method, OOP (class, constructor, encapsulation, inheritance, interface), hingga exception handling — fondasi yang cukup untuk mulai membangun program Java yang lebih kompleks.',
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
            throw new IllegalArgumentException("Daftar siswa kosong, tidak bisa dihitung rata-rata");
        }
        int total = 0;
        for (Siswa siswa : daftarSiswa) {
            total += siswa.getNilai();
        }
        return (double) total / daftarSiswa.size();
    }

    static void cetakRataRata(String namaKelas, ArrayList<Siswa> daftarSiswa) {
        try {
            double rataRata = hitungRataRata(daftarSiswa);
            System.out.println("Rata-rata nilai " + namaKelas + ": " + rataRata);
        } catch (IllegalArgumentException e) {
            System.out.println("Error di " + namaKelas + ": " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        ArrayList<Siswa> kelasA = new ArrayList<>();
        kelasA.add(new Siswa("Budi", 80));
        kelasA.add(new Siswa("Siti", 90));
        kelasA.add(new Siswa("Andi", 70));

        for (Siswa siswa : kelasA) {
            System.out.println(siswa.getNama() + ": " + siswa.getNilai());
        }

        ArrayList<Siswa> kelasKosong = new ArrayList<>();

        cetakRataRata("kelas A", kelasA);
        cetakRataRata("kelas kosong", kelasKosong);
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Di studi kasus ini, kenapa field nama dan nilai pada class Siswa dibuat private?', [
            ['Untuk menerapkan encapsulation: dari luar class, field hanya dibaca lewat getter', true],
            ['Karena field yang tidak private tidak bisa diisi lewat constructor class Siswa', false],
            ['Karena Java mewajibkan semua field di dalam class dideklarasikan private', false],
            ['Supaya object Siswa bisa disimpan di dalam ArrayList tanpa error', false],
          ]),
          q('Struktur data apa yang dipakai untuk menampung banyak object Siswa dengan ukuran yang bisa bertambah?', [
            ['ArrayList<Siswa>', true],
            ['Siswa[], karena array otomatis membesar saat elemen baru ditambahkan', false],
            ['ArrayList<int>, karena nilai siswa berupa bilangan bulat', false],
            ['Satu variabel Siswa yang field-nya diisi ulang untuk tiap siswa', false],
          ]),
          q('Apa yang terjadi saat hitungRataRata dipanggil dengan daftar siswa kosong?', [
            ['IllegalArgumentException dilempar, lalu catch di cetakRataRata mencetak pesan error', true],
            ['Method mengembalikan 0.0 karena tidak ada nilai apa pun yang dijumlahkan', false],
            ['Program berhenti dengan ArithmeticException karena total dibagi dengan nol', false],
            ['Pembagian menghasilkan NaN, yang lalu dicetak sebagai rata-rata tanpa error', false],
          ]),
        ],
      },
    ],
  },
]

const course: CourseDef = {
  title: 'Java from Zero',
  slug: 'java-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'Java from Zero adalah course pengantar untuk kamu yang belum pernah menulis Java. Java banyak dipakai untuk backend, aplikasi enterprise, dan Android, dan cara kerjanya cukup ketat: semua kode ditulis di dalam class, dan tipe data dicek compiler sebelum program dijalankan. Course ini memperkenalkan Java dari nol, jadi pengalaman programming di bahasa lain membantu tapi tidak wajib.',
    'Di sini kamu belajar apa itu JVM dan bytecode beserta alur compile-run, struktur program, tipe data primitif (termasuk `var`), wrapper class dengan autoboxing dan `final`, operator, type casting, String, percabangan, perulangan, array, `ArrayList`, `HashMap`, method (parameter, return, `static`, overloading), lalu OOP: class dan object, constructor, encapsulation, inheritance dan polymorphism, serta interface. Course ditutup dengan exception handling dan studi kasus yang menggabungkan semuanya. Hampir semua lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan sebagian besar dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini menjalankan kode dengan OpenJDK 13, tanpa akses jaringan dan tanpa input keyboard. Kode disimpan sebagai satu file `Main.java`, jadi class publiknya harus bernama `Main`, dan fitur yang lebih baru dari Java 13 (misalnya `record` dan text block) tidak dipakai. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun.',
  ].join('\n\n'),
  sandboxLanguage: 'java',
  modules,
}

export default course
