/**
 * Pertamina Export Utilities
 * 
 * PENJELASAN:
 * Export PDF dan Excel dengan format resmi Pertamina untuk Perencanaan dan Penyaluran.
 * Format sesuai template: Logo, header Pertamina, info agen, tabel grid harian, signature.
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import pertaminaLogo from '@/assets/logo-pertamina.png'

// Konstanta PT. Pertamina (hardcoded sesuai permintaan)
const PERTAMINA_INFO = {
    name: 'PT. Pertamina (Persero)',
    address: 'JL.Medan Merdeka Timur No. 1A Jakarta 10110',
    phone: 'Telp: 021 3815111 FAX: 021 3633585'
}

// Interface untuk profil agen
export interface AgenProfile {
    nama_agen: string
    alamat_agen: string
    email: string
    no_siid: string
    wilayah: string
}

// Interface untuk data rekapitulasi
export interface RekapRow {
    id_registrasi: string
    nama_pangkalan: string
    alokasi: number
    daily: Record<number, number> // { 1: 100, 2: 150, ... }
    total_normal: number
    total_fakultatif: number
    sisa_alokasi: number
    grand_total: number
}

export interface ExportPerencanaanOptions {
    bulan: string // Format: "2025-12" 
    data: RekapRow[]
    daysInMonth: number
    agenProfile: AgenProfile
    tipe: 'perencanaan' | 'penyaluran'
    lpgType?: string // Jenis LPG: kg3, kg5, kg12, kg50, gr220
    category?: 'SUBSIDI' | 'NON_SUBSIDI' // Kategori: Subsidi atau Non-Subsidi
}

/**
 * Load image sebagai base64
 */
const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(img, 0, 0)
                resolve(canvas.toDataURL('image/png'))
            } else {
                reject(new Error('Cannot get canvas context'))
            }
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = url
    })
}

/**
 * Download file helper
 */
const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }, 1500)
}

/**
 * Format bulan ke label Indonesia
 */
const formatMonthLabel = (bulan: string): string => {
    const [year, month] = bulan.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()
}

/**
 * Export Perencanaan/Penyaluran ke PDF format Pertamina
 */
