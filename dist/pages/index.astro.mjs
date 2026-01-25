import { c as createComponent, a as renderTemplate, f as renderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import "clsx";
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze, __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => renderTemplate(_a || (_a = __template([`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIM4LON - Redirecting...</title>
  `, `</head>
  <body>
    <script>
      window.location.href = './dashboard';
    <\/script>
    <noscript>
      <meta http-equiv="refresh" content="0; url=./dashboard">
    </noscript>
  </body></html>`])), renderHead()), "E:/DATA/Ngoding/sim4lon/src/pages/index.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/index.astro";
const $$url = "";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
