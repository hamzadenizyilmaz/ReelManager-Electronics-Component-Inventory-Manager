import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("reel-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (typeof window !== "undefined" && status === 401) {
      localStorage.removeItem("reel-token");
      localStorage.removeItem("reel-user");
      if (!window.location.pathname.includes("/login")) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function unwrap(response) {
  return response?.data?.data ?? response?.data;
}

export function apiError(error, fallback = "İşlem tamamlanamadı") {
  return error?.response?.data?.message || error?.message || fallback;
}

export const endpoints = {
  auth: {
    login: (payload) => api.post("/auth/login", payload),
    me: () => api.get("/auth/me"),
    logout: () => api.post("/auth/logout")
  },
  dashboard: {
    summary: () => api.get("/dashboard/summary"),
    categories: () => api.get("/dashboard/category-stats"),
    suppliers: () => api.get("/dashboard/supplier-stats"),
    packages: () => api.get("/dashboard/package-stats"),
    movements: () => api.get("/dashboard/recent-movements")
  },
  datasheets: {
    providers: () => api.get("/datasheets/providers"),
    search: (query, params = {}) => api.get("/datasheets/search", { params: { query, ...params } }),
    enrich: (mpn, params = {}) => api.get("/datasheets/enrich", { params: { mpn, ...params } })
  },
  components: {
    list: (params) => api.get("/components", { params }),
    get: (id) => api.get(`/components/${id}`),
    create: (payload) => api.post("/components", payload),
    update: (id, payload) => api.put(`/components/${id}`, payload),
    remove: (id) => api.delete(`/components/${id}`),
    stockIn: (id, payload) => api.post(`/components/${id}/stock/in`, payload),
    stockOut: (id, payload) => api.post(`/components/${id}/stock/out`, payload),
    reserve: (id, payload) => api.post(`/components/${id}/reserve`, payload),
    release: (id, payload) => api.post(`/components/${id}/release`, payload),
    movements: (id) => api.get(`/components/${id}/movements`),
    barcode: (barcode) => api.get(`/components/barcode/${encodeURIComponent(barcode)}`),
    datasheet: (id) => api.get(`/components/${id}/datasheet`),
    datasheetProviders: () => api.get("/components/datasheet/providers"),
    enrich: (id, payload = {}) => api.post(`/components/${id}/enrich`, payload),
    bulkEnrich: (payload = {}) => api.post("/components/bulk-enrich", payload)
  },
  stock: {
    movements: () => api.get("/stock/movements"),
    low: () => api.get("/stock/low"),
    out: () => api.get("/stock/out-of-stock")
  },
  categories: crud("/categories"),
  suppliers: crud("/suppliers"),
  locations: crud("/locations"),
  projects: {
    ...crud("/projects"),
    addBom: (id, payload) => api.post(`/projects/${id}/bom`, payload),
    updateBom: (projectId, itemId, payload) => api.put(`/projects/${projectId}/bom/${itemId}`, payload),
    deleteBom: (projectId, itemId) => api.delete(`/projects/${projectId}/bom/${itemId}`),
    checkStock: (id) => api.post(`/projects/${id}/check-stock`),
    reserveStock: (id) => api.post(`/projects/${id}/reserve-stock`),
    consumeStock: (id) => api.post(`/projects/${id}/consume-stock`)
  },

  settings: {
    system: () => api.get("/settings/system"),
    updateSystem: (payload) => api.put("/settings/system", payload),
    users: () => api.get("/settings/users"),
    createUser: (payload) => api.post("/settings/users", payload),
    updateUser: (id, payload) => api.put(`/settings/users/${id}`, payload)
  },
  importExport: {
    importComponents: (formData) => api.post("/import/components", formData, { headers: { "Content-Type": "multipart/form-data" } }),
    csvUrl: () => `${API_URL}/export/components/csv`,
    xlsxUrl: () => `${API_URL}/export/components/xlsx`,
    bomPdfUrl: (id) => `${API_URL}/export/projects/${id}/bom/pdf`
  }
};

function crud(base) {
  return {
    list: () => api.get(base),
    get: (id) => api.get(`${base}/${id}`),
    create: (payload) => api.post(base, payload),
    update: (id, payload) => api.put(`${base}/${id}`, payload),
    remove: (id) => api.delete(`${base}/${id}`)
  };
}
