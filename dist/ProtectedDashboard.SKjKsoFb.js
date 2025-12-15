import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { n as notificationApi, S as SafeIcon, B as Button, e as authApi, j as clearCachedProfile, h as removeToken, A as AuthGuard } from "./AuthGuard.Ct_soEsT.js";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Check, Circle, X } from "lucide-react";
import { e as cn } from "./card.CpcqKk8f.js";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        status: "border-transparent cursor-default"
        // No hover effect for status badges
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
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
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
function NotificationModal({ open, onOpenChange }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-600 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-600 border-orange-300";
      default:
        return "bg-accent/10 text-accent-foreground border-accent/30";
    }
  };
  const getIconStyle = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-50 group-hover:bg-red-100";
      case "high":
        return "bg-orange-50 group-hover:bg-orange-100";
      case "medium":
        return "bg-primary/15 group-hover:bg-primary/20";
      default:
        return "bg-secondary group-hover:bg-secondary/70";
    }
  };
  const getIconColor = (priority) => {
    switch (priority) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Notifikasi" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: isLoading ? "Memuat notifikasi..." : `Anda memiliki ${notifications.length} notifikasi` })
    ] }),
    /* @__PURE__ */ jsx(ScrollArea, { className: "h-[500px] pr-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : notifications.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-12 w-12 mx-auto mb-2 opacity-50" }),
      /* @__PURE__ */ jsx("p", { children: "Tidak ada notifikasi" })
    ] }) : notifications.map((notification, index) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => handleNotificationClick(notification),
          className: "flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/5 active:bg-primary/10 transition-colors duration-200 group",
          children: [
            /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconStyle(notification.priority)} transition-colors duration-200`, children: /* @__PURE__ */ jsx(
              SafeIcon,
              {
                name: notification.icon,
                className: `h-5 w-5 ${getIconColor(notification.priority)}`
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-none text-foreground", children: notification.title }),
                (notification.priority === "critical" || notification.priority === "high") && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `shrink-0 text-xs ${getPriorityStyle(notification.priority)}`, children: notification.priority === "critical" ? "Kritis!" : "Penting" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-snug", children: notification.message }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70", children: notification.time })
            ] })
          ]
        }
      ),
      index < notifications.length - 1 && /* @__PURE__ */ jsx(Separator, { className: "my-2" })
    ] }, notification.id)) }) }),
    /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full mt-4 text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-300 ease-out", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "/riwayat-aktivitas", children: [
      "Lihat Semua Aktivitas",
      /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowRight", className: "ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })
    ] }) })
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
        const { notificationApi: notificationApi2 } = await import("./AuthGuard.Ct_soEsT.js").then((n) => n.k);
        const notifData = await notificationApi2.getNotifications(20);
        setNotificationCount(notifData.unread_count);
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
  };
  const handleNotificationClose = async (open) => {
    setShowNotifications(open);
    if (!open) {
      try {
        const { notificationApi: notificationApi2 } = await import("./AuthGuard.Ct_soEsT.js").then((n) => n.k);
        const notifData = await notificationApi2.getNotifications(20);
        setNotificationCount(notifData.unread_count);
      } catch (err) {
        console.error("Failed to refresh notifications:", err);
      }
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all duration-300", id: "ijli", children: /* @__PURE__ */ jsxs("div", { className: "w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-6 w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-foreground", children: "SIM4LON" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "lg",
            className: "relative hover:bg-primary/10 transition-colors",
            onClick: handleNotificationOpen,
            "aria-label": "Notifikasi",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-6 w-6" }),
              notificationCount > 0 && /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: "destructive",
                  className: "absolute -right-1 -top-1 h-6 w-6 rounded-full p-0 text-xs flex items-center justify-center font-bold",
                  children: notificationCount
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "flex items-center gap-2 px-2", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: userName || "User" }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground", children: userName ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : ".." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "hidden md:block text-left min-w-[80px]", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: userName || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Loading..." }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: userRole || "" })
            ] }),
            /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "h-4 w-4 hidden md:block" })
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Akun Saya" }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "/profil-admin", className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Profil" })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => setShowLogoutConfirm(true), className: "cursor-pointer text-destructive", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "LogOut", className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Keluar" })
            ] })
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
function ProtectedDashboard({ children, allowedRoles }) {
  return /* @__PURE__ */ jsx(AuthGuard, { allowedRoles, children });
}
export {
  AdminHeader as A,
  Badge as B,
  ConfirmationModal as C,
  Dialog as D,
  ProtectedDashboard as P,
  Separator as S,
  DialogContent as a,
  DialogHeader as b,
  DialogTitle as c,
  DialogDescription as d,
  DropdownMenu as e,
  DropdownMenuTrigger as f,
  DropdownMenuContent as g,
  DropdownMenuItem as h,
  DialogTrigger as i,
  Avatar as j,
  AvatarFallback as k,
  AvatarImage as l
};
