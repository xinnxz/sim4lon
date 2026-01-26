import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { D as Dialog, a as DialogContent } from "./ProtectedDashboard.igvMWLOj.js";
import { S as SafeIcon, B as Button, f as authApi } from "./AuthGuard.BLl0uVB7.js";
const getPersonalizedMessage = (profile) => {
  const firstName = profile.name.split(" ")[0];
  const hour = (/* @__PURE__ */ new Date()).getHours();
  let timeGreeting = "Selamat Pagi";
  let timeEmoji = "🌅";
  if (hour >= 11 && hour < 15) {
    timeGreeting = "Selamat Siang";
    timeEmoji = "☀️";
  } else if (hour >= 15 && hour < 18) {
    timeGreeting = "Selamat Sore";
    timeEmoji = "🌤️";
  } else if (hour >= 18 || hour < 5) {
    timeGreeting = "Selamat Malam";
    timeEmoji = "🌙";
  }
  switch (profile.role) {
    case "ADMIN":
      return {
        greeting: `${timeEmoji} ${timeGreeting}, Boss ${firstName}!`,
        message: "Dashboard lengkap sudah siap! Waktunya kita gaweee!",
        emoji: "👑",
        color: "from-purple-500 to-indigo-600",
        tip: "Silakan Cek DSS Pak utk insight hari ini!"
      };
    case "OPERATOR":
      return {
        greeting: `${timeEmoji} ${timeGreeting}, ${firstName}!`,
        message: "Yuk, semangat kerja hari ini! Ada pesanan banyak nih!",
        emoji: "💪",
        color: "from-blue-500 to-cyan-600",
        tip: "Quick tip: Gunakan voice order untuk input pesanan lebih cepat!"
      };
    case "PANGKALAN":
      const pangkalanName = profile.pangkalans?.name || "Pangkalan Anda";
      return {
        greeting: `${timeEmoji} ${timeGreeting}, ${firstName}!`,
        message: `Dashboard ${pangkalanName} siap! Pantau stok dan catat penjualan!`,
        emoji: "🏪",
        color: "from-orange-500 to-amber-600",
        tip: "Cek laporan harian untuk monitor keuntungan kamu!"
      };
    default:
      const defaultMessages = [
        {
          greeting: `${timeEmoji} ${timeGreeting}, ${firstName}!`,
          message: "Semoga hari ini lancar dan penuh berkah! 🙏",
          emoji: "✨",
          color: "from-primary to-primary/70",
          tip: "Jangan lupa cek notifikasi untuk update terbaru!"
        },
        {
          greeting: `${timeEmoji} Hai ${firstName}!`,
          message: "Senang melihat Anda kembali! Dashboard sudah fresh! 🎉",
          emoji: "👋",
          color: "from-pink-500 to-rose-600",
          tip: "Klik pada KPI Card untuk melihat detail lebih lanjut!"
        },
        {
          greeting: `${timeEmoji} Welcome back, ${firstName}!`,
          message: "Ayo mulai hari yang produktif! LET'S GO! 🔥",
          emoji: "🚀",
          color: "from-amber-500 to-orange-600",
          tip: "Gunakan filter di daftar pesanan untuk pencarian cepat!"
        }
      ];
      return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
  }
};
function WelcomePopup({ forceShow = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [personalizedMsg, setPersonalizedMsg] = useState(null);
  const hasInitialized = useRef(false);
  const timeoutRef = useRef(null);
  useEffect(() => {
    if (hasInitialized.current && !forceShow) {
      return;
    }
    const hasShownWelcome = sessionStorage.getItem("sim4lon_welcome_shown");
    if (hasShownWelcome && !forceShow) {
      return;
    }
    hasInitialized.current = true;
    sessionStorage.setItem("sim4lon_welcome_shown", "true");
    const showWelcome = async () => {
      try {
        const profileData = await authApi.getProfile();
        setProfile(profileData);
        setPersonalizedMsg(getPersonalizedMessage(profileData));
        timeoutRef.current = setTimeout(() => {
          setIsOpen(true);
        }, 800);
      } catch (error) {
        console.error("Failed to load profile for welcome:", error);
        hasInitialized.current = false;
        sessionStorage.removeItem("sim4lon_welcome_shown");
      }
    };
    showWelcome();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [forceShow]);
  if (!profile || !personalizedMsg) return null;
  const roleDisplay = profile.role === "ADMIN" ? "Administrator" : profile.role === "PANGKALAN" ? "Pangkalan" : "Operator";
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: `relative bg-gradient-to-br ${personalizedMsg.color} p-6 text-white rounded-2xl`, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" }),
    /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4 animate-bounce", children: personalizedMsg.emoji }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: personalizedMsg.greeting }),
    /* @__PURE__ */ jsx("p", { className: "text-white/90 text-lg mb-4", children: personalizedMsg.message }),
    /* @__PURE__ */ jsx("div", { className: "bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Lightbulb", className: "h-5 w-5 text-yellow-300 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-white/95", children: personalizedMsg.tip })
    ] }) }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: () => setIsOpen(false),
        className: "w-full bg-white text-gray-900 hover:bg-white/90 font-semibold py-6 text-lg rounded-xl shadow-lg",
        children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Zap", className: "h-5 w-5 mr-2" }),
          "Mulai Bekerja!"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-white/20 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: profile.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-white/70", children: [
          roleDisplay,
          " • ",
          profile.email
        ] })
      ] })
    ] })
  ] }) }) });
}
export {
  WelcomePopup as W
};
