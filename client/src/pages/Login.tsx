import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Loader2, Shield, Eye, EyeOff, Lock, User } from "lucide-react";

// Função simples para gerar um ID único para o dispositivo/navegador
const getDeviceId = () => {
  let deviceId = localStorage.getItem("auth_device_id");
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("auth_device_id", deviceId);
  }
  return deviceId;
};

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: () => {
      toast.success("Acesso autorizado");
      navigate("/dashboard");
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
    const deviceId = getDeviceId();
    loginMutation.mutate({ username, password, deviceId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #9d4edd, transparent)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(135deg, #00d4ff, #9d4edd)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AUTH PROXY
          </h1>
          <p className="text-sm tracking-widest uppercase text-slate-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Painel de Controle
          </p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-wide text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Autenticação
            </h2>
            <div className="h-1 mt-3 rounded-full" style={{ background: "linear-gradient(90deg, #00d4ff, transparent)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-3 text-slate-300" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Usuário
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-sm outline-none transition-all bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-3 text-slate-300" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-12 pr-12 py-3 rounded-lg text-sm outline-none transition-all bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20"
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-lg font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
            >
              {loginMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</>
              ) : (
                <><Shield className="w-4 h-4" /> Acessar Sistema</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-8 tracking-widest text-slate-500" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          AUTH PROXY v2.0 // SISTEMA SEGURO
        </p>
      </div>
    </div>
  );
}
