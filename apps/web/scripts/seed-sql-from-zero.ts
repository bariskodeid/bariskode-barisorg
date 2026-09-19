import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "SQL from Zero" — meniru pola seed-python-from-zero.ts /
// seed-linux-from-zero.ts. Jalankan: pnpm seed:sql

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
          '`CREATE TABLE` dipakai untuk membuat tabel baru, diikuti nama tabel dan daftar kolom beserta tipe datanya dalam tanda kurung.',
          'Setiap kolom didefinisikan dengan `nama_kolom tipe_data`, dipisahkan koma. Kita juga bisa menandai kolom sebagai `PRIMARY KEY` — id unik yang mengidentifikasi tiap baris secara unik.',
          'Contoh: `CREATE TABLE siswa (id INTEGER PRIMARY KEY, nama TEXT, umur INTEGER);` membuat tabel `siswa` dengan tiga kolom.',
          'Setelah tabel dibuat, kita bisa langsung mencoba `SELECT` dari tabel itu untuk memastikan strukturnya benar, walau isinya masih kosong.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  umur INTEGER,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (id, nama, umur, kelas_id, nilai) VALUES (1, 'Budi', 16, 1, 85.5);

SELECT * FROM siswa;
`,
      },
      {
        title: 'Tipe Data SQL',
        slug: 'sqlfz-tipe-data-sql',
        content: [
          'SQLite (mesin yang dipakai sandbox course ini) punya sistem tipe data yang lebih longgar dibanding database lain, disebut "type affinity" — lima kelas utama: `INTEGER` (bilangan bulat), `REAL` (bilangan desimal/floating point), `TEXT` (string/teks), `BLOB` (data biner mentah), dan `NULL` (nilai kosong/tidak ada).',
          '`INTEGER` dipakai untuk kolom seperti umur atau id. `REAL` cocok untuk nilai desimal seperti nilai ujian atau harga. `TEXT` dipakai untuk nama, alamat, atau string lain.',
          '`NULL` bukan berarti angka nol atau string kosong — `NULL` berarti benar-benar tidak ada nilai. Ini penting dipahami karena perbandingan dengan `NULL` punya aturan khusus (`IS NULL`, bukan `= NULL`).',
          'Di database lain seperti PostgreSQL/MySQL tipe data lebih ketat (`VARCHAR(50)`, `DECIMAL`, `BOOLEAN`, dll), tapi konsep dasarnya sama: setiap kolom punya tipe data yang menentukan jenis nilai apa yang boleh disimpan.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Tipe data apa di SQLite untuk menyimpan bilangan bulat?', [
            ['INTEGER', true],
            ['TEXT', false],
            ['REAL', false],
            ['BLOB', false],
          ]),
          q('Tipe data apa yang cocok untuk menyimpan nilai desimal seperti 85.5?', [
            ['REAL', true],
            ['INTEGER', false],
            ['TEXT', false],
            ['NULL', false],
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
          'Kolom bertipe `TEXT` ditulis dalam tanda kutip satu (`\'Budi\'`), sedangkan angka (`INTEGER`/`REAL`) ditulis langsung tanpa kutip.',
          'Kita bisa menambahkan banyak baris sekaligus dengan menjalankan beberapa perintah `INSERT INTO` berurutan, atau memisahkan tiap grup `VALUES` dengan koma dalam satu perintah.',
          'Kalau kolom `id` sudah didefinisikan sebagai `INTEGER PRIMARY KEY`, SQLite bisa mengisi nilainya otomatis (auto-increment) kalau kita tidak menyebutkan kolom `id` sama sekali saat INSERT.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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
