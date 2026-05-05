import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Loader2, Shield, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: () => {
      toast.success("Acesso autorizado");
      navigate("/dashboard");
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.message || "Credenciais inválidas");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-background cyber-grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, var(--neon-blue), transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, var(--neon-purple), transparent)" }} />
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 opacity-30" style={{ borderColor: "var(--neon-blue)" }} />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 opacity-30" style={{ borderColor: "var(--neon-blue)" }} />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 opacity-30" style={{ borderColor: "var(--neon-blue)" }} />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 opacity-30" style={{ borderColor: "var(--neon-blue)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid var(--neon-blue)", boxShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
              <Shield className="w-6 h-6" style={{ color: "var(--neon-blue)" }} />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-widest mb-1"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 20px var(--neon-blue), 0 0 40px var(--neon-blue)" }}>
            AUTH PROXY
          </h1>
          <p className="text-sm tracking-widest uppercase" style={{ color: "var(--neon-purple)", fontFamily: "'Rajdhani', sans-serif" }}>
            Desenvolvedores: @gzinwq & @ruanwq
          </p>
        </div>

        {/* Login Card */}
        <div className="cyber-card p-8" style={{ border: "1px solid rgba(0,212,255,0.3)", boxShadow: "0 0 30px rgba(0,212,255,0.1), 0 0 60px rgba(157,78,221,0.05)" }}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-wider uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", fontSize: "0.9rem" }}>
              Autenticação
            </h2>
            <div className="h-px mt-2" style={{ background: "linear-gradient(90deg, var(--neon-blue), transparent)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "var(--neon-blue)", fontFamily: "'Rajdhani', sans-serif" }}>
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full px-4 py-3 rounded text-sm outline-none transition-all"
                style={{
                  background: "rgba(0,212,255,0.05)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: "var(--foreground)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1rem",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--neon-blue)"; e.target.style.boxShadow = "0 0 10px rgba(0,212,255,0.2)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.2)"; e.target.style.boxShadow = "none"; }}
                disabled={loginMutation.isPending}
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "var(--neon-blue)", fontFamily: "'Rajdhani', sans-serif" }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 pr-12 rounded text-sm outline-none transition-all"
                  style={{
                    background: "rgba(0,212,255,0.05)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "var(--foreground)",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "1rem",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--neon-blue)"; e.target.style.boxShadow = "0 0 10px rgba(0,212,255,0.2)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.2)"; e.target.style.boxShadow = "none"; }}
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--neon-blue)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.8rem",
                background: loginMutation.isPending ? "rgba(0,212,255,0.1)" : "rgba(0,212,255,0.15)",
                border: "1px solid var(--neon-blue)",
                color: "var(--neon-blue)",
                boxShadow: "0 0 15px rgba(0,212,255,0.3)",
              }}
              onMouseEnter={(e) => { if (!loginMutation.isPending) { (e.target as HTMLElement).style.background = "rgba(0,212,255,0.25)"; (e.target as HTMLElement).style.boxShadow = "0 0 25px rgba(0,212,255,0.5)"; } }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "rgba(0,212,255,0.15)"; (e.target as HTMLElement).style.boxShadow = "0 0 15px rgba(0,212,255,0.3)"; }}
            >
              {loginMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</>
              ) : (
                <><Shield className="w-4 h-4" /> Acessar Sistema</>
              )}
            </button>
          </form>
        </div>



        <p className="text-center text-xs mt-6 tracking-widest" style={{ color: "rgba(0,212,255,0.3)", fontFamily: "'Share Tech Mono', monospace" }}>
          AUTH PROXY v1.0 // SISTEMA SEGURO
        </p>
      </div>
    </div>
  );
}