export const exportPertaminaPDF = async (options: ExportPerencanaanOptions) => {
    const { bulan, data, daysInMonth, agenProfile, tipe } = options

    // Create PDF - Landscape A4
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth() // 297mm
    const pageHeight = doc.internal.pageSize.getHeight() // 210mm
    const margin = 10

    // ========== HEADER SECTION ==========

    // Logo Pertamina (kanan atas)
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const logoData = pertaminaLogo as any
        const logoUrl: string = typeof logoData === 'string' ? logoData : logoData.src
        const logoBase64 = await loadImageAsBase64(logoUrl)
        doc.addImage(logoBase64, 'PNG', pageWidth - 75, 8, 55, 13)
    } catch (error) {
        console.warn('[PDF Export] Could not load Pertamina logo:', error)
    }

    // PT. Pertamina info (kiri atas)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(PERTAMINA_INFO.name, margin, 15)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(PERTAMINA_INFO.address, margin, 20)
    doc.text(PERTAMINA_INFO.phone, margin, 25) // Warna hitam (tidak merah)

    // ========== JUDUL LAPORAN ==========

    const monthLabel = formatMonthLabel(bulan)

    // Format LPG type display name
    const getLpgDisplayName = (lpgType?: string): string => {
        if (!lpgType) return ''
        const lpgNames: Record<string, string> = {
            'kg3': 'LPG 3 Kg',
            'kg5': 'LPG 5.5 Kg',
            'kg12': 'LPG 12 Kg',
            'kg50': 'LPG 50 Kg',
            'gr220': 'Bright Gas 220 gr'
        }
        return lpgNames[lpgType] || lpgType.toUpperCase()
    }

    // Build title with LPG type info
    const lpgInfo = options.lpgType ? ` - ${getLpgDisplayName(options.lpgType)}` : ''
    const categoryInfo = options.category ? (options.category === 'SUBSIDI' ? ' (SUBSIDI)' : ' (NON-SUBSIDI)') : ''

    const titleText = tipe === 'perencanaan'
        ? `LAPORAN PERENCANAAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}`
        : `LAPORAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}`

    doc.setFontSize(9) // Sedikit lebih kecil untuk muat info tambahan
    doc.setFont('helvetica', 'bold')
    doc.text(titleText, pageWidth / 2, 38, { align: 'center' })

    // ========== INFO AGEN ==========

    let yPos = 48
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')

    const agenFields = [
        { label: 'Nama Agen', value: agenProfile.nama_agen },
        { label: 'Alamat Agen', value: agenProfile.alamat_agen },
        { label: 'Email', value: agenProfile.email },
        { label: 'No. Siid To', value: agenProfile.no_siid },
        { label: 'Wilayah', value: agenProfile.wilayah },
    ]

    agenFields.forEach(field => {
        doc.text(`${field.label}`, margin, yPos)
        doc.text(`:`, margin + 25, yPos)
        doc.text(field.value, margin + 28, yPos) // Nilai tidak bold
        yPos += 4
    })

    // ========== TABEL DATA ==========

    yPos = 72

    // Helper untuk mendapatkan nama hari singkat dalam bahasa Indonesia
    const getDayName = (date: Date): string => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        return days[date.getDay()]
    }

    // Helper untuk mengecek apakah hari Minggu
    const isSunday = (date: Date): boolean => {
        return date.getDay() === 0
    }

    // Parse bulan untuk mendapatkan tanggal
    const [year, month] = bulan.split('-').map(Number)

    // Prepare table headers - tanggal dan nama hari dalam 1 cell
    // Non-Subsidi: tidak ada kolom Alokasi dan hanya ada Total di akhir
    const isSubsidi = options.category !== 'NON_SUBSIDI'

    const headers: string[] = isSubsidi
        ? ['Id', 'Nama pangkalan', 'Alokasi']
        : ['Id', 'Nama pangkalan'] // Non-Subsidi tanpa Alokasi

    // Array untuk menyimpan kolom mana yang Minggu
    const sundayColumns: number[] = []

    // Base column index untuk tanggal (2 untuk Non-Subsidi, 3 untuk Subsidi)
    const dateColStart = isSubsidi ? 3 : 2

    // Add day columns (01-31) dengan nama hari di bawahnya (dalam 1 cell)
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d)
        const dayName = getDayName(date)
        // Format: "01\nSen" - tanggal di atas, hari di bawah
        headers.push(`${String(d).padStart(2, '0')}\n${dayName}`)

        // Track Sunday columns
        if (isSunday(date)) {
            sundayColumns.push(dateColStart + d - 1)
        }
    }

    // Add summary columns
    if (isSubsidi) {
        // Subsidi: Total Normal, Total Fakultatif, Sisa Alokasi, Grand Total
        headers.push('Total\nNormal', 'Total\nFakultatif', 'Sisa\nAlokasi', 'Grand\nTotal')
    } else {
        // Non-Subsidi: hanya Total
        headers.push('Total')
    }

    // Prepare table data
    const tableData: (string | number)[][] = data.map(row => {
        const rowData: (string | number)[] = isSubsidi
            ? [row.id_registrasi, row.nama_pangkalan, row.alokasi]
            : [row.id_registrasi, row.nama_pangkalan] // Non-Subsidi tanpa Alokasi

        // Add daily values
        for (let d = 1; d <= daysInMonth; d++) {
            const val = row.daily[d] || 0
            rowData.push(val) // Selalu tampilkan angka (termasuk 0)
        }

        // Add summary values
        if (isSubsidi) {
            rowData.push(
                row.total_normal,
                row.total_fakultatif,
                row.sisa_alokasi,
                row.grand_total
            )
        } else {
            // Non-Subsidi: hanya Total (grand_total)
            rowData.push(row.grand_total)
        }

        return rowData
    })

    // Calculate totals for footer
    const totals: (string | number)[] = isSubsidi
        ? ['', 'TOTAL', data.reduce((sum, r) => sum + r.alokasi, 0)]
        : ['', 'TOTAL'] // Non-Subsidi tanpa Alokasi

    for (let d = 1; d <= daysInMonth; d++) {
        const dayTotal = data.reduce((sum, r) => sum + (r.daily[d] || 0), 0)
        totals.push(dayTotal) // Selalu tampilkan angka (termasuk 0)
    }

    if (isSubsidi) {
        totals.push(
            data.reduce((sum, r) => sum + r.total_normal, 0),
            data.reduce((sum, r) => sum + r.total_fakultatif, 0),
            data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
            data.reduce((sum, r) => sum + r.grand_total, 0)
        )
    } else {
        // Non-Subsidi: hanya Total
        totals.push(data.reduce((sum, r) => sum + r.grand_total, 0))
    }

    // Add totals as last row
    tableData.push(totals)

    // Define column widths - BALANCED SIZES
    const colWidths: Record<number, Partial<{ cellWidth: number; halign: 'left' | 'center' | 'right' }>> = isSubsidi
        ? {
            0: { cellWidth: 13 },  // Id
            1: { cellWidth: 28, halign: 'left' },  // Nama Pangkalan
            2: { cellWidth: 10 },  // Alokasi
        }
        : {
            0: { cellWidth: 15 },  // Id (sedikit lebih lebar)
            1: { cellWidth: 35, halign: 'left' },  // Nama Pangkalan (lebih lebar karena tanpa Alokasi)
        }

    // Day columns
    for (let i = dateColStart; i < dateColStart + daysInMonth; i++) {
        colWidths[i] = { cellWidth: isSubsidi ? 5.5 : 6 } // Non-Subsidi sedikit lebih lebar
    }

    // Summary columns
    const summaryStart = dateColStart + daysInMonth
    if (isSubsidi) {
        colWidths[summaryStart] = { cellWidth: 12 }     // Total Normal
        colWidths[summaryStart + 1] = { cellWidth: 12 } // Total Fakultatif
        colWidths[summaryStart + 2] = { cellWidth: 12 } // Sisa Alokasi
        colWidths[summaryStart + 3] = { cellWidth: 12 } // Grand Total
    } else {
        colWidths[summaryStart] = { cellWidth: 15 }     // Total (sedikit lebih lebar)
    }

    // Generate table with improved styling
    autoTable(doc, {
        startY: yPos,
        head: [headers] as any,
        body: tableData,
        theme: 'grid',
        styles: {
            fontSize: 6,  // Larger font
            cellPadding: 1,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: 'center',
            valign: 'middle',
            textColor: [0, 0, 0]  // Always black text
        },
        headStyles: {
            fillColor: [128, 0, 0], // Maroon
            textColor: 255,
            fontSize: 6,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: colWidths as any,
        alternateRowStyles: {
            fillColor: [255, 255, 255]
        },
        didParseCell: (data) => {
            // Style for total row (last row)
            if (data.section === 'body' && data.row.index === tableData.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [240, 240, 240]
            }

            // Sunday columns - light red background (only in body, not header)
            if (data.section === 'body' && sundayColumns.includes(data.column.index)) {
                // Light red/pink for Sunday
                data.cell.styles.fillColor = [255, 230, 230]
            }

            // Sunday columns in header - also light red
            if (data.section === 'head' && sundayColumns.includes(data.column.index)) {
                data.cell.styles.fillColor = [180, 0, 0] // Darker red for header
            }

            // Make day name font smaller in header (only for date columns 3 to 3+daysInMonth-1)
            if (data.section === 'head' && data.column.index >= 3 && data.column.index < 3 + daysInMonth) {
                data.cell.styles.fontSize = 5 // Smaller font for date+day headers
            }
        },
        margin: { left: margin, right: margin }
    })

    // Get final Y position after table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any  
    const finalY = (doc as any).lastAutoTable?.finalY || yPos + 50

    // ========== DISCLAIMER ==========

    let disclaimerY = finalY + 8
    if (disclaimerY > pageHeight - 50) {
        doc.addPage()
        disclaimerY = 20
    }

    doc.setFontSize(6)
    doc.setFont('helvetica', 'italic')
    doc.text(
        'Data tersebut diinput ke sistem sales LPG oleh agen LPG sebenar - benarnya dalam keadaan sehat lahir batin, apabila dikemudian hari data yang disampaikan terbukti tidak benar, maka agen LPG bersedia dikenakan sanksi sesuai peraturan dan hukum yang berlaku.Laporan ini dibuat oleh sistem',
        margin,
        disclaimerY,
        { maxWidth: pageWidth - margin * 2 }
    )

    // ========== SIGNATURE SECTION ==========

    const signatureY = disclaimerY + 12

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')

    // Left signature - Mengetahui
    doc.text('Mengetahui', margin, signatureY)
    doc.text('PT.Pertamina(Persero)', margin, signatureY + 4)

    // Right signature - Penerima (Agen di sini)
    doc.text('Penerima', pageWidth / 2 + 20, signatureY)
    doc.text('Agen', pageWidth / 2 + 20, signatureY + 4)

    // Signature lines
    const lineY = signatureY + 25
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')

    // Left side - PT Pertamina
    doc.text('Nama :', margin, lineY)
    doc.line(margin + 15, lineY, margin + 60, lineY)
    doc.text('Jabatan :', margin, lineY + 8)
    doc.line(margin + 15, lineY + 8, margin + 60, lineY + 8)

    // Right side - Agen
    doc.text('Nama :', pageWidth / 2 + 20, lineY)
    doc.line(pageWidth / 2 + 35, lineY, pageWidth / 2 + 85, lineY)
    doc.text('Jabatan :', pageWidth / 2 + 20, lineY + 8)
    doc.line(pageWidth / 2 + 35, lineY + 8, pageWidth / 2 + 85, lineY + 8)

    // ========== PAGE NUMBER ==========

    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth - margin - 20,
            pageHeight - 8
        )
    }

    // ========== DOWNLOAD ==========

    const filename = tipe === 'perencanaan'
        ? `Laporan_Perencanaan_${bulan}.pdf`
        : `Laporan_Penyaluran_${bulan}.pdf`

    const pdfBlob = doc.output('blob')
    downloadFile(pdfBlob, filename)
}

