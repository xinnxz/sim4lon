import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.Bvdpe0CJ.js";
import { C as Card, b as CardHeader, d as CardTitle, e as CardDescription, a as CardContent } from "../_astro/card.CnUj7wdc.js";
import { renderers } from "../renderers.mjs";
const $$Placeholder = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Halaman Dalam Pembangunan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-gradient-lpg-subtle p-4">
    ${renderComponent($$result2, "Card", Card, { className: "w-full max-w-md" }, { default: ($$result3) => renderTemplate`
      ${renderComponent($$result3, "CardHeader", CardHeader, {}, { default: ($$result4) => renderTemplate`
        ${renderComponent($$result4, "CardTitle", CardTitle, { className: "text-2xl text-center" }, { default: ($$result5) => renderTemplate`Halaman Dalam Pembangunan` })}
        ${renderComponent($$result4, "CardDescription", CardDescription, { className: "text-center" }, { default: ($$result5) => renderTemplate`
          Halaman ini sedang dalam proses pengembangan
        ` })}
      ` })}
      ${renderComponent($$result3, "CardContent", CardContent, { className: "text-center" }, { default: ($$result4) => renderTemplate`
        <p className="text-muted-foreground mb-4">
          Kami sedang bekerja keras untuk menyelesaikan halaman ini. Silakan kembali lagi nanti.
        </p>
        <a href="./dashboard" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Kembali ke Dashboard
        </a>
      ` })}
    ` })}
  </div>
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/placeholder.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/placeholder.astro";
const $$url = "/placeholder.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Placeholder,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
