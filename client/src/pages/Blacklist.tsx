import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ShieldAlert, Trash2, Plus, Loader2, Search, Calendar, Info } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#ff006e", textShadow: "0 0 15px rgba(255,0,110,0.5)" }}>
            Blacklist de IPs
          </h2>
          <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
            Gerencie IPs proibidos de atualizar chaves
          </p>
        </div>
      </div>

      {/* Add IP Form */}
      <div className="cyber-card p-6" style={{ border: "1px solid rgba(255,0,110,0.2)" }}>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#ff006e", fontFamily: "'Orbitron', sans-serif" }}>
          Banir Novo IP
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="Endereço IP (ex: 192.168.1.1)"
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#ff006e]/50 transition-all"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            />
          </div>
          <div className="md:col-span-1">
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motivo (opcional)"
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#ff006e]/50 transition-all"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            />
          </div>
          <button
            type="submit"
            disabled={addMutation.isPending || !newIp.trim()}
            className="bg-[#ff006e] hover:bg-[#ff006e]/80 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem" }}
          >
            {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            BANIR IP
          </button>
        </form>
      </div>

      {/* Blacklist Table */}
      <div className="cyber-card overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#ff006e]" />
            <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Orbitron', sans-serif" }}>
              IPs na Lista Negra ({blacklist?.length ?? 0})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/5">
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Endereço IP</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Motivo</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Data do Ban</th>
                <th className="px-6 py-4 text-right text-xs tracking-widest uppercase text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-white/20" />
                  </td>
                </tr>
              ) : blacklist?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-white/20 italic">
                    Nenhum IP na lista negra.
                  </td>
                </tr>
              ) : (
                blacklist?.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#ff006e]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                        {item.ipAddress}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Info className="w-3 h-3" />
                        {item.reason || "Sem motivo especificado"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeMutation.mutate({ ipAddress: item.ipAddress })}
                        disabled={removeMutation.isPending}
                        className="p-2 rounded bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 transition-all"
                        title="Desbanir IP"
                      >
                        <Trash2 className="w-4 h-4" />
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
