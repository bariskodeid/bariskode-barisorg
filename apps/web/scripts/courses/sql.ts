import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan SQL & Database',
    lessons: [
      {
        title: 'Apa itu SQL & Database Relasional?',
        slug: 'sqlfz-apa-itu-sql-database-relasional',
        content: [
          'SQL (Structured Query Language) adalah bahasa standar untuk berkomunikasi dengan database relasional — dipakai untuk membuat, membaca, mengubah, dan menghapus data yang tersimpan dalam tabel.',
          'Database relasional menyimpan data dalam bentuk tabel-tabel yang saling berhubungan, mirip spreadsheet: setiap tabel punya baris (row/record, satu entitas data) dan kolom (field, satu atribut data).',
          'Contoh sederhana: tabel `siswa` punya kolom `nama`, `umur`, `kelas_id` — setiap baris di tabel itu mewakili satu siswa. Karena strukturnya konsisten (tiap baris punya kolom yang sama), data mudah dicari, difilter, dan digabungkan dengan tabel lain.',
          'Beberapa RDBMS (Relational Database Management System) populer: MySQL, PostgreSQL, SQLite, SQL Server, Oracle. Di course ini, sandbox kode memakai SQLite karena ringan dan tidak butuh server terpisah — cocok untuk belajar dari nol.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa kepanjangan SQL?', [
            ['Structured Query Language', true],
            ['Simple Query Language', false],
            ['Standard Question Language', false],
            ['System Query Logic', false],
          ]),
          q('Dalam database relasional, satu baris tabel disebut juga?', [
            ['Record/row', true],
            ['Kolom', false],
            ['Index', false],
            ['Query', false],
          ]),
          q('Apa yang dimaksud kolom (field) dalam tabel?', [
            ['Atribut/data yang sama untuk semua baris', true],
            ['Satu entitas data lengkap', false],
            ['Nama database', false],
            ['Perintah SQL', false],
          ]),
          q('Manakah yang termasuk contoh RDBMS?', [
            ['SQLite', true],
            ['Photoshop', false],
            ['Excel Macro', false],
            ['HTML', false],
          ]),
        ],
      },
      {
        title: 'Membuat Tabel',
        slug: 'sqlfz-membuat-tabel',
        content: [
          '`CREATE TABLE` dipakai untuk membuat tabel baru, diikuti nama tabel dan daftar kolom beserta tipe datanya dalam tanda kurung. Perintah ini hanya membuat struktur tabel (kolom-kolomnya); barisnya masih kosong sampai kita mengisinya dengan `INSERT`.',
          '## Sintaks dasar',
          'Setiap kolom ditulis sebagai `nama_kolom tipe_data`, dipisahkan koma, dan seluruh daftar kolom diapit tanda kurung. Perintah SQL diakhiri titik koma (`;`).',
          '```sql\nCREATE TABLE siswa (\n  id INTEGER PRIMARY KEY,\n  nama TEXT,\n  umur INTEGER\n);\n```',
          'Kalau tabel dengan nama yang sama sudah ada, `CREATE TABLE` gagal dengan error. Tambahkan `IF NOT EXISTS` (`CREATE TABLE IF NOT EXISTS siswa (...)`) supaya perintahnya dilewati tanpa error dan tabel lama tetap utuh.',
          '## Primary key',
          'Kolom yang ditandai `PRIMARY KEY` adalah id unik yang mengidentifikasi tiap baris. Di SQLite, kolom bertipe `INTEGER PRIMARY KEY` punya sifat khusus: kalau tidak kita isi saat `INSERT`, nilainya terisi sendiri (dibahas di lesson `INSERT INTO`).',
          '## Memeriksa struktur tabel',
          'Perintah `PRAGMA table_info(nama_tabel);` menampilkan struktur tabel: satu baris per kolom, berisi nama kolom (`name`), tipenya (`type`), dan penanda primary key (`pk`, bernilai 1 untuk kolom primary key). Sebaliknya, `SELECT * FROM siswa;` pada tabel yang masih kosong tidak menampilkan apa-apa di sandbox: tidak ada baris, jadi judul kolomnya pun tidak dicetak.',
          '## Dua baris pertama di setiap starter',
          'Di sandbox, setiap contoh berupa skrip yang dijalankan oleh shell `sqlite3`. Dua baris pertamanya, `.headers on` dan `.mode column`, bukan perintah SQL melainkan perintah khusus shell (tanpa titik koma): yang pertama menampilkan judul kolom, yang kedua menyejajarkan hasil menjadi kolom. Lebar tiap kolom ditentukan dari judul kolom dan nilai di baris pertama hasil (minimal 10 karakter), jadi teks yang lebih panjang di baris berikutnya terpotong di tampilan saja; datanya tetap utuh.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

-- Struktur tabel: nama kolom (name), tipe (type), dan penanda primary key (pk).
PRAGMA table_info(siswa);

-- Tabel masih kosong, jadi SELECT ini tidak menampilkan apa-apa.
SELECT * FROM siswa;

INSERT INTO siswa (id, nama, umur, kelas_id, nilai) VALUES (1, 'Budi', 16, 1, 85.5);

SELECT * FROM siswa;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dilakukan perintah CREATE TABLE siswa (id INTEGER PRIMARY KEY, nama TEXT);?', [
            ['Membuat tabel siswa dengan dua kolom, tanpa satu pun baris data', true],
            ['Membuat tabel siswa sekaligus mengisinya dengan satu baris contoh', false],
            ['Membuat database baru bernama siswa', false],
            ['Membuka tabel siswa yang sudah ada untuk dibaca', false],
          ]),
          q('Perintah apa yang menampilkan nama kolom dan tipe sebuah tabel di SQLite?', [
            ['PRAGMA table_info(siswa);', true],
            ['DESCRIBE siswa;', false],
            ['SHOW COLUMNS FROM siswa;', false],
            ['SELECT STRUCTURE FROM siswa;', false],
          ]),
          q(
            'Apa yang terjadi kalau CREATE TABLE IF NOT EXISTS siswa (...) dijalankan padahal tabel siswa sudah ada?',
            [
              ['Perintah dilewati tanpa error dan tabel lama tetap utuh', true],
              ['Tabel lama diganti dengan tabel baru yang kosong', false],
              ['Muncul error karena nama tabel sudah dipakai', false],
              ['Dibuat tabel kedua dengan nama siswa_1', false],
            ],
          ),
        ],
      },
      {
        title: 'Tipe Data SQL',
        slug: 'sqlfz-tipe-data-sql',
        content: [
          'SQLite (mesin yang dipakai sandbox course ini) menyimpan setiap nilai sebagai salah satu dari lima **storage class**: `NULL` (tidak ada nilai), `INTEGER` (bilangan bulat), `REAL` (bilangan desimal/floating point), `TEXT` (string/teks), dan `BLOB` (data biner mentah). Storage class adalah jenis nilai yang benar-benar tersimpan, dan bisa dilihat dengan fungsi `typeof()`.',
          '`INTEGER` cocok untuk nilai seperti umur atau id, `REAL` untuk nilai desimal seperti nilai ujian atau harga, dan `TEXT` untuk nama, alamat, atau string lain.',
          '## Tipe kolom hanyalah rekomendasi',
          'Di banyak database lain, tipe yang ditulis di `CREATE TABLE` membatasi nilai yang boleh masuk. Di SQLite tidak begitu: tipe kolom menentukan **type affinity**, yaitu jenis penyimpanan yang dianjurkan untuk kolom itu, bukan yang diwajibkan. Kolom mana pun tetap boleh menyimpan nilai dari storage class apa pun.',
          'Ada lima affinity: `TEXT`, `NUMERIC`, `INTEGER`, `REAL`, dan `BLOB`. Affinity ditentukan dari nama tipe yang kita tulis, dengan aturan yang dicek berurutan:',
          '- nama tipe mengandung `INT` (misal `INT`, `BIGINT`): affinity `INTEGER`\n- mengandung `CHAR`, `CLOB`, atau `TEXT` (misal `VARCHAR(50)`): affinity `TEXT`\n- mengandung `BLOB`, atau tidak ada tipe sama sekali: affinity `BLOB`\n- mengandung `REAL`, `FLOA`, atau `DOUB` (misal `FLOAT`, `DOUBLE`): affinity `REAL`\n- selain itu (misal `DECIMAL`, `BOOLEAN`, `DATE`): affinity `NUMERIC`',
          "Saat nilai dimasukkan, SQLite berusaha mengubahnya ke affinity kolom kalau bisa dilakukan tanpa kehilangan informasi: teks `'17'` di kolom `INTEGER` disimpan sebagai bilangan bulat 17. Kalau tidak bisa, misal teks `'abc'` di kolom `INTEGER`, nilainya disimpan apa adanya sebagai `TEXT` dan tidak ada error.",
          "```sql\nCREATE TABLE contoh (umur INTEGER);\nINSERT INTO contoh VALUES ('17');   -- teks berbentuk angka\nINSERT INTO contoh VALUES ('abc');  -- bukan angka\nSELECT umur, typeof(umur) FROM contoh;\n```",
          'Hasilnya: `17` bertipe `integer` (sudah diubah), sedangkan `abc` tetap bertipe `text`.',
          '## NULL',
          '`NULL` bukan berarti angka nol atau string kosong — `NULL` berarti benar-benar tidak ada nilai. Ini penting dipahami karena perbandingan dengan `NULL` punya aturan khusus (`IS NULL`, bukan `= NULL`).',
          '## Dibanding database lain',
          'PostgreSQL dan MySQL umumnya lebih ketat: tipe seperti `VARCHAR(50)`, `DECIMAL`, atau `BOOLEAN` di sana benar-benar membatasi nilai yang diterima (di SQLite, angka dalam kurung seperti `(50)` bahkan diabaikan). Sejak SQLite 3.37 ada tabel `STRICT` yang juga memaksa tipe (butuh versi 3.37+, tidak jalan di sandbox). Konsep dasarnya tetap sama: pilih tipe yang sesuai dengan isi kolom.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

-- Tipe kolom hanya rekomendasi (affinity). typeof() menampilkan storage class
-- yang benar-benar tersimpan untuk tiap nilai.
CREATE TABLE contoh (
  umur INTEGER,
  nilai REAL,
  nama TEXT
);

-- Baris 1: sesuai tipe kolom (85 yang bulat diubah menjadi REAL di kolom nilai).
INSERT INTO contoh VALUES (16, 85, 'Budi');
-- Baris 2: teks '17' dan '90.5' diubah menjadi angka, angka 123 di kolom TEXT menjadi teks.
INSERT INTO contoh VALUES ('17', '90.5', 123);
-- Baris 3: teks yang bukan angka disimpan apa adanya, tanpa error.
INSERT INTO contoh VALUES ('abc', 'lulus', 'Siti');

SELECT umur, typeof(umur) AS tipe_umur FROM contoh;
SELECT nilai, typeof(nilai) AS tipe_nilai FROM contoh;
SELECT nama, typeof(nama) AS tipe_nama FROM contoh;
`,
        hasQuiz: true,
        quizQuestions: [
          q("Kolom umur dideklarasikan INTEGER, lalu diisi dengan teks '17'. Apa hasil typeof(umur)?", [
            ['integer, karena teks berbentuk angka diubah sesuai affinity kolom', true],
            ['text, karena nilai disimpan persis seperti yang diketik', false],
            ['real, karena semua angka di dalam teks dianggap desimal', false],
            ['Tidak ada hasil, karena INSERT teks ke kolom INTEGER ditolak', false],
          ]),
          q("Kolom umur dideklarasikan INTEGER, lalu diisi dengan teks 'abc'. Apa yang terjadi di SQLite?", [
            ['Disimpan apa adanya sebagai TEXT, tanpa error', true],
            ['Error karena tipe datanya tidak cocok dengan kolom INTEGER', false],
            ['Disimpan sebagai angka 0 karena tidak bisa dikonversi', false],
            ['Baris dilewati diam-diam dan tidak masuk ke tabel', false],
          ]),
          q('Apa beda storage class dengan type affinity di SQLite?', [
            [
              'Storage class: jenis nilai yang benar-benar tersimpan; affinity: jenis penyimpanan yang dianjurkan untuk kolom',
              true,
            ],
            [
              'Keduanya istilah yang sama; dipakai bergantian untuk lima nama INTEGER, REAL, TEXT, BLOB, dan NULL',
              false,
            ],
            [
              'Storage class mewajibkan nilai sesuai tipe kolom, sedangkan affinity hanya berlaku untuk kolom PRIMARY KEY',
              false,
            ],
            [
              'Storage class hanya ada di SQLite, sedangkan affinity hanya dipakai di PostgreSQL dan MySQL untuk tipe yang ketat',
              false,
            ],
          ]),
          q('Kolom harga dideklarasikan DECIMAL(10,2). Affinity apa yang didapat kolom itu?', [
            ['NUMERIC, karena namanya tidak cocok dengan empat aturan lainnya', true],
            ['REAL, karena DECIMAL berarti bilangan desimal', false],
            ['INTEGER, karena angka dalam kurung menentukan jumlah digit bulat', false],
            ['TEXT, karena tipe yang memakai kurung dianggap string', false],
          ]),
          q('Apa arti NULL dalam SQL?', [
            ['Tidak ada nilai sama sekali', true],
            ['Angka nol', false],
            ['String kosong', false],
            ['Nilai default 0', false],
          ]),
          q('Bagaimana cara yang benar memeriksa apakah kolom bernilai NULL?', [
            ['IS NULL', true],
            ['= NULL', false],
            ['== NULL', false],
            ['LIKE NULL', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Manipulasi Data Dasar',
    lessons: [
      {
        title: 'INSERT INTO',
        slug: 'sqlfz-insert-into',
        content: [
          '`INSERT INTO` dipakai menambahkan baris data baru ke dalam tabel. Sintaks dasar: `INSERT INTO nama_tabel (kolom1, kolom2, ...) VALUES (nilai1, nilai2, ...);`.',
          "Kolom bertipe `TEXT` ditulis dalam tanda kutip satu (`'Budi'`), sedangkan angka (`INTEGER`/`REAL`) ditulis langsung tanpa kutip.",
          'Kita bisa menambahkan banyak baris sekaligus dengan menjalankan beberapa perintah `INSERT INTO` berurutan, atau memisahkan tiap grup `VALUES` dengan koma dalam satu perintah:',
          "```sql\nINSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES\n  ('Budi', 16, 1, 85.5),\n  ('Siti', 17, 1, 90.0);\n```",
          '## Kolom id otomatis',
          'Di SQLite, kolom bertipe `INTEGER PRIMARY KEY` adalah alias dari `rowid`, nomor baris yang dimiliki setiap tabel. Kalau kita tidak menyebutkan kolom `id` saat INSERT (atau mengisinya dengan `NULL`), SQLite memberinya nilai id terbesar yang ada saat itu ditambah satu, atau 1 kalau tabelnya masih kosong. Id juga boleh kita isi sendiri.',
          'Ini bukan `AUTOINCREMENT`. Karena id baru dihitung dari nilai terbesar yang masih ada di tabel, kalau baris dengan id terbesar dihapus, id itu dipakai lagi oleh baris berikutnya. Kalau id yang pernah terpakai tidak boleh muncul lagi, tulis `INTEGER PRIMARY KEY AUTOINCREMENT`; SQLite menyarankan keyword ini hanya dipakai kalau memang dibutuhkan karena menambah beban kerja di setiap INSERT.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);

-- Satu perintah INSERT bisa memuat banyak baris: pisahkan tiap grup VALUES dengan koma.
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES
  ('Siti', 17, 1, 90.0),
  ('Andi', 16, 2, 78.0);

SELECT * FROM siswa;

-- id boleh diisi sendiri. INSERT berikutnya tanpa id memakai id terbesar + 1.
INSERT INTO siswa (id, nama, umur, kelas_id, nilai) VALUES (10, 'Bella', 18, 2, 92.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Citra', 17, 1, 88.0);

SELECT id, nama FROM siswa;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Perintah apa untuk menambahkan baris data baru ke tabel?', [
            ['INSERT INTO', true],
            ['UPDATE ... SET', false],
            ['CREATE TABLE', false],
            ['ADD ROW', false],
          ]),
          q('Bagaimana cara menulis nilai TEXT dalam perintah INSERT?', [
            ["Dalam tanda kutip satu, misal 'Budi'", true],
            ['Tanpa kutip sama sekali', false],
            ['Dalam tanda kurung siku []', false],
            ['Dalam tanda kurung kurawal {}', false],
          ]),
          q(
            'Kolom id bertipe INTEGER PRIMARY KEY tidak disebutkan saat INSERT. Bagaimana SQLite memilih nilainya?',
            [
              ['Id terbesar yang ada di tabel saat itu ditambah satu (atau 1 kalau tabel kosong)', true],
              ['Dari penghitung internal yang tidak pernah turun, sehingga id baris yang dihapus tidak dipakai lagi', false],
              ['Nilai acak yang dijamin tidak sama dengan id lain', false],
              ['Dibiarkan NULL karena nilainya tidak disebutkan', false],
            ],
          ),
          q('Apa yang dijamin AUTOINCREMENT tetapi tidak dijamin oleh INTEGER PRIMARY KEY biasa?', [
            ['Id yang pernah dipakai tidak akan muncul lagi, termasuk id baris yang dihapus', true],
            ['Kolom id terisi otomatis dengan id terbesar ditambah satu kalau tidak disebutkan', false],
            ['Kolom id tidak pernah bernilai NULL, walau INSERT mengisinya dengan NULL', false],
            ['Id selalu dimulai dari 0 dan naik satu per satu tanpa celah di antaranya', false],
          ]),
        ],
      },
      {
        title: 'SELECT Dasar',
        slug: 'sqlfz-select-dasar',
        content: [
          '`SELECT` dipakai mengambil (membaca) data dari tabel. Hasilnya berupa tabel sementara; data di tabel asal tidak berubah.',
          '## Memilih kolom',
          '`SELECT * FROM nama_tabel;` mengambil semua kolom dan semua baris. Untuk mengambil kolom tertentu saja, sebutkan nama kolomnya dipisah koma — lebih ringkas dan lebih jelas dibanding `*` kalau tabel punya banyak kolom yang tidak semuanya dibutuhkan.',
          '```sql\nSELECT * FROM siswa;\nSELECT nama, umur FROM siswa;\n```',
          '## Alias dengan AS',
          'Kita bisa memberi alias (nama sementara) untuk kolom hasil dengan `AS`, misal `SELECT nama AS nama_siswa FROM siswa;` — judul kolom di hasil menjadi `nama_siswa`, sedangkan nama kolom di tabel tetap `nama`.',
          '## Ekspresi',
          'Kolom hasil tidak harus berupa kolom tabel; bisa juga hasil perhitungan, dan alias berguna untuk memberinya judul:',
          '```sql\nSELECT nama, nilai + 5 AS nilai_plus_5 FROM siswa;\n```',
          'Perhitungan ini hanya terjadi di hasil query; nilai di tabel `siswa` tidak berubah.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Siti', 17, 1, 90.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Andi', 16, 2, 78.0);

SELECT * FROM siswa;

SELECT nama, nilai FROM siswa;

SELECT nama AS nama_siswa, umur AS usia FROM siswa;

-- Kolom hasil bisa berupa perhitungan; nilai di tabel tidak berubah.
SELECT nama, nilai + 5 AS nilai_plus_5 FROM siswa;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa efek AS pada SELECT nama AS nama_siswa FROM siswa;?', [
            ['Judul kolom di hasil menjadi nama_siswa, sedangkan kolom di tabel tetap bernama nama', true],
            ['Kolom nama di tabel siswa diganti namanya menjadi nama_siswa secara permanen', false],
            ['Dibuat kolom baru bernama nama_siswa di tabel siswa', false],
            ['Isi kolom nama di setiap baris diubah menjadi teks nama_siswa', false],
          ]),
          q('Query SELECT nama, umur FROM siswa; menghasilkan apa?', [
            ['Kolom nama dan umur dari semua baris di tabel siswa', true],
            ['Hanya baris pertama, berisi kolom nama dan umur', false],
            ['Semua kolom dari semua baris, karena kolom lain ikut ditampilkan', false],
            ['Dua baris saja: satu berisi nama dan satu berisi umur', false],
          ]),
          q('SELECT nama, nilai + 5 AS nilai_plus_5 FROM siswa; dijalankan. Apakah nilai di tabel siswa berubah?', [
            ['Tidak, penjumlahan hanya dihitung di hasil query', true],
            ['Ya, semua nilai di tabel bertambah 5 secara permanen', false],
            ['Ya, tetapi hanya pada baris pertama', false],
            ['Query gagal karena SELECT tidak boleh berisi perhitungan', false],
          ]),
        ],
      },
      {
        title: 'WHERE & Filtering',
        slug: 'sqlfz-where-filtering',
        content: [
          'Klausa `WHERE` menyaring baris berdasarkan kondisi tertentu, ditulis setelah `FROM`. Contoh: `SELECT * FROM siswa WHERE umur > 16;` hanya mengambil siswa berumur di atas 16.',
          '## Operator perbandingan dan logika',
          'Operator perbandingan yang bisa dipakai: `=`, `!=` (atau `<>`, artinya sama: tidak sama dengan), `>`, `<`, `>=`, `<=`. Operator logika `AND`/`OR` menggabungkan beberapa kondisi, dan `NOT` membalik kondisi.',
          '```sql\nSELECT * FROM siswa WHERE kelas_id = 1 AND nilai >= 85;\nSELECT * FROM siswa WHERE umur = 18 OR nilai < 80;\nSELECT * FROM siswa WHERE NOT (umur = 16);\n```',
          '## IN dan BETWEEN',
          '`IN` mencocokkan salah satu dari beberapa nilai, sedangkan `BETWEEN a AND b` memilih nilai dalam rentang a sampai b, dengan batas bawah dan batas atasnya ikut tercakup. Keduanya bisa dibalik dengan `NOT` (`NOT IN`, `NOT BETWEEN`).',
          '```sql\nSELECT * FROM siswa WHERE umur IN (16, 18);\nSELECT * FROM siswa WHERE nilai BETWEEN 80 AND 90;\n```',
          '## LIKE untuk pola teks',
          "`LIKE` mencocokkan pola teks dengan dua wildcard: `%` cocok dengan nol atau lebih karakter apa pun, dan `_` cocok dengan tepat satu karakter. Misal `nama LIKE 'B%'` mencari nama berawalan B, dan `nama LIKE '_udi'` mencari nama empat huruf yang berakhiran \"udi\". Di SQLite, `LIKE` tidak membedakan huruf besar dan kecil untuk huruf ASCII, jadi `'b%'` juga cocok dengan \"Budi\".",
          "```sql\nSELECT * FROM siswa WHERE nama LIKE 'B%';\nSELECT * FROM siswa WHERE nama LIKE '_udi';\n```",
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Siti', 17, 1, 90.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Andi', 16, 2, 78.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Bella', 18, 2, 92.0);

-- Perbandingan, AND, OR, NOT
SELECT * FROM siswa WHERE umur > 16;
SELECT * FROM siswa WHERE kelas_id = 1 AND nilai >= 85;
SELECT * FROM siswa WHERE umur = 18 OR nilai < 80;
SELECT * FROM siswa WHERE kelas_id <> 1;
SELECT * FROM siswa WHERE NOT (umur = 16);

-- IN dan BETWEEN (BETWEEN menyertakan batas atas dan bawah: 90.0 ikut)
SELECT * FROM siswa WHERE umur IN (16, 18);
SELECT * FROM siswa WHERE nilai BETWEEN 80 AND 90;

-- LIKE: % = nol atau lebih karakter, _ = tepat satu karakter, tidak peka huruf besar/kecil
SELECT * FROM siswa WHERE nama LIKE 'B%';
SELECT * FROM siswa WHERE nama LIKE '_udi';
SELECT * FROM siswa WHERE nama LIKE 'b%';
`,
        hasQuiz: true,
        quizQuestions: [
          q('Klausa apa untuk menyaring baris berdasarkan kondisi tertentu?', [
            ['WHERE', true],
            ['FILTER', false],
            ['HAVING', false],
            ['SELECT', false],
          ]),
          q("Dalam pola LIKE 'B%', apa arti tanda %?", [
            ['Cocok dengan nol atau lebih karakter apa pun', true],
            ['Cocok dengan tepat satu karakter apa pun', false],
            ['Cocok dengan tanda persen secara harfiah', false],
            ['Cocok dengan satu angka saja', false],
          ]),
          q('Query "SELECT * FROM siswa WHERE umur > 16;" akan menghasilkan apa?', [
            ['Semua siswa dengan umur lebih dari 16', true],
            ['Semua siswa tanpa terkecuali', false],
            ['Hanya siswa berumur tepat 16', false],
            ['Error karena WHERE tidak valid', false],
          ]),
          q('Query SELECT * FROM siswa WHERE nilai BETWEEN 80 AND 90; ikut menampilkan siswa bernilai tepat 90?', [
            ['Ya, batas bawah dan batas atas ikut tercakup', true],
            ['Tidak, BETWEEN hanya mengambil nilai di antara 80 dan 90 tanpa kedua batasnya', false],
            ['Hanya nilai 80 yang ikut, nilai 90 tidak', false],
            ['Query error karena BETWEEN tidak bisa dipakai pada angka desimal', false],
          ]),
          q("Di SQLite, apakah nama 'Budi' cocok dengan nama LIKE 'b%' (huruf b kecil)?", [
            ['Cocok, karena LIKE tidak membedakan huruf besar dan kecil untuk huruf ASCII', true],
            ['Tidak cocok, karena huruf besar dan kecil dianggap berbeda oleh LIKE', false],
            ['Cocok hanya kalau kolomnya dibungkus fungsi UPPER() terlebih dulu', false],
            ['Error karena pola LIKE harus diawali huruf besar seperti isi kolomnya', false],
          ]),
        ],
      },
      {
        title: 'ORDER BY & LIMIT',
        slug: 'sqlfz-order-by-limit',
        content: [
          '`ORDER BY` mengurutkan hasil query berdasarkan satu atau lebih kolom. Default urutannya menaik (`ASC`), tambahkan `DESC` untuk urutan menurun. Tanpa `ORDER BY`, urutan baris hasil tidak dijamin, jadi jangan mengandalkannya.',
          'Kalau ada beberapa kolom, kolom pertama dipakai lebih dulu, dan kolom berikutnya hanya menentukan urutan baris yang nilai kolom pertamanya sama, misal `ORDER BY umur ASC, nilai DESC`.',
          '## LIMIT',
          '`LIMIT` membatasi jumlah baris yang dikembalikan, berguna misalnya untuk mengambil "beberapa nilai tertinggi" tanpa menampilkan seluruh data. `ORDER BY` dan `LIMIT` sering dipakai bersama, dengan `LIMIT` ditulis paling akhir:',
          '```sql\nSELECT * FROM siswa ORDER BY nilai DESC LIMIT 3;\n```',
          'Query itu mengambil 3 siswa dengan nilai tertinggi. Tanpa `ORDER BY`, `LIMIT 3` hanya mengambil 3 baris sembarang.',
          '## OFFSET',
          '`OFFSET` melewati sejumlah baris di awal hasil sebelum `LIMIT` mulai menghitung. Kombinasi `LIMIT` dan `OFFSET` dipakai untuk membagi hasil menjadi halaman (pagination): dengan 2 baris per halaman, halaman kedua adalah `LIMIT 2 OFFSET 2`.',
          '```sql\nSELECT nama, nilai FROM siswa ORDER BY nilai DESC LIMIT 2 OFFSET 2;\n```',
          'SQLite juga menerima bentuk singkat `LIMIT 2, 2`, tetapi urutannya terbalik dari yang mungkin kita duga: angka pertama adalah OFFSET dan angka kedua adalah LIMIT. Supaya tidak membingungkan, tulis selalu dengan kata `OFFSET`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Siti', 17, 1, 90.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Andi', 16, 2, 78.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Bella', 18, 2, 92.0);

SELECT * FROM siswa ORDER BY nilai DESC;

SELECT nama, nilai FROM siswa ORDER BY nilai DESC LIMIT 2;

SELECT * FROM siswa ORDER BY umur ASC, nilai DESC;

-- OFFSET 2 melewati dua baris pertama (halaman 1), LIMIT 2 mengambil dua baris berikutnya.
SELECT nama, nilai FROM siswa ORDER BY nilai DESC LIMIT 2 OFFSET 2;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Urutan default ORDER BY tanpa ASC atau DESC adalah?', [
            ['Menaik (ASC), dari nilai terkecil ke terbesar', true],
            ['Menurun (DESC), dari nilai terbesar ke terkecil', false],
            ['Sesuai urutan baris dimasukkan ke tabel', false],
            ['Acak setiap kali query dijalankan', false],
          ]),
          q('Apa yang diambil SELECT nama FROM siswa ORDER BY nilai DESC LIMIT 2 OFFSET 2;?', [
            ['Dua baris berikutnya setelah melewati dua baris dengan nilai tertinggi', true],
            ['Empat baris dengan nilai tertinggi', false],
            ['Hanya baris ke-2 dari hasil yang sudah diurutkan', false],
            ['Dua baris dengan nilai tertinggi, lalu dua baris kosong', false],
          ]),
          q('Kenapa LIMIT 3 tanpa ORDER BY tidak cocok untuk mengambil tiga siswa dengan nilai tertinggi?', [
            ['Tanpa ORDER BY urutan baris tidak dijamin, jadi yang terambil hanya tiga baris sembarang', true],
            ['LIMIT tanpa ORDER BY selalu menghasilkan error karena keduanya wajib dipakai berpasangan', false],
            ['LIMIT otomatis mengurutkan menurun berdasarkan kolom pertama di tabel', false],
            ['LIMIT tanpa ORDER BY selalu mengambil tiga baris dengan id terbesar di tabel', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Fungsi Agregat & Grouping',
    lessons: [
      {
        title: 'Fungsi Agregat',
        slug: 'sqlfz-fungsi-agregat',
        content: [
          'Fungsi agregat menghitung satu nilai ringkasan dari banyak baris. Lima fungsi paling umum: `COUNT()` (menghitung jumlah baris), `SUM()` (menjumlahkan nilai), `AVG()` (rata-rata), `MAX()` (nilai tertinggi), `MIN()` (nilai terendah).',
          'Fungsi agregat biasanya dipakai di `SELECT` tanpa `GROUP BY` kalau kita ingin satu angka ringkasan untuk seluruh tabel, misal rata-rata nilai seluruh siswa.',
          '```sql\nSELECT COUNT(*) AS jumlah_siswa, AVG(nilai) AS rata_rata_nilai FROM siswa;\n```',
          '## COUNT(*) dan COUNT(kolom)',
          '`COUNT(*)` menghitung semua baris tanpa peduli isi kolom, sedangkan `COUNT(kolom)` hanya menghitung baris yang kolomnya tidak `NULL`.',
          '```sql\nSELECT COUNT(*) AS jumlah_baris, COUNT(nilai) AS jumlah_nilai FROM siswa;\n```',
          'Kalau satu dari lima baris punya `nilai` bernilai `NULL`, `jumlah_baris` bernilai 5 sedangkan `jumlah_nilai` bernilai 4.',
          '## NULL diabaikan',
          '`SUM()`, `AVG()`, `MAX()`, dan `MIN()` juga melewati nilai `NULL`. Perhatikan efeknya pada `AVG()`: pembaginya adalah jumlah nilai yang tidak NULL, bukan jumlah baris. Kalau 5 siswa punya 4 nilai dan 1 NULL, rata-ratanya dibagi 4, bukan 5.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Siti', 17, 1, 90.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Andi', 16, 2, 78.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Bella', 18, 2, 92.0);
-- Dito belum punya nilai, jadi kolom nilai-nya NULL.
INSERT INTO siswa (nama, umur, kelas_id) VALUES ('Dito', 17, 2);

-- COUNT(*) menghitung semua baris, COUNT(nilai) hanya yang nilainya tidak NULL.
SELECT COUNT(*) AS jumlah_baris, COUNT(nilai) AS jumlah_nilai FROM siswa;

-- AVG dibagi jumlah nilai yang tidak NULL (4), bukan jumlah baris (5).
SELECT AVG(nilai) AS rata_rata_nilai FROM siswa;
SELECT MAX(nilai) AS nilai_tertinggi, MIN(nilai) AS nilai_terendah FROM siswa;
SELECT SUM(nilai) AS total_nilai FROM siswa;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Fungsi agregat apa untuk menghitung jumlah baris?', [
            ['COUNT()', true],
            ['SUM()', false],
            ['TOTAL()', false],
            ['NUM()', false],
          ]),
          q('Apa perbedaan COUNT(*) dan COUNT(kolom)?', [
            ['COUNT(kolom) mengabaikan nilai NULL, COUNT(*) tidak', true],
            ['Keduanya selalu sama persis', false],
            ['COUNT(*) hanya untuk angka', false],
            ['COUNT(kolom) menghitung semua baris tanpa syarat', false],
          ]),
          q('Fungsi apa untuk menghitung rata-rata sebuah kolom numerik?', [
            ['AVG()', true],
            ['MEAN()', false],
            ['MID()', false],
            ['MEDIAN()', false],
          ]),
          q('Dari 5 siswa, 4 punya nilai dan 1 bernilai NULL. Jumlah seluruh nilainya 345.5. Berapa AVG(nilai)?', [
            ['86.375, karena dibagi 4 nilai yang tidak NULL', true],
            ['69.1, karena NULL dihitung sebagai 0 dan dibagi 5 baris', false],
            ['NULL, karena ada satu nilai NULL di kolom', false],
            ['Error, karena AVG tidak bisa dipakai pada kolom yang berisi NULL', false],
          ]),
        ],
      },
      {
        title: 'GROUP BY',
        slug: 'sqlfz-group-by',
        content: [
          '`GROUP BY` mengelompokkan baris yang punya nilai sama pada kolom tertentu, lalu fungsi agregat dihitung per kelompok, bukan untuk seluruh tabel sekaligus.',
          'Contoh: `SELECT kelas_id, AVG(nilai) FROM siswa GROUP BY kelas_id;` menghasilkan rata-rata nilai untuk setiap `kelas_id` secara terpisah, satu baris hasil per kelompok.',
          '```sql\nSELECT kelas_id, COUNT(*) AS jumlah_siswa, AVG(nilai) AS rata_rata_nilai\nFROM siswa\nGROUP BY kelas_id;\n```',
          '## Kolom di SELECT yang bukan agregat',
          'Menurut standard SQL (dan database seperti PostgreSQL), setiap kolom di `SELECT` yang bukan hasil fungsi agregat harus ikut disebutkan di `GROUP BY`; kalau tidak, query ditolak dengan error. SQLite lebih longgar: kolom seperti itu (disebut bare column) diterima tanpa error, tetapi nilainya diambil dari salah satu baris di kelompok itu. Baris mana yang dipakai tidak ditentukan, sehingga hasilnya tidak bisa diandalkan.',
          'Satu pengecualian yang terdokumentasi: kalau query punya tepat satu `MIN()` atau `MAX()`, bare column diambil dari baris yang memiliki nilai minimum/maksimum itu. Misal `SELECT kelas_id, nama, MAX(nilai) FROM siswa GROUP BY kelas_id;` menampilkan nama siswa dengan nilai tertinggi di tiap kelas. Di luar kasus itu, biasakan menulis semua kolom non-agregat di `GROUP BY` supaya query juga jalan di database lain.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Siti', 17, 1, 90.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Andi', 16, 2, 78.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Bella', 18, 2, 92.0);

SELECT kelas_id, COUNT(*) AS jumlah_siswa, AVG(nilai) AS rata_rata_nilai
FROM siswa
GROUP BY kelas_id;

-- Kolom nama tidak ada di GROUP BY dan bukan agregat (bare column). SQLite menerimanya,
-- tetapi nama yang tampil diambil dari salah satu baris di tiap kelompok: jangan diandalkan.
SELECT kelas_id, nama, COUNT(*) AS jumlah_siswa
FROM siswa
GROUP BY kelas_id;

-- Dengan satu MAX(), bare column diambil dari baris yang punya nilai tertinggi.
SELECT kelas_id, nama, MAX(nilai) AS nilai_tertinggi
FROM siswa
GROUP BY kelas_id;
`,
        hasQuiz: true,
        quizQuestions: [
          q(
            'Tabel siswa berisi 4 baris dengan dua nilai kelas_id berbeda. Berapa baris hasil SELECT kelas_id, AVG(nilai) FROM siswa GROUP BY kelas_id;?',
            [
              ['2 baris, satu untuk tiap kelas_id', true],
              ['4 baris, satu untuk tiap siswa', false],
              ['1 baris berisi rata-rata seluruh tabel', false],
              ['Tidak ada, karena GROUP BY harus disertai HAVING', false],
            ],
          ),
          q(
            'Apa yang terjadi di SQLite jika SELECT kelas_id, nama, COUNT(*) FROM siswa GROUP BY kelas_id; dijalankan?',
            [
              ['Diterima tanpa error, tetapi nama diambil dari salah satu baris dan tidak bisa diandalkan', true],
              ['Error karena kolom nama bukan agregat dan harus ikut disebutkan di GROUP BY', false],
              ['Semua nama dalam satu kelompok digabung menjadi satu teks yang dipisah koma', false],
              ['Menampilkan NULL, karena kolom nama tidak dihitung dengan fungsi agregat', false],
            ],
          ),
          q(
            'Pada SELECT kelas_id, nama, MAX(nilai) FROM siswa GROUP BY kelas_id;, nama yang tampil berasal dari baris mana?',
            [
              ['Baris dengan nilai tertinggi di kelompok itu', true],
              ['Baris pertama yang dimasukkan ke kelompok itu', false],
              ['Baris dengan id terkecil di kelompok itu', false],
              ['Tidak ada; kolom nama dikosongkan karena bukan agregat', false],
            ],
          ),
        ],
      },
      {
        title: 'HAVING',
        slug: 'sqlfz-having',
        content: [
          '`HAVING` menyaring hasil SETELAH `GROUP BY` dilakukan, sedangkan `WHERE` menyaring baris SEBELUM dikelompokkan. Ini perbedaan paling penting antara keduanya.',
          'Karena `HAVING` bekerja setelah grouping, dia bisa memakai hasil fungsi agregat dalam kondisinya, sesuatu yang tidak bisa dilakukan `WHERE`. Contoh: `HAVING AVG(nilai) >= 86` valid, tapi `WHERE AVG(nilai) >= 86` akan error.',
          '```sql\nSELECT kelas_id, AVG(nilai) AS rata_rata_nilai\nFROM siswa\nGROUP BY kelas_id\nHAVING AVG(nilai) >= 86;\n```',
          'Pada data di starter, rata-rata kelas 1 adalah 87.75 dan kelas 2 adalah 85.0, jadi query di atas hanya menampilkan kelas 1. Kalau ambangnya 85, kedua kelas lolos dan `HAVING` tidak menyaring apa pun.',
          '## HAVING tanpa GROUP BY',
          'Di standard SQL dan SQLite 3.39+, `HAVING` boleh dipakai pada query agregat tanpa `GROUP BY`; seluruh baris dianggap satu kelompok (butuh SQLite 3.39+, tidak jalan di sandbox). Sandbox course ini memakai SQLite 3.27.2, yang menolak `HAVING` tanpa `GROUP BY` dengan error "a GROUP BY clause is required before HAVING". Jadi di sini selalu tulis `GROUP BY` sebelum `HAVING`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Siti', 17, 1, 90.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Andi', 16, 2, 78.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Bella', 18, 2, 92.0);

-- Tanpa HAVING: kedua kelas muncul (rata-rata 87.75 dan 85.0).
SELECT kelas_id, AVG(nilai) AS rata_rata_nilai
FROM siswa
GROUP BY kelas_id;

-- Dengan HAVING: hanya kelas yang rata-ratanya minimal 86.
SELECT kelas_id, AVG(nilai) AS rata_rata_nilai
FROM siswa
GROUP BY kelas_id
HAVING AVG(nilai) >= 86;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama WHERE dan HAVING?', [
            ['WHERE menyaring sebelum grouping, HAVING setelah grouping', true],
            ['Keduanya persis sama fungsinya', false],
            ['HAVING dipakai sebelum SELECT, WHERE setelah', false],
            ['WHERE hanya untuk teks, HAVING hanya untuk angka', false],
          ]),
          q('Kenapa "WHERE AVG(nilai) >= 86" akan error?', [
            ['WHERE tidak bisa memakai hasil fungsi agregat', true],
            ['Sintaks WHERE salah total', false],
            ['AVG() tidak valid di SQL', false],
            ['Angka 85 tidak boleh dipakai di WHERE', false],
          ]),
          q('Di sandbox (SQLite 3.27.2), apa yang terjadi kalau HAVING ditulis tanpa GROUP BY?', [
            ['Error karena GROUP BY wajib ada; SQLite 3.39+ dan standard SQL sudah membolehkannya', true],
            ['HAVING diperlakukan seperti WHERE, jadi baris disaring satu per satu tanpa pengelompokan', false],
            ['HAVING diabaikan begitu saja dan semua baris tetap muncul tanpa pesan apa pun', false],
            ['Hasilnya kosong karena tanpa GROUP BY tidak ada kelompok yang bisa disaring', false],
          ]),
          q('Dengan data starter (rata-rata kelas 1 = 87.75, kelas 2 = 85.0), apa hasil HAVING AVG(nilai) >= 85?', [
            ['Kedua kelas muncul, jadi HAVING tidak menyaring apa pun', true],
            ['Hanya kelas 1 yang muncul karena rata-ratanya lebih tinggi', false],
            ['Hanya kelas 2 yang muncul karena rata-ratanya tepat 85', false],
            ['Tidak ada kelas yang muncul karena rata-rata kelas 2 hanya 85, bukan lebih dari 85', false],
          ]),
        ],
      },
      {
        title: 'DISTINCT',
        slug: 'sqlfz-distinct',
        content: [
          '`DISTINCT` menghilangkan baris duplikat dari hasil query, hanya menampilkan nilai unik. Ditulis tepat setelah `SELECT`: `SELECT DISTINCT kolom FROM tabel;`.',
          'Berguna misalnya untuk melihat daftar `kelas_id` yang benar-benar dipakai tanpa duplikat, walau ada banyak siswa dengan `kelas_id` yang sama.',
          '```sql\nSELECT DISTINCT kelas_id FROM siswa;\n```',
          '## Beberapa kolom',
          '`DISTINCT` bisa diterapkan ke lebih dari satu kolom sekaligus — kombinasi nilai dari kolom-kolom itu yang dianggap unik, bukan masing-masing kolom secara terpisah. Dua baris dianggap duplikat hanya kalau semua kolom yang dipilih sama.',
          '```sql\nSELECT DISTINCT umur, kelas_id FROM siswa;\n```',
          '## COUNT(DISTINCT ...)',
          'Di dalam fungsi agregat, `DISTINCT` membuat fungsi hanya memperhitungkan nilai unik: `COUNT(DISTINCT kelas_id)` menghitung ada berapa nilai `kelas_id` yang berbeda, sedangkan `COUNT(kelas_id)` menghitung semua baris yang `kelas_id`-nya tidak NULL.',
          '```sql\nSELECT COUNT(DISTINCT kelas_id) AS jumlah_kelas FROM siswa;\n```',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Budi', 16, 1, 85.5);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Siti', 17, 1, 90.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Andi', 16, 2, 78.0);
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Bella', 18, 2, 92.0);
-- Citra sama dengan Budi: umur 16 dan kelas_id 1.
INSERT INTO siswa (nama, umur, kelas_id, nilai) VALUES ('Citra', 16, 1, 88.0);

-- Tanpa DISTINCT: kelas_id muncul sebanyak jumlah siswa (5 baris).
SELECT kelas_id FROM siswa;

-- Dengan DISTINCT: tiap nilai kelas_id muncul sekali (2 baris).
SELECT DISTINCT kelas_id FROM siswa;

-- Kombinasi umur + kelas_id yang unik: pasangan (16, 1) hanya muncul sekali (4 baris).
SELECT DISTINCT umur, kelas_id FROM siswa;

-- Jumlah nilai kelas_id yang berbeda.
SELECT COUNT(DISTINCT kelas_id) AS jumlah_kelas FROM siswa;
`,
        hasQuiz: true,
        quizQuestions: [
          q(
            'Tabel punya baris (umur, kelas_id): (16,1), (17,1), (16,2), (18,2), (16,1). Berapa baris hasil SELECT DISTINCT umur, kelas_id FROM siswa;?',
            [
              ['4 baris, karena hanya pasangan (16,1) yang muncul dua kali', true],
              ['3 baris, karena DISTINCT hanya memeriksa kolom umur', false],
              ['2 baris, karena DISTINCT hanya memeriksa kolom kelas_id', false],
              ['5 baris, karena DISTINCT tidak berlaku kalau memilih lebih dari satu kolom', false],
            ],
          ),
          q('Apa beda COUNT(DISTINCT kelas_id) dan COUNT(kelas_id)?', [
            [
              'COUNT(DISTINCT kelas_id) menghitung nilai kelas_id yang berbeda; COUNT(kelas_id) menghitung semua baris yang tidak NULL',
              true,
            ],
            ['Keduanya selalu menghasilkan angka yang sama karena DISTINCT tidak mengubah hasil COUNT', false],
            [
              'COUNT(DISTINCT kelas_id) menghitung baris yang kelas_id-nya NULL, sedangkan COUNT(kelas_id) tidak menghitungnya',
              false,
            ],
            [
              'COUNT(DISTINCT kelas_id) hanya boleh dipakai bersama GROUP BY, sedangkan COUNT(kelas_id) boleh berdiri sendiri',
              false,
            ],
          ]),
          q('Di mana DISTINCT ditulis dalam query SELECT?', [
            ['Tepat setelah kata SELECT', true],
            ['Tepat setelah kata FROM', false],
            ['Setelah klausa WHERE', false],
            ['Di akhir query, setelah ORDER BY', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Relasi Antar Tabel',
    lessons: [
      {
        title: 'Foreign Key & Relasi Antar Tabel',
        slug: 'sqlfz-foreign-key-relasi-antar-tabel',
        content: [
          'Primary key adalah kolom (atau kombinasi kolom) yang secara unik mengidentifikasi tiap baris dalam sebuah tabel — nilainya tidak boleh duplikat. Contoh: kolom `id` di tabel `siswa`.',
          'Menurut standard SQL, primary key juga tidak boleh `NULL`. SQLite punya pengecualian karena alasan sejarah: di tabel biasa, hanya kolom `INTEGER PRIMARY KEY` yang pasti tidak NULL (NULL otomatis diganti id baru). Primary key bertipe lain, misal `TEXT`, tetap boleh berisi NULL kecuali kita menambahkan `NOT NULL`.',
          '## Foreign key',
          'Foreign key adalah kolom di satu tabel yang merujuk ke primary key tabel lain, dipakai untuk membangun relasi antar tabel. Contoh: kolom `kelas_id` di tabel `siswa` bisa jadi foreign key yang merujuk ke `id` di tabel `kelas`. Sintaksnya memakai `REFERENCES`:',
          '```sql\nCREATE TABLE siswa (\n  id INTEGER PRIMARY KEY,\n  nama TEXT,\n  kelas_id INTEGER REFERENCES kelas(id)\n);\n```',
          'Dengan relasi ini, kita tidak perlu mengulang data kelas (nama kelas, wali kelas, dst) di setiap baris siswa — cukup simpan `kelas_id`, lalu ambil detail kelas dari tabel `kelas` saat dibutuhkan. Ini mengurangi duplikasi data, disebut normalisasi.',
          '## Foreign key harus diaktifkan',
          'Penting: di SQLite, aturan foreign key tidak dijalankan secara default. Tanpa `PRAGMA foreign_keys = ON;`, `REFERENCES` hanya tercatat di definisi tabel dan SQLite tetap menerima `kelas_id` yang tidak ada di tabel `kelas`. Pengaturan ini berlaku per koneksi dan tidak tersimpan di database, jadi tulis di awal skrip, sebelum perintah lainnya.',
          'Setelah aktif, `INSERT` atau `UPDATE` yang membuat `kelas_id` merujuk ke id yang tidak ada ditolak dengan error `FOREIGN KEY constraint failed`. Kolom foreign key yang berisi `NULL` tetap diterima, karena NULL berarti belum terhubung ke baris mana pun.',
          'Untuk menggabungkan data dari dua tabel yang berelasi seperti ini, SQL menyediakan perintah `JOIN`, yang akan dipelajari di lesson berikutnya.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

-- Aktifkan foreign key (default-nya mati, dan berlaku per koneksi).
PRAGMA foreign_keys = ON;

CREATE TABLE kelas (
  id INTEGER PRIMARY KEY,
  nama_kelas TEXT
);

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER REFERENCES kelas(id)
);

INSERT INTO kelas (id, nama_kelas) VALUES (1, 'X IPA 1');
INSERT INTO kelas (id, nama_kelas) VALUES (2, 'X IPA 2');

INSERT INTO siswa (nama, kelas_id) VALUES ('Budi', 1);
INSERT INTO siswa (nama, kelas_id) VALUES ('Siti', 2);

-- Hasil 1 berarti foreign key sedang ditegakkan.
PRAGMA foreign_keys;

SELECT * FROM siswa;

-- Coba hapus tanda -- di depan baris berikut, lalu Run lagi: kelas_id 99 tidak ada di
-- tabel kelas, jadi muncul error "FOREIGN KEY constraint failed" dan baris itu tidak masuk.
-- INSERT INTO siswa (nama, kelas_id) VALUES ('Dewi', 99);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi primary key dalam sebuah tabel?', [
            ['Mengidentifikasi tiap baris secara unik', true],
            ['Menyimpan teks panjang', false],
            ['Mengurutkan data otomatis', false],
            ['Menghapus baris duplikat', false],
          ]),
          q('Apa itu foreign key?', [
            ['Kolom yang merujuk ke primary key tabel lain', true],
            ['Kolom kedua yang nilainya harus unik di tabel yang sama', false],
            ['Nama lain dari primary key', false],
            ['Kolom yang otomatis dihitung dari kolom lain', false],
          ]),
          q('Kenapa memisahkan data ke beberapa tabel berelasi (normalisasi) itu berguna?', [
            ['Mengurangi duplikasi data', true],
            ['Membuat setiap tabel punya kolom yang persis sama', false],
            ['Mengubah semua kolom menjadi tipe TEXT', false],
            ['Menghilangkan kebutuhan akan primary key', false],
          ]),
          q('Perintah SQL apa yang dipakai untuk menggabungkan data dari dua tabel berelasi?', [
            ['JOIN', true],
            ['UNION', false],
            ['MERGE', false],
            ['CONNECT', false],
          ]),
          q(
            'Di SQLite, apa yang diperlukan agar INSERT dengan nilai foreign key yang tidak ada di tabel induk ditolak?',
            [
              ['Menulis REFERENCES di CREATE TABLE dan menjalankan PRAGMA foreign_keys = ON', true],
              ['Cukup menulis REFERENCES di CREATE TABLE; penegakannya langsung aktif otomatis', false],
              ['Menambahkan UNIQUE pada kolom foreign key', false],
              ['Mengubah tipe kolom foreign key menjadi TEXT', false],
            ],
          ),
          q('Kolom PRIMARY KEY bertipe TEXT tanpa NOT NULL di SQLite. Apakah boleh berisi NULL?', [
            ['Boleh; hanya INTEGER PRIMARY KEY yang pasti tidak NULL', true],
            ['Tidak boleh; PRIMARY KEY selalu menolak NULL di semua kasus', false],
            ['Boleh, tapi hanya untuk satu baris', false],
            ['Tidak boleh, kecuali tabelnya masih kosong', false],
          ]),
        ],
      },
      {
        title: 'INNER JOIN',
        slug: 'sqlfz-inner-join',
        content: [
          '`INNER JOIN` menggabungkan baris dari dua tabel berdasarkan kolom yang berelasi, hanya menampilkan baris yang punya pasangan cocok di KEDUA tabel.',
          'Sintaks: `SELECT ... FROM tabel_a INNER JOIN tabel_b ON tabel_a.kolom = tabel_b.kolom;`. Klausa `ON` menentukan syarat penggabungan, biasanya foreign key = primary key.',
          '```sql\nSELECT siswa.nama, kelas.nama_kelas\nFROM siswa\nINNER JOIN kelas ON siswa.kelas_id = kelas.id;\n```',
          'Kalau ada siswa dengan `kelas_id` yang tidak ada di tabel `kelas` (atau sebaliknya, kelas tanpa siswa), baris itu TIDAK akan muncul di hasil `INNER JOIN` — hanya pasangan yang benar-benar cocok yang ditampilkan.',
          '## Cara lain menulis syarat penggabungan',
          'Selain `ON`, ada dua bentuk lain yang juga valid. Kalau kolom penghubung bernama sama di kedua tabel, `USING (kolom)` menyingkat syaratnya, misal `INNER JOIN wali_kelas USING (kelas_id)` sama dengan `ON siswa.kelas_id = wali_kelas.kelas_id`. Gaya lama menulis tabel dipisah koma dan menaruh syaratnya di `WHERE`; untuk INNER JOIN hasilnya sama persis.',
          'Bentuk `ON` tetap disarankan karena memisahkan syarat penggabungan dari filter `WHERE`, dan pemisahan itu jadi penting di `LEFT JOIN`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE kelas (
  id INTEGER PRIMARY KEY,
  nama_kelas TEXT
);

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER
);

-- Kolom penghubung di tabel ini bernama sama dengan di siswa (kelas_id): cocok untuk USING.
CREATE TABLE wali_kelas (
  kelas_id INTEGER,
  nama_wali TEXT
);

INSERT INTO kelas (id, nama_kelas) VALUES (1, 'X IPA 1');
INSERT INTO kelas (id, nama_kelas) VALUES (2, 'X IPA 2');
-- Kelas 3 belum punya siswa, jadi tidak akan muncul di hasil INNER JOIN.
INSERT INTO kelas (id, nama_kelas) VALUES (3, 'X IPA 3');

INSERT INTO siswa (nama, kelas_id) VALUES ('Budi', 1);
INSERT INTO siswa (nama, kelas_id) VALUES ('Siti', 1);
INSERT INTO siswa (nama, kelas_id) VALUES ('Andi', 2);

INSERT INTO wali_kelas (kelas_id, nama_wali) VALUES (1, 'Bu Rina');
INSERT INTO wali_kelas (kelas_id, nama_wali) VALUES (2, 'Pak Joko');

-- Syarat penggabungan dengan ON
SELECT siswa.nama, kelas.nama_kelas
FROM siswa
INNER JOIN kelas ON siswa.kelas_id = kelas.id;

-- Hasil yang sama, syaratnya ditulis di WHERE (gaya lama: tabel dipisah koma)
SELECT siswa.nama, kelas.nama_kelas
FROM siswa, kelas
WHERE siswa.kelas_id = kelas.id;

-- USING dipakai kalau nama kolom penghubungnya sama di kedua tabel
SELECT siswa.nama, wali_kelas.nama_wali
FROM siswa
INNER JOIN wali_kelas USING (kelas_id);
`,
        hasQuiz: true,
        quizQuestions: [
          q(
            'Tabel siswa dan wali_kelas sama-sama punya kolom kelas_id. Bentuk singkat dari ON siswa.kelas_id = wali_kelas.kelas_id adalah?',
            [
              ['USING (kelas_id)', true],
              ['ON kelas_id', false],
              ['MATCH (kelas_id)', false],
              ['BY kelas_id', false],
            ],
          ),
          q('Baris seperti apa yang ditampilkan oleh INNER JOIN?', [
            ['Hanya baris yang punya pasangan cocok di kedua tabel', true],
            ['Semua baris dari kedua tabel tanpa syarat', false],
            ['Hanya baris dari tabel pertama', false],
            ['Hanya baris yang tidak cocok', false],
          ]),
          q(
            'Jika ada kelas tanpa siswa sama sekali, apakah kelas itu muncul di hasil INNER JOIN dengan tabel siswa?',
            [
              ['Tidak, karena tidak ada pasangan yang cocok', true],
              ['Ya, selalu muncul', false],
              ['Muncul tapi dengan nilai error', false],
              ['Muncul hanya jika ditambahkan ORDER BY', false],
            ],
          ),
          q(
            'Dibanding INNER JOIN ... ON, query SELECT ... FROM siswa, kelas WHERE siswa.kelas_id = kelas.id; menghasilkan apa?',
            [
              ['Hasil yang sama, karena syarat penggabungan ditulis di WHERE', true],
              ['Error, karena WHERE tidak boleh dipakai untuk menggabungkan tabel', false],
              ['Semua kombinasi baris kedua tabel, karena syarat di WHERE diabaikan', false],
              ['Hanya baris dari tabel siswa tanpa kolom dari kelas', false],
            ],
          ),
        ],
      },
      {
        title: 'LEFT JOIN',
        slug: 'sqlfz-left-join',
        content: [
          '`LEFT JOIN` (atau `LEFT OUTER JOIN`) menampilkan SEMUA baris dari tabel kiri (tabel pertama), meskipun tidak ada pasangan yang cocok di tabel kanan. Kalau tidak ada pasangan, kolom dari tabel kanan akan berisi `NULL`.',
          'Ini berbeda dengan `INNER JOIN` yang hanya menampilkan baris yang benar-benar punya pasangan di kedua tabel.',
          '`LEFT JOIN` berguna misalnya untuk menampilkan semua kelas termasuk yang belum punya siswa sama sekali, sesuatu yang tidak akan muncul kalau memakai `INNER JOIN`.',
          'Secara default, shell `sqlite3` menampilkan `NULL` sebagai sel kosong. Karena itu starter memakai `.nullvalue NULL` (perintah shell, bukan SQL) supaya `NULL` terlihat jelas sebagai teks.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column
.nullvalue NULL

CREATE TABLE kelas (
  id INTEGER PRIMARY KEY,
  nama_kelas TEXT
);

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER
);

INSERT INTO kelas (id, nama_kelas) VALUES (1, 'X IPA 1');
INSERT INTO kelas (id, nama_kelas) VALUES (2, 'X IPA 2');
INSERT INTO kelas (id, nama_kelas) VALUES (3, 'X IPA 3');

INSERT INTO siswa (nama, kelas_id) VALUES ('Budi', 1);
INSERT INTO siswa (nama, kelas_id) VALUES ('Siti', 1);
INSERT INTO siswa (nama, kelas_id) VALUES ('Andi', 2);

SELECT kelas.nama_kelas, siswa.nama
FROM kelas
LEFT JOIN siswa ON kelas.id = siswa.kelas_id;
`,
      },
      {
        title: 'Subquery Dasar',
        slug: 'sqlfz-subquery-dasar',
        content: [
          'Subquery adalah query di dalam query lain, biasanya ditulis dalam tanda kurung. Subquery biasa, yang tidak mengacu ke kolom query luar, dievaluasi SQLite satu kali saja lalu hasilnya dipakai oleh query utama (outer query).',
          'Subquery sering dipakai di dalam klausa `WHERE`, misal mencari siswa yang nilainya di atas rata-rata: `SELECT nama FROM siswa WHERE nilai > (SELECT AVG(nilai) FROM siswa);`.',
          "Subquery juga bisa dipakai dengan `IN` untuk mencocokkan terhadap daftar hasil query lain, misal mencari siswa yang `kelas_id`-nya ada di daftar kelas tertentu: `WHERE kelas_id IN (SELECT id FROM kelas WHERE nama_kelas = 'X IPA 1')`.",
          '## Subquery berkorelasi',
          'Kalau subquery mengacu ke kolom dari query luar, ia disebut subquery berkorelasi (correlated). Subquery seperti ini dievaluasi ulang untuk setiap baris query luar, jadi tidak sekadar "jalan lebih dulu" satu kali. Contoh: siswa yang nilainya di atas rata-rata kelasnya sendiri.',
          '```sql\nSELECT nama, kelas_id, nilai\nFROM siswa AS s\nWHERE nilai > (SELECT AVG(nilai) FROM siswa WHERE kelas_id = s.kelas_id);\n```',
          '`siswa AS s` memberi alias `s` pada tabel di query luar, supaya subquery bisa menyebut kolomnya sebagai `s.kelas_id`.',
          '## JOIN atau subquery?',
          'JOIN dan subquery sering bisa menjawab kebutuhan yang sama; pilih bentuk yang paling mudah dibaca. Subquery nyaman untuk membandingkan dengan hasil agregat seperti contoh di atas, sedangkan JOIN lebih cocok kalau kolom dari kedua tabel ikut ditampilkan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE kelas (
  id INTEGER PRIMARY KEY,
  nama_kelas TEXT
);

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO kelas (id, nama_kelas) VALUES (1, 'X IPA 1');
INSERT INTO kelas (id, nama_kelas) VALUES (2, 'X IPA 2');

INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Budi', 1, 85.5);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Siti', 1, 90.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Andi', 2, 78.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Bella', 2, 92.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Citra', 2, 80.0);

-- Subquery biasa: rata-rata seluruh siswa dihitung sekali (85.1).
SELECT nama, nilai
FROM siswa
WHERE nilai > (SELECT AVG(nilai) FROM siswa);

-- Subquery dengan IN: siswa yang kelas_id-nya ada di hasil subquery.
SELECT nama, kelas_id
FROM siswa
WHERE kelas_id IN (SELECT id FROM kelas WHERE nama_kelas = 'X IPA 1');

-- Subquery berkorelasi: rata-rata dihitung ulang untuk kelas tiap siswa. Budi (85.5) ada di
-- hasil pertama, tapi tidak di sini: rata-rata kelas 1 adalah 87.75, di atas nilainya.
SELECT nama, kelas_id, nilai
FROM siswa AS s
WHERE nilai > (SELECT AVG(nilai) FROM siswa WHERE kelas_id = s.kelas_id);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa itu subquery?', [
            ['Query di dalam query lain', true],
            ['Query yang hanya boleh ditulis di klausa FROM', false],
            ['Nama lain dari JOIN', false],
            ['Query yang hasilnya disimpan permanen sebagai tabel baru', false],
          ]),
          q('Apa yang membedakan subquery berkorelasi dari subquery biasa?', [
            [
              'Subquery berkorelasi mengacu ke kolom query luar, sehingga dievaluasi ulang untuk tiap baris query luar',
              true,
            ],
            [
              'Subquery biasa dievaluasi untuk tiap baris query luar, sedangkan yang berkorelasi hanya satu kali',
              false,
            ],
            ['Subquery berkorelasi wajib memakai IN, sedangkan subquery biasa tidak boleh memakai IN sama sekali', false],
            ['Subquery berkorelasi tidak boleh memuat fungsi agregat seperti AVG(), sedangkan subquery biasa boleh', false],
          ]),
          q(
            'Query "SELECT nama FROM siswa WHERE nilai > (SELECT AVG(nilai) FROM siswa);" akan menghasilkan apa?',
            [
              ['Nama siswa yang nilainya di atas rata-rata seluruh siswa', true],
              ['Nama semua siswa tanpa terkecuali', false],
              ['Rata-rata nilai saja', false],
              ['Error karena subquery tidak valid di WHERE', false],
            ],
          ),
          q("Apa arti WHERE kelas_id IN (SELECT id FROM kelas WHERE nama_kelas = 'X IPA 1')?", [
            ["Baris siswa yang kelas_id-nya sama dengan salah satu id kelas bernama 'X IPA 1'", true],
            ["Semua baris tabel kelas yang bernama 'X IPA 1', bukan baris siswa", false],
            ['Baris siswa yang kelas_id-nya berbeda dari semua id di tabel kelas', false],
            ['Error, karena IN hanya boleh berisi daftar angka yang ditulis langsung', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Update, Delete & Ringkasan',
    lessons: [
      {
        title: 'UPDATE',
        slug: 'sqlfz-update',
        content: [
          '`UPDATE` mengubah nilai kolom pada baris yang sudah ada. Sintaks: `UPDATE nama_tabel SET kolom = nilai_baru WHERE kondisi;`.',
          'Klausa `WHERE` di `UPDATE` sangat penting — kalau dihilangkan, SEMUA baris di tabel akan ikut terupdate, bukan hanya baris yang dimaksud.',
          'Kita bisa mengubah beberapa kolom sekaligus dalam satu `UPDATE`, dipisahkan koma di bagian `SET`, misal `SET nilai = 95, kelas_id = 2`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Budi', 1, 85.5);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Siti', 1, 90.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Andi', 2, 78.0);

SELECT * FROM siswa;

UPDATE siswa SET nilai = 88.0 WHERE nama = 'Andi';

SELECT * FROM siswa;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi jika UPDATE dijalankan tanpa klausa WHERE?', [
            ['Semua baris di tabel ikut terupdate', true],
            ['Tidak ada baris yang berubah', false],
            ['Perintah otomatis dibatalkan', false],
            ['Hanya baris pertama yang berubah', false],
          ]),
          q('Klausa apa yang dipakai untuk menentukan kolom mana yang diubah dan nilai barunya?', [
            ['SET', true],
            ['WHERE', false],
            ['VALUES', false],
            ['INTO', false],
          ]),
          q('Sintaks dasar UPDATE yang benar adalah?', [
            ['UPDATE tabel SET kolom = nilai WHERE kondisi;', true],
            ['UPDATE tabel VALUES (kolom = nilai);', false],
            ['UPDATE INTO tabel SET kolom = nilai;', false],
            ['CHANGE tabel SET kolom = nilai;', false],
          ]),
        ],
      },
      {
        title: 'DELETE',
        slug: 'sqlfz-delete',
        content: [
          '`DELETE FROM` menghapus baris dari tabel. Sintaks: `DELETE FROM nama_tabel WHERE kondisi;`. Hanya baris yang memenuhi kondisi yang terhapus; tabelnya sendiri beserta kolom-kolomnya tetap ada.',
          "```sql\nDELETE FROM siswa WHERE nama = 'Andi';\n```",
          '## Bahaya DELETE tanpa WHERE',
          'Sama seperti `UPDATE`, klausa `WHERE` di `DELETE` sangat krusial — `DELETE FROM siswa;` tanpa `WHERE` akan menghapus SEMUA baris di tabel `siswa`, tanpa peringatan tambahan (tabelnya tetap ada, hanya kosong). SQLite tidak punya perintah `UNDO` untuk membatalkan penghapusan yang sudah dijalankan.',
          '## Praktik aman',
          'Sebelum menjalankan `DELETE`, coba dulu `SELECT` dengan kondisi `WHERE` yang sama untuk memastikan baris yang akan terhapus memang benar-benar yang dimaksud.',
          '## Id bekas dipakai lagi',
          'Ingat dari lesson `INSERT INTO`: id baru pada `INTEGER PRIMARY KEY` dihitung dari id terbesar yang masih ada. Jadi kalau baris dengan id terbesar dihapus lalu baris baru ditambahkan tanpa menyebut id, baris baru memakai id yang sama dengan baris yang baru dihapus.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Budi', 1, 85.5);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Siti', 1, 90.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Andi', 2, 78.0);

SELECT * FROM siswa;

-- Praktik aman: cek dulu baris yang akan dihapus dengan WHERE yang sama.
SELECT * FROM siswa WHERE nama = 'Andi';

DELETE FROM siswa WHERE nama = 'Andi';

SELECT * FROM siswa;

-- Andi punya id terbesar (3). Setelah dihapus, id terbesar yang tersisa adalah 2,
-- jadi baris baru tanpa id mendapat id 3 lagi.
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Dewi', 2, 80.0);

SELECT * FROM siswa;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang terjadi jika DELETE FROM siswa; dijalankan tanpa WHERE?', [
            ['Semua baris terhapus, tetapi tabel siswa dan kolom-kolomnya tetap ada', true],
            ['Hanya baris pertama yang terhapus', false],
            ['Tabel siswa ikut terhapus beserta strukturnya', false],
            ['Perintah ditolak karena DELETE wajib memakai WHERE', false],
          ]),
          q('Cara apa yang aman untuk memastikan baris yang akan dihapus sudah benar?', [
            ['Jalankan dulu SELECT dengan kondisi WHERE yang sama, baru DELETE', true],
            ['Jalankan DELETE dulu, kalau salah batalkan dengan perintah UNDO', false],
            ['Tambahkan LIMIT 1 supaya hanya satu baris yang terhapus', false],
            ['Hapus semua baris dulu lalu masukkan kembali yang diperlukan', false],
          ]),
          q(
            'Tabel siswa dengan id INTEGER PRIMARY KEY (tanpa AUTOINCREMENT) berisi id 1, 2, 3. Baris id 3 dihapus, lalu baris baru ditambahkan tanpa menyebut id. Berapa id baris baru?',
            [
              ['3, karena id terbesar yang tersisa adalah 2 dan id baru adalah 2 + 1', true],
              ['4, karena id 3 sudah pernah dipakai dan tidak akan dipakai lagi', false],
              ['1, karena SQLite mengisi id kosong terkecil lebih dulu', false],
              ['NULL, karena baris sebelumnya sudah dihapus', false],
            ],
          ),
        ],
      },
      {
        title: 'Studi Kasus Gabungan',
        slug: 'sqlfz-studi-kasus-gabungan',
        content: [
          'Sepanjang course ini kita sudah belajar `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `ORDER BY`, fungsi agregat, `GROUP BY`/`HAVING`, `JOIN`, subquery, `UPDATE`, dan `DELETE` — cukup untuk mulai membangun dan menganalisis database relasional sungguhan.',
          'Lesson penutup ini menggabungkan semuanya dalam satu skenario: dua tabel berelasi (`kelas` dan `siswa`), lalu query yang menggabungkan `JOIN`, `GROUP BY`, dan `ORDER BY` sekaligus untuk mendapatkan ringkasan per kelas.',
          'Coba baca skrip di sandbox baris demi baris: perhatikan urutan eksekusinya — tabel dibuat, data dimasukkan, baru kemudian data dibaca & dianalisis. Ini pola yang akan terus dipakai di proyek database nyata.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `.headers on
.mode column

CREATE TABLE kelas (
  id INTEGER PRIMARY KEY,
  nama_kelas TEXT
);

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO kelas (id, nama_kelas) VALUES (1, 'X IPA 1');
INSERT INTO kelas (id, nama_kelas) VALUES (2, 'X IPA 2');

INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Budi', 1, 85.5);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Siti', 1, 90.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Andi', 2, 78.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Bella', 2, 92.0);

SELECT kelas.nama_kelas, COUNT(siswa.id) AS jumlah_siswa, AVG(siswa.nilai) AS rata_rata_nilai
FROM kelas
INNER JOIN siswa ON kelas.id = siswa.kelas_id
GROUP BY kelas.nama_kelas
ORDER BY rata_rata_nilai DESC;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Urutan langkah yang benar saat bekerja dengan database dari nol adalah?', [
            ['CREATE TABLE, lalu INSERT data, baru SELECT/analisis', true],
            ['SELECT dulu sebelum tabel dibuat', false],
            ['DELETE dulu sebelum ada data', false],
            ['UPDATE dulu sebelum INSERT', false],
          ]),
          q('Query yang menggabungkan JOIN, GROUP BY, dan ORDER BY biasanya dipakai untuk?', [
            ['Membuat ringkasan/analisis data dari beberapa tabel berelasi', true],
            ['Menghapus data secara permanen', false],
            ['Membuat tabel baru', false],
            ['Mengubah tipe data kolom', false],
          ]),
          q(
            'Fungsi agregat apa yang dipakai untuk menghitung jumlah siswa per kelas dalam studi kasus ini?',
            [
              ['COUNT()', true],
              ['SUM()', false],
              ['LEN()', false],
              ['SIZE()', false],
            ],
          ),
        ],
      },
    ],
  },
]

