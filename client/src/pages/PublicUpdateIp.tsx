import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, MessageCircle, Search, Bell, MoreVertical } from "lucide-react";

export default function PublicUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [detectedIp, setDetectedIp] = useState<string | null>(null);
  const [isFetchingIp, setIsFetchingIp] = useState(false);
  const [showChannelWarning, setShowChannelWarning] = useState(false);

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
    if (!showChannelWarning) {
      setShowChannelWarning(true);
      return;
    }
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() });
  };

  const confirmAndStore = () => {
    setShowChannelWarning(false);
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() });
  };

  const handleFetchIp = async () => {
    setIsFetchingIp(true);
    setDetectedIp(null);
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setDetectedIp(data.ip);
      setNewIp(data.ip);
      toast.success("IP detectado e preenchido automaticamente!");
    } catch {
      toast.error("Não foi possível detectar seu IP. Tente novamente.");
    } finally {
      setIsFetchingIp(false);
    }
  };

  const proxyInfos = [
    {
      title: "🎯 PROXY HS PESCOÇO",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1110" }
      ]
    },
    {
      title: "🔥 PROXY HS PESCOÇO + ANTENA",
      items: [
        { label: "Servidor", value: "69.197.176.242" },
        { label: "Porta", value: "10063" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground font-sans selection:bg-cyan-500/30">
      {showChannelWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center animate-pulse">
                <Bell className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-center text-white font-orbitron mb-4">AVISO IMPORTANTE!</h2>
            <p className="text-slate-300 text-center font-rajdhani text-lg leading-relaxed mb-8">
              Para atualizar o IP da sua key, você precisa entrar no nosso <span className="text-cyan-400 font-bold">Canal de Atualizações</span>. 
            </p>
            <div className="space-y-4">
              <a href="https://whatsapp.com/channel/0029VbCu4r23WHTYia22EO3N" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black font-orbitron tracking-widest uppercase transition-all shadow-lg shadow-green-500/20">
                <MessageCircle className="w-5 h-5" /> Entrar no Canal
              </a>
              <button onClick={confirmAndStore} className="w-full py-3 text-slate-500 hover:text-cyan-400 font-bold font-rajdhani tracking-widest uppercase transition-colors">Já estou no canal, atualizar IP</button>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-cyan-400 font-orbitron">AUTH PROXY</span>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <section>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-orbitron mb-2">ATUALIZAR IP</h1>
                <p className="text-slate-400 font-rajdhani text-lg">Vincule seu endereço de IP atual à sua licença para liberar o acesso ao proxy.</p>
              </div>

              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-slate-400 font-mono">Sua Key de Acesso</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all font-mono text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 font-mono">Novo Endereço de IP</label>
                      <button onClick={handleFetchIp} disabled={isFetchingIp} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest uppercase font-orbitron hover:bg-cyan-500/30 transition-all disabled:opacity-50">
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        {isFetchingIp ? "Buscando..." : "Buscar IP"}
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all font-mono text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
                    Certificados
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all text-xs"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        background: "rgba(0,212,255,0.1)",
                        border: "1px solid rgba(0,212,255,0.5)",
                        color: "rgba(0,212,255,0.8)",
                        boxShadow: "0 0 10px rgba(0,212,255,0.2)",
                      }}
                    >
                      📥 DOWNLOAD CERTIFICADO (HS ANTENA)
                    </a>
                    <a
                      href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all text-xs"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        background: "rgba(157,78,221,0.1)",
                        border: "1px solid rgba(157,78,221,0.5)",
                        color: "rgba(157,78,221,0.8)",
                        boxShadow: "0 0 10px rgba(157,78,221,0.2)",
                      }}
                    >
                      📥 DOWNLOAD CERTIFICADO (HS PESCOÇO)
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-50 shadow-lg shadow-cyan-500/30 font-orbitron"
                >
                  {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Globe className="w-5 h-5" /> ATUALIZAR AGORA</>}
                </button>

                {result && (
                  <div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 ${result.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {result.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="font-bold uppercase tracking-wider text-sm font-orbitron">{result.ok ? "Sucesso!" : "Erro na Operação"}</span>
                    </div>
                    <p className="text-xs font-mono opacity-80 break-all">{result.raw}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              {proxyInfos.map((proxy, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl overflow-hidden">
                  <div className="bg-purple-500/20 px-5 py-3 border-b border-white/10">
                    <h3 className="text-sm font-black tracking-widest text-purple-300 font-orbitron">{proxy.title}</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">{item.label}</span>
                        <span className="text-sm font-bold text-white font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group-hover:border-purple-500/30 transition-colors">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400"><Info className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-widest font-orbitron">Aviso Importante</span></div>
                <p className="text-xs text-amber-200/70 font-rajdhani leading-relaxed">Sempre que seu IP mudar, você precisará voltar nesta página e atualizar o IP da sua key para continuar usando o serviço.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
