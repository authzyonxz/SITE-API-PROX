import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, Download, Shield, MessageCircle, Search, Zap, Sparkles, ArrowRight } from "lucide-react";

export default function JzXiterUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
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
    if (!keyInput.trim()) { toast.error("Digite a chave"); return; }
    if (!newIp.trim()) { toast.error("Digite o novo IP"); return; }
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() });
  };

  const handleFetchIp = async () => {
    setIsFetchingIp(true);
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setNewIp(data.ip);
      toast.success("IP detectado com sucesso!");
    } catch {
      toast.error("Erro ao detectar IP.");
    } finally {
      setIsFetchingIp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 text-white font-sans selection:bg-red-600/40 relative overflow-hidden">
      {/* Efeito de fundo premium */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-500/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-red-900/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-2xl shadow-red-600/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-red-400 uppercase tracking-[0.3em]">Proxy Premium</p>
              <h1 className="text-2xl font-black tracking-tighter text-white">JZ XITER</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/5 border border-red-600/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Sistema Online</span>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Seção Principal - Atualizar IP */}
          <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span className="text-xs font-black text-red-400 uppercase tracking-[0.2em]">Sincronização de Rede</span>
              </div>
              
              <div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                  Atualizar <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">IP</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                  Vincule seu endereço de IP atual à sua licença para liberar o acesso completo ao proxy JZ Xiter com segurança máxima.
                </p>
              </div>
            </div>

            {/* Formulário */}
            <div className="bg-gradient-to-br from-slate-900/50 to-red-950/20 border border-red-900/20 p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 blur-3xl rounded-full transition-all group-hover:scale-150" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-600/5 blur-3xl rounded-full" />
              
              <div className="space-y-8 relative z-10">
                {/* Campo de Chave */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-red-400 uppercase tracking-[0.3em]">Sua Chave de Acesso</label>
                  <div className="relative group/input">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600/50 group-focus-within/input:text-red-500 transition-colors" />
                    <input
                      type="text"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="Cole sua chave aqui..."
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.02] border border-red-900/20 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-mono text-white placeholder-slate-600"
                    />
                  </div>
                </div>

                {/* Campo de IP */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-red-400 uppercase tracking-[0.3em]">Novo Endereço de IP</label>
                    <button 
                      onClick={handleFetchIp} 
                      disabled={isFetchingIp}
                      className="text-xs font-black text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isFetchingIp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                      Detectar Automaticamente
                    </button>
                  </div>
                  <div className="relative group/input">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600/50 group-focus-within/input:text-red-500 transition-colors" />
                    <input
                      type="text"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      placeholder="0.0.0.0"
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.02] border border-red-900/20 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-mono text-white placeholder-slate-600"
                    />
                  </div>
                </div>

                {/* Botão de Ação */}
                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="w-full py-5 rounded-2xl font-black tracking-[0.2em] uppercase transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-red-600/40 hover:-translate-y-1 active:scale-95"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Processando...</>
                  ) : (
                    <><Zap className="w-5 h-5 fill-white" /> Sincronizar IP Agora</>
                  )}
                </button>

                {/* Resultado */}
                {result && (
                  <div className={`p-6 rounded-2xl border animate-in fade-in zoom-in duration-300 ${result.ok ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-red-600/5 border-red-600/20 text-red-300"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {result.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="font-black uppercase tracking-widest text-sm">{result.ok ? "Sucesso na Sincronização" : "Falha na Sincronização"}</span>
                    </div>
                    <p className="text-xs font-mono opacity-60 break-all">{result.raw}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Recursos e Informações */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            {/* Card de Certificados */}
            <div className="bg-gradient-to-br from-slate-900/50 to-red-950/20 border border-red-900/20 p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-black text-white tracking-tight">Certificados de Segurança</h3>
              
              <div className="space-y-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-red-900/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-red-500/60 uppercase tracking-widest">Certificado</span>
                    <span className="text-sm font-black text-white group-hover:text-red-400 transition-colors">HS + ANTENA</span>
                  </div>
                  <Download className="w-4 h-4 text-red-600/50 group-hover:text-red-500 transition-colors" />
                </a>

                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-red-900/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-red-500/60 uppercase tracking-widest">Certificado</span>
                    <span className="text-sm font-black text-white group-hover:text-red-400 transition-colors">HS PESCOÇO</span>
                  </div>
                  <Download className="w-4 h-4 text-red-600/50 group-hover:text-red-500 transition-colors" />
                </a>
              </div>
            </div>

            {/* Card de Comunidade */}
            <a 
              href="https://discord.gg/jzxiter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-8 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 border border-red-500/30 hover:border-red-400/60 transition-all group shadow-2xl shadow-red-600/20"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-red-100 uppercase tracking-[0.2em]">Comunidade</span>
                <span className="text-lg font-black text-white">Entrar no Discord</span>
              </div>
              <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </a>

            {/* Card de Informações */}
            <div className="bg-gradient-to-br from-slate-900/50 to-red-950/20 border border-red-900/20 p-8 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white tracking-tight">Sobre a Sincronização</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O sistema JZ Xiter garante que sua licença esteja sempre vinculada ao seu ponto de acesso mais recente. Use a detecção automática para precisão absoluta.
              </p>
              <div className="flex items-center gap-2 pt-4 border-t border-red-900/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400">Serviço Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-red-900/10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600 text-xs font-black uppercase tracking-[0.2em]">
        <p>© 2026 JZ XITER. TODOS OS DIREITOS RESERVADOS.</p>
        <div className="flex items-center gap-8">
          <span className="hover:text-red-500 cursor-pointer transition-colors">Segurança</span>
          <span className="hover:text-red-500 cursor-pointer transition-colors">Proxy</span>
          <span className="hover:text-red-500 cursor-pointer transition-colors">Suporte</span>
        </div>
      </footer>
    </div>
  );
}
