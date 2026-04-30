import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search } from "lucide-react";

export default function GranjeiroUpdateIp() {
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
        background: "#0a0000",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(255,0,0,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,0,0,0.08) 0%, transparent 50%), linear-gradient(rgba(255,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
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

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <a
                href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663616040179/DUCsBHpYMCDRjylV.crt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase"
                style={{
                  background: "rgba(255,0,0,0.15)",
                  borderColor: "rgba(255,0,0,0.5)",
                  color: "#ff3333",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,0,0,0.3)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 15px rgba(255,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,0,0,0.15)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}
              >
                <Download className="w-4 h-4" />
                Download Granjeiro Cert
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors"
                style={{ color: "#ff0000" }}
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
              background: "rgba(10,0,0,0.98)",
              borderColor: "rgba(255,0,0,0.4)",
            }}
          >
            <a
              href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663616040179/DUCsBHpYMCDRjylV.crt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border font-orbitron text-xs tracking-widest uppercase"
              style={{
                background: "rgba(255,0,0,0.2)",
                borderColor: "rgba(255,0,0,0.5)",
                color: "#ff3333",
              }}
            >
              <Download className="w-4 h-4" />
              Download Granjeiro Cert
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
                  style={{ color: "#ff0000", textShadow: "0 0 15px rgba(255,0,0,0.4)" }}
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
                  background: "rgba(255,0,0,0.03)",
                  borderColor: "rgba(255,0,0,0.3)",
                  boxShadow: "0 0 40px rgba(255,0,0,0.08)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-xs font-bold tracking-widest uppercase mb-2 font-mono"
                      style={{ color: "rgba(255,51,51,0.8)" }}
                    >
                      Sua Key de Acesso
                    </label>
                    <div className="relative group">
                      <Key
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                        style={{ color: "rgba(255,0,0,0.5)" }}
                      />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(255,0,0,0.3)",
                          color: "rgba(255,255,255,0.95)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#ff0000";
                          e.currentTarget.style.boxShadow = "0 0 10px rgba(255,0,0,0.3)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,0,0,0.3)";
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
                          "linear-gradient(to right, transparent, rgba(255,0,0,0.4), transparent)",
                      }}
                    />
                    <ArrowRight className="w-5 h-5" style={{ color: "rgba(255,0,0,0.4)" }} />
                    <div
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, rgba(255,0,0,0.4), transparent)",
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="block text-xs font-bold tracking-widest uppercase font-mono"
                        style={{ color: "rgba(255,51,51,0.8)" }}
                      >
                        Novo Endereço de IP
                      </label>
                      {/* Buscar IP Button */}
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold tracking-widest uppercase font-orbitron transition-all disabled:opacity-50"
                        style={{
                          background: "rgba(255,0,0,0.2)",
                          borderColor: "rgba(255,0,0,0.5)",
                          color: "#ff3333",
                        }}
                        onMouseEnter={(e) => {
                          if (!isFetchingIp) {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,0,0,0.35)";
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 10px rgba(255,0,0,0.2)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,0,0,0.2)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
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
                          background: "rgba(255,0,0,0.1)",
                          borderColor: "rgba(255,0,0,0.4)",
                          color: "#ff3333",
                        }}
                      >
                        <span style={{ color: "rgba(255,51,51,0.7)" }}>IP detectado: </span>
                        <span className="font-bold">{detectedIp}</span>
                        <span
                          className="ml-2 text-[10px] uppercase tracking-widest"
                          style={{ color: "rgba(255,51,51,0.6)" }}
                        >
                          (preenchido automaticamente)
                        </span>
                      </div>
                    )}

                    <div className="relative group">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                        style={{ color: "rgba(255,0,0,0.5)" }}
                      />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(255,0,0,0.3)",
                          color: "rgba(255,255,255,0.95)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#ff0000";
                          e.currentTarget.style.boxShadow = "0 0 10px rgba(255,0,0,0.3)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,0,0,0.3)";
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
                    background: "rgba(255,0,0,0.25)",
                    borderColor: "rgba(255,0,0,0.6)",
                    color: "#ffffff",
                    textShadow: "0 0 5px rgba(255,255,255,0.5)"
                  }}
                  onMouseEnter={(e) => {
                    if (!updateMutation.isPending) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,0,0,0.4)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 25px rgba(255,0,0,0.5)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,0,0,0.25)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLButtonElement).style.transform = "none";
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


          </div>

          {/* Right Column: Proxy Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" style={{ color: "#ff3333" }} />
                <h2
                  className="text-xl font-bold tracking-widest uppercase font-orbitron"
                  style={{ color: "#ff3333" }}
                >
                  DADOS DO PROXY
                </h2>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border"
                  style={{
                    borderColor: "rgba(255,0,0,0.3)",
                    background: "rgba(255,0,0,0.02)",
                  }}
                >
                  <div
                    className="px-5 py-3 border-b"
                    style={{
                      background: "rgba(255,0,0,0.15)",
                      borderColor: "rgba(255,0,0,0.3)",
                    }}
                  >
                    <h3
                      className="text-sm font-black tracking-widest font-orbitron"
                      style={{ color: "#ff6666" }}
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
                  borderColor: "rgba(251,191,36,0.3)",
                  background: "rgba(251,191,36,0.08)",
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
                  style={{ color: "rgba(253,230,138,0.8)" }}
                >
                  Sempre que seu IP de internet mudar (ao reiniciar o modem ou trocar de rede),
                  você precisará voltar nesta página e atualizar o IP da sua key para continuar
                  usando o serviço.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <a
                  href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663616040179/DUCsBHpYMCDRjylV.crt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-xl text-white font-black tracking-[0.2em] uppercase transition-all font-orbitron text-sm"
                  style={{
                    background: "linear-gradient(to right, #ff0000, #990000)",
                    boxShadow: "0 0 35px rgba(255,0,0,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 45px rgba(255,0,0,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 35px rgba(255,0,0,0.5)";
                  }}
                >
                  <Download className="w-6 h-6" />
                  DOWNLOAD GRANJEIRO CERT
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="mt-12 py-8 border-t text-center"
        style={{ borderColor: "rgba(255,0,0,0.2)" }}
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          Granjeiro Proxy System &copy; 2026 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}
