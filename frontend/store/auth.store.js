"use client";

import { create } from "zustand";
import { apiError, endpoints, unwrap } from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  hydrated: false,
  loading: false,
  error: null,
  hydrate() {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("reel-token");
    const raw = localStorage.getItem("reel-user");
    let user = null;
    try { user = raw ? JSON.parse(raw) : null; } catch { user = null; }
    set({ token, user, hydrated: true });
  },
  async login(payload) {
    set({ loading: true, error: null });
    try {
      const data = unwrap(await endpoints.auth.login(payload));
      localStorage.setItem("reel-token", data.token);
      localStorage.setItem("reel-user", JSON.stringify(data.user));
      set({ token: data.token, user: data.user, loading: false, error: null, hydrated: true });
      return data;
    } catch (error) {
      const message = apiError(error, "Giriş başarısız");
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  async verify() {
    if (!get().token) return null;
    try {
      const user = unwrap(await endpoints.auth.me());
      localStorage.setItem("reel-user", JSON.stringify(user));
      set({ user });
      return user;
    } catch {
      get().logout();
      return null;
    }
  },
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("reel-token");
      localStorage.removeItem("reel-user");
    }
    set({ user: null, token: null, hydrated: true });
  }
}));
