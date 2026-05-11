import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Search, MoreVertical, Bell, MessageCircle } from "lucide-react";

export default function SensiMenstruadaUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
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
      title: "🎯 SENSI PROXY HS PESCOÇO",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1110" }
      ]
    },
    {
      title: "🔥 SENSI PROXY HS PESCOÇO + ANTENA",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1119" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-foreground font-sans selection:bg-purple-500/30">
      <nav className="sticky top-0 z-50 border-b border-purple-500/20 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-500/50">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-purple-400 font-orbitron uppercase">
                SENSI MENSTRUADA
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-purple-400 hover:border-purple-400/50 transition-all"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-slate-900/90 border border-white/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <a 
                      href="https://www.mediafire.com/file/xrsfks48pzfe8ik/SensiMenstruada.cer/file"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-purple-500/20 hover:text-purple-400 transition-all border-b border-white/10"
                    >
                      <Download className="w-4 h-4" />
                      Download Certificado
                    </a>
                    <a 
                      href="https://whatsapp.com/channel/0029VbC4GJfC6Zvfov89zy0f"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-purple-500/20 hover:text-purple-400 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Canal de Atualizações
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-purple-400">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 p-4 space-y-3">
            <a 
              href="https://www.mediafire.com/file/xrsfks48pzfe8ik/SensiMenstruada.cer/file"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 font-orbitron text-xs tracking-widest uppercase"
            >
              <Download className="w-4 h-4" />
              Download Certificado
            </a>
            <a 
              href="https://whatsapp.com/channel/0029VbC4GJfC6Zvfov89zy0f"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 font-orbitron text-xs tracking-widest uppercase"
            >
              <MessageCircle className="w-4 h-4" />
              Canal de Atualizações
            </a>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <section>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-orbitron mb-2">
                  ATUALIZAR IP
                </h1>
                <p className="text-slate-400 font-rajdhani text-lg">
                  Vincule seu endereço de IP atual à sua licença para liberar o acesso ao proxy.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-slate-400 font-mono">
                      Sua Key de Acesso
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Cole sua key aqui..."
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/5 border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all font-mono text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 font-mono">
                        Novo Endereço de IP
                      </label>
                      <button 
                        onClick={handleFetchIp}
                        disabled={isFetchingIp}
                        className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
                      >
                        {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        Detectar meu IP
                      </button>
                    </div>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Ex: 177.123.45.67"
                        className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/5 border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all font-mono text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-black font-orbitron tracking-widest uppercase transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
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

              {/* Bottom Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <a 
                  href="https://www.mediafire.com/file/xrsfks48pzfe8ik/SensiMenstruada.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-purple-400 font-bold font-orbitron tracking-widest uppercase hover:bg-purple-500/10 hover:border-purple-500/30 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Certificado
                </a>
                <a 
                  href="https://whatsapp.com/channel/0029VbC4GJfC6Zvfov89zy0f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-green-400 font-bold font-orbitron tracking-widest uppercase hover:bg-green-500/10 hover:border-green-500/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Canal de Atualizações
                </a>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              {proxyInfos.map((proxy, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/20">
                  <div className="px-5 py-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-sm font-black tracking-widest font-orbitron text-purple-400">{proxy.title}</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {proxy.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-slate-500 font-mono">{item.label}</span>
                        <span className="text-sm font-bold text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t border-white/5 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-slate-600 font-mono">
          Sensi Menstruada Proxy &copy; 2026 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}
