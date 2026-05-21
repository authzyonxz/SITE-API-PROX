import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, Download, Shield, MessageCircle, Search, Zap, Flame, Sparkles } from "lucide-react";

export default function JzXiterUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isFetchingIp, setIsFetchingIp] = useState(false);

  const updateMutation = trpc.keys.publicUpdateIp.useMutation({
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

  const handleFetchIp = async () => {
    setIsFetchingIp(true);
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setNewIp(data.ip);
      toast.success("IP detectado!");
    } catch {
      toast.error("Erro ao detectar IP.");
    } finally {
      setIsFetchingIp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0101] text-red-100 font-sans selection:bg-red-600/40 relative overflow-hidden">
      {/* Red Smoke/Mist Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.12)_0%,transparent_70%)] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(153,27,27,0.15)_0%,transparent_60%)]" />
        
        {/* Spark Particles Simulation (CSS) */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-red-500 rounded-full animate-bounce"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDuration: (Math.random() * 3 + 2) + 's',
                animationDelay: (Math.random() * 5) + 's',
                boxShadow: '0 0 8px #ef4444'
              }}
            />
          ))}
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-red-900/50 bg-[#0a0101]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white font-orbitron">JZ <span className="text-red-600">XITER</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)]">System Status: Online</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <Flame className="w-3.5 h-3.5 fill-red-600/20" /> high performance access
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white font-orbitron">
                UPDATE <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">IP</span>
              </h1>
              <p className="text-red-200/50 text-lg max-w-xl leading-relaxed font-medium">
                Sincronize sua conexão instantaneamente com o núcleo JZ. Segurança máxima e latência zero.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-950/40 to-black/40 border border-red-900/30 p-8 md:p-12 rounded-[2rem] shadow-2xl backdrop-blur-sm relative overflow-hidden group">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full" />
              <div className="absolute -top-1 -right-1 w-20 h-20 border-t-2 border-r-2 border-red-600/30 rounded-tr-3xl" />
              <div className="absolute -bottom-1 -left-1 w-20 h-20 border-b-2 border-l-2 border-red-600/30 rounded-bl-3xl" />
              
              <div className="space-y-8 relative z-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.25em] uppercase mb-3 text-red-800">License Identity</label>
                    <div className="relative group">
                      <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-900 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="JZ-XXXX-XXXX"
                        className="w-full pl-14 pr-6 py-5 rounded-xl bg-black/40 border border-red-900/20 focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 outline-none transition-all font-mono text-red-100 placeholder:text-red-950"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-[10px] font-black tracking-[0.25em] uppercase text-red-800">Network Address</label>
                      <button 
                        onClick={handleFetchIp} 
                        disabled={isFetchingIp} 
                        className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-400 transition-colors flex items-center gap-2"
                      >
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />} Auto-detect
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-900 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="0.0.0.0"
                        className="w-full pl-14 pr-6 py-5 rounded-xl bg-black/40 border border-red-900/20 focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 outline-none transition-all font-mono text-red-100 placeholder:text-red-950"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-5 rounded-xl font-black tracking-[0.3em] uppercase transition-all shadow-[0_0_30px_rgba(220,38,38,0.2)] flex items-center justify-center gap-3 disabled:opacity-50 bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] active:scale-[0.98] font-orbitron"
                >
                  {updateMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-5 h-5 fill-white" /> Synchronize IP</>}
                </button>

                {result && (
                  <div className={`p-6 rounded-2xl border animate-in fade-in zoom-in duration-300 ${result.ok ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-600/5 border-red-600/20 text-red-400"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {result.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="font-black uppercase tracking-widest text-xs font-orbitron">{result.ok ? "Access Granted" : "Sync Failed"}</span>
                    </div>
                    <p className="text-[10px] font-mono opacity-50 break-all leading-relaxed uppercase">{result.raw}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="bg-gradient-to-br from-red-950/20 to-transparent border border-red-900/20 p-8 rounded-[2rem] space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight font-orbitron uppercase">Assets</h3>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-red-900/10 hover:border-red-600/40 hover:bg-red-600/5 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-red-900 uppercase tracking-widest mb-1">Security Core</span>
                    <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors font-orbitron">HS + ANTENA</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-red-900 group-hover:text-red-600 group-hover:animate-spin" />
                </a>

                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-red-900/10 hover:border-red-600/40 hover:bg-red-600/5 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-red-900 uppercase tracking-widest mb-1">Security Core</span>
                    <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors font-orbitron">HS PESCOÇO</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-red-900 group-hover:text-red-600 group-hover:animate-spin" />
                </a>

                <a 
                  href="https://discord.gg/jzxiter"
                  target="_blank"
                  className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-red-600/5 border border-red-600/20 text-red-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600/10 transition-all font-orbitron"
                >
                  <MessageCircle className="w-4 h-4 fill-red-600/20" /> JZ Community
                </a>
              </div>
            </div>

            <div className="bg-red-600 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-red-600/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full transition-all group-hover:scale-150" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-white tracking-tight font-orbitron uppercase italic">Core Protocol</h3>
                </div>
                <p className="text-xs text-red-100/80 leading-relaxed font-bold uppercase tracking-wider">
                  O sistema de sincronização JZ garante que sua licença esteja sempre vinculada ao seu ponto de acesso mais recente. Use o auto-detect para precisão absoluta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-red-900/20 flex flex-col md:flex-row items-center justify-between gap-6 text-red-900 text-[9px] font-black uppercase tracking-[0.4em]">
        <p>© 2026 JZ XITER PROTOCOLS. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-8">
          <span className="hover:text-red-600 cursor-pointer transition-colors">Auth</span>
          <span className="hover:text-red-600 cursor-pointer transition-colors">Proxy</span>
          <span className="hover:text-red-600 cursor-pointer transition-colors">Security</span>
        </div>
      </footer>
    </div>
  );
}
