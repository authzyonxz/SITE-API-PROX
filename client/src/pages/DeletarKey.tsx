import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle, CheckCircle, XCircle, Key, ShieldAlert } from "lucide-react";

export default function DeletarKey() {
  const [keyInput, setKeyInput] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
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

  const handleRequestDelete = () => {
    if (!keyInput.trim()) { toast.error("Digite a key para deletar"); return; }
    setConfirmStep(true);
    setResult(null);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate({ generatedKey: keyInput.trim() });
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
          Remova permanentemente uma key do sistema
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 px-4 py-3 rounded"
        style={{ background: "rgba(255,0,110,0.05)", border: "1px solid rgba(255,0,110,0.2)" }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ff006e" }} />
        <p className="text-sm" style={{ color: "rgba(255,100,130,0.8)", fontFamily: "'Rajdhani', sans-serif" }}>
          Esta ação é <strong>irreversível</strong>. A key será permanentemente removida e não poderá ser recuperada.
        </p>
      </div>

      {/* Input */}
      <div className="cyber-card p-5" style={{ border: "1px solid rgba(255,0,110,0.15)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,0,110,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
          Key para Deletar
        </p>
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
            onFocus={(e) => { e.target.style.borderColor = "#ff006e"; e.target.style.boxShadow = "0 0 10px rgba(255,0,110,0.2)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,0,110,0.2)"; e.target.style.boxShadow = "none"; }}
            disabled={confirmStep}
          />
        </div>

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
            Solicitar Exclusão
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
                Você está prestes a deletar permanentemente esta key
              </p>
            </div>
          </div>

          <div className="px-3 py-2 rounded" style={{ background: "rgba(255,0,110,0.05)", border: "1px solid rgba(255,0,110,0.15)" }}>
            <p className="text-xs mb-1 tracking-wider" style={{ color: "rgba(255,0,110,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>KEY:</p>
            <p className="text-sm font-mono break-all" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Share Tech Mono', monospace" }}>
              {keyInput}
            </p>
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
              disabled={deleteMutation.isPending}
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
              {deleteMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Deletando...</>
                : <><Trash2 className="w-4 h-4" /> Confirmar Exclusão</>}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
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
    </div>
  );
}
