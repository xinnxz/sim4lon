import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { p as pertaminaLogo } from "./logo-pertamina.CdNcSRGD.js";
const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Cannot get canvas context"));
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
};
const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 1500);
};
const exportToPDF = async (data, columns, summary, options, footerRows) => {
  const doc = new jsPDF();
  try {
    const logoData = pertaminaLogo;
    const logoUrl = typeof logoData === "string" ? logoData : logoData.src;
    const logoBase64 = await loadImageAsBase64(logoUrl);
    const logoWidth = 40;
    const logoHeight = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage(logoBase64, "PNG", pageWidth - 75, 8, 55, 13);
  } catch (error) {
    console.warn("[PDF Export] Could not load Pertamina logo:", error);
  }
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(options.title, 14, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Periode: ${options.period}`, 14, 28);
  doc.text(`Dicetak: ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, 14, 34);
  let yPos = 45;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan", 14, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  summary.forEach((item, index) => {
    const xOffset = index % 2 === 0 ? 14 : 110;
    if (index % 2 === 0 && index > 0) yPos += 7;
    doc.text(`${item.label}: ${item.value}`, xOffset, yPos);
  });
  yPos += 15;
  const tableData = data.map(
    (row) => columns.map((col) => {
      const value = row[col.key];
      if (value === null || value === void 0) return "-";
      if (typeof value === "number") {
        return value.toLocaleString("id-ID");
      }
      return String(value);
    })
  );
  const footerData = footerRows?.map(
    (row) => columns.map((col) => {
      const value = row[col.key];
      if (value === null || value === void 0) return "";
      if (typeof value === "number") {
        return value.toLocaleString("id-ID");
      }
      return String(value);
    })
  ) || [];
  const allBodyData = [...tableData, ...footerData];
  const footerStartIndex = tableData.length;
  autoTable(doc, {
    startY: yPos,
    head: [columns.map((col) => col.header)],
    body: allBodyData,
    // Footer sekarang bagian dari body, muncul hanya di akhir
    theme: "grid",
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: 255,
      fontStyle: "bold"
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
        acc[index] = { halign: col.align };
      }
      return acc;
    }, {}),
    // Style khusus untuk baris footer (TOTAL)
    didParseCell: (data2) => {
      if (data2.section === "body" && data2.row.index >= footerStartIndex) {
        data2.cell.styles.fontStyle = "bold";
        data2.cell.styles.fillColor = [255, 255, 255];
      }
    }
  });
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `SIM4LON - Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
  const pdfFilename = options.filename.endsWith(".pdf") ? options.filename : `${options.filename}.pdf`;
  const pdfBlob = doc.output("blob");
  downloadFile(pdfBlob, pdfFilename);
};
const exportToExcel = (data, columns, summary, options, footerRows) => {
  const wb = XLSX.utils.book_new();
  const summaryData = [
    [options.title],
    [`Periode: ${options.period}`],
    [`Dicetak: ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}`],
    [],
    ["RINGKASAN"],
    ...summary.map((item) => [item.label, String(item.value)])
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Ringkasan");
  const headers = columns.map((col) => col.header);
  const rows = data.map(
    (row) => columns.map((col) => row[col.key] ?? "-")
  );
  const footerRowsData = footerRows?.map(
    (row) => columns.map((col) => row[col.key] ?? "")
  ) || [];
  const allData = [
    headers,
    ...rows
  ];
  if (footerRowsData.length > 0) {
    allData.push(columns.map(() => ""));
    allData.push(...footerRowsData);
  }
  const dataSheet = XLSX.utils.aoa_to_sheet(allData);
  dataSheet["!cols"] = columns.map((col) => ({ wch: col.width || 15 }));
  const totalRows = allData.length;
  const totalCols = columns.length;
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const cellAddr = XLSX.utils.encode_cell({ r, c });
      if (!dataSheet[cellAddr]) continue;
      if (!dataSheet[cellAddr].s) dataSheet[cellAddr].s = {};
      dataSheet[cellAddr].s.border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      };
      const colAlign = columns[c]?.align || "center";
      dataSheet[cellAddr].s.alignment = {
        horizontal: colAlign,
        vertical: "center"
      };
    }
  }
  XLSX.utils.book_append_sheet(wb, dataSheet, "Data");
  const xlsxFilename = options.filename.endsWith(".xlsx") ? options.filename : `${options.filename}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  downloadFile(blob, xlsxFilename);
};
const formatCurrencyExport = (value) => {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
};
const formatDateExport = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
const createFooterRow = (label, totals, firstColumnKey = "date") => {
  return {
    [firstColumnKey]: label,
    ...totals
  };
};
export {
  exportToExcel as a,
  formatDateExport as b,
  createFooterRow as c,
  exportToPDF as e,
  formatCurrencyExport as f
};
