import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle, XCircle, Key, ArrowRight, Download, Menu, X, Shield, Info, Search, MessageCircle } from "lucide-react";

export default function ProxyIosUpdateIp() {
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
      className="min-h-screen text-foreground font-sans selection:bg-purple-600/40"
      style={{
        background: "#05000a",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(147,51,234,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(147,51,234,0.1) 0%, transparent 50%), linear-gradient(rgba(147,51,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.06) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    >
      {/* Header / Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(147,51,234,0.4)",
          background: "rgba(5,0,10,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: "rgba(147,51,234,0.2)",
                  borderColor: "rgba(147,51,234,0.5)",
                  boxShadow: "0 0 20px rgba(147,51,234,0.4)",
                }}
              >
                <Shield className="w-5 h-5" style={{ color: "#a855f7" }} />
              </div>
              <span
                className="text-xl font-black tracking-tighter font-orbitron"
                style={{ color: "#a855f7", textShadow: "0 0 10px rgba(147,51,234,0.5)" }}
              >
                PROXY IOS
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              
                
                <a
                  href="https://whatsapp.com/channel/0029VbBmk1RBlHpUxLLeSc1i"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-xl text-white font-black tracking-[0.2em] uppercase transition-all font-orbitron text-sm"
                  style={{
                    background: "linear-gradient(to right, #25d366, #128c7e)",
                    boxShadow: "0 0 35px rgba(37,211,102,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 45px rgba(37,211,102,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 35px rgba(37,211,102,0.4)";
                  }}
                >
                  <MessageCircle className="w-6 h-6" />
                  GRUPO WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="mt-12 py-8 border-t text-center"
        style={{ borderColor: "rgba(147,51,234,0.2)" }}
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-mono">
          Proxy iOS System &copy; 2026 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}
