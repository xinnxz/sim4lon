import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import "clsx";
import { S as SafeIcon } from "./AuthGuard.BQhR3uPA.js";
function ReportNavigation({ currentPage }) {
  const reports = [
    {
      id: "tren_penjualan",
      label: "Tren Penjualan",
      href: "./tren-penjualan.html",
      icon: "TrendingUp"
    },
    {
      id: "status_pembayaran",
      label: "Status Pembayaran",
      href: "./status-pembayaran.html",
      icon: "PieChart"
    },
    {
      id: "pemakaian_stok",
      label: "Pemakaian Stok",
      href: "./pemakaian-stok.html",
      icon: "Package"
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: reports.map((report) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: report.href,
      className: `flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${currentPage === report.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
      children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: report.icon, className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: report.label })
      ]
    },
    report.id
  )) });
}
export {
  ReportNavigation as R
};