/**
 * Helper untuk mendapatkan profil agen dari API
 * Dengan fallback ke localStorage dan default values
 */
export const getAgenProfileFromAPI = async (): Promise<AgenProfile> => {
    try {
        // Import dynamically to avoid circular imports
        const { companyProfileApi } = await import('@/lib/api')
        const profile = await companyProfileApi.get()

        return {
            nama_agen: profile.company_name || 'PT. MITRA SURYA NATASYA',
            alamat_agen: profile.address || 'CHOBA RT.002 RW.006 DESA MAYAK',
            email: profile.email || 'mitrasuryaanatasya@gmail.com',
            no_siid: profile.sppbe_number || '997904',
            wilayah: profile.region || 'JAWA BARAT, KABUPATEN CIANJUR'
        }
    } catch (error) {
        console.warn('[PDF Export] Could not load profile from API, using fallback:', error)
        // Fallback to localStorage
        return getDefaultAgenProfile()
    }
}

/**
 * Helper synchronous - untuk backward compatibility
 * Ambil dari localStorage jika ada, atau default
 */
export const getDefaultAgenProfile = (): AgenProfile => {
    // Coba ambil dari localStorage dulu
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('agen_profile')
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch {
                // Ignore
            }
        }
    }

    // Default fallback
    return {
        nama_agen: 'PT. MITRA SURYA NATASYA',
        alamat_agen: 'CHOBA RT.002 RW.006 DESA MAYAK',
        email: 'mitrasuryaanatasya@gmail.com',
        no_siid: '997904',
        wilayah: 'JAWA BARAT, KABUPATEN CIANJUR'
    }
}

