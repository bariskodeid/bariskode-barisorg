import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "Ruby from Zero" — meniru pola seed-python-from-zero.ts.
// Jalankan: pnpm seed:ruby

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
    title: 'Pengenalan Ruby',
    lessons: [
      {
        title: 'Apa itu Ruby?',
        slug: 'rubyfz-apa-itu-ruby',
        content: [
          'Ruby adalah bahasa pemrograman tingkat tinggi yang dibuat oleh Yukihiro Matsumoto (biasa dipanggil "Matz") di Jepang, pertama dirilis tahun 1995. Ruby dirancang dengan filosofi "programmer happiness" — mengutamakan kebahagiaan dan produktivitas programmer, bukan sekadar performa mesin.',
          'Ruby bersifat interpreted dan dynamically typed, mirip Python, tapi sintaksnya lebih ekspresif dan fleksibel — banyak cara menulis kode yang sama, sesuai gaya masing-masing programmer.',
          'Ruby menjadi sangat populer lewat framework web Ruby on Rails, yang mempopulerkan konvensi "convention over configuration" dalam pengembangan web modern.',
          'Semua elemen di Ruby adalah object, bahkan angka dan `nil` sekalipun — ini membuat Ruby dikenal sebagai bahasa "pure object-oriented" yang konsisten.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa pencipta bahasa Ruby?', [
            ['Yukihiro Matsumoto', true],
            ['Guido van Rossum', false],
            ['Brendan Eich', false],
            ['James Gosling', false],
          ]),
          q('Apa filosofi utama di balik desain Ruby?', [
            ['Programmer happiness', true],
            ['Kecepatan eksekusi mutlak', false],
            ['Sesedikit mungkin sintaks', false],
            ['Hanya untuk sistem embedded', false],
          ]),
          q('Framework web populer yang dibangun dengan Ruby adalah?', [
            ['Ruby on Rails', true],
            ['Django', false],
            ['Laravel', false],
            ['Express', false],
          ]),
          q('Di Ruby, hampir semua hal (termasuk angka) dianggap sebagai?', [
            ['Object', true],
            ['Primitive type', false],
            ['Pointer', false],
            ['Struct', false],
          ]),
        ],
      },
      {
        title: 'Sintaks Dasar & puts',
        slug: 'rubyfz-sintaks-dasar-puts',
        content: [
          'Program Ruby paling sederhana cukup memakai method bawaan `puts` (put string) untuk menampilkan output ke layar, otomatis menambahkan baris baru di akhir. Ada juga `print` yang mirip tapi tidak menambahkan baris baru.',
          'Ruby tidak memerlukan titik koma (`;`) di akhir baris — satu baris dianggap satu statement, sama seperti Python.',
          'Komentar satu baris ditulis dengan `#`, diabaikan sepenuhnya saat program dijalankan. Komentar banyak baris bisa ditulis di antara `=begin` dan `=end`.',
          'File Ruby biasanya berekstensi `.rb` dan dijalankan lewat interpreter `ruby nama_file.rb` dari terminal.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `# Ini komentar satu baris
puts "Halo, Ruby!"
print "Baris ini tanpa baris baru di akhir. "
print "Makanya nyambung dengan baris berikutnya.\\n"

=begin
Ini komentar banyak baris,
diapit =begin dan =end.
=end
puts "Selesai belajar sintaks dasar"
`,
      },
      {
        title: 'Variabel & Penamaan',
        slug: 'rubyfz-variabel-penamaan',
        content: [
          'Variabel di Ruby dibuat langsung dengan tanda `=`, tanpa kata kunci deklarasi seperti `var`/`let`. Contoh: `nama = "Budi"` langsung membuat variabel `nama`.',
          'Konvensi penamaan variabel dan method di Ruby memakai `snake_case` (huruf kecil dipisah underscore), misal `nama_lengkap`, `tinggi_badan` — berbeda dengan `camelCase` yang umum di JavaScript.',
          'Variabel lokal harus diawali huruf kecil atau underscore. Ruby juga punya konvensi penamaan konstanta dengan huruf besar semua, misal `PI = 3.14`, yang secara konvensi tidak boleh diubah nilainya.',
          'Ruby mengizinkan multiple assignment dalam satu baris, misal `a, b, c = 1, 2, 3`, memudahkan inisialisasi beberapa variabel sekaligus.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `nama_lengkap = "Siswa BarisORG"
umur = 20
tinggi_badan = 165.5

puts nama_lengkap
puts umur
puts tinggi_badan

a, b, c = 1, 2, 3
puts "Multiple assignment: #{a}, #{b}, #{c}"

PI = 3.14
puts "Konstanta PI: #{PI}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Konvensi penamaan variabel dan method yang umum dipakai di Ruby adalah?', [
            ['snake_case', true],
            ['camelCase', false],
            ['PascalCase', false],
            ['kebab-case', false],
          ]),
          q('Bagaimana cara membuat variabel di Ruby?', [
            ['Langsung dengan tanda =, tanpa kata kunci deklarasi', true],
            ['Harus pakai kata kunci var', false],
            ['Harus pakai kata kunci let', false],
            ['Harus mendeklarasikan tipe data dulu', false],
          ]),
          q('Ciri penamaan konstanta di Ruby menurut konvensi adalah?', [
            ['Huruf besar semua, misal PI', true],
            ['Selalu diawali underscore', false],
            ['Selalu diakhiri tanda tanya', false],
            ['Harus satu huruf saja', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Tipe Data & Operator',
    lessons: [
      {
        title: 'Tipe Data Dasar',
        slug: 'rubyfz-tipe-data-dasar',
        content: [
          'Ruby punya beberapa tipe data dasar: `Integer` (bilangan bulat), `Float` (bilangan desimal), `String` (teks), dan `TrueClass`/`FalseClass` (boolean `true`/`false`).',
          'Method bawaan `.class` menampilkan tipe data dari sebuah nilai/variabel — berguna untuk mengecek tipe data yang sedang dipegang oleh sebuah variabel saat debugging.',
          'String di Ruby bisa ditulis dengan kutip tunggal `\'...\'` atau kutip ganda `"..."` — tapi hanya kutip ganda yang mendukung interpolasi variabel dan karakter escape seperti `\\n`.',
          'Ruby juga punya `nil`, nilai khusus yang berarti "tidak ada nilai" — mirip `None` di Python atau `null` di JavaScript.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `angka_bulat = 10
angka_desimal = 3.14
teks = "Halo dunia"
benar_salah = true
kosong = nil

puts angka_bulat.class
puts angka_desimal.class
puts teks.class
puts benar_salah.class
puts kosong.class
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe data apa untuk bilangan desimal di Ruby?', [
            ['Float', true],
            ['Integer', false],
            ['String', false],
            ['Symbol', false],
          ]),
          q('Method apa untuk mengecek tipe data sebuah nilai di Ruby?', [
            ['.class', true],
            ['.type', false],
            ['.kind', false],
            ['.typeof', false],
          ]),
          q('Nilai apa di Ruby yang berarti "tidak ada nilai"?', [
            ['nil', true],
            ['null', false],
            ['undefined', false],
            ['none', false],
          ]),
          q('Kutip mana yang mendukung interpolasi variabel di Ruby?', [
            ['Kutip ganda "..."', true],
            ['Kutip tunggal \'...\' juga bisa', false],
            ['Keduanya tidak mendukung interpolasi', false],
            ['Hanya backtick `...`', false],
          ]),
        ],
      },
      {
        title: 'Symbol',
        slug: 'rubyfz-symbol',
        content: [
          'Symbol adalah tipe data ciri khas Ruby, ditulis dengan titik dua di depan nama, misal `:nama` atau `:status_aktif`. Symbol mirip string tapi immutable (tidak bisa diubah) dan lebih hemat memori.',
          'Perbedaan utama dengan string: dua string yang isinya sama adalah dua object berbeda di memori, tapi dua symbol dengan nama sama selalu merujuk ke satu object yang sama persis — ini membuat perbandingan symbol jauh lebih cepat.',
          'Symbol sering dipakai sebagai key di Hash (mirip dictionary) dan sebagai identifier internal, misal nama method atau status, karena nilainya tidak pernah berubah selama program berjalan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `status = :aktif
puts status
puts status.class

nama_a = "budi"
nama_b = "budi"
puts "String sama isi, object_id beda: #{nama_a.object_id == nama_b.object_id}"

simbol_a = :budi
simbol_b = :budi
puts "Symbol sama nama, object_id sama: #{simbol_a.object_id == simbol_b.object_id}"
`,
      },
      {
        title: 'Operator',
        slug: 'rubyfz-operator',
        content: [
          'Operator aritmatika Ruby: `+` tambah, `-` kurang, `*` kali, `/` bagi, `%` sisa bagi (modulo), `**` pangkat. Pembagian antar Integer menghasilkan Integer (dibulatkan ke bawah), sedangkan pembagian yang melibatkan Float menghasilkan Float.',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — hasilnya selalu `true`/`false`.',
          'Operator logika: `&&` (dan), `||` (atau), `!` (negasi) — sama seperti banyak bahasa lain. Ruby juga punya versi kata: `and`, `or`, `not`, tapi keduanya punya prioritas operator yang berbeda sehingga `&&`/`||`/`!` lebih disarankan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `a = 10
b = 3

puts "Penjumlahan: #{a + b}"
puts "Pembagian integer: #{a / b}"
puts "Pembagian float: #{a / b.to_f}"
puts "Sisa bagi: #{a % b}"
puts "Pangkat: #{a ** 2}"

puts "Perbandingan a > b: #{a > b}"
puts "Logika a > b && b > 0: #{a > b && b > 0}"
`,
      },
      {
        title: 'String Interpolation & String Method',
        slug: 'rubyfz-string-interpolation-method',
        content: [
          'String interpolation di Ruby ditulis dengan `"#{ekspresi}"` di dalam kutip ganda — ekspresi apa pun di dalamnya (variabel, operasi, pemanggilan method) langsung dievaluasi dan disisipkan ke string.',
          'Method string umum: `.upcase`/`.downcase` mengubah huruf besar/kecil, `.strip` menghapus spasi di awal/akhir, `.length` menghitung jumlah karakter, `.reverse` membalik string.',
          '`.split` memecah string jadi array berdasarkan pemisah, sedangkan `.join` (dipanggil pada array) menggabungkan elemen array jadi satu string.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `nama = "budi"
umur = 20

puts "Nama: #{nama.upcase}, Umur: #{umur} tahun"

kalimat = "  Belajar Ruby itu menyenangkan  "
puts "Setelah strip: '#{kalimat.strip}'"
puts "Panjang setelah strip: #{kalimat.strip.length}"

kata = kalimat.strip.split(" ")
puts "Setelah split: #{kata}"
puts "Setelah join dengan '-': #{kata.join('-')}"
puts "Dibalik: #{nama.reverse}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara melakukan string interpolation di Ruby?', [
            ['"#{ekspresi}" di dalam kutip ganda', true],
            ["'#{ekspresi}' di dalam kutip tunggal", false],
            ['Hanya bisa dengan operator +', false],
            ['Ruby tidak mendukung interpolasi', false],
          ]),
          q('Method apa untuk mengubah string jadi huruf besar semua?', [
            ['.upcase', true],
            ['.upper', false],
            ['.toUpperCase', false],
            ['.capitalize_all', false],
          ]),
          q('Method apa untuk menghitung jumlah karakter sebuah string?', [
            ['.length', true],
            ['.size_of', false],
            ['.count_chars', false],
            ['.total', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Kontrol Alur & Struktur Data',
    lessons: [
      {
        title: 'Percabangan if/unless',
        slug: 'rubyfz-percabangan-if-unless',
        content: [
          'Percabangan `if` menjalankan blok kode hanya jika kondisi bernilai `true`, ditutup dengan kata kunci `end` (bukan kurung kurawal). `elsif` (perhatikan ejaannya, bukan "elseif") mengecek kondisi tambahan, `else` menjalankan blok kalau semua kondisi di atasnya `false`.',
          'Ruby juga punya `unless`, kebalikan dari `if` — blok kode dijalankan hanya jika kondisi bernilai `false`. `unless kondisi` setara dengan `if !kondisi`.',
          'Ruby mendukung modifier form: `puts "lulus" if nilai >= 60` — menaruh `if`/`unless` di akhir baris untuk kondisi satu baris yang ringkas, sangat umum dipakai dalam kode Ruby idiomatis.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `nilai = 75

if nilai >= 90
  puts "Grade A"
elsif nilai >= 75
  puts "Grade B"
elsif nilai >= 60
  puts "Grade C"
else
  puts "Tidak lulus"
end

puts "Lulus!" unless nilai < 60
puts "Nilai istimewa" if nilai >= 90
`,
        hasQuiz: true,
        quizQuestions: [
          q("Kata kunci apa untuk 'else if' di Ruby?", [
            ['elsif', true],
            ['elseif', false],
            ['else if', false],
            ['elif', false],
          ]),
          q('Kata kunci apa untuk menutup blok if di Ruby?', [
            ['end', true],
            ['}', false],
            ['endif', false],
            ['fi', false],
          ]),
          q('Blok kode unless dijalankan ketika kondisinya bernilai?', [
            ['false', true],
            ['true', false],
            ['nil selalu', false],
            ['Tidak pernah dijalankan', false],
          ]),
        ],
      },
      {
        title: 'Perulangan (each, for, while)',
        slug: 'rubyfz-perulangan-each-for-while',
        content: [
          '`each` adalah cara paling idiomatis mengulang tiap elemen collection di Ruby, dipanggil pada array/range dengan block, misal `(1..5).each do |i| ... end`. Ini lebih umum dipakai dibanding `for` di kode Ruby modern.',
          '`for` juga tersedia dan mirip bahasa lain: `for i in 1..5` — tapi jarang dipakai karena `each` dianggap lebih idiomatis dan konsisten dengan gaya object-oriented Ruby.',
          '`while` mengulang selama kondisi masih `true`, cocok kalau jumlah pengulangan tidak diketahui di awal. `break` menghentikan loop lebih awal, `next` melompati sisa iterasi saat ini (setara `continue` di bahasa lain).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `(1..5).each do |i|
  next if i == 3
  puts "Iterasi each ke-#{i}"
end

for i in 1..3
  puts "Iterasi for ke-#{i}"
end

hitung = 0
while hitung < 3
  puts "Iterasi while ke-#{hitung}"
  hitung += 1
end
`,
      },
      {
        title: 'Array',
        slug: 'rubyfz-array',
        content: [
          'Array adalah kumpulan data terurut yang bisa diubah (mutable), ditulis dengan `[]`, contoh: `buah = ["apel", "jeruk", "mangga"]`. Akses item dengan index dimulai dari 0: `buah[0]`, dan index negatif menghitung dari belakang: `buah[-1]` mengambil elemen terakhir.',
          'Method `.push` (atau operator `<<`) menambah elemen ke akhir array, `.pop` menghapus dan mengembalikan elemen terakhir, `.length`/`.size` menghitung jumlah elemen.',
          'Array di Ruby punya banyak method fungsional bawaan seperti `.map` (mengubah tiap elemen jadi array baru) dan `.select` (menyaring elemen sesuai kondisi), keduanya menerima block.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `buah = ["apel", "jeruk", "mangga"]
puts "Array buah: #{buah}"
puts "Item pertama: #{buah[0]}"
puts "Item terakhir: #{buah[-1]}"

buah << "pisang"
puts "Setelah push: #{buah}"

kuadrat = [1, 2, 3, 4].map { |x| x ** 2 }
puts "Hasil map (kuadrat): #{kuadrat}"

genap = [1, 2, 3, 4, 5, 6].select { |x| x.even? }
puts "Hasil select (genap): #{genap}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana cara mengakses elemen terakhir sebuah array di Ruby?', [
            ['array[-1]', true],
            ['array[last]', false],
            ['array.end', false],
            ['array[0]', false],
          ]),
          q('Method apa untuk menambah elemen ke akhir array (selain operator <<)?', [
            ['.push', true],
            ['.append_end', false],
            ['.add', false],
            ['.insert_last', false],
          ]),
          q('Method array apa yang mengembalikan array baru hasil transformasi tiap elemen?', [
            ['.map', true],
            ['.select', false],
            ['.each', false],
            ['.length', false],
          ]),
        ],
      },
      {
        title: 'Hash',
        slug: 'rubyfz-hash',
        content: [
          'Hash menyimpan data sebagai pasangan key-value, ditulis dengan `{}`. Gaya modern (Ruby 1.9+) memakai symbol sebagai key: `siswa = { nama: "Budi", umur: 20 }`, setara dengan `{ :nama => "Budi", :umur => 20 }`.',
          'Akses nilai lewat key: `siswa[:nama]`. Kalau key tidak ditemukan, hasilnya `nil` (bukan error), kecuali diatur default value lain saat membuat Hash.',
          'Method `.each` pada Hash memberikan pasangan key dan value sekaligus dalam block: `hash.each do |key, value| ... end`, memudahkan iterasi seluruh isi Hash.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `siswa = { nama: "Budi", umur: 20, kota: "Jakarta" }

puts "Nama: #{siswa[:nama]}"
puts "Umur: #{siswa[:umur]}"
puts "Key tidak ada: #{siswa[:alamat].inspect}"

siswa[:hobi] = "membaca"
puts "Setelah tambah key baru: #{siswa}"

siswa.each do |key, value|
  puts "#{key} => #{value}"
end
`,
      },
    ],
  },
  {
    title: 'Method & Block',
    lessons: [
      {
        title: 'Membuat Method',
        slug: 'rubyfz-membuat-method',
        content: [
          'Method (fungsi) di Ruby didefinisikan dengan kata kunci `def`, diikuti nama method dan parameter dalam kurung (kurung boleh dihilangkan), ditutup dengan `end`.',
          'Ruby punya "implicit return" — nilai ekspresi terakhir yang dievaluasi dalam method otomatis jadi nilai kembalian, meski tanpa kata kunci `return` eksplisit. `return` tetap bisa dipakai untuk keluar lebih awal.',
          'Konvensi penamaan method di Ruby: method yang mengembalikan boolean sering diakhiri `?` (misal `.even?`), dan method yang mengubah object aslinya (mutasi in-place) sering diakhiri `!` (misal `.upcase!`).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `def tambah(a, b)
  a + b
end

def sapa(nama)
  puts "Halo, #{nama}"
end

hasil = tambah(5, 3)
puts "Hasil tambah: #{hasil}"
sapa("Siswa BarisORG")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk mendefinisikan method di Ruby?', [
            ['def', true],
            ['function', false],
            ['func', false],
            ['method', false],
          ]),
          q('Apa yang dimaksud "implicit return" di Ruby?', [
            ['Ekspresi terakhir dalam method otomatis jadi nilai kembalian', true],
            ['Method selalu harus pakai kata kunci return', false],
            ['Method tidak bisa mengembalikan nilai', false],
            ['Return hanya bisa dipakai sekali per program', false],
          ]),
          q('Konvensi tanda apa yang biasa dipakai di akhir nama method yang mengembalikan boolean?', [
            ['? (tanda tanya)', true],
            ['! (tanda seru)', false],
            ['_bool', false],
            ['# (pagar)', false],
          ]),
        ],
      },
      {
        title: 'Default Argument',
        slug: 'rubyfz-default-argument',
        content: [
          'Parameter method bisa diberi nilai default, dipakai kalau pemanggil tidak memberikan argumen untuk parameter itu. Contoh: `def sapa(nama = "Tamu")` — kalau dipanggil `sapa` tanpa argumen, `nama` bernilai `"Tamu"`.',
          'Ruby juga mendukung keyword argument — memanggil method dengan menyebut nama parameternya langsung, misal `sapa(nama: "Budi")`, membuat urutan argumen tidak wajib sama dengan urutan parameter dan kode lebih jelas dibaca.',
          '`*args` menampung sejumlah argumen posisional tak terbatas jadi array — berguna untuk method yang jumlah argumennya fleksibel, misal method penjumlahan banyak angka sekaligus.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `def sapa(nama = "Tamu")
  puts "Halo, #{nama}"
end

sapa
sapa("Budi")

def perkenalan(nama:, umur:)
  puts "Nama: #{nama}, Umur: #{umur}"
end

perkenalan(nama: "Siti", umur: 22)

def jumlahkan_semua(*args)
  args.sum
end

puts "Jumlah semua: #{jumlahkan_semua(1, 2, 3, 4)}"
`,
      },
      {
        title: 'Block & yield',
        slug: 'rubyfz-block-yield',
        content: [
          'Block adalah potongan kode yang bisa dilewatkan ke sebuah method, ditulis dengan `do...end` (banyak baris) atau `{...}` (satu baris) — ini salah satu ciri khas paling menonjol dari Ruby, dipakai di mana-mana termasuk `each`, `map`, `select`.',
          'Di dalam method sendiri, kata kunci `yield` memanggil block yang dilewatkan saat method itu dipanggil. Ini memungkinkan kita membuat method kustom yang menerima block sendiri, mirip cara kerja `each` bawaan.',
          '`block_given?` mengecek apakah sebuah block memang dilewatkan saat method dipanggil, supaya `yield` tidak error kalau ternyata tidak ada block yang diberikan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `def ulangi(n)
  n.times do |i|
    yield i
  end
end

ulangi(3) do |i|
  puts "Iterasi ke-#{i} dari block"
end

def sapa_dengan_block
  if block_given?
    yield
  else
    puts "Tidak ada block yang diberikan"
  end
end

sapa_dengan_block { puts "Halo dari block!" }
sapa_dengan_block

[1, 2, 3].each { |angka| puts "Angka: #{angka}" }
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa yang dipakai di dalam method untuk memanggil block yang dilewatkan?', [
            ['yield', true],
            ['call', false],
            ['invoke', false],
            ['run', false],
          ]),
          q('Bagaimana cara menulis block satu baris di Ruby?', [
            ['{ ... }', true],
            ['[ ... ]', false],
            ['( ... )', false],
            ['<...>', false],
          ]),
          q('Apa kegunaan block_given? dalam sebuah method?', [
            ['Mengecek apakah block memang dilewatkan saat method dipanggil', true],
            ['Menjalankan block dua kali', false],
            ['Menghapus block dari method', false],
            ['Mengubah block jadi array', false],
          ]),
        ],
      },
      {
        title: 'Scope Variabel',
        slug: 'rubyfz-scope-variabel',
        content: [
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Ruby membedakan scope lewat penamaan awalan variabel: variabel biasa (`nama`) adalah local variable, hanya bisa diakses di scope tempat ia dibuat.',
          'Instance variable diawali satu tanda `@`, misal `@nama`, dan menempel pada satu object tertentu — dipakai untuk menyimpan data milik object dalam konteks class, bisa diakses dari semua method di dalam object yang sama.',
          'Global variable diawali `$`, misal `$konfigurasi`, bisa diakses dari mana saja di seluruh program — tapi penggunaannya sangat tidak disarankan karena membuat kode sulit dilacak dan rawan bug.',
          'Catatan: topik ini abstrak dan lebih jelas dijelaskan lewat konsep dibanding satu potongan skrip sandbox singkat, jadi dipelajari lewat penjelasan dan quiz konsep terlebih dulu sebelum dipraktikkan di materi Class & Object.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Awalan apa yang menandai instance variable di Ruby?', [
            ['@ (satu tanda "at")', true],
            ['$ (dollar)', false],
            ['_ (underscore)', false],
            ['# (pagar)', false],
          ]),
          q('Awalan apa yang menandai global variable di Ruby?', [
            ['$ (dollar)', true],
            ['@ (at)', false],
            ['& (ampersand)', false],
            ['% (persen)', false],
          ]),
          q('Kenapa penggunaan global variable sebaiknya dihindari?', [
            ['Membuat kode sulit dilacak dan rawan bug', true],
            ['Ruby tidak mendukung global variable', false],
            ['Global variable selalu menyebabkan error', false],
            ['Global variable lebih lambat dieksekusi', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'OOP Dasar & Ringkasan',
    lessons: [
      {
        title: 'Class & Object',
        slug: 'rubyfz-class-object',
        content: [
          'Ruby adalah bahasa "pure object-oriented" — class dibuat dengan kata kunci `class`, ditutup dengan `end`, dan object dibuat dengan memanggil `NamaClass.new(...)`.',
          '`initialize` adalah constructor — method khusus yang otomatis dijalankan saat `.new` dipanggil, biasanya dipakai mengisi instance variable (`@atribut`) dengan nilai awal.',
          'Method didefinisikan di dalam class dengan `def`, dan dipanggil pada object lewat titik: `object.method_nya`. Instance variable (`@nama`) hanya bisa diakses dari dalam method milik object yang sama, tidak langsung dari luar class kecuali lewat method.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Siswa
  def initialize(nama, umur)
    @nama = nama
    @umur = umur
  end

  def perkenalan
    puts "Halo, saya #{@nama}, umur #{@umur} tahun"
  end
end

siswa1 = Siswa.new("Budi", 20)
siswa2 = Siswa.new("Siti", 22)

siswa1.perkenalan
siswa2.perkenalan
`,
        hasQuiz: true,
        quizQuestions: [
          q('Method khusus apa yang otomatis jalan saat .new dipanggil di Ruby?', [
            ['initialize', true],
            ['__init__', false],
            ['constructor', false],
            ['new_object', false],
          ]),
          q('Bagaimana cara membuat object baru dari sebuah class di Ruby?', [
            ['NamaClass.new(...)', true],
            ['new NamaClass(...)', false],
            ['NamaClass.create(...)', false],
            ['NamaClass()', false],
          ]),
          q('Tanda apa yang menandai instance variable milik sebuah object?', [
            ['@ di depan nama variabel', true],
            ['$ di depan nama variabel', false],
            ['Huruf besar di awal nama variabel', false],
            ['Tanda kurung di sekitar nama variabel', false],
          ]),
        ],
      },
      {
        title: 'attr_accessor',
        slug: 'rubyfz-attr-accessor',
        content: [
          'Secara default, instance variable (`@atribut`) tidak bisa dibaca atau diubah langsung dari luar object — harus lewat method getter/setter yang ditulis manual, misal `def nama; @nama; end`.',
          '`attr_accessor` adalah method bawaan Ruby yang ciri khas: cukup panggil `attr_accessor :nama, :umur` di dalam class, dan Ruby otomatis membuatkan method getter (`nama`) dan setter (`nama=`) untuk atribut itu, menghemat banyak baris kode boilerplate.',
          'Kalau hanya butuh salah satu, ada `attr_reader` (getter saja, read-only) dan `attr_writer` (setter saja, write-only) — dipilih sesuai kebutuhan atribut tersebut boleh dibaca/diubah dari luar atau tidak.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Produk
  attr_accessor :nama, :harga

  def initialize(nama, harga)
    @nama = nama
    @harga = harga
  end
end

produk = Produk.new("Buku Ruby", 50000)
puts "Nama: #{produk.nama}"
puts "Harga sebelum diubah: #{produk.harga}"

produk.harga = 45000
puts "Harga setelah diubah lewat setter: #{produk.harga}"
`,
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'rubyfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita gabungkan semua konsep yang sudah dipelajari: class & object, `attr_accessor`, block, dan Hash — dalam satu program kecil pengelola daftar belanja sederhana.',
          'Program di bawah membuat class `Barang` dengan `attr_accessor`, menyimpan beberapa object `Barang` dalam array, lalu memakai block (`.each`, `.sum`) untuk menghitung total belanja dan menampilkan ringkasan.',
          'Sepanjang course ini kita sudah belajar sintaks dasar, tipe data, symbol, operator, kontrol alur, array & hash, method & block (ciri khas Ruby), hingga OOP dasar — fondasi yang cukup untuk mulai membangun program Ruby yang lebih kompleks, termasuk framework seperti Ruby on Rails.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Barang
  attr_accessor :nama, :harga, :jumlah

  def initialize(nama, harga, jumlah)
    @nama = nama
    @harga = harga
    @jumlah = jumlah
  end

  def subtotal
    @harga * @jumlah
  end
end

daftar_belanja = [
  Barang.new("Buku Ruby", 50000, 2),
  Barang.new("Pulpen", 5000, 3),
  Barang.new("Notebook", 20000, 1),
]

puts "=== Struk Belanja ==="
daftar_belanja.each do |barang|
  puts "#{barang.nama} x#{barang.jumlah} = #{barang.subtotal}"
end

total = daftar_belanja.sum { |barang| barang.subtotal }
ringkasan = { total_item: daftar_belanja.length, total_harga: total }

puts "----------------------"
puts "Total item: #{ringkasan[:total_item]}"
puts "Total harga: #{ringkasan[:total_harga]}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Method apa yang dipakai untuk menjumlahkan total dari sebuah collection dengan block, seperti pada contoh subtotal barang?', [
            ['.sum', true],
            ['.total', false],
            ['.add_all', false],
            ['.reduce_sum', false],
          ]),
          q('Dalam studi kasus gabungan di atas, attr_accessor dipakai untuk apa pada class Barang?', [
            ['Membuat getter & setter otomatis untuk nama, harga, dan jumlah', true],
            ['Membuat method initialize secara otomatis', false],
            ['Membuat class Barang jadi immutable', false],
            ['Menghapus instance variable', false],
          ]),
          q('Struktur data apa yang dipakai untuk menyimpan ringkasan total_item dan total_harga pada studi kasus di atas?', [
            ['Hash', true],
            ['Array', false],
            ['Symbol tunggal', false],
            ['String', false],
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
      title: 'Ruby from Zero',
      slug: 'ruby-from-zero',
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
            ? { sandboxLanguage: 'ruby', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "Ruby from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
