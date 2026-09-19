import { getPayload } from 'payload'
import config from '../src/payload.config'

// Seed course "Linux from Zero" — course produksi pertama, sekaligus bukti
// konsep fitur code sandbox (Judge0, bahasa bash) dan quiz dipakai bareng
// dalam satu course nyata. Jalankan: pnpm seed:linux
// Tidak menimpa/mengubah seed-dev.ts (fixture dev umum) — script terpisah.

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

// Bentuk Lexical JSON minimal ini meniru pola yang sudah terbukti jalan di
// seed-dev.ts (Posts.content) — hanya node paragraph/text, hindari menebak
// shape node code/heading custom yang belum ada preseden di repo ini.
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
    title: 'Pengenalan Linux',
    lessons: [
      {
        title: 'Apa itu Linux?',
        slug: 'lfz-apa-itu-linux',
        content: [
          'Linux adalah kernel sistem operasi open source yang pertama kali dibuat oleh Linus Torvalds pada tahun 1991. Kernel adalah inti sistem operasi yang mengatur komunikasi antara perangkat keras (hardware) dan perangkat lunak (software).',
          "Yang biasa kita sebut 'Linux' sebenarnya adalah distribusi (distro) — gabungan kernel Linux dengan berbagai software pendukung seperti shell, package manager, dan desktop environment. Contoh distro populer: Ubuntu, Debian, Fedora, Arch Linux, dan CentOS.",
          'Karena open source, kode sumber Linux bisa dilihat, dimodifikasi, dan didistribusikan ulang oleh siapa saja di bawah lisensi GPL. Ini berbeda dengan sistem operasi proprietary seperti Windows atau macOS.',
          'Linux banyak dipakai di server, cloud computing, embedded system, dan supercomputer karena stabil, ringan, dan gratis. Bahkan Android juga memakai kernel Linux di dalamnya.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa yang pertama kali membuat kernel Linux?', [
            ['Linus Torvalds', true],
            ['Richard Stallman', false],
            ['Dennis Ritchie', false],
            ['Bill Gates', false],
          ]),
          q('Apa perbedaan kernel dan distro?', [
            ['Kernel adalah inti OS, distro adalah kernel + software pendukung', true],
            ['Kernel dan distro adalah hal yang sama', false],
            ['Distro lebih kecil ukurannya dari kernel', false],
            ['Kernel hanya ada di sistem operasi Windows', false],
          ]),
          q('Lisensi apa yang umum dipakai Linux?', [
            ['GPL', true],
            ['MIT', false],
            ['Proprietary', false],
            ['Freeware tanpa source code', false],
          ]),
          q('Manakah yang BUKAN distro Linux?', [
            ['Ubuntu', false],
            ['Debian', false],
            ['Windows Server', true],
            ['Fedora', false],
          ]),
        ],
      },
      {
        title: 'Anatomi Filesystem Linux',
        slug: 'lfz-anatomi-filesystem',
        content: [
          "Linux mengikuti standar Filesystem Hierarchy Standard (FHS) yang mengatur di mana tiap jenis file harus disimpan. Semua berawal dari satu direktori akar bernama `/` (root) — berbeda dengan Windows yang punya banyak drive seperti C:\\ dan D:\\.",
          "`/home` berisi folder pribadi tiap user, mirip 'My Documents' di Windows. `/etc` menyimpan file konfigurasi sistem. `/var` menyimpan data yang sering berubah seperti log dan cache.",
          '`/bin` dan `/usr/bin` menyimpan program yang bisa dijalankan (executable). `/tmp` untuk file sementara yang boleh dihapus kapan saja. `/root` adalah home direktori khusus untuk user root (administrator).',
          'Memahami struktur ini penting karena banyak perintah dan aplikasi Linux mengasumsikan lokasi standar ini — misalnya konfigurasi web server nginx ada di `/etc/nginx`, bukan lokasi acak.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Direktori mana yang menyimpan file konfigurasi sistem?', [
            ['/etc', true],
            ['/tmp', false],
            ['/bin', false],
            ['/home', false],
          ]),
          q('Apa fungsi direktori /home?', [
            ['Folder pribadi tiap user', true],
            ['Konfigurasi sistem', false],
            ['File sementara', false],
            ['Program executable', false],
          ]),
          q('Direktori akar di Linux dilambangkan dengan?', [
            ['/', true],
            ['C:\\', false],
            ['~', false],
            ['root:', false],
          ]),
          q('Direktori mana yang isinya boleh dihapus kapan saja?', [
            ['/tmp', true],
            ['/etc', false],
            ['/bin', false],
            ['/var', false],
          ]),
        ],
      },
      {
        title: 'Masuk ke Terminal',
        slug: 'lfz-masuk-ke-terminal',
        content: [
          'Terminal adalah antarmuka berbasis teks untuk berinteraksi dengan sistem Linux lewat perintah (command). Kamu mengetik perintah, menekan Enter, sistem menjalankannya lalu menampilkan hasilnya.',
          '`pwd` (print working directory) menampilkan lokasi direktori saat ini, `whoami` menampilkan nama user yang sedang login, dan `echo` menampilkan teks ke layar.',
          'Coba jalankan skrip di sandbox berikut untuk melihat ketiga perintah ini bekerja. Perhatikan outputnya di panel hasil.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "=== Lokasi direktori saat ini ==="
pwd

echo "=== Siapa saya? ==="
whoami

echo "=== Halo dari terminal ==="
echo "Selamat belajar Linux from Zero!"
`,
      },
    ],
  },
  {
    title: 'Navigasi & Manajemen File',
    lessons: [
      {
        title: 'Navigasi Direktori',
        slug: 'lfz-navigasi-direktori',
        content: [
          '`pwd` menampilkan direktori aktif, `ls` menampilkan isi direktori, dan `cd` (change directory) berpindah direktori.',
          "`ls -la` adalah kombinasi populer: `-l` menampilkan format panjang (permission, ukuran, tanggal), `-a` menampilkan file tersembunyi (nama diawali titik, misal `.bashrc`).",
          'Path bisa absolut (dimulai dari `/`, misal `/home/user/dokumen`) atau relatif (dari posisi saat ini, misal `../dokumen` untuk naik satu level lalu masuk folder dokumen).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "Direktori saat ini:"
pwd

mkdir -p proyek/dokumen
cd proyek
echo "Pindah ke folder proyek, isinya:"
ls -la

cd dokumen
echo "Sekarang di dalam dokumen:"
pwd
`,
      },
      {
        title: 'Membuat & Menghapus File/Folder',
        slug: 'lfz-membuat-menghapus-file',
        content: [
          '`mkdir` membuat folder baru, `touch` membuat file kosong baru (atau update timestamp file yang sudah ada). `mkdir -p` membuat folder bertingkat sekaligus tanpa error kalau parent-nya belum ada.',
          '`cp` menyalin file/folder (`cp -r` untuk folder), `mv` memindahkan atau me-rename file/folder, dan `rm` menghapus file (`rm -r` untuk folder, `rm -rf` untuk paksa tanpa konfirmasi).',
          'Hati-hati dengan `rm -rf` — perintah ini menghapus permanen tanpa Recycle Bin. Selalu periksa ulang path sebelum menekan Enter, apalagi memakai wildcard seperti `*`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
mkdir -p latihan/backup
touch latihan/catatan.txt
echo "Isi awal" > latihan/catatan.txt

cp latihan/catatan.txt latihan/backup/catatan-cadangan.txt
mv latihan/catatan.txt latihan/catatan-final.txt

echo "Isi folder latihan:"
ls -la latihan

echo "Isi folder backup:"
ls -la latihan/backup

rm latihan/backup/catatan-cadangan.txt
echo "Setelah dihapus:"
ls -la latihan/backup
`,
        hasQuiz: true,
        quizQuestions: [
          q('Perintah apa untuk membuat folder bertingkat sekaligus?', [
            ['mkdir -p', true],
            ['touch -p', false],
            ['cp -r', false],
            ['mv -p', false],
          ]),
          q('Apa fungsi rm -rf?', [
            ['Menghapus paksa folder & isinya tanpa konfirmasi', true],
            ['Menyalin folder', false],
            ['Membuat folder baru', false],
            ['Menampilkan isi folder', false],
          ]),
          q('Perintah apa untuk memindahkan atau me-rename file?', [
            ['mv', true],
            ['cp', false],
            ['touch', false],
            ['ls', false],
          ]),
          q('Apa yang dilakukan touch pada file yang sudah ada?', [
            ['Update timestamp file', true],
            ['Menghapus file', false],
            ['Mengubah permission', false],
            ['Mengompres file', false],
          ]),
        ],
      },
      {
        title: 'Melihat Isi File',
        slug: 'lfz-melihat-isi-file',
        content: [
          '`cat` menampilkan seluruh isi file sekaligus ke layar — cocok untuk file pendek. `less` menampilkan isi file per halaman, bisa discroll, cocok untuk file panjang (tekan `q` untuk keluar).',
          '`head` menampilkan beberapa baris pertama file (default 10 baris), `tail` menampilkan beberapa baris terakhir. Keduanya menerima opsi `-n` untuk menentukan jumlah baris, misal `head -n 5`.',
          '`tail -f` sering dipakai untuk memantau file log secara real-time karena terus menampilkan baris baru yang ditambahkan ke file.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
seq 1 20 > angka.txt

echo "=== Isi lengkap (cat) ==="
cat angka.txt

echo "=== 5 baris pertama (head) ==="
head -n 5 angka.txt

echo "=== 5 baris terakhir (tail) ==="
tail -n 5 angka.txt
`,
      },
      {
        title: 'Mencari File',
        slug: 'lfz-mencari-file',
        content: [
          "`find` mencari file/folder berdasarkan nama, tipe, ukuran, atau kriteria lain, dijelajahi langsung dari filesystem. Contoh: `find /home -name '*.txt'` mencari semua file `.txt` di dalam `/home`.",
          '`locate` mencari file lebih cepat karena memakai database index yang di-update berkala (`updatedb`) — tapi hasilnya bisa saja belum termasuk file yang baru dibuat.',
          '`which` menampilkan lokasi lengkap (path) dari sebuah perintah/program yang terpasang, berguna untuk cek apakah suatu tool sudah terinstall dan dari mana ia dijalankan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
mkdir -p data/laporan
touch data/laporan/2024.txt data/laporan/2025.txt data/catatan.log

echo "=== Cari semua file .txt ==="
find data -name "*.txt"

echo "=== Lokasi perintah bash ==="
which bash
`,
        hasQuiz: true,
        quizQuestions: [
          q('Perintah apa yang mencari file langsung dari filesystem (bukan index)?', [
            ['find', true],
            ['locate', false],
            ['which', false],
            ['grep', false],
          ]),
          q('Perintah apa yang menampilkan path lokasi sebuah program terpasang?', [
            ['which', true],
            ['find', false],
            ['locate', false],
            ['ls', false],
          ]),
          q('Kenapa locate bisa melewatkan file yang baru saja dibuat?', [
            ['Karena locate pakai database index yang di-update berkala', true],
            ['Karena locate hanya mencari di /tmp', false],
            ['Karena locate butuh sudo', false],
            ['Karena locate hanya untuk folder', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Permission & User Management',
    lessons: [
      {
        title: 'Permission Dasar',
        slug: 'lfz-permission-dasar',
        content: [
          'Tiap file/folder di Linux punya 3 jenis izin: read (r, baca), write (w, tulis), execute (x, eksekusi) — untuk 3 kategori pemilik: owner (pemilik), group (grup), others (pengguna lain).',
          'Format permission ditampilkan seperti `-rwxr-xr--`: karakter pertama tipe file, lalu 3 karakter untuk owner, 3 untuk group, 3 untuk others. `chmod` mengubah permission ini.',
          'Mode simbolik: `chmod u+x file` menambah izin execute untuk owner. Mode oktal: `chmod 755 file` — angka 7=rwx, 5=r-x, 5=r-x untuk owner/group/others berurutan (r=4, w=2, x=1, dijumlahkan).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
touch skrip.sh
echo "Permission awal:"
ls -l skrip.sh

chmod 755 skrip.sh
echo "Setelah chmod 755:"
ls -l skrip.sh

chmod u-x skrip.sh
echo "Setelah cabut execute owner:"
ls -l skrip.sh
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa arti angka 7 dalam permission oktal?', [
            ['read + write + execute (rwx)', true],
            ['read only', false],
            ['write only', false],
            ['execute only', false],
          ]),
          q('chmod 644 memberikan permission apa ke owner?', [
            ['read + write', true],
            ['read only', false],
            ['execute only', false],
            ['tidak ada izin', false],
          ]),
          q('Ada 3 kategori pemilik permission di Linux, yaitu?', [
            ['owner, group, others', true],
            ['admin, user, guest', false],
            ['root, user, others', false],
            ['local, remote, others', false],
          ]),
          q('Perintah untuk mengubah permission file adalah?', [
            ['chmod', true],
            ['chown', false],
            ['chgrp', false],
            ['chattr', false],
          ]),
        ],
      },
      {
        title: 'Ownership',
        slug: 'lfz-ownership',
        content: [
          'Selain permission, tiap file punya owner (pemilik user) dan group (pemilik grup). `chown` mengubah owner, `chgrp` mengubah group kepemilikan.',
          'Contoh: `chown budi file.txt` mengubah owner jadi user `budi`. `chown budi:staff file.txt` mengubah owner sekaligus group jadi `staff` dalam satu perintah.',
          'Mengubah ownership biasanya butuh hak akses root/sudo, karena user biasa tidak boleh sembarangan mengambil alih kepemilikan file milik orang lain.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
touch dokumen.txt
echo "Ownership awal:"
ls -l dokumen.txt

echo "Mencoba ubah owner (mungkin gagal tanpa sudo, itu wajar):"
chown nobody dokumen.txt 2>&1 || echo "Gagal: perlu hak akses lebih tinggi (sudo/root)"
`,
      },
      {
        title: 'User, Group & sudo',
        slug: 'lfz-user-group-sudo',
        content: [
          'Linux adalah sistem multi-user — tiap user punya home direktori, UID (user ID) unik, dan bisa jadi anggota satu atau lebih group. `whoami` menampilkan user aktif, `id` menampilkan UID/GID dan daftar group.',
          '`sudo` (superuser do) mengizinkan user biasa yang terdaftar di file `/etc/sudoers` menjalankan satu perintah dengan hak akses root, tanpa perlu login penuh sebagai root — lebih aman karena tercatat di log siapa menjalankan apa.',
          'User root adalah administrator dengan akses penuh ke seluruh sistem. Praktik terbaik: jangan login langsung sebagai root sehari-hari, pakai user biasa + `sudo` hanya saat perlu, supaya kesalahan (typo perintah berbahaya) tidak langsung merusak sistem.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "User aktif:"
whoami

echo "Detail UID/GID/group:"
id
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi sudo?', [
            ['Menjalankan satu perintah dengan hak akses root', true],
            ['Membuat user baru', false],
            ['Mengganti password', false],
            ['Menghapus group', false],
          ]),
          q('Kenapa tidak disarankan login langsung sebagai root sehari-hari?', [
            ['Kesalahan perintah bisa langsung merusak sistem tanpa penghalang', true],
            ['Root tidak bisa dipakai untuk apapun', false],
            ['Root tidak boleh dipakai untuk browsing', false],
            ['Root selalu lebih lambat dari user biasa', false],
          ]),
          q('Perintah apa untuk melihat UID dan daftar group user aktif?', [
            ['id', true],
            ['whoami', false],
            ['sudo', false],
            ['useradd', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Process & Package Management',
    lessons: [
      {
        title: 'Melihat & Mengelola Process',
        slug: 'lfz-melihat-mengelola-process',
        content: [
          'Setiap program yang berjalan di Linux adalah sebuah process, punya PID (Process ID) unik. `ps` menampilkan daftar process yang sedang berjalan, `ps aux` menampilkan semua process dari semua user dengan detail lengkap.',
          '`top` menampilkan process secara real-time, terurut berdasar pemakaian CPU/memory, berguna untuk memantau performa sistem. `kill` mengirim sinyal ke process untuk menghentikannya, biasanya pakai PID: `kill 1234`.',
          '`kill -9` (SIGKILL) memaksa process berhenti seketika tanpa proses cleanup — dipakai kalau process "hang" dan tidak merespons sinyal berhenti normal (`kill` tanpa opsi mengirim SIGTERM, sinyal berhenti yang lebih sopan).',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "Daftar process (ringkas):"
ps

echo "PID skrip ini sendiri:"
echo $$
`,
      },
      {
        title: 'Package Manager',
        slug: 'lfz-package-manager',
        content: [
          'Package manager adalah tool untuk install, update, dan hapus software secara otomatis, termasuk menangani dependency (software lain yang dibutuhkan). Distro berbasis Debian/Ubuntu memakai `apt`, distro berbasis Red Hat/Fedora memakai `yum` atau `dnf`.',
          'Contoh perintah `apt`: `apt update` memperbarui daftar paket yang tersedia dari server repository, `apt install nginx` memasang software nginx beserta dependency-nya, `apt remove nginx` menghapusnya.',
          'Tanpa package manager, kita harus download source code, compile manual, dan cari sendiri semua dependency — package manager menghilangkan kerumitan itu dan menjaga versi software tetap konsisten di seluruh sistem.',
          'Catatan: sandbox latihan lain di course ini tidak menjalankan instalasi paket sungguhan (butuh akses jaringan/root yang tidak tersedia di sandbox Judge0) — lesson ini fokus pada pemahaman konsep lewat quiz.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Package manager apa yang dipakai distro berbasis Debian/Ubuntu?', [
            ['apt', true],
            ['yum', false],
            ['dnf', false],
            ['brew', false],
          ]),
          q('Apa fungsi utama package manager?', [
            ['Install/update/hapus software beserta dependency-nya', true],
            ['Mengatur permission file', false],
            ['Membuat user baru', false],
            ['Memantau process', false],
          ]),
          q('Perintah apt apa yang memperbarui daftar paket dari server repository?', [
            ['apt update', true],
            ['apt install', false],
            ['apt remove', false],
            ['apt list', false],
          ]),
          q('Package manager apa yang umum dipakai distro berbasis Red Hat/Fedora?', [
            ['yum / dnf', true],
            ['apt', false],
            ['pip', false],
            ['npm', false],
          ]),
        ],
      },
      {
        title: 'Environment Variables & PATH',
        slug: 'lfz-environment-variables-path',
        content: [
          'Environment variable adalah variabel yang tersedia untuk seluruh proses di sesi shell, dipakai menyimpan konfigurasi seperti lokasi home direktori (`$HOME`) atau bahasa sistem (`$LANG`). Lihat semua dengan `env` atau `printenv`.',
          '`PATH` adalah environment variable khusus berisi daftar direktori (dipisah `:`) yang dicari shell saat mencari lokasi sebuah perintah. Itu sebabnya mengetik `ls` bisa langsung jalan tanpa menulis path lengkapnya.',
          'Set variable sementara (hanya sesi ini) dengan `export NAMA=nilai`. Untuk permanen, tambahkan baris export itu ke file konfigurasi shell seperti `~/.bashrc`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "Nilai PATH saat ini:"
echo $PATH

export NAMA_APLIKASI="BarisORG"
echo "Variable custom:"
echo $NAMA_APLIKASI

echo "Home direktori:"
echo $HOME
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi environment variable PATH?', [
            ['Daftar direktori yang dicari shell untuk menemukan perintah', true],
            ['Menyimpan password user', false],
            ['Menyimpan permission file', false],
            ['Menyimpan daftar process aktif', false],
          ]),
          q('Perintah apa untuk membuat environment variable di sesi shell saat ini?', [
            ['export', true],
            ['chmod', false],
            ['ps', false],
            ['find', false],
          ]),
          q('Supaya environment variable permanen dipakai tiap login, ditaruh di mana?', [
            ['File konfigurasi shell seperti ~/.bashrc', true],
            ['/tmp', false],
            ['/var/log', false],
            ['Tidak bisa dibuat permanen', false],
          ]),
        ],
      },
      {
        title: 'Penjadwalan Tugas dengan Cron',
        slug: 'lfz-penjadwalan-cron',
        content: [
          'Cron adalah daemon (proses latar belakang) di Linux untuk menjalankan perintah/skrip secara otomatis pada jadwal tertentu, misalnya tiap hari jam 2 pagi atau tiap 5 menit sekali.',
          'Jadwal cron ditulis di "crontab" pakai 5 field yang mewakili menit, jam, tanggal, bulan, dan hari — dipisah spasi, diikuti perintah yang mau dijalankan. Contoh: `0 2 * * *` berarti "setiap hari jam 02:00".',
          'Edit crontab user dengan `crontab -e`, lihat isinya dengan `crontab -l`. Cron banyak dipakai untuk tugas rutin server seperti backup database (lihat `infra/backup.sh` di proyek ini) atau pembersihan file log lama.',
          'Catatan: cron adalah daemon yang berjalan terus-menerus di background — sandbox latihan di course ini bersifat sekali jalan lalu berhenti, jadi topik ini dipelajari lewat quiz konsep.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi utama cron?', [
            ['Menjalankan perintah otomatis sesuai jadwal', true],
            ['Mengatur permission file', false],
            ['Mencari file', false],
            ['Mengelola package', false],
          ]),
          q('Berapa field waktu yang dipakai dalam satu baris crontab?', [
            ['5', true],
            ['3', false],
            ['7', false],
            ['2', false],
          ]),
          q('Perintah apa untuk mengedit crontab milik user aktif?', [
            ['crontab -e', true],
            ['cron -edit', false],
            ['crontab -l', false],
            ['sudo cron', false],
          ]),
        ],
      },
    ],
  },
  {
    title: 'Shell Scripting & Text Processing',
    lessons: [
      {
        title: 'Dasar Bash Scripting',
        slug: 'lfz-dasar-bash-scripting',
        content: [
          'Bash script adalah kumpulan perintah shell ditulis dalam satu file, dijalankan berurutan seolah diketik manual satu per satu. Baris pertama biasanya shebang `#!/bin/bash` yang memberi tahu sistem interpreter apa yang dipakai.',
          'Variabel dideklarasikan tanpa spasi di sekitar `=`, misal `nama="Budi"`, dan diakses dengan awalan `$`, misal `echo $nama`. Tidak perlu deklarasi tipe data seperti bahasa lain.',
          '`echo` menampilkan teks/variabel ke layar. Kutip ganda `"..."` memperbolehkan variabel di-substitusi di dalamnya, sedangkan kutip tunggal `\'...\'` menampilkan teks apa adanya tanpa substitusi.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
nama="Siswa BarisORG"
echo "Halo, $nama!"
echo 'Variable ini tidak akan tampil: $nama'

jumlah=5
echo "Kamu punya $jumlah lesson tersisa di modul ini."
`,
      },
      {
        title: 'Percabangan & Perulangan',
        slug: 'lfz-percabangan-perulangan',
        content: [
          'Bash mendukung percabangan `if`/`elif`/`else` untuk menjalankan perintah berdasarkan kondisi, ditutup dengan `fi`. Kondisi ditulis di dalam `[ ... ]`, misal `[ $angka -gt 10 ]` berarti "angka lebih besar dari 10".',
          'Perulangan `for` dipakai mengulang perintah pada tiap item dalam daftar/range, ditutup dengan `done`. `while` mengulang selama kondisi masih benar.',
          'Operator perbandingan angka di bash beda dari bahasa lain: `-eq` (sama dengan), `-ne` (tidak sama), `-gt` (lebih besar), `-lt` (lebih kecil) — bukan `==`/`!=`/`>`/`<` seperti di Python/JavaScript.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
for angka in 1 2 3 4 5; do
  if [ $((angka % 2)) -eq 0 ]; then
    echo "$angka adalah genap"
  else
    echo "$angka adalah ganjil"
  fi
done

hitung=1
while [ $hitung -le 3 ]; do
  echo "Perulangan while ke-$hitung"
  hitung=$((hitung + 1))
done
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa kegunaan operator -gt di bash?', [
            ['Lebih besar dari', true],
            ['Sama dengan', false],
            ['Lebih kecil dari', false],
            ['Tidak sama dengan', false],
          ]),
          q('Perulangan for di bash ditutup dengan kata kunci?', [
            ['done', true],
            ['end', false],
            ['fi', false],
            ['endfor', false],
          ]),
          q('Blok if di bash ditutup dengan kata kunci?', [
            ['fi', true],
            ['end', false],
            ['done', false],
            ['endif', false],
          ]),
        ],
      },
      {
        title: 'Pipes & Redirection',
        slug: 'lfz-pipes-redirection',
        content: [
          "Pipe (`|`) menghubungkan output satu perintah jadi input perintah berikutnya, memungkinkan menggabungkan perintah kecil jadi alur kerja lebih kompleks. Contoh: `ls -la | grep txt` menampilkan hanya baris hasil `ls` yang mengandung 'txt'.",
          'Redirection mengalihkan input/output dari/ke file: `>` menulis output ke file (menimpa isi lama), `>>` menambahkan output ke akhir file (tidak menimpa), `<` membaca input dari file.',
          "Kombinasi pipe dan redirection sangat umum dalam skrip Linux, misal `cat log.txt | grep error > error-saja.txt` menyaring baris berisi 'error' lalu menyimpannya ke file baru.",
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
seq 1 10 > angka.txt
echo "File angka.txt dibuat"

echo "Angka genap saja (pakai pipe ke grep):"
cat angka.txt | grep -E '^[0-9]*[02468]$'

echo "6" >> angka.txt
echo "Isi setelah append:"
cat angka.txt
`,
      },
      {
        title: 'Text Processing dengan grep, sed, awk',
        slug: 'lfz-text-processing-grep-sed-awk',
        content: [
          '`grep` mencari baris teks yang cocok dengan pola tertentu, mendukung regular expression. `grep -i` mengabaikan huruf besar/kecil, `grep -v` menampilkan baris yang TIDAK cocok, `grep -c` menghitung jumlah baris cocok.',
          "`sed` (stream editor) memanipulasi teks baris per baris, paling umum untuk cari-ganti: `sed 's/lama/baru/'` mengganti kemunculan pertama tiap baris, tambahkan `g` (`s/lama/baru/g`) untuk mengganti semua kemunculan.",
          "`awk` adalah bahasa pemrosesan teks berbasis kolom, cocok untuk data terstruktur seperti CSV. `awk '{print $1}'` mencetak kolom pertama tiap baris (kolom dipisah spasi secara default).",
          'Ketiga tool ini sering dikombinasikan lewat pipe untuk mengolah log atau data teks tanpa perlu menulis program terpisah — kemampuan penting untuk administrasi sistem Linux sehari-hari.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
cat <<EOF > data.txt
budi,25,jakarta
siti,30,bandung
andi,22,jakarta
EOF

echo "=== Baris mengandung jakarta (grep) ==="
grep jakarta data.txt

echo "=== Ganti jakarta jadi JAKARTA (sed) ==="
sed 's/jakarta/JAKARTA/' data.txt

echo "=== Ambil kolom nama saja (awk, pemisah koma) ==="
awk -F',' '{print $1}' data.txt
`,
        hasQuiz: true,
        quizQuestions: [
          q('Perintah apa yang dipakai untuk cari-ganti teks dalam file?', [
            ['sed', true],
            ['grep', false],
            ['awk', false],
            ['find', false],
          ]),
          q('Opsi apa pada grep untuk menampilkan baris yang TIDAK cocok pola?', [
            ['-v', true],
            ['-i', false],
            ['-c', false],
            ['-n', false],
          ]),
          q('awk cocok dipakai untuk memproses data seperti apa?', [
            ['Data terstruktur berbasis kolom', true],
            ['Gambar biner', false],
            ['Video', false],
            ['Koneksi jaringan', false],
          ]),
          q('Untuk mengganti SEMUA kemunculan pola dalam satu baris pakai sed, tambahkan flag?', [
            ['g', true],
            ['a', false],
            ['v', false],
            ['c', false],
          ]),
        ],
      },
    ],
  },
]

async function main() {
  const payload = await getPayload({ config })

  const category = await payload.create({
    collection: 'categories',
    data: { name: 'Sistem & Linux', slug: 'sistem-linux' },
  })

  const course = await payload.create({
    collection: 'courses',
    data: {
      title: 'Linux from Zero',
      slug: 'linux-from-zero',
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
            ? { sandboxLanguage: 'bash', sandboxStarterCode: lessonDef.sandboxStarterCode }
            : {}),
          hasQuiz: Boolean(lessonDef.hasQuiz),
          ...(lessonDef.hasQuiz ? { quizQuestions: lessonDef.quizQuestions } : {}),
        },
      })
      lessonCount += 1
    }
  }

  console.log(
    `Seed "Linux from Zero" selesai: 1 course, ${modules.length} module, ${lessonCount} lesson.`,
  )
}

// `payload run` tidak menunggu promise yang tidak di-await di top level, jadi
// top-level await wajib di sini (lihat catatan sama di seed-dev.ts).
await main()