/**
 * Simpan profil agen ke localStorage (for caching)
 */
export const saveAgenProfile = (profile: AgenProfile) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('agen_profile', JSON.stringify(profile))
    }
}

/**
 * Format bulan ke label Indonesia (untuk Excel)
 */
const formatMonthLabelExcel = (bulan: string): string => {
    const [year, month] = bulan.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()
}

/**
 * Export Perencanaan/Penyaluran ke Excel format Pertamina
 */
export const exportPertaminaExcel = async (options: ExportPerencanaanOptions) => {
    const { bulan, data, daysInMonth, agenProfile, tipe } = options

    // Parse bulan
    const [year, month] = bulan.split('-').map(Number)

    // Helper untuk nama hari
    const getDayName = (date: Date): string => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        return days[date.getDay()]
    }

    // Format LPG type display name
    const getLpgDisplayName = (lpgType?: string): string => {
        if (!lpgType) return ''
        const lpgNames: Record<string, string> = {
            'kg3': 'LPG 3 Kg',
            'kg5': 'LPG 5.5 Kg',
            'kg12': 'LPG 12 Kg',
            'kg50': 'LPG 50 Kg',
            'gr220': 'Bright Gas 220 gr'
        }
        return lpgNames[lpgType] || lpgType.toUpperCase()
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()

    // Prepare data rows
    const wsData: (string | number)[][] = []

    // Header info
    const monthLabel = formatMonthLabelExcel(bulan)

    // Build title with LPG type info
    const lpgInfo = options.lpgType ? ` - ${getLpgDisplayName(options.lpgType)}` : ''
    const categoryInfo = options.category ? (options.category === 'SUBSIDI' ? ' (SUBSIDI)' : ' (NON-SUBSIDI)') : ''

    const titleText = tipe === 'perencanaan'
        ? `LAPORAN PERENCANAAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}`
        : `LAPORAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}`

    wsData.push([PERTAMINA_INFO.name])
    wsData.push([PERTAMINA_INFO.address])
    wsData.push([PERTAMINA_INFO.phone])
    wsData.push([])
    wsData.push([titleText])
    wsData.push([])

    // Tambahkan info LPG type jika ada
    if (options.lpgType || options.category) {
        wsData.push(['Jenis LPG', ':', getLpgDisplayName(options.lpgType) || '-'])
        wsData.push(['Kategori', ':', options.category === 'SUBSIDI' ? 'Subsidi' : options.category === 'NON_SUBSIDI' ? 'Non-Subsidi' : '-'])
    }

    wsData.push(['Nama Agen', ':', agenProfile.nama_agen])
    wsData.push(['Alamat Agen', ':', agenProfile.alamat_agen])
    wsData.push(['Email', ':', agenProfile.email])
    wsData.push(['No. Siid To', ':', agenProfile.no_siid])
    wsData.push(['Wilayah', ':', agenProfile.wilayah])
    wsData.push([])

    // Table headers - conditional for Subsidi vs Non-Subsidi
    const isSubsidi = options.category !== 'NON_SUBSIDI'

    const headers: string[] = isSubsidi
        ? ['Id', 'Nama Pangkalan', 'Alokasi']
        : ['Id', 'Nama Pangkalan'] // Non-Subsidi tanpa Alokasi

    const dayHeaders: string[] = isSubsidi ? ['', '', ''] : ['', '']

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d)
        headers.push(String(d).padStart(2, '0'))
        dayHeaders.push(getDayName(date))
    }

    if (isSubsidi) {
        headers.push('Total Normal', 'Total Fakultatif', 'Sisa Alokasi', 'Grand Total')
        dayHeaders.push('', '', '', '')
    } else {
        headers.push('Total')
        dayHeaders.push('')
    }

    wsData.push(headers)
    wsData.push(dayHeaders)

    // Data rows
    data.forEach(row => {
        const rowData: (string | number)[] = isSubsidi
            ? [row.id_registrasi, row.nama_pangkalan, row.alokasi]
            : [row.id_registrasi, row.nama_pangkalan] // Non-Subsidi tanpa Alokasi

        for (let d = 1; d <= daysInMonth; d++) {
            rowData.push(row.daily[d] || 0)
        }

        if (isSubsidi) {
            rowData.push(
                row.total_normal,
                row.total_fakultatif,
                row.sisa_alokasi,
                row.grand_total
            )
        } else {
            rowData.push(row.grand_total)
        }

        wsData.push(rowData)
    })

    // Total row
    const totals: (string | number)[] = isSubsidi
        ? ['', 'TOTAL', data.reduce((sum, r) => sum + r.alokasi, 0)]
        : ['', 'TOTAL']

    for (let d = 1; d <= daysInMonth; d++) {
        totals.push(data.reduce((sum, r) => sum + (r.daily[d] || 0), 0))
    }

    if (isSubsidi) {
        totals.push(
            data.reduce((sum, r) => sum + r.total_normal, 0),
            data.reduce((sum, r) => sum + r.total_fakultatif, 0),
            data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
            data.reduce((sum, r) => sum + r.grand_total, 0)
        )
    } else {
        totals.push(data.reduce((sum, r) => sum + r.grand_total, 0))
    }
    wsData.push(totals)

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths - conditional for Subsidi vs Non-Subsidi
    const colWidths: { wch: number }[] = isSubsidi
        ? [
            { wch: 12 },  // Id
            { wch: 25 },  // Nama Pangkalan
            { wch: 8 },   // Alokasi
        ]
        : [
            { wch: 15 },  // Id (lebih lebar)
            { wch: 30 },  // Nama Pangkalan (lebih lebar)
        ]

    for (let d = 1; d <= daysInMonth; d++) {
        colWidths.push({ wch: isSubsidi ? 5 : 6 })
    }

    if (isSubsidi) {
        colWidths.push(
            { wch: 10 }, // Total Normal
            { wch: 12 }, // Total Fakultatif
            { wch: 10 }, // Sisa Alokasi
            { wch: 10 }  // Grand Total
        )
    } else {
        colWidths.push({ wch: 12 }) // Total
    }
    ws['!cols'] = colWidths

    // Apply cell styles: borders and alignment
    // Table header starts at row 13 (0-indexed: 12), column B (index 1) is nama pangkalan
    const tableStartRow = 12 // Row 13 in 1-indexed (header row)
    const totalRows = wsData.length
    const totalCols = headers.length

    // Style all table cells
    for (let r = tableStartRow; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
            const cellAddr = XLSX.utils.encode_cell({ r, c })
            if (!ws[cellAddr]) continue

            // Initialize style object if not exists
            if (!ws[cellAddr].s) ws[cellAddr].s = {}

            // Add border to all table cells
            ws[cellAddr].s.border = {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } }
            }

            // Center alignment for all columns except nama pangkalan (column 1)
            if (c === 1) {
                // Nama pangkalan - left align
                ws[cellAddr].s.alignment = { horizontal: 'left', vertical: 'center' }
            } else {
                // Other columns - center align
                ws[cellAddr].s.alignment = { horizontal: 'center', vertical: 'center' }
            }
        }
    }

    // Add worksheet to workbook
    const sheetName = tipe === 'perencanaan' ? 'Perencanaan' : 'Penyaluran'
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Generate filename
    const filename = tipe === 'perencanaan'
        ? `Laporan_Perencanaan_${bulan}.xlsx`
        : `Laporan_Penyaluran_${bulan}.xlsx`

    // Download file
    XLSX.writeFile(wb, filename)
}
