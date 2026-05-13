import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ShieldAlert, User, Link, Key, FileText, Upload, Loader2, CheckCircle2, AlertTriangle, X, Image as ImageIcon } from "lucide-react";

export default function Denuncias() {
  const [formData, setFormData] = useState({
    reporterName: "",
    discordLink: "",
    scamKey: "",
    description: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [...images];
    let processed = 0;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`A imagem ${file.name} é muito grande (máx 5MB)`);
        processed++;
        if (processed === files.length) setUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        setImages([...newImages]);
        processed++;
        if (processed === files.length) setUploading(false);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      ...formData,
      imageUrls: images.join("|"), // Usamos o pipe como separador para base64
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#050000]">
        <div className="w-full max-w-md p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-emerald-500 mb-2 font-orbitron">ENVIADO COM SUCESSO!</h2>
          <p className="text-muted-foreground font-rajdhani">Nossa equipe irá analisar o caso. Obrigado por nos ajudar a manter a comunidade segura.</p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setImages([]);
              setFormData({ reporterName: "", discordLink: "", scamKey: "", description: "" });
            }}
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

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-red-500/70 flex items-center gap-2">
              <Upload className="w-3 h-3" /> Anexar Provas (Prints)
            </label>
            
            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-red-600/30">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-red-600/50 hover:bg-red-600/5 transition-all">
                  <Upload className="w-6 h-6 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 mt-1">Upload</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
              )}
            </div>
            {uploading && <p className="text-xs text-red-500 animate-pulse">Processando imagens...</p>}
            <p className="text-[10px] text-zinc-500 italic">Máximo de 5 imagens. Cada uma até 5MB.</p>
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
              disabled={submitMutation.isPending || uploading}
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
