import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search, MessageCircle } from "lucide-react";

export default function ProxyIosUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [detectedIp, setDetectedIp] = useState<string | null>(null);
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
    <div
      className="min-h-screen text-foreground font-sans selection:bg-purple-600/40"
      style={{
        background: "#05000a",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(147,51,234,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(147,51,234,0.1) 0%, transparent 50%), linear-gradient(rgba(147,51,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.06) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(147,51,234,0.4)",
          background: "rgba(5,0,10,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(147,51,234,0.2)",
                  borderColor: "rgba(147,51,234,0.5)",
                  boxShadow: "0 0 20px rgba(147,51,234,0.4)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#a855f7" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#a855f7", textShadow: "0 0 10px rgba(147,51,234,0.5)" }}
              >
                PROXY IOS
              </span>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors"
                style={{ color: "#a855f7" }}
              >
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
                <h1
                  className="text-3xl md:text-4xl font-black tracking-tight font-orbitron mb-2"
                  style={{ color: "#a855f7", textShadow: "0 0 15px rgba(147,51,234,0.4)" }}
                >
                  ATUALIZAR IP
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença para liberar o acesso ao proxy.
                </p>
              </div>

              <div
                className="rounded-xl p-6 md:p-8 space-y-6 border"
                style={{
                  background: "rgba(147,51,234,0.03)",
                  borderColor: "rgba(147,51,234,0.3)",
                  boxShadow: "0 0 40px rgba(147,51,234,0.08)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono" style={{ color: "rgba(192,132,252,0.8)" }}>Sua Key de Acesso</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: "rgba(147,51,234,0.5)" }} />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(147,51,234,0.3)", color: "rgba(255,255,255,0.95)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase font-mono" style={{ color: "rgba(192,132,252,0.8)" }}>Novo Endereço de IP</label>
                      <button onClick={handleFetchIp} disabled={isFetchingIp} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold tracking-widest uppercase font-orbitron transition-all disabled:opacity-50" style={{ background: "rgba(147,51,234,0.2)", borderColor: "rgba(147,51,234,0.5)", color: "#c084fc" }}>
                        {isFetchingIp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                        {isFetchingIp ? "Buscando..." : "Buscar IP"}
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: "rgba(147,51,234,0.5)" }} />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(147,51,234,0.3)", color: "rgba(255,255,255,0.95)" }}
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
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all border disabled:opacity-50 font-orbitron"
                  style={{ background: "rgba(147,51,234,0.25)", borderColor: "rgba(147,51,234,0.6)", color: "#ffffff" }}
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
                <div key={idx} className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(147,51,234,0.3)", background: "rgba(147,51,234,0.02)" }}>
                  <div className="px-5 py-3 border-b" style={{ background: "rgba(147,51,234,0.15)", borderColor: "rgba(147,51,234,0.3)" }}>
                    <h3 className="text-sm font-black tracking-widest font-orbitron" style={{ color: "#d8b4fe" }}>{proxy.title}</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">{item.label}</span>
                        <span className="text-sm font-bold text-white font-mono px-2 py-1 rounded border transition-colors" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="p-6 rounded-xl border space-y-3" style={{ borderColor: "rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.08)" }}>
                <div className="flex items-center gap-2" style={{ color: "#fbbf24" }}><Info className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-widest font-orbitron">Aviso Importante</span></div>
                <p className="text-xs font-rajdhani leading-relaxed text-amber-200/70">Sempre que seu IP mudar, você deve voltar aqui e atualizar para continuar usando o serviço.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
