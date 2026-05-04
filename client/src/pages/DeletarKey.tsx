import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle, CheckCircle, XCircle, Key, ShieldAlert, ListFilter } from "lucide-react";

export default function DeletarKey() {
  const [keyInput, setKeyInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [confirmStep, setConfirmStep] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [bulkResults, setBulkResults] = useState<{ key: string; ok: boolean }[] | null>(null);
  const utils = trpc.useUtils();

  const deleteMutation = trpc.keys.delete.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setConfirmStep(false);
      if (data.ok) {
        toast.success("Key deletada com sucesso!");
        utils.dashboard.stats.invalidate();
      } else {
        toast.error("Falha ao deletar key");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao deletar key");
      setConfirmStep(false);
    },
  });

  const deleteBulkMutation = trpc.keys.deleteBulk.useMutation({
    onSuccess: (data) => {
      setBulkResults(data.results);
      setConfirmStep(false);
      const successCount = data.results.filter(r => r.ok).length;
      toast.success(`${successCount} keys deletadas com sucesso!`);
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao deletar keys em massa");
      setConfirmStep(false);
    },
  });

  const handleRequestDelete = () => {
    if (mode === "single" && !keyInput.trim()) { toast.error("Digite a key para deletar"); return; }
    if (mode === "bulk" && !bulkInput.trim()) { toast.error("Cole as keys para deletar"); return; }
    setConfirmStep(true);
    setResult(null);
    setBulkResults(null);
  };

  const handleConfirmDelete = () => {
    if (mode === "single") {
      deleteMutation.mutate({ generatedKey: keyInput.trim() });
    } else {
      const keys = bulkInput.split(/[\n, ]+/).filter(k => k.trim().length > 0);
      deleteBulkMutation.mutate({ keys });
    }
  };

  const handleCancel = () => {
    setConfirmStep(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#ff006e", textShadow: "0 0 15px rgba(255,0,110,0.5)" }}>
          Deletar Key
        </h2>
        <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
          Remova permanentemente keys do sistema
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 p-1 rounded-lg bg-black/20 border border-white/5 w-fit">
        <button
          onClick={() => { setMode("single"); setConfirmStep(false); setResult(null); setBulkResults(null); }}
          className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${mode === "single" ? "bg-[#ff006e]/20 text-[#ff006e] border border-[#ff006e]/30" : "text-white/40 hover:text-white/60"}`}
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <Key className="w-3 h-3" />
          Única
        </button>
        <button
          onClick={() => { setMode("bulk"); setConfirmStep(false); setResult(null); setBulkResults(null); }}
          className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${mode === "bulk" ? "bg-[#ff006e]/20 text-[#ff006e] border border-[#ff006e]/30" : "text-white/40 hover:text-white/60"}`}
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <ListFilter className="w-3 h-3" />
          Em Massa
        </button>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 px-4 py-3 rounded"
        style={{ background: "rgba(255,0,110,0.05)", border: "1px solid rgba(255,0,110,0.2)" }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ff006e" }} />
        <p className="text-sm" style={{ color: "rgba(255,100,130,0.8)", fontFamily: "'Rajdhani', sans-serif" }}>
          Esta ação é <strong>irreversível</strong>. As keys serão permanentemente removidas e não poderão ser recuperadas.
        </p>
      </div>

      {/* Input */}
      <div className="cyber-card p-5" style={{ border: "1px solid rgba(255,0,110,0.15)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,0,110,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
          {mode === "single" ? "Key para Deletar" : "Lista de Keys (uma por linha ou separadas por vírgula)"}
        </p>
        
        {mode === "single" ? (
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,0,110,0.4)" }} />
            <input
              type="text"
              value={keyInput}
              onChange={(e) => { setKeyInput(e.target.value); setConfirmStep(false); setResult(null); }}
              placeholder="Cole a key aqui..."
              className="w-full pl-10 pr-4 py-3 rounded outline-none transition-all"
              style={{
                background: "rgba(255,0,110,0.03)",
                border: "1px solid rgba(255,0,110,0.2)",
                color: "var(--foreground)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.85rem",
              }}
              disabled={confirmStep}
            />
          </div>
        ) : (
          <textarea
            value={bulkInput}
            onChange={(e) => { setBulkInput(e.target.value); setConfirmStep(false); setBulkResults(null); }}
            placeholder="Cole várias keys aqui..."
            rows={6}
            className="w-full p-4 rounded outline-none transition-all resize-none"
            style={{
              background: "rgba(255,0,110,0.03)",
              border: "1px solid rgba(255,0,110,0.2)",
              color: "var(--foreground)",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.85rem",
            }}
            disabled={confirmStep}
          />
        )}

        {!confirmStep ? (
          <button
            onClick={handleRequestDelete}
            className="w-full mt-4 py-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.8rem",
              background: "rgba(255,0,110,0.08)",
              border: "1px solid rgba(255,0,110,0.4)",
              color: "#ff006e",
              boxShadow: "0 0 15px rgba(255,0,110,0.1)",
            }}
          >
            <Trash2 className="w-4 h-4" />
            {mode === "single" ? "Solicitar Exclusão" : "Solicitar Exclusão em Massa"}
          </button>
        ) : null}
      </div>

      {/* Confirmation step */}
      {confirmStep && (
        <div className="cyber-card p-5 space-y-4"
          style={{ border: "1px solid rgba(255,0,110,0.4)", boxShadow: "0 0 30px rgba(255,0,110,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,0,110,0.15)", border: "1px solid rgba(255,0,110,0.3)" }}>
              <ShieldAlert className="w-5 h-5" style={{ color: "#ff006e" }} />
            </div>
            <div>
              <p className="font-bold tracking-wider text-sm"
                style={{ fontFamily: "'Orbitron', sans-serif", color: "#ff006e", fontSize: "0.8rem" }}>
                CONFIRMAÇÃO NECESSÁRIA
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
                {mode === "single" ? "Você está prestes a deletar esta key" : `Você está prestes a deletar ${bulkInput.split(/[\n, ]+/).filter(k => k.trim().length > 0).length} keys`}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded font-bold tracking-widest uppercase transition-all"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.75rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending || deleteBulkMutation.isPending}
              className="flex-1 py-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.75rem",
                background: "rgba(255,0,110,0.15)",
                border: "1px solid #ff006e",
                color: "#ff006e",
                boxShadow: "0 0 20px rgba(255,0,110,0.2)",
              }}
            >
              {(deleteMutation.isPending || deleteBulkMutation.isPending)
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Deletando...</>
                : <><Trash2 className="w-4 h-4" /> Confirmar Exclusão</>}
            </button>
          </div>
        </div>
      )}

      {/* Single Result */}
      {result && (
        <div className="cyber-card p-5"
          style={{ border: `1px solid ${result.ok ? "rgba(0,255,136,0.2)" : "rgba(255,0,110,0.2)"}` }}>
          <div className="flex items-center gap-2 mb-3">
            {result.ok
              ? <CheckCircle className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
              : <XCircle className="w-4 h-4" style={{ color: "#ff006e" }} />}
            <span className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif", color: result.ok ? "var(--neon-green)" : "#ff006e", fontSize: "0.7rem" }}>
              {result.ok ? "Key Deletada com Sucesso" : "Falha ao Deletar"}
            </span>
          </div>
          <div className="px-3 py-2 rounded" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Share Tech Mono', monospace" }}>
              {result.raw}
            </span>
          </div>
        </div>
      )}

      {/* Bulk Results */}
      {bulkResults && (
        <div className="cyber-card p-5 space-y-3" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: "rgba(255,255,255,0.4)" }}>
            Resultado da Exclusão em Massa
          </p>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {bulkResults.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                <span className="text-xs font-mono truncate max-w-[70%]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{r.key}</span>
                {r.ok ? (
                  <span className="text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/20">SUCESSO</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#ff006e] bg-[#ff006e]/10 px-2 py-0.5 rounded border border-[#ff006e]/20">FALHA</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
