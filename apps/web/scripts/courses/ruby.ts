import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

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
          'Hampir semua nilai di Ruby adalah object, bahkan angka dan `nil` sekalipun — ini membuat Ruby dikenal sebagai bahasa "pure object-oriented" yang konsisten. Yang bukan object, misalnya, adalah bagian sintaks seperti kata kunci (`if`, `def`) dan variabel itu sendiri, karena variabel hanyalah nama yang menunjuk ke sebuah object.',
          'Karena angka juga object, kamu bisa memanggil method langsung pada angka, string, atau `nil`. `.class` menampilkan jenis object-nya (dibahas lagi di lesson Tipe Data):',
          `\`\`\`ruby
puts 5.class          # Integer
puts nil.class        # NilClass
puts "halo".upcase    # HALO
puts 3.7.round        # 4
\`\`\``,
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
            ['Programmer happiness: kode yang nyaman ditulis dan membuat programmer produktif', true],
            ['Performa eksekusi setinggi mungkin, meski kode jadi kurang nyaman ditulis', false],
            ['Satu cara baku untuk tiap tugas, supaya semua kode terlihat seragam', false],
            ['Pengecekan tipe yang ketat saat compile, supaya bug ketahuan sebelum program jalan', false],
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
          'Variabel lokal harus diawali huruf kecil atau underscore (`_`), misal `nama` atau `_sementara`.',
          'Ruby mengizinkan multiple assignment dalam satu baris, misal `a, b, c = 1, 2, 3`, memudahkan inisialisasi beberapa variabel sekaligus.',
          '## Konstanta',
          'Nama yang diawali huruf kapital otomatis dianggap konstanta oleh Ruby. Ini aturan bahasa, bukan sekadar kebiasaan, jadi `Batas = 10` dan `PI = 3.14` sama-sama konstanta. Konvensinya, konstanta untuk nilai tetap ditulis dengan huruf besar semua dan underscore, misal `MAKS_PERCOBAAN`.',
          'Berbeda dari `const` di JavaScript, Ruby tidak melarang konstanta diberi nilai baru. Kalau itu dilakukan, Ruby mencetak warning `already initialized constant` (tampil sebagai teks merah di output sandbox), tapi program tetap jalan dan nilainya berubah. Jadi "konstanta" lebih berupa kesepakatan antar programmer: nilai ini tidak seharusnya diubah.',
          `\`\`\`ruby
Batas = 10        # konstanta, karena diawali huruf kapital
puts Batas        # 10

Batas = 20        # warning: already initialized constant Batas
puts Batas        # 20
\`\`\``,
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

Batas = 10
puts "Batas diawali huruf kapital, jadi juga konstanta: #{Batas}"

# Mengubah konstanta tidak dilarang, tapi Ruby mengeluarkan warning (teks merah)
Batas = 20
puts "Batas setelah diubah: #{Batas}"
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
          q('Apa yang membuat sebuah nama dikenali Ruby sebagai konstanta?', [
            ['Diawali huruf kapital, misal PI atau Batas', true],
            ['Ditulis dengan huruf besar semua, jadi BATAS konstanta tapi Batas bukan', false],
            ['Ditandai dengan kata kunci const di depan nama', false],
            ['Diawali tanda dollar, misal $batas', false],
          ]),
          q('Apa yang terjadi kalau konstanta, misal PI = 3.14, diberi nilai baru di tengah program?', [
            ['Ruby mencetak warning "already initialized constant", tapi program lanjut dan nilainya berubah', true],
            ['Program langsung berhenti dengan error karena konstanta tidak boleh diubah sama sekali', false],
            ['Ruby mengabaikan assignment kedua tanpa pesan apa pun, nilai lama tetap dipakai', false],
            ['Ruby membuat konstanta kedua dengan nama sama yang berdiri sendiri di samping yang lama', false],
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
          'Perbedaan utama dengan string: dua string yang isinya sama adalah dua object berbeda di memori, tapi dua symbol dengan nama sama selalu merujuk ke satu object yang sama persis — ini membuat perbandingan symbol jauh lebih cepat. Setiap object punya `object_id`; dua object yang sama persis punya `object_id` yang sama. Perhatikan bedanya `==` (isinya sama) dengan `object_id` yang sama (benar-benar satu object):',
          `\`\`\`ruby
puts "budi" == "budi"                       # true: isinya sama
puts "budi".object_id == "budi".object_id   # false: dua object berbeda
puts :budi.object_id == :budi.object_id     # true: satu object yang sama
\`\`\``,
          '`.to_s` mengubah symbol jadi string, dan `.to_sym` mengubah string jadi symbol. Keduanya berguna saat data berupa teks (misal dari input) perlu dicocokkan dengan symbol di kode.',
          `\`\`\`ruby
teks = :aktif.to_s
simbol = "aktif".to_sym
puts teks.class     # String
puts simbol.class   # Symbol
\`\`\``,
          'Symbol sering dipakai sebagai key di Hash (mirip dictionary, dibahas di lesson Hash) dan sebagai identifier internal, misal nama method atau status, karena nilainya tidak pernah berubah selama program berjalan. Key Hash boleh juga berupa string, tapi symbol lebih umum dipakai.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `status = :aktif
puts status
puts status.class

nama_a = "budi"
nama_b = "budi"
puts "String: isinya sama? #{nama_a == nama_b}"
puts "String: object_id sama? #{nama_a.object_id == nama_b.object_id}"

simbol_a = :budi
simbol_b = :budi
puts "Symbol: object_id sama? #{simbol_a.object_id == simbol_b.object_id}"

teks = status.to_s
simbol = "aktif".to_sym
puts "Symbol jadi string: #{teks.class}"
puts "String jadi symbol: #{simbol.class}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana symbol ditulis di Ruby?', [
            [':nama, dengan titik dua di depan nama', true],
            ['"nama", dengan kutip ganda di sekeliling nama', false],
            ['#nama, dengan tanda pagar di depan nama', false],
          ]),
          q('Berapa hasil :budi.object_id == :budi.object_id, lalu "budi".object_id == "budi".object_id (dua string literal)?', [
            ['true, lalu false', true],
            ['false, lalu true', false],
            ['true, lalu true, karena string dengan isi sama selalu satu object', false],
            ['false, lalu false, karena object_id selalu unik tiap kali dipanggil', false],
          ]),
          q('Kenapa symbol cocok dipakai sebagai key Hash atau penanda status?', [
            ['Nilainya tidak berubah, dan dua symbol bernama sama adalah satu object sehingga perbandingannya cepat', true],
            ['Symbol bisa menyimpan teks yang jauh lebih panjang daripada string biasa', false],
            ['Symbol otomatis berubah mengikuti isi variabel yang ada di sekitarnya', false],
            ['Hash hanya menerima symbol sebagai key, sedangkan string tidak bisa jadi key', false],
          ]),
        ],
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
          'Percabangan `if` menjalankan blok kode kalau kondisinya truthy (dianggap benar, lihat bagian "Truthy dan falsy" di bawah), ditutup dengan kata kunci `end` (bukan kurung kurawal). `elsif` (perhatikan ejaannya, bukan "elseif") mengecek kondisi tambahan, `else` menjalankan blok kalau semua kondisi di atasnya falsy.',
          'Ruby juga punya `unless`, kebalikan dari `if` — blok kode dijalankan kalau kondisinya falsy (`nil` atau `false`). `unless kondisi` setara dengan `if !kondisi`.',
          'Ruby mendukung modifier form: `puts "lulus" if nilai >= 60` — menaruh `if`/`unless` di akhir baris untuk kondisi satu baris yang ringkas, sangat umum dipakai dalam kode Ruby idiomatis.',
          '## Truthy dan falsy',
          'Di Ruby hanya dua nilai yang falsy: `nil` dan `false`. Semua nilai lain truthy, termasuk `0`, string kosong `""`, dan array kosong `[]`. Ini berbeda dari JavaScript atau Python, tempat `0` dan string kosong dianggap falsy.',
          `\`\`\`ruby
saldo = 0
puts "0 itu truthy" if saldo            # tercetak

catatan = ""
puts "string kosong truthy" if catatan   # tercetak

data = nil
puts "nil itu falsy" unless data         # tercetak
\`\`\``,
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

