import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import {
  categories,
  formatPrice,
  getProduct,
  dbProductToProduct,
  type Product,
} from "@/lib/products";
import { getPublicProductFn } from "@/lib/admin-api";

export const Route = createFileRoute("/produto/$id")({
  loader: ({ params }) => {
    // Try static products first (for SSR compatibility)
    const product = getProduct(params.id);
    return { product: product ?? null, slug: params.id };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.product) {
      return { meta: [{ title: "Produto - WESPOP" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} - WESPOP` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} - WESPOP` },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProdutoPage,
});

function ProdutoPage() {
  const { product: staticProduct, slug } = Route.useLoaderData();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(staticProduct);
  const [loading, setLoading] = useState(!staticProduct);

  // If not found in static list, try database
  useEffect(() => {
    if (staticProduct) return;
    setLoading(true);
    getPublicProductFn({ data: { slug } })
      .then((row) => {
        if (row) {
          setProduct(dbProductToProduct(row as Parameters<typeof dbProductToProduct>[0]));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, staticProduct]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-[4/5] w-full animate-pulse bg-muted" />
          <div className="space-y-4 lg:py-8">
            <div className="h-4 w-24 animate-pulse bg-muted" />
            <div className="h-10 w-64 animate-pulse bg-muted" />
            <div className="h-6 w-20 animate-pulse bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <p className="mt-4 text-sm text-muted-foreground">Produto não encontrado.</p>
          <Link to="/" className="mt-6 inline-block border-b border-foreground pb-0.5 text-sm">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = categories.find((c) => c.value === product.category)?.label;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-2">
      <img
        src={product.image}
        alt={product.name}
        width={1024}
        height={1280}
        className="aspect-[4/5] w-full bg-muted object-cover"
      />

      <div className="lg:py-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{categoryLabel}</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight">{product.name}</h1>
        <p className="mt-3 text-lg">{formatPrice(product.price)}</p>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <ul className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
          {product.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <button
          onClick={() => {
            add(product);
            setAdded(true);
          }}
          className="mt-10 w-full bg-primary px-6 py-4 text-sm text-primary-foreground transition-opacity hover:opacity-85 sm:w-auto"
        >
          Adicionar ao carrinho
        </button>

        {added && (
          <p className="mt-4 text-sm text-muted-foreground">
            Adicionado.{" "}
            <Link to="/carrinho" className="text-foreground underline underline-offset-4">
              Ver carrinho
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
