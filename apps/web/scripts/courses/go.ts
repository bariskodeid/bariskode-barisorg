import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan Go',
    lessons: [
      {
        title: 'Apa itu Go?',
        slug: 'gofz-apa-itu-go',
        content: [
          'Go (sering disebut Golang) adalah bahasa pemrograman yang dibuat oleh Google, dirancang oleh Robert Griesemer, Rob Pike, dan Ken Thompson, lalu dirilis ke publik pada tahun 2009 (versi stabil pertamanya, Go 1.0, menyusul pada 2012).',
          'Go bersifat statically typed (tipe data dicek saat compile) dan compiled (kode diubah jadi binary native sebelum dijalankan) — kombinasi ini membuat program Go berjalan sangat cepat, mendekati performa C/C++.',
          'Go terkenal karena sintaksnya yang sengaja dibuat sederhana dan minimalis — sedikit kata kunci, tidak ada fitur rumit seperti inheritance class bertingkat, sehingga mudah dipelajari dan dibaca tim besar.',
          'Ciri khas lain Go adalah dukungan concurrency (proses paralel) bawaan lewat goroutine dan channel, garbage collector otomatis, serta kompilasi super cepat — alasan Go banyak dipakai untuk backend, cloud infrastructure (Docker, Kubernetes ditulis dengan Go), dan CLI tools.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Perusahaan mana yang menciptakan bahasa Go?', [
            ['Google', true],
            ['Facebook', false],
            ['Microsoft', false],
            ['Apple', false],
          ]),
          q('Tahun berapa Go pertama kali dirilis ke publik?', [
            ['2009', true],
            ['2012', false],
            ['2015', false],
            ['1995', false],
          ]),
          q('Apa yang membuat program Go berjalan cepat?', [
            ['Dikompilasi langsung menjadi binary native sebelum dijalankan', true],
            ['Dikompilasi ke bytecode yang dijalankan oleh virtual machine, seperti Java', false],
            ['Tidak memakai garbage collector, jadi memori dikelola manual seperti C', false],
            ['Kodenya dibaca baris demi baris oleh interpreter yang sudah dioptimasi', false],
          ]),
          q('Dua konsep yang jadi ciri khas dukungan concurrency Go adalah?', [
            ['Goroutine dan channel', true],
            ['Thread dan mutex manual saja', false],
            ['Callback dan promise', false],
            ['Fiber dan coroutine Python', false],
          ]),
        ],
      },
      {
        title: 'Struktur Program',
        slug: 'gofz-struktur-program',
        content: [
          'Setiap program Go dimulai dengan deklarasi `package`. Program yang bisa dieksekusi langsung (bukan library) wajib memakai `package main`, menandakan ini adalah entry point aplikasi.',
          'Statement `import` dipakai untuk memuat package lain yang dibutuhkan, misalnya `import "fmt"` untuk package bawaan `fmt` yang berisi fungsi cetak ke layar seperti `fmt.Println`. Go ketat soal ini: package yang di-import tapi tidak dipakai di kode adalah compile error (`imported and not used`), bukan sekadar peringatan, jadi hapus import yang tidak dibutuhkan.',
          'Fungsi `func main()` adalah titik masuk (entry point) program — saat program Go dijalankan, Go runtime otomatis memanggil fungsi `main` di dalam `package main`, mirip peran `main()` di C atau Java.',
          '## Kurung kurawal dan titik koma',
          'Blok kode di Go selalu dibungkus kurung kurawal `{}`, dan kurung kurawal pembuka wajib ada di baris yang sama dengan pernyataannya, misalnya `func main() {`. Ini aturan bahasa, bukan sekadar gaya penulisan. Compiler Go memakai titik koma (`;`) untuk mengakhiri statement, tapi lexer menyisipkannya otomatis di akhir setiap baris yang token terakhirnya adalah identifier, literal (angka atau string), kata kunci seperti `return`, `break`, dan `continue`, operator `++` atau `--`, atau salah satu dari `)`, `]`, `}`. Itu sebabnya kamu hampir tidak pernah menulis `;` sendiri.',
          'Akibatnya, kalau `{` ditaruh di baris baru, titik koma sudah terlanjur disisipkan setelah `func main()` dan compiler menolak kodenya. Contoh berikut sengaja salah dan tidak jalan di sandbox:',
          `\`\`\`go
func main()
{
	fmt.Println("Halo")
}
// syntax error: unexpected semicolon or newline before {
\`\`\``,
          '`gofmt`, formatter resmi Go, merapikan format kode yang sudah benar (misalnya indentasi dengan tab), tapi ia bukan penyebab aturan kurung kurawal ini.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	fmt.Println("Halo, Go!")
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kenapa kurung kurawal pembuka { wajib satu baris dengan func main() di Go?', [
            ['Lexer menyisipkan titik koma otomatis di akhir baris func main(), sehingga { di baris berikutnya jadi syntax error', true],
            ['gofmt menolak mengompilasi kode yang kurung kurawal pembukanya ada di baris baru', false],
            ['Fungsi main harus ditulis dalam satu baris supaya dikenali sebagai entry point', false],
            ['Go memakai indentasi seperti Python sehingga baris baru dianggap blok kode baru', false],
          ]),
          q('Apa yang terjadi kalau sebuah package di-import tapi tidak dipakai di kode?', [
            ['Compile error: imported and not used', true],
            ['Hanya muncul peringatan, program tetap bisa dijalankan', false],
            ['Package itu diam-diam diabaikan oleh compiler tanpa pesan apa pun', false],
            ['Program berjalan, tapi package itu tetap dimuat dan memperlambat startup', false],
          ]),
          q('Apakah setiap statement di Go wajib diakhiri titik koma (;) yang ditulis sendiri?', [
            ['Tidak, lexer menyisipkan titik koma otomatis di akhir baris dalam kondisi tertentu', true],
            ['Ya, sama seperti C dan Java, tanpa titik koma kodenya tidak bisa dikompilasi', false],
            ['Hanya wajib pada statement import dan package', false],
            ['Hanya wajib pada baris terakhir di dalam sebuah fungsi', false],
          ]),
        ],
      },
      {
        title: 'Menjalankan Program Go',
        slug: 'gofz-menjalankan-program-go',
        content: [
          'Perintah `go run nama_file.go` langsung mengompilasi lalu menjalankan program dalam satu langkah — paling praktis dipakai saat development karena hasilnya langsung terlihat tanpa file binary tersisa.',
          'Perintah `go build nama_file.go` hanya mengompilasi kode jadi file binary executable (mis. `nama_file` atau `nama_file.exe` di Windows) tanpa langsung menjalankannya — binary ini bisa didistribusikan dan dijalankan di komputer lain tanpa perlu Go terinstal.',
          'Karena Go adalah compiled language, error sintaks atau tipe data akan terdeteksi saat proses compile, sebelum program sempat dijalankan — berbeda dengan bahasa seperti Python, yang tidak memeriksa tipe data sebelum program jalan sehingga salah tipe baru ketahuan saat baris itu dieksekusi.',
          'Package bawaan `runtime` menyediakan fungsi seperti `runtime.Version()` untuk mengecek versi Go yang sedang dipakai — berguna untuk memastikan kompatibilitas kode dengan versi Go tertentu.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println("Program Go dijalankan!")
	fmt.Println("Versi Go yang dipakai:", runtime.Version())
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Perintah apa yang langsung mengompilasi lalu menjalankan program Go?', [
            ['go run', true],
            ['go install', false],
            ['go get', false],
            ['go test', false],
          ]),
          q('Perintah apa yang mengompilasi kode Go jadi file binary tanpa menjalankannya?', [
            ['go build', true],
            ['go run', false],
            ['go fmt', false],
            ['go vet', false],
          ]),
          q('Ekstensi file source code Go adalah?', [
            ['.go', true],
            ['.golang', false],
            ['.g', false],
            ['.gof', false],
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
        slug: 'gofz-variabel-tipe-data-dasar',
        content: [
          'Variabel di Go dideklarasikan dengan kata kunci `var`, diikuti nama variabel dan tipe datanya, contoh: `var umur int`. Go bersifat statically typed — tipe data harus jelas dan tidak berubah selama program berjalan.',
          'Tipe data dasar yang paling sering dipakai: `int` (bilangan bulat), `float64` (bilangan desimal presisi ganda), `string` (teks), dan `bool` (nilai benar/salah, `true`/`false`).',
          'Variabel yang dideklarasikan dengan `var` tapi belum diberi nilai otomatis mendapat zero value sesuai tipenya — `int` menjadi `0`, `float64` menjadi `0`, `string` menjadi string kosong `""`, dan `bool` menjadi `false`.',
          'Deklarasi variabel juga bisa langsung diisi nilai dalam satu baris: `var nama string = "Budi"` — Go bahkan bisa menebak tipe datanya otomatis dari nilai yang diberikan (dibahas di lesson berikutnya).',
          '## Variabel yang tidak dipakai',
          'Go menolak mengompilasi program yang punya variabel lokal (dideklarasikan di dalam fungsi) tapi tidak pernah dipakai. Pesannya `declared and not used`, dan ini compile error, bukan peringatan. Solusinya: pakai variabelnya atau hapus deklarasinya. Contoh berikut sengaja salah dan tidak jalan di sandbox:',
          `\`\`\`go
func main() {
	var umur int = 20
	// compile error: umur declared and not used
}
\`\`\``,
          '## Mencetak dengan Printf',
          '`fmt.Println` mencetak nilai apa adanya, dipisah spasi, lalu pindah baris. Untuk format yang lebih terkontrol, pakai `fmt.Printf`: string pertamanya berisi format verb yang diganti oleh argumen berikutnya sesuai urutan. `Printf` tidak menambah baris baru sendiri, jadi tulis `\\n` di akhir string. Format verb yang paling sering dipakai:',
          '- `%v` nilai dengan format default (cocok untuk tipe apa pun)\n- `%d` bilangan bulat\n- `%s` string\n- `%f` bilangan desimal; `%.2f` membatasi jadi 2 angka di belakang koma\n- `%t` bool (`true`/`false`)\n- `%T` tipe data dari nilainya',
          `\`\`\`go
var umur int = 20
fmt.Printf("%s berumur %d tahun\\n", "Budi", umur)
fmt.Printf("Tipe umur: %T\\n", umur)
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	var nama string = "Siswa BarisORG"
	var umur int = 20
	var tinggiBadan float64 = 165.5
	var sudahLulus bool = true

	fmt.Println(nama, umur, tinggiBadan, sudahLulus)

	// Printf: format verb diganti argumen sesuai urutan, \\n = baris baru
	fmt.Printf("%s berumur %d tahun\\n", nama, umur)
	fmt.Printf("Tinggi: %.1f cm, lulus: %t\\n", tinggiBadan, sudahLulus)
	fmt.Printf("Tipe umur: %T, tipe tinggiBadan: %T\\n", umur, tinggiBadan)

	// Zero value: variabel var tanpa nilai awal
	var kosongInt int
	var kosongString string
	fmt.Printf("Zero value int: %d, string: '%s'\\n", kosongInt, kosongString)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe data apa yang dipakai untuk bilangan desimal di Go?', [
            ['float64', true],
            ['int', false],
            ['string', false],
            ['bool', false],
          ]),
          q('Kata kunci apa untuk mendeklarasikan variabel di Go?', [
            ['var', true],
            ['let', false],
            ['dim', false],
            ['def', false],
          ]),
          q('Zero value untuk tipe bool yang belum diinisialisasi adalah?', [
            ['false', true],
            ['true', false],
            ['nil', false],
            ['0', false],
          ]),
          q('Apa yang terjadi kalau variabel lokal dideklarasikan di dalam fungsi tapi tidak pernah dipakai?', [
            ['Compile error: declared and not used', true],
            ['Hanya muncul peringatan, program tetap bisa dijalankan', false],
            ['Variabel itu diam-diam dihapus compiler tanpa pesan apa pun', false],
            ['Variabel diisi zero value dan program berjalan seperti biasa', false],
          ]),
          q('Apa yang tercetak oleh dua baris: fmt.Printf("Halo") lalu fmt.Printf("Dunia")?', [
            ['HaloDunia dalam satu baris, karena Printf tidak menambah baris baru sendiri', true],
            ['Halo dan Dunia di dua baris terpisah, seperti Println', false],
            ['Compile error, karena Printf wajib punya minimal satu format verb', false],
            ['Hanya Dunia, karena Printf kedua menimpa hasil yang pertama', false],
          ]),
          q('Format verb mana yang mencetak float64 dengan tepat 2 angka di belakang koma?', [
            ['%.2f', true],
            ['%2f', false],
            ['%d.2', false],
            ['%.2d', false],
          ]),
        ],
      },
      {
        title: 'Konstanta & Type Inference',
        slug: 'gofz-konstanta-type-inference',
        content: [
          'Konstanta dideklarasikan dengan kata kunci `const`, nilainya tidak bisa diubah setelah didefinisikan (mencoba mengubahnya adalah compile error) — cocok untuk nilai tetap seperti nama aplikasi atau nilai matematis yang tidak boleh berubah selama program berjalan.',
          'Operator `:=` (short variable declaration) memungkinkan deklarasi sekaligus inisialisasi variabel tanpa menulis kata kunci `var` dan tanpa menyebut tipe data secara eksplisit — Go akan menebak (infer) tipe data dari nilai di sisi kanan. Tipe hasil tebakan itu bisa dilihat dengan format verb `%T`, misalnya `fmt.Printf("%T", 30.5)` mencetak `float64`.',
          'Type inference dengan `:=` hanya bisa dipakai di dalam fungsi, bukan di level package (di sana pakai `var` atau `const`).',
          '## := dan variabel yang sudah ada',
          '`:=` tidak harus mendeklarasikan semua variabel di sisi kirinya sebagai variabel baru. Aturannya: minimal satu variabel di kiri harus baru (bukan `_`). Variabel lain yang sudah dideklarasikan di blok yang sama tidak dibuat ulang, hanya diberi nilai baru dengan tipe yang tetap. Inilah yang membuat pola `hasil, err := ...` bisa dipakai berulang kali dengan variabel `err` yang sama. Kalau semua variabel di kiri sudah ada, `:=` adalah compile error (`no new variables on left side of :=`) dan kamu harus memakai `=` biasa.',
          `\`\`\`go
x, y := 1, 2
y, z := 3, 4 // y sudah ada: hanya diberi nilai baru; z variabel baru
fmt.Println(x, y, z) // 1 3 4
\`\`\``,
          '## Konstanta typed dan untyped',
          'Konstanta tanpa tipe eksplisit (`const bebas = 10`) adalah untyped constant: ia hanya "angka 10" yang menyesuaikan diri dengan tempat pemakaiannya, sehingga bisa dipakai sebagai `int` maupun `float64`. Konstanta yang tipenya ditulis (`const kaku int = 10`) adalah typed constant dan perilakunya kaku seperti variabel bertipe `int`: tidak bisa langsung dipakai sebagai `float64`. Kalau untyped constant dipakai di `:=` tanpa konteks lain, ia memakai default type: `int` untuk bilangan bulat, `float64` untuk bilangan desimal.',
          `\`\`\`go
const bebas = 10
const kaku int = 10

var desimal float64 = bebas // boleh: bebas menyesuaikan diri jadi float64
// var salah float64 = kaku // compile error: kaku bertipe int
fmt.Println(desimal, kaku)
\`\`\``,
          '## iota',
          'Di dalam blok `const ( ... )`, `iota` adalah penghitung yang dimulai dari 0 dan naik 1 untuk setiap baris konstanta di blok itu. Baris tanpa ekspresi mengulang ekspresi baris sebelumnya, jadi `iota` cocok untuk membuat deretan konstanta bernomor (mirip enum di bahasa lain). Di setiap blok `const` baru, `iota` mulai lagi dari 0.',
          `\`\`\`go
const (
	Senin  = iota // 0
	Selasa        // 1
	Rabu          // 2
)
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

const (
	Senin = iota
	Selasa
	Rabu
)

func main() {
	const namaAplikasi = "BarisORG"
	const versi = 1

	kota := "Jakarta"
	suhu := 30.5

	fmt.Println(namaAplikasi, versi)
	fmt.Println(kota, suhu)

	// %T menampilkan tipe hasil type inference
	fmt.Printf("kota: %T, suhu: %T, versi: %T\\n", kota, suhu, versi)

	// := dengan satu variabel baru: y hanya diberi nilai baru, z variabel baru
	x, y := 1, 2
	y, z := 3, 4
	fmt.Println(x, y, z)

	// Konstanta tanpa tipe (untyped) menyesuaikan diri dengan konteks pemakaiannya
	const bebas = 10
	var desimal float64 = bebas
	fmt.Println(desimal)

	// iota: penghitung otomatis untuk deretan konstanta
	fmt.Println(Senin, Selasa, Rabu)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi pada y, z := 3, 4 kalau y sudah dideklarasikan sebelumnya di blok yang sama dan z belum?', [
            ['Valid: z dibuat baru, sedangkan y hanya diberi nilai baru', true],
            ['Compile error, karena := tidak boleh menyentuh variabel yang sudah ada', false],
            ['Valid, tapi y dibuat ulang sebagai variabel baru yang menutupi y yang lama', false],
            ['Compile error, karena semua variabel di kiri := harus belum pernah dideklarasikan', false],
          ]),
          q('Berapa nilai Rabu pada const ( Senin = iota; Selasa; Rabu )?', [
            ['2', true],
            ['3', false],
            ['0', false],
            ['Compile error, karena Selasa dan Rabu tidak punya ekspresi sendiri', false],
          ]),
          q('Apa beda const x = 10 dengan const y int = 10?', [
            ['x tanpa tipe sehingga bisa dipakai sebagai int atau float64, y bertipe int dan tidak bisa langsung dipakai sebagai float64', true],
            ['x nilainya boleh diubah nanti, sedangkan y tidak boleh diubah', false],
            ['x otomatis bertipe float64 karena tidak ada tipe yang ditulis', false],
            ['Keduanya identik, menulis tipe pada y hanya berfungsi sebagai komentar', false],
          ]),
          q('Di mana operator := boleh dipakai?', [
            ['Hanya di dalam fungsi', true],
            ['Di mana saja, termasuk di level package', false],
            ['Hanya di dalam fungsi main', false],
            ['Hanya untuk mendeklarasikan konstanta', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'gofz-operator',
        content: [
          'Operator aritmatika Go: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo) — `%` hanya berlaku untuk tipe integer.',
          '## Pembagian integer',
          'Kalau kedua operand adalah integer, `/` menghasilkan integer: bagian pecahannya dibuang (truncated toward zero, yaitu dibulatkan ke arah nol, bukan ke bawah). Jadi `10 / 3` adalah `3`, dan `-7 / 2` adalah `-3`, bukan `-4`. Sisa bagi `%` mengikuti tanda bilangan yang dibagi, jadi `-7 % 2` adalah `-1`. Untuk hasil desimal, ubah operandnya jadi `float64` dulu dengan konversi tipe, yaitu menulis nama tipe seperti fungsi: `float64(a) / float64(b)`. Go tidak pernah mengubah tipe angka secara implisit, jadi `int` dan `float64` tidak bisa dicampur langsung dalam satu ekspresi.',
          `\`\`\`go
a, b := 10, 3
n := -7
fmt.Println(a / b)                   // 3
fmt.Println(n / 2)                   // -3 (bukan -4)
fmt.Println(n % 2)                   // -1
fmt.Println(float64(a) / float64(b)) // 3.3333333333333335
\`\`\``,
          '## Perbandingan dan logika',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — semuanya menghasilkan nilai bertipe `bool`.',
          'Operator logika di Go ditulis dengan simbol, bukan kata: `&&` (dan), `||` (atau), `!` (negasi) — mirip C/JavaScript, berbeda dari Python yang memakai kata `and`/`or`/`not`.',
          '## Assignment dan increment',
          '`x += 5` setara dengan `x = x + 5` (begitu juga `-=`, `*=`, `/=`, `%=`). `x++` dan `x--` menambah atau mengurangi `x` dengan 1, tapi di Go keduanya adalah statement, bukan ekspresi: tidak bisa ditulis `y = x++`, dan tidak ada bentuk `++x`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	a := 10
	b := 3

	fmt.Println("Penjumlahan:", a+b)
	fmt.Println("Pembagian:", a/b)
	fmt.Println("Sisa bagi:", a%b)

	// Pembagian integer membuang pecahan ke arah nol (truncate toward zero)
	n := -7
	fmt.Println("-7 / 2 =", n/2)
	fmt.Println("-7 % 2 =", n%2)

	// Untuk hasil desimal, ubah operand jadi float64 dulu
	fmt.Println("10 / 3 desimal:", float64(a)/float64(b))

	fmt.Println("Perbandingan a > b:", a > b)
	fmt.Println("Logika a > b && b > 0:", a > b && b > 0)

	// Operator assignment dan increment
	a += 5
	a++
	fmt.Println("Setelah += 5 dan ++:", a)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Berapa hasil -7 / 2 di Go kalau kedua operand adalah integer?', [
            ['-3, pecahan dibuang ke arah nol', true],
            ['-4, dibulatkan ke bawah', false],
            ['-3.5, hasilnya otomatis desimal', false],
            ['Compile error, integer tidak boleh dibagi bilangan negatif', false],
          ]),
          q('Berapa hasil -7 % 2 di Go?', [
            ['-1, tanda sisa bagi mengikuti bilangan yang dibagi', true],
            ['1, tanda sisa bagi mengikuti pembagi seperti di Python', false],
            ['0, karena -7 tidak habis dibagi 2 sehingga sisanya dibuang', false],
            ['-3, sisa bagi sama dengan hasil pembagian', false],
          ]),
          q('Bagaimana mendapat hasil desimal dari a / b kalau a dan b bertipe int?', [
            ['float64(a) / float64(b)', true],
            ['Cukup tulis a / b, hasilnya otomatis desimal kalau tidak habis dibagi', false],
            ['a / float64(b), cukup satu operand yang diubah dan sisanya otomatis menyesuaikan', false],
          ]),
          q('Apa yang benar tentang x++ di Go?', [
            ['Statement yang menambah x dengan 1; tidak bisa dipakai di dalam ekspresi seperti y = x++', true],
            ['Ekspresi yang mengembalikan nilai x sebelum ditambah, seperti di C', false],
            ['Tidak ada di Go, penambahan harus selalu ditulis x = x + 1', false],
            ['Boleh ditulis ++x untuk menambah x sebelum nilainya dipakai', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Kontrol Alur & Struktur Data',
    lessons: [
      {
        title: 'Percabangan if/switch',
        slug: 'gofz-percabangan-if-switch',
        content: [
          'Percabangan `if` di Go tidak memerlukan tanda kurung `()` di sekitar kondisinya (berbeda dari C/Java), tapi kurung kurawal `{}` untuk blok kode tetap wajib. Contoh: `if nilai >= 60 { ... }`.',
          '`else if` dan `else` bekerja seperti bahasa lain — mengecek kondisi tambahan atau menjalankan blok default kalau semua kondisi di atasnya `false`.',
          '## switch dengan tag',
          '`switch` dengan tag (`switch nilaiTag { ... }`) membandingkan nilai tag dengan tiap `case` dari atas ke bawah dan menjalankan `case` pertama yang sama. Satu `case` boleh memuat beberapa nilai yang dipisah koma; artinya "salah satu dari nilai ini".',
          `\`\`\`go
hari := "sabtu"
switch hari {
case "sabtu", "minggu":
	fmt.Println("Akhir pekan")
case "senin":
	fmt.Println("Awal minggu")
default:
	fmt.Println("Hari kerja")
}
\`\`\``,
          '## switch tanpa tag',
          '`switch` tanpa argumen (`switch { ... }`) berfungsi seperti rangkaian `if/else if` yang lebih rapi, tiap `case` dievaluasi sebagai kondisi boolean.',
          '## Perilaku case dan default',
          'Berbeda dari C, `case` di Go otomatis berhenti setelah satu case cocok dan selesai dijalankan: tidak butuh `break` manual, dan tidak lanjut ke case berikutnya secara default. Kalau memang ingin lanjut, tulis `fallthrough` sebagai statement terakhir di sebuah `case` — kontrol pindah ke case berikutnya tanpa mengecek kondisinya, dan ini jarang dipakai.',
          '`default` dipakai sebagai blok yang dijalankan kalau tidak ada `case` yang cocok, mirip `else` pada `if`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	nilai := 75

	if nilai >= 90 {
		fmt.Println("Grade A")
	} else if nilai >= 75 {
		fmt.Println("Grade B")
	} else {
		fmt.Println("Grade C atau lebih rendah")
	}

	// switch tanpa tag: tiap case adalah kondisi boolean
	switch {
	case nilai >= 90:
		fmt.Println("Switch: A")
	case nilai >= 75:
		fmt.Println("Switch: B")
	default:
		fmt.Println("Switch: C atau lebih rendah")
	}

	// switch dengan tag: satu case boleh memuat beberapa nilai
	hari := "sabtu"
	switch hari {
	case "sabtu", "minggu":
		fmt.Println("Akhir pekan")
	case "senin":
		fmt.Println("Awal minggu")
	default:
		fmt.Println("Hari kerja")
	}
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apakah kondisi pada if di Go wajib memakai tanda kurung ()?', [
            ['Tidak, tanda kurung tidak diperlukan', true],
            ['Ya, selalu wajib', false],
            ['Hanya wajib untuk switch', false],
            ['Hanya wajib untuk for', false],
          ]),
          q('Pada switch di Go, apa yang terjadi setelah blok sebuah case yang cocok selesai dijalankan?', [
            ['Program langsung keluar dari switch tanpa perlu break', true],
            ['Program lanjut menjalankan case berikutnya sampai bertemu break', false],
            ['Compile error kalau case tidak diakhiri break atau fallthrough', false],
            ['Program lanjut mengecek case berikutnya dan menjalankannya juga kalau cocok', false],
          ]),
          q('Kata kunci untuk blok default pada switch di Go adalah?', [
            ['default', true],
            ['else', false],
            ['otherwise', false],
            ['fallback', false],
          ]),
          q('Apa arti case "sabtu", "minggu": pada switch hari { ... }?', [
            ['Blok dijalankan kalau hari sama dengan "sabtu" atau "minggu"', true],
            ['Blok dijalankan hanya kalau hari sama dengan "sabtu" dan "minggu" sekaligus', false],
            ['Compile error, satu case hanya boleh memuat satu nilai', false],
          ]),
        ],
      },
      {
        title: 'Perulangan for',
        slug: 'gofz-perulangan-for',
        content: [
          'Go hanya punya satu bentuk konstruksi loop, yaitu `for` — tidak ada `while` atau `do-while` terpisah seperti bahasa lain. Bentuk klasik `for i := 0; i < n; i++ { ... }` dipakai kalau jumlah iterasi sudah diketahui.',
          'Kalau bagian inisialisasi dan increment dihilangkan, `for kondisi { ... }` berperilaku persis seperti `while` di bahasa lain — mengulang selama kondisi `true`.',
          '`for { ... }` tanpa kondisi apa pun menghasilkan infinite loop, biasanya dikombinasikan dengan `break` di dalam blok untuk keluar dari loop saat kondisi tertentu terpenuhi.',
          '`break` menghentikan loop lebih awal, sedangkan `continue` melompati sisa kode di iterasi saat ini dan langsung lanjut ke iterasi berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	for i := 0; i < 5; i++ {
		if i == 3 {
			continue
		}
		fmt.Println("Iterasi ke-", i)
	}

	hitung := 0
	for hitung < 3 {
		fmt.Println("Gaya while, hitung =", hitung)
		hitung++
	}
}
`,
      },
      {
        title: 'Slice & Array',
        slug: 'gofz-slice-array',
        content: [
          'Array di Go punya ukuran tetap yang ditentukan sejak dideklarasikan, contoh: `var arr [3]string` selalu berukuran 3 elemen, tidak bisa bertambah atau berkurang.',
          'Slice adalah struktur data yang lebih fleksibel dan jauh lebih sering dipakai di Go dibanding array — slice dibangun di atas array tapi ukurannya dinamis, ditulis dengan `[]tipe{...}` tanpa angka ukuran, contoh: `buah := []string{"apel", "jeruk"}`.',
          'Fungsi bawaan `append()` menambah elemen baru ke slice, mengembalikan slice baru (kadang dengan array pendasar yang berbeda kalau kapasitas lama sudah penuh). Fungsi bawaan `len()` mengembalikan jumlah elemen, berlaku untuk array maupun slice.',
          'Akses elemen array maupun slice memakai index berbasis 0 seperti kebanyakan bahasa lain, contoh `buah[0]` mengambil elemen pertama. Cara memotong slice, membuatnya dengan `make`, dan mengulang isinya dengan `range` dibahas di lesson berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	var arr [3]string
	arr[0] = "apel"
	arr[1] = "jeruk"
	arr[2] = "mangga"
	fmt.Println("Array:", arr)

	buah := []string{"apel", "jeruk", "mangga"}
	buah = append(buah, "pisang")
	fmt.Println("Slice setelah append:", buah)
	fmt.Println("Panjang slice:", len(buah))
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama array dan slice di Go?', [
            ['Array ukurannya tetap, slice bisa dinamis (bisa bertambah)', true],
            ['Array dan slice adalah struktur data yang identik', false],
            ['Array selalu lebih cepat diakses daripada slice', false],
            ['Slice tidak bisa diakses lewat index', false],
          ]),
          q('Fungsi bawaan apa untuk menambah elemen baru ke slice?', [
            ['append()', true],
            ['push()', false],
            ['add()', false],
            ['insert()', false],
          ]),
          q('Fungsi bawaan apa untuk mengetahui jumlah elemen slice/array?', [
            ['len()', true],
            ['count()', false],
            ['size()', false],
            ['length()', false],
          ]),
        ],
      },
      {
        title: 'Slice: Potong, make, dan range',
        slug: 'gofz-slice-make-range',
        content: [
          'Selain mengambil satu elemen, kamu bisa mengambil sebagian slice dengan `s[a:b]`: hasilnya slice baru berisi elemen dari index `a` sampai sebelum `b` (batas bawah ikut, batas atas tidak). `a` boleh dihilangkan (artinya 0) dan `b` boleh dihilangkan (artinya `len(s)`), jadi `s[:2]` dan `s[3:]` sah. Hati-hati: potongan itu bukan salinan. Ia berbagi array pendasar dengan slice asalnya, jadi mengubah elemen lewat potongan juga mengubah slice asal.',
          `\`\`\`go
angka := []int{10, 20, 30, 40, 50}
tengah := angka[1:4]
awal := angka[:2]
akhir := angka[3:]
fmt.Println(tengah, awal, akhir) // [20 30 40] [10 20] [40 50]

tengah[0] = 99
fmt.Println(angka, awal) // [10 99 30 40 50] [10 99]
\`\`\``,
          'Slice juga bisa dibuat dengan `make([]tipe, panjang)`, yang mengisi `panjang` elemen dengan zero value, atau `make([]tipe, panjang, kapasitas)`. `len(s)` adalah jumlah elemen yang ada sekarang, sedangkan `cap(s)` (kapasitas) adalah jumlah elemen yang muat di array pendasar sebelum Go harus mengalokasikan array yang lebih besar. Index hanya boleh sampai `len(s)-1`, bukan `cap(s)-1`: mengakses di luar `len` membuat program panic `index out of range`. `append` tidak mengubah slice di tempat, jadi hasilnya harus ditampung dengan `s = append(s, x)`. Menulis `append(s, x)` saja tanpa menampung hasilnya adalah compile error (`evaluated but not used`).',
          `\`\`\`go
kosong := make([]int, 3)  // [0 0 0], len 3, cap 3
siap := make([]int, 0, 5) // [], len 0, cap 5
siap = append(siap, 1, 2) // [1 2], len 2, cap 5
fmt.Println(kosong, len(kosong), cap(kosong)) // [0 0 0] 3 3
fmt.Println(siap, len(siap), cap(siap))       // [1 2] 2 5
\`\`\``,
          'Untuk mengulang seluruh isi slice, pakai `for i, v := range s`: `i` adalah index dan `v` adalah salinan nilai elemen pada index itu, jadi mengubah `v` tidak mengubah slice. Untuk mengubah elemen, tulis lewat index (`s[i] = ...`). Kalau salah satunya tidak dibutuhkan, ganti dengan blank identifier `_` (variabel yang tidak dipakai adalah compile error): `for _, v := range s` kalau hanya butuh nilai, `for i := range s` kalau hanya butuh index. `range` juga bisa dipakai pada map, dibahas di lesson Map berikutnya.',
          `\`\`\`go
harga := []int{1000, 2500, 4000}

for i, h := range harga {
	harga[i] = h + 500 // ubah lewat index
}

total := 0
for _, h := range harga {
	total += h
}
fmt.Println(harga, total) // [1500 3000 4500] 9000
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	angka := []int{10, 20, 30, 40, 50}

	// s[a:b]: dari index a sampai sebelum b (batas atas tidak ikut)
	tengah := angka[1:4]
	awal := angka[:2]
	akhir := angka[3:]
	fmt.Println("tengah:", tengah, "awal:", awal, "akhir:", akhir)

	// Potongan berbagi array pendasar dengan slice asal
	tengah[0] = 99
	fmt.Println("Setelah tengah[0] = 99:", angka, awal)

	// make: panjang dan kapasitas
	kosong := make([]int, 3)
	siap := make([]int, 0, 5)
	siap = append(siap, 1, 2)
	fmt.Println("kosong:", kosong, "len", len(kosong), "cap", cap(kosong))
	fmt.Println("siap:", siap, "len", len(siap), "cap", cap(siap))

	// range: index dan salinan nilai
	for i, v := range akhir {
		fmt.Println("akhir index", i, "nilai", v)
	}

	// v hanya salinan, jadi v = v * 2 tidak mengubah angka
	for _, v := range angka {
		v = v * 2
	}
	fmt.Println("Setelah v = v * 2:", angka)

	// Untuk mengubah elemen, tulis lewat index
	for i := range angka {
		angka[i] = angka[i] * 2
	}
	fmt.Println("Setelah angka[i] = angka[i] * 2:", angka)

	total := 0
	for _, v := range angka {
		total += v
	}
	fmt.Println("Total:", total)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Setelah s := []int{10, 20, 30, 40}, t := s[1:3], dan t[0] = 99, apa isi s?', [
            ['[10 99 30 40], karena t berbagi array pendasar dengan s', true],
            ['[10 20 30 40], karena s[1:3] membuat salinan baru', false],
            ['[99 20 30 40], karena t[0] selalu menunjuk elemen pertama s', false],
            ['Compile error, karena potongan slice bersifat read-only', false],
          ]),
          q('Berapa len dan cap dari make([]int, 0, 5)?', [
            ['len 0 dan cap 5', true],
            ['len 5 dan cap 5, karena slice langsung diisi lima angka nol', false],
            ['len 0 dan cap 0, kapasitas baru ada setelah append pertama', false],
          ]),
          q('Pada for i, v := range s, apa isi v?', [
            ['Salinan nilai elemen pada index i, sehingga mengubah v tidak mengubah s', true],
            ['Referensi ke elemen asli, sehingga v = v * 2 ikut mengubah s', false],
            ['Index elemen berikutnya, sedangkan i berisi nilai elemennya', false],
            ['Jumlah elemen s (len(s)), nilainya sama di setiap iterasi', false],
          ]),
        ],
      },
      {
        title: 'Map',
        slug: 'gofz-map',
        content: [
          'Map menyimpan data sebagai pasangan key-value, ditulis dengan `map[tipeKey]tipeValue{...}`, contoh: `siswa := map[string]int{"Budi": 90}` membuat map dengan key bertipe `string` dan value bertipe `int`.',
          'Menambah atau mengubah entri map cukup dengan `siswa["Andi"] = 78`. Mengakses value lewat key yang tidak ada tidak menyebabkan error — Go mengembalikan zero value dari tipe value-nya (`0` untuk `int`).',
          'Untuk membedakan "key tidak ada" dari "key ada tapi valuenya kebetulan zero value", Go menyediakan bentuk akses dua nilai: `nilai, ada := siswa["Rudi"]` — `ada` bernilai `bool`, `true` kalau key benar-benar ada di map.',
          'Iterasi seluruh isi map memakai `for key, value := range namaMap { ... }` — perlu diingat urutan iterasi map di Go tidak dijamin selalu sama setiap dijalankan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	siswa := map[string]int{
		"Budi": 90,
		"Siti": 85,
	}

	siswa["Andi"] = 78

	fmt.Println("Nilai Budi:", siswa["Budi"])

	nilai, ada := siswa["Rudi"]
	fmt.Println("Nilai Rudi:", nilai, "Ada?", ada)

	for nama, n := range siswa {
		fmt.Println(nama, "->", n)
	}
}
`,
      },
    ],
  },
  {
    title: 'Fungsi, Struct & Interface',
    lessons: [
      {
        title: 'Fungsi & Parameter',
        slug: 'gofz-fungsi-parameter',
        content: [
          'Fungsi di Go didefinisikan dengan kata kunci `func`, diikuti nama fungsi, daftar parameter dalam kurung (nama lalu tipe, contoh `a int`), dan tipe nilai balik (kalau ada) sebelum blok kode.',
          'Kalau beberapa parameter berturut-turut punya tipe yang sama, tipenya cukup ditulis sekali di akhir, contoh `func tambah(a, b int) int` — sama saja dengan `func tambah(a int, b int) int`.',
          'Fungsi tanpa nilai balik tidak menuliskan tipe return sama sekali setelah kurung parameter, contoh `func sapa(nama string) { ... }`, dan tidak memerlukan statement `return` untuk keluar dari fungsi (kecuali ingin berhenti lebih awal).',
          'Fungsi di Go juga bisa mengembalikan lebih dari satu nilai sekaligus — dibahas di lesson berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func tambah(a int, b int) int {
	return a + b
}

func sapa(nama string) {
	fmt.Println("Halo,", nama)
}

func main() {
	hasil := tambah(5, 3)
	fmt.Println("Hasil tambah:", hasil)
	sapa("Siswa BarisORG")
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk mendefinisikan fungsi di Go?', [
            ['func', true],
            ['def', false],
            ['function', false],
            ['fn', false],
          ]),
          q('Di Go, tipe data parameter fungsi ditulis di mana?', [
            ['Setelah nama parameter', true],
            ['Sebelum nama parameter seperti C', false],
            ['Tidak perlu tipe data sama sekali', false],
            ['Hanya di bagian return', false],
          ]),
          q('Fungsi tanpa nilai balik di Go tidak menuliskan apa setelah kurung parameter?', [
            ['Tipe nilai balik (return type)', true],
            ['Nama fungsi', false],
            ['Daftar parameter', false],
            ['Kurung kurawal pembuka', false],
          ]),
        ],
      },
      {
        title: 'Multiple Return Value',
        slug: 'gofz-multiple-return-value',
        content: [
          'Salah satu ciri khas Go yang jarang ditemukan di bahasa lain: sebuah fungsi bisa mengembalikan lebih dari satu nilai sekaligus, ditulis dengan tipe return dalam kurung, contoh: `func bagi(a, b int) (int, error)`.',
          'Pola ini paling sering dipakai untuk penanganan error — fungsi mengembalikan `(hasil, error)` dengan `error` sebagai nilai return terakhir (ini konvensi Go), pemanggil wajib mengecek apakah `error` bernilai `nil` (tidak ada error) sebelum memakai hasilnya. Error yang memang diharapkan terjadi (input salah, pembagian dengan nol) dikembalikan sebagai nilai biasa seperti ini, bukan dilempar sebagai exception dan ditangkap dengan try/catch.',
          'Tipe bawaan `error` merepresentasikan kondisi gagal; nilai error baru bisa dibuat dengan `errors.New("pesan error")` dari package `errors`.',
          '## Menampung dan mengabaikan nilai return',
          'Semua nilai return harus ditampung: `hasil := bagi(10, 2)` adalah compile error (`assignment mismatch: 1 variable but bagi returns 2 values`). Kalau salah satu nilai return tidak dibutuhkan, Go menyediakan blank identifier `_` untuk mengabaikannya, misal `_, err := bagi(10, 0)`. Kalau `err` sudah dideklarasikan sebelumnya, tulis `_, err = bagi(10, 0)` dengan `=` biasa, karena `:=` butuh minimal satu variabel baru di kirinya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import (
	"errors"
	"fmt"
)

func bagi(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("tidak bisa membagi dengan nol")
	}
	return a / b, nil
}

