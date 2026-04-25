import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { UserPlus, Loader2, Users, Zap, Eye, EyeOff, CheckCircle, Coins } from "lucide-react";

export default function CriarUsuario() {
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credits, setCredits] = useState(0);
  const [lastCreated, setLastCreated] = useState<{ username: string; credits: number } | null>(null);

  const { data: userList, isLoading: loadingUsers } = trpc.users.list.useQuery();

  const createMutation = trpc.users.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Revendedor "${data.username}" criado com sucesso!`);
      setLastCreated({ username: data.username, credits: data.credits });
      setUsername("");
      setPassword("");
      setCredits(0);
      utils.users.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao criar usuário");
    },
  });

  const addCreditsMutation = trpc.users.addCredits.useMutation({
    onSuccess: () => {
      toast.success("Créditos adicionados!");
      utils.users.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!username.trim()) { toast.error("Digite o nome de usuário"); return; }
    if (!password.trim()) { toast.error("Digite a senha"); return; }
    if (username.length < 3) { toast.error("Nome de usuário deve ter pelo menos 3 caracteres"); return; }
    createMutation.mutate({ username: username.trim(), password, credits });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-purple)", textShadow: "0 0 15px rgba(157,78,221,0.5)" }}>
          Criar Usuário
        </h2>
        <p className="text-sm mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
          Cadastre novos revendedores no sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create form */}
        <div className="cyber-card p-5 space-y-4" style={{ border: "1px solid rgba(157,78,221,0.2)" }}>
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-4 h-4" style={{ color: "var(--neon-purple)" }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(157,78,221,0.7)", fontFamily: "'Share Tech Mono', monospace" }}>
              Novo Revendedor
            </p>
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(157,78,221,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário"
              className="w-full px-4 py-3 rounded outline-none transition-all"
              style={{
                background: "rgba(157,78,221,0.05)",
                border: "1px solid rgba(157,78,221,0.2)",
                color: "var(--foreground)",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "1rem",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--neon-purple)"; e.target.style.boxShadow = "0 0 10px rgba(157,78,221,0.2)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(157,78,221,0.2)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(157,78,221,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                className="w-full px-4 py-3 pr-12 rounded outline-none transition-all"
                style={{
                  background: "rgba(157,78,221,0.05)",
                  border: "1px solid rgba(157,78,221,0.2)",
                  color: "var(--foreground)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1rem",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--neon-purple)"; e.target.style.boxShadow = "0 0 10px rgba(157,78,221,0.2)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(157,78,221,0.2)"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "var(--neon-purple)" }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(157,78,221,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
              Créditos Iniciais
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                value={credits}
                onChange={(e) => setCredits(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 px-4 py-3 rounded outline-none transition-all"
                style={{
                  background: "rgba(157,78,221,0.05)",
                  border: "1px solid rgba(157,78,221,0.2)",
                  color: "var(--foreground)",
                  fontFamily: "'Orbitron', sans-serif",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--neon-purple)"; e.target.style.boxShadow = "0 0 10px rgba(157,78,221,0.2)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(157,78,221,0.2)"; e.target.style.boxShadow = "none"; }}
              />
              <div className="flex gap-1">
                {[10, 30, 100].map(v => (
                  <button key={v} onClick={() => setCredits(v)}
                    className="px-2 py-1 rounded text-xs transition-all"
                    style={{ background: "rgba(157,78,221,0.1)", border: "1px solid rgba(157,78,221,0.2)", color: "var(--neon-purple)", fontFamily: "'Share Tech Mono', monospace" }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="w-full py-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.8rem",
              background: "rgba(157,78,221,0.1)",
              border: "1px solid var(--neon-purple)",
              color: "var(--neon-purple)",
              boxShadow: "0 0 15px rgba(157,78,221,0.2)",
            }}
          >
            {createMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Criando...</>
              : <><UserPlus className="w-4 h-4" /> Criar Revendedor</>}
          </button>

          {lastCreated && (
            <div className="flex items-center gap-2 px-3 py-2 rounded"
              style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--neon-green)" }} />
              <span className="text-sm" style={{ color: "var(--neon-green)", fontFamily: "'Rajdhani', sans-serif" }}>
                <strong>{lastCreated.username}</strong> criado com {lastCreated.credits} créditos
              </span>
            </div>
          )}
        </div>

        {/* Users list */}
        <div className="cyber-card overflow-hidden" style={{ border: "1px solid rgba(157,78,221,0.15)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "rgba(157,78,221,0.1)" }}>
            <Users className="w-4 h-4" style={{ color: "var(--neon-purple)" }} />
            <span className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-purple)", fontSize: "0.7rem" }}>
              Revendedores Cadastrados
            </span>
          </div>
          <div className="overflow-y-auto max-h-96">
            {loadingUsers ? (
              <div className="p-5 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
                ))}
              </div>
            ) : !userList || userList.filter(u => u.role === "reseller").length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color: "var(--neon-purple)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Rajdhani', sans-serif" }}>
                  Nenhum revendedor cadastrado
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                {userList.filter(u => u.role === "reseller").map((user) => (
                  <div key={user.id} className="px-5 py-3 flex items-center gap-3 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(157,78,221,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "rgba(157,78,221,0.2)", color: "var(--neon-purple)" }}>
                      {user.username[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)", fontFamily: "'Rajdhani', sans-serif" }}>
                        {user.username}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace" }}>
                        REVENDEDOR
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" style={{ color: user.credits > 0 ? "var(--neon-green)" : "rgba(255,0,110,0.5)" }} />
                        <span className="text-sm font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: user.credits > 0 ? "var(--neon-green)" : "rgba(255,0,110,0.5)" }}>
                          {user.credits}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const amount = parseInt(prompt(`Adicionar créditos para ${user.username}:`) || "0");
                          if (amount > 0) addCreditsMutation.mutate({ userId: user.id, amount });
                        }}
                        className="p-1.5 rounded transition-all"
                        title="Adicionar créditos"
                        style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", color: "var(--neon-green)" }}
                      >
                        <Coins className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
