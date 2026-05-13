import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ShieldAlert, Trash2, Calendar, User, Link, Key, FileText, Image as ImageIcon, ExternalLink, Loader2 } from "lucide-react";

export default function AdminDenuncias() {
  const { data: reports, isLoading, refetch } = trpc.reports.list.useQuery();

  const deleteMutation = trpc.reports.delete.useMutation({
    onSuccess: () => {
      toast.success("Denúncia removida");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao remover denúncia");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-rajdhani">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight font-orbitron text-white">CENTRAL DE DENÚNCIAS</h1>
          <p className="text-zinc-500 text-sm">Gerencie os relatos de golpes e fraudes recebidos.</p>
        </div>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-10" />
          <p className="text-zinc-500">Nenhuma denúncia recebida até o momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                      <User className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{report.reporterName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if(confirm("Deseja realmente excluir esta denúncia?")) {
                        deleteMutation.mutate({ id: report.id });
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-red-600/10 text-zinc-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Link className="w-3 h-3" /> Discord do Vendedor
                    </p>
                    <p className="text-sm text-red-400 font-medium break-all">{report.discordLink}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Key className="w-3 h-3" /> Key Relatada
                    </p>
                    <p className="text-sm text-zinc-300 font-mono break-all">{report.scamKey}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Relato
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{report.description}</p>
                </div>

                {report.imageUrls && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Provas (Prints)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {report.imageUrls.split(",").map((url, i) => (
                        <a 
                          key={i} 
                          href={url.trim()} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-400 hover:text-white hover:border-red-600/50 transition-all"
                        >
                          <ExternalLink className="w-3 h-3" /> Print {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
