import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { toast } from "sonner";
import { KeyRound, Copy, CheckCheck, Loader2, Zap, Plus, Minus, Download } from "lucide-react";

const DURATION_OPTIONS = [
  { days: 1, label: "1 Dia", credits: 1, color: "#00d4ff" },
  { days: 3, label: "3 Dias", credits: 3, color: "#9d4edd" },
  { days: 7, label: "7 Dias", credits: 7, color: "#10b981" },
  { days: 30, label: "30 Dias", credits: 30, color: "#f59e0b" },
];

export default function CriarKey() {
  const { user, isAdmin } = useLocalAuth();
  const utils = trpc.useUtils();
  const [selectedDays, setSelectedDays] = useState<1 | 3 | 7 | 30>(1);
  const [quantity, setQuantity] = useState(1);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateMutation = trpc.keys.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedKeys(data.keys);
      if (data.keys.length > 0) {
        toast.success(`${data.keys.length} key(s) gerada(s) com sucesso!`);
      }
      if (data.errors.length > 0) {
        toast.error(`${data.errors.length} erro(s) ao gerar keys`);
      }
      utils.localAuth.me.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao gerar keys");
    },
  });

  const totalCost = selectedDays * quantity;
  const canAfford = isAdmin || (user?.credits ?? 0) >= totalCost;

  const handleGenerate = () => {
    generateMutation.mutate({ days: selectedDays, quantity });
  };

  const handleCopyAll = async () => {
    const text = generatedKeys.join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Keys copiadas para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySingle = async (key: string, index: number) => {
    await navigator.clipboard.writeText(key);
    setCopiedIndex(index);
    toast.success("Key copiada!");
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const selectedOption = DURATION_OPTIONS.find(o => o.days === selectedDays)!;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-wider text-white"
          style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Criar Key
        </h2>
        <p className="text-sm mt-2 tracking-wide text-slate-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Gere novas keys de acesso ao proxy com duração e quantidade personalizadas
        </p>
      </div>

      {/* Credits info (resellers) */}
      {!isAdmin && (
        <div className="flex items-center gap-4 px-6 py-4 rounded-xl backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/30">
          <Zap className="w-5 h-5 flex-shrink-0 text-green-400" />
          <div className="flex-1">
            <span className="text-sm text-slate-300" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Créditos disponíveis
            </span>
          </div>
          <span className="font-bold text-lg text-green-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {user?.credits ?? 0}
          </span>
        </div>
      )}

      {/* Duration selector */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
        <p className="text-xs tracking-widest uppercase mb-6 text-slate-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          Selecione a Duração
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DURATION_OPTIONS.map((option) => {
            const isSelected = selectedDays === option.days;
            return (
              <button
                key={option.days}
                onClick={() => setSelectedDays(option.days as 1 | 3 | 7 | 30)}
                className="p-4 rounded-lg text-center transition-all group"
                style={{
                  background: isSelected ? `${option.color}20` : "rgba(255,255,255,0.05)",
                  border: `2px solid ${isSelected ? option.color : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isSelected ? `0 0 20px ${option.color}40` : "none",
                }}
              >
                <p className="font-black text-lg text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {option.label}
                </p>
                <p className="text-xs mt-2 tracking-wider text-slate-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  {option.credits} crédito{option.credits > 1 ? "s" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
        <p className="text-xs tracking-widest uppercase mb-6 text-slate-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          Quantidade de Keys
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-cyan-400"
          >
            <Minus className="w-5 h-5" />
          </button>
          <input
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-24 text-center py-3 rounded-lg text-lg font-bold outline-none bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 text-white"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          />
          <button
            onClick={() => setQuantity(Math.min(50, quantity + 1))}
            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-cyan-400"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="ml-auto text-sm text-slate-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            máx. 50 por vez
          </div>
        </div>
      </div>

      {/* Cost summary */}
      <div className="flex items-center justify-between px-6 py-4 rounded-xl backdrop-blur-xl"
        style={{ background: canAfford ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", border: `2px solid ${canAfford ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}` }}>
        <div className="text-sm text-slate-300" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Custo total: <span className="font-bold" style={{ color: canAfford ? "#10b981" : "#ef4444" }}>{totalCost} crédito{totalCost > 1 ? "s" : ""}</span>
          {!isAdmin && <span className="ml-2 text-xs text-slate-500">({quantity} × {selectedDays} dia{selectedDays > 1 ? "s" : ""})</span>}
        </div>
        {!isAdmin && !canAfford && (
          <span className="text-xs text-red-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            CRÉDITOS INSUFICIENTES
          </span>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={generateMutation.isPending || (!isAdmin && !canAfford)}
        className="w-full py-4 rounded-lg font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.9rem",
          background: (!isAdmin && !canAfford) ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #00d4ff, #0099ff)",
          border: `2px solid ${(!isAdmin && !canAfford) ? "rgba(255,255,255,0.1)" : "#00d4ff"}`,
          color: (!isAdmin && !canAfford) ? "rgba(255,255,255,0.3)" : "white",
          boxShadow: (!isAdmin && !canAfford) ? "none" : "0 0 30px rgba(0, 212, 255, 0.4)",
          cursor: (!isAdmin && !canAfford) ? "not-allowed" : "pointer",
        }}
      >
        {generateMutation.isPending ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Gerando...</>
        ) : (
          <><KeyRound className="w-5 h-5" /> Gerar {quantity} Key{quantity > 1 ? "s" : ""}</>
        )}
      </button>

      {/* Generated keys result */}
      {generatedKeys.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header com info das keys */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/40 rounded-xl p-6 shadow-lg shadow-green-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-widest uppercase text-green-400"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {generatedKeys.length} Key{generatedKeys.length > 1 ? "s" : ""} Gerada{generatedKeys.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-green-300/70 mt-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    Duração: {selectedOption.label}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {copied ? (
                  <><CheckCheck className="w-5 h-5" /> Copiado!</>
                ) : (
                  <><Download className="w-5 h-5" /> Copiar Todas</>
                )}
              </button>
            </div>
          </div>

          {/* Keys list */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 space-y-3">
                {generatedKeys.map((key, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 px-5 py-4 rounded-lg group bg-gradient-to-r from-white/8 to-white/3 border border-white/15 hover:border-green-500/50 hover:from-green-500/10 hover:to-green-500/5 transition-all duration-300 animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="text-xs w-8 text-right flex-shrink-0 text-slate-500 font-bold" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-mono break-all text-slate-200 group-hover:text-slate-100 transition-colors" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                        {key}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopySingle(key, i)}
                      className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 hover:bg-green-500/30"
                    >
                      {copiedIndex === i ? (
                        <CheckCheck className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between px-6 py-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
            <p className="text-xs text-slate-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Clique em uma key para copiar individualmente ou use o botão acima para copiar todas
            </p>
            <span className="text-xs px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 font-semibold" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {generatedKeys.length} total
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
