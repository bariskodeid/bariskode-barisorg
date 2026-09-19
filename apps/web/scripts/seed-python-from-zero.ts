import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "Python from Zero" — course kedua non-dummy, meniru pola
// seed-linux-from-zero.ts. Jalankan: pnpm seed:python

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
    title: 'Pengenalan Python',
    lessons: [
      {
        title: 'Apa itu Python?',
        slug: 'pfz-apa-itu-python',
        content: [
          'Python adalah bahasa pemrograman tingkat tinggi yang dibuat oleh Guido van Rossum, pertama dirilis tahun 1991. Python dikenal karena sintaksnya yang sederhana dan mudah dibaca, mirip bahasa Inggris sehari-hari.',
          'Python bersifat interpreted (bukan compiled) — kode dijalankan baris per baris oleh interpreter, tanpa proses compile terpisah sebelum dijalankan seperti C atau Java.',
          'Python dipakai luas untuk web development, data science, machine learning, automasi, dan scripting, ditopang ekosistem library pihak ketiga yang sangat besar lewat package manager `pip`.',
          'Python bersifat dynamically typed — tipe data variabel ditentukan otomatis saat runtime, tidak perlu dideklarasikan eksplisit seperti `int x` di bahasa lain.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa pencipta bahasa Python?', [
            ['Guido van Rossum', true],
            ['Linus Torvalds', false],
            ['Dennis Ritchie', false],
            ['James Gosling', false],
          ]),
          q('Python bersifat?', [
            ['Interpreted', true],
            ['Hanya compiled', false],
            ['Hanya assembly', false],
            ['Tidak bisa dijalankan tanpa compile', false],
          ]),
          q('Apa arti dynamically typed?', [
            ['Tipe data ditentukan otomatis saat runtime', true],
            ['Tipe data harus dideklarasikan eksplisit', false],
            ['Python tidak punya tipe data', false],
            ['Semua variabel harus integer', false],
          ]),
          q('Package manager resmi Python adalah?', [
            ['pip', true],
            ['npm', false],
            ['apt', false],
            ['composer', false],
          ]),
        ],
      },
      {
        title: 'Instalasi & Menjalankan Python',
        slug: 'pfz-instalasi-menjalankan-python',
        content: [
          'Python bisa dijalankan lewat interpreter interaktif (`python3` di terminal, disebut REPL) atau dengan menjalankan file `.py` lewat `python3 nama_file.py`.',
          'Setiap program Python biasanya dimulai dengan fungsi bawaan `print()` untuk menampilkan output ke layar — ini akan jadi perintah pertama yang kita coba di sandbox.',
          'Modul `sys` bawaan Python bisa dipakai untuk mengecek versi interpreter yang sedang berjalan, berguna memastikan kode kompatibel dengan versi Python tertentu.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `import sys

print("Halo, Python!")
print("Versi Python yang dipakai:", sys.version)
`,
      },
      {
        title: 'Sintaks Dasar & Komentar',
        slug: 'pfz-sintaks-dasar-komentar',
        content: [
          'Python tidak memakai kurung kurawal `{}` untuk blok kode seperti JavaScript/C — blok kode ditentukan oleh indentasi (spasi di awal baris), biasanya 4 spasi per level.',
          'Komentar satu baris ditulis dengan `#`, diabaikan sepenuhnya oleh interpreter. Komentar banyak baris (docstring) bisa ditulis dengan tiga kutip `"""..."""`.',
          'Python tidak memerlukan titik koma (`;`) di akhir baris seperti banyak bahasa lain — satu baris dianggap satu statement.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `# Ini komentar satu baris
print("Baris ini dijalankan")  # komentar di akhir baris juga bisa

"""
Ini komentar banyak baris,
sering dipakai sebagai dokumentasi.
"""
if True:
    print("Baris ini masuk blok if, ditandai indentasi")
print("Baris ini di luar blok if")
`,
      },
    ],
  },
  {
    title: 'Variabel & Tipe Data',
    lessons: [
      {
        title: 'Variabel & Penamaan',
        slug: 'pfz-variabel-penamaan',
        content: [
          'Variabel di Python dibuat langsung dengan tanda `=`, tanpa kata kunci deklarasi seperti `var`/`let`. Contoh: `nama = "Budi"` langsung membuat variabel `nama`.',
          'Aturan penamaan variabel: hanya huruf, angka, underscore (`_`), tidak boleh diawali angka, dan case-sensitive (`umur` beda dengan `Umur`). Konvensi umum Python (PEP 8) memakai `snake_case`, misal `nama_lengkap`.',
          'Python mengizinkan multiple assignment dalam satu baris, misal `a, b, c = 1, 2, 3`, memudahkan inisialisasi beberapa variabel sekaligus.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `nama = "Siswa BarisORG"
umur = 20
tinggi_badan = 165.5

print(nama, umur, tinggi_badan)

a, b, c = 1, 2, 3
print("Multiple assignment:", a, b, c)
`,
      },
      {
        title: 'Tipe Data Dasar',
        slug: 'pfz-tipe-data-dasar',
        content: [
          'Python punya beberapa tipe data dasar: `int` (bilangan bulat), `float` (bilangan desimal), `str` (teks/string), dan `bool` (True/False).',
          'Fungsi bawaan `type()` menampilkan tipe data dari sebuah nilai/variabel — berguna untuk debugging saat tidak yakin tipe data apa yang sedang dipegang oleh sebuah variabel.',
          "String di Python bisa ditulis dengan kutip tunggal `'...'` atau kutip ganda `\"...\"` — keduanya setara, tidak ada perbedaan fungsional.",
        ],
        hasSandbox: true,
        sandboxStarterCode: `angka_bulat = 10
angka_desimal = 3.14
teks = "Halo dunia"
benar_salah = True

print(type(angka_bulat))
print(type(angka_desimal))
print(type(teks))
print(type(benar_salah))
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe data apa untuk bilangan desimal di Python?', [
            ['float', true],
            ['int', false],
            ['str', false],
            ['bool', false],
          ]),
          q('Fungsi apa untuk mengecek tipe data sebuah variabel?', [
            ['type()', true],
            ['print()', false],
            ['input()', false],
            ['len()', false],
          ]),
          q('Apa saja nilai valid untuk tipe bool?', [
            ['True dan False', true],
            ['1 dan 0 saja', false],
            ['Yes dan No', false],
            ['Benar dan Salah (kata Indonesia)', false],
          ]),
          q('Manakah yang termasuk tipe data str?', [
            ['"Halo"', true],
            ['10', false],
            ['3.14', false],
            ['True', false],
          ]),
        ],
      },
      {
        title: 'Operator',
        slug: 'pfz-operator',
        content: [
          'Operator aritmatika Python: `+` tambah, `-` kurang, `*` kali, `/` bagi (hasil selalu float), `//` bagi bulat (floor division), `%` sisa bagi (modulo), `**` pangkat.',
          'Operator perbandingan: `==` sama dengan, `!=` tidak sama, `>`, `<`, `>=`, `<=` — hasilnya selalu bool (`True`/`False`).',
          'Operator logika: `and` (dan), `or` (atau), `not` (negasi) — dipakai menggabungkan beberapa kondisi boolean, mirip `&&`/`||`/`!` di bahasa lain tapi ditulis sebagai kata.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `a = 10
b = 3

print("Penjumlahan:", a + b)
print("Pembagian biasa:", a / b)
print("Pembagian bulat:", a // b)
print("Sisa bagi:", a % b)
print("Pangkat:", a ** 2)

print("Perbandingan a > b:", a > b)
print("Logika a > b and b > 0:", a > b and b > 0)
`,
      },
      {
        title: 'Type Casting & Input',
        slug: 'pfz-type-casting-input',
        content: [
          'Type casting mengubah nilai dari satu tipe data ke tipe lain, misal `int("10")` mengubah string `"10"` jadi angka integer `10`. Fungsi bawaan: `int()`, `float()`, `str()`, `bool()`.',
          'Casting penting karena Python tidak otomatis mengubah tipe data saat operasi campuran — menjumlahkan string dan integer langsung (`"10" + 5`) akan menghasilkan error `TypeError`.',
          'Fungsi `input()` membaca input teks dari pengguna, selalu mengembalikan tipe `str` — kalau butuh angka, hasilnya harus di-casting dulu dengan `int()` atau `float()`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `angka_teks = "25"
angka = int(angka_teks)
print("Setelah casting jadi int:", angka, type(angka))

nilai_desimal = float("3.14")
print("Setelah casting jadi float:", nilai_desimal, type(nilai_desimal))

angka_ke_teks = str(100)
print("Setelah casting jadi str:", angka_ke_teks, type(angka_ke_teks))
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi apa untuk mengubah string jadi integer?', [
            ['int()', true],
            ['str()', false],
            ['float()', false],
            ['bool()', false],
          ]),
          q('Apa yang terjadi kalau menjumlahkan string dan integer langsung di Python?', [
            ['TypeError', true],
            ['Otomatis digabung jadi string', false],
            ['Otomatis dihitung sebagai angka', false],
            ['Program tetap jalan tanpa masalah', false],
          ]),
          q('Fungsi input() selalu mengembalikan tipe data apa?', [
            ['str', true],
            ['int', false],
            ['float', false],
            ['bool', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Struktur Data & Kontrol Alur',
    lessons: [
      {
        title: 'Percabangan if/elif/else',
        slug: 'pfz-percabangan-if-elif-else',
        content: [
          'Percabangan `if` menjalankan blok kode hanya jika kondisi bernilai `True`. `elif` (else if) mengecek kondisi tambahan kalau `if` sebelumnya `False`. `else` menjalankan blok kalau semua kondisi di atasnya `False`.',
          'Blok kode ditentukan indentasi (bukan `{}`), dan tiap baris kondisi diakhiri titik dua (`:`).',
          'Python juga punya conditional expression (ternary) singkat: `hasil = "lulus" if nilai >= 60 else "gagal"` — satu baris menggantikan if/else penuh untuk kasus sederhana.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `nilai = 75

if nilai >= 90:
    print("Grade A")
elif nilai >= 75:
    print("Grade B")
elif nilai >= 60:
    print("Grade C")
else:
    print("Tidak lulus")

status = "lulus" if nilai >= 60 else "gagal"
print("Status:", status)
`,
        hasQuiz: true,
        quizQuestions: [
          q("Kata kunci apa untuk 'else if' di Python?", [
            ['elif', true],
            ['elseif', false],
            ['else if', false],
            ['elsif', false],
          ]),
          q('Blok kode di Python ditentukan oleh?', [
            ['Indentasi', true],
            ['Kurung kurawal {}', false],
            ['Titik koma', false],
            ['Tanda kurung ()', false],
          ]),
          q('Apa fungsi else dalam percabangan?', [
            ['Dijalankan kalau semua kondisi di atasnya False', true],
            ['Selalu dijalankan', false],
            ['Dijalankan sebelum if', false],
            ['Menghentikan program', false],
          ]),
        ],
      },
      {
        title: 'Perulangan for & while',
        slug: 'pfz-perulangan-for-while',
        content: [
          '`for` di Python biasa dipakai mengulang tiap item dalam sebuah sequence (list, string, range), bukan sekadar counter seperti bahasa lain. Contoh: `for i in range(5):` mengulang 5 kali dengan `i` bernilai 0 sampai 4.',
          '`while` mengulang selama kondisi masih `True`, cocok kalau jumlah pengulangan tidak diketahui di awal. Pastikan ada perubahan kondisi di dalam loop supaya tidak infinite loop.',
          '`break` menghentikan loop lebih awal, `continue` melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `for i in range(5):
    if i == 3:
        continue
    print("Iterasi for ke-", i)

hitung = 0
while hitung < 3:
    print("Iterasi while ke-", hitung)
    hitung += 1
`,
      },
      {
        title: 'List, Tuple, Dictionary',
        slug: 'pfz-list-tuple-dictionary',
        content: [
          'List adalah kumpulan data terurut yang bisa diubah (mutable), ditulis dengan `[]`, contoh: `buah = ["apel", "jeruk", "mangga"]`. Akses item dengan index dimulai dari 0: `buah[0]`.',
          'Tuple mirip list tapi tidak bisa diubah setelah dibuat (immutable), ditulis dengan `()`, cocok untuk data yang memang tidak boleh berubah, misal koordinat `(x, y)`.',
          'Dictionary menyimpan data sebagai pasangan key-value, ditulis dengan `{}`, contoh: `siswa = {"nama": "Budi", "umur": 20}`. Akses nilai lewat key: `siswa["nama"]`, bukan index angka.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `buah = ["apel", "jeruk", "mangga"]
print("List buah:", buah)
print("Item pertama:", buah[0])
buah.append("pisang")
print("Setelah append:", buah)

koordinat = (10, 20)
print("Tuple koordinat:", koordinat)

siswa = {"nama": "Budi", "umur": 20}
print("Nama siswa:", siswa["nama"])
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe data mana yang immutable (tidak bisa diubah setelah dibuat)?', [
            ['tuple', true],
            ['list', false],
            ['dict', false],
            ['string biasa juga mutable', false],
          ]),
          q('Bagaimana cara mengakses value di dictionary lewat key "nama"?', [
            ['siswa["nama"]', true],
            ['siswa.nama', false],
            ['siswa(0)', false],
            ['siswa[0]', false],
          ]),
          q('List di Python ditulis dengan tanda kurung apa?', [
            ['[]', true],
            ['()', false],
            ['{}', false],
            ['<>', false],
          ]),
          q('Method apa untuk menambah item ke akhir list?', [
            ['append()', true],
            ['add()', false],
            ['push()', false],
            ['insert()', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Fungsi & Modularitas',
    lessons: [
      {
        title: 'Membuat Fungsi',
        slug: 'pfz-membuat-fungsi',
        content: [
          'Fungsi didefinisikan dengan kata kunci `def`, diikuti nama fungsi dan parameter dalam kurung, ditutup titik dua. Fungsi memudahkan kita menulis kode sekali lalu memakainya berulang kali.',
          '`return` mengembalikan nilai dari fungsi ke pemanggilnya, sekaligus menghentikan eksekusi fungsi di titik itu. Fungsi tanpa `return` otomatis mengembalikan `None`.',
          'Memanggil fungsi cukup dengan nama fungsi diikuti kurung berisi argumen, misal `hasil = tambah(5, 3)`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `def tambah(a, b):
    return a + b

def sapa(nama):
    print("Halo,", nama)

hasil = tambah(5, 3)
print("Hasil tambah:", hasil)
sapa("Siswa BarisORG")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk mendefinisikan fungsi di Python?', [
            ['def', true],
            ['function', false],
            ['func', false],
            ['define', false],
          ]),
          q('Apa yang dikembalikan fungsi tanpa return eksplisit?', [
            ['None', true],
            ['0', false],
            ['Error', false],
            ['String kosong', false],
          ]),
          q('Apa fungsi dari return dalam sebuah fungsi?', [
            ['Mengembalikan nilai & menghentikan eksekusi fungsi', true],
            ['Mencetak nilai ke layar', false],
            ['Membuat variabel global', false],
            ['Menghapus fungsi', false],
          ]),
        ],
      },
      {
        title: 'Parameter & Default Argument',
        slug: 'pfz-parameter-default-argument',
        content: [
          'Parameter fungsi bisa diberi nilai default, dipakai kalau pemanggil tidak memberikan argumen untuk parameter itu. Contoh: `def sapa(nama="Tamu"):` — kalau dipanggil `sapa()` tanpa argumen, `nama` bernilai `"Tamu"`.',
          'Python juga mendukung keyword argument — memanggil fungsi dengan menyebut nama parameternya langsung, misal `sapa(nama="Budi")`, urutan argumen jadi tidak wajib sama dengan urutan parameter.',
          '`*args` menampung sejumlah argumen posisional tak terbatas jadi tuple, `**kwargs` menampung argumen keyword tak terbatas jadi dictionary — berguna untuk fungsi yang jumlah argumennya fleksibel.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `def sapa(nama="Tamu"):
    print("Halo,", nama)

sapa()
sapa("Budi")
sapa(nama="Siti")

def jumlahkan_semua(*args):
    return sum(args)

print("Jumlah semua:", jumlahkan_semua(1, 2, 3, 4))
`,
      },
      {
        title: 'Scope Variabel',
        slug: 'pfz-scope-variabel',
        content: [
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Variabel yang dibuat di dalam fungsi disebut local variable, hanya bisa diakses di dalam fungsi itu sendiri.',
          'Variabel yang dibuat di luar semua fungsi disebut global variable, bisa dibaca dari mana saja termasuk di dalam fungsi — tapi untuk mengubah nilainya dari dalam fungsi, perlu kata kunci `global`.',
          'Praktik yang baik: hindari terlalu banyak variabel global karena membuat kode sulit dilacak alurnya — lebih baik lewatkan data lewat parameter dan return value fungsi.',
          'Catatan: topik ini abstrak dan sulit didemonstrasikan lewat satu potongan skrip sandbox singkat tanpa membingungkan, jadi dipelajari lewat penjelasan dan quiz konsep.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Variabel yang dibuat di dalam fungsi disebut?', [
            ['local variable', true],
            ['global variable', false],
            ['static variable', false],
            ['public variable', false],
          ]),
          q('Kata kunci apa untuk mengubah nilai variabel global dari dalam fungsi?', [
            ['global', true],
            ['local', false],
            ['static', false],
            ['extern', false],
          ]),
          q('Kenapa sebaiknya menghindari terlalu banyak variabel global?', [
            ['Membuat kode sulit dilacak alurnya', true],
            ['Python tidak mendukung variabel global', false],
            ['Variabel global selalu error', false],
            ['Variabel global lebih lambat dieksekusi', false],
          ]),
        ],
      },
      {
        title: 'Import Module Bawaan',
        slug: 'pfz-import-module-bawaan',
        content: [
          'Python punya banyak modul bawaan (standard library) yang bisa langsung dipakai dengan `import`, tanpa perlu install tambahan. Contoh: `math` untuk fungsi matematika, `random` untuk angka acak, `datetime` untuk tanggal/waktu.',
          'Setelah `import math`, semua fungsi di dalamnya diakses dengan `math.nama_fungsi()`, misal `math.sqrt(16)` untuk akar kuadrat.',
          'Untuk library pihak ketiga (bukan bawaan), dipasang lewat package manager `pip install nama_paket` — tapi sandbox latihan ini fokus ke modul bawaan karena sandbox tidak punya akses jaringan untuk instalasi paket baru.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `import math
import random

print("Akar kuadrat dari 16:", math.sqrt(16))
print("Nilai pi:", math.pi)

random.seed(42)
print("Angka acak 1-10:", random.randint(1, 10))
`,
        hasQuiz: true,
        quizQuestions: [
          q('Kata kunci apa untuk memakai modul bawaan Python?', [
            ['import', true],
            ['include', false],
            ['require', false],
            ['use', false],
          ]),
          q('Modul apa yang dipakai untuk fungsi matematika seperti akar kuadrat?', [
            ['math', true],
            ['random', false],
            ['datetime', false],
            ['sys', false],
          ]),
          q('Bagaimana cara memasang library pihak ketiga di Python?', [
            ['pip install nama_paket', true],
            ['import otomatis dari internet', false],
            ['apt install python', false],
            ['Tidak bisa dipasang', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Error Handling & OOP Dasar',
    lessons: [
      {
        title: 'Exception Handling',
        slug: 'pfz-exception-handling',
        content: [
          'Exception adalah error yang terjadi saat program berjalan (runtime), misal membagi dengan nol atau mengakses key dictionary yang tidak ada. Tanpa penanganan, exception akan menghentikan program secara paksa.',
          'Blok `try`/`except` menangkap exception supaya program tidak crash — kode yang berpotensi error ditaruh di `try`, penanganannya di `except`.',
          'Bisa menangkap tipe exception spesifik, misal `except ZeroDivisionError:`, supaya penanganan lebih tepat sasaran dibanding menangkap semua error secara umum. Blok `finally` (opsional) selalu dijalankan baik ada error maupun tidak.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `def bagi(a, b):
    try:
        hasil = a / b
        print("Hasil bagi:", hasil)
    except ZeroDivisionError:
        print("Error: tidak bisa membagi dengan nol")
    finally:
        print("Percobaan pembagian selesai")

bagi(10, 2)
bagi(10, 0)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Blok apa yang menangkap exception supaya program tidak crash?', [
            ['except', true],
            ['try saja tanpa except', false],
            ['finally', false],
            ['def', false],
          ]),
          q('Kapan blok finally dijalankan?', [
            ['Selalu dijalankan baik ada error maupun tidak', true],
            ['Hanya kalau ada error', false],
            ['Hanya kalau tidak ada error', false],
            ['Tidak pernah dijalankan otomatis', false],
          ]),
          q('Exception apa yang terjadi saat membagi dengan nol?', [
            ['ZeroDivisionError', true],
            ['TypeError', false],
            ['KeyError', false],
            ['ImportError', false],
          ]),
        ],
      },
      {
        title: 'String Formatting & Manipulasi',
        slug: 'pfz-string-formatting-manipulasi',
        content: [
          'f-string (format string) adalah cara modern memasukkan variabel ke dalam string, ditulis `f"...{variabel}..."` — lebih ringkas dibanding penggabungan string manual dengan `+`.',
          'Method string umum: `.upper()`/`.lower()` mengubah huruf besar/kecil, `.strip()` menghapus spasi di awal/akhir, `.split()` memecah string jadi list berdasarkan pemisah, `.join()` menggabungkan list jadi string.',
          'String di Python bisa di-slice seperti list, misal `teks[0:5]` mengambil karakter indeks 0 sampai 4 — berguna untuk mengambil sebagian teks.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `nama = "budi"
umur = 20

print(f"Nama: {nama.upper()}, Umur: {umur} tahun")

kalimat = "  Belajar Python itu menyenangkan  "
print("Setelah strip:", kalimat.strip())

kata = kalimat.strip().split(" ")
print("Setelah split:", kata)
print("Setelah join dengan '-':", "-".join(kata))

print("Slice 6 karakter pertama:", "Python from Zero"[0:6])
`,
      },
      {
        title: 'Pengenalan OOP: Class & Object',
        slug: 'pfz-oop-class-object',
        content: [
          'Object-Oriented Programming (OOP) mengorganisir kode ke dalam class (cetakan/blueprint) dan object (instance dari class). Class dibuat dengan kata kunci `class`, object dibuat dengan memanggil class seperti fungsi.',
          '`__init__` adalah constructor — method khusus yang otomatis dijalankan saat object baru dibuat, biasanya dipakai untuk mengisi nilai awal atribut object. Parameter pertama tiap method class selalu `self`, merujuk ke object itu sendiri.',
          'Atribut adalah data yang dimiliki object (misal `nama`, `umur`), sedangkan method adalah fungsi yang dimiliki object (misal `perkenalan()`). Akses keduanya lewat titik: `object.atribut`, `object.method()`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `class Siswa:
    def __init__(self, nama, umur):
        self.nama = nama
        self.umur = umur

    def perkenalan(self):
        print(f"Halo, saya {self.nama}, umur {self.umur} tahun")

siswa1 = Siswa("Budi", 20)
siswa2 = Siswa("Siti", 22)

siswa1.perkenalan()
siswa2.perkenalan()
`,
        hasQuiz: true,
        quizQuestions: [
          q('Method khusus apa yang otomatis jalan saat object baru dibuat?', [
            ['__init__', true],
            ['__start__', false],
            ['__new__', false],
            ['__main__', false],
          ]),
          q('Parameter pertama tiap method class di Python selalu bernama?', [
            ['self', true],
            ['this', false],
            ['obj', false],
            ['me', false],
          ]),
          q('Apa perbedaan class dan object?', [
            ['Class adalah cetakan, object adalah instance-nya', true],
            ['Class dan object adalah hal yang sama', false],
            ['Object selalu lebih besar dari class', false],
            ['Class hanya untuk angka', false],
          ]),
        ],
      },
      {
        title: 'List Comprehension & Ringkasan',
        slug: 'pfz-list-comprehension-ringkasan',
        content: [
          'List comprehension adalah cara ringkas membuat list baru dari list/sequence lain dalam satu baris, ditulis `[ekspresi for item in sequence]`, opsional ditambah kondisi `if`.',
          'Contoh: `[x**2 for x in range(5)]` menghasilkan list kuadrat dari 0 sampai 4, setara dengan loop `for` biasa tapi lebih ringkas dan sering lebih cepat dieksekusi.',
          'Sepanjang course ini kita sudah belajar sintaks dasar, tipe data, kontrol alur, fungsi, error handling, hingga OOP dasar — fondasi yang cukup untuk mulai membangun program Python yang lebih kompleks.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `kuadrat = [x**2 for x in range(5)]
print("Kuadrat 0-4:", kuadrat)

genap = [x for x in range(10) if x % 2 == 0]
print("Angka genap 0-9:", genap)

kata = ["python", "from", "zero"]
huruf_besar = [k.upper() for k in kata]
print("Diubah jadi huruf besar:", huruf_besar)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa kegunaan list comprehension?', [
            ['Membuat list baru secara ringkas dalam satu baris', true],
            ['Menghapus semua item dalam list', false],
            ['Mengubah list jadi dictionary', false],
            ['Membuat class baru', false],
          ]),
          q('Bagaimana syntax dasar list comprehension?', [
            ['[ekspresi for item in sequence]', true],
            ['{ekspresi for item in sequence} selalu dictionary', false],
            ['(ekspresi for item in sequence) selalu list', false],
            ['for item in sequence: ekspresi', false],
          ]),
          q('List comprehension [x for x in range(10) if x % 2 == 0] menghasilkan apa?', [
            ['Semua angka genap dari 0 sampai 9', true],
            ['Semua angka ganjil', false],
            ['Semua angka dari 0 sampai 10', false],
            ['Error', false],
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
      title: 'Python from Zero',
      slug: 'python-from-zero',
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
            ? { sandboxLanguage: 'python', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "Python from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
