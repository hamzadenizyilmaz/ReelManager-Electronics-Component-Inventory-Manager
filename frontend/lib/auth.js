export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("reel-user") || "null"); } catch { return null; }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("reel-token");
}