# Hanya nil dan false yang falsy; semua nilai lain truthy
saldo = 0
puts "0 itu truthy, jadi blok if jalan" if saldo
catatan = ""
puts "String kosong juga truthy" if catatan
data = nil
puts "nil itu falsy, jadi unless jalan" unless data
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
          q('Pada unless data, kapan blok kodenya dijalankan?', [
            ['Ketika data bernilai nil atau false, karena keduanya falsy', true],
            ['Ketika data bernilai false saja; nil membuat Ruby error karena bukan boolean', false],
            ['Ketika data bernilai false, 0, atau string kosong, karena ketiganya dianggap falsy', false],
          ]),
          q('Mana pernyataan yang benar tentang truthy dan falsy di Ruby?', [
            ['if 0 menjalankan bloknya, karena hanya nil dan false yang falsy', true],
            ['if 0 tidak menjalankan bloknya, karena angka nol sama dengan false', false],
            ['if "" tidak menjalankan bloknya, karena string kosong dianggap tidak punya isi', false],
            ['if nil menjalankan bloknya, karena nil juga sebuah object seperti yang lain', false],
          ]),
        ],
      },
      {
        title: 'Percabangan case/when & Range',
        slug: 'rubyfz-case-when-range',
        content: [
          'Kalau `if`/`elsif` punya banyak cabang yang membandingkan satu nilai yang sama, `case`/`when` biasanya lebih rapi. `case` menerima sebuah nilai, tiap `when` memeriksa satu atau beberapa kemungkinan, `else` menangani sisanya, dan semuanya ditutup dengan `end`. Beberapa nilai dalam satu `when` dipisah koma dan artinya "atau".',
          `\`\`\`ruby
hari = "sabtu"

case hari
when "senin", "selasa", "rabu", "kamis", "jumat"
  puts "Hari kerja"
when "sabtu", "minggu"
  puts "Akhir pekan"
else
  puts "Bukan nama hari"
end
\`\`\``,
          'Ruby mencocokkan `when` dari atas ke bawah dan hanya menjalankan `when` pertama yang cocok. Tidak ada `break`, dan tidak ada "jatuh" ke cabang berikutnya seperti `switch` di C atau JavaScript. `case` juga mengembalikan nilai dari cabang yang dijalankan, jadi hasilnya bisa langsung disimpan di variabel.',
          '## Range di dalam when',
          'Range menyatakan rentang nilai: `1..5` berisi 1 sampai 5 (dua titik: batas akhir ikut), sedangkan `1...5` berisi 1 sampai 4 (tiga titik: batas akhir tidak ikut). Di dalam `when`, Range cocok dengan angka yang berada di dalam rentangnya, jadi cocok untuk menggantikan rangkaian `elsif nilai >= 60 && nilai < 75`.',
          `\`\`\`ruby
nilai = 82

grade = case nilai
when 90..100
  "A"
when 75...90
  "B"
when 60...75
  "C"
else
  "Tidak lulus"
end

puts "Grade: #{grade}"   # Grade: B
\`\`\``,
          'Pakai tiga titik di antara rentang yang berurutan supaya tidak ada celah. Kalau cabang `75...90` di atas ditulis `when 75..89`, nilai 89.5 tidak cocok dengan cabang mana pun, karena `75..89` tidak memuatnya (`(75..89).include?(89.5)` bernilai `false`) dan `90..100` juga tidak, sehingga jatuh ke `else`; `75...90` memuatnya (`include?` bernilai `true`). `include?` mengecek apakah sebuah nilai ada di dalam Range.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `# case/when dengan beberapa nilai per cabang
hari = "sabtu"

case hari
when "senin", "selasa", "rabu", "kamis", "jumat"
  puts "#{hari}: hari kerja"
when "sabtu", "minggu"
  puts "#{hari}: akhir pekan"
else
  puts "#{hari}: bukan nama hari"
end

# case dengan Range; hasilnya disimpan ke variabel
nilai = 82

grade = case nilai
when 90..100
  "A"
when 75...90
  "B"
when 60...75
  "C"
else
  "Tidak lulus"
end

puts "Nilai #{nilai} => grade #{grade}"

# Cabang pertama yang cocok menang, tidak ada "jatuh" ke cabang berikutnya
angka = 75

case angka
when 60..75
  puts "Cabang pertama jalan"
when 75..100
  puts "Cabang kedua tidak pernah jalan untuk 75"
end

# Dua titik vs tiga titik: 89.5 lolos dari celah 75..89
puts "89.5 ada di 75..89?  #{(75..89).include?(89.5)}"
puts "89.5 ada di 75...90? #{(75...90).include?(89.5)}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa arti when "sabtu", "minggu" pada sebuah case?', [
            ['Cabang dijalankan kalau nilainya "sabtu" atau "minggu"', true],
            ['Cabang dijalankan hanya kalau nilainya "sabtu" dan "minggu" sekaligus', false],
            ['Cabang dijalankan untuk "sabtu", lalu lanjut juga ke cabang when berikutnya', false],
            ['Ruby error, karena satu when hanya boleh berisi satu nilai', false],
          ]),
          q('Pada case dengan when 60..75 (hasil "C") lalu when 75..100 (hasil "B"), apa hasilnya untuk nilai 75?', [
            ['"C", karena hanya when pertama yang cocok yang dijalankan', true],
            ['"B", karena cabang terakhir yang cocok menimpa hasil sebelumnya', false],
            ['"C" lalu "B", karena kedua Range memuat 75 sehingga keduanya dijalankan', false],
            ['Ruby error, karena dua Range tidak boleh memuat angka yang sama', false],
          ]),
          q('Range mana yang berisi 75, 76, sampai 89, tetapi tidak berisi 90?', [
            ['75...90 (tiga titik)', true],
            ['75..90 (dua titik)', false],
            ['Keduanya sama saja: jumlah titik hanya soal gaya penulisan', false],
          ]),
        ],
      },
      {
        title: 'Perulangan (each, for, while)',
        slug: 'rubyfz-perulangan-each-for-while',
        content: [
          'Perulangan menjalankan kode yang sama berulang kali. Di Ruby, yang paling sering diulang adalah isi sebuah collection atau rentang angka, dan rentang angka ditulis dengan Range.',
          '## Range',
          'Range sudah dikenal dari lesson sebelumnya: `1..5` berisi 1, 2, 3, 4, 5 (dua titik: batas akhir ikut), sedangkan `1...5` berisi 1, 2, 3, 4 (tiga titik: batas akhir tidak ikut). Di perulangan, Range dipakai sebagai rentang yang diulang. Range ditulis dalam kurung kalau dipanggil method-nya, dan `.to_a` mengubahnya jadi array supaya isinya kelihatan.',
          `\`\`\`ruby
puts "1..5  => #{(1..5).to_a}"    # [1, 2, 3, 4, 5]
puts "1...5 => #{(1...5).to_a}"   # [1, 2, 3, 4]
\`\`\``,
          '## each dan for',
          '`each` adalah cara paling idiomatis mengulang tiap elemen collection di Ruby, dipanggil pada array atau Range dengan block, misal `(1..5).each do |i| ... end`. Ini lebih umum dipakai dibanding `for` di kode Ruby modern.',
          '`for` juga tersedia dan mirip bahasa lain: `for i in 1..5` — tapi jarang dipakai karena `each` dianggap lebih idiomatis dan konsisten dengan gaya object-oriented Ruby.',
          '## times dan upto',
          'Kalau yang dibutuhkan hanya mengulang sejumlah kali, pakai `n.times`: `3.times do |i| ... end` menjalankan block 3 kali dengan `i` bernilai 0, 1, 2 (dihitung mulai dari 0). `1.upto(3)` mengulang dari 1 sampai 3 (batas akhir ikut), setara dengan `(1..3).each`.',
          `\`\`\`ruby
3.times do |i|
  puts "times ke-#{i}"     # 0, 1, 2
end

1.upto(3) do |i|
  puts "upto ke-#{i}"      # 1, 2, 3
end
\`\`\``,
          '## while, break, dan next',
          '`while` mengulang selama kondisi masih truthy, cocok kalau jumlah pengulangan tidak diketahui di awal. `break` menghentikan loop lebih awal, `next` melompati sisa iterasi saat ini (setara `continue` di bahasa lain).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `puts "1..5  => #{(1..5).to_a}"
puts "1...5 => #{(1...5).to_a}"

(1..5).each do |i|
  next if i == 3
  puts "Iterasi each ke-#{i}"
end

for i in 1..3
  puts "Iterasi for ke-#{i}"
end

3.times do |i|
  puts "Iterasi times ke-#{i}"
end

1.upto(3) do |i|
  puts "Iterasi upto ke-#{i}"
end

hitung = 0
while hitung < 3
  puts "Iterasi while ke-#{hitung}"
  hitung += 1
end
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa isi (1...5).to_a?', [
            ['[1, 2, 3, 4], karena tiga titik tidak menyertakan batas akhir', true],
            ['[1, 2, 3, 4, 5], karena dua atau tiga titik sama-sama menyertakan batas akhir', false],
            ['[2, 3, 4, 5], karena tiga titik tidak menyertakan batas awal', false],
          ]),
          q('Berapa nilai i pada putaran pertama 3.times do |i| ... end?', [
            ['0', true],
            ['1', false],
            ['3', false],
          ]),
          q('Apa fungsi next di dalam sebuah perulangan?', [
            ['Melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya', true],
            ['Menghentikan seluruh perulangan dan keluar dari loop', false],
            ['Mengulang iterasi yang sama dari awal sekali lagi', false],
          ]),
        ],
      },
      {
        title: 'Array',
        slug: 'rubyfz-array',
        content: [
          'Array adalah kumpulan data terurut yang bisa diubah (mutable), ditulis dengan `[]`, contoh: `buah = ["apel", "jeruk", "mangga"]`. Akses item dengan index dimulai dari 0: `buah[0]`, dan index negatif menghitung dari belakang: `buah[-1]` mengambil elemen terakhir.',
          'Method `.push` (atau operator `<<`) menambah elemen ke akhir array, `.pop` menghapus dan mengembalikan elemen terakhir, `.length`/`.size` menghitung jumlah elemen.',
          'Array di Ruby punya banyak method fungsional bawaan seperti `.map` (mengubah tiap elemen jadi array baru) dan `.select` (menyaring elemen sesuai kondisi), keduanya menerima block. Block satu baris ditulis dengan `{ |x| ... }` (dibahas lengkap di lesson Block & yield), dan `x.even?` bernilai `true` kalau `x` bilangan genap.',
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
          'Hash menyimpan data sebagai pasangan key-value, ditulis dengan `{}`. Gaya modern (Ruby 1.9+) memakai symbol sebagai key: `siswa = { nama: "Budi", umur: 20 }`, setara dengan `{ :nama => "Budi", :umur => 20 }`. Key tidak harus symbol (string atau angka juga boleh), tapi symbol paling umum.',
          'Saat isi Hash dicetak, Ruby 2.7 (yang dipakai sandbox) menampilkan `{:nama=>"Budi", :umur=>20}`, sedangkan Ruby 3.4+ menampilkan `{nama: "Budi", umur: 20}`. Isinya sama persis, hanya tampilannya yang berbeda.',
          'Akses nilai lewat key: `siswa[:nama]`. Kalau key tidak ditemukan, hasilnya `nil` (bukan error), kecuali diatur default value lain saat membuat Hash. `.inspect` menampilkan nilai apa adanya, jadi `nil` tampil sebagai kata `nil`, bukan teks kosong.',
          'Method `.each` pada Hash memberikan pasangan key dan value sekaligus dalam block: `hash.each do |key, value| ... end`, memudahkan iterasi seluruh isi Hash.',
          '## fetch, delete, dan default value',
          '`fetch` juga mengambil nilai lewat key, tapi lebih ketat: kalau key tidak ada, `fetch` melempar `KeyError`, kecuali kamu memberi nilai cadangan, misal `siswa.fetch(:alamat, "-")` yang mengembalikan `"-"`. Pakai `[]` kalau `nil` boleh, pakai `fetch` kalau key yang hilang berarti ada yang salah.',
          '`delete(key)` menghapus pasangan itu dari Hash dan mengembalikan value-nya (atau `nil` kalau key tidak ada), sedangkan `key?(key)` mengecek apakah key ada. `Hash.new(0)` membuat Hash dengan default value 0 untuk key yang belum ada, cocok untuk menghitung kemunculan.',
          `\`\`\`ruby
siswa = { nama: "Budi", umur: 20 }

puts siswa.fetch(:nama)          # Budi
puts siswa.fetch(:alamat, "-")   # -
puts siswa.key?(:umur)           # true

umur = siswa.delete(:umur)
puts umur                        # 20
puts siswa.key?(:umur)           # false

hitung = Hash.new(0)
["apel", "jeruk", "apel"].each { |buah| hitung[buah] += 1 }
puts hitung["apel"]              # 2
puts hitung["pisang"]            # 0
\`\`\``,
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

# fetch: key tidak ada tapi ada nilai cadangan, jadi tidak error
alamat = siswa.fetch(:alamat, "-")
puts "fetch dengan nilai cadangan: #{alamat}"
puts "Ada key :kota? #{siswa.key?(:kota)}"

# delete mengembalikan value yang dihapus
kota = siswa.delete(:kota)
puts "delete mengembalikan: #{kota}"
puts "Setelah delete: #{siswa}"

# Hash.new(0): key yang belum ada bernilai 0
hitung = Hash.new(0)
["apel", "jeruk", "apel"].each { |buah| hitung[buah] += 1 }
puts "Hasil hitung: #{hitung}"
puts "Jumlah pisang: #{hitung["pisang"]}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi pada siswa.fetch(:alamat) kalau Hash siswa tidak punya key :alamat dan tidak ada nilai cadangan?', [
            ['Ruby melempar KeyError', true],
            ['Hasilnya nil, sama seperti siswa[:alamat]', false],
            ['Hasilnya string kosong, karena fetch selalu mengembalikan teks', false],
          ]),
          q('Berapa hasil hitung["pisang"] kalau hitung = Hash.new(0) dan key "pisang" belum pernah diisi?', [
            ['0', true],
            ['nil', false],
            ['KeyError, karena key-nya tidak ada', false],
          ]),
          q('Apa yang dikembalikan siswa.delete(:umur) kalau key :umur ada di Hash?', [
            ['Value yang dihapus itu', true],
            ['Hash baru tanpa key :umur, sedangkan siswa tetap utuh', false],
            ['true, sebagai tanda penghapusan berhasil', false],
          ]),
        ],
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
          'Parameter method bisa diberi nilai default, dipakai kalau pemanggil tidak memberikan argumen untuk parameter itu. Contoh: `def salam(nama = "Tamu")` — kalau dipanggil `salam` tanpa argumen, `nama` bernilai `"Tamu"`.',
          `\`\`\`ruby
def salam(nama = "Tamu")
  puts "Halo, #{nama}"
end

salam            # Halo, Tamu
salam("Budi")    # Halo, Budi
\`\`\``,
          '## Keyword argument',
          'Keyword argument diisi dengan menyebut nama parameternya saat memanggil method. Parameter keyword harus dideklarasikan dengan titik dua di belakang namanya: `def sapa(nama: "Tamu")` punya nilai default, sedangkan `def perkenalan(nama:, umur:)` tanpa nilai default berarti keyword itu wajib diisi. Urutan argumen saat memanggil bebas dan kode lebih jelas dibaca. Kalau keyword wajib tidak diisi, atau keyword yang tidak dikenal diberikan, Ruby melempar `ArgumentError`.',
          `\`\`\`ruby
def sapa(nama: "Tamu")
  puts "Halo, #{nama}"
end

sapa                  # Halo, Tamu
sapa(nama: "Budi")    # Halo, Budi

def perkenalan(nama:, umur:)
  puts "Nama: #{nama}, Umur: #{umur}"
end

perkenalan(umur: 22, nama: "Siti")   # urutan bebas
\`\`\``,
          'Yang menjadikan sebuah parameter keyword argument adalah deklarasi `nama:` di `def`, bukan cara memanggilnya. Kalau method dideklarasikan dengan parameter biasa seperti `def salam(nama = "Tamu")`, lalu dipanggil `salam(nama: "Budi")`, Ruby membungkus `nama: "Budi"` jadi satu Hash dan mengirimnya sebagai argumen biasa. Akibatnya `nama` berisi Hash itu (tercetak `{:nama=>"Budi"}` di Ruby 2.7, atau `{nama: "Budi"}` di Ruby 3.4+), bukan `"Budi"`:',
          `\`\`\`ruby
def salam(nama = "Tamu")
  puts "Halo, #{nama}"
end

salam(nama: "Budi")   # Halo, {:nama=>"Budi"} (bukan Halo, Budi)
\`\`\``,
          '## Argumen tak terbatas dengan *args',
          '`*args` menampung sejumlah argumen posisional tak terbatas jadi array — berguna untuk method yang jumlah argumennya fleksibel, misal method penjumlahan banyak angka sekaligus.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `def salam(nama = "Tamu")
  puts "Halo, #{nama}"
