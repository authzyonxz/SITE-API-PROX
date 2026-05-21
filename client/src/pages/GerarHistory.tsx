import { trpc } from "@/lib/trpc";
import { History, Clock, User, Key, Calendar, ShieldCheck, Copy, CheckCheck, Sparkles, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

export default function GerarHistory() {
  const { data: history, isLoading } = trpc.logs.generation.useQuery();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("Key copiada!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> auditoria de sistemas
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Histórico de <span className="text-emerald-400">Geração</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mt-2">
              Rastreamento completo de todas as licenças emitidas, autores e status de ativação.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Todos os Registros</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-emerald-500/50" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Autor / Cargo</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Licença (Key)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Duração</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sincronizando registros...</p>
                    </div>
                  </td>
                </tr>
              ) : !history || history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Nenhum registro encontrado</p>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white tracking-tight">{item.creator.username}</p>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${item.creator.role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>
                            {item.creator.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <code className="text-xs font-mono text-emerald-300/70 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                          {item.keyValue.substring(0, 15)}...
                        </code>
                        <button 
                          onClick={() => handleCopy(item.keyValue)}
                          className="p-2 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all"
                        >
                          {copiedKey === item.keyValue ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">
                          {item.days} {item.days === 1 ? 'Dia' : 'Dias'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'active' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : item.status === 'expired'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-400 animate-pulse' : item.status === 'expired' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        {item.status === 'active' ? 'Ativa' : item.status === 'expired' ? 'Expirada' : 'Deletada'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          {format(new Date(item.createdAt), "dd MMM yyyy • HH:mm", { locale: ptBR })}
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
