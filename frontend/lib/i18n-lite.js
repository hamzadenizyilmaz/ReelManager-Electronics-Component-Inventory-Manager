export const statusLabels = {
  tr: {
    draft: "Taslak",
    active: "Aktif",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
    passive: "Pasif",
    archived: "Arşivlendi",
    available: "Stok Yeterli",
    low: "Düşük Stok",
    out: "Stok Yok"
  },
  en: {
    draft: "Draft",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
    passive: "Passive",
    archived: "Archived",
    available: "Available",
    low: "Low Stock",
    out: "Out of Stock"
  }
};

export const uiLabels = {
  tr: {
    languageName: "Türkçe",
    addProject: "Yeni Proje",
    addCategory: "Yeni Kategori",
    addSupplier: "Yeni Tedarikçi",
    addLocation: "Yeni Lokasyon",
    save: "Kaydet",
    cancel: "Vazgeç",
    edit: "Düzenle",
    delete: "Sil",
    back: "Geri Dön",
    stockCheck: "Stok Kontrol",
    pdf: "PDF",
    addBom: "BOM'a Ekle",
    selectComponent: "Komponent seç",
    searchComponent: "SKU, part number, değer, lokasyon ara...",
    noRecord: "Kayıt bulunamadı",
    actions: "İşlemler",
    details: "Detay",
    singleName: "Tek isim alanı"
  },
  en: {
    languageName: "English",
    addProject: "New Project",
    addCategory: "New Category",
    addSupplier: "New Supplier",
    addLocation: "New Location",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    stockCheck: "Check Stock",
    pdf: "PDF",
    addBom: "Add to BOM",
    selectComponent: "Select component",
    searchComponent: "Search SKU, part number, value, location...",
    noRecord: "No records found",
    actions: "Actions",
    details: "Details",
    singleName: "Single name field"
  }
};

export function getLocale() {
  if (typeof window === "undefined") return "tr";
  return localStorage.getItem("reelmanager_locale") || localStorage.getItem("reel-lang") || "tr";
}

export function t(key, locale = getLocale()) {
  return uiLabels[locale]?.[key] || uiLabels.tr[key] || key;
}

export function statusText(status, locale = getLocale()) {
  return statusLabels[locale]?.[status] || status || "-";
}
