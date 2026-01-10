import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1e3,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1e3,
      // Retry failed requests up to 2 times
      retry: 2,
      // Don't refetch on window focus in production
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1
    }
  }
});
function QueryProvider({ children }) {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children });
}
function AdminFooter() {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { id: "app-footer", className: "border-t border-border bg-gradient-to-r from-background to-background/95 mt-auto shadow-lg transition-all duration-300", children: /* @__PURE__ */ jsx("div", { id: "ia9gy6", className: "container mx-auto px-4 py-6", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxs("p", { children: [
    "© ",
    currentYear,
    " SIM4LON - Sistem Informasi Distribusi LPG"
  ] }) }) }) });
}
export {
  AdminFooter as A,
  QueryProvider as Q
};
