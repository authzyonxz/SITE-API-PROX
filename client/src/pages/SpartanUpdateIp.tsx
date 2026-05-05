import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, MessageCircle, Menu, X, Shield, Info, Search, Download } from "lucide-react";

export default function SpartanUpdateIp() {
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
                SPARTAN PROXY
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase"
                style={{
                  background: "rgba(255,0,0,0.15)",
                  borderColor: "rgba(255,0,0,0.5)",
                  color: "#ff3333",
                }}
              >
                <Download className="w-4 h-4" />
                Download Dash Cert
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbCiClfDjiOaPi4aon2w"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border transition-all font-orbitron text-xs tracking-widest uppercase"
                style={{
                  background: "rgba(255,0,0,0.15)",
                  borderColor: "rgba(255,0,0,0.5)",
                  color: "#ff3333",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Grupo WhatsApp
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
              href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
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
              Download Dash Cert
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbCiClfDjiOaPi4aon2w"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border font-orbitron text-xs tracking-widest uppercase"
              style={{
                background: "rgba(255,0,0,0.2)",
                borderColor: "rgba(255,0,0,0.5)",
                color: "#ff3333",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Grupo WhatsApp
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
                      <button
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border transition-all"
                        style={{
                          background: "rgba(255,0,0,0.1)",
                          borderColor: "rgba(255,0,0,0.3)",
                          color: "#ff3333",
                        }}
                      >
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        BUSCAR IP
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                        style={{ color: "rgba(255,0,0,0.5)" }}
                      />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 189.120.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(255,0,0,0.3)",
                          color: "rgba(255,255,255,0.95)",
                        }}
                      />
                    </div>
                    {detectedIp && (
                      <p className="mt-2 text-[10px] font-mono" style={{ color: "rgba(255,0,0,0.6)" }}>
                        IP detectado: <span className="text-white/80">{detectedIp}</span> (PREENCHIDO AUTOMATICAMENTE)
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all font-orbitron"
                  style={{
                    background: "linear-gradient(135deg, #ff0000 0%, #990000 100%)",
                    color: "white",
                    boxShadow: "0 0 30px rgba(255,0,0,0.3)",
                  }}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Globe className="w-6 h-6" />
                      ATUALIZAR AGORA
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Result Display */}
            {result && (
              <div
                className="rounded-xl p-6 border animate-in zoom-in-95 duration-300"
                style={{
                  background: result.ok ? "rgba(0,255,136,0.05)" : "rgba(255,0,0,0.05)",
                  borderColor: result.ok ? "rgba(0,255,136,0.3)" : "rgba(255,0,0,0.3)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {result.ok ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3
                    className="text-lg font-bold font-orbitron"
                    style={{ color: result.ok ? "#00ff88" : "#ff0000" }}
                  >
                    {result.ok ? "SUCESSO NA OPERAÇÃO" : "ERRO NA OPERAÇÃO"}
                  </h3>
                </div>
                <div
                  className="p-4 rounded bg-black/40 border border-white/5 font-mono text-sm break-all"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {result.raw}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Info & Help */}
          <div className="lg:col-span-5 space-y-8">
            <section
              className="rounded-xl p-6 border"
              style={{
                background: "rgba(255,0,0,0.02)",
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-5 h-5" style={{ color: "#ff0000" }} />
                <h2 className="text-lg font-bold font-orbitron" style={{ color: "#ff0000" }}>
                  TUTORIAL DE INSTALAÇÃO
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: "rgba(255,0,0,0.2)", color: "#ff0000", border: "1px solid rgba(255,0,0,0.3)" }}
                  >
                    1
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1">Baixe o Certificado</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Clique no botão de download no topo da página para baixar o certificado necessário para o SPARTAN PROXY.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: "rgba(255,0,0,0.2)", color: "#ff0000", border: "1px solid rgba(255,0,0,0.3)" }}
                  >
                    2
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1">Atualize seu IP</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Insira sua key e seu IP atual nesta página e clique em atualizar. Lembre-se de atualizar sempre que seu IP mudar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: "rgba(255,0,0,0.2)", color: "#ff0000", border: "1px solid rgba(255,0,0,0.3)" }}
                  >
                    3
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1">Configure no Dispositivo</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Siga as instruções do grupo para configurar o proxy no seu dispositivo usando o certificado baixado.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Card */}
            <div
              className="rounded-xl p-6 border text-center space-y-4"
              style={{
                background: "linear-gradient(rgba(255,0,0,0.1), transparent)",
                borderColor: "rgba(255,0,0,0.2)",
              }}
            >
              <MessageCircle className="w-10 h-10 mx-auto" style={{ color: "#ff0000" }} />
              <div>
                <h3 className="font-bold font-orbitron" style={{ color: "#ff0000" }}>PRECISA DE AJUDA?</h3>
                <p className="text-xs text-muted-foreground mt-1">Entre em nosso canal oficial para suporte e novidades.<              <div className="pt-4 space-y-3">
                <a
                  href="https://www.mediafire.com/file/z5mgxmczilommnk/Dash+Cert+👌.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-xl text-white font-black tracking-[0.2em] uppercase transition-all font-orbitron text-sm"
                  style={{
                    background: "linear-gradient(to right, #ff0000, #990000)",
                    boxShadow: "0 0 35px rgba(255,0,0,0.5)",
                  }}
                >
                  <Download className="w-6 h-6" />
                  DOWNLOAD DASH CERT
                </a>
                <a
                  href="https://whatsapp.com/channel/0029VbCiClfDjiOaPi4aon2w"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-lg font-bold text-xs tracking-widest uppercase transition-all text-center"
                  style={{
                    background: "rgba(255,0,0,0.2)",
                    border: "1px solid rgba(255,0,0,0.4)",
                    color: "#ff3333",
                  }}
                >
                  ENTRAR NO CANAL
                </a>
              </div>    {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: "rgba(255,0,0,0.1)", background: "rgba(5,0,0,0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-4 h-4" style={{ color: "rgba(255,0,0,0.5)" }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase font-orbitron" style={{ color: "rgba(255,0,0,0.5)" }}>
              SPARTAN PROXY SYSTEM
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-mono">
            © 2024 SECURITY INFRASTRUCTURE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
