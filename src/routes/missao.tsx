import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/missao")({
  head: () => ({
    meta: [
      { title: "Nossa missão - WESPOP" },
      {
        name: "description",
        content: "Trabalhamos diariamente para ficar sempre no topo.",
      },
      { property: "og:title", content: "Nossa missão - WESPOP" },
      {
        property: "og:description",
        content: "Trabalhamos diariamente para ficar sempre no topo.",
      },
    ],
  }),
  component: MissaoPage,
});

const pontos = [
  {
    titulo: "Excelência e Liderança",
    texto:
      "Trabalhamos diariamente para ficar sempre no topo. Para atingir esta missão, os nossos valores estão na base daquilo que somos, daquilo que fazemos e de como trabalhamos.",
  },
  {
    titulo: "Compromisso com Pessoas",
    texto:
      "Temos um compromisso inabalável com as pessoas. Proporcionamos oportunidades e promovemos talentos de alta performance.",
  },
  {
    titulo: "Desenvolvimento Contínuo",
    texto:
      "Desenvolvemos líderes e recompensamos resultados. Acreditamos que a formação e o desenvolvimento de competências pessoais e profissionais é crucial para assegurar o êxito.",
  },
];

function MissaoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Nossa missão</h1>
      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Nossa missão é impulsionar a sua mente ao nível mais elevado através de programas poderosos.
      </p>

      <dl className="mt-12 divide-y divide-border border-t border-border">
        {pontos.map((p) => (
          <div key={p.titulo} className="py-6">
            <dt className="text-sm font-semibold">{p.titulo}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.texto}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