func main() {
	hasil, err := bagi(10, 2)
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("Hasil bagi:", hasil)
	}

	_, err = bagi(10, 0)
	if err != nil {
		fmt.Println("Error:", err)
	}
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Pola idiomatik Go untuk fungsi yang mungkin gagal adalah mengembalikan?', [
            ['(value, error), dengan error sebagai nilai terakhir', true],
            ['Satu nilai saja, dengan -1 atau nil sebagai penanda gagal', false],
            ['(error, value), dengan error ditulis lebih dulu sebagai nilai pertama', false],
            ['Hasil biasa, lalu panggil panic kalau gagal dan tangkap dengan try/catch', false],
          ]),
          q('Apa yang terjadi pada hasil := bagi(10, 2) kalau bagi mengembalikan (int, error)?', [
            ['Compile error: assignment mismatch, 1 variable tapi fungsi mengembalikan 2 nilai', true],
            ['Valid: hasil menampung nilai pertama dan nilai error dibuang otomatis', false],
            ['Valid: hasil menjadi tuple yang berisi kedua nilai sekaligus', false],
            ['Valid saat compile, tapi program panic saat runtime kalau error tidak nil', false],
          ]),
          q('Tipe bawaan Go untuk merepresentasikan kondisi error adalah?', [
            ['error', true],
            ['exception', false],
            ['Err', false],
            ['Error (class)', false],
          ]),
        ],
      },
      {
        title: 'Struct',
        slug: 'gofz-struct',
        content: [
          'Struct adalah tipe data komposit yang mengelompokkan beberapa field (atribut) menjadi satu kesatuan, mirip cetak biru data — didefinisikan dengan `type NamaStruct struct { ... }`.',
          'Membuat instance struct bisa lewat literal, contoh `siswa1 := Siswa{Nama: "Budi", Umur: 20}` — menyebut nama field membuat urutan penulisan tidak wajib sesuai urutan deklarasi field di struct.',
          'Field struct diakses dan diubah lewat notasi titik, contoh `siswa1.Nama` untuk membaca, `siswa1.Umur = 21` untuk mengubah nilainya.',
          'Struct di Go tidak punya konsep inheritance class bertingkat seperti Java/Python — komposisi (menyisipkan struct lain sebagai field) adalah cara Go mendorong reuse kode, bukan pewarisan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

type Siswa struct {
	Nama string
	Umur int
}

func main() {
	siswa1 := Siswa{Nama: "Budi", Umur: 20}
	fmt.Println("Nama:", siswa1.Nama, "Umur:", siswa1.Umur)

	siswa1.Umur = 21
	fmt.Println("Setelah update umur:", siswa1.Umur)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara mendefinisikan struct baru di Go?', [
            ['type NamaStruct struct { ... }', true],
            ['class NamaStruct { ... }', false],
            ['struct NamaStruct() { ... }', false],
            ['def NamaStruct(struct): ...', false],
          ]),
          q('Struct di Go paling tepat digambarkan sebagai?', [
            ['Kumpulan field/atribut yang dikelompokkan menjadi satu tipe data', true],
            ['Interface yang wajib diimplementasikan', false],
            ['Fungsi anonim', false],
            ['Array dengan ukuran tetap', false],
          ]),
          q('Bagaimana cara mengakses field Nama dari variabel siswa1?', [
            ['siswa1.Nama', true],
            ['siswa1->Nama', false],
            ['siswa1[Nama]', false],
            ['siswa1::Nama', false],
          ]),
        ],
      },
      {
        title: 'Method pada Struct (Receiver)',
        slug: 'gofz-method-pada-struct',
        content: [
          'Go tidak punya class, tapi bisa "melekatkan" fungsi ke sebuah struct lewat receiver — fungsi seperti ini disebut method. Contoh: `func (s Siswa) Perkenalan() { ... }`, `s` di sini adalah receiver bertipe `Siswa`.',
          'Receiver ditulis dalam kurung khusus di antara kata kunci `func` dan nama method, berbeda dari parameter fungsi biasa. Di dalam method, receiver (`s`) dipakai untuk mengakses field milik struct tersebut, contoh `s.Nama`.',
          'Method dipanggil dengan notasi titik pada instance struct, contoh `siswa1.Perkenalan()` — sama seperti memanggil method object di bahasa OOP lain, walau di balik layar mekanismenya berbeda (bukan class).',
          '## Value receiver dan pointer receiver',
          'Receiver bisa berupa nilai (`func (s Siswa) ...`) atau pointer (`func (s *Siswa) ...`; tanda `*` berarti "pointer ke `Siswa`", dibahas lengkap di lesson Pointer). Value receiver bekerja pada salinan struct, jadi mengubah field di dalam method tidak mengubah struct aslinya. Pointer receiver bekerja pada struct aslinya, jadi method itu bisa mengubah field. Pakai pointer receiver kalau method perlu mengubah struct. Cara memanggilnya tetap sama (`siswa1.UlangTahun()`): Go otomatis memakai alamat `siswa1` kalau method-nya butuh pointer.',
          `\`\`\`go
func (s Siswa) UlangTahunSalah() { s.Umur++ } // mengubah salinan, struct asli tetap
func (s *Siswa) UlangTahun()     { s.Umur++ } // mengubah struct asli
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

type Siswa struct {
	Nama string
	Umur int
}

// Value receiver: s adalah salinan dari struct pemanggil
func (s Siswa) Perkenalan() {
	fmt.Println("Halo, saya", s.Nama, "umur", s.Umur, "tahun")
}

// Value receiver yang mengubah field: hanya salinan yang berubah
func (s Siswa) UlangTahunSalah() {
	s.Umur++
}

// Pointer receiver: s menunjuk ke struct asli
func (s *Siswa) UlangTahun() {
	s.Umur++
}

func main() {
	siswa1 := Siswa{Nama: "Siti", Umur: 22}
	siswa1.Perkenalan()

	siswa1.UlangTahunSalah()
	fmt.Println("Setelah UlangTahunSalah:", siswa1.Umur)

	siswa1.UlangTahun()
	fmt.Println("Setelah UlangTahun:", siswa1.Umur)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan value receiver (s Siswa) dengan pointer receiver (s *Siswa)?', [
            ['Value receiver mengubah salinan struct, pointer receiver mengubah struct aslinya', true],
            ['Pointer receiver hanya boleh membaca field, value receiver boleh mengubah aslinya', false],
            ['Method dengan pointer receiver tidak bisa dipanggil lewat notasi titik', false],
            ['Keduanya sama persis, bedanya hanya gaya penulisan', false],
          ]),
          q('Umur siswa1 awalnya 22. Berapa siswa1.Umur setelah siswa1.UlangTahunSalah() dengan value receiver dan isi s.Umur++?', [
            ['22, karena yang berubah hanya salinan', true],
            ['23, karena ++ selalu mengubah struct asli', false],
            ['0, karena salinan dibuat dengan nilai awal kosong', false],
            ['Compile error, field tidak boleh diubah di value receiver', false],
          ]),
          q('Di mana receiver ditulis pada deklarasi method?', [
            ['Dalam kurung di antara kata kunci func dan nama method', true],
            ['Dalam kurung setelah nama method bersama parameter lainnya', false],
            ['Di dalam blok type struct, bersama field-nya', false],
            ['Setelah tipe return, sebelum kurung kurawal pembuka', false],
          ]),
        ],
      },
      {
        title: 'Interface',
        slug: 'gofz-interface',
        content: [
          'Interface adalah tipe yang mendefinisikan sekumpulan method. Sebuah tipe memenuhi (implement) interface secara otomatis kalau ia punya semua method yang disebut interface itu: tidak ada kata kunci `implements`, cukup definisikan method-nya. Contoh interface `Bentuk` yang meminta dua method, beserta satu tipe yang memenuhinya:',
          `\`\`\`go
type Bentuk interface {
	Luas() float64
	Nama() string
}

type Persegi struct {
	Sisi float64
}

func (p Persegi) Luas() float64 { return p.Sisi * p.Sisi }
func (p Persegi) Nama() string  { return "Persegi" }
\`\`\``,
          'Karena `Persegi` punya `Luas()` dan `Nama()`, ia otomatis memenuhi `Bentuk`. Begitu juga tipe lain mana pun yang punya dua method itu, dan semuanya bisa dipakai di tempat yang meminta `Bentuk`: sebagai parameter fungsi atau sebagai elemen `[]Bentuk`. Fungsi yang menerima `Bentuk` tidak perlu tahu tipe konkretnya, cukup tahu method yang tersedia. Potongan berikut melanjutkan contoh di atas dan memakai `PersegiPanjang`, tipe lain dengan method `Luas()` dan `Nama()` yang sama (kode lengkapnya ada di sandbox):',
          `\`\`\`go
func cetakInfo(b Bentuk) {
	fmt.Printf("%s dengan luas %.2f\\n", b.Nama(), b.Luas())
}

daftar := []Bentuk{
	Persegi{Sisi: 4},
	PersegiPanjang{Panjang: 5, Lebar: 3},
}
for _, b := range daftar {
	cetakInfo(b)
}
\`\`\``,
          'Pengecekannya terjadi saat compile: kalau sebuah tipe kekurangan method, memakainya sebagai `Bentuk` adalah compile error yang menyebut `missing method`. Catatan penting: kalau method didefinisikan dengan pointer receiver (`func (p *Persegi) Luas()`), hanya pointer-nya (`&Persegi{...}`), bukan nilai `Persegi{...}`, yang memenuhi interface; pointer dibahas di lesson berikutnya. Interface tanpa method, `interface{}`, dipenuhi oleh semua tipe; itu sebabnya `fmt.Println` bisa menerima nilai apa pun.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

// Interface: kumpulan method yang harus dimiliki sebuah tipe
type Bentuk interface {
	Luas() float64
	Nama() string
}

type Persegi struct {
	Sisi float64
}

func (p Persegi) Luas() float64 { return p.Sisi * p.Sisi }
func (p Persegi) Nama() string  { return "Persegi" }

type PersegiPanjang struct {
	Panjang float64
	Lebar   float64
}

func (pp PersegiPanjang) Luas() float64 { return pp.Panjang * pp.Lebar }
func (pp PersegiPanjang) Nama() string  { return "Persegi panjang" }

// Menerima tipe apa pun yang punya method Luas dan Nama
func cetakInfo(b Bentuk) {
	fmt.Printf("%s dengan luas %.2f\\n", b.Nama(), b.Luas())
}

func main() {
	daftar := []Bentuk{
		Persegi{Sisi: 4},
		PersegiPanjang{Panjang: 5, Lebar: 3},
	}

	total := 0.0
	for _, b := range daftar {
		cetakInfo(b)
		total += b.Luas()
	}
	fmt.Printf("Total luas: %.2f\\n", total)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana sebuah tipe di Go menyatakan bahwa ia memenuhi sebuah interface?', [
            ['Cukup memiliki semua method yang diminta interface itu, tanpa kata kunci khusus', true],
            ['Dengan menulis type Persegi implements Bentuk saat mendeklarasikan tipenya', false],
            ['Dengan menaruh nama interface sebagai field pertama di dalam struct', false],
          ]),
          q('Apa yang terjadi kalau tipe Segitiga hanya punya method Luas(), lalu dipakai sebagai Bentuk yang meminta Luas() dan Nama()?', [
            ['Compile error: Segitiga tidak memenuhi Bentuk karena method Nama hilang', true],
            ['Valid, method yang kurang otomatis berisi zero value', false],
            ['Valid saat compile, tapi program panic ketika Nama() dipanggil', false],
            ['Valid, karena Go hanya mengecek method pertama di interface', false],
          ]),
          q('Kenapa []Bentuk boleh berisi Persegi dan PersegiPanjang sekaligus, padahal keduanya struct berbeda?', [
            ['Keduanya punya method yang diminta Bentuk, jadi sama-sama bisa dipakai sebagai Bentuk', true],
            ['Slice di Go boleh berisi campuran tipe apa pun tanpa batasan', false],
            ['Persegi diwariskan dari PersegiPanjang, jadi keduanya satu keluarga', false],
            ['Go otomatis menggabungkan kedua struct menjadi satu tipe baru', false],
          ]),
        ],
      },
      {
        title: 'Pointer di Go',
        slug: 'gofz-pointer-di-go',
        content: [
          'Pointer menyimpan alamat memori dari sebuah variabel, bukan nilainya secara langsung. Operator `&` mengambil alamat suatu variabel, contoh `&siswa1` menghasilkan pointer ke `siswa1`.',
          'Tipe pointer ditulis dengan awalan bintang, contoh `*Siswa` berarti "pointer ke Siswa". Operator `*` di depan variabel pointer dipakai untuk dereference — mengakses nilai asli yang ditunjuk pointer tersebut.',
          'Kegunaan utama pointer: mengizinkan fungsi memodifikasi nilai asli variabel milik pemanggil, bukan cuma salinannya. Tanpa pointer, Go selalu mengoper nilai secara copy (pass by value) ke dalam fungsi.',
          'Pada method dan fungsi, receiver/parameter bertipe pointer (`*Siswa`) membuat perubahan field di dalam fungsi ikut mengubah struct aslinya di luar fungsi.',
          '## Akses field lewat pointer',
          'Kalau `s` bertipe `*Siswa`, kamu tidak perlu menulis `(*s).Umur`: untuk akses field, Go otomatis men-dereference pointer, jadi `s.Umur` sama dengan `(*s).Umur`. Itu sebabnya `s.Umur++` di dalam fungsi `tambahUmur(s *Siswa)` mengubah `Umur` milik struct asli. Pointer yang belum menunjuk ke apa pun bernilai `nil`, dan mengakses field lewat pointer `nil` membuat program panic.',
          `\`\`\`go
siswa1 := Siswa{Nama: "Budi", Umur: 20}
p := &siswa1                        // p bertipe *Siswa
p.Umur = 21                         // sama dengan (*p).Umur = 21
fmt.Println((*p).Umur, siswa1.Umur) // 21 21
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

type Siswa struct {
	Nama string
	Umur int
}

func tambahUmurSalinan(s Siswa) {
	s.Umur++ // mengubah salinan
}

func tambahUmur(s *Siswa) {
	s.Umur++ // otomatis sama dengan (*s).Umur++
}

func main() {
	siswa1 := Siswa{Nama: "Budi", Umur: 20}
	fmt.Println("Sebelum:", siswa1.Umur)

	tambahUmurSalinan(siswa1)
	fmt.Println("Setelah tambahUmurSalinan:", siswa1.Umur)

	tambahUmur(&siswa1)
	fmt.Println("Setelah tambahUmur:", siswa1.Umur)

	p := &siswa1
	p.Umur = 30
	fmt.Println("Lewat pointer:", (*p).Umur, siswa1.Umur)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi operator & pada &siswa1?', [
            ['Mengambil alamat memori siswa1 sehingga menghasilkan pointer *Siswa', true],
            ['Membuat salinan baru dari siswa1', false],
            ['Mengakses nilai asli yang ditunjuk pointer (dereference)', false],
            ['Menggabungkan siswa1 dengan struct lain seperti operator dan (AND)', false],
          ]),
          q('Kenapa s.Umur++ di fungsi tambahUmur(s *Siswa) bisa mengubah struct asli tanpa menulis (*s).Umur++?', [
            ['Go otomatis men-dereference pointer pada akses field, jadi s.Umur sama dengan (*s).Umur', true],
            ['Semua parameter fungsi di Go dioper by reference secara default', false],
            ['Operator ++ selalu bekerja pada variabel asli di luar fungsi', false],
            ['Field yang namanya diawali huruf kapital selalu diakses lewat pointer', false],
          ]),
          q('Apa yang terjadi kalau struct dioper ke fungsi tanpa pointer, lalu fungsi mengubah field-nya?', [
            ['Hanya salinan yang berubah, struct asli milik pemanggil tetap sama', true],
            ['Struct asli ikut berubah, karena struct selalu dioper by reference', false],
            ['Compile error, field struct tidak boleh diubah di dalam fungsi', false],
            ['Struct asli berubah, tapi hanya kalau fungsi juga mengembalikan nilainya', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Concurrency & Ringkasan',
    lessons: [
      {
        title: 'Goroutine Dasar',
        slug: 'gofz-goroutine-dasar',
        content: [
          'Goroutine adalah unit eksekusi ringan di Go yang berjalan secara konkuren (concurrent) — dijalankan cukup dengan menambahkan kata kunci `go` sebelum pemanggilan fungsi, contoh `go sapa()`.',
          'Berbeda dari thread OS biasa yang berat (butuh memori awal cukup besar, dikelola langsung oleh sistem operasi), goroutine dikelola oleh Go runtime sendiri (scheduler-nya Go) dan memori awalnya sangat kecil — sebuah program Go bisa menjalankan ribuan bahkan jutaan goroutine sekaligus tanpa membebani sistem.',
          'Karena goroutine berjalan konkuren, program utama (`main`) tidak otomatis menunggu goroutine selesai — kalau `main` selesai duluan, semua goroutine yang masih berjalan langsung dihentikan paksa. Cara yang benar untuk menunggu goroutine selesai adalah sinkronisasi, lewat `sync.WaitGroup` (lesson berikutnya) atau channel (lesson Channel Dasar).',
          '## Contoh yang bisa dijalankan',
          'Contoh berikut menjalankan `hitung` sebagai goroutine. Karena belum punya cara sinkronisasi yang benar (dibahas di lesson berikutnya), `main` ditunda dengan `time.Sleep(100 * time.Millisecond)` (menjeda selama 100 milidetik) supaya goroutine sempat selesai. Ini trik kasar hanya untuk demo: menebak lama waktu tunggu tidak aman di program sungguhan. Coba hapus baris `Sleep` lalu jalankan lagi; goroutine kemungkinan besar tidak sempat mencetak apa-apa karena `main` keburu selesai, tapi hasilnya tidak dijamin.',
          `\`\`\`go
func hitung(label string) {
	for i := 1; i <= 3; i++ {
		fmt.Println(label, i)
	}
}

func main() {
	go hitung("goroutine")
	time.Sleep(100 * time.Millisecond) // beri waktu supaya goroutine selesai
	fmt.Println("main selesai")
}
\`\`\``,
          'Fungsi anonim juga bisa dijalankan sebagai goroutine: `go func() { ... }()` — tanda kurung `()` di akhir langsung memanggil fungsi itu.',
          'Konsep ini yang membuat Go sangat cocok untuk membangun server yang melayani ribuan koneksi sekaligus, seperti web server atau microservice, tanpa kompleksitas thread management manual.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import (
	"fmt"
	"time"
)

func hitung(label string) {
	for i := 1; i <= 3; i++ {
		fmt.Println(label, i)
	}
}

func main() {
	go hitung("goroutine")
	time.Sleep(100 * time.Millisecond) // trik kasar: beri waktu supaya goroutine selesai
	fmt.Println("Goroutine pertama selesai")

	// Fungsi anonim juga bisa jadi goroutine: tanda () di akhir memanggilnya
	go func() {
		fmt.Println("Halo dari fungsi anonim")
	}()
	time.Sleep(100 * time.Millisecond)

	fmt.Println("main selesai")
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk menjalankan sebuah fungsi sebagai goroutine baru?', [
            ['go', true],
            ['async', false],
            ['thread', false],
            ['spawn', false],
          ]),
          q('Siapa yang menjadwalkan goroutine untuk berjalan?', [
            ['Scheduler milik Go runtime, yang membagi banyak goroutine ke sejumlah thread OS', true],
            ['Sistem operasi, yang membuat satu thread OS baru untuk setiap goroutine', false],
            ['Garbage collector, yang menjalankan goroutine saat memori hampir penuh', false],
            ['Compiler, yang menentukan urutan eksekusi goroutine saat program dikompilasi', false],
          ]),
          q('Kenapa goroutine disebut jauh lebih ringan dibanding thread OS biasa?', [
            ['Memori awalnya sangat kecil dan penjadwalannya diurus runtime Go, bukan OS', true],
            ['Setiap goroutine otomatis berjalan di inti CPU-nya sendiri sehingga tidak ada beban', false],
            ['Goroutine tidak punya stack sendiri dan memakai stack milik fungsi main', false],
            ['Goroutine dijalankan satu per satu secara berurutan, bukan secara konkuren', false],
          ]),
          q('Apa yang terjadi kalau main selesai sementara sebuah goroutine masih berjalan?', [
            ['Program berakhir dan goroutine itu ikut dihentikan paksa', true],
            ['Program menunggu semua goroutine selesai dulu sebelum keluar', false],
            ['Goroutine tetap berjalan di background setelah program keluar', false],
            ['Go runtime melempar error karena masih ada goroutine yang belum selesai', false],
          ]),
        ],
      },
      {
        title: 'Menunggu Goroutine dengan WaitGroup',
        slug: 'gofz-waitgroup',
        content: [
          'Di lesson sebelumnya `main` harus menebak lama waktu tunggu dengan `time.Sleep`, dan itu tidak andal. `sync.WaitGroup` dari package `sync` adalah cara yang benar untuk menunggu sekelompok goroutine selesai. Ia bekerja seperti penghitung: `wg.Add(n)` menambah penghitung sebanyak `n` goroutine yang akan ditunggu, `wg.Done()` dipanggil tiap goroutine saat selesai untuk mengurangi penghitung 1, dan `wg.Wait()` memblokir sampai penghitung kembali ke 0.',
          `\`\`\`go
var wg sync.WaitGroup
for i := 1; i <= 3; i++ {
	wg.Add(1) // sebelum goroutine dijalankan
	go func(n int) {
		defer wg.Done() // dijalankan saat fungsi ini selesai
		fmt.Println("pekerja", n, "selesai")
	}(i)
}
wg.Wait() // tunggu semua Done()
fmt.Println("semua pekerja selesai")
\`\`\``,
          '`defer wg.Done()` artinya `wg.Done()` dijalankan tepat sebelum fungsi itu selesai, lewat jalur mana pun fungsinya keluar, jadi `Done` tidak terlewat. Nilai `i` dioper sebagai argumen `(i)` supaya tiap goroutine punya salinannya sendiri: di Go 1.13 (versi sandbox) variabel loop dipakai bersama oleh semua iterasi, sehingga goroutine yang membaca `i` langsung bisa melihat nilai yang sudah berubah (Go 1.22 mengubah ini, tapi mengoper argumen aman di semua versi). Satu hal lagi: urutan baris "pekerja ... selesai" bisa berbeda setiap program dijalankan, karena goroutine berjalan bersamaan dan tidak ada jaminan siapa yang selesai lebih dulu. Hanya baris terakhir yang pasti muncul belakangan, karena `Wait` menunggu semuanya.',
          'Kalau kamu butuh hasil dengan urutan yang pasti, jangan cetak dari dalam goroutine. Biarkan tiap goroutine menulis hasilnya ke index miliknya sendiri di sebuah slice, lalu cetak setelah `Wait()`. Ini aman karena tiap goroutine menyentuh elemen yang berbeda, dan `Wait()` menjamin semua penulisan sudah selesai sebelum slice dibaca. `WaitGroup` dioper ke fungsi sebagai pointer (`*sync.WaitGroup`), seperti pada contoh berikut yang juga ada di sandbox:',
          `\`\`\`go
func kerja(id int, hasil []int, wg *sync.WaitGroup) {
	defer wg.Done()
	hasil[id] = (id + 1) * (id + 1) // tiap goroutine menulis ke index sendiri
}

func main() {
	var wg sync.WaitGroup
	hasil := make([]int, 3)
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go kerja(i, hasil, &wg)
	}
	wg.Wait()
	fmt.Println(hasil) // [1 4 9], urutannya selalu sama
}
\`\`\``,
          'Tiga kesalahan umum: (1) memanggil `wg.Add(1)` di dalam goroutine, padahal `Wait()` bisa jalan lebih dulu dan menganggap tidak ada yang perlu ditunggu, jadi `Add` harus dipanggil sebelum `go`; (2) lupa memanggil `Done()`, yang membuat `Wait()` menunggu selamanya dan Go melaporkan `fatal error: all goroutines are asleep - deadlock!`; (3) mengoper `WaitGroup` ke fungsi sebagai nilai, yang menyalinnya sehingga `Done()` hanya mengurangi penghitung salinan dan `Wait()` di pemanggil tidak pernah selesai. Pakai pointer (`&wg`).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import (
	"fmt"
	"sync"
)

// Tiap goroutine menulis hasilnya ke index miliknya sendiri,
// jadi tidak ada dua goroutine yang menyentuh elemen yang sama.
func hitungKuadrat(id int, hasil []int, wg *sync.WaitGroup) {
	defer wg.Done() // kurangi penghitung saat fungsi ini selesai
	hasil[id] = (id + 1) * (id + 1)
}

func main() {
	var wg sync.WaitGroup
	hasil := make([]int, 5)

	for i := 0; i < 5; i++ {
		wg.Add(1) // tambah penghitung SEBELUM goroutine dijalankan
		go hitungKuadrat(i, hasil, &wg)
	}

	wg.Wait() // blok sampai penghitung kembali ke 0

	// Dicetak setelah Wait, jadi urutannya selalu sama.
	// (Kalau dicetak dari dalam goroutine, urutannya bisa berbeda tiap run.)
	for i, h := range hasil {
		fmt.Println("kuadrat", i+1, "=", h)
	}
	fmt.Println("Semua goroutine selesai")
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dilakukan wg.Wait()?', [
            ['Memblokir sampai penghitung WaitGroup kembali ke 0', true],
            ['Menjeda program selama beberapa milidetik, seperti time.Sleep', false],
            ['Menunggu goroutine pertama yang selesai, lalu program lanjut', false],
            ['Menghentikan semua goroutine yang masih berjalan', false],
          ]),
          q('Apa yang terjadi kalau satu goroutine lupa memanggil wg.Done()?', [
            ['wg.Wait() tidak pernah selesai, dan program macet (deadlock)', true],
            ['wg.Wait() tetap selesai setelah batas waktu bawaan beberapa detik', false],
            ['wg.Wait() langsung selesai, karena ia hanya menghitung goroutine yang sudah dimulai', false],
            ['Compile error, karena Go mengecek bahwa setiap goroutine memanggil Done()', false],
          ]),
          q('Kapan wg.Add(1) sebaiknya dipanggil?', [
            ['Di kode yang membuat goroutine (mis. di dalam loop), sebelum perintah go dijalankan', true],
            ['Di baris pertama di dalam goroutine itu sendiri', false],
            ['Setelah wg.Wait(), supaya penghitungnya sudah siap dipakai', false],
            ['Tidak perlu, Wait() menghitung goroutine yang berjalan secara otomatis', false],
          ]),
        ],
      },
      {
        title: 'Channel Dasar',
        slug: 'gofz-channel-dasar',
        content: [
          'Channel adalah "saluran" yang dipakai goroutine untuk saling berkirim data dengan aman, dibuat dengan fungsi bawaan `make(chan tipeData)`, contoh `ch := make(chan string)`.',
          'Operator `<-` dipakai untuk mengirim data ke channel (`ch <- "pesan"`) maupun menerima data dari channel (`pesan := <-ch`) — arah panah menunjukkan arah aliran data.',
          'Channel tanpa buffer (unbuffered, seperti `make(chan string)`) bersifat blocking: pengirim akan menunggu sampai ada penerima yang siap mengambil data, dan sebaliknya. Sifat ini otomatis mensinkronkan goroutine tanpa perlu lock manual.',
          'Filosofi Go soal concurrency sering diringkas: "Do not communicate by sharing memory; instead, share memory by communicating" — channel adalah implementasi utama filosofi itu.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	ch := make(chan string)

	go func() {
		ch <- "Halo dari goroutine!"
	}()

	pesan := <-ch
	fmt.Println("Diterima:", pesan)
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi bawaan apa untuk membuat channel baru?', [
            ['make(chan Type)', true],
            ['new(chan Type)', false],
            ['channel()', false],
            ['create(chan)', false],
          ]),
          q('Operator apa yang dipakai untuk mengirim/menerima data lewat channel?', [
            ['<-', true],
            ['->', false],
            ['=>', false],
            ['::', false],
          ]),
          q('Channel unbuffered bersifat blocking, artinya?', [
            ['Pengirim menunggu sampai ada penerima siap, dan sebaliknya', true],
            ['Data langsung hilang kalau tidak ada penerima', false],
            ['Channel hanya bisa dipakai sekali lalu otomatis tertutup', false],
            ['Program langsung crash kalau tidak ada penerima', false],
          ]),
        ],
      },
      {
        title: 'Ringkasan & Studi Kasus Gabungan',
        slug: 'gofz-ringkasan-studi-kasus',
        content: [
          'Sepanjang course ini kita sudah belajar struktur dasar program Go, variabel & tipe data, operator, kontrol alur (if/switch/for), struktur data (slice beserta `make` dan `range`, array, map), fungsi, struct beserta method, interface, dan pointer, hingga dasar concurrency lewat goroutine, `sync.WaitGroup`, dan channel.',
          'Studi kasus berikut menggabungkan beberapa konsep sekaligus: struct untuk merepresentasikan data siswa, slice untuk menampung banyak siswa, method untuk logika terkait satu siswa, dan fungsi biasa untuk menghitung agregat dari seluruh data.',
          'Fondasi yang sudah dipelajari di course ini cukup untuk mulai membangun program Go yang lebih kompleks — misalnya REST API sederhana, CLI tool, atau layanan backend yang memanfaatkan concurrency Go untuk menangani banyak request sekaligus.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

type Siswa struct {
	Nama  string
	Nilai int
}

func (s Siswa) Lulus() bool {
	return s.Nilai >= 60
}

func rataRata(daftar []Siswa) float64 {
	total := 0
	for _, s := range daftar {
		total += s.Nilai
	}
	return float64(total) / float64(len(daftar))
}

func main() {
	daftarSiswa := []Siswa{
		{Nama: "Budi", Nilai: 80},
		{Nama: "Siti", Nilai: 55},
		{Nama: "Andi", Nilai: 70},
	}

	for _, s := range daftarSiswa {
		status := "tidak lulus"
		if s.Lulus() {
			status = "lulus"
		}
		fmt.Println(s.Nama, "->", status)
	}

	fmt.Println("Rata-rata nilai kelas:", rataRata(daftarSiswa))
}
`,
        hasQuiz: true,
        quizQuestions: [
          q('Pada studi kasus di atas, method Lulus() dipanggil dengan syntax apa?', [
            ['s.Lulus()', true],
            ['Lulus(s)', false],
            ['s->Lulus()', false],
            ['Lulus.s()', false],
          ]),
          q('Parameter fungsi rataRata bertipe apa?', [
            ['Slice dari struct Siswa ([]Siswa)', true],
            ['Map string ke int', false],
            ['Channel', false],
            ['Pointer ke int', false],
          ]),
          q('Pada `for _, s := range daftarSiswa`, apa fungsi range di sini?', [
            ['Mengiterasi tiap elemen slice daftarSiswa', true],
            ['Membuat slice baru yang kosong', false],
            ['Menghapus seluruh isi slice', false],
            ['Mengurutkan slice secara menaik', false],
          ]),
        ],
      },
    ],
  },
]

const course: CourseDef = {
  title: 'Go from Zero',
  slug: 'go-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'Go from Zero adalah course pengantar untuk kamu yang belum pernah menulis Go. Go dikenal sederhana, cepat, dan punya dukungan concurrency bawaan, sehingga banyak dipakai untuk backend, cloud infrastructure, dan CLI tools. Course ini memperkenalkan Go dari nol, jadi pengalaman programming di bahasa lain membantu tapi tidak wajib.',
    'Di sini kamu belajar struktur program dan perintah `go run`/`go build`, variabel, konstanta, type inference dengan `:=`, operator, mencetak dengan `Printf`, percabangan `if` dan `switch`, perulangan `for`, array, slice (potong, `make`, `append`, `range`), dan map, fungsi dengan multiple return value untuk error handling, struct dengan method, interface, pointer, serta goroutine, `sync.WaitGroup`, dan channel, ditutup dengan studi kasus yang menggabungkan semuanya. Hampir semua lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan sebagian besar dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini menjalankan kode dengan Go 1.13, tanpa akses jaringan dan tanpa input keyboard. Kode dikompilasi sebagai satu file `package main`, jadi package di luar library standar tidak bisa dicoba di sana, dan fitur yang lebih baru dari Go 1.13 (misalnya generics) tidak dipakai. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun.',
  ].join('\n\n'),
  sandboxLanguage: 'go',
  modules,
}

export default course
