import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, MessageCircle, Menu, X, Shield, Info, Search, Download } from "lucide-react";

export default function AppleIosUpdateIp() {
  const [keyInput, setKeyInput] = useState("");
  const [newIp, setNewIp] = useState("");
  const [result, setResult] = useState<{ ok: boolean; raw: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [detectedIp, setDetectedIp] = useState<string | null>(null);
  const [isFetchingIp, setIsFetchingIp] = useState(false);

  const updateMutation = trpc.keys.publicUpdateIp.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (data.ok) {
        toast.success("IP atualizado com sucesso!");
      } else {
        toast.error("Falha ao atualizar IP");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao atualizar IP");
    },
  });

  const handleUpdate = () => {
    if (!keyInput.trim()) { toast.error("Digite a key"); return; }
    if (!newIp.trim()) { toast.error("Digite o novo IP"); return; }
    updateMutation.mutate({ generatedKey: keyInput.trim(), newIp: newIp.trim() });
  };

  const handleFetchIp = async () => {
    setIsFetchingIp(true);
    setDetectedIp(null);
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setDetectedIp(data.ip);
      setNewIp(data.ip);
      toast.success("IP detectado e preenchido automaticamente!");
    } catch {
      toast.error("Não foi possível detectar seu IP. Tente novamente.");
    } finally {
      setIsFetchingIp(false);
    }
  };

  const proxyInfos = [
    {
      title: "🎯 PROXY HS PESCOÇO",
      items: [
        { label: "Servidor", value: "144.172.100.226" },
        { label: "Porta", value: "1110" }
      ]
    },
    {
      title: "🔥 PROXY HS PESCOÇO + ANTENA",
      items: [
        { label: "Servidor", value: "69.197.176.242" },
        { label: "Porta", value: "10063" }
      ]
    }
  ];

  return (
    <div
      className="min-h-screen text-foreground font-sans selection:bg-red-600/40"
      style={{
        background: "#0a0000",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(255,0,0,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,0,0,0.08) 0%, transparent 50%), linear-gradient(rgba(255,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(255,0,0,0.4)",
          background: "rgba(10,0,0,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(255,0,0,0.2)",
                  borderColor: "rgba(255,0,0,0.5)",
                  boxShadow: "0 0 20px rgba(255,0,0,0.4)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#ff0000" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#ff0000", textShadow: "0 0 10px rgba(255,0,0,0.5)" }}
              >
                APPLE IOS PROXY
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              
                <a 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-[0.2em] uppercase shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all font-orbitron text-sm"
                >
                </a>
              </div>

              <div className="space-y-3 mb-4">
                <a 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div>

              <div className="space-y-3 mb-4">
                <a 
                  href="https://www.mediafire.com/file/u7nn7vgu5m4piob/HS%252BANTENA.pem/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black tracking-widest uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-cyan-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS ANTENA)
                </a>
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all font-orbitron text-xs border border-purple-400/30"
                >
                  <Download className="w-5 h-5" />
                  CERTIFICADO (HS PESCOÇO)
                </a>
              </div></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: "rgba(255,0,0,0.1)", background: "rgba(5,0,0,0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-4 h-4" style={{ color: "rgba(255,0,0,0.5)" }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase font-orbitron" style={{ color: "rgba(255,0,0,0.5)" }}>
              APPLE IOS PROXY SYSTEM
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-mono">
            © 2024 SECURITY INFRASTRUCTURE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
