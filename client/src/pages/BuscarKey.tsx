import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Search, User, Calendar, ShieldCheck, AlertCircle, Key, Sparkles, Fingerprint, Clock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function BuscarKey() {
  const [keyValue, setKeyValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: result, isLoading, isError } = trpc.keys.findCreator.useQuery(
    { keyValue: searchQuery },
    { enabled: searchQuery.length > 0, retry: false }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue.trim()) {
      toast.error("Insira uma chave para buscar");
      return;
    }
    setSearchQuery(keyValue.trim());
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-300 text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" /> rastreamento de licenças
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Buscar <span className="text-cyan-400">Criador</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mt-2">
            Identifique instantaneamente a origem de qualquer chave e visualize detalhes de expiração e autoria.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="relative flex-1 group">
            <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder="Cole a chave (key) para identificar o criador..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all font-mono text-white placeholder-slate-700"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-10 py-5 rounded-2xl font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Buscar
          </button>
        </form>
      </div>

      {searchQuery && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {isError ? (
            <div className="glass-card p-12 text-center rounded-3xl border-rose-500/20 bg-rose-500/5">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-10 h-10 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Chave não encontrada</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Não localizamos nenhum registro para esta licença em nosso banco de dados. Verifique se a chave está correta.
              </p>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações do Criador */}
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full transition-all group-hover:scale-150" />
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Autor da Licença</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{result.creator.username}</h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nível de Acesso</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.creator.role === 'admin' ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300' : 'bg-blue-500/10 border border-blue-500/20 text-blue-300'}`}>
                      {result.creator.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">ID do Criador</span>
                    <span className="text-xs font-mono text-slate-300">#{result.creator.id}</span>
                  </div>
                </div>
              </div>

              {/* Detalhes da Chave */}
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full transition-all group-hover:scale-150" />
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Dados da Licença</p>
                    <h3 className="text-sm font-mono font-bold text-white break-all">{result.key.keyValue}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Criação</span>
                    </div>
                    <span className="text-xs font-bold text-white">{new Date(result.key.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Expiração</span>
                    </div>
                    <span className="text-xs font-bold text-white">{new Date(result.key.expiresAt).toLocaleString()}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 sm:col-span-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duração Contratada</span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold text-xs">{result.key.days} Dias</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${props.className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
