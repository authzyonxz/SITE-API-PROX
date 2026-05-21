import { trpc } from "@/lib/trpc";
import { Shield, Clock, User, Globe, Monitor, Sparkles, Activity } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Logs() {
  const { data: logs, isLoading } = trpc.logs.list.useQuery();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> monitoramento em tempo real
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Logs de <span className="text-blue-400">Acesso</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mt-2">
              Acompanhe a atividade do sistema, identifique dispositivos e rastreie localizações de acesso.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Feed</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-blue-500/50" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Usuário</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Dispositivo (HWID)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Endereço IP</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Processando logs...</p>
                    </div>
                  </td>
                </tr>
              ) : !logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Nenhum log encontrado</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-white tracking-tight">{log.username}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-slate-600" />
                        <code className="text-[10px] font-mono text-blue-300/70 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 uppercase tracking-wider">
                          {(log as any).deviceId || "DESCONHECIDO"}
                        </code>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-600" />
                        <code className="text-xs font-mono text-emerald-400/80 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                          {log.ipAddress}
                        </code>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          {format(new Date(log.createdAt), "dd MMM yyyy • HH:mm:ss", { locale: ptBR })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
