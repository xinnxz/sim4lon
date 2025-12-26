import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { p as pertaminaLogo } from "./logo-pertamina.CdNcSRGD.js";
const PERTAMINA_INFO = {
  name: "PT. Pertamina (Persero)",
  address: "JL.Medan Merdeka Timur No. 1A Jakarta 10110",
  phone: "Telp: 021 3815111 FAX: 021 3633585"
};
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
const formatMonthLabel = (bulan) => {
  const [year, month] = bulan.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase();
};
const exportPertaminaPDF = async (options) => {
  const { bulan, data, daysInMonth, agenProfile, tipe } = options;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  try {
    const logoData = pertaminaLogo;
    const logoUrl = typeof logoData === "string" ? logoData : logoData.src;
    const logoBase64 = await loadImageAsBase64(logoUrl);
    doc.addImage(logoBase64, "PNG", pageWidth - 75, 8, 55, 13);
  } catch (error) {
    console.warn("[PDF Export] Could not load Pertamina logo:", error);
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(PERTAMINA_INFO.name, margin, 15);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(PERTAMINA_INFO.address, margin, 20);
  doc.text(PERTAMINA_INFO.phone, margin, 25);
  const monthLabel = formatMonthLabel(bulan);
  const getLpgDisplayName = (lpgType) => {
    if (!lpgType) return "";
    const lpgNames = {
      "kg3": "LPG 3 Kg",
      "kg5": "LPG 5.5 Kg",
      "kg12": "LPG 12 Kg",
      "kg50": "LPG 50 Kg",
      "gr220": "Bright Gas 220 gr"
    };
    return lpgNames[lpgType] || lpgType.toUpperCase();
  };
  const lpgInfo = options.lpgType ? ` - ${getLpgDisplayName(options.lpgType)}` : "";
  const categoryInfo = options.category ? options.category === "SUBSIDI" ? " (SUBSIDI)" : " (NON-SUBSIDI)" : "";
  const titleText = tipe === "perencanaan" ? `LAPORAN PERENCANAAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}` : `LAPORAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}`;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(titleText, pageWidth / 2, 38, { align: "center" });
  let yPos = 48;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const agenFields = [
    { label: "Nama Agen", value: agenProfile.nama_agen },
    { label: "Alamat Agen", value: agenProfile.alamat_agen },
    { label: "Email", value: agenProfile.email },
    { label: "No. Siid To", value: agenProfile.no_siid },
    { label: "Wilayah", value: agenProfile.wilayah }
  ];
  agenFields.forEach((field) => {
    doc.text(`${field.label}`, margin, yPos);
    doc.text(`:`, margin + 25, yPos);
    doc.text(field.value, margin + 28, yPos);
    yPos += 4;
  });
  yPos = 72;
  const getDayName = (date) => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return days[date.getDay()];
  };
  const isSunday = (date) => {
    return date.getDay() === 0;
  };
  const [year, month] = bulan.split("-").map(Number);
  const isSubsidi = options.category !== "NON_SUBSIDI";
  const headers = isSubsidi ? ["Id", "Nama pangkalan", "Alokasi"] : ["Id", "Nama pangkalan"];
  const sundayColumns = [];
  const dateColStart = isSubsidi ? 3 : 2;
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dayName = getDayName(date);
    headers.push(`${String(d).padStart(2, "0")}
${dayName}`);
    if (isSunday(date)) {
      sundayColumns.push(dateColStart + d - 1);
    }
  }
  if (isSubsidi) {
    headers.push("Total\nNormal", "Total\nFakultatif", "Sisa\nAlokasi", "Grand\nTotal");
  } else {
    headers.push("Total");
  }
  const tableData = data.map((row) => {
    const rowData = isSubsidi ? [row.id_registrasi, row.nama_pangkalan, row.alokasi] : [row.id_registrasi, row.nama_pangkalan];
    for (let d = 1; d <= daysInMonth; d++) {
      const val = row.daily[d] || 0;
      rowData.push(val);
    }
    if (isSubsidi) {
      rowData.push(
        row.total_normal,
        row.total_fakultatif,
        row.sisa_alokasi,
        row.grand_total
      );
    } else {
      rowData.push(row.grand_total);
    }
    return rowData;
  });
  const totals = isSubsidi ? ["", "TOTAL", data.reduce((sum, r) => sum + r.alokasi, 0)] : ["", "TOTAL"];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayTotal = data.reduce((sum, r) => sum + (r.daily[d] || 0), 0);
    totals.push(dayTotal);
  }
  if (isSubsidi) {
    totals.push(
      data.reduce((sum, r) => sum + r.total_normal, 0),
      data.reduce((sum, r) => sum + r.total_fakultatif, 0),
      data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
      data.reduce((sum, r) => sum + r.grand_total, 0)
    );
  } else {
    totals.push(data.reduce((sum, r) => sum + r.grand_total, 0));
  }
  tableData.push(totals);
  const colWidths = isSubsidi ? {
    0: { cellWidth: 13 },
    // Id
    1: { cellWidth: 28, halign: "left" },
    // Nama Pangkalan
    2: { cellWidth: 10 }
    // Alokasi
  } : {
    0: { cellWidth: 15 },
    // Id (sedikit lebih lebar)
    1: { cellWidth: 35, halign: "left" }
    // Nama Pangkalan (lebih lebar karena tanpa Alokasi)
  };
  for (let i = dateColStart; i < dateColStart + daysInMonth; i++) {
    colWidths[i] = { cellWidth: isSubsidi ? 5.5 : 6 };
  }
  const summaryStart = dateColStart + daysInMonth;
  if (isSubsidi) {
    colWidths[summaryStart] = { cellWidth: 12 };
    colWidths[summaryStart + 1] = { cellWidth: 12 };
    colWidths[summaryStart + 2] = { cellWidth: 12 };
    colWidths[summaryStart + 3] = { cellWidth: 12 };
  } else {
    colWidths[summaryStart] = { cellWidth: 15 };
  }
  autoTable(doc, {
    startY: yPos,
    head: [headers],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 6,
      // Larger font
      cellPadding: 1,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: "center",
      valign: "middle",
      textColor: [0, 0, 0]
      // Always black text
    },
    headStyles: {
      fillColor: [128, 0, 0],
      // Maroon
      textColor: 255,
      fontSize: 6,
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles: colWidths,
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    didParseCell: (data2) => {
      if (data2.section === "body" && data2.row.index === tableData.length - 1) {
        data2.cell.styles.fontStyle = "bold";
        data2.cell.styles.fillColor = [240, 240, 240];
      }
      if (data2.section === "body" && sundayColumns.includes(data2.column.index)) {
        data2.cell.styles.fillColor = [255, 230, 230];
      }
      if (data2.section === "head" && sundayColumns.includes(data2.column.index)) {
        data2.cell.styles.fillColor = [180, 0, 0];
      }
      if (data2.section === "head" && data2.column.index >= 3 && data2.column.index < 3 + daysInMonth) {
        data2.cell.styles.fontSize = 5;
      }
    },
    margin: { left: margin, right: margin }
  });
  const finalY = doc.lastAutoTable?.finalY || yPos + 50;
  let disclaimerY = finalY + 8;
  if (disclaimerY > pageHeight - 50) {
    doc.addPage();
    disclaimerY = 20;
  }
  doc.setFontSize(6);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Data tersebut diinput ke sistem sales LPG oleh agen LPG sebenar - benarnya dalam keadaan sehat lahir batin, apabila dikemudian hari data yang disampaikan terbukti tidak benar, maka agen LPG bersedia dikenakan sanksi sesuai peraturan dan hukum yang berlaku.Laporan ini dibuat oleh sistem",
    margin,
    disclaimerY,
    { maxWidth: pageWidth - margin * 2 }
  );
  const signatureY = disclaimerY + 12;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Mengetahui", margin, signatureY);
  doc.text("PT.Pertamina(Persero)", margin, signatureY + 4);
  doc.text("Penerima", pageWidth / 2 + 20, signatureY);
  doc.text("Agen", pageWidth / 2 + 20, signatureY + 4);
  const lineY = signatureY + 25;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Nama :", margin, lineY);
  doc.line(margin + 15, lineY, margin + 60, lineY);
  doc.text("Jabatan :", margin, lineY + 8);
  doc.line(margin + 15, lineY + 8, margin + 60, lineY + 8);
  doc.text("Nama :", pageWidth / 2 + 20, lineY);
  doc.line(pageWidth / 2 + 35, lineY, pageWidth / 2 + 85, lineY);
  doc.text("Jabatan :", pageWidth / 2 + 20, lineY + 8);
  doc.line(pageWidth / 2 + 35, lineY + 8, pageWidth / 2 + 85, lineY + 8);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }
  const filename = tipe === "perencanaan" ? `Laporan_Perencanaan_${bulan}.pdf` : `Laporan_Penyaluran_${bulan}.pdf`;
  const pdfBlob = doc.output("blob");
  downloadFile(pdfBlob, filename);
};
const getAgenProfileFromAPI = async () => {
  try {
    const { companyProfileApi } = await import("./AuthGuard.BQhR3uPA.js").then((n) => n.D);
    const profile = await companyProfileApi.get();
    return {
      nama_agen: profile.company_name || "PT. MITRA SURYA NATASYA",
      alamat_agen: profile.address || "CHOBA RT.002 RW.006 DESA MAYAK",
      email: profile.email || "mitrasuryaanatasya@gmail.com",
      no_siid: profile.sppbe_number || "997904",
      wilayah: profile.region || "JAWA BARAT, KABUPATEN CIANJUR"
    };
  } catch (error) {
    console.warn("[PDF Export] Could not load profile from API, using fallback:", error);
    return getDefaultAgenProfile();
  }
};
const getDefaultAgenProfile = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("agen_profile");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
      }
    }
  }
  return {
    nama_agen: "PT. MITRA SURYA NATASYA",
    alamat_agen: "CHOBA RT.002 RW.006 DESA MAYAK",
    email: "mitrasuryaanatasya@gmail.com",
    no_siid: "997904",
    wilayah: "JAWA BARAT, KABUPATEN CIANJUR"
  };
};
const formatMonthLabelExcel = (bulan) => {
  const [year, month] = bulan.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase();
};
const exportPertaminaExcel = async (options) => {
  const { bulan, data, daysInMonth, agenProfile, tipe } = options;
  const [year, month] = bulan.split("-").map(Number);
  const getDayName = (date) => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return days[date.getDay()];
  };
  const getLpgDisplayName = (lpgType) => {
    if (!lpgType) return "";
    const lpgNames = {
      "kg3": "LPG 3 Kg",
      "kg5": "LPG 5.5 Kg",
      "kg12": "LPG 12 Kg",
      "kg50": "LPG 50 Kg",
      "gr220": "Bright Gas 220 gr"
    };
    return lpgNames[lpgType] || lpgType.toUpperCase();
  };
  const wb = XLSX.utils.book_new();
  const wsData = [];
  const monthLabel = formatMonthLabelExcel(bulan);
  const lpgInfo = options.lpgType ? ` - ${getLpgDisplayName(options.lpgType)}` : "";
  const categoryInfo = options.category ? options.category === "SUBSIDI" ? " (SUBSIDI)" : " (NON-SUBSIDI)" : "";
  const titleText = tipe === "perencanaan" ? `LAPORAN PERENCANAAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}` : `LAPORAN PENYALURAN AGEN LPG KE SUB PENYALUR PERIODE ${monthLabel}${lpgInfo}${categoryInfo}`;
  wsData.push([PERTAMINA_INFO.name]);
  wsData.push([PERTAMINA_INFO.address]);
  wsData.push([PERTAMINA_INFO.phone]);
  wsData.push([]);
  wsData.push([titleText]);
  wsData.push([]);
  if (options.lpgType || options.category) {
    wsData.push(["Jenis LPG", ":", getLpgDisplayName(options.lpgType) || "-"]);
    wsData.push(["Kategori", ":", options.category === "SUBSIDI" ? "Subsidi" : options.category === "NON_SUBSIDI" ? "Non-Subsidi" : "-"]);
  }
  wsData.push(["Nama Agen", ":", agenProfile.nama_agen]);
  wsData.push(["Alamat Agen", ":", agenProfile.alamat_agen]);
  wsData.push(["Email", ":", agenProfile.email]);
  wsData.push(["No. Siid To", ":", agenProfile.no_siid]);
  wsData.push(["Wilayah", ":", agenProfile.wilayah]);
  wsData.push([]);
  const isSubsidi = options.category !== "NON_SUBSIDI";
  const headers = isSubsidi ? ["Id", "Nama Pangkalan", "Alokasi"] : ["Id", "Nama Pangkalan"];
  const dayHeaders = isSubsidi ? ["", "", ""] : ["", ""];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    headers.push(String(d).padStart(2, "0"));
    dayHeaders.push(getDayName(date));
  }
  if (isSubsidi) {
    headers.push("Total Normal", "Total Fakultatif", "Sisa Alokasi", "Grand Total");
    dayHeaders.push("", "", "", "");
  } else {
    headers.push("Total");
    dayHeaders.push("");
  }
  wsData.push(headers);
  wsData.push(dayHeaders);
  data.forEach((row) => {
    const rowData = isSubsidi ? [row.id_registrasi, row.nama_pangkalan, row.alokasi] : [row.id_registrasi, row.nama_pangkalan];
    for (let d = 1; d <= daysInMonth; d++) {
      rowData.push(row.daily[d] || 0);
    }
    if (isSubsidi) {
      rowData.push(
        row.total_normal,
        row.total_fakultatif,
        row.sisa_alokasi,
        row.grand_total
      );
    } else {
      rowData.push(row.grand_total);
    }
    wsData.push(rowData);
  });
  const totals = isSubsidi ? ["", "TOTAL", data.reduce((sum, r) => sum + r.alokasi, 0)] : ["", "TOTAL"];
  for (let d = 1; d <= daysInMonth; d++) {
    totals.push(data.reduce((sum, r) => sum + (r.daily[d] || 0), 0));
  }
  if (isSubsidi) {
    totals.push(
      data.reduce((sum, r) => sum + r.total_normal, 0),
      data.reduce((sum, r) => sum + r.total_fakultatif, 0),
      data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
      data.reduce((sum, r) => sum + r.grand_total, 0)
    );
  } else {
    totals.push(data.reduce((sum, r) => sum + r.grand_total, 0));
  }
  wsData.push(totals);
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const colWidths = isSubsidi ? [
    { wch: 12 },
    // Id
    { wch: 25 },
    // Nama Pangkalan
    { wch: 8 }
    // Alokasi
  ] : [
    { wch: 15 },
    // Id (lebih lebar)
    { wch: 30 }
    // Nama Pangkalan (lebih lebar)
  ];
  for (let d = 1; d <= daysInMonth; d++) {
    colWidths.push({ wch: isSubsidi ? 5 : 6 });
  }
  if (isSubsidi) {
    colWidths.push(
      { wch: 10 },
      // Total Normal
      { wch: 12 },
      // Total Fakultatif
      { wch: 10 },
      // Sisa Alokasi
      { wch: 10 }
      // Grand Total
    );
  } else {
    colWidths.push({ wch: 12 });
  }
  ws["!cols"] = colWidths;
  const tableStartRow = 12;
  const totalRows = wsData.length;
  const totalCols = headers.length;
  for (let r = tableStartRow; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const cellAddr = XLSX.utils.encode_cell({ r, c });
      if (!ws[cellAddr]) continue;
      if (!ws[cellAddr].s) ws[cellAddr].s = {};
      ws[cellAddr].s.border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      };
      if (c === 1) {
        ws[cellAddr].s.alignment = { horizontal: "left", vertical: "center" };
      } else {
        ws[cellAddr].s.alignment = { horizontal: "center", vertical: "center" };
      }
    }
  }
  const sheetName = tipe === "perencanaan" ? "Perencanaan" : "Penyaluran";
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const filename = tipe === "perencanaan" ? `Laporan_Perencanaan_${bulan}.xlsx` : `Laporan_Penyaluran_${bulan}.xlsx`;
  XLSX.writeFile(wb, filename);
};
export {
  exportPertaminaExcel as a,
  exportPertaminaPDF as e,
  getAgenProfileFromAPI as g
};
