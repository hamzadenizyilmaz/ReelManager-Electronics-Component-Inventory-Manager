export function actionLabel(value, lang = "tr") {
  const raw = String(value || "-");
  const [base, ...rest] = raw.split("_");
  const suffix = rest.join("_");
  const tr = { READ:"Okuma", CREATE:"Oluşturma", CREATE_OR_ACTION:"İşlem", UPDATE:"Güncelleme", DELETE:"Silme", EXPORT:"Dışa Aktarma", TEST:"Test", LOGIN:"Giriş", LOGOUT:"Çıkış", GET:"Okuma", POST:"Oluşturma", PUT:"Güncelleme", PATCH:"Güncelleme" };
  const en = { READ:"Read", CREATE:"Create", CREATE_OR_ACTION:"Action", UPDATE:"Update", DELETE:"Delete", EXPORT:"Export", TEST:"Test", LOGIN:"Login", LOGOUT:"Logout", GET:"Read", POST:"Create", PUT:"Update", PATCH:"Update" };
  const map = lang === "tr" ? tr : en;
  return `${map[base] || base}${suffix ? ` / ${suffix}` : ""}`;
}

export function entityLabel(value, lang = "tr") {
  const tr = { auth:"Kimlik Doğrulama", components:"Komponentler", categories:"Kategoriler", suppliers:"Tedarikçiler", locations:"Lokasyonlar", projects:"Projeler", stock:"Stok", dashboard:"Kontrol Paneli", settings:"Ayarlar", datasheets:"Datasheet", database_backup:"Database Yedeği", backup_target:"Yedek Hedefi", user:"Kullanıcı", system_setting:"Sistem Ayarı", updates:"Güncellemeler" };
  const en = { auth:"Authentication", components:"Components", categories:"Categories", suppliers:"Suppliers", locations:"Locations", projects:"Projects", stock:"Stock", dashboard:"Dashboard", settings:"Settings", datasheets:"Datasheet", database_backup:"Database Backup", backup_target:"Backup Target", user:"User", system_setting:"System Setting", updates:"Updates" };
  return (lang === "tr" ? tr : en)[value] || value || "-";
}

export function statusLabel(value, lang = "tr") {
  const code = Number(value);
  if (!Number.isFinite(code)) return "-";
  if (code >= 200 && code < 300) return lang === "tr" ? `Başarılı (${code})` : `Successful (${code})`;
  if (code === 401) return lang === "tr" ? "Yetkisiz (401)" : "Unauthorized (401)";
  if (code === 403) return lang === "tr" ? "Erişim Engellendi (403)" : "Forbidden (403)";
  if (code === 404) return lang === "tr" ? "Bulunamadı (404)" : "Not Found (404)";
  if (code >= 500) return lang === "tr" ? `Sunucu Hatası (${code})` : `Server Error (${code})`;
  return lang === "tr" ? `İşlem Durumu (${code})` : `Status (${code})`;
}
