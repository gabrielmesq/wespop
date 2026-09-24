import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/", label: "Loja" },
  { to: "/sobre", label: "Sobre nós" },
  { to: "/missao", label: "Nossa missão" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          to="/"
          className="font-display text-2xl leading-none tracking-tight flex items-center"
        >
          <img src="/logo.svg" alt="wespop" className="h-8 w-auto" />
        </Link>

        <nav className="hidden gap-7 text-sm text-muted-foreground sm:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link to="/carrinho" className="text-sm transition-opacity hover:opacity-60">
          Carrinho ({count})
        </Link>
      </div>

      <nav className="flex gap-6 border-t border-border px-6 py-3 text-sm text-muted-foreground sm:hidden">
        {links.slice(1).map((l) => (
          <Link key={l.to} to={l.to} activeProps={{ className: "text-foreground" }}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
