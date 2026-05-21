import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { toast } from "sonner";
import { KeyRound, Copy, CheckCheck, Loader2, Zap, Plus, Minus, Download, X, Sparkles, CalendarClock, Layers3 } from "lucide-react";

type DurationDays = 1 | 3 | 7 | 30;

const DURATION_OPTIONS: Array<{
  days: DurationDays;
  label: string;
  subtitle: string;
  credits: number;
  gradient: string;
  glow: string;
  accent: string;
}> = [
  { days: 1, label: "1 Dia", subtitle: "acesso rápido", credits: 10, gradient: "from-cyan-500/20 via-blue-500/10 to-transparent", glow: "shadow-cyan-500/20", accent: "text-cyan-300" },
  { days: 3, label: "3 Dias", subtitle: "teste estendido", credits: 25, gradient: "from-indigo-500/20 via-violet-500/10 to-transparent", glow: "shadow-indigo-500/20", accent: "text-indigo-300" },
  { days: 7, label: "7 Dias", subtitle: "semana completa", credits: 35, gradient: "from-emerald-500/20 via-teal-500/10 to-transparent", glow: "shadow-emerald-500/20", accent: "text-emerald-300" },
  { days: 30, label: "30 Dias", subtitle: "plano máximo", credits: 55, gradient: "from-amber-500/20 via-orange-500/10 to-transparent", glow: "shadow-amber-500/20", accent: "text-amber-300" },
];

export default function CriarKey() {
  const { user, isAdmin } = useLocalAuth();
  const utils = trpc.useUtils();
  const [selectedDays, setSelectedDays] = useState<DurationDays>(1);
  const [quantity, setQuantity] = useState(1);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const generateMutation = trpc.keys.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedKeys(data.keys);
      setShowSidebar(true);
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

  const selectedOption = DURATION_OPTIONS.find(o => o.days === selectedDays)!;
  const totalCost = selectedOption.credits * quantity;
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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> geração premium
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Criar <span className="text-indigo-400">Key</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mt-2">
              Monte novas keys com duração e quantidade personalizadas em uma experiência mais limpa, rápida e moderna.
            </p>
          </div>
        </div>

        {!isAdmin && (
          <div className="glass-card rounded-3xl p-5 min-w-[240px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">Créditos disponíveis</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{user?.credits ?? 0}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-8">
          <section className="glass-card p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Escolha a duração</h3>
                    <p className="text-sm text-slate-500">A opção de 1 hora foi removida.</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  4 planos ativos
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DURATION_OPTIONS.map((option, index) => {
                  const isSelected = selectedDays === option.days;
                  return (
                    <button
                      key={option.days}
                      onClick={() => setSelectedDays(option.days)}
                      className={`group relative overflow-hidden text-left p-5 rounded-3xl border transition-all duration-500 ${
                        isSelected
                          ? `bg-gradient-to-br ${option.gradient} border-white/20 shadow-2xl ${option.glow}`
                          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_45%)]" />
                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="space-y-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${isSelected ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.03] border-white/10 text-slate-400 group-hover:text-white"}`}>
                            <span className="text-xs font-black">0{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white tracking-tight">{option.label}</p>
                            <p className={`text-xs font-bold uppercase tracking-[0.16em] mt-1 ${isSelected ? option.accent : "text-slate-500"}`}>{option.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{option.credits}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">créditos</p>
                        </div>
                      </div>
                      {isSelected && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="glass-card p-8 rounded-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <Layers3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Quantidade de keys</h3>
                  <p className="text-sm text-slate-500">Gere até 50 keys por vez.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/10 text-cyan-300"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-28 text-center py-3.5 rounded-2xl text-xl font-bold outline-none bg-white/[0.03] border border-white/10 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10 text-white transition-all"
                />
                <button
                  onClick={() => setQuantity(Math.min(50, quantity + 1))}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/10 text-cyan-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="glass-card p-8 rounded-3xl h-fit xl:sticky xl:top-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Resumo</h3>
              <p className="text-sm text-slate-500">Confirme antes de gerar.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Duração", value: selectedOption.label },
              { label: "Quantidade", value: `${quantity} key${quantity > 1 ? "s" : ""}` },
              { label: "Custo total", value: `${totalCost} crédito${totalCost > 1 ? "s" : ""}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>

          {!isAdmin && !canAfford && (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-xs font-bold uppercase tracking-widest">
              Créditos insuficientes
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || (!isAdmin && !canAfford)}
            className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              (!isAdmin && !canAfford)
                ? "bg-white/[0.03] border border-white/5 text-slate-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500 text-white shadow-2xl shadow-indigo-500/25 hover:shadow-cyan-500/25 hover:-translate-y-0.5"
            }`}
          >
            {generateMutation.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Gerando...</>
            ) : (
              <><KeyRound className="w-5 h-5" /> Criar {quantity} Key{quantity > 1 ? "s" : ""}</>
            )}
          </button>
        </aside>
      </div>

      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-md" onClick={() => setShowSidebar(false)} />
          <div className="w-full sm:w-[420px] bg-[#080812]/95 border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight text-white">Keys geradas</p>
                  <p className="text-xs text-slate-500">{generatedKeys.length} chave{generatedKeys.length > 1 ? "s" : ""} prontas para copiar</p>
                </div>
              </div>
              <button onClick={() => setShowSidebar(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-white/10">
              <button
                onClick={handleCopyAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 text-emerald-300"
              >
                {copied ? <><CheckCheck className="w-4 h-4" /> Copiado!</> : <><Download className="w-4 h-4" /> Copiar Todas</>}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {generatedKeys.map((key, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">KEY #{i + 1}</span>
                    <button onClick={() => handleCopySingle(key, i)} className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      {copiedIndex === i ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-xs font-mono break-all text-slate-300 bg-black/20 p-3 rounded-xl block border border-white/5">
                    {key}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
              <p className="text-xs text-slate-500 text-center">
                Duração selecionada: <span className="text-emerald-300 font-semibold">{selectedOption.label}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
