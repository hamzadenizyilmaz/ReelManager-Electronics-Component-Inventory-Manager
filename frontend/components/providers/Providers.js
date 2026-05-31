"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ToastHost from "../ui/ToastHost";

const UIContext = createContext(null);

const dictionaries = {
  tr: {
    appName: "Reel Manager",
    login: "Giriş Yap",
    logout: "Çıkış",
    dashboard: "Dashboard",
    components: "Komponentler",
    newComponent: "Yeni Komponent",
    categories: "Kategoriler",
    suppliers: "Tedarikçiler",
    locations: "Lokasyonlar",
    projects: "Projeler / BOM",
    stock: "Stok Hareketleri",
    lowStock: "Düşük Stok",
    scanner: "QR / Barkod",
    labels: "Etiketler",
    import: "İçe Aktar",
    reports: "Raporlar",
    purchase: "Satın Alma",
    activity: "Aktivite",
    settings: "Ayarlar",
    search: "Ara",
    save: "Kaydet",
    create: "Oluştur",
    update: "Güncelle",
    delete: "Sil",
    cancel: "Vazgeç",
    edit: "Düzenle",
    details: "Detay",
    loading: "Yükleniyor",
    empty: "Kayıt bulunamadı",
    error: "Hata oluştu",
    success: "Başarılı",
    totalComponents: "Toplam Komponent",
    totalStock: "Toplam Stok",
    lowStockItems: "Düşük Stok",
    outOfStockItems: "Stok Yok",
    available: "Mevcut",
    reserved: "Rezerve",
    minimum: "Minimum",
    partNumber: "Part Number",
    category: "Kategori",
    supplier: "Tedarikçi",
    package: "Kılıf",
    value: "Değer",
    quantity: "Adet",
    location: "Lokasyon",
    actions: "İşlemler",
    light: "Açık",
    dark: "Koyu",
    language: "Dil"
  },
  en: {
    appName: "Reel Manager",
    login: "Sign In",
    logout: "Logout",
    dashboard: "Dashboard",
    components: "Components",
    newComponent: "New Component",
    categories: "Categories",
    suppliers: "Suppliers",
    locations: "Locations",
    projects: "Projects / BOM",
    stock: "Stock Movements",
    lowStock: "Low Stock",
    scanner: "QR / Barcode",
    labels: "Labels",
    import: "Import",
    reports: "Reports",
    purchase: "Purchase",
    activity: "Activity",
    settings: "Settings",
    search: "Search",
    save: "Save",
    create: "Create",
    update: "Update",
    delete: "Delete",
    cancel: "Cancel",
    edit: "Edit",
    details: "Details",
    loading: "Loading",
    empty: "No records found",
    error: "An error occurred",
    success: "Success",
    totalComponents: "Total Components",
    totalStock: "Total Stock",
    lowStockItems: "Low Stock",
    outOfStockItems: "Out of Stock",
    available: "Available",
    reserved: "Reserved",
    minimum: "Minimum",
    partNumber: "Part Number",
    category: "Category",
    supplier: "Supplier",
    package: "Package",
    value: "Value",
    quantity: "Quantity",
    location: "Location",
    actions: "Actions",
    light: "Light",
    dark: "Dark",
    language: "Language"
  }
};

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside Providers");
  return ctx;
}

export default function Providers({ children }) {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("tr");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("reel-theme") || "dark";
    const savedLang = localStorage.getItem("reel-lang") || "tr";
    setTheme(savedTheme);
    setLang(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("reel-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("reel-lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.tr;
    return (key) => dict[key] || key;
  }, [lang]);

  const toast = (message, type = "info") => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4200);
  };

  const value = useMemo(() => ({ theme, setTheme, lang, setLang, t, toast }), [theme, lang, t]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} onClose={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />
    </UIContext.Provider>
  );
}
