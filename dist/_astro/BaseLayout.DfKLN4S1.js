import { c as createComponent, d as createAstro, a as renderTemplate, e as renderSlot, r as renderComponent, f as renderHead, g as addAttribute } from "./astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { jsx } from "react/jsx-runtime";
import { Toaster as Toaster$1 } from "sonner";
/* empty css                               */
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme: "light",
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
var __freeze = Object.freeze, __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
const $$Astro = createAstro();
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$Astro, $$props, $$slots);
  Astro.self = $$BaseLayout;
  const { title = "Project", description = "Built with Astro" } = Astro.props;
  return renderTemplate(_a || (_a = __template([`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"`, `>
    <title>`, `</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/logo-sim4lon-transparant-v2.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/logo-sim4lon-transparant-v2.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/logo-sim4lon-transparant-v2.png">
    
    <!-- Theme & Accent Color Persistence Script -->
    <!-- Runs before render to prevent flash of unstyled content (FOUC) -->
    <script>
      (function() {
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme');
        const root = document.documentElement;
        
        if (savedTheme === 'dark') {
          root.classList.add('dark');
        } else if (savedTheme === 'light') {
          root.classList.add('light');
        } else {
          // System preference
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
          } else {
            root.classList.add('light');
          }
        }
        
        // Apply saved accent color
        const savedAccent = localStorage.getItem('accentColor');
        if (savedAccent) {
          root.setAttribute('data-accent', savedAccent);
        }
      })();
    <\/script>
  `, `</head>
  <body>
    `, `
    `, `
  </body></html>`])), addAttribute(description, "content"), title, renderHead(), renderComponent($$result, "Toaster", Toaster, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/ui/sonner", "client:component-export": "Toaster" }), renderSlot($$result, $$slots.default));
}, "E:/DATA/Ngoding/sim4lon/src/layouts/BaseLayout.astro", void 0);
export {
  $$BaseLayout as $
};
