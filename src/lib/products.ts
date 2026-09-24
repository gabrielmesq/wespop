export type Category = "masculino" | "feminino" | "personalizado";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  details: string[];
};

export const categories: { value: Category; label: string }[] = [
  { value: "masculino", label: "Masculinos" },
  { value: "feminino", label: "Femininos" },
  { value: "personalizado", label: "Personalizados" },
];

const defaultImg =
  "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg";

// Static fallback products — used when MySQL is unavailable (e.g. first deploy before DB setup)
export const staticProducts: Product[] = [
  {
    id: "prog-1",
    name: "Programa Infinito",
    category: "personalizado",
    price: 890,
    image: defaultImg,
    description: "Programa definitivo para transformação completa.",
    details: ["Reprogramação profunda", "Impacto em todas as áreas"],
  },
  {
    id: "prog-2",
    name: "Seja Um Milionário",
    category: "masculino",
    price: 1580,
    image: defaultImg,
    description: "Visão além do topo para riqueza ilimitada.",
    details: ["Foco financeiro", "Atração de abundância"],
  },
  {
    id: "prog-3",
    name: "Beleza Feminina",
    category: "feminino",
    price: 890,
    image: defaultImg,
    description: "Ative sua beleza natural de forma profunda.",
    details: ["Estética otimizada", "Resultados visíveis"],
  },
  {
    id: "prog-4",
    name: "Eterna Juventude",
    category: "personalizado",
    price: 390,
    image: defaultImg,
    description: "Série unissex para vitalidade e rejuvenescimento.",
    details: ["Energia renovada", "Bem-estar físico"],
  },
  {
    id: "prog-5",
    name: "Definição Abdominal",
    category: "masculino",
    price: 490,
    image: defaultImg,
    description: "Frequências otimizadas para definição física.",
    details: ["Foco muscular", "Alta performance"],
  },
  {
    id: "prog-6",
    name: "Abundância",
    category: "personalizado",
    price: 690,
    image: defaultImg,
    description: "Alinhe sua frequência à prosperidade financeira.",
    details: ["Atração magnética", "Prosperidade"],
  },
  {
    id: "prog-7",
    name: "Cabelos Lisos",
    category: "feminino",
    price: 590,
    image: defaultImg,
    description: "Programa de biokinesis para alteração capilar.",
    details: ["Frequência capilar", "Mudança natural"],
  },
  {
    id: "prog-8",
    name: "Amor Incondicional",
    category: "personalizado",
    price: 290,
    image: defaultImg,
    description: "Ressonância voltada para conexões verdadeiras.",
    details: ["Harmonia afetiva", "Vínculos puros"],
  },
  {
    id: "prog-9",
    name: "Foco Acadêmico",
    category: "personalizado",
    price: 1520,
    image: defaultImg,
    description: "Maximize sua capacidade de absorção de estudos.",
    details: ["Aprendizado acelerado", "Memória otimizada"],
  },
  {
    id: "prog-10",
    name: "Atração Interpessoal",
    category: "personalizado",
    price: 700,
    image: defaultImg,
    description: "Aumente seu magnetismo social de forma natural.",
    details: ["Carisma elevado", "Presença marcante"],
  },
  {
    id: "prog-11",
    name: "Presença Masculina",
    category: "masculino",
    price: 900,
    image: defaultImg,
    description: "Desenvolva uma postura inabalável e confiante.",
    details: ["Confiança inabalável", "Liderança natural"],
  },
  {
    id: "prog-12",
    name: "Reconexão",
    category: "personalizado",
    price: 310,
    image: defaultImg,
    description: "Restaure vínculos e harmonia em relacionamentos.",
    details: ["Restauração afetiva", "Equilíbrio relacional"],
  },
  {
    id: "prog-13",
    name: "Parcerias de Sucesso",
    category: "personalizado",
    price: 550,
    image: defaultImg,
    description: "Atraia oportunidades de negócios ideais.",
    details: ["Foco em negócios", "Networking otimizado"],
  },
  {
    id: "prog-14",
    name: "Círculo de Sucesso F",
    category: "feminino",
    price: 900,
    image: defaultImg,
    description: "Atraia indivíduos de alto valor e sucesso.",
    details: ["Conexões de valor", "Atração magnética"],
  },
  {
    id: "prog-15",
    name: "Círculo de Sucesso M",
    category: "masculino",
    price: 500,
    image: defaultImg,
    description: "Atraia companhias de alto valor e sucesso.",
    details: ["Conexões de valor", "Magnetismo pessoal"],
  },
  {
    id: "prog-16",
    name: "Estímulo de Crescimento",
    category: "personalizado",
    price: 290,
    image: defaultImg,
    description: "Biokinesis focada no desenvolvimento estrutural.",
    details: ["Crescimento focado", "Estímulo natural"],
  },
  {
    id: "prog-17",
    name: "Vitalidade Extrema",
    category: "personalizado",
    price: 700,
    image: defaultImg,
    description: "Otimização da energia vital e libido.",
    details: ["Força vital", "Disposição diária"],
  },
  {
    id: "prog-18",
    name: "Feromônios Naturais",
    category: "masculino",
    price: 400,
    image: defaultImg,
    description: "Estímulo biológico de atração masculina.",
    details: ["Atração otimizada", "Assinatura química"],
  },
  {
    id: "prog-19",
    name: "Desenvolvimento M",
    category: "masculino",
    price: 590,
    image: defaultImg,
    description: "Programa avançado de biokinesis masculina.",
    details: ["Estética masculina", "Transformação"],
  },
  {
    id: "prog-20",
    name: "Prosperidade Contínua",
    category: "personalizado",
    price: 800,
    image: defaultImg,
    description: "Crie um fluxo ininterrupto de realizações.",
    details: ["Fluxo de abundância", "Frequência contínua"],
  },
  {
    id: "prog-21",
    name: "Estética Refinada",
    category: "feminino",
    price: 390,
    image: defaultImg,
    description: "Realce de traços faciais e simetria.",
    details: ["Simetria otimizada", "Traços perfeitos"],
  },
  {
    id: "prog-22",
    name: "Performance Total",
    category: "masculino",
    price: 590,
    image: defaultImg,
    description: "Otimização física e mental simultânea.",
    details: ["Corpo e Mente", "Excelência total"],
  },
  {
    id: "prog-23",
    name: "Carisma Magnético",
    category: "personalizado",
    price: 890,
    image: defaultImg,
    description: "Comunicação hipnótica e persuasão natural.",
    details: ["Persuasão elevada", "Influência"],
  },
  {
    id: "prog-24",
    name: "Equilíbrio Hormonal",
    category: "feminino",
    price: 290,
    image: defaultImg,
    description: "Regulação natural do ciclo e bem-estar feminino.",
    details: ["Harmonia biológica", "Bem-estar completo"],
  },
];

// Keep the old export name for backward compatibility (cart.tsx uses it)
export const products = staticProducts;

export function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

/**
 * Convert a database product row into the Product format used by the storefront.
 */
export function dbProductToProduct(row: {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  details: string | null;
  price: number;
  image: string | null;
  category_slug: string | null;
}): Product {
  let parsedDetails: string[] = [];
  try {
    if (row.details) {
      const d = typeof row.details === "string" ? JSON.parse(row.details) : row.details;
      if (Array.isArray(d)) parsedDetails = d;
    }
  } catch {
    /* ignore */
  }

  return {
    id: row.slug || String(row.id),
    name: row.name,
    category: (row.category_slug as Category) || "personalizado",
    price: Number(row.price),
    image: row.image || defaultImg,
    description: row.description || "",
    details: parsedDetails,
  };
}
