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
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border rounded-xl overflow-hidden mt-6"
        style={{ borderColor: result.ok ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)" }}>
        <div className="px-6 py-4 border-b flex items-center gap-3"
          style={{ borderColor: result.ok ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)" }}>
          {result.ok
            ? <CheckCircle className="w-5 h-5 text-green-400" />
            : <XCircle className="w-5 h-5 text-red-400" />}
          <span className="text-sm font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif", color: result.ok ? "#10b981" : "#ef4444" }}>
            {result.ok ? "Key Válida" : "Key Inválida"}
          </span>
        </div>
        <div className="p-6 space-y-3">
          {data && typeof data === "object" ? (
            Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex items-start gap-4 py-3 px-4 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-xs tracking-widest uppercase flex-shrink-0 mt-0.5 w-32 text-slate-400"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  {key}
                </span>
                <span className="text-sm font-mono break-all text-slate-200" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  {String(value)}
                </span>
              </div>
            ))
          ) : (
            <div className="py-3 px-4 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm font-mono text-slate-200" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {raw}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-black tracking-wider text-white"
          style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Checar Key
        </h2>
        <p className="text-sm mt-2 tracking-wide text-slate-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Verifique o status, validade e informações de uma key
        </p>
      </div>

      <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
        <p className="text-xs tracking-widest uppercase mb-6 text-slate-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          Informe a Key
        </p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="Cole a key aqui..."
              className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500"
              style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.9rem" }}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading}
            className="px-6 py-3 rounded-lg font-bold tracking-widest uppercase flex items-center gap-2 transition-all flex-shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
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
