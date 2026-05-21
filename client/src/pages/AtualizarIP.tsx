import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, Zap, Wifi, WifiOff, Download, Sparkles, Network } from "lucide-react";

export default function AtualizarIP() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const { data: proxies, isLoading: loadingProxies } = trpc.proxy.list.useQuery();

  const updateMutation = trpc.keys.updateIp.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (data.ok) {
        toast.success("IP atualizado com sucesso!");
      } else {
        toast.error("Falha ao atualizar IP");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao atualizar IP");
    },
  });

  const handleUpdate = () => {
    if (!keyInput.trim()) { toast.error("Digite a key"); return; }
    if (!newIp.trim()) { toast.error("Digite o novo IP"); return; }
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> central de conectividade
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Atualizar <span className="text-indigo-400">IP</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mt-2">
              Gerencie os vínculos de rede das licenças e monitore o status dos servidores proxy em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Proxy Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingProxies ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="h-28 rounded-3xl animate-pulse bg-white/[0.03] border border-white/5" />
          ))
        ) : (
          proxies?.map((proxy) => (
            <div key={proxy.id} className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group">
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${proxy.status === "online" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20"}`}>
                  {proxy.status === "online" ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{proxy.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${proxy.status === "online" ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${proxy.status === "online" ? "text-emerald-400" : "text-rose-400"}`}>
                      {proxy.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`absolute -bottom-8 -right-8 w-24 h-24 blur-3xl rounded-full transition-all ${proxy.status === "online" ? "bg-emerald-500/5 group-hover:bg-emerald-500/10" : "bg-rose-500/5 group-hover:bg-rose-500/10"}`} />
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
        <div className="glass-card p-8 md:p-10 rounded-3xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-3xl rounded-full" />
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Sincronização de Rede</h3>
              <p className="text-sm text-slate-500">Insira a licença e o novo endereço de IP.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Licença (Key)</label>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Cole a key aqui..."
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-400/10 outline-none transition-all font-mono text-white placeholder-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Novo Endereço de IP</label>
              <div className="relative group">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="Ex: 192.168.1.1"
                  className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all font-mono text-white placeholder-slate-700"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={updateMutation.isPending}
            className="w-full py-5 rounded-2xl font-bold tracking-[0.2em] uppercase transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white hover:-translate-y-1 active:scale-95"
          >
            {updateMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-5 h-5 fill-white" /> Atualizar IP Agora</>}
          </button>

          {result && (
            <div className={`p-6 rounded-3xl border animate-in fade-in zoom-in duration-300 ${result.ok ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300" : "bg-rose-500/5 border-rose-500/10 text-rose-300"}`}>
              <div className="flex items-center gap-3 mb-2">
                {result.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span className="font-bold uppercase tracking-widest text-xs">{result.ok ? "Sucesso na Sincronização" : "Falha na Sincronização"}</span>
              </div>
              <p className="text-xs font-mono opacity-60 break-all">{result.raw}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Recursos</h3>
            <div className="space-y-4">
              <a 
                href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                target="_blank"
                className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Certificado</span>
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">HS + ANTENA</span>
                </div>
                <Download className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
              </a>

              <a 
                href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                target="_blank"
                className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Certificado</span>
                  <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">HS PESCOÇO</span>
                </div>
                <Download className="w-4 h-4 text-slate-600 group-hover:text-purple-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
