import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { createContext, useState, useCallback, useEffect } from "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, k as DialogFooter } from "./ProtectedDashboard.DfQvqnI6.js";
import { S as SafeIcon, B as Button } from "./AuthGuard.D1AOouTt.js";
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
const persister = typeof window !== "undefined" ? createSyncStoragePersister({
  storage: window.localStorage,
  key: "sim4lon-cache",
  // Serialize with compression (smaller storage)
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data)
}) : null;
function QueryProvider({ children }) {
  if (persister) {
    return /* @__PURE__ */ jsx(
      PersistQueryClientProvider,
      {
        client: queryClient,
        persistOptions: {
          persister,
          // Cache expires after 24 hours
          maxAge: 24 * 60 * 60 * 1e3,
          // Don't persist error states
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              return query.state.status === "success";
            }
          }
        },
        children
      }
    );
  }
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children });
}
const ConfirmDialogContext = createContext(null);
function ConfirmDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(null);
  const [resolveRef, setResolveRef] = useState(null);
  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      setOptions(opts);
      setResolveRef(() => resolve);
      setIsOpen(true);
    });
  }, []);
  const handleConfirm = useCallback(() => {
    resolveRef?.(true);
    setIsOpen(false);
  }, [resolveRef]);
  const handleCancel = useCallback(() => {
    resolveRef?.(false);
    setIsOpen(false);
  }, [resolveRef]);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleConfirm, handleCancel]);
  const isDestructive = options?.variant === "destructive";
  return /* @__PURE__ */ jsxs(ConfirmDialogContext.Provider, { value: { confirm }, children: [
    children,
    /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && handleCancel(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[400px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${isDestructive ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`, children: /* @__PURE__ */ jsx(
            SafeIcon,
            {
              name: options?.icon || (isDestructive ? "AlertTriangle" : "HelpCircle"),
              className: `h-5 w-5 ${isDestructive ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`
            }
          ) }),
          options?.title || "Konfirmasi"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "pt-2", children: options?.message || "Apakah Anda yakin?" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: handleCancel,
            className: "rounded-xl",
            children: options?.cancelText || "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleConfirm,
            className: `rounded-xl ${isDestructive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700"}`,
            children: options?.confirmText || "Ya"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-slate-400 mt-2", children: "Tekan Enter untuk konfirmasi, Escape untuk batal" })
    ] }) })
  ] });
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
  ConfirmDialogProvider as C,
  QueryProvider as Q
};
