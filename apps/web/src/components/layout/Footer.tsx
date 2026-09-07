import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-background py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-mono font-bold uppercase mb-4">bariskode.org</h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Platform pembelajaran open source untuk programming, database, data science, dan
              cybersecurity — dari nol sampai production.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-mono font-bold uppercase mb-4">Jelajahi</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
              <Link href="/courses" className="hover:text-white transition-colors">
                Kursus
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © {currentYear} bariskode.org — Kode berlisensi MIT, konten CC BY-SA 4.0.
          </p>
          <p className="text-xs text-muted-foreground font-mono">Open source dari hari pertama.</p>
        </div>
      </div>
    </footer>
  )
}
