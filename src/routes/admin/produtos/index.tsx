import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  getProductsFn,
  deleteProductFn,
  toggleProductStatusFn,
  getCategoriesFn,
} from "@/lib/admin-api";
import { formatPrice } from "@/lib/products";
import { toast } from "sonner";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, MoreHorizontal, Package } from "lucide-react";

export const Route = createFileRoute("/admin/produtos/")({
  component: ProdutosPage,
});

interface Product {
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

interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: number;
  product_count: number;
}

function ProdutosPage() {
  const { token, user, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getProductsFn({
          data: {
            token,
            ...(search ? { search } : {}),
            ...(categoryFilter !== undefined ? { categoryId: categoryFilter } : {}),
            ...(statusFilter ? { status: statusFilter } : {}),
          },
        }),
        getCategoriesFn({ data: { token } }),
      ]);
      setProducts(prods as Product[]);
      setCategories(cats as Category[]);
    } catch {
      toast.error("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }, [token, search, categoryFilter, statusFilter]);

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      navigate({ to: "/admin" });
    }
  }, [isLoading, user, token, navigate]);

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token, categoryFilter, statusFilter, fetchProducts]);

  if (isLoading || !user || !token) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleToggleStatus = async (id: number, currentActive: number) => {
    if (!token) return;
    try {
      await toggleProductStatusFn({ data: { token, id, isActive: !currentActive } });
      toast.success(currentActive ? "Produto desativado." : "Produto ativado.");
      fetchProducts();
    } catch {
      toast.error("Erro ao alterar status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteProductFn({ data: { token, id } });
      toast.success("Produto removido com sucesso.");
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      toast.error("Erro ao remover produto.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl tracking-tight">Produtos</h1>
        <Link
          to="/admin/produtos/novo"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-foreground focus:outline-none"
            />
          </div>
        </form>
        <select
          value={categoryFilter ?? ""}
          onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-md border border-border bg-muted/50"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Package className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">Nenhum produto encontrado.</p>
          <Link
            to="/admin/produtos/novo"
            className="mt-4 text-sm text-foreground underline underline-offset-4"
          >
            Criar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Imagem</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Preço</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                    Criado em
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover bg-muted"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {product.category_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(product.id, product.is_active)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                          product.is_active
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        }`}
                      >
                        {product.is_active ? (
                          <>
                            <Eye className="h-3 w-3" /> Ativo
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> Inativo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {new Date(product.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/admin/produtos/$id"
                          params={{ id: String(product.id) }}
                          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="rounded-md bg-destructive px-2 py-1 text-xs text-destructive-foreground"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
