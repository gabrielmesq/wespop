import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/sucesso")({
  head: () => ({
    meta: [{ title: "Pedido Confirmado — WESPOP" }],
  }),
  component: SucessoPage,
});

function SucessoPage() {
  const { clear } = useCart();

  useEffect(() => {
    // Limpa o carrinho após a compra ser finalizada no MP
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-4xl tracking-tight text-green-600">
        Pedido pago e registrado!
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Obrigado pela sua compra. Seu pagamento foi aprovado e enviaremos os detalhes e acessos
        diretamente para o seu e-mail.
      </p>
      <Link to="/" className="mt-8 inline-block border-b border-foreground pb-0.5 text-sm">
        Voltar para a loja
      </Link>
    </div>
  );
}
