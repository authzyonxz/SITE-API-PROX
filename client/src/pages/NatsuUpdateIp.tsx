import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search } from "lucide-react";

export default function NatsuUpdateIp() {
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
      className="min-h-screen text-foreground font-sans selection:bg-red-500/30"
      style={{
        background: "oklch(0.08 0.02 15)",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(220,38,38,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(239,68,68,0.05) 0%, transparent 50%), linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(220,38,38,0.25)",
          background: "rgba(12,4,4,0.85)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(220,38,38,0.12)",
                  borderColor: "rgba(220,38,38,0.35)",
                  boxShadow: "0 0 15px rgba(220,38,38,0.25)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#f87171" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#f87171" }}
              >
                NATSU PROXY
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <a
                href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663616040179/ZFgWKNBPQLpYfSHi.pem"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase"
                style={{
                  background: "rgba(220,38,38,0.1)",
                  borderColor: "rgba(220,38,38,0.35)",
                  color: "#f87171",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(220,38,38,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(220,38,38,0.1)";
                }}
              >
                <Download className="w-4 h-4" />
                Download Natsu Cert
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors"
                style={{ color: "#f87171" }}
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
              background: "rgba(12,4,4,0.95)",
              borderColor: "rgba(220,38,38,0.25)",
            }}
          >
            <a
              href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663616040179/ZFgWKNBPQLpYfSHi.pem"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border font-orbitron text-xs tracking-widest uppercase"
              style={{
                background: "rgba(220,38,38,0.1)",
                borderColor: "rgba(220,38,38,0.35)",
                color: "#f87171",
              }}
            >
              <Download className="w-4 h-4" />
              Download Natsu Cert
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
                  style={{ color: "#f87171" }}
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
                  background: "rgba(220,38,38,0.02)",
                  borderColor: "rgba(220,38,38,0.2)",
                  boxShadow: "0 0 30px rgba(220,38,38,0.05)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono"
                      style={{ color: "rgba(248,113,113,0.7)" }}
                    >
                      Sua Key de Acesso
                    </label>
                    <div className="relative group">
                      <Key
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                        style={{ color: "rgba(248,113,113,0.4)" }}
                      />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          borderColor: "rgba(220,38,38,0.2)",
                          color: "rgba(255,255,255,0.9)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#f87171";
                          e.currentTarget.style.boxShadow = "0 0 0 1px #f87171";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, rgba(220,38,38,0.3), transparent)",
                      }}
                    />
                    <ArrowRight className="w-5 h-5" style={{ color: "rgba(220,38,38,0.3)" }} />
                    <div
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, rgba(220,38,38,0.3), transparent)",
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="block text-xs font-bold tracking-widest uppercase font-mono"
                        style={{ color: "rgba(248,113,113,0.7)" }}
                      >
                        Novo Endereço de IP
                      </label>
                      {/* Buscar IP Button */}
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold tracking-widest uppercase font-orbitron transition-all disabled:opacity-50"
                        style={{
                          background: "rgba(220,38,38,0.12)",
                          borderColor: "rgba(220,38,38,0.4)",
                          color: "#f87171",
                        }}
                        onMouseEnter={(e) => {
                          if (!isFetchingIp)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "rgba(220,38,38,0.25)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(220,38,38,0.12)";
                        }}
                      >
                        {isFetchingIp ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        {isFetchingIp ? "Buscando..." : "Buscar IP"}
                      </button>
                    </div>

                    {detectedIp && (
                      <div
                        className="mb-2 px-3 py-2 rounded-md border text-xs font-mono animate-in fade-in slide-in-from-top-1 duration-300"
                        style={{
                          background: "rgba(220,38,38,0.08)",
                          borderColor: "rgba(220,38,38,0.3)",
                          color: "#f87171",
                        }}
                      >
                        <span style={{ color: "rgba(248,113,113,0.6)" }}>IP detectado: </span>
                        <span className="font-bold">{detectedIp}</span>
                        <span
                          className="ml-2 text-[10px] uppercase tracking-widest"
                          style={{ color: "rgba(248,113,113,0.5)" }}
                        >
                          (preenchido automaticamente)
                        </span>
                      </div>
                    )}

                    <div className="relative group">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                        style={{ color: "rgba(248,113,113,0.4)" }}
                      />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          borderColor: "rgba(220,38,38,0.2)",
                          color: "rgba(255,255,255,0.9)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#f87171";
                          e.currentTarget.style.boxShadow = "0 0 0 1px #f87171";
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
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all border disabled:opacity-50 font-orbitron"
                  style={{
                    background: "rgba(220,38,38,0.12)",
                    borderColor: "rgba(220,38,38,0.45)",
                    color: "#f87171",
                  }}
                  onMouseEnter={(e) => {
                    if (!updateMutation.isPending) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(220,38,38,0.22)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 20px rgba(220,38,38,0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(220,38,38,0.12)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
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
                <Info className="w-6 h-6" style={{ color: "#f87171" }} />
                <h2
                  className="text-xl font-bold tracking-widest uppercase font-orbitron"
                  style={{ color: "#f87171" }}
                >
                  TUTORIAL DE INSTALAÇÃO
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    step: "1",
                    title: "Baixar Natsu Cert",
                    desc: (
                      <>
                        Clique no botão no topo da página para baixar o arquivo{" "}
                        <b>Natsu Cert.pem</b>. Este certificado é necessário para que o proxy
                        funcione em conexões seguras.
                      </>
                    ),
                  },
                  {
                    step: "2",
                    title: "Instalar no Dispositivo",
                    desc: "Abra o arquivo baixado e siga as instruções do seu sistema para instalar. No Android/iOS, vá em Configurações de Segurança e instale como Certificado de Confiança.",
                  },
                  {
                    step: "3",
                    title: "Confiar no Certificado",
                    desc: (
                      <>
                        <b>IMPORTANTE:</b> Após instalar, você deve habilitar a confiança total
                        para este certificado nas configurações de certificados raiz confiáveis do
                        seu aparelho.
                      </>
                    ),
                  },
                  {
                    step: "4",
                    title: "Configurar Proxy",
                    desc: "Use os dados de IP e Porta fornecidos ao lado nas configurações de rede do seu dispositivo ou aplicativo.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl p-5 border space-y-3"
                    style={{
                      background: "rgba(220,38,38,0.02)",
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                      style={{ background: "rgba(220,38,38,0.2)", color: "#f87171" }}
                    >
                      {item.step}
                    </div>
                    <h3
                      className="font-bold text-sm uppercase tracking-wider font-orbitron"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
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
                <Shield className="w-6 h-6" style={{ color: "#c084fc" }} />
                <h2
                  className="text-xl font-bold tracking-widest uppercase font-orbitron"
                  style={{ color: "#c084fc" }}
                >
                  DADOS DO PROXY
                </h2>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border"
                  style={{
                    borderColor: "rgba(192,132,252,0.2)",
                    background: "rgba(192,132,252,0.02)",
                  }}
                >
                  <div
                    className="px-5 py-3 border-b"
                    style={{
                      background: "rgba(192,132,252,0.08)",
                      borderColor: "rgba(192,132,252,0.2)",
                    }}
                  >
                    <h3
                      className="text-sm font-black tracking-widest font-orbitron"
                      style={{ color: "#d8b4fe" }}
                    >
                      {proxy.title}
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-bold text-white font-mono px-2 py-1 rounded border transition-colors"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              borderColor: "rgba(255,255,255,0.1)",
                            }}
                          >
                            {item.value}
                          </span>
                        </div>
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
                <div className="flex items-center gap-2" style={{ color: "#fbbf24" }}>
                  <Info className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest font-orbitron">
                    Aviso Importante
                  </span>
                </div>
                <p
                  className="text-xs font-rajdhani leading-relaxed"
                  style={{ color: "rgba(253,230,138,0.7)" }}
                >
                  Sempre que seu IP de internet mudar (ao reiniciar o modem ou trocar de rede),
                  você precisará voltar nesta página e atualizar o IP da sua key para continuar
                  usando o serviço.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <a
                  href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663616040179/ZFgWKNBPQLpYfSHi.pem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-xl text-white font-black tracking-[0.2em] uppercase transition-all font-orbitron text-sm"
                  style={{
                    background: "linear-gradient(to right, #dc2626, #b91c1c)",
                    boxShadow: "0 0 30px rgba(220,38,38,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                  }}
                >
                  <Download className="w-6 h-6" />
                  DOWNLOAD NATSU CERT
                </a>
                <a
                  href="https://discord.gg/DmM9FecBER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-xl text-white font-black tracking-[0.2em] uppercase transition-all font-orbitron text-sm"
                  style={{
                    background: "linear-gradient(to right, #5865f2, #4752c4)",
                    boxShadow: "0 0 30px rgba(88,101,242,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                  }}
                >
                  {/* Discord SVG Icon */}
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  SERVIDOR DISCORD
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="mt-12 py-8 border-t text-center"
        style={{ borderColor: "rgba(220,38,38,0.1)" }}
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          Natsu Proxy System &copy; 2026 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}
