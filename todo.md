# AUTH PROXY - TODO

## Backend
- [x] Schema: tabela `local_users` (admin + revendedores) com campos: id, username, password_hash, role, credits
- [x] Schema: tabela `generated_keys` para histórico local de keys geradas
- [x] Migration SQL aplicada via script
- [x] Auth local: login com username/password (bcrypt), JWT session
- [x] Seed: criar admin padrão (Ruan/Ruan00) no banco
- [x] Router: auth.localLogin, auth.localLogout, auth.me
- [x] Router: keys.generate (chama API externa, desconta créditos do revendedor)
- [x] Router: keys.check (chama API externa)
- [x] Router: keys.updateIp (chama API externa)
- [x] Router: keys.delete (chama API externa)
- [x] Router: users.create (somente admin)
- [x] Router: users.list (somente admin)
- [x] Router: users.getCredits (revendedor vê seus próprios créditos)
- [x] Router: dashboard.stats (total keys ativas, expiradas, revendedores, créditos)

## Frontend
- [x] Tema cyberpunk/neon: dark bg, cores neon (azul #00d4ff, roxo #9d4edd, verde #00ff88)
- [x] Fonte tech: Orbitron + Rajdhani + Share Tech Mono via Google Fonts
- [x] Página de Login (rota pública)
- [x] PanelLayout com sidebar lateral e logo AUTH PROXY
- [x] Página Dashboard: stats cards (keys ativas, expiradas, revendedores, créditos)
- [x] Página Criar Key: seletor de duração (1/3/7/30 dias), quantidade, exibir resultado + botão copiar
- [x] Página Checar Key: input de key, exibir status/validade/IP
- [x] Página Atualizar IP: inputs de key + novo IP
- [x] Página Deletar Key: input de key, modal de confirmação obrigatória
- [x] Página Criar Usuário: somente admin, form com username/senha/créditos
- [x] Proteção de rotas: redirecionar para login se não autenticado
- [x] Proteção de rota Criar Usuário: bloquear revendedores

## Testes
- [x] Teste de autenticação local
- [x] Teste de criação de usuário (admin only)
- [x] Teste de desconto de créditos
