
export default function AdminFooter() {
  const currentYear = new Date().getFullYear()

return (
    <footer className="border-t bg-background mt-auto">
      <div id="ia9gy6" className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>© {currentYear} SIM4LON - Sistem Informasi Distribusi LPG</p>
          <p>Versi 1.0.0</p>
        </div>
      </div>
    </footer>
  )
}
