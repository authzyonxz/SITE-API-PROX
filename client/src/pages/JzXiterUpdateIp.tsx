import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, Download, Menu, X, Shield, MessageCircle, Search } from "lucide-react";

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
      items: []
    },
    {
      title: "🔥 PROXY HS PESCOÇO + ANTENA",
      items: []
    }
  ];

  return (
    <div className="min-h-screen bg-background cyber-grid-bg text-foreground font-sans selection:bg-red-500/30">
      {/* Ambient red glow top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/10 blur-[120px] pointer-events-none z-0" />
      {/* Ambient red glow bottom */}
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-red-800/8 blur-[100px] pointer-events-none z-0" />

      <nav className="sticky top-0 z-50 border-b border-red-500/30 bg-background/85 backdrop-blur-md shadow-[0_1px_20px_rgba(255,26,26,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/15 border border-red-500/50 shadow-[0_0_20px_rgba(255,26,26,0.35)]">
                <Shield className="w-5 h-5 text-red-400 drop-shadow-[0_0_6px_rgba(255,26,26,0.8)]" />
              </div>
              <span className="text-xl font-black tracking-tighter neon-red font-orbitron neon-pulse">
                JZ XITER
              </span>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-red-400 hover:bg-red-500/15 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <section>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight neon-red font-orbitron mb-2 glitch-hover">
                  ATUALIZAR IP
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença para liberar o acesso ao proxy.
                </p>
              </div>

              <div className="cyber-card neon-border-red p-6 md:p-8 space-y-6 bg-red-500/[0.03]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-red-400/80 font-mono">
                      Sua Key de Acesso
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/50 group-focus-within:text-red-400 transition-colors group-focus-within:drop-shadow-[0_0_4px_rgba(255,26,26,0.8)]" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-background/80 border border-red-500/25 focus:border-red-400 focus:ring-1 focus:ring-red-400 focus:shadow-[0_0_12px_rgba(255,26,26,0.25)] outline-none transition-all font-mono text-sm text-red-100 placeholder:text-red-900/60"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-red-400/80 font-mono">
                        Novo Endereço de IP
                      </label>
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-bold tracking-widest uppercase font-orbitron hover:bg-red-500/25 hover:shadow-[0_0_10px_rgba(255,26,26,0.3)] transition-all disabled:opacity-50"
                      >
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        Detectar meu IP
                      </button>
                    </div>

                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/50 group-focus-within:text-red-400 transition-colors group-focus-within:drop-shadow-[0_0_4px_rgba(255,26,26,0.8)]" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-background/80 border border-red-500/25 focus:border-red-400 focus:ring-1 focus:ring-red-400 focus:shadow-[0_0_12px_rgba(255,26,26,0.25)] outline-none transition-all font-mono text-sm text-red-100 placeholder:text-red-900/60"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-red-500/15 border border-red-500/50 text-red-400 hover:bg-red-500/25 hover:border-red-400 hover:shadow-[0_0_25px_rgba(255,26,26,0.4),0_0_50px_rgba(255,26,26,0.15)] hover:text-red-300 disabled:opacity-50 font-orbitron neon-pulse"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSANDO...</>
                  ) : (
                    <><Globe className="w-5 h-5 drop-shadow-[0_0_4px_rgba(255,26,26,0.8)]" /> ATUALIZAR AGORA</>
                  )}
                </button>

                {result && (
                  <div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    result.ok
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
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
              <div className="space-y-4">
                <a
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-cyan-700/80 to-blue-700/80 text-white font-bold font-orbitron tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all text-[10px] border border-cyan-400/30 hover:border-cyan-400/60"
                >
                  <Download className="w-4 h-4" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-purple-700/80 to-indigo-700/80 text-white font-bold font-orbitron tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all text-[10px] border border-purple-400/30 hover:border-purple-400/60"
                >
                  <Download className="w-4 h-4" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
                <a
                  href="https://discord.gg/jzxiter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-red-500/10 border border-red-500/40 neon-red font-bold font-orbitron tracking-widest uppercase hover:bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_20px_rgba(255,26,26,0.35)] transition-all"
                >
                  <MessageCircle className="w-5 h-5 drop-shadow-[0_0_4px_rgba(255,26,26,0.8)]" />
                  ENTRAR NO DISCORD
                </a>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div key={idx} className="cyber-card neon-border-red p-5 bg-red-500/[0.03] space-y-4">
                  <h3 className="text-sm font-black tracking-widest font-orbitron neon-red">{proxy.title}</h3>
                  <div className="space-y-3">
                    {proxy.items.map((item: { label: string; value: string }, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{item.label}</span>
                        <span className="text-sm font-bold text-red-200 font-mono px-2 py-1 rounded border bg-red-500/10 border-red-500/20">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
