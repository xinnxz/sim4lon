import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DMB591cw.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.B0qA0Ni6.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DJv7CO6O.js";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "../_astro/card.CnUj7wdc.js";
import { j as Skeleton, A as Avatar, l as AvatarImage, k as AvatarFallback, B as Badge, S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.igvMWLOj.js";
import { S as SafeIcon, B as Button, f as authApi } from "../_astro/AuthGuard.BLl0uVB7.js";
import { C as ChangePasswordModal } from "../_astro/ChangePasswordModal.DPvdZn0I.js";
import { renderers } from "../renderers.mjs";
const API_BASE_URL = "http://localhost:3000";
const getAvatarUrl = (url) => {
  if (!url) return void 0;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/api${url}`;
};
function ProfileCard() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await authApi.getProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "glass-card rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-14 w-14 rounded-full" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-20" })
          ] }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-12 rounded-full" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full rounded-lg" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full rounded-lg" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "border shadow-card hidden sm:block", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) })
    ] });
  }
  if (error || !profile) {
    return /* @__PURE__ */ jsx(Card, { className: "border shadow-card", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-12 w-12 mx-auto mb-4 text-destructive" }),
      /* @__PURE__ */ jsx("p", { className: "text-destructive", children: error || "Profil tidak ditemukan" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          className: "mt-4",
          onClick: () => window.location.reload(),
          children: "Coba Lagi"
        }
      )
    ] }) });
  }
  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "glass-card rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "h-14 w-14 ring-2 ring-primary/20", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: getAvatarUrl(profile.avatar_url), alt: profile.name }),
          /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-sm font-bold", children: initials })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold text-foreground truncate", children: profile.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-primary font-medium", children: profile.role === "ADMIN" ? "Administrator" : "Operator" })
        ] }),
        /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: "outline",
            className: `shrink-0 text-[10px] px-2 py-0.5 ${profile.is_active ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700" : "bg-gray-100 text-gray-500"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full mr-1 ${profile.is_active ? "bg-green-500" : "bg-gray-400"}` }),
              profile.is_active ? "Aktif" : "Nonaktif"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "px-4 py-2 bg-muted/30 border-b border-border/50", children: /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Informasi Kontak" }) }),
        /* @__PURE__ */ jsxs("div", { className: "divide-y divide-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Mail", className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Email" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate", children: profile.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Telepon" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: profile.phone || "-" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "px-4 py-2 bg-muted/30 border-b border-border/50", children: /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Detail Akun" }) }),
        /* @__PURE__ */ jsxs("div", { className: "divide-y divide-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Hash", className: "h-4 w-4 text-blue-500" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "ID User" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-mono font-medium text-foreground", children: profile.code || "USR-001" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-4 w-4 text-amber-500" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Tanggal Bergabung" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: formatDate(profile.created_at) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden sm:block space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Profil" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Detail akun Anda" })
        ] }),
        /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: "outline",
            className: `${profile.is_active ? "bg-green-50 text-primary border-primary/30" : "bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full mr-2 ${profile.is_active ? "bg-primary" : "bg-gray-400"}` }),
              profile.is_active ? "Aktif" : "Tidak Aktif"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-24 w-24 shrink-0", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: getAvatarUrl(profile.avatar_url), alt: profile.name }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-lg font-bold", children: initials })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: profile.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-primary font-medium mt-1", children: profile.role === "ADMIN" ? "Administrator" : "Operator" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, { className: "my-6" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Informasi Kontak" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Mail", className: "h-5 w-5 text-primary mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Email" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground break-all", children: profile.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-5 w-5 text-primary mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Telepon" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: profile.phone || "-" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, { className: "my-6" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Detail Akun" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "ID User" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-mono font-medium text-foreground", children: profile.code || "USR-001" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Tanggal Bergabung" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: formatDate(profile.created_at) })
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function ProfileActions() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Edit Profil" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Perbarui informasi pribadi Anda" })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Ubah nama, email, nomor telepon, dan informasi profil lainnya." }),
        /* @__PURE__ */ jsx("a", { href: "/edit-profil-admin", children: /* @__PURE__ */ jsxs(Button, { className: "w-full bg-primary hover:bg-primary/90 text-primary-foreground", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-4 w-4 mr-2" }),
          "Edit Profil"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Keamanan" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Kelola kata sandi akun Anda" })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Ubah kata sandi untuk menjaga keamanan akun Anda." }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => setIsChangePasswordOpen(true),
            variant: "outline",
            className: "w-full border-primary/30 hover:bg-primary/5",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "h-4 w-4 mr-2" }),
              "Ubah Password"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "h-5 w-5 text-primary" }),
        "Status Akun"
      ] }) }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full ${profile?.is_active ? "bg-primary" : "bg-gray-400"}` }),
            profile?.is_active ? "Aktif" : "Tidak Aktif"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Terakhir Login" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Sesi saat ini" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(ChangePasswordModal, { open: isChangePasswordOpen, onOpenChange: setIsChangePasswordOpen })
  ] });
}
const $$Profil = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Profil Akun - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        <div class="flex-1 overflow-auto">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div class="mb-8 animate-fadeInDown">
              <h1 class="text-3xl font-bold text-foreground">Profil Akun</h1>
              <p class="text-muted-foreground mt-2">Kelola informasi profil dan keamanan akun Anda</p>
            </div>

            
            <div class="grid gap-8 lg:grid-cols-3">
              
              <div class="lg:col-span-2 animate-fadeInUp">
                ${renderComponent($$result4, "ProfileCard", ProfileCard, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/profil-admin/ProfileCard.tsx", "client:component-export": "default" })}
              </div>

              
              <div class="animate-fadeInUp" style="animation-delay: 0.2s">
                ${renderComponent($$result4, "ProfileActions", ProfileActions, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/profil-admin/ProfileActions.tsx", "client:component-export": "default" })}
              </div>
            </div>
          </div>
        </div>

        
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/profil.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/profil.astro";
const $$url = "/profil.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Profil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
