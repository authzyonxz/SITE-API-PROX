import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Shield, Loader2 } from "lucide-react";

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading, isAuthenticated, isAdmin } = useLocalAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", boxShadow: "0 0 20px rgba(0,212,255,0.2)" }}>
            <Shield className="w-8 h-8" style={{ color: "var(--neon-blue)" }} />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--neon-blue)" }} />
            <span className="text-sm tracking-widest" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "'Share Tech Mono', monospace" }}>
              VERIFICANDO ACESSO...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "rgba(255,0,110,0.1)", border: "1px solid rgba(255,0,110,0.3)" }}>
            <Shield className="w-8 h-8" style={{ color: "#ff006e" }} />
          </div>
          <p className="font-bold tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif", color: "#ff006e", fontSize: "0.85rem" }}>
            ACESSO NEGADO
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif" }}>
            Esta página é restrita ao administrador
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
