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
    <div className="cyber-card p-5 relative overflow-hidden"
      style={{ border: `1px solid ${color}30`, boxShadow: `0 0 20px ${glow}` }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: `${color}80`, fontFamily: "'Share Tech Mono', monospace" }}>
            {label}
          </p>
          <p className="text-3xl font-black" style={{ fontFamily: "'Orbitron', sans-serif", color }}>
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 15px rgba(0,212,255,0.5)" }}>
            Dashboard
          </h2>
          <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
            Visão geral do sistema
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)" }}>
          <Activity className="w-3 h-3" style={{ color: "var(--neon-green)" }} />
          <span className="text-xs tracking-widest" style={{ color: "var(--neon-green)", fontFamily: "'Share Tech Mono', monospace" }}>
            SISTEMA ONLINE
          </span>
        </div>
      </div>

      {/* Proxy Status Controls (Admin Only) */}
      {isAdmin && (
        <div className="cyber-card p-5" style={{ border: "1px solid rgba(0,212,255,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4" style={{ color: "var(--neon-blue)" }} />
            <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--neon-blue)", fontFamily: "'Orbitron', sans-serif" }}>
              Controle de Status dos Proxies
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loadingProxies ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="h-16 rounded animate-pulse bg-white/5" />
              ))
            ) : (
              proxies?.map((proxy) => (
                <div key={proxy.id} className="flex items-center justify-between p-4 rounded bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded flex items-center justify-center" 
                      style={{ background: proxy.status === "online" ? "rgba(0,255,136,0.1)" : "rgba(255,0,110,0.1)" }}>
                      {proxy.status === "online" ? (
                        <Wifi className="w-5 h-5" style={{ color: "var(--neon-green)" }} />
                      ) : (
                        <WifiOff className="w-5 h-5" style={{ color: "#ff006e" }} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{proxy.name}</p>
                      <p className="text-[10px] uppercase tracking-widest" 
                        style={{ color: proxy.status === "online" ? "var(--neon-green)" : "#ff006e", fontFamily: "'Share Tech Mono', monospace" }}>
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
                    className="px-3 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all"
                    style={{ 
                      background: proxy.status === "online" ? "rgba(255,0,110,0.1)" : "rgba(0,255,136,0.1)",
                      border: `1px solid ${proxy.status === "online" ? "#ff006e" : "var(--neon-green)"}`,
                      color: proxy.status === "online" ? "#ff006e" : "var(--neon-green)",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="cyber-card p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Keys Ativas"
            value={stats?.activeKeys ?? 0}
            icon={<KeyRound className="w-5 h-5" />}
            color="#00d4ff"
            glow="rgba(0,212,255,0.08)"
          />
          <StatCard
            label="Keys Expiradas"
            value={stats?.expiredKeys ?? 0}
            icon={<ShieldOff className="w-5 h-5" />}
            color="#ff006e"
            glow="rgba(255,0,110,0.08)"
          />
          {isAdmin && (
            <StatCard
              label="Revendedores"
              value={stats?.resellerCount ?? 0}
              icon={<Users className="w-5 h-5" />}
              color="#9d4edd"
              glow="rgba(157,78,221,0.08)"
            />
          )}
          <StatCard
            label={isAdmin ? "Total Usuários" : "Meus Créditos"}
            value={isAdmin ? (stats?.resellerCount ?? 0) + 1 : (stats?.myCredits ?? 0)}
            icon={<Zap className="w-5 h-5" />}
            color="#00ff88"
            glow="rgba(0,255,136,0.08)"
          />
        </div>
      )}

      {/* Reseller Credits Table (admin only) */}
      {isAdmin && stats?.resellerCredits && stats.resellerCredits.length > 0 && (
        <div className="cyber-card overflow-hidden" style={{ border: "1px solid rgba(157,78,221,0.2)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(157,78,221,0.15)" }}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: "var(--neon-purple)" }} />
              <h3 className="font-semibold tracking-wider text-sm uppercase"
                style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-purple)", fontSize: "0.75rem" }}>
                Créditos por Revendedor
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(157,78,221,0.1)" }}>
                  <th className="text-left px-5 py-3 text-xs tracking-widest uppercase"
                    style={{ color: "rgba(157,78,221,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
                    Revendedor
                  </th>
                  <th className="text-right px-5 py-3 text-xs tracking-widest uppercase"
                    style={{ color: "rgba(157,78,221,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
                    Créditos
                  </th>
                  <th className="text-right px-5 py-3 text-xs tracking-widest uppercase"
                    style={{ color: "rgba(157,78,221,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.resellerCredits.map((r, i) => (
                  <tr key={i} className="transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(157,78,221,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center"
                          style={{ background: "rgba(157,78,221,0.2)", color: "var(--neon-purple)" }}>
                          {r.username[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--foreground)", fontFamily: "'Rajdhani', sans-serif" }}>
                          {r.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-bold text-sm" style={{ fontFamily: "'Orbitron', sans-serif", color: r.credits > 0 ? "var(--neon-green)" : "rgba(255,0,110,0.7)" }}>
                        {r.credits}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs px-2 py-0.5 rounded tracking-wider"
                        style={{
                          background: r.credits > 0 ? "rgba(0,255,136,0.1)" : "rgba(255,0,110,0.1)",
                          color: r.credits > 0 ? "var(--neon-green)" : "#ff006e",
                          border: `1px solid ${r.credits > 0 ? "rgba(0,255,136,0.2)" : "rgba(255,0,110,0.2)"}`,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="cyber-card p-5" style={{ border: "1px solid rgba(0,212,255,0.1)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4" style={{ color: "var(--neon-blue)" }} />
            <h3 className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", fontSize: "0.7rem" }}>
              Tabela de Créditos
            </h3>
          </div>
          <div className="space-y-2">
            {[
              { days: 1, credits: 1 },
              { days: 3, credits: 3 },
              { days: 7, credits: 7 },
              { days: 30, credits: 30 },
            ].map(({ days, credits }) => (
              <div key={days} className="flex items-center justify-between py-1.5 px-3 rounded"
                style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.08)" }}>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Rajdhani', sans-serif" }}>
                  {days} {days === 1 ? "dia" : "dias"}
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--neon-green)", fontFamily: "'Orbitron', sans-serif" }}>
                  {credits} crédito{credits > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-card p-5" style={{ border: "1px solid rgba(0,255,136,0.1)" }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
            <h3 className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-green)", fontSize: "0.7rem" }}>
              Status do Sistema
            </h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "API Proxy", status: "ONLINE", ok: true },
              { label: "Banco de Dados", status: "ONLINE", ok: true },
              { label: "Autenticação", status: "ATIVA", ok: true },
            ].map(({ label, status, ok }) => (
              <div key={label} className="flex items-center justify-between py-1.5 px-3 rounded"
                style={{ background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.08)" }}>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Rajdhani', sans-serif" }}>
                  {label}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full neon-pulse" style={{ background: ok ? "var(--neon-green)" : "#ff006e" }} />
                  <span className="text-xs tracking-wider" style={{ color: ok ? "var(--neon-green)" : "#ff006e", fontFamily: "'Share Tech Mono', monospace" }}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
