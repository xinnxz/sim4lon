import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as SafeIcon, I as Input, B as Button, i as isAuthenticated, e as authApi, h as removeToken, j as clearCachedProfile } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { L as Label } from "../_astro/label.DNnd65zo.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "../_astro/card.OLhQVURm.js";
import { A as Alert, a as AlertDescription } from "../_astro/alert.2NW-baqQ.js";
import { toast } from "sonner";
/* empty css                                */
import { renderers } from "../renderers.mjs";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const user = await authApi.getProfile();
          const dashboardRoutes = {
            "ADMIN": "/dashboard-admin",
            "OPERATOR": "/dashboard-admin",
            "PANGKALAN": "/pangkalan/dashboard"
          };
          const redirectUrl = dashboardRoutes[user.role] || "/dashboard-admin";
          window.location.href = redirectUrl;
        } catch (error2) {
          removeToken();
        }
      }
    };
    checkAuth();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      return;
    }
    if (!password) {
      setError("Password tidak boleh kosong");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      clearCachedProfile();
      toast.success("Login berhasil! Mengalihkan ke dashboard...");
      const dashboardRoutes = {
        "ADMIN": "/dashboard-admin",
        "OPERATOR": "/dashboard-admin",
        "PANGKALAN": "/pangkalan/dashboard"
      };
      const redirectUrl = dashboardRoutes[response.user.role] || "/dashboard-admin";
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err.message || "Email atau password salah");
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full px-4 sm:px-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "sm:hidden text-center mb-2", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/logo-sim4lon-transparant-v2.png",
          alt: "SIM4LON Logo",
          className: "h-16 mx-auto mb-1 drop-shadow-lg"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white drop-shadow-md", children: "SIM4LON" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/90 text-sm", children: "Sistem Informasi Untuk Distribusi LPG" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "hidden sm:block space-y-2 text-center px-6 pt-8 pb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo-sim4lon-transparant-v2.png",
            alt: "SIM4LON Logo",
            className: "h-16 object-contain transition-all duration-300"
          }
        ) }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-gray-800", children: "SIM4LON" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-base text-gray-600", children: "Sistem Informasi Untuk Distribusi LPG" }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 flex flex-col items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-[10px] uppercase tracking-wider font-medium", children: "Mitra Resmi" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo-pertamina.png",
                alt: "Pertamina",
                className: "h-7 object-contain opacity-80"
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo-bluegaz.png",
                alt: "Blue Gaz",
                className: "h-7 object-contain opacity-80"
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo-pgn.png",
                alt: "PGN",
                className: "h-9 object-contain opacity-80"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "px-5 sm:px-6 py-6 sm:pb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "sm:hidden flex flex-col items-center gap-1.5 pb-2 mb-2 border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-[10px] uppercase tracking-wider font-medium", children: "Mitra Resmi" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo-pertamina.png",
                alt: "Pertamina",
                className: "h-6 object-contain opacity-80"
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo-bluegaz.png",
                alt: "Blue Gaz",
                className: "h-6 object-contain opacity-80"
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo-pgn.png",
                alt: "PGN",
                className: "h-8 object-contain opacity-80"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
          error && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "animate-slideInRight rounded-xl", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: error })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 animate-fadeInUp", style: { animationDelay: "0.1s" }, children: [
            /* @__PURE__ */ jsx(
              Label,
              {
                htmlFor: "email",
                className: "text-sm font-semibold text-gray-700 transition-colors",
                style: { color: focusedField === "email" ? "hsl(152, 100%, 30%)" : void 0 },
                children: "Email"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(
                SafeIcon,
                {
                  name: "Mail",
                  className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-emerald-600"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  placeholder: "Masukkan email Anda",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  onFocus: () => setFocusedField("email"),
                  onBlur: () => setFocusedField(null),
                  disabled: isLoading,
                  className: "pl-12 h-14 sm:h-12 text-base rounded-xl border-2 border-gray-200 bg-gray-50/50 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white placeholder:text-gray-400",
                  autoComplete: "email"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 animate-fadeInUp", style: { animationDelay: "0.2s" }, children: [
            /* @__PURE__ */ jsx(
              Label,
              {
                htmlFor: "password",
                className: "text-sm font-semibold text-gray-700 transition-colors",
                style: { color: focusedField === "password" ? "hsl(152, 100%, 30%)" : void 0 },
                children: "Password"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(
                SafeIcon,
                {
                  name: "Lock",
                  className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-emerald-600"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Masukkan password Anda",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  onFocus: () => setFocusedField("password"),
                  onBlur: () => setFocusedField(null),
                  disabled: isLoading,
                  className: "pl-12 pr-14 h-14 sm:h-12 text-base rounded-xl border-2 border-gray-200 bg-gray-50/50 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white placeholder:text-gray-400",
                  autoComplete: "current-password"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  disabled: isLoading,
                  className: "absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-gray-400 hover:text-gray-600 transition-all duration-200 disabled:opacity-50 hover:bg-gray-100 rounded-lg active:scale-95 touch-manipulation",
                  "aria-label": showPassword ? "Sembunyikan password" : "Tampilkan password",
                  children: /* @__PURE__ */ jsx(
                    SafeIcon,
                    {
                      name: showPassword ? "EyeOff" : "Eye",
                      className: "h-5 w-5"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp pt-2", style: { animationDelay: "0.4s" }, children: /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              disabled: isLoading,
              className: "w-full h-14 sm:h-12 text-base sm:text-sm text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl active:scale-[0.98] disabled:opacity-70 touch-manipulation",
              style: {
                background: "linear-gradient(135deg, hsl(152, 100%, 40%) 0%, hsl(152, 100%, 32%) 100%)",
                boxShadow: isLoading ? void 0 : "0 8px 24px -4px hsla(152, 100%, 30%, 0.4)"
              },
              children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-5 w-5 animate-spin" }),
                "Sedang Masuk..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "LogIn", className: "mr-2 h-5 w-5 transition-transform group-active:translate-x-1" }),
                "Masuk"
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 animate-fadeInUp", style: { animationDelay: "0.5s" }, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowDemoCredentials(!showDemoCredentials),
                className: "w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200",
                children: [
                  /* @__PURE__ */ jsx(
                    SafeIcon,
                    {
                      name: showDemoCredentials ? "EyeOff" : "Eye",
                      className: "h-3.5 w-3.5"
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { children: [
                    showDemoCredentials ? "Sembunyikan" : "Tampilkan",
                    " Akun Demo"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `overflow-hidden transition-all duration-300 ease-in-out ${showDemoCredentials ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 shadow-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-sm", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-emerald-600 font-semibold min-w-[70px]", children: "Admin" }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "admin@agen.com" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-semibold min-w-[70px]", children: "Operator" }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "operator@demo.com" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-orange-600 font-semibold min-w-[70px]", children: "Pangkalan" }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "pkl001@demo.com" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Password:" }),
                    " admin123 / operator123 / pangkalan123"
                  ] })
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-white/70 text-xs mt-6", children: "© 2026 SIM4LON. All rights reserved." })
  ] });
}
const $$Login = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Login - SIM4LON", "data-astro-cid-sgpqyurt": true }, { default: ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="min-h-screen w-full flex items-center justify-center bg-login-pattern p-4 relative overflow-hidden" data-astro-cid-sgpqyurt>
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none" data-astro-cid-sgpqyurt>
      
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" data-astro-cid-sgpqyurt></div>
      
      
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-floatSlow" data-astro-cid-sgpqyurt></div>
      
      
      <div class="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse opacity-75" data-astro-cid-sgpqyurt></div>
      <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse opacity-50" style="animation-delay: 1s;" data-astro-cid-sgpqyurt></div>
    </div>

    
    <div class="relative z-10 w-full max-w-md" data-astro-cid-sgpqyurt>
      ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/login/LoginForm", "client:component-export": "default", "data-astro-cid-sgpqyurt": true })}
    </div>
  </div>
` })}

${renderScript($$result, "E:/DATA/Ngoding/sim4lon/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`, "E:/DATA/Ngoding/sim4lon/src/pages/login.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/login.astro";
const $$url = "/login.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
