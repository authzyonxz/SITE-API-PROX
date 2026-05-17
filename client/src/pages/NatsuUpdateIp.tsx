import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search } from "lucide-react";

export default function NatsuUpdateIp() {
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
      className="min-h-screen text-foreground font-sans selection:bg-red-500/30"
      style={{
        background: "oklch(0.08 0.02 15)",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(220,38,38,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(239,68,68,0.05) 0%, transparent 50%), linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(220,38,38,0.25)",
          background: "rgba(12,4,4,0.85)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(220,38,38,0.12)",
                  borderColor: "rgba(220,38,38,0.35)",
                  boxShadow: "0 0 15px rgba(220,38,38,0.25)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#f87171" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#f87171" }}
              >
                NATSU PROXY
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              
                <a 
                  href="https://www.mediafire.com/file/xqz0u0ontm4teel/HSPESCOC%25CC%25A7O.cer/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black tracking-[0.2em] uppercase shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all font-orbitron text-sm"
                >
                  <Download className="w-5 h-5" />
                  DOWNLOAD CERTIFICADO (HS PESCOÇO)
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
              </div>
</div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="mt-12 py-8 border-t text-center"
        style={{ borderColor: "rgba(220,38,38,0.1)" }}
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          Natsu Proxy System &copy; 2026 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}
