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
      title: "🎯 ARAAO PROXY",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1110" }
      ]
    }
  ];

  return (
    <div
      className="min-h-screen text-foreground font-sans selection:bg-blue-600/40"
      style={{
        background: "#00050a",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(30,64,175,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(30,64,175,0.1) 0%, transparent 50%), linear-gradient(rgba(30,64,175,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,64,175,0.06) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(30,64,175,0.4)",
          background: "rgba(0,5,10,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(30,64,175,0.2)",
                  borderColor: "rgba(30,64,175,0.5)",
                  boxShadow: "0 0 20px rgba(30,64,175,0.4)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#3b82f6" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#3b82f6", textShadow: "0 0 10px rgba(30,64,175,0.5)" }}
              >
                ARAAO PROXY
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://discord.gg/YkTMhzFks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase"
                style={{
                  background: "rgba(30,64,175,0.15)",
                  borderColor: "rgba(30,64,175,0.5)",
                  color: "#60a5fa",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Discord ARAAO
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors"
                style={{ color: "#3b82f6" }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
          <div
            className="md:hidden absolute top-16 left-0 w-full border-b p-4 space-y-4 animate-in slide-in-from-top duration-300"
            style={{
              background: "rgba(0,5,10,0.98)",
              borderColor: "rgba(30,64,175,0.4)",
            }}
          >
            <a
              href="https://discord.gg/YkTMhzFks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border font-orbitron text-xs tracking-widest uppercase"
              style={{
                background: "rgba(30,64,175,0.2)",
                borderColor: "rgba(30,64,175,0.5)",
                color: "#60a5fa",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Discord ARAAO
            </a>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Update IP Form */}
          <div className="lg:col-span-7 space-y-8">
            <section>
              <div className="mb-6">
                <h1
                  className="text-3xl md:text-4xl font-black tracking-tight font-orbitron mb-2"
                  style={{ color: "#3b82f6", textShadow: "0 0 15px rgba(30,64,175,0.4)" }}
                >
                  ATUALIZAR IP
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença ARAAO para liberar o acesso ao proxy.
                </p>
              </div>

              <div
                className="rounded-xl p-6 md:p-8 space-y-6 border"
                style={{
                  background: "rgba(30,64,175,0.03)",
                  borderColor: "rgba(30,64,175,0.3)",
                  boxShadow: "0 0 40px rgba(30,64,175,0.08)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono"
                      style={{ color: "rgba(96,165,250,0.8)" }}
                    >
                      Sua Key ARAAO
                    </label>
                    <div className="relative group">
                      <Key
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                        style={{ color: "rgba(30,64,175,0.5)" }}
                      />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(30,64,175,0.3)",
                          color: "rgba(255,255,255,0.95)",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono"
                      style={{ color: "rgba(96,165,250,0.8)" }}
                    >
                      Novo Endereço de IP
                    </label>
                    <div className="relative group">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                        style={{ color: "rgba(30,64,175,0.5)" }}
                      />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 192.168.1.1"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(30,64,175,0.3)",
                          color: "rgba(255,255,255,0.95)",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFetchIp}
                    disabled={isFetchingIp}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-blue-400 disabled:opacity-50"
                    style={{ color: "rgba(96,165,250,0.6)" }}
                  >
                    {isFetchingIp ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Search className="w-3 h-3" />
                    )}
                    Detectar meu IP atual
                  </button>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-orbitron font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all group relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(30,64,175,0.4)",
                  }}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Vincular IP Agora</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {result && (
                  <div
                    className={`p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                      result.ok ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    {result.ok ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-bold text-sm ${result.ok ? "text-green-400" : "text-red-400"}`}>
                        {result.ok ? "Sucesso!" : "Erro na Operação"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {result.raw}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-5 rounded-xl border bg-black/40 space-y-3"
                style={{ borderColor: "rgba(30,64,175,0.2)" }}
              >
                <div className="flex items-center gap-2 text-blue-400">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-orbitron">Como Funciona?</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O sistema de proxy da ARAAO requer que seu IP esteja autorizado. Sempre que seu IP mudar, você deve vir aqui e atualizá-lo usando sua key.
                </p>
              </div>
              <div
                className="p-5 rounded-xl border bg-black/40 space-y-3"
                style={{ borderColor: "rgba(30,64,175,0.2)" }}
              >
                <div className="flex items-center gap-2 text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-orbitron">Segurança</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sua key é pessoal e intransferível. O uso simultâneo em múltiplos IPs pode resultar no bloqueio automático da licença.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Proxy Details */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: "rgba(30,64,175,0.3)",
                background: "rgba(30,64,175,0.02)",
              }}
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{
                  background: "rgba(30,64,175,0.1)",
                  borderColor: "rgba(30,64,175,0.3)",
                }}
              >
                <h2 className="font-orbitron font-bold text-sm tracking-widest uppercase text-blue-400">
                  Configurações Proxy
                </h2>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                </div>
              </div>

              <div className="p-6 space-y-8">
                {proxyInfos.map((proxy, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/30" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/70 whitespace-nowrap">
                        {proxy.title}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/30" />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {proxy.items.map((item, iidx) => (
                        <div
                          key={iidx}
                          className="group p-4 rounded-lg border bg-black/60 transition-all hover:border-blue-500/50"
                          style={{ borderColor: "rgba(30,64,175,0.2)" }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              {item.label}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.value);
                                toast.success(`${item.label} copiado!`);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-blue-400 uppercase tracking-tighter"
                            >
                              Copiar
                            </button>
                          </div>
                          <div className="font-mono text-lg text-blue-100 tracking-tight">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div
                  className="p-4 rounded-lg border border-dashed border-blue-500/30 bg-blue-500/5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                      Certificado Necessário
                    </p>
                    <a
                      href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground hover:text-blue-400 transition-colors underline underline-offset-4"
                    >
                      Clique para baixar o Dash Cert
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-6 rounded-xl border bg-gradient-to-br from-blue-900/20 to-transparent space-y-4"
              style={{ borderColor: "rgba(30,64,175,0.3)" }}
            >
              <h3 className="font-orbitron font-bold text-xs tracking-widest uppercase text-blue-400">Suporte Araao</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Problemas com sua licença ou dúvidas sobre a configuração? Entre em nosso Discord oficial.
              </p>
              <a
                href="https://discord.gg/YkTMhzFks"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-lg border border-blue-500/50 bg-blue-500/10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Entrar no Discord
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
