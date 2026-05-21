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
    <div className="flex flex-col h-full bg-[#0a0a0f] border-r border-white/5">
      {/* Logo Section */}
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-sans">
              AUTH<span className="text-indigo-400">PROXY</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase">System v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-6 mb-6">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.username}
              </p>
              <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-wider">
                {isAdmin ? "Administrator" : "Reseller"}
              </p>
            </div>
          </div>
          {!isAdmin && (
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Credits Available</span>
              <span className="text-sm font-bold text-emerald-400">{user?.credits ?? 0}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Navigation</p>
        {visibleItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive
                  ? "bg-indigo-500/10 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
              }`}
            >
              <div className={`transition-colors duration-300 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"}`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-6">
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#050508] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-80 flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <SidebarContent />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-6 right-[-50px] w-10 h-10 rounded-xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">AUTHPROXY</span>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
