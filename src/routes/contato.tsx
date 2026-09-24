import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato - WESPOP" },
      {
        name: "description",
        content: "Fale com a WESPOP sobre nossos programas e acesso vitalício.",
      },
      { property: "og:title", content: "Contato - WESPOP" },
      {
        property: "og:description",
        content: "Fale com a WESPOP sobre nossos programas e acesso vitalício.",
      },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Contato</h1>
      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Dúvidas sobre nossos programas, acesso ou benefícios? Escreva para nós e respondemos em até
        um dia útil.
      </p>

      {sent ? (
        <div className="mt-12 rounded-lg bg-green-500/10 p-6 text-sm text-green-600">
          Obrigado pelo contato. Retornaremos em breve.
        </div>
      ) : (
        <form
          className="mt-12 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-xs uppercase tracking-widest text-muted-foreground"
            >
              Nome
            </label>
            <input
              id="name"
              required
              className="mt-3 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-widest text-muted-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-3 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-widest text-muted-foreground"
            >
              Mensagem
            </label>
            <textarea
              id="message"
              required
              rows={4}
              className="mt-3 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-foreground px-8 py-3 text-sm text-background hover:bg-foreground/90"
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}
