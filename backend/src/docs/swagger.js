const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "SMD Stock Manager API",
    version: "2.2.0-Enterprise",
    description: "SMD Stock Manager / Component Inventory Manager backend API documentation."
  },
  servers: [
    { url: "http://localhost:4000/api", description: "Local API" }
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Dashboard" },
    { name: "Components" },
    { name: "Stock" },
    { name: "Categories" },
    { name: "Suppliers" },
    { name: "Locations" },
    { name: "Projects" },
    { name: "ImportExport" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@example.com" },
          password: { type: "string", example: "Admin123!" }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Admin User" },
          email: { type: "string", format: "email", example: "admin@example.com" },
          password: { type: "string", example: "Admin123!" },
          role: { type: "string", enum: ["admin", "user", "viewer"], example: "admin" }
        }
      },
      CategoryInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Resistor" },
          slug: { type: "string", example: "resistor" },
          description: { type: "string", example: "SMD resistors" }
        }
      },
      SupplierInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Özdisan" },
          website: { type: "string", example: "https://www.ozdisan.com" },
          contactName: { type: "string", example: "Sales" },
          contactEmail: { type: "string", format: "email", example: "sales@example.com" },
          phone: { type: "string", example: "+90 212 000 00 00" },
          notes: { type: "string", example: "Preferred supplier" }
        }
      },
      LocationInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Raf A / Kutu 1" },
          code: { type: "string", example: "RAF-A-KUTU-1" },
          description: { type: "string", example: "SMD resistor box" },
          parentId: { type: "integer", nullable: true, example: null }
        }
      },
      ComponentInput: {
        type: "object",
        required: ["manufacturer_part_number", "category_id"],
        properties: {
          manufacturer_part_number: { type: "string", example: "RC0402FR-07330RL" },
          supplier_part_number: { type: "string", example: "RC0402FR-07330RL" },
          manufacturer: { type: "string", example: "YAGEO" },
          category_id: { type: "integer", example: 1 },
          supplier_id: { type: "integer", example: 1 },
          name: { type: "string", example: "330 Ohm 0402 Resistor" },
          description: { type: "string", example: "SMD resistor 330 Ohm 1%" },
          package_case: { type: "string", example: "0402" },
          value: { type: "string", example: "330 Ohm" },
          value_numeric: { type: "number", example: 330 },
          unit: { type: "string", example: "Ohm" },
          tolerance: { type: "string", example: "1%" },
          power_rating: { type: "string", example: "1/16W" },
          quantity_total: { type: "integer", example: 100 },
          quantity_available: { type: "integer", example: 100 },
          minimum_stock: { type: "integer", example: 20 },
          storage_location_id: { type: "integer", example: 1 },
          datasheet_url: { type: "string", example: "https://example.com/datasheet.pdf" },
          product_url: { type: "string", example: "https://www.ozdisan.com" }
        }
      },
      StockMovementInput: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "integer", minimum: 1, example: 10 },
          reason: { type: "string", example: "Manual stock update" },
          project_id: { type: "integer", nullable: true, example: null },
          notes: { type: "string", example: "Stock operation note" }
        }
      },
      ProjectInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "ESP32-S3 Board" },
          code: { type: "string", example: "ESP32-S3" },
          description: { type: "string", example: "Custom ESP32-S3 board" },
          status: { type: "string", enum: ["draft", "active", "completed", "cancelled"], example: "active" }
        }
      },
      BomItemInput: {
        type: "object",
        required: ["component_id", "required_quantity"],
        properties: {
          component_id: { type: "integer", example: 1 },
          reference_designator: { type: "string", example: "R1, R2, R3" },
          required_quantity: { type: "integer", example: 3 },
          notes: { type: "string", example: "Pull-up resistors" }
        }
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation error" },
          errors: { type: "array", items: { type: "object" } }
        }
      }
    }
  },
  paths: {
    "/health": { get: { tags: ["Health"], summary: "Health check", responses: { 200: { description: "API is running" } } } },
    "/auth/register": { post: { tags: ["Auth"], summary: "Register", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } } }, responses: { 201: { description: "User registered" } } } },
    "/auth/login": { post: { tags: ["Auth"], summary: "Login", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } }, responses: { 200: { description: "Login successful" }, 401: { description: "Invalid email or password" } } } },
    "/auth/logout": { post: { tags: ["Auth"], summary: "Logout", security: [{ bearerAuth: [] }], responses: { 200: { description: "Logout successful" } } } },
    "/auth/me": { get: { tags: ["Auth"], summary: "Current user", security: [{ bearerAuth: [] }], responses: { 200: { description: "Current user" }, 401: { description: "Unauthorized" } } } },
    "/auth/refresh": { post: { tags: ["Auth"], summary: "Refresh token", security: [{ bearerAuth: [] }], responses: { 200: { description: "Token refreshed" } } } },
    "/dashboard/summary": { get: { tags: ["Dashboard"], summary: "Dashboard summary", security: [{ bearerAuth: [] }], responses: { 200: { description: "Dashboard summary" } } } },
    "/dashboard/category-stats": { get: { tags: ["Dashboard"], summary: "Category statistics", security: [{ bearerAuth: [] }], responses: { 200: { description: "Category statistics" } } } },
    "/dashboard/supplier-stats": { get: { tags: ["Dashboard"], summary: "Supplier statistics", security: [{ bearerAuth: [] }], responses: { 200: { description: "Supplier statistics" } } } },
    "/dashboard/package-stats": { get: { tags: ["Dashboard"], summary: "Package statistics", security: [{ bearerAuth: [] }], responses: { 200: { description: "Package statistics" } } } },
    "/dashboard/recent-movements": { get: { tags: ["Dashboard"], summary: "Recent movements", security: [{ bearerAuth: [] }], responses: { 200: { description: "Recent movements" } } } },

    "/datasheets/providers": {
      get: {
        tags: ["Datasheets"],
        summary: "List datasheet enrichment provider order",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Provider order" } }
      }
    },
    "/datasheets/search": {
      get: {
        tags: ["Datasheets"],
        summary: "Search component information from local database, APIs and parser",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "query", in: "query", required: true, schema: { type: "string" }, example: "RC0402FR-07330RL" },
          { name: "force", in: "query", required: false, schema: { type: "boolean" }, example: false }
        ],
        responses: { 200: { description: "Normalized search results" } }
      }
    },
    "/datasheets/enrich": {
      get: {
        tags: ["Datasheets"],
        summary: "Return best enrichment result for one manufacturer part number",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "mpn", in: "query", required: true, schema: { type: "string" }, example: "RC0402FR-07330RL" },
          { name: "manual_datasheet_url", in: "query", required: false, schema: { type: "string" } }
        ],
        responses: { 200: { description: "Best enrichment result" } }
      }
    },
    "/components": { get: { tags: ["Components"], summary: "List components", security: [{ bearerAuth: [] }], parameters: [{ name: "page", in: "query", schema: { type: "integer", default: 1 } }, { name: "limit", in: "query", schema: { type: "integer", default: 20 } }, { name: "search", in: "query", schema: { type: "string" } }], responses: { 200: { description: "Component list" } } }, post: { tags: ["Components"], summary: "Create component", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ComponentInput" } } } }, responses: { 201: { description: "Component created" } } } },
    "/components/search": { get: { tags: ["Components"], summary: "Search components", security: [{ bearerAuth: [] }], parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }], responses: { 200: { description: "Search results" } } } },
    "/components/barcode/{barcode}": { get: { tags: ["Components"], summary: "Find by barcode", security: [{ bearerAuth: [] }], parameters: [{ name: "barcode", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Component found" } } } },
    "/components/{id}": { get: { tags: ["Components"], summary: "Get component", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Component detail" } } }, put: { tags: ["Components"], summary: "Update component", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ComponentInput" } } } }, responses: { 200: { description: "Component updated" } } }, delete: { tags: ["Components"], summary: "Delete component", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Component deleted" } } } },

    "/components/{id}/enrich": {
      post: {
        tags: ["Datasheets", "Components"],
        summary: "Enrich and update an existing component",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: false,
          content: { "application/json": { schema: { type: "object", properties: { force: { type: "boolean", example: false } } } } }
        },
        responses: { 200: { description: "Component enriched" } }
      }
    },
    "/components/bulk-enrich": {
      post: {
        tags: ["Datasheets", "Components"],
        summary: "Bulk enrich components",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: { "application/json": { schema: { type: "object", properties: { ids: { type: "array", items: { type: "integer" } }, force: { type: "boolean" } } } } }
        },
        responses: { 200: { description: "Bulk enrichment completed" } }
      }
    },
    "/components/{id}/stock/in": { post: { tags: ["Stock"], summary: "Add stock", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/StockMovementInput" } } } }, responses: { 200: { description: "Stock added" } } } },
    "/components/{id}/stock/out": { post: { tags: ["Stock"], summary: "Remove stock", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/StockMovementInput" } } } }, responses: { 200: { description: "Stock removed" } } } },
    "/components/{id}/reserve": { post: { tags: ["Stock"], summary: "Reserve stock", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/StockMovementInput" } } } }, responses: { 200: { description: "Stock reserved" } } } },
    "/components/{id}/release": { post: { tags: ["Stock"], summary: "Release reserved stock", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/StockMovementInput" } } } }, responses: { 200: { description: "Reserved stock released" } } } },
    "/components/{id}/movements": { get: { tags: ["Stock"], summary: "Component movements", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Component movements" } } } },
    "/stock/movements": { get: { tags: ["Stock"], summary: "All stock movements", security: [{ bearerAuth: [] }], responses: { 200: { description: "Stock movement list" } } } },
    "/stock/low": { get: { tags: ["Stock"], summary: "Low stock", security: [{ bearerAuth: [] }], responses: { 200: { description: "Low stock list" } } } },
    "/stock/out-of-stock": { get: { tags: ["Stock"], summary: "Out of stock", security: [{ bearerAuth: [] }], responses: { 200: { description: "Out of stock list" } } } },
    "/categories": { get: { tags: ["Categories"], summary: "List categories", security: [{ bearerAuth: [] }], responses: { 200: { description: "Category list" } } }, post: { tags: ["Categories"], summary: "Create category", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryInput" } } } }, responses: { 201: { description: "Category created" } } } },
    "/categories/{id}": { put: { tags: ["Categories"], summary: "Update category", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryInput" } } } }, responses: { 200: { description: "Category updated" } } }, delete: { tags: ["Categories"], summary: "Delete category", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Category deleted" } } } },
    "/suppliers": { get: { tags: ["Suppliers"], summary: "List suppliers", security: [{ bearerAuth: [] }], responses: { 200: { description: "Supplier list" } } }, post: { tags: ["Suppliers"], summary: "Create supplier", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/SupplierInput" } } } }, responses: { 201: { description: "Supplier created" } } } },
    "/suppliers/{id}": { put: { tags: ["Suppliers"], summary: "Update supplier", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/SupplierInput" } } } }, responses: { 200: { description: "Supplier updated" } } }, delete: { tags: ["Suppliers"], summary: "Delete supplier", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Supplier deleted" } } } },
    "/locations": { get: { tags: ["Locations"], summary: "List locations", security: [{ bearerAuth: [] }], responses: { 200: { description: "Location list" } } }, post: { tags: ["Locations"], summary: "Create location", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/LocationInput" } } } }, responses: { 201: { description: "Location created" } } } },
    "/locations/{id}": { put: { tags: ["Locations"], summary: "Update location", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/LocationInput" } } } }, responses: { 200: { description: "Location updated" } } }, delete: { tags: ["Locations"], summary: "Delete location", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Location deleted" } } } },
    "/projects": { get: { tags: ["Projects"], summary: "List projects", security: [{ bearerAuth: [] }], responses: { 200: { description: "Project list" } } }, post: { tags: ["Projects"], summary: "Create project", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectInput" } } } }, responses: { 201: { description: "Project created" } } } },
    "/projects/{id}": { get: { tags: ["Projects"], summary: "Project detail", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Project detail" } } }, put: { tags: ["Projects"], summary: "Update project", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectInput" } } } }, responses: { 200: { description: "Project updated" } } }, delete: { tags: ["Projects"], summary: "Delete project", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Project deleted" } } } },
    "/projects/{id}/bom": { post: { tags: ["Projects"], summary: "Add BOM item", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/BomItemInput" } } } }, responses: { 201: { description: "BOM item added" } } } },
    "/projects/{id}/check-stock": { post: { tags: ["Projects"], summary: "Check BOM stock", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "BOM stock check" } } } },
    "/projects/{id}/reserve-stock": { post: { tags: ["Projects"], summary: "Reserve BOM stock", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "BOM stock reserved" } } } },
    "/projects/{id}/consume-stock": { post: { tags: ["Projects"], summary: "Consume BOM stock", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "BOM stock consumed" } } } },
    "/import/components": { post: { tags: ["ImportExport"], summary: "Import components CSV/XLSX", security: [{ bearerAuth: [] }], requestBody: { content: { "multipart/form-data": { schema: { type: "object", properties: { file: { type: "string", format: "binary" } } } } } }, responses: { 200: { description: "Import preview" } } } },
    "/export/components/csv": { get: { tags: ["ImportExport"], summary: "Export components CSV", security: [{ bearerAuth: [] }], responses: { 200: { description: "CSV export" } } } },
    "/export/components/xlsx": { get: { tags: ["ImportExport"], summary: "Export components XLSX", security: [{ bearerAuth: [] }], responses: { 200: { description: "XLSX export" } } } },
    "/export/projects/{id}/bom/pdf": { get: { tags: ["ImportExport"], summary: "Export project BOM PDF", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "PDF export", content: { "application/pdf": { schema: { type: "string", format: "binary" } } } } } } }
  }
};

module.exports = swaggerSpec;
