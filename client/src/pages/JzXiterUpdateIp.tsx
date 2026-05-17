import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, ExternalLink, MessageCircle, Search } from "lucide-react";

export default function JzXiterUpdateIp() {
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
    <div className="min-h-screen bg-background cyber-grid-bg text-foreground font-sans selection:bg-red-500/30">
      <nav className="sticky top-0 z-50 border-b border-red-500/20 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-xl font-black tracking-tighter text-red-400 font-orbitron">
                JZ XITER
              </span>
            </div>

            <div className="hidden md:block">
              <a 
                href="https://www.mediafire.com/file/ll2jrzzqiv4ctjx/mitmproxy-ca-cert.pem/file"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-orbitron text-xs tracking-widest uppercase"
              >
                <Download className="w-4 h-4" />
                Download Certificado
              </a>
            </div>

            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-red-500/20 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <a 
              href="https://www.mediafire.com/file/ll2jrzzqiv4ctjx/mitmproxy-ca-cert.pem/file"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 font-orbitron text-xs tracking-widest uppercase"
            >
              <Download className="w-4 h-4" />
              Download Certificado
            </a>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <section>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-red-400 font-orbitron mb-2 shadow-red-500/20">
                  ATUALIZAR IP
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença para liberar o acesso ao proxy.
                </p>
              </div>

              <div className="cyber-card p-6 md:p-8 space-y-6 border-red-500/20 bg-red-500/[0.02]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-red-500/70 font-mono">
                      Sua Key de Acesso
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/40 group-focus-within:text-red-400 transition-colors" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-background border border-red-500/20 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition-all font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                    <ArrowRight className="w-5 h-5 text-red-500/30" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-red-500/70 font-mono">
                        Novo Endereço de IP
                      </label>
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold tracking-widest uppercase font-orbitron hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        {isFetchingIp ? "Buscando..." : "Buscar IP"}
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/40 group-focus-within:text-red-400 transition-colors" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-background border border-red-500/20 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition-all font-mono text-sm"
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
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] disabled:opacity-50 font-orbitron"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSANDO...</>
                  ) : (
                    <><Globe className="w-5 h-5" /> ATUALIZAR AGORA</>
                  )}
                </button>

                {result && (
                  <div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    result.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      {result.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="font-bold uppercase tracking-wider text-sm font-orbitron">
                        {result.ok ? "Sucesso!" : "Erro na Operação"}
                      </span>
                    </div>
                    <p className="text-xs font-mono opacity-80 break-all">{result.raw}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-bold tracking-widest uppercase font-orbitron text-red-400">DADOS DO PROXY</h2>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div key={idx} className="cyber-card overflow-hidden border-red-500/20 bg-red-500/[0.02]">
                  <div className="bg-red-500/10 px-5 py-3 border-b border-red-500/20">
                    <h3 className="text-sm font-black tracking-widest text-red-300 font-orbitron">{proxy.title}</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">{item.label}</span>
                        <span className="text-sm font-bold text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10 group-hover:border-red-500/30 transition-colors">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Info className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest font-orbitron">Aviso Importante</span>
                </div>
                <p className="text-xs text-amber-200/70 font-rajdhani leading-relaxed">Sempre que seu IP de internet mudar, você precisará voltar nesta página e atualizar o IP da sua key para continuar usando o serviço.</p>
              </div>
              
              <div className="pt-4 space-y-3">
                <a 
                  href="https://www.mediafire.com/file/ll2jrzzqiv4ctjx/mitmproxy-ca-cert.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:scale-[1.02] transition-all font-orbitron text-sm"
                >
                  <Download className="w-6 h-6" /> DOWNLOAD CERTIFICADO
                </a>
                <a 
                  href="https://discord.gg/WxNW7beFQa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-all font-orbitron text-sm"
                >
                  <ExternalLink className="w-6 h-6" /> DISCORD
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
