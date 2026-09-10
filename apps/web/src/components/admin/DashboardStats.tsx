import type { WidgetServerProps } from 'payload'

export default async function DashboardStatsWidget({ req }: WidgetServerProps) {
  const { payload } = req

  const [totalUsers, publishedCourses, lessonsCompleted, publishedPosts, students, instructors, admins] =
    await Promise.all([
      payload.count({ collection: 'users' }),
      payload.count({ collection: 'courses', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'progress' }),
      payload.count({ collection: 'posts', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'users', where: { role: { equals: 'student' } } }),
      payload.count({ collection: 'users', where: { role: { equals: 'instructor' } } }),
      payload.count({ collection: 'users', where: { role: { equals: 'admin' } } }),
    ])

  return (
    <div style={{ padding: '0 1.5rem 1.5rem' }}>
      <h2
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: '1rem',
          color: '#fff',
        }}
      >
        Dashboard Overview
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard
          label="Total Users"
          value={totalUsers.totalDocs}
          sub={`${students.totalDocs} students, ${instructors.totalDocs} instructors, ${admins.totalDocs} admins`}
        />
        <StatCard label="Published Courses" value={publishedCourses.totalDocs} />
        <StatCard label="Lessons Completed" value={lessonsCompleted.totalDocs} />
        <StatCard label="Published Posts" value={publishedPosts.totalDocs} />
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0.5rem',
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#fff',
          margin: '0.25rem 0 0',
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            margin: '0.25rem 0 0',
          }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
