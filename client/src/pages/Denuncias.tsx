import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ShieldAlert, User, Link, Key, FileText, Upload, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Denuncias() {
  const [formData, setFormData] = useState({
    reporterName: "",
    discordLink: "",
    scamKey: "",
    description: "",
    imageUrls: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.reports.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Denúncia enviada com sucesso!");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao enviar denúncia");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#050000]">
        <div className="w-full max-w-md p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-emerald-500 mb-2 font-orbitron">ENVIADO COM SUCESSO!</h2>
          <p className="text-muted-foreground font-rajdhani">Nossa equipe irá analisar o caso. Obrigado por nos ajudar a manter a comunidade segura.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2 rounded-lg bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs"
          >
            Fazer outra denúncia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#050000] font-rajdhani">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-red-600 font-orbitron">SISTEMA DE DENÚNCIAS</h1>
          <p className="text-muted-foreground text-center max-w-sm mt-2">
            Foi vítima de golpe? Denuncie o revendedor abaixo com provas concretas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 flex items-center gap-2">
                <User className="w-3 h-3" /> Seu Nome
              </label>
              <input 
                required
                type="text" 
                value={formData.reporterName}
                onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all"
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 flex items-center gap-2">
                <Link className="w-3 h-3" /> Discord do Vendedor
              </label>
              <input 
                required
                type="text" 
                value={formData.discordLink}
                onChange={(e) => setFormData({...formData, discordLink: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all"
                placeholder="Ex: discord.gg/exemplo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 flex items-center gap-2">
              <Key className="w-3 h-3" /> Key Enviada (Se houver)
            </label>
            <input 
              required
              type="text" 
              value={formData.scamKey}
              onChange={(e) => setFormData({...formData, scamKey: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-mono"
              placeholder="Cole a key aqui"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Relato do Ocorrido
            </label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all resize-none"
              placeholder="Explique detalhadamente como foi o golpe..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 flex items-center gap-2">
              <Upload className="w-3 h-3" /> Links de Imagens (Prints)
            </label>
            <input 
              type="text" 
              value={formData.imageUrls}
              onChange={(e) => setFormData({...formData, imageUrls: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all"
              placeholder="Links das imagens (Imgur, Discord, etc), separados por vírgula"
            />
            <p className="text-[10px] text-zinc-500 italic">Dica: Use sites como imgur.com para hospedar suas imagens.</p>
          </div>

          <div className="pt-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-600/5 border border-red-600/20 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-500/80">
                Denúncias falsas resultarão em banimento imediato do seu IP e acesso ao sistema. Seja honesto e forneça provas reais.
              </p>
            </div>

            <button 
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-4 rounded-xl bg-red-600 text-white font-black tracking-widest uppercase shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-orbitron"
            >
              {submitMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> ENVIANDO...</>
              ) : (
                "ENVIAR DENÚNCIA"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
