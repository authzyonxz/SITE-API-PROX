import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Search, User, Calendar, ShieldCheck, AlertCircle, Key } from "lucide-react";
import { toast } from "sonner";

export default function BuscarKey() {
  const [keyValue, setKeyValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: result, isLoading, error, isError } = trpc.keys.findCreator.useQuery(
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 15px rgba(0,212,255,0.5)" }}>
            Buscar Criador
          </h2>
          <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
            Identifique quem gerou uma chave específica
          </p>
        </div>
      </div>

      <div className="cyber-card p-6" style={{ border: "1px solid rgba(0,212,255,0.2)" }}>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Key className="h-4 w-4 text-white/40" />
            </div>
            <input
              type="text"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder="Cole a chave aqui..."
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem" }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            BUSCAR
          </button>
        </form>
      </div>

      {searchQuery && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isError ? (
            <div className="cyber-card p-8 text-center" style={{ border: "1px solid rgba(255,0,110,0.2)" }}>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#ff006e]" />
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Chave não encontrada</h3>
              <p className="text-sm text-white/40">Não encontramos nenhum registro desta chave no banco de dados local.</p>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações do Criador */}
              <div className="cyber-card p-6" style={{ border: "1px solid rgba(0,255,136,0.2)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-white/40" style={{ fontFamily: "'Orbitron', sans-serif" }}>Criador da Chave</h3>
                    <p className="text-xl font-black text-[#00ff88]" style={{ fontFamily: "'Orbitron', sans-serif" }}>{result.creator.username}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-xs text-white/40 uppercase tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Cargo</span>
                    <span className="text-sm font-bold uppercase" style={{ color: result.creator.role === 'admin' ? 'var(--neon-purple)' : 'var(--neon-blue)' }}>
                      {result.creator.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalhes da Chave */}
              <div className="cyber-card p-6" style={{ border: "1px solid rgba(0,212,255,0.2)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-white/40" style={{ fontFamily: "'Orbitron', sans-serif" }}>Detalhes da Chave</h3>
                    <p className="text-sm font-bold text-[#00d4ff]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{result.key.keyValue.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/40 uppercase tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Gerada em</span>
                    </div>
                    <span className="text-xs font-bold">{new Date(result.key.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/40 uppercase tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Expira em</span>
                    </div>
                    <span className="text-xs font-bold">{new Date(result.key.expiresAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-xs text-white/40 uppercase tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Duração</span>
                    <span className="text-xs font-bold">{result.key.days} Dias</span>
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
