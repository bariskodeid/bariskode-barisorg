export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-background grid-bg dark:grid-bg" />
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-transparent to-background"
      />
    </div>
  )
}
