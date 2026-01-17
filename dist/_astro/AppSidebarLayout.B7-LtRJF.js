import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { p as Sidebar, q as SidebarContent, r as SidebarGroup, s as SidebarGroupLabel, t as SidebarGroupContent, u as SidebarMenu, v as SidebarMenuItem, F as SidebarMenuButton, B as Badge, A as Avatar, l as AvatarFallback, C as SidebarProvider, E as SidebarInset } from "./ProtectedDashboard.DfQvqnI6.js";
import { useState, useEffect, useRef, useCallback } from "react";
import { k as companyProfileApi, S as SafeIcon, d as driversApi, B as Button } from "./AuthGuard.D1AOouTt.js";
import { f as formatCurrency, A as AdminHeader } from "./currency.DfSI0ciS.js";
import { toast } from "sonner";
import { Q as QueryProvider, C as ConfirmDialogProvider } from "./AdminFooter.Bk6ZJpjf.js";
const PROFILE_CACHE_KEY = "sim4lon_user_profile";
const menuGroups = [
  {
    label: "Menu Utama",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      { name: "Pesanan", href: "/daftar-pesanan", icon: "ShoppingCart" },
      { name: "Stok LPG", href: "/stok-lpg", icon: "Package" },
      { name: "Laporan", href: "/laporan", icon: "BarChart3", adminOnly: true }
    ]
  },
  {
    label: "Operasional",
    // Operator can access stock-related items (Penerimaan, Penyaluran, In/Out)
    items: [
      { name: "Perencanaan", href: "/perencanaan", icon: "CalendarDays", adminOnly: true },
      { name: "Penyaluran", href: "/penyaluran", icon: "Send" },
      { name: "Penerimaan", href: "/penerimaan", icon: "PackageCheck" },
      { name: "In / Out Agen", href: "/in-out-agen", icon: "RefreshCw" }
    ]
  },
  {
    label: "Manajemen",
    adminOnly: true,
    // Entire group is admin-only
    items: [
      { name: "Pangkalan", href: "/daftar-pangkalan", icon: "Store" },
      { name: "Pengguna", href: "/daftar-pengguna", icon: "Users" },
      { name: "Supir", href: "/daftar-driver", icon: "Truck" }
    ]
  },
  {
    label: "Sistem",
    adminOnly: true,
    // Entire group is admin-only
    items: [
      { name: "Log Aktivitas", href: "/riwayat-aktivitas", icon: "History" },
      { name: "Pengaturan", href: "/pengaturan", icon: "Settings" }
    ]
  }
];
function getUserRole() {
  if (typeof window === "undefined") return "OPERATOR";
  try {
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY);
    if (cached) {
      const profile = JSON.parse(cached);
      return profile.role || "OPERATOR";
    }
  } catch {
  }
  return "OPERATOR";
}
function getVisibleMenuGroups(role) {
  if (role === "ADMIN") {
    return menuGroups;
  }
  return menuGroups.filter((group) => !group.adminOnly).map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly)
  })).filter((group) => group.items.length > 0);
}
function AdminSidebar() {
  const [activePage, setActivePage] = useState("");
  const [userRole, setUserRole] = useState("ADMIN");
  const [isHydrated, setIsHydrated] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const normalizeForComparison = (path) => {
    return path.replace(/^\.\//, "").replace(/^\//, "").replace(/\/$/, "").replace(/\.html$/, "");
  };
  const subPageMapping = {
    "daftar-pesanan": ["buat-pesanan", "detail-pesanan", "catat-pembayaran", "nota-pembayaran"],
    "daftar-pangkalan": ["detail-edit-pangkalan"],
    "daftar-pengguna": ["tambah-pengguna"],
    "dashboard": []
  };
  const getActiveMenu = (currentPath) => {
    for (const [parent, subPages] of Object.entries(subPageMapping)) {
      if (subPages.some((sub) => currentPath.includes(sub))) {
        return parent;
      }
    }
    return currentPath;
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const normalizedCurrentPath = normalizeForComparison(currentPath);
      const activeMenuPath = getActiveMenu(normalizedCurrentPath);
      setActivePage(activeMenuPath);
      const role = getUserRole();
      setUserRole(role);
      setIsHydrated(true);
      companyProfileApi.get().then((profile) => setCompanyName(profile.company_name || "")).catch(() => setCompanyName(""));
    }
  }, []);
  const visibleGroups = getVisibleMenuGroups(userRole);
  return /* @__PURE__ */ jsx(
    Sidebar,
    {
      className: "top-[--header-height] h-[calc(100vh-var(--header-height))]",
      variant: "inset",
      children: /* @__PURE__ */ jsxs(
        SidebarContent,
        {
          className: "px-2 py-2 sidebar-scrollbar-modern",
          style: {
            background: "linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--sidebar-background)/0.97) 50%, hsl(var(--sidebar-accent)/0.3) 100%)"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" }) }),
              /* @__PURE__ */ jsx("div", { className: "py-2 flex justify-center", children: companyName ? /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold text-center tracking-wide text-gray-500/70", children: companyName }) : /* @__PURE__ */ jsx("div", { className: "h-3 w-32 bg-muted rounded animate-pulse" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" }) })
            ] }),
            visibleGroups.map((group, groupIndex) => /* @__PURE__ */ jsxs(SidebarGroup, { className: "py-0", children: [
              /* @__PURE__ */ jsxs(
                SidebarGroupLabel,
                {
                  className: "text-[9px] font-bold uppercase tracking-[0.12em] text-sidebar-foreground/50 px-3 mb-1 flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-border to-transparent" }),
                    /* @__PURE__ */ jsx("span", { children: group.label }),
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-border to-transparent" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { className: "gap-0.4 px-1", children: group.items.map((item, itemIndex) => {
                const normalizedItemHref = normalizeForComparison(item.href);
                const isActive = normalizedItemHref === activePage;
                return /* @__PURE__ */ jsx(
                  SidebarMenuItem,
                  {
                    children: /* @__PURE__ */ jsx(
                      SidebarMenuButton,
                      {
                        asChild: true,
                        isActive,
                        className: `
                          relative overflow-hidden rounded-xl transition-all duration-300 ease-out
                          ${isActive ? "bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white shadow-lg shadow-primary/30" : "hover:bg-sidebar-accent/50 hover:translate-x-1 active:bg-primary/20"}
                        `,
                        children: /* @__PURE__ */ jsxs("a", { href: item.href, className: "flex items-center gap-2 w-full px-3 py-2 group", children: [
                          /* @__PURE__ */ jsx("div", { className: `
                            p-1 rounded-md transition-all duration-300
                            ${isActive ? "bg-white/20" : "bg-sidebar-accent/50 group-hover:bg-primary/10 group-hover:scale-110"}
                          `, children: /* @__PURE__ */ jsx(
                            SafeIcon,
                            {
                              name: item.icon,
                              className: `h-3.5 w-3.5 transition-transform duration-300 ${isActive ? "text-white" : "text-sidebar-foreground/70 group-hover:text-primary"}`
                            }
                          ) }),
                          /* @__PURE__ */ jsx("span", { className: `text-[13px] font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-sidebar-foreground/80 group-hover:text-sidebar-foreground"}`, children: item.name }),
                          isActive && /* @__PURE__ */ jsx("div", { className: "absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" })
                        ] })
                      }
                    )
                  },
                  item.name
                );
              }) }) })
            ] }, group.label)),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-2 px-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
              /* @__PURE__ */ jsx("p", { className: "text-[14px] text-center text-muted-foreground/40 mt-2 font-medium", children: "SIM4LON v1.5" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-center text-muted-foreground/40 font-normal", children: "by Luthfi" })
            ] })
          ]
        }
      )
    }
  );
}
function useSpeechRecognition(options = {}) {
  const {
    onSpeechEnd,
    silenceTimeout = 2e3,
    // 2 seconds of silence to auto-stop
    autoStop = true
  } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());
  const transcriptRef = useRef("");
  const isSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);
  const resetSilenceTimer = useCallback(() => {
    if (!autoStop || silenceTimeout <= 0) return;
    clearSilenceTimer();
    lastSpeechTimeRef.current = Date.now();
    silenceTimerRef.current = setTimeout(() => {
      console.log("[SpeechRecognition] Silence timeout - auto-stopping...");
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, silenceTimeout);
  }, [autoStop, silenceTimeout, clearSilenceTimer]);
  const hasSpeechStartedRef = useRef(false);
  useEffect(() => {
    if (!isSupported) return;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      hasSpeechStartedRef.current = false;
      console.log("[SpeechRecognition] Started listening...");
    };
    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text;
          setConfidence(result[0].confidence);
        } else {
          interim += text;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => {
          const newTranscript = prev + finalTranscript;
          transcriptRef.current = newTranscript;
          return newTranscript;
        });
      }
      setInterimTranscript(interim);
      if (finalTranscript || interim) {
        if (!hasSpeechStartedRef.current) {
          hasSpeechStartedRef.current = true;
          console.log("[SpeechRecognition] First speech detected, starting silence timer");
        }
        resetSilenceTimer();
      }
    };
    recognition.onspeechend = () => {
      console.log("[SpeechRecognition] Speech ended - user stopped speaking");
    };
    recognition.onerror = (event) => {
      console.error("[SpeechRecognition] Error:", event.error);
      clearSilenceTimer();
      let errorMessage = "Terjadi kesalahan";
      switch (event.error) {
        case "not-allowed":
        case "permission-denied":
          errorMessage = "Izin mikrofon ditolak. Silakan aktifkan di pengaturan browser.";
          break;
        case "no-speech":
          errorMessage = "Tidak ada suara terdeteksi. Silakan coba lagi.";
          break;
        case "network":
          errorMessage = "Koneksi internet diperlukan untuk speech recognition.";
          break;
        case "aborted":
          errorMessage = "Speech recognition dibatalkan.";
          break;
        case "audio-capture":
          errorMessage = "Mikrofon tidak ditemukan atau tidak bisa diakses.";
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      setError(errorMessage);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
      console.log("[SpeechRecognition] Stopped listening");
      if (onSpeechEnd && transcriptRef.current) {
        console.log("[SpeechRecognition] Calling onSpeechEnd with:", transcriptRef.current);
        onSpeechEnd(transcriptRef.current);
      }
    };
    recognitionRef.current = recognition;
    return () => {
      clearSilenceTimer();
      recognition.abort();
    };
  }, [isSupported, autoStop, silenceTimeout, resetSilenceTimer, clearSilenceTimer, onSpeechEnd]);
  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      setError("Browser tidak mendukung Speech Recognition");
      return;
    }
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    setConfidence(0);
    transcriptRef.current = "";
    try {
      console.log("[SpeechRecognition] Requesting microphone permission...");
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((d) => d.kind === "audioinput");
      console.log("[SpeechRecognition] Available audio inputs:", audioInputs.map((d) => d.label || d.deviceId));
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log("[SpeechRecognition] Microphone permission granted!");
      console.log("[SpeechRecognition] Active track:", stream.getAudioTracks()[0]?.label);
      await new Promise((resolve) => setTimeout(resolve, 100));
      stream.getTracks().forEach((track) => track.stop());
    } catch (permError) {
      console.error("[SpeechRecognition] Microphone permission denied:", permError);
      setError("Izin mikrofon ditolak. Silakan aktifkan di pengaturan browser.");
      return;
    }
    try {
      console.log("[SpeechRecognition] Starting recognition...");
      recognitionRef.current.start();
    } catch (err) {
      console.warn("[SpeechRecognition] Already listening");
    }
  }, []);
  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [clearSilenceTimer]);
  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setConfidence(0);
    transcriptRef.current = "";
  }, []);
  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    confidence,
    startListening,
    stopListening,
    resetTranscript
  };
}
const API_BASE_URL = "http://localhost:3000/api";
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sim4lon_token");
}
async function parseVoiceCommand(text) {
  const token = getToken();
  if (!token) {
    throw new Error("Tidak terautentikasi");
  }
  const response = await fetch(`${API_BASE_URL}/gemini/parse-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Gagal parsing perintah suara");
  }
  return response.json();
}
async function createOrder(data) {
  const token = getToken();
  if (!token) {
    throw new Error("Tidak terautentikasi");
  }
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Gagal membuat pesanan");
  }
  return response.json();
}
function useVoiceOrder() {
  const [status, setStatus] = useState("idle");
  const [parseResult, setParseResult] = useState(null);
  const [error, setError] = useState(null);
  const [missingInfo, setMissingInfo] = useState(null);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState(null);
  const [lastCreatedOrderCode, setLastCreatedOrderCode] = useState(null);
  const [missingInfoPrompt, setMissingInfoPrompt] = useState(null);
  const handleSpeechEnd = useCallback(async (finalTranscript) => {
    console.log("[useVoiceOrder] Speech ended, auto-parsing:", finalTranscript);
    if (!finalTranscript.trim()) {
      setError("Tidak ada suara terdeteksi");
      setStatus("error");
      return;
    }
    setStatus("parsing");
    try {
      toast.loading("Memproses perintah suara...", { id: "voice-parse" });
      const result = await parseVoiceCommand(finalTranscript);
      if (result.success && result.items.length > 0) {
        if (result.validation && !result.validation.isValid) {
          setParseResult(result);
          setError(result.error || "Validasi gagal");
          setStatus("error");
          toast.error(result.error || "Validasi gagal", { id: "voice-parse" });
        } else {
          setParseResult(result);
          setStatus("confirming");
          toast.success("Perintah berhasil dipahami!", { id: "voice-parse" });
        }
      } else {
        setError(result.error || "Tidak dapat memahami perintah");
        setStatus("error");
        toast.error(result.error || "Tidak dapat memahami perintah", { id: "voice-parse" });
      }
    } catch (err) {
      setError(err.message || "Gagal memproses perintah");
      setStatus("error");
      toast.error(err.message || "Gagal memproses perintah", { id: "voice-parse" });
    }
  }, []);
  const {
    transcript,
    interimTranscript,
    // Real-time interim result
    isSupported,
    startListening: startSpeech,
    stopListening: stopSpeech,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition({
    onSpeechEnd: handleSpeechEnd,
    silenceTimeout: 2e3,
    // 4 seconds of silence = auto stop
    autoStop: true
  });
  const liveTranscript = transcript + (interimTranscript ? interimTranscript : "");
  const startListening = useCallback(() => {
    setStatus("listening");
    setError(null);
    setParseResult(null);
    setMissingInfo(null);
    setMissingInfoPrompt(null);
    resetTranscript();
    startSpeech();
  }, [startSpeech, resetTranscript]);
  const validateParseResult = useCallback((result) => {
    if (!result.pangkalanId) {
      return {
        valid: false,
        missing: "pangkalan",
        prompt: "🏪 Pangkalan belum disebutkan. Untuk pangkalan mana pesanan ini?"
      };
    }
    if (!result.items || result.items.length === 0) {
      return {
        valid: false,
        missing: "items",
        prompt: "📦 Produk belum terdeteksi. Mau pesan produk LPG yang mana? (3kg, 12kg, 50kg)"
      };
    }
    const invalidQty = result.items.find((item) => item.quantity <= 0);
    if (invalidQty) {
      return {
        valid: false,
        missing: "quantity",
        prompt: `🔢 Jumlah untuk ${invalidQty.productName} belum jelas. Berapa unit yang mau dipesan?`
      };
    }
    return { valid: true };
  }, []);
  const stopAndParse = useCallback(async () => {
    stopSpeech();
    if (!transcript.trim()) {
      setError("Tidak ada suara terdeteksi");
      setStatus("error");
      return;
    }
    setStatus("parsing");
    try {
      toast.loading("Memproses perintah suara...", { id: "voice-parse" });
      const result = await parseVoiceCommand(transcript);
      if (result.success && result.items.length > 0) {
        const validation = validateParseResult(result);
        if (!validation.valid && validation.missing) {
          setParseResult(result);
          setMissingInfo(validation.missing);
          setMissingInfoPrompt(validation.prompt || null);
          setStatus("needsInfo");
          toast.warning(validation.prompt || "Ada informasi yang kurang", { id: "voice-parse" });
        } else {
          setParseResult(result);
          setStatus("confirming");
          toast.success("Perintah berhasil dipahami!", { id: "voice-parse" });
        }
      } else {
        setError(result.error || "Tidak dapat memahami perintah");
        setStatus("error");
        toast.error(result.error || "Tidak dapat memahami perintah", { id: "voice-parse" });
      }
    } catch (err) {
      setError(err.message || "Gagal memproses perintah");
      setStatus("error");
      toast.error(err.message || "Gagal memproses perintah", { id: "voice-parse" });
    }
  }, [stopSpeech, transcript, validateParseResult]);
  const continueWithInfo = useCallback(() => {
    setStatus("listening");
    setMissingInfo(null);
    setMissingInfoPrompt(null);
    resetTranscript();
    startSpeech();
  }, [resetTranscript, startSpeech]);
  const cancel = useCallback(() => {
    stopSpeech();
    resetTranscript();
    setStatus("idle");
    setError(null);
    setParseResult(null);
    setMissingInfo(null);
    setMissingInfoPrompt(null);
  }, [stopSpeech, resetTranscript]);
  const confirmAndCreate = useCallback(async () => {
    if (!parseResult || !parseResult.pangkalanId) {
      return { success: false, error: "Data pesanan tidak lengkap" };
    }
    setStatus("creating");
    try {
      toast.loading("Membuat pesanan...", { id: "voice-create" });
      const orderData = {
        pangkalan_id: parseResult.pangkalanId,
        items: parseResult.items.map((item) => ({
          lpg_type: item.lpgType,
          qty: item.quantity,
          price_per_unit: item.price,
          lpg_product_id: item.productId,
          label: item.productName
        })),
        note: parseResult.note || `[Voice Order] ${parseResult.rawText}`,
        // EXPRESS: Voice order langsung DIPROSES + LUNAS
        is_voice_order: true,
        is_paid_cash: true
      };
      const result = await createOrder(orderData);
      setLastCreatedOrderId(result.id);
      setLastCreatedOrderCode(result.code);
      setStatus("selectingDriver");
      toast.success(`Pesanan ${result.code} berhasil! Pilih supir untuk pengiriman.`, { id: "voice-create" });
      return { success: true, orderId: result.id, orderCode: result.code };
    } catch (err) {
      setError(err.message || "Gagal membuat pesanan");
      setStatus("error");
      toast.error(err.message || "Gagal membuat pesanan", { id: "voice-create" });
      return { success: false, error: err.message };
    }
  }, [parseResult]);
  const assignDriver = useCallback(async (driverId) => {
    if (!lastCreatedOrderId) return false;
    try {
      const token = getToken();
      if (!token) throw new Error("Tidak terautentikasi");
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      await Promise.all([
        // 1. Update order with driver
        fetch(`${API_BASE_URL}/orders/${lastCreatedOrderId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ driver_id: driverId })
        }),
        // 2. Update status to DIKIRIM
        fetch(`${API_BASE_URL}/orders/${lastCreatedOrderId}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            status: "DIKIRIM",
            note: "Supir ditugaskan via voice order"
          })
        })
      ]);
      setStatus("success");
      toast.success("Supir berhasil ditugaskan!");
      setTimeout(() => {
        window.location.href = `/detail-pesanan?code=${lastCreatedOrderCode}`;
      }, 1e3);
      return true;
    } catch (err) {
      toast.error(err.message || "Gagal menugaskan supir");
      return false;
    }
  }, [lastCreatedOrderId, lastCreatedOrderCode]);
  const skipDriverSelection = useCallback(() => {
    setStatus("success");
    toast.info("Pesanan dibuat tanpa supir. Assign supir di halaman detail.");
    setTimeout(() => {
      window.location.href = `/detail-pesanan?code=${lastCreatedOrderCode}`;
    }, 1e3);
  }, [lastCreatedOrderCode]);
  if (speechError && status === "listening") {
    setError(speechError);
    setStatus("error");
  }
  return {
    status,
    isProcessing: ["listening", "parsing", "creating"].includes(status),
    transcript: liveTranscript,
    parseResult,
    error,
    missingInfo,
    missingInfoPrompt,
    isSupported,
    startListening,
    stopAndParse,
    cancel,
    confirmAndCreate,
    continueWithInfo,
    lastCreatedOrderId,
    lastCreatedOrderCode,
    assignDriver,
    skipDriverSelection
  };
}
function FloatingVoiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const {
    status,
    transcript,
    parseResult,
    error,
    missingInfoPrompt,
    isSupported,
    startListening,
    stopAndParse,
    cancel,
    confirmAndCreate,
    continueWithInfo,
    lastCreatedOrderCode,
    assignDriver,
    skipDriverSelection
  } = useVoiceOrder();
  useEffect(() => {
    if ((status === "confirming" || status === "selectingDriver") && drivers.length === 0) {
      setIsLoadingDrivers(true);
      driversApi.getAll(1, 100, void 0, true).then((res) => setDrivers(res.data)).catch(console.error).finally(() => setIsLoadingDrivers(false));
    }
  }, [status]);
  if (!isSupported) return null;
  const handleFloatingClick = () => {
    setIsOpen(true);
    if (status === "idle") startListening();
  };
  const handleClose = () => {
    cancel();
    setIsOpen(false);
  };
  const handleStopAndParse = useCallback(async () => {
    await stopAndParse();
  }, [stopAndParse]);
  const handleConfirm = useCallback(async () => {
    await confirmAndCreate();
  }, [confirmAndCreate]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && isOpen) {
        e.preventDefault();
        if (status === "idle") startListening();
        else if (status === "listening") handleStopAndParse();
        else if (status === "confirming") handleConfirm();
        else if (status === "needsInfo") continueWithInfo();
        else if (status === "error") startListening();
        else if (status === "success") handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, handleStopAndParse, handleConfirm, continueWithInfo, startListening]);
  const totalAmount = parseResult?.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;
  if (!isOpen) {
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleFloatingClick,
        className: "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95",
        title: "Pesan dengan Suara",
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
                status === "idle" && "Pesan dengan Suara",
                status === "listening" && "Mendengarkan...",
                status === "parsing" && "Memproses...",
                status === "needsInfo" && "Info Diperlukan",
                status === "confirming" && "Konfirmasi Pesanan",
                status === "creating" && "Membuat Pesanan...",
                status === "selectingDriver" && "Pilih Supir",
                status === "success" && "Berhasil!",
                status === "error" && "Gagal"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
                status === "listening" && "↵ Enter untuk selesai",
                status === "confirming" && "↵ Enter untuk konfirmasi"
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
                /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 dark:text-blue-400 font-medium mb-1", children: "💡 Contoh perintah:" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: '"Pesan 50 unit 3 kilo ke pangkalan Reon"' })
              ] })
            ] }),
            (status === "parsing" || status === "creating") && /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-16 h-16 mx-auto mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-zinc-600 dark:text-zinc-300", children: status === "parsing" ? "AI menganalisis..." : "Membuat pesanan..." })
            ] }),
            parseResult && status === "confirming" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              transcript && /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500 italic", children: [
                '"',
                transcript,
                '"'
              ] }),
              parseResult.pangkalanName && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "MapPin", className: "h-5 w-5 text-white" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Tujuan" }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900 dark:text-white", children: parseResult.pangkalanName })
                ] })
              ] }),
              parseResult.items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold", children: item.quantity }),
                  /* @__PURE__ */ jsx("span", { className: "text-zinc-900 dark:text-white", children: item.productName })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-900 dark:text-white", children: formatCurrency(item.price * item.quantity) })
              ] }, idx)),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-700", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-600 dark:text-zinc-400", children: "Total" }),
                /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-blue-600", children: formatCurrency(totalAmount) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs font-normal", children: [
                Math.round(parseResult.confidence * 100),
                "% akurat"
              ] }) })
            ] }),
            status === "needsInfo" && missingInfoPrompt && /* @__PURE__ */ jsx("div", { className: "p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20", children: /* @__PURE__ */ jsx("p", { className: "text-amber-800 dark:text-amber-200", children: missingInfoPrompt }) }),
            status === "error" && /* @__PURE__ */ jsxs("div", { className: "py-4 text-center space-y-4", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/images/illustrations/voice-ai.png",
                  alt: "Voice AI",
                  className: "w-24 h-24 object-contain mx-auto opacity-70"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-900/20", children: parseResult?.validation && !parseResult.validation.isValid ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: parseResult.validation.issues.map((issue, i) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: issue.message }),
                issue.suggestion && /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500 mt-1", children: [
                  "💡 ",
                  issue.suggestion
                ] })
              ] }, i)) }) : /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400", children: error }) })
            ] }),
            status === "selectingDriver" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-5 w-5 text-green-600" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-green-600", children: [
                    "Pesanan ",
                    lastCreatedOrderCode,
                    " dibuat!"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Pilih supir untuk pengiriman" })
                ] })
              ] }),
              isLoadingDrivers ? /* @__PURE__ */ jsx("div", { className: "py-4 text-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin mx-auto text-blue-500" }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: drivers.map((driver) => {
                const isBusy = driver.is_busy || false;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => !isBusy && setSelectedDriverId(driver.id),
                    disabled: isBusy,
                    className: `w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                                                        ${selectedDriverId === driver.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : isBusy ? "opacity-50 cursor-not-allowed border-dashed" : "border-zinc-200 dark:border-zinc-700 hover:border-blue-300"}`,
                    children: [
                      /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsx(AvatarFallback, { className: isBusy ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600", children: driver.name.charAt(0) }) }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsx("p", { className: "font-medium text-sm truncate", children: driver.name }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: isBusy ? "Sedang mengantar" : driver.vehicle_id || "Tersedia" })
                      ] }),
                      selectedDriverId === driver.id && /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-blue-500" })
                    ]
                  },
                  driver.id
                );
              }) })
            ] }),
            status === "success" && /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-8 w-8 text-white" }) }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-green-600", children: "Pesanan Berhasil!" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 mt-1", children: "Mengalihkan..." })
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
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleClose, className: "flex-1 rounded-xl h-11 cursor-pointer", children: "Batal" }),
              /* @__PURE__ */ jsxs(Button, { onClick: handleStopAndParse, className: "flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "StopCircle", className: "h-4 w-4" }),
                "Selesai"
              ] })
            ] }),
            status === "needsInfo" && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleClose, className: "flex-1 rounded-xl h-11", children: "Batal" }),
              /* @__PURE__ */ jsxs(Button, { onClick: continueWithInfo, className: "flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Mic", className: "h-4 w-4" }),
                "Lanjut"
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
              /* @__PURE__ */ jsxs(Button, { onClick: handleConfirm, className: "flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4" }),
                "Konfirmasi"
              ] })
            ] }),
            status === "selectingDriver" && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: skipDriverSelection, className: "flex-1 rounded-xl h-11", children: "Lewati" }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => selectedDriverId && assignDriver(selectedDriverId),
                  disabled: !selectedDriverId,
                  className: "flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50",
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-4 w-4" }),
                    "Tugaskan"
                  ]
                }
              )
            ] }),
            (status === "parsing" || status === "creating") && /* @__PURE__ */ jsxs(Button, { disabled: true, className: "w-full rounded-xl h-11 gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }),
              "Memproses..."
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function AppSidebarLayout({
  children,
  headerHeight = "64px"
}) {
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(ConfirmDialogProvider, { children: /* @__PURE__ */ jsxs(
    SidebarProvider,
    {
      style: {
        "--header-height": headerHeight
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen w-full", children: [
          /* @__PURE__ */ jsx(AdminHeader, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 w-full", children: [
            /* @__PURE__ */ jsx(AdminSidebar, {}),
            /* @__PURE__ */ jsx(SidebarInset, { className: "flex flex-col flex-1", children })
          ] })
        ] }),
        /* @__PURE__ */ jsx(FloatingVoiceWidget, {})
      ]
    }
  ) }) });
}
export {
  AppSidebarLayout as A
};
