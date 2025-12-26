import { useState, useEffect } from "react";
import { k as companyProfileApi } from "./AuthGuard.BQhR3uPA.js";
const APP_SETTINGS_KEY = "app_settings_cache";
const CACHE_DURATION = 5 * 60 * 1e3;
const defaultSettings = {
  ppnRate: 12,
  criticalStockLimit: 10,
  invoicePrefix: "INV-",
  orderCodePrefix: "ORD-"
};
function getCachedSettings() {
  try {
    const cached = localStorage.getItem(APP_SETTINGS_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
    return isExpired ? null : parsed.settings;
  } catch {
    return null;
  }
}
function setCachedSettings(settings) {
  try {
    const cached = {
      settings,
      timestamp: Date.now()
    };
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(cached));
  } catch {
  }
}
function useAppSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSettings = async () => {
      const cached = getCachedSettings();
      if (cached) {
        setSettings(cached);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const profile = await companyProfileApi.get();
        const newSettings = {
          ppnRate: Number(profile.ppn_rate) || defaultSettings.ppnRate,
          criticalStockLimit: profile.critical_stock_limit || defaultSettings.criticalStockLimit,
          invoicePrefix: profile.invoice_prefix || defaultSettings.invoicePrefix,
          orderCodePrefix: profile.order_code_prefix || defaultSettings.orderCodePrefix
        };
        setSettings(newSettings);
        setCachedSettings(newSettings);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch app settings:", err);
        setError("Gagal memuat pengaturan aplikasi");
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);
  const refreshSettings = async () => {
    try {
      localStorage.removeItem(APP_SETTINGS_KEY);
      setIsLoading(true);
      const profile = await companyProfileApi.get();
      const newSettings = {
        ppnRate: Number(profile.ppn_rate) || defaultSettings.ppnRate,
        criticalStockLimit: profile.critical_stock_limit || defaultSettings.criticalStockLimit,
        invoicePrefix: profile.invoice_prefix || defaultSettings.invoicePrefix,
        orderCodePrefix: profile.order_code_prefix || defaultSettings.orderCodePrefix
      };
      setSettings(newSettings);
      setCachedSettings(newSettings);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh settings:", err);
      setError("Gagal memuat pengaturan");
    } finally {
      setIsLoading(false);
    }
  };
  return {
    settings,
    isLoading,
    error,
    refreshSettings
  };
}
function clearAppSettingsCache() {
  localStorage.removeItem(APP_SETTINGS_KEY);
}
export {
  clearAppSettingsCache as c,
  useAppSettings as u
};
