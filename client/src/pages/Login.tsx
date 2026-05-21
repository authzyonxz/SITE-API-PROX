import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Shield, User, Lock, ArrowRight, Loader2, Eye, EyeOff, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Função para gerar um ID de dispositivo persistente
const getDeviceId = () => {
  let deviceId = localStorage.getItem("auth_device_id");
  if (!deviceId) {
    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const navInfo = `${window.navigator.userAgent}${window.navigator.language}`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const canvasInfo = ctx ? "canvas-id" : "no-canvas";
    
    const rawId = `${screenInfo}-${navInfo}-${canvasInfo}`;
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      const char = rawId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    deviceId = `dev_${Math.abs(hash).toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem("auth_device_id", deviceId);
  }
  return deviceId;
};

export default function Login() {
  const [, navigate] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const utils = trpc.useUtils();
  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: async () => {
      toast.success(t("login.welcome"), {
        description: t("login.success"),
      });
      await utils.localAuth.me.invalidate();
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(t("login.failed"), {
        description: err.message || t("login.invalid"),
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(t("login.required"), {
        description: t("login.required_desc"),
      });
      return;
    }
    const deviceId = getDeviceId();
    loginMutation.mutate({ username, password, deviceId });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] relative overflow-hidden font-sans">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Language Selector Top Right */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-2">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <Globe className="w-4 h-4 text-indigo-400" />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setLanguage("pt")}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === "pt" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"}`}
            >
              PT
            </button>
            <button 
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === "en" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10 animate-in fade-in zoom-in duration-700">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-6 group transition-transform duration-500 hover:scale-110">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            AUTH<span className="text-indigo-400">PROXY</span>
          </h1>
          <p className="text-slate-400 font-medium text-center">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                  {t("login.username")}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("login.username_placeholder")}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                  {t("login.password")}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-4 rounded-2xl premium-button flex items-center justify-center gap-2 group"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="font-bold">{t("login.button")}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-slate-600 text-[10px] font-bold tracking-[0.2em] uppercase">
            &copy; 2026 AUTHPROXY SYSTEMS &bull; {t("footer.secure")}
          </p>
          <p className="text-slate-700 text-[9px] font-bold tracking-[0.1em] uppercase">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </div>
  );
}
