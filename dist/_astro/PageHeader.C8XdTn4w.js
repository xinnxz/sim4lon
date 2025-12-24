import { jsxs, jsx } from "react/jsx-runtime";
import "react";
function PageHeader({ title, subtitle, actions }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-2 animate-fadeInDown", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gradient-primary sm:text-4xl tracking-tight", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/80", children: subtitle })
      ] })
    ] }) }),
    actions && /* @__PURE__ */ jsx("div", { className: "shrink-0", children: actions })
  ] });
}
export {
  PageHeader as P
};
