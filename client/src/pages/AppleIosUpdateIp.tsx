import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Search, MoreVertical, Bell, MessageCircle } from "lucide-react";

export default function AppleIosUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFetchingIp, setIsFetchingIp] = useState(false);
  const [detectedIp, setDetectedIp] = useState<string | null>(null);

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
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setNewIp(data.ip);
      setDetectedIp(data.ip);
      toast.success("IP detectado com sucesso!");
    } catch {
      toast.error("Erro ao detectar IP.");
    } finally {
      setIsFetchingIp(false);
    }
  };

  const proxyInfos = [
    {
      title: "PROXY APPLE HS PESCOÇO",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1110" }
      ]
    },
    {
      title: "PROXY APPLE HS PESCOÇO + ANTENA",
      items: [
        { label: "Servidor", value: "69.197.176.242" },
        { label: "Porta", value: "10063" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-red-500/30">
      <nav className="sticky top-0 z-50 border-b bg-black/80 backdrop-blur-md" style={{ borderColor: "rgba(255,0,0,0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center border" style={{ background: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.3)" }}>
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white font-orbitron uppercase">
                APPLE <span className="text-red-600">IOS</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a 
                href="https://www.mediafire.com/file/ll2jrzzqiv4ctjx/mitmproxy-ca-cert.pem/file"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border text-xs font-bold tracking-widest uppercase transition-all"
                style={{ background: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.3)", color: "#ff3333" }}
              >
                <Download className="w-4 h-4" />
                Certificado
              </a>
              <a 
                href="https://whatsapp.com/channel/0029VbCiClfDjiOaPi4aon2w"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md border text-xs font-bold tracking-widest uppercase transition-all"
                style={{ background: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.3)", color: "#ff3333" }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-red-600">
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
                <h1 className="text-3xl md:text-4xl font-black tracking-tight font-orbitron mb-2 text-white">ATUALIZAR IP</h1>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Apple iOS Integration System</p>
              </div>

              <div className="rounded-xl border p-6 md:p-8 space-y-6" style={{ background: "rgba(255,0,0,0.02)", borderColor: "rgba(255,0,0,0.1)" }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-3 font-mono" style={{ color: "rgba(255,51,51,0.8)" }}>Sua Key de Acesso</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "rgba(255,0,0,0.4)" }} />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,0,0,0.3)", color: "rgba(255,255,255,0.95)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold tracking-widest uppercase font-mono" style={{ color: "rgba(255,51,51,0.8)" }}>Novo Endereço de IP</label>
                      <button onClick={handleFetchIp} disabled={isFetchingIp} className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border transition-all" style={{ background: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.3)", color: "#ff3333" }}>
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        BUSCAR IP
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "rgba(255,0,0,0.5)" }} />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 189.120.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg outline-none transition-all font-mono text-sm border"
                        style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,0,0,0.3)", color: "rgba(255,255,255,0.95)" }}
                      />
                    </div>
                    {detectedIp && <p className="mt-2 text-[10px] font-mono" style={{ color: "rgba(255,0,0,0.6)" }}>IP detectado: <span className="text-white/80">{detectedIp}</span></p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
                    Certificados
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all text-xs"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        background: "rgba(0,212,255,0.1)",
                        border: "1px solid rgba(0,212,255,0.5)",
                        color: "rgba(0,212,255,0.8)",
                        boxShadow: "0 0 10px rgba(0,212,255,0.2)",
                      }}
                    >
                      📥 DOWNLOAD CERTIFICADO (HS ANTENA)
                    </a>
                    <a
                      href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all text-xs"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        background: "rgba(157,78,221,0.1)",
                        border: "1px solid rgba(157,78,221,0.5)",
                        color: "rgba(157,78,221,0.8)",
                        boxShadow: "0 0 10px rgba(157,78,221,0.2)",
                      }}
                    >
                      📥 DOWNLOAD CERTIFICADO (HS PESCOÇO)
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all font-orbitron"
                  style={{ background: "linear-gradient(135deg, #ff0000 0%, #990000 100%)", color: "white", boxShadow: "0 0 30px rgba(255,0,0,0.3)" }}
                >
                  {updateMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Globe className="w-6 h-6" /> ATUALIZAR AGORA</>}
                </button>

                {result && (
                  <div className="rounded-xl p-6 border animate-in zoom-in-95 duration-300" style={{ background: result.ok ? "rgba(0,255,136,0.05)" : "rgba(255,0,0,0.05)", borderColor: result.ok ? "rgba(0,255,136,0.3)" : "rgba(255,0,0,0.3)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      {result.ok ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                      <h3 className="text-lg font-bold font-orbitron" style={{ color: result.ok ? "#00ff88" : "#ff0000" }}>{result.ok ? "SUCESSO" : "ERRO"}</h3>
                    </div>
                    <div className="p-4 rounded bg-black/40 border border-white/5 font-mono text-sm break-all" style={{ color: "rgba(255,255,255,0.7)" }}>{result.raw}</div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {proxyInfos.map((proxy, idx) => (
              <div key={idx} className="rounded-xl p-5 border space-y-4" style={{ background: "rgba(255,0,0,0.02)", borderColor: "rgba(255,0,0,0.2)" }}>
                <h3 className="font-black font-orbitron text-xs tracking-widest text-red-600">{proxy.title}</h3>
                <div className="space-y-2">
                  {proxy.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] font-bold uppercase opacity-50">{item.label}</span>
                      <span className="text-xs font-mono font-bold text-white/90">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
