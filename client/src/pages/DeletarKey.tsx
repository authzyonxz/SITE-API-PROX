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
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-black tracking-wider text-white"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#ef4444" }}>
          Deletar Key
        </h2>
        <p className="text-sm mt-2 tracking-wide text-slate-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Remova permanentemente keys do sistema
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 p-1 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => { setMode("single"); setConfirmStep(false); setResult(null); setBulkResults(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${mode === "single" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-slate-400 hover:text-slate-200"}`}
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <Key className="w-4 h-4" />
          Única
        </button>
        <button
          onClick={() => { setMode("bulk"); setConfirmStep(false); setResult(null); setBulkResults(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${mode === "bulk" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-slate-400 hover:text-slate-200"}`}
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <ListFilter className="w-4 h-4" />
          Em Massa
        </button>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-4 px-6 py-4 rounded-xl backdrop-blur-xl bg-red-500/10 border border-red-500/30">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
        <p className="text-sm text-red-200" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Esta ação é <strong>irreversível</strong>. As keys serão permanentemente removidas e não poderão ser recuperadas.
        </p>
      </div>

      {/* Input */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
        <p className="text-xs tracking-widest uppercase mb-6 text-slate-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {mode === "single" ? "Key para Deletar" : "Lista de Keys (uma por linha ou separadas por vírgula)"}
        </p>
        
        {mode === "single" ? (
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400/50" />
            <input
              type="text"
              value={keyInput}
              onChange={(e) => { setKeyInput(e.target.value); setConfirmStep(false); setResult(null); }}
              placeholder="Cole a key aqui..."
              className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all bg-white/5 border border-white/10 focus:border-red-400/50 focus:ring-2 focus:ring-red-400/20 text-white placeholder-slate-500"
              style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.9rem" }}
              disabled={confirmStep}
            />
          </div>
        ) : (
          <textarea
            value={bulkInput}
            onChange={(e) => { setBulkInput(e.target.value); setConfirmStep(false); setBulkResults(null); }}
            placeholder="Cole várias keys aqui..."
            rows={6}
            className="w-full p-4 rounded-lg outline-none transition-all resize-none bg-white/5 border border-white/10 focus:border-red-400/50 focus:ring-2 focus:ring-red-400/20 text-white placeholder-slate-500"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.9rem" }}
            disabled={confirmStep}
          />
        )}

        {!confirmStep ? (
          <button
            onClick={handleRequestDelete}
            className="w-full mt-6 py-3 rounded-lg font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem" }}
          >
            <Trash2 className="w-5 h-5" />
            {mode === "single" ? "Solicitar Exclusão" : "Solicitar Exclusão em Massa"}
          </button>
        ) : null}
      </div>

      {/* Confirmation step */}
      {confirmStep && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-500/20 border border-red-500/30">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="font-bold tracking-wider text-sm text-red-400"
                style={{ fontFamily: "'Orbitron', sans-serif" }}>
                CONFIRMAÇÃO NECESSÁRIA
              </p>
              <p className="text-xs mt-1 text-slate-300" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {mode === "single" ? "Você está prestes a deletar esta key" : `Você está prestes a deletar ${bulkInput.split(/[\n, ]+/).filter(k => k.trim().length > 0).length} keys`}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-lg font-bold tracking-widest uppercase transition-all bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending || deleteBulkMutation.isPending}
              className="flex-1 py-3 rounded-lg font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
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
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border rounded-xl p-6"
          style={{ borderColor: result.ok ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)" }}>
          <div className="flex items-center gap-3 mb-4">
            {result.ok
              ? <CheckCircle className="w-5 h-5 text-green-400" />
              : <XCircle className="w-5 h-5 text-red-400" />}
            <span className="text-sm font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif", color: result.ok ? "#10b981" : "#ef4444" }}>
              {result.ok ? "Key Deletada com Sucesso" : "Falha ao Deletar"}
            </span>
          </div>
          <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
            <span className="text-sm font-mono text-slate-200" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {result.raw}
            </span>
          </div>
        </div>
      )}

      {/* Bulk Results */}
      {bulkResults && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 space-y-4">
          <p className="text-sm font-bold tracking-widest uppercase text-slate-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Resultado da Exclusão em Massa
          </p>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {bulkResults.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs font-mono truncate max-w-[70%] text-slate-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{r.key}</span>
                {r.ok ? (
                  <span className="text-xs font-bold text-green-400 bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30">SUCESSO</span>
                ) : (
                  <span className="text-xs font-bold text-red-400 bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/30">FALHA</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
