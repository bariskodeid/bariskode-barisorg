import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan Rust',
    lessons: [
      {
        title: 'Apa itu Rust?',
        slug: 'rustfz-apa-itu-rust',
        content: [
          'Rust adalah bahasa pemrograman sistem yang dirancang untuk performa setara C/C++ tapi dengan jaminan memory safety (keamanan memori) tanpa memerlukan garbage collector. Rust dimulai sekitar tahun 2006 sebagai proyek pribadi Graydon Hoare, lalu Mozilla mulai mensponsorinya pada 2009; versi stabil 1.0 dirilis tahun 2015. Sejak itu Rust diadopsi luas oleh perusahaan seperti Microsoft, Amazon, Google, hingga masuk ke kernel Linux.',
          'Keunikan utama Rust ada pada sistem "ownership" (kepemilikan) yang dicek langsung oleh compiler saat proses kompilasi (disebut borrow checker). Kalau ada potensi bug memori seperti use-after-free atau data race, compiler akan menolak mengkompilasi kode tersebut — bug ditangkap sebelum program pernah dijalankan.',
          'Karena tidak ada garbage collector, program Rust yang sudah berhasil dikompilasi biasanya berjalan sangat cepat dan efisien, mendekati performa C, sehingga cocok dipakai untuk sistem operasi, web browser engine, blockchain, hingga tools command-line performa tinggi.',
          'Rust memang punya kurva belajar yang lebih curam dibanding bahasa seperti Python, terutama karena konsep ownership dan borrowing yang tidak ada di kebanyakan bahasa lain — tapi begitu terbiasa, konsep ini justru membantu menulis kode yang jauh lebih aman dari bug tersembunyi.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa yang memulai pengembangan bahasa Rust?', [
            ['Graydon Hoare, sebagai proyek pribadi sekitar tahun 2006', true],
            ['Tim engineer Mozilla yang dibentuk khusus untuk membuat Rust sejak awal', false],
            ['Google, sebagai pengganti C++ untuk Android', false],
            ['Microsoft, sebagai bahasa untuk menulis ulang Windows', false],
          ]),
          q('Apa yang membuat Rust unik dibanding bahasa lain?', [
            ['Sistem ownership & borrow checker untuk memory safety tanpa garbage collector', true],
            ['Memory safety dijamin lewat garbage collector yang berjalan saat program dijalankan', false],
            ['Rust diinterpretasi baris demi baris, jadi tidak butuh proses kompilasi', false],
            ['Rust dirancang khusus untuk web frontend dan tidak cocok untuk sistem operasi', false],
          ]),
          q('Kapan borrow checker mendeteksi potensi bug memori di Rust?', [
            ['Saat proses kompilasi, sebelum program dijalankan', true],
            ['Saat program berjalan, dengan memeriksa setiap akses memori', false],
            ['Hanya saat programmer menjalankan perintah cargo test', false],
            ['Saat garbage collector membersihkan memori yang tidak terpakai', false],
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
          'Selain `rustc` (compiler mentah) dan `cargo`, ekosistem Rust punya crates.io sebagai registry publik untuk crate pihak ketiga, mirip `pip` untuk Python atau `npm` untuk JavaScript — tinggal ditambahkan ke `Cargo.toml` lalu Cargo yang mengurus download & compile-nya. Situs docs.rs otomatis menampilkan dokumentasi tiap crate yang dipublikasikan ke crates.io, sedangkan `rustup` hanya memasang dan memperbarui toolchain (`rustc`, `cargo`), bukan tempat mencari crate.',
          'Di code sandbox bariskode.org, kode dikompilasi sebagai satu file tanpa Cargo, jadi perintah `cargo` tidak bisa dicoba di sana — tapi hampir semua proyek Rust sungguhan memakainya.',
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
            ['docs.rs', false],
            ['rustup.rs', false],
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
          'Variabel di Rust dibuat dengan kata kunci `let`, misal `let umur = 20;`. Berbeda dari kebanyakan bahasa lain, variabel di Rust bersifat immutable (tidak bisa diubah) secara default — mencoba mengubah nilainya setelah dibuat akan menghasilkan error saat kompilasi. Untuk menampilkan nilai variabel, `println!` memakai `{}` sebagai placeholder yang diisi argumen berikutnya sesuai urutan, misal `println!("Umur: {}", umur);`.',
          'Untuk membuat variabel yang nilainya bisa diubah, tambahkan kata kunci `mut` setelah `let`, misal `let mut umur = 20;` — baru setelah itu `umur = 21;` diperbolehkan.',
          'Keputusan desain "immutable by default" ini sengaja dibuat supaya programmer secara eksplisit menandai bagian mana dari kode yang memang butuh nilainya berubah, membuat kode lebih mudah dinalar dan mengurangi bug akibat perubahan nilai yang tidak disengaja.',
          'Rust juga mendukung "shadowing" — membuat variabel baru dengan nama sama memakai `let` lagi, yang secara efektif menggantikan variabel lama tanpa perlu `mut`. Karena yang dibuat variabel baru, tipenya boleh berbeda: teks `"   "` bisa diganti menjadi angka jumlah byte-nya lewat `.len()`. Sebaliknya, `mut` hanya mengubah nilai dengan tipe yang sama — `let mut x = "teks"; x = 5;` ditolak compiler.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let umur = 20;
    println!("Umur (immutable): {}", umur);

    let mut skor = 0;
    println!("Skor awal: {}", skor);
    skor = 10;
    println!("Skor setelah diubah: {}", skor);

    // Shadowing: membuat variabel baru dengan nama sama (tipenya boleh berbeda)
    let spasi = "   "; // tipe &str (teks)
    let spasi = spasi.len(); // tipe usize (angka): jumlah byte teks tadi
    println!("Jumlah spasi (hasil shadowing jadi angka): {}", spasi);
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
          'Rust adalah bahasa statically typed — tipe data setiap variabel ditentukan saat kompilasi, walau sering tidak perlu ditulis eksplisit karena compiler bisa menebaknya (type inference) dari nilai yang diberikan. Kalau tidak ada petunjuk lain, compiler memilih `i32` untuk bilangan bulat dan `f64` untuk bilangan desimal.',
          '## Integer',
          'Tipe integer paling umum adalah `i32` (bilangan bulat 32-bit bertanda), ada juga `i8`, `i16`, `i64`, serta versi unsigned (`u8`, `u32`, `u64`, dst) untuk bilangan bulat tanpa tanda negatif. Awalan `i` berarti signed (bisa negatif), awalan `u` berarti unsigned, dan angkanya adalah jumlah bit. Jadi `u8` menyimpan 0 sampai 255, sedangkan `i8` menyimpan -128 sampai 127. Mengisi tipe unsigned dengan nilai negatif, misal `let x: u32 = -1;`, ditolak compiler.',
          'Angka panjang boleh dipisah dengan underscore supaya mudah dibaca (`1_000_000`), dan tipenya bisa ditulis sebagai akhiran literal (`42u8`, `7i64`) sebagai ganti anotasi `: tipe`.',
          '## Floating point, bool, dan char',
          'Tipe `f64` dipakai untuk bilangan desimal (floating point) dengan presisi tinggi (ada juga `f32` yang lebih hemat memori tapi kurang presisi), `bool` untuk nilai benar/salah (`true`/`false`), dan `char` untuk satu karakter Unicode, ditulis dengan kutip tunggal seperti `\'A\'`.',
          'Berbeda dari string biasa, `char` di Rust selalu tepat satu karakter dan ditulis dengan kutip tunggal — kutip ganda (`"..."`) dipakai untuk string literal (`&str`), bukan `char`. Satu `char` menyimpan satu Unicode scalar value (4 byte), bukan 1 byte seperti `char` di C, sehingga `\'é\'` atau `\'日\'` juga valid.',
          '## Anotasi tipe dan inference',
          '```rust\nlet a = 42; // tanpa anotasi: i32\nlet b = 3.14; // tanpa anotasi: f64\nlet c: u8 = 255; // tipe ditulis eksplisit\nlet d = 1_000_000i64; // underscore + akhiran tipe\nlet e: bool = false;\nlet f: char = \'R\';\n```',
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

    // Tanpa anotasi tipe, compiler memilih i32 dan f64
    let otomatis_bulat = 7;
    let otomatis_desimal = 2.5;
    println!("Tanpa anotasi: {} dan {}", otomatis_bulat, otomatis_desimal);

    // Tipe lain ditulis eksplisit; underscore memudahkan membaca angka besar
    let kecil: u8 = 255;
    let besar = 1_000_000i64;
    println!("u8 terbesar: {}, i64: {}", kecil, besar);

    // char menyimpan satu karakter Unicode, bukan hanya ASCII
    let huruf_lain: char = 'é';
    println!("Char Unicode: {}", huruf_lain);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe apa yang dipilih compiler untuk let x = 42; kalau tidak ada anotasi tipe?', [
            ['i32', true],
            ['i64, karena mengikuti ukuran CPU modern', false],
            ['u32, karena 42 bukan bilangan negatif', false],
            ['Tidak bisa dikompilasi sebelum tipenya ditulis eksplisit', false],
          ]),
          q('Mana yang merupakan literal char yang valid di Rust?', [
            ["'R'", true],
            ['"R"', false],
            ["'Rust'", false],
            ['R', false],
          ]),
          q('Apa yang terjadi pada let x: u32 = -1;?', [
            ['Gagal kompilasi, karena tipe unsigned tidak bisa menyimpan nilai negatif', true],
            ['Dikompilasi dan nilainya menjadi 4294967295 (wrap-around seperti di C)', false],
            ['Dikompilasi, tapi program panic saat baris itu dijalankan', false],
            ['Dikompilasi dan tipenya otomatis berubah menjadi i32', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'rustfz-operator',
        content: [
          'Operator aritmatika di Rust mirip bahasa C-style pada umumnya: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (remainder). Penting dicatat: pembagian antar integer (`i32 / i32`) menghasilkan integer juga, bukan otomatis jadi desimal — hasilnya dipotong ke arah nol (truncate toward zero), jadi `7 / 2` adalah `3` dan `-7 / 2` adalah `-3` (bukan `-4`). Sisa baginya mengikuti tanda bilangan yang dibagi, jadi `-7 % 2` adalah `-1`.',
          '```rust\nprintln!("{}", 7 / 2); // 3\nprintln!("{}", -7 / 2); // -3 (dipotong ke arah nol, bukan ke bawah)\nprintln!("{}", -7 % 2); // -1\n```',
          'Operator perbandingan (`==`, `!=`, `>`, `<`, `>=`, `<=`) selalu menghasilkan tipe `bool`. Operator logika `&&` (dan), `||` (atau), `!` (negasi) dipakai untuk menggabungkan kondisi boolean.',
          'Rust sangat ketat soal tipe data — mencoba menjumlahkan `i32` dengan `f64` langsung tanpa konversi eksplisit akan ditolak compiler, berbeda dari beberapa bahasa lain yang otomatis melakukan konversi tipe (implicit casting).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn main() {
    let a = 10;
    let b = 3;

    println!("Penjumlahan: {}", a + b);
    println!("Pembagian integer (dipotong ke arah nol): {}", a / b);
    println!("Sisa bagi: {}", a % b);

    // Bilangan negatif: dipotong ke arah nol, bukan dibulatkan ke bawah
    let negatif = -7;
    println!("-7 / 2 = {} (bukan -4)", negatif / 2);
    println!("-7 % 2 = {} (tanda mengikuti bilangan yang dibagi)", negatif % 2);

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
          'Array menyimpan sekumpulan nilai dengan tipe data yang sama dan panjang tetap (fixed-length, tidak bisa ditambah/dikurangi setelah dibuat), ditulis dengan kurung siku: `let angka = [1, 2, 3, 4, 5];`. Akses elemen array pakai index seperti kebanyakan bahasa lain: `angka[0]`. Walau dideklarasikan `let mut`, panjang array tetap sama — `mut` hanya mengizinkan mengubah isi elemennya, misal `angka[0] = 10;`.',
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
          q('Apa yang dipakai kalau butuh koleksi yang ukurannya bisa berubah-ubah?', [
            ['Vec<T> (vector)', true],
            ['Array yang dideklarasikan dengan let mut, lalu menambah elemen lewat .push()', false],
            ['Tuple, lalu menambah elemen baru lewat titik.3 = nilai', false],
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
    title: 'Fungsi, Ownership & Struct',
    lessons: [
      {
        title: 'Fungsi & Parameter',
        slug: 'rustfz-fungsi-parameter',
        content: [
          'Fungsi di Rust didefinisikan dengan kata kunci `fn`, diikuti nama fungsi, parameter dalam kurung (tiap parameter wajib ditulis beserta tipe datanya), dan — kalau fungsi itu mengembalikan nilai — tipe nilai kembalian setelah tanda panah `->`. Fungsi yang tidak mengembalikan apa-apa boleh tidak punya `->`; tipe kembaliannya otomatis `()` (disebut unit, artinya "tidak ada nilai berarti").',
          'Baris terakhir dalam sebuah fungsi tanpa titik koma di akhirnya otomatis menjadi nilai kembalian (implicit return) — bisa juga memakai kata kunci `return` eksplisit untuk keluar lebih awal dari fungsi.',
          'Hati-hati dengan titik koma: kalau baris terakhir diberi `;`, ia menjadi statement biasa sehingga fungsi mengembalikan `()`, dan compiler menolaknya kalau signature menjanjikan tipe lain. Kode berikut sengaja salah dan gagal dikompilasi dengan `error[E0308]: mismatched types`:',
          '```rust\nfn tambah(a: i32, b: i32) -> i32 {\n    a + b; // titik koma ini membuat fungsi mengembalikan (), bukan i32\n}\n```',
          'Berbeda dari variabel biasa yang bisa memakai type inference, signature fungsi tidak pernah ditebak compiler dari isi fungsinya: tipe tiap parameter wajib ditulis, dan tipe kembalian wajib ditulis kalau fungsi mengembalikan nilai (tanpa `->` berarti `()`). Ini membantu compiler dan pembaca kode memahami kontrak fungsi tanpa harus melihat isinya.',
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
            ['Tidak wajib: compiler menebak tipe parameter dari nilai yang dikirim saat fungsi dipanggil', false],
            ['Jumlah maksimal parameter', false],
          ]),
          q('Fungsi fn tambah(a: i32, b: i32) -> i32 { a + b; } gagal dikompilasi. Apa penyebabnya?', [
            ['Titik koma setelah a + b membuat fungsi mengembalikan (), bukan i32', true],
            ['Rust mewajibkan kata kunci return di setiap fungsi yang punya tipe kembalian', false],
            ['Dua parameter i32 tidak boleh dijumlahkan di dalam fungsi', false],
            ['Tipe i32 tidak bisa dipakai sebagai tipe nilai kembalian', false],
          ]),
        ],
      },
      {
        title: 'Ownership Dasar',
        slug: 'rustfz-ownership-dasar',
        content: [
          'Ownership adalah konsep paling fundamental (dan paling unik) di Rust. Compiler memeriksa tiga aturan ini saat kompilasi:',
          '- Setiap nilai di memori punya tepat satu variabel yang menjadi "pemiliknya" (owner) pada satu waktu.\n- Saat owner keluar dari scope (blok kode berakhir), Rust otomatis membersihkan memori nilai itu (di-drop), tanpa perlu garbage collector.\n- Memberikan nilai ke variabel atau fungsi lain bisa memindahkan owner-nya (move) atau menyalinnya (copy), tergantung tipe nilainya.',
          '## Move',
          'Untuk tipe yang datanya disimpan di heap seperti `String`, memindahkan (assign) nilai dari satu variabel ke variabel lain akan memindahkan kepemilikan (move), bukan menyalin data. Setelah dipindah, variabel lama tidak valid lagi dan compiler menolak kode yang tetap memakainya. Alasannya: `String` menyimpan pointer ke data di heap, dan kalau dua variabel sama-sama dianggap pemilik, keduanya akan mencoba membebaskan memori yang sama saat keluar scope (bug double free di C/C++). Kode berikut sengaja gagal dikompilasi:',
          '```rust\nlet s1 = String::from("Rust");\nlet s2 = s1; // kepemilikan pindah dari s1 ke s2\nprintln!("{}", s1); // error[E0382]: borrow of moved value: `s1`\n```',
          'Hal yang sama terjadi saat sebuah `String` dikirim sebagai argumen fungsi: parameter fungsi menjadi owner baru, sehingga variabel asli tidak bisa dipakai lagi setelah pemanggilan. Cara agar variabel asli tetap valid, yaitu meminjam lewat reference, dibahas di lesson Borrowing.',
          '## Copy dan clone',
          'Tipe sederhana yang ukurannya tetap dan disimpan di stack, seperti `i32`, `f64`, `bool`, dan `char`, otomatis di-copy (bukan move) saat di-assign, karena menyalinnya sangat murah, jadi kedua variabel tetap valid. Kalau kamu memang ingin dua `String` terpisah, panggil `.clone()` untuk menyalin datanya di heap secara eksplisit — lebih mahal, jadi dilakukan dengan sadar, bukan otomatis.',
          '```rust\nlet a = 5;\nlet b = a; // i32 di-copy, a tetap valid\n\nlet s1 = String::from("Rust");\nlet s2 = s1.clone(); // salinan terpisah, s1 tetap valid\nprintln!("{} {} {} {}", a, b, s1, s2);\n```',
          'Aturan ownership ini terdengar rumit di awal, tapi tujuannya sederhana: mencegah dua bagian kode berbeda sama-sama mengira mereka "memiliki" dan berhak menghapus data yang sama, yang di bahasa lain sering menyebabkan bug memori serius.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Berapa banyak owner yang boleh dimiliki sebuah nilai di Rust pada satu waktu?', [
            ['Tepat satu', true],
            ['Sebanyak variabel yang menyimpan nilainya, semuanya setara', false],
            ['Dua: owner asli dan satu salinan cadangan', false],
            ['Tidak ada konsep owner, memori dikelola garbage collector', false],
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
          q('Apa yang terjadi pada kode ini? let s1 = String::from("Rust"); let s2 = s1; println!("{}", s1);', [
            ['Gagal dikompilasi karena s1 sudah dipindah (move) ke s2', true],
            ['Mencetak Rust, karena s2 hanyalah salinan dari s1', false],
            ['Dikompilasi, tapi program panic saat baris println! dijalankan', false],
            ['Mencetak teks kosong, karena isi s1 dikosongkan saat dipindah', false],
          ]),
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn ambil_alih(teks: String) {
    println!("Fungsi ambil_alih menerima: {}", teks);
} // teks keluar scope di sini dan memorinya dibersihkan

fn main() {
    // Tipe sederhana (stack) otomatis di-copy, bukan move
    let a = 5;
    let b = a;
    println!("a = {}, b = {} (keduanya masih valid)", a, b);

    // String (heap): assign langsung = MOVE. Kepemilikan pindah dari s1 ke s2.
    let s1 = String::from("Rust");
    let s2 = s1;
    println!("s2 = {} (s1 sudah dipindah ke s2)", s2);

    // Baris di bawah GAGAL dikompilasi karena s1 sudah dipindah.
    // Hapus tanda // di depannya untuk melihat error-nya:
    // println!("s1 = {}", s1);
    // error[E0382]: borrow of moved value: \`s1\`

    // clone() menyalin data di heap: s2 tetap valid dan s3 jadi String terpisah
    let s3 = s2.clone();
    println!("s2 = {}, s3 = {} (dua String terpisah lewat clone)", s2, s3);

    // Mengirim String ke fungsi juga memindahkan kepemilikannya
    ambil_alih(s3);
    // println!("{}", s3); // error[E0382]: borrow of moved value: \`s3\`
}
`,
      },
      {
        title: 'String vs &str & Slice',
        slug: 'rustfz-string-vs-str-slice',
        content: [
          'Rust punya dua tipe string utama yang sering membingungkan pemula. `&str` (dibaca "string slice") adalah teks pinjaman: string literal seperti `"halo"` bertipe `&str`, tersimpan di dalam binary program, dan tidak bisa diubah. `String` adalah teks milik sendiri (owned): datanya disimpan di heap, boleh tumbuh, dan boleh diubah kalau variabelnya `mut`. Tanda `&` pada `&str` artinya reference (pinjaman), yang dibahas lengkap di lesson Borrowing berikutnya.',
          '```rust\nlet literal = "halo"; // &str\nlet mut milik_sendiri = String::from("halo"); // String\nmilik_sendiri.push_str(" dunia"); // menambah teks di akhir\nlet lain = "kopi".to_string(); // cara lain membuat String dari &str\nprintln!("{} {} {}", literal, milik_sendiri, lain);\n```',
          '`String` adalah pemilik datanya, jadi ia mengikuti aturan ownership di lesson sebelumnya: `let b = a;` memindahkannya. `&str` hanya menunjuk (pointer dan panjang) ke teks yang sudah ada, jadi menyalinnya murah dan ia di-copy seperti `i32`: setelah `let b = a;`, variabel `a` dan `b` sama-sama valid. Karena itu parameter fungsi yang hanya membaca teks sebaiknya bertipe `&str`: ia menerima literal (`sapa("Rust")`) maupun `&String` (`sapa(&judul)`, Rust otomatis memperlakukan `&String` sebagai `&str`), sedangkan parameter bertipe `&String` menolak literal.',
          '## Slice',
          'Slice adalah "jendela" ke sebagian data tanpa menyalinnya: `&s[mulai..akhir]` menghasilkan `&str` berisi karakter dari `mulai` sampai sebelum `akhir` (batas atas eksklusif, sama seperti `0..5` di perulangan `for`). Salah satu batas boleh dihilangkan: `&s[..5]`, `&s[6..]`, atau `&s[..]` untuk seluruh string. Array juga bisa di-slice dengan sintaks yang sama (`&angka[1..4]`). Hati-hati: index slice string adalah posisi byte, bukan karakter. `.len()` menghitung byte, jadi `"café".len()` adalah `5` karena `é` memakai 2 byte dalam UTF-8, sedangkan `.chars().count()` (menghitung per karakter) menghasilkan `4`. Memotong di tengah sebuah karakter multibyte membuat program panic.',
          '```rust\nlet s = String::from("hello world");\nlet hello = &s[0..5]; // "hello"\nlet world = &s[6..]; // "world"\nlet semua = &s[..]; // seluruh string\nprintln!("{} {} {}", hello, world, semua);\n\nlet kata = "café";\nprintln!("{} {}", kata.len(), kata.chars().count()); // 5 4\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn sapa(nama: &str) {
    println!("Halo, {}!", nama);
}

fn main() {
    // &str: string literal, tersimpan di binary program dan tidak bisa diubah
    let literal = "Rust";

    // String: milik sendiri, datanya di heap, bisa tumbuh (butuh let mut untuk diubah)
    let mut judul = String::from("Belajar ");
    judul.push_str(literal);
    println!("String: {}", judul);

    // Parameter &str menerima literal maupun &String
    sapa(literal);
    sapa(&judul);

    // &str disalin murah, bukan di-move: a tetap valid setelah let b = a
    let a = "halo";
    let b = a;
    println!("a = {}, b = {}", a, b);

    // Slice: potongan string lewat range byte (batas atas eksklusif)
    println!("Slice [0..7]: {}", &judul[0..7]);
    println!("Slice [8..]: {}", &judul[8..]);

    // len() menghitung byte, bukan karakter
    let kata = "café";
    println!("len() = {}, jumlah karakter = {}", kata.len(), kata.chars().count());

    // Slice juga berlaku untuk array
    let angka = [10, 20, 30, 40, 50];
    let tengah = &angka[1..4];
    println!("Slice array: mulai {}, panjang {}", tengah[0], tengah.len());
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama String dan &str di Rust?', [
            ['String memiliki datanya di heap dan bisa tumbuh, sedangkan &str hanya menunjuk ke teks yang sudah ada dan tidak bisa diubah', true],
            ['&str hanya untuk teks pendek dan String untuk teks panjang; selain ukuran, keduanya identik', false],
            ['String disimpan di stack dan otomatis di-copy, sedangkan &str disimpan di heap dan di-move', false],
            ['&str adalah tipe untuk satu karakter, sedangkan String untuk teks yang terdiri dari beberapa karakter', false],
          ]),
          q('Apa yang terjadi pada kode ini? let a = "halo"; let b = a; println!("{} {}", a, b);', [
            ['Dikompilasi dan mencetak halo halo, karena &str hanya disalin (copy), bukan dipindah', true],
            ['Gagal dikompilasi dengan borrow of moved value, sama seperti pada String', false],
            ['Dikompilasi, tapi a menjadi kosong karena isinya sudah dipindah ke b', false],
            ['Gagal dikompilasi karena variabel bertipe &str tidak boleh di-assign ke variabel lain', false],
          ]),
          q('Berapa nilai "café".len() di Rust?', [
            ['5, karena len() menghitung byte dan é memakai 2 byte', true],
            ['4, karena len() menghitung jumlah karakter', false],
            ['3, karena huruf beraksen tidak ikut dihitung', false],
            ['6, karena Rust menambahkan 1 byte null terminator di akhir seperti string C', false],
          ]),
        ],
      },
      {
        title: 'Borrowing & Reference',
        slug: 'rustfz-borrowing-reference',
        content: [
          'Borrowing memungkinkan sebuah fungsi "meminjam" akses ke suatu nilai tanpa memindahkan kepemilikannya (ownership) — dilakukan dengan memakai reference, ditandai tanda `&` di depan tipe data atau variabel, misal `&String` atau `&nama`. Untuk parameter yang hanya membaca teks, `&str` biasanya lebih fleksibel daripada `&String` (lihat lesson String vs &str); starter di bawah memakai `&String` supaya contoh reference-nya tetap sederhana.',
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
          '## Instance dan field',
          'Instance (object) dari struct dibuat dengan menyebut nama struct diikuti nilai tiap field dalam kurung kurawal, misal `let siswa1 = Siswa { nama: String::from("Budi"), umur: 20 };`. Akses field lewat notasi titik: `siswa1.nama`.',
          '```rust\nstruct Siswa {\n    nama: String,\n    umur: u32,\n}\n\nfn main() {\n    let mut siswa = Siswa {\n        nama: String::from("Budi"),\n        umur: 20,\n    };\n    println!("{} berumur {}", siswa.nama, siswa.umur);\n\n    siswa.umur = 21; // boleh, karena siswa dideklarasikan let mut\n    println!("Sekarang berumur {}", siswa.umur);\n}\n```',
          'Untuk mengubah sebuah field, seluruh instance harus dideklarasikan `let mut`. Rust tidak punya `mut` per field: kita tidak bisa membuat hanya sebagian field yang boleh diubah.',
          '## Method dan associated function',
          'Method (fungsi yang "menempel" pada struct) didefinisikan dalam blok `impl NamaStruct { ... }`, dengan parameter pertama biasanya `&self` — merujuk ke instance struct itu sendiri, mirip `self` di Python atau `this` di bahasa lain. Karena `&self` hanya meminjam instance, instance tetap bisa dipakai setelah method dipanggil.',
          'Blok `impl` juga bisa berisi associated function: fungsi tanpa parameter `self`, dipanggil lewat nama tipe dengan `::`, bukan lewat instance, misal `Siswa::baru("Siti", 22)`. Kamu sudah sering memakainya: `String::from(...)` adalah associated function milik `String`. Rust tidak punya kata kunci constructor; `baru` (atau `new`) hanyalah nama fungsi biasa yang dipakai sebagai konvensi. Lesson berikutnya membahas `Self`, method yang mengubah instance (`&mut self`), dan cara mencetak struct.',
          'Lanjutan dari definisi `Siswa` di atas, berisi satu associated function dan satu method:',
          '```rust\nimpl Siswa {\n    // associated function: tanpa self, dipanggil Siswa::baru(...)\n    fn baru(nama: &str, umur: u32) -> Siswa {\n        Siswa {\n            nama: String::from(nama),\n            umur, // shorthand untuk umur: umur\n        }\n    }\n\n    // method: parameter pertama &self, dipanggil siswa.perkenalan()\n    fn perkenalan(&self) {\n        println!("Halo, saya {}", self.nama);\n    }\n}\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `struct Siswa {
    nama: String,
    umur: u32,
}

impl Siswa {
    // Associated function (tanpa self): dipanggil dengan Siswa::baru(...)
    fn baru(nama: &str, umur: u32) -> Siswa {
        Siswa {
            nama: String::from(nama),
            umur, // shorthand untuk umur: umur
        }
    }

    // Method (parameter pertama &self): dipanggil dengan siswa.perkenalan()
    fn perkenalan(&self) {
        println!("Halo, saya {}, umur {} tahun", self.nama, self.umur);
    }
}

fn main() {
    let siswa1 = Siswa {
        nama: String::from("Budi"),
        umur: 20,
    };
    let mut siswa2 = Siswa::baru("Siti", 22);

    siswa1.perkenalan();
    siswa2.perkenalan();

    // Mengubah field butuh instance yang dideklarasikan let mut
    siswa2.umur = 23;
    siswa2.perkenalan();
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dibutuhkan agar field umur milik sebuah instance Siswa bisa diubah setelah dibuat?', [
            ['Instance-nya dideklarasikan dengan let mut', true],
            ['Field-nya ditulis mut umur: u32 di definisi struct', false],
            ['Struct-nya ditulis mut struct Siswa', false],
            ['Tidak bisa: field struct selalu immutable setelah instance dibuat', false],
          ]),
          q('Apa arti &self sebagai parameter pertama sebuah method?', [
            ['Method meminjam instance yang memanggilnya, tanpa mengambil kepemilikan', true],
            ['Method mengambil alih kepemilikan instance, jadi instance tidak bisa dipakai lagi setelahnya', false],
            ['Instance disalin ke method, jadi perubahan field tidak pernah terlihat di luar method', false],
            ['Method menjadi milik tipe, bukan milik instance, jadi tidak boleh membaca field', false],
          ]),
          q('Bagaimana cara memanggil associated function baru milik struct Siswa?', [
            ['Siswa::baru("Siti", 22)', true],
            ['siswa1.baru("Siti", 22)', false],
            ['Siswa.baru("Siti", 22)', false],
            ['new Siswa("Siti", 22)', false],
          ]),
        ],
      },
      {
        title: 'impl, #[derive(Debug)] & if let',
        slug: 'rustfz-impl-derive-iflet',
        content: [
          'Blok `impl` bisa berisi dua jenis fungsi. Method punya `self` sebagai parameter pertama dan dipanggil lewat instance (`siswa.perkenalan()`): `&self` untuk membaca, `&mut self` untuk mengubah field (instance-nya harus dideklarasikan `let mut`). Associated function tidak punya `self` dan dipanggil lewat nama tipe dengan `::` (`Siswa::baru(...)`), seperti `String::from`. Di dalam `impl`, `Self` adalah nama lain untuk tipe yang sedang didefinisikan, jadi `-> Self` sama dengan `-> Siswa`.',
          '```rust\nstruct Siswa {\n    nama: String,\n    umur: u32,\n}\n\nimpl Siswa {\n    // associated function: Self = Siswa\n    fn baru(nama: &str, umur: u32) -> Self {\n        Self { nama: String::from(nama), umur }\n    }\n\n    // method &mut self: boleh mengubah field\n    fn ulang_tahun(&mut self) {\n        self.umur += 1;\n    }\n}\n\nfn main() {\n    let mut siswa = Siswa::baru("Budi", 20);\n    siswa.ulang_tahun();\n    println!("{} sekarang {} tahun", siswa.nama, siswa.umur);\n}\n```',
          'Struct buatan sendiri tidak otomatis bisa dicetak dengan `println!`. Format Debug `{:?}` hanya tersedia kalau struct diberi atribut `#[derive(Debug)]` di atas definisinya, yang membuat compiler menghasilkan kodenya otomatis. `{:?}` mencetak dalam satu baris, sedangkan `{:#?}` mencetak rapi berbaris-baris (pretty print), berguna untuk struct yang besar. Tanpa `derive`, `println!("{:?}", siswa)` gagal dikompilasi karena `Siswa` tidak mengimplementasikan `Debug`. Placeholder biasa `{}` (format Display) tidak bisa diturunkan otomatis, harus ditulis sendiri, jadi untuk memeriksa isi struct saat belajar pakai `{:?}`.',
          '```rust\n#[derive(Debug)]\nstruct Titik {\n    x: i32,\n    y: i32,\n}\n\nfn main() {\n    let t = Titik { x: 3, y: -1 };\n    println!("{:?}", t); // Titik { x: 3, y: -1 }\n    println!("{:#?}", t); // versi berbaris-baris\n}\n```',
          'Kadang `match` terasa bertele-tele karena kita hanya peduli pada satu pola. `if let` adalah singkatannya: `if let Pola = nilai { ... } else { ... }` menjalankan blok pertama kalau nilai cocok dengan pola (sambil mengikat variabel dari dalam pola), dan blok `else` kalau tidak cocok. Pemakaian paling umum adalah dengan `Option<T>`, tipe untuk nilai yang bisa ada atau kosong yang dibahas lengkap di modul berikutnya: `Some(isi)` berarti ada nilai dan `None` berarti kosong. Bedanya dengan `match`, `if let` tidak memaksa semua kemungkinan ditangani.',
          '```rust\nlet nilai_ujian: Option<u32> = Some(85);\n\n// dengan match: wajib menangani semua kemungkinan\nmatch nilai_ujian {\n    Some(nilai) => println!("Nilai: {}", nilai),\n    None => println!("Belum ujian"),\n}\n\n// dengan if let: lebih ringkas untuk satu pola\nif let Some(nilai) = nilai_ujian {\n    println!("Nilai: {}", nilai);\n} else {\n    println!("Belum ujian");\n}\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#[derive(Debug)]
struct Siswa {
    nama: String,
    umur: u32,
    nilai_ujian: Option<u32>, // None = belum ujian
}

impl Siswa {
    // Associated function (tanpa self): Self = tipe Siswa
    fn baru(nama: &str, umur: u32) -> Self {
        Self {
            nama: String::from(nama),
            umur,
            nilai_ujian: None,
        }
    }

    // Method dengan &self: hanya membaca
    fn perkenalan(&self) {
        println!("Halo, saya {}, umur {} tahun", self.nama, self.umur);
    }

    // Method dengan &mut self: boleh mengubah field
    fn catat_nilai(&mut self, nilai: u32) {
        self.nilai_ujian = Some(nilai);
    }

    fn laporkan_nilai(&self) {
        if let Some(nilai) = self.nilai_ujian {
            println!("{} mendapat nilai {}", self.nama, nilai);
        } else {
            println!("{} belum ujian", self.nama);
        }
    }
}

fn main() {
    let mut siswa = Siswa::baru("Budi", 20);
    siswa.perkenalan();
    siswa.laporkan_nilai();

    siswa.catat_nilai(85);
    siswa.laporkan_nilai();

    // {:?} dan {:#?} butuh #[derive(Debug)] di atas struct
    println!("{:?}", siswa);
    println!("{:#?}", siswa);
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan associated function dan method di dalam blok impl?', [
            ['Associated function tidak punya self dan dipanggil lewat Tipe::nama(), sedangkan method punya self dan dipanggil lewat instance.nama()', true],
            ['Associated function khusus untuk membuat instance baru, sedangkan method khusus untuk menghapus instance', false],
            ['Associated function hanya boleh membaca field, sedangkan method boleh mengubah field', false],
            ['Keduanya sama; hanya cara menulis pemanggilannya yang berbeda, :: atau titik', false],
          ]),
          q('Apa yang terjadi kalau sebuah struct tanpa #[derive(Debug)] dicetak dengan println!("{:?}", siswa)?', [
            ['Gagal dikompilasi, karena struct itu tidak mengimplementasikan Debug', true],
            ['Dikompilasi dan mencetak alamat memori instance tersebut', false],
            ['Dikompilasi dan mencetak semua field otomatis, karena {:?} tidak butuh derive', false],
            ['Dikompilasi, tapi program panic saat baris itu dijalankan', false],
          ]),
          q('Kapan if let lebih cocok dipakai daripada match?', [
            ['Saat hanya peduli pada satu pola (misal Some) dan sisanya cukup ditangani di else atau diabaikan', true],
            ['Saat ingin compiler memastikan semua variant enum sudah ditangani', false],
            ['Saat nilainya bukan enum, karena match hanya bisa dipakai untuk enum', false],
            ['Saat butuh program yang lebih cepat, karena if let selalu lebih cepat dari match', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Enum, Error Handling & Ringkasan',
    lessons: [
      {
        title: 'Enum Dasar',
        slug: 'rustfz-enum-dasar',
        content: [
          'Enum (enumeration) mendefinisikan sebuah tipe data yang nilainya harus salah satu dari beberapa kemungkinan (variant) yang sudah ditentukan, ditulis dengan kata kunci `enum`, misal `enum Arah { Utara, Selatan, Timur, Barat }`.',
          'Enum di Rust jauh lebih kuat dari sekadar daftar konstanta — tiap variant bisa menyimpan data tambahan dengan tipe berbeda-beda, misal `enum Bentuk { Lingkaran(f64), Persegi(f64, f64) }`, di mana `Lingkaran` menyimpan radius dan `Persegi` menyimpan panjang & lebar.',
          'Kombinasi enum dengan `match` sangat umum dipakai di Rust — `match` memaksa semua variant enum ditangani, sehingga compiler akan mengingatkan kalau ada satu variant yang lupa ditangani, mengurangi bug akibat kasus yang terlewat.',
          'Di starter, `&\'static str` pada tipe kembalian berarti teks literal yang tersimpan selama program berjalan; pembahasan lengkap tentang `&str` ada di lesson String vs &str. Starter juga memakai setiap variant minimal sekali: variant yang tidak pernah dibuat memunculkan warning `dead_code` dari compiler.',
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

// Variant enum bisa menyimpan data dengan tipe berbeda-beda
enum Bentuk {
    Lingkaran(f64),    // menyimpan radius
    Persegi(f64, f64), // menyimpan panjang dan lebar
}

fn luas(bentuk: Bentuk) -> f64 {
    match bentuk {
        Bentuk::Lingkaran(radius) => 3.14 * radius * radius,
        Bentuk::Persegi(panjang, lebar) => panjang * lebar,
    }
}

fn main() {
    println!("Utara: {}", deskripsi_arah(Arah::Utara));
    println!("Selatan: {}", deskripsi_arah(Arah::Selatan));
    println!("Timur: {}", deskripsi_arah(Arah::Timur));
    println!("Barat: {}", deskripsi_arah(Arah::Barat));

    println!("Luas lingkaran (radius 2.0): {}", luas(Bentuk::Lingkaran(2.0)));
    println!("Luas persegi (3.0 x 4.0): {}", luas(Bentuk::Persegi(3.0, 4.0)));
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
          '## Membuat dan menangani Option',
          '```rust\nfn bagi(a: i32, b: i32) -> Option<i32> {\n    if b == 0 {\n        None // pembagian dengan nol: tidak ada hasil\n    } else {\n        Some(a / b)\n    }\n}\n\nfn main() {\n    match bagi(10, 2) {\n        Some(hasil) => println!("Hasil: {}", hasil),\n        None => println!("Tidak bisa dibagi"),\n    }\n}\n```',
          'Karena `Option<T>` adalah tipe yang berbeda dari `T` biasa, compiler memaksa programmer menangani kedua kemungkinan (`Some` dan `None`) secara eksplisit sebelum bisa memakai nilai di dalamnya — biasanya lewat `match`, lewat `if let` kalau hanya peduli pada `Some`, atau lewat method seperti `.unwrap_or()` yang menyediakan nilai fallback. Kode berikut sengaja gagal dikompilasi, karena `i32` tidak bisa langsung dijumlahkan dengan `Option<i32>`:',
          '```rust\nlet x: i32 = 5;\nlet y: Option<i32> = Some(5);\nlet jumlah = x + y; // error[E0277]: cannot add `std::option::Option<i32>` to `i32`\n```',
          'Pendekatan ini memindahkan pengecekan "apakah nilai ini ada?" dari yang tadinya bisa lolos tanpa disadari (dan crash saat runtime di bahasa lain), menjadi wajib ditangani saat kompilasi di Rust.',
          '`Option<T>` cocok untuk "nilai mungkin tidak ada". Kalau sebuah operasi bisa gagal dan kita ingin tahu penyebabnya, Rust punya `Result<T, E>` dengan variant `Ok(nilai)` dan `Err(error)`, yang dibahas di lesson berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn bagi(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None // pembagian dengan nol: tidak ada hasil
    } else {
        Some(a / b)
    }
}

fn main() {
    // match: tangani Some dan None
    match bagi(10, 2) {
        Some(hasil) => println!("10 / 2 = {}", hasil),
        None => println!("10 / 2 tidak bisa dihitung"),
    }
    match bagi(10, 0) {
        Some(hasil) => println!("10 / 0 = {}", hasil),
        None => println!("10 / 0 tidak bisa dihitung"),
    }

    // if let: kalau hanya peduli pada Some
    if let Some(hasil) = bagi(9, 3) {
        println!("if let: 9 / 3 = {}", hasil);
    }

    // unwrap_or: nilai cadangan kalau hasilnya None
    let aman = bagi(5, 0).unwrap_or(-1);
    println!("unwrap_or: {}", aman);

    // Option<i32> bukan i32. Baris yang di-comment di bawah GAGAL dikompilasi
    // kalau tanda // dihapus:
    let x: i32 = 5;
    let y: Option<i32> = Some(5);
    // let jumlah = x + y;
    // error[E0277]: cannot add \`std::option::Option<i32>\` to \`i32\`
    if let Some(isi) = y {
        println!("Isi y dibuka dulu baru dijumlahkan: {}", x + isi);
    }
}
`,
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
            ['Ok(nilai) dan Err(error)', false],
            ['Yes dan No', false],
          ]),
          q('Kenapa pendekatan Option<T> mengurangi bug dibanding null tradisional?', [
            ['Compiler memaksa kedua kemungkinan ditangani sebelum nilai dipakai', true],
            ['Option<T> otomatis mengisi nilai default tanpa pengecekan', false],
            ['Option<T> hanya dekorasi tanpa efek nyata', false],
            ['Option<T> membuat program berjalan lebih lambat tanpa manfaat', false],
          ]),
          q('Apa yang terjadi kalau sebuah i32 langsung dijumlahkan dengan Option<i32>?', [
            ['Gagal dikompilasi, karena i32 dan Option<i32> adalah tipe yang berbeda', true],
            ['Hasilnya otomatis dibungkus menjadi Some(jumlah)', false],
            ['Option<i32> otomatis dibuka, jadi hasilnya i32 biasa', false],
            ['Dikompilasi, tapi program panic saat runtime kalau isinya None', false],
          ]),
        ],
      },
      {
        title: 'Result<T, E> & Error Handling',
        slug: 'rustfz-result-error-handling',
        content: [
          'Di lesson sebelumnya `Option<T>` dipakai untuk nilai yang mungkin tidak ada. Untuk operasi yang bisa gagal dan kita ingin tahu penyebabnya, Rust punya enum `Result<T, E>` dengan dua variant: `Ok(nilai)` untuk berhasil (membawa hasil bertipe `T`) dan `Err(error)` untuk gagal (membawa penyebab bertipe `E`). Rust tidak punya exception dan `try/catch`: error adalah nilai biasa yang dikembalikan fungsi, sehingga compiler memaksa kita menanganinya. Sementara `panic!` dipakai untuk bug yang tidak bisa dipulihkan: program langsung berhenti.',
          '```rust\nfn main() {\n    // parse mengubah teks jadi angka; ::<i32> memberi tahu tipe hasil yang diinginkan\n    match "42".parse::<i32>() {\n        Ok(angka) => println!("Berhasil: {}", angka),\n        Err(e) => println!("Gagal: {}", e),\n    }\n    match "abc".parse::<i32>() {\n        Ok(angka) => println!("Berhasil: {}", angka),\n        Err(e) => println!("Gagal: {}", e), // invalid digit found in string\n    }\n}\n```',
          'Fungsi buatan sendiri juga bisa mengembalikan `Result`. Bandingkan dengan versi `Option` di lesson sebelumnya: `Option` hanya bisa bilang "tidak ada hasil" (`None`), sedangkan `Result` bisa menjelaskan kenapa gagal lewat `Err`. Di contoh ini tipe error-nya `String`, jadi tipe kembaliannya `Result<i32, String>`.',
          '```rust\nfn bagi(a: i32, b: i32) -> Result<i32, String> {\n    if b == 0 {\n        Err(String::from("tidak bisa membagi dengan nol"))\n    } else {\n        Ok(a / b)\n    }\n}\n\nfn main() {\n    println!("{:?}", bagi(10, 2)); // Ok(5)\n    println!("{:?}", bagi(10, 0)); // Err("tidak bisa membagi dengan nol")\n}\n```',
          'Selain `match`, ada beberapa jalan pintas. `.unwrap()` mengambil nilai di dalam `Ok`, tapi kalau hasilnya `Err` program langsung panic. `.expect("pesan")` sama seperti `unwrap` dengan pesan panic buatan sendiri, dan `.unwrap_or(nilai)` mengembalikan nilai cadangan kalau hasilnya `Err`. `unwrap` dan `expect` cocok untuk percobaan cepat atau kasus yang pasti berhasil, tapi di program sungguhan lebih aman memakai `match` atau `unwrap_or`. Terakhir, operator `?` di belakang sebuah `Result` bekerja begini: kalau `Ok`, ia mengambil nilainya; kalau `Err`, fungsi yang sedang berjalan langsung `return Err(...)` ke pemanggilnya. Operator ini hanya bisa dipakai di dalam fungsi yang tipe kembaliannya juga `Result`.',
          '```rust\nfn jumlahkan_teks(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    let x = a.parse::<i32>()?; // kalau Err, langsung return Err\n    let y = b.parse::<i32>()?;\n    Ok(x + y)\n}\n\nfn main() {\n    println!("{:?}", jumlahkan_teks("20", "22")); // Ok(42)\n    println!("{:?}", jumlahkan_teks("20", "dua")); // Err(ParseIntError { kind: InvalidDigit })\n}\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `fn bagi(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("tidak bisa membagi dengan nol"))
    } else {
        Ok(a / b)
    }
}

fn jumlahkan_teks(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    Ok(x + y)
}

fn main() {
    // match pada Result: Ok membawa hasil, Err membawa penyebab gagal
    match bagi(10, 2) {
        Ok(hasil) => println!("10 / 2 = {}", hasil),
        Err(pesan) => println!("Error: {}", pesan),
    }
    match bagi(10, 0) {
        Ok(hasil) => println!("10 / 0 = {}", hasil),
        Err(pesan) => println!("Error: {}", pesan),
    }

    // parse: mengubah teks jadi angka bisa gagal
    match "abc".parse::<i32>() {
        Ok(angka) => println!("Angka: {}", angka),
        Err(e) => println!("Gagal parse: {}", e),
    }

    // unwrap_or: nilai cadangan kalau hasilnya Err
    let aman = "abc".parse::<i32>().unwrap_or(0);
    println!("unwrap_or: {}", aman);

    // expect: seperti unwrap, tapi dengan pesan panic buatan sendiri
    let pasti: i32 = "42".parse().expect("harus angka yang valid");
    println!("expect: {}", pasti);

    // Operator ?: kalau Err, fungsi langsung return Err itu ke pemanggilnya
    println!("{:?}", jumlahkan_teks("20", "22"));
    println!("{:?}", jumlahkan_teks("20", "dua"));
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan Option<T> dan Result<T, E>?', [
            ['Option hanya menandakan nilai ada atau tidak, sedangkan Result juga membawa penyebab kegagalan lewat Err', true],
            ['Option membawa pesan error, sedangkan Result hanya menandakan berhasil atau tidak', false],
            ['Result khusus untuk operasi file, sedangkan Option khusus untuk angka', false],
            ['Keduanya sama persis; hanya nama variant-nya yang berbeda', false],
          ]),
          q('Apa yang terjadi kalau .unwrap() dipanggil pada sebuah Err?', [
            ['Program panic dan berhenti dengan pesan error', true],
            ['Mengembalikan nilai default tipenya, misal 0 untuk i32', false],
            ['Mengembalikan None sehingga program lanjut berjalan', false],
            ['Err diabaikan dan program lanjut dengan nilai kosong', false],
          ]),
          q('Apa yang dilakukan operator ? pada a.parse::<i32>()? kalau hasilnya Err?', [
            ['Fungsi yang sedang berjalan langsung mengembalikan Err itu ke pemanggilnya', true],
            ['Program panic, sama seperti unwrap()', false],
            ['Err diganti nilai default 0 dan fungsi lanjut berjalan', false],
            ['Err diubah menjadi Ok(0) sehingga fungsi tetap berhasil', false],
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
          'Di starter, `{:?}` di dalam `println!` adalah format Debug yang sudah kamu kenal di lesson `#[derive(Debug)]`: ia mencetak seluruh isi vector, misal `[10, 20, 30]`. Placeholder biasa `{}` tidak bisa dipakai untuk `Vec` karena `Vec` tidak punya tampilan standar untuk ditampilkan ke pengguna. Format Debug tersedia otomatis untuk tipe bawaan seperti `Vec`, `Option`, dan angka, sedangkan struct buatan sendiri memerlukan atribut `#[derive(Debug)]`.',
          'Perhatikan juga `for nilai in &angka`: tanda `&` meminjam vector (seperti di lesson Borrowing) supaya `angka` tetap bisa dipakai setelah loop selesai.',
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
          'Sebagai penutup course ini, mari gabungkan semua konsep yang sudah dipelajari — struct dengan associated function, enum, `Option<T>`, vector, `match` dan `if let`, serta ownership sederhana — ke dalam satu program kecil yang merepresentasikan daftar tugas (to-do list) sederhana.',
          'Program di sandbox berikut mendefinisikan struct `Tugas` dengan field `nama` dan `status` (bertipe enum `StatusTugas`), membuat tiap tugas lewat associated function `Tugas::baru`, menyimpan beberapa tugas dalam `Vec<Tugas>`, lalu memakai `match` untuk menampilkan status tiap tugas dengan format yang berbeda. Method `.get(5)` pada vector mengembalikan `Option`, jadi index yang tidak ada ditangani dengan `if let ... else` alih-alih membuat program panic.',
          'Bagian akhir program menghitung tugas yang selesai lewat `.iter().filter(...).count()`: `.filter()` menyaring elemen yang memenuhi kondisi di dalam `|t| ...` (closure, fungsi mini tanpa nama; pembahasannya di luar cakupan course ini), lalu `.count()` menghitung elemen yang lolos.',
          'Sepanjang course "Rust from Zero" ini kita sudah belajar dari sintaks dasar, tipe data, kontrol alur, fungsi, konsep ownership & borrowing yang jadi ciri khas Rust, `String` vs `&str`, struct dengan `impl` dan `#[derive(Debug)]`, enum, hingga `Option` dan `Result` untuk menangani nilai kosong dan error — fondasi yang cukup untuk mulai membangun program Rust yang lebih kompleks dan aman dari bug memori.',
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
    // Associated function: membuat Tugas dari &str
    fn baru(nama: &str, status: StatusTugas) -> Tugas {
        Tugas {
            nama: String::from(nama),
            status,
        }
    }

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
        Tugas::baru("Belajar ownership", StatusTugas::Selesai),
        Tugas::baru("Belajar struct & enum", StatusTugas::Selesai),
        Tugas::baru("Bikin proyek Rust sendiri", StatusTugas::BelumSelesai),
    ];

    println!("Daftar Tugas Belajar Rust:");
    for tugas in &daftar_tugas {
        tugas.tampilkan();
    }

    // Vec::get mengembalikan Option, jadi index yang tidak ada tidak membuat program panic
    if let Some(tugas) = daftar_tugas.get(5) {
        tugas.tampilkan();
    } else {
        println!("Tugas ke-5 tidak ada");
    }

    let jumlah_selesai = daftar_tugas
        .iter()
        .filter(|t| match t.status {
            StatusTugas::Selesai => true,
            _ => false,
        })
        .count();
    println!("Tugas selesai: {} dari {}", jumlah_selesai, daftar_tugas.len());
}
`,
      },
    ],
  },
]

const course: CourseDef = {
  title: 'Rust from Zero',
  slug: 'rust-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'Rust from Zero adalah course pengantar untuk kamu yang belum pernah menulis Rust. Rust dikenal cepat sekaligus menjamin keamanan memori tanpa garbage collector, dan dipakai untuk sistem operasi, browser engine, sampai tools command-line. Course ini memperkenalkan Rust dari nol, jadi pengalaman programming di bahasa lain membantu tapi tidak wajib.',
    'Di sini kamu belajar struktur program dan Cargo, variabel dan mutability (immutable by default, shadowing), tipe data dasar, operator, tuple dan array, percabangan `if`, perulangan, `match`, fungsi, konsep ownership dan borrowing yang jadi ciri khas Rust, `String` vs `&str` dan slice, struct dengan `impl`, `#[derive(Debug)]`, dan `if let`, enum, `Option<T>`, `Result<T, E>` untuk error handling, dan `Vec<T>`, ditutup dengan studi kasus yang menggabungkan semuanya. Hampir semua lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan sebagian besar dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini menjalankan kode dengan Rust 1.40, tanpa akses jaringan dan tanpa input keyboard. Kode dikompilasi sebagai satu file, jadi Cargo dan crate pihak ketiga tidak bisa dicoba di sana, dan fitur yang lebih baru dari Rust 1.40 (misalnya macro `matches!` atau variabel langsung di dalam string `println!`) tidak dipakai. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun.',
  ].join('\n\n'),
  sandboxLanguage: 'rust',
  modules,
}

export default course
