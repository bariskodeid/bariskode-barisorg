import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// Desain sengaja TERANG (bukan tema gelap situs) — lebih ramah cetak/print
// dan lebih mudah dibaca sebagai file PDF berdiri sendiri. Dibuat pakai
// @react-pdf/renderer (pure-JS, tanpa headless browser) supaya ringan di VM
// production 4GB RAM — lihat infra/docker-compose.yml `mem_limit` per service.
const styles = StyleSheet.create({
  page: {
    padding: 56,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#111111',
  },
  border: {
    flexGrow: 1,
    borderWidth: 2,
    borderColor: '#22c55e',
    padding: 40,
    justifyContent: 'space-between',
  },
  wordmark: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#111111',
  },
  center: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
  },
  label: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#6b7280',
  },
  studentName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 32,
    color: '#111111',
  },
  desc: {
    fontSize: 12,
    color: '#374151',
  },
  courseTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: '#111111',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
  },
})

export interface CertificateDocumentProps {
  studentName: string
  courseTitle: string
  issuedAt: string
}

export function CertificateDocument({ studentName, courseTitle, issuedAt }: CertificateDocumentProps) {
  const issuedDate = new Date(issuedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.wordmark}>bariskode.org</Text>

          <View style={styles.center}>
            <Text style={styles.label}>Sertifikat Penyelesaian Kursus</Text>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.desc}>telah menyelesaikan kursus</Text>
            <Text style={styles.courseTitle}>{courseTitle}</Text>
            <Text style={styles.desc}>di bariskode.org pada {issuedDate}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>bariskode.org — Kode berlisensi MIT, konten CC BY-SA 4.0.</Text>
            <Text style={styles.footerText}>Diterbitkan otomatis, dokumen ini tidak memerlukan tanda tangan basah.</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
