import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Clock, User, Key, Calendar, ShieldCheck, Copy, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

export default function GerarHistory() {
  const { data: history, isLoading } = trpc.logs.generation.useQuery();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("Key copiada!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tighter" style={{ fontFamily: "'Orbitron', sans-serif", color: "#10b981", textShadow: "0 0 15px rgba(16,185,129,0.4)" }}>
          HISTÓRICO DE GERAÇÃO
        </h2>
        <p className="text-muted-foreground font-medium tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Registro detalhado de todas as keys geradas pelos administradores e revendedores.
        </p>
      </div>

      <Card className="border-emerald-500/20 bg-black/40 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-emerald-500/10 bg-emerald-500/5">
          <CardTitle className="flex items-center gap-2 text-lg font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            <History className="w-5 h-5 text-emerald-400" />
            Keys Geradas Recentemente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando histórico de geração...</div>
          ) : !history || history.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum registro de geração encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-emerald-500/10 hover:bg-transparent">
                    <TableHead className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Criado por</TableHead>
                    <TableHead className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Key</TableHead>
                    <TableHead className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Duração</TableHead>
                    <TableHead className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Status</TableHead>
                    <TableHead className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id} className="border-emerald-500/5 hover:bg-emerald-500/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                            <span className="font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                              {item.creator.username}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-6">
                            {item.creator.role === 'admin' ? 'Administrador' : 'Revendedor'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <Key className="w-4 h-4 text-emerald-400/50 flex-shrink-0" />
                          <code className="text-xs font-mono bg-black/50 px-2 py-1 rounded border border-white/5 text-slate-300 truncate">
                            {item.keyValue}
                          </code>
                          <button 
                            onClick={() => handleCopy(item.keyValue)}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                          >
                            {copiedKey === item.keyValue ? (
                              <CheckCheck className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-muted-foreground hover:text-emerald-400" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-bold text-emerald-400/80" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                            {item.days} {item.days === 1 ? 'DIA' : 'DIAS'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border w-fit ${
                          item.status === 'active' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : item.status === 'expired'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {item.status === 'active' ? 'Ativa' : item.status === 'expired' ? 'Expirada' : 'Deletada'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
