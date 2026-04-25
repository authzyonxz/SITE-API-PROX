import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Search, Loader2, CheckCircle, XCircle, Clock, Globe, Key } from "lucide-react";

export default function ChecarKey() {
  const [keyInput, setKeyInput] = useState("");
  const [result, setResult] = useState<{ ok: boolean; data: any; raw: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkQuery = trpc.keys.check.useQuery(
    { generatedKey: keyInput },
    { enabled: false }
  );

  const handleCheck = async () => {
    if (!keyInput.trim()) {
      toast.error("Digite uma key para verificar");
      return;
    }
    setLoading(true);
    try {
      const res = await checkQuery.refetch();
      if (res.data) {
        setResult(res.data);
        if (res.data.ok) {
          toast.success("Key verificada com sucesso");
        } else {
          toast.error("Key inválida ou expirada");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao verificar key");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    const data = result.data;
    const raw = result.raw;

    return (
      <div className="cyber-card overflow-hidden mt-4"
        style={{ border: `1px solid ${result.ok ? "rgba(0,255,136,0.2)" : "rgba(255,0,110,0.2)"}`, boxShadow: `0 0 20px ${result.ok ? "rgba(0,255,136,0.05)" : "rgba(255,0,110,0.05)"}` }}>
        <div className="px-5 py-4 border-b flex items-center gap-2"
          style={{ borderColor: result.ok ? "rgba(0,255,136,0.1)" : "rgba(255,0,110,0.1)" }}>
          {result.ok
            ? <CheckCircle className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
            : <XCircle className="w-4 h-4" style={{ color: "#ff006e" }} />}
          <span className="text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif", color: result.ok ? "var(--neon-green)" : "#ff006e", fontSize: "0.7rem" }}>
            {result.ok ? "Key Válida" : "Key Inválida"}
          </span>
        </div>
        <div className="p-5 space-y-3">
          {data && typeof data === "object" ? (
            Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3 py-2 px-3 rounded"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-xs tracking-wider uppercase flex-shrink-0 mt-0.5 w-28"
                  style={{ color: "rgba(0,212,255,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>
                  {key}
                </span>
                <span className="text-sm font-mono break-all" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {String(value)}
                </span>
              </div>
            ))
          ) : (
            <div className="py-2 px-3 rounded" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Share Tech Mono', monospace" }}>
                {raw}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 15px rgba(0,212,255,0.5)" }}>
          Checar Key
        </h2>
        <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
          Verifique o status e informações de uma key
        </p>
      </div>

      <div className="cyber-card p-5" style={{ border: "1px solid rgba(0,212,255,0.15)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
          Key para Verificar
        </p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(0,212,255,0.4)" }} />
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
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
          <button
            onClick={handleCheck}
            disabled={loading}
            className="px-5 py-3 rounded font-bold tracking-widest uppercase flex items-center gap-2 transition-all flex-shrink-0"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.75rem",
              background: "rgba(0,212,255,0.1)",
              border: "1px solid var(--neon-blue)",
              color: "var(--neon-blue)",
              boxShadow: "0 0 15px rgba(0,212,255,0.2)",
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Verificar
          </button>
        </div>
      </div>

      {renderResult()}
    </div>
  );
}
