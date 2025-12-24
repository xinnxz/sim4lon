import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { x as notificationApi, S as SafeIcon, B as Button, y as agenPangkalanOrdersApi, e as authApi, j as clearCachedProfile, h as removeToken } from "./AuthGuard.BQhR3uPA.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, A as Avatar, f as AvatarImage, e as AvatarFallback, b as DropdownMenuContent, o as DropdownMenuLabel, p as DropdownMenuSeparator, c as DropdownMenuItem, u as useSidebar } from "./ProtectedDashboard.DQupyLyw.js";
import { B as Badge } from "./badge.vBqho6dp.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog.CGih_8hL.js";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { e as cn } from "./card.xR1H4xxx.js";
import { toast } from "sonner";
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
function NotificationModal({ open, onOpenChange }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications(20);
      setNotifications(response.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNotificationClick = (notification) => {
    if (notification.link) {
      window.location.href = notification.link;
    }
  };
  const handleAcceptOrder = async (e, notification) => {
    e.stopPropagation();
    if (!notification.orderId) return;
    try {
      setProcessingId(notification.id);
      await agenPangkalanOrdersApi.confirm(notification.orderId);
      toast.success("Pesanan berhasil dikonfirmasi!");
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
      toast.error(error.message || "Gagal mengkonfirmasi pesanan");
    } finally {
      setProcessingId(null);
    }
  };
  const handleRejectOrder = async (e, notification) => {
    e.stopPropagation();
    if (!notification.orderId) return;
    try {
      setProcessingId(notification.id);
      await agenPangkalanOrdersApi.cancel(notification.orderId);
      toast.success("Pesanan ditolak");
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
      toast.error(error.message || "Gagal menolak pesanan");
    } finally {
      setProcessingId(null);
    }
  };
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "critical":
        return {
          badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          icon: "bg-rose-500/10 dark:bg-rose-500/15",
          iconColor: "text-rose-600 dark:text-rose-400",
          label: "Kritis!",
          dot: "bg-rose-500"
        };
      case "high":
        return {
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: "bg-amber-500/10 dark:bg-amber-500/15",
          iconColor: "text-amber-600 dark:text-amber-400",
          label: "Penting",
          dot: "bg-amber-500"
        };
      case "medium":
        return {
          badge: "bg-primary/10 text-primary border-primary/20",
          icon: "bg-primary/10 dark:bg-primary/15",
          iconColor: "text-primary",
          label: "Info",
          dot: "bg-primary"
        };
      default:
        return {
          badge: "bg-muted text-muted-foreground border-border",
          icon: "bg-muted",
          iconColor: "text-muted-foreground",
          label: "",
          dot: "bg-muted-foreground"
        };
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md p-0 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 px-6 py-5 border-b border-border/50", children: /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-5 w-5 text-white" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg font-bold", children: "Notifikasi" }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-sm", children: isLoading ? "Memuat..." : notifications.length > 0 ? `${notifications.length} notifikasi aktif` : "Tidak ada notifikasi" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(ScrollArea, { className: "h-[400px]", children: /* @__PURE__ */ jsx("div", { className: "px-4 py-3 space-y-1", children: isLoading ? (
      // Loading skeleton
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-3 animate-pulse", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-muted" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-3/4" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-1/2" })
        ] })
      ] }, i)) })
    ) : notifications.length === 0 ? (
      // Empty state
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(SafeIcon, { name: "BellOff", className: "h-8 w-8 text-muted-foreground/50" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Tidak ada notifikasi" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Semua sudah dibaca!" })
      ] })
    ) : (
      // Notification items
      notifications.map((notification, index) => {
        const config = getPriorityConfig(notification.priority);
        const isAgenOrder = notification.type === "agen_order";
        const isProcessing = processingId === notification.id;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => !isAgenOrder && handleNotificationClick(notification),
            className: `flex gap-3 p-3 rounded-xl ${isAgenOrder ? "" : "cursor-pointer hover:bg-muted/50 active:bg-muted"} transition-all duration-200 group`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
                /* @__PURE__ */ jsx("div", { className: `h-10 w-10 rounded-xl ${config.icon} flex items-center justify-center transition-colors`, children: /* @__PURE__ */ jsx(SafeIcon, { name: notification.icon, className: `h-5 w-5 ${config.iconColor}` }) }),
                (notification.priority === "critical" || notification.priority === "high") && /* @__PURE__ */ jsx("div", { className: `absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${config.dot} ring-2 ring-background` })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors", children: notification.title }),
                  (notification.priority === "critical" || notification.priority === "high") && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `shrink-0 text-[10px] px-1.5 py-0 ${config.badge}`, children: config.label })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mb-1", children: notification.message }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground/60 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-3 w-3" }),
                  notification.time
                ] }),
                isAgenOrder && notification.orderId && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "default",
                      className: "h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700",
                      onClick: (e) => handleAcceptOrder(e, notification),
                      disabled: isProcessing,
                      children: [
                        isProcessing ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-3 w-3" }),
                        "Terima"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 text-xs gap-1 text-rose-600 border-rose-300 hover:bg-rose-50 hover:text-rose-700",
                      onClick: (e) => handleRejectOrder(e, notification),
                      disabled: isProcessing,
                      children: [
                        /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-3 w-3" }),
                        "Tolak"
                      ]
                    }
                  )
                ] })
              ] }),
              !isAgenOrder && /* @__PURE__ */ jsx("div", { className: "flex items-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 text-muted-foreground" }) })
            ]
          },
          notification.id
        );
      })
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-border/50 bg-muted/30", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        className: "w-full gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200",
        asChild: true,
        children: /* @__PURE__ */ jsxs("a", { href: "/riwayat-aktivitas", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "History", className: "h-4 w-4" }),
          "Lihat Semua Aktivitas",
          /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowRight", className: "h-4 w-4 ml-auto" })
        ] })
      }
    ) })
  ] }) });
}
function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  icon = "AlertTriangle",
  iconColor = "text-primary",
  isLoading = false,
  isDangerous = false,
  onConfirm
}) {
  const handleConfirm = async () => {
    await onConfirm();
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-lg ${isDangerous ? "bg-destructive/10" : "bg-primary/10"}`, children: /* @__PURE__ */ jsx(
          SafeIcon,
          {
            name: icon,
            className: `h-5 w-5 ${isDangerous ? "text-destructive" : iconColor}`
          }
        ) }),
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg font-bold", children: title })
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-base mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-foreground font-medium", children: description }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4 justify-end", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: () => onOpenChange(false),
          disabled: isLoading,
          children: cancelText
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleConfirm,
          disabled: isLoading,
          className: isDangerous ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary/90",
          children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
            "Memproses..."
          ] }) : confirmText
        }
      )
    ] })
  ] }) });
}
const API_BASE_URL = "http://localhost:3000";
const getAvatarUrl = (url) => {
  if (!url) return void 0;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/api${url}`;
};
const PROFILE_CACHE_KEY = "sim4lon_profile_cache";
const NOTIF_READ_KEY = "sim4lon_last_notif_read";
function MobileMenuButton() {
  try {
    const { toggleSidebar, openMobile } = useSidebar();
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: toggleSidebar,
        className: "md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl \r\n                   bg-gradient-to-br from-primary/10 to-primary/5 \r\n                   hover:from-primary/20 hover:to-primary/10 \r\n                   active:scale-95 transition-all duration-300 \r\n                   border border-primary/20 shadow-sm",
        "aria-label": "Toggle menu",
        children: /* @__PURE__ */ jsxs("div", { className: "w-5 h-4 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-primary rounded-full transform transition-all duration-300 origin-left
                       ${openMobile ? "rotate-45 translate-x-0.5 w-[22px]" : "w-5"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-primary rounded-full transition-all duration-300
                       ${openMobile ? "opacity-0 translate-x-3" : "w-4 opacity-100"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-primary rounded-full transform transition-all duration-300 origin-left
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
function AdminHeader({
  userName: initialUserName = "",
  userRole: initialUserRole = "",
  notificationCount: initialCount = 0
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY);
        if (cached) {
          const profile = JSON.parse(cached);
          return profile.name || initialUserName;
        }
      } catch {
      }
    }
    return initialUserName;
  });
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY);
        if (cached) {
          const profile = JSON.parse(cached);
          return profile.role === "ADMIN" ? "Administrator" : "Operator";
        }
      } catch {
      }
    }
    return initialUserRole;
  });
  const [avatarUrl, setAvatarUrl] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY);
        if (cached) {
          const profile = JSON.parse(cached);
          return getAvatarUrl(profile.avatar_url);
        }
      } catch {
      }
    }
    return void 0;
  });
  const [notificationCount, setNotificationCount] = useState(initialCount);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await authApi.getProfile();
        setUserName(profile.name);
        setUserRole(profile.role === "ADMIN" ? "Administrator" : "Operator");
        setAvatarUrl(getAvatarUrl(profile.avatar_url));
        if (typeof window !== "undefined") {
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
        }
        const { notificationApi: notificationApi2 } = await import("./AuthGuard.BQhR3uPA.js").then((n) => n.D);
        const notifData = await notificationApi2.getNotifications(20);
        const lastReadTime = localStorage.getItem(NOTIF_READ_KEY);
        if (lastReadTime) {
          const lastRead = new Date(lastReadTime);
          const unreadCount = notifData.notifications.filter(
            (n) => new Date(n.time) > lastRead
          ).length;
          setNotificationCount(unreadCount);
        } else {
          setNotificationCount(notifData.unread_count);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleLogout = () => {
    clearCachedProfile();
    removeToken();
    window.location.href = "/login";
  };
  const handleNotificationOpen = () => {
    setShowNotifications(true);
    if (notificationCount > 0) {
      setNotificationCount(0);
      if (typeof window !== "undefined") {
        localStorage.setItem(NOTIF_READ_KEY, (/* @__PURE__ */ new Date()).toISOString());
      }
    }
  };
  const handleNotificationClose = (open) => {
    setShowNotifications(open);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all duration-300", id: "ijli", children: /* @__PURE__ */ jsxs("div", { className: "w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsx(MobileMenuButton, {}),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo-pertamina.png",
            alt: "Pertamina",
            className: "h-8 sm:h-10 object-contain dark:hidden transition-all duration-300"
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo-pertamina-darkmode.png",
            alt: "Pertamina",
            className: "h-8 sm:h-10 object-contain hidden dark:block transition-all duration-300"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "relative h-10 w-10 rounded-xl hover:bg-muted/50 transition-all duration-200",
            onClick: handleNotificationOpen,
            "aria-label": "Notifikasi",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-5 w-5 text-muted-foreground" }),
              notificationCount > 0 && /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: "destructive",
                  className: "absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center font-bold shadow-lg",
                  children: notificationCount > 99 ? "99+" : notificationCount
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              className: "flex items-center gap-3 px-3 py-2 h-auto rounded-xl hover:bg-muted/50 transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full opacity-75" }),
                  /* @__PURE__ */ jsxs(Avatar, { className: "h-9 w-9 relative border-2 border-background", children: [
                    /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: userName || "User" }),
                    /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm", children: userName ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : ".." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "hidden md:block text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: userName || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Loading..." }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: userRole || "" })
                ] }),
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "h-4 w-4 hidden md:block text-muted-foreground" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56 p-2", children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-normal px-2 py-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: userName }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: userRole })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "rounded-lg cursor-pointer", children: /* @__PURE__ */ jsxs("a", { href: "/profil-admin", className: "flex items-center gap-2 px-2 py-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { children: "Profil Saya" })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => setShowLogoutConfirm(true),
                className: "rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "LogOut", className: "mr-2 h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Keluar" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      NotificationModal,
      {
        open: showNotifications,
        onOpenChange: handleNotificationClose
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        open: showLogoutConfirm,
        onOpenChange: setShowLogoutConfirm,
        title: "Konfirmasi Keluar",
        description: "Apakah Anda yakin ingin keluar dari sistem?",
        confirmText: "Ya, Keluar",
        cancelText: "Batal",
        icon: "LogOut",
        iconColor: "text-primary",
        isDangerous: false,
        onConfirm: handleLogout
      }
    )
  ] });
}
export {
  AdminHeader as A,
  ConfirmationModal as C
};
