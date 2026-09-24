import { createServerFn } from "@tanstack/react-start";
import { getPool } from "./db";
import { authenticateUser, verifyToken, type AdminUser } from "./auth";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ============================================================
// Types
// ============================================================

export interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  image: string;
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  is_active: number;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats extends RowDataPacket {
  total_products: number;
  active_products: number;
  total_categories: number;
  active_categories: number;
}

// ============================================================
// Auth helper - reuse across all admin server functions
// ============================================================

async function requireAuth(token: string | undefined): Promise<AdminUser> {
  if (!token) throw new Error("Token não fornecido");
  const user = await verifyToken(token);
  if (!user) throw new Error("Sessão expirada. Faça login novamente.");
  return user;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ============================================================
// AUTH
// ============================================================

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: { emailOrUsername: string; password: string }) => data)
  .handler(async ({ data }) => {
    const result = await authenticateUser(data.emailOrUsername, data.password);
    return result;
  });

export const verifySessionFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const user = await verifyToken(data.token);
    return user;
  });

// ============================================================
// DASHBOARD
// ============================================================

export const getDashboardStatsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();

    const [products] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total, SUM(is_active) as active FROM products",
    );
    const [categories] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total, SUM(is_active) as active FROM categories",
    );
    const [recent] = await pool.execute<ProductRow[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC LIMIT 5`,
    );

    return {
      totalProducts: Number(products[0]?.["total"] ?? 0),
      activeProducts: Number(products[0]?.["active"] ?? 0),
      totalCategories: Number(categories[0]?.["total"] ?? 0),
      activeCategories: Number(categories[0]?.["active"] ?? 0),
      recentProducts: recent,
    };
  });

// ============================================================
// PRODUCTS
// ============================================================

export const getProductsFn = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; search?: string; categoryId?: number; status?: string }) => data,
  )
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();

    let query = `SELECT p.*, c.name as category_name, c.slug as category_slug
                 FROM products p LEFT JOIN categories c ON p.category_id = c.id
                 WHERE 1=1`;
    const params: (string | number)[] = [];

    if (data.search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${data.search}%`, `%${data.search}%`);
    }
    if (data.categoryId) {
      query += " AND p.category_id = ?";
      params.push(data.categoryId);
    }
    if (data.status === "active") {
      query += " AND p.is_active = TRUE";
    } else if (data.status === "inactive") {
      query += " AND p.is_active = FALSE";
    }

    query += " ORDER BY p.created_at DESC";

    const [rows] = await pool.execute<ProductRow[]>(query, params);
    return rows;
  });

export const getProductFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    const [rows] = await pool.execute<ProductRow[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [data.id],
    );
    return rows[0] ?? null;
  });

export const createProductFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      name: string;
      description: string;
      details: string[];
      price: number;
      image: string;
      categoryId: number | null;
      isActive: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    const slug = slugify(data.name);

    try {
      // Check for duplicate slug
      const [existing] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM products WHERE slug = ?",
        [slug],
      );
      if (existing.length > 0) {
        throw new Error("Já existe um produto com nome similar. Use um nome diferente.");
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO products (name, slug, description, details, price, image, category_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          slug,
          data.description,
          JSON.stringify(data.details),
          data.price,
          data.image,
          data.categoryId,
          data.isActive ? 1 : 0,
        ],
      );

      return { id: result.insertId, slug };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(message || "Erro interno ao banco de dados.");
    }
  });

