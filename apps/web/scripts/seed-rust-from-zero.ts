import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "Rust from Zero" — meniru pola seed-python-from-zero.ts /
// seed-linux-from-zero.ts. Jalankan: pnpm seed:rust

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
    title: 'Pengenalan Rust',
    lessons: [
      {
        title: 'Apa itu Rust?',
        slug: 'rustfz-apa-itu-rust',
        content: [
          'Rust adalah bahasa pemrograman sistem yang dirancang untuk performa setara C/C++ tapi dengan jaminan memory safety (keamanan memori) tanpa memerlukan garbage collector. Rust pertama kali dikembangkan oleh Mozilla, dan sejak itu diadopsi luas oleh perusahaan seperti Microsoft, Amazon, Google, hingga masuk ke kernel Linux.',
          'Keunikan utama Rust ada pada sistem "ownership" (kepemilikan) yang dicek langsung oleh compiler saat proses kompilasi (disebut borrow checker). Kalau ada potensi bug memori seperti use-after-free atau data race, compiler akan menolak mengkompilasi kode tersebut — bug ditangkap sebelum program pernah dijalankan.',
          'Karena tidak ada garbage collector, program Rust yang sudah berhasil dikompilasi biasanya berjalan sangat cepat dan efisien, mendekati performa C, sehingga cocok dipakai untuk sistem operasi, web browser engine, blockchain, hingga tools command-line performa tinggi.',
          'Rust memang punya kurva belajar yang lebih curam dibanding bahasa seperti Python, terutama karena konsep ownership dan borrowing yang tidak ada di kebanyakan bahasa lain — tapi begitu terbiasa, konsep ini justru membantu menulis kode yang jauh lebih aman dari bug tersembunyi.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa yang pertama kali mengembangkan bahasa Rust?', [
            ['Mozilla', true],
            ['Google', false],
            ['Microsoft', false],
            ['Facebook', false],
          ]),
          q('Apa yang membuat Rust unik dibanding bahasa lain?', [
            ['Sistem ownership & borrow checker untuk memory safety tanpa garbage collector', true],
            ['Rust punya garbage collector tercepat di dunia', false],
            ['Rust hanya bisa dipakai untuk web development', false],
            ['Rust tidak punya compiler, langsung diinterpretasi', false],
          ]),
          q('Kapan borrow checker mendeteksi potensi bug memori di Rust?', [
            ['Saat proses kompilasi, sebelum program dijalankan', true],
            ['Hanya saat program sedang berjalan (runtime)', false],
            ['Setelah program selesai dijalankan', false],
            ['Rust tidak punya mekanisme deteksi bug memori', false],
          ]),
        ],
      },
      {
        title: 'Struktur Program',
        slug: 'rustfz-struktur-program',
        content: [
          'Setiap program Rust yang bisa dieksekusi wajib punya fungsi `fn main()` sebagai titik masuk (entry point) — di sinilah eksekusi program dimulai, persis seperti `main()` di C atau `public static void main` di Java.',
          'Untuk menampilkan output ke layar, Rust memakai macro `println!()` (perhatikan tanda seru di akhir — itu menandakan ini macro, bukan fungsi biasa). Macro adalah kode yang diperluas (expanded) oleh compiler sebelum kompilasi sebenarnya berjalan.',
          'Setiap statement di Rust diakhiri titik koma (`;`), dan blok kode dikelompokkan dengan kurung kurawal `{}` — mirip C/C++/Java, berbeda dari Python yang memakai indentasi sebagai penanda blok.',
          'Rust bersifat compiled (bukan interpreted) — kode `.rs` dikompilasi dulu oleh `rustc` menjadi binary sebelum bisa dijalankan, sehingga error tipe data dan sintaks ketahuan sebelum program benar-benar berjalan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    println!("Halo, Rust!");
    println!("Ini adalah program Rust pertama saya.");
}
`,
      },
      {
        title: 'Cargo & Compile',
        slug: 'rustfz-cargo-compile',
        content: [
          'Cargo adalah package manager sekaligus build tool resmi Rust, otomatis terpasang bersama toolchain Rust (`rustup`). Cargo mengurus dependency (disebut "crate"), proses compile, hingga menjalankan test, semuanya lewat satu perintah.',
          'Proyek Rust baru dibuat dengan `cargo new nama_proyek`, menghasilkan struktur folder standar: file `Cargo.toml` (berisi metadata proyek & daftar dependency) dan folder `src/` berisi kode sumber, dimulai dari `src/main.rs`.',
          'Perintah `cargo build` mengkompilasi proyek jadi binary di folder `target/`, sedangkan `cargo run` mengkompilasi sekaligus langsung menjalankan hasilnya — perintah yang paling sering dipakai saat development.',
          'Selain `rustc` (compiler mentah) dan `cargo`, ekosistem Rust punya crates.io sebagai registry publik untuk crate pihak ketiga, mirip `pip` untuk Python atau `npm` untuk JavaScript — tinggal ditambahkan ke `Cargo.toml` lalu Cargo yang mengurus download & compile-nya.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa nama package manager sekaligus build tool resmi Rust?', [
            ['Cargo', true],
            ['Rustup', false],
            ['Crates', false],
            ['Rustc saja', false],
          ]),
          q('Perintah apa untuk membuat proyek Rust baru dengan Cargo?', [
            ['cargo new nama_proyek', true],
            ['cargo init-project', false],
            ['cargo create', false],
            ['rustc new', false],
          ]),
          q('Apa perbedaan cargo build dan cargo run?', [
            ['cargo build hanya kompilasi, cargo run kompilasi lalu langsung jalankan', true],
            ['Keduanya persis sama tanpa perbedaan', false],
            ['cargo run hanya kompilasi tanpa menjalankan', false],
            ['cargo build menjalankan program tanpa kompilasi', false],
          ]),
          q('Apa nama registry publik untuk crate (library) pihak ketiga Rust?', [
            ['crates.io', true],
            ['npmjs.com', false],
            ['pypi.org', false],
            ['rustlib.org', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Variabel & Tipe Data',
    lessons: [
      {
        title: 'Variabel & Mutability',
        slug: 'rustfz-variabel-mutability',
        content: [
          'Variabel di Rust dibuat dengan kata kunci `let`, misal `let umur = 20;`. Berbeda dari kebanyakan bahasa lain, variabel di Rust bersifat immutable (tidak bisa diubah) secara default — mencoba mengubah nilainya setelah dibuat akan menghasilkan error saat kompilasi.',
          'Untuk membuat variabel yang nilainya bisa diubah, tambahkan kata kunci `mut` setelah `let`, misal `let mut umur = 20;` — baru setelah itu `umur = 21;` diperbolehkan.',
          'Keputusan desain "immutable by default" ini sengaja dibuat supaya programmer secara eksplisit menandai bagian mana dari kode yang memang butuh nilainya berubah, membuat kode lebih mudah dinalar dan mengurangi bug akibat perubahan nilai yang tidak disengaja.',
          'Rust juga mendukung "shadowing" — membuat variabel baru dengan nama sama memakai `let` lagi, yang secara efektif menggantikan variabel lama tanpa perlu `mut`, sering dipakai untuk mengubah tipe data dari nilai yang sama.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let umur = 20;
    println!("Umur (immutable): {}", umur);

    let mut skor = 0;
    println!("Skor awal: {}", skor);
    skor = 10;
    println!("Skor setelah diubah: {}", skor);

    // Shadowing: membuat variabel baru dengan nama sama
    let teks_angka = "42";
    let teks_angka: i32 = teks_angka.parse().unwrap();
    println!("Hasil shadowing jadi angka: {}", teks_angka);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana sifat variabel di Rust secara default?', [
            ['Immutable (tidak bisa diubah)', true],
            ['Mutable (selalu bisa diubah)', false],
            ['Tidak punya tipe data', false],
            ['Selalu global', false],
          ]),
          q('Kata kunci apa untuk membuat variabel yang nilainya bisa diubah?', [
            ['mut', true],
            ['var', false],
            ['const', false],
            ['change', false],
          ]),
          q('Apa yang terjadi kalau mencoba mengubah variabel immutable tanpa mut?', [
            ['Error saat kompilasi', true],
            ['Program tetap jalan normal', false],
            ['Error hanya muncul saat runtime', false],
            ['Nilai otomatis jadi 0', false],
          ]),
        ],
      },
      {
        title: 'Tipe Data Dasar',
        slug: 'rustfz-tipe-data-dasar',
        content: [
          'Rust adalah bahasa statically typed — tipe data setiap variabel ditentukan saat kompilasi, walau sering tidak perlu ditulis eksplisit karena compiler bisa menebaknya (type inference) dari nilai yang diberikan.',
          'Tipe integer paling umum adalah `i32` (bilangan bulat 32-bit bertanda), ada juga `i8`, `i16`, `i64`, serta versi unsigned (`u32`, `u64`, dst) untuk bilangan bulat tanpa tanda negatif.',
          'Tipe `f64` dipakai untuk bilangan desimal (floating point) dengan presisi tinggi, `bool` untuk nilai benar/salah (`true`/`false`), dan `char` untuk satu karakter Unicode, ditulis dengan kutip tunggal seperti `\'A\'`.',
          'Berbeda dari string biasa, `char` di Rust selalu tepat satu karakter dan ditulis dengan kutip tunggal — kutip ganda (`"..."`) dipakai untuk string literal (`&str`), bukan `char`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let bilangan_bulat: i32 = 42;
    let bilangan_desimal: f64 = 3.14;
    let benar_salah: bool = true;
    let satu_huruf: char = 'R';

    println!("Integer (i32): {}", bilangan_bulat);
    println!("Float (f64): {}", bilangan_desimal);
    println!("Boolean: {}", benar_salah);
    println!("Char: {}", satu_huruf);
}
`,
      },
      {
        title: 'Operator',
        slug: 'rustfz-operator',
        content: [
          'Operator aritmatika di Rust mirip bahasa C-style pada umumnya: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo). Penting dicatat: pembagian antar integer (`i32 / i32`) menghasilkan integer juga (dibulatkan ke bawah), bukan otomatis jadi desimal.',
          'Operator perbandingan (`==`, `!=`, `>`, `<`, `>=`, `<=`) selalu menghasilkan tipe `bool`. Operator logika `&&` (dan), `||` (atau), `!` (negasi) dipakai untuk menggabungkan kondisi boolean.',
          'Rust sangat ketat soal tipe data — mencoba menjumlahkan `i32` dengan `f64` langsung tanpa konversi eksplisit akan ditolak compiler, berbeda dari beberapa bahasa lain yang otomatis melakukan konversi tipe (implicit casting).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let a = 10;
    let b = 3;

    println!("Penjumlahan: {}", a + b);
    println!("Pembagian integer (dibulatkan ke bawah): {}", a / b);
    println!("Sisa bagi: {}", a % b);

    let hasil_perbandingan = a > b;
    println!("a > b: {}", hasil_perbandingan);

    let logika = (a > b) && (b > 0);
    println!("a > b DAN b > 0: {}", logika);
}
`,
      },
      {
        title: 'Tuple & Array',
        slug: 'rustfz-tuple-array',
        content: [
          'Tuple mengelompokkan beberapa nilai dengan tipe data yang boleh berbeda-beda ke dalam satu variabel, ditulis dengan tanda kurung, misal `let titik = (10, 20.5, true);`. Elemen tuple diakses dengan notasi titik dan index dimulai dari 0: `titik.0`, `titik.1`.',
          'Array menyimpan sekumpulan nilai dengan tipe data yang sama dan panjang tetap (fixed-length, tidak bisa ditambah/dikurangi setelah dibuat), ditulis dengan kurung siku: `let angka = [1, 2, 3, 4, 5];`. Akses elemen array pakai index seperti kebanyakan bahasa lain: `angka[0]`.',
          'Karena panjangnya tetap, tipe array lengkap ditulis sebagai `[T; N]`, misal `[i32; 5]` berarti array berisi 5 elemen bertipe `i32`. Kalau butuh koleksi yang bisa berubah ukuran, Rust punya `Vec<T>` (vector) yang akan dibahas di modul selanjutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let titik: (i32, f64, bool) = (10, 20.5, true);
    println!("Elemen tuple ke-0: {}", titik.0);
    println!("Elemen tuple ke-1: {}", titik.1);
    println!("Elemen tuple ke-2: {}", titik.2);

    let angka: [i32; 5] = [1, 2, 3, 4, 5];
    println!("Elemen pertama array: {}", angka[0]);
    println!("Panjang array: {}", angka.len());

    let mut total = 0;
    for nilai in angka.iter() {
        total += nilai;
    }
    println!("Total semua elemen array: {}", total);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara mengakses elemen pertama dari tuple bernama titik?', [
            ['titik.0', true],
            ['titik[0]', false],
            ['titik.first()', false],
            ['titik(0)', false],
          ]),
          q('Apa ciri khas array di Rust?', [
            ['Panjangnya tetap (fixed-length) setelah dibuat', true],
            ['Panjangnya selalu bisa berubah bebas', false],
            ['Bisa menyimpan tipe data campuran', false],
            ['Tidak bisa diakses lewat index', false],
          ]),
          q('Tipe koleksi apa yang dipakai kalau butuh ukuran yang bisa berubah-ubah?', [
            ['Vec<T> (vector)', true],
            ['Array biasa', false],
            ['Tuple', false],
            ['char', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Kontrol Alur',
    lessons: [
      {
        title: 'Percabangan if',
        slug: 'rustfz-percabangan-if',
        content: [
          'Percabangan `if` di Rust mirip bahasa lain: `if kondisi { ... } else if kondisi_lain { ... } else { ... }` — tapi kondisi di dalam `if` harus bertipe `bool` secara eksplisit, tidak ada konsep "truthy/falsy" seperti di Python atau JavaScript.',
          'Keunikan Rust: `if` adalah sebuah expression (menghasilkan nilai), bukan cuma statement. Artinya `if`/`else` bisa langsung dipakai untuk mengisi nilai variabel, misal `let status = if nilai >= 60 { "lulus" } else { "gagal" };` — menggantikan ternary operator yang tidak dimiliki Rust.',
          'Karena `if` adalah expression, kedua cabang (`if` dan `else`) wajib mengembalikan tipe data yang sama — compiler akan menolak kalau cabang `if` mengembalikan `i32` tapi cabang `else` mengembalikan `&str`, misalnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let nilai = 75;

    if nilai >= 90 {
        println!("Grade A");
    } else if nilai >= 75 {
        println!("Grade B");
    } else {
        println!("Grade C atau di bawahnya");
    }

    // if sebagai expression, langsung mengisi variabel
    let status = if nilai >= 60 { "lulus" } else { "gagal" };
    println!("Status: {}", status);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe apa yang wajib dimiliki kondisi di dalam if pada Rust?', [
            ['bool', true],
            ['i32', false],
            ['String, bisa apa saja', false],
            ['Tidak ada aturan tipe khusus', false],
          ]),
          q('Kenapa if di Rust disebut sebagai expression?', [
            ['Karena bisa langsung menghasilkan nilai untuk mengisi variabel', true],
            ['Karena hanya bisa dipakai di dalam fungsi', false],
            ['Karena tidak butuh kondisi boolean', false],
            ['Karena selalu mengembalikan angka', false],
          ]),
          q('Kalau if dipakai sebagai expression, apa syarat kedua cabangnya?', [
            ['Harus mengembalikan tipe data yang sama', true],
            ['Boleh tipe data berbeda bebas', false],
            ['Cabang else wajib dihapus', false],
            ['Cabang if wajib kosong', false],
          ]),
        ],
      },
      {
        title: 'Perulangan',
        slug: 'rustfz-perulangan',
        content: [
          '`loop` membuat perulangan tak terbatas yang hanya berhenti kalau ada `break` di dalamnya — cocok kalau kondisi berhenti tidak sederhana ditulis di awal. `loop` bahkan bisa mengembalikan nilai lewat `break nilai;`.',
          '`while kondisi { ... }` mengulang selama kondisi bernilai `true`, mirip bahasa lain pada umumnya — pastikan ada perubahan kondisi di dalam loop supaya tidak infinite loop.',
          '`for item in range_atau_koleksi { ... }` adalah cara paling umum dipakai untuk mengulang sejumlah kali tertentu atau mengiterasi koleksi. Contoh `for i in 0..5 { ... }` mengulang dengan `i` bernilai 0 sampai 4 (batas atas eksklusif).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    // loop dengan break yang mengembalikan nilai
    let mut hitung = 0;
    let hasil = loop {
        hitung += 1;
        if hitung == 5 {
            break hitung * 2;
        }
    };
    println!("Hasil dari loop: {}", hasil);

    // while
    let mut sisa = 3;
    while sisa > 0 {
        println!("Hitung mundur: {}", sisa);
        sisa -= 1;
    }

    // for dengan range
    for i in 0..5 {
        println!("Iterasi for ke-{}", i);
    }
}
`,
      },
      {
        title: 'match Expression',
        slug: 'rustfz-match-expression',
        content: [
          '`match` adalah fitur pattern matching khas Rust, dipakai untuk membandingkan sebuah nilai terhadap beberapa kemungkinan pola sekaligus — mirip `switch` di bahasa lain, tapi jauh lebih kuat dan wajib menangani semua kemungkinan nilai (exhaustive).',
          'Compiler Rust akan menolak kompilasi kalau sebuah `match` tidak menangani semua kemungkinan nilai — pola `_` (underscore) dipakai sebagai catch-all untuk menangkap semua nilai lain yang belum ditangani secara eksplisit.',
          'Sama seperti `if`, `match` juga merupakan expression yang bisa langsung menghasilkan nilai, sehingga sering dipakai untuk mengisi variabel berdasarkan beberapa kemungkinan kondisi, menggantikan rangkaian `if/else if` yang panjang.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let angka = 3;

    match angka {
        1 => println!("Satu"),
        2 => println!("Dua"),
        3 => println!("Tiga"),
        _ => println!("Angka lain"),
    }

    // match sebagai expression
    let deskripsi = match angka {
        n if n % 2 == 0 => "genap",
        _ => "ganjil",
    };
    println!("Angka {} adalah {}", angka, deskripsi);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang wajib dipenuhi sebuah match di Rust agar bisa dikompilasi?', [
            ['Harus menangani semua kemungkinan nilai (exhaustive)', true],
            ['Harus punya minimal 5 pola', false],
            ['Tidak boleh punya pola _', false],
            ['Hanya boleh dipakai untuk angka', false],
          ]),
          q('Apa fungsi pola _ (underscore) dalam match?', [
            ['Menangkap semua nilai lain yang belum ditangani secara eksplisit', true],
            ['Menghentikan program', false],
            ['Menandai variabel private', false],
            ['Hanya dekorasi, tidak berfungsi', false],
          ]),
          q('Selain sebagai statement, match di Rust juga berfungsi sebagai?', [
            ['Expression yang bisa mengisi nilai variabel', true],
            ['Komentar', false],
            ['Deklarasi fungsi', false],
            ['Import modul', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Ownership & Fungsi',
    lessons: [
      {
        title: 'Fungsi & Parameter',
        slug: 'rustfz-fungsi-parameter',
        content: [
          'Fungsi di Rust didefinisikan dengan kata kunci `fn`, diikuti nama fungsi, parameter dalam kurung (wajib disertai tipe data tiap parameter), dan opsional tipe nilai kembalian setelah tanda panah `->`.',
          'Baris terakhir dalam sebuah fungsi tanpa titik koma di akhirnya otomatis menjadi nilai kembalian (implicit return) — bisa juga memakai kata kunci `return` eksplisit untuk keluar lebih awal dari fungsi.',
          'Berbeda dari variabel biasa yang bisa memakai type inference, parameter fungsi dan tipe nilai kembalian di Rust wajib ditulis eksplisit — ini membantu compiler (dan pembaca kode) memahami kontrak fungsi tanpa harus melihat isi fungsinya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn tambah(a: i32, b: i32) -> i32 {
    a + b // tanpa titik koma = implicit return
}

fn sapa(nama: &str) {
    println!("Halo, {}!", nama);
}

fn main() {
    let hasil = tambah(5, 3);
    println!("Hasil tambah: {}", hasil);
    sapa("Siswa BarisORG");
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk mendefinisikan fungsi di Rust?', [
            ['fn', true],
            ['def', false],
            ['func', false],
            ['function', false],
          ]),
          q('Bagaimana cara sebuah fungsi Rust mengembalikan nilai tanpa kata kunci return?', [
            ['Baris terakhir tanpa titik koma otomatis jadi nilai kembalian', true],
            ['Semua baris harus diakhiri titik koma termasuk baris terakhir', false],
            ['Rust tidak mendukung implicit return sama sekali', false],
            ['Harus selalu memakai print di akhir fungsi', false],
          ]),
          q('Apa yang wajib ditulis eksplisit pada parameter fungsi Rust?', [
            ['Tipe data tiap parameter', true],
            ['Nilai default tiap parameter', false],
            ['Jumlah maksimal parameter', false],
            ['Tidak ada yang wajib eksplisit', false],
          ]),
        ],
      },
      {
        title: 'Ownership Dasar',
        slug: 'rustfz-ownership-dasar',
        content: [
          'Ownership adalah konsep paling fundamental (dan paling unik) di Rust: setiap nilai di memori punya tepat satu variabel yang menjadi "pemiliknya" (owner) pada satu waktu. Saat owner keluar dari scope (blok kode berakhir), Rust otomatis membersihkan memori nilai itu — tanpa perlu garbage collector.',
          'Untuk tipe data yang disimpan di heap seperti `String`, memindahkan (assign) nilai dari satu variabel ke variabel lain akan "memindahkan kepemilikan" (move), bukan menyalin — setelah dipindah, variabel lama tidak bisa dipakai lagi dan compiler akan menolak kalau tetap dipakai.',
          'Tipe data sederhana yang ukurannya tetap dan disimpan di stack, seperti `i32`, `f64`, `bool`, `char`, justru otomatis di-copy (bukan move) saat di-assign ke variabel lain — karena menyalinnya jauh lebih murah daripada memindahkan kepemilikan.',
          'Aturan ownership ini terdengar rumit di awal, tapi tujuannya sederhana: mencegah dua bagian kode berbeda sama-sama mengira mereka "memiliki" dan berhak menghapus data yang sama, yang di bahasa lain sering menyebabkan bug memori serius.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Berapa banyak owner yang boleh dimiliki sebuah nilai di Rust pada satu waktu?', [
            ['Tepat satu', true],
            ['Sebanyak-banyaknya', false],
            ['Minimal dua', false],
            ['Tidak ada konsep owner', false],
          ]),
          q('Apa yang terjadi saat sebuah owner keluar dari scope?', [
            ['Rust otomatis membersihkan memori nilai itu', true],
            ['Program langsung crash', false],
            ['Nilai dipindahkan ke variabel global', false],
            ['Tidak terjadi apa-apa sampai program selesai', false],
          ]),
          q('Assign nilai String dari satu variabel ke variabel lain di Rust disebut?', [
            ['Move (memindahkan kepemilikan)', true],
            ['Copy otomatis selalu', false],
            ['Clone otomatis selalu', false],
            ['Reference otomatis', false],
          ]),
          q('Tipe data apa yang otomatis di-copy (bukan move) saat di-assign?', [
            ['Tipe sederhana di stack seperti i32, bool, char', true],
            ['Semua tipe data tanpa kecuali', false],
            ['Hanya String', false],
            ['Hanya Vec<T>', false],
          ]),
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    // Tipe sederhana (stack) otomatis di-copy, bukan move
    let a = 5;
    let b = a;
    println!("a = {}, b = {} (keduanya masih valid)", a, b);

    // String (heap) akan dipindah kepemilikannya (move) kalau di-assign langsung.
    // Di sini kita pakai .clone() supaya s1 tetap valid dan mudah dipahami pemula.
    let s1 = String::from("Rust");
    let s2 = s1.clone();
    println!("s1 = {}, s2 = {} (dua String terpisah lewat clone)", s1, s2);
}
`,
      },
      {
        title: 'Borrowing & Reference',
        slug: 'rustfz-borrowing-reference',
        content: [
          'Borrowing memungkinkan sebuah fungsi "meminjam" akses ke suatu nilai tanpa memindahkan kepemilikannya (ownership) — dilakukan dengan memakai reference, ditandai tanda `&` di depan tipe data atau variabel, misal `&String` atau `&nama`.',
          'Karena hanya meminjam, variabel asli tetap valid dan bisa dipakai lagi setelah fungsi peminjam selesai — berbeda dengan move yang membuat variabel asli tidak bisa dipakai lagi.',
          'Rust punya aturan ketat soal borrowing untuk mencegah data race: dalam satu waktu, boleh ada banyak reference immutable (`&T`) sekaligus, ATAU tepat satu reference mutable (`&mut T`) — tidak boleh keduanya bercampur secara bersamaan.',
          'Reference mutable (`&mut`) dipakai kalau fungsi peminjam perlu mengubah nilai yang dipinjam, misal `fn tambah_satu(angka: &mut i32)` — variabel yang dipinjam sendiri juga harus dideklarasikan dengan `mut`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn hitung_panjang(teks: &String) -> usize {
    teks.len()
}

fn tambah_satu(angka: &mut i32) {
    *angka += 1;
}

fn main() {
    let nama = String::from("BarisORG");
    let panjang = hitung_panjang(&nama);
    println!("Panjang \\"{}\\" adalah {} (nama masih bisa dipakai: {})", nama, panjang, nama);

    let mut skor = 10;
    tambah_satu(&mut skor);
    println!("Skor setelah ditambah lewat reference mutable: {}", skor);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi tanda & di depan sebuah tipe data atau variabel di Rust?', [
            ['Menandakan reference (meminjam, bukan memindahkan kepemilikan)', true],
            ['Menandakan variabel global', false],
            ['Menandakan komentar', false],
            ['Menandakan variabel konstan', false],
          ]),
          q('Dalam satu waktu, kombinasi reference apa yang DIPERBOLEHKAN Rust?', [
            ['Banyak reference immutable, ATAU tepat satu reference mutable', true],
            ['Banyak reference mutable sekaligus', false],
            ['Reference immutable dan mutable bersamaan', false],
            ['Tidak boleh ada reference sama sekali', false],
          ]),
          q('Apa keuntungan borrowing dibanding memindahkan (move) kepemilikan?', [
            ['Variabel asli tetap valid dan bisa dipakai lagi setelahnya', true],
            ['Borrowing selalu lebih lambat dari move', false],
            ['Borrowing menghapus nilai asli', false],
            ['Borrowing tidak butuh tanda apa pun', false],
          ]),
        ],
      },
      {
        title: 'Struct',
        slug: 'rustfz-struct',
        content: [
          'Struct (structure) mengelompokkan beberapa nilai terkait dengan nama field masing-masing ke dalam satu tipe data kustom, didefinisikan dengan kata kunci `struct`, misal `struct Siswa { nama: String, umur: u32 }`.',
          'Instance (object) dari struct dibuat dengan menyebut nama struct diikuti nilai tiap field dalam kurung kurawal, misal `let siswa1 = Siswa { nama: String::from("Budi"), umur: 20 };`. Akses field lewat notasi titik: `siswa1.nama`.',
          'Method (fungsi yang "menempel" pada struct) didefinisikan dalam blok `impl NamaStruct { ... }`, dengan parameter pertama biasanya `&self` — merujuk ke instance struct itu sendiri, mirip `self` di Python atau `this` di bahasa lain.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `struct Siswa {
    nama: String,
    umur: u32,
}

impl Siswa {
    fn perkenalan(&self) {
        println!("Halo, saya {}, umur {} tahun", self.nama, self.umur);
    }
}

fn main() {
    let siswa1 = Siswa {
        nama: String::from("Budi"),
        umur: 20,
    };
    let siswa2 = Siswa {
        nama: String::from("Siti"),
        umur: 22,
    };

    siswa1.perkenalan();
    siswa2.perkenalan();
}
`,
      },
    ],
  },
  {
    title: 'Enum & Ringkasan',
    lessons: [
      {
        title: 'Enum Dasar',
        slug: 'rustfz-enum-dasar',
        content: [
          'Enum (enumeration) mendefinisikan sebuah tipe data yang nilainya harus salah satu dari beberapa kemungkinan (variant) yang sudah ditentukan, ditulis dengan kata kunci `enum`, misal `enum Arah { Utara, Selatan, Timur, Barat }`.',
          'Enum di Rust jauh lebih kuat dari sekadar daftar konstanta — tiap variant bisa menyimpan data tambahan dengan tipe berbeda-beda, misal `enum Bentuk { Lingkaran(f64), Persegi(f64, f64) }`, di mana `Lingkaran` menyimpan radius dan `Persegi` menyimpan panjang & lebar.',
          'Kombinasi enum dengan `match` sangat umum dipakai di Rust — `match` memaksa semua variant enum ditangani, sehingga compiler akan mengingatkan kalau ada satu variant yang lupa ditangani, mengurangi bug akibat kasus yang terlewat.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `enum Arah {
    Utara,
    Selatan,
    Timur,
    Barat,
}

fn deskripsi_arah(arah: Arah) -> &'static str {
    match arah {
        Arah::Utara => "menuju ke atas",
        Arah::Selatan => "menuju ke bawah",
        Arah::Timur => "menuju ke kanan",
        Arah::Barat => "menuju ke kiri",
    }
}

