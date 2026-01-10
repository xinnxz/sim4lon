import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.k-1prjTp.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DVGEP8G7.js";
import { A as AddUserForm } from "../_astro/AddUserForm.BKGoB8TY.js";
import { P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { renderers } from "../renderers.mjs";
const $$TambahPengguna = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Tambah Pengguna - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        <div class="flex-1 overflow-auto">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            ${renderComponent($$result4, "AddUserForm", AddUserForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/tambah-pengguna/AddUserForm.tsx", "client:component-export": "default" })}
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/tambah-pengguna.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/tambah-pengguna.astro";
const $$url = "/tambah-pengguna.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$TambahPengguna,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
