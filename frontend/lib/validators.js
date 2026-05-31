import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli e-posta gir"),
  password: z.string().min(1, "Şifre gerekli")
});

export const componentSchema = z.object({
  manufacturer_part_number: z.string().min(1, "Part number zorunlu"),
  category_id: z.coerce.number().min(1, "Kategori zorunlu"),
  supplier_id: z.coerce.number().optional().nullable(),
  name: z.string().optional(),
  value: z.string().optional(),
  package_case: z.string().optional(),
  quantity_total: z.coerce.number().min(0),
  minimum_stock: z.coerce.number().min(0)
});
