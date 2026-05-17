import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Radio, Wifi, WifiOff } from "lucide-react";

export default function AtualizarIP() {
  const [keyInput, setKeyInput] = useState(""
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
  const [newIp, setNewIp] = useState(""
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
  const { data: proxies, isLoading: loadingProxies } = trpc.proxy.list.useQuery(
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);

  const updateMutation = trpc.keys.updateIp.useMutation({
    onSuccess: (data) => {
      setResult(data
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
      if (data.ok) {
        toast.success("IP atualizado com sucesso!"
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
      } else {
        toast.error("Falha ao atualizar IP"
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao atualizar IP"
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
    },
  }
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);

  const handleUpdate = () => {
    if (!keyInput.trim()) { toast.error("Digite a key"
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
); return; }
    if (!newIp.trim()) { toast.error("Digite o novo IP"
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
); return; }
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() }
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 15px rgba(0,212,255,0.5)" }}>
          Atualizar IP
        </h2>
        <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
          Vincule um novo IP a uma key existente
        </p>
      </div>

      {/* Proxy Status Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {loadingProxies ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="h-20 rounded animate-pulse bg-white/5" />
          ))
        ) : (
          proxies?.map((proxy) => (
            <div key={proxy.id} className="cyber-card p-4 relative overflow-hidden" 
              style={{ border: `1px solid ${proxy.status === "online" ? "rgba(0,255,136,0.15)" : "rgba(255,0,110,0.15)"}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded flex items-center justify-center" 
                    style={{ background: proxy.status === "online" ? "rgba(0,255,136,0.1)" : "rgba(255,0,110,0.1)" }}>
                    {proxy.status === "online" ? (
                      <Wifi className="w-5 h-5" style={{ color: "var(--neon-green)" }} />
                    ) : (
                      <WifiOff className="w-5 h-5" style={{ color: "#ff006e" }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{proxy.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${proxy.status === "online" ? "neon-pulse" : ""}`} 
                        style={{ background: proxy.status === "online" ? "var(--neon-green)" : "#ff006e" }} />
                      <p className="text-[10px] uppercase tracking-widest font-bold" 
                        style={{ color: proxy.status === "online" ? "var(--neon-green)" : "#ff006e", fontFamily: "'Share Tech Mono', monospace" }}>
                        Status: {proxy.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cyber-card p-5 space-y-4" style={{ border: "1px solid rgba(0,212,255,0.15)" }}>
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
            Key
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(0,212,255,0.4)" }} />
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Cole a key aqui..."
              className="w-full pl-10 pr-4 py-3 rounded outline-none transition-all"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "var(--foreground)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.85rem",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--neon-blue)"; e.target.style.boxShadow = "0 0 10px rgba(0,212,255,0.2)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.2)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-30">
          <div className="flex-1 h-px" style={{ background: "var(--neon-blue)" }} />
          <ArrowRight className="w-4 h-4" style={{ color: "var(--neon-blue)" }} />
          <div className="flex-1 h-px" style={{ background: "var(--neon-blue)" }} />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
            Novo IP
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(0,212,255,0.4)" }} />
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              placeholder="Ex: 192.168.1.1"
              className="w-full pl-10 pr-4 py-3 rounded outline-none transition-all"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "var(--foreground)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.85rem",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--neon-blue)"; e.target.style.boxShadow = "0 0 10px rgba(0,212,255,0.2)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.2)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updateMutation.isPending}
          className="w-full py-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all mt-2"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.8rem",
            background: "rgba(0,212,255,0.1)",
            border: "1px solid var(--neon-blue)",
            color: "var(--neon-blue)",
            boxShadow: "0 0 15px rgba(0,212,255,0.2)",
          }}
        >
          {updateMutation.isPending
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Atualizando...</>
            : <><Globe className="w-4 h-4" /> Atualizar IP</>}
        </button>
      </div>

      {result && (
        <div className="cyber-card p-5"
          style={{ border: `1px solid ${result.ok ? "rgba(0,255,136,0.2)" : "rgba(255,0,110,0.2)"}` }}>
          <div className="flex items-center gap-2 mb-3">
            {result.ok
              ? <CheckCircle className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
              : <XCircle className="w-4 h-4" style={{ color: "#ff006e" }} />}
            <span className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif", color: result.ok ? "var(--neon-green)" : "#ff006e", fontSize: "0.7rem" }}>
              {result.ok ? "IP Atualizado com Sucesso" : "Falha na Atualização"}
            </span>
          </div>
          <div className="px-3 py-2 rounded" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Share Tech Mono', monospace" }}>
              {result.raw}
            </span>
          </div>
        </div>
      )}
    </div>
  
              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>
);
}
