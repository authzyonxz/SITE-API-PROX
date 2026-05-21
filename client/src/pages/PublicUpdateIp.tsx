import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, Shield, MessageCircle, Search, Bell, Sparkles, Smartphone, Zap, Download, ExternalLink } from "lucide-react";

export default function PublicUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isFetchingIp, setIsFetchingIp] = useState(false);
  const [showChannelWarning, setShowChannelWarning] = useState(false);

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
    if (!showChannelWarning) {
      setShowChannelWarning(true);
      return;
    }
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() });
  };

  const confirmAndStore = () => {
    setShowChannelWarning(false);
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() });
  };

  const handleFetchIp = async () => {
    setIsFetchingIp(true);
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setNewIp(data.ip);
      toast.success("IP detectado e preenchido!");
    } catch {
      toast.error("Não foi possível detectar seu IP.");
    } finally {
      setIsFetchingIp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />

      {/* Modal de Aviso */}
      {showChannelWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md glass-card p-8 rounded-3xl border-purple-500/20 shadow-2xl shadow-purple-500/10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Bell className="w-10 h-10 text-purple-400 animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-white tracking-tight mb-4">Aviso Importante!</h2>
            <p className="text-slate-400 text-center text-lg leading-relaxed mb-8">
              Para atualizar o IP da sua key, você precisa estar no nosso <span className="text-purple-400 font-bold">Canal de Atualizações</span>. 
              Fique por dentro de todas as novidades!
            </p>
            <div className="space-y-4">
              <a 
                href="https://whatsapp.com/channel/0029VbCu4r23WHTYia22EO3N" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-widest uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" /> Entrar no Canal
              </a>
              <button 
                onClick={confirmAndStore} 
                className="w-full py-3 text-slate-500 hover:text-purple-300 font-bold tracking-widest uppercase transition-colors text-xs"
              >
                Já estou no canal, atualizar agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">AUTH <span className="text-purple-400">PROXY</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="https://whatsapp.com/channel/0029VbCu4r23WHTYia22EO3N" target="_blank" className="text-sm font-bold text-slate-400 hover:text-purple-400 transition-colors uppercase tracking-widest">Suporte</a>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">Status: Online</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Coluna Esquerda: Form de Update */}
          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-300 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" /> sistema de auto-atendimento
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                Atualizar <span className="text-purple-400">IP</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Vincule seu IP atual à sua licença em segundos. O sistema detecta e configura tudo automaticamente para você.
              </p>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-slate-500 ml-1">Sua Licença (Key)</label>
                  <div className="relative group">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="AUTH-XXXX-XXXX-XXXX"
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/10 outline-none transition-all font-mono text-white placeholder-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 ml-1">
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">Endereço de IP</label>
                    <button 
                      onClick={handleFetchIp} 
                      disabled={isFetchingIp} 
                      className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
                    >
                      {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />} Detectar meu IP
                    </button>
                  </div>
                  <div className="relative group">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      placeholder="Ex: 177.123.45.67"
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all font-mono text-white placeholder-slate-700"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="w-full py-5 rounded-2xl font-bold tracking-[0.2em] uppercase transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 group relative overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white hover:-translate-y-1 active:scale-95"
              >
                {updateMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-5 h-5" /> Atualizar Conexão</>}
              </button>

              {result && (
                <div className={`p-6 rounded-3xl border animate-in fade-in slide-in-from-bottom-2 duration-300 ${result.ok ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300" : "bg-rose-500/5 border-rose-500/10 text-rose-300"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {result.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span className="font-bold uppercase tracking-widest text-xs">{result.ok ? "Sucesso" : "Erro"}</span>
                  </div>
                  <p className="text-xs font-mono opacity-60 break-all">{result.raw}</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita: Downloads e Info */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Downloads</h3>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Certificado SSL</span>
                    <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">HS + ANTENA</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-purple-400" />
                </a>

                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Certificado SSL</span>
                    <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">HS PESCOÇO</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                </a>

                <a 
                  href="https://whatsapp.com/channel/0029VbCu4r23WHTYia22EO3N"
                  target="_blank"
                  className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-widest hover:bg-emerald-500/10 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Canal de Atualizações
                </a>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full transition-all group-hover:scale-150" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Como usar?</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  1. Cole sua key no campo indicado.<br/>
                  2. Clique em "Detectar meu IP" para preencher automaticamente.<br/>
                  3. Clique no botão de atualizar.<br/>
                  4. Reinicie seu proxy no dispositivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Simples */}
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        <p>© 2026 AUTH PROXY. TODOS OS DIREITOS RESERVADOS.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Termos</span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacidade</span>
        </div>
      </footer>
    </div>
  );
}
