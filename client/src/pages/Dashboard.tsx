import { trpc } from "@/lib/trpc";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { KeyRound, ShieldOff, Users, Zap, Activity, Radio, Wifi, WifiOff, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

function StatCard({ label, value, icon, trend, color }: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}) {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group">
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 text-white group-hover:scale-110 transition-transform duration-500`}>
            {icon}
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">
              {label}
            </p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {value}
            </h3>
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>

      {/* Background Decorative Element */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full transition-all duration-700 group-hover:opacity-20`} style={{ backgroundColor: color }} />
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
      toast.success("Proxy status updated successfully");
      utils.proxy.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-indigo-400">{user?.username}</span>
            </h2>
          </div>
          <p className="text-slate-400 text-lg font-medium max-w-2xl">
            Here's what's happening with your proxy system today.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-44 rounded-3xl animate-pulse bg-white/[0.03] border border-white/5" />
          ))
        ) : (
          <>
            <StatCard
              label="Active Keys"
              value={stats?.activeKeys ?? 0}
              icon={<KeyRound className="w-5 h-5" />}
              color="#6366f1"
            />
            <StatCard
              label="Expired Keys"
              value={stats?.expiredKeys ?? 0}
              icon={<ShieldOff className="w-5 h-5" />}
              color="#f43f5e"
            />
            {isAdmin && (
              <StatCard
                label="Total Resellers"
                value={stats?.resellerCount ?? 0}
                icon={<Users className="w-5 h-5" />}
                color="#a855f7"
              />
            )}
            <StatCard
              label={isAdmin ? "System Users" : "Your Credits"}
              value={isAdmin ? (stats?.resellerCount ?? 0) + 1 : (stats?.myCredits ?? 0)}
              icon={<Zap className="w-5 h-5" />}
              color="#10b981"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Proxy Status Controls (Admin Only) */}
        {isAdmin && (
          <div className="xl:col-span-2 glass-card p-8 rounded-3xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Proxy Control Center
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loadingProxies ? (
                [...Array(2)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl animate-pulse bg-white/[0.02]" />
                ))
              ) : (
                proxies?.map((proxy) => (
                  <div key={proxy.id} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        proxy.status === "online" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {proxy.status === "online" ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{proxy.name}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${
                          proxy.status === "online" ? "text-emerald-500" : "text-rose-500"
                        }`}>
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
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        proxy.status === "online" 
                          ? "bg-rose-500/5 border-rose-500/10 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20" 
                          : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20"
                      }`}
                    >
                      {proxy.status === "online" ? "Disable" : "Enable"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reseller Credits Table (Admin Only) */}
        {isAdmin && stats?.resellerCredits && stats.resellerCredits.length > 0 && (
          <div className="glass-card rounded-3xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Top Resellers
                </h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              <table className="w-full text-left">
                <tbody>
                  {stats.resellerCredits.map((r, i) => (
                    <tr key={i} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            {r.username[0]?.toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {r.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-white">{r.credits}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${r.credits > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                            {r.credits > 0 ? "Active" : "No Credits"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Cards (Always visible) */}
        {!isAdmin && (
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass-card p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Credit Pricing</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { days: "1 Day", credits: "1 Credit" },
                    { days: "3 Days", credits: "2 Credits" },
                    { days: "7 Days", credits: "4 Credits" },
                    { days: "30 Days", credits: "12 Credits" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.days}</span>
                      <span className="text-sm font-bold text-indigo-400">{item.credits}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="glass-card p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">System Info</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Version", value: "v2.0 Premium", color: "text-emerald-400" },
                    { label: "Security", value: "High Level", color: "text-indigo-400" },
                    { label: "Last Sync", value: "Just now", color: "text-slate-400" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
