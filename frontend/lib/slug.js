export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function entitySlug(row) {
  return slugify(row?.slug || row?.code || row?.name || row?.nameTr || row?.nameEn || row?.id);
}

export function displayName(row) {
  if (!row) return "-";
  return row.name || row.nameTr || row.nameEn || row.code || `#${row.id}`;
}

export function findBySlug(items, slug) {
  return (items || []).find((item) => entitySlug(item) === slug || String(item.id) === String(slug));
}
