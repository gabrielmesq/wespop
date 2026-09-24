import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { createProductFn, getCategoriesFn } from "@/lib/admin-api";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/produtos/novo")({
  component: NovoProdutoPage,
});

interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: number;
}

function NovoProdutoPage() {
  const { token, user, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailsText, setDetailsText] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      navigate({ to: "/admin" });
    }
  }, [isLoading, user, token, navigate]);

  useEffect(() => {
    if (!token) return;
    getCategoriesFn({ data: { token } })
      .then((cats) => setCategories(cats as Category[]))
      .catch(() => {});
  }, [token]);

  if (isLoading || !user || !token) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!name.trim()) {
      toast.error("O nome do produto é obrigatório.");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Informe um preço válido.");
      return;
    }

    setSaving(true);
    try {
      const details = detailsText
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean);

      await createProductFn({
        data: {
          token,
          name: name.trim(),
          description: description.trim(),
          details,
          price: Number(price),
          image: image.trim(),
          categoryId: categoryId ? Number(categoryId) : null,
          isActive,
        },
      });

      toast.success("Produto criado com sucesso!");
      navigate({ to: "/admin/produtos" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar produto.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/produtos"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-2xl tracking-tight">Novo Produto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-border p-6 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Nome *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
              placeholder="Ex: Programa Premium"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none resize-none"
              placeholder="Descreva o produto..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Detalhes (um por linha)
            </label>
            <textarea
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              rows={3}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none resize-none"
              placeholder={"Benefício 1\nBenefício 2"}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">
                Preço (R$) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-2 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-2 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
              >
                <option value="">Sem categoria</option>
                {categories
                  .filter((c) => c.is_active)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Imagem do Programa (JPG/PNG)
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-3 h-32 w-32 rounded object-cover bg-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-5 w-9 rounded-full bg-muted peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm text-muted-foreground">
              {isActive ? "Produto ativo (visível na loja)" : "Produto inativo (oculto da loja)"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/admin/produtos"
            className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Criar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
}
