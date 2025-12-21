/**
 * Export Utilities
 * 
 * PENJELASAN:
 * Utility functions untuk export laporan ke PDF dan Excel
 * Menggunakan custom download function untuk reliable filename
 * Mendukung footer row untuk menampilkan total di bawah tabel
 * Termasuk logo Pertamina di sudut kanan atas PDF
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Import logo Pertamina (akan di-bundle sebagai base64 atau URL)
import pertaminaLogo from '@/assets/logo-pertamina.png'

interface ExportOptions {
    title: string
    period: string
    filename: string
}

export interface TableColumn {
    header: string
    key: string
    width?: number
    align?: 'left' | 'center' | 'right'
}

interface SummaryItem {
    label: string
    value: string | number
}

/**
 * Footer row untuk menampilkan total di bawah tabel
 * Key harus sesuai dengan column key, value adalah nilai yang ditampilkan
 */
interface FooterRow {
    [key: string]: string | number
}

/**
 * Load image sebagai base64 untuk digunakan di PDF
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
 * Custom download function - lebih reliable untuk semua browser
 * PENTING: Delay cleanup harus cukup lama agar browser sempat memproses download
 */
const downloadFile = (blob: Blob, filename: string) => {
    // Create object URL
    const url = window.URL.createObjectURL(blob)
    // Create anchor element
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename

    // Append to body (required for Firefox)
    document.body.appendChild(a)

    // Trigger click
    a.click()

    // Cleanup - PENTING: delay 1500ms agar browser punya waktu memproses download
    setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }, 1500)
}

/**
 * Export data ke PDF
 * @param data - Array of data rows
 * @param columns - Column definitions
 * @param summary - Summary items shown at top
 * @param options - Export options (title, period, filename)
 * @param footerRows - Optional footer rows for totals (displayed at bottom of table)
 */
export const exportToPDF = async (
    data: Record<string, any>[],
    columns: TableColumn[],
    summary: SummaryItem[],
    options: ExportOptions,
    footerRows?: FooterRow[]
) => {
    const doc = new jsPDF()

    // Try to add Pertamina logo at top-right corner
    try {
        // Astro imports gambar sebagai ImageMetadata, ambil URL dari .src
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const logoData = pertaminaLogo as any
        const logoUrl: string = typeof logoData === 'string' ? logoData : logoData.src
        const logoBase64 = await loadImageAsBase64(logoUrl)
        // Logo Pertamina berbentuk horizontal, jadi lebar > tinggi
        // Ukuran: 40mm lebar x 15mm tinggi, posisi di kanan atas
        const logoWidth = 40
        const logoHeight = 15
        const pageWidth = doc.internal.pageSize.getWidth()
        doc.addImage(logoBase64, 'PNG', pageWidth - 75, 8, 55, 13)
    } catch (error) {
        console.warn('[PDF Export] Could not load Pertamina logo:', error)
        // Continue without logo
    }

    // Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(options.title, 14, 20)

    // Period
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Periode: ${options.period}`, 14, 28)
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, 14, 34)

    // Summary section
    let yPos = 45
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Ringkasan', 14, yPos)

    yPos += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    summary.forEach((item, index) => {
        const xOffset = index % 2 === 0 ? 14 : 110
        if (index % 2 === 0 && index > 0) yPos += 7
        doc.text(`${item.label}: ${item.value}`, xOffset, yPos)
    })

    yPos += 15

    // Table data
    const tableData = data.map(row =>
        columns.map(col => {
            const value = row[col.key]
            if (value === null || value === undefined) return '-'
            if (typeof value === 'number') {
                return value.toLocaleString('id-ID')
            }
            return String(value)
        })
    )

    // Footer rows - ditambahkan ke body agar hanya muncul di akhir (bukan setiap halaman)
    const footerData = footerRows?.map(row =>
        columns.map(col => {
            const value = row[col.key]
            if (value === null || value === undefined) return ''
            if (typeof value === 'number') {
                return value.toLocaleString('id-ID')
            }
            return String(value)
        })
    ) || []

    // Gabungkan data dengan footer rows
    const allBodyData = [...tableData, ...footerData]

    // Hitung index awal footer untuk styling khusus
    const footerStartIndex = tableData.length

    autoTable(doc, {
        startY: yPos,
        head: [columns.map(col => col.header)],
        body: allBodyData, // Footer sekarang bagian dari body, muncul hanya di akhir
        theme: 'grid',
        headStyles: {
            fillColor: [34, 139, 34],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: columns.reduce((acc, col, index) => {
            if (col.align) {
                acc[index] = { halign: col.align }
            }
            return acc
        }, {} as Record<number, { halign: 'left' | 'center' | 'right' }>),
        // Style khusus untuk baris footer (TOTAL)
        didParseCell: (data) => {
            // Cek apakah ini baris footer
            if (data.section === 'body' && data.row.index >= footerStartIndex) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [255, 255, 255] // Light gray, mirip tabel
            }
        },
    })

    // Page footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
            `SIM4LON - Halaman ${i} dari ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        )
    }

    // Download PDF
    const pdfFilename = options.filename.endsWith('.pdf')
        ? options.filename
        : `${options.filename}.pdf`

    const pdfBlob = doc.output('blob')
    downloadFile(pdfBlob, pdfFilename)
}

