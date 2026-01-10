import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BOBS5-gD.js";
import { A as AdminFooter } from "../_astro/AdminFooter.B5Ap1SI9.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { B as Button, S as SafeIcon, I as Input } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { e as cn, C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "../_astro/card.OLhQVURm.js";
import { L as Label } from "../_astro/label.DNnd65zo.js";
import { R as RadioGroup, a as RadioGroupItem } from "../_astro/radio-group.BZHy6hjp.js";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { toast } from "sonner";
import { renderers } from "../renderers.mjs";
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("grid place-content-center text-current"),
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const reportTypes = [
  { id: "penjualan", label: "Laporan Penjualan", description: "Tren penjualan dan ringkasan transaksi" },
  { id: "pembayaran", label: "Status Pembayaran", description: "Detail pembayaran pesanan" },
  { id: "stok", label: "Pemakaian Stok", description: "Laporan inventaris dan pemakaian" }
];
function ExportLaporanForm() {
  const [format, setFormat] = useState("pdf");
  const [selectedReports, setSelectedReports] = useState(["penjualan", "pembayaran"]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const today = /* @__PURE__ */ new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const defaultStartDate = firstDay.toISOString().split("T")[0];
  const defaultEndDate = lastDay.toISOString().split("T")[0];
  const handleReportToggle = (reportId) => {
    setSelectedReports(
      (prev) => prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };
  const handleSelectAll = () => {
    if (selectedReports.length === reportTypes.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reportTypes.map((r) => r.id));
    }
  };
  const handleExport = async () => {
    if (selectedReports.length === 0) {
      toast.error("Pilih minimal satu laporan untuk diekspor");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Pilih periode tanggal terlebih dahulu");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Tanggal mulai tidak boleh lebih besar dari tanggal akhir");
      return;
    }
    setIsExporting(true);
    setTimeout(() => {
      const reportNames = selectedReports.map((id) => reportTypes.find((r) => r.id === id)?.label).join(", ");
      toast.success(
        `Laporan berhasil diekspor dalam format ${format.toUpperCase()}
${reportNames}`
      );
      setIsExporting(false);
    }, 1500);
  };
  const handleReset = () => {
    setFormat("pdf");
    setSelectedReports(["penjualan", "pembayaran"]);
    setStartDate("");
    setEndDate("");
  };
  const setQuickPeriod = (period) => {
    const today2 = /* @__PURE__ */ new Date();
    let start = /* @__PURE__ */ new Date();
    let end = /* @__PURE__ */ new Date();
    if (period === "thisMonth") {
      start = new Date(today2.getFullYear(), today2.getMonth(), 1);
      end = new Date(today2.getFullYear(), today2.getMonth() + 1, 0);
    } else if (period === "thisQuarter") {
      const quarterMonth = Math.floor(today2.getMonth() / 3) * 3;
      start = new Date(today2.getFullYear(), quarterMonth, 1);
      end = new Date(today2.getFullYear(), quarterMonth + 3, 0);
    } else if (period === "thisYear") {
      start = new Date(today2.getFullYear(), 0, 1);
      end = new Date(today2.getFullYear(), 11, 31);
    }
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-start mb-6", style: { margin: "10px 0px 10px 50px" }, children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        asChild: true,
        className: "text-muted-foreground hover:text-foreground",
        children: /* @__PURE__ */ jsxs("a", { href: "./dashboard-laporan.html", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "mr-2 h-4 w-4" }),
          "Kembali"
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6", style: { margin: "0px 50px 0px 50px" }, children: [
      /* @__PURE__ */ jsxs(Card, { className: "card-hover", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-5 w-5 text-primary" }),
            "Format Ekspor"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Pilih format file yang Anda inginkan" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(RadioGroup, { value: format, onValueChange: (value) => setFormat(value), children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(RadioGroupItem, { value: "pdf", id: "pdf" }),
            /* @__PURE__ */ jsxs(Label, { htmlFor: "pdf", className: "flex-1 cursor-pointer", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: "PDF" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Format PDF untuk cetak dan arsip" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(RadioGroupItem, { value: "excel", id: "excel" }),
            /* @__PURE__ */ jsxs(Label, { htmlFor: "excel", className: "flex-1 cursor-pointer", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Excel" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Format Excel untuk analisis data" })
            ] })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "card-hover", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "BarChart3", className: "h-5 w-5 text-primary" }),
            "Pilih Laporan"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Pilih jenis laporan yang ingin diekspor" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg bg-secondary/30 border border-primary/20", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "select-all",
                checked: selectedReports.length === reportTypes.length,
                onCheckedChange: handleSelectAll
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "select-all", className: "flex-1 cursor-pointer font-medium", children: "Pilih Semua Laporan" })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: reportTypes.map((report) => /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: report.id,
                checked: selectedReports.includes(report.id),
                onCheckedChange: () => handleReportToggle(report.id),
                className: "mt-1"
              }
            ),
            /* @__PURE__ */ jsxs(Label, { htmlFor: report.id, className: "flex-1 cursor-pointer", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: report.label }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: report.description })
            ] })
          ] }, report.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "card-hover", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-5 w-5 text-primary" }),
            "Periode Laporan"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Tentukan rentang tanggal untuk laporan" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Pilihan Cepat" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: startDate === defaultStartDate && endDate === defaultEndDate ? "default" : "outline",
                  size: "sm",
                  onClick: () => setQuickPeriod("thisMonth"),
                  className: "text-xs",
                  children: "1 Bulan"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setQuickPeriod("thisQuarter"),
                  className: "text-xs",
                  children: "Triwulan"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setQuickPeriod("thisYear"),
                  className: "text-xs",
                  children: "Tahun"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "start-date", children: "Tanggal Mulai" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "start-date",
                  type: "date",
                  value: startDate || defaultStartDate,
                  onChange: (e) => setStartDate(e.target.value),
                  className: "w-full"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "end-date", children: "Tanggal Akhir" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "end-date",
                  type: "date",
                  value: endDate || defaultEndDate,
                  onChange: (e) => setEndDate(e.target.value),
                  className: "w-full"
                }
              )
            ] })
          ] })
        ] }) })
      ] }),
      selectedReports.length > 0 && /* @__PURE__ */ jsx(Card, { className: "bg-primary/5 border-primary/20", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-primary mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Ringkasan Ekspor" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            "Anda akan mengekspor ",
            selectedReports.length,
            " laporan dalam format ",
            format.toUpperCase(),
            " untuk periode ",
            startDate || defaultStartDate,
            " hingga ",
            endDate || defaultEndDate
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-end", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: handleReset,
            disabled: isExporting,
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "RotateCcw", className: "mr-2 h-4 w-4" }),
              "Reset"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleExport,
            disabled: isExporting || selectedReports.length === 0,
            className: "bg-primary hover:bg-primary/90",
            children: isExporting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
              "Mengekspor..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Download", className: "mr-2 h-4 w-4" }),
              "Ekspor Laporan"
            ] })
          }
        )
      ] })
    ] })
  ] });
}
const $$ExportLaporan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Ekspor Laporan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            
            <div className="mb-8" id="iy5ax" style="margin: 12px 0px 0px 50px">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Eksport Laporan</h1>
              </div>
              <p className="text-muted-foreground">
                Unduh laporan dalam format PDF atau Excel sesuai kebutuhan Anda
              </p>
            </div>

            
            ${renderComponent($$result4, "ExportLaporanForm", ExportLaporanForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/export-laporan/ExportLaporanForm.tsx", "client:component-export": "default" })}
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/export-laporan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/export-laporan.astro";
const $$url = "/export-laporan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ExportLaporan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
