import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import { g as Sidebar, h as SidebarContent, i as SidebarGroup, j as SidebarGroupLabel, k as SidebarGroupContent, l as SidebarMenu, m as SidebarMenuItem, n as SidebarFooter, D as DropdownMenu, a as DropdownMenuTrigger, A as Avatar, f as AvatarImage, e as AvatarFallback, b as DropdownMenuContent, o as DropdownMenuLabel, p as DropdownMenuSeparator, c as DropdownMenuItem, u as useSidebar, B as Badge, q as SidebarProvider, r as SidebarInset } from "./ProtectedDashboard.BvmhzLG-.js";
import { S as SafeIcon, B as Button, e as authApi, j as clearCachedProfile, t as consumersApi, m as consumerOrdersApi } from "./AuthGuard.Cq_0lvUi.js";
import { toast } from "sonner";
import { Q as QueryProvider } from "./AdminFooter.DZN9FgHo.js";
const menuItems = [
  {
    name: "Dashboard",
    href: "/pangkalan/dashboard",
    icon: "LayoutDashboard"
  },
  {
    name: "Penjualan",
    href: "/pangkalan/penjualan",
    icon: "ShoppingBag"
  },
  {
    name: "Stok LPG",
    href: "/pangkalan/stok",
    icon: "Package"
  },
  {
    name: "Konsumen",
    href: "/pangkalan/konsumen",
    icon: "Users"
  },
  {
    name: "Pengeluaran",
    href: "/pangkalan/pengeluaran",
    icon: "Wallet"
  },
  {
    name: "Laporan",
    href: "/pangkalan/laporan",
    icon: "FileText"
  }
];
function PangkalanSidebar() {
  const [activePage, setActivePage] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePage(window.location.pathname);
    }
  }, []);
  const isActive = (href) => {
    if (activePage === href) return true;
    if (href === "/pangkalan/penjualan") {
      return activePage === "/pangkalan/penjualan";
    }
    return false;
  };
  return /* @__PURE__ */ jsxs(Sidebar, { className: "border-r bg-white dark:bg-slate-950", children: [
    /* @__PURE__ */ jsx(SidebarContent, { className: "pt-4 sidebar-scrollbar-modern", children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2", children: "Menu" }),
      /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { className: "space-y-1 px-2", children: menuItems.map((item) => {
        const active = isActive(item.href);
        return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.href,
            className: `flex items-center gap-3 px-3 h-11 rounded-lg transition-colors ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-950"}`,
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: item.icon, className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.name })
            ]
          }
        ) }, item.name);
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(SidebarFooter, { className: "border-t p-4", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400 text-center", children: "SIM4LON Pangkalan" }) })
  ] });
}
function MobileMenuButton() {
  try {
    const { toggleSidebar, openMobile } = useSidebar();
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: toggleSidebar,
        className: "md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl \r\n                           bg-gradient-to-br from-blue-500/10 to-blue-500/5 \r\n                           hover:from-blue-500/20 hover:to-blue-500/10 \r\n                           active:scale-95 transition-all duration-300 \r\n                           border border-blue-500/20 shadow-sm",
        "aria-label": "Toggle menu",
        children: /* @__PURE__ */ jsxs("div", { className: "w-5 h-4 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-blue-600 rounded-full transform transition-all duration-300 origin-left
                                   ${openMobile ? "rotate-45 translate-x-0.5 w-[22px]" : "w-5"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-blue-600 rounded-full transition-all duration-300
                                   ${openMobile ? "opacity-0 translate-x-3" : "w-4 opacity-100"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `block h-0.5 bg-blue-600 rounded-full transform transition-all duration-300 origin-left
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
function PangkalanHeaderSimple() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);
  const handleLogout = () => {
    clearCachedProfile();
    authApi.logout();
  };
  const getInitials = (name) => {
    return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
  };
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 w-full h-14 sm:h-16 border-b bg-white dark:bg-slate-950 shadow-sm backdrop-blur-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex h-full items-center px-3 sm:px-4 gap-2 sm:gap-4", children: [
    /* @__PURE__ */ jsx(MobileMenuButton, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsx("a", { href: "/pangkalan", className: "cursor-pointer hover:opacity-80 transition-opacity duration-200", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/logo-pertamina-2.png",
          alt: "Pertamina",
          className: "h-8 sm:h-10 object-contain transition-all duration-300"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight", children: "SIM4LON" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium truncate max-w-[120px] sm:max-w-[200px]", children: profile?.pangkalans?.name || "Pangkalan" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1" }),
    /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "relative h-10 w-10 rounded-full", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-10 w-10 border-2 border-blue-100", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: profile?.avatar_url || void 0, alt: profile?.name }),
        /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-100 text-blue-700 font-semibold", children: profile ? getInitials(profile.name) : "P" })
      ] }) }) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent, { className: "w-56", align: "end", forceMount: true, children: [
        /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: profile?.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: profile?.email })
        ] }) }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "/pangkalan/profil", className: "cursor-pointer", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "mr-2 h-4 w-4" }),
          "Profil"
        ] }) }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleLogout, className: "text-red-600 cursor-pointer", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "LogOut", className: "mr-2 h-4 w-4" }),
          "Keluar"
        ] })
      ] })
    ] })
  ] }) });
}
const LPG_PRICES = {
  "3kg": 18e3,
  "5kg": 85e3,
  "12kg": 185e3,
  "50kg": 65e4
};
const LPG_LABELS = {
  "3kg": "LPG 3 kg",
  "5kg": "LPG 5 kg",
  "12kg": "LPG 12 kg",
  "50kg": "LPG 50 kg"
};
function fuzzyMatch(text, target) {
  const t = text.toLowerCase().trim();
  const tar = target.toLowerCase().trim();
  if (t === tar) return 1;
  if (tar.includes(t) || t.includes(tar)) return 0.8;
  const tWords = t.split(/\s+/);
  const tarWords = tar.split(/\s+/);
  let matchedWords = 0;
  for (const tw of tWords) {
    if (tarWords.some((tarW) => tarW.includes(tw) || tw.includes(tarW))) {
      matchedWords++;
    }
  }
  if (tWords.length > 0) {
    return matchedWords / tWords.length * 0.6;
  }
  return 0;
}
const HONORIFICS = ["pak", "bu", "bapak", "ibu", "mas", "mbak", "bang", "kak", "om", "tante", "oom"];
function stripHonorifics(name) {
  let cleaned = name.trim();
  const lower = cleaned.toLowerCase();
  for (const h of HONORIFICS) {
    if (lower.startsWith(h + " ")) {
      cleaned = cleaned.slice(h.length + 1).trim();
      break;
    }
  }
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}
function FloatingVoiceWidgetPangkalan() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [parsedSale, setParsedSale] = useState(null);
  const [error, setError] = useState("");
  const [consumers, setConsumers] = useState([]);
  const [isLoadingConsumers, setIsLoadingConsumers] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());
  const isSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  useEffect(() => {
    if (isOpen && consumers.length === 0) {
      fetchConsumers();
    }
  }, [isOpen]);
  const fetchConsumers = async () => {
    setIsLoadingConsumers(true);
    try {
      const result = await consumersApi.getAll(1, 100);
      setConsumers(result.data);
    } catch (err) {
      console.error("Failed to fetch consumers:", err);
    } finally {
      setIsLoadingConsumers(false);
    }
  };
  useEffect(() => {
    if (!isSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + " " + finalTranscript);
        lastSpeechTimeRef.current = Date.now();
      }
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        setError("Gagal mendengar. Coba lagi.");
        setStatus("error");
      }
    };
    recognition.onend = () => {
      if (status === "listening") {
        try {
          recognition.start();
        } catch (e) {
        }
      }
    };
    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch (e) {
      }
      if (silenceTimeoutRef.current) {
        clearInterval(silenceTimeoutRef.current);
      }
    };
  }, [isSupported]);
  const startListening = useCallback(() => {
    setStatus("listening");
    setTranscript("");
    setError("");
    setParsedSale(null);
    lastSpeechTimeRef.current = Date.now();
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
    }
    silenceTimeoutRef.current = setInterval(() => {
      const now = Date.now();
      const silenceDuration = now - lastSpeechTimeRef.current;
      if (silenceDuration >= 4e3) {
        if (silenceTimeoutRef.current) {
          clearInterval(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        setTranscript((prev) => {
          if (prev.trim()) {
            setTimeout(() => {
              try {
                recognitionRef.current?.stop();
              } catch (e) {
              }
              setStatus("processing");
            }, 100);
          }
          return prev;
        });
      }
    }, 500);
  }, []);
  const stopAndParse = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearInterval(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch (e) {
    }
    setStatus("processing");
    setTimeout(() => {
      const result = parseTranscript(transcript.trim());
      if (result) {
        setParsedSale(result);
        setStatus("confirming");
      } else {
        setError('Tidak bisa memahami. Coba: "Jual 10 tabung ke Warung Berkah"');
        setStatus("error");
      }
    }, 500);
  }, [transcript, consumers]);
  const parseTranscript = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    const qtyMatch = lower.match(/(\d+)\s*(tabung|unit|buah)?/);
    const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 0;
    if (quantity <= 0) return null;
    let lpgType = "3kg";
    if (lower.includes("12") || lower.includes("dua belas")) {
      lpgType = "12kg";
    } else if (lower.includes("50") || lower.includes("lima puluh")) {
      lpgType = "50kg";
    } else if (lower.includes("5 kg") || lower.includes("lima kilo")) {
      lpgType = "5kg";
    }
    let rawName = "";
    const namePatterns = [
      /(?:ke|untuk|buat)\s+(.+?)(?:\s+(?:\d+|tabung|unit)|\s*$)/i,
      /(?:pak|bu|bapak|ibu|mas|mbak|warung|toko)\s+([a-zA-Z\s]+)/i
    ];
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        rawName = match[1].trim();
        break;
      }
    }
    const isRandom = /random|umum|tidak (tau|tahu)|acak|langsung/.test(lower);
    let matchedConsumer = null;
    let consumerName = "Konsumen Umum";
    let consumerId = null;
    let isNewConsumer = false;
    if (isRandom) {
      consumerName = "Konsumen Umum";
      isNewConsumer = false;
    } else if (rawName) {
      let bestMatch = null;
      let bestScore = 0;
      for (const consumer of consumers) {
        const score = fuzzyMatch(rawName, consumer.name);
        if (score > bestScore && score >= 0.5) {
          bestScore = score;
          bestMatch = consumer;
        }
      }
      if (bestMatch) {
        matchedConsumer = bestMatch;
        consumerName = bestMatch.name;
        consumerId = bestMatch.id;
        isNewConsumer = false;
      } else {
        consumerName = stripHonorifics(rawName);
        if (!consumerName || consumerName.length < 2) {
          consumerName = "Konsumen Umum";
          isNewConsumer = false;
        } else {
          isNewConsumer = true;
        }
      }
    }
    return {
      consumerId,
      consumerName,
      consumerMatch: matchedConsumer,
      isNewConsumer,
      quantity,
      lpgType,
      productLabel: LPG_LABELS[lpgType],
      pricePerUnit: LPG_PRICES[lpgType]
    };
  };
  const confirmAndSave = useCallback(async () => {
    if (!parsedSale) return;
    setStatus("saving");
    try {
      await consumerOrdersApi.create({
        consumer_id: parsedSale.consumerId || void 0,
        consumer_name: parsedSale.consumerId ? void 0 : parsedSale.consumerName,
        lpg_type: parsedSale.lpgType,
        qty: parsedSale.quantity,
        price_per_unit: parsedSale.pricePerUnit,
        payment_status: "LUNAS"
      });
      setStatus("success");
      toast.success(`Penjualan ${parsedSale.quantity} ${parsedSale.productLabel} ke ${parsedSale.consumerName} dicatat!`);
      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message || "Gagal menyimpan penjualan");
      setStatus("error");
    }
  }, [parsedSale]);
  const cancel = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearInterval(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch (e) {
    }
    setStatus("idle");
    setTranscript("");
    setParsedSale(null);
    setError("");
  }, []);
  const handleFloatingClick = () => {
    setIsOpen(true);
    if (status === "idle") startListening();
  };
  const handleClose = () => {
    cancel();
    setIsOpen(false);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && isOpen) {
        e.preventDefault();
        if (status === "idle") startListening();
        else if (status === "listening") stopAndParse();
        else if (status === "confirming") confirmAndSave();
        else if (status === "error") startListening();
        else if (status === "success") handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, stopAndParse, confirmAndSave, startListening]);
  if (!isSupported) return null;
  const totalAmount = parsedSale ? parsedSale.quantity * parsedSale.pricePerUnit : 0;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };
  if (!isOpen) {
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleFloatingClick,
        className: "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95",
        title: "Catat Penjualan dengan Suara",
        children: /* @__PURE__ */ jsx(SafeIcon, { name: "Mic", className: "h-6 w-6 text-white" })
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", onClick: handleClose }),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", onClick: handleClose, children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h2", { className: "font-semibold text-zinc-900 dark:text-white", children: [
                status === "idle" && "Catat Penjualan",
                status === "listening" && "Mendengarkan...",
                status === "processing" && "AI Memproses...",
                status === "confirming" && "Konfirmasi Penjualan",
                status === "saving" && "Menyimpan...",
                status === "success" && "Berhasil!",
                status === "error" && "Gagal"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
                status === "listening" && "↵ Enter untuk selesai",
                status === "confirming" && "↵ Enter untuk konfirmasi",
                isLoadingConsumers && "Memuat data konsumen..."
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleClose,
                className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4 text-zinc-400" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 max-h-[60vh] overflow-y-auto", children: [
            status === "listening" && /* @__PURE__ */ jsxs("div", { className: "text-center py-6 space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-28 h-28 mx-auto", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900 animate-ping opacity-50" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-4 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-ping opacity-40", style: { animationDelay: "0.2s" } }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-8 rounded-full border-4 border-blue-300 dark:border-blue-700 animate-ping opacity-30", style: { animationDelay: "0.4s" } }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Mic", className: "h-7 w-7 text-white" }) }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "min-h-[50px] px-4", children: /* @__PURE__ */ jsx("p", { className: `text-lg ${transcript ? "text-zinc-900 dark:text-white" : "text-zinc-400 italic"}`, children: transcript || "Bicara sekarang..." }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 dark:text-blue-400 font-medium mb-1", children: "💡 Contoh:" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: '"Jual 10 tabung ke Warung Berkah"' }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-400 mt-1", children: '"Jual 3 tabung ke orang random"' })
              ] })
            ] }),
            (status === "processing" || status === "saving") && /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-16 h-16 mx-auto mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-zinc-600 dark:text-zinc-300", children: status === "processing" ? "AI mencocokkan konsumen..." : "Menyimpan penjualan..." })
            ] }),
            parsedSale && status === "confirming" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              transcript && /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500 italic", children: [
                '"',
                transcript.trim(),
                '"'
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: parsedSale.consumerMatch ? "UserCheck" : "User", className: "h-5 w-5 text-white" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Konsumen" }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900 dark:text-white", children: parsedSale.consumerName })
                ] }),
                parsedSale.consumerMatch ? /* @__PURE__ */ jsxs(Badge, { className: "bg-green-100 text-green-700 border-0", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-3 w-3 mr-1" }),
                  "Terdaftar"
                ] }) : parsedSale.isNewConsumer ? /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "UserPlus", className: "h-3 w-3 mr-1" }),
                  "Baru"
                ] }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Umum" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-lg font-bold text-emerald-600", children: parsedSale.quantity }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-zinc-900 dark:text-white", children: parsedSale.productLabel }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
                    "@ ",
                    formatCurrency(parsedSale.pricePerUnit)
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-600 dark:text-zinc-400", children: "Total" }),
                /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-blue-600", children: formatCurrency(totalAmount) })
              ] })
            ] }),
            status === "error" && /* @__PURE__ */ jsx("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-900/20", children: /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400", children: error }) }),
            status === "success" && /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-8 w-8 text-white" }) }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-green-600", children: "Penjualan Dicatat!" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-t border-zinc-100 dark:border-zinc-800", children: [
            (status === "idle" || status === "error") && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleClose, className: "flex-1 rounded-xl h-11", children: "Batal" }),
              /* @__PURE__ */ jsxs(Button, { onClick: startListening, className: "flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Mic", className: "h-4 w-4" }),
                "Mulai"
              ] })
            ] }),
            status === "listening" && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleClose, className: "flex-1 rounded-xl h-11", children: "Batal" }),
              /* @__PURE__ */ jsxs(Button, { onClick: stopAndParse, className: "flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "StopCircle", className: "h-4 w-4" }),
                "Selesai"
              ] })
            ] }),
            status === "confirming" && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => {
                cancel();
                startListening();
              }, className: "flex-1 rounded-xl h-11 gap-2", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "RotateCcw", className: "h-4 w-4" }),
                "Ulangi"
              ] }),
              /* @__PURE__ */ jsxs(Button, { onClick: confirmAndSave, className: "flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4" }),
                "Simpan"
              ] })
            ] }),
            (status === "processing" || status === "saving") && /* @__PURE__ */ jsxs(Button, { disabled: true, className: "w-full rounded-xl h-11 gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }),
              "Memproses..."
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function PangkalanSidebarLayout({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    const originalAccent = root.getAttribute("data-accent");
    root.setAttribute("data-accent", "blue");
    const savedTheme = localStorage.getItem("theme");
    root.classList.remove("dark", "light");
    if (savedTheme === "dark") {
      root.classList.add("dark");
    } else if (savedTheme === "light") {
      root.classList.add("light");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
    }
    return () => {
      if (originalAccent) {
        root.setAttribute("data-accent", originalAccent);
      } else {
        root.removeAttribute("data-accent");
      }
    };
  }, []);
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsxs(
    SidebarProvider,
    {
      style: { "--header-height": "64px" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "pangkalan-scale flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50", children: [
          /* @__PURE__ */ jsx(PangkalanHeaderSimple, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 w-full", children: [
            /* @__PURE__ */ jsx(PangkalanSidebar, {}),
            /* @__PURE__ */ jsx(SidebarInset, { className: "flex flex-col flex-1", children: /* @__PURE__ */ jsx("main", { className: "flex-1 p-2 lg:p-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(FloatingVoiceWidgetPangkalan, {})
      ]
    }
  ) });
}
export {
  PangkalanSidebarLayout as P
};