/**
 * Export data ke Excel
 * @param data - Array of data rows
 * @param columns - Column definitions
 * @param summary - Summary items shown in separate sheet
 * @param options - Export options (title, period, filename)
 * @param footerRows - Optional footer rows for totals (displayed at bottom of data)
 */
export const exportToExcel = (
    data: Record<string, any>[],
    columns: TableColumn[],
    summary: SummaryItem[],
    options: ExportOptions,
    footerRows?: FooterRow[]
) => {
    // Create workbook
    const wb = XLSX.utils.book_new()

    // Summary sheet
    const summaryData = [
        [options.title],
        [`Periode: ${options.period}`],
        [`Dicetak: ${new Date().toLocaleDateString('id-ID')}`],
        [],
        ['RINGKASAN'],
        ...summary.map(item => [item.label, String(item.value)])
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Ringkasan')

    // Data sheet
    const headers = columns.map(col => col.header)
    const rows = data.map(row =>
        columns.map(col => row[col.key] ?? '-')
    )

    // Footer rows for totals
    const footerRowsData = footerRows?.map(row =>
        columns.map(col => row[col.key] ?? '')
    ) || []

    // Combine: headers + data + empty row + footer
    const allData = [
        headers,
        ...rows
    ]

    // Add footer rows with separator
    if (footerRowsData.length > 0) {
        allData.push(columns.map(() => ''))  // Empty separator row
        allData.push(...footerRowsData)
    }

    const dataSheet = XLSX.utils.aoa_to_sheet(allData)

    // Set column widths
    dataSheet['!cols'] = columns.map(col => ({ wch: col.width || 15 }))

    // Apply cell styles: borders and alignment
    const totalRows = allData.length
    const totalCols = columns.length

    // Style all table cells (starting from row 0 since header is included)
    for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
            const cellAddr = XLSX.utils.encode_cell({ r, c })
            if (!dataSheet[cellAddr]) continue

            // Initialize style object if not exists
            if (!dataSheet[cellAddr].s) dataSheet[cellAddr].s = {}

            // Add border to all cells
            dataSheet[cellAddr].s.border = {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } }
            }

            // Alignment based on column definition
            const colAlign = columns[c]?.align || 'center'
            dataSheet[cellAddr].s.alignment = {
                horizontal: colAlign,
                vertical: 'center'
            }
        }
    }

    XLSX.utils.book_append_sheet(wb, dataSheet, 'Data')

    // Download Excel
    const xlsxFilename = options.filename.endsWith('.xlsx')
        ? options.filename
        : `${options.filename}.xlsx`

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    downloadFile(blob, xlsxFilename)
}

/**
 * Format currency for export
 * Dibulatkan ke bilangan bulat (tanpa desimal/comma)
 */
export const formatCurrencyExport = (value: number): string => {
    return `Rp ${Math.round(value).toLocaleString('id-ID')}`
}

/**
 * Format date for export
 */
export const formatDateExport = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

/**
 * Helper untuk membuat footer row untuk tabel export
 * @param label - Label untuk kolom pertama (misal: "TOTAL")
 * @param totals - Object dengan key column dan value total
 * @param firstColumnKey - Key dari kolom pertama untuk label
 */
export const createFooterRow = (
    label: string,
    totals: Record<string, string | number>,
    firstColumnKey: string = 'date'
): FooterRow => {
    return {
        [firstColumnKey]: label,
        ...totals
    }
}

