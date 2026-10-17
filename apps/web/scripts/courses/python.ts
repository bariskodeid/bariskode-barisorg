import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan Python',
    lessons: [
      {
        title: 'Apa itu Python?',
        slug: 'pfz-apa-itu-python',
        content: [
          'Python adalah bahasa pemrograman tingkat tinggi yang dibuat oleh Guido van Rossum, pertama dirilis tahun 1991. Python dikenal karena sintaksnya yang sederhana dan mudah dibaca, mirip bahasa Inggris sehari-hari.',
          'Python termasuk bahasa interpreted: file `.py` bisa langsung dijalankan tanpa langkah compile manual seperti `gcc` di C atau `javac` di Java. Tapi di balik layar, CPython (interpreter standar Python) lebih dulu meng-compile seluruh isi file ke bytecode, baru bytecode itu dijalankan oleh virtual machine-nya. Jadi file tidak dibaca dan dieksekusi satu baris demi satu baris dari atas.',
          'Akibatnya, satu kesalahan sintaks di mana pun dalam file menggagalkan seluruh program sebelum satu baris pun berjalan. Pada contoh berikut (sengaja salah: kurung `print` di baris kedua tidak ditutup), baris pertama sebenarnya benar, tapi `"halo"` tidak pernah tercetak karena Python menolak file itu dengan `SyntaxError`.',
          `\`\`\`python
print("halo")
print("baris dua"
print("baris tiga")
\`\`\``,
          'Python dipakai luas untuk web development, data science, machine learning, automasi, dan scripting, ditopang ekosistem library pihak ketiga yang sangat besar lewat `pip`, installer paket standar Python.',
          'Python bersifat dynamically typed — tipe melekat pada nilai, bukan pada variabel, dan baru dicek saat program berjalan (runtime). Variabel tidak perlu dideklarasikan dengan tipe seperti `int x` di bahasa lain, dan nama yang sama bisa menunjuk ke nilai bertipe lain di lain waktu.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa pencipta bahasa Python?', [
            ['Guido van Rossum', true],
            ['Linus Torvalds', false],
            ['Dennis Ritchie', false],
            ['James Gosling', false],
          ]),
          q('Bagaimana CPython menjalankan sebuah file .py?', [
            ['Meng-compile seluruh file ke bytecode lebih dulu, lalu bytecode dijalankan oleh virtual machine', true],
            ['Membaca dan mengeksekusi satu baris demi satu baris tanpa memeriksa baris berikutnya lebih dulu', false],
            ['Mengubah file jadi executable mesin lewat compiler terpisah yang harus dijalankan manual', false],
          ]),
          q('Apa arti Python bersifat dynamically typed?', [
            ['Tipe melekat pada nilai dan dicek saat program berjalan, variabel tidak perlu dideklarasikan dengan tipe', true],
            ['Tipe variabel harus dideklarasikan sekali dan tidak boleh berubah setelahnya', false],
            ['Kesalahan tipe sudah ketahuan sebelum program dijalankan, saat proses compile', false],
            ['Python tidak punya tipe data, semua nilai diperlakukan sebagai teks', false],
          ]),
          q('Sebuah file .py berisi print("halo") di baris pertama dan SyntaxError di baris kedua. Apa yang terjadi saat file dijalankan?', [
            ['Tidak ada yang tercetak: seluruh file ditolak dengan SyntaxError sebelum baris pertama berjalan', true],
            ['"halo" tercetak dulu, baru error muncul saat sampai di baris kedua', false],
            ['Baris yang salah dilewati dan baris lainnya tetap dijalankan', false],
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
          'Untuk mencoba Python di komputer sendiri, pastikan Python 3 sudah terpasang. Cek dengan perintah berikut di terminal (di Windows bisa `python --version` atau `py --version` di Command Prompt/PowerShell):',
          '```bash\npython3 --version\n```',
          '## Memasang Python',
          '- Windows: unduh installer dari situs resmi python.org, lalu centang opsi **Add python.exe to PATH** sebelum menekan Install Now supaya perintah `python` dikenali di terminal.\n- macOS: unduh installer dari python.org, atau pasang lewat Homebrew dengan `brew install python`.\n- Linux: biasanya Python 3 sudah terpasang; kalau belum, pasang lewat package manager distro, misal `sudo apt install python3` di Debian/Ubuntu.',
          '## Interpreter interaktif (REPL)',
          'Ketik `python3` di terminal tanpa argumen untuk masuk ke REPL (Read-Eval-Print Loop). Prompt `>>>` menandakan Python siap menerima perintah satu per satu dan langsung menampilkan hasilnya. Keluar dengan `exit()` atau tombol Ctrl+D (Ctrl+Z lalu Enter di Windows).',
          '```plaintext\n$ python3\n>>> print("Halo, Python!")\nHalo, Python!\n>>> 2 + 3\n5\n>>> exit()\n```',
          '## Menjalankan file .py',
          'Untuk program yang lebih panjang, simpan kode di sebuah file, misal `halo.py`, lalu jalankan dari folder tempat file itu berada. Sandbox di course ini melakukan hal yang sama, memakai Python 3.8:',
          '```bash\npython3 halo.py\n```',
          'Setiap program Python biasanya dimulai dengan fungsi bawaan `print()` untuk menampilkan output ke layar — ini akan jadi perintah pertama yang kita coba di sandbox. Modul `sys` bawaan Python bisa dipakai untuk mengecek versi interpreter yang sedang berjalan lewat `sys.version`, berguna memastikan kode kompatibel dengan versi Python tertentu.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `import sys

print("Halo, Python!")
print("Versi Python yang dipakai:", sys.version)
print("Versi singkat:", sys.version_info.major, sys.version_info.minor)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa arti prompt >>> yang muncul setelah mengetik python3 di terminal tanpa argumen?', [
            ['Interpreter interaktif (REPL) siap menerima perintah satu per satu', true],
            ['Python sedang menjalankan sebuah file .py', false],
            ['Kode sebelumnya error dan Python menunggu perbaikan', false],
          ]),
          q('Bagaimana cara menjalankan file bernama halo.py dari terminal?', [
            ['python3 halo.py', true],
            ['python3 halo', false],
            ['import halo.py', false],
            ['pip run halo.py', false],
          ]),
          q('Bagaimana mengecek versi interpreter yang sedang menjalankan kode kita dari dalam program Python?', [
            ['import sys lalu print(sys.version)', true],
            ['print(python.version)', false],
            ['print(version())', false],
            ['pip install sys lalu print(sys.version)', false],
          ]),
        ],
      },
      {
        title: 'Sintaks Dasar & Komentar',
        slug: 'pfz-sintaks-dasar-komentar',
        content: [
          '## Indentasi',
          'Python tidak memakai kurung kurawal `{}` untuk blok kode seperti JavaScript/C — blok kode ditentukan oleh indentasi (spasi di awal baris), konvensinya 4 spasi per level. Semua baris dalam satu blok harus punya indentasi yang konsisten, kalau tidak Python melempar `IndentationError`.',
          `\`\`\`python
if True:
    print("Masuk blok if (indentasi 4 spasi)")
print("Di luar blok if")
\`\`\``,
          'Python tidak memerlukan titik koma (`;`) di akhir baris seperti banyak bahasa lain — satu baris umumnya satu statement. Titik koma hanya dipakai kalau ingin menaruh beberapa statement dalam satu baris, dan itu jarang dianjurkan.',
          '## Komentar',
          'Komentar satu baris ditulis dengan `#` dan diabaikan sepenuhnya oleh interpreter sampai akhir baris. Python tidak punya sintaks khusus untuk komentar banyak baris: untuk komentar panjang, awali setiap barisnya dengan `#`. Tanda `#` di dalam string hanyalah karakter biasa, bukan komentar.',
          `\`\`\`python
# Ini komentar satu baris
print("Halo")  # komentar di akhir baris juga bisa
# Komentar panjang ditulis
# dengan # di setiap barisnya
teks = "# ini bukan komentar, karena ada di dalam string"
\`\`\``,
          '## Docstring bukan komentar',
          'Tiga kutip `"""..."""` sering dipakai seperti komentar banyak baris, padahal itu string literal biasa. Kalau string itu muncul sebagai statement pertama di sebuah module, fungsi, atau class, ia disebut docstring: dikenali compiler dan disimpan di atribut `__doc__`, jadi bisa dibaca lewat `.__doc__` atau `help()`. Kalau muncul di tempat lain, string itu hanya nilai yang dibuat lalu dibuang, tidak berefek apa-apa dan bukan komentar.',
          `\`\`\`python
def sapa(nama):
    """Mencetak salam untuk satu orang."""
    print("Halo,", nama)

print(sapa.__doc__)
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `# Ini komentar satu baris
print("Baris ini dijalankan")  # komentar di akhir baris juga bisa
teks = "# ini bukan komentar, karena ada di dalam string"
print(teks)

# Komentar panjang ditulis
# dengan # di setiap barisnya.


def sapa(nama):
    """Mencetak salam untuk satu orang (ini docstring)."""
    print("Halo,", nama)


sapa("Siswa BarisORG")
print("Docstring sapa:", sapa.__doc__)

# Tiga kutip di bawah ini BUKAN komentar: hanya string yang dibuat lalu dibuang
"""
String ini bukan docstring (bukan statement pertama di file)
dan tidak berpengaruh apa-apa.
"""
if True:
    print("Baris ini masuk blok if, ditandai indentasi")
print("Baris ini di luar blok if")
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa sebenarnya """...""" (tiga kutip) di Python?', [
            ['String literal biasa; disebut docstring kalau jadi statement pertama di module, fungsi, atau class', true],
            ['Sintaks resmi komentar banyak baris yang diabaikan sepenuhnya oleh interpreter', false],
            ['Komentar banyak baris yang hanya valid di dalam fungsi', false],
          ]),
          q('Bagaimana cara menulis komentar satu baris di Python?', [
            ['# komentar', true],
            ['// komentar', false],
            ['/* komentar */', false],
            ['-- komentar', false],
          ]),
          q('Fungsi sapa punya string """Mencetak salam.""" sebagai statement pertamanya. Apa hasil print(sapa.__doc__)?', [
            ['Mencetak salam.', true],
            ['None, karena komentar diabaikan sepenuhnya oleh interpreter', false],
            ['AttributeError, karena fungsi tidak punya atribut __doc__', false],
          ]),
        ],
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
            ['true dan false (huruf kecil)', false],
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
        title: 'String Formatting & Manipulasi',
        slug: 'pfz-string-formatting-manipulasi',
        content: [
          'String (`str`) adalah urutan karakter. Setiap karakter punya index yang dimulai dari 0, dan index negatif menghitung dari belakang: `-1` adalah karakter terakhir. Fungsi `len()` mengembalikan jumlah karakter.',
          `\`\`\`python
kata = "Python"
print(kata[0])    # P
print(kata[-1])   # n
print(len(kata))  # 6
\`\`\``,
          '## Slicing',
          'Slicing `teks[awal:akhir]` mengambil karakter dari index awal sampai sebelum index akhir (karakter di index akhir tidak ikut). Salah satu batas boleh dikosongkan: `teks[:2]` berarti dari awal, `teks[4:]` berarti sampai akhir.',
          `\`\`\`python
kata = "Python"
print(kata[0:2])  # Py
print(kata[:2])   # Py
print(kata[4:])   # on
print(kata[-2:])  # on
\`\`\``,
          'String bersifat immutable: isinya tidak bisa diubah lewat index, jadi `kata[0] = "J"` menghasilkan `TypeError`. Kalau butuh string yang berbeda, buat string baru, misal `"J" + kata[1:]`.',
          '## Method string',
          'Method string umum: `.upper()`/`.lower()` mengubah huruf besar/kecil, `.strip()` menghapus spasi di awal/akhir, `.split()` memecah string jadi list (kumpulan item yang dibahas lebih lanjut di lesson List, Tuple, Dictionary), `.join()` menggabungkan list jadi string.',
          '## f-string',
          'f-string (format string) adalah cara modern memasukkan variabel ke dalam string, ditulis `f"...{variabel}..."` — lebih ringkas dibanding penggabungan string manual dengan `+`. Di dalam `{}` boleh ada ekspresi dan spesifikasi format, misal `{harga:.2f}` untuk menampilkan 2 angka desimal.',
          `\`\`\`python
nama = "budi"
umur = 20
print(f"Nama: {nama.upper()}, umur {umur} tahun")

harga = 12.5
print(f"Harga: {harga:.2f}")  # Harga: 12.50
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `kata = "Python"
print("Karakter pertama:", kata[0])
print("Karakter terakhir:", kata[-1])
print("Panjang string:", len(kata))
print("Slice [0:2]:", kata[0:2])
print("Slice [4:]:", kata[4:])

# kata[0] = "J"  # hapus tanda # di awal untuk melihat TypeError: string immutable
baru = "J" + kata[1:]
print("String baru:", baru)

nama = "budi"
umur = 20
print(f"Nama: {nama.upper()}, Umur: {umur} tahun")

harga = 12.5
print(f"Harga: {harga:.2f}")

kalimat = "  Belajar Python itu menyenangkan  "
print("Setelah strip:", kalimat.strip())

daftar_kata = kalimat.strip().split(" ")
print("Setelah split:", daftar_kata)
print("Setelah join dengan '-':", "-".join(daftar_kata))
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa hasil dari "Python"[-1]?', [
            ['n', true],
            ['P', false],
            ['o', false],
            ['IndexError, karena index negatif tidak valid', false],
          ]),
          q('Apa hasil dari "Python"[0:2]?', [
            ['Py', true],
            ['Pyt', false],
            ['yt', false],
            ['P', false],
          ]),
          q('Apa yang terjadi pada kode kata = "Python" lalu kata[0] = "J"?', [
            ['TypeError, karena string bersifat immutable', true],
            ['kata berubah menjadi "Jython"', false],
            ['Tidak ada error, tapi kata tetap "Python"', false],
            ['IndexError, karena index 0 sudah terisi', false],
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
          'Python otomatis mengubah tipe pada operasi campuran angka: kalau `int` dan `float` dicampur, `int`-nya otomatis dijadikan float, sehingga `3 + 2.5` menghasilkan `5.5` bertipe `float`. Yang tidak otomatis adalah campuran string dan angka: `"10" + 5` menghasilkan `TypeError` karena Python tidak tahu apakah harus menggabungkan teks atau menjumlahkan angka. Di sinilah casting dibutuhkan: `int("10") + 5` atau `"10" + str(5)`.',
          `\`\`\`python
print(3 + 2.5)         # 5.5 (int otomatis jadi float)
print(int("10") + 5)   # 15
print("10" + str(5))   # 105
\`\`\``,
          'Casting bisa gagal: `int("abc")` dan `int("3.14")` menghasilkan `ValueError` karena teksnya bukan bilangan bulat yang valid. Perhatikan juga `int(3.9)` tidak membulatkan, melainkan memotong bagian desimal menjadi `3`.',
          'Fungsi `input()` membaca input teks dari pengguna, selalu mengembalikan tipe `str` — kalau butuh angka, hasilnya harus di-casting dulu dengan `int()` atau `float()`. Contoh berikut butuh input dari keyboard, jadi tidak jalan di sandbox (sandbox tidak punya stdin); coba di terminal lokal.',
          `\`\`\`python
umur_teks = input("Umur: ")
umur = int(umur_teks)
print("Tahun depan:", umur + 1)
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `angka_teks = "25"
angka = int(angka_teks)
print("Setelah casting jadi int:", angka, type(angka))

nilai_desimal = float("3.14")
print("Setelah casting jadi float:", nilai_desimal, type(nilai_desimal))

angka_ke_teks = str(100)
print("Setelah casting jadi str:", angka_ke_teks, type(angka_ke_teks))

# int + float: otomatis jadi float, tidak perlu casting
campuran = 3 + 2.5
print("int + float:", campuran, type(campuran))

# str + int: tidak otomatis, harus di-casting dulu
print('int("10") + 5 =', int("10") + 5)
print('"10" + str(5) =', "10" + str(5))
# print("10" + 5)  # hapus tanda # di awal untuk melihat TypeError

# int() memotong bagian desimal, tidak membulatkan
print("int(3.9) =", int(3.9))
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi apa untuk mengubah string jadi integer?', [
            ['int()', true],
            ['str()', false],
            ['float()', false],
            ['bool()', false],
          ]),
          q('Apa yang terjadi kalau menjumlahkan string dan integer langsung di Python, misalnya "10" + 5?', [
            ['TypeError', true],
            ['Hasilnya string "105"', false],
            ['Hasilnya integer 15', false],
          ]),
          q('Apa tipe hasil dari 3 + 2.5?', [
            ['float', true],
            ['int, karena hasilnya dibulatkan', false],
            ['TypeError, karena int dan float tidak boleh dicampur', false],
          ]),
          q('Fungsi input() selalu mengembalikan tipe data apa?', [
            ['str', true],
            ['int kalau yang diketik angka, str kalau yang diketik teks', false],
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
          '## break dan continue',
          '`break` menghentikan loop sepenuhnya begitu dijalankan, sedangkan `continue` hanya melompati sisa iterasi saat ini lalu lanjut ke iterasi berikutnya. Pada contoh berikut, angka genap dilewati dengan `continue`, dan loop berhenti total dengan `break` saat `i` lebih dari 7.',
          `\`\`\`python
for i in range(1, 10):
    if i % 2 == 0:
        continue   # lewati angka genap
    if i > 7:
        break      # berhenti total saat i lebih dari 7
    print(i)       # mencetak 1, 3, 5, 7
\`\`\``,
        ],
        hasSandbox: true,
        sandboxStarterCode: `# continue: lewati iterasi saat i == 3, loop lanjut ke i berikutnya
for i in range(5):
    if i == 3:
        continue
    print(f"for/continue: i = {i}")

# break: hentikan loop begitu angka 4 ditemukan
for i in range(10):
    if i == 4:
        print("Ketemu 4, loop dihentikan")
        break
    print(f"for/break: i = {i}")

# while: kondisi berubah di dalam loop
hitung = 0
while hitung < 3:
    print(f"while: hitung = {hitung}")
    hitung += 1

# while True + break: ulangi sampai syarat terpenuhi
total = 0
angka = 1
while True:
    total += angka
    if total > 10:
        break
    angka += 1
print("Total pertama yang melebihi 10:", total, "setelah menjumlahkan 1 sampai", angka)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Berapa kali loop berjalan dan nilai apa saja yang diambil i pada for i in range(5)?', [
            ['5 kali, i bernilai 0 sampai 4', true],
            ['5 kali, i bernilai 1 sampai 5', false],
            ['6 kali, i bernilai 0 sampai 5', false],
          ]),
          q('Apa perbedaan break dan continue di dalam loop?', [
            ['break menghentikan seluruh loop, continue hanya melompati sisa iterasi saat ini', true],
            ['continue menghentikan seluruh loop, break hanya melompati sisa iterasi saat ini', false],
            ['break menghentikan seluruh program, continue menghentikan loop', false],
          ]),
          q('Apa yang terjadi kalau kondisi while tidak pernah berubah menjadi False di dalam loop?', [
            ['Terjadi infinite loop: loop berjalan terus tanpa berhenti', true],
            ['Python otomatis menghentikan loop setelah sekitar 100 iterasi', false],
            ['Loop dilewati dan tidak pernah dijalankan', false],
          ]),
        ],
      },
      {
        title: 'List, Tuple, Dictionary',
        slug: 'pfz-list-tuple-dictionary',
        content: [
          'List adalah kumpulan data terurut yang bisa diubah (mutable), ditulis dengan `[]`, contoh: `buah = ["apel", "jeruk", "mangga"]`. Akses item dengan index dimulai dari 0: `buah[0]`.',
          'Tuple mirip list tapi tidak bisa diubah setelah dibuat (immutable), cocok untuk data yang memang tidak boleh berubah, misal koordinat `(x, y)`. Yang sebenarnya membuat tuple adalah **koma**, bukan tanda kurung: `t = 10, 20` sama saja dengan `t = (10, 20)`. Kurung hanya wajib untuk tuple kosong `()`. Tuple satu elemen harus memakai koma, yaitu `(5,)`, sedangkan `(5)` hanyalah angka 5 di dalam kurung.',
          `\`\`\`python
a = 10, 20     # tuple tanpa kurung
b = (10, 20)   # sama saja
c = (5,)       # tuple satu elemen: komanya yang penting
d = (5)        # BUKAN tuple, hanya angka 5
print(type(a), type(c), type(d))
\`\`\``,
          'Dictionary menyimpan data sebagai pasangan key-value, ditulis dengan `{}`, contoh: `siswa = {"nama": "Budi", "umur": 20}`. Akses nilai lewat key: `siswa["nama"]`, bukan index angka. Mengakses key yang tidak ada menghasilkan `KeyError`, sedangkan `siswa.get("alamat")` mengembalikan `None` sebagai gantinya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `buah = ["apel", "jeruk", "mangga"]
print("List buah:", buah)
print("Item pertama:", buah[0])
buah.append("pisang")
print("Setelah append:", buah)

koordinat = (10, 20)
print("Tuple koordinat:", koordinat)
tanpa_kurung = 10, 20
print("Tuple tanpa kurung:", tanpa_kurung, type(tanpa_kurung))
satu_elemen = (5,)
bukan_tuple = (5)
print("Satu elemen:", type(satu_elemen), "| tanpa koma:", type(bukan_tuple))
# koordinat[0] = 99  # hapus tanda # di awal untuk melihat TypeError: tuple immutable

siswa = {"nama": "Budi", "umur": 20}
print("Nama siswa:", siswa["nama"])
print("Alamat (get):", siswa.get("alamat"))
siswa["umur"] = 21
print("Setelah update:", siswa)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Tipe data mana yang immutable (tidak bisa diubah setelah dibuat)?', [
            ['tuple', true],
            ['list', false],
            ['dict', false],
          ]),
          q('Apa yang sebenarnya membuat sebuah nilai menjadi tuple di Python?', [
            ['Tanda koma di antara nilainya', true],
            ['Tanda kurung ()', false],
            ['Kata kunci tuple yang wajib ditulis', false],
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
            ['Memanggil ulang fungsi dari awal', false],
          ]),
        ],
      },
      {
        title: 'Parameter & Default Argument',
        slug: 'pfz-parameter-default-argument',
        content: [
          'Parameter fungsi bisa diberi nilai default, dipakai kalau pemanggil tidak memberikan argumen untuk parameter itu. Contoh: `def sapa(nama="Tamu"):` — kalau dipanggil `sapa()` tanpa argumen, `nama` bernilai `"Tamu"`.',
          'Python juga mendukung keyword argument — memanggil fungsi dengan menyebut nama parameternya langsung, misal `sapa(nama="Budi")`, urutan argumen jadi tidak wajib sama dengan urutan parameter.',
          '## `*args` dan `**kwargs`',
          '`*args` menampung sejumlah argumen posisional tak terbatas jadi tuple, `**kwargs` menampung argumen keyword tak terbatas jadi dictionary — berguna untuk fungsi yang jumlah argumennya fleksibel.',
          `\`\`\`python
def info(*args, **kwargs):
    print(args)
    print(kwargs)

info(1, 2, nama="Budi", umur=20)
# (1, 2)
# {'nama': 'Budi', 'umur': 20}
\`\`\``,
          '## Hati-hati dengan default berupa list/dictionary',
          'Nilai default dievaluasi **sekali saja**, yaitu saat `def` dijalankan, bukan setiap kali fungsi dipanggil. Kalau defaultnya object mutable seperti list atau dictionary, object yang sama dipakai bersama oleh semua pemanggilan fungsi itu. Cara amannya: pakai `None` sebagai default, lalu buat list baru di dalam fungsi.',
          `\`\`\`python
def tambah_buruk(item, daftar=[]):
    daftar.append(item)
    return daftar

print(tambah_buruk("a"))  # ['a']
print(tambah_buruk("b"))  # ['a', 'b'], bukan ['b']!

def tambah_benar(item, daftar=None):
    if daftar is None:
        daftar = []
    daftar.append(item)
    return daftar

print(tambah_benar("a"))  # ['a']
print(tambah_benar("b"))  # ['b']
\`\`\``,
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

def tampilkan_profil(**kwargs):
    for kunci, nilai in kwargs.items():
        print(f"{kunci} = {nilai}")

tampilkan_profil(nama="Budi", umur=20, kota="Bandung")

# Jebakan: default berupa list dipakai bersama di semua pemanggilan
def tambah_buruk(item, daftar=[]):
    daftar.append(item)
    return daftar

print("Buruk 1:", tambah_buruk("a"))
print("Buruk 2:", tambah_buruk("b"))

def tambah_benar(item, daftar=None):
    if daftar is None:
        daftar = []
    daftar.append(item)
    return daftar

print("Benar 1:", tambah_benar("a"))
print("Benar 2:", tambah_benar("b"))
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi f(item, daftar=[]) menambahkan item ke daftar lalu mengembalikannya. Apa yang dikembalikan f("b") kalau sebelumnya sudah dipanggil f("a")?', [
            ["['a', 'b']", true],
            ["['b']", false],
            ['Error, karena list tidak boleh dipakai sebagai nilai default', false],
          ]),
          q('Kapan nilai default sebuah parameter dievaluasi?', [
            ['Sekali saja, saat def dijalankan', true],
            ['Setiap kali fungsi dipanggil tanpa argumen untuk parameter itu', false],
            ['Sekali saja, saat fungsi pertama kali dipanggil', false],
          ]),
          q('Apa yang ditampung oleh **kwargs di parameter fungsi?', [
            ['Argumen keyword tak terbatas, dalam bentuk dictionary', true],
            ['Argumen posisional tak terbatas, dalam bentuk tuple', false],
            ['Satu argumen opsional yang bernama kwargs', false],
          ]),
        ],
      },
      {
        title: 'Scope Variabel',
        slug: 'pfz-scope-variabel',
        content: [
          'Scope menentukan di bagian kode mana sebuah variabel bisa diakses. Variabel yang dibuat di dalam fungsi disebut local variable, hanya bisa diakses di dalam fungsi itu sendiri. Mengaksesnya dari luar menghasilkan `NameError`.',
          `\`\`\`python
def hitung():
    lokal = 5
    print(lokal)

hitung()
# print(lokal)  # NameError: lokal hanya ada di dalam fungsi
\`\`\``,
          'Variabel yang dibuat di luar semua fungsi disebut global variable, bisa dibaca dari mana saja termasuk di dalam fungsi tanpa kata kunci apa pun. Tapi kalau fungsi menetapkan nilai ke nama yang sama (misal `penghitung = 100`), Python membuat variabel lokal baru dan variabel global tidak berubah. Untuk benar-benar mengubah nilai variabel global dari dalam fungsi, deklarasikan dulu dengan kata kunci `global`.',
          `\`\`\`python
penghitung = 0

def tetapkan_lokal():
    penghitung = 100   # variabel LOKAL baru, bukan penghitung global

def tambah_global():
    global penghitung
    penghitung += 1

tetapkan_lokal()
print(penghitung)   # 0, tidak berubah
tambah_global()
print(penghitung)   # 1
\`\`\``,
          'Saat mencari sebuah nama, Python memeriksa scope dari yang paling dalam ke luar: local, lalu fungsi pembungkus (enclosing), lalu global, dan terakhir built-in.',
          'Praktik yang baik: hindari terlalu banyak variabel global karena membuat kode sulit dilacak alurnya — lebih baik lewatkan data lewat parameter dan return value fungsi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `pesan = "Halo dari global"
penghitung = 0

def baca_global():
    # Membaca variabel global tidak butuh kata kunci khusus
    print("Di dalam fungsi, pesan =", pesan)

def tetapkan_lokal():
    penghitung = 100  # variabel LOKAL baru, bukan penghitung global
    print("Di dalam tetapkan_lokal:", penghitung)

def tambah_global():
    global penghitung
    penghitung += 1

baca_global()
tetapkan_lokal()
print("Global setelah tetapkan_lokal:", penghitung)  # masih 0
tambah_global()
print("Global setelah tambah_global:", penghitung)   # jadi 1

def contoh_lokal():
    rahasia = "hanya ada di dalam fungsi"
    return rahasia

print(contoh_lokal())
# print(rahasia)  # hapus tanda # di awal untuk melihat NameError
`,
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
            ['Fungsi jadi bergantung pada data di luar dirinya, sehingga alur data sulit dilacak', true],
            ['Python tidak mengizinkan fungsi membaca variabel global', false],
            ['Variabel global otomatis terhapus setelah fungsi pertama selesai dijalankan', false],
          ]),
          q('Variabel global penghitung bernilai 0. Fungsi f berisi penghitung = 100 tanpa deklarasi global. Berapa nilai penghitung global setelah f() dipanggil?', [
            ['0, karena penugasan itu membuat variabel lokal baru', true],
            ['100, karena nama yang sama pasti merujuk ke variabel global', false],
            ['NameError, karena penghitung belum dideklarasikan di dalam fungsi', false],
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
        title: 'Pengenalan OOP: Class & Object',
        slug: 'pfz-oop-class-object',
        content: [
          'Object-Oriented Programming (OOP) mengorganisir kode ke dalam class (cetakan/blueprint) dan object (instance dari class). Class dibuat dengan kata kunci `class`, object dibuat dengan memanggil class seperti fungsi.',
          '`__init__` adalah initializer — method khusus yang otomatis dijalankan setelah object baru dibuat, biasanya dipakai untuk mengisi nilai awal atribut object. Di bahasa lain peran ini sering disebut constructor, tapi di Python object-nya sudah dibuat lebih dulu (oleh method `__new__` yang jarang perlu kita tulis sendiri), lalu `__init__` hanya menginisialisasinya.',
          'Parameter pertama sebuah method menerima object yang memanggil method itu. Secara konvensi parameter ini dinamai `self` — itu hanya konvensi penamaan, bukan kata kunci, dan Python tidak mewajibkan nama tersebut. Tapi hampir semua kode Python memakai `self`, jadi ikuti konvensinya supaya kodemu mudah dibaca orang lain.',
          'Saat memanggil `siswa1.perkenalan()`, Python otomatis mengoper `siswa1` sebagai argumen pertama, jadi hasilnya sama persis dengan `Siswa.perkenalan(siswa1)`.',
          `\`\`\`python
class Siswa:
    def __init__(self, nama):
        self.nama = nama

    def perkenalan(self):
        print("Halo, saya", self.nama)

budi = Siswa("Budi")
budi.perkenalan()        # cara biasa
Siswa.perkenalan(budi)   # hasilnya sama persis
\`\`\``,
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

# Memanggil lewat class: object-nya dioper manual sebagai argumen pertama
Siswa.perkenalan(siswa1)
`,
        hasQuiz: true,
        quizQuestions: [
          q('Method khusus apa yang otomatis dijalankan untuk mengisi nilai awal object yang baru dibuat?', [
            ['__init__', true],
            ['constructor()', false],
            ['__start__', false],
            ['__main__', false],
          ]),
          q('Apa yang benar tentang parameter pertama (biasanya dinamai self) pada method sebuah class?', [
            ['Menerima object yang memanggil method; nama self hanya konvensi, bukan kata kunci', true],
            ['self adalah kata kunci khusus Python, mengganti namanya menyebabkan SyntaxError', false],
            ['Harus diisi manual oleh pemanggil, misalnya siswa1.perkenalan(siswa1)', false],
          ]),
          q('Apa perbedaan class dan object?', [
            ['Class adalah cetakan, object adalah instance yang dibuat darinya', true],
            ['Object adalah cetakan, class adalah hasil jadinya', false],
            ['Class dan object sama persis, hanya beda istilah', false],
            ['Satu class hanya boleh punya satu object', false],
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

const course: CourseDef = {
  title: 'Python from Zero',
  slug: 'python-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'Python from Zero adalah course pengantar untuk kamu yang belum pernah menulis kode sama sekali. Python dikenal sintaksnya yang sederhana dan mudah dibaca, sehingga cocok sebagai bahasa pemrograman pertama, dan tetap dipakai luas untuk web, data science, dan automasi.',
    'Di sini kamu belajar dari dasar: menjalankan Python, sintaks dan komentar, variabel, tipe data, string, operator, percabangan dan perulangan, struktur data (list, tuple, dictionary), fungsi dan scope, modul bawaan, exception handling, dasar OOP, hingga list comprehension. Setiap lesson punya contoh kode yang bisa langsung dijalankan di code sandbox, dan sebagian dilengkapi quiz pilihan ganda untuk menguji pemahamanmu.',
    'Sandbox di course ini menjalankan kode dengan Python 3.8, tanpa akses jaringan dan tanpa input keyboard (jadi `input()` tidak bisa dicoba di sana). Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun dan tidak perlu pengalaman programming sebelumnya.',
  ].join('\n\n'),
  sandboxLanguage: 'python',
  modules,
}

export default course
