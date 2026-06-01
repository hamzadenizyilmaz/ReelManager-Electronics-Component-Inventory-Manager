"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ToastHost from "../ui/ToastHost";

const UIContext = createContext(null);

const dictionaries = {
  tr: {
    appName: "ReelManager", login: "Giriş Yap", logout: "Çıkış", dashboard: "Kontrol Paneli",
    components: "Komponentler", newComponent: "Yeni Komponent", categories: "Kategoriler", suppliers: "Tedarikçiler",
    locations: "Lokasyonlar", projects: "Projeler / BOM", stock: "Stok Hareketleri", lowStock: "Düşük Stok",
    scanner: "QR / Barkod", labels: "Etiketler", import: "İçe Aktar", reports: "Raporlar", purchase: "Satın Alma",
    activity: "Aktivite Logları", settings: "Ayarlar", users: "Kullanıcılar", updates: "Güncellemeler",
    search: "Ara", save: "Kaydet", create: "Oluştur", update: "Güncelle", delete: "Sil", cancel: "Vazgeç",
    edit: "Düzenle", details: "Detay", loading: "Yükleniyor", empty: "Kayıt bulunamadı", error: "Hata oluştu",
    success: "Başarılı", actions: "İşlemler", light: "Açık", dark: "Koyu", language: "Türkçe",
    totalComponents: "Toplam Komponent", totalStock: "Toplam Stok", lowStockItems: "Düşük Stok", outOfStockItems: "Stokta Olmayan",
    categoryDistribution: "Kategori Dağılımı", packageDistribution: "Paket / Kılıf Dağılımı", recentMovements: "Son Stok Hareketleri",
    dashboardDescription: "Stok sağlığını, kritik ürünleri ve son operasyonları tek ekrandan izleyin.",
    footerText: "Kurumsal elektronik komponent stok yönetimi platformu.", version: "v2.2.0 Enterprise"
  },
  en: {
    appName: "ReelManager", login: "Sign In", logout: "Logout", dashboard: "Dashboard",
    components: "Components", newComponent: "New Component", categories: "Categories", suppliers: "Suppliers",
    locations: "Locations", projects: "Projects / BOM", stock: "Stock Movements", lowStock: "Low Stock",
    scanner: "QR / Barcode", labels: "Labels", import: "Import", reports: "Reports", purchase: "Purchasing",
    activity: "Activity Logs", settings: "Settings", users: "Users", updates: "Updates",
    search: "Search", save: "Save", create: "Create", update: "Update", delete: "Delete", cancel: "Cancel",
    edit: "Edit", details: "Details", loading: "Loading", empty: "No records found", error: "An error occurred",
    success: "Success", actions: "Actions", light: "Light", dark: "Dark", language: "English",
    totalComponents: "Total Components", totalStock: "Total Stock", lowStockItems: "Low Stock", outOfStockItems: "Out of Stock",
    categoryDistribution: "Category Distribution", packageDistribution: "Package Distribution", recentMovements: "Recent Stock Movements",
    dashboardDescription: "Monitor stock health, critical items and recent operations from one executive overview.",
    footerText: "Enterprise electronic component inventory management platform.", version: "v2.2.0 Enterprise"
  }
};

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside Providers");
  return ctx;
}

export function getInitialLang() {
  if (typeof window === "undefined") return "tr";
  return localStorage.getItem("reelmanager_language") || localStorage.getItem("reel-lang") || localStorage.getItem("reelmanager_locale") || "tr";
}

export function applyAppearanceFromStorage() {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const fontSize = localStorage.getItem("reelmanager_font_size") || "17";
  const radius = localStorage.getItem("reelmanager_radius") || "14";
  const accent = localStorage.getItem("reelmanager_accent") || "#1f4e79";
  const density = localStorage.getItem("reelmanager_density") || "comfortable";
  const panelStyle = localStorage.getItem("reelmanager_panel_style") || "corporate";

  root.style.setProperty("--reel-font-size", `${fontSize}px`);
  root.style.setProperty("--radius", `${radius}px`);
  root.style.setProperty("--brand", accent);
  root.style.setProperty("--brand-rgb", hexToRgb(accent));
  root.dataset.density = density;
  root.dataset.panel = panelStyle;
}

function hexToRgb(hex) {
  const raw = String(hex || "#1f4e79").replace("#", "");
  const full = raw.length === 3 ? raw.split("").map((x) => x + x).join("") : raw;
  const int = parseInt(full, 16);
  if (!Number.isFinite(int)) return "31, 78, 121";
  return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
}

export default function Providers({ children }) {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("tr");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("reel-theme") || "dark";
    const savedLang = getInitialLang();
    setTheme(savedTheme);
    setLang(savedLang);
    applyAppearanceFromStorage();
    const handler = () => applyAppearanceFromStorage();
    window.addEventListener("storage", handler);
    window.addEventListener("reelmanager:appearance", handler);
    window.addEventListener("reelmanager:language", () => setLang(getInitialLang()));
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("reelmanager:appearance", handler);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("reel-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("reel-lang", lang);
    localStorage.setItem("reelmanager_locale", lang);
    localStorage.setItem("reelmanager_language", lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.tr;
    return (key) => dict[key] || dictionaries.en[key] || key;
  }, [lang]);

  const toast = (message, type = "info") => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4200);
  };

  const changeLanguage = (nextLang) => {
    setLang(nextLang);
    localStorage.setItem("reelmanager_language", nextLang);
    localStorage.setItem("reel-lang", nextLang);
    localStorage.setItem("reelmanager_locale", nextLang);
    window.dispatchEvent(new Event("reelmanager:language"));
  };

  const applyAppearance = () => {
    applyAppearanceFromStorage();
    window.dispatchEvent(new Event("reelmanager:appearance"));
  };

  const value = useMemo(
    () => ({ theme, setTheme, lang, locale: lang, setLang: changeLanguage, setLocale: changeLanguage, t, toast, applyAppearance }),
    [theme, lang, t]
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} onClose={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />
    </UIContext.Provider>
  );
}
