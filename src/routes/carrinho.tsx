import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { createCheckoutPreferenceFn } from "@/lib/checkout";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — wespop" },
      { name: "description", content: "Revise as peças selecionadas antes de finalizar." },
      { property: "og:title", content: "Carrinho — wespop" },
      {
        property: "og:description",
        content: "Revise as peças selecionadas antes de finalizar.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CarrinhoPage,
});

function CarrinhoPage() {
  const { lines, total, setQuantity, remove, clear } = useCart();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="font-display text-4xl tracking-tight">Pedido registrado.</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Enviamos a confirmação por e-mail. O pagamento online ainda não está ativo nesta loja.
        </p>
        <Link to="/" className="mt-8 inline-block border-b border-foreground pb-0.5 text-sm">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl tracking-tight">Carrinho</h1>

      {lines.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
          <Link to="/" className="mt-6 inline-block border-b border-foreground pb-0.5 text-sm">
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <ul className="border-t border-border">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-5 border-b border-border py-6">
                <img
                  src={line.product.image}
                  alt={line.product.name}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="h-28 w-22 shrink-0 bg-muted object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-baseline justify-between gap-4">
                    <Link
                      to="/produto/$id"
                      params={{ id: line.id }}
                      className="text-sm hover:underline hover:underline-offset-4"
                    >
                      {line.product.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(line.product.price * line.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center border border-border">
                      <button
                        aria-label="Diminuir quantidade"
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                        className="px-3 py-1 text-muted-foreground hover:text-foreground"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{line.quantity}</span>
                      <button
                        aria-label="Aumentar quantidade"
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                        className="px-3 py-1 text-muted-foreground hover:text-foreground"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(line.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit border border-border p-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-muted-foreground">calculado na entrega</span>
            </div>
            <button
              onClick={async () => {
                try {
                  const items = lines.map((line) => ({
                    id: String(line.product.id),
                    title: line.product.name,
                    quantity: line.quantity,
                    unit_price: line.product.price,
                    picture_url: line.product.image || "",
                  }));

                  const origin = window.location.origin;
                  const res = await createCheckoutPreferenceFn({ data: { items, origin } });

                  if (res.init_point) {
                    window.location.href = res.init_point;
                  }
                } catch (err) {
                  alert("Erro ao iniciar pagamento. Verifique as configurações do Mercado Pago.");
                }
              }}
              className="mt-8 w-full bg-primary px-6 py-4 text-sm text-primary-foreground transition-opacity hover:opacity-85"
            >
              Finalizar pedido
            </button>
            <button
              onClick={clear}
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Esvaziar carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
