import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { staticProducts, dbProductToProduct, type Category, type Product } from "@/lib/products";
import { getPublicProductsFn, getPublicCategoriesFn } from "@/lib/admin-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WESPOP" },
      {
        name: "description",
        content: "Tecnologia desenhada para a excelência.",
      },
      { property: "og:title", content: "WESPOP" },
      {
        property: "og:description",
        content: "Tecnologia desenhada para a excelência.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState<string>("todos");
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: "masculino", label: "Masculinos" },
    { value: "feminino", label: "Femininos" },
    { value: "personalizado", label: "Personalizados" },
  ]);
  const [loaded, setLoaded] = useState(false);

  // Try to load from database; fall back to static data if MySQL isn't available
  useEffect(() => {
    if (loaded) return;

    Promise.all([
      getPublicProductsFn().catch(() => null),
      getPublicCategoriesFn().catch(() => null),
    ])
      .then(([prodsRows, catsRows]) => {
        if (prodsRows && Array.isArray(prodsRows) && prodsRows.length > 0) {
          setProducts(
            prodsRows.map((r: Parameters<typeof dbProductToProduct>[0]) => dbProductToProduct(r)),
          );
        }
        if (catsRows && Array.isArray(catsRows) && catsRows.length > 0) {
          setCategories(
            catsRows.map((c: { slug: string; name: string }) => ({ value: c.slug, label: c.name })),
          );
        }
      })
      .finally(() => setLoaded(true));
  }, [loaded]);

  const list = active === "todos" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="border-b border-border py-20">
        <h1 className="max-w-2xl font-display text-4xl leading-[1.1] tracking-tight sm:text-6xl">
          Visão além do topo.
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          Somos uma pequena empresa dedicada a produzir programas poderosos de alta qualidade para
          você se beneficiar. O conhecimento real do jogo é o que faz quem nós somos.
        </p>
      </section>

      <div className="flex flex-wrap gap-6 py-8 text-sm">
        <button
          onClick={() => setActive("todos")}
          className={
            active === "todos"
              ? "border-b border-foreground pb-0.5 text-foreground"
              : "border-b border-transparent pb-0.5 text-muted-foreground hover:text-foreground"
          }
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setActive(c.value)}
            className={
              active === c.value
                ? "border-b border-foreground pb-0.5 text-foreground"
                : "border-b border-transparent pb-0.5 text-muted-foreground hover:text-foreground"
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-x-8 gap-y-14 pb-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </div>
  );
}
