import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { toast } from "sonner";
import { CheckCheck, Copy, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, Minus, Plus, Shield } from "lucide-react";

const GRANJEIRO_USERNAME = "GRANJEIRO";
const GRANJEIRO_PASSWORD = "GRANJEIRO123490";
const RED = "#ff1f3d";
const RED_DARK = "#7f0012";

const DURATION_OPTIONS = [
  { days: 1, label: "1 Dia", credits: 1, color: "#ff1f3d" },
  { days: 3, label: "3 Dias", credits: 3, color: "#ff4d00" },
  { days: 7, label: "7 Dias", credits: 7, color: "#ff6b6b" },
  { days: 30, label: "30 Dias", credits: 30, color: "#ffb703" },
] as const;

function GranjeiroLogin() {
  const utils = trpc.useUtils();
  const [username, setUsername] = useState(GRANJEIRO_USERNAME);
  const [password, setPassword] = useState(GRANJEIRO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: async () => {
      toast.success("Acesso autorizado");
      await utils.localAuth.me.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Credenciais inválidas");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim().toUpperCase() !== GRANJEIRO_USERNAME || password !== GRANJEIRO_PASSWORD) {
      toast.error("Use as credenciais autorizadas do PROXY GRANJEIRO");
      return;
    }

    loginMutation.mutate({ username: GRANJEIRO_USERNAME, password: GRANJEIRO_PASSWORD });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "radial-gradient(circle at top, rgba(255,31,61,0.16), transparent 35%), linear-gradient(135deg, #080206 0%, #16020a 45%, #050105 100%)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,31,61,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,31,61,0.08) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 opacity-50" style={{ borderColor: RED }} />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 opacity-50" style={{ borderColor: RED }} />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 opacity-50" style={{ borderColor: RED }} />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 opacity-50" style={{ borderColor: RED }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,31,61,0.12)", border: `1px solid ${RED}`, boxShadow: "0 0 35px rgba(255,31,61,0.36)" }}>
              <Shield className="w-7 h-7" style={{ color: RED }} />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif", color: RED, textShadow: "0 0 18px rgba(255,31,61,0.95), 0 0 44px rgba(255,31,61,0.45)" }}>
            PROXY GRANJEIRO
          </h1>
          <p className="text-xs tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Share Tech Mono', monospace" }}>
            Área exclusiva de geração de keys
          </p>
        </div>

        <div className="p-8 rounded-2xl backdrop-blur" style={{ background: "rgba(16,2,8,0.82)", border: "1px solid rgba(255,31,61,0.34)", boxShadow: "0 0 34px rgba(255,31,61,0.16), inset 0 0 20px rgba(255,31,61,0.03)" }}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-wider uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: RED, fontSize: "0.9rem" }}>
              Login
            </h2>
            <div className="h-px mt-2" style={{ background: `linear-gradient(90deg, ${RED}, transparent)` }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2" style={{ color: RED, fontFamily: "'Rajdhani', sans-serif" }}>
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded text-sm outline-none transition-all"
                style={{ background: "rgba(255,31,61,0.07)", border: "1px solid rgba(255,31,61,0.26)", color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem" }}
                disabled={loginMutation.isPending}
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2" style={{ color: RED, fontFamily: "'Rajdhani', sans-serif" }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded text-sm outline-none transition-all"
                  style={{ background: "rgba(255,31,61,0.07)", border: "1px solid rgba(255,31,61,0.26)", color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem" }}
                  disabled={loginMutation.isPending}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity" style={{ color: RED }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-2"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem", background: "rgba(255,31,61,0.15)", border: `1px solid ${RED}`, color: RED, boxShadow: "0 0 18px rgba(255,31,61,0.35)" }}
            >
              {loginMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</> : <><LockKeyhole className="w-4 h-4" /> Entrar</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function GranjeiroKeyGenerator() {
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
  const selectedOption = DURATION_OPTIONS.find((option) => option.days === selectedDays)!;

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generatedKeys.join("\n"));
    setCopied(true);
    toast.success("Keys copiadas para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 relative overflow-hidden" style={{ background: "radial-gradient(circle at top, rgba(255,31,61,0.14), transparent 35%), linear-gradient(135deg, #080206 0%, #16020a 45%, #050105 100%)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-35" style={{ backgroundImage: "linear-gradient(rgba(255,31,61,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,31,61,0.08) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      <main className="relative z-10 max-w-3xl mx-auto space-y-6">
        <header className="text-center py-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif", color: RED, textShadow: "0 0 18px rgba(255,31,61,0.9), 0 0 44px rgba(255,31,61,0.4)" }}>
            PROXY GRANJEIRO
          </h1>
          <p className="mt-3 text-sm tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Share Tech Mono', monospace" }}>
            Gerador exclusivo de keys
          </p>
        </header>

        <section className="p-5 rounded-2xl" style={{ background: "rgba(16,2,8,0.82)", border: "1px solid rgba(255,31,61,0.28)", boxShadow: "0 0 30px rgba(255,31,61,0.12)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif", color: RED }}>
                Gerar Key
              </h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.48)", fontFamily: "'Rajdhani', sans-serif" }}>
                Acesso autenticado como {user?.username ?? "GRANJEIRO"}
              </p>
            </div>
            {!isAdmin && (
              <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,31,61,0.08)", border: "1px solid rgba(255,31,61,0.2)" }}>
                <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.48)", fontFamily: "'Share Tech Mono', monospace" }}>Créditos</span>
                <strong className="block text-xl" style={{ color: RED, fontFamily: "'Orbitron', sans-serif" }}>{user?.credits ?? 0}</strong>
              </div>
            )}
          </div>
        </section>

        <section className="p-5 rounded-2xl" style={{ background: "rgba(16,2,8,0.82)", border: "1px solid rgba(255,31,61,0.24)" }}>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,31,61,0.82)", fontFamily: "'Share Tech Mono', monospace" }}>
            Duração da Key
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DURATION_OPTIONS.map((option) => {
              const isSelected = selectedDays === option.days;
              return (
                <button
                  key={option.days}
                  onClick={() => setSelectedDays(option.days)}
                  className="p-4 rounded-xl text-center transition-all"
                  style={{ background: isSelected ? `${option.color}1f` : "rgba(255,255,255,0.025)", border: `1px solid ${isSelected ? option.color : "rgba(255,255,255,0.08)"}`, boxShadow: isSelected ? `0 0 18px ${option.color}35` : "none" }}
                >
                  <p className="font-black text-lg" style={{ fontFamily: "'Orbitron', sans-serif", color: isSelected ? option.color : "rgba(255,255,255,0.55)" }}>{option.label}</p>
                  <p className="text-xs mt-1 tracking-wider" style={{ color: isSelected ? `${option.color}cc` : "rgba(255,255,255,0.28)", fontFamily: "'Share Tech Mono', monospace" }}>{option.credits} crédito{option.credits > 1 ? "s" : ""}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="p-5 rounded-2xl" style={{ background: "rgba(16,2,8,0.82)", border: "1px solid rgba(255,31,61,0.24)" }}>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,31,61,0.82)", fontFamily: "'Share Tech Mono', monospace" }}>
            Quantidade
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,31,61,0.08)", border: "1px solid rgba(255,31,61,0.24)", color: RED }}>
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={50}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-24 text-center py-2 rounded-xl text-lg font-bold outline-none"
              style={{ background: "rgba(255,31,61,0.08)", border: "1px solid rgba(255,31,61,0.24)", color: RED, fontFamily: "'Orbitron', sans-serif" }}
            />
            <button onClick={() => setQuantity(Math.min(50, quantity + 1))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,31,61,0.08)", border: "1px solid rgba(255,31,61,0.24)", color: RED }}>
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.42)", fontFamily: "'Rajdhani', sans-serif" }}>máx. 50 por vez</span>
          </div>
        </section>

        <section className="flex items-center justify-between px-5 py-4 rounded-2xl" style={{ background: canAfford ? "rgba(255,31,61,0.08)" : "rgba(255,0,0,0.1)", border: `1px solid ${canAfford ? "rgba(255,31,61,0.24)" : "rgba(255,0,0,0.35)"}` }}>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Rajdhani', sans-serif" }}>
            Custo total: <span className="font-bold" style={{ color: canAfford ? RED : "#ff6b6b" }}>{totalCost} crédito{totalCost > 1 ? "s" : ""}</span>
          </div>
          {!isAdmin && !canAfford && <span className="text-xs" style={{ color: "#ff6b6b", fontFamily: "'Share Tech Mono', monospace" }}>CRÉDITOS INSUFICIENTES</span>}
        </section>

        <button
          onClick={() => generateMutation.mutate({ days: selectedDays, quantity })}
          disabled={generateMutation.isPending || (!isAdmin && !canAfford)}
          className="w-full py-4 rounded-2xl font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem", background: (!isAdmin && !canAfford) ? "rgba(255,255,255,0.04)" : "rgba(255,31,61,0.15)", border: `1px solid ${(!isAdmin && !canAfford) ? "rgba(255,255,255,0.1)" : RED}`, color: (!isAdmin && !canAfford) ? "rgba(255,255,255,0.24)" : RED, boxShadow: (!isAdmin && !canAfford) ? "none" : "0 0 22px rgba(255,31,61,0.32)" }}
        >
          {generateMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</> : <><KeyRound className="w-4 h-4" /> Gerar {quantity} Key{quantity > 1 ? "s" : ""}</>}
        </button>

        {generatedKeys.length > 0 && (
          <section className="rounded-2xl overflow-hidden" style={{ background: "rgba(16,2,8,0.88)", border: "1px solid rgba(255,31,61,0.3)", boxShadow: "0 0 24px rgba(255,31,61,0.12)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: "rgba(255,31,61,0.18)" }}>
              <div className="flex items-center gap-2 flex-wrap">
                <KeyRound className="w-4 h-4" style={{ color: RED }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: RED, fontSize: "0.7rem" }}>
                  {generatedKeys.length} Key{generatedKeys.length > 1 ? "s" : ""} Gerada{generatedKeys.length > 1 ? "s" : ""}
                </span>
                <span className="text-xs px-2 py-0.5 rounded tracking-wider" style={{ background: "rgba(255,31,61,0.12)", color: RED, border: "1px solid rgba(255,31,61,0.24)", fontFamily: "'Share Tech Mono', monospace" }}>
                  {selectedOption.label}
                </span>
              </div>
              <button onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium tracking-wider transition-all" style={{ background: copied ? "rgba(255,31,61,0.2)" : "rgba(255,31,61,0.08)", border: "1px solid rgba(255,31,61,0.3)", color: RED, fontFamily: "'Rajdhani', sans-serif" }}>
                {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copiado!" : "Copiar Todas"}
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {generatedKeys.map((key, index) => (
                <div key={key} className="flex items-center gap-3 px-3 py-2 rounded-xl group" style={{ background: "rgba(255,31,61,0.045)", border: "1px solid rgba(255,31,61,0.1)" }}>
                  <span className="text-xs w-5 text-right flex-shrink-0" style={{ color: "rgba(255,31,61,0.55)", fontFamily: "'Share Tech Mono', monospace" }}>{index + 1}</span>
                  <span className="flex-1 text-sm font-mono break-all" style={{ color: "rgba(255,255,255,0.84)", fontFamily: "'Share Tech Mono', monospace" }}>{key}</span>
                  <button onClick={async () => { await navigator.clipboard.writeText(key); toast.success("Key copiada!"); }} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: RED }}>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function ProxyGranjeiro() {
  const { loading, isAuthenticated, user } = useLocalAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080206", color: RED }}>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.username?.toUpperCase() !== GRANJEIRO_USERNAME) {
    return <GranjeiroLogin />;
  }

  return <GranjeiroKeyGenerator />;
}
