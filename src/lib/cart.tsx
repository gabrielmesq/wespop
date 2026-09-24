import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "./products";

type CartLine = { id: string; quantity: number; product: Product };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRaw(JSON.parse(stored) as CartLine[]);
      } else {
        // Fallback for v1 if needed
        const oldStored = localStorage.getItem("cart-v1");
        if (oldStored) {
          const oldRaw = JSON.parse(oldStored) as { id: string; quantity: number }[];
          const lines = oldRaw
            .map((line) => {
              const product = products.find((p) => p.id === line.id);
              return product ? { ...line, product } : null;
            })
            .filter((l): l is CartLine => l !== null);
          setRaw(lines);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* ignore */
    }
  }, [raw]);

  const add = useCallback((product: Product, quantity = 1) => {
    setRaw((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.id === product.id ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...prev, { id: product.id, quantity, product }];
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setRaw((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setRaw((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartContextValue>(() => {
    return {
      lines: raw,
      count: raw.reduce((sum, l) => sum + l.quantity, 0),
      total: raw.reduce((sum, l) => sum + l.quantity * l.product.price, 0),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [raw, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
