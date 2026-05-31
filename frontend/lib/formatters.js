export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR").format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function stockStatus(component) {
  const available = Number(component?.quantityAvailable ?? component?.quantity_available ?? 0);
  const minimum = Number(component?.minimumStock ?? component?.minimum_stock ?? 0);
  if (available <= 0) return "out";
  if (available <= minimum) return "low";
  return "ok";
}

export function downloadWithToken(url) {
  const token = typeof window !== "undefined" ? localStorage.getItem("reel-token") : null;
  if (!token) {
    window.open(url, "_blank");
    return;
  }
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then(async (response) => {
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      const disposition = response.headers.get("content-disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/i);
      a.download = match?.[1] || "export";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    })
    .catch(() => window.open(url, "_blank"));
}