export const updateProductFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      id: number;
      name: string;
      description: string;
      details: string[];
      price: number;
      image: string;
      categoryId: number | null;
      isActive: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    const slug = slugify(data.name);

    try {
      // Check for duplicate slug (excluding self)
      const [existing] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM products WHERE slug = ? AND id != ?",
        [slug, data.id],
      );
      if (existing.length > 0) {
        throw new Error("Já existe um produto com nome similar. Use um nome diferente.");
      }

      await pool.execute(
        `UPDATE products SET name=?, slug=?, description=?, details=?, price=?, image=?, category_id=?, is_active=?, updated_at=NOW()
         WHERE id=?`,
        [
          data.name,
          slug,
          data.description,
          JSON.stringify(data.details),
          data.price,
          data.image,
          data.categoryId,
          data.isActive ? 1 : 0,
          data.id,
        ],
      );

      return { id: data.id, slug };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(message || "Erro interno ao atualizar produto no banco de dados.");
    }
  });

export const deleteProductFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    await pool.execute("DELETE FROM products WHERE id = ?", [data.id]);
    return { success: true };
  });

export const toggleProductStatusFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; isActive: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    await pool.execute("UPDATE products SET is_active = ?, updated_at = NOW() WHERE id = ?", [
      data.isActive,
      data.id,
    ]);
    return { success: true };
  });

// ============================================================
// CATEGORIES
// ============================================================

export const getCategoriesFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    const [rows] = await pool.execute<CategoryRow[]>(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id
       ORDER BY c.name ASC`,
    );
    return rows;
  });

export const getCategoryFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    const [rows] = await pool.execute<CategoryRow[]>(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c LEFT JOIN products p ON c.id = p.category_id
       WHERE c.id = ?
       GROUP BY c.id`,
      [data.id],
    );
    return rows[0] ?? null;
  });

export const createCategoryFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; name: string; isActive: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    const slug = slugify(data.name);

    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM categories WHERE slug = ?",
      [slug],
    );
    if (existing.length > 0) {
      throw new Error("Já existe uma categoria com nome similar.");
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO categories (name, slug, is_active) VALUES (?, ?, ?)",
      [data.name, slug, data.isActive],
    );

    return { id: result.insertId, slug };
  });

export const updateCategoryFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; name: string; isActive: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    const slug = slugify(data.name);

    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM categories WHERE slug = ? AND id != ?",
      [slug, data.id],
    );
    if (existing.length > 0) {
      throw new Error("Já existe uma categoria com nome similar.");
    }

    await pool.execute(
      "UPDATE categories SET name=?, slug=?, is_active=?, updated_at=NOW() WHERE id=?",
      [data.name, slug, data.isActive, data.id],
    );

    return { id: data.id, slug };
  });

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();

    // Check for linked products
    const [products] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [data.id],
    );
    const productCount = Number(products[0]?.["count"] ?? 0);
    if (productCount > 0) {
      throw new Error(
        `Não é possível excluir esta categoria. Existem ${productCount} produto(s) vinculado(s). Remova ou mova os produtos antes.`,
      );
    }

    await pool.execute("DELETE FROM categories WHERE id = ?", [data.id]);
    return { success: true };
  });

export const toggleCategoryStatusFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; isActive: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAuth(data.token);
    const pool = getPool();
    await pool.execute("UPDATE categories SET is_active = ?, updated_at = NOW() WHERE id = ?", [
      data.isActive,
      data.id,
    ]);
    return { success: true };
  });

// ============================================================
// PUBLIC API - for the storefront (no auth needed)
// ============================================================

export const getPublicProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const pool = getPool();
  const [rows] = await pool.execute<ProductRow[]>(
    `SELECT p.id, p.name, p.slug, p.description, p.details, p.price, p.image,
              c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = TRUE AND (c.is_active = TRUE OR p.category_id IS NULL)
       ORDER BY p.created_at DESC`,
  );
  return rows;
});

export const getPublicProductFn = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const pool = getPool();
    const [rows] = await pool.execute<ProductRow[]>(
      `SELECT p.id, p.name, p.slug, p.description, p.details, p.price, p.image,
              c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.is_active = TRUE`,
      [data.slug],
    );
    return rows[0] ?? null;
  });

export const getPublicCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, slug FROM categories WHERE is_active = TRUE ORDER BY name ASC",
  );
  return rows;
});
