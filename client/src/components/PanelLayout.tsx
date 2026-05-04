import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import { toast } from "sonner";
import {
  LayoutDashboard,
  KeyRound,
  Search,
  Globe,
  Trash2,
  UserPlus,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronRight,
  Cpu,
} from "lucide-react";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: "/criar-key", label: "Criar Key", icon: <KeyRound className="w-4 h-4" /> },
  { path: "/checar-key", label: "Checar Key", icon: <Search className="w-4 h-4" /> },
  { path: "/atualizar-ip", label: "Atualizar IP", icon: <Globe className="w-4 h-4" /> },
  { path: "/deletar-key", label: "Deletar Key", icon: <Trash2 className="w-4 h-4" /> },
  { path: "/criar-usuario", label: "Usuários", icon: <UserPlus className="w-4 h-4" />, adminOnly: true },
  { path: "/logs", label: "Logs de Acesso", icon: <Shield className="w-4 h-4" />, adminOnly: true },
  { path: "/buscar-key", label: "Buscar Criador", icon: <Search className="w-4 h-4" />, adminOnly: true },
  { path: "/blacklist", label: "Blacklist IPs", icon: <ShieldAlert className="w-4 h-4" />, adminOnly: true },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAdmin } = useLocalAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoutMutation = trpc.localAuth.logout.useMutation({
    onSuccess: (data, variables, context) => {
      // Se o contexto indicar que foi logout automático, mostrar mensagem específica
      if (context === "auto") {
        toast.info("Sessão encerrada por inatividade", {
          description: "Por segurança, você foi desconectado.",
        });
      } else {
        toast.success("Sessão encerrada");
      }
      window.location.href = "/";
    },
  });

  // Logout automático após 15 minutos de inatividade
  const handleAutoLogout = useCallback(() => {
    if (user) {
      logoutMutation.mutate(undefined, { 
        // @ts-ignore - passando um contexto personalizado para identificar logout automático
        context: "auto" 
      });
    }
  }, [user, logoutMutation]);

  useIdleLogout({
    timeout: 15 * 60 * 1000,
    onLogout: handleAutoLogout,
    enabled: !!user,
  });

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "rgba(0,212,255,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,212,255,0.1)", border: "1px solid var(--neon-blue)", boxShadow: "0 0 12px rgba(0,212,255,0.3)" }}>
            <Shield className="w-5 h-5" style={{ color: "var(--neon-blue)" }} />
          </div>
          <div>
            <h1 className="font-black tracking-widest leading-none"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem", color: "var(--neon-blue)", textShadow: "0 0 10px var(--neon-blue)" }}>
              AUTH PROXY
            </h1>
            <p className="text-xs tracking-wider mt-0.5" style={{ color: "rgba(0,212,255,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
              v1.0 SYSTEM
            </p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 mx-3 mt-4 rounded" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: isAdmin ? "rgba(0,212,255,0.2)" : "rgba(157,78,221,0.2)", color: isAdmin ? "var(--neon-blue)" : "var(--neon-purple)" }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)", fontFamily: "'Rajdhani', sans-serif" }}>
              {user?.username}
            </p>
            <p className="text-xs tracking-widest uppercase" style={{ color: isAdmin ? "var(--neon-blue)" : "var(--neon-purple)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}>
              {isAdmin ? "ADMIN" : "REVENDEDOR"}
            </p>
          </div>
          {!isAdmin && (
            <div className="ml-auto text-right flex-shrink-0">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Créditos</p>
              <p className="font-bold text-sm" style={{ color: "var(--neon-green)", fontFamily: "'Orbitron', sans-serif" }}>
                {user?.credits ?? 0}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs tracking-widest uppercase px-3 mb-3" style={{ color: "rgba(0,212,255,0.3)", fontFamily: "'Share Tech Mono', monospace" }}>
          Navegação
        </p>
        {visibleItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded transition-all group relative"
              style={{
                background: isActive ? "rgba(0,212,255,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(0,212,255,0.3)" : "1px solid transparent",
                color: isActive ? "var(--neon-blue)" : "rgba(255,255,255,0.6)",
                boxShadow: isActive ? "0 0 10px rgba(0,212,255,0.1)" : "none",
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full" style={{ background: "var(--neon-blue)" }} />
              )}
              <span style={{ color: isActive ? "var(--neon-blue)" : "rgba(0,212,255,0.4)" }}>
                {item.icon}
              </span>
              <span className="text-sm font-medium tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {item.label}
              </span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "var(--neon-blue)" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(0,212,255,0.1)" }}>
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all"
          style={{
            background: "rgba(255,0,110,0.05)",
            border: "1px solid rgba(255,0,110,0.2)",
            color: "rgba(255,0,110,0.7)",
            fontFamily: "'Rajdhani', sans-serif",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,0,110,0.1)"; (e.currentTarget as HTMLElement).style.color = "#ff006e"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,0,110,0.05)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,0,110,0.7)"; }}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide">Sair do Sistema</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background cyber-grid-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0"
        style={{ background: "oklch(0.09 0.025 260)", borderRight: "1px solid rgba(0,212,255,0.1)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col z-10"
            style={{ background: "oklch(0.09 0.025 260)", borderRight: "1px solid rgba(0,212,255,0.2)" }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4"
              style={{ color: "var(--neon-blue)" }}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 border-b"
          style={{ background: "oklch(0.09 0.025 260)", borderColor: "rgba(0,212,255,0.1)" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: "var(--neon-blue)" }}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-black tracking-widest text-sm"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 10px var(--neon-blue)" }}>
            AUTH PROXY
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Cpu className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
            <span className="text-xs" style={{ color: "var(--neon-green)", fontFamily: "'Share Tech Mono', monospace" }}>ONLINE</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
