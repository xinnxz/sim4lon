/**
 * Export Utilities
 * 
 * PENJELASAN:
 * Utility functions untuk export laporan ke PDF dan Excel
 * Menggunakan custom download function untuk reliable filename
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

interface ExportOptions {
    title: string
    period: string
    filename: string
}

interface TableColumn {
    header: string
    key: string
    width?: number
}

interface SummaryItem {
    label: string
    value: string | number
}

/**
 * Custom download function - lebih reliable untuk semua browser
 */
const downloadFile = (blob: Blob, filename: string) => {
    console.log('[Download] Creating download for:', filename)
    console.log('[Download] Blob size:', blob.size, 'bytes')

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
    console.log('[Download] Click triggered for:', filename)

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        console.log('[Download] Cleanup done')
    }, 100)
}

/**
 * Export data ke PDF
 */
export const exportToPDF = (
    data: Record<string, any>[],
    columns: TableColumn[],
    summary: SummaryItem[],
    options: ExportOptions
) => {
    const doc = new jsPDF()

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

    // Table
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

    autoTable(doc, {
        startY: yPos,
        head: [columns.map(col => col.header)],
        body: tableData,
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
    })

    // Footer
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
 */
export const exportToExcel = (
    data: Record<string, any>[],
    columns: TableColumn[],
    summary: SummaryItem[],
    options: ExportOptions
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
    const dataSheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

    // Set column widths
    dataSheet['!cols'] = columns.map(col => ({ wch: col.width || 15 }))

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
 */
export const formatCurrencyExport = (value: number): string => {
    return `Rp ${value.toLocaleString('id-ID')}`
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
