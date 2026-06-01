"use client";
import { create } from "zustand";
import { apiError, endpoints, unwrap, clearAuthSession, getStoredToken, saveAuthSession } from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null, token: null, hydrated: false, loading: false, error: null,
  hydrate() {
    if (typeof window === "undefined") return;
    const token = getStoredToken();
    const raw = localStorage.getItem("reel-user") || localStorage.getItem("user") || localStorage.getItem("reelmanager_user");
    let user = null; try { user = raw ? JSON.parse(raw) : null; } catch { user = null; }
    set({ token, user, hydrated: true });
  },
  async login(payload) {
    set({ loading: true, error: null });
    try {
      const data = unwrap(await endpoints.auth.login(payload));
      const token = data?.token || data?.accessToken || data?.access_token;
      const user = data?.user || {};
      if (!token) throw new Error("Oturum anahtarı alınamadı");
      saveAuthSession(token, user);
      set({ token, user, loading: false, error: null, hydrated: true });
      return data;
    } catch (error) {
      const message = apiError(error, "E-posta veya şifreyi kontrol ediniz");
      clearAuthSession(); set({ token: null, user: null, loading: false, error: message, hydrated: true });
      throw new Error(message);
    }
  },
  async verify() {
    if (!get().token) return null;
    try { const user = unwrap(await endpoints.auth.me()); localStorage.setItem("reel-user", JSON.stringify(user)); set({ user }); return user; }
    catch { get().logout(); return null; }
  },
  logout() { clearAuthSession(); set({ user: null, token: null, hydrated: true }); }
}));
