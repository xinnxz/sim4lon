
interface InvoiceFooterProps {
  notes: string
  terms: string
}

export default function InvoiceFooter({ notes, terms }: InvoiceFooterProps) {
  return (
    <div className="space-y-6 pt-4">
      {/* Notes */}
      {notes && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Catatan</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
        </div>
      )}

      {/* Terms */}
      {terms && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Syarat & Ketentuan</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{terms}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-6 mt-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-8">Dibuat oleh,</p>
            <p className="text-sm font-semibold text-foreground">Admin SIM4LON</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-8">Disetujui oleh,</p>
            <p className="text-sm font-semibold text-foreground">Manager</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-8">Diterima oleh,</p>
            <p className="text-sm font-semibold text-foreground">Pelanggan</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pt-4 border-t text-xs text-muted-foreground">
        <p>© 2024 SIM4LON - Sistem Informasi Distribusi LPG. Semua hak dilindungi.</p>
      </div>
    </div>
  )
}
