import { trpc } from "@/lib/trpc";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { KeyRound, ShieldOff, Users, Zap, TrendingUp, Activity, Cpu, Radio, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

function StatCard({ label, value, icon, color, glow }: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  glow: string;
}) {
  return (
    <div className="bg-slate-800/50 sm:backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 sm:p-6 relative overflow-hidden group hover:border-white/30 transition-all"
      style={{ boxShadow: `0 0 15px ${glow}15` }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase mb-3 text-slate-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {label}
          </p>
          <p className="text-4xl font-black" style={{ fontFamily: "'Orbitron', sans-serif", color }}>
            {value}
          </p>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:border-white/40 transition-all"
          style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAdmin } = useLocalAuth();
  const utils = trpc.useUtils();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  const { data: proxies, isLoading: loadingProxies } = trpc.proxy.list.useQuery();

  const updateProxyMutation = trpc.proxy.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status do proxy atualizado!");
      utils.proxy.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-wider text-white"
            style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Dashboard
          </h2>
          <p className="text-sm mt-2 tracking-wide text-slate-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Visão geral do sistema e estatísticas
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-green-500/10 border border-green-500/30">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-xs tracking-widest text-green-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            SISTEMA ONLINE
          </span>
        </div>
      </div>

      {/* Proxy Status Controls (Admin Only) */}
      {isAdmin && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-widest uppercase text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Controle de Status dos Proxies
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loadingProxies ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="h-20 rounded-lg animate-pulse bg-white/5" />
              ))
            ) : (
              proxies?.map((proxy) => (
                <div key={proxy.id} className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20" 
                      style={{ color: proxy.status === "online" ? "#10b981" : "#ef4444" }}>
                      {proxy.status === "online" ? (
                        <Wifi className="w-5 h-5" />
                      ) : (
                        <WifiOff className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{proxy.name}</p>
                      <p className="text-xs uppercase tracking-widest" 
                        style={{ color: proxy.status === "online" ? "#10b981" : "#ef4444", fontFamily: "'Share Tech Mono', monospace" }}>
                        {proxy.status}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => updateProxyMutation.mutate({ 
                      id: proxy.id, 
                      status: proxy.status === "online" ? "offline" : "online" 
                    })}
                    disabled={updateProxyMutation.isPending}
                    className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all border"
                    style={{ 
                      background: proxy.status === "online" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                      borderColor: proxy.status === "online" ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)",
                      color: proxy.status === "online" ? "#ef4444" : "#10b981",
                      fontFamily: "'Orbitron', sans-serif"
                    }}
                  >
                    {proxy.status === "online" ? "Desativar" : "Ativar"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Keys Ativas"
            value={stats?.activeKeys ?? 0}
            icon={<KeyRound className="w-6 h-6" />}
            color="#00d4ff"
            glow="#00d4ff"
          />
          <StatCard
            label="Keys Expiradas"
            value={stats?.expiredKeys ?? 0}
            icon={<ShieldOff className="w-6 h-6" />}
            color="#ef4444"
            glow="#ef4444"
          />
          {isAdmin && (
            <StatCard
              label="Revendedores"
              value={stats?.resellerCount ?? 0}
              icon={<Users className="w-6 h-6" />}
              color="#9d4edd"
              glow="#9d4edd"
            />
          )}
          <StatCard
            label={isAdmin ? "Total Usuários" : "Meus Créditos"}
            value={isAdmin ? (stats?.resellerCount ?? 0) + 1 : (stats?.myCredits ?? 0)}
            icon={<Zap className="w-6 h-6" />}
            color="#10b981"
            glow="#10b981"
          />
        </div>
      )}

      {/* Reseller Credits Table (admin only) */}
      {isAdmin && stats?.resellerCredits && stats.resellerCredits.length > 0 && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold tracking-wider text-sm uppercase text-white"
                style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem" }}>
                Créditos por Revendedor
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-slate-400"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    Revendedor
                  </th>
                  <th className="text-right px-6 py-4 text-xs tracking-widest uppercase text-slate-400"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    Créditos
                  </th>
                  <th className="text-right px-6 py-4 text-xs tracking-widest uppercase text-slate-400"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.resellerCredits.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                          {r.username[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          {r.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-sm" style={{ fontFamily: "'Orbitron', sans-serif", color: r.credits > 0 ? "#10b981" : "#ef4444" }}>
                        {r.credits}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs px-3 py-1 rounded-lg tracking-wider inline-block"
                        style={{
                          background: r.credits > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          color: r.credits > 0 ? "#10b981" : "#ef4444",
                          border: `1px solid ${r.credits > 0 ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                          fontFamily: "'Share Tech Mono', monospace",
                        }}>
                        {r.credits > 0 ? "ATIVO" : "SEM CRÉDITO"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.7rem" }}>
              Tabela de Créditos
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">1 Dia</span>
              <span className="font-bold text-sm text-cyan-400">1 Crédito</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">3 Dias</span>
              <span className="font-bold text-sm text-cyan-400">2 Créditos</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">7 Dias</span>
              <span className="font-bold text-sm text-cyan-400">4 Créditos</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">30 Dias</span>
              <span className="font-bold text-sm text-cyan-400">12 Créditos</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.7rem" }}>
              Informações do Sistema
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">Versão</span>
              <span className="font-bold text-sm text-green-400">v2.0</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">Status</span>
              <span className="font-bold text-sm text-green-400">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">Segurança</span>
              <span className="font-bold text-sm text-green-400">Ativa</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">Usuário</span>
              <span className="font-bold text-sm text-cyan-400">{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
