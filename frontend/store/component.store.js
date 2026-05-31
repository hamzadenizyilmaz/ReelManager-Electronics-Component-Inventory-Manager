"use client";

import { create } from "zustand";
import { apiError, endpoints, unwrap } from "../lib/api";

export const useComponentStore = create((set) => ({
  items: [],
  meta: { total: 0, page: 1, limit: 20, pages: 1 },
  loading: false,
  error: null,
  async fetch(params = {}) {
    set({ loading: true, error: null });
    try {
      const data = unwrap(await endpoints.components.list(params));
      set({ items: data.items || [], meta: data, loading: false });
      return data;
    } catch (error) {
      const message = apiError(error);
      set({ error: message, loading: false });
      throw new Error(message);
    }
  }
}));
