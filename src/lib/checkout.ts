import { createServerFn } from "@tanstack/react-start";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuração do Mercado Pago
// A chave VITE_MP_ACCESS_TOKEN deve estar no arquivo .env
const getMpClient = () => {
  const token = process.env["VITE_MP_ACCESS_TOKEN"] || "";
  if (!token) {
    console.warn("VITE_MP_ACCESS_TOKEN não está configurado.");
  }
  return new MercadoPagoConfig({ accessToken: token });
};

export const createCheckoutPreferenceFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      items: {
        id: string;
        title: string;
        quantity: number;
        unit_price: number;
        picture_url: string;
      }[];
      origin: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const client = getMpClient();
    const preference = new Preference(client);

    try {
      const result = await preference.create({
        body: {
          items: data.items,
          back_urls: {
            success: `${data.origin}/sucesso`,
            failure: `${data.origin}/carrinho`,
            pending: `${data.origin}/carrinho`,
          },
          auto_return: "approved",
        },
      });

      return { init_point: result.init_point };
    } catch (err: unknown) {
      console.error("Erro no Mercado Pago:", err);
      throw new Error("Falha ao conectar com o Mercado Pago.");
    }
  });
