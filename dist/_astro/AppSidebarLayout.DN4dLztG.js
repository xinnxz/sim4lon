import { jsx, jsxs } from "react/jsx-runtime";
import { g as Sidebar, h as SidebarContent, i as SidebarGroup, j as SidebarGroupLabel, k as SidebarGroupContent, l as SidebarMenu, m as SidebarMenuItem, s as SidebarMenuButton, q as SidebarProvider, r as SidebarInset } from "./ProtectedDashboard.DQupyLyw.js";
import { useState, useEffect } from "react";
import { k as companyProfileApi, S as SafeIcon } from "./AuthGuard.BQhR3uPA.js";
import { A as AdminHeader } from "./AdminHeader.zbSi4BTp.js";
const PROFILE_CACHE_KEY = "sim4lon_user_profile";
const menuGroups = [
  {
    label: "Menu Utama",
    items: [
      { name: "Dashboard", href: "./dashboard-admin.html", icon: "LayoutDashboard" },
      { name: "Pesanan", href: "./daftar-pesanan.html", icon: "ShoppingCart" },
      { name: "Stok LPG", href: "./ringkasan-stok.html", icon: "Package" },
      { name: "Laporan", href: "/laporan", icon: "BarChart3", adminOnly: true }
    ]
  },
  {
    label: "Operasional",
    adminOnly: true,
    // Entire group is admin-only
    items: [
      { name: "Perencanaan", href: "/perencanaan", icon: "CalendarDays" },
      { name: "Penyaluran", href: "/penyaluran", icon: "Send" },
      { name: "Penerimaan", href: "/penerimaan", icon: "PackageCheck" },
      { name: "In / Out Agen", href: "/in-out-agen", icon: "RefreshCw" }
    ]
  },
  {
    label: "Manajemen",
    adminOnly: true,
    // Entire group is admin-only
    items: [
      { name: "Pangkalan", href: "./daftar-pangkalan.html", icon: "Store" },
      { name: "Pengguna", href: "./daftar-pengguna.html", icon: "Users" },
      { name: "Supir", href: "./daftar-driver.html", icon: "Truck" }
    ]
  },
  {
    label: "Sistem",
    adminOnly: true,
    // Entire group is admin-only
    items: [
      { name: "Log Riwayat", href: "/riwayat-aktivitas", icon: "History" },
      { name: "Pengaturan", href: "./pengaturan.html", icon: "Settings" }
    ]
  }
];
function getUserRole() {
  if (typeof window === "undefined") return "OPERATOR";
  try {
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY);
    if (cached) {
      const profile = JSON.parse(cached);
      return profile.role || "OPERATOR";
    }
  } catch {
  }
  return "OPERATOR";
}
function getVisibleMenuGroups(role) {
  if (role === "ADMIN") {
    return menuGroups;
  }
  return menuGroups.filter((group) => !group.adminOnly).map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly)
  })).filter((group) => group.items.length > 0);
}
function AdminSidebar() {
  const [activePage, setActivePage] = useState("");
  const [userRole, setUserRole] = useState("ADMIN");
  const [isHydrated, setIsHydrated] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const normalizeForComparison = (path) => {
    return path.replace(/^\.\//, "").replace(/^\//, "").replace(/\/$/, "").replace(/\.html$/, "");
  };
  const subPageMapping = {
    "daftar-pesanan": ["buat-pesanan", "detail-pesanan", "catat-pembayaran", "nota-pembayaran", "status-pembayaran"],
    "ringkasan-stok": ["pemakaian-stok"],
    "daftar-pangkalan": ["detail-edit-pangkalan"],
    "daftar-pengguna": ["tambah-pengguna"],
    "dashboard-admin": []
  };
  const getActiveMenu = (currentPath) => {
    for (const [parent, subPages] of Object.entries(subPageMapping)) {
      if (subPages.some((sub) => currentPath.includes(sub))) {
        return parent;
      }
    }
    return currentPath;
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const normalizedCurrentPath = normalizeForComparison(currentPath);
      const activeMenuPath = getActiveMenu(normalizedCurrentPath);
      setActivePage(activeMenuPath);
      const role = getUserRole();
      setUserRole(role);
      setIsHydrated(true);
      companyProfileApi.get().then((profile) => setCompanyName(profile.company_name || "")).catch(() => setCompanyName(""));
    }
  }, []);
  const visibleGroups = getVisibleMenuGroups(userRole);
  return /* @__PURE__ */ jsx(
    Sidebar,
    {
      className: "top-[--header-height] h-[calc(100vh-var(--header-height))]",
      variant: "inset",
      children: /* @__PURE__ */ jsxs(
        SidebarContent,
        {
          className: "px-2 py-2 sidebar-scrollbar-modern",
          style: {
            background: "linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--sidebar-background)/0.97) 50%, hsl(var(--sidebar-accent)/0.3) 100%)"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" }) }),
              /* @__PURE__ */ jsx("div", { className: "py-2 flex justify-center", children: companyName ? /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold text-center tracking-wide text-gray-500/70", children: companyName }) : /* @__PURE__ */ jsx("div", { className: "h-3 w-32 bg-muted rounded animate-pulse" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" }) })
            ] }),
            visibleGroups.map((group, groupIndex) => /* @__PURE__ */ jsxs(SidebarGroup, { className: "py-0", children: [
              /* @__PURE__ */ jsxs(
                SidebarGroupLabel,
                {
                  className: "text-[9px] font-bold uppercase tracking-[0.12em] text-sidebar-foreground/50 px-3 mb-1 flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-border to-transparent" }),
                    /* @__PURE__ */ jsx("span", { children: group.label }),
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-border to-transparent" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { className: "gap-0.4 px-1", children: group.items.map((item, itemIndex) => {
                const normalizedItemHref = normalizeForComparison(item.href);
                const isActive = normalizedItemHref === activePage;
                return /* @__PURE__ */ jsx(
                  SidebarMenuItem,
                  {
                    children: /* @__PURE__ */ jsx(
                      SidebarMenuButton,
                      {
                        asChild: true,
                        isActive,
                        className: `
                          relative overflow-hidden rounded-xl transition-all duration-300 ease-out
                          ${isActive ? "bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white shadow-lg shadow-primary/30" : "hover:bg-sidebar-accent/50 hover:translate-x-1 active:bg-primary/20"}
                        `,
                        children: /* @__PURE__ */ jsxs("a", { href: item.href, className: "flex items-center gap-2 w-full px-3 py-2 group", children: [
                          /* @__PURE__ */ jsx("div", { className: `
                            p-1 rounded-md transition-all duration-300
                            ${isActive ? "bg-white/20" : "bg-sidebar-accent/50 group-hover:bg-primary/10 group-hover:scale-110"}
                          `, children: /* @__PURE__ */ jsx(
                            SafeIcon,
                            {
                              name: item.icon,
                              className: `h-3.5 w-3.5 transition-transform duration-300 ${isActive ? "text-white" : "text-sidebar-foreground/70 group-hover:text-primary"}`
                            }
                          ) }),
                          /* @__PURE__ */ jsx("span", { className: `text-[13px] font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-sidebar-foreground/80 group-hover:text-sidebar-foreground"}`, children: item.name }),
                          isActive && /* @__PURE__ */ jsx("div", { className: "absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" })
                        ] })
                      }
                    )
                  },
                  item.name
                );
              }) }) })
            ] }, group.label)),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-2 px-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
              /* @__PURE__ */ jsx("p", { className: "text-[14px] text-center text-muted-foreground/40 mt-2 font-medium", children: "SIM4LON v1.3" }),
              /* @__PURE__ */ jsx("p", { className: "text-[9px] text-center text-muted-foreground/40 font-normal", children: "by Luthfi" })
            ] })
          ]
        }
      )
    }
  );
}
function AppSidebarLayout({
  children,
  headerHeight = "64px"
}) {
  return /* @__PURE__ */ jsx(
    SidebarProvider,
    {
      style: {
        "--header-height": headerHeight
      },
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen w-full", children: [
        /* @__PURE__ */ jsx(AdminHeader, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 w-full", children: [
          /* @__PURE__ */ jsx(AdminSidebar, {}),
          /* @__PURE__ */ jsx(SidebarInset, { className: "flex flex-col flex-1", children })
        ] })
      ] })
    }
  );
}
export {
  AppSidebarLayout as A
};
