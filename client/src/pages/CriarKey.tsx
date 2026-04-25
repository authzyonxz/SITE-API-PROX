import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { toast } from "sonner";
import { KeyRound, Copy, CheckCheck, Loader2, Zap, Plus, Minus } from "lucide-react";

const DURATION_OPTIONS = [
  { days: 1, label: "1 Dia", credits: 1, color: "#00d4ff" },
  { days: 3, label: "3 Dias", credits: 3, color: "#9d4edd" },
  { days: 7, label: "7 Dias", credits: 7, color: "#00ff88" },
  { days: 30, label: "30 Dias", credits: 30, color: "#ff9500" },
];

export default function CriarKey() {
  const { user, isAdmin } = useLocalAuth();
  const utils = trpc.useUtils();
  const [selectedDays, setSelectedDays] = useState<1 | 3 | 7 | 30>(1);
  const [quantity, setQuantity] = useState(1);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

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

  const selectedOption = DURATION_OPTIONS.find(o => o.days === selectedDays)!;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 15px rgba(0,212,255,0.5)" }}>
          Criar Key
        </h2>
        <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
          Gere novas keys de acesso ao proxy
        </p>
      </div>

      {/* Credits info (resellers) */}
      {!isAdmin && (
        <div className="flex items-center gap-3 px-4 py-3 rounded"
          style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}>
          <Zap className="w-4 h-4 flex-shrink-0" style={{ color: "var(--neon-green)" }} />
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Rajdhani', sans-serif" }}>
            Créditos disponíveis:
          </span>
          <span className="font-bold ml-auto" style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-green)" }}>
            {user?.credits ?? 0}
          </span>
        </div>
      )}

      {/* Duration selector */}
      <div className="cyber-card p-5" style={{ border: "1px solid rgba(0,212,255,0.15)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
          Duração da Key
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DURATION_OPTIONS.map((option) => {
            const isSelected = selectedDays === option.days;
            return (
              <button
                key={option.days}
                onClick={() => setSelectedDays(option.days as 1 | 3 | 7 | 30)}
                className="p-4 rounded text-center transition-all"
                style={{
                  background: isSelected ? `${option.color}15` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isSelected ? option.color : "rgba(255,255,255,0.08)"}`,
                  boxShadow: isSelected ? `0 0 15px ${option.color}30` : "none",
                }}
              >
                <p className="font-black text-lg" style={{ fontFamily: "'Orbitron', sans-serif", color: isSelected ? option.color : "rgba(255,255,255,0.5)" }}>
                  {option.label}
                </p>
                <p className="text-xs mt-1 tracking-wider" style={{ color: isSelected ? `${option.color}80` : "rgba(255,255,255,0.25)", fontFamily: "'Share Tech Mono', monospace" }}>
                  {option.credits} crédito{option.credits > 1 ? "s" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="cyber-card p-5" style={{ border: "1px solid rgba(0,212,255,0.15)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
          Quantidade
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded flex items-center justify-center transition-all"
            style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", color: "var(--neon-blue)" }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 text-center py-2 rounded text-lg font-bold outline-none"
            style={{
              background: "rgba(0,212,255,0.05)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "var(--neon-blue)",
              fontFamily: "'Orbitron', sans-serif",
            }}
          />
          <button
            onClick={() => setQuantity(Math.min(50, quantity + 1))}
            className="w-10 h-10 rounded flex items-center justify-center transition-all"
            style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", color: "var(--neon-blue)" }}
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="ml-4 text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
            máx. 50 por vez
          </div>
        </div>
      </div>

      {/* Cost summary */}
      <div className="flex items-center justify-between px-4 py-3 rounded"
        style={{ background: canAfford ? "rgba(0,212,255,0.05)" : "rgba(255,0,110,0.05)", border: `1px solid ${canAfford ? "rgba(0,212,255,0.15)" : "rgba(255,0,110,0.2)"}` }}>
        <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Rajdhani', sans-serif" }}>
          Custo total: <span className="font-bold" style={{ color: canAfford ? "var(--neon-blue)" : "#ff006e" }}>{totalCost} crédito{totalCost > 1 ? "s" : ""}</span>
          {!isAdmin && <span className="ml-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>({quantity} × {selectedDays} dia{selectedDays > 1 ? "s" : ""})</span>}
        </div>
        {!isAdmin && !canAfford && (
          <span className="text-xs" style={{ color: "#ff006e", fontFamily: "'Share Tech Mono', monospace" }}>
            CRÉDITOS INSUFICIENTES
          </span>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={generateMutation.isPending || (!isAdmin && !canAfford)}
        className="w-full py-4 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.85rem",
          background: (!isAdmin && !canAfford) ? "rgba(255,255,255,0.03)" : "rgba(0,212,255,0.1)",
          border: `1px solid ${(!isAdmin && !canAfford) ? "rgba(255,255,255,0.1)" : "var(--neon-blue)"}`,
          color: (!isAdmin && !canAfford) ? "rgba(255,255,255,0.2)" : "var(--neon-blue)",
          boxShadow: (!isAdmin && !canAfford) ? "none" : "0 0 20px rgba(0,212,255,0.2)",
          cursor: (!isAdmin && !canAfford) ? "not-allowed" : "pointer",
        }}
      >
        {generateMutation.isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>
        ) : (
          <><KeyRound className="w-4 h-4" /> Gerar {quantity} Key{quantity > 1 ? "s" : ""}</>
        )}
      </button>

      {/* Generated keys result */}
      {generatedKeys.length > 0 && (
        <div className="cyber-card overflow-hidden" style={{ border: "1px solid rgba(0,255,136,0.2)", boxShadow: "0 0 20px rgba(0,255,136,0.05)" }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,255,136,0.1)" }}>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
              <span className="text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-green)", fontSize: "0.7rem" }}>
                {generatedKeys.length} Key{generatedKeys.length > 1 ? "s" : ""} Gerada{generatedKeys.length > 1 ? "s" : ""}
              </span>
              <span className="text-xs px-2 py-0.5 rounded tracking-wider"
                style={{ background: "rgba(0,255,136,0.1)", color: "var(--neon-green)", border: "1px solid rgba(0,255,136,0.2)", fontFamily: "'Share Tech Mono', monospace" }}>
                {selectedOption.label}
              </span>
            </div>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium tracking-wider transition-all"
              style={{
                background: copied ? "rgba(0,255,136,0.15)" : "rgba(0,255,136,0.05)",
                border: "1px solid rgba(0,255,136,0.3)",
                color: "var(--neon-green)",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copiado!" : "Copiar Todas"}
            </button>
          </div>
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {generatedKeys.map((key, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded group"
                style={{ background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.08)" }}>
                <span className="text-xs w-5 text-right flex-shrink-0" style={{ color: "rgba(0,255,136,0.3)", fontFamily: "'Share Tech Mono', monospace" }}>
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-mono break-all" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Share Tech Mono', monospace" }}>
                  {key}
                </span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(key);
                    toast.success("Key copiada!");
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  style={{ color: "var(--neon-green)" }}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
