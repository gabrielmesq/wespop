import { getPool } from "./db";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

interface CategoryRow extends RowDataPacket {
  id: number;
  slug: string;
}

const existingProducts = [
  {
    name: "Programa Infinito",
    category: "personalizado",
    price: 890,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Programa definitivo para transformação completa.",
    details: ["Reprogramação profunda", "Impacto em todas as áreas"],
  },
  {
    name: "Seja Um Milionário",
    category: "masculino",
    price: 1580,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Visão além do topo para riqueza ilimitada.",
    details: ["Foco financeiro", "Atração de abundância"],
  },
  {
    name: "Beleza Feminina",
    category: "feminino",
    price: 890,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Ative sua beleza natural de forma profunda.",
    details: ["Estética otimizada", "Resultados visíveis"],
  },
  {
    name: "Eterna Juventude",
    category: "personalizado",
    price: 390,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Série unissex para vitalidade e rejuvenescimento.",
    details: ["Energia renovada", "Bem-estar físico"],
  },
  {
    name: "Definição Abdominal",
    category: "masculino",
    price: 490,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Frequências otimizadas para definição física.",
    details: ["Foco muscular", "Alta performance"],
  },
  {
    name: "Abundância",
    category: "personalizado",
    price: 690,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Alinhe sua frequência à prosperidade financeira.",
    details: ["Atração magnética", "Prosperidade"],
  },
  {
    name: "Cabelos Lisos",
    category: "feminino",
    price: 590,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Programa de biokinesis para alteração capilar.",
    details: ["Frequência capilar", "Mudança natural"],
  },
  {
    name: "Amor Incondicional",
    category: "personalizado",
    price: 290,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Ressonância voltada para conexões verdadeiras.",
    details: ["Harmonia afetiva", "Vínculos puros"],
  },
  {
    name: "Foco Acadêmico",
    category: "personalizado",
    price: 1520,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Maximize sua capacidade de absorção de estudos.",
    details: ["Aprendizado acelerado", "Memória otimizada"],
  },
  {
    name: "Atração Interpessoal",
    category: "personalizado",
    price: 700,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Aumente seu magnetismo social de forma natural.",
    details: ["Carisma elevado", "Presença marcante"],
  },
  {
    name: "Presença Masculina",
    category: "masculino",
    price: 900,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Desenvolva uma postura inabalável e confiante.",
    details: ["Confiança inabalável", "Liderança natural"],
  },
  {
    name: "Reconexão",
    category: "personalizado",
    price: 310,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Restaure vínculos e harmonia em relacionamentos.",
    details: ["Restauração afetiva", "Equilíbrio relacional"],
  },
  {
    name: "Parcerias de Sucesso",
    category: "personalizado",
    price: 550,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Atraia oportunidades de negócios ideais.",
    details: ["Foco em negócios", "Networking otimizado"],
  },
  {
    name: "Círculo de Sucesso F",
    category: "feminino",
    price: 900,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Atraia indivíduos de alto valor e sucesso.",
    details: ["Conexões de valor", "Atração magnética"],
  },
  {
    name: "Círculo de Sucesso M",
    category: "masculino",
    price: 500,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Atraia companhias de alto valor e sucesso.",
    details: ["Conexões de valor", "Magnetismo pessoal"],
  },
  {
    name: "Estímulo de Crescimento",
    category: "personalizado",
    price: 290,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Biokinesis focada no desenvolvimento estrutural.",
    details: ["Crescimento focado", "Estímulo natural"],
  },
  {
    name: "Vitalidade Extrema",
    category: "personalizado",
    price: 700,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Otimização da energia vital e libido.",
    details: ["Força vital", "Disposição diária"],
  },
  {
    name: "Feromônios Naturais",
    category: "masculino",
    price: 400,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Estímulo biológico de atração masculina.",
    details: ["Atração otimizada", "Assinatura química"],
  },
  {
    name: "Desenvolvimento M",
    category: "masculino",
    price: 590,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Programa avançado de biokinesis masculina.",
    details: ["Estética masculina", "Transformação"],
  },
  {
    name: "Prosperidade Contínua",
    category: "personalizado",
    price: 800,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Crie um fluxo ininterrupto de realizações.",
    details: ["Fluxo de abundância", "Frequência contínua"],
  },
  {
    name: "Estética Refinada",
    category: "feminino",
    price: 390,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Realce de traços faciais e simetria.",
    details: ["Simetria otimizada", "Traços perfeitos"],
  },
  {
    name: "Performance Total",
    category: "masculino",
    price: 590,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Otimização física e mental simultânea.",
    details: ["Corpo e Mente", "Excelência total"],
  },
  {
    name: "Carisma Magnético",
    category: "personalizado",
    price: 890,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Comunicação hipnótica e persuasão natural.",
    details: ["Persuasão elevada", "Influência"],
  },
  {
    name: "Equilíbrio Hormonal",
    category: "feminino",
    price: 290,
    image:
      "https://web.archive.org/web/20240121105926im_/https://s3-sa-east-1.amazonaws.com/loja2/7f2de0057a6f1350d57c187e9d20b16f.jpg",
    description: "Regulação natural do ciclo e bem-estar feminino.",
    details: ["Harmonia biológica", "Bem-estar completo"],
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function seedDatabase(): Promise<void> {
  const pool = getPool();

  // Get category map
  const [catRows] = await pool.execute<CategoryRow[]>("SELECT id, slug FROM categories");
  const categoryMap = new Map(catRows.map((c) => [c.slug, c.id]));

  for (const product of existingProducts) {
    const slug = slugify(product.name);
    const categoryId = categoryMap.get(product.category) ?? null;

    await pool.execute(
      `INSERT INTO products (name, slug, description, details, price, image, category_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [
        product.name,
        slug,
        product.description,
        JSON.stringify(product.details),
        product.price,
        product.image,
        categoryId,
      ],
    );
  }

  console.log("Database seeded successfully with", existingProducts.length, "products");
}
