import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  getCategoriesFn,
  createCategoryFn,
  updateCategoryFn,
  deleteCategoryFn,
  toggleCategoryStatusFn,
} from "@/lib/admin-api";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Tags, Package } from "lucide-react";

export const Route = createFileRoute("/admin/categorias")({
  component: CategoriasPage,
});

interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: number;
  product_count: number;
  created_at: string;
  updated_at: string;
}

function CategoriasPage() {
  const { token, user, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const cats = await getCategoriesFn({ data: { token } });
      setCategories(cats as Category[]);
    } catch {
      toast.error("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      navigate({ to: "/admin" });
    }
  }, [isLoading, user, token, navigate]);

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token, fetchCategories]);

  if (isLoading || !user || !token) return null;

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
    setFormActive(true);
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormName(category.name);
    setFormActive(Boolean(category.is_active));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!formName.trim()) {
      toast.error("O nome da categoria é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateCategoryFn({
          data: { token, id: editingId, name: formName.trim(), isActive: formActive },
        });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await createCategoryFn({
          data: { token, name: formName.trim(), isActive: formActive },
        });
        toast.success("Categoria criada com sucesso!");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar categoria.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: number, currentActive: number) => {
    if (!token) return;
    try {
      await toggleCategoryStatusFn({ data: { token, id, isActive: !currentActive } });
      toast.success(currentActive ? "Categoria desativada." : "Categoria ativada.");
      fetchCategories();
    } catch {
      toast.error("Erro ao alterar status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteCategoryFn({ data: { token, id } });
      toast.success("Categoria excluída com sucesso.");
      setDeleteConfirm(null);
      fetchCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir categoria.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl tracking-tight">Categorias</h1>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nova Categoria
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border p-5 space-y-4">
          <h2 className="text-sm font-medium">
            {editingId ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Nome *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              autoFocus
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
              placeholder="Ex: Bebidas"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formActive}
                onChange={(e) => setFormActive(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-5 w-9 rounded-full bg-muted peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm text-muted-foreground">
              {formActive ? "Ativa" : "Inativa"}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Salvando..." : editingId ? "Salvar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-md border border-border bg-muted/50"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Tags className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">Nenhuma categoria encontrada.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produtos</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      {cat.product_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(cat.id, cat.is_active)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                        cat.is_active
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      }`}
                    >
                      {cat.is_active ? (
                        <>
                          <Eye className="h-3 w-3" /> Ativa
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Inativa
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {deleteConfirm === cat.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(cat.id)}
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
                          onClick={() => setDeleteConfirm(cat.id)}
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
      )}
    </div>
  );
}