const course: CourseDef = {
  title: 'SQL from Zero',
  slug: 'sql-from-zero',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: [
    'SQL from Zero adalah course pengantar untuk kamu yang belum pernah menulis query database: calon developer, analis data, atau siapa saja yang ingin tahu cara menyimpan dan mengambil data terstruktur. Tidak perlu pengalaman programming sebelumnya.',
    'Di sini kamu belajar apa itu database relasional, membuat tabel dengan `CREATE TABLE`, dan tipe data SQLite (storage class dan type affinity, termasuk kenapa tipe kolom di SQLite hanya rekomendasi). Lalu `INSERT`, `SELECT`, `WHERE` (dengan `IN`, `BETWEEN`, dan `LIKE`), `ORDER BY`/`LIMIT`/`OFFSET`, fungsi agregat, `GROUP BY`, `HAVING`, dan `DISTINCT`. Setelah itu relasi antar tabel lewat primary key, foreign key (dan kenapa di SQLite harus diaktifkan dulu), `INNER JOIN`, `LEFT JOIN`, serta subquery, ditutup dengan `UPDATE`, `DELETE`, dan studi kasus gabungan. Hampir semua lesson punya contoh yang bisa langsung dijalankan di code sandbox dan dilengkapi quiz pilihan ganda.',
    'Sandbox di course ini menjalankan SQL dengan SQLite 3.27.2 lewat shell `sqlite3`: setiap contoh adalah skrip mandiri yang membuat tabelnya sendiri, dan dua baris pertamanya (`.headers on` dan `.mode column`) membuat hasil query tampil lengkap dengan judul kolom. Karena versinya 3.27.2, fitur SQLite yang lebih baru (misalnya `RETURNING`, `DROP COLUMN`, atau `HAVING` tanpa `GROUP BY`) tidak tersedia, dan sintaks khas MySQL atau PostgreSQL tidak selalu jalan. Perbedaan penting disebut di lesson terkait. Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun.',
  ].join('\n\n'),
  sandboxLanguage: 'sql',
  modules,
}

export default course
