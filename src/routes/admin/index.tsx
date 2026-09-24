import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { loginFn } from "@/lib/admin-api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexPage,
});

function AdminIndexPage() {
  const { user, token } = useAdminAuth();

  if (!user || !token) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}

// ============================================================
// LOGIN PAGE
// ============================================================

function LoginPage() {
  const { login } = useAdminAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginFn({ data: { emailOrUsername, password } });
      if ("error" in result) {
        setError(result.error);
      } else {
        login(result.token, result.user);
        toast.success("Login realizado com sucesso!");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl tracking-tight">WESPOP</h1>
          <p className="mt-2 text-sm text-muted-foreground">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="login-email"
              className="block text-xs uppercase tracking-widest text-muted-foreground"
            >
              E-mail ou usuário
            </label>
            <input
              id="login-email"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              autoComplete="username"
              className="mt-3 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
              placeholder="admin@wespopmindlabs.com.br"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs uppercase tracking-widest text-muted-foreground"
            >
              Senha
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-3 block w-full border-b border-border bg-transparent py-2 text-sm focus:border-foreground focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Acesso restrito a administradores autorizados.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

import { useEffect } from "react";
import { getDashboardStatsFn } from "@/lib/admin-api";
import { Package, Tags, TrendingUp, Eye } from "lucide-react";
import { formatPrice } from "@/lib/products";

interface DashboardData {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  activeCategories: number;
  recentProducts: Array<{
    id: number;
    name: string;
    price: number;
    is_active: number;
    category_name: string | null;
    created_at: string;
  }>;
}

function DashboardPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getDashboardStatsFn({ data: { token } })
      .then((data) => setStats(data as DashboardData))
      .catch(() => toast.error("Erro ao carregar dashboard."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl tracking-tight">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg border border-border bg-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl tracking-tight">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total de Produtos" value={stats?.totalProducts ?? 0} />
        <StatCard icon={Eye} label="Produtos Ativos" value={stats?.activeProducts ?? 0} />
        <StatCard icon={Tags} label="Total de Categorias" value={stats?.totalCategories ?? 0} />
        <StatCard
          icon={TrendingUp}
          label="Categorias Ativas"
          value={stats?.activeCategories ?? 0}
        />
      </div>

      {/* Recent products */}
      <div>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Produtos Recentes
        </h2>
        {stats?.recentProducts && stats.recentProducts.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Preço</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {product.category_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.is_active
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {product.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
