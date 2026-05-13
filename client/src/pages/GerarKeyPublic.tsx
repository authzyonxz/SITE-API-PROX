import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { KeyRound, Copy, CheckCheck, Loader2, Zap, Plus, Minus, Shield, Lock, User } from "lucide-react";

const DURATION_OPTIONS = [
  { days: 1, label: "1 Dia", credits: 1, color: "#00d4ff" },
  { days: 3, label: "3 Dias", credits: 3, color: "#9d4edd" },
  { days: 7, label: "7 Dias", credits: 7, color: "#00ff88" },
  { days: 30, label: "30 Dias", credits: 30, color: "#ff9500" },
];

export default function GerarKeyPublic() {
  const { user, isAuthenticated, refetch } = useLocalAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [selectedDays, setSelectedDays] = useState<1 | 3 | 7 | 30>(1);
  const [quantity, setQuantity] = useState(1);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: () => {
      toast.success("Acesso liberado!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Usuário ou senha incorretos");
    },
  });

  const logoutMutation = trpc.localAuth.logout.useMutation({
    onSuccess: () => {
      refetch();
      toast.info("Sessão encerrada");
    }
  });

  const generateMutation = trpc.keys.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedKeys(data.keys);
      if (data.keys.length > 0) {
        toast.success(`${data.keys.length} key(s) gerada(s) com sucesso!`);
      }
      if (data.errors.length > 0) {
        toast.error(`${data.errors.length} erro(s) ao gerar keys`);
      }
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao gerar keys. Verifique seus créditos.");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Permitir o login do usuário específico
    if (username === "79998630914" && password === "79998630914") {
      loginMutation.mutate({ username, password });
    } else {
      toast.error("Este acesso é restrito apenas para o usuário autorizado.");
    }
  };

  const handleGenerate = () => {
    generateMutation.mutate({ days: selectedDays, quantity });
  };

  const handleCopyAll = async () => {
    const text = generatedKeys.join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Keys copiadas!");
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedOption = DURATION_OPTIONS.find(o => o.days === selectedDays)!;

  if (!isAuthenticated || (user && user.username !== "79998630914" && user.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" 
        style={{ background: "#0a0000", backgroundImage: "radial-gradient(circle at center, rgba(255,0,0,0.1) 0%, transparent 70%)" }}>
        <div className="w-full max-w-md p-8 rounded-2xl border" 
          style={{ background: "rgba(255,0,0,0.02)", borderColor: "rgba(255,0,0,0.2)", boxShadow: "0 0 40px rgba(255,0,0,0.1)" }}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center border mb-4"
              style={{ background: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.3)" }}>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter font-orbitron text-red-600">ACESSO RESTRITO</h1>
            <p className="text-muted-foreground text-sm font-rajdhani mt-1">Identifique-se para gerar keys</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 font-mono">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black border border-red-900/30 text-white outline-none focus:border-red-600 transition-all"
                  placeholder="Digite seu usuário"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 font-mono">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black border border-red-900/30 text-white outline-none focus:border-red-600 transition-all"
                  placeholder="Digite sua senha"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-4 rounded-lg bg-red-600/20 border border-red-600 text-red-500 font-black tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all font-orbitron mt-4 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> ENTRANDO...</>
              ) : (
                "ENTRAR"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "#0a0000" }}>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-wider font-orbitron text-red-600" style={{ textShadow: "0 0 15px rgba(255,0,0,0.4)" }}>
              GERAR KEY
            </h2>
            <p className="text-sm mt-1 tracking-wide text-red-500/50 font-rajdhani">
              Painel de geração rápida de keys de acesso
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-red-500/40 font-mono">Créditos</p>
              <p className="text-lg font-bold text-red-500 font-orbitron">{user?.credits ?? 0}</p>
            </div>
            <button 
              onClick={() => logoutMutation.mutate()}
              className="px-4 py-2 rounded border border-red-900/30 text-red-900 text-xs font-bold uppercase hover:bg-red-900/10 transition-all"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Duration selector */}
        <div className="p-6 rounded-xl border border-red-900/20 bg-red-900/5">
          <p className="text-xs tracking-widest uppercase mb-4 text-red-500/60 font-mono">
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
                    background: isSelected ? "rgba(255,0,0,0.1)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "rgba(255,0,0,0.5)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <p className="font-black text-lg font-orbitron" style={{ color: isSelected ? "#ff0000" : "rgba(255,255,255,0.5)" }}>
                    {option.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="p-6 rounded-xl border border-red-900/20 bg-red-900/5">
          <p className="text-xs tracking-widest uppercase mb-4 text-red-500/60 font-mono">
            Quantidade
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded flex items-center justify-center bg-red-900/20 border border-red-900/40 text-red-500"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-24 text-center py-2 rounded text-2xl font-bold bg-transparent text-red-500 font-orbitron"
            />
            <button
              onClick={() => setQuantity(Math.min(50, quantity + 1))}
              className="w-12 h-12 rounded flex items-center justify-center bg-red-900/20 border border-red-900/40 text-red-500"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full py-5 rounded-xl font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all bg-red-600 text-white shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-orbitron"
        >
          {generateMutation.isPending ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> GERANDO...</>
          ) : (
            <><KeyRound className="w-6 h-6" /> GERAR {quantity} KEY{quantity > 1 ? "s" : ""}</>
          )}
        </button>

        {/* Generated keys result */}
        {generatedKeys.length > 0 && (
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-900/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold tracking-widest uppercase font-orbitron text-emerald-500">
                  {generatedKeys.length} Key{generatedKeys.length > 1 ? "s" : ""} Gerada{generatedKeys.length > 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase"
              >
                {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar Todas"}
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {generatedKeys.map((key, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded bg-black/40 border border-emerald-900/10 group">
                  <span className="text-xs font-mono text-emerald-900">{i + 1}</span>
                  <span className="flex-1 text-sm font-mono text-emerald-500 break-all">{key}</span>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(key);
                      toast.success("Key copiada!");
                    }}
                    className="opacity-0 group-hover:opacity-100 text-emerald-500"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
