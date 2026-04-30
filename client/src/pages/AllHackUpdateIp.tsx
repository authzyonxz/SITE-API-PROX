import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search, MessageSquare } from "lucide-react";

export default function AllHackUpdateIp() {
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
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1119" }
      ]
    }
  ];

  return (
    <div
      className="min-h-screen text-foreground font-sans selection:bg-red-600/40"
      style={{
        background: "#050000",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(220,38,38,0.1) 0%, transparent 50%), linear-gradient(rgba(220,38,38,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.03) 1px, transparent 1px)",
        backgroundSize: "auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(220,38,38,0.3)",
          background: "rgba(5,0,0,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(220,38,38,0.15)",
                  borderColor: "rgba(220,38,38,0.4)",
                  boxShadow: "0 0 15px rgba(220,38,38,0.3)",
                }}
              >
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#ffffff", textShadow: "0 0 10px rgba(220,38,38,0.5)" }}
              >
                ALL HACK <span className="text-red-600">PROXY</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <a
                href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase font-bold"
                style={{
                  background: "rgba(220,38,38,0.1)",
                  borderColor: "rgba(220,38,38,0.4)",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#dc2626";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(220,38,38,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(220,38,38,0.4)";
                }}
              >
                <Download className="w-4 h-4" />
                Download Certificado
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors text-red-600"
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
              background: "rgba(5,0,0,0.98)",
              borderColor: "rgba(220,38,38,0.3)",
            }}
          >
            <a
              href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border font-orbitron text-xs tracking-widest uppercase font-bold"
              style={{
                background: "rgba(220,38,38,0.2)",
                borderColor: "rgba(220,38,38,0.4)",
                color: "#ffffff",
              }}
            >
              <Download className="w-4 h-4" />
              Download Certificado
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
                  style={{ color: "#ffffff", textShadow: "0 0 15px rgba(220,38,38,0.4)" }}
                >
                  ATUALIZAR <span className="text-red-600">IP</span>
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença para liberar o acesso ao proxy.
                </p>
              </div>

              <div
                className="rounded-xl p-6 md:p-8 space-y-6 border"
                style={{
                  background: "rgba(220,38,38,0.03)",
                  borderColor: "rgba(220,38,38,0.2)",
                  boxShadow: "0 0 40px rgba(220,38,38,0.05)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-red-500/70 font-mono">
                      Sua Key de Acesso
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600/50 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(220,38,38,0.2)",
                          color: "#ffffff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#dc2626";
                          e.currentTarget.style.boxShadow = "0 0 10px rgba(220,38,38,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
                    <ArrowRight className="w-5 h-5 text-red-900/30" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-red-500/70 font-mono">
                        Novo Endereço de IP
                      </label>
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600/10 border border-red-600/30 text-red-500 text-[10px] font-bold tracking-widest uppercase font-orbitron hover:bg-red-600/20 transition-all disabled:opacity-50"
                      >
                        {isFetchingIp ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Search className="w-3 h-3" />
                        )}
                        {isFetchingIp ? "Buscando..." : "Buscar IP"}
                      </button>
                    </div>

                    {detectedIp && (
                      <div className="mb-2 px-3 py-2 rounded-md bg-red-600/5 border border-red-600/20 text-[10px] font-mono text-red-400 animate-in fade-in slide-in-from-top-1 duration-300">
                        <span className="opacity-70 text-white">IP detectado: </span>
                        <span className="font-bold">{detectedIp}</span>
                        <span className="ml-2 opacity-50 uppercase tracking-widest">(preenchido automaticamente)</span>
                      </div>
                    )}

                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600/50 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                        placeholder="Ex: 189.45.12.33"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(220,38,38,0.2)",
                          color: "#ffffff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#dc2626";
                          e.currentTarget.style.boxShadow = "0 0 10px rgba(220,38,38,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-red-600/10 border border-red-600/40 text-red-500 hover:bg-red-600/20 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 font-orbitron"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> PROCESSANDO...
                    </>
                  ) : (
                    <>
                      <Globe className="w-5 h-5" /> ATUALIZAR AGORA
                    </>
                  )}
                </button>

                {result && (
                  <div
                    className={`p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                      result.ok
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {result.ok ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span className="font-bold uppercase tracking-wider text-sm font-orbitron">
                        {result.ok ? "Sucesso!" : "Erro na Operação"}
                      </span>
                    </div>
                    <p className="text-xs font-mono opacity-80 break-all">{result.raw}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Tutorial Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold tracking-widest uppercase font-orbitron text-white">
                  GUIA DE INSTALAÇÃO
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    step: "1",
                    title: "Baixar Certificado",
                    desc: "Clique no botão no topo da página para baixar o arquivo de segurança necessário.",
                  },
                  {
                    step: "2",
                    title: "Instalar Perfil",
                    desc: "Abra o arquivo e instale como um perfil de configuração confiável no seu dispositivo.",
                  },
                  {
                    step: "3",
                    title: "Confiança Total",
                    desc: "Habilite a confiança total para o certificado nas configurações do seu aparelho.",
                  },
                  {
                    step: "4",
                    title: "Configurar Proxy",
                    desc: "Use os dados de IP e Porta fornecidos ao lado nas configurações de rede.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl p-5 border space-y-3"
                    style={{
                      background: "rgba(220,38,38,0.02)",
                      borderColor: "rgba(220,38,38,0.15)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                      style={{ background: "rgba(220,38,38,0.2)", color: "#ffffff" }}
                    >
                      {item.step}
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-wider font-orbitron text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-rajdhani leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Proxy Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold tracking-widest uppercase font-orbitron text-white">
                  DADOS DO PROXY
                </h2>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border"
                  style={{
                    borderColor: "rgba(220,38,38,0.2)",
                    background: "rgba(220,38,38,0.02)",
                  }}
                >
                  <div
                    className="px-5 py-3 border-b"
                    style={{
                      background: "rgba(220,38,38,0.1)",
                      borderColor: "rgba(220,38,38,0.2)",
                    }}
                  >
                    <h3 className="text-sm font-black tracking-widest font-orbitron text-white">
                      {proxy.title}
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-red-500/70 font-mono">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div
                className="p-6 rounded-xl border space-y-3"
                style={{
                  borderColor: "rgba(251,191,36,0.2)",
                  background: "rgba(251,191,36,0.05)",
                }}
              >
                <div className="flex items-center gap-2 text-yellow-500">
                  <Info className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest font-orbitron">
                    Aviso Importante
                  </span>
                </div>
                <p className="text-xs font-rajdhani leading-relaxed text-yellow-200/70">
                  Sempre que seu IP mudar, você deve voltar aqui e atualizar para continuar usando o serviço.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <a
                  href="https://discord.gg/allhack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-black tracking-[0.2em] uppercase transition-all font-orbitron text-sm"
                  style={{
                    background: "#5865F2",
                    boxShadow: "0 0 20px rgba(88,101,242,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(88,101,242,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(88,101,242,0.3)";
                  }}
                >
                  <MessageSquare className="w-5 h-5" />
                  ENTRAR NO DISCORD
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t text-center" style={{ borderColor: "rgba(220,38,38,0.2)" }}>
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          ALL HACK PROXY SYSTEM &copy; 2026 // SECURE CONNECTION
        </p>
      </footer>
    </div>
  );
}
