import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.DfKLN4S1.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D1CatXxQ.js";
import { A as AdminFooter } from "../../_astro/AdminFooter.DVGEP8G7.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from "react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "../../_astro/card.OLhQVURm.js";
import { S as SafeIcon, B as Button, m as consumerOrdersApi, s as lpgPricesApi, q as expensesApi, e as authApi } from "../../_astro/AuthGuard.Cq_0lvUi.js";
import { e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, B as Badge, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, AreaChart, Area } from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-slate-900/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-slate-700", children: [
      /* @__PURE__ */ jsx("p", { className: "text-white font-semibold text-sm mb-2", children: label }),
      payload.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: item.color } }),
        /* @__PURE__ */ jsxs("span", { className: "text-slate-300", children: [
          item.name,
          ":"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-white font-medium", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.value) })
      ] }, index))
    ] });
  }
  return null;
};
function LaporanPangkalanPage() {
  const [profile, setProfile] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("hariini");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [allSales, setAllSales] = useState([]);
  const [prices, setPrices] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const now = /* @__PURE__ */ new Date();
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
        const [chartDataResult, allSalesResult, pricesData, expensesData] = await Promise.all([
          consumerOrdersApi.getChartData(),
          consumerOrdersApi.getRecent(200),
          // Get more sales for filtering
          lpgPricesApi.getAll(),
          // Fetch dynamic prices
          expensesApi.getAll(monthStart, monthEnd)
          // Fetch expenses for current month
        ]);
        setChartData(chartDataResult || []);
        setAllSales(allSalesResult || []);
        setPrices(pricesData || []);
        setAllExpenses(expensesData || []);
        const profileData = await authApi.getProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("❌ [Laporan] Error:", err);
        setError(`Gagal memuat data: ${err?.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (allSales.length === 0) return;
    const now = /* @__PURE__ */ new Date();
    let startDate;
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    switch (selectedPeriod) {
      case "hariini":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        break;
      case "7hari":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
        break;
      case "mingguini": {
        const dayOfWeek = now.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToSubtract, 0, 0, 0);
        break;
      }
      case "bulanini":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = /* @__PURE__ */ new Date(customEndDate + "T23:59:59");
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    }
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const filtered = allSales.filter((sale) => {
      const saleTime = new Date(sale.sale_date).getTime();
      return saleTime >= startTime && saleTime <= endTime;
    });
    const filteredExp = allExpenses.filter((exp) => {
      const expTime = new Date(exp.expense_date).getTime();
      return expTime >= startTime && expTime <= endTime;
    });
    setRecentSales(filtered);
    setFilteredExpenses(filteredExp);
  }, [selectedPeriod, customStartDate, customEndDate, allSales, allExpenses]);
  const handleApplyCustomDate = () => {
    setSelectedPeriod("custom");
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };
  const formatCurrencyShort = (value) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}jt`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}rb`;
    return value.toString();
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };
  const getCostPrice = (lpgType) => {
    const priceData = prices.find((p) => p.lpg_type === lpgType);
    if (priceData) return Number(priceData.cost_price);
    const fallbacks = {
      "gr220": 17e3,
      "kg3": 16e3,
      "kg5": 52e3,
      "kg12": 142e3,
      "kg50": 59e4
    };
    return fallbacks[lpgType] || 16e3;
  };
  const filteredTotals = useMemo(() => {
    return recentSales.reduce((acc, sale) => {
      const costPrice = getCostPrice(sale.lpg_type);
      const modal = sale.qty * costPrice;
      const penjualan = Number(sale.total_amount);
      const marginKotor2 = penjualan - modal;
      return {
        qty: acc.qty + sale.qty,
        penjualan: acc.penjualan + penjualan,
        modal: acc.modal + modal,
        marginKotor: acc.marginKotor + marginKotor2,
        laba: acc.laba + marginKotor2
      };
    }, { qty: 0, penjualan: 0, modal: 0, marginKotor: 0, laba: 0 });
  }, [recentSales, prices]);
  const dailySummaryArray = useMemo(() => {
    const summary = recentSales.reduce((acc, sale) => {
      const dateKey = new Date(sale.sale_date).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, qty: 0, penjualan: 0, modal: 0, pengeluaran: 0, marginKotor: 0, laba: 0 };
      }
      const costPrice = getCostPrice(sale.lpg_type);
      const modal = sale.qty * costPrice;
      const penjualan = Number(sale.total_amount);
      const margin = penjualan - modal;
      acc[dateKey].qty += sale.qty;
      acc[dateKey].penjualan += penjualan;
      acc[dateKey].modal += modal;
      acc[dateKey].marginKotor += margin;
      return acc;
    }, {});
    filteredExpenses.forEach((exp) => {
      const dateKey = new Date(exp.expense_date).toISOString().split("T")[0];
      if (!summary[dateKey]) {
        summary[dateKey] = { date: dateKey, qty: 0, penjualan: 0, modal: 0, pengeluaran: 0, marginKotor: 0, laba: 0 };
      }
      summary[dateKey].pengeluaran += Number(exp.amount);
    });
    Object.values(summary).forEach((day) => {
      day.laba = day.marginKotor - day.pengeluaran;
    });
    return Object.values(summary).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [recentSales, prices, filteredExpenses]);
  const totalPengeluaran = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [filteredExpenses]);
  const totals = {
    qty: filteredTotals.qty,
    penjualan: filteredTotals.penjualan,
    modal: filteredTotals.modal,
    pengeluaran: totalPengeluaran,
    // Now using actual expense data!
    laba: filteredTotals.laba - totalPengeluaran
    // Laba = MarginKotor - Pengeluaran
  };
  const marginKotor = filteredTotals.marginKotor;
  const marginPercentage = totals.penjualan > 0 ? (marginKotor / totals.penjualan * 100).toFixed(1) : "0";
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "hariini":
        return "Hari Ini";
      case "7hari":
        return "7 Hari";
      case "mingguini":
        return "Minggu Ini";
      case "bulanini":
        return "Bulan Ini";
      case "custom":
        return `${customStartDate} - ${customEndDate}`;
      default:
        return "Hari Ini";
    }
  };
  const enhancedChartData = useMemo(() => {
    return chartData.map((day) => ({
      name: formatDate(day.date),
      fullDate: day.date,
      penjualan: day.penjualan,
      modal: day.modal,
      margin: day.penjualan - day.modal,
      pengeluaran: day.pengeluaran,
      laba: day.laba
    }));
  }, [chartData]);
  const handleExportExcel = useCallback(() => {
    if (allSales.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }
    try {
      toast.loading("Generating Excel...", { id: "excel-export" });
      const wb = XLSX.utils.book_new();
      const now = /* @__PURE__ */ new Date();
      const pangkalanName = profile?.pangkalans?.name || profile?.name || "PANGKALAN";
      const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase();
      const formatDateExcel = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const monthlySales = allSales.filter((sale) => {
        const saleTime = new Date(sale.sale_date).getTime();
        return saleTime >= monthStart.getTime() && saleTime <= monthEnd.getTime();
      });
      const wsData = [];
      wsData.push([`DATA PENJUALAN ${pangkalanName.toUpperCase()} BULAN ${monthName}`]);
      wsData.push([]);
      wsData.push([
        "NO",
        "TANGGAL",
        "NAMA PELANGGAN",
        "QTY",
        "HARGA BELI",
        "HARGA JUAL",
        "MARGIN SATUAN",
        "TOTAL BELI",
        "TOTAL JUAL",
        "MARGIN KOTOR",
        "PENGELUARAN",
        "LABA BERSIH",
        "TIPE LPG"
      ]);
      let rowNo = 1;
      let grandTotalQty = 0;
      let grandTotalModal = 0;
      let grandTotalPenjualan = 0;
      let grandTotalMargin = 0;
      const salesByDate = monthlySales.reduce((acc, sale) => {
        const dateKey = formatDateExcel(sale.sale_date);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(sale);
        return acc;
      }, {});
      Object.entries(salesByDate).sort(([a], [b]) => {
        const [dayA, monthA, yearA] = a.split("/").map(Number);
        const [dayB, monthB, yearB] = b.split("/").map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
      }).forEach(([dateLabel, dateSales]) => {
        dateSales.forEach((sale) => {
          const costPrice = getCostPrice(sale.lpg_type);
          const hargaJual = Number(sale.price_per_unit);
          const marginSatuan = hargaJual - costPrice;
          const totalModal = sale.qty * costPrice;
          const totalPenjualan = Number(sale.total_amount);
          const marginKotor2 = totalPenjualan - totalModal;
          const pengeluaran = 0;
          const labaBersih = marginKotor2 - pengeluaran;
          grandTotalQty += sale.qty;
          grandTotalModal += totalModal;
          grandTotalPenjualan += totalPenjualan;
          grandTotalMargin += marginKotor2;
          wsData.push([
            rowNo++,
            dateLabel,
            // DD/MM/YYYY format
            sale.consumer_name || sale.consumers?.name || "Walk-in",
            sale.qty,
            costPrice,
            // Pure number
            hargaJual,
            // Pure number
            marginSatuan,
            // Pure number
            totalModal,
            // Pure number
            totalPenjualan,
            // Pure number
            marginKotor2,
            // Pure number
            pengeluaran,
            // Pure number
            labaBersih,
            // Pure number
            sale.lpg_type.toUpperCase()
          ]);
        });
      });
      wsData.push([]);
      wsData.push([
        "TOTAL",
        "",
        "",
        grandTotalQty,
        "",
        "",
        "",
        grandTotalModal,
        grandTotalPenjualan,
        grandTotalMargin,
        0,
        grandTotalMargin,
        ""
      ]);
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [
        { wch: 5 },
        // NO
        { wch: 15 },
        // TANGGAL
        { wch: 20 },
        // NAMA PELANGGAN
        { wch: 6 },
        // QTY
        { wch: 16 },
        // HARGA BELI
        { wch: 16 },
        // HARGA JUAL
        { wch: 16 },
        // MARGIN SATUAN
        { wch: 18 },
        // TOTAL BELI
        { wch: 18 },
        // TOTAL JUAL
        { wch: 16 },
        // MARGIN KOTOR
        { wch: 14 },
        // PENGELUARAN
        { wch: 16 },
        // LABA BERSIH
        { wch: 10 }
        // TIPE LPG
      ];
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }];
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");
      const fileName = `Laporan_${pangkalanName.replace(/\s/g, "_")}_${monthName.replace(/\s/g, "_")}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success("Excel berhasil di-download!", { id: "excel-export" });
    } catch (error2) {
      console.error("Excel export error:", error2);
      toast.error("Gagal export Excel", { id: "excel-export" });
    }
  }, [allSales, prices, profile]);
  const handleExportPDF = useCallback(() => {
    if (allSales.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }
    try {
      toast.loading("Generating PDF...", { id: "pdf-export" });
      const doc = new jsPDF({ orientation: "landscape" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const now = /* @__PURE__ */ new Date();
      const formatRp = (value) => `Rp ${value.toLocaleString("id-ID")}`;
      const formatDatePremium = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long" });
      };
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const monthlySales = allSales.filter((sale) => {
        const saleTime = new Date(sale.sale_date).getTime();
        return saleTime >= monthStart.getTime() && saleTime <= monthEnd.getTime();
      });
      const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase();
      const pangkalanName = profile?.pangkalans?.name || profile?.name || "PANGKALAN";
      let totalQty = 0, totalModal = 0, totalPenjualan = 0, totalLaba = 0;
      monthlySales.forEach((sale) => {
        const costPrice = getCostPrice(sale.lpg_type);
        const modal = sale.qty * costPrice;
        const penjualan = Number(sale.total_amount);
        totalQty += sale.qty;
        totalModal += modal;
        totalPenjualan += penjualan;
        totalLaba += penjualan - modal;
      });
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("Sim4lon by Luthfi", pageWidth - margin, 10, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text(`LAPORAN PENJUALAN ${pangkalanName.toUpperCase()}`, pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Bulan: ${monthName}`, pageWidth / 2, 22, { align: "center" });
      doc.setDrawColor(200);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, 28, pageWidth - 2 * margin, 20, 3, 3, "F");
      doc.setFontSize(9);
      doc.setTextColor(60);
      const summaryY = 38;
      doc.text(`Total Transaksi: ${monthlySales.length}`, margin + 5, summaryY);
      doc.text(`Total Qty: ${totalQty} unit`, margin + 60, summaryY);
      doc.text(`Total Penjualan: ${formatRp(totalPenjualan)}`, margin + 110, summaryY);
      doc.text(`Total Modal: ${formatRp(totalModal)}`, margin + 175, summaryY);
      doc.setTextColor(22, 163, 74);
      doc.text(`Laba: ${formatRp(totalLaba)}`, margin + 235, summaryY);
      const headers = [
        "NO",
        "TANGGAL",
        "NAMA PELANGGAN",
        "QTY",
        "HARGA BELI",
        "HARGA JUAL",
        "MARGIN SATUAN",
        "TOTAL BELI",
        "TOTAL JUAL",
        "MARGIN KOTOR",
        "PENGELUARAN",
        "LABA BERSIH",
        "TIPE"
      ];
      const tableData = [];
      let rowNo = 1;
      monthlySales.forEach((sale) => {
        const costPrice = getCostPrice(sale.lpg_type);
        const hargaJual = Number(sale.price_per_unit);
        const marginSatuan = hargaJual - costPrice;
        const totalBeli = sale.qty * costPrice;
        const totalJual = Number(sale.total_amount);
        const marginKotor2 = totalJual - totalBeli;
        const pengeluaran = 0;
        const labaBersih = marginKotor2 - pengeluaran;
        tableData.push([
          rowNo++,
          formatDatePremium(sale.sale_date),
          sale.consumer_name || sale.consumers?.name || "Walk-in",
          sale.qty,
          formatRp(costPrice),
          formatRp(hargaJual),
          formatRp(marginSatuan),
          formatRp(totalBeli),
          formatRp(totalJual),
          formatRp(marginKotor2),
          formatRp(pengeluaran),
          formatRp(labaBersih),
          sale.lpg_type.toUpperCase()
        ]);
      });
      autoTable(doc, {
        startY: 52,
        head: [headers],
        body: tableData,
        theme: "grid",
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 7,
          cellPadding: 1,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          overflow: "linebreak"
        },
        headStyles: {
          fillColor: [30, 64, 175],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 8,
          halign: "center",
          cellPadding: 4
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 14 },
          // NO
          1: { cellWidth: 24 },
          // TANGGAL
          2: { cellWidth: "auto" },
          // NAMA PELANGGAN (flexible)
          3: { halign: "center", cellWidth: 14 },
          // QTY
          4: { halign: "right", cellWidth: 20 },
          // HARGA BELI
          5: { halign: "right", cellWidth: 20 },
          // HARGA JUAL
          6: { halign: "right", cellWidth: 20 },
          // MARGIN SATUAN
          7: { halign: "right", cellWidth: 26 },
          // TOTAL BELI
          8: { halign: "right", cellWidth: 26 },
          // TOTAL JUAL
          9: { halign: "right", cellWidth: 24 },
          // MARGIN KOTOR
          10: { halign: "right", cellWidth: 24 },
          // PENGELUARAN
          11: { halign: "right", cellWidth: 24 },
          // LABA BERSIH
          12: { halign: "center", cellWidth: 14 }
          // TIPE
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        didParseCell: (data) => {
          if (data.column.index === 11 && data.section === "body") {
            const rawValue = String(data.cell.raw).replace(/[^\d]/g, "");
            if (parseInt(rawValue) > 0) {
              data.cell.styles.textColor = [22, 163, 74];
              data.cell.styles.fontStyle = "bold";
            }
          }
        }
      });
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Halaman ${i} dari ${pageCount} | Dicetak: ${(/* @__PURE__ */ new Date()).toLocaleString("id-ID")}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }
      doc.save(`Laporan_${pangkalanName.replace(/\s/g, "_")}_${monthName.replace(/\s/g, "_")}.pdf`);
      toast.success("PDF berhasil di-download!", { id: "pdf-export" });
    } catch (error2) {
      console.error("PDF export error:", error2);
      toast.error("Gagal export PDF", { id: "pdf-export" });
    }
  }, [allSales, prices, profile]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "BarChart3", className: "h-6 w-6 text-blue-600" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-4 font-medium", children: "Memuat data laporan..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-8 w-8 text-red-500" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Gagal Memuat Data" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-4", children: error }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => window.location.reload(), className: "bg-blue-600 hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: "h-4 w-4 mr-2" }),
        "Coba Lagi"
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fadeInDown", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 animate-lineGrow" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight", children: "Laporan Penjualan" }),
            /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Calculator", className: "h-4 w-4 animate-pulse" }),
              "Perhitungan: Qty × (Harga Jual - Modal)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "default",
              className: "rounded-xl shadow-sm hover:shadow-md transition-all",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Download", className: "h-4 w-4 mr-2" }),
                "Export",
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "h-3 w-3 ml-1" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleExportExcel, className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileSpreadsheet", className: "h-4 w-4 mr-2 text-green-600" }),
              "Export Excel"
            ] }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleExportPDF, className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-4 w-4 mr-2 text-red-600" }),
              "Export PDF"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-100 rounded-xl p-1 gap-1", children: [
          [
            { value: "hariini", label: "Hari Ini", icon: "Calendar" },
            { value: "7hari", label: "7 Hari", icon: "CalendarClock" },
            { value: "mingguini", label: "Minggu Ini", icon: "CalendarDays" },
            { value: "bulanini", label: "Bulan Ini", icon: "CalendarRange" }
          ].map((period) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setSelectedPeriod(period.value);
                setShowCustom(false);
              },
              className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === period.value && !showCustom ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: period.icon, className: "h-4 w-4" }),
                period.label
              ]
            },
            period.value
          )),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowCustom(!showCustom),
              className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${showCustom ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Settings2", className: "h-4 w-4" }),
                "Custom"
              ]
            }
          )
        ] }),
        showCustom && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 animate-in slide-in-from-left-2 duration-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "CalendarDays", className: "h-4 w-4 text-slate-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: customStartDate,
                onChange: (e) => setCustomStartDate(e.target.value),
                className: "bg-transparent border-none text-sm focus:outline-none w-32"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "-" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: customEndDate,
                onChange: (e) => setCustomEndDate(e.target.value),
                className: "bg-transparent border-none text-sm focus:outline-none w-32"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              className: "rounded-lg bg-blue-600 hover:bg-blue-700",
              onClick: handleApplyCustomDate,
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "h-4 w-4 mr-1" }),
                "Terapkan"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200 p-4 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-600", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Calculator", className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Perhitungan:" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-white", children: "Modal = Qty × Harga Beli" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "→" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-white", children: "Penjualan = Qty × Harga Jual" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "→" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-green-50 text-green-700 border-green-200", children: "Laba = Penjualan - Modal" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Ringkasan" }),
          /* @__PURE__ */ jsxs(Badge, { className: "bg-blue-100 text-blue-700 hover:bg-blue-100", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-3 w-3 mr-1" }),
            getPeriodLabel()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
          recentSales.length,
          " transaksi"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-1", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Banknote", className: "h-4 w-4" }) }),
            "Total Penjualan"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(totals.penjualan) }),
            /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-sm mt-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-3.5 w-3.5" }),
              totals.qty,
              " tabung terjual"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-2", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-4 w-4" }) }),
            "Total Beli"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(totals.modal) }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-300 text-sm mt-2", children: "Biaya pembelian LPG" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-3", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowUpRight", className: "h-4 w-4" }) }),
            "Margin Kotor"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(marginKotor) }),
            /* @__PURE__ */ jsx("p", { className: "text-cyan-100 text-sm mt-2", children: "Sebelum pengeluaran" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-4", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "MinusCircle", className: "h-4 w-4" }) }),
            "Pengeluaran"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(totals.pengeluaran) }),
            /* @__PURE__ */ jsx("p", { className: "text-orange-100 text-sm mt-2", children: "Biaya operasional" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-5", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "BadgeDollarSign", className: "h-4 w-4" }) }),
            "Laba Bersih"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(totals.laba) }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mt-2", children: /* @__PURE__ */ jsxs(Badge, { className: "bg-white/20 text-white hover:bg-white/30 text-xs", children: [
              marginPercentage,
              "% margin"
            ] }) })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "BarChart3", className: "h-4 w-4 text-blue-600" }) }),
            "Penjualan vs Pembelian"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Perbandingan harian selama 7 hari" })
        ] }) }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[280px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: enhancedChartData, barGap: 4, barCategoryGap: "25%", children: [
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2E8F0", vertical: false }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#64748B", fontSize: 12, tickLine: false, axisLine: false }),
            /* @__PURE__ */ jsx(YAxis, { stroke: "#64748B", fontSize: 12, tickFormatter: formatCurrencyShort, tickLine: false, axisLine: false }),
            /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
            /* @__PURE__ */ jsx(Bar, { dataKey: "penjualan", name: "Penjualan", fill: "#3B82F6", radius: [6, 6, 0, 0] }),
            /* @__PURE__ */ jsx(Bar, { dataKey: "modal", name: "Modal", fill: "#CBD5E1", radius: [6, 6, 0, 0] })
          ] }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-8 mt-4 pt-4 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-blue-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Penjualan" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-slate-300" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Pembelian" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-4 w-4 text-green-600" }) }),
            "Trend Laba Bersih"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Perkembangan profit harian" })
        ] }) }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsx("div", { className: "h-[280px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: enhancedChartData, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "labaGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#22C55E", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#22C55E", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2E8F0", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#64748B", fontSize: 12, tickLine: false, axisLine: false }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#64748B", fontSize: 12, tickFormatter: formatCurrencyShort, tickLine: false, axisLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
          /* @__PURE__ */ jsx(
            Area,
            {
              type: "monotone",
              dataKey: "laba",
              name: "Laba Bersih",
              stroke: "#22C55E",
              strokeWidth: 3,
              fill: "url(#labaGradient)",
              dot: { r: 5, fill: "#22C55E", strokeWidth: 3, stroke: "#fff" },
              activeDot: { r: 7, stroke: "#22C55E", strokeWidth: 3, fill: "#fff" }
            }
          )
        ] }) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-4 w-4 text-purple-600" }) }),
          "Ringkasan Per Tanggal"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Perhitungan laba harian" })
      ] }) }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-b border-slate-200", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left py-4 px-6 font-semibold text-slate-700", children: "Tanggal" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-4 px-6 font-semibold text-slate-700", children: "Qty" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-4 px-6 font-semibold text-slate-700", children: "Pembelian" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-4 px-6 font-semibold text-slate-700", children: "Penjualan" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-4 px-6 font-semibold text-cyan-600", children: "Margin Kotor" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-4 px-6 font-semibold text-orange-600", children: "Pengeluaran" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-4 px-6 font-semibold text-green-600", children: "Laba Bersih" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: dailySummaryArray.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 7, className: "text-center py-12", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Inbox", className: "h-12 w-12 text-slate-300 mx-auto mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: "Belum ada data untuk periode ini" })
        ] }) }) : dailySummaryArray.map((day, index) => {
          const margin = day.penjualan - day.modal;
          return /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 hover:bg-slate-50/50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-slate-900 font-medium", children: formatDate(day.date) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-slate-700", children: day.qty }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-slate-700", children: formatCurrency(day.modal) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-slate-900 font-medium", children: formatCurrency(day.penjualan) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-cyan-600 font-medium", children: formatCurrency(margin) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-orange-600", children: formatCurrency(day.pengeluaran) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6", children: /* @__PURE__ */ jsx("span", { className: `font-bold ${day.laba >= 0 ? "text-green-600" : "text-red-600"}`, children: formatCurrency(day.laba) }) })
          ] }, index);
        }) }),
        /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gradient-to-r from-slate-100 to-slate-50 font-semibold", children: [
          /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-slate-900", children: "TOTAL" }),
          /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-slate-900", children: totals.qty }),
          /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-slate-900", children: formatCurrency(totals.modal) }),
          /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-blue-600 font-bold", children: formatCurrency(totals.penjualan) }),
          /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-cyan-600 font-bold", children: formatCurrency(marginKotor) }),
          /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-orange-600 font-bold", children: formatCurrency(totals.pengeluaran) }),
          /* @__PURE__ */ jsx("td", { className: "text-right py-4 px-6 text-green-600 font-bold text-lg", children: formatCurrency(totals.laba) })
        ] }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4 text-amber-600" }) }),
            "Detail Transaksi"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Rincian penjualan per pelanggan" })
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
          recentSales.length,
          " transaksi"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto max-h-[450px]", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "sticky top-0 bg-white shadow-sm z-10", children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-b border-slate-200", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Tanggal" }),
          /* @__PURE__ */ jsx("th", { className: "text-left py-3 px-4 font-semibold text-slate-700", children: "Pelanggan" }),
          /* @__PURE__ */ jsx("th", { className: "text-center py-3 px-4 font-semibold text-slate-700", children: "Qty" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 font-semibold text-slate-700", children: "Harga Beli" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 font-semibold text-slate-700", children: "Harga Jual" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 font-semibold text-blue-600", children: "Margin/Unit" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 font-semibold text-slate-700", children: "Total Beli" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 font-semibold text-slate-700", children: "Total Jual" }),
          /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-4 font-semibold text-green-600", children: "Laba" }),
          /* @__PURE__ */ jsx("th", { className: "text-center py-3 px-4 font-semibold text-slate-700", children: "Tipe" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: recentSales.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 10, className: "text-center py-12", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Inbox", className: "h-12 w-12 text-slate-300 mx-auto mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: "Belum ada transaksi" })
        ] }) }) : recentSales.map((sale, index) => {
          const costPrice = getCostPrice(sale.lpg_type);
          const hargaJual = Number(sale.price_per_unit);
          const marginPerUnit = hargaJual - costPrice;
          const totalBeli = sale.qty * costPrice;
          const totalJual = Number(sale.total_amount);
          const laba = totalJual - totalBeli;
          return /* @__PURE__ */ jsxs("tr", { className: `border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`, children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-slate-600", children: new Date(sale.sale_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) }),
            /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900 uppercase text-xs", children: sale.consumers?.name || sale.consumer_name || "Walk-in" }) }),
            /* @__PURE__ */ jsx("td", { className: "text-center py-3 px-4 text-slate-700 font-medium", children: sale.qty }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-3 px-4 text-slate-600", children: formatCurrency(costPrice) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-3 px-4 text-slate-700", children: formatCurrency(hargaJual) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-3 px-4", children: /* @__PURE__ */ jsx("span", { className: "font-medium text-blue-600", children: formatCurrency(marginPerUnit) }) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-3 px-4 text-slate-600", children: formatCurrency(totalBeli) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-3 px-4 text-slate-900 font-medium", children: formatCurrency(totalJual) }),
            /* @__PURE__ */ jsx("td", { className: "text-right py-3 px-4", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-green-600", children: formatCurrency(laba) }) }),
            /* @__PURE__ */ jsx("td", { className: "text-center py-3 px-4", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700", children: sale.lpg_type.toUpperCase() }) })
          ] }, sale.id);
        }) })
      ] }) }) })
    ] })
  ] });
}
const $$Laporan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Laporan - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "LaporanPangkalanPage", LaporanPangkalanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/LaporanPangkalanPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/laporan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/laporan.astro";
const $$url = "/pangkalan/laporan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Laporan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
