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
        { label: "SERVIDOR", value: "144.172.100.226" },
        { label: "PORTA", value: "10099" }
      ]
    },
    {
      title: "🔥 PROXY HS PESCOÇO + ANTENA",
      items: [
        { label: "SERVIDOR", value: "69.197.176.242" },
        { label: "PORTA", value: "10065" }
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
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                      />
                    </div>
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
                        Detectar meu IP
                      </button>
                    </div>

                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600/50 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          borderColor: "rgba(220,38,38,0.2)",
                          color: "#ffffff",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-xl font-black font-orbitron tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                    boxShadow: "0 0 20px rgba(220,38,38,0.3)",
                    color: "#ffffff",
                  }}
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Atualizando...</>
                  ) : (
                    <><CheckCircle className="w-5 h-5" /> Atualizar IP</>
                  )}
                </button>

                {result && (
                  <div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 ${result.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {result.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="font-bold uppercase tracking-wider text-sm font-orbitron">{result.ok ? "Sucesso!" : "Erro na Operação"}</span>
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
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold font-orbitron tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all text-[10px] border border-cyan-400/30"
                >
                  <Download className="w-4 h-4" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold font-orbitron tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all text-[10px] border border-purple-400/30"
                >
                  <Download className="w-4 h-4" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
                <a 
                  href="https://whatsapp.com/channel/0029VaxK9rM0AgWJ9Uf4tB2I"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-red-600 font-bold font-orbitron tracking-widest uppercase hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  CANAL ALL HACK
                </a>
              </div>

              {proxyInfos.map((proxy, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.02)" }}>
                  <div className="px-5 py-3 border-b bg-red-600/10 border-red-600/20">
                    <h3 className="text-sm font-black tracking-widest font-orbitron text-red-600">{proxy.title}</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">{item.label}</span>
                        <span className="text-sm font-bold text-white font-mono px-2 py-1 rounded border bg-white/5 border-white/10">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t text-center border-red-500/20">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          All Hack Proxy System &copy; 2026 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}
