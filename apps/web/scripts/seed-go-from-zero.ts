import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "Go from Zero" — course ketiga non-dummy, meniru pola
// seed-python-from-zero.ts. Jalankan: pnpm seed:go

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
    title: 'Pengenalan Go',
    lessons: [
      {
        title: 'Apa itu Go?',
        slug: 'gofz-apa-itu-go',
        content: [
          'Go (sering disebut Golang) adalah bahasa pemrograman yang dibuat oleh Google, dirancang oleh Robert Griesemer, Rob Pike, dan Ken Thompson, lalu dirilis ke publik pada tahun 2009.',
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
            ['1991', false],
            ['1995', false],
            ['2015', false],
          ]),
          q('Apa yang membuat program Go berjalan cepat?', [
            ['Dikompilasi langsung ke binary native', true],
            ['Selalu dijalankan lewat interpreter', false],
            ['Butuh virtual machine yang berat', false],
            ['Hanya bisa jalan di browser', false],
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
          'Statement `import` dipakai untuk memuat package lain yang dibutuhkan, misalnya `import "fmt"` untuk package bawaan `fmt` yang berisi fungsi cetak ke layar seperti `fmt.Println`.',
          'Fungsi `func main()` adalah titik masuk (entry point) program — saat program Go dijalankan, Go runtime otomatis memanggil fungsi `main` di dalam `package main`, mirip peran `main()` di C atau Java.',
          'Blok kode di Go selalu dibungkus kurung kurawal `{}`, dan kurung kurawal pembuka wajib ada di baris yang sama dengan pernyataannya (gaya ini dipaksa oleh `gofmt`, formatter resmi Go).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	fmt.Println("Halo, Go!")
}
`,
      },
      {
        title: 'Menjalankan Program Go',
        slug: 'gofz-menjalankan-program-go',
        content: [
          'Perintah `go run nama_file.go` langsung mengompilasi lalu menjalankan program dalam satu langkah — paling praktis dipakai saat development karena hasilnya langsung terlihat tanpa file binary tersisa.',
          'Perintah `go build nama_file.go` hanya mengompilasi kode jadi file binary executable (mis. `nama_file` atau `nama_file.exe` di Windows) tanpa langsung menjalankannya — binary ini bisa didistribusikan dan dijalankan di komputer lain tanpa perlu Go terinstal.',
          'Karena Go adalah compiled language, error sintaks atau tipe data akan terdeteksi saat proses compile, sebelum program sempat dijalankan — berbeda dengan bahasa interpreted seperti Python yang baru mendeteksi error saat baris itu dieksekusi.',
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
          'Deklarasi variabel juga bisa langsung diisi nilai dalam satu baris: `var nama string = "Budi"` — Go bahkan bisa menebak tipe datanya otomatis dari nilai yang diberikan.',
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
        ],
      },
      {
        title: 'Konstanta & Type Inference',
        slug: 'gofz-konstanta-type-inference',
        content: [
          'Konstanta dideklarasikan dengan kata kunci `const`, nilainya tidak bisa diubah setelah didefinisikan — cocok untuk nilai tetap seperti nama aplikasi atau nilai matematis yang tidak boleh berubah selama program berjalan.',
          'Operator `:=` (short variable declaration) memungkinkan deklarasi sekaligus inisialisasi variabel tanpa menulis kata kunci `var` dan tanpa menyebut tipe data secara eksplisit — Go akan menebak (infer) tipe data dari nilai di sisi kanan.',
          'Type inference dengan `:=` hanya bisa dipakai di dalam fungsi, bukan di level package — dan hanya untuk deklarasi variabel baru, bukan untuk mengubah nilai variabel yang sudah ada (pakai `=` biasa untuk itu).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

func main() {
	const namaAplikasi = "BarisORG"
	const versi = 1

	kota := "Jakarta"
	suhu := 30.5

	fmt.Println(namaAplikasi, versi)
	fmt.Println(kota, suhu)
}
`,
      },
      {
        title: 'Operator',
        slug: 'gofz-operator',
        content: [
          'Operator aritmatika Go: `+` tambah, `-` kurang, `*` kali, `/` bagi (hasil integer dibulatkan ke bawah kalau kedua operand integer), `%` sisa bagi (modulo) — hanya berlaku untuk tipe integer.',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — semuanya menghasilkan nilai bertipe `bool`.',
          'Operator logika di Go ditulis dengan simbol, bukan kata: `&&` (dan), `||` (atau), `!` (negasi) — mirip C/JavaScript, berbeda dari Python yang memakai kata `and`/`or`/`not`.',
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

	fmt.Println("Perbandingan a > b:", a > b)
	fmt.Println("Logika a > b && b > 0:", a > b && b > 0)
}
`,
      },
      {
        title: 'Multiple Return Value',
        slug: 'gofz-multiple-return-value',
        content: [
          'Salah satu ciri khas Go yang jarang ditemukan di bahasa lain: sebuah fungsi bisa mengembalikan lebih dari satu nilai sekaligus, ditulis dengan tipe return dalam kurung, contoh: `func bagi(a, b int) (int, error)`.',
          'Pola ini paling sering dipakai untuk penanganan error — fungsi mengembalikan `(hasil, error)`, pemanggil wajib mengecek apakah `error` bernilai `nil` (tidak ada error) sebelum memakai hasilnya. Ini menggantikan mekanisme exception try/catch di bahasa lain.',
          'Tipe bawaan `error` merepresentasikan kondisi gagal; nilai error baru bisa dibuat dengan `errors.New("pesan error")` dari package `errors`.',
          'Kalau salah satu nilai return tidak dibutuhkan, Go menyediakan blank identifier `_` untuk mengabaikannya, misal `_, err := bagi(10, 0)`.',
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
            ['(value, error)', true],
            ['Melempar exception seperti Java', false],
            ['try/catch block', false],
            ['null saja tanpa keterangan', false],
          ]),
          q('Berapa banyak nilai yang bisa dikembalikan oleh satu fungsi Go?', [
            ['Bisa lebih dari satu', true],
            ['Hanya satu', false],
            ['Maksimal dua, tidak lebih', false],
            ['Tidak bisa mengembalikan nilai sama sekali', false],
          ]),
          q('Tipe bawaan Go untuk merepresentasikan kondisi error adalah?', [
            ['error', true],
            ['exception', false],
            ['Err', false],
            ['Error (class)', false],
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
          '`switch` di Go tanpa argumen (`switch { ... }`) berfungsi seperti rangkaian `if/else if` yang lebih rapi, tiap `case` dievaluasi sebagai kondisi boolean. Berbeda dari C, `case` di Go otomatis berhenti setelah satu case cocok (tidak butuh `break` manual, tidak fallthrough secara default).',
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

	switch {
	case nilai >= 90:
		fmt.Println("Switch: A")
	case nilai >= 75:
		fmt.Println("Switch: B")
	default:
		fmt.Println("Switch: C atau lebih rendah")
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
          q('Perilaku default case pada switch Go dibanding C adalah?', [
            ['Otomatis berhenti setelah satu case cocok, tidak fallthrough', true],
            ['Selalu fallthrough ke case berikutnya', false],
            ['Harus pakai break manual di tiap case', false],
            ['Error kalau tidak menulis fallthrough', false],
          ]),
          q('Kata kunci untuk blok default pada switch di Go adalah?', [
            ['default', true],
            ['else', false],
            ['otherwise', false],
            ['fallback', false],
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
          'Akses elemen array maupun slice memakai index berbasis 0 seperti kebanyakan bahasa lain, contoh `buah[0]` mengambil elemen pertama.',
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
    title: 'Fungsi & Struct',
    lessons: [
      {
        title: 'Fungsi & Parameter',
        slug: 'gofz-fungsi-parameter',
        content: [
          'Fungsi di Go didefinisikan dengan kata kunci `func`, diikuti nama fungsi, daftar parameter dalam kurung (nama lalu tipe, contoh `a int`), dan tipe nilai balik (kalau ada) sebelum blok kode.',
          'Kalau beberapa parameter berturut-turut punya tipe yang sama, tipenya cukup ditulis sekali di akhir, contoh `func tambah(a, b int) int` — sama saja dengan `func tambah(a int, b int) int`.',
          'Fungsi tanpa nilai balik tidak menuliskan tipe return sama sekali setelah kurung parameter, contoh `func sapa(nama string) { ... }`, dan tidak memerlukan statement `return` untuk keluar dari fungsi (kecuali ingin berhenti lebih awal).',
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
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

type Siswa struct {
	Nama string
	Umur int
}

func (s Siswa) Perkenalan() {
	fmt.Println("Halo, saya", s.Nama, "umur", s.Umur, "tahun")
}

func main() {
	siswa1 := Siswa{Nama: "Siti", Umur: 22}
	siswa1.Perkenalan()
}
`,
      },
      {
        title: 'Pointer di Go',
        slug: 'gofz-pointer-di-go',
        content: [
          'Pointer menyimpan alamat memori dari sebuah variabel, bukan nilainya secara langsung. Operator `&` mengambil alamat suatu variabel, contoh `&siswa1` menghasilkan pointer ke `siswa1`.',
          'Tipe pointer ditulis dengan awalan bintang, contoh `*Siswa` berarti "pointer ke Siswa". Operator `*` di depan variabel pointer dipakai untuk dereference — mengakses nilai asli yang ditunjuk pointer tersebut.',
          'Kegunaan utama pointer: mengizinkan fungsi memodifikasi nilai asli variabel milik pemanggil, bukan cuma salinannya. Tanpa pointer, Go selalu mengoper nilai secara copy (pass by value) ke dalam fungsi.',
          'Pada method dan fungsi, receiver/parameter bertipe pointer (`*Siswa`) membuat perubahan field di dalam fungsi ikut mengubah struct aslinya di luar fungsi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `package main

import "fmt"

type Siswa struct {
	Nama string
	Umur int
}

func tambahUmur(s *Siswa) {
	s.Umur++
}

func main() {
	siswa1 := Siswa{Nama: "Budi", Umur: 20}
	fmt.Println("Sebelum:", siswa1.Umur)

	tambahUmur(&siswa1)
	fmt.Println("Sesudah:", siswa1.Umur)
}
`,
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
          'Karena goroutine berjalan konkuren, program utama (`main`) tidak otomatis menunggu goroutine selesai — kalau `main` selesai duluan, semua goroutine yang masih berjalan langsung dihentikan paksa. Sinkronisasi (menunggu goroutine selesai) biasanya dilakukan lewat channel atau `sync.WaitGroup`, dibahas di pelajaran berikutnya.',
          'Konsep ini yang membuat Go sangat cocok untuk membangun server yang melayani ribuan koneksi sekaligus, seperti web server atau microservice, tanpa kompleksitas thread management manual.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk menjalankan sebuah fungsi sebagai goroutine baru?', [
            ['go', true],
            ['async', false],
            ['thread', false],
            ['spawn', false],
          ]),
          q('Goroutine dikelola langsung oleh apa, bukan oleh OS?', [
            ['Go runtime (scheduler bawaan Go)', true],
            ['Kernel Linux secara langsung', false],
            ['Browser', false],
            ['Database', false],
          ]),
          q('Kenapa goroutine disebut jauh lebih ringan dibanding thread OS biasa?', [
            ['Memori awalnya sangat kecil dan dikelola efisien oleh runtime Go', true],
            ['Goroutine sebenarnya identik dengan thread OS', false],
            ['Goroutine hanya berjalan di GPU', false],
            ['Goroutine tidak benar-benar berjalan konkuren', false],
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
          'Sepanjang course ini kita sudah belajar struktur dasar program Go, variabel & tipe data, operator, kontrol alur (if/switch/for), struktur data (slice, array, map), fungsi, struct beserta method dan pointer, hingga dasar concurrency lewat goroutine dan channel.',
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
      title: 'Go from Zero',
      slug: 'go-from-zero',
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
            ? { sandboxLanguage: 'go', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "Go from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
