import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search, MessageCircle } from "lucide-react";

export default function AraaoProxyUpdateIp() {
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
      title: "🎯 ARAAO PROXY HS PESCOÇO",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1110" }
      ]
    },
    {
      title: "🔥 ARAAO PROXY HS PESCOÇO + ANTENA",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1119" }
      ]
    }
  ];

  return (
    <div
      className="min-h-screen text-foreground font-sans selection:bg-red-600/40"
      style={{
        background: "#0a0000",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(220,38,38,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(220,38,38,0.1) 0%, transparent 50%), linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(220,38,38,0.4)",
          background: "rgba(10,0,0,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(220,38,38,0.2)",
                  borderColor: "rgba(220,38,38,0.5)",
                  boxShadow: "0 0 20px rgba(220,38,38,0.4)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#ef4444" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#ef4444", textShadow: "0 0 10px rgba(220,38,38,0.5)" }}
              >
                AARÃO iOS
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://discord.gg/YkTMhzFks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase"
                style={{
                  background: "rgba(220,38,38,0.15)",
                  borderColor: "rgba(220,38,38,0.5)",
                  color: "#f87171",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Discord ARAAO
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
                  className="text-3xl md:text-4xl font-black tracking-tight font-orbitron mb-2"
                  style={{ color: "#ef4444", textShadow: "0 0 15px rgba(220,38,38,0.4)" }}
                >
                  ATUALIZAR IP
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença <span className="text-red-500 font-bold">AARÃO iOS</span> para liberar o acesso ao proxy.
                </p>
              </div>
              <div
                className="rounded-xl p-6 md:p-8 space-y-6 border"
                style={{
                  background: "rgba(220,38,38,0.03)",
                  borderColor: "rgba(220,38,38,0.3)",
                  boxShadow: "0 0 40px rgba(220,38,38,0.08)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono" style={{ color: "rgba(248,113,113,0.8)" }}>Sua Key ARAAO</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: "rgba(220,38,38,0.5)" }} />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(220,38,38,0.3)", color: "rgba(255,255,255,0.95)" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono" style={{ color: "rgba(248,113,113,0.8)" }}>Novo Endereço de IP</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: "rgba(220,38,38,0.5)" }} />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 192.168.1.1"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(220,38,38,0.3)", color: "rgba(255,255,255,0.95)" }}
                      />
                    </div>
                  </div>
                  <button onClick={handleFetchIp} disabled={isFetchingIp} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-red-400 disabled:opacity-50" style={{ color: "rgba(248,113,113,0.6)" }}>
                    {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                    Detectar meu IP atual
                  </button>
                </div>
                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-orbitron font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all group relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)", color: "white", boxShadow: "0 4px 20px rgba(220,38,38,0.4)" }}
                >
                  {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Vincular IP Agora</span><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                </button>
                {result && (
                  <div className={`p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${result.ok ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                    {result.ok ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className={`font-bold text-sm ${result.ok ? "text-green-400" : "text-red-400"}`}>{result.ok ? "Sucesso!" : "Erro na Operação"}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.raw}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.02)" }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: "rgba(220,38,38,0.1)", borderColor: "rgba(220,38,38,0.3)" }}>
                <h2 className="font-orbitron font-bold text-sm tracking-widest uppercase text-red-400">Configurações Proxy</h2>
              </div>
              <div className="p-6 space-y-8">
                {proxyInfos.map((proxy, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/30" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70 whitespace-nowrap">{proxy.title}</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/30" />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {proxy.items.map((item, iidx) => (
                        <div key={iidx} className="group p-4 rounded-lg border bg-black/60 transition-all hover:border-red-500/50" style={{ borderColor: "rgba(220,38,38,0.2)" }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                          </div>
                          <div className="font-mono text-lg text-red-100 tracking-tight">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 rounded-xl border bg-gradient-to-br from-red-900/20 to-transparent space-y-4" style={{ borderColor: "rgba(220,38,38,0.3)" }}>
                <h3 className="font-orbitron font-bold text-xs tracking-widest uppercase text-red-400">Certificado Aarão</h3>
                <a 
                  href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-4 rounded-lg border border-red-500/50 bg-red-500/10 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-500/20 hover:scale-[1.02] transition-all font-orbitron shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                >
                  <Download className="w-5 h-5" /> Baixar Certificado
                </a>
              </div>

              <div className="p-6 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: "rgba(220,38,38,0.2)" }}>
                <h3 className="font-orbitron font-bold text-xs tracking-widest uppercase text-red-400">Suporte Aarão</h3>
                <a href="https://discord.gg/YkTMhzFks" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-lg border border-red-500/30 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all">
                  <MessageCircle className="w-4 h-4" /> Entrar no Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
