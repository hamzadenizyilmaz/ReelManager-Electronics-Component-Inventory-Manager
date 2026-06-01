function clean(value) { return String(value || "").trim(); }
export function buildPurchaseQuery(component = {}) {
  return [component.manufacturerPartNumber, component.supplierPartNumber, component.manufacturer, component.value, component.packageCase, component.name]
    .map(clean).filter(Boolean).join(" ");
}
export function buildPurchaseLinks(component = {}) {
  const direct = clean(component.productUrl);
  const query = encodeURIComponent(buildPurchaseQuery(component));
  return [
    direct ? { label: "Ürün Linki", description: "Kayıtlı ürün sayfasını aç", url: direct, primary: true } : null,
    { label: "Özdisan Ara", description: "Türkiye tedarikçi araması", url: `https://www.ozdisan.com/search?q=${query}` },
    { label: "Mouser Ara", description: "Global distributor", url: `https://www.mouser.com/c/?q=${query}` },
    { label: "DigiKey Ara", description: "Global distributor", url: `https://www.digikey.com/en/products/result?keywords=${query}` },
    { label: "LCSC Ara", description: "PCB/SMT tedarikçi", url: `https://www.lcsc.com/search?q=${query}` },
    { label: "Google Ara", description: "Genel web araması", url: `https://www.google.com/search?q=${query}` }
  ].filter(Boolean);
}
