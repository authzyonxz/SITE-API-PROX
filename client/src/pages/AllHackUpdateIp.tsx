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
        background: "#000000",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(220,38,38,0.15) 0%, transparent 70%), linear-gradient(rgba(220,38,38,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, 30px 30px, 30px 30px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b-2 backdrop-blur-xl"
        style={{
          borderColor: "#dc2626",
          background: "rgba(0,0,0,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 animate-pulse"
                style={{
                  background: "rgba(220,38,38,0.2)",
                  borderColor: "#dc2626",
                  boxShadow: "0 0 20px rgba(220,38,38,0.6)",
                }}
              >
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <span
                className="text-2xl font-black tracking-widest font-orbitron italic"
                style={{ color: "#ffffff", textShadow: "2px 2px 0px #dc2626" }}
              >
                ALL HACK PROXY
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <a
                href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-orbitron text-sm tracking-widest uppercase font-bold"
                style={{
                  background: "#dc2626",
                  borderColor: "#dc2626",
                  color: "#ffffff",
                  boxShadow: "0 0 15px rgba(220,38,38,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#ffffff";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#dc2626";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 25px rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#dc2626";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 15px rgba(220,38,38,0.4)";
                }}
              >
                <Download className="w-5 h-5" />
                Download Certificado
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors text-red-600"
              >
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
          <div
            className="md:hidden absolute top-20 left-0 w-full border-b-2 p-6 space-y-4 animate-in slide-in-from-top duration-300"
            style={{
              background: "rgba(0,0,0,0.98)",
              borderColor: "#dc2626",
            }}
          >
            <a
              href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-full border-2 font-orbitron text-sm tracking-widest uppercase font-bold"
              style={{
                background: "#dc2626",
                borderColor: "#dc2626",
                color: "#ffffff",
              }}
            >
              <Download className="w-5 h-5" />
              Download Certificado
            </a>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Update IP Form */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="mb-8 text-center lg:text-left">
                <h1
                  className="text-5xl md:text-6xl font-black tracking-tighter font-orbitron mb-4 italic"
                  style={{ color: "#ffffff", textShadow: "4px 4px 0px #dc2626" }}
                >
                  SISTEMA DE ATUALIZAÇÃO
                </h1>
                <p className="text-red-500 font-bold text-xl uppercase tracking-widest">
                  Vincule seu IP agora para liberar o acesso total.
                </p>
              </div>

              <div
                className="rounded-3xl p-8 md:p-10 space-y-8 border-2"
                style={{
                  background: "rgba(20,0,0,0.8)",
                  borderColor: "#dc2626",
                  boxShadow: "0 0 60px rgba(220,38,38,0.15)",
                }}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black tracking-[0.3em] uppercase mb-3 text-white font-orbitron">
                      CHAVE DE ACESSO (KEY)
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-red-600" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="INSIRA SUA KEY AQUI..."
                        className="w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all font-mono text-lg border-2"
                        style={{
                          background: "#000000",
                          borderColor: "rgba(220,38,38,0.3)",
                          color: "#ffffff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#dc2626";
                          e.currentTarget.style.boxShadow = "0 0 20px rgba(220,38,38,0.4)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex-1 h-1 bg-red-900/30" />
                    <ArrowRight className="w-8 h-8 text-red-600 animate-bounce-x" />
                    <div className="flex-1 h-1 bg-red-900/30" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-black tracking-[0.3em] uppercase text-white font-orbitron">
                        ENDEREÇO DE IP
                      </label>
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs font-black tracking-widest uppercase font-orbitron transition-all disabled:opacity-50"
                        style={{
                          background: "#ffffff",
                          borderColor: "#ffffff",
                          color: "#000000",
                        }}
                        onMouseEnter={(e) => {
                          if (!isFetchingIp) {
                            (e.currentTarget as HTMLButtonElement).style.background = "#dc2626";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626";
                            (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffffff";
                          (e.currentTarget as HTMLButtonElement).style.color = "#000000";
                        }}
                      >
                        {isFetchingIp ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        {isFetchingIp ? "BUSCANDO..." : "BUSCAR MEU IP"}
                      </button>
                    </div>

                    {detectedIp && (
                      <div
                        className="mb-4 px-4 py-3 rounded-xl border-2 text-sm font-mono animate-in zoom-in-95 duration-300"
                        style={{
                          background: "rgba(220,38,38,0.1)",
                          borderColor: "#dc2626",
                          color: "#ffffff",
                        }}
                      >
                        <span className="text-red-500 font-black">DETECTADO: </span>
                        <span className="font-bold text-lg">{detectedIp}</span>
                      </div>
                    )}

                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-red-600" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                        placeholder="EX: 189.45.12.33"
                        className="w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all font-mono text-lg border-2"
                        style={{
                          background: "#000000",
                          borderColor: "rgba(220,38,38,0.3)",
                          color: "#ffffff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#dc2626";
                          e.currentTarget.style.boxShadow = "0 0 20px rgba(220,38,38,0.4)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-6 rounded-2xl font-black tracking-[0.4em] uppercase flex items-center justify-center gap-4 transition-all border-2 disabled:opacity-50 font-orbitron text-xl"
                  style={{
                    background: "#dc2626",
                    borderColor: "#dc2626",
                    color: "#ffffff",
                    boxShadow: "0 10px 30px rgba(220,38,38,0.4)"
                  }}
                  onMouseEnter={(e) => {
                    if (!updateMutation.isPending) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 15px 40px rgba(220,38,38,0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 30px rgba(220,38,38,0.4)";
                  }}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-7 h-7 animate-spin" /> PROCESSANDO...
                    </>
                  ) : (
                    <>
                      <Globe className="w-7 h-7" /> ATUALIZAR AGORA
                    </>
                  )}
                </button>

                {result && (
                  <div
                    className={`p-6 rounded-2xl border-4 animate-in slide-in-from-bottom-4 duration-500 ${
                      result.ok
                        ? "bg-green-900/20 border-green-600 text-green-400"
                        : "bg-red-900/20 border-red-600 text-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      {result.ok ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <XCircle className="w-8 h-8" />
                      )}
                      <span className="font-black uppercase tracking-widest text-xl font-orbitron">
                        {result.ok ? "SUCESSO TOTAL!" : "FALHA NO SISTEMA"}
                      </span>
                    </div>
                    <p className="text-sm font-mono font-bold break-all opacity-90">{result.raw}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Tutorial Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <Info className="w-8 h-8 text-red-600" />
                <h2 className="text-2xl font-black tracking-widest uppercase font-orbitron text-white">
                  GUIA DE INSTALAÇÃO
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    step: "01",
                    title: "BAIXAR CERTIFICADO",
                    desc: "Clique no botão de download no topo para obter o arquivo de segurança necessário.",
                  },
                  {
                    step: "02",
                    title: "INSTALAR PERFIL",
                    desc: "Abra o arquivo e instale como um perfil de configuração confiável no seu dispositivo.",
                  },
                  {
                    step: "03",
                    title: "CONFIANÇA TOTAL",
                    desc: "Vá em Ajustes > Geral > Sobre > Certificados e ative a confiança total para o ALL HACK.",
                  },
                  {
                    step: "04",
                    title: "CONFIGURAR REDE",
                    desc: "Insira os dados de IP e Porta do servidor nas configurações de proxy da sua rede Wi-Fi.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl p-6 border-2 space-y-4 transition-all hover:border-red-600 group"
                    style={{
                      background: "rgba(220,38,38,0.05)",
                      borderColor: "rgba(220,38,38,0.2)",
                    }}
                  >
                    <div className="text-4xl font-black text-red-900/40 font-orbitron group-hover:text-red-600 transition-colors">
                      {item.step}
                    </div>
                    <h3 className="font-black text-lg uppercase tracking-widest font-orbitron text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-bold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Proxy Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-red-600" />
                <h2 className="text-2xl font-black tracking-widest uppercase font-orbitron text-white">
                  DADOS DO SERVIDOR
                </h2>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden border-2"
                  style={{
                    borderColor: "#dc2626",
                    background: "rgba(20,0,0,0.9)",
                  }}
                >
                  <div className="px-6 py-4 bg-red-600">
                    <h3 className="text-lg font-black tracking-widest font-orbitron text-white italic">
                      {proxy.title}
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-black uppercase tracking-widest text-red-500 font-mono">
                          {item.label}
                        </span>
                        <span className="text-lg font-black text-white font-mono bg-red-900/20 px-4 py-2 rounded-xl border border-red-900/40">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div
                className="p-8 rounded-3xl border-2 space-y-4"
                style={{
                  borderColor: "#fbbf24",
                  background: "rgba(251,191,36,0.1)",
                }}
              >
                <div className="flex items-center gap-3 text-yellow-500">
                  <Info className="w-6 h-6" />
                  <span className="text-sm font-black uppercase tracking-widest font-orbitron">
                    AVISO CRÍTICO
                  </span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-yellow-200/80">
                  SEMPRE QUE SUA INTERNET REINICIAR, VOCÊ DEVE VOLTAR AQUI E ATUALIZAR SEU IP. 
                  CASO CONTRÁRIO, O PROXY NÃO IRÁ FUNCIONAR!
                </p>
              </div>

              <div className="pt-6 space-y-4">
                <a
                  href="https://discord.gg/allhack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-4 w-full py-6 rounded-2xl text-white font-black tracking-[0.3em] uppercase transition-all font-orbitron text-lg"
                  style={{
                    background: "#5865F2",
                    boxShadow: "0 10px 30px rgba(88,101,242,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-5px)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 20px 40px rgba(88,101,242,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 30px rgba(88,101,242,0.4)";
                  }}
                >
                  <MessageSquare className="w-7 h-7" />
                  ENTRAR NO DISCORD
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-12 border-t-2 text-center" style={{ borderColor: "#dc2626" }}>
        <p className="text-xs tracking-[0.5em] uppercase text-red-600 font-black font-orbitron">
          ALL HACK PROXY SYSTEM &copy; 2026 // NO MERCY
        </p>
      </footer>
    </div>
  );
}
