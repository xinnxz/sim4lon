import { c as createComponent, a as renderTemplate, r as renderComponent, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C7j8yK_x.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import { o as ordersApi, l as lpgProductsApi, S as SafeIcon, B as Button, I as Input, p as pangkalanApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { C as Card, a as CardContent } from "../_astro/card.CnUj7wdc.js";
import { L as Label } from "../_astro/label.C1We_4rW.js";
import { B as Badge, S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { T as Textarea } from "../_astro/textarea.F19kpFWl.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { toast } from "sonner";
import { f as formatCurrency } from "../_astro/currency.CHcHKzei.js";
import { u as useAppSettings } from "../_astro/useAppSettings.B8L48MuF.js";
import { renderers } from "../renderers.mjs";
const sizeKgToLpgType = (sizeKg) => {
  const size = typeof sizeKg === "string" ? parseFloat(sizeKg) : sizeKg;
  console.log("[sizeKgToLpgType] Input:", sizeKg, "→ Parsed:", size);
  if (isNaN(size)) {
    console.warn("[sizeKgToLpgType] Invalid size, defaulting to kg3");
    return "kg3";
  }
  const isApprox = (a, b) => Math.abs(a - b) < 0.1;
  let result;
  if (size <= 0.3) {
    result = "gr220";
  } else if (isApprox(size, 3)) {
    result = "kg3";
  } else if (isApprox(size, 5.5) || isApprox(size, 5)) {
    result = "kg5";
  } else if (isApprox(size, 12)) {
    result = "kg12";
  } else if (isApprox(size, 50)) {
    result = "kg50";
  } else {
    result = `kg${Math.floor(size)}`;
  }
  console.log("[sizeKgToLpgType] Result:", result);
  return result;
};
function CreateOrderForm() {
  const { settings: appSettings } = useAppSettings();
  const [pangkalanList, setPangkalanList] = useState([]);
  const [lpgProducts, setLpgProducts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    pangkalanId: "",
    note: "",
    items: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderStatus, setEditOrderStatus] = useState(null);
  const holdTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdCountRef = useRef(0);
  const holdItemIdRef = useRef(null);
  const startHold = useCallback((itemId, action) => {
    holdCountRef.current = 0;
    holdItemIdRef.current = itemId;
    holdTimeoutRef.current = setTimeout(() => {
      const tick = () => {
        holdCountRef.current++;
        let step = 1;
        if (holdCountRef.current > 30) step = 10;
        else if (holdCountRef.current > 10) step = 5;
        const currentItemId = holdItemIdRef.current;
        if (!currentItemId) return;
        setFormData((prev) => ({
          ...prev,
          items: prev.items.map((item) => {
            if (item.id !== currentItemId) return item;
            const newQty = action === "increment" ? item.quantity + step : Math.max(0, item.quantity - step);
            return { ...item, quantity: newQty };
          })
        }));
        let delay = 100;
        if (holdCountRef.current > 20) delay = 75;
        else if (holdCountRef.current > 5) delay = 80;
        holdIntervalRef.current = setTimeout(tick, delay);
      };
      tick();
    }, 450);
  }, []);
  const stopHold = useCallback(() => {
    holdCountRef.current = 0;
    holdItemIdRef.current = null;
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearTimeout(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);
  useEffect(() => {
    return () => stopHold();
  }, [stopHold]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [pangkalanRes, productsRes] = await Promise.all([
          pangkalanApi.getAll(1, 100, void 0, true),
          // Only active pangkalan
          lpgProductsApi.getWithStock()
          // LPG products with stock info
        ]);
        setPangkalanList(pangkalanRes.data);
        setLpgProducts(productsRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Gagal memuat data pangkalan dan produk");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("code") || params.get("id");
      if (orderId) {
        setIsEditMode(true);
        setEditOrderId(orderId);
        loadOrderForEdit(orderId);
      }
    }
  }, []);
  const loadOrderForEdit = async (orderId) => {
    try {
      const order = await ordersApi.getById(orderId);
      setEditOrderStatus(order.current_status);
      const products = lpgProducts.length > 0 ? lpgProducts : await lpgProductsApi.getAll();
      setFormData({
        pangkalanId: order.pangkalan_id,
        note: order.note || "",
        items: order.order_items.map((item, index) => {
          const sizeMatch = item.lpg_type.match(/\d+/);
          const size = sizeMatch ? parseFloat(sizeMatch[0]) : 0;
          const matchedProduct = products.find(
            (p) => parseFloat(String(p.size_kg)) === size || p.name.toLowerCase().includes(item.label?.toLowerCase() || "")
          );
          return {
            id: String(index + 1),
            productId: matchedProduct?.id || "",
            lpgType: item.lpg_type,
            label: item.label || matchedProduct?.name || item.lpg_type,
            price: item.price_per_unit,
            quantity: item.qty,
            isTaxable: item.is_taxable ?? false
          };
        })
      });
    } catch (error) {
      console.error("Failed to load order:", error);
      toast.error("Gagal memuat data pesanan");
    }
  };
  const handlePangkalanChange = (value) => {
    setFormData((prev) => ({ ...prev, pangkalanId: value }));
  };
  const handleProductChange = (itemId, productId) => {
    const product = lpgProducts.find((p) => p.id === productId);
    if (!product) return;
    const defaultPrice = product.selling_price || product.prices?.find((p) => p.is_default)?.price || product.prices?.[0]?.price || 0;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map(
        (item) => item.id === itemId ? {
          ...item,
          productId,
          lpgType: sizeKgToLpgType(Number(product.size_kg)),
          label: product.name,
          price: Number(defaultPrice),
          isTaxable: product.category === "NON_SUBSIDI"
          // Update tax status
        } : item
      )
    }));
  };
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 0) quantity = 0;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map(
        (item) => item.id === itemId ? { ...item, quantity } : item
      )
    }));
  };
  const handleQuantityBlur = (itemId) => {
    const item = formData.items.find((i) => i.id === itemId);
    if (!item) return;
    let newQuantity = item.quantity;
    const product = lpgProducts.find((p) => p.id === item.productId);
    const maxStock = product?.stock?.current ?? 0;
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    if (newQuantity > maxStock) {
      if (maxStock === 0) {
        toast.error(`Stok ${product?.name} habis! Tidak dapat memesan.`);
        newQuantity = 0;
      } else {
        toast.warning(`Jumlah melebihi stok! Maksimal ${product?.name}: ${maxStock} unit`);
        newQuantity = maxStock;
      }
    }
    if (newQuantity !== item.quantity) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map(
          (i) => i.id === itemId ? { ...i, quantity: newQuantity } : i
        )
      }));
    }
  };
  const handleAddItem = () => {
    if (lpgProducts.length === 0) return;
    const selectedProductIds = formData.items.map((item) => item.productId);
    const availableProducts = lpgProducts.filter((p) => !selectedProductIds.includes(p.id));
    if (availableProducts.length === 0) {
      toast.warning("Semua jenis LPG sudah dipilih");
      return;
    }
    const sortedProducts = [...availableProducts].sort((a, b) => {
      if (a.category !== b.category) {
        return a.category === "SUBSIDI" ? -1 : 1;
      }
      const aSize = parseFloat(String(a.size_kg)) || 0;
      const bSize = parseFloat(String(b.size_kg)) || 0;
      if (a.category === "SUBSIDI") {
        if (Math.abs(aSize - 3) < 0.5) return -1;
        if (Math.abs(bSize - 3) < 0.5) return 1;
      }
      return aSize - bSize;
    });
    const newId = String(Math.max(...formData.items.map((i) => parseInt(i.id)), 0) + 1);
    const defaultProduct = sortedProducts[0];
    const defaultPrice = defaultProduct.selling_price || defaultProduct.prices?.find((p) => p.is_default)?.price || defaultProduct.prices?.[0]?.price || 0;
    const isTaxable = defaultProduct.category === "NON_SUBSIDI";
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          productId: defaultProduct.id,
          lpgType: sizeKgToLpgType(Number(defaultProduct.size_kg)),
          label: defaultProduct.name,
          price: defaultPrice,
          quantity: 1,
          isTaxable
        }
      ]
    }));
  };
  const handleRemoveItem = (itemId) => {
    if (formData.items.length <= 1) {
      toast.error("Minimal harus ada satu item LPG");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId)
    }));
  };
  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  const calculateTax = () => {
    const ppnDecimal = appSettings.ppnRate / 100;
    return formData.items.reduce((sum, item) => {
      if (item.isTaxable) {
        return sum + Math.round(item.price * item.quantity * ppnDecimal);
      }
      return sum;
    }, 0);
  };
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pangkalanId) {
      toast.error("Silakan pilih pangkalan");
      return;
    }
    if (formData.items.length === 0) {
      toast.error("Silakan tambahkan minimal satu item LPG");
      return;
    }
    for (const item of formData.items) {
      const product = lpgProducts.find((p) => p.id === item.productId);
      const maxStock = product?.stock?.current ?? 0;
      if (item.quantity > maxStock) {
        toast.error(`Jumlah ${product?.name || item.lpgType} (${item.quantity}) melebihi stok tersedia (${maxStock})!`);
        return;
      }
      if (item.quantity < 1) {
        toast.error(`Jumlah ${product?.name || item.lpgType} harus minimal 1`);
        return;
      }
      if (item.price <= 0) {
        toast.error(`Harga ${product?.name || item.lpgType} tidak valid (Rp 0)`);
        return;
      }
    }
    const totalQuantity = formData.items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity < appSettings.minOrderQuantity) {
      toast.error(`Total pesanan minimal ${appSettings.minOrderQuantity} tabung. Saat ini: ${totalQuantity} tabung.`);
      return;
    }
    setIsSubmitting(true);
    try {
      const orderDto = {
        pangkalan_id: formData.pangkalanId,
        note: formData.note || void 0,
        items: formData.items.map((item) => ({
          lpg_type: item.lpgType,
          lpg_product_id: item.productId,
          // For dynamic product stock tracking
          label: item.label,
          price_per_unit: Number(item.price),
          // Ensure it's a number
          qty: Math.floor(Number(item.quantity)),
          // Ensure it's an integer
          is_taxable: item.isTaxable
          // Send tax status for PPN calculation
        }))
      };
      console.log("=== DEBUG ORDER SUBMISSION ===");
      console.log("isEditMode:", isEditMode);
      console.log("editOrderId:", editOrderId);
      console.log("orderDto:", JSON.stringify(orderDto, null, 2));
      let result;
      if (isEditMode && editOrderId) {
        result = await ordersApi.update(editOrderId, orderDto);
        toast.success("Pesanan berhasil diperbarui!");
      } else {
        result = await ordersApi.create(orderDto);
        toast.success("Pesanan berhasil dibuat!");
      }
      window.location.href = `/detail-pesanan?code=${result.code}`;
    } catch (error) {
      console.error("Failed to submit order:", error);
      toast.error(error.message || (isEditMode ? "Gagal memperbarui pesanan" : "Gagal membuat pesanan"));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    if (isEditMode && editOrderId) {
      window.location.href = `/detail-pesanan?code=${editOrderId}`;
    } else {
      window.location.href = "/daftar-pesanan";
    }
  };
  const selectedPangkalan = pangkalanList.find((p) => p.id === formData.pangkalanId);
  const isFormDisabled = editOrderStatus === "SELESAI" || editOrderStatus === "BATAL";
  if (isLoadingData) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin mx-auto text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Memuat data..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3 dashboard-gradient-bg min-h-screen p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "chart-card-premium rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-border/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gradient-primary", children: isEditMode ? "Edit Pesanan" : "Buat Pesanan Baru" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: isEditMode ? "Perbarui informasi pesanan" : "Lengkapi informasi pesanan LPG baru" })
          ] })
        ] }),
        isEditMode && editOrderStatus && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3 pt-4 border-t border-border/50", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Status:" }),
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: editOrderStatus })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        isFormDisabled && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: "Pesanan dengan status selesai atau dibatalkan tidak dapat diubah" }) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "pangkalan", className: "text-base font-semibold", children: [
              "Pilih Pangkalan ",
              /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.pangkalanId,
                onValueChange: handlePangkalanChange,
                disabled: isFormDisabled,
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { id: "pangkalan", className: "h-10", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih pangkalan..." }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: pangkalanList.map((pangkalan) => /* @__PURE__ */ jsx(SelectItem, { value: pangkalan.id, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: pangkalan.name }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: pangkalan.address })
                  ] }) }, pangkalan.id)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(Label, { className: "text-base font-semibold", children: [
                "Item LPG ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Pilih jenis dan jumlah LPG yang ingin dipesan" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: formData.items.map((item, index) => /* @__PURE__ */ jsx(Card, { className: "border border-border", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
                  "Item ",
                  index + 1
                ] }),
                formData.items.length > 1 && !isFormDisabled && /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => handleRemoveItem(item.id),
                    className: "text-destructive hover:text-destructive hover:bg-destructive/10",
                    children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Jenis LPG" }),
                  /* @__PURE__ */ jsxs(
                    Select,
                    {
                      value: item.productId,
                      onValueChange: (value) => handleProductChange(item.id, value),
                      disabled: isFormDisabled,
                      children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih produk..." }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: lpgProducts.filter((product) => {
                          const isSelectedInOtherItem = formData.items.some(
                            (otherItem) => otherItem.id !== item.id && otherItem.productId === product.id
                          );
                          return !isSelectedInOtherItem;
                        }).map((product) => {
                          const price = product.selling_price || product.prices?.find((p) => p.is_default)?.price || product.prices?.[0]?.price || 0;
                          const stock = product.stock?.current || 0;
                          const isOutOfStock = stock <= 0;
                          return /* @__PURE__ */ jsx(
                            SelectItem,
                            {
                              value: product.id,
                              disabled: isOutOfStock,
                              className: isOutOfStock ? "opacity-50" : "",
                              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full gap-2", children: [
                                /* @__PURE__ */ jsxs("span", { children: [
                                  product.name,
                                  " - ",
                                  formatCurrency(price)
                                ] }),
                                /* @__PURE__ */ jsxs("span", { className: `text-xs ${isOutOfStock ? "text-red-500" : "text-muted-foreground"}`, children: [
                                  "(Stok: ",
                                  stock,
                                  ")"
                                ] })
                              ] })
                            },
                            product.id
                          );
                        }) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Jumlah" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "icon",
                        className: "h-9 w-9 shrink-0 hover:bg-destructive/10 hover:border-destructive/50 active:scale-95 transition-all select-none",
                        onClick: () => handleQuantityChange(item.id, Math.max(0, item.quantity - 1)),
                        onMouseDown: () => startHold(item.id, "decrement"),
                        onMouseUp: stopHold,
                        onMouseLeave: stopHold,
                        onTouchStart: () => startHold(item.id, "decrement"),
                        onTouchEnd: stopHold,
                        disabled: isFormDisabled || item.quantity <= 0,
                        children: /* @__PURE__ */ jsx(SafeIcon, { name: "Minus", className: "h-4 w-4" })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        value: item.quantity || "",
                        onChange: (e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          handleQuantityChange(item.id, parseInt(val) || 0);
                        },
                        onBlur: () => handleQuantityBlur(item.id),
                        onWheel: (e) => e.currentTarget.blur(),
                        placeholder: "0",
                        className: "h-9 text-center font-medium",
                        disabled: isFormDisabled
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "icon",
                        className: "h-9 w-9 shrink-0 hover:bg-primary/10 hover:border-primary/50 active:scale-95 transition-all select-none",
                        onClick: () => handleQuantityChange(item.id, item.quantity + 1),
                        onMouseDown: () => startHold(item.id, "increment"),
                        onMouseUp: stopHold,
                        onMouseLeave: stopHold,
                        onTouchStart: () => startHold(item.id, "increment"),
                        onTouchEnd: stopHold,
                        disabled: isFormDisabled,
                        children: /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4" })
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-secondary rounded-lg", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Harga per unit:" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: formatCurrency(item.price) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Subtotal:" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: formatCurrency(item.price * item.quantity) })
              ] })
            ] }) }) }, item.id)) }),
            !isFormDisabled && /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleAddItem,
                className: "w-full border-dashed",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "mr-2 h-4 w-4" }),
                  "Tambah Item LPG"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "note", className: "text-base font-semibold", children: "Catatan (Opsional)" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "note",
                placeholder: "Tambahkan catatan untuk pesanan ini...",
                value: formData.note,
                onChange: (e) => setFormData((prev) => ({ ...prev, note: e.target.value })),
                className: "min-h-[100px]",
                disabled: isFormDisabled
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-end pt-4", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleCancel,
                disabled: isSubmitting,
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "mr-2 h-4 w-4" }),
                  "Batal"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                disabled: isSubmitting || !formData.pangkalanId || formData.items.length === 0 || isFormDisabled,
                className: "bg-primary hover:bg-primary/90",
                children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
                  isEditMode ? "Memperbarui..." : "Menyimpan..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: isEditMode ? "Edit" : "Save", className: "mr-2 h-4 w-4" }),
                  isEditMode ? "Perbarui Pesanan" : "Simpan Pesanan"
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-6 glass-card rounded-2xl overflow-hidden", style: { boxShadow: "0 8px 32px -8px rgba(22, 163, 74, 0.15)" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-border/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Ringkasan Pesanan" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: isEditMode ? "Verifikasi perubahan pesanan" : "Verifikasi detail sebelum menyimpan" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
        selectedPangkalan ? /* @__PURE__ */ jsx("div", { className: "space-y-2 p-3 bg-secondary rounded-lg border border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-4 w-4 mt-0.5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: selectedPangkalan.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: selectedPangkalan.address })
          ] })
        ] }) }) : /* @__PURE__ */ jsx("div", { className: "p-3 bg-muted rounded-lg border border-dashed border-border", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Pilih pangkalan untuk melihat detail" }) }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "Item Pesanan" }),
          formData.items.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: formData.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-primary/10 text-primary border-primary/30", children: item.lpgType }),
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                "× ",
                item.quantity
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: formatCurrency(item.price * item.quantity) })
          ] }, item.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Belum ada item" })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total Item:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              formData.items.reduce((sum, item) => sum + item.quantity, 0),
              " tabung"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Jenis LPG:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              new Set(formData.items.map((i) => i.lpgType)).size,
              " jenis"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatCurrency(calculateSubtotal()) })
          ] }),
          calculateTax() > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground flex items-center gap-1", children: [
              "PPN ",
              appSettings.ppnRate,
              "%",
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] px-1 py-0 bg-orange-50 text-orange-600 border-orange-200", children: "Non-Subsidi" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-orange-600", children: [
              "+ ",
              formatCurrency(calculateTax())
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, { className: "my-2" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Total Pembayaran:" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-primary", children: formatCurrency(calculateTotal()) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: calculateTax() > 0 ? "Sudah termasuk PPN untuk produk Non-Subsidi" : "Produk Subsidi tidak dikenakan PPN" })
        ] }),
        !isEditMode && /* @__PURE__ */ jsx("div", { className: "p-3  from-blue-50 to-blue-100/50 rounded-lg border border-blue-200", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-4 w-4 text-blue-600 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-700", children: [
            "Pesanan akan dibuat dengan status ",
            /* @__PURE__ */ jsx("strong", { children: "Menunggu Pembayaran" })
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
}
var __freeze = Object.freeze, __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$BuatPesanan = createComponent(($$result, $$props, $$slots) => renderTemplate(_a || (_a = __template(["", `

<script>
  {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('id')
    
    if (orderId) {
      const title = document.querySelector('[data-create-title]')
      const desc = document.querySelector('[data-create-desc]')
      if (title) title.textContent = 'Edit Pesanan'
      if (desc) desc.textContent = \`Perbarui informasi pesanan \${orderId}\`
    }
  }
<\/script>`], ["", `

<script>
  {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('id')
    
    if (orderId) {
      const title = document.querySelector('[data-create-title]')
      const desc = document.querySelector('[data-create-desc]')
      if (title) title.textContent = 'Edit Pesanan'
      if (desc) desc.textContent = \\\`Perbarui informasi pesanan \\\${orderId}\\\`
    }
  }
<\/script>`])), renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Buat Pesanan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col" id="i5rzb7">
        <div class="flex-1 overflow-auto flex flex-col" id="ixt0d1">
          <div class="flex-1 container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10" id="i07vr6">
            ${renderComponent($$result4, "CreateOrderForm", CreateOrderForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/buat-pesanan/CreateOrderForm.tsx", "client:component-export": "default" })}
            ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
          </div>
        </div>
      </main>
    ` })}
  ` })}
` })), "E:/DATA/Ngoding/sim4lon/src/pages/buat-pesanan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/buat-pesanan.astro";
const $$url = "/buat-pesanan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$BuatPesanan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
