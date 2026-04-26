import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Clock, User, Globe } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Logs() {
  const { data: logs, isLoading } = trpc.logs.list.useQuery();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tighter" style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-blue)", textShadow: "0 0 15px rgba(0,212,255,0.4)" }}>
          LOGS DE ACESSO
        </h2>
        <p className="text-muted-foreground font-medium tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Monitoramento de entradas e endereços IP do sistema.
        </p>
      </div>

      <Card className="border-neon-blue/20 bg-black/40 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-neon-blue/10 bg-neon-blue/5">
          <CardTitle className="flex items-center gap-2 text-lg font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            <Shield className="w-5 h-5 text-neon-blue" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando logs do sistema...</div>
          ) : !logs || logs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum log de acesso encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-neon-blue/10 hover:bg-transparent">
                    <TableHead className="text-neon-blue font-bold uppercase tracking-wider text-xs">Usuário</TableHead>
                    <TableHead className="text-neon-blue font-bold uppercase tracking-wider text-xs">Endereço IP</TableHead>
                    <TableHead className="text-neon-blue font-bold uppercase tracking-wider text-xs">Data e Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="border-neon-blue/5 hover:bg-neon-blue/5 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground group-hover:text-neon-blue transition-colors" />
                          <span className="font-bold text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            {log.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground group-hover:text-neon-green transition-colors" />
                          <code className="text-xs bg-black/50 px-2 py-1 rounded border border-white/5 text-neon-green font-mono">
                            {log.ipAddress}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {format(new Date(log.createdAt), "dd 'de' MMMM 'às' HH:mm:ss", { locale: ptBR })}
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
