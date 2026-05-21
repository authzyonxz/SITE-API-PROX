import { useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { UserPlus, Loader2, Users, Zap, Eye, EyeOff, CheckCircle, Coins, Trash2, Minus, KeyRound, Lock, Monitor, LogOut, RefreshCcw, ShieldCheck, Sparkles, UserCog, Smartphone, BadgeCheck } from "lucide-react";

function ActionButton({
  title,
  icon,
  tone,
  onClick,
  disabled,
}: {
  title: string;
  icon: ReactNode;
  tone: "emerald" | "rose" | "cyan" | "purple" | "amber";
  onClick: () => void;
  disabled?: boolean;
}) {
  const tones = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2.5 rounded-2xl border transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${tones[tone]}`}
    >
      {icon}
    </button>
  );
}

export default function CriarUsuario() {
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credits, setCredits] = useState(0);
  const [lastCreated, setLastCreated] = useState<{ username: string; credits: number } | null>(null);

  const { data: userList, isLoading: loadingUsers } = trpc.users.list.useQuery();
  const resellers = userList?.filter((u) => u.role === "reseller") ?? [];
  const totalCredits = resellers.reduce((sum, reseller) => sum + reseller.credits, 0);

  const createMutation = trpc.users.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Revendedor "${data.username}" criado com sucesso!`);
      setLastCreated({ username: data.username, credits: data.credits });
      setUsername("");
      setPassword("");
      setCredits(0);
      utils.users.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao criar usuário");
    },
  });

  const addCreditsMutation = trpc.users.addCredits.useMutation({
    onSuccess: () => {
      toast.success("Créditos adicionados!");
      utils.users.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const removeCreditsMutation = trpc.users.removeCredits.useMutation({
    onSuccess: () => {
      toast.success("Créditos removidos!");
      utils.users.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteUserMutation = trpc.users.delete.useMutation({
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso!");
      utils.users.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => toast.error(err.message || "Erro ao excluir usuário"),
  });

  const deleteAllKeysMutation = trpc.users.deleteAllKeys.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} keys foram excluídas com sucesso!`);
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => toast.error(err.message || "Erro ao excluir keys"),
  });

  const changePasswordMutation = trpc.users.changePassword.useMutation({
    onSuccess: () => toast.success("Senha alterada com sucesso!"),
    onError: (err) => toast.error(err.message),
  });

  const updateMaxDevicesMutation = trpc.users.updateMaxDevices.useMutation({
    onSuccess: () => {
      toast.success("Limite de dispositivos atualizado!");
      utils.users.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const resetSessionMutation = trpc.users.resetSession.useMutation({
    onSuccess: () => toast.success("Sessão do usuário encerrada!"),
    onError: (err) => toast.error(err.message),
  });

  const resetDeviceMutation = trpc.users.resetDevice.useMutation({
    onSuccess: () => {
      toast.success("Dispositivo resetado com sucesso!");
      utils.users.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const resetAllSessionsMutation = trpc.users.resetAllSessions.useMutation({
    onSuccess: () => toast.success("TODAS as sessões foram encerradas!"),
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!username.trim()) { toast.error("Digite o nome de usuário"); return; }
    if (!password.trim()) { toast.error("Digite a senha"); return; }
    if (username.length < 3) { toast.error("Nome de usuário deve ter pelo menos 3 caracteres"); return; }
    createMutation.mutate({ username: username.trim(), password, credits });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-300 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> central de revendedores
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Criar <span className="text-purple-400">Usuário</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mt-2">
              Cadastre revendedores, distribua créditos e gerencie sessões em uma interface alinhada ao painel premium.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm("Deseja realmente desconectar TODOS os usuários do sistema? Eles precisarão logar novamente.")) {
              resetAllSessionsMutation.mutate();
            }
          }}
          disabled={resetAllSessionsMutation.isPending}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-xs font-bold tracking-widest uppercase transition-all hover:bg-rose-500/10 hover:border-rose-500/20 disabled:opacity-50"
        >
          {resetAllSessionsMutation.isPending ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          Limpar Todas as Sessões
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Revendedores</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{resellers.length}</h3>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-purple-500/10 blur-3xl rounded-full" />
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Créditos em circulação</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{totalCredits}</h3>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-emerald-500/10 blur-3xl rounded-full" />
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Status</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">Online</h3>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-cyan-500/10 blur-3xl rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-8">
        <section className="glass-card p-8 rounded-3xl space-y-6 h-fit xl:sticky xl:top-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Novo revendedor</h3>
              <p className="text-sm text-slate-500">Preencha os dados de acesso.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-2">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário"
                className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all bg-white/[0.03] border border-white/10 focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/10 text-white placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl outline-none transition-all bg-white/[0.03] border border-white/10 focus:border-purple-400/40 focus:ring-4 focus:ring-purple-400/10 text-white placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-500 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-2">Créditos iniciais</label>
              <div className="space-y-3">
                <input
                  type="number"
                  min={0}
                  value={credits}
                  onChange={(e) => setCredits(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all bg-white/[0.03] border border-white/10 focus:border-emerald-400/40 focus:ring-4 focus:ring-emerald-400/10 text-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  {[10, 30, 100].map((value) => (
                    <button
                      key={value}
                      onClick={() => setCredits(value)}
                      className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all border ${credits === value ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="w-full py-4 rounded-2xl font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white shadow-2xl shadow-purple-500/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Criando...</> : <><UserPlus className="w-5 h-5" /> Criar Revendedor</>}
          </button>

          {lastCreated && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-300 mt-0.5" />
              <span className="text-sm text-emerald-200">
                <strong>{lastCreated.username}</strong> criado com {lastCreated.credits} créditos.
              </span>
            </div>
          )}
        </section>

        <section className="glass-card rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
                <UserCog className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Revendedores cadastrados</h3>
                <p className="text-sm text-slate-500">Ações rápidas redesenhadas em botões compactos.</p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {resellers.length} registros
            </div>
          </div>

          <div className="overflow-y-auto max-h-[640px] custom-scrollbar">
            {loadingUsers ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 rounded-3xl animate-pulse bg-white/[0.03] border border-white/5" />
                ))}
              </div>
            ) : resellers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                <p className="text-sm text-slate-500">Nenhum revendedor cadastrado.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {resellers.map((user) => (
                  <div key={user.id} className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.035] transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20">
                          {user.username[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-bold text-white truncate">{user.username}</p>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                              <BadgeCheck className="w-3 h-3" /> revendedor
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                              <Zap className={`w-3.5 h-3.5 ${user.credits > 0 ? "text-emerald-300" : "text-rose-300"}`} />
                              <span><strong className="text-white">{user.credits}</strong> créditos</span>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs text-slate-500 min-w-0">
                              <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{user.deviceId ? user.deviceId : "sem vínculo de dispositivo"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <ActionButton
                          title="Adicionar créditos"
                          tone="emerald"
                          icon={<Coins className="w-4 h-4" />}
                          onClick={() => {
                            const amount = parseInt(prompt(`Adicionar créditos para ${user.username}:`) || "0");
                            if (amount > 0) addCreditsMutation.mutate({ userId: user.id, amount });
                          }}
                        />
                        <ActionButton
                          title="Remover créditos"
                          tone="rose"
                          icon={<Minus className="w-4 h-4" />}
                          onClick={() => {
                            const amount = parseInt(prompt(`Remover créditos de ${user.username}:`) || "0");
                            if (amount > 0) removeCreditsMutation.mutate({ userId: user.id, amount });
                          }}
                        />
                        <ActionButton
                          title="Mudar senha"
                          tone="cyan"
                          icon={<Lock className="w-4 h-4" />}
                          onClick={() => {
                            const newPass = prompt(`Nova senha para ${user.username}:`);
                            if (newPass && newPass.length >= 4) {
                              changePasswordMutation.mutate({ userId: user.id, newPassword: newPass });
                            } else if (newPass) {
                              toast.error("A senha deve ter pelo menos 4 caracteres");
                            }
                          }}
                        />
                        <ActionButton
                          title="Limite de dispositivos"
                          tone="emerald"
                          icon={<Zap className="w-4 h-4" />}
                          onClick={() => {
                            const limit = parseInt(prompt(`Limite de Dispositivos para ${user.username}:`, (user as any).maxDevices?.toString() || "1") || "0");
                            if (limit > 0) updateMaxDevicesMutation.mutate({ userId: user.id, maxDevices: limit });
                          }}
                        />
                        <ActionButton
                          title="Encerrar sessões"
                          tone="purple"
                          icon={<LogOut className="w-4 h-4" />}
                          onClick={() => {
                            if (confirm(`Desconectar ${user.username} de todos os dispositivos?`)) {
                              resetSessionMutation.mutate({ userId: user.id });
                            }
                          }}
                        />
                        <ActionButton
                          title="Resetar dispositivo"
                          tone="cyan"
                          icon={<Monitor className="w-4 h-4" />}
                          onClick={() => {
                            if (confirm(`Resetar o vínculo de dispositivo de ${user.username}? Isso permitirá que ele logue de um novo aparelho.`)) {
                              resetDeviceMutation.mutate({ userId: user.id });
                            }
                          }}
                        />
                        <ActionButton
                          title="Excluir todas as keys deste usuário"
                          tone="amber"
                          disabled={deleteAllKeysMutation.isPending}
                          icon={<KeyRound className="w-4 h-4" />}
                          onClick={() => {
                            if (confirm(`AVISO: Isso excluirá TODAS as keys ativas criadas por ${user.username}. Deseja continuar?`)) {
                              deleteAllKeysMutation.mutate({ userId: user.id });
                            }
                          }}
                        />
                        <ActionButton
                          title="Excluir usuário"
                          tone="rose"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja excluir ${user.username}?`)) {
                              deleteUserMutation.mutate({ userId: user.id });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
