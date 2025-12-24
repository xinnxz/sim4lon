import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { g as Sidebar, h as SidebarContent, i as SidebarGroup, j as SidebarGroupLabel, k as SidebarGroupContent, l as SidebarMenu, m as SidebarMenuItem, n as SidebarFooter, D as DropdownMenu, a as DropdownMenuTrigger, A as Avatar, f as AvatarImage, e as AvatarFallback, b as DropdownMenuContent, o as DropdownMenuLabel, p as DropdownMenuSeparator, c as DropdownMenuItem, u as useSidebar, q as SidebarProvider, r as SidebarInset } from "./ProtectedDashboard.DQupyLyw.js";
import { S as SafeIcon, B as Button, e as authApi, j as clearCachedProfile } from "./AuthGuard.BQhR3uPA.js";
const menuItems = [
  {
    name: "Dashboard",
    href: "/pangkalan/dashboard",
    icon: "LayoutDashboard"
  },
  {
    name: "Penjualan",
    href: "/pangkalan/penjualan",
    icon: "ShoppingBag"
  },
  {
    name: "Stok LPG",
    href: "/pangkalan/stok",
    icon: "Package"
  },
  {
    name: "Konsumen",
    href: "/pangkalan/konsumen",
    icon: "Users"
  },
  {
    name: "Pengeluaran",
    href: "/pangkalan/pengeluaran",
    icon: "Wallet"
  },
  {
    name: "Laporan",
    href: "/pangkalan/laporan",
    icon: "FileText"
  }
];
function PangkalanSidebar() {
  const [activePage, setActivePage] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePage(window.location.pathname);
    }
  }, []);
  const isActive = (href) => {
    if (activePage === href) return true;
    if (href === "/pangkalan/penjualan") {
      return activePage === "/pangkalan/penjualan";
    }
    return false;
  };
  return /* @__PURE__ */ jsxs(Sidebar, { className: "border-r bg-white dark:bg-slate-950", children: [
    /* @__PURE__ */ jsx(SidebarContent, { className: "pt-4 sidebar-scrollbar-modern", children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2", children: "Menu" }),
      /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { className: "space-y-1 px-2", children: menuItems.map((item) => {
        const active = isActive(item.href);
        return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.href,
            className: `flex items-center gap-3 px-3 h-11 rounded-lg transition-colors ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-950"}`,
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: item.icon, className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.name })
            ]
          }
        ) }, item.name);
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(SidebarFooter, { className: "border-t p-4", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400 text-center", children: "SIM4LON Pangkalan" }) })
  ] });
}
function MobileMenuButton() {
  try {
    const { toggleSidebar, openMobile } = useSidebar();
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: toggleSidebar,
        className: "md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl \r\n                           bg-gradient-to-br from-blue-500/10 to-blue-500/5 \r\n                           hover:from-blue-500/20 hover:to-blue-500/10 \r\n                           active:scale-95 transition-all duration-300 \r\n                           border border-blue-500/20 shadow-sm",
        "aria-label": "Toggle menu",
        children: /* @__PURE__ */ jsxs("div", { className: "w-5 h-4 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-blue-600 rounded-full transform transition-all duration-300 origin-left
                                   ${openMobile ? "rotate-45 translate-x-0.5 w-[22px]" : "w-5"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-blue-600 rounded-full transition-all duration-300
                                   ${openMobile ? "opacity-0 translate-x-3" : "w-4 opacity-100"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-blue-600 rounded-full transform transition-all duration-300 origin-left
                                   ${openMobile ? "-rotate-45 translate-x-0.5 w-[22px]" : "w-5"}`
            }
          )
        ] })
      }
    );
  } catch {
    return null;
  }
}
function PangkalanHeaderSimple() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);
  const handleLogout = () => {
    clearCachedProfile();
    authApi.logout();
  };
  const getInitials = (name) => {
    return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
  };
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 w-full h-14 sm:h-16 border-b bg-white dark:bg-slate-950 shadow-sm backdrop-blur-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex h-full items-center px-3 sm:px-4 gap-2 sm:gap-4", children: [
    /* @__PURE__ */ jsx(MobileMenuButton, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/logo-pertamina-2.png",
          alt: "Pertamina",
          className: "h-8 sm:h-10 object-contain transition-all duration-300"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "hidden xs:block", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white", children: "SIM4LON" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-[100px] sm:max-w-[200px]", children: profile?.pangkalans?.name || "Dashboard Pangkalan" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1" }),
    /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "relative h-10 w-10 rounded-full", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-10 w-10 border-2 border-blue-100", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: profile?.avatar_url || void 0, alt: profile?.name }),
        /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-100 text-blue-700 font-semibold", children: profile ? getInitials(profile.name) : "P" })
      ] }) }) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent, { className: "w-56", align: "end", forceMount: true, children: [
        /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: profile?.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: profile?.email })
        ] }) }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "/pangkalan/profil", className: "cursor-pointer", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "mr-2 h-4 w-4" }),
          "Profil"
        ] }) }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleLogout, className: "text-red-600 cursor-pointer", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "LogOut", className: "mr-2 h-4 w-4" }),
          "Keluar"
        ] })
      ] })
    ] })
  ] }) });
}
function PangkalanSidebarLayout({ children }) {
  useEffect(() => {
    const originalAccent = document.documentElement.getAttribute("data-accent");
    document.documentElement.setAttribute("data-accent", "blue");
    return () => {
      if (originalAccent) {
        document.documentElement.setAttribute("data-accent", originalAccent);
      } else {
        document.documentElement.removeAttribute("data-accent");
      }
    };
  }, []);
  return /* @__PURE__ */ jsx(
    SidebarProvider,
    {
      style: { "--header-height": "64px" },
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50", children: [
        /* @__PURE__ */ jsx(PangkalanHeaderSimple, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 w-full", children: [
          /* @__PURE__ */ jsx(PangkalanSidebar, {}),
          /* @__PURE__ */ jsx(SidebarInset, { className: "flex flex-col flex-1", children: /* @__PURE__ */ jsx("main", { className: "flex-1 p-2 lg:p-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children }) }) })
        ] })
      ] })
    }
  );
}
export {
  PangkalanSidebarLayout as P
};