`,
        hasQuiz: true,
        quizQuestions: [
          q('Perintah apa untuk menambahkan baris data baru ke tabel?', [
            ['INSERT INTO', true],
            ['CREATE TABLE', false],
            ['ADD ROW', false],
            ['NEW DATA', false],
          ]),
          q('Bagaimana cara menulis nilai TEXT dalam perintah INSERT?', [
            ["Dalam tanda kutip satu, misal 'Budi'", true],
            ['Tanpa kutip sama sekali', false],
            ['Dalam tanda kurung siku []', false],
            ['Dalam tanda kurung kurawal {}', false],
          ]),
          q(
            'Jika kolom id bertipe INTEGER PRIMARY KEY dan tidak disebutkan saat INSERT, apa yang terjadi?',
            [
              ['SQLite mengisi otomatis (auto-increment)', true],
              ['Insert akan gagal', false],
              ['Nilainya selalu 0', false],
              ['Kolom id dihapus', false],
            ],
          ),
        ],
      },
      {
        title: 'SELECT Dasar',
        slug: 'sqlfz-select-dasar',
        content: [
          '`SELECT` dipakai mengambil (membaca) data dari tabel. `SELECT * FROM nama_tabel;` mengambil semua kolom dan semua baris.',
          'Untuk mengambil kolom tertentu saja, sebutkan nama kolomnya dipisah koma: `SELECT nama, umur FROM siswa;` — lebih efisien dibanding `*` kalau tabel punya banyak kolom yang tidak semuanya dibutuhkan.',
          'Kita bisa memberi alias (nama sementara) untuk kolom hasil dengan `AS`, misal `SELECT nama AS nama_siswa FROM siswa;` — berguna untuk mempercantik nama kolom di hasil query.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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
`,
      },
      {
        title: 'WHERE & Filtering',
        slug: 'sqlfz-where-filtering',
        content: [
          'Klausa `WHERE` menyaring baris berdasarkan kondisi tertentu, ditulis setelah `FROM`. Contoh: `SELECT * FROM siswa WHERE umur > 16;` hanya mengambil siswa berumur di atas 16.',
          'Operator perbandingan yang bisa dipakai: `=`, `!=` (atau `<>`), `>`, `<`, `>=`, `<=`. Operator logika `AND`/`OR` menggabungkan beberapa kondisi, `NOT` membalik kondisi.',
          'Operator tambahan berguna: `LIKE` untuk pencocokan pola teks (misal `nama LIKE \'B%\'` mencari nama berawalan B), `IN` untuk mencocokkan salah satu dari beberapa nilai, `BETWEEN` untuk rentang nilai.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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

SELECT * FROM siswa WHERE umur > 16;

SELECT * FROM siswa WHERE kelas_id = 1 AND nilai >= 85;

SELECT * FROM siswa WHERE nama LIKE 'B%';
`,
        hasQuiz: true,
        quizQuestions: [
          q('Klausa apa untuk menyaring baris berdasarkan kondisi tertentu?', [
            ['WHERE', true],
            ['FILTER', false],
            ['HAVING', false],
            ['SELECT', false],
          ]),
          q(
            'Operator apa yang dipakai untuk mencocokkan pola teks, misal nama berawalan huruf tertentu?',
            [
              ['LIKE', true],
              ['MATCH', false],
              ['EQUAL', false],
              ['REGEX', false],
            ],
          ),
          q('Query "SELECT * FROM siswa WHERE umur > 16;" akan menghasilkan apa?', [
            ['Semua siswa dengan umur lebih dari 16', true],
            ['Semua siswa tanpa terkecuali', false],
            ['Hanya siswa berumur tepat 16', false],
            ['Error karena WHERE tidak valid', false],
          ]),
        ],
      },
      {
        title: 'ORDER BY & LIMIT',
        slug: 'sqlfz-order-by-limit',
        content: [
          '`ORDER BY` mengurutkan hasil query berdasarkan satu atau lebih kolom. Default urutannya menaik (`ASC`), tambahkan `DESC` untuk urutan menurun.',
          '`LIMIT` membatasi jumlah baris yang dikembalikan, berguna misalnya untuk mengambil "beberapa nilai tertinggi" tanpa menampilkan seluruh data.',
          '`ORDER BY` dan `LIMIT` sering dipakai bersama, misal `SELECT * FROM siswa ORDER BY nilai DESC LIMIT 3;` mengambil 3 siswa dengan nilai tertinggi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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
`,
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
          '`COUNT(*)` menghitung semua baris tanpa peduli isi kolom, sedangkan `COUNT(kolom)` menghitung baris yang kolomnya tidak `NULL`.',
          'Fungsi agregat biasanya dipakai di `SELECT` tanpa `GROUP BY` kalau kita ingin satu angka ringkasan untuk seluruh tabel, misal rata-rata nilai seluruh siswa.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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

SELECT COUNT(*) AS jumlah_siswa FROM siswa;
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
        ],
      },
      {
        title: 'GROUP BY',
        slug: 'sqlfz-group-by',
        content: [
          '`GROUP BY` mengelompokkan baris yang punya nilai sama pada kolom tertentu, lalu fungsi agregat dihitung per kelompok, bukan untuk seluruh tabel sekaligus.',
          'Contoh: `SELECT kelas_id, AVG(nilai) FROM siswa GROUP BY kelas_id;` menghasilkan rata-rata nilai untuk setiap `kelas_id` secara terpisah.',
          'Aturan penting: setiap kolom di `SELECT` yang bukan hasil fungsi agregat harus ikut disebutkan di `GROUP BY`, kalau tidak hasilnya ambigu/error di banyak database.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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
`,
      },
      {
        title: 'HAVING',
        slug: 'sqlfz-having',
        content: [
          '`HAVING` menyaring hasil SETELAH `GROUP BY` dilakukan, sedangkan `WHERE` menyaring baris SEBELUM dikelompokkan. Ini perbedaan paling penting antara keduanya.',
          'Karena `HAVING` bekerja setelah grouping, dia bisa memakai hasil fungsi agregat dalam kondisinya, sesuatu yang tidak bisa dilakukan `WHERE`. Contoh: `HAVING AVG(nilai) >= 85` valid, tapi `WHERE AVG(nilai) >= 85` akan error.',
          'Contoh lengkap: `SELECT kelas_id, AVG(nilai) FROM siswa GROUP BY kelas_id HAVING AVG(nilai) >= 85;` hanya menampilkan kelas yang rata-rata nilainya minimal 85.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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

SELECT kelas_id, AVG(nilai) AS rata_rata_nilai
FROM siswa
GROUP BY kelas_id
HAVING AVG(nilai) >= 85;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa perbedaan utama WHERE dan HAVING?', [
            ['WHERE menyaring sebelum grouping, HAVING setelah grouping', true],
            ['Keduanya persis sama fungsinya', false],
            ['HAVING dipakai sebelum SELECT, WHERE setelah', false],
            ['WHERE hanya untuk teks, HAVING hanya untuk angka', false],
          ]),
          q('Kenapa "WHERE AVG(nilai) >= 85" akan error?', [
            ['WHERE tidak bisa memakai hasil fungsi agregat', true],
            ['Sintaks WHERE salah total', false],
            ['AVG() tidak valid di SQL', false],
            ['Angka 85 tidak boleh dipakai di WHERE', false],
          ]),
          q('Klausa apa yang harus dipakai bersama HAVING?', [
            ['GROUP BY', true],
            ['ORDER BY', false],
            ['LIMIT', false],
            ['DISTINCT', false],
          ]),
        ],
      },
      {
        title: 'DISTINCT',
        slug: 'sqlfz-distinct',
        content: [
          '`DISTINCT` menghilangkan baris duplikat dari hasil query, hanya menampilkan nilai unik. Ditulis tepat setelah `SELECT`: `SELECT DISTINCT kolom FROM tabel;`.',
          'Berguna misalnya untuk melihat daftar `kelas_id` yang benar-benar dipakai tanpa duplikat, walau ada banyak siswa dengan `kelas_id` yang sama.',
          '`DISTINCT` bisa diterapkan ke lebih dari satu kolom sekaligus — kombinasi nilai dari kolom-kolom itu yang dianggap unik, bukan masing-masing kolom secara terpisah.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
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

SELECT kelas_id FROM siswa;

SELECT DISTINCT kelas_id FROM siswa;

SELECT DISTINCT umur, kelas_id FROM siswa;
`,
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
          'Primary key adalah kolom (atau kombinasi kolom) yang secara unik mengidentifikasi tiap baris dalam sebuah tabel — nilainya tidak boleh duplikat dan tidak boleh `NULL`. Contoh: kolom `id` di tabel `siswa`.',
          'Foreign key adalah kolom di satu tabel yang merujuk ke primary key tabel lain, dipakai untuk membangun relasi antar tabel. Contoh: kolom `kelas_id` di tabel `siswa` bisa jadi foreign key yang merujuk ke `id` di tabel `kelas`.',
          'Dengan relasi ini, kita tidak perlu mengulang data kelas (nama kelas, wali kelas, dst) di setiap baris siswa — cukup simpan `kelas_id`, lalu ambil detail kelas dari tabel `kelas` saat dibutuhkan. Ini mengurangi duplikasi data, disebut normalisasi.',
          'Untuk menggabungkan data dari dua tabel yang berelasi seperti ini, SQL menyediakan perintah `JOIN`, yang akan dipelajari di lesson berikutnya.',
        ],
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
            ['Kolom yang selalu bertipe TEXT', false],
            ['Kolom yang nilainya selalu NULL', false],
            ['Nama lain dari primary key', false],
          ]),
          q('Kenapa memisahkan data ke beberapa tabel berelasi (normalisasi) itu berguna?', [
            ['Mengurangi duplikasi data', true],
            ['Membuat query selalu lebih lambat', false],
            ['Supaya database tidak bisa di-backup', false],
            ['Karena SQL mewajibkannya', false],
          ]),
          q('Perintah SQL apa yang dipakai untuk menggabungkan data dari dua tabel berelasi?', [
            ['JOIN', true],
            ['MERGE ROWS', false],
            ['COMBINE', false],
            ['LINK TABLE', false],
          ]),
        ],
      },
      {
        title: 'INNER JOIN',
        slug: 'sqlfz-inner-join',
        content: [
          '`INNER JOIN` menggabungkan baris dari dua tabel berdasarkan kolom yang berelasi, hanya menampilkan baris yang punya pasangan cocok di KEDUA tabel.',
          'Sintaks: `SELECT ... FROM tabel_a INNER JOIN tabel_b ON tabel_a.kolom = tabel_b.kolom;`. Klausa `ON` menentukan syarat penggabungan, biasanya foreign key = primary key.',
          'Kalau ada siswa dengan `kelas_id` yang tidak ada di tabel `kelas` (atau sebaliknya, kelas tanpa siswa), baris itu TIDAK akan muncul di hasil `INNER JOIN` — hanya pasangan yang benar-benar cocok yang ditampilkan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE kelas (
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

INSERT INTO siswa (nama, kelas_id) VALUES ('Budi', 1);
INSERT INTO siswa (nama, kelas_id) VALUES ('Siti', 1);
INSERT INTO siswa (nama, kelas_id) VALUES ('Andi', 2);

SELECT siswa.nama, kelas.nama_kelas
FROM siswa
INNER JOIN kelas ON siswa.kelas_id = kelas.id;
`,
        hasQuiz: true,
        quizQuestions: [
          q('Klausa apa yang menentukan syarat penggabungan dua tabel di JOIN?', [
            ['ON', true],
            ['WHERE', false],
            ['WITH', false],
            ['USING ONLY', false],
          ]),
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
        ],
      },
      {
        title: 'LEFT JOIN',
        slug: 'sqlfz-left-join',
        content: [
          '`LEFT JOIN` (atau `LEFT OUTER JOIN`) menampilkan SEMUA baris dari tabel kiri (tabel pertama), meskipun tidak ada pasangan yang cocok di tabel kanan. Kalau tidak ada pasangan, kolom dari tabel kanan akan berisi `NULL`.',
          'Ini berbeda dengan `INNER JOIN` yang hanya menampilkan baris yang benar-benar punya pasangan di kedua tabel.',
          '`LEFT JOIN` berguna misalnya untuk menampilkan semua kelas termasuk yang belum punya siswa sama sekali, sesuatu yang tidak akan muncul kalau memakai `INNER JOIN`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE kelas (
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
          'Subquery adalah query di dalam query lain, biasanya ditulis dalam tanda kurung. Subquery (inner query) dijalankan lebih dulu, hasilnya dipakai oleh query utama (outer query).',
          'Subquery sering dipakai di dalam klausa `WHERE`, misal mencari siswa yang nilainya di atas rata-rata: `SELECT nama FROM siswa WHERE nilai > (SELECT AVG(nilai) FROM siswa);`.',
          'Subquery juga bisa dipakai dengan `IN` untuk mencocokkan terhadap daftar hasil query lain, misal mencari siswa yang `kelas_id`-nya ada di daftar kelas tertentu.',
          'Untuk kasus yang lebih kompleks, `JOIN` biasanya lebih efisien dibanding subquery, tapi subquery seringkali lebih mudah dibaca untuk logika sederhana seperti perbandingan terhadap agregat.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Budi', 1, 85.5);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Siti', 1, 90.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Andi', 2, 78.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Bella', 2, 92.0);

SELECT nama, nilai
FROM siswa
WHERE nilai > (SELECT AVG(nilai) FROM siswa);
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa itu subquery?', [
            ['Query di dalam query lain', true],
            ['Query yang selalu error', false],
            ['Nama lain dari JOIN', false],
            ['Query tanpa SELECT', false],
          ]),
          q('Dalam subquery bersarang, mana yang dijalankan lebih dulu?', [
            ['Subquery (inner query)', true],
            ['Query utama (outer query)', false],
            ['Keduanya dijalankan bersamaan tanpa urutan', false],
            ['Tergantung urutan penulisan dari kiri ke kanan', false],
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
        sandboxStarterCode: `CREATE TABLE siswa (
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
          '`DELETE FROM` menghapus baris dari tabel. Sintaks: `DELETE FROM nama_tabel WHERE kondisi;`.',
          'Sama seperti `UPDATE`, klausa `WHERE` di `DELETE` sangat krusial — `DELETE FROM siswa;` tanpa `WHERE` akan menghapus SEMUA baris di tabel `siswa`, tanpa peringatan tambahan.',
          'Praktik aman: sebelum menjalankan `DELETE`, coba dulu `SELECT` dengan kondisi `WHERE` yang sama untuk memastikan baris yang akan terhapus memang benar-benar yang dimaksud.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kelas_id INTEGER,
  nilai REAL
);

INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Budi', 1, 85.5);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Siti', 1, 90.0);
INSERT INTO siswa (nama, kelas_id, nilai) VALUES ('Andi', 2, 78.0);

SELECT * FROM siswa;

DELETE FROM siswa WHERE nama = 'Andi';

SELECT * FROM siswa;
`,
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
        sandboxStarterCode: `CREATE TABLE kelas (
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
      title: 'SQL from Zero',
      slug: 'sql-from-zero',
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
            ? { sandboxLanguage: 'sql', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "SQL from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

await main()
