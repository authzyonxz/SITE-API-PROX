import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Search, MessageCircle } from "lucide-react";

export default function GranjeiroUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        { label: "Porta", value: "10064" }
      ]
    }
  ];

  return (
    <div
      className="min-h-screen text-foreground font-sans selection:bg-red-600/40"
      style={{
        background: "#0a0000",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(255,0,0,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,0,0,0.08) 0%, transparent 50%), linear-gradient(rgba(255,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(255,0,0,0.4)",
          background: "rgba(10,0,0,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(255,0,0,0.2)",
                  borderColor: "rgba(255,0,0,0.5)",
                  boxShadow: "0 0 20px rgba(255,0,0,0.4)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#ff0000" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#ff0000", textShadow: "0 0 10px rgba(255,0,0,0.5)" }}
              >
                GRANJEIRO PROXY
              </span>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md" style={{ color: "#ff0000" }}>
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
              <div className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight font-orbitron" style={{ color: "#ff0000", textShadow: "0 0 15px rgba(255,0,0,0.4)" }}>
                  XIT PROXY WI-FI
                </h1>
              </div>

              <div
                className="rounded-xl p-6 md:p-8 space-y-6 border"
                style={{
                  background: "rgba(255,0,0,0.03)",
                  borderColor: "rgba(255,0,0,0.3)",
                  boxShadow: "0 0 40px rgba(255,0,0,0.08)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono" style={{ color: "rgba(255,51,51,0.8)" }}>Sua Key de Acesso</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "rgba(255,0,0,0.5)" }} />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border bg-black/50 border-red-500/30 text-white focus:border-red-500/60 focus:shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase font-mono" style={{ color: "rgba(255,51,51,0.8)" }}>Novo Endereço de IP</label>
                      <button onClick={handleFetchIp} disabled={isFetchingIp} className="text-xs font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-1">
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />} Detectar meu IP
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "rgba(255,0,0,0.5)" }} />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border bg-black/50 border-red-500/30 text-white focus:border-red-500/60 focus:shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                    className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all border disabled:opacity-50 font-orbitron"
                    style={{
                      background: "linear-gradient(135deg, #cc0000 0%, #ff0000 100%)",
                      borderColor: "#ff0000",
                      color: "#ffffff",
                      boxShadow: "0 4px 15px rgba(255,0,0,0.4)"
                    }}
                  >
                    {updateMutation.isPending ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="animate-pulse">ATIVANDO XIT...</span>
                        </div>
                        <span className="text-[10px] opacity-70 tracking-[0.2em] font-mono uppercase">Atualizando IP na Key</span>
                      </div>
                    ) : (
                      <><Shield className="w-5 h-5" /> ATIVAR XIT</>
                    )}
                  </button>
                </div>

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
              <a
                href="https://whatsapp.com/channel/0029Vb75xyfEVccDUvm0752q"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all border font-orbitron text-sm mb-4"
                style={{
                  background: "linear-gradient(135deg, #008037 0%, #00ff64 100%)",
                  borderColor: "#00ff64",
                  color: "#ffffff",
                  textShadow: "0 0 8px rgba(255,255,255,0.4)",
                  boxShadow: "0 4px 15px rgba(0,255,100,0.3)"
                }}
              >
                <MessageCircle className="w-5 h-5" /> KEYS GRATIS FREE
              </a>

              <div className="space-y-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold font-orbitron tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all text-[10px] border border-cyan-400/30"
                >
                  <Download className="w-4 h-4" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold font-orbitron tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all text-[10px] border border-purple-400/30"
                >
                  <Download className="w-4 h-4" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,0,0,0.3)", background: "rgba(255,0,0,0.02)" }}>
                  <div className="px-5 py-3 border-b bg-red-500/10 border-red-500/20">
                    <h3 className="text-sm font-black tracking-widest font-orbitron text-red-400">{proxy.title}</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">{item.label}</span>
                        <span className="text-sm font-bold text-white font-mono px-2 py-1 rounded border bg-white/5 border-white/10">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t text-center border-red-500/20">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          Granjeiro Proxy System &copy; 2026 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}
