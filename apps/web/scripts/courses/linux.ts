import { q, type CourseDef, type ModuleDef } from '../lib/course-def'

const modules: ModuleDef[] = [
  {
    title: 'Pengenalan Linux',
    lessons: [
      {
        title: 'Apa itu Linux?',
        slug: 'lfz-apa-itu-linux',
        content: [
          'Linux adalah kernel sistem operasi open source yang pertama kali dibuat oleh Linus Torvalds pada tahun 1991. Kernel adalah inti sistem operasi yang mengatur komunikasi antara perangkat keras (hardware) dan perangkat lunak (software).',
          "Yang biasa kita sebut 'Linux' sebenarnya adalah distribusi (distro) — gabungan kernel Linux dengan berbagai software pendukung seperti shell, package manager, dan desktop environment. Contoh distro populer: Ubuntu, Debian, Fedora, Arch Linux, dan Rocky Linux. CentOS Linux, yang dulu populer di server, sudah dihentikan (end of life); penggantinya antara lain CentOS Stream dan Rocky Linux.",
          'Karena open source, kode sumber Linux bisa dilihat, dimodifikasi, dan didistribusikan ulang oleh siapa saja di bawah lisensi GPL. Ini berbeda dengan sistem operasi proprietary seperti Windows atau macOS.',
          'Linux banyak dipakai di server, cloud computing, embedded system, dan supercomputer karena stabil, ringan, dan gratis. Bahkan Android juga memakai kernel Linux di dalamnya.',
        ],
        hasQuiz: true,
        quizQuestions: [
          q('Siapa yang pertama kali membuat kernel Linux?', [
            ['Linus Torvalds', true],
            ['Richard Stallman', false],
            ['Dennis Ritchie', false],
            ['Ken Thompson', false],
          ]),
          q('Apa perbedaan kernel dan distro?', [
            ['Kernel adalah inti OS, distro adalah kernel + software pendukung', true],
            ['Kernel dan distro adalah hal yang sama', false],
            ['Distro adalah versi kernel yang lebih baru, kernel adalah versi lamanya', false],
            ['Kernel hanya dipakai di server, sedangkan distro hanya dipakai di desktop', false],
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
          q('Apa status CentOS Linux sekarang?', [
            ['Sudah dihentikan (EOL); penggantinya antara lain CentOS Stream dan Rocky Linux', true],
            ['Masih dirilis rutin sebagai satu-satunya distro keluarga Red Hat', false],
            ['Sudah berganti nama menjadi Debian dan dirilis dengan versi baru', false],
            ['Nama lain untuk kernel Linux versi server', false],
          ]),
        ],
      },
      {
        title: 'Anatomi Filesystem Linux',
        slug: 'lfz-anatomi-filesystem',
        content: [
          "Linux mengikuti standar Filesystem Hierarchy Standard (FHS) yang mengatur di mana tiap jenis file harus disimpan. Semua berawal dari satu direktori akar bernama `/` (root) — berbeda dengan Windows yang punya banyak drive seperti C:\\ dan D:\\.",
          "`/home` berisi folder pribadi tiap user, mirip 'My Documents' di Windows. `/etc` menyimpan file konfigurasi sistem. `/var` menyimpan data yang sering berubah seperti log dan cache.",
          '`/bin` dan `/usr/bin` menyimpan program yang bisa dijalankan (executable). `/root` adalah home direktori khusus untuk user root (administrator).',
          '`/tmp` untuk file sementara. Menurut FHS, program tidak boleh berasumsi bahwa isi `/tmp` masih ada saat program itu dijalankan lagi: sistem boleh membersihkannya (misalnya saat booting), jadi jangan menyimpan data yang harus bertahan di sana. Untuk file sementara yang perlu bertahan melewati reboot tersedia `/var/tmp`.',
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
          q('Kenapa data penting sebaiknya tidak disimpan hanya di /tmp?', [
            ['Isi /tmp tidak dijamin bertahan; sistem boleh membersihkannya, misalnya saat booting', true],
            ['/tmp otomatis dikosongkan setiap kali program yang membuat file di sana selesai berjalan', false],
            ['/tmp hanya bisa ditulis oleh user root, jadi user biasa tidak bisa menyimpan apa pun di sana', false],
            ['File di /tmp tidak bisa dibaca oleh program lain', false],
          ]),
          q('Direktori mana yang disediakan untuk file sementara yang perlu bertahan melewati reboot?', [
            ['/var/tmp', true],
            ['/tmp', false],
            ['/etc', false],
            ['/root', false],
          ]),
        ],
      },
      {
        title: 'Masuk ke Terminal',
        slug: 'lfz-masuk-ke-terminal',
        content: [
          'Terminal adalah jendela berbasis teks untuk berinteraksi dengan sistem Linux lewat perintah (command). Di dalamnya berjalan shell, program yang membaca perintah yang kamu ketik, menjalankannya, lalu menampilkan hasilnya. Shell yang paling umum di Linux adalah Bash, dan itulah yang dipakai di seluruh course ini.',
          '## Anatomi sebuah perintah',
          'Perintah umumnya berbentuk `perintah -opsi argumen`. Opsi (diawali tanda `-`) mengubah cara kerja perintah, sedangkan argumen adalah objek yang dikerjakan. Pada `echo -n "halo"`, `echo` adalah perintahnya, `-n` opsinya (jangan pindah baris setelah mencetak), dan `"halo"` argumennya.',
          '```bash\npwd\nid -u\nid -un\necho -n "halo, "\necho "dunia"\n```',
          '## Perintah pertama',
          '`pwd` (print working directory) menampilkan lokasi direktori saat ini. `id -u` menampilkan nomor (UID) user yang menjalankan perintah, dan `id -un` menampilkan namanya. `echo` menampilkan teks ke layar. Ada juga `whoami`, yang menampilkan nama user efektif (effective user): user yang hak aksesnya dipakai proses saat ini. Biasanya ia sama dengan user yang login, tapi bisa berbeda; setelah memakai `sudo`, misalnya, `whoami` menampilkan `root`.',
          '## Catatan tentang user di sandbox',
          'Di komputer Linux-mu, user punya nama (misalnya `budi`), jadi `id -un` dan `whoami` menampilkannya. User yang menjalankan skrip di sandbox kemungkinan besar hanya punya nomor UID tanpa nama terdaftar. Akibatnya `whoami` gagal dengan pesan error, dan `id -un` tidak punya nama untuk ditampilkan. Karena itu starter memakai `id -u` (selalu berhasil) dan `id -un 2>/dev/null || echo "(user sandbox tanpa nama)"`: `2>/dev/null` membuang pesan error, sedangkan `||` menjalankan perintah sesudahnya hanya kalau perintah sebelumnya gagal. Pada `id` versi GNU, perintah yang gagal itu masih bisa mencetak angka UID lebih dulu, jadi di sandbox kamu mungkin melihat angka diikuti baris cadangan. Itu normal.',
          'Coba jalankan skrip di sandbox berikut. Lokasi yang dicetak `pwd` dan nomor UID bisa berbeda tiap sandbox.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "=== Lokasi direktori saat ini ==="
pwd

echo "=== Nomor user (uid) ==="
id -u

echo "=== Nama user ==="
id -un 2>/dev/null || echo "(user sandbox tanpa nama)"

echo "=== Opsi mengubah perilaku perintah ==="
echo -n "Tanpa baris baru, "
echo "lalu lanjut di baris yang sama"

echo "=== Halo dari terminal ==="
echo "Selamat belajar Linux from Zero!"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Pada perintah echo -n "halo", bagian mana yang disebut opsi?', [
            ['-n', true],
            ['echo', false],
            ['"halo"', false],
            ['Tanda kutip ganda', false],
          ]),
          q('Kenapa starter di sandbox memakai id -u, bukan whoami?', [
            ['User sandbox hanya punya nomor UID tanpa nama, jadi whoami bisa gagal sedangkan id -u selalu berhasil', true],
            ['whoami hanya boleh dijalankan oleh user root, sedangkan id -u boleh dijalankan siapa saja', false],
            ['whoami sudah dihapus dari Linux versi baru dan digantikan id -u', false],
            ['id -u menampilkan nama user, sedangkan whoami hanya menampilkan angka', false],
          ]),
          q('Apa yang ditampilkan perintah pwd?', [
            ['Lokasi direktori tempat shell berada sekarang', true],
            ['Password milik user yang sedang login', false],
            ['Daftar isi direktori saat ini', false],
            ['Nama user yang sedang login', false],
          ]),
        ],
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
          '## Melihat seluruh isi',
          '`cat` menampilkan seluruh isi file sekaligus ke layar, cocok untuk file pendek; opsi `-n` menambahkan nomor baris. `less` menampilkan isi file per halaman dan bisa digulir, cocok untuk file panjang (spasi untuk halaman berikutnya, `/kata` untuk mencari, `q` untuk keluar). Karena interaktif, `less` tidak bisa dicoba di sandbox yang menjalankan skrip sekali jalan.',
          '## Melihat sebagian isi',
          '`head` menampilkan beberapa baris pertama file (default 10 baris), `tail` menampilkan beberapa baris terakhir. Keduanya menerima opsi `-n` untuk menentukan jumlah baris, misal `head -n 5`. Khusus `tail`, `-n +16` berarti "mulai dari baris ke-16 sampai akhir file".',
          '```bash\nseq 1 20 > angka.txt\nhead -n 3 angka.txt\ntail -n 3 angka.txt\ntail -n +16 angka.txt\n```',
          'Pada contoh itu, `seq 1 20` mencetak angka 1 sampai 20 dan `> angka.txt` menyimpannya ke file. Tiga perintah sesudahnya mencetak `1 2 3`, lalu `18 19 20`, lalu `16` sampai `20` (satu angka per baris).',
          '## Memantau dan menghitung',
          '`tail -f` terus menampilkan baris baru yang ditambahkan ke file, sehingga sering dipakai memantau file log secara real-time; hentikan dengan `Ctrl+C`. Karena tidak berhenti dengan sendirinya, `tail -f` tidak cocok untuk sandbox. `wc -l` menghitung jumlah baris sebuah file.',
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

echo "=== Mulai dari baris ke-16 (tail -n +16) ==="
tail -n +16 angka.txt

echo "=== Jumlah baris (wc -l) ==="
wc -l angka.txt

# ">" menulis ke file, ">>" menambahkan di akhir file
echo apel > buah.txt
echo jeruk >> buah.txt
echo "=== Dengan nomor baris (cat -n) ==="
cat -n buah.txt
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa yang dilakukan tail -f log.txt?', [
            ['Terus menampilkan baris baru yang ditambahkan ke file, sampai dihentikan dengan Ctrl+C', true],
            ['Menampilkan f baris terakhir file, lalu berhenti', false],
            ['Menampilkan seluruh isi file dari baris pertama, lalu berhenti', false],
            ['Memaksa (force) file log dikosongkan sebelum dibaca', false],
          ]),
          q('Apa arti tail -n +16 angka.txt?', [
            ['Mulai dari baris ke-16 sampai akhir file', true],
            ['Menampilkan 16 baris terakhir file', false],
            ['Menampilkan semua baris kecuali baris ke-16', false],
            ['Menampilkan hanya baris ke-16', false],
          ]),
          q('Perintah apa yang menghitung jumlah baris sebuah file?', [
            ['wc -l', true],
            ['ls -l', false],
            ['cat -c', false],
            ['head -l', false],
          ]),
        ],
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
          'Format permission ditampilkan seperti `-rwxr-xr--`: karakter pertama adalah tipe file (`-` untuk file biasa, `d` untuk direktori), lalu 3 karakter untuk owner, 3 untuk group, 3 untuk others. `chmod` mengubah permission ini.',
          'Mode simbolik: `chmod u+x file` menambah izin execute untuk owner. Mode oktal: `chmod 755 file` — angka 7=rwx, 5=r-x, 5=r-x untuk owner/group/others berurutan (r=4, w=2, x=1, dijumlahkan).',
          '```bash\ntouch skrip.sh\nchmod 644 skrip.sh   # rw-r--r--\nchmod 755 skrip.sh   # rwxr-xr-x\nchmod u-x skrip.sh   # cabut execute dari owner\nls -ln skrip.sh\n```',
          '## Permission pada direktori',
          'Pada direktori, `r` berarti boleh melihat daftar isinya (`ls`), `w` berarti boleh membuat atau menghapus isinya (bersama `x`), dan `x` berarti boleh masuk ke direktori itu (`cd`) serta mengakses file di dalamnya. Karena itu direktori biasanya diberi permission seperti 755 atau 750, bukan 644. Untuk melihat permission direktorinya sendiri (bukan isinya), pakai `ls -ld nama-direktori`.',
          '## Membaca output ls di sandbox',
          '`ls -l` menampilkan nama owner dan group di kolom ketiga dan keempat. User yang menjalankan skrip di sandbox kemungkinan besar tidak punya nama terdaftar, sehingga kolom itu berisi angka (UID dan GID) yang bisa berbeda tiap sandbox. Starter memakai `ls -ln`, yang selalu menampilkan angka, supaya hasilnya konsisten. Fokuskan matamu pada 10 karakter pertama: tipe file dan permission.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
touch skrip.sh
chmod 644 skrip.sh
echo "Permission awal (ls -ln: owner dan group tampil sebagai angka):"
ls -ln skrip.sh

chmod 755 skrip.sh
echo "Setelah chmod 755:"
ls -ln skrip.sh

chmod u-x skrip.sh
echo "Setelah cabut execute owner:"
ls -ln skrip.sh

mkdir folder
chmod 750 folder
echo "Direktori (huruf d di depan) dengan permission 750:"
ls -lnd folder
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
          q('Apa arti izin x (execute) pada sebuah direktori?', [
            ['Boleh masuk ke direktori itu, misalnya dengan cd', true],
            ['Direktori itu dijalankan sebagai program', false],
            ['Direktori itu disembunyikan dari hasil ls', false],
            ['Direktori itu tidak boleh dihapus', false],
          ]),
        ],
      },
      {
        title: 'Ownership',
        slug: 'lfz-ownership',
        content: [
          'Selain permission, tiap file punya owner (pemilik user) dan group (pemilik grup). Keduanya terlihat di kolom ketiga dan keempat output `ls -l`. `chown` mengubah owner, `chgrp` mengubah group kepemilikan.',
          '## Melihat owner dan group',
          'Di komputer Linux-mu, `ls -l` menampilkan nama, misalnya `budi staff`. User di sandbox kemungkinan besar tidak punya nama terdaftar, jadi yang bisa ditampilkan hanya angkanya. `ls -ln` memaksa tampilan angka (UID dan GID) di mana pun, dan angka itu sama dengan hasil `id -u` dan `id -g`:',
          '```bash\ntouch dokumen.txt\nid -u\nid -g\nls -ln dokumen.txt\n```',
          'Angka pada kolom owner dan group di baris terakhir sama dengan hasil `id -u` dan `id -g`, karena file yang baru dibuat dimiliki oleh user yang membuatnya. Di starter, `$(id -u)` memasukkan hasil perintah `id -u` ke dalam teks `echo`.',
          '## Mengubah ownership',
          'Contoh: `chown budi file.txt` mengubah owner jadi user `budi`. `chown budi:staff file.txt` mengubah owner sekaligus group jadi `staff` dalam satu perintah.',
          'Mengubah owner hanya boleh dilakukan root (biasanya lewat `sudo`), supaya user biasa tidak bisa mengambil alih atau menyerahkan file ke user lain seenaknya. Owner file boleh mengganti group file ke group yang ia sendiri menjadi anggotanya.',
          'Starter mencoba `chown` sebagai user biasa, dan itu akan gagal; hasil itulah yang diharapkan. `2>&1` menyatukan pesan error ke output biasa supaya muncul berurutan dengan output lain, dan `||` menjalankan pesan cadangan hanya kalau perintah sebelumnya gagal.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
touch dokumen.txt
echo "uid saya: $(id -u), gid saya: $(id -g)"
echo "Ownership dokumen.txt (ls -ln: owner dan group sebagai angka):"
ls -ln dokumen.txt

echo "Mencoba ubah owner jadi user nobody (user biasa tidak boleh):"
chown nobody dokumen.txt 2>&1 || echo "Gagal: mengganti owner butuh hak root"
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa arti perintah chown budi:staff file.txt?', [
            ['Owner file menjadi budi dan group-nya menjadi staff, sekaligus', true],
            ['Owner file menjadi staff dan group-nya menjadi budi', false],
            ['Hanya group file yang diganti, dengan nama budi:staff', false],
            ['User budi diberi izin baca dan group staff diberi izin tulis', false],
          ]),
          q('Apa perbedaan output ls -ln dibanding ls -l?', [
            ['Owner dan group ditampilkan sebagai angka UID dan GID, bukan nama', true],
            ['Hanya nama file yang ditampilkan, tanpa permission', false],
            ['File ditampilkan berurutan berdasarkan nomor, bukan nama', false],
            ['Ukuran file ditampilkan dalam satuan yang lebih mudah dibaca', false],
          ]),
          q('Siapa yang boleh mengganti owner sebuah file?', [
            ['Hanya root, biasanya lewat sudo', true],
            ['Owner file itu sendiri, kapan pun ia mau', false],
            ['Siapa saja yang punya izin write pada file itu', false],
            ['Semua anggota group yang memiliki file itu', false],
          ]),
        ],
      },
      {
        title: 'User, Group & sudo',
        slug: 'lfz-user-group-sudo',
        content: [
          'Linux adalah sistem multi-user — tiap user punya home direktori, UID (user ID) unik, dan bisa jadi anggota satu atau lebih group (tiap group punya GID). User root selalu punya UID 0.',
          '## Melihat identitas',
          '`id` menampilkan UID, GID, dan daftar group; `id -u` hanya UID, `id -g` GID utama, dan `id -un` nama user. `whoami` menampilkan nama user efektif (effective user), yaitu user yang hak aksesnya dipakai proses saat ini. Di komputer biasa, `id` menampilkan angka beserta namanya:',
          '```plaintext\nuid=1000(budi) gid=1000(budi) groups=1000(budi),27(sudo)\n```',
          'User di sandbox kemungkinan besar tidak punya nama terdaftar, jadi `id` hanya menampilkan angka dan `whoami` gagal. Karena itu starter memakai `id -u` dan `id -un 2>/dev/null || echo "..."`, seperti di lesson Masuk ke Terminal.',
          '## sudo dan root',
          '`sudo` (superuser do) mengizinkan user biasa yang terdaftar di file `/etc/sudoers` menjalankan satu perintah dengan hak akses root, tanpa perlu login penuh sebagai root — lebih aman karena tercatat di log siapa menjalankan apa. Di Debian/Ubuntu cukup menjadi anggota group `sudo`; di keluarga Red Hat, anggota group `wheel`.',
          'Contoh berikut tidak jalan di sandbox, karena sandbox menjalankan skrip tanpa hak root:',
          '```bash\nwhoami\nsudo whoami\n```',
          '`whoami` menampilkan namamu, sedangkan `sudo whoami` menampilkan `root`, karena `sudo` menjalankan perintahnya sebagai user root.',
          'User root adalah administrator dengan akses penuh ke seluruh sistem. Praktik terbaik: jangan login langsung sebagai root sehari-hari, pakai user biasa + `sudo` hanya saat perlu, supaya kesalahan (typo perintah berbahaya) tidak langsung merusak sistem.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "UID (nomor user):"
id -u

echo "GID (nomor group utama):"
id -g

echo "Nama user (kalau UID-nya punya nama):"
id -un 2>/dev/null || echo "(user sandbox tanpa nama)"

echo "Detail UID/GID/group sekaligus:"
id

echo "Root selalu punya UID 0; UID saya: $(id -u)"
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
            ['Kesalahan perintah (misalnya typo pada rm) bisa langsung merusak sistem tanpa penghalang', true],
            ['Root tidak bisa membuka file milik user biasa, sehingga pekerjaan sehari-hari terhambat', false],
            ['Root otomatis menghapus file sementara milik semua user setiap kali login', false],
            ['Perintah yang dijalankan sebagai root tidak boleh memakai pipe dan redirection', false],
          ]),
          q('Perintah apa untuk melihat UID dan daftar group user aktif?', [
            ['id', true],
            ['whoami', false],
            ['sudo', false],
            ['useradd', false],
          ]),
          q('Apa yang ditampilkan perintah sudo whoami?', [
            ['root', true],
            ['Nama user yang sedang login, sama seperti whoami biasa', false],
            ['sudo, karena itu nama perintah yang dijalankan', false],
            ['Pesan error karena whoami tidak boleh dijalankan lewat sudo', false],
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
          '`top` menampilkan process secara real-time, terurut berdasar pemakaian CPU/memory, berguna untuk memantau performa sistem. Ia terus memperbarui layar sampai kita menekan `q`, jadi tidak cocok untuk sandbox yang menjalankan skrip sekali jalan. `kill` mengirim sinyal ke process lewat PID: `kill 1234`.',
          '`kill` tanpa opsi mengirim SIGTERM (sinyal 15), permintaan sopan agar process berhenti dan membereskan dirinya. `kill -9` mengirim SIGKILL, yang memaksa process berhenti seketika tanpa proses cleanup — dipakai kalau process "hang" dan tidak merespons SIGTERM.',
          '## Latihan aman dengan process latar belakang',
          'Tanda `&` di akhir perintah menjalankannya di latar belakang, dan `$!` berisi PID process latar belakang terakhir. Dengan itu kamu bisa berlatih `kill` tanpa mengganggu process lain:',
          '```bash\nsleep 30 &\nkill $!\n```',
          '`sleep 30` hanya menunggu 30 detik, dan `kill $!` mengirim SIGTERM ke process itu. Di starter, `wait` menunggu process tersebut benar-benar berhenti, lalu `$?` (status akhir perintah terakhir) bernilai 143. Angka itu 128 ditambah nomor sinyalnya (15 untuk SIGTERM): cara shell memberi tahu bahwa process berhenti karena menerima sinyal, bukan selesai dengan sendirinya. PID yang tercetak berbeda tiap kali dijalankan.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "PID skrip ini sendiri: $$"

sleep 30 &
pid=$!
echo "sleep berjalan di latar belakang, PID: $pid"

echo "Daftar process (ps):"
ps

kill $pid
wait $pid
echo "Status akhir sleep: $? (143 = 128 + 15, dihentikan oleh SIGTERM)"

echo "Daftar process sesudah kill:"
ps
`,
        hasQuiz: true,
        quizQuestions: [
          q('Sinyal apa yang dikirim perintah kill 1234 tanpa opsi?', [
            ['SIGTERM (sinyal 15), permintaan agar process berhenti', true],
            ['SIGKILL (sinyal 9), yang memaksa process berhenti seketika', false],
            ['SIGSTOP, yang hanya menjeda process tanpa menghentikannya', false],
            ['Tidak ada sinyal; kill hanya mencatat PID ke dalam log', false],
          ]),
          q('Apa isi $! setelah menjalankan sleep 30 &?', [
            ['PID process sleep yang berjalan di latar belakang', true],
            ['PID skrip atau shell itu sendiri', false],
            ['Status keluar dari perintah terakhir', false],
            ['Jumlah process yang sedang berjalan di sistem', false],
          ]),
          q('Kapan kill -9 pantas dipakai?', [
            ['Kalau process hang dan tidak berhenti dengan kill biasa, dengan risiko tidak sempat cleanup', true],
            ['Sebagai cara standar menghentikan process karena sama amannya dan lebih cepat dari kill biasa', false],
            ['Untuk menjalankan ulang (restart) process yang sudah berhenti sendiri', false],
            ['Untuk melihat PID dari process yang sedang berjalan', false],
          ]),
        ],
      },
      {
        title: 'Package Manager',
        slug: 'lfz-package-manager',
        content: [
          'Package manager adalah tool untuk install, update, dan hapus software secara otomatis, termasuk menangani dependency (software lain yang dibutuhkan). Distro berbasis Debian/Ubuntu memakai `apt`, distro berbasis Red Hat/Fedora (termasuk Rocky Linux dan CentOS Stream) memakai `dnf`. Perintah `yum` yang lebih lama masih dikenali di RHEL 8 ke atas karena menjadi alias ke `dnf`.',
          'Contoh perintah `apt`: `apt update` memperbarui daftar paket yang tersedia dari server repository (belum memasang apa pun), `apt upgrade` memperbarui paket yang sudah terpasang ke versi terbaru dari daftar itu, `apt install nginx` memasang software nginx beserta dependency-nya, dan `apt remove nginx` menghapusnya. Memasang dan menghapus paket butuh hak root, jadi biasanya diawali `sudo`.',
          'Contoh berikut tidak jalan di sandbox, karena butuh hak root dan koneksi internet ke repository:',
          '```bash\nsudo apt update\nsudo apt install nginx\nsudo apt upgrade\n```',
          'Tanpa package manager, kita harus download source code, compile manual, dan cari sendiri semua dependency — package manager menghilangkan kerumitan itu dan menjaga versi software tetap konsisten di seluruh sistem.',
          'Lesson ini tidak punya tombol Run karena memasang paket butuh hak root dan koneksi internet ke repository, sedangkan sandbox menjalankan skrip tanpa keduanya. Perintah di atas bisa kamu coba di Linux milikmu sendiri, misalnya di mesin virtual atau container.',
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
            ['apt upgrade', false],
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
          'Setiap process punya environment: sekumpulan variabel (nama=nilai) yang diwariskan dari process induk (parent) ke process anak (child process) yang ia jalankan. Isinya konfigurasi seperti lokasi home direktori (`$HOME`) atau bahasa sistem (`$LANG`). Lihat semuanya dengan `env` atau `printenv`. Nilainya bisa berbeda tiap sistem; di sandbox, misalnya, `$HOME` bisa saja `/tmp`.',
          '`PATH` adalah environment variable khusus berisi daftar direktori (dipisah `:`) yang dicari shell saat mencari lokasi sebuah perintah. Itu sebabnya mengetik `ls` bisa langsung jalan tanpa menulis path lengkapnya.',
          '## Shell variable dan environment variable',
          'Variabel yang dibuat dengan `nama=nilai` hanyalah shell variable: hanya terlihat di shell itu sendiri. `export nama` menandainya supaya ikut diwariskan ke program dan child process yang dijalankan shell sesudahnya, dan saat itu ia menjadi environment variable. `export` juga bisa sekaligus memberi nilai: `export NAMA=nilai`. Jadi `export` tidak membuat variabel permanen; ia hanya mewariskannya ke child process.',
          '```bash\nVAR_BIASA="hanya di shell ini"\nexport VAR_EKSPOR="diwariskan ke child process"\nbash -c \'echo "biasa=[$VAR_BIASA] ekspor=[$VAR_EKSPOR]"\'\n```',
          'Baris terakhir menjalankan bash baru (child process) lewat `bash -c \'...\'`, yang mengeksekusi teks di dalam kutip lalu selesai. Hasilnya `biasa=[] ekspor=[diwariskan ke child process]`: `VAR_BIASA` tidak diwariskan karena tidak di-export.',
          '## Membuat variabel permanen',
          'Variabel yang di-export di terminal hilang saat sesi ditutup. Supaya otomatis ada tiap kali shell dibuka, taruh baris `export` di file konfigurasi Bash. File yang dibaca tergantung cara shell dibuka: login shell (misalnya login lewat console teks) membaca `~/.bash_profile`, atau `~/.bash_login`, atau `~/.profile` (yang pertama ada), sedangkan shell interaktif non-login (misalnya jendela terminal baru di desktop Linux) membaca `~/.bashrc`.',
          'Karena itu `~/.bash_profile` biasanya berisi baris `if [ -f ~/.bashrc ]; then . ~/.bashrc; fi` (artinya: kalau file `~/.bashrc` ada, muat isinya) supaya kedua jenis shell memakai konfigurasi yang sama. Untuk menerapkan perubahan di terminal yang sedang terbuka tanpa login ulang, jalankan `source ~/.bashrc`.',
        ],
        hasSandbox: true,
        sandboxStarterCode: `#!/bin/bash
echo "Nilai PATH saat ini:"
echo "$PATH"

echo "Home direktori (di sandbox bisa saja /tmp):"
echo "$HOME"

VAR_BIASA="hanya ada di shell ini"
export VAR_EKSPOR="ikut diwariskan ke child process"

echo "=== Di shell ini ==="
echo "biasa  : $VAR_BIASA"
echo "ekspor : $VAR_EKSPOR"

echo "=== Di child process (bash baru) ==="
# $BASH berisi lokasi program bash yang sedang menjalankan skrip ini
"$BASH" -c 'echo "biasa  : [$VAR_BIASA]"; echo "ekspor : [$VAR_EKSPOR]"'
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa fungsi environment variable PATH?', [
            ['Daftar direktori yang dicari shell untuk menemukan perintah', true],
            ['Menyimpan password user', false],
            ['Menyimpan permission file', false],
            ['Menyimpan daftar process aktif', false],
          ]),
          q('Perintah apa yang membuat sebuah variabel shell ikut diwariskan ke child process?', [
            ['export', true],
            ['source', false],
            ['printenv', false],
          ]),
          q('Apa yang terjadi pada variabel yang dibuat dengan VAR=nilai (tanpa export) saat shell menjalankan bash -c ...?', [
            ['Child process tidak melihatnya; hanya variabel yang di-export yang diwariskan', true],
            ['Child process melihatnya, karena semua variabel shell otomatis diwariskan', false],
            ['Child process melihatnya, tapi hanya bisa membaca dan tidak bisa mengubahnya', false],
            ['Variabel itu dihapus dari shell asal begitu child process berjalan', false],
          ]),
          q('Kamu login lewat console teks, sehingga Bash berjalan sebagai login shell. File mana yang dibacanya di home direktorimu?', [
            ['~/.bash_profile (atau ~/.bash_login / ~/.profile, yang pertama ada)', true],
            ['~/.bashrc, karena file ini dibaca setiap kali Bash dijalankan dengan cara apa pun', false],
            ['~/.bash_logout, karena file ini berisi pengaturan awal sesi', false],
            ['~/.bash_history, karena file ini menyimpan variabel dari sesi sebelumnya', false],
          ]),
        ],
      },
      {
        title: 'Penjadwalan Tugas dengan Cron',
        slug: 'lfz-penjadwalan-cron',
        content: [
          'Cron adalah daemon (proses latar belakang) di Linux untuk menjalankan perintah/skrip secara otomatis pada jadwal tertentu, misalnya tiap hari jam 2 pagi atau tiap 5 menit sekali.',
          '## Format jadwal',
          'Jadwal cron ditulis di "crontab" pakai 5 field yang mewakili menit (0–59), jam (0–23), tanggal (1–31), bulan (1–12), dan hari dalam minggu (0–7, di mana 0 dan 7 sama-sama berarti Minggu) — dipisah spasi, diikuti perintah yang mau dijalankan. Tanda `*` berarti "setiap nilai", dan `*/5` berarti "setiap 5 satuan".',
          '```plaintext\n# menit jam tanggal bulan hari  perintah\n0 2 * * *      /home/budi/backup.sh\n*/5 * * * *    /home/budi/cek-status.sh\n30 8 * * 1     /home/budi/laporan-mingguan.sh\n```',
          'Baris pertama berjalan setiap hari jam 02:00, baris kedua tiap 5 menit, dan baris ketiga setiap hari Senin jam 08:30.',
          '## Mengelola crontab',
          'Edit crontab user dengan `crontab -e`, lihat isinya dengan `crontab -l`. Cron banyak dipakai untuk tugas rutin server seperti backup database atau pembersihan file log lama.',
          'Lesson ini tidak punya tombol Run karena cron adalah daemon yang berjalan terus-menerus di latar belakang, sedangkan sandbox menjalankan skrip sekali jalan lalu berhenti, tanpa layanan cron di dalamnya. Perintah `crontab -e` bisa kamu coba di Linux milikmu sendiri.',
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
          q('Apa arti jadwal 30 8 * * 1 pada crontab?', [
            ['Setiap hari Senin pukul 08:30', true],
            ['Setiap tanggal 1 pukul 08:30', false],
            ['Setiap hari pukul 08:30, kecuali hari Senin', false],
            ['Setiap 30 menit sekali mulai pukul 08:00 pada bulan pertama', false],
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
          'Bash mendukung percabangan `if`/`elif`/`else` untuk menjalankan perintah berdasarkan kondisi, ditutup dengan `fi`. Kondisi paling umum ditulis di dalam `[ ... ]`, misal `[ $angka -gt 10 ]` berarti "angka lebih besar dari 10". `[` sebenarnya sebuah perintah (setara `test`), jadi spasi setelah `[` dan sebelum `]` wajib ada.',
          'Perulangan `for` dipakai mengulang perintah pada tiap item dalam daftar/range, ditutup dengan `done`. `while` mengulang selama kondisi masih benar.',
          '## Operator perbandingan',
          'Di dalam `[ ]`, angka dibandingkan dengan operator berhuruf: `-eq` (sama dengan), `-ne` (tidak sama), `-gt` (lebih besar), `-lt` (lebih kecil), `-ge` (lebih besar atau sama), dan `-le` (lebih kecil atau sama). Tanda `=` dan `!=` di dalam `[ ]` membandingkan string (teks), bukan angka.',
          '## Jebakan: > di dalam [ ]',
          'Tanda `>` dan `<` bagi shell adalah redirection, bukan perbandingan. Karena itu `[ 3 > 10 ]` tidak membandingkan angka: shell membaca `> 10` sebagai "tulis output ke file bernama 10", sehingga yang diuji tinggal `[ 3 ]`, dan itu dianggap benar karena `3` bukan string kosong. Hasilnya kondisi selalu benar, dan sebuah file kosong bernama `10` muncul di direktori.',
          '## Perbandingan gaya C dengan (( ))',
          'Kalau ingin menulis perbandingan seperti di bahasa C, pakai `(( ... ))`. Di dalamnya operator aritmetika dipakai apa adanya: `>`, `<`, `>=`, `<=`, `==`, dan `!=`, dan nama variabel tidak perlu diberi `$`.',
          '```bash\nangka=7\nif (( angka > 5 )); then\n  echo "lebih besar dari 5"\nfi\n```',
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

echo "=== (( )) : perbandingan gaya C ==="
angka=7
if (( angka > 5 )); then
  echo "$angka lebih besar dari 5"
fi

echo "=== Jebakan: > di dalam [ ] ==="
if [ 3 > 10 ]; then
  echo "Dianggap benar, padahal 3 tidak lebih besar dari 10!"
fi
echo "File yang tercipta tanpa sengaja:"
ls 10
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
          q('Apa yang terjadi saat Bash menjalankan [ 3 > 10 ]?', [
            ['Tanda > dibaca sebagai redirection: output ditulis ke file bernama 10, dan yang diuji tinggal [ 3 ] yang dianggap benar', true],
            ['Bash membandingkan 3 dan 10 sebagai angka, hasilnya salah karena 3 lebih kecil dari 10', false],
            ['Bash membandingkan "3" dan "10" sebagai teks, hasilnya salah karena urutan abjadnya', false],
            ['Bash menampilkan error sintaks dan seluruh skrip langsung berhenti', false],
          ]),
          q('Mana cara yang benar untuk membandingkan angka dengan operator > di Bash?', [
            ['(( angka > 5 ))', true],
            ['[ $angka > 5 ]', false],
            ['[ angka > 5 ]', false],
            ['if $angka > 5', false],
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
          '## Input dari file dengan <',
          'Banyak perintah membaca data dari stdin (standard input). Tanda `<` mengalirkan isi sebuah file ke stdin perintah, misal `wc -l < angka.txt` menghitung baris tanpa menyebut nama file sebagai argumen. Bedanya: pada `wc -l angka.txt` perintah membuka file sendiri sehingga nama file ikut tercetak, sedangkan dengan `<` perintah hanya melihat aliran data, jadi yang tercetak cuma angkanya. Contoh lain: `sort -rn < angka.txt` mengurutkan isi file dari angka terbesar (`-n` mengurutkan sebagai angka, `-r` membalik urutan).',
          '## stdout dan stderr',
          'Setiap perintah punya dua jalur keluaran: stdout (output normal) dan stderr (pesan error). Keduanya tampil di layar sehingga terlihat sama, padahal terpisah. `>` dan `|` hanya membawa stdout. Untuk mengalihkan stderr, pakai `2>` (angka 2 adalah nomor jalur stderr): `ls tidak-ada.txt 2> error.txt` menyimpan pesan error ke file, bukan menampilkannya di layar. Di panel output sandbox, stderr tampil berwarna merah, terpisah dari stdout.',
          '```bash\nseq 1 5 > angka.txt\nwc -l < angka.txt\nls tidak-ada.txt 2> error.txt\ncat error.txt\n```',
          'Contoh itu mencetak `5` dari `wc -l`, lalu isi `error.txt`: pesan error dari `ls` yang bunyinya bisa sedikit berbeda antar-sistem.',
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

echo "Jumlah baris (wc -l membaca file lewat <):"
wc -l < angka.txt

echo "3 angka terbesar (sort membaca file lewat <, lalu pipe ke head):"
sort -rn < angka.txt | head -n 3

echo "Mengalihkan stderr ke file (2>):"
ls tidak-ada.txt 2> error.txt
echo "Isi error.txt (bunyi pesan bisa berbeda antar-sistem):"
cat error.txt
`,
        hasQuiz: true,
        quizQuestions: [
          q('Apa beda > dan >> pada redirection?', [
            ['> menimpa isi file lama, sedangkan >> menambahkan output ke akhir file', true],
            ['> menambahkan output ke akhir file, sedangkan >> menimpa isi file lama', false],
            ['> hanya membawa output normal, sedangkan >> hanya membawa pesan error', false],
            ['Tidak ada beda; keduanya sama-sama menimpa isi file lama', false],
          ]),
          q('Apa fungsi tanda < pada wc -l < angka.txt?', [
            ['Mengalirkan isi angka.txt ke stdin wc', true],
            ['Menyimpan hasil wc ke dalam file angka.txt', false],
            ['Membandingkan apakah hasil wc lebih kecil dari isi angka.txt', false],
            ['Menjalankan wc hanya kalau file angka.txt ada', false],
          ]),
          q('Apa yang dilakukan perintah 2> error.txt?', [
            ['Menyimpan pesan error (stderr) ke error.txt, sedangkan output normal tetap ke layar', true],
            ['Menyimpan output normal ke error.txt, tapi hanya kalau perintahnya gagal', false],
            ['Menyimpan output normal dan pesan error sekaligus ke error.txt', false],
            ['Menjalankan perintah dua kali dan menyimpan hasil keduanya ke error.txt', false],
          ]),
        ],
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

const course: CourseDef = {
  title: 'Linux from Zero',
  slug: 'linux-from-zero',
  category: { name: 'Sistem & Linux', slug: 'sistem-linux' },
  level: 'pemula',
  description: [
    'Linux from Zero adalah course pengantar untuk kamu yang belum pernah memakai Linux lewat command line: calon developer, mahasiswa, atau siapa saja yang ingin nyaman bekerja di terminal dan server Linux. Tidak perlu pengalaman programming atau sistem operasi tertentu sebelumnya.',
    'Di sini kamu belajar apa itu Linux dan distro, struktur direktori (FHS), cara memakai terminal, navigasi dan manajemen file, melihat dan mencari isi file, permission, ownership, user, group, dan `sudo`, process, package manager, environment variable dan `PATH`, penjadwalan dengan cron, lalu shell scripting dengan Bash: variabel, `if` dan perulangan, pipe, redirection, stdout dan stderr, serta `grep`, `sed`, dan `awk`. Hampir semua lesson punya contoh yang bisa langsung dijalankan di code sandbox. Pengecualiannya empat lesson yang membahas konsep murni atau butuh hak root dan jaringan (pengenalan Linux, struktur direktori, package manager, dan cron), yang dipelajari lewat penjelasan dan quiz. Hampir semua lesson juga dilengkapi quiz pilihan ganda.',
    'Sandbox di course ini menjalankan skrip dengan Bash 5.0 sekali jalan: tanpa input keyboard, tanpa akses jaringan, dan tanpa hak root, jadi `sudo`, `apt`, dan `ssh` tidak bisa dicoba di sana. User di sandbox kemungkinan besar hanya punya nomor UID tanpa nama, sehingga `whoami` bisa gagal dan `ls -l` menampilkan angka; lesson terkait menjelaskan cara menyiasatinya (`id -u` dan `ls -ln`). Prasyaratnya cuma browser dan kemauan mencoba: tidak perlu menginstal apa pun. Untuk mencoba perintah yang butuh hak root, siapkan Linux milikmu sendiri, misalnya di mesin virtual.',
  ].join('\n\n'),
  sandboxLanguage: 'bash',
  modules,
}

export default course
