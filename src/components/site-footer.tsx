import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg text-foreground">WESPOP</p>
        <div className="flex gap-6">
          <Link to="/sobre" className="hover:text-foreground">
            Sobre nós
          </Link>
          <Link to="/missao" className="hover:text-foreground">
            Nossa missão
          </Link>
          <Link to="/contato" className="hover:text-foreground">
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
}