fn main() {
    let arah_sekarang = Arah::Timur;
    println!("Arah saat ini: {}", deskripsi_arah(arah_sekarang));
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang bisa dilakukan tiap variant enum di Rust selain sekadar jadi nama?', [
            ['Menyimpan data tambahan dengan tipe berbeda-beda', true],
            ['Enum di Rust hanya bisa berisi angka', false],
            ['Variant enum tidak boleh punya nama', false],
            ['Enum tidak bisa dipakai bersama match', false],
          ]),
          q('Kenapa kombinasi enum dan match sering dipakai di Rust?', [
            ['match memaksa semua variant enum ditangani, mengurangi kasus terlewat', true],
            ['match hanya bisa dipakai untuk angka, bukan enum', false],
            ['Enum tidak kompatibel dengan match', false],
            ['match membuat program berjalan tanpa compile', false],
          ]),
        ],
      },
      {
        title: 'Option<T> untuk Null Safety',
        slug: 'rustfz-option-null-safety',
        content: [
          'Rust sengaja tidak punya konsep `null` atau `nil` seperti kebanyakan bahasa lain — ini menghilangkan seluruh kategori bug terkenal "null pointer exception" yang sering terjadi di bahasa lain saat mengakses nilai yang ternyata kosong.',
          'Sebagai gantinya, Rust punya enum bawaan `Option<T>` dengan dua variant: `Some(nilai)` kalau ada nilai, dan `None` kalau tidak ada nilai. Contoh: fungsi pencarian yang mungkin tidak menemukan hasil akan mengembalikan `Option<i32>`, bukan `i32` yang dipaksa bernilai sesuatu.',
          'Karena `Option<T>` adalah tipe yang berbeda dari `T` biasa, compiler memaksa programmer menangani kedua kemungkinan (`Some` dan `None`) secara eksplisit sebelum bisa memakai nilai di dalamnya — biasanya lewat `match` atau method seperti `.unwrap_or()` yang menyediakan nilai fallback.',
          'Pendekatan ini memindahkan pengecekan "apakah nilai ini ada?" dari yang tadinya bisa lolos tanpa disadari (dan crash saat runtime di bahasa lain), menjadi wajib ditangani saat kompilasi di Rust.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dipakai Rust untuk mewakili "tidak ada nilai", karena tidak punya null?', [
            ['Option<T> dengan variant Some dan None', true],
            ['Rust tetap memakai null seperti bahasa lain', false],
            ['Nilai 0 selalu berarti tidak ada nilai', false],
            ['String kosong', false],
          ]),
          q('Apa dua variant dari enum Option<T>?', [
            ['Some(nilai) dan None', true],
            ['True dan False', false],
            ['Ok dan Error', false],
            ['Yes dan No', false],
          ]),
          q('Kenapa pendekatan Option<T> mengurangi bug dibanding null tradisional?', [
            ['Compiler memaksa kedua kemungkinan ditangani sebelum nilai dipakai', true],
            ['Option<T> otomatis mengisi nilai default tanpa pengecekan', false],
            ['Option<T> hanya dekorasi tanpa efek nyata', false],
            ['Option<T> membuat program berjalan lebih lambat tanpa manfaat', false],
          ]),
        ],
      },
      {
        title: 'Vector (Vec<T>) Dasar',
        slug: 'rustfz-vector-dasar',
        content: [
          '`Vec<T>` (vector) adalah koleksi yang mirip array tapi ukurannya bisa berubah (tumbuh atau menyusut) saat program berjalan, disimpan di heap. `T` adalah placeholder untuk tipe data elemen di dalamnya, misal `Vec<i32>` berarti vector berisi bilangan bulat.',
          'Vector baru bisa dibuat dengan `Vec::new()` (kosong, biasanya diikuti penambahan elemen) atau macro `vec![1, 2, 3]` untuk langsung mengisi nilai awal. Method `.push(nilai)` menambah elemen ke akhir vector.',
          'Akses elemen vector pakai index seperti array (`vektor[0]`), tapi kalau index di luar jangkauan program akan panic (crash terkontrol) — untuk akses yang lebih aman, method `.get(index)` mengembalikan `Option<&T>` yang bisa dicek dulu apakah ada isinya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let mut angka: Vec<i32> = Vec::new();
    angka.push(10);
    angka.push(20);
    angka.push(30);

    println!("Isi vector: {:?}", angka);
    println!("Elemen pertama: {}", angka[0]);
    println!("Jumlah elemen: {}", angka.len());

    let mut total = 0;
    for nilai in &angka {
        total += nilai;
    }
    println!("Total semua elemen: {}", total);

    match angka.get(10) {
        Some(nilai) => println!("Elemen index 10: {}", nilai),
        None => println!("Index 10 tidak ada di vector ini"),
    }
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama Vec<T> dibanding array biasa di Rust?', [
            ['Vec<T> ukurannya bisa berubah (dinamis), array ukurannya tetap', true],
            ['Vec<T> hanya bisa berisi satu elemen', false],
            ['Array bisa berubah ukuran, Vec<T> tidak', false],
            ['Tidak ada bedanya sama sekali', false],
          ]),
          q('Method apa untuk menambah elemen ke akhir Vec<T>?', [
            ['.push()', true],
            ['.append_end()', false],
            ['.add()', false],
            ['.insert_last()', false],
          ]),
          q('Apa yang dikembalikan method .get(index) pada Vec<T>?', [
            ['Option<&T> yang aman dicek dulu', true],
            ['Selalu crash kalau index salah', false],
            ['String kosong', false],
            ['Selalu None tanpa terkecuali', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'rustfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, mari gabungkan semua konsep yang sudah dipelajari — struct, enum, `Option<T>`, vector, `match`, dan ownership sederhana — ke dalam satu program kecil yang merepresentasikan daftar tugas (to-do list) sederhana.',
          'Program di sandbox berikut mendefinisikan struct `Tugas` dengan field `nama` dan `status` (bertipe enum `StatusTugas`), menyimpan beberapa tugas dalam `Vec<Tugas>`, lalu memakai `match` untuk menampilkan status tiap tugas dengan format yang berbeda.',
          'Sepanjang course "Rust from Zero" ini kita sudah belajar dari sintaks dasar, tipe data, kontrol alur, fungsi, konsep ownership & borrowing yang jadi ciri khas Rust, hingga struct dan enum — fondasi yang cukup untuk mulai membangun program Rust yang lebih kompleks dan aman dari bug memori.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `enum StatusTugas {
    BelumSelesai,
    Selesai,
}

struct Tugas {
    nama: String,
    status: StatusTugas,
}

impl Tugas {
    fn tampilkan(&self) {
        let simbol = match self.status {
            StatusTugas::Selesai => "[x]",
            StatusTugas::BelumSelesai => "[ ]",
        };
        println!("{} {}", simbol, self.nama);
    }
}

fn main() {
    let daftar_tugas: Vec<Tugas> = vec![
        Tugas { nama: String::from("Belajar ownership"), status: StatusTugas::Selesai },
        Tugas { nama: String::from("Belajar struct & enum"), status: StatusTugas::Selesai },
        Tugas { nama: String::from("Bikin proyek Rust sendiri"), status: StatusTugas::BelumSelesai },
    ];

    println!("Daftar Tugas Belajar Rust:");
    for tugas in &daftar_tugas {
        tugas.tampilkan();
    }

    let jumlah_selesai = daftar_tugas
        .iter()
        .filter(|t| matches!(t.status, StatusTugas::Selesai))
        .count();
    println!("Tugas selesai: {} dari {}", jumlah_selesai, daftar_tugas.len());
}
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
      title: 'Rust from Zero',
      slug: 'rust-from-zero',
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
            ? { sandboxLanguage: 'rust', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "Rust from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
