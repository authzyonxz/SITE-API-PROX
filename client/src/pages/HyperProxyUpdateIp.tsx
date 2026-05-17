import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Shield, Search, MessageCircle, Zap } from "lucide-react";

export default function HyperProxyUpdateIp() {
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
      toast.success("IP detectado e preenchido automaticamente!");
    } catch {
      toast.error("Não foi possível detectar seu IP.");
    } finally {
      setIsFetchingIp(false);
    }
  };

  const proxyInfos = [
    {
      title: "🎯 HYPER PROXY HS PESCOÇO",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1110" }
      ]
    },
    {
      title: "🔥 HYPER PROXY HS PESCOÇO + ANTENA",
      items: [
        { label: "Servidor", value: "69.197.176.242" },
        { label: "Porta", value: "10063" }
      ]
    }
  ];

  return (
    <div
      className="min-h-screen text-foreground font-sans selection:bg-blue-600/40"
      style={{
        background: "#000a1a",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(30,144,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(30,144,255,0.1) 0%, transparent 50%), linear-gradient(rgba(30,144,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(0,191,255,0.3)",
          background: "rgba(0,10,26,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(0,191,255,0.15)",
                  borderColor: "rgba(0,191,255,0.4)",
                  boxShadow: "0 0 20px rgba(0,191,255,0.3)",
                }}
              >
                <Zap className="w-5 h-5" style={{ color: "#00bfff" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#00bfff", textShadow: "0 0 10px rgba(0,191,255,0.5)" }}
              >
                HYPER PROXY
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://chat.whatsapp.com/GBAkAJuN21X5xnVyT9d6S0?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase"
                style={{
                  background: "rgba(0,191,255,0.1)",
                  borderColor: "rgba(0,191,255,0.3)",
                  color: "#00bfff",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                CANAL HYPER
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <section>
              <div className="mb-6">
                <h1
                  className="text-3xl md:text-4xl font-black tracking-tight font-orbitron mb-2 text-center"
                  style={{ color: "#00bfff", textShadow: "0 0 15px rgba(0,191,255,0.4)" }}
                >
                  XIT PROXY WI-FI
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg text-center">
                  Vincule seu IP à sua licença <span className="text-blue-400 font-bold">HYPER PROXY</span> para máxima performance.
                </p>
              </div>

              <div
                className="rounded-xl p-6 md:p-8 space-y-6 border"
                style={{
                  background: "rgba(0,191,255,0.02)",
                  borderColor: "rgba(0,191,255,0.2)",
                  boxShadow: "0 0 40px rgba(0,191,255,0.05)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono text-blue-400/80">Sua Key HYPER</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/50" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border bg-black/50 border-blue-500/20 text-white focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(0,191,255,0.2)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono text-blue-400/80">Novo Endereço de IP</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/50" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 192.168.1.1"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border bg-black/50 border-blue-500/20 text-white focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(0,191,255,0.2)]"
                      />
                    </div>
                  </div>

                  <button onClick={handleFetchIp} disabled={isFetchingIp} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-blue-400 text-blue-500/60 disabled:opacity-50">
                    {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                    Detectar meu IP atual
                  </button>
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

        

                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-orbitron font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all group relative overflow-hidden"
                  style={{ 
                    background: "linear-gradient(135deg, #0044cc 0%, #00bfff 100%)", 
                    color: "white", 
                    boxShadow: "0 4px 20px rgba(0,191,255,0.4)" 
                  }}
                >
                  {updateMutation.isPending ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="animate-pulse">ATIVANDO HYPER...</span>
                      </div>
                    </div>
                  ) : (
                    <><span>ATIVAR XIT</span><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>

                {result && (
                  <div className={`p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${result.ok ? "bg-blue-500/10 border-blue-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                    {result.ok ? <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className={`font-bold text-sm ${result.ok ? "text-blue-300" : "text-red-400"}`}>{result.ok ? "Sucesso!" : "Erro na Operação"}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.raw}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border overflow-hidden bg-blue-500/5 border-blue-500/20">
              <div className="px-6 py-4 border-b bg-blue-500/10 border-blue-500/20">
                <h2 className="font-orbitron font-bold text-sm tracking-widest uppercase text-blue-400">Status da Rede</h2>
              </div>
              <div className="p-6 space-y-6">
                {proxyInfos.map((proxy, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/30" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/70 whitespace-nowrap">{proxy.title}</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/30" />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {proxy.items.map((item, iidx) => (
                        <div key={iidx} className="group p-4 rounded-lg border bg-black/60 border-blue-500/10 transition-all hover:border-blue-500/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                          </div>
                          <div className="font-mono text-lg text-blue-100 tracking-tight">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-900/20 to-transparent border-blue-500/30 space-y-4">
                <h3 className="font-orbitron font-bold text-xs tracking-widest uppercase text-blue-400">Certificado Hyper</h3>
                <a 
                  href="https://www.mediafire.com/file/ll2jrzzqiv4ctjx/mitmproxy-ca-cert.pem/file" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-4 rounded-lg border border-blue-500/50 bg-blue-500/10 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-blue-400 hover:bg-blue-500/20 hover:scale-[1.02] transition-all font-orbitron shadow-[0_0_20px_rgba(0,191,255,0.2)]"
                >
                  <Download className="w-5 h-5" /> DOWNLOAD CERTIFICADO
                </a>
              </div>

              <div className="p-6 rounded-xl border bg-black/40 border-blue-500/20 space-y-4">
                <h3 className="font-orbitron font-bold text-xs tracking-widest uppercase text-blue-400">Canal de Atualizações</h3>
                <a 
                  href="https://chat.whatsapp.com/GBAkAJuN21X5xnVyT9d6S0?mode=gi_t" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-3 rounded-lg border border-blue-500/30 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/5 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> ENTRAR NO CANAL
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
