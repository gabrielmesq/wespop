import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós - WESPOP" },
      {
        name: "description",
        content: "Nós produzimos programas poderosos de alta qualidade.",
      },
      { property: "og:title", content: "Sobre nós - WESPOP" },
      {
        property: "og:description",
        content: "Nós produzimos programas poderosos de alta qualidade.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Sobre nós</h1>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Somos uma pequena empresa dedicada a produzir programas poderosos de alta qualidade para
          você se beneficiar.
        </p>
        <p>
          Também produzimos outros conteúdos, como livros eletrônicos que são instalados diretamente
          nos microtúbulos do seu cérebro, onde toda informação é diretamente instalada na sua mente
          consciente!
        </p>
        <p>
          O principal impulso da nossa operação são os programas. Estamos no topo do jogo com nossos
          métodos poderosos, sem dúvida. O conhecimento real do jogo é o que faz quem nós somos.
        </p>
      </div>
    </div>
  );
}
