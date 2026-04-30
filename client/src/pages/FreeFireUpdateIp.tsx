import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search, Target } from "lucide-react";

export default function FreeFireUpdateIp() {
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
      className="min-h-screen text-foreground font-sans selection:bg-orange-500/40"
      style={{
        background: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(249,115,22,0.1) 0%, transparent 50%), linear-gradient(rgba(249,115,22,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.02) 1px, transparent 1px)",
        backgroundSize: "auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(249,115,22,0.3)",
          background: "rgba(10,10,10,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  borderColor: "rgba(249,115,22,0.4)",
                  boxShadow: "0 0 15px rgba(249,115,22,0.3)",
                }}
              >
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#ffffff", textShadow: "0 0 10px rgba(249,115,22,0.5)" }}
              >
                FREE FIRE <span className="text-orange-500">PROXY</span>
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
                  background: "rgba(249,115,22,0.1)",
                  borderColor: "rgba(249,115,22,0.4)",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#f97316";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#f97316";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(249,115,22,0.4)";
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
                className="p-2 rounded-md transition-colors text-orange-500"
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
              background: "rgba(10,10,10,0.98)",
              borderColor: "rgba(249,115,22,0.3)",
            }}
          >
            <a
              href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border font-orbitron text-xs tracking-widest uppercase font-bold"
              style={{
                background: "rgba(249,115,22,0.2)",
                borderColor: "rgba(249,115,22,0.4)",
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
                  style={{ color: "#ffffff", textShadow: "0 0 15px rgba(249,115,22,0.4)" }}
                >
                  ATUALIZAR <span className="text-orange-500">IP</span>
                </h1>
                <p className="text-muted-foreground font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença para liberar o acesso ao proxy.
                </p>
              </div>

              <div
                className="rounded-xl p-6 md:p-8 space-y-6 border"
                style={{
                  background: "rgba(249,115,22,0.03)",
                  borderColor: "rgba(249,115,22,0.2)",
                  boxShadow: "0 0 40px rgba(249,115,22,0.05)",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-orange-500/70 font-mono">
                      Sua Key de Acesso
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/50 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(249,115,22,0.2)",
                          color: "#ffffff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#f97316";
                          e.currentTarget.style.boxShadow = "0 0 10px rgba(249,115,22,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(249,115,22,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-900/30 to-transparent" />
                    <ArrowRight className="w-5 h-5 text-orange-900/30" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-900/30 to-transparent" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-orange-500/70 font-mono">
                        Novo Endereço de IP
                      </label>
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-600/10 border border-orange-600/30 text-orange-500 text-[10px] font-bold tracking-widest uppercase font-orbitron hover:bg-orange-600/20 transition-all disabled:opacity-50"
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
                      <div className="mb-2 px-3 py-2 rounded-md bg-orange-600/5 border border-orange-600/20 text-[10px] font-mono text-orange-400 animate-in fade-in slide-in-from-top-1 duration-300">
                        <span className="opacity-70 text-white">IP detectado: </span>
                        <span className="font-bold">{detectedIp}</span>
                        <span className="ml-2 opacity-50 uppercase tracking-widest">(preenchido automaticamente)</span>
                      </div>
                    )}

                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/50 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                        placeholder="Ex: 189.45.12.33"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(249,115,22,0.2)",
                          color: "#ffffff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#f97316";
                          e.currentTarget.style.boxShadow = "0 0 10px rgba(249,115,22,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(249,115,22,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-orange-600/10 border border-orange-600/40 text-orange-500 hover:bg-orange-600/20 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50 font-orbitron"
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

            {/* Download Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold tracking-widest uppercase font-orbitron text-white">
                  CERTIFICADO DE SEGURANÇA
                </h2>
              </div>

              <div 
                className="rounded-xl p-8 border text-center space-y-6"
                style={{
                  background: "rgba(249,115,22,0.05)",
                  borderColor: "rgba(249,115,22,0.2)",
                }}
              >
                <p className="text-sm text-muted-foreground font-rajdhani leading-relaxed max-w-md mx-auto">
                  Para que o proxy funcione corretamente em conexões seguras, você deve baixar e instalar o certificado abaixo no seu dispositivo.
                </p>
                
                <a
                  href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-black tracking-[0.2em] uppercase transition-all font-orbitron text-sm mx-auto"
                  style={{
                    background: "#f97316",
                    boxShadow: "0 0 20px rgba(249,115,22,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(249,115,22,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(249,115,22,0.3)";
                  }}
                >
                  <Download className="w-5 h-5" />
                  BAIXAR CERTIFICADO
                </a>
              </div>
            </section>
          </div>

          {/* Right Column: Proxy Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold tracking-widest uppercase font-orbitron text-white">
                  DADOS DO PROXY
                </h2>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border"
                  style={{
                    borderColor: "rgba(249,115,22,0.2)",
                    background: "rgba(249,115,22,0.02)",
                  }}
                >
                  <div
                    className="px-5 py-3 border-b"
                    style={{
                      background: "rgba(249,115,22,0.1)",
                      borderColor: "rgba(249,115,22,0.2)",
                    }}
                  >
                    <h3 className="text-sm font-black tracking-widest font-orbitron text-white">
                      {proxy.title}
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-orange-500/70 font-mono">
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
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t text-center" style={{ borderColor: "rgba(249,115,22,0.2)" }}>
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          FREE FIRE PROXY SYSTEM &copy; 2026 // BOOYAH!
        </p>
      </footer>
    </div>
  );
}