end

salam
salam("Budi")
# Bukan keyword argument: salam tidak mendeklarasikan "nama:", jadi ini dikirim sebagai Hash
salam(nama: "Budi")

def sapa(nama: "Tamu")
  puts "Halo, #{nama}"
end

sapa
sapa(nama: "Budi")

def perkenalan(nama:, umur:)
  puts "Nama: #{nama}, Umur: #{umur}"
end

perkenalan(nama: "Siti", umur: 22)
perkenalan(umur: 25, nama: "Dewi")

def jumlahkan_semua(*args)
  args.sum
end

puts "Jumlah semua: #{jumlahkan_semua(1, 2, 3, 4)}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Method dideklarasikan def salam(nama = "Tamu"), lalu dipanggil salam(nama: "Budi"). Apa isi nama di dalam method?', [
            ['Sebuah Hash berisi pasangan nama dan "Budi", karena method tidak mendeklarasikan nama:', true],
            ['String "Budi", karena Ruby mengenali sintaks nama: saat memanggil method', false],
            ['String "Tamu", karena argumen berlabel nama: dianggap bukan argumen', false],
            ['Tidak ada isi: Ruby melempar ArgumentError karena method tidak punya parameter keyword', false],
          ]),
          q('Bagaimana mendeklarasikan keyword argument nama yang wajib diisi, tanpa nilai default?', [
            ['def sapa(nama:)', true],
            ['def sapa(nama)', false],
            ['def sapa(:nama)', false],
            ['def sapa(nama = nil)', false],
          ]),
          q('Apa fungsi *args pada def jumlahkan_semua(*args)?', [
            ['Menampung semua argumen posisional jadi satu array', true],
            ['Menampung semua keyword argument jadi satu Hash', false],
            ['Memaksa semua argumen yang dikirim harus berupa angka', false],
          ]),
        ],
      },
      {
        title: 'Block & yield',
        slug: 'rubyfz-block-yield',
        content: [
          'Block adalah potongan kode yang bisa dilewatkan ke sebuah method, ditulis dengan `do...end` (banyak baris) atau `{...}` (satu baris) — ini salah satu ciri khas paling menonjol dari Ruby, dipakai di mana-mana termasuk `each`, `times`, `map`, `select`.',
          'Di dalam method sendiri, kata kunci `yield` memanggil block yang dilewatkan saat method itu dipanggil. `yield` juga bisa mengirim nilai ke block: `yield i` mengisi parameter block `|i|`. Ini memungkinkan kita membuat method kustom yang menerima block sendiri, mirip cara kerja `each` bawaan. Contoh di bawah memakai `n.times`, yang mengulang block sebanyak `n` kali dengan `i` mulai dari 0 (lihat lesson Perulangan).',
          `\`\`\`ruby
def ulangi(n)
  n.times do |i|
    yield i
  end
end

ulangi(3) { |i| puts "Putaran ke-#{i}" }   # putaran 0, 1, 2
\`\`\``,
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
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Awalan nama variabel menentukan jenisnya: variabel biasa (`nama`) adalah local variable, hanya bisa diakses di scope tempat ia dibuat.',
          '## Local variable dan def',
          'Aturan kuncinya: `def` membuka scope baru. Local variable yang dibuat di luar `def` tidak terlihat di dalam method, dan local variable yang dibuat di dalam method hilang begitu method selesai. Mengakses nama yang tidak dikenal menimbulkan `NameError`. Kalau method butuh data dari luar, kirim lewat parameter.',
          'Kode berikut sengaja error: saat dijalankan, Ruby melempar `NameError` karena `total` tidak dikenal di dalam `def`.',
          `\`\`\`ruby
total = 10

def tampilkan
  puts total   # NameError: total tidak dikenal di sini
end

tampilkan
\`\`\``,
          'Block (`do...end` atau `{...}`) berbeda dari `def`: block bisa melihat local variable dari scope di sekelilingnya, tapi variabel yang baru dibuat di dalam block tidak terlihat di luar block.',
          'Di contoh sandbox, `defined?(x)` dipakai untuk mengecek apakah `x` dikenal di scope itu: hasilnya kata `local-variable` kalau dikenal, dan `nil` kalau tidak. `.inspect` dipakai supaya `nil` tampil sebagai kata `nil`.',
          '## Instance variable dan global variable',
          'Instance variable diawali satu tanda `@`, misal `@nama`, dan menempel pada satu object tertentu — dipakai untuk menyimpan data milik object dalam konteks class, bisa diakses dari semua method di dalam object yang sama. Kamu akan memakainya langsung di lesson Class & Object.',
          'Global variable diawali `$`, misal `$konfigurasi`, bisa diakses dari mana saja di seluruh program, termasuk di dalam `def` — tapi penggunaannya sangat tidak disarankan karena membuat kode sulit dilacak dan rawan bug: nilainya bisa diubah dari mana saja.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `total = 10
puts "Di luar def, total: #{defined?(total)}"

def tampilkan
  status = defined?(total)
  puts "Di dalam def, total: #{status.inspect}"
end
tampilkan

def hitung_sendiri
  total = 99
  puts "Di dalam def, total milik method: #{total}"
end
hitung_sendiri
puts "total di luar tetap: #{total}"

[1, 2].each do |i|
  puts "Di dalam block, total terlihat: #{total + i}"
  dalam_block = i
end
status_block = defined?(dalam_block)
puts "dalam_block di luar block: #{status_block.inspect}"

$hitungan = 0
def tambah
  $hitungan += 1
end
tambah
tambah
puts "Global variable terlihat di mana saja: #{$hitungan}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Awalan apa yang menandai instance variable di Ruby?', [
            ['@ (satu tanda "at")', true],
            ['$ (dollar)', false],
            ['_ (underscore)', false],
            ['# (pagar)', false],
          ]),
          q('Bagaimana cara menandai global variable di Ruby?', [
            ['Diawali tanda $, misal $konfigurasi', true],
            ['Diawali tanda @, karena instance variable bisa diakses dari semua method', false],
            ['Tanpa awalan khusus: variabel yang dibuat di luar method otomatis jadi global', false],
            ['Diawali huruf kapital, misal Konfigurasi, karena nama itu terlihat di mana-mana', false],
          ]),
          q('Kenapa penggunaan global variable sebaiknya dihindari?', [
            ['Membuat kode sulit dilacak dan rawan bug, karena nilainya bisa diubah dari mana saja', true],
            ['Global variable tidak bisa diubah nilainya setelah dibuat, jadi kurang berguna', false],
            ['Global variable otomatis hilang begitu method pertama selesai dijalankan', false],
            ['Global variable hanya bisa dipakai di dalam class, bukan di program biasa', false],
          ]),
          q('Variabel total = 10 dibuat di baris paling atas file. Apa yang terjadi kalau total dipakai di dalam sebuah def?', [
            ['NameError, karena def membuka scope baru yang tidak melihat local variable di luarnya', true],
            ['Mencetak 10, karena local variable terlihat di seluruh file sejak dibuat', false],
            ['Mencetak kosong (nil), karena variabel dari luar otomatis dianggap belum diisi', false],
          ]),
          q('Variabel hasil dibuat di dalam block [1, 2].each do |i| hasil = i end. Bisakah hasil dipakai setelah block selesai?', [
            ['Tidak, variabel yang dibuat di dalam block hanya dikenal di dalam block itu', true],
            ['Bisa, karena block tidak punya scope sendiri seperti def', false],
            ['Bisa, tapi nilainya selalu nil karena block sudah selesai', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'OOP, Error Handling & Ringkasan',
    lessons: [
      {
        title: 'Class & Object',
        slug: 'rubyfz-class-object',
        content: [
          'Ruby adalah bahasa "pure object-oriented" — class dibuat dengan kata kunci `class`, ditutup dengan `end`, dan object dibuat dengan memanggil `NamaClass.new(...)`.',
          '`initialize` adalah constructor — method khusus yang otomatis dijalankan saat `.new` dipanggil, biasanya dipakai mengisi instance variable (`@atribut`) dengan nilai awal.',
          'Method didefinisikan di dalam class dengan `def`, dan dipanggil pada object lewat titik: `object.method_nya`. Instance variable (`@nama`) hanya bisa diakses dari dalam method milik object yang sama, tidak langsung dari luar class kecuali lewat method. Bagaimana satu class mewarisi isi class lain dibahas di lesson berikutnya.',
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
        title: 'Inheritance, Module & Mixin',
        slug: 'rubyfz-inheritance-module-mixin',
        content: [
          'Inheritance (pewarisan) membuat sebuah class mewarisi method dari class lain. Class yang mewarisi disebut subclass, class asalnya superclass, dan ditulis dengan `<`: `class Kucing < Hewan`. Subclass otomatis punya semua method superclass, dan boleh menambah method baru atau menimpanya (override). Ruby hanya mengizinkan satu superclass untuk tiap class, dan `object.is_a?(Hewan)` bernilai `true` untuk object dari subclass `Hewan`.',
          `\`\`\`ruby
class Hewan
  def initialize(nama)
    @nama = nama
  end

  def perkenalan
    puts "Saya #{@nama}"
  end

  def suara
    puts "..."
  end
end

class Kucing < Hewan
  def suara
    puts "Meong"
  end
end

kucing = Kucing.new("Tom")
kucing.perkenalan             # Saya Tom (diwarisi dari Hewan)
kucing.suara                  # Meong (menimpa suara milik Hewan)
puts kucing.is_a?(Hewan)      # true
\`\`\``,
          '`super` memanggil method bernama sama di superclass. Tanpa tanda kurung, `super` meneruskan argumen method saat ini; `super()` mengirim tanpa argumen, dan `super(nama)` mengirim argumen yang kamu pilih sendiri. Dengan `super`, subclass memperluas method induknya tanpa menggantinya sepenuhnya. Contoh berikut melanjutkan class `Hewan` di atas, jadi tidak berdiri sendiri:',
          `\`\`\`ruby
class Anjing < Hewan
  def initialize(nama, ras)
    super(nama)          # mengisi @nama lewat initialize milik Hewan
    @ras = ras
  end

  def perkenalan
    super                # jalankan perkenalan milik Hewan dulu
    puts "Ras saya #{@ras}"
  end
end

Anjing.new("Rex", "Labrador").perkenalan
# Saya Rex
# Ras saya Labrador
\`\`\``,
          '## Module dan mixin',
          'Module adalah kumpulan method yang tidak bisa dibuat object-nya (tidak ada `.new`), tapi bisa dicampurkan ke class lewat `include` (mixin). Karena sebuah class hanya punya satu superclass, module dipakai untuk berbagi perilaku antar class yang tidak berhubungan lewat pewarisan; class boleh meng-include banyak module. Saat sebuah method dipanggil, Ruby mencarinya di class object itu sendiri, lalu di module yang di-include (yang paling akhir di-include dicek lebih dulu), baru di superclass. `Kelas.ancestors` menampilkan urutan pencarian itu. Contoh berikut juga melanjutkan class `Hewan`:',
          `\`\`\`ruby
module Berenang
  def berenang
    puts "#{@nama} berenang"
  end
end

class Bebek < Hewan
  include Berenang
end

bebek = Bebek.new("Donal")
bebek.berenang                   # Donal berenang
puts Bebek.ancestors.inspect     # [Bebek, Berenang, Hewan, Object, Kernel, BasicObject]
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Hewan
  def initialize(nama)
    @nama = nama
  end

  def perkenalan
    puts "Saya #{@nama}"
  end

  def suara
    puts "..."
  end
end

class Kucing < Hewan
  def suara
    puts "Meong"
  end
end

class Anjing < Hewan
  def initialize(nama, ras)
    super(nama)
    @ras = ras
  end

  def perkenalan
    super
    puts "Ras saya #{@ras}"
  end

  def suara
    puts "Guk guk"
  end
end

module Berenang
  def berenang
    puts "#{@nama} berenang"
  end
end

class Bebek < Hewan
  include Berenang

  def suara
    puts "Kwek"
  end
end

hewan_hewan = [Kucing.new("Tom"), Anjing.new("Rex", "Labrador"), Bebek.new("Donal")]
hewan_hewan.each do |h|
  h.perkenalan
  h.suara
end

bebek = Bebek.new("Donal")
bebek.berenang
puts "bebek turunan Hewan? #{bebek.is_a?(Hewan)}"
puts "Urutan pencarian method: #{Bebek.ancestors}"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Bagaimana menulis class Kucing yang mewarisi class Hewan di Ruby?', [
            ['class Kucing < Hewan', true],
            ['class Kucing extends Hewan', false],
            ['class Kucing include Hewan', false],
            ['class Kucing(Hewan)', false],
          ]),
          q('Apa yang dilakukan super di dalam sebuah method milik subclass?', [
            ['Memanggil method bernama sama di superclass', true],
            ['Menghapus method milik superclass supaya hanya versi subclass yang tersisa', false],
            ['Membuat object baru dari superclass dan mengembalikannya', false],
          ]),
          q('Apa beda utama include module dengan pewarisan memakai <?', [
            ['Class hanya boleh punya satu superclass, tapi boleh meng-include banyak module', true],
            ['Module bisa dibuat object-nya dengan .new seperti class, hanya namanya yang beda', false],
            ['Method dari module selalu menimpa method bernama sama yang ditulis langsung di class', false],
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
        title: 'Error Handling: begin/rescue/ensure',
        slug: 'rubyfz-begin-rescue-ensure',
        content: [
          'Error yang muncul saat program berjalan disebut exception. Kalau tidak ditangani, exception menghentikan program. Dengan `begin`/`rescue`, kode yang berisiko ditaruh di `begin` dan penanganannya di `rescue`, ditutup dengan `end`. Setelah `rescue` kamu menyebut class error yang ingin ditangani, misal `ZeroDivisionError`: hanya error dari class itu (dan turunannya) yang ditangkap, error lain tetap menghentikan program. `=> e` menyimpan object error ke variabel `e`, sehingga `e.message` (pesan) dan `e.class` (jenis error) bisa dibaca.',
          `\`\`\`ruby
pembagi = 0

begin
  puts "100 / #{pembagi} = #{100 / pembagi}"
rescue ZeroDivisionError => e
  puts "Error: #{e.message}"
else
  puts "Tidak ada error"
ensure
  puts "Selesai (selalu dicetak)"
end
\`\`\``,
          '`else` (opsional) dijalankan hanya kalau tidak ada error di `begin`, sedangkan `ensure` (opsional) dijalankan selalu, baik ada error maupun tidak, cocok untuk "bersih-bersih" seperti menutup file. Urutannya selalu `begin`, `rescue`, `else`, `ensure`. Pada contoh di atas `pembagi` bernilai 0, jadi yang tercetak adalah pesan error lalu "Selesai". Kalau `pembagi` diganti 2, yang tercetak adalah hasil bagi, "Tidak ada error", lalu "Selesai".',
          '## Melempar error dengan raise',
          'Kamu juga bisa melempar error sendiri dengan `raise`, misal `raise ArgumentError, "umur tidak boleh negatif"`. Ini berguna di dalam method yang memeriksa inputnya, supaya pemanggil bisa menangkapnya dengan `rescue`.',
          `\`\`\`ruby
def cek_umur(umur)
  raise ArgumentError, "umur tidak boleh negatif" if umur < 0
  "umur #{umur} valid"
end

begin
  puts cek_umur(20)    # umur 20 valid
  puts cek_umur(-5)    # tidak sampai sini: raise melempar error
rescue ArgumentError => e
  puts "Error: #{e.message}"   # Error: umur tidak boleh negatif
end
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `# 1. rescue menangani error supaya program tidak berhenti
begin
  hasil = 10 / 0
  puts "Hasil: #{hasil}"
rescue ZeroDivisionError => e
  puts "Error ditangkap: #{e.message} (#{e.class})"
end

# 2. else jalan kalau tidak ada error, ensure selalu jalan
[2, 0].each do |pembagi|
  begin
    puts "100 / #{pembagi} = #{100 / pembagi}"
  rescue ZeroDivisionError
    puts "Pembagi #{pembagi} tidak valid"
  else
    puts "Tidak ada error"
  ensure
    puts "Selesai memproses pembagi #{pembagi}"
  end
end

# 3. raise melempar error sendiri
def cek_umur(umur)
  raise ArgumentError, "umur tidak boleh negatif" if umur < 0
  "umur #{umur} valid"
end

begin
  puts cek_umur(20)
  puts cek_umur(-5)
rescue ArgumentError => e
  puts "Error: #{e.message}"
end

# 4. Integer() melempar ArgumentError kalau teksnya bukan angka
begin
  Integer("abc")
rescue ArgumentError => e
  puts "Gagal mengubah ke angka: #{e.message}"
end

puts "Program tetap jalan sampai akhir"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kapan blok ensure dijalankan?', [
            ['Selalu, baik ada error maupun tidak', true],
            ['Hanya kalau terjadi error dan error itu sudah ditangani oleh rescue', false],
            ['Hanya kalau tidak ada error sama sekali di dalam begin', false],
            ['Hanya kalau error-nya tidak tertangkap oleh rescue mana pun', false],
          ]),
          q('Apa fungsi => e pada rescue ArgumentError => e?', [
            ['Menyimpan object error ke variabel e, supaya e.message dan e.class bisa dibaca', true],
            ['Membuat Ruby menangkap semua jenis error kecuali ArgumentError', false],
            ['Mengulang kode di begin terus-menerus sampai e bernilai true', false],
          ]),
          q('Kode di begin melempar ZeroDivisionError, tapi rescue hanya menyebut ArgumentError. Apa yang terjadi?', [
            ['Error tidak tertangkap, sehingga program berhenti dengan error tersebut', true],
            ['rescue ArgumentError tetap menangkapnya karena semua error dianggap sama', false],
            ['Ruby diam-diam mengabaikan error itu dan melanjutkan kode setelah begin', false],
          ]),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'rubyfz-studi-kasus-gabungan',
        content: [
          'Sebagai penutup course ini, kita gabungkan semua konsep yang sudah dipelajari: class & object, `attr_accessor`, block, dan Hash — dalam satu program kecil pengelola daftar belanja sederhana.',
          'Program di bawah membuat class `Barang` dengan `attr_accessor`, menyimpan beberapa object `Barang` dalam array, lalu memakai block (`.each`, `.sum`) untuk menghitung total belanja dan menampilkan ringkasan.',
          'Sepanjang course ini kita sudah belajar sintaks dasar, tipe data, symbol, operator, kontrol alur (`if`, `case`/`when`, perulangan), array & hash, method & block (ciri khas Ruby), scope variabel, OOP dasar (class, pewarisan, dan module), hingga penanganan error dengan `begin`/`rescue`/`ensure` — fondasi yang cukup untuk mulai membangun program Ruby yang lebih kompleks, termasuk framework seperti Ruby on Rails.',
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

const course: CourseDef = {
  title: 'Ruby from Zero',
  slug: 'ruby-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'Ruby from Zero adalah course pengantar untuk kamu yang belum pernah menulis Ruby. Ruby dirancang supaya enak ditulis dan dibaca, serta menjadi dasar framework web Ruby on Rails, jadi cocok sebagai bahasa pertama maupun batu loncatan ke web development. Pengalaman di bahasa lain membantu tapi tidak wajib.',
    'Di sini kamu belajar sintaks dasar dan `puts`, variabel dan konstanta, tipe data, symbol, operator, string interpolation, percabangan `if`/`unless` (termasuk aturan truthy dan falsy) dan `case`/`when` dengan Range, perulangan dengan `each`, `times`, dan `while`, array, hash, method dengan default dan keyword argument, block dan `yield`, scope variabel, class, object, pewarisan, module (mixin), dan `attr_accessor`, serta penanganan error dengan `begin`/`rescue`/`ensure`, ditutup dengan studi kasus yang menggabungkan semuanya. Hampir semua lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan hampir semua juga dilengkapi quiz pilihan ganda untuk menguji pemahaman.',
    'Sandbox di course ini menjalankan kode dengan Ruby 2.7, tanpa akses jaringan dan tanpa input keyboard, jadi `gets` tidak dipakai. Fitur yang lebih baru dari Ruby 2.7 tidak dipakai di contoh, dan isi Hash tercetak dalam bentuk lama `{:nama=>"Budi"}`, bukan `{nama: "Budi"}` seperti Ruby 3.4+. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun.',
  ].join('\n\n'),
  sandboxLanguage: 'ruby',
  modules,
}

export default course
