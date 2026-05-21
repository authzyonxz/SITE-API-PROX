import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ShieldAlert, Trash2, Plus, Loader2, Search, Calendar, Info, Sparkles, Ban, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Blacklist() {
  const [newIp, setNewIp] = useState("");
  const [reason, setReason] = useState("");
  const utils = trpc.useUtils();

  const { data: blacklist, isLoading } = trpc.blacklist.list.useQuery();

  const addMutation = trpc.blacklist.add.useMutation({
    onSuccess: () => {
      toast.success("IP adicionado à lista negra!");
      setNewIp("");
      setReason("");
      utils.blacklist.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const removeMutation = trpc.blacklist.remove.useMutation({
    onSuccess: () => {
      toast.success("IP removido da lista negra!");
      utils.blacklist.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;
    addMutation.mutate({ ipAddress: newIp.trim(), reason: reason.trim() });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/5 border border-rose-500/10 text-rose-300 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> firewall & segurança
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Blacklist de <span className="text-rose-500">IPs</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mt-2">
              Gerencie endereços de rede bloqueados e impeça acessos não autorizados ou abusivos.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Banir Novo Endereço</h3>
            <p className="text-sm text-slate-500 font-medium">Restrinja o acesso de um IP específico imediatamente.</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_200px] gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Endereço IP</label>
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="0.0.0.0"
              className="w-full px-6 py-4.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-rose-400/40 focus:ring-4 focus:ring-rose-400/10 outline-none transition-all font-mono text-white placeholder-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Motivo do Bloqueio</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Tentativa de brute-force..."
              className="w-full px-6 py-4.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-rose-400/40 focus:ring-4 focus:ring-rose-400/10 outline-none transition-all text-white placeholder-slate-700"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={addMutation.isPending || !newIp.trim()}
              className="w-full py-4.5 rounded-2xl font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-rose-600 text-white shadow-xl shadow-rose-600/20 hover:bg-rose-500 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Banir
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 relative">
        <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">IPs Restritos</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">{blacklist?.length ?? 0} Registros Ativos</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Endereço IP</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Motivo / Observação</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data do Bloqueio</th>
                <th className="px-10 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Carregando blacklist...</p>
                    </div>
                  </td>
                </tr>
              ) : blacklist?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest italic">Nenhum IP bloqueado no momento</p>
                  </td>
                </tr>
              ) : (
                blacklist?.map((item) => (
                  <tr key={item.id} className="hover:bg-rose-500/[0.02] transition-colors group">
                    <td className="px-10 py-6">
                      <code className="text-sm font-mono font-bold text-rose-400 bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10">
                        {item.ipAddress}
                      </code>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 text-slate-300">
                        <Info className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium">{item.reason || "Sem motivo especificado"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button
                        onClick={() => removeMutation.mutate({ ipAddress: item.ipAddress })}
                        disabled={removeMutation.isPending}
                        className="p-3 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 hover:border-emerald-500/30 transition-all group/btn"
                        title="Desbanir IP"
                      >
                        {removeMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                      </button>
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
