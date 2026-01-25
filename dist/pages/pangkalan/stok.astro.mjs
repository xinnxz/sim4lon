import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.C7j8yK_x.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.BvgbXP5u.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "../../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, B as Button, I as Input, l as lpgProductsApi, x as agenOrdersApi, f as authApi, s as pangkalanStockApi, v as lpgPricesApi, k as companyProfileApi } from "../../_astro/AuthGuard.71S_I7hh.js";
import { B as Badge, e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, D as Dialog, i as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, o as DialogFooter, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../../_astro/select.B8lpUjZQ.js";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { renderers } from "../../renderers.mjs";
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID").format(value);
};
const LPG_IMAGES$1 = {
  "gr220": "/images/products/bright-gas-220gr.png",
  "kg3": "/images/products/lpg-3kg.png",
  "3kg": "/images/products/lpg-3kg.png",
  "kg5": "/images/products/lpg-5kg.png",
  "5kg": "/images/products/lpg-5kg.png",
  "kg12": "/images/products/lpg-12kg.png",
  "12kg": "/images/products/lpg-12kg.png",
  "kg50": "/images/products/lpg-50kg.png",
  "50kg": "/images/products/lpg-50kg.png"
};
const ProductManagementGrid = ({
  products,
  editedPrices,
  stocks,
  isSaving,
  onAddProduct,
  onDeactivateProduct,
  onUpdatePrice
}) => {
  const activeProducts = products.filter((p) => {
    const edited = editedPrices[p.lpgType];
    return p.isAdded && (edited?.active ?? false);
  });
  const inactiveProducts = products.filter((p) => {
    const edited = editedPrices[p.lpgType];
    return !p.isAdded || !(edited?.active ?? false);
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    activeProducts.length > 0 && /* @__PURE__ */ jsx("section", { className: "space-y-4", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 lg:grid-cols-2", children: activeProducts.map((product) => {
      const lpgType = product.lpgType;
      const edited = editedPrices[lpgType];
      const margin = (edited?.sell || 0) - (edited?.cost || 0);
      const currentStock = stocks.find((s) => s.lpg_type === lpgType);
      const productColor = product.color || "#3B82F6";
      const productImage = LPG_IMAGES$1[lpgType];
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute left-0 top-0 bottom-0 w-1.5",
                style: { backgroundColor: productColor }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "p-5 pl-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  productImage ? /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-white border overflow-hidden p-1", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: productImage,
                      alt: product.name,
                      className: "w-full h-full object-contain"
                    }
                  ) }) : /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                      style: {
                        background: `linear-gradient(135deg, ${productColor}, ${productColor}CC)`
                      },
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-7 w-7 text-white" })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg text-slate-900", children: product.name }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-sm text-slate-500", children: [
                        product.size_kg,
                        " kg"
                      ] }),
                      currentStock && /* @__PURE__ */ jsxs(
                        Badge,
                        {
                          variant: "secondary",
                          className: `text-xs ${currentStock.status === "KRITIS" ? "bg-red-100 text-red-700" : currentStock.status === "RENDAH" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`,
                          children: [
                            "Stok: ",
                            currentStock.qty
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    onClick: () => onDeactivateProduct(lpgType),
                    disabled: isSaving,
                    className: "h-8 w-8 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all",
                    children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500 block mb-1", children: "Harga Beli" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "Rp" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        value: edited?.cost || "",
                        onChange: (e) => onUpdatePrice(lpgType, "cost", Number(e.target.value)),
                        className: "border-0 bg-transparent p-0 h-auto text-lg font-bold text-slate-900 focus-visible:ring-0 w-full"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-xl p-3", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-blue-600 block mb-1", children: "Harga Jual" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-blue-400", children: "Rp" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        value: edited?.sell || "",
                        onChange: (e) => onUpdatePrice(lpgType, "sell", Number(e.target.value)),
                        className: "border-0 bg-transparent p-0 h-auto text-lg font-bold text-blue-700 focus-visible:ring-0 w-full"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-3 ${margin >= 0 ? "bg-green-50" : "bg-red-50"}`, children: [
                  /* @__PURE__ */ jsx("label", { className: `text-xs block mb-1 ${margin >= 0 ? "text-green-600" : "text-red-600"}`, children: "Margin" }),
                  /* @__PURE__ */ jsxs("div", { className: `text-lg font-bold ${margin >= 0 ? "text-green-700" : "text-red-700"}`, children: [
                    "Rp ",
                    formatCurrency(margin)
                  ] })
                ] })
              ] })
            ] })
          ]
        },
        product.id
      );
    }) }) }),
    inactiveProducts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-5 w-5 text-slate-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "Tambah Produk" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Klik produk untuk mengaktifkan" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: inactiveProducts.map((product) => {
        const productColor = product.color || "#3B82F6";
        const productImage = LPG_IMAGES$1[product.lpgType];
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onAddProduct({
              id: product.id,
              name: product.name,
              size_kg: product.size_kg,
              selling_price: product.selling_price,
              cost_price: product.cost_price
            }),
            disabled: isSaving,
            className: "group flex items-center gap-4 p-4 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50",
            children: [
              productImage ? /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl flex items-center justify-center bg-white border overflow-hidden p-1 opacity-50 group-hover:opacity-100 transition-all group-hover:shadow-lg", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: productImage,
                  alt: product.name,
                  className: "w-full h-full object-contain"
                }
              ) }) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all group-hover:shadow-lg",
                  style: {
                    background: `linear-gradient(135deg, ${productColor}40, ${productColor}20)`
                  },
                  children: /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-6 w-6", style: { color: productColor } })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-slate-600 group-hover:text-blue-600 transition-colors truncate", children: product.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
                  product.size_kg,
                  " kg"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-500 flex items-center justify-center transition-all", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4 text-slate-400 group-hover:text-white transition-colors" }) })
            ]
          },
          product.id
        );
      }) })
    ] }),
    products.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-8 w-8 text-slate-400" }) }),
      /* @__PURE__ */ jsx("h3", { className: "font-medium text-slate-700 mb-1", children: "Tidak ada produk" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Produk akan muncul di sini" })
    ] })
  ] });
};
const LPG_CONFIG = {
  // 220gram / Bright Gas Can
  "gr220": { name: "Bright Gas 220gr", color: "#FFA500", gradient: "from-orange-400 to-amber-500" },
  // 3kg
  "3kg": { name: "LPG 3 kg", color: "#22C55E", gradient: "from-green-500 to-emerald-600" },
  "kg3": { name: "LPG 3 kg", color: "#22C55E", gradient: "from-green-500 to-emerald-600" },
  // 5.5kg
  "5kg": { name: "LPG 5.5 kg", color: "#ff82c5", gradient: "from-pink-400 to-pink-600" },
  "kg5": { name: "LPG 5.5 kg", color: "#ff82c5", gradient: "from-pink-400 to-pink-600" },
  // 12kg
  "12kg": { name: "LPG 12 kg", color: "#3B82F6", gradient: "from-blue-500 to-indigo-600" },
  "kg12": { name: "LPG 12 kg", color: "#3B82F6", gradient: "from-blue-500 to-indigo-600" },
  // 50kg
  "50kg": { name: "LPG 50 kg", color: "#8B5CF6", gradient: "from-violet-500 to-purple-600" },
  "kg50": { name: "LPG 50 kg", color: "#8B5CF6", gradient: "from-violet-500 to-purple-600" }
};
const LPG_IMAGES = {
  // 220gr / Bright Gas
  "gr220": "/images/products/bright-gas-220gr.png",
  "220gr": "/images/products/bright-gas-220gr.png",
  "bright_gas_220gr": "/images/products/bright-gas-220gr.png",
  // 3kg
  "kg3": "/images/products/lpg-3kg.png",
  "3kg": "/images/products/lpg-3kg.png",
  // 5.5kg
  "kg5": "/images/products/lpg-5kg.png",
  "5kg": "/images/products/lpg-5kg.png",
  // 12kg
  "kg12": "/images/products/lpg-12kg.png",
  "12kg": "/images/products/lpg-12kg.png",
  // 50kg
  "kg50": "/images/products/lpg-50kg.png",
  "50kg": "/images/products/lpg-50kg.png"
};
const normalizeType = (type) => {
  if (type.startsWith("kg")) return type;
  const match = type.match(/^(\d+\.?\d*)kg$/);
  if (match) return `kg${match[1]}`;
  if (type.match(/g?r?220g?r?/i)) return "gr220";
  return type;
};
function StokPangkalanPage() {
  const [profile, setProfile] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [movements, setMovements] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("stock");
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [receiveData, setReceiveData] = useState({ lpgType: "kg3", qty: 0, note: "", movementType: "IN" });
  const [orderData, setOrderData] = useState({ lpgType: "kg3", qty: 0, note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const itemsPerPage = 10;
  const [prices, setPrices] = useState([]);
  const [editedPrices, setEditedPrices] = useState({});
  const [initialPrices, setInitialPrices] = useState({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [agenProducts, setAgenProducts] = useState([]);
  const [agenOrders, setAgenOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isReceiveOrderOpen, setIsReceiveOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [createOrderData, setCreateOrderData] = useState({ lpgType: "kg3", qty: 0, note: "" });
  const [receiveQty, setReceiveQty] = useState(0);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [profileData, stockResponse] = await Promise.all([
        authApi.getProfile(),
        pangkalanStockApi.getStockLevels()
      ]);
      setProfile(profileData);
      setStocks(stockResponse.stocks);
      setTotalStock(stockResponse.summary.total);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal memuat data stok");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchMovements = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await pangkalanStockApi.getMovements({
        limit: 100,
        lpgType: filterType !== "all" ? filterType : void 0
      });
      setMovements(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch movements:", error);
      toast.error("Gagal memuat riwayat stok");
    } finally {
      setIsLoadingHistory(false);
    }
  };
  const fetchPrices = async () => {
    try {
      setIsLoadingPrices(true);
      const data = await lpgPricesApi.getAll();
      setPrices(data);
      const edited = {};
      data.forEach((p) => {
        edited[p.lpg_type] = {
          cost: Number(p.cost_price),
          sell: Number(p.selling_price),
          active: p.is_active
        };
      });
      setEditedPrices(edited);
      setInitialPrices(JSON.parse(JSON.stringify(edited)));
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      toast.error("Gagal memuat data harga");
    } finally {
      setIsLoadingPrices(false);
    }
  };
  useEffect(() => {
    fetchData();
    fetchPrices();
  }, []);
  useEffect(() => {
    if (activeTab === "history") {
      fetchMovements();
    } else if (activeTab === "products") {
      fetchPrices();
      fetchAgenProducts();
    }
  }, [activeTab, filterType]);
  const fetchAgenProducts = async () => {
    try {
      const data = await lpgProductsApi.getWithStock();
      setAgenProducts(data);
    } catch (error) {
      console.error("Failed to fetch agen products:", error);
    }
  };
  const fetchAgenOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const data = await agenOrdersApi.getOrders(orderStatusFilter);
      setAgenOrders(data);
    } catch (error) {
      console.error("Failed to fetch agen orders:", error);
      toast.error("Gagal memuat pesanan agen");
    } finally {
      setIsLoadingOrders(false);
    }
  };
  useEffect(() => {
    fetchAgenOrders();
  }, []);
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const profileData = await companyProfileApi.get();
        setCompanyProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };
    fetchCompanyProfile();
  }, []);
  const updatePrice = (lpgType, field, value) => {
    setEditedPrices((prev) => ({
      ...prev,
      [lpgType]: { ...prev[lpgType], [field]: value }
    }));
    setHasChanges(true);
  };
  const handleSavePrices = async () => {
    try {
      setIsSaving(true);
      const pricesToUpdate = Object.entries(editedPrices).map(([lpgType, data]) => ({
        lpg_type: lpgType,
        cost_price: data.cost,
        selling_price: data.sell,
        is_active: data.active
      }));
      await lpgPricesApi.bulkUpdate(pricesToUpdate);
      toast.success("Harga berhasil disimpan!");
      await fetchPrices();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan harga");
    } finally {
      setIsSaving(false);
    }
  };
  const sizeKgToLpgType = (sizeKg) => {
    const mapping = {
      0.22: "gr220",
      3: "kg3",
      5.5: "kg5",
      12: "kg12",
      50: "kg50"
    };
    return mapping[sizeKg] ?? `kg${String(sizeKg).replace(".", "")}`;
  };
  const handleAddProduct = async (product) => {
    try {
      setIsSaving(true);
      const lpgType = sizeKgToLpgType(product.size_kg);
      await lpgPricesApi.bulkUpdate([{
        lpg_type: lpgType,
        cost_price: Number(product.cost_price || 0),
        selling_price: Number(product.selling_price || 0),
        is_active: true
      }]);
      toast.success(`${product.name} berhasil ditambahkan!`);
      await fetchPrices();
      await fetchAgenProducts();
    } catch (error) {
      toast.error(error.message || "Gagal menambahkan produk");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeactivateProduct = async (lpgType) => {
    try {
      setIsSaving(true);
      const existingPrice = prices.find((p) => p.lpg_type === lpgType);
      if (existingPrice) {
        await lpgPricesApi.bulkUpdate([{
          lpg_type: lpgType,
          cost_price: Number(existingPrice.cost_price || 0),
          selling_price: Number(existingPrice.selling_price || 0),
          is_active: false
        }]);
        toast.success(`Produk berhasil dinonaktifkan`);
        await fetchPrices();
      }
    } catch (error) {
      toast.error(error.message || "Gagal menonaktifkan produk");
    } finally {
      setIsSaving(false);
    }
  };
  const getAllDisplayProducts = () => {
    const FIXED_PRODUCTS = [
      { lpgType: "gr220", name: "Bright Gas Can", size_kg: 0.22, color: "#FFA500" },
      { lpgType: "kg3", name: "LPG 3 kg", size_kg: 3, color: "#22C55E" },
      { lpgType: "kg5", name: "LPG 5.5 kg", size_kg: 5.5, color: "#ff82c5" },
      { lpgType: "kg12", name: "LPG 12 kg", size_kg: 12, color: "#3B82F6" },
      { lpgType: "kg50", name: "LPG 50 kg", size_kg: 50, color: "#8B5CF6" }
    ];
    return FIXED_PRODUCTS.map((product) => {
      const priceData = prices.find((p) => p.lpg_type === product.lpgType);
      return {
        id: priceData?.id || product.lpgType,
        name: product.name,
        size_kg: product.size_kg,
        lpgType: product.lpgType,
        color: product.color,
        selling_price: Number(priceData?.selling_price || 0),
        cost_price: Number(priceData?.cost_price || 0),
        isFromAgen: false,
        isAdded: !!priceData
        // Has price entry
      };
    });
  };
  const getActiveLpgTypes = () => {
    const allTypes = [
      { value: "gr220", label: "Bright Gas 220gr" },
      { value: "kg3", label: "LPG 3 kg" },
      { value: "kg5", label: "LPG 5.5 kg" },
      { value: "kg12", label: "LPG 12 kg" },
      { value: "kg50", label: "LPG 50 kg" }
    ];
    if (prices.length === 0) return allTypes;
    return allTypes.filter((type) => {
      const priceData = prices.find((p) => normalizeType(p.lpg_type) === normalizeType(type.value));
      return priceData?.is_active === true;
    });
  };
  const activeLpgTypes = getActiveLpgTypes();
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const filteredMovements = filterType === "all" ? movements : movements.filter((m) => normalizeType(m.lpg_type) === normalizeType(filterType));
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getStockStatus = (stock) => {
    if (stock.status === "KRITIS") return { label: "Kritis", color: "bg-red-100 text-red-700 border-red-200" };
    if (stock.status === "RENDAH") return { label: "Menipis", color: "bg-orange-100 text-orange-700 border-orange-200" };
    return { label: "Aman", color: "bg-green-100 text-green-700 border-green-200" };
  };
  const handleOrderToAgen = async () => {
    if (orderData.qty <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }
    if (!companyProfile?.phone) {
      toast.error("Nomor telepon Agen belum terdaftar. Hubungi admin untuk menambahkan data.");
      return;
    }
    let phoneNumber = companyProfile.phone.replace(/\D/g, "");
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "62" + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith("62")) {
      phoneNumber = "62" + phoneNumber;
    }
    const lpgName = LPG_CONFIG[orderData.lpgType]?.name || orderData.lpgType;
    const pangkalanName = profile?.pangkalans?.name || "Pangkalan";
    const message = `*PESANAN LPG*

Dari: ${pangkalanName}
Tipe: ${lpgName}
Jumlah: ${orderData.qty} tabung
${orderData.note ? `Catatan: ${orderData.note}` : ""}

Mohon konfirmasi ketersediaan dan estimasi pengiriman. Terima kasih.`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    toast.success(`Membuka WhatsApp untuk menghubungi ${companyProfile.company_name}`);
    setIsOrderOpen(false);
    setOrderData({ lpgType: "3kg", qty: 0, note: "" });
  };
  const handleExportExcel = () => {
    try {
      toast.loading("Generating Excel...", { id: "excel-export" });
      const wb = XLSX.utils.book_new();
      const now = /* @__PURE__ */ new Date();
      const pangkalanName = profile?.pangkalans?.name || profile?.name || "PANGKALAN";
      const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase();
      const stockData = [];
      stockData.push([`LAPORAN STOK LPG ${pangkalanName.toUpperCase()}`]);
      stockData.push([`Per Tanggal: ${now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`]);
      stockData.push([]);
      stockData.push(["NO", "TIPE LPG", "NAMA", "STOK (TABUNG)", "STATUS", "TERAKHIR UPDATE"]);
      let rowNo = 1;
      stocks.forEach((stock) => {
        const config = LPG_CONFIG[stock.lpg_type] || { name: stock.lpg_type.toUpperCase() };
        stockData.push([
          rowNo++,
          stock.lpg_type.toUpperCase(),
          config.name,
          stock.qty,
          stock.status,
          new Date(stock.updated_at).toLocaleDateString("id-ID")
        ]);
      });
      stockData.push([]);
      stockData.push(["", "", "TOTAL STOK:", totalStock, "", ""]);
      const wsStock = XLSX.utils.aoa_to_sheet(stockData);
      wsStock["!cols"] = [
        { wch: 5 },
        { wch: 12 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 }
      ];
      wsStock["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }
      ];
      XLSX.utils.book_append_sheet(wb, wsStock, "Stok Saat Ini");
      if (movements.length > 0) {
        const moveData = [];
        moveData.push([`RIWAYAT PERGERAKAN STOK ${pangkalanName.toUpperCase()}`]);
        moveData.push([]);
        moveData.push(["NO", "TANGGAL", "TIPE LPG", "JENIS", "QTY", "CATATAN"]);
        let moveNo = 1;
        movements.forEach((move) => {
          moveData.push([
            moveNo++,
            new Date(move.created_at).toLocaleDateString("id-ID"),
            move.lpg_type.toUpperCase(),
            move.movement_type === "IN" ? "MASUK" : move.movement_type === "OUT" ? "KELUAR" : move.movement_type,
            move.qty,
            move.note || "-"
          ]);
        });
        const wsMove = XLSX.utils.aoa_to_sheet(moveData);
        wsMove["!cols"] = [
          { wch: 5 },
          { wch: 15 },
          { wch: 12 },
          { wch: 12 },
          { wch: 8 },
          { wch: 25 }
        ];
        wsMove["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
        XLSX.utils.book_append_sheet(wb, wsMove, "Riwayat Pergerakan");
      }
      const fileName = `Stok_LPG_${pangkalanName.replace(/\s/g, "_")}_${monthName.replace(/\s/g, "_")}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success("Excel berhasil di-download!", { id: "excel-export" });
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Gagal export Excel", { id: "excel-export" });
    }
  };
  const handleExportPDF = async () => {
    try {
      toast.loading("Generating PDF...", { id: "pdf-export" });
      let movementsData = movements;
      if (movementsData.length === 0) {
        try {
          movementsData = await pangkalanStockApi.getMovements({ limit: 100 });
        } catch (e) {
          console.warn("Could not fetch movements for PDF:", e);
        }
      }
      const doc = new jsPDF({ orientation: "portrait" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const now = /* @__PURE__ */ new Date();
      const pangkalanName = profile?.pangkalans?.name || profile?.name || "PANGKALAN";
      const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" }).toUpperCase();
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("Sim4lon by Luthfi", pageWidth - margin, 10, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 64, 175);
      doc.text(`LAPORAN STOK LPG`, pageWidth / 2, 20, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text(pangkalanName.toUpperCase(), pageWidth / 2, 28, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Per ${now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, pageWidth / 2, 35, { align: "center" });
      doc.setDrawColor(200);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, 42, pageWidth - 2 * margin, 18, 3, 3, "F");
      doc.setFontSize(11);
      doc.setTextColor(60);
      doc.text(`Total Tipe LPG: ${stocks.length}`, margin + 10, 52);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(`Total Stok: ${totalStock} Tabung`, pageWidth - margin - 10, 52, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 64, 175);
      doc.text("STOK SAAT INI", margin, 68);
      const stockHeaders = ["NO", "TIPE LPG", "NAMA PRODUK", "STOK", "STATUS"];
      const stockTableData = [];
      let no = 1;
      stocks.forEach((stock) => {
        const config = LPG_CONFIG[stock.lpg_type] || { name: stock.lpg_type.toUpperCase() };
        stockTableData.push([
          no++,
          stock.lpg_type.toUpperCase(),
          config.name,
          `${stock.qty} tabung`,
          stock.status
        ]);
      });
      autoTable(doc, {
        startY: 72,
        head: [stockHeaders],
        body: stockTableData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: {
          fillColor: [30, 64, 175],
          textColor: 255,
          fontStyle: "bold",
          halign: "center"
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          1: { halign: "center", cellWidth: 25 },
          2: { cellWidth: 60 },
          3: { halign: "center", cellWidth: 30 },
          4: { halign: "center", cellWidth: 25 }
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        didParseCell: (data) => {
          if (data.column.index === 4 && data.section === "body") {
            const val = String(data.cell.raw);
            if (val === "KRITIS" || val === "Rendah") {
              data.cell.styles.textColor = [220, 38, 38];
              data.cell.styles.fontStyle = "bold";
            } else if (val === "AMAN" || val === "Aman") {
              data.cell.styles.textColor = [22, 163, 74];
            }
          }
        }
      });
      let finalY = doc.lastAutoTable?.finalY || 120;
      if (movementsData.length > 0) {
        if (finalY > 200) {
          doc.addPage();
          finalY = 20;
        } else {
          finalY += 15;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(30, 64, 175);
        doc.text("RIWAYAT PERGERAKAN STOK", margin, finalY);
        const historyHeaders = ["NO", "TANGGAL", "TIPE", "JENIS", "QTY", "CATATAN"];
        const historyTableData = [];
        let histNo = 1;
        const limitedMovements = movementsData.slice(0, 50);
        limitedMovements.forEach((move) => {
          const moveDate = new Date(move.created_at);
          const dateStr = moveDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
          const moveType = move.movement_type === "IN" ? "MASUK" : move.movement_type === "OUT" ? "KELUAR" : move.movement_type;
          historyTableData.push([
            histNo++,
            dateStr,
            move.lpg_type.toUpperCase(),
            moveType,
            move.qty,
            move.note || "-"
          ]);
        });
        autoTable(doc, {
          startY: finalY + 4,
          head: [historyHeaders],
          body: historyTableData,
          theme: "grid",
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: {
            fillColor: [100, 116, 139],
            // Slate-500
            textColor: 255,
            fontStyle: "bold",
            halign: "center"
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 12 },
            1: { cellWidth: 35 },
            2: { halign: "center", cellWidth: 18 },
            3: { halign: "center", cellWidth: 20 },
            4: { halign: "center", cellWidth: 15 },
            5: { cellWidth: 55 }
          },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          didParseCell: (data) => {
            if (data.column.index === 3 && data.section === "body") {
              const val = String(data.cell.raw);
              if (val === "MASUK") {
                data.cell.styles.textColor = [22, 163, 74];
              } else if (val === "KELUAR") {
                data.cell.styles.textColor = [220, 38, 38];
              }
            }
          }
        });
        if (movementsData.length > 50) {
          const histFinalY = doc.lastAutoTable?.finalY || 200;
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`* Menampilkan 50 dari ${movementsData.length} riwayat terbaru`, margin, histFinalY + 5);
        }
      }
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Halaman ${i} dari ${pageCount} | Dicetak: ${(/* @__PURE__ */ new Date()).toLocaleString("id-ID")}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }
      doc.save(`Stok_LPG_${pangkalanName.replace(/\s/g, "_")}_${monthName.replace(/\s/g, "_")}.pdf`);
      toast.success("PDF berhasil di-download!", { id: "pdf-export" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Gagal export PDF", { id: "pdf-export" });
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-6 w-6 text-blue-600" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-4 font-medium", children: "Memuat data stok..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight", children: "Stok LPG" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 mt-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-4 w-4" }),
          "Kelola ketersediaan stok LPG di pangkalan"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "rounded-xl border-green-200 text-green-600 hover:bg-green-50", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Download", className: "h-4 w-4 mr-2" }),
            "Export"
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleExportExcel, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileSpreadsheet", className: "h-4 w-4 mr-2 text-green-600" }),
              "Export Excel"
            ] }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleExportPDF, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-4 w-4 mr-2 text-red-600" }),
              "Export PDF"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Dialog, { open: isOrderOpen, onOpenChange: setIsOrderOpen, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 relative",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-4 w-4 mr-2" }),
                "Pesan ke Agen",
                agenOrders.filter((o) => o.status === "PENDING").length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse", children: agenOrders.filter((o) => o.status === "PENDING").length })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-5 w-5 text-blue-600" }) }),
                "Pesan ke Agen"
              ] }),
              /* @__PURE__ */ jsx(DialogDescription, { children: "Buat pesanan LPG baru dan kirim notifikasi ke agen" })
            ] }),
            agenOrders.filter((o) => o.status === "PENDING").length > 0 && /* @__PURE__ */ jsx("div", { className: "p-3 bg-orange-50 rounded-lg border border-orange-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-4 w-4 text-orange-600" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-orange-700", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  agenOrders.filter((o) => o.status === "PENDING").length,
                  " pesanan"
                ] }),
                " menunggu konfirmasi"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Tipe LPG" }),
                /* @__PURE__ */ jsxs(Select, { value: orderData.lpgType, onValueChange: (v) => setOrderData({ ...orderData, lpgType: v }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: activeLpgTypes.map((type) => /* @__PURE__ */ jsx(SelectItem, { value: type.value, children: type.label }, type.value)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Jumlah (tabung)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    placeholder: "Masukkan jumlah",
                    value: orderData.qty || "",
                    onChange: (e) => setOrderData({ ...orderData, qty: parseInt(e.target.value) || 0 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Catatan (opsional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Catatan tambahan",
                    value: orderData.note,
                    onChange: (e) => setOrderData({ ...orderData, note: e.target.value })
                  }
                )
              ] }),
              companyProfile ? /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-50 rounded-lg border border-green-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "h-4 w-4 text-green-600 mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-800", children: companyProfile.company_name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600", children: companyProfile.phone || "No telepon belum diatur" })
                ] })
              ] }) }) : /* @__PURE__ */ jsx("div", { className: "p-3 bg-amber-50 rounded-lg border border-amber-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4 text-amber-600 mt-0.5" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-700", children: "Profil perusahaan belum diatur. Hubungi admin." })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsOrderOpen(false), children: "Batal" }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: async () => {
                    try {
                      setIsSubmitting(true);
                      await agenOrdersApi.createOrder({
                        lpg_type: orderData.lpgType,
                        qty: orderData.qty,
                        note: orderData.note || void 0
                      });
                      toast.success("Pesanan berhasil dibuat!");
                      await fetchAgenOrders();
                      if (companyProfile?.phone) {
                        handleOrderToAgen();
                      }
                      setIsOrderOpen(false);
                    } catch (error) {
                      toast.error(error.message || "Gagal membuat pesanan");
                    } finally {
                      setIsSubmitting(false);
                    }
                  },
                  disabled: isSubmitting || orderData.qty <= 0,
                  className: "bg-blue-600 hover:bg-blue-700",
                  children: [
                    isSubmitting ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Send", className: "h-4 w-4 mr-2" }),
                    isSubmitting ? "Menyimpan..." : "Buat Pesanan"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-6 relative", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-sm mb-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-4 w-4" }),
            "Total Stok Tersedia"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-5xl font-bold tracking-tight", children: stocks.filter((s) => prices.find((p) => normalizeType(p.lpg_type) === normalizeType(s.lpg_type))?.is_active === true).reduce((sum, s) => sum + s.qty, 0) }),
          /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-sm mt-2", children: [
            "tabung dari ",
            stocks.filter((s) => prices.find((p) => normalizeType(p.lpg_type) === normalizeType(s.lpg_type))?.is_active === true).length,
            " tipe LPG aktif"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-xl overflow-hidden backdrop-blur-sm", children: /* @__PURE__ */ jsx("img", { src: "/images/icons/stock-icon-2.png", alt: "LPG Stock", className: "w-full h-full object-contain" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-100 rounded-xl p-1 gap-1 w-fit", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("stock"),
          className: `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "stock" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"}`,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-4 w-4" }),
            "Stok Saat Ini"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("history"),
          className: `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "history" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"}`,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "History", className: "h-4 w-4" }),
            "Riwayat"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("products"),
          className: `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "products" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"}`,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-4 w-4" }),
            "Kelola Produk"
          ]
        }
      )
    ] }),
    activeTab === "stock" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4", children: stocks.filter((stock) => {
        const priceData = prices.find((p) => normalizeType(p.lpg_type) === normalizeType(stock.lpg_type));
        return priceData?.is_active === true;
      }).map((stock) => {
        const config = LPG_CONFIG[stock.lpg_type] || { name: stock.lpg_type, gradient: "from-slate-500 to-slate-600" };
        const status = getStockStatus(stock);
        const productImage = LPG_IMAGES[stock.lpg_type];
        return /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group", children: [
          /* @__PURE__ */ jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity` }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 z-10", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `${status.color} text-xs`, children: status.label }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-4 relative", children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-3", children: productImage ? /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-md border overflow-hidden p-2 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: productImage,
                alt: config.name,
                className: "w-full h-full object-contain"
              }
            ) }) : /* @__PURE__ */ jsx("div", { className: `w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`, children: /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-10 w-10 text-white" }) }) }),
            /* @__PURE__ */ jsx("p", { className: "text-center text-sm font-medium text-slate-600 mb-2", children: config.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-center mb-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold text-slate-900", children: stock.qty }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-normal text-slate-400 ml-1", children: "tabung" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] text-slate-400", children: [
                /* @__PURE__ */ jsx("span", { children: "0" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Kritis: ",
                  stock.critical_level
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Peringatan: ",
                  stock.warning_level
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-full rounded-full transition-all ${stock.status === "KRITIS" ? "bg-red-500" : stock.status === "RENDAH" ? "bg-orange-500" : "bg-green-500"}`,
                  style: { width: `${Math.min(100, stock.qty / stock.warning_level * 50)}%` }
                }
              ) })
            ] })
          ] })
        ] }, stock.id);
      }) }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Zap", className: "h-4 w-4 text-purple-600" }) }),
            "Aksi Cepat"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Kelola stok dengan mudah" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsOrderOpen(true),
              className: "flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-300 transition-all group",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-6 w-6 text-blue-600" }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: "Pesan ke Agen" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Kirim pesanan LPG" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed relative",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "PackagePlus", className: "h-6 w-6 text-slate-400" }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-500", children: "Koreksi Stok" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: "Penyesuaian manual (opname)" })
                ] }),
                /* @__PURE__ */ jsx(Badge, { className: "ml-auto bg-amber-100 text-amber-700 text-xs whitespace-nowrap", children: "Coming Soon" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed relative",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ClipboardCheck", className: "h-6 w-6 text-slate-400" }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-500", children: "Stock Opname" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: "Sesuaikan stok aktual" })
                ] }),
                /* @__PURE__ */ jsx(Badge, { className: "ml-auto bg-amber-100 text-amber-700 text-xs whitespace-nowrap", children: "Coming Soon" })
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg rounded-2xl", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-6 w-6 text-green-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-900 mb-1", children: "Stok Terintegrasi dengan Agen" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-600 mb-3", children: [
            "Stok otomatis bertambah saat pesanan dari agen berstatus ",
            /* @__PURE__ */ jsx("strong", { children: "SELESAI" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-700", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-green-500" }),
              /* @__PURE__ */ jsx("span", { children: "Stok masuk otomatis dari pesanan" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-700", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-green-500" }),
              /* @__PURE__ */ jsx("span", { children: "Riwayat pergerakan tercatat" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-700", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-green-500" }),
              /* @__PURE__ */ jsx("span", { children: "Sumber: ORDER (dari agen)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-700", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-green-500" }),
              /* @__PURE__ */ jsx("span", { children: "Koreksi manual tetap tersedia" })
            ] })
          ] })
        ] })
      ] }) }) })
    ] }) : activeTab === "history" ? (
      /* Riwayat Tab */
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Card, { className: "bg-white shadow-lg rounded-2xl border-0", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Filter", className: "h-4 w-4 text-slate-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-600", children: "Filter:" })
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: filterType, onValueChange: (val) => {
            setFilterType(val);
            setCurrentPage(1);
          }, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full sm:w-[180px] rounded-xl", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Semua Tipe" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Semua Tipe" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "gr220", children: "Bright Gas Can" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "kg3", children: "LPG 3 kg" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "kg5", children: "LPG 5.5 kg" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "kg12", children: "LPG 12 kg" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "kg50", children: "LPG 50 kg" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:ml-auto", children: [
            filterType !== "all" && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              filteredMovements.length,
              " hasil"
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: fetchMovements, className: "rounded-xl flex-1 sm:flex-none", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: "h-4 w-4 mr-2" }),
              "Refresh"
            ] })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: isLoadingHistory ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600" }) }) : movements.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-slate-500", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/illustrations/empty-stock.png",
              alt: "Belum ada riwayat",
              className: "w-40 h-40 object-contain opacity-70 mb-4"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Belum ada riwayat" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: "Pergerakan stok akan muncul di sini" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide", children: "Waktu" }),
              /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide", children: "Tipe LPG" }),
              /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide", children: "Jenis" }),
              /* @__PURE__ */ jsx("th", { className: "text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide", children: "Qty" }),
              /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide", children: "Sumber" }),
              /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide", children: "Catatan" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: paginatedMovements.map((mv, idx) => {
              const config = LPG_CONFIG[mv.lpg_type] || { name: mv.lpg_type, color: "#666" };
              const isIn = mv.movement_type === "MASUK" || mv.movement_type === "IN";
              return /* @__PURE__ */ jsxs("tr", { className: `hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`, children: [
                /* @__PURE__ */ jsx("td", { className: "p-4 text-sm text-slate-600", children: formatDate(mv.movement_date) }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: config.color } }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-900", children: config.name })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs(Badge, { className: `${isIn ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} border-0 rounded-full`, children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: isIn ? "ArrowDownCircle" : "ArrowUpCircle", className: "h-3 w-3 mr-1" }),
                  isIn ? "MASUK" : "KELUAR"
                ] }) }),
                /* @__PURE__ */ jsxs("td", { className: `p-4 text-right font-bold ${isIn ? "text-green-600" : "text-red-600"}`, children: [
                  isIn ? "+" : "-",
                  mv.qty
                ] }),
                /* @__PURE__ */ jsx("td", { className: "p-4 text-sm text-slate-600", children: mv.source || "-" }),
                /* @__PURE__ */ jsx("td", { className: "p-4 text-sm text-slate-500 max-w-[200px] truncate", children: mv.note || "-" })
              ] }, mv.id);
            }) })
          ] }) }),
          totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-slate-50", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-600 text-center sm:text-left", children: [
              "Menampilkan ",
              (currentPage - 1) * itemsPerPage + 1,
              " - ",
              Math.min(currentPage * itemsPerPage, filteredMovements.length),
              " dari ",
              filteredMovements.length
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "rounded-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: currentPage === pageNum ? "default" : "outline",
                    size: "sm",
                    onClick: () => setCurrentPage(pageNum),
                    className: `w-8 h-8 p-0 rounded-lg ${currentPage === pageNum ? "bg-blue-600" : ""}`,
                    children: pageNum
                  },
                  pageNum
                );
              }) }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "rounded-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4" }) })
            ] })
          ] })
        ] }) }) })
      ] })
    ) : activeTab === "products" ? (
      /* Kelola Produk Tab - Products from Agen with Pangkalan settings */
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white rounded-2xl shadow-lg p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Kelola Produk LPG" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Produk dari Agen • Atur harga & ketersediaan" })
            ] })
          ] }),
          hasChanges ? /* @__PURE__ */ jsx(
            Button,
            {
              onClick: handleSavePrices,
              disabled: isSaving,
              className: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-500/25 animate-pulse",
              children: isSaving ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "h-4 w-4 mr-2" }),
                "Simpan Perubahan"
              ] })
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-4 py-2 rounded-xl", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-green-500" }),
            /* @__PURE__ */ jsx("span", { children: "Tersimpan" })
          ] })
        ] }),
        isLoadingPrices ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600" }) }) : /* @__PURE__ */ jsx(
          ProductManagementGrid,
          {
            products: getAllDisplayProducts(),
            editedPrices,
            stocks,
            isSaving,
            onAddProduct: (product) => handleAddProduct(product),
            onDeactivateProduct: handleDeactivateProduct,
            onUpdatePrice: updatePrice
          }
        )
      ] })
    ) : null
  ] });
}
const $$Stok = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Stok LPG - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "StokPangkalanPage", StokPangkalanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/StokPangkalanPage.tsx", "client:component-export": "default" })}
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/stok.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/stok.astro";
const $$url = "/pangkalan/stok.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Stok,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
