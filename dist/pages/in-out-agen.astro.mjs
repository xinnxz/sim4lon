import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BOBS5-gD.js";
import { A as AdminFooter } from "../_astro/AdminFooter.B5Ap1SI9.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "../_astro/card.OLhQVURm.js";
import { S as SafeIcon, B as Button, g as penerimaanApi } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.DOfMR1sZ.js";
import { e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, B as Badge, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { T as Tilt3DCard } from "../_astro/Tilt3DCard.kuKNoQnp.js";
import { toast } from "sonner";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { p as pertaminaLogo } from "../_astro/logo-pertamina.CdNcSRGD.js";
import { g as getAgenProfileFromAPI } from "../_astro/pertamina-export.rOOl49vm.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { renderers } from "../renderers.mjs";
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
function InOutAgenPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await penerimaanApi.getInOutAgen(selectedMonth);
      setData(result);
    } catch (error) {
      toast.error("Gagal memuat data In/Out Agen");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedMonth]);
  const monthOptions = useMemo(() => {
    const options = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      options.push({ value, label });
    }
    return options;
  }, []);
  const dayHeaders = useMemo(() => {
    if (!data) return [];
    return Array.from({ length: data.days_in_month }, (_, i) => i + 1);
  }, [data]);
  const today = (/* @__PURE__ */ new Date()).getDate();
  const currentMonth = `${(/* @__PURE__ */ new Date()).getFullYear()}-${String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0")}`;
  const isCurrentMonth = selectedMonth === currentMonth;
  const ROWS = [
    { key: "stok_awal", label: "Stok Awal", color: "blue" },
    { key: "penerimaan", label: "Penerimaan", color: "green" },
    { key: "penyaluran", label: "Penyaluran", color: "orange" },
    { key: "stok_akhir", label: "Stok Akhir", color: "purple" }
  ];
  const getMonthLabel = () => {
    const [year, month] = selectedMonth.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };
  const handleDownloadPDF = async () => {
    if (!data) {
      toast.error("Tidak ada data untuk di-download");
      return;
    }
    try {
      toast.loading("Generating PDF...", { id: "pdf-export" });
      const doc = new jsPDF({ orientation: "landscape" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const agenProfile = await getAgenProfileFromAPI();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PT. Pertamina (Persero)", margin, 12);
      doc.setFontSize(8);
      doc.text("Jl.Medan Merdeka Timur No. 1A Jakarta 10110", margin, 17);
      doc.text("Telp: 021 3815111 FAX: 021 3633585", margin, 22);
      try {
        const logoData = pertaminaLogo;
        const logoUrl = typeof logoData === "string" ? logoData : logoData.src;
        const logoBase64 = await loadImageAsBase64(logoUrl);
        doc.addImage(logoBase64, "PNG", pageWidth - 70, 8, 55, 13);
      } catch (logoError) {
        console.warn("[PDF Export] Could not load Pertamina logo:", logoError);
      }
      const [year, month] = selectedMonth.split("-");
      const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("id-ID", { month: "long" }).toUpperCase();
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`LAPORAN IN OUT AGEN PERIODE ${monthName} ${year}`, pageWidth / 2, 35, { align: "center" });
      let yPos = 45;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const agenFields = [
        { label: "Nama Agen", value: agenProfile.nama_agen },
        { label: "Alamat Agen", value: agenProfile.alamat_agen },
        { label: "Email", value: agenProfile.email },
        { label: "No. Sold To", value: agenProfile.no_siid },
        { label: "Wilayah", value: agenProfile.wilayah }
      ];
      agenFields.forEach((field) => {
        doc.text(`${field.label}`, margin, yPos);
        doc.text(`:`, margin + 25, yPos);
        doc.text(field.value, margin + 28, yPos);
        yPos += 4;
      });
      yPos += 5;
      const getDayName = (date) => {
        const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        return days[date.getDay()];
      };
      const headers = ["Field", ...dayHeaders.map((d) => {
        const date = new Date(parseInt(year), parseInt(month) - 1, d);
        const dayName = getDayName(date);
        return `${String(d).padStart(2, "0")}
${dayName}`;
      })];
      const tableData = ROWS.map((row) => {
        const rowData = [row.label];
        dayHeaders.forEach((day) => {
          const dayData = data.daily[day];
          const value = dayData ? dayData[row.key] : 0;
          rowData.push(value.toLocaleString());
        });
        return rowData;
      });
      autoTable(doc, {
        startY: yPos,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 6,
          cellPadding: 1.5,
          halign: "center",
          lineColor: [0, 0, 0],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [128, 0, 0],
          // Maroon like Pertamina
          textColor: 255,
          fontStyle: "bold",
          fontSize: 6
        },
        columnStyles: { 0: { halign: "left", cellWidth: 22 } },
        alternateRowStyles: { fillColor: [255, 255, 255] }
      });
      doc.save(`Laporan_InOut_Agen_${selectedMonth}.pdf`);
      toast.success("PDF berhasil di-download!", { id: "pdf-export" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Gagal export PDF", { id: "pdf-export" });
    }
  };
  const handleDownloadExcel = () => {
    if (!data) {
      toast.error("Tidak ada data untuk di-download");
      return;
    }
    try {
      toast.loading("Generating Excel...", { id: "excel-export" });
      const wb = XLSX.utils.book_new();
      const wsData = [];
      wsData.push([`Laporan In Out Agen - ${getMonthLabel()}`]);
      wsData.push([]);
      wsData.push(["Ringkasan"]);
      wsData.push(["Stok Awal Bulan", data.stok_awal_bulan || 0]);
      wsData.push(["Total Penerimaan", data.total_penerimaan || 0]);
      wsData.push(["Total Penyaluran", data.total_penyaluran || 0]);
      wsData.push(["Stok Akhir Bulan", data.stok_akhir_bulan || 0]);
      wsData.push([]);
      const headers = ["Field", ...dayHeaders.map((d) => String(d).padStart(2, "0"))];
      wsData.push(headers);
      ROWS.forEach((row) => {
        const rowData = [row.label];
        dayHeaders.forEach((day) => {
          const dayData = data.daily[day];
          const value = dayData ? dayData[row.key] : 0;
          rowData.push(value);
        });
        wsData.push(rowData);
      });
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [{ wch: 15 }, ...dayHeaders.map(() => ({ wch: 6 }))];
      XLSX.utils.book_append_sheet(wb, ws, "In Out Agen");
      XLSX.writeFile(wb, `Laporan_InOut_Agen_${selectedMonth}.xlsx`);
      toast.success("Excel berhasil di-download!", { id: "excel-export" });
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Gagal export Excel", { id: "excel-export" });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "In / Out Agen",
        subtitle: "Rekapitulasi stok harian (Stok Awal, Penerimaan, Penyaluran, Stok Akhir)"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "glass-card h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-blue-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "PackagePlus", className: "w-5 h-5 text-blue-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Stok Awal Bulan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: data?.stok_awal_bulan || 0, delay: 100 }) })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "glass-card h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-green-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowDownCircle", className: "w-5 h-5 text-green-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Penerimaan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-green-600", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: data?.total_penerimaan || 0, delay: 200 }) })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "glass-card h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-orange-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowUpCircle", className: "w-5 h-5 text-orange-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Penyaluran" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-orange-600", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: data?.total_penyaluran || 0, delay: 300 }) })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "glass-card h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-purple-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "PackageOpen", className: "w-5 h-5 text-purple-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Stok Akhir Bulan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-purple-600", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: data?.stok_akhir_bulan || 0, delay: 400 }) })
        ] })
      ] }) }) }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Bulan:" }),
        /* @__PURE__ */ jsxs(Select, { value: selectedMonth, onValueChange: setSelectedMonth, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-44", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsx(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:ml-auto", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: fetchData, disabled: isLoading, children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: `w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}` }),
          "Refresh"
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Download", className: "w-4 h-4 mr-1" }),
            "Download",
            /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "w-3 h-3 ml-1" })
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleDownloadPDF, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "w-4 h-4 mr-2" }),
              "Download PDF"
            ] }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleDownloadExcel, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileSpreadsheet", className: "w-4 h-4 mr-2" }),
              "Download Excel"
            ] })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-border/50 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-orange-500 animate-pulse" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "In Out Agen" }),
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "ml-auto", children: [
          data?.days_in_month || 0,
          " Hari"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "overflow-x-auto cursor-grab active:cursor-grabbing",
          onWheel: (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              e.preventDefault();
              e.currentTarget.scrollLeft += e.deltaY;
            }
          },
          children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 sticky top-0 z-20", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "sticky left-0 z-30 bg-muted px-4 py-3 text-left font-medium min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", children: "Field" }),
              dayHeaders.map((day) => {
                const todayClass = isCurrentMonth && day === today ? "bg-primary/20 text-primary font-bold" : "";
                return /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: `px-2 py-3 text-center font-medium min-w-[50px] ${todayClass}`,
                    children: String(day).padStart(2, "0")
                  },
                  day
                );
              })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: dayHeaders.length + 1, className: "text-center py-8", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "w-6 h-6 animate-spin mx-auto mb-2" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Memuat data..." })
            ] }) }) : ROWS.map((row) => {
              const bgClasses = {
                blue: "bg-blue-50",
                green: "bg-green-50",
                orange: "bg-orange-50",
                purple: "bg-purple-50"
              };
              const dotColors = {
                blue: "bg-blue-500",
                green: "bg-green-500",
                orange: "bg-orange-500",
                purple: "bg-purple-500"
              };
              return /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/30 transition-colors", children: [
                /* @__PURE__ */ jsx(
                  "td",
                  {
                    className: `sticky left-0 z-10 px-4 py-3 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${bgClasses[row.color]}`,
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${dotColors[row.color]}` }),
                      row.label
                    ] })
                  }
                ),
                dayHeaders.map((day) => {
                  const dayData = data?.daily[day];
                  const value = dayData ? dayData[row.key] : 0;
                  const todayClass = isCurrentMonth && day === today ? "bg-primary/10 font-bold" : "";
                  return /* @__PURE__ */ jsx(
                    "td",
                    {
                      className: `px-2 py-3 text-center ${todayClass} ${value === 0 && row.key !== "stok_akhir" ? "text-muted-foreground" : ""}`,
                      children: value.toLocaleString()
                    },
                    day
                  );
                })
              ] }, row.key);
            }) })
          ] })
        }
      ) })
    ] })
  ] });
}
const $$InOutAgen = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "In / Out Agen - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col dashboard-gradient-bg min-w-0">
        <div class="flex-1 overflow-y-auto overflow-x-hidden">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[calc(100vw-16rem)]">
            
            <div class="animate-fadeInUp">
              ${renderComponent($$result4, "InOutAgenPage", InOutAgenPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/in-out-agen/InOutAgenPage.tsx", "client:component-export": "default" })}
            </div>
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/in-out-agen.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/in-out-agen.astro";
const $$url = "/in-out-agen.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$InOutAgen,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
