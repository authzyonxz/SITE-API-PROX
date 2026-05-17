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
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  Cpu,
  Zap,
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
  { path: "/historico-geracao", label: "Histórico Geração", icon: <Zap className="w-4 h-4" />, adminOnly: true },
  { path: "/admin-denuncias", label: "Denúncias", icon: <ShieldAlert className="w-4 h-4" />, adminOnly: true },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAdmin } = useLocalAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoutMutation = trpc.localAuth.logout.useMutation({
    onSuccess: (data, variables, context) => {
      localStorage.removeItem("auth_token");
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

  const handleAutoLogout = useCallback(() => {
    if (user) {
      logoutMutation.mutate(undefined, { 
        // @ts-ignore
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black tracking-widest leading-none text-white"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem" }}>
              AUTH PROXY
            </h1>
            <p className="text-xs tracking-wider mt-1 text-slate-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              v2.0 SYSTEM
            </p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 mx-3 mt-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {user?.username}
            </p>
            <p className="text-xs tracking-widest uppercase text-cyan-400" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}>
              {isAdmin ? "ADMIN" : "REVENDEDOR"}
            </p>
          </div>
          {!isAdmin && (
            <div className="ml-auto text-right flex-shrink-0">
              <p className="text-xs text-slate-400">Créditos</p>
              <p className="font-bold text-sm text-green-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {user?.credits ?? 0}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs tracking-widest uppercase px-3 mb-4 text-slate-500" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          Menu Principal
        </p>
        {visibleItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative font-medium text-sm ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
              }`}
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
              )}
              <span className={isActive ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-cyan-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r border-white/10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 flex flex-col z-10 border-r border-white/10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-cyan-400 hover:text-cyan-300">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-black tracking-widest text-sm text-white"
            style={{ fontFamily: "'Orbitron', sans-serif" }}>
            AUTH PROXY
          </h1>
          <div className="ml-auto flex items-center gap-2 text-green-400">
            <Cpu className="w-4 h-4" />
            <span className="text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>ONLINE</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
